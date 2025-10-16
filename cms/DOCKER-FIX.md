# Docker Deployment - Sửa lỗi nhanh

## ✅ Đã sửa các lỗi:

### 1. Missing JWT_SECRET
- ✅ Tạo file `.env` với JWT secrets đã được generate
- ✅ Tạo file `.env.example` để tham khảo

### 2. Missing package-lock.json
- ✅ Đã chạy `npm install` và tạo package-lock.json cho backend
- ✅ Frontend đã có sẵn package-lock.json

### 3. Deprecated docker-compose version
- ✅ Đã xóa dòng `version: '3.8'` không còn cần thiết

## 🚀 Chạy Docker ngay bây giờ:

```bash
cd /Users/anhnlq/Downloads/webce/cms
docker compose up --build -d
```

## 📋 Kiểm tra logs:

```bash
# Xem tất cả logs
docker compose logs -f

# Chỉ backend
docker compose logs -f backend

# Chỉ frontend  
docker compose logs -f frontend
```

## 🔍 Kiểm tra services:

```bash
# Check containers đang chạy
docker compose ps

# Test backend health
curl http://localhost:3000/api/v1/health

# Test frontend (mở browser)
open http://localhost
```

## 🛠️ Commands hữu ích:

```bash
# Stop containers
docker compose stop

# Start containers
docker compose start

# Restart containers
docker compose restart

# Stop và xóa containers
docker compose down

# Xem logs realtime
docker compose logs -f

# Execute command trong container
docker compose exec backend sh
docker compose exec backend npm run db:setup
```

## ⚙️ File .env đã được tạo với:

- `JWT_SECRET`: Random 64-character hex string
- `JWT_REFRESH_SECRET`: Random 64-character hex string  
- `CORS_ORIGIN`: http://localhost (đổi thành domain production khi deploy)
- Default admin credentials

## 🔐 Default Login:

```
Email: admin@cyeyes.com
Password: Admin123!
```

⚠️ **Đổi password ngay sau khi login!**

## 📝 Nếu muốn thay đổi .env:

```bash
# Edit file .env
nano .env

# Rebuild và restart
docker compose down
docker compose up --build -d
```

## 🎯 Next Steps:

1. ✅ Chạy `docker compose up --build -d`
2. ✅ Đợi containers start (khoảng 30-60 giây)
3. ✅ Truy cập http://localhost
4. ✅ Login với credentials mặc định
5. ✅ Đổi password
6. ✅ Bắt đầu sử dụng!

---

**Lưu ý:** File `.env` chứa secrets nên KHÔNG commit vào git!
