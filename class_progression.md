class_progression.md

ระบบการเลื่อนขั้นพลัง (Realm Progression)

เอกสารนี้กำหนดข้อมูลของการเลื่อนขั้นพลังใน Jianghu RPG ซึ่งเป็นระบบเพิ่มเติมจาก Advancement System ใน Game Bible หัวข้อ 3 โดยโบนัสที่ระบุด้านล่างเป็นโบนัสสะสมที่ผู้เล่นได้รับเมื่อเลื่อนขั้นถึงระดับนั้นแล้ว (รวมโบนัสจากขั้นก่อนหน้าด้วย)

---

1. Realm Breakdown

Lv 1 — จอมยุทธ์ฝึกหัด

· โบนัส STATS: STR +0, CON +0, AGI +0, INT +0, LUCK +0
· โบนัส HP: +0
· โบนัส MP: +0
· โบนัสพิเศษ: ไม่มี
· Cultivation Bonus: ไม่มี
· Realm Power Multiplier: 1.00x
· Realm Title: "ผู้เยาว์ที่ก้าวเข้าสู่ยุทธภพ"

Lv 10 — จอมยุทธ์

· โบนัส STATS: STR +3, CON +3, AGI +3, INT +3, LUCK +2
· โบนัส HP: +100
· โบนัส MP: +80
· โบนัสพิเศษ: Armor Penetration +5% — การโจมตีทุกประเภทจะเจาะเกราะศัตรูเพิ่มขึ้น 5%
· Cultivation Bonus: ฟื้นฟู HP 2% ของ Max HP ทุกครั้งที่เริ่มเทิร์นของตนเอง
· Realm Power Multiplier: 1.15x
· Realm Title: "ดาวรุ่งแห่งยุทธภพ"

Lv 20 — ยอดฝีมือ

· โบนัส STATS: STR +6, CON +6, AGI +6, INT +6, LUCK +4
· โบนัส HP: +250
· โบนัส MP: +200
· โบนัสพิเศษ: Cooldown Reduction +1 — Cooldown ของ Active Skill ทั้งหมดลดลง 1 เทิร์น (ขั้นต่ำ 1)
· Cultivation Bonus: เมื่อใช้สกิล [Physical] จะมีโอกาส 15% ที่จะไม่ติด Cooldown
· Realm Power Multiplier: 1.35x
· Realm Title: "ผู้เดินบนเส้นทางยุทธ"

Lv 30 — ปรมาจารย์

· โบนัส STATS: STR +10, CON +10, AGI +10, INT +10, LUCK +6
· โบนัส HP: +450
· โบนัส MP: +350
· โบนัสพิเศษ: Debuff Resistance +20% — โอกาสต้านทาน Debuff ทุกชนิดเพิ่มขึ้น 20%
· Cultivation Bonus: เมื่อถูกโจมตีและได้รับความเสียหายมากกว่า 30% ของ Max HP ในครั้งเดียว จะปล่อยคลื่นกระแทกทำดาเมจ [Internal] 100% INT แก่ศัตรูทั้งหมด (Trigger ได้ 1 ครั้งต่อการต่อสู้)
· Realm Power Multiplier: 1.60x
· Realm Title: "ผู้สั่นสะเทือนยุทธภพ"

Lv 40 — ราชันยุทธ์

· โบนัส STATS: STR +15, CON +15, AGI +15, INT +15, LUCK +9
· โบนัส HP: +700
· โบนัส MP: +550
· โบนัสพิเศษ: Lifesteal Overheal Conversion +30% — การดูดเลือดที่เกิน Max HP จะเปลี่ยนเป็นโล่ (Shield) คิดเป็น 30% ของส่วนที่เกิน
· Cultivation Bonus: ทุกครั้งที่โจมตีคริติคอล จะเพิ่ม ACCURACY ของตนเอง 5% เป็นเวลา 2 เทิร์น (ซ้อนทับได้สูงสุด 3 ชั้น)
· Realm Power Multiplier: 1.90x
· Realm Title: "เจ้าสำนักผู้เกรียงไกร"

