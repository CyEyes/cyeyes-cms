# Business Requirements Document (BRD)
## CyEyes Corporate CMS Platform

**Version:** 1.0
**Date:** 2025-01-14
**Status:** Approved for Development

---

## 1. TỔNG QUAN DỰ ÁN / PROJECT OVERVIEW

### 1.1 Mục đích / Purpose
Phát triển hệ thống CMS (Content Management System) đơn giản nhưng đầy đủ tính năng để:
- Giới thiệu hồ sơ công ty CyEyes
- Quản lý và hiển thị hồ sơ nhân sự
- Showcase khách hàng tiêu biểu
- Giới thiệu hệ thống sản phẩm/dịch vụ
- Quản lý blog và nội dung động
- Hỗ trợ song ngữ Anh-Việt
- Đảm bảo bảo mật theo chuẩn OWASP

### 1.2 Phạm vi / Scope
**Trong phạm vi (In Scope):**
- ✅ Hệ thống CMS với Admin Portal (Tích hợp MFA Google Authentication khi đăng nhập)
- ✅ RESTful API cho quản lý nội dung
- ✅ Hệ thống phân quyền 3 cấp (User, Content Manager, Admin)
- ✅ Quản lý blog, media, team profiles, customers
- ✅ Rate limiting có thể cấu hình
- ✅ Bảo mật OWASP compliant
- ✅ Docker deployment
- ✅ Bilingual (English/Vietnamese)

**Ngoài phạm vi (Out of Scope):**
- ❌ E-commerce functionality
- ❌ Live chat/messaging
- ❌ Complex workflow automation
- ❌ Mobile native apps

---

## 2. KIẾN TRÚC HỆ THỐNG / SYSTEM ARCHITECTURE

### 2.1 Tech Stack Selection

#### **Frontend**
- **Framework:** React.js 18+ với Vite
  - *Lý do:* Component-based, SEO-friendly với SSR options, ecosystem mạnh
- **State Management:** Zustand (lightweight alternative to Redux)
- **UI Framework:** Tailwind CSS + shadcn/ui components
- **i18n:** react-i18next
- **Form Handling:** React Hook Form + Zod validation
- **Rich Text Editor:** TipTap (modern, extensible)

#### **Backend**
- **Runtime:** Node.js 20 LTS
- **Framework:** Express.js 4.x
  - *Lý do:* Lightweight, proven, excellent middleware ecosystem
- **Database:** SQLite3 với better-sqlite3 driver
  - *Lý do:* Zero-config, file-based, đủ cho traffic vừa/nhỏ, dễ backup
- **ORM:** Drizzle ORM
  - *Lý do:* TypeScript-first, lightweight, type-safe

#### **Security**
- **Authentication:** JWT (jsonwebtoken) + httpOnly cookies
- **Password Hashing:** bcrypt
- **Security Headers:** Helmet.js
- **Rate Limiting:** express-rate-limit + rate-limit-redis (optional)
- **Input Validation:** Zod schemas
- **CSRF Protection:** csurf middleware
- **XSS Protection:** DOMPurify (frontend) + sanitize-html (backend)
- **SQL Injection:** Drizzle ORM (parameterized queries)

#### **DevOps**
- **Containerization:** Docker + Docker Compose
- **Process Manager:** PM2 (inside container)
- **Reverse Proxy:** Nginx
- **Logging:** Winston + Morgan
- **Monitoring:** Custom health check endpoints

---

## 3. CHỨC NĂNG CHI TIẾT / DETAILED FEATURES

### 3.1 Hệ thống Phân quyền / Role-Based Access Control (RBAC)

#### **3 Cấp độ quyền / 3 Permission Levels**

| Role | Permissions | Description |
|------|-------------|-------------|
| **User** | - View published content<br>- Comment on blogs (optional)<br>- Subscribe to newsletter | Khách truy cập đã đăng ký |
| **Content Manager** | - User permissions<br>- Create/Edit/Delete blog posts<br>- Manage media library<br>- Manage team profiles<br>- Manage customer profiles<br>- Preview unpublished content | Người quản lý nội dung |
| **Admin** | - All Content Manager permissions<br>- Manage users & roles<br>- Configure rate limits<br>- View analytics/traffic logs<br>- Manage products/services<br>- Configure system settings<br>- Access security logs | Quản trị viên hệ thống |

### 3.2 Public-Facing Pages (Frontend)

