# CyEyes CMS Platform

Modern, secure, bilingual Content Management System for CyEyes cybersecurity company.

## 🎯 Features

- **🔐 Security First**: OWASP Top 10 compliant with comprehensive security measures
- **🌐 Bilingual**: Full Vietnamese/English support
- **👥 Role-Based Access**: 3-tier permission system (User, Content Manager, Admin)
- **📝 Content Management**: Blog, Team, Customers, Products/Services
- **📊 Analytics**: Traffic monitoring and audit logging
- **🎨 Modern UI**: React + Tailwind CSS with CyEyes brand identity
- **🐳 Docker Ready**: Complete containerization with Docker Compose
- **⚡ Performance**: Optimized builds, lazy loading, code splitting

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js + TypeScript
- **Database**: SQLite3 with Drizzle ORM
- **Security**: JWT, bcrypt, Helmet.js, express-rate-limit, Zod validation

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **i18n**: react-i18next
- **Editor**: TipTap

### DevOps
- **Container**: Docker + Docker Compose
- **Process Manager**: PM2
- **Web Server**: Nginx

## 📁 Project Structure

```
cms/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── config/         # Database, JWT, rate-limit configs
│   │   ├── middleware/     # Auth, RBAC, validation, security
│   │   ├── models/         # Drizzle ORM schemas
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   └── schemas/        # Zod validation schemas
│   ├── database/           # SQLite database files
│   ├── uploads/            # User-uploaded media
│   └── logs/               # Application logs
├── frontend/               # React SPA
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client
│   │   ├── hooks/          # Custom React hooks
│   │   ├── store/          # Zustand stores
│   │   └── utils/          # Helper functions
│   └── public/             # Static assets
├── docker/                 # Docker configurations
│   ├── nginx/             # Nginx configs
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
└── docker-compose.yml     # Multi-container orchestration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm 10+
- Docker & Docker Compose (for containerized deployment)

### Development Setup

1. **Clone and navigate to CMS directory:**
   ```bash
   cd cms
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   npm run db:setup  # Initialize database and create tables
   npm run db:seed   # Seed initial data (admin user)
   npm run dev       # Start dev server at http://localhost:3000
   ```

   **Default Admin Credentials:**
   ```
   Email: admin@cyeyes.com
   Password: Admin123!
   ```
   ⚠️ **Change immediately after first login!**

3. **Setup Frontend (in new terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev       # Start dev server at http://localhost:5173
   ```

### Docker Deployment (Recommended for Production)

1. **Copy and configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env - IMPORTANT: Change JWT_SECRET and other secrets!
   ```

2. **Build and start services:**
   ```bash
   docker-compose up -d --build
   ```

3. **Access the application:**
   - Frontend: http://localhost
   - API: http://localhost:3000/api

4. **View logs:**
   ```bash
   docker-compose logs -f
   ```

5. **Stop services:**
   ```bash
   docker-compose down
   ```

## 🔒 Security Features

### OWASP Top 10 Coverage

✅ **A01 - Broken Access Control**: JWT + RBAC middleware
✅ **A02 - Cryptographic Failures**: bcrypt (12 rounds) + secure cookies
✅ **A03 - Injection**: Drizzle ORM + Zod validation + sanitize-html
✅ **A04 - Insecure Design**: Rate limiting + CSRF protection
✅ **A05 - Security Misconfiguration**: Helmet.js + security headers
✅ **A06 - Vulnerable Components**: Regular npm audit + Dependabot
✅ **A07 - Authentication Failures**: Strong password policy + account lockout
✅ **A08 - Data Integrity**: Audit logs + file integrity checks
✅ **A09 - Logging Failures**: Winston logger + security event monitoring
✅ **A10 - SSRF**: URL validation + domain whitelisting

### Rate Limiting (Configurable via Admin)

| Endpoint | Default Limit |
|----------|---------------|
| Login | 5 attempts / 15 min |
| API (authenticated) | 100 requests / 15 min |
| API (public) | 30 requests / 15 min |
| Contact form | 3 submissions / hour |
| File upload | 10 files / hour |

## 👥 User Roles & Permissions

### 1. User (Public)
- View published content
- Submit contact forms

### 2. Content Manager
- All User permissions
- Create/Edit/Delete: Blog posts, Team profiles, Customer profiles
- Manage media library
- Preview unpublished content

### 3. Admin
- All Content Manager permissions
- Manage users & roles
- Configure rate limits
- View analytics & audit logs
- Manage products/services
- System settings

## 📚 API Documentation

### Authentication
```
POST   /api/auth/login           # Login
POST   /api/auth/logout          # Logout
POST   /api/auth/refresh         # Refresh token
GET    /api/auth/me              # Get current user
```

### Blog Management
```
GET    /api/blogs                # List published blogs (public)
GET    /api/blogs/:slug          # Get single blog (public)
POST   /api/admin/blogs          # Create blog (content, admin)
PUT    /api/admin/blogs/:id      # Update blog (content, admin)
DELETE /api/admin/blogs/:id      # Delete blog (content, admin)
```

### Team Management
```
GET    /api/team                 # List team members (public)
POST   /api/admin/team           # Create member (content, admin)
PUT    /api/admin/team/:id       # Update member (content, admin)
DELETE /api/admin/team/:id       # Delete member (content, admin)
```

*Full API documentation available in [CMS-BRD.md](../CMS-BRD.md)*

## 🎨 Brand Integration

The CMS uses CyEyes brand identity:

**Colors:**
- Primary Navy: `#1a1f4d`
- Primary Cyan: `#17a2b8`
- Light Cyan: `#4fc3dc`
- Accent Blue: `#2196F3`
- Accent Teal: `#00BCD4`

