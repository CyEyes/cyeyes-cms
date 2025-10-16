import { db } from '../config/database';
import { messages, type NewMessage, type Message } from '../models';
import { eq, desc, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

/**
 * Sanitize user input to prevent XSS attacks
 */
function sanitizeInput(input: string): string {
  // First, use DOMPurify to clean HTML
  let cleaned = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [],
  });

  // Additional escaping for safety
  cleaned = validator.escape(cleaned);

  return cleaned.trim();
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  return validator.isEmail(email);
}

/**
 * Service for managing contact messages
 */
export class MessageService {
  /**
   * Create a new message from landing page contact form
   */
  async createMessage(data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    subject: string;
    message: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<Message> {
    // Sanitize all inputs
    const sanitizedData = {
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email),
      phone: data.phone ? sanitizeInput(data.phone) : null,
      company: data.company ? sanitizeInput(data.company) : null,
      subject: sanitizeInput(data.subject),
      message: sanitizeInput(data.message),
    };

    // Validate email
    if (!isValidEmail(sanitizedData.email)) {
      throw new Error('Invalid email address');
    }

    // Create message record
    const newMessage: NewMessage = {
      id: randomUUID(),
      name: sanitizedData.name,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      company: sanitizedData.company,
      subject: sanitizedData.subject,
      message: sanitizedData.message,
      status: 'new',
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
    };

    const [created] = await db.insert(messages).values(newMessage).returning();
    return created;
  }

  /**
   * Get all messages with optional filtering (admin only)
   */
  async getAllMessages(filters?: {
    status?: 'new' | 'read' | 'replied' | 'archived';
    assignedTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<Message[]> {
    const conditions = [];

    if (filters?.status) {
      conditions.push(eq(messages.status, filters.status));
    }

    if (filters?.assignedTo) {
      conditions.push(eq(messages.assignedTo, filters.assignedTo));
    }

    const query = db
      .select()
      .from(messages)
      .orderBy(desc(messages.createdAt));

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    if (filters?.limit) {
      query.limit(filters.limit);
    }

    if (filters?.offset) {
      query.offset(filters.offset);
    }

    return await query;
  }

  /**
   * Get a single message by ID (admin only)
   */
  async getMessageById(id: string): Promise<Message | null> {
    const [message] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, id))
      .limit(1);

    return message || null;
  }

  /**
   * Update message status (admin only)
   */
  async updateMessageStatus(
    id: string,
    data: {
      status?: 'new' | 'read' | 'replied' | 'archived';
      notes?: string;
      assignedTo?: string | null;
      repliedBy?: string;
    }
  ): Promise<Message> {
    const updateData: Partial<Message> = {
      updatedAt: new Date().toISOString(),
    };

    if (data.status) {
      updateData.status = data.status;

      // If status is 'replied', set repliedAt timestamp
      if (data.status === 'replied') {
        updateData.repliedAt = new Date().toISOString();
        if (data.repliedBy) {
          updateData.repliedBy = data.repliedBy;
        }
      }
    }

    if (data.notes !== undefined) {
      updateData.notes = sanitizeInput(data.notes);
    }

    if (data.assignedTo !== undefined) {
      updateData.assignedTo = data.assignedTo;
    }

    const [updated] = await db
      .update(messages)
      .set(updateData)
      .where(eq(messages.id, id))
      .returning();

    if (!updated) {
      throw new Error('Message not found');
    }

    return updated;
  }

  /**
   * Delete a message (admin only)
   */
  async deleteMessage(id: string): Promise<void> {
    await db.delete(messages).where(eq(messages.id, id));
  }

  /**
   * Get message statistics (admin only)
   */
  async getMessageStats(): Promise<{
    total: number;
    new: number;
    read: number;
    replied: number;
    archived: number;
  }> {
    const allMessages = await db.select().from(messages);

    return {
      total: allMessages.length,
      new: allMessages.filter((m) => m.status === 'new').length,
      read: allMessages.filter((m) => m.status === 'read').length,
      replied: allMessages.filter((m) => m.status === 'replied').length,
      archived: allMessages.filter((m) => m.status === 'archived').length,
    };
  }
}

export const messageService = new MessageService();
