import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database.js';
import { teamMembers, type TeamMember, type NewTeamMember } from '../models/index.js';
import { eq, and, desc } from 'drizzle-orm';
import type { CreateTeamMemberRequest, UpdateTeamMemberRequest, ListTeamMembersQuery } from '../schemas/team.schema.js';
import type { PaginationResult } from '../types/index.js';

/**
 * Create team member with hybrid schema support
 */
export const createTeamMember = async (data: CreateTeamMemberRequest): Promise<TeamMember> => {
  const newMember: NewTeamMember = {
    id: uuidv4(),
    nameEn: data.nameEn,
    nameVi: data.nameVi,

    // New bilingual fields
    positionEn: data.positionEn || null,
    positionVi: data.positionVi || null,
    department: data.department || null,
    photo: data.photo || null,
    shortBioEn: data.shortBioEn || null,
    shortBioVi: data.shortBioVi || null,
    fullBioEn: data.fullBioEn || null,
    fullBioVi: data.fullBioVi || null,

    // Legacy fields - sync from new fields if not provided
    position: data.position || data.positionEn || data.positionVi || null,
    avatar: data.avatar || data.photo || null,
    bioEn: data.bioEn || data.shortBioEn || data.fullBioEn || null,
    bioVi: data.bioVi || data.shortBioVi || data.fullBioVi || null,

    email: data.email || null,
    phone: data.phone || null,

    // New structured social links
    socialLinks: data.socialLinks ? JSON.stringify(data.socialLinks) : null,

    // Legacy flat social links - sync from structured if not provided
    linkedin: data.linkedin || data.socialLinks?.linkedin || null,
    twitter: data.twitter || data.socialLinks?.twitter || null,

    expertise: data.expertise ? JSON.stringify(data.expertise) : null,
    displayOrder: data.displayOrder || 0,
    isActive: data.isActive ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const result = await db.insert(teamMembers).values(newMember).returning();
  return parseTeamMember(result[0]);
};

/**
 * Get team member by ID
 */
export const getTeamMemberById = async (id: string): Promise<TeamMember | undefined> => {
  const member = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).get();
  return member ? parseTeamMember(member) : undefined;
};

/**
 * List team members with filtering and pagination
 */
export const listTeamMembers = async (query: ListTeamMembersQuery): Promise<PaginationResult<TeamMember>> => {
  const { page, limit, department, isActive } = query;

  // Build where conditions
  const conditions = [];

  if (department) {
    conditions.push(eq(teamMembers.department, department));
  }

  if (isActive !== undefined) {
    conditions.push(eq(teamMembers.isActive, isActive));
  }

  // Get total count
  const allMembers = await db
    .select()
    .from(teamMembers)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const total = allMembers.length;

  // Get paginated results sorted by displayOrder
  const offset = (page - 1) * limit;
  const members = await db
    .select()
    .from(teamMembers)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(teamMembers.displayOrder, desc(teamMembers.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    data: members.map(parseTeamMember),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Update team member with hybrid schema support
 */
export const updateTeamMember = async (id: string, data: UpdateTeamMemberRequest): Promise<TeamMember> => {
  const existing = await getTeamMemberById(id);
  if (!existing) {
    throw new Error('Team member not found');
  }

  const updateData: Partial<NewTeamMember> = {
    ...data,
    socialLinks: data.socialLinks !== undefined ? (data.socialLinks ? JSON.stringify(data.socialLinks) : null) : undefined,
    expertise: data.expertise !== undefined ? (data.expertise ? JSON.stringify(data.expertise) : null) : undefined,
    updatedAt: new Date().toISOString(),
  };

  // Sync legacy fields from new fields if provided
  if (data.positionEn || data.positionVi) {
    updateData.position = data.position || data.positionEn || data.positionVi;
  }
  if (data.photo) {
    updateData.avatar = data.avatar || data.photo;
  }
  if (data.shortBioEn || data.fullBioEn) {
    updateData.bioEn = data.bioEn || data.shortBioEn || data.fullBioEn;
  }
  if (data.shortBioVi || data.fullBioVi) {
    updateData.bioVi = data.bioVi || data.shortBioVi || data.fullBioVi;
  }
  if (data.socialLinks?.linkedin) {
    updateData.linkedin = data.linkedin || data.socialLinks.linkedin;
  }
  if (data.socialLinks?.twitter) {
    updateData.twitter = data.twitter || data.socialLinks.twitter;
  }

  // Sync new fields from legacy fields if provided
  if (data.position) {
    updateData.positionEn = updateData.positionEn || data.position;
    updateData.positionVi = updateData.positionVi || data.position;
  }
  if (data.avatar) {
    updateData.photo = updateData.photo || data.avatar;
  }
  if (data.bioEn) {
    updateData.shortBioEn = updateData.shortBioEn || data.bioEn;
  }
  if (data.bioVi) {
    updateData.shortBioVi = updateData.shortBioVi || data.bioVi;
  }

  // Remove undefined values
  Object.keys(updateData).forEach(key => {
    if (updateData[key as keyof typeof updateData] === undefined) {
      delete updateData[key as keyof typeof updateData];
    }
  });

  const result = await db.update(teamMembers).set(updateData).where(eq(teamMembers.id, id)).returning();

  return parseTeamMember(result[0]);
};

/**
 * Delete team member
 */
export const deleteTeamMember = async (id: string): Promise<void> => {
  const existing = await getTeamMemberById(id);
  if (!existing) {
    throw new Error('Team member not found');
  }

  await db.delete(teamMembers).where(eq(teamMembers.id, id));
};

/**
 * Parse team member (convert JSON strings to objects)
 */
const parseTeamMember = (member: TeamMember): TeamMember => {
  return {
    ...member,
    socialLinks: member.socialLinks ? JSON.parse(member.socialLinks) : null,
    expertise: member.expertise ? JSON.parse(member.expertise) : null,
  };
};
