import { api, buildUrl } from './api/apiClient';
import { ENDPOINTS } from './api/endpoints';

export const addressService = {
  // Get user addresses
  async getAddresses() {
    try {
      const response = await api.get(ENDPOINTS.ADDRESSES.BASE);
      return response.data;
    } catch (error) {
      console.error('Get addresses error:', error);
      throw error;
    }
  },

  // Add new address
  async addAddress(addressData) {
    try {
      const response = await api.post(ENDPOINTS.ADDRESSES.BASE, addressData);
      return response.data;
    } catch (error) {
      console.error('Add address error:', error);
      throw error;
    }
  },

  // Update address
  async updateAddress(addressId, updates) {
    try {
      const response = await api.put(buildUrl(`${ENDPOINTS.ADDRESSES.BASE}/:id`, { id: addressId }), updates);
      return response.data;
    } catch (error) {
      console.error('Update address error:', error);
      throw error;
    }
  },

  // Delete address
  async deleteAddress(addressId) {
    try {
      await api.delete(buildUrl(`${ENDPOINTS.ADDRESSES.BASE}/:id`, { id: addressId }));
      return true;
    } catch (error) {
      console.error('Delete address error:', error);
      throw error;
    }
  },

  // Set default address
  async setDefaultAddress(addressId) {
    try {
      const response = await api.post(buildUrl(`${ENDPOINTS.ADDRESSES.DEFAULT}/:id`, { id: addressId }));
      return response.data;
    } catch (error) {
      console.error('Set default address error:', error);
      throw error;
    }
  },

  // Verify address
  async verifyAddress(addressData) {
    try {
      const response = await api.post(ENDPOINTS.ADDRESSES.VERIFY, addressData);
      return response.data;
    } catch (error) {
      console.error('Verify address error:', error);
      throw error;
    }
  },

  // Get service areas
  async getServiceAreas() {
    try {
      const response = await api.get('/addresses/service-areas');
      return response.data;
    } catch (error) {
      console.error('Get service areas error:', error);
      throw error;
    }
  },

  // Check delivery availability
  async checkDeliveryAvailability(address) {
    try {
      const response = await api.post('/addresses/check-delivery', address);
      return response.data;
    } catch (error) {
      console.error('Check delivery availability error:', error);
      throw error;
    }
  },

  // Get address suggestions
  async getAddressSuggestions(query) {
    try {
      const response = await api.get('/addresses/suggestions', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error('Get address suggestions error:', error);
      throw error;
    }
  },
};