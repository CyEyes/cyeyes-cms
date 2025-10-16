import { Router } from 'express';
import { db } from '../config/database.js';
import { siteConfig } from '../models/index.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';
import { uploadService } from '../services/upload.service.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { eq } from 'drizzle-orm';

const router = Router();

// Get site config
router.get('/', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const config = await db.select().from(siteConfig).limit(1);

    if (config.length === 0) {
      return res.status(404).json({ error: 'Site config not found' });
    }

    res.json(config[0]);
  } catch (error) {
    console.error('Get site config error:', error);
    res.status(500).json({ error: 'Failed to get site config' });
  }
});

// Upload main or admin logo
router.post(
  '/logo',
  authenticate,
  requireRole(['admin']),
  uploadMiddleware.single('logo'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const type = req.body.type === 'admin' ? 'admin' : 'main';
      const logoUrl = await uploadService.saveLogo(req.file.buffer, type);

      // Update database
      const config = await db.select().from(siteConfig).limit(1);

      if (config.length > 0) {
        const updateData = type === 'admin'
          ? { logoAdminUrl: logoUrl }
          : { logoUrl };

        await db
          .update(siteConfig)
          .set({ ...updateData, updatedBy: (req as any).user!.id })
          .where(eq(siteConfig.id, config[0].id));

        // Delete old file
        const oldUrl = type === 'admin' ? config[0].logoAdminUrl : config[0].logoUrl;
        if (oldUrl) {
          await uploadService.deleteFile(oldUrl);
        }
      }

      res.json({ success: true, logoUrl });
    } catch (error: any) {
      console.error('Logo upload error:', error);
      res.status(400).json({ error: error.message || 'Failed to upload logo' });
    }
  }
);

// Upload favicon
router.post(
  '/favicon',
  authenticate,
  requireRole(['admin']),
  uploadMiddleware.single('favicon'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const faviconUrl = await uploadService.saveFavicon(req.file.buffer);

      // Update database
      const config = await db.select().from(siteConfig).limit(1);

      if (config.length > 0) {
        await db
          .update(siteConfig)
          .set({ faviconUrl, updatedBy: (req as any).user!.id })
          .where(eq(siteConfig.id, config[0].id));

        // Delete old file
        if (config[0].faviconUrl) {
          await uploadService.deleteFile(config[0].faviconUrl);
        }
      }

      res.json({ success: true, faviconUrl });
    } catch (error: any) {
      console.error('Favicon upload error:', error);
      res.status(400).json({ error: error.message || 'Failed to upload favicon' });
    }
  }
);

// Update site config (colors, name)
router.post('/update', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const { siteName, primaryColor, secondaryColor } = req.body;

    const config = await db.select().from(siteConfig).limit(1);

    if (config.length === 0) {
      return res.status(404).json({ error: 'Site config not found' });
    }

    await db
      .update(siteConfig)
      .set({
        siteName: siteName || config[0].siteName,
        primaryColor: primaryColor || config[0].primaryColor,
        secondaryColor: secondaryColor || config[0].secondaryColor,
        updatedBy: (req as any).user!.id,
      })
      .where(eq(siteConfig.id, config[0].id));

    const updated = await db.select().from(siteConfig).limit(1);
    res.json(updated[0]);
  } catch (error) {
    console.error('Update site config error:', error);
    res.status(500).json({ error: 'Failed to update site config' });
  }
});

export default router;
