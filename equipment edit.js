/**
 * =============================================================================
 * js/equipment.js — Jianghu RPG
 * Equipment Management Module
 * =============================================================================
 *
 * รับผิดชอบ: จัดการระบบสวมใส่อุปกรณ์ของผู้เล่น
 *            - สวมใส่อุปกรณ์จากคลัง
 *            - ถอดอุปกรณ์กลับเข้าคลัง
 *            - ตรวจสอบความเข้ากันของสล็อต
 *            - ป้องกันการสวมใส่ที่ไม่ถูกต้อง
 *            - คำนวณและปรับใช้สเตตัสจากอุปกรณ์
 *
 * อ้างอิง: Jianghu RPG — Game Bible v1.0
 *   - Section 4:  Equipment System (Slots, Types, Stats)
 *   - Section 5:  Stat Pool System (Stat Caps, Combat Stats)
 *   - Section 13: Data Schema (Player Schema §13.1, Item Schema §13.2)
 *
 * ไม่รับผิดชอบ: UI, Item Generation, Drop Tables, Shop, Battle Logic,
 *               Inventory Core Operations (เว้นแต่จำเป็นต้องใช้ instanceId)
 *
 * หมายเหตุ: โมดูลนี้ mutate player.equipment และ player.combat_stats โดยตรง
 *            และอัปเดต player._updated_at (ถ้ามี) เพื่อให้สอดคล้องกับ player.js
 * =============================================================================
 */

"use strict";

// =============================================================================
// SECTION A: CONSTANTS
// =============================================================================

/**
 * ค่าคงที่สำหรับระบบอุปกรณ์
 * ยึดตาม Game Bible §4.1, §5.1
 */
const EQUIPMENT_CONSTANTS = Object.freeze({
  /** สล็อตอุปกรณ์ที่ถูกต้อง */
  VALID_SLOTS: Object.freeze(["weapon", "armor", "accessory"]),

  /** ประเภทไอเทมที่ถูกต้อง */
  VALID_ITEM_TYPES: Object.freeze(["weapon", "armor", "accessory"]),

  /** แมปประเภทไอเทม → สล็อตอุปกรณ์ (1:1 mapping ตาม Game Bible) */
  ITEM_TYPE_TO_SLOT: Object.freeze({
    weapon: "weapon",
    armor: "armor",
    accessory: "accessory",
  }),

  /** สเตตัสโจมตีโดยตรง (Direct Combat Stats) — บวกลบจาก combat_stats ได้เลย */
  DIRECT_COMBAT_STATS: Object.freeze([
    "ATK", "DEF", "HP", "MP", "CRIT", "CRIT_DAMAGE",
    "DODGE", "ACCURACY", "ARMOR_PEN", "LIFE_STEAL",
    "MANA_STEAL", "KILL_CHANCE",
  ]),

  /** สเตตัสหลัก (Primary Stats) — ต้องคำนวณผลทอดก่อนบวกลบ combat_stats */
  PRIMARY_STATS: Object.freeze([
    "STR", "CON", "AGI", "INT", "LUCK",
  ]),

  /** แมป Direct Combat Stat → ฟิลด์ใน player.combat_stats */
  DIRECT_STAT_MAP: Object.freeze({
    ATK: "atk",
    DEF: "def",
    HP: "hp_max",
    MP: "mp_max",
    CRIT: "crit",
    CRIT_DAMAGE: "crit_damage",
    DODGE: "dodge",
    ACCURACY: "accuracy",
    ARMOR_PEN: "armor_pen",
    LIFE_STEAL: "life_steal",
    MANA_STEAL: "mana_steal",
    KILL_CHANCE: "kill_chance",
  }),

  /**
   * อัตราส่วนผลทอดของ Primary Stats → Combat Stats
   * ยึดตาม Game Bible §2.3
   */
  PRIMARY_STAT_MULTIPLIERS: Object.freeze({
    STR: { atk: 2.5 },
    CON: { hp_max: 10, def: 0.5 },
    AGI: { dodge: 0.3, accuracy: 0.2, crit: 0.15 },
    INT: { mp_max: 8, crit_damage: 0.2 },
    LUCK: { crit: 0.1, kill_chance: 0.05 },
  }),
});

// =============================================================================
// SECTION B: PRIVATE HELPERS
// =============================================================================

