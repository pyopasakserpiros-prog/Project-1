# JIANGHU RPG — EVENT DATABASE v1.0
ฐานข้อมูลเหตุการณ์สำรวจ (Exploration Events)
เอกสารนี้ถูกออกแบบให้ทำงานร่วมกับ `game_bible_v1.md` และ `map_database.md` โดยตรง ทุก Event อ้างอิงตาม Schema 13.6 ของ Game Bible และถูกแบ่ง Pool ตามระดับแมพ (Map Level 1–10) เพื่อความสมดุลและรองรับระบบ Data-Driven Architecture

> 📌 **หมายเหตุระบบ:** 
> - อัตราการเกิด Event จะถูกปรับด้วยค่า `LUCK` ผู้เล่นตามสูตรใน Game Bible Sec. 10.2
> - ผลลัพธ์จะแสดงผลทันที ไม่มี Delay หรือบทสนทนายาว
> - Event ร้ายจะไม่ทำให้ HP ถึง 0 โดยตรง
> - รูปแบบข้อมูลพร้อมสำหรับ Parse ไปยัง JSON/JS Engine ได้ทันที

---

## 🌍 EVENT POOL BY MAP LEVEL

### 🌲 Map Level 1: หมู่บ้านและป่าชายขอบ (MAP-001 ถึง MAP-006)
| Event ID | Event Name | Map ID / Area | Type | Condition | Description | Outcomes | Chance |
|:---|:---|:---|:---|:---|:---|:---|:---|
| EVT-L1-01 | สมุนไพรริมทาง | MAP-001, 002 | Resource | None | พบต้นสมุนไพรหายางงอกอยู่ใต้รากไม้ใหญ่ | +Gold 10-30, +HP 5%, ได้ Item (สมุนไพร Lv1) | Common |
| EVT-L1-02 | กับดักนายพราน | MAP-001, 003 | Trap | None | ก้าวพลาดเหยียบกับดักเหล็กเก่าสนิมเขรอะ | -HP 8%, -MP 5%, เสียสถานะเล็กน้อย (Bruised 1 Turn) | Uncommon |
| EVT-L1-03 | หีบไม้เก่าริมน้ำ | MAP-002, 004 | Treasure | None | หีบไม้ผุพังลอยมาติดตลิ่ง ล็อกด้วยสนิม | เปิดได้: +Gold 50-150, ได้ Item (อุปกรณ์ขาว/เขียว) | Uncommon |
| EVT-L1-04 | ซากค่ายร้าง | MAP-005, 006 | Rest Spot | None | เต็นท์เก่าและกองไฟมอดยังพอให้ความอบอุ่น | +HP 15%, +MP 10%, ฟื้นพลังเล็กน้อย | Rare |
| EVT-L1-05 | รอยเท้าลึกลับ | MAP-001-006 | Environmental | AGI ≥ 10 | ติดตามรอยเท้าจางๆ ไปตามพงหญ้า | เปิดทางลับ (Secret Path), +EXP 20, +Gold 40 | Rare |

### ⛰️ Map Level 2: เนินเขาและถ้ำหิน (MAP-007 ถึง MAP-012)
| Event ID | Event Name | Map ID / Area | Type | Condition | Description | Outcomes | Chance |
|:---|:---|:---|:---|:---|:---|:---|:---|
| EVT-L2-01 | แหล่งแร่ดิบ | MAP-007, 008 | Resource | STR ≥ 12 | ขุดพบก้อนแร่ฝังอยู่ตามผนังถ้ำ | +Gold 80-200, ได้ Item (แร่ธาตุ/วัสดุ Lv2) | Common |
| EVT-L2-02 | หินถล่มกะทันหัน | MAP-009, 010 | Environmental | None | เสียงก้องดังสนั่น หินร่วงลงมาปิดทาง | -HP 12%, -MP 8%, เสียเวลาสำรวจ 1 AP | Uncommon |
| EVT-L2-03 | น้ำพุร้อนใต้ดิน | MAP-011, 012 | Rest Spot | None | ไอน้ำลอยขึ้นจากแอ่งน้ำใสอุ่น | +HP 25%, +MP 20%, ลดสถานะ Exhausted | Rare |
| EVT-L2-04 | ทางแยกถ้ำมืด | MAP-007-012 | Puzzle | INT ≥ 15 | เลือกทางซ้ายหรือขวาตามสัญลักษณ์โบราณ | ถูก: +EXP 50, +Buff (Clarity 2 Turns) / ผิด: -HP 5%, กลับไปจุดเดิม | Uncommon |

