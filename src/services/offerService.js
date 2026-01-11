// Mock Offer Service
class OfferService {
  /**
   * Get all active offers
   * @returns {Promise<Array>} Array of active offers
   */
  async getAllOffers() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return mock offers data
      const mockOffers = [
        {
          id: 'offer_1',
          title: 'Welcome Discount',
          description: 'Get 20% off on your first order',
          discountPercentage: 20,
          minOrderAmount: 0,
          maxDiscountAmount: 10,
          code: 'WELCOME20',
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          isActive: true,
          terms: 'Valid on first order only',
          category: 'first_order',
          priority: 1
        },
        {
          id: 'offer_2',
          title: 'Free Delivery',
          description: 'Free delivery on orders above $30',
          discountPercentage: 0, // Free delivery, not percentage
          minOrderAmount: 30,
          maxDiscountAmount: 5, // Max delivery cost covered
          code: 'FREESHIP30',
          expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
          isActive: true,
          terms: 'Minimum order $30',
          category: 'delivery',
          priority: 2
        },
        {
          id: 'offer_3',
          title: 'Family Deal',
          description: 'Buy 2 get 1 free on combo meals',
          discountPercentage: 33, // Approximately 1/3 off
          minOrderAmount: 25,
          maxDiscountAmount: 15,
          code: 'BUY2GET1',
          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          isActive: true,
          terms: 'Applies to combo meals only',
          category: 'combo',
          priority: 3
        },
        {
          id: 'offer_4',
          title: 'Weekend Special',
          description: 'Extra 15% off on weekends',
          discountPercentage: 15,
          minOrderAmount: 15,
          maxDiscountAmount: 12,
          code: 'WKND15',
          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          isActive: false, // Weekend special might be conditional
          terms: 'Valid Friday-Sunday',
          category: 'weekend',
          priority: 4
        }
      ];

      return mockOffers.filter(offer => offer.isActive);
    } catch (error) {
      console.error('Error in mock getAllOffers:', error);
      throw error;
    }
  }

  /**
   * Get all active offers
   * @returns {Promise<Array>} Array of active offers
   */
  async getActiveOffers() {
    try {
      return await this.getAllOffers();
    } catch (error) {
      console.error('Error in mock getActiveOffers:', error);
      throw error;
    }
  }

  /**
   * Get a specific offer by ID
   * @param {string} offerId - The offer ID
   * @returns {Promise<Object>} The offer object
   */
  async getOfferById(offerId) {
    try {
      const offers = await this.getAllOffers();
      return offers.find(offer => offer.id === offerId);
    } catch (error) {
      console.error('Error in mock getOfferById:', error);
      throw error;
    }
  }

  /**
   * Validate an offer code
   * @param {string} code - The offer code to validate
   * @param {number} orderTotal - The current order total
   * @returns {Promise<Object>} Validation result with offer details
   */
  async validateOfferCode(code, orderTotal = 0) {
    try {
      const offers = await this.getAllOffers();
      const offer = offers.find(offer => 
        offer.code.toUpperCase() === code.toUpperCase() && 
        offer.isActive &&
        new Date(offer.expiryDate) > new Date()
      );

      if (!offer) {
        throw new Error('Invalid or expired offer code');
      }

      if (orderTotal < offer.minOrderAmount) {
        throw new Error(`Minimum order amount of $${offer.minOrderAmount} required for this offer`);
      }

      // Calculate actual discount
      let discountAmount = 0;
      if (offer.discountPercentage > 0) {
        discountAmount = Math.min(
          (orderTotal * offer.discountPercentage) / 100,
          offer.maxDiscountAmount
        );
      } else {
        // For free delivery offers
        discountAmount = Math.min(offer.maxDiscountAmount, orderTotal);
      }

      return {
        isValid: true,
        offer,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        finalAmount: parseFloat((orderTotal - discountAmount).toFixed(2))
      };
    } catch (error) {
      console.error('Error in mock validateOfferCode:', error);
      return {
        isValid: false,
        error: error.message || 'Invalid offer code'
      };
    }
  }

  /**
   * Apply an offer to an order
   * @param {string} code - The offer code
   * @param {Object} order - The order object
   * @returns {Promise<Object>} Updated order with applied discount
   */
  async applyOfferToOrder(code, order) {
    try {
      const validationResult = await this.validateOfferCode(code, order.total || 0);
      
      if (!validationResult.isValid) {
        throw new Error(validationResult.error);
      }

      const updatedOrder = {
        ...order,
        offerApplied: validationResult.offer,
        discountAmount: validationResult.discountAmount,
        total: validationResult.finalAmount
      };

      return updatedOrder;
    } catch (error) {
      console.error('Error in mock applyOfferToOrder:', error);
      throw error;
    }
  }

  /**
   * Get offers by category
   * @param {string} category - The category to filter by
   * @returns {Promise<Array>} Array of offers in the category
   */
  async getOffersByCategory(category) {
    try {
      const offers = await this.getAllOffers();
      return offers.filter(offer => 
        offer.category.toLowerCase() === category.toLowerCase() && 
        offer.isActive
      );
    } catch (error) {
      console.error('Error in mock getOffersByCategory:', error);
      throw error;
    }
  }

  /**
   * Get featured offers (high priority active offers)
   * @returns {Promise<Array>} Array of featured offers
   */
  async getFeaturedOffers() {
    try {
      const offers = await this.getAllOffers();
      return offers
        .filter(offer => offer.isActive && offer.priority <= 3)
        .sort((a, b) => a.priority - b.priority);
    } catch (error) {
      console.error('Error in mock getFeaturedOffers:', error);
      throw error;
    }
  }

  /**
   * Check if an offer is applicable to an order
   * @param {Object} offer - The offer object
   * @param {number} orderTotal - The current order total
   * @param {Array} items - Array of items in the order
   * @returns {Promise<boolean>} Whether the offer is applicable
   */
  async isOfferApplicable(offer, orderTotal, items = []) {
    try {
      if (!offer.isActive || new Date(offer.expiryDate) <= new Date()) {
        return false;
      }

      if (orderTotal < offer.minOrderAmount) {
        return false;
      }

      // Additional checks could be added here based on offer category
      if (offer.category === 'combo' && !items.some(item => item.isCombo)) {
        return false; // Offer applies only to combo items
      }

      return true;
    } catch (error) {
      console.error('Error in mock isOfferApplicable:', error);
      return false;
    }
  }
}

export const offerService = new OfferService();
export default offerService;