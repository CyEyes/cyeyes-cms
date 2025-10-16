import { z } from 'zod';

/**
 * Slug validation
 */
const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(200, 'Slug is too long')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens');

/**
 * Create blog post schema
 * Using .nullish() to allow both null and undefined for optional fields
 */
export const createBlogSchema = z.object({
  slug: slugSchema,
  titleEn: z.string().min(1, 'English title is required').max(200),
  titleVi: z.string().min(1, 'Vietnamese title is required').max(200),
  contentEn: z.string().nullish(),
  contentVi: z.string().nullish(),
  excerptEn: z.string().nullish(),
  excerptVi: z.string().nullish(),
  featuredImage: z.string().url().nullish().or(z.literal('')),
  category: z.string().nullish(),
  tags: z.array(z.string()).nullish(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  publishedAt: z.string().datetime().nullish(),
  seoTitleEn: z.string().max(60).nullish(),
  seoTitleVi: z.string().max(60).nullish(),
  seoDescEn: z.string().max(160).nullish(),
  seoDescVi: z.string().max(160).nullish(),
  seoKeywords: z.array(z.string()).nullish(),
});

/**
 * Update blog post schema (all fields optional)
 */
export const updateBlogSchema = createBlogSchema.partial();

/**
 * Query parameters for listing blogs
 */
export const listBlogsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  category: z.string().optional(),
  tags: z.string().optional(), // Comma-separated
  search: z.string().optional(), // Search in title/content
  sortBy: z.enum(['createdAt', 'updatedAt', 'publishedAt', 'viewCount', 'titleEn']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * UUID parameter schema
 */
export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

/**
 * Slug parameter schema
 */
export const slugParamSchema = z.object({
  slug: slugSchema,
});

// Export types
export type CreateBlogRequest = z.infer<typeof createBlogSchema>;
export type UpdateBlogRequest = z.infer<typeof updateBlogSchema>;
export type ListBlogsQuery = z.infer<typeof listBlogsQuerySchema>;
export type UuidParam = z.infer<typeof uuidParamSchema>;
export type SlugParam = z.infer<typeof slugParamSchema>;