### 🏜️ Map Level 3: ทะเลทรายและที่รกร้าง (MAP-013 ถึง MAP-018)
| Event ID | Event Name | Map ID / Area | Type | Condition | Description | Outcomes | Chance |
|:---|:---|:---|:---|:---|:---|:---|:---|
| EVT-L3-01 | โอเอซิสลวงตา | MAP-013, 014 | Environmental | LUCK ≥ 10 | เห็นแหล่งน้ำและร่มไม้ แต่ความจริงเป็นภาพลวง | +HP 10%, -MP 15%, เสียสถานะ (Dehydration 2 Turns) | Uncommon |
| EVT-L3-02 | พายุทราย | MAP-015-018 | Environmental | None | ทรายพัดรุนแรงปิดการมองเห็นและกัดกร่อน | -HP 10%, -MP 10%, ลด ACC ชั่วคราว 3 Turn | Common |
| EVT-L3-03 | โครงกระดูกนักเดินทาง | MAP-013, 016 | Treasure | CON ≥ 12 | พบร่างแห้งและถุงหนังฝังครึ่งทราย | +Gold 150-300, ได้ Item (คัมภีร์/อุปกรณ์เก่า) | Uncommon |
| EVT-L3-04 | ตลาดเร่ลับ | MAP-017, 018 | NPC | None | ชายคลุมผ้าเปิดขายของหายากใต้เงาทราย | ซื้อของลดราคา 15%, หรือแลกเปลี่ยนด้วยสถานะ | Rare |

### 🪦 Map Level 4: สุสานและบึงพิษ (MAP-019 ถึง MAP-023)
| Event ID | Event Name | Map ID / Area | Type | Condition | Description | Outcomes | Chance |
|:---|:---|:---|:---|:---|:---|:---|:---|
| EVT-L4-01 | แท่นบูชาวิญญาณ | MAP-019, 020 | Puzzle | INT ≥ 18 | วางดอกไม้หรือเลือดบนแท่นหินสลัก | ถูก: +Buff (Spirit Ward 3 Turn) / ผิด: -MP 20%, เกิดเสียงก้อง | Uncommon |
| EVT-L4-02 | หมอกพิษ | MAP-021, 022 | Environmental | None | หมอกสีเขียวขุ่นลอยปกคลุมทางเดิน | -HP 15%, -MP 10%, ติดสถานะ Poisoned 1 Turn | Common |
| EVT-L4-03 | หีบฝังศพโบราณ | MAP-020, 023 | Treasure | STR ≥ 15 | เปิดฝาโลงหินที่สลักลวดลายประหลาด | +Gold 200-500, ได้ Item (Scroll ม่วง/เขียว) | Rare |
| EVT-L4-04 | นักบวชเร่ร่อน | MAP-019-023 | NPC | None | ชายแก่ถือไม้เท้าเดินทวนกระแสหมอก | +HP 20% หรือ +EXP 40 (เลือกผลได้ 1 อย่าง) | Uncommon |

### 🏰 Map Level 5: เมืองปราการและเทือกเขาสูง (MAP-024 ถึง MAP-030)
| Event ID | Event Name | Map ID / Area | Type | Condition | Description | Outcomes | Chance |
|:---|:---|:---|:---|:---|:---|:---|:---|
| EVT-L5-01 | บ่อน้ำศักดิ์สิทธิ์ | MAP-024, 025 | Rest Spot | None | น้ำในบ่อสะท้อนแสงจันทร์จางๆ | +HP 30%, +MP 25%, ฟื้นสถานะผิดปกติทั้งหมด | Rare |
| EVT-L5-02 | ข่าวลือจากนักบวช | MAP-026, 027 | NPC | None | ชายในชุดคลุมบอกทางลับและอันตรายข้างหน้า | เปิดจุดลับ (Hidden Path), +Buff (Awareness 2 Turn) | Uncommon |
| EVT-L5-03 | กำแพงร้าว | MAP-028, 029 | Environmental | STR ≥ 20 | ช่องแคบระหว่างหินที่พอจะแทรกตัวผ่านได้ | +EXP 60, พบ Treasure ซ่อน, เสีย HP 5% จากหินเสียดสี | Common |
| EVT-L5-04 | ห้องลับในตำหนัก | MAP-030 | Puzzle | INT ≥ 22, LUCK ≥ 15 | แก้ไขกลไกประตูไม้ด้วยลำดับการกดสลับ | เปิดทางลับ, +Gold 400-800, ได้ Scroll ทอง | Rare |