/**
 * ตรวจสอบว่า object เป็น Player ที่ถูกต้อง
 * @param {*} player
 */
function _assertPlayer(player) {
  if (!player || typeof player !== "object") {
    throw new Error("Invalid player object.");
  }
  if (!player.equipment || typeof player.equipment !== "object") {
    throw new Error("Player object is missing equipment structure.");
  }
  if (!player.combat_stats || typeof player.combat_stats !== "object") {
    throw new Error("Player object is missing combat_stats structure.");
  }
  if (!Array.isArray(player.inventory)) {
    throw new Error("Player object is missing inventory array.");
  }
}

/**
 * ตรวจสอบว่า itemData มีโครงสร้างที่ถูกต้องตาม Item Schema §13.2
 * @param {*} itemData
 */
function _assertItemData(itemData) {
  if (!itemData || typeof itemData !== "object") {
    throw new Error("Invalid item data: must be a non-null object.");
  }
  if (!itemData.id || typeof itemData.id !== "string") {
    throw new Error("Invalid item data: missing or invalid 'id' field.");
  }
  if (!itemData.type || typeof itemData.type !== "string") {
    throw new Error("Invalid item data: missing or invalid 'type' field.");
  }
  if (!EQUIPMENT_CONSTANTS.VALID_ITEM_TYPES.includes(itemData.type)) {
    throw new Error(
      `Invalid item type: "${itemData.type}". Must be one of: ${EQUIPMENT_CONSTANTS.VALID_ITEM_TYPES.join(", ")}`
    );
  }
  if (!Array.isArray(itemData.stats)) {
    throw new Error("Invalid item data: 'stats' must be an array.");
  }
}

/**
 * ตรวจสอบว่าสล็อตเป็นสล็อตที่ถูกต้อง
 * @param {string} slot
 */
function _assertValidSlot(slot) {
  if (!EQUIPMENT_CONSTANTS.VALID_SLOTS.includes(slot)) {
    throw new Error(
      `Invalid equipment slot: "${slot}". Must be one of: ${EQUIPMENT_CONSTANTS.VALID_SLOTS.join(", ")}`
    );
  }
}

/**
 * อัปเดต _updated_at timestamp ของ player (ถ้ามี field นั้น)
 * @param {Object} player
 */
function _touch(player) {
  if (player && typeof player === "object" && "_updated_at" in player) {
    player._updated_at = Date.now();
  }
}

/**
 * หา entry ในคลังตาม instanceId
 * @param {Object} player
 * @param {string} instanceId
 * @returns {{ entry: Object, index: number } | null}
 */
function _findInventoryEntryByInstanceId(player, instanceId) {
  const index = player.inventory.findIndex(
    (entry) => entry.instanceId === instanceId
  );
  if (index === -1) return null;
  return { entry: player.inventory[index], index };
}

/**
 * ลบ entry ออกจากคลังตาม instanceId โดยตรง
 * inventory.js ไม่มี API สำหรับลบตาม instanceId จึงต้องจัดการเอง
 * @param {Object} player
 * @param {string} instanceId
 * @returns {Object|null} entry ที่ถูกลบ หรือ null ถ้าไม่พบ
 */
function _removeInventoryEntryByInstanceId(player, instanceId) {
  const found = _findInventoryEntryByInstanceId(player, instanceId);
  if (!found) return null;

  const { entry, index } = found;
  player.inventory.splice(index, 1);
  return { ...entry };
}

/**
 * คำนวณผลรวมของสเตตัสจากอุปกรณ์หนึ่งชิ้น
 * แยกเป็น: direct combat stats และ primary stat deltas
 *
 * @param {Object} itemData - ข้อมูลไอเทมตาม Item Schema §13.2
 * @returns {{
 *   direct: Object,      // { combatStatKey: deltaValue }
 *   primary: Object      // { combatStatKey: deltaValue }
 * }}
 */
