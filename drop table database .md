JIANGHU RPG — DROP TABLE DATABASE v1.0

ฐานข้อมูลการดรอปสำหรับศัตรูประเภท Normal และ Elite

เอกสารนี้ใช้ร่วมกับ Game Bible v1.0, Map Database และ Item Database
Drop Table แต่ละรายการถูกออกแบบให้ศัตรูใน enemy_database สามารถอ้างอิงผ่าน drop_table_id ได้โดยตรง
เพื่อลดความซ้ำซ้อนและรองรับการขยายเนื้อหาในอนาคต

กฎสำคัญ:

· ใช้กับ ศัตรูประเภท Normal และ Elite เท่านั้น
· Mini-Boss และ Area Boss มีระบบดรอปเฉพาะของตนเอง
· ค่า Equipment Drop Chance และ Rarity Weights ยึดตาม Game Bible เป็นหลัก แต่ปรับให้เหมาะสมกับ Tier และ Biome
· วัสดุและไอเทมใช้สอยต้องสอดคล้องกับธีมของพื้นที่

---

สารบัญ

1. Tier และ Biome
2. Forest (ป่า)
3. Mountain (ภูเขา)
4. Desert (ทะเลทราย)
5. Swamp (บึง/หุบเขาพิษ)
6. River & Lake (แม่น้ำ/ทะเลสาบ)
7. Cave (ถ้ำ)
8. Volcano (ภูเขาไฟ)
9. Ice (น้ำแข็ง)
10. Undead (สุสาน/ผีดิบ)
11. Demon (มาร/ปีศาจ)
12. Celestial (เซียน/สวรรค์)
13. Sect (สำนักยุทธ์)
14. Bandit (โจร)
15. ตารางสรุป Drop Rates จำแนกตาม Tier

---

Tier และ Biome

Tier Map Level Enemy Level โดยประมาณ ความยาก สีอุปกรณ์สูงสุด (Normal) สีอุปกรณ์สูงสุด (Elite)
1 1–2 1–22 ต้นเกม ฟ้า ม่วง
2 3–5 20–52 กลางเกม ม่วง ทอง
3 6–7 50–72 ท้ายเกม ทอง แดง
4 8–9 70–90 ระดับตำนาน แดง (หายาก) แดง (พบบ่อย)
5 10 88–90 ระดับเทพเจ้า แดง แดง (คุณภาพสูง)

หมายเหตุ: ค่า Equipment Drop Chance พื้นฐานสำหรับ Normal = 20% และ Elite = 60% (อ้างอิง Game Bible ข้อ 7.4)
ใน Drop Table แต่ละรายการสามารถปรับค่าเหล่านี้เล็กน้อย (±5%) ตามความเหมาะสมของพื้นที่

---

Forest (ป่า)

ใช้กับศัตรูในแมพ: ป่าไผ่, ป่าดงดิบ, ทุ่งหญ้า, ป่าตะวันออก, ป่าดงดิบเหนือเขา ฯลฯ

forest_t1_normal

รายการ รายละเอียด
Drop Table ID forest_t1_normal
Enemy Type Normal
Gold 3–12
Equipment Drop Chance 20%
Equipment Rarity Weights ขาว 50%, เขียว 30%, ฟ้า 15%, ม่วง 4%, ทอง 1%, แดง 0%
Material Drops หนังสัตว์ (25%), เขี้ยวสัตว์ (20%), กิ่งไม้ (30%), สมุนไพรป่า (15%)
Consumables ยาฟื้นฟูเล็กน้อย (10%)

forest_t1_elite

รายการ รายละเอียด
Drop Table ID forest_t1_elite
Enemy Type Elite
Gold 15–30
Equipment Drop Chance 60%
Equipment Rarity Weights ขาว 10%, เขียว 30%, ฟ้า 35%, ม่วง 20%, ทอง 5%, แดง 0%
Material Drops หนังสัตว์ (50%), เขี้ยวสัตว์ (40%), กิ่งไม้วิเศษ (20%), สมุนไพรหายาก (15%)
Consumables ยาฟื้นฟูเล็กน้อย (20%), ยาพลังภายในเล็กน้อย (10%)

forest_t2_normal

รายการ รายละเอียด
Drop Table ID forest_t2_normal
Enemy Type Normal
Gold 20–50
Equipment Drop Chance 22%
Equipment Rarity Weights ขาว 30%, เขียว 35%, ฟ้า 25%, ม่วง 8%, ทอง 2%, แดง 0%
Material Drops หนังสัตว์ (30%), เขี้ยวสัตว์ (25%), ไม้หอม (20%), สมุนไพรป่า (20%), ขนนก (15%)
Consumables ยาฟื้นฟูขนาดกลาง (15%), ยาพลังภายในขนาดกลาง (10%)

forest_t2_elite