Lv 50 — เซียนยุทธ์

· โบนัส STATS: STR +21, CON +21, AGI +21, INT +21, LUCK +13
· โบนัส HP: +1000
· โบนัส MP: +800
· โบนัสพิเศษ: First Strike Advantage — ในทุกการต่อสู้ จะโจมตีก่อนเสมอในเทิร์นแรก (ข้ามการคำนวณ AGI)
· Cultivation Bonus: เมื่อใช้สกิล [Internal] จะฟื้นฟู MP 5% ของ Max MP ทันที
· Realm Power Multiplier: 2.30x
· Realm Title: "ผู้ล่วงรู้สัจธรรมแห่งยุทธ์"

Lv 60 — เทพยุทธ์

· โบนัส STATS: STR +28, CON +28, AGI +28, INT +28, LUCK +18
· โบนัส HP: +1400
· โบนัส MP: +1100
· โบนัสพิเศษ: Damage Reflection +15% — สะท้อนความเสียหาย 15% ที่ได้รับกลับไปยังผู้โจมตี (คำนวณก่อนการลด damage)
· Cultivation Bonus: เมื่อ HP ต่ำกว่า 40% การโจมตีทุกครั้งจะฟื้นฟู HP เท่ากับ 10% ของความเสียหายที่ทำได้
· Realm Power Multiplier: 2.80x
· Realm Title: "จอมยุทธ์เหนือมนุษย์"

Lv 70 — จักรพรรดิยุทธ์

· โบนัส STATS: STR +36, CON +36, AGI +36, INT +36, LUCK +24
· โบนัส HP: +1900
· โบนัส MP: +1500
· โบนัสพิเศษ: Mana Steal Efficiency +50% — การดูด MP (MANA_STEAL) มีประสิทธิภาพเพิ่มขึ้น 50%
· Cultivation Bonus: ทุกครั้งที่สังหารศัตรู จะได้รับ Action เพิ่ม 1 ครั้งในเทิร์นนั้น (สูงสุด 1 ครั้งต่อเทิร์น)
· Realm Power Multiplier: 3.50x
· Realm Title: "ผู้ครองยุทธภพใต้หล้า"

Lv 80 — มหาเทพยุทธ์

· โบนัส STATS: STR +45, CON +45, AGI +45, INT +45, LUCK +30
· โบนัส HP: +2500
· โบนัส MP: +2000
· โบนัสพิเศษ: Mystic Resistance — ภูมิคุ้มกันต่อสถานะ Stun, Silence, และ Petrify (หิน)
· Cultivation Bonus: เมื่อใช้สกิลระดับ Epic (ม่วง) ขึ้นไป จะลด MP Cost ของสกิลนั้นลง 50%
· Realm Power Multiplier: 4.50x
· Realm Title: "ผู้ก้าวพ้นขีดจำกัดมนุษย์"

---

2. Cultivation Bonus สรุป

ขั้นพลัง Cultivation Bonus Effect
จอมยุทธ์ฝึกหัด ไม่มี
จอมยุทธ์ ฟื้นฟู HP 2% ของ Max HP ทุกเริ่มเทิร์น
ยอดฝีมือ สกิล [Physical] มีโอกาส 15% ไม่ติด Cooldown
ปรมาจารย์ โดนดาเมจ >30% Max HP ในครั้งเดียว → ปล่อยคลื่น 100% INT แก่ศัตรูทั้งหมด (1 ครั้ง/การต่อสู้)
ราชันยุทธ์ คริติคอล → เพิ่ม ACCURACY 5% เป็นเวลา 2 เทิร์น (ซ้อน 3 ชั้น)
เซียนยุทธ์ ใช้สกิล [Internal] → ฟื้น MP 5% ของ Max MP
เทพยุทธ์ HP <40% → ทุกการโจมตีฟื้น HP 10% ของดาเมจ
จักรพรรดิยุทธ์ สังหารศัตรู → ได้ Action เพิ่ม 1 ครั้งในเทิร์นนั้น
มหาเทพยุทธ์ ใช้สกิลระดับม่วงขึ้นไป → ลด MP Cost 50%

