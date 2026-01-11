import { api } from './api/apiClient';
import { ENDPOINTS, buildUrl } from './api/endpoints';
import { storageService } from './storageService';

export const userService = {
  // Get user profile
  async getProfile() {
    try {
      const response = await api.get(ENDPOINTS.USERS.PROFILE);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.put(ENDPOINTS.USERS.UPDATE_PROFILE, profileData);
      const updatedUser = response.data;
      
      // Update stored user data
      storageService.setUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Upload avatar
  async uploadAvatar(file, onProgress = null) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.upload(ENDPOINTS.USERS.UPLOAD_AVATAR, formData, onProgress);
      const { avatarUrl } = response.data;

      // Update user in storage
      const user = storageService.getUser();
      if (user) {
        user.avatar = avatarUrl;
        storageService.setUser(user);
      }

      return avatarUrl;
    } catch (error) {
      console.error('Avatar upload error:', error);
      throw error;
    }
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      await api.post(ENDPOINTS.USERS.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  // Update preferences
  async updatePreferences(preferences) {
    try {
      const response = await api.put(ENDPOINTS.USERS.PREFERENCES, preferences);
      return response.data;
    } catch (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
  },

  // Delete account
  async deleteAccount() {
    try {
      await api.delete('/users/account');
      return true;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  },

  // Get user statistics
  async getUserStats() {
    try {
      const response = await api.get('/users/stats');
      return response.data;
    } catch (error) {
      console.error('Get user stats error:', error);
      throw error;
    }
  },
};