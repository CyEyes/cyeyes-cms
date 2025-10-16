import express from 'express';
import { db } from '../config/database.js';
import { contactInfo } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { eq } from 'drizzle-orm';

const router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * GET /api/contact-info
 * Get active contact information (public)
 */
router.get('/', async (req, res) => {
  try {
    const result = await db
      .select()
      .from(contactInfo)
      .where(eq(contactInfo.isActive, true))
      .limit(1);

    if (!result.length) {
      return res.status(404).json({
        success: false,
        message: 'Contact information not found'
      });
    }

    // Parse JSON fields
    const contact = result[0];
    const response = {
      ...contact,
      businessHours: contact.businessHours ? JSON.parse(contact.businessHours) : null,
      socialLinks: contact.socialLinks ? JSON.parse(contact.socialLinks) : null,
    };

    res.json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching contact info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact information'
    });
  }
});

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * GET /api/contact-info/admin
 * Get contact information for admin (includes inactive)
 */
router.get('/admin', authenticate, requireRole(['admin', 'content']), async (req, res) => {
  try {
    const result = await db
      .select()
      .from(contactInfo)
      .limit(1);

    if (!result.length) {
      return res.status(404).json({
        success: false,
        message: 'Contact information not found'
      });
    }

    // Parse JSON fields
    const contact = result[0];
    const response = {
      ...contact,
      businessHours: contact.businessHours ? JSON.parse(contact.businessHours) : null,
      socialLinks: contact.socialLinks ? JSON.parse(contact.socialLinks) : null,
    };

    res.json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching contact info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact information'
    });
  }
});

/**
 * POST /api/contact-info/admin/update
 * Update contact information
 */
router.post('/admin/update', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const {
      addressEn,
      addressVi,
      phone,
      email,
      fax,
      businessHours,
      latitude,
      longitude,
      googleMapsEmbedUrl,
      socialLinks,
      additionalInfoEn,
      additionalInfoVi,
      isActive,
    } = req.body;

    // Get existing contact info
    const existing = await db.select().from(contactInfo).limit(1);

    if (!existing.length) {
      return res.status(404).json({
        success: false,
        message: 'Contact information not found'
      });
    }

    const contactId = existing[0].id;
    const userId = (req as any).user.userId;

    // Prepare update data
    const updateData: any = {
      updatedBy: userId,
    };

    if (addressEn !== undefined) updateData.addressEn = addressEn;
    if (addressVi !== undefined) updateData.addressVi = addressVi;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (fax !== undefined) updateData.fax = fax;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;
    if (googleMapsEmbedUrl !== undefined) updateData.googleMapsEmbedUrl = googleMapsEmbedUrl;
    if (additionalInfoEn !== undefined) updateData.additionalInfoEn = additionalInfoEn;
    if (additionalInfoVi !== undefined) updateData.additionalInfoVi = additionalInfoVi;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Stringify JSON fields
    if (businessHours !== undefined) {
      updateData.businessHours = JSON.stringify(businessHours);
    }
    if (socialLinks !== undefined) {
      updateData.socialLinks = JSON.stringify(socialLinks);
    }

    // Update database
    await db
      .update(contactInfo)
      .set(updateData)
      .where(eq(contactInfo.id, contactId));

    // Fetch updated contact info
    const updated = await db
      .select()
      .from(contactInfo)
      .where(eq(contactInfo.id, contactId))
      .limit(1);

    const response = {
      ...updated[0],
      businessHours: updated[0].businessHours ? JSON.parse(updated[0].businessHours) : null,
      socialLinks: updated[0].socialLinks ? JSON.parse(updated[0].socialLinks) : null,
    };

    res.json({
      success: true,
      message: 'Contact information updated successfully',
      data: response
    });
  } catch (error) {
    console.error('Error updating contact info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact information'
    });
  }
});

export default router;