---

3. Realm Power Multiplier ตาราง

ขั้นพลัง Multiplier สะสมจากขั้นก่อน
จอมยุทธ์ฝึกหัด 1.00x -
จอมยุทธ์ 1.15x +15%
ยอดฝีมือ 1.35x +20%
ปรมาจารย์ 1.60x +25%
ราชันยุทธ์ 1.90x +30%
เซียนยุทธ์ 2.30x +40%
เทพยุทธ์ 2.80x +50%
จักรพรรดิยุทธ์ 3.50x +70%
มหาเทพยุทธ์ 4.50x +100%

หมายเหตุ: Realm Power Multiplier ใช้คูณกับ Power Score รวมของผู้เล่นเพื่อคำนวณ战力 (Combat Power) ที่แสดงใน UI ไม่ได้มีผลต่อสูตรดาเมจโดยตรง

---

4. Realm Breakthrough Rules

การเลื่อนขั้นพลังแต่ละครั้ง (ยกเว้น จอมยุทธ์ฝึกหัด → จอมยุทธ์) ผู้เล่นต้องผ่านเงื่อนไขเพิ่มเติมนอกเหนือจากการถึง Level ที่กำหนด

เงื่อนไขทั่วไปสำหรับทุกขั้น (ยกเว้นขั้นแรก)

· ถึง Level ตามที่กำหนด
· มี Gold ตามจำนวนที่ระบุ (ใช้จ่ายเมื่อเลื่อนขั้น)
· ผ่าน Area Boss ของ Map Level ก่อนหน้า (หากมี)

เงื่อนไขเฉพาะแต่ละขั้น

การเลื่อนขั้น Level Gold Required เงื่อนไขเพิ่มเติม
→ จอมยุทธ์ 10 500 ไม่มี
→ ยอดฝีมือ 20 2,000 มีอุปกรณ์อย่างน้อย 1 ชิ้นระดับ ฟ้า ขึ้นไป
→ ปรมาจารย์ 30 5,000 มี Follower อย่างน้อย 1 คน
→ ราชันยุทธ์ 40 12,000 STAT รวม (STR+CON+AGI+INT+LUCK) ≥ 200
→ เซียนยุทธ์ 50 25,000 มีสกิลระดับ ม่วง อย่างน้อย 1 สกิล
→ เทพยุทธ์ 60 50,000 ผ่าน Mini-Boss อย่างน้อย 3 ตัวที่ต่างพื้นที่
→ จักรพรรดิยุทธ์ 70 100,000 มีอุปกรณ์ระดับ ทอง ครบทุกสล็อต (อาวุธ, เสื้อเกราะ, เครื่องประดับ)
→ มหาเทพยุทธ์ 80 200,000 มีสกิลระดับ ทอง อย่างน้อย 2 สกิล และมี Follower ระดับ ม่วง ขึ้นไป อย่างน้อย 1 คน

กฎการเลื่อนขั้น

· ผู้เล่นสามารถเลื่อนขั้นได้ทันทีเมื่อถึง Level และมี Gold เพียงพอ (เงื่อนไขอื่นต้องตรวจสอบ)
· เมื่อเลื่อนขั้นสำเร็จ Gold จะถูกหักตามจำนวนที่กำหนด
· โบนัส STATS, HP, MP, โบนัสพิเศษ, Cultivation Bonus, และ Realm Power Multiplier จะถูกเพิ่มทันที
· การเลื่อนขั้นเป็นแบบ PERMANENT ไม่สามารถย้อนกลับได้

---

5. Realm Titles (ฉายาประจำขั้น)

