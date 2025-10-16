# CyEyes CMS Backend

Node.js + Express + TypeScript backend API for CyEyes CMS platform.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Setup Database
```bash
# Generate schema and seed initial data
npm run db:setup
```

### 4. Start Development Server
```bash
npm run dev
```

Server will start at `http://localhost:3000`

## 📚 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run start:pm2` | Start with PM2 process manager |
| `npm run db:generate` | Generate migration files from schema |
| `npm run db:push` | Push schema changes to database |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed initial data |
| `npm run db:setup` | Push schema + seed (first-time setup) |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |
| `npm run lint` | Lint code |
| `npm run lint:fix` | Fix linting issues |
| `npm run test` | Run tests |
| `npm run security:audit` | Security audit |

## 📁 Project Structure

```
src/
├── config/          # Configuration (database, JWT, rate limits)
├── middleware/      # Express middleware (auth, RBAC, validation, security)
├── models/          # Drizzle ORM schemas
├── routes/          # API route definitions
├── controllers/     # Request handlers
├── services/        # Business logic
├── utils/           # Helper functions
├── schemas/         # Zod validation schemas
├── scripts/         # Utility scripts (seed, migrate)
├── types/           # TypeScript type definitions
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## 🔐 Authentication

### Login
```bash
POST /api/auth/login
{
  "email": "admin@cyeyes.com",
  "password": "your-password"
}
```

### Register
```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}
```

### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <token>
```

### Refresh Token
```bash
POST /api/auth/refresh
{
  "refreshToken": "<refresh-token>"
}
```

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **user** | View published content |
| **content** | + Create/edit blogs, team, customers, media |
| **admin** | + Manage users, settings, rate limits, analytics |

## 🔒 Security Features

- ✅ JWT authentication with httpOnly cookies
- ✅ bcrypt password hashing (12 rounds)
- ✅ Role-based access control (RBAC)
- ✅ Rate limiting (configurable)
- ✅ Input validation (Zod schemas)
- ✅ HTML sanitization (sanitize-html)
- ✅ Security headers (Helmet.js)
- ✅ SQL injection prevention (Drizzle ORM)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Audit logging
- ✅ Traffic logging

## 🗄️ Database

**Type:** SQLite3 with Drizzle ORM

**Tables:**
- `users` - User accounts
- `blog_posts` - Blog content (bilingual)
- `team_members` - Team profiles (bilingual)
- `customers` - Customer case studies (bilingual)
- `products` - Products/services (bilingual)
- `media` - Uploaded files metadata
- `settings` - System configuration
- `rate_limits` - Rate limit configs
- `audit_logs` - Security & action logs
- `traffic_logs` - Access analytics

### Database Management

```bash
# View database in GUI
npm run db:studio

# Generate migrations after schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Reset database (push schema + seed)
npm run db:setup
```

## 🔑 Default Credentials

After running `npm run db:seed`:

**Email:** `admin@cyeyes.com`
**Password:** `ChangeThisPassword123!`

⚠️ **CHANGE THIS PASSWORD IMMEDIATELY!**

## 🌍 Environment Variables

See [.env.example](.env.example) for all available options.

Required:
- `JWT_SECRET` - JWT signing secret (change in production!)
- `DATABASE_PATH` - Path to SQLite database file
- `CORS_ORIGIN` - Allowed CORS origins

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### Health Check
- `GET /api/health` - Server health status

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🔧 Development

### Hot Reload
Uses `tsx watch` for hot reload during development:
```bash
npm run dev
```

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
npm run lint:fix
```

## 🚀 Production Deployment

### 1. Build
```bash
npm run build
```

### 2. Start with PM2
```bash
npm run start:pm2
```

### 3. Monitor
```bash
pm2 logs cyeyes-cms-api
pm2 status
```

### Or use Docker
See main [docker-compose.yml](../docker-compose.yml) in project root.

## 📝 Logging

Logs are stored in `./logs/`:
- `combined.log` - All logs
- `error.log` - Error logs only
- `security.log` - Security events

## 🔐 Security Checklist

Before production:
- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Change default admin password
- [ ] Configure `CORS_ORIGIN` for your domain
- [ ] Enable HTTPS (via reverse proxy)
- [ ] Review rate limiting settings
- [ ] Run `npm audit`
- [ ] Setup backup strategy for database
- [ ] Configure proper logging rotation

## 🐛 Troubleshooting

### Database locked error
```bash
# Close all connections and restart
rm database/*.db-shm database/*.db-wal
npm run db:setup
```

### Port already in use
```bash
# Change PORT in .env
PORT=3001
```

### Permission denied errors
```bash
# Ensure directories exist and are writable
mkdir -p database uploads logs
chmod -R 755 database uploads logs
```

## 📚 Additional Resources

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Express.js Docs](https://expressjs.com/)
- [Zod Docs](https://zod.dev/)

---

**Built with ❤️ by CyEyes Development Team**