รายการ รายละเอียด
Drop Table ID forest_t2_elite
Enemy Type Elite
Gold 50–120
Equipment Drop Chance 65%
Equipment Rarity Weights ขาว 5%, เขียว 20%, ฟ้า 35%, ม่วง 30%, ทอง 10%, แดง 0%
Material Drops หนังสัตว์ (50%), เขี้ยวสัตว์ (40%), ไม้หอมวิเศษ (25%), สมุนไพรหายาก (20%), ขนนกเงือก (15%)
Consumables ยาฟื้นฟูขนาดกลาง (25%), ยาพลังภายในขนาดกลาง (15%), ยาเร่งพลัง (5%)

forest_t3_normal

รายการ รายละเอียด
Drop Table ID forest_t3_normal
Enemy Type Normal
Gold 80–180
Equipment Drop Chance 20%
Equipment Rarity Weights ขาว 10%, เขียว 25%, ฟ้า 35%, ม่วง 20%, ทอง 8%, แดง 2%
Material Drops หนังสัตว์ (35%), เขี้ยวสัตว์ (30%), ไม้ทนทาน (25%), สมุนไพรชั้นสูง (20%), เกล็ดสัตว์ (15%)
Consumables ยาฟื้นฟูขนาดกลาง (20%), ยาพลังภายในขนาดกลาง (15%), ยาแก้พิษ (10%)

forest_t3_elite

รายการ รายละเอียด
Drop Table ID forest_t3_elite
Enemy Type Elite
Gold 150–350
Equipment Drop Chance 60%
Equipment Rarity Weights ขาว 0%, เขียว 10%, ฟ้า 30%, ม่วง 40%, ทอง 15%, แดง 5%
Material Drops หนังสัตว์ (50%), เขี้ยวสัตว์ (40%), ไม้ทนทานวิเศษ (30%), สมุนไพรชั้นสูง (25%), เกล็ดมังกร (5%)
Consumables ยาฟื้นฟูขนาดใหญ่ (20%), ยาพลังภายในขนาดใหญ่ (15%), ยาเร่งพลัง (10%), ยาอมตะชั่วคราว (3%)

สำหรับ Tier 4 และ 5 ในป่า (แมพระดับ 8–10) ให้ใช้ forest_t4_normal/elite และ forest_t5_normal/elite ซึ่งมีค่าใกล้เคียงกับ undead หรือ celestial ตามความเหมาะสม (ดูตารางสรุป)

---

Mountain (ภูเขา)

ใช้กับศัตรูในแมพ: เทือกเขา, หุบเขาสายลม, หุบเขาสายฟ้า, หุบเขามังกร ฯลฯ

mountain_t1_normal

รายการ รายละเอียด
Drop Table ID mountain_t1_normal
Enemy Type Normal
Gold 4–14
Equipment Drop Chance 20%
Equipment Rarity Weights ขาว 50%, เขียว 30%, ฟ้า 15%, ม่วง 4%, ทอง 1%, แดง 0%
Material Drops แร่เหล็ก (25%), หินก้อน (30%), ขนนกอินทรี (15%), หนังสัตว์ (20%)
Consumables ยาฟื้นฟูเล็กน้อย (10%)

mountain_t1_elite

รายการ รายละเอียด
Drop Table ID mountain_t1_elite
Enemy Type Elite
Gold 18–35
Equipment Drop Chance 60%
Equipment Rarity Weights ขาว 10%, เขียว 30%, ฟ้า 35%, ม่วง 20%, ทอง 5%, แดง 0%
Material Drops แร่เหล็ก (50%), หินก้อน (40%), ขนนกอินทรี (25%), หนังสัตว์ (30%)
Consumables ยาฟื้นฟูเล็กน้อย (20%), ยาพลังภายในเล็กน้อย (10%)

mountain_t2_normal

รายการ รายละเอียด
Drop Table ID mountain_t2_normal
Enemy Type Normal
Gold 25–60
Equipment Drop Chance 22%
Equipment Rarity Weights ขาว 30%, เขียว 35%, ฟ้า 25%, ม่วง 8%, ทอง 2%, แดง 0%
Material Drops แร่เหล็ก (30%), หินก้อน (25%), แร่เงิน (20%), หนังสัตว์ (20%), ขนนกยักษ์ (15%)
Consumables ยาฟื้นฟูขนาดกลาง (15%), ยาพลังภายในขนาดกลาง (10%)

mountain_t2_elite

รายการ รายละเอียด
Drop Table ID mountain_t2_elite
Enemy Type Elite
Gold 60–150
Equipment Drop Chance 65%
Equipment Rarity Weights ขาว 5%, เขียว 20%, ฟ้า 35%, ม่วง 30%, ทอง 10%, แดง 0%
Material Drops แร่เหล็ก (50%), หินก้อน (40%), แร่เงิน (30%), หนังสัตว์ (35%), ขนนกอินทรีทอง (10%)
Consumables ยาฟื้นฟูขนาดกลาง (25%), ยาพลังภายในขนาดกลาง (15%), ยาเพิ่มพลังโจมตี (5%)

