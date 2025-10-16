import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import { debugLogger } from '@/utils/debug';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookies
});

// Request interceptor - Add auth token and debug logging
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Store request start time for performance monitoring
    (config as any).requestStartTime = performance.now();

    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug log request
    debugLogger.apiRequest(
      config.method?.toUpperCase() || 'GET',
      `${config.baseURL || ''}${config.url || ''}`,
      {
        params: config.params,
        data: config.data,
        headers: config.headers,
      }
    );

    return config;
  },
  (error) => {
    debugLogger.error('API', 'Request interceptor error', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and debug logging
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = (response.config as any).requestStartTime
      ? performance.now() - (response.config as any).requestStartTime
      : undefined;

    // Debug log response
    debugLogger.apiResponse(
      response.config.method?.toUpperCase() || 'GET',
      `${response.config.baseURL || ''}${response.config.url || ''}`,
      response.status,
      {
        data: response.data,
        headers: response.headers,
      },
      duration
    );

    return response;
  },
  async (error: AxiosError<{ error: string }>) => {
    const originalRequest = error.config;

    // Calculate request duration (even for errors)
    const duration = originalRequest && (originalRequest as any).requestStartTime
      ? performance.now() - (originalRequest as any).requestStartTime
      : undefined;

    // Debug log error response
    if (error.response) {
      debugLogger.apiResponse(
        originalRequest?.method?.toUpperCase() || 'GET',
        `${originalRequest?.baseURL || ''}${originalRequest?.url || ''}`,
        error.response.status,
        {
          error: error.response.data,
          headers: error.response.headers,
        },
        duration
      );
    } else if (error.request) {
      debugLogger.error('API', 'No response received', {
        url: `${originalRequest?.baseURL || ''}${originalRequest?.url || ''}`,
        error: error.message,
      });
    } else {
      debugLogger.error('API', 'Request setup error', error.message);
    }

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;

      try {
        debugLogger.info('Auth', 'Attempting token refresh...');
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          localStorage.setItem('accessToken', data.accessToken);
          debugLogger.info('Auth', 'Token refreshed successfully');

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          }

          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        debugLogger.warn('Auth', 'Token refresh failed, logging out');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const message = error.response?.data?.error || error.message || 'An error occurred';

    // Don't show toast for 401 (handled by redirect)
    if (error.response?.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
