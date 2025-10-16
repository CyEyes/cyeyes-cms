import { Request, Response, NextFunction } from 'express';
import { messageService } from '../services/message.service';
import { createMessageSchema, updateMessageStatusSchema } from '../schemas/message.schema';
import { z } from 'zod';

/**
 * Create a new message (Public endpoint)
 */
export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate input
    const validatedData = createMessageSchema.parse(req.body);

    // Get IP and user agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    // Create message
    const message = await messageService.createMessage({
      ...validatedData,
      ipAddress,
      userAgent,
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        id: message.id,
        createdAt: message.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }
    next(error);
  }
};

/**
 * Get all messages (Admin only)
 */
export const getAllMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, assignedTo, limit, offset } = req.query;

    const messages = await messageService.getAllMessages({
      status: status as any,
      assignedTo: assignedTo as string,
      limit: limit ? parseInt(limit as string) : 50,
      offset: offset ? parseInt(offset as string) : 0,
    });

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get message by ID (Admin only)
 */
export const getMessageById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const message = await messageService.getMessageById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Auto-mark as read if status is 'new'
    if (message.status === 'new') {
      await messageService.updateMessageStatus(id, { status: 'read' });
      message.status = 'read';
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update message status (Admin only)
 */
export const updateMessageStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const validatedData = updateMessageStatusSchema.parse(req.body);

    // Get user ID from authenticated request
    const userId = (req as any).user?.id;

    const updated = await messageService.updateMessageStatus(id, {
      ...validatedData,
      repliedBy: validatedData.status === 'replied' ? userId : undefined,
    });

    res.json({
      success: true,
      message: 'Message updated successfully',
      data: updated,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }
    next(error);
  }
};

/**
 * Delete message (Admin only)
 */
export const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await messageService.deleteMessage(id);

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get message statistics (Admin only)
 */
export const getMessageStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await messageService.getMessageStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