#### **3.2.1 Homepage**
- Hero section với brand identity CyEyes
- Featured products/services
- Latest blog posts
- Customer testimonials
- CTA buttons
- Language switcher (EN/VI)

#### **3.2.2 About Us / Giới Thiệu Công Ty**
- Company profile
- Mission, Vision, Values
- Company timeline
- Certifications & awards
- Office locations

#### **3.2.3 Team / Đội Ngũ Nhân Sự**
- Grid view of team members
- Individual profiles:
  - Photo
  - Name
  - Position/Title
  - Bio (short & long versions)
  - Social links
  - Areas of expertise
- Filter by department/role

#### **3.2.4 Customers / Khách Hàng Tiêu Biểu**
- Customer logo showcase
- Case studies / Success stories:
  - Customer name & logo
  - Industry
  - Challenge
  - Solution provided
  - Results & metrics
  - Testimonial quote
- Filter by industry

#### **3.2.5 Products & Services / Sản Phẩm & Dịch Vụ**
- Product categories
- Each product/service page:
  - Name, tagline
  - Description (short & long)
  - Key features
  - Pricing tiers (if applicable)
  - Screenshots/demos
  - CTA (Request demo, Contact sales)
  - Related products

#### **3.2.6 Blog**
- Blog listing page (pagination)
- Categories & tags
- Search functionality
- Single blog post view:
  - Title
  - Author & publish date
  - Featured image
  - Content (rich text)
  - Tags
  - Related posts
  - Share buttons

#### **3.2.7 Contact**
- Contact form (with rate limiting)
- Office locations & map
- Business hours
- Social media links

### 3.3 Admin Portal Features

#### **3.3.1 Dashboard**
- Overview statistics:
  - Total posts, published/draft
  - Total team members
  - Total customers
  - Recent traffic (last 7/30 days)
  - Storage usage
- Recent activity log
- Quick actions

#### **3.3.2 Content Management**

**Blog Posts:**
- Create/Edit/Delete posts
- Rich text editor (TipTap)
- SEO metadata (title, description, keywords)
- Featured image upload
- Categories & tags management
- Publish status (Draft, Published, Archived)
- Schedule publishing
- Slug customization
- Bilingual content (EN/VI versions)

**Pages:**
- Manage static pages (About, Contact, etc.)
- Page builder with reusable blocks
- Preview before publish

#### **3.3.3 Media Library**
- Upload images, PDFs, videos
- File browser with grid/list view
- Search & filter by type
- File metadata (title, alt text, description)
- Image optimization (auto-resize, WebP conversion)
- Storage quota tracking
- Bulk actions (delete, move to folder)

#### **3.3.4 Team Management**
- Add/Edit/Remove team members
- Fields:
  - Name (EN/VI)
  - Position/Title (EN/VI)
  - Department
  - Photo
  - Short bio (EN/VI)
  - Full bio (EN/VI)
  - Email, Phone
  - Social links (LinkedIn, Twitter, etc.)
  - Areas of expertise
  - Display order
  - Active/Inactive status

#### **3.3.5 Customer Management**
- Add/Edit/Remove customers
- Fields:
  - Company name
  - Logo
  - Industry
  - Website
  - Case study:
    - Title (EN/VI)
    - Challenge (EN/VI)
    - Solution (EN/VI)
    - Results (EN/VI)
    - Metrics/Stats
  - Testimonial:
    - Quote (EN/VI)
    - Author name & position
  - Display on homepage (Yes/No)
  - Display order

#### **3.3.6 Product/Service Management**
- Add/Edit/Remove products
- Fields:
  - Name (EN/VI)
  - Tagline (EN/VI)
  - Category
  - Short description (EN/VI)
  - Full description (EN/VI)
  - Features list (EN/VI)
  - Screenshots/Images
  - Pricing (optional)
  - CTA button text & link
  - Related products
  - Active/Inactive status
  - Display order

#### **3.3.7 User Management (Admin only)**
- List all users
- Create/Edit/Delete users
- Assign roles
- Reset passwords
- View user activity logs
- Enable/Disable accounts
- Enable/Disable Google Authenticator

#### **3.3.8 Settings**

**General:**
- Site title (EN/VI)
- Site description (EN/VI)
- Logo upload
- Favicon
- Default language
- Contact information
- Social media links

