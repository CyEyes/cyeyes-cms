import { Router } from 'express';
import { create, getById, getBySlug, list, update, remove } from '../controllers/blog.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { requireContentManager } from '../middleware/rbac.js';
import { validateBody, validateParams, validateQuery } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/error-handler.js';
import { sanitizeBody } from '../middleware/security.js';
import {
  createBlogSchema,
  updateBlogSchema,
  listBlogsQuerySchema,
  uuidParamSchema,
  slugParamSchema,
} from '../schemas/blog.schema.js';

const router = Router();

// ============================================
// ADMIN ROUTES (Content Manager & Admin)
// IMPORTANT: Admin routes MUST come before public :slug route
// ============================================

/**
 * POST /api/blogs/admin
 * Create blog post
 */
router.post(
  '/admin',
  authenticate,
  requireContentManager,
  validateBody(createBlogSchema),
  sanitizeBody(['contentEn', 'contentVi', 'excerptEn', 'excerptVi']),
  asyncHandler(create)
);

/**
 * GET /api/blogs/admin
 * List all blog posts (including drafts)
 */
router.get('/admin', authenticate, requireContentManager, validateQuery(listBlogsQuerySchema), asyncHandler(list));

/**
 * GET /api/blogs/admin/:id
 * Get blog post by ID (UUID)
 */
router.get('/admin/:id', authenticate, requireContentManager, validateParams(uuidParamSchema), asyncHandler(getById));

/**
 * PUT /api/blogs/admin/:id
 * Update blog post
 */
router.put(
  '/admin/:id',
  authenticate,
  requireContentManager,
  validateParams(uuidParamSchema),
  validateBody(updateBlogSchema),
  sanitizeBody(['contentEn', 'contentVi', 'excerptEn', 'excerptVi']),
  asyncHandler(update)
);

/**
 * DELETE /api/blogs/admin/:id
 * Delete blog post
 */
router.delete(
  '/admin/:id',
  authenticate,
  requireContentManager,
  validateParams(uuidParamSchema),
  asyncHandler(remove)
);

// ============================================
// PUBLIC ROUTES
// IMPORTANT: Public :slug route MUST come after admin routes
// ============================================

/**
 * GET /api/blogs
 * List published blog posts
 */
router.get('/', validateQuery(listBlogsQuerySchema), asyncHandler(list));

/**
 * GET /api/blogs/:slug
 * Get published blog post by slug
 * MUST be last to avoid matching /admin routes
 */
router.get('/:slug', optionalAuth, validateParams(slugParamSchema), asyncHandler(getBySlug));

export default router;
