import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import sanitizeHtml from 'sanitize-html';

/**
 * Helmet security middleware configuration
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: {
    action: 'deny',
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
});

/**
 * Sanitize HTML content
 */
export const sanitizeHtmlContent = (html: string): string => {
  return sanitizeHtml(html, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'strong', 'em', 'u', 's', 'code', 'pre',
      'ul', 'ol', 'li',
      'blockquote',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      '*': ['class', 'id'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data'],
    },
  });
};

/**
 * Middleware to sanitize request body HTML fields
 */
export const sanitizeBody = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.body) {
      fields.forEach((field) => {
        if (req.body[field] && typeof req.body[field] === 'string') {
          req.body[field] = sanitizeHtmlContent(req.body[field]);
        }
      });
    }
    next();
  };
};

/**
 * Remove sensitive fields from response
 */
export const removeSensitiveFields = <T extends Record<string, unknown>>(
  obj: T,
  fields: string[] = ['password', 'salt']
): Partial<T> => {
  const cleaned = { ...obj };
  fields.forEach((field) => {
    delete cleaned[field];
  });
  return cleaned;
};

/**
 * Middleware to prevent parameter pollution
 */
export const preventParameterPollution = (req: Request, res: Response, next: NextFunction): void => {
  // Ensure query parameters are not arrays (unless expected)
  Object.keys(req.query).forEach((key) => {
    if (Array.isArray(req.query[key]) && key !== 'tags' && key !== 'categories') {
      // Allow arrays only for specific fields
      req.query[key] = (req.query[key] as string[])[0];
    }
  });
  next();
};