function _calculateItemStatBonuses(itemData) {
  const direct = {};
  const primary = {};

  for (const stat of itemData.stats) {
    const statId = stat.stat_id;
    const value = stat.value;

    if (typeof statId !== "string" || typeof value !== "number") {
      // ข้าม entry ที่ไม่ถูกต้อง ไม่ throw เพื่อความทนทาน
      continue;
    }

    // Direct Combat Stat
    if (EQUIPMENT_CONSTANTS.DIRECT_COMBAT_STATS.includes(statId)) {
      const combatKey = EQUIPMENT_CONSTANTS.DIRECT_STAT_MAP[statId];
      if (combatKey) {
        direct[combatKey] = (direct[combatKey] || 0) + value;
      }
      continue;
    }

    // Primary Stat → คำนวณผลทอด
    if (EQUIPMENT_CONSTANTS.PRIMARY_STATS.includes(statId)) {
      const multipliers = EQUIPMENT_CONSTANTS.PRIMARY_STAT_MULTIPLIERS[statId];
      if (multipliers) {
        for (const [combatKey, multiplier] of Object.entries(multipliers)) {
          primary[combatKey] = (primary[combatKey] || 0) + value * multiplier;
        }
      }
      continue;
    }

    // สเตตัสที่ไม่รู้จัก — ไม่ทำอะไร (อนาคตอาจมีสเตตัสใหม่จาก Expansion)
    // ไม่ throw Error เพื่อความทนทานต่อเนื้อหาใหม่
  }

  return { direct, primary };
}

/**
 * รวมผลโบนัส direct + primary เข้าด้วยกัน
 * @param {{ direct: Object, primary: Object }} bonuses
 * @returns {Object} ผลรวมทุก combat stat key
 */
function _mergeBonuses(bonuses) {
  const merged = {};
  for (const [key, val] of Object.entries(bonuses.direct)) {
    merged[key] = (merged[key] || 0) + val;
  }
  for (const [key, val] of Object.entries(bonuses.primary)) {
    merged[key] = (merged[key] || 0) + val;
  }
  return merged;
}

/**
 * บวก/ลบค่าโบนัสเข้า/ออกจาก player.combat_stats
 *
 * หลักการ:
 *   - ทุก combat stat key ที่มีใน bonuses: บวก/ลบตาม operator
 *   - HP/MP max ที่เปลี่ยน: ต้องปรับ hp/mp ปัจจุบันด้วย
 *     * ถ้าบวก (equip): hp/mp ปัจจุบันเพิ่มตาม (ไม่ให้ผู้เล่นเสีย HP/MP ที่มีอยู่)
 *     * ถ้าลบ (unequip): hp/mp ปัจจุบันต้องไม่เกิน max ใหม่
 *   - ค่าติดลบไม่ได้: clamp ที่ 0
 *
 * @param {Object} player
 * @param {Object} bonuses - { combatStatKey: deltaValue }
 * @param {number} operator - +1 (บวก) หรือ -1 (ลบ)
 */
function _applyCombatStatDeltas(player, bonuses, operator) {
  const cs = player.combat_stats;

  // เก็บค่า hp_max/mp_max เดิมไว้เพื่อคำนวณการเปลี่ยนแปลง
  const oldHpMax = cs.hp_max;
  const oldMpMax = cs.mp_max;

  for (const [key, delta] of Object.entries(bonuses)) {
    if (typeof cs[key] !== "number") {
      // ฟิลด์ไม่มีใน combat_stats — ข้าม (รองรับ expansion stats ในอนาคต)
      continue;
    }

    const change = delta * operator;
    cs[key] = cs[key] + change;

    // Clamp ค่าติดลบ (combat stats ทุกตัวต้อง >= 0)
    if (cs[key] < 0) {
      cs[key] = 0;
    }
  }

  // จัดการ HP ปัจจุบันให้สอดคล้องกับ Max ที่เปลี่ยนไป
  if (bonuses.hp_max !== undefined) {
    const newHpMax = cs.hp_max;
    if (operator > 0) {
      // Equip: max เพิ่ม → hp ปัจจุบันเพิ่มตาม (รักษาสัดส่วนหรือบวก flat)
      // ใช้ flat increase เพื่อความเรียบง่าย: hp += delta
      cs.hp = Math.min(newHpMax, cs.hp + bonuses.hp_max);
    } else {
      // Unequip: max ลด → hp ปัจจุบันต้องไม่เกิน max ใหม่
      cs.hp = Math.min(newHpMax, cs.hp);
    }
    // ป้องกัน hp ติดลบ
    cs.hp = Math.max(0, cs.hp);
  }

  // จัดการ MP ปัจจุบันให้สอดคล้องกับ Max ที่เปลี่ยนไป
  if (bonuses.mp_max !== undefined) {
    const newMpMax = cs.mp_max;
    if (operator > 0) {
      // Equip: max เพิ่ม → mp ปัจจุบันเพิ่มตาม
      cs.mp = Math.min(newMpMax, cs.mp + bonuses.mp_max);
    } else {
      // Unequip: max ลด → mp ปัจจุบันต้องไม่เกิน max ใหม่
      cs.mp = Math.min(newMpMax, cs.mp);
    }
    // ป้องกัน mp ติดลบ
    cs.mp = Math.max(0, cs.mp);
  }
}