Tier 3–5 สำหรับภูเขา: ปรับค่า Gold และ Rarity Weights ตามตารางสรุป และเพิ่มวัสดุระดับสูง เช่น แร่ทองคำ, คริสตัลภูเขา, เกล็ดมังกร ฯลฯ

---

Desert (ทะเลทราย)

ใช้กับศัตรูในแมพ: ทะเลทรายดำ, หุบเขาทราย ฯลฯ

desert_t1_normal

รายการ รายละเอียด
Drop Table ID desert_t1_normal
Enemy Type Normal
Gold 3–12
Equipment Drop Chance 20%
Equipment Rarity Weights ขาว 50%, เขียว 30%, ฟ้า 15%, ม่วง 4%, ทอง 1%, แดง 0%
Material Drops หนังอูฐ (20%), เขี้ยวแมงป่อง (15%), ทรายวิเศษ (25%), กระดูกสัตว์ (20%)
Consumables ยาฟื้นฟูเล็กน้อย (10%), น้ำดื่ม (15%)

desert_t1_elite

รายการ รายละเอียด
Drop Table ID desert_t1_elite
Enemy Type Elite
Gold 15–30
Equipment Drop Chance 60%
Equipment Rarity Weights ขาว 10%, เขียว 30%, ฟ้า 35%, ม่วง 20%, ทอง 5%, แดง 0%
Material Drops หนังอูฐ (40%), เขี้ยวแมงป่อง (30%), ทรายวิเศษ (35%), กระดูกสัตว์ (30%), แร่ทะเลทราย (10%)
Consumables ยาฟื้นฟูเล็กน้อย (20%), ยาพลังภายในเล็กน้อย (10%)

desert_t2_normal

รายการ รายละเอียด
Drop Table ID desert_t2_normal
Enemy Type Normal
Gold 20–50
Equipment Drop Chance 22%
Equipment Rarity Weights ขาว 30%, เขียว 35%, ฟ้า 25%, ม่วง 8%, ทอง 2%, แดง 0%
Material Drops หนังอูฐ (25%), เขี้ยวแมงป่อง (20%), ทรายวิเศษ (30%), แร่ทองแดง (20%), ไข่มุกทะเลทราย (5%)
Consumables ยาฟื้นฟูขนาดกลาง (15%), ยาพลังภายในขนาดกลาง (10%)

Tier 3–5 สำหรับทะเลทราย: เพิ่มวัสดุอย่าง แร่ทองคำ, กระดูกมังกรทราย, น้ำอมฤต ฯลฯ

---

Swamp (บึง/หุบเขาพิษ)

ใช้กับศัตรูในแมพ: หุบเขาหมอกพิษ, หุบเหวหมื่นพิษ, ป่าดงดิบพิษ ฯลฯ

swamp_t1_normal

รายการ รายละเอียด
Drop Table ID swamp_t1_normal
Enemy Type Normal
Gold 4–13
Equipment Drop Chance 20%
Equipment Rarity Weights ขาว 50%, เขียว 30%, ฟ้า 15%, ม่วง 4%, ทอง 1%, แดง 0%
Material Drops หนังกบ (20%), ต่อมพิษ (25%), สาหร่ายพิษ (20%), ไม้ผุ (15%)
Consumables ยาแก้พิษ (10%), ยาฟื้นฟูเล็กน้อย (10%)

swamp_t1_elite

รายการ รายละเอียด
Drop Table ID swamp_t1_elite
Enemy Type Elite
Gold 18–35
Equipment Drop Chance 60%
Equipment Rarity Weights ขาว 10%, เขียว 30%, ฟ้า 35%, ม่วง 20%, ทอง 5%, แดง 0%
Material Drops หนังกบ (40%), ต่อมพิษ (35%), สาหร่ายพิษ (30%), ไม้ผุ (25%), คริสตัลพิษ (10%)
Consumables ยาแก้พิษ (20%), ยาฟื้นฟูเล็กน้อย (20%)

swamp_t2_normal

รายการ รายละเอียด
Drop Table ID swamp_t2_normal
Enemy Type Normal
Gold 25–60
Equipment Drop Chance 22%
Equipment Rarity Weights ขาว 30%, เขียว 35%, ฟ้า 25%, ม่วง 8%, ทอง 2%, แดง 0%
Material Drops หนังกบ (25%), ต่อมพิษ (30%), สาหร่ายพิษ (25%), ไม้พิษ (20%), น้ำค้างพิษ (10%)
Consumables ยาแก้พิษ (20%), ยาฟื้นฟูขนาดกลาง (15%), ยากำจัดพิษ (5%)

Tier 3–5 สำหรับบึง: เพิ่มวัสดุอย่าง ต่อมพิษมังกร, สมุนไพรต้องห้าม, หยกพิษ ฯลฯ

