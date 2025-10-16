import { Request, Response } from 'express';
import { loginUser, registerUser, getUserById } from '../services/auth.service.js';
import { verifyToken, generateAccessToken, generateRefreshToken } from '../config/jwt.js';
import { removeSensitiveFields } from '../middleware/security.js';
import { securityLogger } from '../services/logger.service.js';
import type { LoginRequest, RegisterRequest } from '../schemas/auth.schema.js';
import { db } from '../config/database.js';
import { adminProfiles } from '../models/index.js';
import { eq } from 'drizzle-orm';

/**
 * Login controller - Step 1: Verify credentials
 * If 2FA is enabled, return requires2FA flag instead of tokens
 */
export const login = async (req: Request<object, object, LoginRequest>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const { user, tokens } = await loginUser({ email, password });

    // Check if user has 2FA enabled
    const profileResult = await db
      .select()
      .from(adminProfiles)
      .where(eq(adminProfiles.userId, user.id))
      .limit(1);

    const requires2FA = profileResult.length > 0 && profileResult[0].twoFactorEnabled;

    if (requires2FA) {
      // Don't issue tokens yet, require 2FA verification first
      // Generate a temporary token that can only be used for 2FA verification
      const tempToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      res.json({
        message: '2FA verification required',
        requires2FA: true,
        tempToken, // Used only for /api/auth/verify-2fa-login
        userId: user.id,
      });
      return;
    }

    // No 2FA required, proceed with normal login
    // Log successful login
    securityLogger.logSuccessfulLogin(user.id, user.email, req.ip || 'unknown');

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      message: 'Login successful',
      user: removeSensitiveFields(user),
      accessToken: tokens.accessToken,
      requires2FA: false,
    });
  } catch (error) {
    // Log failed login
    console.error('Login error:', error);
    securityLogger.logFailedLogin(req.body.email, req.ip || 'unknown', req.get('user-agent') || 'unknown');

    res.status(401).json({
      error: error instanceof Error ? error.message : 'Login failed',
    });
  }
};

/**
 * Register controller
 */
export const register = async (req: Request<object, object, RegisterRequest>, res: Response): Promise<void> => {
  try {
    const { email, password, fullName } = req.body;

    const user = await registerUser({ email, password, fullName, role: 'user' });

    res.status(201).json({
      message: 'Registration successful',
      user: removeSensitiveFields(user),
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Registration failed',
    });
  }
};

/**
 * Logout controller
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  // Clear refresh token cookie
  res.clearCookie('refreshToken');

  res.json({
    message: 'Logout successful',
  });
};

/**
 * Refresh token controller
 */
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get refresh token from cookie or body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ error: 'Refresh token required' });
      return;
    }

    // Verify refresh token
    const payload = verifyToken(refreshToken);

    // Get user to ensure they still exist and are active
    const user = await getUserById(payload.userId);

    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Invalid refresh token' });
      return;
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set new refresh token cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(401).json({
      error: 'Invalid or expired refresh token',
    });
  }
};

/**
 * Get current user controller
 */
export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await getUserById(req.user.userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: removeSensitiveFields(user),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get user information',
    });
  }
};