// =============================================================================
// SECTION C: CORE API — EQUIP / UNEQUIP / SWAP
// =============================================================================

/**
 * สวมใส่อุปกรณ์จากคลังผู้เล่น
 *
 * หลักการ:
 *   1. ตรวจสอบ instanceId มีอยู่ในคลัง
 *   2. ตรวจสอบ itemData ถูกต้องและ type ตรงกับสล็อต
 *   3. ถ้าสล็อตมีอุปกรณ์อยู่แล้ว → ถอดออกก่อน (auto-unequip)
 *   4. ลบไอเทมออกจากคลัง (โดย instanceId)
 *   5. ใส่ไอเทมเข้าสล็อต
 *   6. คำนวณและบวกสเตตัสเข้า combat_stats
 *
 * @param {Object} player - Player object
 * @param {string} instanceId - instanceId ของไอเทมในคลัง
 * @param {Object} itemData - ข้อมูลไอเทมเต็มรูปแบบตาม Item Schema §13.2
 * @returns {{
 *   success: boolean,
 *   slot: string,
 *   previousItem: Object|null,
 *   equippedItem: Object,
 *   bonusesApplied: Object
 * }}
 */
function equipItem(player, instanceId, itemData) {
  _assertPlayer(player);

  if (!instanceId || typeof instanceId !== "string") {
    throw new Error("instanceId must be a non-empty string.");
  }

  _assertItemData(itemData);

  // 1. หาไอเทมในคลังตาม instanceId
  const inventoryEntry = _findInventoryEntryByInstanceId(player, instanceId);
  if (!inventoryEntry) {
    throw new Error(
      `Item with instanceId "${instanceId}" not found in player inventory.`
    );
  }

  // ตรวจสอบว่า itemId ตรงกัน (ป้องกัน mismatch ระหว่าง inventory entry กับ itemData)
  if (inventoryEntry.entry.itemId !== itemData.id) {
    throw new Error(
      `Item ID mismatch: inventory has "${inventoryEntry.entry.itemId}" but itemData has "${itemData.id}".`
    );
  }

  // 2. ตรวจสอบว่า type ตรงกับสล็อตที่ถูกต้อง
  const targetSlot = EQUIPMENT_CONSTANTS.ITEM_TYPE_TO_SLOT[itemData.type];
  if (!targetSlot) {
    throw new Error(
      `Item type "${itemData.type}" does not map to any equipment slot.`
    );
  }

  // 3. คำนวณโบนัสจากไอเทมชิ้นนี้ (ก่อน mutate)
  const itemBonuses = _calculateItemStatBonuses(itemData);
  const totalBonuses = _mergeBonuses(itemBonuses);

  // 4. ถ้าสล็อตมีอุปกรณ์อยู่แล้ว → ถอดออกก่อน
  let previousItem = null;
  if (player.equipment[targetSlot] !== null) {
    previousItem = unequipItem(player, targetSlot);
  }

  // 5. ลบไอเทมออกจากคลัง (โดย instanceId)
  const removedEntry = _removeInventoryEntryByInstanceId(player, instanceId);
  if (!removedEntry) {
    // ไม่น่าเกิดขึ้นเพราะเช็คแล้ว แต่ป้องกัน race condition
    throw new Error(
      `Failed to remove item with instanceId "${instanceId}" from inventory.`
    );
  }

  // 6. เก็บไอเทมเข้าสล็อต (เก็บทั้ง instanceId + itemData แบบเต็ม)
  // โครงสร้าง: { instanceId, itemId, itemData }
  // เก็บ itemData เพื่อให้ไม่ต้อง query database อีกครั้งเมื่อต้องคำนวณสเตตัส
  player.equipment[targetSlot] = {
    instanceId: removedEntry.instanceId,
    itemId: removedEntry.itemId,
    itemData: itemData,
  };

  // 7. บวกโบนัสเข้า combat_stats
  _applyCombatStatDeltas(player, totalBonuses, +1);

  _touch(player);

  return {
    success: true,
    slot: targetSlot,
    previousItem: previousItem,
    equippedItem: player.equipment[targetSlot],
    bonusesApplied: totalBonuses,
  };
}