**Rate Limiting Configuration:**
- Contact form: X requests per Y minutes
- Blog comments: X requests per Y minutes
- API endpoints: X requests per Y minutes
- File uploads: X MB per Y minutes
- Login attempts: X tries per Y minutes
- Customizable per endpoint

**Security:**
- Force password change interval
- Session timeout
- IP whitelist (optional)
- Security event log viewer
- Failed login attempts log

**Analytics:**
- Enable/disable traffic logging
- Data retention period
- Privacy compliance settings

---

## 4. BẢO MẬT / SECURITY REQUIREMENTS

### 4.1 OWASP Top 10 Compliance

#### **A01:2021 – Broken Access Control**
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Middleware để verify quyền trước mỗi request
- ✅ Không expose IDs trực tiếp (sử dụng UUIDs)

#### **A02:2021 – Cryptographic Failures**
- ✅ Bcrypt cho password hashing (salt rounds: 12)
- ✅ HTTPS only (trong production)
- ✅ Secure cookie flags (httpOnly, secure, sameSite)
- ✅ Environment variables cho sensitive data

#### **A03:2021 – Injection**
- ✅ Drizzle ORM với parameterized queries
- ✅ Input validation với Zod schemas
- ✅ Sanitize HTML content (sanitize-html)
- ✅ Content Security Policy headers

#### **A04:2021 – Insecure Design**
- ✅ Rate limiting trên tất cả public endpoints
- ✅ CSRF protection
- ✅ File upload restrictions (type, size)
- ✅ Secure password reset flow

#### **A05:2021 – Security Misconfiguration**
- ✅ Helmet.js cho security headers
- ✅ Disable unnecessary features
- ✅ Remove default credentials
- ✅ Error handling không leak information

#### **A06:2021 – Vulnerable and Outdated Components**
- ✅ Regular dependency updates
- ✅ npm audit trong CI/CD
- ✅ Dependabot alerts

#### **A07:2021 – Identification and Authentication Failures**
- ✅ Strong password policy (min 8 chars, complexity)
- ✅ Account lockout after failed attempts
- ✅ Secure session management
- ✅ Multi-device session tracking

#### **A08:2021 – Software and Data Integrity Failures**
- ✅ Digital signatures cho updates
- ✅ Integrity checks cho uploaded files
- ✅ Audit log cho critical actions

#### **A09:2021 – Security Logging and Monitoring Failures**
- ✅ Winston logger cho all events
- ✅ Failed login attempts logging
- ✅ Security event monitoring
- ✅ Audit trail cho admin actions

#### **A10:2021 – Server-Side Request Forgery (SSRF)**
- ✅ Validate URLs before fetching
- ✅ Whitelist allowed domains
- ✅ Disable unnecessary protocols

### 4.2 Rate Limiting Strategy

| Endpoint Type | Rate Limit | Configuration |
|---------------|-----------|---------------|
| Login | 5 attempts / 15 min per IP | Admin configurable |
| API (authenticated) | 100 requests / 15 min per user | Admin configurable |
| API (public) | 30 requests / 15 min per IP | Admin configurable |
| Contact form | 3 submissions / hour per IP | Admin configurable |
| File upload | 10 files / hour per user | Admin configurable |
| Password reset | 3 attempts / hour per email | Admin configurable |

**Rate Limit Response:**
```json
{
  "error": "Too many requests",
  "retryAfter": 900,
  "message": "Please try again in 15 minutes"
}
```

### 4.3 Input Validation Rules

**General:**
- Maximum request body: 10MB (configurable)
- Allowed file types: jpg, jpeg, png, webp, pdf, mp4 (configurable)
- Maximum file size: 5MB per file (configurable)
- XSS prevention: Sanitize all user inputs
- SQL Injection: ORM với prepared statements

**Specific Fields:**
- Email: RFC 5322 compliant
- Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
- URLs: Valid HTTP/HTTPS only
- Phone: E.164 format
- Text fields: Max length limits
- Rich text: Allowed HTML tags whitelist

---

## 5. CẤU TRÚC DỰ ÁN / PROJECT STRUCTURE