---

River & Lake (แม่น้ำ/ทะเลสาบ)

ใช้กับศัตรูในแมพ: แม่น้ำ, ทะเลสาบ, ลำธาร ฯลฯ

river_t1_normal

รายการ รายละเอียด
Drop Table ID river_t1_normal
Enemy Type Normal
Gold 3–11
Equipment Drop Chance 20%
Equipment Rarity Weights ขาว 50%, เขียว 30%, ฟ้า 15%, ม่วง 4%, ทอง 1%, แดง 0%
Material Drops เกล็ดปลา (25%), ก้างปลา (20%), ไข่มุกน้ำจืด (5%), สาหร่ายน้ำ (20%)
Consumables ยาฟื้นฟูเล็กน้อย (10%)

river_t1_elite

รายการ รายละเอียด
Drop Table ID river_t1_elite
Enemy Type Elite
Gold 15–30
Equipment Drop Chance 60%
Equipment Rarity Weights ขาว 10%, เขียว 30%, ฟ้า 35%, ม่วง 20%, ทอง 5%, แดง 0%
Material Drops เกล็ดปลา (40%), ก้างปลา (30%), ไข่มุกน้ำจืด (15%), สาหร่ายน้ำ (30%), หนวดปลาดุก (10%)
Consumables ยาฟื้นฟูเล็กน้อย (20%), ยาพลังภายในเล็กน้อย (10%)

สำหรับ Tier สูงขึ้น: ไข่มุกน้ำลึก, เกล็ดมังกรน้ำ, น้ำอมฤต ฯลฯ

---

Cave (ถ้ำ)

ใช้กับศัตรูในแมพ: ถ้ำมังกรซ่อน, ถ้ำแร่, ถ้ำลับ ฯลฯ

cave_t1_normal

รายการ รายละเอียด
Drop Table ID cave_t1_normal
Enemy Type Normal
Gold 5–15
Equipment Drop Chance 20%
Equipment Rarity Weights ขาว 50%, เขียว 30%, ฟ้า 15%, ม่วง 4%, ทอง 1%, แดง 0%
Material Drops แร่เหล็ก (25%), หินก้อน (30%), ตะไคร่น้ำ (20%), ขนค้างคาว (15%)
Consumables ยาฟื้นฟูเล็กน้อย (10%)

cave_t1_elite

รายการ รายละเอียด
Drop Table ID cave_t1_elite
Enemy Type Elite
Gold 20–40
Equipment Drop Chance 60%
Equipment Rarity Weights ขาว 10%, เขียว 30%, ฟ้า 35%, ม่วง 20%, ทอง 5%, แดง 0%
Material Drops แร่เหล็ก (40%), หินก้อน (35%), ตะไคร่น้ำ (25%), ขนค้างคาว (20%), คริสตัลถ้ำ (10%)
Consumables ยาฟื้นฟูเล็กน้อย (20%), ยาพลังภายในเล็กน้อย (10%)

cave_t2_normal

รายการ รายละเอียด
Drop Table ID cave_t2_normal
Enemy Type Normal
Gold 30–70
Equipment Drop Chance 22%
Equipment Rarity Weights ขาว 30%, เขียว 35%, ฟ้า 25%, ม่วง 8%, ทอง 2%, แดง 0%
Material Drops แร่เหล็ก (25%), หินก้อน (20%), แร่เงิน (20%), คริสตัลถ้ำ (15%), หนังค้างคาว (15%)
Consumables ยาฟื้นฟูขนาดกลาง (15%), ยาพลังภายในขนาดกลาง (10%)

Tier 3–5 สำหรับถ้ำ: แร่ทองคำ, แร่ลับ, คริสตัลพลังงาน, เกล็ดมังกร ฯลฯ

---

Volcano (ภูเขาไฟ)

ใช้กับศัตรูในแมพ: ภูเขาไฟโบราณ, หุบเขาลาวา ฯลฯ

volcano_t2_normal

รายการ รายละเอียด
Drop Table ID volcano_t2_normal
Enemy Type Normal
Gold 35–80
Equipment Drop Chance 22%
Equipment Rarity Weights ขาว 30%, เขียว 35%, ฟ้า 25%, ม่วง 8%, ทอง 2%, แดง 0%
Material Drops เถ้าถ่าน (25%), หินลาวา (20%), แร่ทองแดง (20%), ไข่มังกรเพลิง (5%)
Consumables ยาฟื้นฟูขนาดกลาง (15%), ยากันไฟ (10%)

volcano_t2_elite

รายการ รายละเอียด
Drop Table ID volcano_t2_elite
Enemy Type Elite
Gold 80–200
Equipment Drop Chance 65%
Equipment Rarity Weights ขาว 5%, เขียว 20%, ฟ้า 35%, ม่วง 30%, ทอง 10%, แดง 0%
Material Drops เถ้าถ่าน (40%), หินลาวา (35%), แร่ทองแดง (30%), ไข่มังกรเพลิง (15%), คริสตัลเพลิง (10%)
Consumables ยาฟื้นฟูขนาดกลาง (25%), ยาพลังภายในขนาดกลาง (15%), ยากันไฟ (20%), ยาเร่งพลังเพลิง (5%)

