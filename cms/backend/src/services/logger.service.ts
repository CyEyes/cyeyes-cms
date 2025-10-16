import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logsDir = process.env.LOG_DIR || path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`)
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format,
  }),
  // Error log file
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    format: winston.format.combine(winston.format.uncolorize(), winston.format.json()),
  }),
  // Combined log file
  new winston.transports.File({
    filename: path.join(logsDir, 'combined.log'),
    format: winston.format.combine(winston.format.uncolorize(), winston.format.json()),
  }),
  // Security log file
  new winston.transports.File({
    filename: path.join(logsDir, 'security.log'),
    level: 'warn',
    format: winston.format.combine(winston.format.uncolorize(), winston.format.json()),
  }),
];

// Create the logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  transports,
});

// Security-specific logger
export const securityLogger = {
  logFailedLogin: (email: string, ip: string, userAgent: string): void => {
    logger.warn('Failed login attempt', {
      event: 'FAILED_LOGIN',
      email,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  },

  logSuccessfulLogin: (userId: string, email: string, ip: string): void => {
    logger.info('Successful login', {
      event: 'SUCCESSFUL_LOGIN',
      userId,
      email,
      ip,
      timestamp: new Date().toISOString(),
    });
  },

  logUnauthorizedAccess: (userId: string | undefined, path: string, ip: string): void => {
    logger.warn('Unauthorized access attempt', {
      event: 'UNAUTHORIZED_ACCESS',
      userId: userId || 'anonymous',
      path,
      ip,
      timestamp: new Date().toISOString(),
    });
  },

  logSuspiciousActivity: (description: string, metadata: Record<string, unknown>): void => {
    logger.warn('Suspicious activity detected', {
      event: 'SUSPICIOUS_ACTIVITY',
      description,
      ...metadata,
      timestamp: new Date().toISOString(),
    });
  },
};

export default logger;
