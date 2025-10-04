import { api, buildUrl } from './api/apiClient';
import { ENDPOINTS } from './api/endpoints';
import { analyticsService } from './analyticsService';

export const offerService = {
  // Get all active offers
  async getActiveOffers(filters = {}) {
    try {
      const params = {
        category: filters.category,
        type: filters.type,
        ...filters,
      };

      const response = await api.get(ENDPOINTS.OFFERS.ACTIVE, { params });
      return response.data;
    } catch (error) {
      console.error('Get active offers error:', error);
      throw error;
    }
  },

  // Get user's claimed offers
  async getUserOffers() {
    try {
      const response = await api.get(ENDPOINTS.OFFERS.USER_OFFERS);
      return response.data;
    } catch (error) {
      console.error('Get user offers error:', error);
      throw error;
    }
  },

  // Claim offer
  async claimOffer(offerId) {
    try {
      const response = await api.post(buildUrl(`${ENDPOINTS.OFFERS.CLAIM}/:id/claim`, { id: offerId }));
      
      // Track offer claim
      analyticsService.track('Offer Claimed', {
        offerId,
        offerType: response.data.type,
        discountValue: response.data.discountValue,
      });

      return response.data;
    } catch (error) {
      console.error('Claim offer error:', error);
      throw error;
    }
  },

  // Validate promo code
  async validatePromoCode(code, orderTotal = 0) {
    try {
      const response = await api.post(ENDPOINTS.OFFERS.VALIDATE, {
        code,
        orderTotal,
      });
      return response.data;
    } catch (error) {
      console.error('Validate promo code error:', error);
      throw error;
    }
  },

  // Get offer details
  async getOfferDetails(offerId) {
    try {
      const response = await api.get(buildUrl(`${ENDPOINTS.OFFERS.BASE}/:id`, { id: offerId }));
      return response.data;
    } catch (error) {
      console.error('Get offer details error:', error);
      throw error;
    }
  },

  // Get popular offers
  async getPopularOffers(limit = 5) {
    try {
      const response = await api.get('/offers/popular', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Get popular offers error:', error);
      throw error;
    }
  },

  // Check offer eligibility
  async checkOfferEligibility(offerId) {
    try {
      const response = await api.get(buildUrl(`${ENDPOINTS.OFFERS.BASE}/:id/eligibility`, { id: offerId }));
      return response.data;
    } catch (error) {
      console.error('Check offer eligibility error:', error);
      throw error;
    }
  },

  // Get flash deals
  async getFlashDeals() {
    try {
      const response = await api.get('/offers/flash-deals');
      return response.data;
    } catch (error) {
      console.error('Get flash deals error:', error);
      throw error;
    }
  },

  // Apply offer to cart
  async applyOfferToCart(offerId, cartItems) {
    try {
      const response = await api.post(buildUrl(`${ENDPOINTS.OFFERS.BASE}/:id/apply`, { id: offerId }), {
        cartItems,
      });
      return response.data;
    } catch (error) {
      console.error('Apply offer to cart error:', error);
      throw error;
    }
  },
};