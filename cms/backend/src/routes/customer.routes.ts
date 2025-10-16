import { Router } from 'express';
import { create, getById, list, update, remove } from '../controllers/customer.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireContentManager } from '../middleware/rbac.js';
import { validateBody, validateParams, validateQuery } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/error-handler.js';
import { createCustomerSchema, updateCustomerSchema, listCustomersQuerySchema } from '../schemas/customer.schema.js';
import { uuidParamSchema } from '../schemas/blog.schema.js';

const router = Router();

// ============================================
// ADMIN ROUTES (before public :id route)
// ============================================
router.post('/admin', authenticate, requireContentManager, validateBody(createCustomerSchema), asyncHandler(create));
router.get('/admin', authenticate, requireContentManager, validateQuery(listCustomersQuerySchema), asyncHandler(list));
router.get('/admin/:id', authenticate, requireContentManager, validateParams(uuidParamSchema), asyncHandler(getById));
router.put('/admin/:id', authenticate, requireContentManager, validateParams(uuidParamSchema), validateBody(updateCustomerSchema), asyncHandler(update));
router.delete('/admin/:id', authenticate, requireContentManager, validateParams(uuidParamSchema), asyncHandler(remove));

// ============================================
// PUBLIC ROUTES (after admin routes)
// ============================================
router.get('/', validateQuery(listCustomersQuerySchema), asyncHandler(list));
router.get('/:id', validateParams(uuidParamSchema), asyncHandler(getById));

export default router;
