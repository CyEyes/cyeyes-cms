import { Router } from 'express';
import { login, register, logout, refresh, me } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { authRateLimiter } from '../config/rate-limit.js';
import { asyncHandler } from '../middleware/error-handler.js';
import { loginSchema, registerSchema, refreshTokenSchema } from '../schemas/auth.schema.js';
import { db } from '../config/database.js';
import { adminProfiles } from '../models/index.js';
import { twoFactorAuthService } from '../services/twofa.service.js';
import { eq } from 'drizzle-orm';

const router = Router();
const ENCRYPTION_KEY = process.env.TWOFA_ENCRYPTION_KEY || 'cyeyes-cms-2fa-secret-key-change-in-production';

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post('/login', authRateLimiter, validateBody(loginSchema), asyncHandler(login));

/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', authRateLimiter, validateBody(registerSchema), asyncHandler(register));

/**
 * POST /api/auth/logout
 * Logout current user
 */
router.post('/logout', authenticate, asyncHandler(logout));

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', validateBody(refreshTokenSchema), asyncHandler(refresh));

/**
 * GET /api/auth/me
 * Get current user information
 */
router.get('/me', authenticate, asyncHandler(me));

/**
 * POST /api/auth/verify-2fa-login
 * Verify 2FA code during login (Step 2 of 2FA login)
 * This endpoint is called after successful email/password verification
 */
router.post('/verify-2fa-login', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { token, useBackupCode } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification code required'
      });
    }

    // Get admin profile
    const profileResult = await db
      .select()
      .from(adminProfiles)
      .where(eq(adminProfiles.userId, userId))
      .limit(1);

    if (!profileResult.length || !profileResult[0].twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA not enabled'
      });
    }

    const profile = profileResult[0];
    let isValid = false;

    if (useBackupCode) {
      // Verify backup code
      if (!profile.twoFactorBackupCodes) {
        return res.status(400).json({
          success: false,
          message: 'No backup codes available'
        });
      }

      const encryptedCodes = profile.twoFactorBackupCodes;
      const decryptedCodes = twoFactorAuthService.decrypt(encryptedCodes, ENCRYPTION_KEY);
      const hashedCodes = JSON.parse(decryptedCodes);

      isValid = twoFactorAuthService.verifyBackupCode(token, hashedCodes);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid backup code'
        });
      }

      // Remove used backup code
      const updatedCodes = twoFactorAuthService.removeUsedBackupCode(token, hashedCodes);
      const encryptedUpdatedCodes = twoFactorAuthService.encrypt(
        JSON.stringify(updatedCodes),
        ENCRYPTION_KEY
      );

      await db
        .update(adminProfiles)
        .set({ twoFactorBackupCodes: encryptedUpdatedCodes })
        .where(eq(adminProfiles.userId, userId));
    } else {
      // Verify TOTP token
      if (!profile.twoFactorSecret) {
        return res.status(400).json({
          success: false,
          message: '2FA secret not found'
        });
      }

      const encryptedSecret = profile.twoFactorSecret;
      const secret = twoFactorAuthService.decrypt(encryptedSecret, ENCRYPTION_KEY);

      isValid = twoFactorAuthService.verifyToken(secret, token);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid verification code'
        });
      }
    }

    // 2FA verified - now issue the actual tokens
    const { generateAccessToken, generateRefreshToken } = await import('../config/jwt.js');
    const { getUserById } = await import('../services/auth.service.js');
    const { removeSensitiveFields } = await import('../middleware/security.js');
    const { securityLogger } = await import('../services/logger.service.js');

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Log successful login
    securityLogger.logSuccessfulLogin(user.id, user.email, req.ip || 'unknown');

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.json({
      success: true,
      message: 'Login successful with 2FA',
      user: removeSensitiveFields(user),
      accessToken,
    });
  } catch (error) {
    console.error('Error verifying 2FA during login:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify 2FA'
    });
  }
});

/**
 * POST /api/auth/verify-2fa
 * Verify 2FA code (for profile settings)
 * Note: For simplicity, 2FA is optional for now
 */
router.post('/verify-2fa', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { token, useBackupCode } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification code required'
      });
    }

    // Get admin profile
    const profileResult = await db
      .select()
      .from(adminProfiles)
      .where(eq(adminProfiles.userId, userId))
      .limit(1);

    if (!profileResult.length || !profileResult[0].twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA not enabled'
      });
    }

    const profile = profileResult[0];

    if (useBackupCode) {
      // Verify backup code
      if (!profile.twoFactorBackupCodes) {
        return res.status(400).json({
          success: false,
          message: 'No backup codes available'
        });
      }

      const encryptedCodes = profile.twoFactorBackupCodes;
      const decryptedCodes = twoFactorAuthService.decrypt(encryptedCodes, ENCRYPTION_KEY);
      const hashedCodes = JSON.parse(decryptedCodes);

      const isValid = twoFactorAuthService.verifyBackupCode(token, hashedCodes);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid backup code'
        });
      }

      // Remove used backup code
      const updatedCodes = twoFactorAuthService.removeUsedBackupCode(token, hashedCodes);
      const encryptedUpdatedCodes = twoFactorAuthService.encrypt(
        JSON.stringify(updatedCodes),
        ENCRYPTION_KEY
      );

      await db
        .update(adminProfiles)
        .set({ twoFactorBackupCodes: encryptedUpdatedCodes })
        .where(eq(adminProfiles.userId, userId));

      return res.json({
        success: true,
        message: '2FA verified with backup code',
        backupCodesRemaining: updatedCodes.length
      });
    } else {
      // Verify TOTP token
      if (!profile.twoFactorSecret) {
        return res.status(400).json({
          success: false,
          message: '2FA secret not found'
        });
      }

      const encryptedSecret = profile.twoFactorSecret;
      const secret = twoFactorAuthService.decrypt(encryptedSecret, ENCRYPTION_KEY);

      const isValid = twoFactorAuthService.verifyToken(secret, token);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid verification code'
        });
      }

      return res.json({
        success: true,
        message: '2FA verified successfully'
      });
    }
  } catch (error) {
    console.error('Error verifying 2FA:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify 2FA'
    });
  }
});

export default router;
