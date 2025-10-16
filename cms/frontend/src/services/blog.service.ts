import api from './api';

export interface BlogPost {
  id: string;
  slug: string;
  titleEn: string;
  titleVi: string;
  excerptEn?: string;
  excerptVi?: string;
  contentEn: string;
  contentVi: string;
  featuredImage?: string;
  authorId: string;
  authorName?: string;
  category?: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  viewCount?: number;
  seoTitleEn?: string;
  seoTitleVi?: string;
  seoDescEn?: string;
  seoDescVi?: string;
  seoKeywords?: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogRequest {
  slug: string;
  titleEn: string;
  titleVi: string;
  excerptEn?: string;
  excerptVi?: string;
  contentEn: string;
  contentVi: string;
  featuredImage?: string;
  category?: string;
  status?: 'draft' | 'published' | 'archived';
  tags?: string[];
  seoTitleEn?: string;
  seoTitleVi?: string;
  seoDescEn?: string;
  seoDescVi?: string;
  seoKeywords?: string[];
  publishedAt?: string;
}

export interface UpdateBlogRequest extends Partial<CreateBlogRequest> {}

export interface ListBlogsParams {
  page?: number;
  limit?: number;
  status?: 'draft' | 'published' | 'archived';
  search?: string;
  tag?: string;
}

export interface ListBlogsResponse {
  data: BlogPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class BlogService {
  private basePath = '/blogs';

  // Public endpoint - only returns published blogs
  async list(params?: ListBlogsParams): Promise<ListBlogsResponse> {
    const response = await api.get(this.basePath, { params });
    return response.data;
  }

  // Admin endpoint - returns all blogs including drafts
  async listAdmin(params?: ListBlogsParams): Promise<ListBlogsResponse> {
    const response = await api.get(`${this.basePath}/admin`, { params });
    return response.data;
  }

  async getById(id: string): Promise<BlogPost> {
    const response = await api.get(`${this.basePath}/admin/${id}`);
    return response.data.data;
  }

  async getBySlug(slug: string): Promise<BlogPost> {
    const response = await api.get(`${this.basePath}/${slug}`);
    return response.data.data;
  }

  async create(data: CreateBlogRequest): Promise<BlogPost> {
    const response = await api.post(`${this.basePath}/admin`, data);
    return response.data.data;
  }

  async update(id: string, data: UpdateBlogRequest): Promise<BlogPost> {
    const response = await api.put(`${this.basePath}/admin/${id}`, data);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.basePath}/admin/${id}`);
  }

  async publish(id: string): Promise<BlogPost> {
    const response = await api.patch(`${this.basePath}/admin/${id}/publish`);
    return response.data.data;
  }

  async archive(id: string): Promise<BlogPost> {
    const response = await api.patch(`${this.basePath}/admin/${id}/archive`);
    return response.data.data;
  }
}

export const blogService = new BlogService();
