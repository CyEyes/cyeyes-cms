import api from './api';

export interface ProductFeature {
  titleEn: string;
  titleVi: string;
  descEn?: string;
  descVi?: string;
  icon?: string;
}

export interface ProductCustomerValue {
  titleEn: string;
  titleVi: string;
  descEn?: string;
  descVi?: string;
  icon?: string;
}

export interface Product {
  id: string;
  slug: string;
  nameEn: string;
  nameVi: string;
  category?: string;
  taglineEn?: string;
  taglineVi?: string;
  shortDescEn?: string;
  shortDescVi?: string;
  fullDescEn?: string;
  fullDescVi?: string;
  features?: ProductFeature[];
  customerValues?: ProductCustomerValue[];
  images?: string[];
  pricing?: any; // JSON object
  ctaTextEn?: string;
  ctaTextVi?: string;
  ctaLink?: string;
  relatedProducts?: string[];
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  slug: string;
  nameEn: string;
  nameVi: string;
  category?: string;
  taglineEn?: string;
  taglineVi?: string;
  shortDescEn?: string;
  shortDescVi?: string;
  fullDescEn?: string;
  fullDescVi?: string;
  features?: ProductFeature[];
  customerValues?: ProductCustomerValue[];
  images?: string[];
  pricing?: any;
  ctaTextEn?: string;
  ctaTextVi?: string;
  ctaLink?: string;
  relatedProducts?: string[];
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface ListProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  isActive?: boolean;
}

export interface ListProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ProductService {
  private basePath = '/products';

  async list(params?: ListProductsParams): Promise<ListProductsResponse> {
    const response = await api.get(this.basePath, { params });
    return response.data;
  }

  async getById(id: string): Promise<Product> {
    const response = await api.get(`${this.basePath}/${id}`);
    return response.data;
  }

  async getBySlug(slug: string): Promise<Product> {
    const response = await api.get(`${this.basePath}/${slug}`);
    return response.data.data || response.data;
  }

  async create(data: CreateProductRequest): Promise<Product> {
    const response = await api.post(`${this.basePath}/admin`, data);
    return response.data;
  }

  async update(id: string, data: UpdateProductRequest): Promise<Product> {
    const response = await api.put(`${this.basePath}/admin/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.basePath}/admin/${id}`);
  }
}

export const productService = new ProductService();
