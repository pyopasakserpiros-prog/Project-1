/**
 * =============================================================================
 * js/battle.js — Jianghu RPG
 * Battle System Module
 * =============================================================================
 *
 * รับผิดชอบ: จัดการการต่อสู้ทั้งหมด ตั้งแต่เริ่มต้นจนจบ
 *            รวมถึงการโจมตีปกติ, การใช้สกิล, การใช้ไอเทม,
 *            การคำนวณดาเมจ, การตรวจจับชัยชนะ/แพ้,
 *            และการประมวลผลรางวัล (EXP, Gold, Drop)
 *
 * อ้างอิง: Jianghu RPG — Game Bible v1.0 (Source of Truth)
 *   - Section 2:  Character System (EXP)
 *   - Section 7:  Enemy System (Types, Stats, Drops)
 *   - Section 11: Economy System (Gold)
 *   - Section 12: Battle System (Formulas, Turn Order, Hit, Crit, Damage)
 *
 * ไม่รับผิดชอบ: UI, การเคลื่อนที่บนแผนที่, การจัดการคลังภายนอก,
 *               การสร้างไอเทม (ใช้ drop table.js และ inventory.js)
 * =============================================================================
 */

"use strict";

// =============================================================================
// SECTION A: IMPORTS
// =============================================================================

import { PlayerModule } from './player.js';
import { InventoryModule } from './inventory.js';
import { EquipmentModule } from './equipment edit.js';
import { SkillDatabase } from './skill database.js';
import { EnemyDatabase } from './enemy.js';
import { BossDatabase } from './boss database.js';
import miniBossDatabase from './mini_boss.js';
import { DropTable } from './drop table.js';

// =============================================================================
// SECTION B: CONSTANTS (อิงจาก Game Bible)
// =============================================================================

const BATTLE_CONSTANTS = Object.freeze({
    // Hit & Miss (Sec 12.3)
    MIN_HIT_CHANCE: 10, // % เสมอ

    // Stat Caps (Sec 5.2) - ใช้สำหรับป้องกัน Overflow
    STAT_CAPS: Object.freeze({
        crit: 75,
        crit_damage: 400,
        dodge: 70,
        accuracy: 110,
        armor_pen: 75,
        life_steal: 40,
        mana_steal: 20,
        kill_chance: 8,
    }),

    // EXP Formula (Sec 2.1)
    EXP_BASE: 100,
    EXP_EXPONENT: 1.8,

    // Enemy Type EXP Multipliers (สมมติตาม Sec 7.1 เพื่อความสมดุล)
    EXP_MULTIPLIERS: Object.freeze({
        Normal: 5,
        Elite: 15,
        'Mini-Boss': 50,
        'Area Boss': 200,
    }),

    // Enemy Type Gold Base (Sec 11.2)
    GOLD_MULTIPLIERS: Object.freeze({
        Normal: { min: 3, max: 8 },
        Elite: { min: 15, max: 25 },
        'Mini-Boss': { min: 50, max: 80 },
        'Area Boss': { min: 200, max: 500 },
    }),
});

// =============================================================================
// SECTION C: UTILITY HELPERS
// =============================================================================

/**
 * แปลงค่า Range String (เช่น "50–150") เป็นตัวเลข (ใช้ค่าเฉลี่ย)
 * @param {string} str
 * @returns {number}
 */
