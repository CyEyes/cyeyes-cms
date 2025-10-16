import { Router } from 'express';
import { create, getById, getBySlug, list, update, remove } from '../controllers/product.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { requireContentManager } from '../middleware/rbac.js';
import { validateBody, validateParams, validateQuery } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/error-handler.js';
import { sanitizeBody } from '../middleware/security.js';
import { createProductSchema, updateProductSchema, listProductsQuerySchema } from '../schemas/product.schema.js';
import { uuidParamSchema, slugParamSchema } from '../schemas/blog.schema.js';

const router = Router();

// ============================================
// ADMIN ROUTES (before public :slug route)
// ============================================
router.post('/admin', authenticate, requireContentManager, validateBody(createProductSchema), sanitizeBody(['shortDescEn', 'shortDescVi', 'fullDescEn', 'fullDescVi']), asyncHandler(create));
router.get('/admin', authenticate, requireContentManager, validateQuery(listProductsQuerySchema), asyncHandler(list));
router.get('/admin/:id', authenticate, requireContentManager, validateParams(uuidParamSchema), asyncHandler(getById));
router.put('/admin/:id', authenticate, requireContentManager, validateParams(uuidParamSchema), validateBody(updateProductSchema), sanitizeBody(['shortDescEn', 'shortDescVi', 'fullDescEn', 'fullDescVi']), asyncHandler(update));
router.delete('/admin/:id', authenticate, requireContentManager, validateParams(uuidParamSchema), asyncHandler(remove));

// ============================================
// PUBLIC ROUTES (after admin routes)
// ============================================
router.get('/', optionalAuth, validateQuery(listProductsQuerySchema), asyncHandler(list));
router.get('/:slug', optionalAuth, validateParams(slugParamSchema), asyncHandler(getBySlug));

export default router;