/**
 * ถอดอุปกรณ์ออกจากสล็อตและคืนเข้าคลัง
 *
 * หลักการ:
 *   1. ตรวจสอบสล็อตถูกต้อง
 *   2. ตรวจสอบว่ามีอุปกรณ์ในสล็อต
 *   3. คำนวณโบนัสที่ต้องลบออก
 *   4. ลบโบนัสออกจาก combat_stats
 *   5. คืนไอเทมเข้าคลัง (push ตรงเพื่อ preserve instanceId)
 *   6. เคลียร์สล็อต
 *
 * หมายเหตุสำคัญ: ไม่ใช้ InventoryModule.addItem() เพราะ addItem จะสร้าง
 * instanceId ใหม่ ซึ่งขัดกับ requirement "Preserve original instanceId"
 *
 * @param {Object} player - Player object
 * @param {string} slot - "weapon" | "armor" | "accessory"
 * @returns {{
 *   success: boolean,
 *   slot: string,
 *   returnedItem: Object,
 *   bonusesRemoved: Object
 * }}
 */
function unequipItem(player, slot) {
  _assertPlayer(player);
  _assertValidSlot(slot);

  const equipped = player.equipment[slot];
  if (!equipped) {
    throw new Error(`No item equipped in slot "${slot}".`);
  }

  // คำนวณโบนัสที่ต้องลบออก
  const itemBonuses = _calculateItemStatBonuses(equipped.itemData);
  const totalBonuses = _mergeBonuses(itemBonuses);

  // ลบโบนัสออกจาก combat_stats
  _applyCombatStatDeltas(player, totalBonuses, -1);

  // คืนไอเทมเข้าคลังโดยตรง (preserve instanceId)
  const returnedEntry = {
    instanceId: equipped.instanceId,
    itemId: equipped.itemId,
    quantity: 1,
  };
  player.inventory.push(returnedEntry);

  // เก็บข้อมูลก่อนลบ
  const result = {
    success: true,
    slot: slot,
    returnedItem: { ...equipped },
    bonusesRemoved: totalBonuses,
  };

  // เคลียร์สล็อต
  player.equipment[slot] = null;

  _touch(player);

  return result;
}

/**
 * สลับอุปกรณ์ในสล็อต (ถอดของเก่า + สวมของใหม่ในครั้งเดียว)
 * เป็น Sugar API ที่เรียก unequip + equip ต่อเนื่อง
 *
 * @param {Object} player
 * @param {string} instanceId - instanceId ของไอเทมใหม่ในคลัง
 * @param {Object} itemData - ข้อมูลไอเทมใหม่
 * @returns {{
 *   success: boolean,
 *   slot: string,
 *   unequipped: Object|null,
 *   equipped: Object,
 *   netBonuses: Object
 * }}
 */
function swapItem(player, instanceId, itemData) {
  _assertPlayer(player);
  _assertItemData(itemData);

  const targetSlot = EQUIPMENT_CONSTANTS.ITEM_TYPE_TO_SLOT[itemData.type];
  if (!targetSlot) {
    throw new Error(
      `Item type "${itemData.type}" does not map to any equipment slot.`
    );
  }

  let unequippedResult = null;
  if (player.equipment[targetSlot] !== null) {
    unequippedResult = unequipItem(player, targetSlot);
  }

  const equippedResult = equipItem(player, instanceId, itemData);

  // คำนวณ net bonuses (bonuses ใหม่ - bonuses เก่า)
  const netBonuses = { ...equippedResult.bonusesApplied };
  if (unequippedResult) {
    for (const [key, val] of Object.entries(unequippedResult.bonusesRemoved)) {
      netBonuses[key] = (netBonuses[key] || 0) - val;
    }
  }

  return {
    success: true,
    slot: targetSlot,
    unequipped: unequippedResult,
    equipped: equippedResult.equippedItem,
    netBonuses: netBonuses,
  };
}

// =============================================================================
// SECTION D: QUERY API
// =============================================================================

