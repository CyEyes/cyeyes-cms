import { z } from 'zod';

const caseStudySchema = z.object({
  titleEn: z.string(),
  titleVi: z.string(),
  challengeEn: z.string(),
  challengeVi: z.string(),
  solutionEn: z.string(),
  solutionVi: z.string(),
  resultsEn: z.string(),
  resultsVi: z.string(),
  metrics: z.record(z.string(), z.any()).nullish(),
});

const testimonialSchema = z.object({
  quoteEn: z.string(),
  quoteVi: z.string(),
  authorName: z.string(),
  authorPosition: z.string(),
});

export const createCustomerSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(200),
  logo: z.string().url().nullish().or(z.literal('')),
  industry: z.string().nullish(),
  website: z.string().url().nullish().or(z.literal('')),
  caseStudy: caseStudySchema.nullish(),
  testimonial: testimonialSchema.nullish(),
  showHomepage: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const listCustomersQuerySchema = z.object({
  industry: z.string().optional(),
  showHomepage: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
});

export type CreateCustomerRequest = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerRequest = z.infer<typeof updateCustomerSchema>;
export type ListCustomersQuery = z.infer<typeof listCustomersQuerySchema>;
