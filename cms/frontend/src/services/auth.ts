import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'content' | 'admin';
  avatar?: string;
  isActive: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  message?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);

    // Store tokens and user
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await api.get<{ user: User }>('/auth/me');
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  hasRole(role: 'user' | 'content' | 'admin'): boolean {
    const user = this.getStoredUser();
    if (!user) return false;

    const roleHierarchy = { user: 1, content: 2, admin: 3 };
    return roleHierarchy[user.role] >= roleHierarchy[role];
  },
};