function parseRangeToAverage(str) {
    if (typeof str !== 'string') return Number(str) || 0;
    const cleaned = str.replace(/–/g, '-').replace(/,/g, '');
    const parts = cleaned.split('-').map(s => parseFloat(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return Math.floor((parts[0] + parts[1]) / 2);
    }
    return parseFloat(cleaned) || 0;
}

/**
 * แปลงค่า Range String เป็น { min, max }
 * @param {string} str
 * @returns {{ min: number, max: number }}
 */
function parseRangeToMinMax(str) {
    if (typeof str !== 'string') {
        const num = Number(str) || 0;
        return { min: num, max: num };
    }
    const cleaned = str.replace(/–/g, '-').replace(/,/g, '');
    const parts = cleaned.split('-').map(s => parseFloat(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return { min: parts[0], max: parts[1] };
    }
    const num = parseFloat(cleaned) || 0;
    return { min: num, max: num };
}

/**
 * สุ่มตัวเลขในช่วง [min, max]
 */
function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * ดึงค่าสเตตัสของศัตรู โดยแปลงจาก String หรือ Number
 */
function getEnemyStat(enemy, key) {
    const val = enemy[key];
    if (typeof val === 'string' && val.includes('–')) {
        return parseRangeToAverage(val);
    }
    return Number(val) || 0;
}

/**
 * ดึงค่า Gold Reward จาก String (เช่น "4000-10000")
 */
function parseGoldReward(goldStr) {
    const { min, max } = parseRangeToMinMax(goldStr);
    return randomInRange(min, max);
}

// =============================================================================
// SECTION D: SKILL PARSING
// =============================================================================

/**
 * ดึงข้อมูล Meta ของสกิล (MP Cost, Cooldown, Damage %, Stat Type)
 * @param {string} effectText
 * @returns {{ mpCost: number, cooldown: number, damagePercent: number, statType: string }}
 */
function parseSkillMeta(effectText) {
    let mpCost = 0;
    let cooldown = 0;
    let damagePercent = 0;
    let statType = 'ATK';

    // MP Cost
    const mpMatch = effectText.match(/MP Cost:\s*(\d+)/i);
    if (mpMatch) mpCost = parseInt(mpMatch[1], 10);

    // Cooldown
    const cdMatch = effectText.match(/CD:\s*(\d+)/i);
    if (cdMatch) cooldown = parseInt(cdMatch[1], 10);

    // Damage Percent & Stat Type
    const dmgMatch = effectText.match(/(\d+)%\s*ของ\s*(ATK|INT)/i);
    if (dmgMatch) {
        damagePercent = parseInt(dmgMatch[1], 10);
        statType = dmgMatch[2].toUpperCase();
    }

    return { mpCost, cooldown, damagePercent, statType };
}

/**
 * ตรวจสอบว่าสกิลเป็นประเภทใด (Physical, Internal, Poison, Heal, Support)
 */
function getSkillTags(effectText) {
    const tags = [];
    if (effectText.includes('[Physical]')) tags.push('Physical');
    if (effectText.includes('[Internal]')) tags.push('Internal');
    if (effectText.includes('[Poison]')) tags.push('Poison');
    if (effectText.includes('[Heal]')) tags.push('Heal');
    if (effectText.includes('[Support]')) tags.push('Support');
    return tags;
}

// =============================================================================
// SECTION E: COMBATANT FACTORY
// =============================================================================

/**
 * สร้าง Combatant Object สำหรับใช้ในระบบต่อสู้
 * @param {string} type - "player" | "follower" | "enemy" | "boss"
 * @param {Object} source - ข้อมูลต้นฉบับ (player, follower, enemy, boss)
 * @param {Object} options - ตัวเลือกเพิ่มเติม
 * @returns {Object}
 */
function createCombatant(type, source, options = {}) {
    const base = {
        id: source.id || `combatant_${Date.now()}_${Math.random()}`,
        name: source.name || 'Unknown',
        type: type,
        isPlayer: type === 'player' || type === 'follower',
        isEnemy: type === 'enemy' || type === 'boss' || type === 'mini_boss',
        isBoss: type === 'boss' || type === 'mini_boss',
        // Stats
        level: source.level || 1,
        hp: 0,
        hp_max: 0,
        mp: 0,
        mp_max: 0,
        atk: 0,
        def: 0,
        agi: 0,
        str: 0,
        con: 0,
        int: 0,
        luck: 0,
        crit: 0,
        crit_damage: 0,
        dodge: 0,
        accuracy: 0,
        armor_pen: 0,
        life_steal: 0,
        mana_steal: 0,
        kill_chance: 0,
        // Skills
        skills: {
            active: [],
            passive: [],
        },
        // Status
        isAlive: true,
        cooldowns: {}, // skillId -> turns remaining
        buffs: [], // สำหรับ Extension ในอนาคต
        debuffs: [],
        // Reference
        sourceRef: source,
        // Combat Style (สำหรับ Enemy AI)
        combatStyle: options.combatStyle || 'Melee',
        // Special
        isBoss: type === 'boss' || type === 'mini_boss',
        immuneToKillChance: options.immuneToKillChance || false,
        specialPhase: options.specialPhase || null,
        phaseTriggered: false,
        // Drop
        dropTableId: options.dropTableId || null,
        goldReward: options.goldReward || null,
        uniqueDrops: options.uniqueDrops || [],
    };

    // Populate stats based on source type
    if (type === 'player') {
        // Player stats are already in combat_stats
        const cs = source.combat_stats;
        const st = source.stats;
        base.hp = cs.hp;
        base.hp_max = cs.hp_max;
        base.mp = cs.mp;
        base.mp_max = cs.mp_max;
        base.atk = cs.atk || 0;
        base.def = cs.def || 0;
        base.agi = cs.agi || st.agi || 0;
        base.str = st.str || 0;
        base.con = st.con || 0;
        base.int = st.int || 0;
        base.luck = st.luck || 0;
        base.crit = cs.crit || 0;
        base.crit_damage = cs.crit_damage || 150;
        base.dodge = cs.dodge || 0;
        base.accuracy = cs.accuracy || 90;
        base.armor_pen = cs.armor_pen || 0;
        base.life_steal = cs.life_steal || 0;
        base.mana_steal = cs.mana_steal || 0;
        base.kill_chance = cs.kill_chance || 0;

        // Skills from player
        if (source.skills) {
            base.skills.active = (source.skills.active || []).map(id => {
                return SkillDatabase.find(s => s.id === id);
            }).filter(Boolean);
            base.skills.passive = (source.skills.passive || []).map(id => {
                return SkillDatabase.find(s => s.id === id);
            }).filter(Boolean);
        }
        base.combatStyle = 'Player';
    }

    if (type === 'follower') {
        // Follower stats (currently only base stats + level, assuming simplified for battle)
        // Actually we just use the stats provided, but we need to map them.
        // Since follower structure might vary, we use source.combat_stats if available.
        const st = source.stats || {};
        const cs = source.combat_stats || {};
        // For followers, we assume they have stats like player, but simplified.
        // We'll derive from primary stats if combat_stats missing.
        base.level = source.level || 1;
        base.str = st.str || 5;
        base.con = st.con || 5;
        base.agi = st.agi || 5;
        base.int = st.int || 5;
        base.luck = st.luck || 5;

        // Calculate combat stats from primary if not provided
        base.hp_max = cs.hp_max || (base.con * 10 + base.level * 5);
        base.mp_max = cs.mp_max || (base.int * 8 + base.level * 3);
        base.hp = cs.hp || base.hp_max;
        base.mp = cs.mp || base.mp_max;
        base.atk = cs.atk || (base.str * 2.5);
        base.def = cs.def || (base.con * 0.5);
        base.agi = cs.agi || base.agi;
        base.crit = cs.crit || (5 + base.agi * 0.15 + base.luck * 0.1);
        base.crit_damage = cs.crit_damage || 150;
        base.dodge = cs.dodge || (base.agi * 0.3);
        base.accuracy = cs.accuracy || (90 + base.agi * 0.2);
        base.armor_pen = cs.armor_pen || 0;
        base.life_steal = cs.life_steal || 0;
        base.mana_steal = cs.mana_steal || 0;
        base.kill_chance = cs.kill_chance || 0;

        // Skills from follower
        if (source.skills) {
            base.skills.active = (source.skills.active || []).map(id => {
                return SkillDatabase.find(s => s.id === id);
            }).filter(Boolean);
            base.skills.passive = (source.skills.passive || []).map(id => {
                return SkillDatabase.find(s => s.id === id);
            }).filter(Boolean);
        }
        base.combatStyle = 'Follower';
    }

    if (type === 'enemy' || type === 'boss' || type === 'mini_boss') {
        base.level = Number(source.level) || 1;
        base.hp_max = getEnemyStat(source, 'hp');
        base.hp = base.hp_max;
        base.mp_max = getEnemyStat(source, 'mp') || 0;
        base.mp = base.mp_max;
        base.atk = getEnemyStat(source, 'atk');
        base.def = getEnemyStat(source, 'def');
        base.agi = getEnemyStat(source, 'agi');
        base.str = 0;
        base.con = 0;
        base.int = 0;
        base.luck = 0;
        base.crit = 5; // Default base crit for enemies
        base.crit_damage = 150;
        base.dodge = 0;
        base.accuracy = 90;
        base.armor_pen = 0;
        base.life_steal = 0;
        base.mana_steal = 0;
        base.kill_chance = 0;

        // Combat Style
        base.combatStyle = source.combatStyle || source.style || 'Melee';

        // Boss specific
        if (type === 'boss') {
            base.immuneToKillChance = source.immunity ? source.immunity.includes('KILL_CHANCE') : true;
            base.specialPhase = source.specialPhase || null;
            base.goldReward = source.goldReward || null;
            base.uniqueDrops = source.uniqueDrops || [];
            base.dropTableId = null; // Bosses use unique drops
        }
        if (type === 'mini_boss') {
            base.immuneToKillChance = true;
            base.specialPhase = null;
            base.goldReward = source.goldReward || null;
            base.uniqueDrops = source.uniqueDrops || [];
            base.dropTableId = null;
        }

        // Enemy Skills - Select from SkillDatabase based on combat style
        if (!source.skills) {
            base.skills.active = selectSkillsForCombatStyle(base.combatStyle, base.level);
            base.skills.passive = [];
        } else {
            // If skills are explicitly defined, use them (parse ids to objects)
            base.skills.active = (source.skills || []).map(id => {
                return SkillDatabase.find(s => s.id === id);
            }).filter(Boolean);
            base.skills.passive = [];
        }

        // Drop info for enemies
        if (type === 'enemy') {
            base.dropTableId = source["Drop Table"] || null;
            base.goldReward = null; // Use formula for normal enemies
        }
    }

    // Apply Passive Skills (for all combatants)
    applyPassiveSkills(base);

    return base;
}

// =============================================================================
// SECTION F: SKILL SELECTION FOR ENEMIES
// =============================================================================

/**
 * เลือกสกิลให้ศัตรูตาม Combat Style
 * @param {string} style
 * @param {number} level
 * @returns {Array}
 */
function selectSkillsForCombatStyle(style, level) {
    const styleMap = {
        'Melee': ['Physical'],
        'Fire': ['Internal', 'ไฟ', 'เพลิง', 'ลาวา'],
        'Ice': ['Internal', 'น้ำแข็ง', 'เหมันต์', 'หิมะ'],
        'Lightning': ['Internal', 'สายฟ้า', 'ฟ้าผ่า', 'อัสนี'],
        'Poison': ['Poison', 'พิษ'],
        'Dark': ['Internal', 'มาร', 'วิญญาณ', 'โลหิต', 'เงา'],
        'Holy': ['Internal', 'เทพ', 'สวรรค์', 'ศักดิ์สิทธิ์'],
        'Magic': ['Internal'],
        'Support': ['Support', 'Heal'],
    };

    const keywords = styleMap[style] || ['Physical'];

    // Filter skills that match any keyword (case insensitive)
    // Also prefer skills with rarity based on level
    const candidates = SkillDatabase.filter(skill => {
        if (skill.type !== 'Active') return false;
        const text = skill.effect + skill.name;
        return keywords.some(kw => text.includes(kw));
    });

    // Sort by rarity (descending) and level requirement (if any)
    const rarityOrder = { 'ขาว': 0, 'เขียว': 1, 'ฟ้า': 2, 'ม่วง': 3, 'ทอง': 4, 'แดง': 5 };
    candidates.sort((a, b) => (rarityOrder[b.level] || 0) - (rarityOrder[a.level] || 0));

    // Select up to 3 skills, prioritizing higher rarity, but limit by level
    const maxLevel = Math.min(level, 60);
    const selected = [];
    for (const skill of candidates) {
        if (selected.length >= 3) break;
        const skillLevel = parseInt(skill.id) % 10 || 1; // Rough mapping
        if (skillLevel <= maxLevel + 10) {
            selected.push(skill);
        }
    }

    // If no skills found, use a default attack skill (id 1)
    if (selected.length === 0) {
        const defaultSkill = SkillDatabase.find(s => s.id === 1);
        if (defaultSkill) selected.push(defaultSkill);
    }

    return selected;
}

// =============================================================================
// SECTION G: PASSIVE SKILL APPLICATION
// =============================================================================

/**
 * แปลง Effect ของ Passive Skill และปรับค่า Stat ให้ Combatant
 * @param {Object} combatant
 */
function applyPassiveSkills(combatant) {
    if (!combatant.skills || !combatant.skills.passive) return;

    for (const skill of combatant.skills.passive) {
        if (!skill || skill.type !== 'Passive') continue;
        const effect = skill.effect;

        // Stat increases
        const statMatches = effect.match(/เพิ่ม\s*(\w+)\s*([+-]?\d+)/g);
        if (statMatches) {
            for (const match of statMatches) {
                const parts = match.match(/เพิ่ม\s*(\w+)\s*([+-]?\d+)/);
                if (!parts) continue;
                const statName = parts[1];
                const value = parseInt(parts[2], 10);
                if (isNaN(value)) continue;

                // Map to combatant stats
                const statMap = {
                    'STR': 'str',
                    'CON': 'con',
                    'AGI': 'agi',
                    'INT': 'int',
                    'LUCK': 'luck',
                    'ATK': 'atk',
                    'DEF': 'def',
                    'HP': 'hp_max',
                    'MP': 'mp_max',
                    'CRIT': 'crit',
                    'CRIT_DAMAGE': 'crit_damage',
                    'DODGE': 'dodge',
                    'ACCURACY': 'accuracy',
                    'ARMOR_PEN': 'armor_pen',
                    'LIFE_STEAL': 'life_steal',
                    'MANA_STEAL': 'mana_steal',
                    'KILL_CHANCE': 'kill_chance',
                };
                const targetKey = statMap[statName];
                if (targetKey) {
                    if (typeof combatant[targetKey] === 'number') {
                        combatant[targetKey] += value;
                    }
                }
            }
        }

        // Special effects (e.g., +X% to something) - simple parsing
        const percentMatches = effect.match(/เพิ่ม\s*(\w+)\s*([+-]?\d+)%/g);
        if (percentMatches) {
            for (const match of percentMatches) {
                const parts = match.match(/เพิ่ม\s*(\w+)\s*([+-]?\d+)%/);
                if (!parts) continue;
                const statName = parts[1];
                const value = parseInt(parts[2], 10);
                if (isNaN(value)) continue;
                const statMap = {
                    'CRIT': 'crit',
                    'DODGE': 'dodge',
                    'ACCURACY': 'accuracy',
                    'LIFE_STEAL': 'life_steal',
                    'MANA_STEAL': 'mana_steal',
                    'KILL_CHANCE': 'kill_chance',
                    'ARMOR_PEN': 'armor_pen',
                    'CRIT_DAMAGE': 'crit_damage',
                };
                const targetKey = statMap[statName];
                if (targetKey && typeof combatant[targetKey] === 'number') {
                    combatant[targetKey] += value;
                }
            }
        }

        // Special conditional effects are not applied here, they will be handled in battle loop if needed.
    }

    // Ensure stats are within caps (Sec 5.2)
    const caps = BATTLE_CONSTANTS.STAT_CAPS;
    combatant.crit = Math.min(combatant.crit || 0, caps.crit);
    combatant.crit_damage = Math.min(combatant.crit_damage || 0, caps.crit_damage);
    combatant.dodge = Math.min(combatant.dodge || 0, caps.dodge);
    combatant.accuracy = Math.min(combatant.accuracy || 0, caps.accuracy);
    combatant.armor_pen = Math.min(combatant.armor_pen || 0, caps.armor_pen);
    combatant.life_steal = Math.min(combatant.life_steal || 0, caps.life_steal);
    combatant.mana_steal = Math.min(combatant.mana_steal || 0, caps.mana_steal);
    combatant.kill_chance = Math.min(combatant.kill_chance || 0, caps.kill_chance);
}

// =============================================================================
// SECTION H: DAMAGE & COMBAT FORMULAS (Game Bible Sec 12)
// =============================================================================

/**
 * ตรวจสอบการ Hit (Sec 12.3)
 * @param {Object} attacker
 * @param {Object} defender
 * @returns {boolean}
 */
function checkHit(attacker, defender) {
    const threshold = 100 - attacker.accuracy + defender.dodge;
    const roll = Math.random() * 100;
    // Min hit chance 10%
    return roll > Math.min(threshold, 90);
}

/**
 * ตรวจสอบ Critical (Sec 12.4)
 * @param {Object} attacker
 * @returns {boolean}
 */
function checkCrit(attacker) {
    const critChance = Math.min(attacker.crit || 0, BATTLE_CONSTANTS.STAT_CAPS.crit);
    return Math.random() * 100 <= critChance;
}

/**
 * คำนวณ Damage (Sec 12.5)
 * @param {Object} attacker
 * @param {Object} defender
 * @param {Object} skill - Skill object (null for auto attack)
 * @returns {number} damage
 */
function calculateDamage(attacker, defender, skill = null) {
    let raw = 0;
    let isPhysical = true;

    if (skill) {
        const tags = getSkillTags(skill.effect);
        isPhysical = tags.includes('Physical');
        const meta = parseSkillMeta(skill.effect);
        const percent = meta.damagePercent || 100;
        const statType = meta.statType || 'ATK';

        if (isPhysical) {
            const baseAtk = attacker.atk || 0;
            const strBonus = (attacker.str || 0) * 0.005;
            raw = baseAtk * (1 + strBonus) * (percent / 100);
        } else {
            // Internal / Magic
            const baseInt = attacker.int || 0;
            const intBonus = baseInt * 0.006;
            // Skill base value is derived from percent of INT or fixed? Let's treat it as scaled.
            // For skills like "120% ของ INT", we use that directly.
            raw = (percent / 100) * (attacker.int || 0) * (1 + intBonus);
        }
    } else {
        // Auto Attack (Physical)
        isPhysical = true;
        const baseAtk = attacker.atk || 0;
        const strBonus = (attacker.str || 0) * 0.005;
        raw = baseAtk * (1 + strBonus);
    }

    // Effective DEF
    const armorPen = Math.min(attacker.armor_pen || 0, BATTLE_CONSTANTS.STAT_CAPS.armor_pen);
    const effectiveDef = defender.def || 0 * (1 - armorPen / 100);

    let finalDamage = 0;
    if (isPhysical) {
        finalDamage = Math.max(1, raw - effectiveDef);
    } else {
        // Internal skill ignores 50% of DEF (Sec 12.5)
        finalDamage = Math.max(1, raw - effectiveDef * 0.5);
    }

    // Critical Hit (Sec 12.4)
    if (checkCrit(attacker)) {
        const critDmg = Math.min(attacker.crit_damage || 150, BATTLE_CONSTANTS.STAT_CAPS.crit_damage);
        finalDamage = finalDamage * (critDmg / 100);
    }

    return Math.floor(finalDamage);
}

/**
 * ตรวจสอบ Kill Chance (Sec 12.7)
 * @param {Object} attacker
 * @param {Object} defender
 * @returns {boolean}
 */
function checkKillChance(attacker, defender) {
    if (defender.immuneToKillChance) return false;
    const killChance = Math.min(attacker.kill_chance || 0, BATTLE_CONSTANTS.STAT_CAPS.kill_chance);
    return Math.random() * 100 <= killChance;
}

// =============================================================================
// SECTION I: BATTLE STATE MANAGEMENT
// =============================================================================

/**
 * สร้าง Battle State เริ่มต้น
 * @param {Object} player - Player object
 * @param {Object} enemySource - Enemy data (from EnemyDatabase, BossDatabase, or miniBossDatabase)
 * @param {string} enemyType - "normal" | "elite" | "mini_boss" | "area_boss"
 * @returns {Object} battleState
 */
function createBattleState(player, enemySource, enemyType) {
    const playerCombatant = createCombatant('player', player);

    // Followers
    const followers = (player.followers || [])
        .filter(f => f.is_active !== false)
        .map(f => createCombatant('follower', f));

    // Enemy
    const isBoss = enemyType === 'area_boss' || enemyType === 'mini_boss';
    const typeMap = {
        'normal': 'enemy',
        'elite': 'enemy',
        'mini_boss': 'mini_boss',
        'area_boss': 'boss',
    };
    const combatType = typeMap[enemyType] || 'enemy';

    let enemyCombatant;
    if (combatType === 'boss' || combatType === 'mini_boss') {
        enemyCombatant = createCombatant(combatType, enemySource, {
            combatStyle: enemySource.combatStyle || enemySource.style || 'Melee',
            immuneToKillChance: enemySource.immunity ? enemySource.immunity.includes('KILL_CHANCE') : true,
            specialPhase: enemySource.specialPhase || null,
            goldReward: enemySource.goldReward || null,
            uniqueDrops: enemySource.uniqueDrops || [],
            dropTableId: null,
        });
    } else {
        enemyCombatant = createCombatant('enemy', enemySource, {
            combatStyle: enemySource.combatStyle || 'Melee',
            dropTableId: enemySource["Drop Table"] || null,
        });
    }

    // Combine all combatants
    const playerSide = [playerCombatant, ...followers];
    const enemySide = [enemyCombatant];

    // Turn Order (Sec 12.2)
    const allCombatants = [...playerSide, ...enemySide];
    allCombatants.sort((a, b) => {
        if (a.agi === b.agi) return a.isPlayer ? -1 : 1;
        return b.agi - a.agi;
    });

    const state = {
        player: playerCombatant,
        followers: followers,
        enemies: enemySide,
        allCombatants: allCombatants,
        turnOrder: allCombatants.map(c => c.id),
        turnIndex: 0,
        logs: [],
        state: 'ongoing', // 'ongoing', 'victory', 'defeat'
        turn: 0,
        rewards: {
            exp: 0,
            gold: 0,
            drops: [],
        },
        // References
        playerRef: player,
        enemySource: enemySource,
        enemyType: enemyType,
    };

    return state;
}

// =============================================================================
// SECTION J: BATTLE ACTIONS
// =============================================================================

/**
 * ดำเนินการโจมตีปกติ
 * @param {Object} state
 * @param {Object} attacker
 * @param {Object} defender
 * @param {string} logPrefix
 */
function executeAutoAttack(state, attacker, defender, logPrefix = '') {
    const log = state.logs;

    // Hit check
    if (!checkHit(attacker, defender)) {
        log.push(`${attacker.name} ${logPrefix}โจมตี ${defender.name} แต่พลาด!`);
        return;
    }

    // Kill Chance check (Sec 12.7)
    if (checkKillChance(attacker, defender)) {
        defender.hp = 0;
        defender.isAlive = false;
        log.push(`${attacker.name} ${logPrefix}ใช้พลังสังหารทันที! ${defender.name} ถูกกำจัดทันที!`);
        return;
    }

    // Calculate damage
    const damage = calculateDamage(attacker, defender, null);

    // Apply damage
    defender.hp = Math.max(0, defender.hp - damage);
    if (defender.hp <= 0) {
        defender.isAlive = false;
        log.push(`${attacker.name} ${logPrefix}โจมตี ${defender.name} สร้างความเสียหาย ${damage} และสังหารสำเร็จ!`);
    } else {
        log.push(`${attacker.name} ${logPrefix}โจมตี ${defender.name} สร้างความเสียหาย ${damage} (HP เหลือ ${defender.hp}/${defender.hp_max})`);
    }

    // Life Steal (Sec 12.6)
    if (attacker.life_steal > 0) {
        const steal = Math.floor(damage * (attacker.life_steal / 100));
        if (steal > 0) {
            attacker.hp = Math.min(attacker.hp_max, attacker.hp + steal);
            log.push(`${attacker.name} ดูดเลือด ${steal} HP (เหลือ ${attacker.hp}/${attacker.hp_max})`);
        }
    }

    // Mana Steal (Sec 12.6)
    if (attacker.mana_steal > 0) {
        const steal = Math.floor(damage * (attacker.mana_steal / 100));
        if (steal > 0) {
            attacker.mp = Math.min(attacker.mp_max, attacker.mp + steal);
            log.push(`${attacker.name} ดูดพลัง ${steal} MP (เหลือ ${attacker.mp}/${attacker.mp_max})`);
        }
    }
}

/**
 * ดำเนินการใช้สกิล
 * @param {Object} state
 * @param {Object} attacker
 * @param {Object} defender
 * @param {Object} skill
 * @param {string} logPrefix
 * @returns {boolean} success
 */
function executeSkill(state, attacker, defender, skill, logPrefix = '') {
    const log = state.logs;

    if (!skill) return false;

    const meta = parseSkillMeta(skill.effect);
    const tags = getSkillTags(skill.effect);

    // Check MP
    if (attacker.mp < meta.mpCost) {
        log.push(`${attacker.name} MP ไม่พอใช้สกิล ${skill.name} (ต้องการ ${meta.mpCost}, มี ${attacker.mp})`);
        return false;
    }

    // Check Cooldown
    const cdKey = skill.id;
    if (attacker.cooldowns[cdKey] && attacker.cooldowns[cdKey] > 0) {
        log.push(`${attacker.name} สกิล ${skill.name} ยังอยู่ในคูลดาวน์ (${attacker.cooldowns[cdKey]} เทิร์น)`);
        return false;
    }

    // Deduct MP
    attacker.mp -= meta.mpCost;

    // Set Cooldown
    if (meta.cooldown > 0) {
        attacker.cooldowns[cdKey] = meta.cooldown;
    }

    // Hit check
    if (!checkHit(attacker, defender)) {
        log.push(`${attacker.name} ${logPrefix}ใช้ ${skill.name} แต่พลาด!`);
        return true;
    }

    // Kill Chance check (Sec 12.7)
    if (checkKillChance(attacker, defender)) {
        defender.hp = 0;
        defender.isAlive = false;
        log.push(`${attacker.name} ${logPrefix}ใช้ ${skill.name} และสังหาร ${defender.name} ทันที!`);
        return true;
    }

    // Calculate damage
    let damage = calculateDamage(attacker, defender, skill);

    // Apply damage
    defender.hp = Math.max(0, defender.hp - damage);
    if (defender.hp <= 0) {
        defender.isAlive = false;
        log.push(`${attacker.name} ${logPrefix}ใช้ ${skill.name} สร้างความเสียหาย ${damage} และสังหาร ${defender.name} สำเร็จ!`);
    } else {
        log.push(`${attacker.name} ${logPrefix}ใช้ ${skill.name} สร้างความเสียหาย ${damage} (HP ${defender.name} เหลือ ${defender.hp}/${defender.hp_max})`);
    }

    // Life Steal
    if (attacker.life_steal > 0) {
        const steal = Math.floor(damage * (attacker.life_steal / 100));
        if (steal > 0) {
            attacker.hp = Math.min(attacker.hp_max, attacker.hp + steal);
            log.push(`${attacker.name} ดูดเลือด ${steal} HP (เหลือ ${attacker.hp}/${attacker.hp_max})`);
        }
    }

    // Mana Steal
    if (attacker.mana_steal > 0) {
        const steal = Math.floor(damage * (attacker.mana_steal / 100));
        if (steal > 0) {
            attacker.mp = Math.min(attacker.mp_max, attacker.mp + steal);
            log.push(`${attacker.name} ดูดพลัง ${steal} MP (เหลือ ${attacker.mp}/${attacker.mp_max})`);
        }
    }

    return true;
}

// =============================================================================
// SECTION K: ENEMY AI
// =============================================================================

/**
 * เลือกการกระทำของศัตรู (AI)
 * @param {Object} state
 * @param {Object} enemy
 * @param {Array} playerSide
 * @returns {Object} action { type: 'attack'|'skill', target, skill }
 */
function enemyAI(state, enemy, playerSide) {
    // Filter alive targets
    const aliveTargets = playerSide.filter(p => p.isAlive);
    if (aliveTargets.length === 0) return null;

    // Prioritize player over followers
    const target = aliveTargets.find(p => p.isPlayer) || aliveTargets[0];

    // Check if enemy has skills
    const availableSkills = (enemy.skills.active || []).filter(skill => {
        if (!skill) return false;
        const cdKey = skill.id;
        const cooldown = enemy.cooldowns[cdKey] || 0;
        if (cooldown > 0) return false;
        const meta = parseSkillMeta(skill.effect);
        if (enemy.mp < meta.mpCost) return false;
        return true;
    });

    // 30% chance to use a skill if available, else auto attack
    if (availableSkills.length > 0 && Math.random() < 0.3) {
        const skill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
        return { type: 'skill', target, skill };
    }

    return { type: 'attack', target };
}

// =============================================================================
// SECTION L: BATTLE LOOP (Orchestrator)
// =============================================================================

/**
 * ดำเนินการหนึ่งเทิร์นของการต่อสู้
 * @param {Object} state
 * @param {Function} onPlayerAction - Callback สำหรับรับการกระทำของผู้เล่น
 * @returns {Object} state
 */
function processTurn(state, onPlayerAction = null) {
    if (state.state !== 'ongoing') return state;
    state.turn += 1;

    const log = state.logs;
    log.push(`--- เทิร์นที่ ${state.turn} ---`);

    // Reduce cooldowns for all combatants
    for (const combatant of state.allCombatants) {
        for (const key in combatant.cooldowns) {
            if (combatant.cooldowns[key] > 0) {
                combatant.cooldowns[key] -= 1;
            }
        }
    }

    // Build turn order for this turn (only alive)
    const aliveOrder = state.turnOrder
        .map(id => state.allCombatants.find(c => c.id === id))
        .filter(c => c && c.isAlive);

    // If no one alive, end
    if (aliveOrder.length === 0) {
        state.state = 'defeat';
        return state;
    }

    for (const combatant of aliveOrder) {
        if (state.state !== 'ongoing') break;
        if (!combatant.isAlive) continue;

        // Get defenders (opposite side)
        const isPlayerSide = combatant.isPlayer;
        let defenders;
        if (isPlayerSide) {
            defenders = state.enemies.filter(e => e.isAlive);
        } else {
            defenders = [state.player, ...state.followers].filter(e => e.isAlive);
        }

        if (defenders.length === 0) {
            state.state = isPlayerSide ? 'victory' : 'defeat';
            break;
        }

        // Select target (simplest: first alive)
        const target = defenders[0];

        // Player action handling (if callback provided)
        if (combatant.isPlayer && combatant.type === 'player' && onPlayerAction) {
            // In interactive mode, we break here and wait for action
            // But since we are in a loop, we'll just use the callback to get action.
            // For MVP, we will assume the callback returns an action synchronously.
            // In practice, this would be async. We'll handle sync for now.
            const action = onPlayerAction(state, combatant, defenders);
            if (action) {
                if (action.type === 'attack') {
                    executeAutoAttack(state, combatant, target, '');
                } else if (action.type === 'skill') {
                    const skill = action.skill;
                    if (skill) {
                        executeSkill(state, combatant, target, skill, '');
                    } else {
                        executeAutoAttack(state, combatant, target, '');
                    }
                } else if (action.type === 'item') {
                    // Item usage - for future implementation
                    log.push(`${combatant.name} ใช้ไอเทม (ยังไม่รองรับ)`);
                    executeAutoAttack(state, combatant, target, '');
                }
            } else {
                // Fallback to auto attack
                executeAutoAttack(state, combatant, target, '');
            }
            continue;
        }

        // Followers AI (Auto Attack or Skill)
        if (combatant.isPlayer && combatant.type === 'follower') {
            // Follower AI: 20% chance to use skill if available
            const availableSkills = (combatant.skills.active || []).filter(skill => {
                if (!skill) return false;
                const cdKey = skill.id;
                const cooldown = combatant.cooldowns[cdKey] || 0;
                if (cooldown > 0) return false;
                const meta = parseSkillMeta(skill.effect);
                if (combatant.mp < meta.mpCost) return false;
                return true;
            });

            if (availableSkills.length > 0 && Math.random() < 0.2) {
                const skill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
                executeSkill(state, combatant, target, skill, '[Follower] ');
            } else {
                executeAutoAttack(state, combatant, target, '[Follower] ');
            }
            continue;
        }

        // Enemy AI
        if (!combatant.isPlayer) {
            const action = enemyAI(state, combatant, defenders);
            if (action) {
                if (action.type === 'attack') {
                    executeAutoAttack(state, combatant, action.target, '[ศัตรู] ');
                } else if (action.type === 'skill') {
                    executeSkill(state, combatant, action.target, action.skill, '[ศัตรู] ');
                }
            }
            continue;
        }
    }

    // Check for Boss Phase 2
    for (const enemy of state.enemies) {
        if (enemy.isBoss && enemy.specialPhase && !enemy.phaseTriggered) {
            if (enemy.hp / enemy.hp_max < 0.5) {
                enemy.phaseTriggered = true;
                log.push(`⚠️ ${enemy.name} เข้าสู่ Phase 2! เพิ่มพลังโจมตีและป้องกัน!`);
                enemy.atk = Math.floor(enemy.atk * 1.5);
                enemy.def = Math.floor(enemy.def * 1.3);
            }
        }
    }

    // Check victory/defeat conditions
    const playerAlive = state.player.isAlive;
    const followersAlive = state.followers.some(f => f.isAlive);
    const enemiesAlive = state.enemies.some(e => e.isAlive);

    if (!playerAlive) {
        state.state = 'defeat';
        log.push(`💀 ${state.player.name} ถูกสังหาร! แพ้!`);
        // Sec 12.9: Player HP เหลือ 1
        state.player.hp = 1;
    } else if (!enemiesAlive) {
        state.state = 'victory';
        log.push(`🎉 ชนะ! ศัตรูทั้งหมดถูกกำจัด!`);
    }

    return state;
}

// =============================================================================
// SECTION M: REWARDS & DROPS (Sec 7.4, 11.2)
// =============================================================================

/**
 * คำนวณ EXP ที่ได้รับ (Sec 2.1 & 7.1)
 * @param {Object} enemy
 * @param {string} enemyType
 * @returns {number}
 */
function calculateExpReward(enemy, enemyType) {
    const typeMultiplier = BATTLE_CONSTANTS.EXP_MULTIPLIERS[enemyType] || 5;
    const level = enemy.level || 1;
    // Base EXP based on level, scaled by type
    const baseExp = Math.floor(100 * Math.pow(level, BATTLE_CONSTANTS.EXP_EXPONENT) / 20);
    return Math.floor(baseExp * typeMultiplier / 10) + 10;
}

/**
 * คำนวณ Gold ที่ได้รับ (Sec 11.2)
 * @param {Object} enemy
 * @param {string} enemyType
 * @param {Object} player (for LUCK)
 * @returns {number}
 */
function calculateGoldReward(enemy, enemyType, player) {
    if (enemy.goldReward) {
        return parseGoldReward(enemy.goldReward);
    }

    const multipliers = BATTLE_CONSTANTS.GOLD_MULTIPLIERS[enemyType] || { min: 3, max: 8 };
    const level = enemy.level || 1;
    const baseGold = level * randomInRange(multipliers.min, multipliers.max);

    // Luck bonus (Sec 2.3)
    const luck = player.stats ? player.stats.luck || 0 : 0;
    const luckBonus = Math.floor(baseGold * (luck * 0.002));

    return baseGold + luckBonus;
}

/**
 * ประมวลผล Drops (Sec 7.4)
 * @param {Object} enemy
 * @param {string} enemyType
 * @param {Object} player
 * @returns {Array} drops
 */
function processDrops(enemy, enemyType, player) {
    const drops = [];

    // Unique drops for Bosses
    if (enemy.uniqueDrops && enemy.uniqueDrops.length > 0) {
        // Guarantee at least 1 unique drop for bosses
        const dropCount = Math.min(enemy.uniqueDrops.length, randomInRange(1, 2));
        const shuffled = [...enemy.uniqueDrops].sort(() => Math.random() - 0.5);
        for (let i = 0; i < dropCount; i++) {
            if (shuffled[i]) {
                drops.push({
                    name: shuffled[i],
                    type: 'unique',
                    rarity: 'gold', // Boss drops are at least gold
                });
            }
        }
        return drops;
    }

    // Normal drops from DropTable
    const dropTableId = enemy.dropTableId;
    if (!dropTableId) return drops;

    const dropTable = DropTable.find(dt => dt.id === dropTableId);
    if (!dropTable) return drops;

    // Equipment Drop Chance (Sec 7.4)
    const luck = player.stats ? player.stats.luck || 0 : 0;
    const dropChance = dropTable.equipmentDropChance * (1 + luck * 0.002);

    if (Math.random() * 100 <= dropChance) {
        // Roll Rarity
        const weights = dropTable.rarityWeights;
        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
        let roll = Math.random() * totalWeight;
        let selectedRarity = 'white';
        for (const [rarity, weight] of Object.entries(weights)) {
            roll -= weight;
            if (roll <= 0) {
                selectedRarity = rarity;
                break;
            }
        }
        drops.push({
            type: 'equipment',
            rarity: selectedRarity,
            source: dropTableId,
        });
    }

    // Materials
    if (dropTable.materialDrops) {
        for (const mat of dropTable.materialDrops) {
            if (Math.random() * 100 <= mat.chance) {
                drops.push({
                    type: 'material',
                    name: mat.name,
                });
            }
        }
    }

    // Consumables
    if (dropTable.consumables) {
        for (const con of dropTable.consumables) {
            if (Math.random() * 100 <= con.chance) {
                drops.push({
                    type: 'consumable',
                    name: con.name,
                });
            }
        }
    }

    return drops;
}

// =============================================================================
// SECTION N: PUBLIC API - BattleModule
// =============================================================================

/**
 * เริ่มการต่อสู้
 * @param {Object} player - Player object (จาก player.js)
 * @param {string|Object} enemyIdOrData - enemyId หรือ enemy data object
 * @param {string} enemyType - "normal" | "elite" | "mini_boss" | "area_boss"
 * @param {Function} onPlayerAction - Callback สำหรับการกระทำของผู้เล่น (sync)
 * @returns {Object} battleResult
 */
function startBattle(player, enemyIdOrData, enemyType = 'normal', onPlayerAction = null) {
    // Find enemy data
    let enemyData = null;
    if (typeof enemyIdOrData === 'string') {
        // Search in EnemyDatabase
        enemyData = EnemyDatabase.find(e => e["Enemy ID"] === enemyIdOrData);
        if (!enemyData) {
            // Search in BossDatabase
            enemyData = BossDatabase.find(b => b.id === enemyIdOrData);
            if (enemyData) enemyType = 'area_boss';
        }
        if (!enemyData) {
            // Search in miniBossDatabase
            enemyData = miniBossDatabase.find(b => b.bossId === enemyIdOrData);
            if (enemyData) enemyType = 'mini_boss';
        }
        if (!enemyData) {
            throw new Error(`Enemy with ID "${enemyIdOrData}" not found.`);
        }
    } else {
        enemyData = enemyIdOrData;
    }

    // Create battle state
    const state = createBattleState(player, enemyData, enemyType);

    // Run battle loop (max 100 turns to prevent infinite loop)
    let maxTurns = 100;
    while (state.state === 'ongoing' && maxTurns > 0) {
        processTurn(state, onPlayerAction);
        maxTurns--;
    }

    // Calculate rewards if victory
    if (state.state === 'victory') {
        const exp = calculateExpReward(enemyData, enemyType);
        const gold = calculateGoldReward(enemyData, enemyType, player);
        const drops = processDrops(enemyData, enemyType, player);

        state.rewards.exp = exp;
        state.rewards.gold = gold;
        state.rewards.drops = drops;

        // Add EXP to player
        try {
            PlayerModule.addExp(player, exp);
        } catch (e) {
            state.logs.push(`⚠️ Error adding EXP: ${e.message}`);
        }

        // Add Gold to player
        try {
            PlayerModule.updateGold(player, gold);
        } catch (e) {
            state.logs.push(`⚠️ Error adding Gold: ${e.message}`);
        }

        // Add Drops to inventory
        for (const drop of drops) {
            // For simplicity, just add as item names (InventoryModule would need item IDs)
            // Since we don't have item IDs mapping in drops, we store them as is.
            // For a real implementation, we would map names to item IDs.
            try {
                // We'll add a generic entry for drops
                InventoryModule.addItem(player, drop.name || 'unknown_item', 1, { stackable: true });
            } catch (e) {
                state.logs.push(`⚠️ Error adding drop ${drop.name}: ${e.message}`);
            }
        }

        // Restore HP/MP of player (slight regen after battle)
        const regenPercent = 0.2; // 20%
        player.combat_stats.hp = Math.min(player.combat_stats.hp_max, player.combat_stats.hp + Math.floor(player.combat_stats.hp_max * regenPercent));
        player.combat_stats.mp = Math.min(player.combat_stats.mp_max, player.combat_stats.mp + Math.floor(player.combat_stats.mp_max * regenPercent));
    } else if (state.state === 'defeat') {
        // Sec 12.9: HP เหลือ 1
        state.player.hp = 1;
        // Teleport logic will be handled outside.
        // We just ensure HP is 1 in the returned player object.
        player.combat_stats.hp = 1;
    }

    // Update player's combat stats from state (for persistence)
    // Actually, the player object is mutated directly in the battle actions.
    // So we just return the result.

    // Prepare result
    const result = {
        state: state.state,
        logs: state.logs,
        rewards: state.rewards,
        player: player,
        enemyData: enemyData,
        enemyType: enemyType,
        turns: state.turn,
    };

    return result;
}

/**
 * คำนวณ EXP ที่ต้องการสำหรับ Level ต่อไป (Utility)
 * @param {number} level
 * @returns {number}
 */
function getExpRequired(level) {
    return Math.floor(BATTLE_CONSTANTS.EXP_BASE * Math.pow(level, BATTLE_CONSTANTS.EXP_EXPONENT));
}

/**
 * API สาธารณะ
 */
export const BattleModule = Object.freeze({
    startBattle,
    getExpRequired,
    // Expose helpers for testing/UI
    calculateDamage,
    checkHit,
    checkCrit,
    checkKillChance,
    parseSkillMeta,
    parseRangeToAverage,
    parseGoldReward,
    createCombatant,
});

// รองรับทั้ง Browser (window) และ Node.js
if (typeof window !== 'undefined') {
    window.BattleModule = BattleModule;
}

export default BattleModule;