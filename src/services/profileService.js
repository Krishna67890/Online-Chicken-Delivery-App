// Mock Profile Service
import { mockAuth } from '../config/mockAuth';

class ProfileService {
  /**
   * Get user profile by user ID
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} User profile data
   */
  async getProfile(userId) {
    try {
      const profile = mockAuth.getMockUserProfile(userId);
      if (profile) {
        return { id: userId, ...profile };
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw new Error('Failed to fetch profile');
    }
  }

  /**
   * Update user profile
   * @param {string} userId - The user ID
   * @param {Object} updates - Profile updates
   * @returns {Promise<void>}
   */
  async updateProfile(userId, updates) {
    try {
      const currentProfile = mockAuth.getMockUserProfile(userId);
      if (!currentProfile) {
        throw new Error('User profile not found');
      }
      
      const updatedProfile = {
        ...currentProfile,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      mockAuth.setMockUserProfile(userId, updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  }

  /**
   * Update user preferences
   * @param {string} userId - The user ID
   * @param {Object} preferences - User preferences
   * @returns {Promise<void>}
   */
  async updatePreferences(userId, preferences) {
    try {
      const currentProfile = mockAuth.getMockUserProfile(userId);
      if (!currentProfile) {
        throw new Error('User profile not found');
      }
      
      const updatedProfile = {
        ...currentProfile,
        preferences: {
          ...currentProfile.preferences,
          ...preferences,
          updatedAt: new Date().toISOString()
        }
      };
      
      mockAuth.setMockUserProfile(userId, updatedProfile);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw new Error('Failed to update preferences');
    }
  }

  /**
   * Add favorite item
   * @param {string} userId - The user ID
   * @param {string} itemId - The item ID to add to favorites
   * @returns {Promise<void>}
   */
  async addFavorite(userId, itemId) {
    try {
      const currentProfile = mockAuth.getMockUserProfile(userId);
      if (!currentProfile) {
        throw new Error('User profile not found');
      }
      
      const updatedFavorites = [...new Set([...(currentProfile.favoriteItems || []), itemId])];
      const updatedProfile = {
        ...currentProfile,
        favoriteItems: updatedFavorites,
        updatedAt: new Date().toISOString()
      };
      
      mockAuth.setMockUserProfile(userId, updatedProfile);
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw new Error('Failed to add favorite');
    }
  }

  /**
   * Remove favorite item
   * @param {string} userId - The user ID
   * @param {string} itemId - The item ID to remove from favorites
   * @returns {Promise<void>}
   */
  async removeFavorite(userId, itemId) {
    try {
      const currentProfile = mockAuth.getMockUserProfile(userId);
      if (!currentProfile) {
        throw new Error('User profile not found');
      }
      
      const updatedFavorites = (currentProfile.favoriteItems || []).filter(id => id !== itemId);
      const updatedProfile = {
        ...currentProfile,
        favoriteItems: updatedFavorites,
        updatedAt: new Date().toISOString()
      };
      
      mockAuth.setMockUserProfile(userId, updatedProfile);
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw new Error('Failed to remove favorite');
    }
  }

  /**
   * Add delivery address
   * @param {string} userId - The user ID
   * @param {Object} address - The address to add
   * @returns {Promise<string>} The new address ID
   */
  async addAddress(userId, address) {
    try {
      const addressId = `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const currentProfile = mockAuth.getMockUserProfile(userId);
      if (!currentProfile) {
        throw new Error('User profile not found');
      }
      
      const addressWithId = {
        id: addressId,
        ...address,
        createdAt: new Date().toISOString()
      };
      
      const updatedAddresses = [...(currentProfile.addresses || []), addressWithId];
      const updatedProfile = {
        ...currentProfile,
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString()
      };
      
      mockAuth.setMockUserProfile(userId, updatedProfile);
      
      return addressId;
    } catch (error) {
      console.error('Error adding address:', error);
      throw new Error('Failed to add address');
    }
  }

  /**
   * Update delivery address
   * @param {string} userId - The user ID
   * @param {string} addressId - The address ID to update
   * @param {Object} updates - Address updates
   * @returns {Promise<void>}
   */
  async updateAddress(userId, addressId, updates) {
    try {
      const currentProfile = mockAuth.getMockUserProfile(userId);
      if (!currentProfile || !currentProfile.addresses) {
        throw new Error('User profile or addresses not found');
      }

      const updatedAddresses = currentProfile.addresses.map(addr => 
        addr.id === addressId ? { ...addr, ...updates } : addr
      );

      const updatedProfile = {
        ...currentProfile,
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString()
      };
      
      mockAuth.setMockUserProfile(userId, updatedProfile);
    } catch (error) {
      console.error('Error updating address:', error);
      throw new Error('Failed to update address');
    }
  }

  /**
   * Remove delivery address
   * @param {string} userId - The user ID
   * @param {string} addressId - The address ID to remove
   * @returns {Promise<void>}
   */
  async removeAddress(userId, addressId) {
    try {
      const currentProfile = mockAuth.getMockUserProfile(userId);
      if (!currentProfile || !currentProfile.addresses) {
        throw new Error('User profile or addresses not found');
      }

      const updatedAddresses = currentProfile.addresses.filter(addr => addr.id !== addressId);
      const updatedProfile = {
        ...currentProfile,
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString()
      };
      
      mockAuth.setMockUserProfile(userId, updatedProfile);
    } catch (error) {
      console.error('Error removing address:', error);
      throw new Error('Failed to remove address');
    }
  }

  /**
   * Set default delivery address
   * @param {string} userId - The user ID
   * @param {string} addressId - The address ID to set as default
   * @returns {Promise<void>}
   */
  async setDefaultAddress(userId, addressId) {
    try {
      const currentProfile = mockAuth.getMockUserProfile(userId);
      if (!currentProfile || !currentProfile.addresses) {
        throw new Error('User profile or addresses not found');
      }

      const updatedAddresses = currentProfile.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));

      const updatedProfile = {
        ...currentProfile,
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString()
      };
      
      mockAuth.setMockUserProfile(userId, updatedProfile);
    } catch (error) {
      console.error('Error setting default address:', error);
      throw new Error('Failed to set default address');
    }
  }

  /**
   * Update loyalty points
   * @param {string} userId - The user ID
   * @param {number} points - Points to add (can be negative to subtract)
   * @returns {Promise<void>}
   */
  async updateLoyaltyPoints(userId, points) {
    try {
      const currentProfile = mockAuth.getMockUserProfile(userId);
      if (!currentProfile) {
        throw new Error('User profile not found');
      }

      const currentPoints = currentProfile.loyaltyPoints || 0;
      const newPoints = currentPoints + points;
      const totalEarned = (currentProfile.totalLoyaltyEarned || 0) + Math.max(0, points);

      const updatedProfile = {
        ...currentProfile,
        loyaltyPoints: Math.max(0, newPoints), // Ensure points don't go negative
        totalLoyaltyEarned: totalEarned,
        updatedAt: new Date().toISOString()
      };
      
      mockAuth.setMockUserProfile(userId, updatedProfile);
    } catch (error) {
      console.error('Error updating loyalty points:', error);
      throw new Error('Failed to update loyalty points');
    }
  }

  /**
   * Get user statistics
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} User statistics
   */
  async getUserStats(userId) {
    try {
      const profile = await this.getProfile(userId);
      if (!profile) {
        return null;
      }

      return {
        totalOrders: profile.totalOrders || 0,
        totalSpent: profile.totalSpent || 0,
        favoriteItems: profile.favoriteItems?.length || 0,
        deliveryAddresses: profile.addresses?.length || 0,
        loyaltyPoints: profile.loyaltyPoints || 0,
        accountAge: profile.createdAt ? 
          Math.floor((Date.now() - new Date(profile.createdAt)) / (1000 * 60 * 60 * 24)) : 0
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw new Error('Failed to fetch user stats');
    }
  }

  /**
   * Update order history
   * @param {string} userId - The user ID
   * @param {Object} order - The order to add to history
   * @returns {Promise<void>}
   */
  async addOrderToHistory(userId, order) {
    try {
      const currentProfile = mockAuth.getMockUserProfile(userId);
      if (!currentProfile) {
        throw new Error('User profile not found');
      }

      const orderWithId = {
        id: `order_${Date.now()}`,
        ...order,
        createdAt: new Date().toISOString()
      };

      const orderHistory = [...(currentProfile.orderHistory || []), orderWithId];
      const totalOrders = (currentProfile.totalOrders || 0) + 1;
      const totalSpent = (currentProfile.totalSpent || 0) + (order.total || 0);

      const updatedProfile = {
        ...currentProfile,
        orderHistory,
        totalOrders,
        totalSpent,
        lastOrderDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockAuth.setMockUserProfile(userId, updatedProfile);
    } catch (error) {
      console.error('Error adding order to history:', error);
      throw new Error('Failed to add order to history');
    }
  }
}

export const profileService = new ProfileService();
export default profileService;