```
cyeyes-cms/
├── docker/
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── ssl/ (certificates)
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── jwt.ts
│   │   │   └── rate-limit.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── rbac.ts
│   │   │   ├── rate-limit.ts
│   │   │   ├── validate.ts
│   │   │   ├── error-handler.ts
│   │   │   └── security.ts
│   │   ├── models/
│   │   │   ├── user.ts
│   │   │   ├── blog.ts
│   │   │   ├── team.ts
│   │   │   ├── customer.ts
│   │   │   ├── product.ts
│   │   │   └── media.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── blog.routes.ts
│   │   │   ├── team.routes.ts
│   │   │   ├── customer.routes.ts
│   │   │   ├── product.routes.ts
│   │   │   ├── media.routes.ts
│   │   │   └── admin.routes.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── blog.controller.ts
│   │   │   ├── team.controller.ts
│   │   │   ├── customer.controller.ts
│   │   │   ├── product.controller.ts
│   │   │   └── media.controller.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── email.service.ts
│   │   │   ├── image.service.ts
│   │   │   └── logger.service.ts
│   │   ├── utils/
│   │   │   ├── validation.ts
│   │   │   ├── sanitize.ts
│   │   │   └── helpers.ts
│   │   ├── schemas/
│   │   │   ├── user.schema.ts
│   │   │   ├── blog.schema.ts
│   │   │   └── common.schema.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── uploads/ (gitignored)
│   ├── database/ (gitignored)
│   ├── logs/ (gitignored)
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── drizzle.config.ts
├── frontend/
│   ├── public/
│   │   ├── media/ (brand assets)
│   │   └── locales/
│   │       ├── en/
│   │       │   └── translation.json
│   │       └── vi/
│   │           └── translation.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── LanguageSwitcher.tsx
│   │   │   │   └── Particle Background.tsx
│   │   │   ├── admin/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── DashboardCard.tsx
│   │   │   │   ├── RichTextEditor.tsx
│   │   │   │   ├── MediaUploader.tsx
│   │   │   │   └── DataTable.tsx
│   │   │   └── public/
│   │   │       ├── Hero.tsx
│   │   │       ├── BlogCard.tsx
│   │   │       ├── TeamMember.tsx
│   │   │       └── CustomerLogo.tsx
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── About.tsx
│   │   │   │   ├── Team.tsx
│   │   │   │   ├── Customers.tsx
│   │   │   │   ├── Products.tsx
│   │   │   │   ├── Blog.tsx
│   │   │   │   ├── BlogPost.tsx
│   │   │   │   └── Contact.tsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.tsx
│   │   │       ├── BlogManagement.tsx
│   │   │       ├── TeamManagement.tsx
│   │   │       ├── CustomerManagement.tsx
│   │   │       ├── ProductManagement.tsx
│   │   │       ├── MediaLibrary.tsx
│   │   │       ├── UserManagement.tsx
│   │   │       └── Settings.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── storage.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useFetch.ts
│   │   │   └── useLocalStorage.ts
│   │   ├── store/
│   │   │   ├── authStore.ts
│   │   │   └── uiStore.ts
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   └── admin.css
│   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   └── helpers.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── i18n.ts
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 6. DATABASE SCHEMA

### 6.1 Core Tables

#### **users**
```sql
id              TEXT PRIMARY KEY (UUID)
email           TEXT UNIQUE NOT NULL
password        TEXT NOT NULL (bcrypt hash)
role            TEXT NOT NULL CHECK(role IN ('user', 'content', 'admin'))
full_name       TEXT NOT NULL
avatar          TEXT
is_active       INTEGER DEFAULT 1
last_login      TEXT (ISO datetime)
created_at      TEXT NOT NULL
updated_at      TEXT NOT NULL
```

#### **blog_posts**
```sql
id              TEXT PRIMARY KEY (UUID)
slug            TEXT UNIQUE NOT NULL
title_en        TEXT NOT NULL
title_vi        TEXT NOT NULL
content_en      TEXT NOT NULL
content_vi      TEXT NOT NULL
excerpt_en      TEXT
excerpt_vi      TEXT
featured_image  TEXT
author_id       TEXT REFERENCES users(id)
category        TEXT
tags            TEXT (JSON array)
status          TEXT CHECK(status IN ('draft', 'published', 'archived'))
published_at    TEXT
seo_title_en    TEXT
seo_title_vi    TEXT
seo_desc_en     TEXT
seo_desc_vi     TEXT
seo_keywords    TEXT (JSON array)
view_count      INTEGER DEFAULT 0
created_at      TEXT NOT NULL
updated_at      TEXT NOT NULL
```

#### **team_members**
```sql
id              TEXT PRIMARY KEY (UUID)
name_en         TEXT NOT NULL
name_vi         TEXT NOT NULL
position_en     TEXT NOT NULL
position_vi     TEXT NOT NULL
department      TEXT
photo           TEXT NOT NULL
short_bio_en    TEXT
short_bio_vi    TEXT
full_bio_en     TEXT
full_bio_vi     TEXT
email           TEXT
phone           TEXT
social_links    TEXT (JSON: {linkedin, twitter, github})
expertise       TEXT (JSON array)
display_order   INTEGER DEFAULT 0
is_active       INTEGER DEFAULT 1
created_at      TEXT NOT NULL
updated_at      TEXT NOT NULL
```

#### **customers**
```sql
id              TEXT PRIMARY KEY (UUID)
company_name    TEXT NOT NULL
logo            TEXT NOT NULL
industry        TEXT
website         TEXT
case_study      TEXT (JSON: {title_en, title_vi, challenge_en, challenge_vi, solution_en, solution_vi, results_en, results_vi, metrics})
testimonial     TEXT (JSON: {quote_en, quote_vi, author_name, author_position})
show_homepage   INTEGER DEFAULT 0
display_order   INTEGER DEFAULT 0
created_at      TEXT NOT NULL
updated_at      TEXT NOT NULL
```

#### **products**
```sql
id              TEXT PRIMARY KEY (UUID)
slug            TEXT UNIQUE NOT NULL
name_en         TEXT NOT NULL
name_vi         TEXT NOT NULL
category        TEXT
tagline_en      TEXT
tagline_vi      TEXT
short_desc_en   TEXT
short_desc_vi   TEXT
full_desc_en    TEXT
full_desc_vi    TEXT
features        TEXT (JSON array: [{title_en, title_vi, desc_en, desc_vi}])
images          TEXT (JSON array of URLs)
pricing         TEXT (JSON: {tiers})
cta_text_en     TEXT
cta_text_vi     TEXT
cta_link        TEXT
related_products TEXT (JSON array of UUIDs)
is_active       INTEGER DEFAULT 1
display_order   INTEGER DEFAULT 0
created_at      TEXT NOT NULL
updated_at      TEXT NOT NULL
```

#### **media**
```sql
id              TEXT PRIMARY KEY (UUID)
filename        TEXT NOT NULL
original_name   TEXT NOT NULL
file_path       TEXT NOT NULL
file_type       TEXT NOT NULL (image, video, document)
mime_type       TEXT NOT NULL
file_size       INTEGER NOT NULL (bytes)
title           TEXT
alt_text        TEXT
description     TEXT
uploaded_by     TEXT REFERENCES users(id)
folder          TEXT DEFAULT '/'
created_at      TEXT NOT NULL
```

#### **settings**
```sql
key             TEXT PRIMARY KEY
value           TEXT NOT NULL (JSON)
description     TEXT
updated_by      TEXT REFERENCES users(id)
updated_at      TEXT NOT NULL
```

#### **rate_limits**
```sql
endpoint        TEXT PRIMARY KEY
max_requests    INTEGER NOT NULL
window_ms       INTEGER NOT NULL (milliseconds)
enabled         INTEGER DEFAULT 1
description     TEXT
updated_at      TEXT NOT NULL
```

#### **audit_logs**
```sql
id              TEXT PRIMARY KEY (UUID)
user_id         TEXT REFERENCES users(id)
action          TEXT NOT NULL (create, update, delete, login, etc.)
resource_type   TEXT NOT NULL (blog, team, customer, etc.)
resource_id     TEXT
ip_address      TEXT
user_agent      TEXT
details         TEXT (JSON)
created_at      TEXT NOT NULL
```

#### **traffic_logs**
```sql
id              TEXT PRIMARY KEY (UUID)
path            TEXT NOT NULL
method          TEXT NOT NULL
status_code     INTEGER NOT NULL
ip_address      TEXT
user_agent      TEXT
referer         TEXT
response_time   INTEGER (ms)
user_id         TEXT REFERENCES users(id)
created_at      TEXT NOT NULL
```

---

## 7. API ENDPOINTS

### 7.1 Authentication

```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/me
```

### 7.2 Blog Management

```
GET    /api/blogs                    (public: published only)
GET    /api/blogs/:slug               (public)
POST   /api/admin/blogs               (content, admin)
PUT    /api/admin/blogs/:id           (content, admin)
DELETE /api/admin/blogs/:id           (content, admin)
GET    /api/admin/blogs               (content, admin: all statuses)
```

### 7.3 Team Management

```
GET    /api/team                      (public)
GET    /api/team/:id                  (public)
POST   /api/admin/team                (content, admin)
PUT    /api/admin/team/:id            (content, admin)
DELETE /api/admin/team/:id            (content, admin)
```

### 7.4 Customer Management

```
GET    /api/customers                 (public)
GET    /api/customers/:id             (public)
POST   /api/admin/customers           (content, admin)
PUT    /api/admin/customers/:id       (content, admin)
DELETE /api/admin/customers/:id       (content, admin)
```

### 7.5 Product Management

```
GET    /api/products                  (public)
GET    /api/products/:slug            (public)
POST   /api/admin/products            (content, admin)
PUT    /api/admin/products/:id        (content, admin)
DELETE /api/admin/products/:id        (content, admin)
```

### 7.6 Media Management

```
GET    /api/media                     (content, admin)
POST   /api/media/upload              (content, admin)
DELETE /api/media/:id                 (content, admin)
PUT    /api/media/:id                 (content, admin: metadata only)
```

### 7.7 User Management (Admin only)

```
GET    /api/admin/users
POST   /api/admin/users
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
PUT    /api/admin/users/:id/role
```

### 7.8 Settings & Configuration (Admin only)

```
GET    /api/admin/settings
PUT    /api/admin/settings/:key
GET    /api/admin/rate-limits
PUT    /api/admin/rate-limits/:endpoint
```

### 7.9 Analytics (Admin only)

```
GET    /api/admin/analytics/dashboard
GET    /api/admin/analytics/traffic
GET    /api/admin/audit-logs
```

### 7.10 Public Contact

```
POST   /api/contact                   (rate limited)
```

---

## 8. DOCKER DEPLOYMENT

### 8.1 Services

**docker-compose.yml:**
```yaml
services:
  nginx:
    - Reverse proxy
    - SSL termination
    - Static file serving
    - Load balancing (future)

  backend:
    - Node.js + Express API
    - PM2 process manager
    - Volume mounts: database, uploads, logs

  frontend:
    - React SPA (production build)
    - Served by Nginx
