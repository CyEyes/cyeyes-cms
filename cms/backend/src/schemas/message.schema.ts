import { z } from 'zod';

// Validation for creating a new message (public endpoint)
export const createMessageSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s\u00C0-\u1EF9]+$/, 'Name contains invalid characters'),

  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must not exceed 255 characters'),

  phone: z.string()
    .max(20, 'Phone must not exceed 20 characters')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Phone contains invalid characters')
    .optional()
    .or(z.literal('')),

  company: z.string()
    .max(200, 'Company name must not exceed 200 characters')
    .optional()
    .or(z.literal('')),

  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must not exceed 200 characters'),

  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must not exceed 5000 characters'),
});

// Validation for updating message status (admin only)
export const updateMessageStatusSchema = z.object({
  status: z.enum(['new', 'read', 'replied', 'archived']),
  notes: z.string().max(2000).optional(),
  assignedTo: z.string().uuid().optional().nullable(),
});

// Validation for querying messages
export const queryMessagesSchema = z.object({
  status: z.enum(['new', 'read', 'replied', 'archived']).optional(),
  assignedTo: z.string().uuid().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type UpdateMessageStatusInput = z.infer<typeof updateMessageStatusSchema>;
export type QueryMessagesInput = z.infer<typeof queryMessagesSchema>;
