import { Router } from 'express';
import { create, getById, list, update, remove } from '../controllers/team.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { requireContentManager } from '../middleware/rbac.js';
import { validateBody, validateParams, validateQuery } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/error-handler.js';
import { sanitizeBody } from '../middleware/security.js';
import { createTeamMemberSchema, updateTeamMemberSchema, listTeamMembersQuerySchema } from '../schemas/team.schema.js';
import { uuidParamSchema } from '../schemas/blog.schema.js';

const router = Router();

// ============================================
// ADMIN ROUTES
// IMPORTANT: Admin routes MUST come before public :id route
// ============================================

/**
 * POST /api/team/admin
 * Create team member
 */
router.post(
  '/admin',
  authenticate,
  requireContentManager,
  validateBody(createTeamMemberSchema),
  sanitizeBody(['shortBioEn', 'shortBioVi', 'fullBioEn', 'fullBioVi']),
  asyncHandler(create)
);

/**
 * GET /api/team/admin
 * List all team members (admin view)
 */
router.get('/admin', authenticate, requireContentManager, validateQuery(listTeamMembersQuerySchema), asyncHandler(list));

/**
 * GET /api/team/admin/:id
 * Get team member by ID
 */
router.get('/admin/:id', authenticate, requireContentManager, validateParams(uuidParamSchema), asyncHandler(getById));

/**
 * PUT /api/team/admin/:id
 * Update team member
 */
router.put(
  '/admin/:id',
  authenticate,
  requireContentManager,
  validateParams(uuidParamSchema),
  validateBody(updateTeamMemberSchema),
  sanitizeBody(['shortBioEn', 'shortBioVi', 'fullBioEn', 'fullBioVi']),
  asyncHandler(update)
);

/**
 * DELETE /api/team/admin/:id
 * Delete team member
 */
router.delete('/admin/:id', authenticate, requireContentManager, validateParams(uuidParamSchema), asyncHandler(remove));

// ============================================
// PUBLIC ROUTES
// IMPORTANT: Public :id route MUST come after admin routes
// ============================================

/**
 * GET /api/team
 * List active team members (public view)
 */
router.get('/', optionalAuth, validateQuery(listTeamMembersQuerySchema), asyncHandler(list));

/**
 * GET /api/team/:id
 * Get team member by ID (public view)
 * MUST be last to avoid matching /admin routes
 */
router.get('/:id', validateParams(uuidParamSchema), asyncHandler(getById));

export default router;
