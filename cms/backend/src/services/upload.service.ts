import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileTypeFromBuffer } from 'file-type';

export class UploadService {
  private uploadDir = path.join(__dirname, '../../uploads');

  async validateImage(
    buffer: Buffer,
    options: {
      maxSize: number;
      allowedMimes: string[];
      maxWidth?: number;
      maxHeight?: number;
      minWidth?: number;
      minHeight?: number;
    }
  ) {
    // 1. Check file size
    if (buffer.length > options.maxSize) {
      throw new Error(`File too large. Max ${options.maxSize / 1024 / 1024}MB`);
    }

    // 2. Magic number validation (OWASP - verify file type by content, not extension)
    const fileType = await fileTypeFromBuffer(buffer);
    if (!fileType || !options.allowedMimes.includes(fileType.mime)) {
      throw new Error('Invalid file type. Only PNG and JPEG are allowed.');
    }

    // 3. Use Sharp to validate image and get metadata
    try {
      const metadata = await sharp(buffer).metadata();

      if (options.maxWidth && metadata.width && metadata.width > options.maxWidth) {
        throw new Error(`Image width too large. Max ${options.maxWidth}px`);
      }

      if (options.maxHeight && metadata.height && metadata.height > options.maxHeight) {
        throw new Error(`Image height too large. Max ${options.maxHeight}px`);
      }

      if (options.minWidth && metadata.width && metadata.width < options.minWidth) {
        throw new Error(`Image width too small. Min ${options.minWidth}px`);
      }

      if (options.minHeight && metadata.height && metadata.height < options.minHeight) {
        throw new Error(`Image height too small. Min ${options.minHeight}px`);
      }

      return { valid: true, metadata };
    } catch (error: any) {
      if (error.message.includes('width') || error.message.includes('height')) {
        throw error;
      }
      throw new Error('Invalid or corrupted image file');
    }
  }

  async saveLogo(buffer: Buffer, type: 'main' | 'admin'): Promise<string> {
    // Validate with OWASP security checks
    await this.validateImage(buffer, {
      maxSize: 1 * 1024 * 1024, // 1MB
      allowedMimes: ['image/png', 'image/jpeg'],
      minWidth: 100,
      minHeight: 100,
      maxWidth: 2048,
      maxHeight: 2048,
    });

    // Generate secure filename (UUID-based to prevent path traversal)
    const ext = (await fileTypeFromBuffer(buffer))!.ext;
    const filename = `logo-${type}-${Date.now()}-${crypto.randomUUID()}.png`;
    const filepath = path.join(this.uploadDir, 'logos', filename);

    // Ensure directory exists
    await fs.mkdir(path.join(this.uploadDir, 'logos'), { recursive: true });

    // Optimize and save as PNG (convert JPEG to PNG for consistency)
    await sharp(buffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(filepath);

    return `/uploads/logos/${filename}`;
  }

  async saveFavicon(buffer: Buffer): Promise<string> {
    // Validate
    const fileType = await fileTypeFromBuffer(buffer);

    await this.validateImage(buffer, {
      maxSize: 100 * 1024, // 100KB
      allowedMimes: ['image/x-icon', 'image/png', 'image/vnd.microsoft.icon'],
      maxWidth: 256,
      maxHeight: 256,
    });

    const ext = fileType!.ext === 'ico' ? 'ico' : 'png';
    const filename = `favicon-${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const filepath = path.join(this.uploadDir, 'favicons', filename);

    await fs.mkdir(path.join(this.uploadDir, 'favicons'), { recursive: true });

    // Save multiple sizes for PNG favicons
    if (ext === 'png') {
      await sharp(buffer)
        .resize(32, 32)
        .png({ quality: 90 })
        .toFile(filepath);
    } else {
      // For ICO files, save as-is
      await fs.writeFile(filepath, buffer);
    }

    return `/uploads/favicons/${filename}`;
  }

  async saveAvatar(buffer: Buffer): Promise<string> {
    // Validate with OWASP security checks
    await this.validateImage(buffer, {
      maxSize: 2 * 1024 * 1024, // 2MB
      allowedMimes: ['image/png', 'image/jpeg'],
      minWidth: 50,
      minHeight: 50,
      maxWidth: 2048,
      maxHeight: 2048,
    });

    // Generate secure filename
    const filename = `avatar-${Date.now()}-${crypto.randomUUID()}.png`;
    const filepath = path.join(this.uploadDir, 'avatars', filename);

    // Ensure directory exists
    await fs.mkdir(path.join(this.uploadDir, 'avatars'), { recursive: true });

    // Optimize and save as PNG (square, 256x256)
    await sharp(buffer)
      .resize(256, 256, { fit: 'cover', position: 'center' })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(filepath);

    return `/uploads/avatars/${filename}`;
  }

  async deleteFile(filepath: string) {
    if (!filepath) return;

    // Security: Ensure file path is within uploads directory
    const fullPath = path.join(__dirname, '../..', filepath);
    const uploadsPath = path.join(__dirname, '../../uploads');

    if (!fullPath.startsWith(uploadsPath)) {
      console.warn('Attempted to delete file outside uploads directory:', filepath);
      return;
    }

    try {
      await fs.unlink(fullPath);
    } catch (error) {
      // File may not exist, log but don't throw
      console.warn('Failed to delete file:', filepath);
    }
  }
}

export const uploadService = new UploadService();
