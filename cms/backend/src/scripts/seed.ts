import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database.js';
import { users, rateLimits, settings } from '../models/index.js';
import { hashPassword } from '../services/auth.service.js';
import { logger } from '../services/logger.service.js';

dotenv.config();

/**
 * Seed initial data
 */
const seedDatabase = async (): Promise<void> => {
  try {
    logger.info('🌱 Starting database seed...');

    // ============================================
    // 1. CREATE ADMIN USER
    // ============================================
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@cyeyes.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!';
    const adminName = process.env.ADMIN_NAME || 'CyEyes Administrator';

    // Check if admin already exists
    const existingAdmin = await db.select().from(users).where((user) => user.email === adminEmail).get();

    if (!existingAdmin) {
      const hashedPassword = await hashPassword(adminPassword);

      await db.insert(users).values({
        id: uuidv4(),
        email: adminEmail,
        password: hashedPassword,
        fullName: adminName,
        role: 'admin',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      logger.info(`✅ Created admin user: ${adminEmail}`);
      logger.warn(`⚠️  Default password: ${adminPassword}`);
      logger.warn('⚠️  CHANGE THIS PASSWORD IMMEDIATELY!');
    } else {
      logger.info('ℹ️  Admin user already exists');
    }

    // ============================================
    // 2. SETUP DEFAULT RATE LIMITS
    // ============================================
    const defaultRateLimits = [
      {
        endpoint: '/api/auth/login',
        maxRequests: 5,
        windowMs: 900000, // 15 minutes
        enabled: true,
        description: 'Login endpoint rate limit',
        updatedAt: new Date().toISOString(),
      },
      {
        endpoint: '/api/auth/register',
        maxRequests: 3,
        windowMs: 3600000, // 1 hour
        enabled: true,
        description: 'Registration endpoint rate limit',
        updatedAt: new Date().toISOString(),
      },
      {
        endpoint: '/api/*',
        maxRequests: 100,
        windowMs: 900000, // 15 minutes
        enabled: true,
        description: 'General API rate limit',
        updatedAt: new Date().toISOString(),
      },
      {
        endpoint: '/api/contact',
        maxRequests: 3,
        windowMs: 3600000, // 1 hour
        enabled: true,
        description: 'Contact form rate limit',
        updatedAt: new Date().toISOString(),
      },
      {
        endpoint: '/api/media/upload',
        maxRequests: 10,
        windowMs: 3600000, // 1 hour
        enabled: true,
        description: 'File upload rate limit',
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const rateLimit of defaultRateLimits) {
      const existing = await db.select().from(rateLimits).where((rl) => rl.endpoint === rateLimit.endpoint).get();

      if (!existing) {
        await db.insert(rateLimits).values(rateLimit);
        logger.info(`✅ Created rate limit: ${rateLimit.endpoint}`);
      }
    }

    // ============================================
    // 3. SETUP DEFAULT SETTINGS
    // ============================================
    const defaultSettings = [
      {
        key: 'site_name_en',
        value: JSON.stringify('CyEyes'),
        description: 'Site name (English)',
        updatedAt: new Date().toISOString(),
      },
      {
        key: 'site_name_vi',
        value: JSON.stringify('CyEyes'),
        description: 'Site name (Vietnamese)',
        updatedAt: new Date().toISOString(),
      },
      {
        key: 'site_description_en',
        value: JSON.stringify('AI-Driven Cybersecurity Platform'),
        description: 'Site description (English)',
        updatedAt: new Date().toISOString(),
      },
      {
        key: 'site_description_vi',
        value: JSON.stringify('Nền tảng An ninh mạng được hỗ trợ bởi AI'),
        description: 'Site description (Vietnamese)',
        updatedAt: new Date().toISOString(),
      },
      {
        key: 'default_language',
        value: JSON.stringify('vi'),
        description: 'Default language',
        updatedAt: new Date().toISOString(),
      },
      {
        key: 'contact_email',
        value: JSON.stringify('contact@cyeyes.com'),
        description: 'Contact email',
        updatedAt: new Date().toISOString(),
      },
      {
        key: 'analytics_enabled',
        value: JSON.stringify(true),
        description: 'Enable analytics tracking',
        updatedAt: new Date().toISOString(),
      },
      {
        key: 'traffic_log_retention_days',
        value: JSON.stringify(90),
        description: 'Days to retain traffic logs',
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const setting of defaultSettings) {
      const existing = await db.select().from(settings).where((s) => s.key === setting.key).get();

      if (!existing) {
        await db.insert(settings).values(setting);
        logger.info(`✅ Created setting: ${setting.key}`);
      }
    }

    logger.info('✅ Database seeded successfully!');
  } catch (error) {
    logger.error('❌ Database seed failed:', error);
    throw error;
  }
};

// Run seed if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { seedDatabase };
