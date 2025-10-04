import { storageService } from '../storageService';
import { authService } from '../authService';

export const setupInterceptors = (apiClient) => {
  // Request interceptor
  apiClient.interceptors.request.use(
    (config) => {
      // Add auth token to requests
      const token = storageService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add timestamp for cache busting
      if (config.method === 'get') {
        config.params = {
          ...config.params,
          _t: Date.now(),
        };
      }

      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data || config.params);

      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  apiClient.interceptors.response.use(
    (response) => {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, error.response?.data || error.message);

      // Handle token expiration
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try to refresh token
          await authService.refreshToken();
          // Retry original request
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          await authService.logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // Handle network errors
      if (!error.response) {
        console.error('Network error:', error.message);
        return Promise.reject({
          message: 'Network error. Please check your connection.',
          code: 'NETWORK_ERROR',
        });
      }

      // Handle server errors
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      const errorCode = error.response?.data?.code || error.response?.status;

      return Promise.reject({
        message: errorMessage,
        code: errorCode,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  );
};