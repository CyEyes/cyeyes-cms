import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database.js';
import { users, type User, type NewUser } from '../models/index.js';
import { generateAccessToken, generateRefreshToken, type JWTPayload } from '../config/jwt.js';
import { eq } from 'drizzle-orm';

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role?: 'user' | 'content' | 'admin';
}

/**
 * Hash password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Register new user
 */
export const registerUser = async (data: RegisterData): Promise<User> => {
  // Check if user already exists
  const existingUser = await db.select().from(users).where(eq(users.email, data.email)).get();

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  // Create user
  const newUser: NewUser = {
    id: uuidv4(),
    email: data.email,
    password: hashedPassword,
    fullName: data.fullName,
    role: data.role || 'user',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const result = await db.insert(users).values(newUser).returning();
  return result[0];
};

/**
 * Login user
 */
export const loginUser = async (credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> => {
  // Find user by email
  const user = await db.select().from(users).where(eq(users.email, credentials.email)).get();

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check if user is active
  if (!user.isActive) {
    throw new Error('Account is disabled');
  }

  // Verify password
  const isPasswordValid = await comparePassword(credentials.password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Update last login
  await db
    .update(users)
    .set({ lastLogin: new Date().toISOString() })
    .where(eq(users.id, user.id));

  // Generate tokens
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const tokens: AuthTokens = {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };

  return { user, tokens };
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<User | undefined> => {
  return db.select().from(users).where(eq(users.id, userId)).get();
};

/**
 * Get user by email
 */
export const getUserByEmail = async (email: string): Promise<User | undefined> => {
  return db.select().from(users).where(eq(users.email, email)).get();
};

/**
 * Update user
 */
export const updateUser = async (userId: string, data: Partial<User>): Promise<User> => {
  const updated = await db
    .update(users)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(users.id, userId))
    .returning();

  if (!updated[0]) {
    throw new Error('User not found');
  }

  return updated[0];
};

/**
 * Change user password
 */
export const changePassword = async (userId: string, oldPassword: string, newPassword: string): Promise<void> => {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Verify old password
  const isPasswordValid = await comparePassword(oldPassword, user.password);

  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password
  await db
    .update(users)
    .set({ password: hashedPassword, updatedAt: new Date().toISOString() })
    .where(eq(users.id, userId));
};

/**
 * Delete user
 */
export const deleteUser = async (userId: string): Promise<void> => {
  await db.delete(users).where(eq(users.id, userId));
};
