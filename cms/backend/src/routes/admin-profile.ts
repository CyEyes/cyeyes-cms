import express from 'express';
import bcrypt from 'bcrypt';
import { db } from '../config/database.js';
import { users, adminProfiles } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';
import { uploadService } from '../services/upload.service.js';
import { twoFactorAuthService } from '../services/twofa.service.js';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

const router = express.Router();

// Encryption key for 2FA secrets (should be from env in production)
const ENCRYPTION_KEY = process.env.TWOFA_ENCRYPTION_KEY || 'cyeyes-cms-2fa-secret-key-change-in-production';

// ============================================
// PROFILE MANAGEMENT
// ============================================

/**
 * GET /api/admin/profile
 * Get current user's profile
 */
router.get('/', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    // Get user data
    const userResult = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        avatar: users.avatar,
        role: users.role,
        isActive: users.isActive,
        lastLogin: users.lastLogin,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userResult.length) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get admin profile data (2FA settings)
    const adminProfileResult = await db
      .select()
      .from(adminProfiles)
      .where(eq(adminProfiles.userId, userId))
      .limit(1);

    const profile = {
      ...userResult[0],
      twoFactorEnabled: adminProfileResult.length > 0
        ? adminProfileResult[0].twoFactorEnabled
        : false,
      preferences: adminProfileResult.length > 0 && adminProfileResult[0].preferences
        ? JSON.parse(adminProfileResult[0].preferences)
        : {},
    };

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

/**
 * POST /api/admin/profile/update
 * Update profile (name, email)
 */
router.post('/update', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { fullName, email } = req.body;

    const updateData: any = {};
    if (fullName) updateData.fullName = fullName;
    if (email) {
      // Check if email already exists for another user
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existing.length > 0 && existing[0].id !== userId) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
      updateData.email = email;
    }

    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId));

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

/**
 * POST /api/admin/profile/change-password
 * Change password
 */
router.post('/change-password', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current and new password are required'
      });
    }

    // Get user
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userResult.length) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, userResult[0].password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

/**
 * POST /api/admin/profile/upload-avatar
 * Upload avatar
 */
router.post('/upload-avatar', authenticate, requireRole(['admin']),
  uploadMiddleware.single('avatar'), async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Save avatar (reuse logo upload logic with different size)
    const avatarUrl = await uploadService.saveAvatar(req.file.buffer);

    // Update user avatar
    await db
      .update(users)
      .set({ avatar: avatarUrl })
      .where(eq(users.id, userId));

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatarUrl
    });
  } catch (error: any) {
    console.error('Error uploading avatar:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to upload avatar'
    });
  }
});

// ============================================
// TWO-FACTOR AUTHENTICATION
// ============================================

/**
 * POST /api/admin/profile/2fa/setup
 * Initialize 2FA setup (generate secret and QR code)
 */
router.post('/2fa/setup', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    // Get user email
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userResult.length) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userEmail = userResult[0].email;

    // Generate secret
    const { secret, otpauthUrl } = twoFactorAuthService.generateSecret(userEmail);

    // Generate QR code
    const qrCode = await twoFactorAuthService.generateQRCode(otpauthUrl);

    // Temporarily store secret (will be saved permanently after verification)
    res.json({
      success: true,
      data: {
        secret,
        qrCode,
        otpauthUrl
      }
    });
  } catch (error) {
    console.error('Error setting up 2FA:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to setup 2FA'
    });
  }
});

/**
 * POST /api/admin/profile/2fa/enable
 * Enable 2FA after verification
 */
router.post('/2fa/enable', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { secret, token } = req.body;

    if (!secret || !token) {
      return res.status(400).json({
        success: false,
        message: 'Secret and token are required'
      });
    }

    // Verify token
    const isValid = twoFactorAuthService.verifyToken(secret, token);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Generate backup codes
    const backupCodes = twoFactorAuthService.generateBackupCodes();
    const hashedBackupCodes = backupCodes.map(code =>
      twoFactorAuthService.hashBackupCode(code)
    );

    // Encrypt secret and backup codes
    const encryptedSecret = twoFactorAuthService.encrypt(secret, ENCRYPTION_KEY);
    const encryptedBackupCodes = twoFactorAuthService.encrypt(
      JSON.stringify(hashedBackupCodes),
      ENCRYPTION_KEY
    );

    // Check if admin profile exists
    const existing = await db
      .select()
      .from(adminProfiles)
      .where(eq(adminProfiles.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      // Update existing profile
      await db
        .update(adminProfiles)
        .set({
          twoFactorEnabled: true,
          twoFactorSecret: encryptedSecret,
          twoFactorBackupCodes: encryptedBackupCodes,
        })
        .where(eq(adminProfiles.userId, userId));
    } else {
      // Create new profile
      await db.insert(adminProfiles).values({
        id: crypto.randomUUID(),
        userId,
        twoFactorEnabled: true,
        twoFactorSecret: encryptedSecret,
        twoFactorBackupCodes: encryptedBackupCodes,
      });
    }

    res.json({
      success: true,
      message: '2FA enabled successfully',
      backupCodes // Return plaintext codes ONCE for user to save
    });
  } catch (error) {
    console.error('Error enabling 2FA:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enable 2FA'
    });
  }
});

/**
 * POST /api/admin/profile/2fa/disable
 * Disable 2FA
 */
router.post('/2fa/disable', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to disable 2FA'
      });
    }

    // Verify password
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userResult.length) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const validPassword = await bcrypt.compare(password, userResult[0].password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    // Disable 2FA
    await db
      .update(adminProfiles)
      .set({
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: null,
      })
      .where(eq(adminProfiles.userId, userId));

    res.json({
      success: true,
      message: '2FA disabled successfully'
    });
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disable 2FA'
    });
  }
});

/**
 * POST /api/admin/profile/2fa/regenerate-backup-codes
 * Regenerate backup codes
 */
router.post('/2fa/regenerate-backup-codes', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    // Verify password
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userResult.length) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const validPassword = await bcrypt.compare(password, userResult[0].password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    // Generate new backup codes
    const backupCodes = twoFactorAuthService.generateBackupCodes();
    const hashedBackupCodes = backupCodes.map(code =>
      twoFactorAuthService.hashBackupCode(code)
    );

    const encryptedBackupCodes = twoFactorAuthService.encrypt(
      JSON.stringify(hashedBackupCodes),
      ENCRYPTION_KEY
    );

    // Update backup codes
    await db
      .update(adminProfiles)
      .set({ twoFactorBackupCodes: encryptedBackupCodes })
      .where(eq(adminProfiles.userId, userId));

    res.json({
      success: true,
      message: 'Backup codes regenerated successfully',
      backupCodes
    });
  } catch (error) {
    console.error('Error regenerating backup codes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to regenerate backup codes'
    });
  }
});

export default router;
