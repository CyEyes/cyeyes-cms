import rateLimit from 'express-rate-limit';
import { db } from './database.js';
import { rateLimits } from '../models/index.js';
import { eq } from 'drizzle-orm';

// Default rate limit configurations
const DEFAULT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10); // 15 minutes
const DEFAULT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);

/**
 * Get rate limit config from database or use defaults
 */
export const getRateLimitConfig = async (endpoint: string): Promise<{ maxRequests: number; windowMs: number }> => {
  try {
    const config = await db.select().from(rateLimits).where(eq(rateLimits.endpoint, endpoint)).get();

    if (config && config.enabled) {
      return {
        maxRequests: config.maxRequests,
        windowMs: config.windowMs,
      };
    }
  } catch (error) {
    console.warn(`Failed to get rate limit config for ${endpoint}, using defaults`);
  }

  return {
    maxRequests: DEFAULT_MAX_REQUESTS,
    windowMs: DEFAULT_WINDOW_MS,
  };
};

/**
 * Standard API rate limiter
 */
export const apiRateLimiter = rateLimit({
  windowMs: DEFAULT_WINDOW_MS,
  max: DEFAULT_MAX_REQUESTS,
  message: {
    error: 'Too many requests',
    message: 'Please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Key generator: use IP address
  keyGenerator: (req) => req.ip || 'unknown',
});

/**
 * Strict rate limiter for auth endpoints
 */
export const authRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_LOGIN_WINDOW_MS || '900000', 10), // 15 min
  max: parseInt(process.env.RATE_LIMIT_LOGIN_MAX || '5', 10),
  message: {
    error: 'Too many login attempts',
    message: 'Please try again in 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
});

/**
 * Upload rate limiter
 */
export const uploadRateLimiter = rateLimit({
  windowMs: 3600000, // 1 hour
  max: 10, // 10 uploads per hour
  message: {
    error: 'Too many uploads',
    message: 'You can upload up to 10 files per hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Contact form rate limiter
 */
export const contactRateLimiter = rateLimit({
  windowMs: 3600000, // 1 hour
  max: 3, // 3 submissions per hour
  message: {
    error: 'Too many submissions',
    message: 'You can submit the contact form up to 3 times per hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Create custom rate limiter
 */
export const createRateLimiter = (max: number, windowMs: number, message?: string) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests',
      message: message || 'Please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};
