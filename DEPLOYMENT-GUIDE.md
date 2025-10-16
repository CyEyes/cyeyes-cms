# Hướng dẫn Triển khai CyEyes CMS

Tài liệu này hướng dẫn chi tiết cách triển khai CyEyes CMS từ development đến production.

## 📋 Mục lục

1. [Yêu cầu Hệ thống](#yêu-cầu-hệ-thống)
2. [Cài đặt Development](#cài-đặt-development)
3. [Cấu hình Environment](#cấu-hình-environment)
4. [Triển khai với Docker](#triển-khai-với-docker)
5. [Triển khai Production Manual](#triển-khai-production-manual)
6. [Bảo mật và Hardening](#bảo-mật-và-hardening)
7. [Monitoring và Maintenance](#monitoring-và-maintenance)
8. [Backup và Recovery](#backup-và-recovery)
9. [Troubleshooting](#troubleshooting)

---

## 1. Yêu cầu Hệ thống

### Development

- **Node.js**: 20.x hoặc cao hơn
- **npm**: 10.x hoặc cao hơn
- **RAM**: Tối thiểu 4GB
- **Disk**: 2GB trống

### Production

- **CPU**: 2 cores trở lên
- **RAM**: 4GB trở lên (khuyến nghị 8GB)
- **Disk**: 50GB trở lên (SSD khuyến nghị)
- **OS**: Ubuntu 22.04 LTS hoặc CentOS 8
- **Docker**: 24.x trở lên (nếu dùng containerization)
- **Nginx**: 1.20.x trở lên (nếu dùng reverse proxy)

---

## 2. Cài đặt Development

### Bước 1: Clone Repository

```bash
cd /path/to/your/projects
cd webce/cms
```

### Bước 2: Setup Backend

```bash
cd backend
npm install

# Khởi tạo database và tạo tables
npm run db:setup

# Start development server
npm run dev
```

Server sẽ chạy tại: `http://localhost:3000`

### Bước 3: Setup Frontend

Mở terminal mới:

```bash
cd frontend
npm install

# Start development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

### Bước 4: Đăng nhập và Test

1. Truy cập `http://localhost:5173`
2. Click "Login" hoặc vào `/login`
3. Sử dụng credentials mặc định:

```
Email: admin@cyeyes.com
Password: Admin123!
```

⚠️ **Quan trọng**: Đổi password ngay sau khi đăng nhập lần đầu!

---

## 3. Cấu hình Environment

### Backend Environment Variables

Tạo file `.env` trong thư mục `backend/`:

```env
# =============================================
# SERVER CONFIGURATION
# =============================================
NODE_ENV=production
PORT=3000
API_PREFIX=/api/v1

# =============================================
# DATABASE
# =============================================
DATABASE_URL=./data/cyeyes.db

# =============================================
# JWT CONFIGURATION
# =============================================
# QUAN TRỌNG: Thay đổi các secret keys này trong production!
JWT_SECRET=your-very-secure-jwt-secret-key-min-32-characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-very-secure-refresh-secret-key-min-32-characters
JWT_REFRESH_EXPIRES_IN=7d

# =============================================
# SECURITY
# =============================================
BCRYPT_ROUNDS=12

# =============================================
# CORS
# =============================================
# Thay đổi thành domain production của bạn
CORS_ORIGIN=https://cyeyes.com

# =============================================
# RATE LIMITING
# =============================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# =============================================
# LOGGING
# =============================================
LOG_LEVEL=info
LOG_DIR=./logs

# =============================================
# FILE UPLOADS
# =============================================
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

# =============================================
# ADMIN USER (for initial setup)
# =============================================
ADMIN_EMAIL=admin@cyeyes.com
ADMIN_PASSWORD=ChangeThisPassword123!
ADMIN_NAME=CyEyes Administrator
```

### Frontend Environment Variables

Tạo file `.env` trong thư mục `frontend/`:

```env
# API URL
VITE_API_URL=http://localhost:3000/api/v1

# Default language (vi hoặc en)
VITE_DEFAULT_LANGUAGE=vi

# Feature flags
VITE_ENABLE_ANALYTICS=true
```

### Production Environment (Frontend)

```env
VITE_API_URL=https://api.cyeyes.com/api/v1
VITE_DEFAULT_LANGUAGE=vi
VITE_ENABLE_ANALYTICS=true
```

---

## 4. Triển khai với Docker

### Chuẩn bị

Đảm bảo Docker và Docker Compose đã được cài đặt:

```bash
docker --version
docker-compose --version
```

### Bước 1: Cấu hình Environment

Tạo file `.env` trong thư mục `cms/`:

```env
# Node Environment
NODE_ENV=production

# Ports
BACKEND_PORT=3000
FRONTEND_PORT=80

# Database
DATABASE_URL=./data/cyeyes.db

# JWT Secrets (THAY ĐỔI TRONG PRODUCTION!)
JWT_SECRET=generate-a-secure-random-string-here-min-32-chars
JWT_REFRESH_SECRET=generate-another-secure-random-string-here

# CORS
CORS_ORIGIN=https://your-domain.com

# Admin credentials
ADMIN_EMAIL=admin@cyeyes.com
ADMIN_PASSWORD=SecurePassword123!
```

### Bước 2: Build và Start Containers

```bash
cd cms

# Build và start tất cả services
docker-compose up -d --build

# Xem logs
docker-compose logs -f

# Kiểm tra status
docker-compose ps
```

### Bước 3: Khởi tạo Database

```bash
# Chạy database setup trong container
docker-compose exec backend npm run db:setup
```

### Bước 4: Kiểm tra Deployment

```bash
# Test backend
curl http://localhost:3000/api/v1/health

# Truy cập frontend
# Mở browser: http://localhost
```

### Quản lý Docker Containers

```bash
# Stop containers
docker-compose stop

# Start containers
docker-compose start

# Restart containers
docker-compose restart

# Stop và remove containers
docker-compose down

# View logs
docker-compose logs backend
docker-compose logs frontend

# Execute command trong container
docker-compose exec backend sh
```

---

## 5. Triển khai Production Manual

### Bước 1: Chuẩn bị Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Cài đặt Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Cài đặt PM2
sudo npm install -g pm2

# Cài đặt Nginx
sudo apt install -y nginx

# Cài đặt certbot cho SSL
sudo apt install -y certbot python3-certbot-nginx
```

### Bước 2: Clone và Build Backend

```bash
# Tạo user cho application
sudo useradd -m -s /bin/bash cyeyes
sudo su - cyeyes

# Clone project
cd /home/cyeyes
# Giả sử code đã được upload hoặc clone từ git
cd webce/cms/backend

# Cài đặt dependencies
npm ci --production

# Build TypeScript
npm run build

# Setup database
npm run db:setup
```

### Bước 3: Cấu hình PM2

Tạo file `ecosystem.config.js` trong `backend/`:

```javascript
module.exports = {
  apps: [{
    name: 'cyeyes-cms-backend',
    script: 'dist/server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '500M',
  }]
};
```

Start backend với PM2:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Bước 4: Build và Deploy Frontend

```bash
cd ../frontend

# Cài đặt dependencies
npm ci

# Build cho production
npm run build

# Copy build files đến web root
sudo mkdir -p /var/www/cyeyes
sudo cp -r dist/* /var/www/cyeyes/
sudo chown -R www-data:www-data /var/www/cyeyes
```

### Bước 5: Cấu hình Nginx

Tạo file `/etc/nginx/sites-available/cyeyes`:

```nginx
# Backend API
server {
    listen 80;
    server_name api.cyeyes.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name cyeyes.com www.cyeyes.com;

    root /var/www/cyeyes;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Enable site và restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/cyeyes /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Bước 6: Cấu hình SSL với Let's Encrypt

```bash
# Lấy SSL certificate
sudo certbot --nginx -d cyeyes.com -d www.cyeyes.com -d api.cyeyes.com

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## 6. Bảo mật và Hardening

### Firewall Configuration

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
sudo ufw status
```

### Đổi Default Credentials

1. Login với credentials mặc định
2. Vào Admin Settings hoặc Profile
3. Đổi email và password
4. Tạo thêm admin user backup
5. Xóa hoặc disable default admin nếu cần

### Rotate JWT Secrets

Định kỳ thay đổi JWT secrets:

```bash
# Generate new secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Update .env
# Restart application
pm2 restart cyeyes-cms-backend
```

### Database Encryption

SQLite database nên được bảo vệ:

```bash
# Set proper permissions
chmod 600 backend/data/cyeyes.db
chown cyeyes:cyeyes backend/data/cyeyes.db
```

### Regular Security Audits

```bash
# Chạy npm audit
cd backend && npm audit
cd ../frontend && npm audit

# Update dependencies
npm update
npm audit fix
```

---

## 7. Monitoring và Maintenance

### PM2 Monitoring

```bash
# View status
pm2 status

# View logs
pm2 logs cyeyes-cms-backend

# Monitor resources
pm2 monit

# Restart application
pm2 restart cyeyes-cms-backend

# Reload with zero downtime
pm2 reload cyeyes-cms-backend
```

### Log Management

```bash
# View application logs
tail -f backend/logs/combined.log
tail -f backend/logs/error.log
tail -f backend/logs/security.log

# Setup log rotation
sudo nano /etc/logrotate.d/cyeyes
```

Nội dung `/etc/logrotate.d/cyeyes`:

```
/home/cyeyes/webce/cms/backend/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 cyeyes cyeyes
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

### Health Checks

```bash
# Backend health
curl https://api.cyeyes.com/api/v1/health

# Check database
sqlite3 backend/data/cyeyes.db "SELECT COUNT(*) FROM users;"

# Check disk space
df -h

# Check memory
free -h

# Check CPU
top
```

---

## 8. Backup và Recovery

### Automated Backup Script

Tạo file `/home/cyeyes/backup.sh`:

```bash
#!/bin/bash

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/cyeyes/backups"
PROJECT_DIR="/home/cyeyes/webce/cms"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
cp $PROJECT_DIR/backend/data/cyeyes.db $BACKUP_DIR/db_$DATE.db

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C $PROJECT_DIR/backend uploads/

# Backup .env files
cp $PROJECT_DIR/backend/.env $BACKUP_DIR/backend_env_$DATE
cp $PROJECT_DIR/frontend/.env $BACKUP_DIR/frontend_env_$DATE

# Keep only last 30 days of backups
find $BACKUP_DIR -name "db_*.db" -mtime +30 -delete
find $BACKUP_DIR -name "uploads_*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

Thêm vào crontab:

```bash
chmod +x /home/cyeyes/backup.sh

# Run backup daily at 2 AM
crontab -e
0 2 * * * /home/cyeyes/backup.sh >> /home/cyeyes/backup.log 2>&1
```

### Manual Backup

```bash
# Backup database
cp backend/data/cyeyes.db backups/cyeyes_$(date +%Y%m%d).db

# Backup uploads
tar -czf backups/uploads_$(date +%Y%m%d).tar.gz backend/uploads/

# Backup entire project
tar -czf cyeyes_full_backup_$(date +%Y%m%d).tar.gz webce/
```

### Recovery

```bash
# Restore database
cp backups/cyeyes_20250114.db backend/data/cyeyes.db

# Restore uploads
tar -xzf backups/uploads_20250114.tar.gz -C backend/

# Restart application
pm2 restart cyeyes-cms-backend
```

---

## 9. Troubleshooting

### Backend không start

```bash
# Check logs
pm2 logs cyeyes-cms-backend

# Check port
lsof -i :3000
netstat -tulpn | grep 3000

# Check environment variables
pm2 show cyeyes-cms-backend

# Restart
pm2 restart cyeyes-cms-backend
```

### Database errors

```bash
# Check database file
ls -lh backend/data/cyeyes.db

# Check permissions
chmod 600 backend/data/cyeyes.db

# Backup and recreate
cp backend/data/cyeyes.db backend/data/cyeyes.db.backup
npm run db:setup
```

### Nginx issues

```bash
# Test configuration
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Restart nginx
sudo systemctl restart nginx
```

### CORS errors

Kiểm tra `CORS_ORIGIN` trong backend `.env` phải khớp với domain frontend:

```env
CORS_ORIGIN=https://cyeyes.com
```

### SSL certificate issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Force renew
sudo certbot renew --force-renewal
```

### High memory usage

```bash
# Check PM2 memory
pm2 monit

# Restart application
pm2 restart cyeyes-cms-backend

# Clear logs
pm2 flush
```

---

## 🆘 Support

Nếu gặp vấn đề:

1. Kiểm tra logs trong `backend/logs/`
2. Xem PM2 logs: `pm2 logs`
3. Kiểm tra Nginx logs: `/var/log/nginx/`
4. Liên hệ: admin@cyeyes.com

---

**© 2025 CyEyes - All Rights Reserved**