Tier 3–5 สำหรับภูเขาไฟ: คริสตัลลาวา, เกล็ดมังกรเพลิง, แร่ยมทูต ฯลฯ

---

Ice (น้ำแข็ง)

ใช้กับศัตรูในแมพ: ดินแดนน้ำแข็ง, ทะเลสาบกระจก, ถ้ำน้ำแข็ง ฯลฯ

ice_t2_normal

รายการ รายละเอียด
Drop Table ID ice_t2_normal
Enemy Type Normal
Gold 30–70
Equipment Drop Chance 22%
Equipment Rarity Weights ขาว 30%, เขียว 35%, ฟ้า 25%, ม่วง 8%, ทอง 2%, แดง 0%
Material Drops เศษน้ำแข็ง (25%), ขนหิมะ (20%), เกล็ดน้ำแข็ง (15%), แร่เงิน (20%)
Consumables ยาฟื้นฟูขนาดกลาง (15%), ยากันหนาว (10%)

ice_t2_elite

รายการ รายละเอียด
Drop Table ID ice_t2_elite
Enemy Type Elite
Gold 70–180
Equipment Drop Chance 65%
Equipment Rarity Weights ขาว 5%, เขียว 20%, ฟ้า 35%, ม่วง 30%, ทอง 10%, แดง 0%
Material Drops เศษน้ำแข็ง (40%), ขนหิมะ (35%), เกล็ดน้ำแข็ง (30%), แร่เงิน (30%), คริสตัลน้ำแข็ง (15%)
Consumables ยาฟื้นฟูขนาดกลาง (25%), ยาพลังภายในขนาดกลาง (15%), ยากันหนาว (20%), ยาน้ำแข็ง (5%)

Tier 3–5 สำหรับน้ำแข็ง: เกล็ดมังกรน้ำแข็ง, แร่ eternity, น้ำอมฤตเยือกแข็ง ฯลฯ

---

Undead (สุสาน/ผีดิบ)

ใช้กับศัตรูในแมพ: สุสานกระบี่, สุสานจักรพรรดิ, สุสานเทพเจ้า ฯลฯ

undead_t2_normal

รายการ รายละเอียด
Drop Table ID undead_t2_normal
Enemy Type Normal
Gold 25–60
Equipment Drop Chance 22%
Equipment Rarity Weights ขาว 30%, เขียว 35%, ฟ้า 25%, ม่วง 8%, ทอง 2%, แดง 0%
Material Drops กระดูก (25%), เศษผ้าห่อศพ (20%), วิญญาณสลาย (15%), โลงศพเศษ (10%)
Consumables ยาฟื้นฟูขนาดกลาง (15%), น้ำมันเรืองแสง (10%)

undead_t2_elite

รายการ รายละเอียด
Drop Table ID undead_t2_elite
Enemy Type Elite
Gold 60–150
Equipment Drop Chance 65%
Equipment Rarity Weights ขาว 5%, เขียว 20%, ฟ้า 35%, ม่วง 30%, ทอง 10%, แดง 0%
Material Drops กระดูก (40%), เศษผ้าห่อศพ (35%), วิญญาณสลาย (25%), โลงศพเศษ (20%), ดวงวิญญาณ (10%)
Consumables ยาฟื้นฟูขนาดกลาง (25%), ยาพลังภายในขนาดกลาง (15%), ยาขับไล่วิญญาณ (10%)

undead_t3_normal

รายการ รายละเอียด
Drop Table ID undead_t3_normal
Enemy Type Normal
Gold 100–220
Equipment Drop Chance 20%
Equipment Rarity Weights ขาว 10%, เขียว 25%, ฟ้า 35%, ม่วง 20%, ทอง 8%, แดง 2%
Material Drops กระดูกโบราณ (30%), เศษผ้าห่อศพ (25%), วิญญาณสลาย (25%), คริสตัลความตาย (10%)
Consumables ยาฟื้นฟูขนาดใหญ่ (20%), ยาพลังภายในขนาดใหญ่ (15%), ยาขับไล่วิญญาณ (15%)

undead_t3_elite

รายการ รายละเอียด
Drop Table ID undead_t3_elite
Enemy Type Elite
Gold 200–450
Equipment Drop Chance 60%
Equipment Rarity Weights ขาว 0%, เขียว 10%, ฟ้า 30%, ม่วง 40%, ทอง 15%, แดง 5%
Material Drops กระดูกโบราณ (40%), เศษผ้าห่อศพ (35%), วิญญาณสลาย (35%), คริสตัลความตาย (20%), หัวใจผีดิบ (5%)
Consumables ยาฟื้นฟูขนาดใหญ่ (25%), ยาพลังภายในขนาดใหญ่ (20%), ยาขับไล่วิญญาณ (20%), ยาพิษสลาย (5%)