### 🌌 Map Level 6: ดินแดนเสียงสวรรค์ (MAP-031 ถึง MAP-035)
| Event ID | Event Name | Map ID / Area | Type | Condition | Description | Outcomes | Chance |
|:---|:---|:---|:---|:---|:---|:---|:---|
| EVT-L6-01 | ถ้ำวิญญาณสะท้อนเสียง | MAP-031, 032 | Environmental | AGI ≥ 25 | เสียงก้องจากภายในถ้ำส่งผลต่อสมาธิ | -MP 10% หรือ +MP 15% (สุ่มตาม LUCK) | Common |
| EVT-L6-02 | แสงจันทร์รักษาแผล | MAP-033, 034 | Rest Spot | None | แสงสีเงินส่องลงมาบนแท่นหินเรียบ | +HP 40%, +Buff (Lunar Grace 2 Turn) | Uncommon |
| EVT-L6-03 | พลังวิญญาณรบกวน | MAP-031-035 | Trap | CON < 25 | คลื่นพลังงานมองไม่เห็นซัดเข้าใส่ร่างกาย | -HP 15%, -MP 20%, ติดสถานะ Stunned 1 Turn | Rare |
| EVT-L6-04 | พ่อค้าวิญญาณ | MAP-032, 035 | NPC | None | เงาโปร่งแสงเปิดแผงขายของเรืองแสง | แลกเปลี่ยน Item ด้วย EXP หรือ MP, ได้ของระดับฟ้า/ม่วง | Uncommon |

### ❄️ Map Level 7: เทือกเขาน้ำแข็งและหุบเขาหนาว (MAP-036 ถึง MAP-041)
| Event ID | Event Name | Map ID / Area | Type | Condition | Description | Outcomes | Chance |
|:---|:---|:---|:---|:---|:---|:---|:---|
| EVT-L7-01 | ถ้ำน้ำแข็งลับ | MAP-036, 037 | Rest Spot | CON ≥ 28 | โพรงน้ำแข็งที่อากาศอบอุ่นผิดปกติ | +HP 35%, +MP 30%, ลบล้างสถานะ Freeze/Cold | Rare |
| EVT-L7-02 | พายุหิมะ | MAP-038-041 | Environmental | None | ลมหนาวพัดกรีดเกราะและผิวหนัง | -HP 12%, ลด DODGE ชั่วคราว 2 Turn | Common |
| EVT-L7-03 | คัมภีร์น้ำแข็งโบราณ | MAP-039, 040 | Treasure | INT ≥ 30 | พบเล่มหนังสือห่อผ้าหนาฝังใต้หิมะ | +EXP 100, ได้ Scroll ทอง/ม่วง, +MP 10% | Uncommon |
| EVT-L7-04 | รอยเท้าสัตว์ลึกลับ | MAP-036-041 | Trap | AGI ≥ 32 | รอยเท้าใหญ่ลากเป็นทางยาวสู่หุบเขาแคบ | เปิดทางลับ, +Gold 300-600, -HP 8% จากกับดักน้ำแข็ง | Uncommon |

### 🔥 Map Level 8: สวรรค์ชั้นเก้าและแดนเพลิง (MAP-042 ถึง MAP-044)
| Event ID | Event Name | Map ID / Area | Type | Condition | Description | Outcomes | Chance |
|:---|:---|:---|:---|:---|:---|:---|:---|
| EVT-L8-01 | ลาวาใต้ดิน | MAP-042, 043 | Environmental | CON ≥ 35 | พื้นหินร้าวและไอร้อนพุ่งขึ้นสูง | -HP 18%, ได้ Item (แร่เพลิง), เสีย AP 1 | Common |
| EVT-L8-02 | แร่ธาตุหายาก | MAP-042-044 | Resource | STR ≥ 35 | ก้อนหินดำแดงเปล่งประกายความร้อน | +Gold 500-1000, ได้ Material พิเศษ | Uncommon |
| EVT-L8-03 | พ่อค้าแร่ธาตุลับ | MAP-043, 044 | NPC | None | ชายร่างใหญ่ขายของร้อนแรงด้วยมือเปล่า | ซื้ออุปกรณ์ทอง/แดง ในราคาพิเศษ หรือแลกเปลี่ยนด้วย HP | Rare |
| EVT-L8-04 | กับดักเพลิง | MAP-042-044 | Trap | None | พื้นไม้และน้ำมันเก่าติดไฟง่ายเมื่อสัมผัส | -HP 20%, -MP 15%, ติดสถานะ Burn 2 Turn | Uncommon |

