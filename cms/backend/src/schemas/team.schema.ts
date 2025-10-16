import { z } from 'zod';

export const createTeamMemberSchema = z.object({
  nameEn: z.string().min(1, 'English name is required').max(100),
  nameVi: z.string().min(1, 'Vietnamese name is required').max(100),

  // New bilingual fields
  positionEn: z.string().nullish(),
  positionVi: z.string().nullish(),
  department: z.string().nullish(),
  photo: z.string().url().nullish().or(z.literal('')),
  shortBioEn: z.string().max(500).nullish(),
  shortBioVi: z.string().max(500).nullish(),
  fullBioEn: z.string().nullish(),
  fullBioVi: z.string().nullish(),

  // Legacy fields for backward compatibility
  position: z.string().nullish(),
  avatar: z.string().url().nullish().or(z.literal('')),
  bioEn: z.string().nullish(),
  bioVi: z.string().nullish(),

  email: z.string().email().nullish().or(z.literal('')),
  phone: z.string().nullish(),

  // New structured social links
  socialLinks: z
    .object({
      linkedin: z.string().url().nullish().or(z.literal('')),
      twitter: z.string().url().nullish().or(z.literal('')),
      github: z.string().url().nullish().or(z.literal('')),
    })
    .nullish(),

  // Legacy flat social links
  linkedin: z.string().url().nullish().or(z.literal('')),
  twitter: z.string().url().nullish().or(z.literal('')),

  expertise: z.array(z.string()).nullish(),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const updateTeamMemberSchema = createTeamMemberSchema.partial();

export const listTeamMembersQuerySchema = z.object({
  department: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
});

export type CreateTeamMemberRequest = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMemberRequest = z.infer<typeof updateTeamMemberSchema>;
export type ListTeamMembersQuery = z.infer<typeof listTeamMembersQuerySchema>;