Tier 4–5 สำหรับ undead: วัสดุระดับเทพ เช่น กระดูกจักรพรรดิ, วิญญาณบรรพกาล, แดง 20% สำหรับ elite

---

Demon (มาร/ปีศาจ)

ใช้กับศัตรูในแมพ: ตำหนักมาร, ดินแดนปีศาจ, วังเทพมาร ฯลฯ

demon_t2_normal

รายการ รายละเอียด
Drop Table ID demon_t2_normal
Enemy Type Normal
Gold 30–70
Equipment Drop Chance 22%
Equipment Rarity Weights ขาว 30%, เขียว 35%, ฟ้า 25%, ม่วง 8%, ทอง 2%, แดง 0%
Material Drops เขี้ยวมาร (20%), เล็บมาร (20%), หนังมาร (15%), เลือดมาร (10%)
Consumables ยาฟื้นฟูขนาดกลาง (15%), ยาพลังภายในขนาดกลาง (10%)

demon_t2_elite

รายการ รายละเอียด
Drop Table ID demon_t2_elite
Enemy Type Elite
Gold 80–200
Equipment Drop Chance 65%
Equipment Rarity Weights ขาว 5%, เขียว 20%, ฟ้า 35%, ม่วง 30%, ทอง 10%, แดง 0%
Material Drops เขี้ยวมาร (40%), เล็บมาร (35%), หนังมาร (30%), เลือดมาร (25%), คริสตัลมาร (10%)
Consumables ยาฟื้นฟูขนาดกลาง (25%), ยาพลังภายในขนาดกลาง (15%), ยากันมาร (10%)

demon_t3_normal

รายการ รายละเอียด
Drop Table ID demon_t3_normal
Enemy Type Normal
Gold 120–250
Equipment Drop Chance 20%
Equipment Rarity Weights ขาว 10%, เขียว 25%, ฟ้า 35%, ม่วง 20%, ทอง 8%, แดง 2%
Material Drops เขี้ยวมาร (30%), เล็บมาร (25%), หนังมาร (25%), เลือดมาร (20%), คริสตัลมาร (15%)
Consumables ยาฟื้นฟูขนาดใหญ่ (20%), ยาพลังภายในขนาดใหญ่ (15%), ยากันมาร (15%)

demon_t3_elite

รายการ รายละเอียด
Drop Table ID demon_t3_elite
Enemy Type Elite
Gold 250–550
Equipment Drop Chance 60%
Equipment Rarity Weights ขาว 0%, เขียว 10%, ฟ้า 30%, ม่วง 40%, ทอง 15%, แดง 5%
Material Drops เขี้ยวมาร (40%), เล็บมาร (35%), หนังมาร (35%), เลือดมาร (30%), คริสตัลมาร (25%), หัวใจมาร (5%)
Consumables ยาฟื้นฟูขนาดใหญ่ (25%), ยาพลังภายในขนาดใหญ่ (20%), ยากันมาร (20%), ยาควบคุมมาร (5%)

Tier 4–5 สำหรับ demon: วัสดุระดับมหาเทพ, แดง 10–15% สำหรับ elite

---

Celestial (เซียน/สวรรค์)

ใช้กับศัตรูในแมพ: ดินแดนเสียงสวรรค์, สวรรค์ชั้นเก้า, โลกเซียน ฯลฯ

celestial_t3_normal

รายการ รายละเอียด
Drop Table ID celestial_t3_normal
Enemy Type Normal
Gold 150–300
Equipment Drop Chance 20%
Equipment Rarity Weights ขาว 10%, เขียว 25%, ฟ้า 35%, ม่วง 20%, ทอง 8%, แดง 2%
Material Drops ขนนกเซียน (25%), สายใยสวรรค์ (20%), น้ำอมฤตหยด (15%), เศษหยกสวรรค์ (10%)
Consumables ยาฟื้นฟูสวรรค์ (20%), ยาพลังภายในสวรรค์ (15%), ยาล้างบาป (10%)

celestial_t3_elite

รายการ รายละเอียด
Drop Table ID celestial_t3_elite
Enemy Type Elite
Gold 300–700
Equipment Drop Chance 60%
Equipment Rarity Weights ขาว 0%, เขียว 10%, ฟ้า 30%, ม่วง 40%, ทอง 15%, แดง 5%
Material Drops ขนนกเซียน (40%), สายใยสวรรค์ (35%), น้ำอมฤตหยด (30%), เศษหยกสวรรค์ (25%), ดอกไม้เซียน (10%)
Consumables ยาฟื้นฟูสวรรค์ (30%), ยาพลังภายในสวรรค์ (25%), ยาล้างบาป (20%), ยาเซียน (5%)