### 🌑 Map Level 9: ดินแดนมารและหุบเขาลับ (MAP-045 ถึง MAP-049)
| Event ID | Event Name | Map ID / Area | Type | Condition | Description | Outcomes | Chance |
|:---|:---|:---|:---|:---|:---|:---|:---|
| EVT-L9-01 | ห้องลับในตำหนักมาร | MAP-045, 046 | Puzzle | INT ≥ 40, LUCK ≥ 20 | ประตูสลักอักษรโบราณเรียงลำดับผิด | ถูก: +Buff (Dark Resonance 3 Turn), +Scroll แดง | Rare |
| EVT-L9-02 | เลือดมาร | MAP-047, 048 | Trap | None | แอ่งเลือดแดงสดบนพื้นหินส่งกลิ่นคาว | -HP 25%, -MP 20%, ติดสถานะ Bloodlust 2 Turn (เพิ่ม ATK แต่ลด DEF) | Uncommon |
| EVT-L9-03 | คัมภีร์มารโบราณ | MAP-045-049 | Treasure | None | ม้วนหนังสัตว์เก่าเก็บในกล่องไม้ดำ | +EXP 150, ได้ Scroll แดง/ทอง, -MP 5% จากพลังรบกวน | Rare |
| EVT-L9-04 | ศิษย์ลัทธิลอบโจมตี | MAP-046, 049 | Environmental | AGI ≥ 42 | เงาดำพุ่งเข้าใส่จากมุมมืดก่อนจะหายวับ | -HP 15%, เปิดทางลับ, +Gold 800-1500 | Common |

### 🌠 Map Level 10: ประตูสวรรค์และจุดจบ (MAP-050 ถึง MAP-052)
| Event ID | Event Name | Map ID / Area | Type | Condition | Description | Outcomes | Chance |
|:---|:---|:---|:---|:---|:---|:---|:---|
| EVT-L10-01 | วังเทพลับ | MAP-050, 051 | Treasure | STR ≥ 50, INT ≥ 50 | ประตูแสงเปิดออกเมื่อผู้เดินทางมีความสมดุล | +Gold 1000-2500, ได้ Item แดง, +EXP 200 | Rare |
| EVT-L10-02 | แสงเทพ | MAP-050-052 | Environmental | None | แสงจ้าส่องลงมาจากฟากฟ้าไร้เมฆ | +HP 50%, +MP 50%, +Buff (Divine Shield 3 Turn) | Uncommon |
| EVT-L10-03 | คัมภีร์เทพโบราณ | MAP-051, 052 | Treasure | LUCK ≥ 35 | ม้วนแสงลอยอยู่กลางอากาศ จับต้องได้ยาก | +EXP 300, ได้ Scroll แดง (แน่นอน), +MP 20% | Rare |
| EVT-L10-04 | พ่อค้าเทพลับ | MAP-050, 052 | NPC | None | เงาโปร่งแสงระดับตำนานเปิดแผงขายของสุดท้าย | ซื้ออุปกรณ์ระดับแดง/Mythic, หรือแลกเปลี่ยน Title/EXP | Uncommon |
| EVT-L10-05 | บันไดสู่นิรันดร์ | MAP-052 | Rest Spot | ชนะ Area Boss MAP-051 | จุดพักสุดท้ายก่อนเผชิญหน้าจุดจบของจักรวาล | +HP/MP 100%, ล้างสถานะทั้งหมด, +Buff (Final Stand) | Unique |

---

## ⚙️ IMPLEMENTATION NOTES (สำหรับ AI/Dev)
1. **Event Pool Selection:** ทุกการสำรวจ 1 ครั้ง ให้สุ่มจาก `Event Pool` ของ `map_level` นั้นๆ อัตราการเกิดอ้างอิงจาก `Chance` ในตาราง
2. **LUCK Adjustment:** 
   - `Positive` (Resource, Rest Spot, Treasure NPC): `45% + (LUCK × 0.15%)`
   - `Negative` (Trap, Environmental ร้าย): `20% - (LUCK × 0.1%)`
   - ปรับค่า `Neutral` ให้ผลรวมเป็น 100% เสมอ
3. **Condition Check:** หากผู้เล่นไม่ผ่าน `Condition` ให้ข้าม Event หรือแสดงผล `Fallback` (เช่น `+HP 5%` แทน `+HP 20%`)
4. **Outcome Processing:** ผลลัพธ์ต้องอัปเดตสถานะผู้เล่นทันทีตาม Schema `EventResult` ใน Game Bible Sec 13.6
5. **Non-Stacking:** Event ประเภท `Rest Spot` และ `Buff` จาก Event จะไม่ Stack หากเกิดซ้ำภายใน 3 Turn
6. **Data Format:** ตารางด้านบนสามารถ Parse เป็น JSON Array ได้โดยตรง โดย Map Key คือ `EventID`, `MapLevel`, `Type`, `Text`, `Outcome`, `Chance`

> 📜 *JIANGHU RPG — EVENT DATABASE v1.0 | Compatible with Game Bible v1.0, Map Database, & Item Database*