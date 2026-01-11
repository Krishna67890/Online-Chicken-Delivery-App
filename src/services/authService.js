import { api } from './api/apiClient';
import { ENDPOINTS, buildUrl } from './api/endpoints';
import { storageService } from './storageService';
import { analyticsService } from './analyticsService';

export const authService = {
  // Login user
  async login(credentials) {
    try {
      const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
      const { user, token, refreshToken } = response.data;

      // Store tokens and user data
      storageService.setToken(token);
      storageService.setRefreshToken(refreshToken);
      storageService.setUser(user);

      // Track login
      analyticsService.identify(user.id, user);
      analyticsService.track('User Logged In', { userId: user.id });

      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register new user
  async register(userData) {
    try {
      const response = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
      const { user, token, refreshToken } = response.data;

      // Store tokens and user data
      storageService.setToken(token);
      storageService.setRefreshToken(refreshToken);
      storageService.setUser(user);

      // Track registration
      analyticsService.identify(user.id, user);
      analyticsService.track('User Registered', { userId: user.id });

      return { user, token };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout user
  async logout() {
    try {
      // Call logout endpoint
      await api.post(ENDPOINTS.AUTH.LOGOUT);
      
      // Track logout
      analyticsService.track('User Logged Out');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      storageService.clearAll();
      analyticsService.reset();
    }
  },

  // Refresh access token
  async refreshToken() {
    try {
      const refreshToken = storageService.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post(ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
      const { token, refreshToken: newRefreshToken } = response.data;

      storageService.setToken(token);
      if (newRefreshToken) {
        storageService.setRefreshToken(newRefreshToken);
      }

      return token;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      await api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      return true;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword });
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  // Verify email
  async verifyEmail(token) {
    try {
      await api.post(ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
      return true;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = storageService.getToken();
    const user = storageService.getUser();
    return !!(token && user);
  },

  // Get current user
  getCurrentUser() {
    return storageService.getUser();
  },
};