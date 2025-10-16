import api from './api';

export interface Customer {
  id: string;
  companyName: string;
  logo?: string;
  website?: string;
  industry?: string;
  caseStudy?: any;
  testimonial?: any;
  showHomepage: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  companyName: string;
  logo?: string;
  website?: string;
  industry?: string;
  caseStudy?: any;
  testimonial?: any;
  showHomepage?: boolean;
  displayOrder?: number;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {}

export interface ListCustomersParams {
  page?: number;
  limit?: number;
  isFeatured?: boolean;
  industry?: string;
}

export interface ListCustomersResponse {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class CustomerService {
  private basePath = '/customers';

  async list(params?: ListCustomersParams): Promise<ListCustomersResponse> {
    const response = await api.get(this.basePath, { params });
    return response.data;
  }

  async getById(id: string): Promise<Customer> {
    const response = await api.get(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data: CreateCustomerRequest): Promise<Customer> {
    const response = await api.post(`${this.basePath}/admin`, data);
    return response.data;
  }

  async update(id: string, data: UpdateCustomerRequest): Promise<Customer> {
    const response = await api.put(`${this.basePath}/admin/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.basePath}/admin/${id}`);
  }
}

export const customerService = new CustomerService();
