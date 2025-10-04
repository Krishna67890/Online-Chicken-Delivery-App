import { api, buildUrl } from './api/apiClient';
import { ENDPOINTS } from './api/endpoints';
import { storageService } from './storageService';

export const menuService = {
  // Get all menu categories
  async getCategories() {
    try {
      const response = await api.get(ENDPOINTS.MENU.CATEGORIES);
      return response.data;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  },

  // Get menu items with filtering and pagination
  async getItems(filters = {}) {
    try {
      const params = {
        category: filters.category,
        search: filters.searchTerm,
        sort: filters.sortBy,
        page: filters.page || 1,
        limit: filters.limit || 20,
        ...filters,
      };

      const response = await api.get(ENDPOINTS.MENU.ITEMS, { params });
      return response.data;
    } catch (error) {
      console.error('Get items error:', error);
      throw error;
    }
  },

  // Get item details
  async getItemDetails(itemId) {
    try {
      const response = await api.get(buildUrl(`${ENDPOINTS.MENU.ITEM_DETAILS}/:id`, { id: itemId }));
      return response.data;
    } catch (error) {
      console.error('Get item details error:', error);
      throw error;
    }
  },

  // Search menu items
  async searchItems(query, filters = {}) {
    try {
      const params = {
        q: query,
        ...filters,
      };

      const response = await api.get(ENDPOINTS.MENU.SEARCH, { params });
      return response.data;
    } catch (error) {
      console.error('Search items error:', error);
      throw error;
    }
  },

  // Get personalized recommendations
  async getRecommendations(limit = 10) {
    try {
      const params = { limit };
      const response = await api.get(ENDPOINTS.MENU.RECOMMENDATIONS, { params });
      return response.data;
    } catch (error) {
      console.error('Get recommendations error:', error);
      throw error;
    }
  },

  // Get item customizations
  async getCustomizations(itemId) {
    try {
      const response = await api.get(buildUrl(`${ENDPOINTS.MENU.CUSTOMIZATIONS}/:id`, { id: itemId }));
      return response.data;
    } catch (error) {
      console.error('Get customizations error:', error);
      throw error;
    }
  },

  // Check item availability
  async checkAvailability(itemId, quantity = 1) {
    try {
      const response = await api.get(`/menu/items/${itemId}/availability`, {
        params: { quantity },
      });
      return response.data;
    } catch (error) {
      console.error('Check availability error:', error);
      throw error;
    }
  },

  // Get popular items
  async getPopularItems(limit = 8) {
    try {
      const response = await api.get('/menu/popular', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Get popular items error:', error);
      throw error;
    }
  },

  // Cache menu data
  cacheMenuData(category, data) {
    const cacheKey = `menu_${category}`;
    storageService.set(cacheKey, data, 5 * 60 * 1000); // 5 minutes cache
  },

  // Get cached menu data
  getCachedMenuData(category) {
    const cacheKey = `menu_${category}`;
    return storageService.get(cacheKey);
  },
};