ขั้นพลัง ฉายา (ภาษาไทย) ฉายา (ภาษาอังกฤษ)
จอมยุทธ์ฝึกหัด ผู้เยาว์ที่ก้าวเข้าสู่ยุทธภพ Novice of the Jianghu
จอมยุทธ์ ดาวรุ่งแห่งยุทธภพ Rising Star
ยอดฝีมือ ผู้เดินบนเส้นทางยุทธ Path Walker
ปรมาจารย์ ผู้สั่นสะเทือนยุทธภพ Realm Shaker
ราชันยุทธ์ เจ้าสำนักผู้เกรียงไกร Grand Sect Master
เซียนยุทธ์ ผู้ล่วงรู้สัจธรรมแห่งยุทธ์ Truth Seeker
เทพยุทธ์ จอมยุทธ์เหนือมนุษย์ Transcendent Warrior
จักรพรรดิยุทธ์ ผู้ครองยุทธภพใต้หล้า Martial Emperor
มหาเทพยุทธ์ ผู้ก้าวพ้นขีดจำกัดมนุษย์ Limit Breaker

---

6. Progression Summary Table

Level ชื่อขั้น โบนัส STATS (รวม) โบนัส HP/MP โบนัสพิเศษ ตัวคูณพลัง
1 จอมยุทธ์ฝึกหัด +0 ทุก Stat +0 HP, +0 MP - 1.00x
10 จอมยุทธ์ STR+3, CON+3, AGI+3, INT+3, LUCK+2 +100 HP, +80 MP Armor Pen +5% 1.15x
20 ยอดฝีมือ STR+6, CON+6, AGI+6, INT+6, LUCK+4 +250 HP, +200 MP Cooldown -1 1.35x
30 ปรมาจารย์ STR+10, CON+10, AGI+10, INT+10, LUCK+6 +450 HP, +350 MP Debuff Resist +20% 1.60x
40 ราชันยุทธ์ STR+15, CON+15, AGI+15, INT+15, LUCK+9 +700 HP, +550 MP Lifesteal Overheal 30% 1.90x
50 เซียนยุทธ์ STR+21, CON+21, AGI+21, INT+21, LUCK+13 +1000 HP, +800 MP First Strike 2.30x
60 เทพยุทธ์ STR+28, CON+28, AGI+28, INT+28, LUCK+18 +1400 HP, +1100 MP Damage Reflect 15% 2.80x
70 จักรพรรดิยุทธ์ STR+36, CON+36, AGI+36, INT+36, LUCK+24 +1900 HP, +1500 MP Mana Steal +50% 3.50x
80 มหาเทพยุทธ์ STR+45, CON+45, AGI+45, INT+45, LUCK+30 +2500 HP, +2000 MP Immune to Stun/Silence/Petrify 4.50x

หมายเหตุ: ค่า STATS ในตารางนี้เป็นค่าสะสม ณ ขั้นนั้น ๆ (รวมโบนัสจากทุกขั้นที่ผ่านมาแล้ว)

---

7. Integration Notes (สำหรับ Developer)

ความสัมพันธ์กับ Game Bible (Advancement System)

· ระบบนี้ทำงาน ควบคู่ กับ Advancement System ใน Game Bible หัวข้อ 3
· Advancement System ให้: +10 Stat Points, Skill Slots, Stat Cap เพิ่ม, พื้นที่ปลดล็อก
· Class Progression ให้: STATS แบบ Flat, HP/MP Flat, โบนัสพิเศษเชิงกลไก, Cultivation Bonus, และ Realm Power Multiplier
· ทั้งสองระบบจะถูกมอบให้ผู้เล่นพร้อมกันเมื่อถึง Level นั้น

การคำนวณ STATS รวมของผู้เล่น

```
Total STR = Base STR (5) + Stat Points ที่ลง + Equipment STR + Class Progression STR + Advancement Bonus (ถ้ามี)
```

การแสดงผลใน UI

· Realm Title แสดงใต้ชื่อตัวละคร
· Realm Power Multiplier แสดงเป็น "战力系数: x1.35" หรือ类似
· Cultivation Bonus แสดงในหน้า Character Status แยกหมวด " cultivation perks "

---