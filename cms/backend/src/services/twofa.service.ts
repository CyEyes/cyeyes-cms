import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';

/**
 * Two-Factor Authentication Service
 * Handles TOTP generation, validation, and backup codes
 */
export class TwoFactorAuthService {
  /**
   * Generate a new TOTP secret for a user
   */
  generateSecret(userEmail: string, siteName: string = 'CyEyes CMS'): {
    secret: string;
    otpauthUrl: string;
  } {
    const secret = speakeasy.generateSecret({
      name: `${siteName} (${userEmail})`,
      issuer: siteName,
      length: 32,
    });

    return {
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url || '',
    };
  }

  /**
   * Generate QR code as Data URL for Google Authenticator
   */
  async generateQRCode(otpauthUrl: string): Promise<string> {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Verify a TOTP token
   */
  verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2, // Allow 2 time steps before/after (60 seconds window)
    });
  }

  /**
   * Generate backup codes (10 codes, 8 characters each)
   */
  generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      // Generate 8-character alphanumeric code
      const code = crypto
        .randomBytes(4)
        .toString('hex')
        .toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  /**
   * Hash backup codes for storage (using SHA-256)
   */
  hashBackupCode(code: string): string {
    return crypto
      .createHash('sha256')
      .update(code.toUpperCase())
      .digest('hex');
  }

  /**
   * Verify a backup code against hashed codes
   */
  verifyBackupCode(code: string, hashedCodes: string[]): boolean {
    const hashedInput = this.hashBackupCode(code);
    return hashedCodes.includes(hashedInput);
  }

  /**
   * Remove a used backup code from the list
   */
  removeUsedBackupCode(code: string, hashedCodes: string[]): string[] {
    const hashedInput = this.hashBackupCode(code);
    return hashedCodes.filter((hash) => hash !== hashedInput);
  }

  /**
   * Encrypt sensitive data (secret, backup codes) for storage
   */
  encrypt(text: string, key: string): string {
    const iv = crypto.randomBytes(16);
    const derivedKey = crypto.scryptSync(key, 'salt', 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', derivedKey, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * Decrypt sensitive data from storage
   */
  decrypt(encrypted: string, key: string): string {
    const parts = encrypted.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];

    const derivedKey = crypto.scryptSync(key, 'salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', derivedKey, iv);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}

export const twoFactorAuthService = new TwoFactorAuthService();