```

### 8.2 Environment Variables

**Backend (.env):**
```
NODE_ENV=production
PORT=3000
DATABASE_PATH=/app/database/cyeyes.db
JWT_SECRET=<random-256-bit-key>
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,webp,pdf,mp4
CORS_ORIGIN=https://cyeyes.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

**Frontend (.env):**
```
VITE_API_URL=https://api.cyeyes.com
VITE_DEFAULT_LANGUAGE=vi
```

### 8.3 Volumes

```
- ./backend/database:/app/database (SQLite file)
- ./backend/uploads:/app/uploads (media files)
- ./backend/logs:/app/logs (application logs)
- ./docker/nginx/ssl:/etc/nginx/ssl (certificates)
```

---

## 9. BRAND IDENTITY INTEGRATION

### 9.1 Color Palette (from index.html)

```css
/* Light Theme */
--primary-navy: #1a1f4d;
--primary-cyan: #17a2b8;
--light-cyan: #4fc3dc;
--accent-blue: #2196F3;
--accent-teal: #00BCD4;

--bg-light: #f8f9fa;
--bg-white: #ffffff;
--bg-gradient: linear-gradient(135deg, #e3f2fd 0%, #f0f4f8 50%, #e8f5e9 100%);

--text-primary: #1a1f4d;
--text-secondary: #546e7a;
--text-accent: #17a2b8;
```

