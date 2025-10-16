import { z } from 'zod';

const slugSchema = z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

// Feature schema that accepts both camelCase and snake_case
const featureSchema = z.object({
  titleEn: z.string().optional(),
  titleVi: z.string().optional(),
  descEn: z.string().nullish(),
  descVi: z.string().nullish(),
  // Legacy snake_case support
  title_en: z.string().optional(),
  title_vi: z.string().optional(),
  desc_en: z.string().nullish(),
  desc_vi: z.string().nullish(),
  icon: z.string().optional(), // Support icon field
}).refine(
  (data) => (data.titleEn || data.title_en) && (data.titleVi || data.title_vi),
  { message: 'Either titleEn/titleVi or title_en/title_vi must be provided' }
);

// Customer Value schema (same structure as feature)
const customerValueSchema = z.object({
  titleEn: z.string().optional(),
  titleVi: z.string().optional(),
  descEn: z.string().nullish(),
  descVi: z.string().nullish(),
  icon: z.string().optional(),
}).refine(
  (data) => data.titleEn && data.titleVi,
  { message: 'Both titleEn and titleVi must be provided for customer values' }
);

// Accept both URL strings and relative paths for images
const imageSchema = z.string().min(1);

export const createProductSchema = z.object({
  slug: slugSchema,
  nameEn: z.string().min(1).max(200),
  nameVi: z.string().min(1).max(200),
  category: z.string().nullish(),
  taglineEn: z.string().max(200).nullish(),
  taglineVi: z.string().max(200).nullish(),
  shortDescEn: z.string().nullish(),
  shortDescVi: z.string().nullish(),
  fullDescEn: z.string().nullish(),
  fullDescVi: z.string().nullish(),
  features: z.array(featureSchema).nullish(),
  customerValues: z.array(customerValueSchema).nullish(),
  images: z.array(imageSchema).nullish(),
  pricing: z.record(z.string(), z.any()).nullish(),
  ctaTextEn: z.string().nullish(),
  ctaTextVi: z.string().nullish(),
  ctaLink: z.string().url().nullish().or(z.literal('')),
  relatedProducts: z.array(z.string().uuid()).nullish(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export const updateProductSchema = createProductSchema.partial();

export const listProductsQuerySchema = z.object({
  category: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type CreateProductRequest = z.infer<typeof createProductSchema>;
export type UpdateProductRequest = z.infer<typeof updateProductSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