/**
 * ดึงข้อมูลอุปกรณ์ที่สวมใส่อยู่ในสล็อตหนึ่ง
 * @param {Object} player
 * @param {string} slot - "weapon" | "armor" | "accessory"
 * @returns {Object|null} สำเนาของ equipped item entry หรือ null
 */
function getEquippedItem(player, slot) {
  _assertPlayer(player);
  _assertValidSlot(slot);

  const equipped = player.equipment[slot];
  if (!equipped) return null;

  // คืนค่าสำเนาเพื่อป้องกันการ mutate จากภายนอก
  return {
    instanceId: equipped.instanceId,
    itemId: equipped.itemId,
    itemData: equipped.itemData,
  };
}

/**
 * ดึงข้อมูลอุปกรณ์ทั้งหมดที่สวมใส่อยู่
 * @param {Object} player
 * @returns {{
 *   weapon: Object|null,
 *   armor: Object|null,
 *   accessory: Object|null
 * }}
 */
function getAllEquipped(player) {
  _assertPlayer(player);

  return {
    weapon: getEquippedItem(player, "weapon"),
    armor: getEquippedItem(player, "armor"),
    accessory: getEquippedItem(player, "accessory"),
  };
}

/**
 * ตรวจสอบว่าสล็อตมีอุปกรณ์สวมใส่อยู่หรือไม่
 * @param {Object} player
 * @param {string} slot
 * @returns {boolean}
 */
function isSlotEquipped(player, slot) {
  _assertPlayer(player);
  _assertValidSlot(slot);
  return player.equipment[slot] !== null;
}

// =============================================================================
// SECTION E: STAT CALCULATION API
// =============================================================================

/**
 * คำนวณผลรวมโบนัสจากอุปกรณ์ทั้งหมดที่สวมใส่อยู่
 * ใช้สำหรับระบบภายนอก (เช่น battle.js) ที่ต้องการทราบ total equipment bonuses
 *
 * @param {Object} player
 * @returns {{
 *   direct: Object,
 *   primary: Object,
 *   total: Object
 * }}
 */
function calculateTotalEquipmentBonuses(player) {
  _assertPlayer(player);

  let direct = {};
  let primary = {};

  for (const slot of EQUIPMENT_CONSTANTS.VALID_SLOTS) {
    const equipped = player.equipment[slot];
    if (!equipped || !equipped.itemData) continue;

    const bonuses = _calculateItemStatBonuses(equipped.itemData);

    for (const [key, val] of Object.entries(bonuses.direct)) {
      direct[key] = (direct[key] || 0) + val;
    }
    for (const [key, val] of Object.entries(bonuses.primary)) {
      primary[key] = (primary[key] || 0) + val;
    }
  }

  return {
    direct,
    primary,
    total: _mergeBonuses({ direct, primary }),
  };
}

/**
 * คำนวณ Power Score รวมของอุปกรณ์ที่สวมใส่อยู่
 * @param {Object} player
 * @returns {number}
 */
function calculateTotalPowerScore(player) {
  _assertPlayer(player);

  let total = 0;
  for (const slot of EQUIPMENT_CONSTANTS.VALID_SLOTS) {
    const equipped = player.equipment[slot];
    if (equipped && equipped.itemData && typeof equipped.itemData.power_score === "number") {
      total += equipped.itemData.power_score;
    }
  }
  return total;
}

// =============================================================================
// SECTION F: RECALCULATION API (สำหรับใช้หลัง player.js recalculate)
// =============================================================================

/**
 * คำนวณ Base Combat Stats จาก Primary Stats ของผู้เล่น
 * ใช้สูตรจาก Game Bible §2.3 (ไม่รวมอุปกรณ์)
 *
 * หมายเหตุ: ฟังก์ชันนี้ใช้สูตรจาก Game Bible โดยตรง
 * player.js export แค่ calcBaseAtk, calcMaxHp, calcMaxMp
 * สูตรอื่น (def, dodge, crit, accuracy) ไม่ได้ export จึงต้องใช้จากแหล่งต้นฉบับ (Game Bible)
 * ไม่ใช่การ "duplicate player.js" แต่เป็นการใช้ Source of Truth เดียวกัน
 *
 * @param {Object} stats - { str, con, agi, int, luck }
 * @returns {Object} base combat stats
 */
