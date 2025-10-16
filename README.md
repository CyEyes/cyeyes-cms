# CyEyes Web Platform

Complete web platform for CyEyes cybersecurity company, including landing page and Content Management System (CMS).

![License](https://img.shields.io/badge/License-Proprietary-red.svg)
![Node](https://img.shields.io/badge/Node.js-20.x-green.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Features](#features)
- [Quick Start](#quick-start)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [Security](#security)
- [Maintenance](#maintenance)
- [License](#license)

---

## 🎯 Overview

The CyEyes Web Platform consists of two main components:

### 1. Landing Page (Production Ready)
A modern, bilingual "Coming Soon" landing page showcasing CyEyes services with:
- Particle background animation
- 6 QR codes for different services
- Vietnamese/English language support
- Responsive design
- CyEyes brand identity (light theme)

### 2. Content Management System (CMS)
A secure, full-featured CMS platform for managing company website content with:
- Blog management system
- Team profiles management
- Customer showcase
- Products/Services catalog
- Admin portal with Role-Based Access Control (RBAC)
- RESTful API
- OWASP security compliance
- Docker deployment ready

---

## 📁 Project Structure

```
webce/
├── landing-page/           # Coming Soon landing page
│   ├── index.html         # Main landing page
│   ├── privaguard.html    # PrivaGuard product page
│   ├── styles.css         # Landing page styles
│   └── media/             # Images, logos, QR codes
│
├── cms/                    # Content Management System
│   ├── backend/           # Node.js + Express API
│   ├── frontend/          # React + Vite SPA
│   ├── docker/            # Docker configurations
│   └── docker-compose.yml # Multi-container setup
│
├── scripts/               # Deployment & maintenance scripts
│   ├── deploy-production-v2.sh
│   ├── backup-database.sh
│   └── rollback.sh
│
├── CMS-BRD.md             # CMS Business Requirements Document
├── DEPLOYMENT-GUIDE.md    # Complete deployment guide
├── QUICK-START.md         # Quick start guide
└── README.md              # This file
```

---

## ✨ Features

### Landing Page
- ✅ Bilingual support (Vietnamese/English)
- ✅ Particle background animation
- ✅ QR code integration for services
- ✅ Responsive design
- ✅ Fast loading (<2s)

### CMS Backend
- ✅ RESTful API with Express.js
- ✅ SQLite database with Drizzle ORM
- ✅ JWT-based authentication
- ✅ Role-Based Access Control (User, Content Manager, Admin)
- ✅ Rate limiting (configurable)
- ✅ OWASP security compliance
- ✅ Audit logging
- ✅ File upload management
- ✅ Input validation and sanitization

### CMS Frontend
- ✅ React 18 with Vite
- ✅ Responsive admin portal
- ✅ Rich text editor (TipTap)
- ✅ Image upload and management
- ✅ Bilingual content management
- ✅ Modern UI with Tailwind CSS

### Content Management
- ✅ Blog posts (create, edit, delete, publish)
- ✅ Team member profiles
- ✅ Customer showcase
- ✅ Products/Services catalog
- ✅ Media library
- ✅ SEO optimization
- ✅ Draft/Published workflow

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Docker & Docker Compose (for containerized deployment)

### Option 1: Docker Deployment (Recommended)

```bash
# Clone the repository
cd /path/to/webce

# Deploy with Docker
cd cms
cp .env.example .env
# Edit .env with your configuration
docker-compose up -d --build

# Initialize database
docker-compose exec backend npm run db:setup
```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Admin Portal: http://localhost:5173/admin

### Option 2: Local Development

```bash
# Backend setup
cd cms/backend
npm install
cp .env.example .env
npm run db:setup
npm run dev

# Frontend setup (in new terminal)
cd cms/frontend
npm install
cp .env.example .env
npm run dev
```

### Default Credentials

```
Email: admin@cyeyes.com
Password: Admin123!
```

⚠️ **IMPORTANT**: Change the default password immediately after first login!

---

## 🚢 Deployment

### Production Deployment with Docker

```bash
cd cms

# 1. Configure environment
cp .env.example .env
nano .env  # Edit with production values

# 2. Build and start services
docker-compose up -d --build

# 3. Initialize database
docker-compose exec backend npm run db:setup

# 4. Check status
docker-compose ps
docker-compose logs -f
```

### Production Deployment (Manual)

For detailed manual deployment instructions, see [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md).

Key steps:
1. Install Node.js 20.x and PM2
2. Setup Nginx as reverse proxy
3. Configure SSL with Let's Encrypt
4. Setup automated backups
5. Configure monitoring

### Using Deployment Scripts

```bash
# Quick deployment
bash scripts/deploy-production-v2.sh

# Backup database
bash scripts/backup-database.sh

# Rollback to previous version
bash scripts/rollback.sh [timestamp]
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create `.env` file in `cms/backend/`:

```env
# Server Configuration
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=./data/cyeyes.db

# JWT Configuration (CHANGE IN PRODUCTION!)
JWT_SECRET=your-very-secure-jwt-secret-min-32-characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-min-32-characters
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12

# CORS
CORS_ORIGIN=https://your-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

# Admin User (for initial setup)
ADMIN_EMAIL=admin@cyeyes.com
ADMIN_PASSWORD=Admin123!
ADMIN_NAME=CyEyes Administrator
```

### Frontend Environment Variables

Create `.env` file in `cms/frontend/`:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Application Settings
VITE_DEFAULT_LANGUAGE=vi
VITE_ENABLE_ANALYTICS=false
```

### Docker Configuration

The `docker-compose.yml` includes:
- **Backend**: Node.js + Express API
- **Frontend**: React production build with Nginx
- **Volumes**: Database, uploads, logs persistence

---

## 🔒 Security

### OWASP Top 10 Compliance

The CMS implements security measures for all OWASP Top 10 vulnerabilities:

✅ **A01 - Broken Access Control**
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Middleware authorization checks

✅ **A02 - Cryptographic Failures**
- Bcrypt password hashing (12 rounds)
- HTTPS enforcement
- Secure cookie flags (httpOnly, secure, sameSite)

✅ **A03 - Injection**
- Parameterized queries (Drizzle ORM)
- Input validation (Zod schemas)
- HTML sanitization

✅ **A04 - Insecure Design**
- Rate limiting on all endpoints
- CSRF protection
- File upload restrictions

✅ **A05 - Security Misconfiguration**
- Helmet.js security headers
- No default credentials in production
- Proper error handling

✅ **A06 - Vulnerable Components**
- Regular dependency updates
- npm audit in CI/CD

✅ **A07 - Authentication Failures**
- Strong password policy
- Account lockout mechanism
- Secure session management

✅ **A08 - Data Integrity Failures**
- Audit logging
- File integrity checks

✅ **A09 - Logging & Monitoring**
- Winston logging
- Security event monitoring
- Failed login tracking

✅ **A10 - Server-Side Request Forgery**
- URL validation
- Domain whitelisting

### Rate Limiting Configuration

| Endpoint Type | Rate Limit | Configuration |
|---------------|-----------|---------------|
| Login | 5 attempts / 15 min | Configurable |
| API (authenticated) | 100 requests / 15 min | Configurable |
| API (public) | 30 requests / 15 min | Configurable |
| Contact form | 3 submissions / hour | Configurable |
| File upload | 10 files / hour | Configurable |

### Security Best Practices

1. **Change Default Credentials**
   - Login with default credentials
   - Change email and password immediately
   - Create backup admin account

2. **Rotate JWT Secrets**
   - Generate new secrets regularly
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Database Security**
   ```bash
   chmod 600 cms/backend/data/cyeyes.db
   ```

4. **Regular Updates**
   ```bash
   cd cms/backend && npm audit
   cd cms/frontend && npm audit
   npm audit fix
   ```

---

## 🛠️ Maintenance

### Monitoring

```bash
# View Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Check container status
docker-compose ps

# Monitor resources
docker stats
```

### Backup

Automated backup script (daily at 2 AM):

```bash
# Manual backup
bash scripts/backup-database.sh

# Setup cron job
crontab -e
0 2 * * * /path/to/webce/scripts/backup-database.sh
```

Backups include:
- SQLite database
- Uploaded media files
- Environment configuration

### Updates

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Run migrations if needed
docker-compose exec backend npm run db:migrate
```

### Health Checks

```bash
# Backend health
curl http://localhost:3000/api/health

# Check database
sqlite3 cms/backend/data/cyeyes.db "SELECT COUNT(*) FROM users;"

# View logs
tail -f cms/backend/logs/combined.log
```

---

## 🎨 Brand Identity

**CyEyes Color Palette:**
- Primary Navy: `#1a1f4d`
- Primary Cyan: `#17a2b8`
- Light Cyan: `#4fc3dc`
- Accent Blue: `#2196F3`
- Accent Teal: `#00BCD4`

**Typography:**
- Headings: Orbitron
- Body: Inter
- Code: Fira Code

---

## 📚 Documentation

- [CMS-BRD.md](CMS-BRD.md) - Business Requirements Document
- [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) - Complete deployment guide
- [QUICK-START.md](QUICK-START.md) - Quick start guide
- [cms/README.md](cms/README.md) - CMS specific documentation
- [landing-page/README.md](landing-page/README.md) - Landing page documentation

---

## 🐛 Troubleshooting

### Backend not starting

```bash
docker-compose logs backend
docker-compose restart backend
```

### Database errors

```bash
# Backup and recreate
cp cms/backend/data/cyeyes.db cms/backend/data/cyeyes.db.backup
docker-compose exec backend npm run db:setup
```

### CORS errors

Check `CORS_ORIGIN` in backend `.env` matches frontend domain.

### Port conflicts

```bash
# Check port usage
lsof -i :3000
lsof -i :5173

# Stop conflicting services or change ports in docker-compose.yml
```

For more troubleshooting, see [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md#troubleshooting).

---

## 🤝 Contributing

This is a proprietary project for CyEyes. Internal team members should follow:

1. Create feature branches from `main`
2. Follow code style guidelines
3. Write tests for new features
4. Update documentation
5. Submit pull requests for review

---

## 📄 License

**Proprietary - All Rights Reserved**

Copyright © 2025 CyEyes.io

This software and associated documentation are proprietary to CyEyes.io. Unauthorized copying, distribution, modification, or use of this software, via any medium, is strictly prohibited without explicit written permission from CyEyes.io.

**For licensing inquiries, contact:**
- Email: hello@cyeyes.io
- Website: https://cyeyes.io

---

## 📞 Support

For technical support or questions:

- **Email**: hello@cyeyes.io
- **Website**: https://cyeyes.io
- **Documentation**: See docs in this repository

---

## 🚀 Roadmap

### Current Version: 1.0 (MVP)
- ✅ Core CMS functionality
- ✅ RBAC with 3 roles
- ✅ OWASP security compliance
- ✅ Docker deployment
- ✅ Bilingual support

### Future Enhancements (Post-MVP)
- 📧 Email newsletter system
- 🔍 Advanced search with full-text search
- 📊 Analytics dashboard
- 💬 Comments system with moderation
- 🤖 AI-powered content suggestions
- 📱 Progressive Web App (PWA)
- 🔄 Content versioning & rollback
- 📝 Workflow approvals
- 🌍 Geo-targeting content

---

## 👥 Team

**CyEyes Development Team**

---

## 🎉 Acknowledgments

Built with modern technologies:
- [Node.js](https://nodejs.org/) - Runtime environment
- [Express.js](https://expressjs.com/) - Web framework
- [React](https://react.dev/) - Frontend library
- [Vite](https://vitejs.dev/) - Build tool
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [SQLite](https://www.sqlite.org/) - Database
- [Docker](https://www.docker.com/) - Containerization
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

**© 2025 CyEyes.io - All Rights Reserved**