celestial_t4_normal

รายการ รายละเอียด
Drop Table ID celestial_t4_normal
Enemy Type Normal
Gold 300–600
Equipment Drop Chance 20%
Equipment Rarity Weights ขาว 0%, เขียว 15%, ฟ้า 35%, ม่วง 30%, ทอง 15%, แดง 5%
Material Drops ขนนกเซียน (30%), สายใยสวรรค์ (25%), น้ำอมฤตหยด (25%), เศษหยกสวรรค์ (20%), แสงธรรม (10%)
Consumables ยาฟื้นฟูสวรรค์ (25%), ยาพลังภายในสวรรค์ (20%), ยาล้างบาป (15%), ยาเซียน (10%)

celestial_t4_elite

รายการ รายละเอียด
Drop Table ID celestial_t4_elite
Enemy Type Elite
Gold 500–1200
Equipment Drop Chance 60%
Equipment Rarity Weights ขาว 0%, เขียว 0%, ฟ้า 20%, ม่วง 45%, ทอง 25%, แดง 10%
Material Drops ขนนกเซียน (45%), สายใยสวรรค์ (40%), น้ำอมฤตหยด (40%), เศษหยกสวรรค์ (35%), ดอกไม้เซียน (20%), แสงธรรม (15%)
Consumables ยาฟื้นฟูสวรรค์ (35%), ยาพลังภายในสวรรค์ (30%), ยาล้างบาป (25%), ยาเซียน (15%)

Tier 5 สำหรับ celestial: แดง 15–20% สำหรับ elite, เพิ่มวัสดุเช่น วิญญาณบรรพกาล, แสงสว่างนิรันดร์

---

Sect (สำนักยุทธ์)

ใช้กับศัตรูในแมพ: สำนักบู๊ตึ๊ง, วัดเส้าหลิน, สำนักเอ๋อเหมย, สำนักเซียนลับ ฯลฯ

sect_t1_normal

รายการ รายละเอียด
Drop Table ID sect_t1_normal
Enemy Type Normal
Gold 5–15
Equipment Drop Chance 20%
Equipment Rarity Weights ขาว 50%, เขียว 30%, ฟ้า 15%, ม่วง 4%, ทอง 1%, แดง 0%
Material Drops ม้วนคัมภีร์เก่า (20%), กระดาษชำระ (25%), หมึกจีน (15%), ผ้าไหม (10%)
Consumables ยาฟื้นฟูเล็กน้อย (10%)

sect_t1_elite

รายการ รายละเอียด
Drop Table ID sect_t1_elite
Enemy Type Elite
Gold 20–40
Equipment Drop Chance 60%
Equipment Rarity Weights ขาว 10%, เขียว 30%, ฟ้า 35%, ม่วง 20%, ทอง 5%, แดง 0%
Material Drops ม้วนคัมภีร์เก่า (35%), กระดาษชำระ (30%), หมึกจีน (25%), ผ้าไหม (20%), ยันต์คุ้มภัย (10%)
Consumables ยาฟื้นฟูเล็กน้อย (20%), ยาพลังภายในเล็กน้อย (10%)

sect_t2_normal

รายการ รายละเอียด
Drop Table ID sect_t2_normal
Enemy Type Normal
Gold 30–70
Equipment Drop Chance 22%
Equipment Rarity Weights ขาว 30%, เขียว 35%, ฟ้า 25%, ม่วง 8%, ทอง 2%, แดง 0%
Material Drops ม้วนคัมภีร์เก่า (25%), กระดาษชำระ (20%), หมึกจีน (20%), ผ้าไหม (20%), ยันต์คุ้มภัย (10%)
Consumables ยาฟื้นฟูขนาดกลาง (15%), ยาพลังภายในขนาดกลาง (10%)

sect_t2_elite

รายการ รายละเอียด
Drop Table ID sect_t2_elite
Enemy Type Elite
Gold 80–200
Equipment Drop Chance 65%
Equipment Rarity Weights ขาว 5%, เขียว 20%, ฟ้า 35%, ม่วง 30%, ทอง 10%, แดง 0%
Material Drops ม้วนคัมภีร์เก่า (40%), กระดาษชำระ (35%), หมึกจีน (30%), ผ้าไหม (30%), ยันต์คุ้มภัย (20%), คัมภีร์ลับ (5%)
Consumables ยาฟื้นฟูขนาดกลาง (25%), ยาพลังภายในขนาดกลาง (15%), ยาเร่งพลัง (10%)

Tier 3–5 สำหรับ sect: เพิ่มวัสดุเช่น คัมภีร์ต้องห้าม, ของที่ระลึกสำนัก, ยาเซียน ฯลฯ ปรับ Rarity Weights ตามตารางสรุป

---

Bandit (โจร)

ใช้กับศัตรูในแมพ: โจรป่า, โจรทะเลทราย, โจรแม่น้ำ, โจรทั่วไป ฯลฯ