function calculateBaseCombatStats(stats) {
  const s = stats || {};
  const str = s.str || 0;
  const con = s.con || 0;
  const agi = s.agi || 0;
  const int_stat = s.int || 0;
  const luck = s.luck || 0;

  return {
    hp: con * 10,
    hp_max: con * 10,
    mp: int_stat * 8,
    mp_max: int_stat * 8,
    atk: str * 2.5,
    def: con * 0.5,
    crit: 5 + (agi * 0.15) + (luck * 0.1),
    crit_damage: 150,
    dodge: agi * 0.3,
    accuracy: 90 + (agi * 0.2),
    armor_pen: 0,
    life_steal: 0,
    mana_steal: 0,
    kill_chance: 0,
  };
}

/**
 * คำนวณและปรับ combat_stats ให้ถูกต้องจาก Primary Stats + อุปกรณ์
 * ใช้หลังจาก player.js _recalculateCombatStats (ที่ไม่รวมอุปกรณ์)
 * เพื่อให้ combat_stats สะท้อนค่าจริงรวมอุปกรณ์
 *
 * @param {Object} player
 * @returns {Object} player.combat_stats หลังปรับ
 */
function recalculateEquipmentStats(player) {
  _assertPlayer(player);

  // 1. คำนวณ Base Combat Stats จาก Primary Stats (ไม่รวมอุปกรณ์)
  const baseStats = calculateBaseCombatStats(player.stats);

  // 2. คำนวณโบนัสจากอุปกรณ์ทั้งหมด
  const equipmentBonuses = calculateTotalEquipmentBonuses(player);

  // 3. รวม Base + Equipment
  const cs = player.combat_stats;
  for (const key of Object.keys(baseStats)) {
    if (typeof cs[key] === "number") {
      cs[key] = baseStats[key] + (equipmentBonuses.total[key] || 0);
    }
  }

  // 4. Clamp HP/MP ปัจจุบันให้อยู่ในช่วงที่ถูกต้อง
  cs.hp = Math.max(0, Math.min(cs.hp_max, cs.hp));
  cs.mp = Math.max(0, Math.min(cs.mp_max, cs.mp));

  _touch(player);

  return cs;
}

// =============================================================================
// SECTION G: VALIDATION API
// =============================================================================

/**
 * ตรวจสอบว่าไอเทมสามารถสวมใส่ในสล็อตที่ระบุได้หรือไม่
 * @param {Object} itemData
 * @param {string} slot
 * @returns {boolean}
 */
function canEquipInSlot(itemData, slot) {
  if (!itemData || !itemData.type) return false;
  if (!EQUIPMENT_CONSTANTS.VALID_SLOTS.includes(slot)) return false;

  return EQUIPMENT_CONSTANTS.ITEM_TYPE_TO_SLOT[itemData.type] === slot;
}

/**
 * ตรวจสอบว่าไอเทมอยู่ในคลังของผู้เล่นหรือไม่ (ตาม instanceId)
 * @param {Object} player
 * @param {string} instanceId
 * @returns {boolean}
 */
function isItemInInventory(player, instanceId) {
  _assertPlayer(player);
  if (!instanceId || typeof instanceId !== "string") return false;

  return _findInventoryEntryByInstanceId(player, instanceId) !== null;
}

// =============================================================================
// SECTION H: PUBLIC API EXPORT
// =============================================================================

/**
 * EquipmentModule — API สาธารณะสำหรับระบบอื่น
 *
 * ระบบภายนอกเรียกใช้ผ่าน EquipmentModule.xxx() เท่านั้น
 */
const EquipmentModule = Object.freeze({
  // Constants (read-only)
  CONSTANTS: EQUIPMENT_CONSTANTS,

  // Core Operations
  equipItem,
  unequipItem,
  swapItem,

  // Query
  getEquippedItem,
  getAllEquipped,
  isSlotEquipped,

  // Stat Calculation
  calculateTotalEquipmentBonuses,
  calculateTotalPowerScore,
  calculateBaseCombatStats,
  recalculateEquipmentStats,

  // Validation
  canEquipInSlot,
  isItemInInventory,
});

// รองรับทั้ง Browser (window) และ Node.js (module.exports)
if (typeof window !== "undefined") {
  window.EquipmentModule = EquipmentModule;
} else if (typeof module !== "undefined" && module.exports) {
  module.exports = EquipmentModule;
}
