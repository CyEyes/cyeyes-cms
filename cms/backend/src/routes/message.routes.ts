import { Router } from 'express';
import {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
  getMessageStats,
} from '../controllers/message.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for public endpoint
const createMessageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 requests per hour (relaxed for testing)
  message: 'Too many messages sent. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * POST /api/messages
 * Create a new message from contact form
 */
router.post(
  '/',
  createMessageLimiter,
  createMessage
);

// ============================================
// ADMIN ROUTES (Protected)
// ============================================

/**
 * GET /api/messages/stats - Get message statistics
 * IMPORTANT: Must be before /:id to avoid route conflict
 */
router.get(
  '/stats',
  authenticate,
  requireRole(['admin', 'content']),
  getMessageStats
);

/**
 * GET /api/messages (admin) - Get all messages with optional filtering
 * This route is protected by middleware
 */
router.get(
  '/',
  authenticate,
  requireRole(['admin', 'content']),
  getAllMessages
);

/**
 * GET /api/messages/:id - Get a specific message by ID
 */
router.get(
  '/:id',
  authenticate,
  requireRole(['admin', 'content']),
  getMessageById
);

/**
 * PATCH /api/messages/:id - Update message status/notes
 */
router.patch(
  '/:id',
  authenticate,
  requireRole(['admin', 'content']),
  updateMessageStatus
);

/**
 * DELETE /api/messages/:id - Delete a message
 */
router.delete(
  '/:id',
  authenticate,
  requireRole(['admin']),
  deleteMessage
);

export default router;
