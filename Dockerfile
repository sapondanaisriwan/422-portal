# Stage 1: Build Environment
FROM node:24-alpine AS builder
WORKDIR /app

# คัดลอกเฉพาะไฟล์ package เพื่อใช้งาน layer cache ในการติดตั้ง dependencies
COPY package.json package-lock.json ./
RUN npm install

# คัดลอกซอร์สโค้ดและไฟล์คอนฟิกทั้งหมดเข้าสู่ระบบเพื่อทำการ build
COPY . .
RUN npm run build

# Stage 2: Production Environment
FROM nginx:alpine

# คัดลอกไฟล์ที่ผ่านการคอมไพล์แล้วจากโฟลเดอร์ dist ไปยังโฟลเดอร์เริ่มต้นของ Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# คัดลอกไฟล์คอนฟิกของ Nginx เพื่อจัดการ routing และเปลี่ยนพอร์ตการทำงาน
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 422
CMD ["nginx", "-g", "daemon off;"]