### 9.2 Typography

```css
/* Headings */
font-family: 'Orbitron', sans-serif;

/* Body */
font-family: 'Inter', sans-serif;

/* Code/Monospace */
font-family: 'Fira Code', monospace;
```

### 9.3 Design Elements

- Glass morphism effects (backdrop-filter: blur)
- Particle/network background animation
- Gradient buttons with glow effects
- Card-based layouts with hover animations
- Smooth transitions (0.3s ease)

---

## 10. SECURITY CHECKLIST

### 10.1 Pre-Launch Checklist

- [ ] All dependencies updated to latest stable
- [ ] npm audit shows no vulnerabilities
- [ ] HTTPS enforced (HSTS enabled)
- [ ] Security headers configured (Helmet.js)
- [ ] Rate limiting active on all public endpoints
- [ ] CSRF protection enabled
- [ ] Input validation on all forms
- [ ] File upload restrictions tested
- [ ] SQL injection tests passed
- [ ] XSS prevention verified
- [ ] Password policy enforced
- [ ] JWT secrets are strong & unique
- [ ] Environment variables not committed
- [ ] Error messages don't leak sensitive info
- [ ] Audit logging functional
- [ ] Backup strategy in place
- [ ] Docker containers run as non-root user

### 10.2 Ongoing Security

