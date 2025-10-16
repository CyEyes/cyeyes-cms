#!/bin/bash
# CyEyes CMS - Database Initialization Script

echo "🚀 CyEyes CMS - Khởi tạo Database"
echo "================================="
echo ""

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Lỗi: Vui lòng chạy script này trong thư mục /cms"
    exit 1
fi

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Lỗi: Không tìm thấy thư mục backend"
    exit 1
fi

echo "📦 Bước 1: Cài đặt dependencies..."
cd backend
npm install --silent

echo ""
echo "🗄️  Bước 2: Tạo database schema..."
echo "⚠️  Bạn sẽ được hỏi xác nhận - hãy gõ: Yes, I want to execute all statements"
echo ""
npm run db:push

echo ""
echo "🌱 Bước 3: Seed admin user..."
npm run db:seed

echo ""
echo "📝 Bước 4: Seed sample content..."
npm run db:seed:content

echo ""
echo "📋 Bước 5: Copy database vào Docker container..."
cd ..
docker cp backend/database/cyeyes.db cyeyes-cms-backend:/app/database/

echo ""
echo "🔄 Bước 6: Restart backend container..."
docker restart cyeyes-cms-backend

echo ""
echo "⏳ Đợi backend khởi động..."
sleep 5

echo ""
echo "✅ Hoàn tất!"
echo ""
echo "🌐 Truy cập ứng dụng:"
echo "   - Frontend: http://localhost"
echo "   - Admin: http://localhost/admin"
echo "   - API: http://localhost:3000/api"
echo ""
echo "🔐 Thông tin đăng nhập:"
echo "   Email: admin@cyeyes.com"
echo "   Password: Admin123!"
echo ""
echo "⚠️  QUAN TRỌNG: Đổi password ngay sau khi đăng nhập lần đầu!"
echo ""
