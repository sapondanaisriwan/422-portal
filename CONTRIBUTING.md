# 422 Portal

## ความต้องการของระบบ (Prerequisites)

- Node.js (แนะนำเวอร์ชัน 18 หรือ 24 ขึ้นไป)
- Docker และ Docker Compose (สำหรับการติดตั้งบนโปรดักชันเซิร์ฟเวอร์)

## การติดตั้งเพื่อการพัฒนา (Local Development)

1. ทำการโคลนซอร์สโค้ดและเข้าสู่โฟลเดอร์โปรเจกต์

```bash
git clone <repository-url>
cd 422-portal
```

2. ติดตั้งแพ็กเกจ (Dependencies) ทั้งหมดที่จำเป็น

```bash
npm install
```

3. เริ่มต้นเซิร์ฟเวอร์สำหรับการพัฒนา (Development Server)

```bash
npm run dev
```

## การตั้งค่าและการปรับแต่งข้อมูล (Configuration)

โครงสร้างของระบบถูกออกแบบให้แยกส่วนแสดงผลออกจากข้อมูล เพื่อให้ง่ายต่อการแก้ไข สามารถปรับปรุงข้อมูลได้ที่โฟลเดอร์ src/config/

- `src/config/portal.config.ts`: สำหรับจัดการข้อมูลโปรไฟล์ ชื่อผู้ใช้งาน คำอธิบาย รูปภาพแบนเนอร์/อวตาร์ และช่องทางโซเชียลมีเดีย

- `src/config/links.config.ts`: สำหรับจัดการหมวดหมู่และรายการเอกสาร/ลิงก์ โดยใช้ type (form, excel, doc, link) เพื่อกำหนดรูปแบบไอคอนและสีโดยอัตโนมัติ

## การติดตั้งสำหรับการใช้งานจริง (Production Deployment)

การนำขึ้นระบบโปรดักชันใช้สถาปัตยกรรม Docker Multi-stage Build ร่วมกับ Nginx โดยให้บริการผ่านพอร์ต 422

วิธีที่ 1: การใช้งานผ่าน Docker Compose (ร่วมกับ WUD)
ระบบรองรับการอัปเดตอัตโนมัติผ่าน What's Up Docker (WUD)

1. ตรวจสอบไฟล์ docker-compose.yml ให้แน่ใจว่ามีการตั้งค่า Image ของ portal-frontend ให้ตรงกับบัญชี Docker Hub

2. สั่งรันระบบเบื้องหลัง

```bash
docker-compose up -d
```

## CI/CD Pipeline

โปรเจกต์นี้รองรับระบบ Automated Deployment แบบสมบูรณ์

1. Continuous Integration (CI): กำหนดค่าผ่าน GitHub Actions ไว้ที่ .github/workflows/docker-build.yml โดยระบบจะทำการ Build และ Push Image ไปยัง Docker Hub ทันทีที่มีการนำรหัสผ่านเข้าสู่ Branch main

2. Continuous Deployment (CD): เซิร์ฟเวอร์ปลายทางดำเนินการผ่าน WUD เพื่อตรวจสอบการอัปเดตจาก Docker Hub หากพบเวอร์ชันใหม่ ระบบจะดำเนินการ Pull และสร้าง Container ใหม่อัตโนมัติ โดยอ้างอิงจาก Label wud.watch=true