- Weekly dependency updates
- Monthly security audits
- Quarterly penetration testing
- Log review (weekly)
- Incident response plan documented

---

## 11. PERFORMANCE TARGETS

- **Page Load Time:** < 2s (desktop), < 3s (mobile)
- **API Response Time:** < 200ms (average)
- **Database Query Time:** < 50ms (average)
- **Image Optimization:** Auto-convert to WebP
- **Bundle Size:** < 500KB (initial JS bundle)
- **Lighthouse Score:** > 90 (all categories)

---

## 12. BROWSER SUPPORT

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile: iOS Safari 14+, Chrome Mobile 90+

---

## 13. DELIVERABLES

### Phase 1: Foundation (Week 1-2)
- [x] BRD document
- [ ] Project structure setup
- [ ] Docker configuration
- [ ] Database schema & migrations
- [ ] Authentication system
- [ ] Basic API endpoints

### Phase 2: Core Features (Week 3-4)
- [ ] Blog management (frontend + backend)
- [ ] Team management
- [ ] Customer management
- [ ] Product management
- [ ] Media library

### Phase 3: Admin Portal (Week 5-6)
- [ ] Admin dashboard
- [ ] User management
- [ ] Settings & configuration
- [ ] Rate limit configuration
- [ ] Analytics & logs

### Phase 4: Public Pages (Week 7-8)
- [ ] Homepage
- [ ] About, Team, Customers pages
- [ ] Products page
- [ ] Blog listing & single post
- [ ] Contact page

### Phase 5: Polish & Security (Week 9-10)
- [ ] Security hardening
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Testing (unit, integration, e2e)
- [ ] Documentation
- [ ] Deployment guide

---

## 14. MAINTENANCE & SUPPORT

### 14.1 Backup Strategy
- **Database:** Daily automated backups (retain 30 days)
- **Media Files:** Weekly backups (retain 90 days)
- **Configuration:** Version controlled in Git

### 14.2 Monitoring
- Health check endpoint: `/api/health`
- Uptime monitoring (external service)
- Error tracking (Winston logs)
- Performance monitoring (response times)

### 14.3 Update Policy
- Security patches: Within 24 hours
- Minor updates: Monthly
- Major updates: Quarterly (with testing)

---

## 15. SUCCESS CRITERIA

✅ **Functional:**
- All core features working as specified
- Admin can manage all content types
- Users can view bilingual content
- Rate limiting prevents abuse

✅ **Security:**
- Passes OWASP security audit
- No critical vulnerabilities
- Authentication & authorization working correctly
- MFA using Google Authentication

✅ **Performance:**
- Meets performance targets
- Handles 100 concurrent users
- Database queries optimized

✅ **Usability:**
- Intuitive admin interface
- Mobile-responsive public pages
- Smooth language switching

---

## 16. FUTURE ENHANCEMENTS (Post-MVP)

- 📧 Email newsletter system
- 🔍 Advanced search with Elasticsearch
- 📊 Advanced analytics (Google Analytics integration)
- 💬 Comments system with moderation
- 🌐 Multi-tenancy support
- 🤖 AI-powered content suggestions
- 📱 Progressive Web App (PWA)
- 🔄 Content versioning & rollback
- 📝 Workflow approvals
- 🌍 Geo-targeting content

---

## APPENDIX A: GLOSSARY

- **CMS:** Content Management System
- **RBAC:** Role-Based Access Control
- **JWT:** JSON Web Token
- **OWASP:** Open Web Application Security Project
- **XSS:** Cross-Site Scripting
- **CSRF:** Cross-Site Request Forgery
- **SSRF:** Server-Side Request Forgery
- **HSTS:** HTTP Strict Transport Security
- **CORS:** Cross-Origin Resource Sharing
- **ORM:** Object-Relational Mapping

---

## APPENDIX B: CONTACT & APPROVALS

**Document Owner:** CyEyes Development Team
**Approved By:** [Stakeholder Name]
**Approval Date:** 2025-01-14
**Next Review Date:** 2025-04-14

---

**END OF DOCUMENT**
