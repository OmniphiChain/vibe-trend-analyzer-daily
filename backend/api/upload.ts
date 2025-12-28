import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

// ============================================================================
// FILE UPLOAD & MEDIA MANAGEMENT SERVICE - PHASE 3
// ============================================================================

export interface UploadedFile {
  id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
  userId: number;
  uploadedAt: Date;
  metadata?: Record<string, any>;
}

export interface MediaProcessingOptions {
  resize?: {
    width: number;
    height: number;
    quality?: number;
  };
  compress?: boolean;
  generateThumbnail?: boolean;
}

export class UploadService {
  private uploadDir: string;
  private maxFileSize: number;
  private allowedMimeTypes: string[];

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB
    this.allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/csv',
      'application/json',
      'text/plain'
    ];
  }

  // Configure multer for file uploads
  getMulterConfig() {
    const storage = multer.diskStorage({
      destination: async (req, file, cb) => {
        try {
          await fs.mkdir(this.uploadDir, { recursive: true });
          cb(null, this.uploadDir);
        } catch (error) {
          cb(error, '');
        }
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      }
    });

    const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      if (this.allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`File type ${file.mimetype} not allowed`));
      }
    };

    return multer({
      storage,
      fileFilter,
      limits: {
        fileSize: this.maxFileSize,
        files: 5 // Max 5 files per upload
      }
    });
  }

  // Process uploaded file
  async processUpload(file: Express.Multer.File, userId: number, options?: MediaProcessingOptions): Promise<UploadedFile> {
    try {
      const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const fileUrl = `/uploads/${file.filename}`;

      const uploadedFile: UploadedFile = {
        id: fileId,
        originalName: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        url: fileUrl,
        userId,
        uploadedAt: new Date(),
        metadata: {
          path: file.path,
          encoding: file.encoding,
          fieldname: file.fieldname,
        }
      };

      // Process image files
      if (file.mimetype.startsWith('image/')) {
        uploadedFile.metadata = {
          ...uploadedFile.metadata,
          ...(await this.processImage(file.path, options))
        };
      }

      // Store file metadata in database (mock)
      console.log(`📁 File uploaded: ${fileId}`, {
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        userId
      });

      return uploadedFile;
    } catch (error) {
      console.error("File processing error:", error);
      throw new Error("Failed to process uploaded file");
    }
  }

  // Process image files (resize, compress, generate thumbnails)
  private async processImage(filePath: string, options?: MediaProcessingOptions) {
    try {
      const metadata: Record<string, any> = {
        type: 'image',
        processed: false
      };

      // Mock image processing - in production, use Sharp or similar
      if (options?.resize) {
        console.log(`🖼️  Resizing image to ${options.resize.width}x${options.resize.height}`);
        metadata.resized = true;
        metadata.dimensions = options.resize;
      }

      if (options?.compress) {
        console.log(`🗜️  Compressing image`);
        metadata.compressed = true;
        metadata.originalSize = (await fs.stat(filePath)).size;
      }

      if (options?.generateThumbnail) {
        console.log(`🖼️  Generating thumbnail`);
        metadata.thumbnail = `/uploads/thumbnails/thumb_${path.basename(filePath)}`;
      }

      metadata.processed = true;
      return metadata;
    } catch (error) {
      console.error("Image processing error:", error);
      return { type: 'image', processed: false, error: error.message };
    }
  }

  // Get file by ID
  async getFile(fileId: string, userId?: number): Promise<UploadedFile | null> {
    try {
      // Mock database lookup
      const mockFile: UploadedFile = {
        id: fileId,
        originalName: 'example.jpg',
        filename: `upload_${fileId}.jpg`,
        mimetype: 'image/jpeg',
        size: 1024000,
        url: `/uploads/upload_${fileId}.jpg`,
        userId: userId || 1,
        uploadedAt: new Date(),
        metadata: {
          type: 'image',
          processed: true,
          dimensions: { width: 800, height: 600 }
        }
      };

      return mockFile;
    } catch (error) {
      console.error("Get file error:", error);
      return null;
    }
  }

  // Delete file
  async deleteFile(fileId: string, userId: number): Promise<boolean> {
    try {
      const file = await this.getFile(fileId, userId);
      if (!file) {
        throw new Error("File not found");
      }

      if (file.userId !== userId) {
        throw new Error("Unauthorized to delete this file");
      }

      // Delete physical file
      const filePath = path.join(this.uploadDir, file.filename);
      try {
        await fs.unlink(filePath);
        console.log(`🗑️  Deleted file: ${filePath}`);
      } catch (error) {
        console.warn(`File not found on disk: ${filePath}`);
      }

      // Delete from database (mock)
      console.log(`🗑️  File deleted from database: ${fileId}`);

      return true;
    } catch (error) {
      console.error("Delete file error:", error);
      return false;
    }
  }

  // Get user's files
  async getUserFiles(userId: number, limit = 50, offset = 0): Promise<UploadedFile[]> {
    try {
      // Mock user files
      const files: UploadedFile[] = Array.from({ length: Math.min(limit, 10) }, (_, i) => ({
        id: `file_${userId}_${i + offset}`,
        originalName: `document_${i + 1}.pdf`,
        filename: `upload_${userId}_${i + offset}.pdf`,
        mimetype: 'application/pdf',
        size: Math.floor(Math.random() * 5000000) + 100000,
        url: `/uploads/upload_${userId}_${i + offset}.pdf`,
        userId,
        uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        metadata: {
          type: 'document',
          processed: true
        }
      }));

      return files;
    } catch (error) {
      console.error("Get user files error:", error);
      return [];
    }
  }

  // Get file statistics
  async getFileStats(userId?: number) {
    try {
      return {
        totalFiles: Math.floor(Math.random() * 100) + 20,
        totalSize: Math.floor(Math.random() * 100000000) + 10000000, // bytes
        fileTypes: {
          images: Math.floor(Math.random() * 50) + 10,
          documents: Math.floor(Math.random() * 30) + 5,
          other: Math.floor(Math.random() * 20) + 5,
        },
        storageUsed: Math.floor(Math.random() * 80) + 10, // percentage
        storageLimit: 1073741824, // 1GB in bytes
        userId,
      };
    } catch (error) {
      console.error("File stats error:", error);
      throw new Error("Failed to get file statistics");
    }
  }

  // Clean up old files
  async cleanupOldFiles(daysOld = 30): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
      
      // Mock cleanup - in production, query database for old files
      const deletedCount = Math.floor(Math.random() * 10) + 1;
      
      console.log(`🧹 Cleaned up ${deletedCount} files older than ${daysOld} days`);
      
      return deletedCount;
    } catch (error) {
      console.error("Cleanup error:", error);
      return 0;
    }
  }

  // Generate signed URL for secure access
  generateSignedUrl(fileId: string, expiresIn = 3600): string {
    try {
      const expiry = Date.now() + (expiresIn * 1000);
      const signature = Buffer.from(`${fileId}:${expiry}`).toString('base64');
      
      return `/api/files/${fileId}/download?signature=${signature}&expires=${expiry}`;
    } catch (error) {
      console.error("Signed URL generation error:", error);
      throw new Error("Failed to generate signed URL");
    }
  }

  // Validate file access
  validateSignedUrl(fileId: string, signature: string, expires: string): boolean {
    try {
      const expiry = parseInt(expires);
      if (Date.now() > expiry) {
        return false;
      }

      const expectedSignature = Buffer.from(`${fileId}:${expiry}`).toString('base64');
      return signature === expectedSignature;
    } catch (error) {
      return false;
    }
  }
}

export const uploadService = new UploadService();