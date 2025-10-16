# 🚀 CyEyes CMS - Quick Start Guide

## Deploy trong 5 phút

### 1. Deploy ngay

```bash
cd /Users/anhnlq/Downloads/webce
bash deploy-production-v2.sh
```

**Xong!** Application sẽ chạy tại:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000/api
- Admin: http://localhost:5173/admin

---

## 🔑 Login

```
Email: admin@cyeyes.com
Password: Admin123!
```

---

## 🧪 Test ngay

```bash
# Test backend
bash test-privaguard-fix.sh

# Test frontend
bash test-frontend-product-detail.sh
```

---

## 📦 Backup & Rollback

### Backup

```bash
bash backup-database.sh
```

### Rollback

```bash
# Xem backups
bash rollback.sh

# Rollback về timestamp
bash rollback.sh 20251015_143000
```

---

## 🛠️ Useful Commands

### Docker

```bash
# View logs
docker logs -f cyeyes-cms-backend
docker logs -f cyeyes-cms-frontend

# Restart
docker-compose restart

# Stop
docker-compose down

# Start
docker-compose up -d
```

### Health Check

```bash
# Backend API
curl http://localhost:3000/api/products?limit=1

# Frontend
curl -I http://localhost:5173
```

---

## 📊 Status Check

```bash
# Container status
docker ps --filter "name=cyeyes-cms"

# Application health
curl http://localhost:3000/api/health
```

---

## ⚠️ Troubleshooting

### Containers không start

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### API errors

```bash
docker logs cyeyes-cms-backend
docker-compose restart backend
```

### Frontend 404

```bash
docker logs cyeyes-cms-frontend
docker-compose restart frontend
```

---

## 📖 Full Documentation

- **Deployment:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Production Ready:** [PRODUCTION-READY.md](PRODUCTION-READY.md)

---

## 🎯 Post-Deployment Checklist

- [ ] Login to admin portal
- [ ] Create a test product
- [ ] Edit PrivaGuard product
- [ ] View product on frontend
- [ ] Test all features
- [ ] Check responsive design

---

**Need help?** Email: xinchao@cyeyes.io

🎉 **Happy deploying!**
