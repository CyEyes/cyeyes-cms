/**
 * Common types used across the application
 */

export type Role = 'user' | 'content' | 'admin';

export type Status = 'draft' | 'published' | 'archived';

export type FileType = 'image' | 'video' | 'document';

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BilingualContent {
  en: string;
  vi: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