**Typography:**
- Headings: Orbitron
- Body: Inter
- Code: Fira Code

**Design Elements:**
- Glass morphism effects
- Particle backgrounds
- Gradient buttons with glow
- Smooth animations

## 🧪 Testing

### Backend
```bash
cd backend
npm run test              # Run tests
npm run test:coverage     # With coverage
npm run lint              # Lint code
```

### Frontend
```bash
cd frontend
npm run test              # Run tests
npm run type-check        # TypeScript check
npm run lint              # Lint code
```

## 📦 Database Schema

Key tables:
- `users` - Authentication & authorization
- `blog_posts` - Blog content (bilingual)
- `team_members` - Team profiles (bilingual)
- `customers` - Customer case studies (bilingual)
- `products` - Products/services (bilingual)
- `media` - Uploaded files metadata
- `settings` - System configuration
- `rate_limits` - Rate limit configs
- `audit_logs` - Security & action logs
- `traffic_logs` - Access analytics

*Full schema in [CMS-BRD.md](../CMS-BRD.md)*

## 🔧 Configuration

### Environment Variables

**Backend** (`.env`):
```env
NODE_ENV=production
PORT=3000
DATABASE_PATH=./database/cyeyes.db
JWT_SECRET=your-secret-key
BCRYPT_ROUNDS=12
CORS_ORIGIN=https://cyeyes.com
```

**Frontend** (`.env`):
```env
VITE_API_URL=https://api.cyeyes.com
VITE_DEFAULT_LANGUAGE=vi
```

### Admin Portal Configuration

Access admin settings at `/admin/settings` to configure:
- Site metadata (titles, descriptions)
- Rate limiting per endpoint
- Security policies
- Analytics settings

## 📊 Monitoring

### Health Checks
- Backend: `GET /api/health`
- Frontend: `GET /`

### Logs
- Application logs: `backend/logs/`
- Access logs: `backend/logs/access.log`
- Error logs: `backend/logs/error.log`
- Security logs: `backend/logs/security.log`

### Docker Health Checks
```bash
docker ps                    # Check container status
docker-compose logs backend  # View backend logs
docker-compose logs frontend # View frontend logs
```

## 🚢 Deployment

### Production Checklist

- [ ] Change all default secrets in `.env`
- [ ] Configure CORS for production domain
- [ ] Setup HTTPS/SSL certificates
- [ ] Enable rate limiting
- [ ] Configure backup strategy
- [ ] Setup monitoring/alerting
- [ ] Run security audit: `npm audit`
- [ ] Test all authentication flows
- [ ] Verify file upload restrictions
- [ ] Check error handling doesn't leak info

### Backup Strategy

**Database:**
```bash
# Backup
cp backend/database/cyeyes.db backups/cyeyes-$(date +%Y%m%d).db

# Restore
cp backups/cyeyes-20250114.db backend/database/cyeyes.db
```

**Media Files:**
```bash
# Backup
tar -czf backups/uploads-$(date +%Y%m%d).tar.gz backend/uploads/

# Restore
tar -xzf backups/uploads-20250114.tar.gz -C backend/
```

## 🤝 Contributing

1. Follow TypeScript strict mode
2. Use ESLint + Prettier
3. Write tests for new features
4. Update documentation
5. Follow security best practices

## 📄 License

UNLICENSED - Proprietary to CyEyes

## 📞 Support

For issues and questions, contact: admin@cyeyes.com

## 📚 Additional Documentation

- [Business Requirements Document (BRD)](../CMS-BRD.md)
- [Landing Page Documentation](../landing-page/README.md)
- [API Documentation](./docs/API.md) *(coming soon)*
- [Security Guidelines](./docs/SECURITY.md) *(coming soon)*

---

**Built with ❤️ by CyEyes Development Team**