bandit_t1_normal

รายการ รายละเอียด
Drop Table ID bandit_t1_normal
Enemy Type Normal
Gold 6–20
Equipment Drop Chance 20%
Equipment Rarity Weights ขาว 50%, เขียว 30%, ฟ้า 15%, ม่วง 4%, ทอง 1%, แดง 0%
Material Drops ขวดเหล้า (25%), เหรียญทองแดง (30%), ผ้าขี้ริ้ว (20%), กระดาษโน้ต (10%)
Consumables ยาฟื้นฟูเล็กน้อย (10%)

bandit_t1_elite

รายการ รายละเอียด
Drop Table ID bandit_t1_elite
Enemy Type Elite
Gold 25–60
Equipment Drop Chance 60%
Equipment Rarity Weights ขาว 10%, เขียว 30%, ฟ้า 35%, ม่วง 20%, ทอง 5%, แดง 0%
Material Drops ขวดเหล้า (40%), เหรียญทองแดง (50%), ผ้าขี้ริ้ว (30%), กระดาษโน้ต (20%), กุญแจโจร (5%)
Consumables ยาฟื้นฟูเล็กน้อย (20%), ยาพลังภายในเล็กน้อย (10%)

bandit_t2_normal

รายการ รายละเอียด
Drop Table ID bandit_t2_normal
Enemy Type Normal
Gold 30–80
Equipment Drop Chance 22%
Equipment Rarity Weights ขาว 30%, เขียว 35%, ฟ้า 25%, ม่วง 8%, ทอง 2%, แดง 0%
Material Drops ขวดเหล้า (25%), เหรียญเงิน (30%), ผ้าขี้ริ้ว (20%), กระดาษโน้ต (15%), แผนที่ขุมทรัพย์ปลอม (5%)
Consumables ยาฟื้นฟูขนาดกลาง (15%), ยาพลังภายในขนาดกลาง (10%)

Tier สูงขึ้นสำหรับ bandit: เพิ่มวัสดุระดับสูงขึ้น เช่น เหรียญทอง, ของโจร, กุญแจห้องสมบัติ ฯลฯ

---

ตารางสรุป Drop Rates จำแนกตาม Tier

ตารางด้านล่างแสดงค่า Equipment Drop Chance และ Rarity Weights สำหรับ Normal/Elite ในแต่ละ Tier
สามารถใช้เป็นแนวทางในการสร้าง Drop Table ใหม่เพิ่มเติมได้

Tier 1 (Map Level 1–2)

Enemy Type Drop Chance ขาว เขียว ฟ้า ม่วง ทอง แดง
Normal 20% 50% 30% 15% 4% 1% 0%
Elite 60% 10% 30% 35% 20% 5% 0%

Tier 2 (Map Level 3–5)

Enemy Type Drop Chance ขาว เขียว ฟ้า ม่วง ทอง แดง
Normal 22% 30% 35% 25% 8% 2% 0%
Elite 65% 5% 20% 35% 30% 10% 0%

Tier 3 (Map Level 6–7)

Enemy Type Drop Chance ขาว เขียว ฟ้า ม่วง ทอง แดง
Normal 20% 10% 25% 35% 20% 8% 2%
Elite 60% 0% 10% 30% 40% 15% 5%

Tier 4 (Map Level 8–9)

Enemy Type Drop Chance ขาว เขียว ฟ้า ม่วง ทอง แดง
Normal 20% 0% 15% 35% 30% 15% 5%
Elite 60% 0% 0% 20% 45% 25% 10%

Tier 5 (Map Level 10)

Enemy Type Drop Chance ขาว เขียว ฟ้า ม่วง ทอง แดง
Normal 20% 0% 0% 20% 35% 25% 20%
Elite 60% 0% 0% 0% 30% 40% 30%

---

หมายเหตุการใช้งาน

· Drop Table แต่ละรายการสามารถนำไปอ้างอิงใน enemy_database.md ผ่านฟิลด์ drop_table_id
· หากต้องการปรับแต่งเพิ่มเติม (เช่น เพิ่ม Material หรือ Consumable เฉพาะ) ให้สร้าง Drop Table ใหม่โดยยึดตามโครงสร้างข้างต้น
· ค่า Gold ที่แสดงเป็นช่วงคร่าว ๆ ควรปรับตาม Enemy_Level × 3–8 สำหรับ Normal และ ×15–25 สำหรับ Elite (Game Bible 11.2)
· ไอเทมใน Material Drops และ Consumables เป็นชื่อสมมติเพื่อใช้ในระบบเกม หากต้องการเชื่อมโยงกับ item_database จริง ควรเพิ่มไอเทมเหล่านั้นลงในฐานข้อมูลไอเทมก่อน

---

JIANGHU RPG — DROP TABLE DATABASE v1.0
Compatible with Game Bible v1.0, Map Database v1.0, and Item Database v1.0