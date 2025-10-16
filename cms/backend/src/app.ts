import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { securityHeaders, preventParameterPollution } from './middleware/security.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { apiRateLimiter } from './config/rate-limit.js';
import { logger } from './services/logger.service.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import blogRoutes from './routes/blog.routes.js';
import teamRoutes from './routes/team.routes.js';
import customerRoutes from './routes/customer.routes.js';
import productRoutes from './routes/product.routes.js';
import siteConfigRoutes from './routes/site-config.js';
import contactInfoRoutes from './routes/contact-info.js';
import adminProfileRoutes from './routes/admin-profile.js';
import messageRoutes from './routes/message.routes.js';

/**
 * Create Express application
 */
export const createApp = (): Application => {
  const app = express();

  // ============================================
  // SECURITY MIDDLEWARE
  // ============================================
  app.use(securityHeaders);

  // CORS configuration
  const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));

  // ============================================
  // BODY PARSING MIDDLEWARE
  // ============================================
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // ============================================
  // STATIC FILES
  // ============================================
  // Serve uploaded files
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // ============================================
  // COMPRESSION & LOGGING
  // ============================================
  app.use(compression());

  // HTTP request logger
  const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(
    morgan(morganFormat, {
      stream: {
        write: (message: string) => logger.http(message.trim()),
      },
    })
  );

  // ============================================
  // SECURITY ENHANCEMENTS
  // ============================================
  app.use(preventParameterPollution);

  // Disable X-Powered-By header
  app.disable('x-powered-by');

  // Trust proxy (for rate limiting by IP behind reverse proxy)
  app.set('trust proxy', 1);

  // ============================================
  // HEALTH CHECK
  // ============================================
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // ============================================
  // API ROUTES
  // ============================================
  const apiPrefix = process.env.API_PREFIX || '/api';

  // Apply rate limiting to all API routes
  app.use(apiPrefix, apiRateLimiter);

  // Authentication routes
  app.use(`${apiPrefix}/auth`, authRoutes);

  // Message routes (public + admin) - Must be before other routes
  app.use(`${apiPrefix}/messages`, messageRoutes);

  // Content routes (public + admin)
  app.use(`${apiPrefix}/blogs`, blogRoutes);
  app.use(`${apiPrefix}/team`, teamRoutes);
  app.use(`${apiPrefix}/customers`, customerRoutes);
  app.use(`${apiPrefix}/products`, productRoutes);

  // Contact info routes (public + admin)
  app.use(`${apiPrefix}/contact-info`, contactInfoRoutes);

  // Admin routes
  app.use(`${apiPrefix}/admin/site-config`, siteConfigRoutes);
  app.use(`${apiPrefix}/admin/profile`, adminProfileRoutes);

  // TODO: Add media & other admin routes
  // app.use(`${apiPrefix}/media`, mediaRoutes);

  // ============================================
  // ERROR HANDLING
  // ============================================
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;
