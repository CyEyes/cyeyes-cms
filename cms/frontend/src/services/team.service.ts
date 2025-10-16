import api from './api';

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
}

export interface TeamMember {
  id: string;
  nameEn: string;
  nameVi: string;

  // New bilingual fields
  positionEn?: string;
  positionVi?: string;
  department?: string;
  photo?: string;
  shortBioEn?: string;
  shortBioVi?: string;
  fullBioEn?: string;
  fullBioVi?: string;

  // Legacy fields for backward compatibility
  position?: string;
  avatar?: string;
  bioEn?: string;
  bioVi?: string;

  email?: string;
  phone?: string;

  // New structured social links
  socialLinks?: SocialLinks;

  // Legacy flat social links
  linkedin?: string;
  twitter?: string;

  expertise?: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamRequest {
  nameEn: string;
  nameVi: string;

  // New bilingual fields
  positionEn?: string;
  positionVi?: string;
  department?: string;
  photo?: string;
  shortBioEn?: string;
  shortBioVi?: string;
  fullBioEn?: string;
  fullBioVi?: string;

  // Legacy fields
  position?: string;
  avatar?: string;
  bioEn?: string;
  bioVi?: string;

  email?: string;
  phone?: string;

  // New structured social links
  socialLinks?: SocialLinks;

  // Legacy flat social links
  linkedin?: string;
  twitter?: string;

  expertise?: string[];
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateTeamRequest extends Partial<CreateTeamRequest> {}

export interface ListTeamParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  department?: string;
}

export interface ListTeamResponse {
  data: TeamMember[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class TeamService {
  private basePath = '/team';

  async list(params?: ListTeamParams): Promise<ListTeamResponse> {
    const response = await api.get(this.basePath, { params });
    return response.data;
  }

  async listAdmin(params?: ListTeamParams): Promise<ListTeamResponse> {
    const response = await api.get(`${this.basePath}/admin`, { params });
    return response.data;
  }

  async getById(id: string): Promise<TeamMember> {
    const response = await api.get(`${this.basePath}/admin/${id}`);
    return response.data.data;
  }

  async create(data: CreateTeamRequest): Promise<TeamMember> {
    const response = await api.post(`${this.basePath}/admin`, data);
    return response.data.data;
  }

  async update(id: string, data: UpdateTeamRequest): Promise<TeamMember> {
    const response = await api.put(`${this.basePath}/admin/${id}`, data);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.basePath}/admin/${id}`);
  }
}

export const teamService = new TeamService();
