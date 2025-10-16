# 🚀 CyEyes CMS - Quick Start Guide

## ⚡ TL;DR

```bash
# Start everything
docker compose up -d

# Access
Frontend: http://localhost
Backend API: http://localhost:3000/api
Admin: admin@cyeyes.com / Admin123!
```

---

## 🔐 Admin Credentials

**Updated as of 2025-10-14:**

- **Email:** `admin@cyeyes.com`
- **Password:** `Admin123!`
- **Role:** `admin` (full access)

> ⚠️ **Note:** Password is `Admin123!` NOT `ChangeThisPassword123!`

---

## 🧪 Test All Endpoints

### Automated Test:
```bash
./test-endpoints.sh
```

### Manual Tests:

#### 1. Public Blog Listing
```bash
curl "http://localhost:3000/api/blogs?page=1&limit=10"
```

#### 2. Admin Login
```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cyeyes.com","password":"Admin123!"}'
```

#### 3. Create Blog (Authenticated)
```bash
# First, get token from login response
TOKEN="your_access_token_here"

curl -X POST "http://localhost:3000/api/blogs/admin" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "slug":"my-first-blog",
    "titleEn":"My First Blog",
    "titleVi":"Blog Đầu Tiên Của Tôi",
    "contentEn":"Hello World!",
    "contentVi":"Xin chào!",
    "status":"published"
  }'
```

#### 4. Create Team Member (Authenticated)
```bash
curl -X POST "http://localhost:3000/api/team" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nameEn":"John Doe",
    "nameVi":"John Doe",
    "positionEn":"Security Analyst",
    "positionVi":"Chuyên gia Bảo mật",
    "photo":"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
  }'
```

---

## 🐛 Debug Frontend

### Open Debug Panel:
- **Keyboard:** Press `Ctrl + D`
- **UI:** Click floating cyan debug button (bottom-right)

### Console Commands:
```javascript
// Dump all debug state
window.__CYEYES_DEBUG__.dumpState()

// View logs
window.__CYEYES_DEBUG__.getHistory()

// View performance metrics
window.__CYEYES_DEBUG__.getMetrics()

// Clear logs
window.__CYEYES_DEBUG__.clearHistory()

// Export logs
window.__CYEYES_DEBUG__.exportLogs()
```

### Debug Panel Features:
- **Logs Tab:** Filter by level (ERROR, WARN, INFO, DEBUG)
- **Performance Tab:** API call durations, component render times
- **State Tab:** App state overview

---

## 🔧 Common Issues & Solutions

### Issue: Login Returns 401/500
**Solution:** Use password `Admin123!` not `ChangeThisPassword123!`

### Issue: Blog Listing Returns 500
**Solution:** Already fixed in latest build. Run:
```bash
docker compose up --build -d backend
```

### Issue: Validation Errors
**Solution:** Middleware updated to apply Zod defaults. Rebuild:
```bash
docker compose up --build -d
```

### Issue: Database Empty
**Solution:** Run seed script:
```bash
docker compose exec backend node --import tsx src/scripts/seed.ts
```

---

## 📊 API Endpoints

### Public Endpoints (No Auth):
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/blogs` | GET | List published blogs |
| `/api/blogs/:slug` | GET | Get blog by slug |
| `/api/team` | GET | List active team members |
| `/api/customers` | GET | List customers |
| `/api/products` | GET | List products |

### Auth Endpoints:
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Login |
| `/api/auth/register` | POST | Register (if enabled) |
| `/api/auth/logout` | POST | Logout |
| `/api/auth/refresh` | POST | Refresh token |
| `/api/auth/me` | GET | Get current user |

### Admin Endpoints (Auth Required):
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/blogs/admin` | GET | List all blogs |
| `/api/blogs/admin` | POST | Create blog |
| `/api/blogs/admin/:id` | PUT | Update blog |
| `/api/blogs/admin/:id` | DELETE | Delete blog |
| `/api/team` | POST | Create team member |
| `/api/team/:id` | PUT | Update team member |
| `/api/team/:id` | DELETE | Delete team member |

---

## 🔄 Rebuild & Restart

### Rebuild Everything:
```bash
docker compose up --build -d
```

### Rebuild Backend Only:
```bash
docker compose up --build -d backend
```

### Rebuild Frontend Only:
```bash
docker compose up --build -d frontend
```

### View Logs:
```bash
# All services
docker compose logs -f

# Backend only
docker compose logs -f backend

# Frontend only
docker compose logs -f frontend
```

---

## 📁 Important Files

- **Environment:** `.env`
- **Admin Seed:** `backend/src/scripts/seed.ts`
- **Database:** `backend/database/cyeyes.db`
- **Test Script:** `test-endpoints.sh`
- **Bug Report:** `BUG-FIX-REPORT.md`
- **Debug Guide:** `frontend/DEBUG-SYSTEM-GUIDE.md`

---

## ✅ Verification Checklist

- [ ] Frontend loads at `http://localhost`
- [ ] Backend API responds at `http://localhost:3000/api/health`
- [ ] Login works with `admin@cyeyes.com / Admin123!`
- [ ] Can create blog posts
- [ ] Can create team members
- [ ] Debug panel opens with `Ctrl + D`

---

## 🆘 Need Help?

1. Check **BUG-FIX-REPORT.md** for detailed troubleshooting
2. View logs: `docker compose logs -f backend`
3. Open debug panel: Press `Ctrl + D` in browser
4. Run test script: `./test-endpoints.sh`

---

*Last updated: 2025-10-14*
