import { api } from './api/apiClient';
import { ENDPOINTS, buildUrl } from './api/endpoints';
import { analyticsService } from './analyticsService';

export const paymentService = {
  // Get payment methods
  async getPaymentMethods() {
    try {
      const response = await api.get(ENDPOINTS.PAYMENTS.METHODS);
      return response.data;
    } catch (error) {
      console.error('Get payment methods error:', error);
      throw error;
    }
  },

  // Add payment method
  async addPaymentMethod(paymentData) {
    try {
      const response = await api.post(ENDPOINTS.PAYMENTS.METHODS, paymentData);
      
      // Track payment method addition
      analyticsService.track('Payment Method Added', {
        type: paymentData.type,
        isDefault: paymentData.isDefault || false,
      });

      return response.data;
    } catch (error) {
      console.error('Add payment method error:', error);
      throw error;
    }
  },

  // Update payment method
  async updatePaymentMethod(methodId, updates) {
    try {
      const response = await api.put(buildUrl(`${ENDPOINTS.PAYMENTS.METHODS}/:id`, { id: methodId }), updates);
      return response.data;
    } catch (error) {
      console.error('Update payment method error:', error);
      throw error;
    }
  },

  // Delete payment method
  async deletePaymentMethod(methodId) {
    try {
      await api.delete(buildUrl(`${ENDPOINTS.PAYMENTS.METHODS}/:id`, { id: methodId }));
      
      // Track payment method deletion
      analyticsService.track('Payment Method Deleted', {
        methodId,
      });

      return true;
    } catch (error) {
      console.error('Delete payment method error:', error);
      throw error;
    }
  },

  // Set default payment method
  async setDefaultPaymentMethod(methodId) {
    try {
      const response = await api.post(buildUrl(`${ENDPOINTS.PAYMENTS.DEFAULT}/:id`, { id: methodId }));
      return response.data;
    } catch (error) {
      console.error('Set default payment method error:', error);
      throw error;
    }
  },

  // Create setup intent for adding payment methods
  async createSetupIntent() {
    try {
      const response = await api.post(ENDPOINTS.PAYMENTS.SETUP_INTENT);
      return response.data;
    } catch (error) {
      console.error('Create setup intent error:', error);
      throw error;
    }
  },

  // Process payment
  async processPayment(orderId, paymentMethodId, saveMethod = false) {
    try {
      const response = await api.post('/payments/process', {
        orderId,
        paymentMethodId,
        saveMethod,
      });

      // Track payment
      analyticsService.track('Payment Processed', {
        orderId,
        paymentMethodId,
        amount: response.data.amount,
        success: response.data.status === 'succeeded',
      });

      return response.data;
    } catch (error) {
      console.error('Process payment error:', error);
      throw error;
    }
  },

  // Process cart payment
  async processCartPayment(cartItems, paymentMethodId, saveMethod = false) {
    try {
      // Calculate total from cart items
      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Create order data from cart
      const orderData = {
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        })),
        total,
        paymentMethodId,
        saveMethod,
      };

      const response = await api.post('/payments/process-cart', orderData);

      // Track payment
      analyticsService.track('Cart Payment Processed', {
        total,
        itemCount: cartItems.length,
        paymentMethodId,
        success: response.data.status === 'succeeded',
      });

      return response.data;
    } catch (error) {
      console.error('Process cart payment error:', error);
      throw error;
    }
  },

  // Get transaction history
  async getTransactionHistory(filters = {}) {
    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 10,
        ...filters,
      };

      const response = await api.get(ENDPOINTS.PAYMENTS.TRANSACTIONS, { params });
      return response.data;
    } catch (error) {
      console.error('Get transaction history error:', error);
      throw error;
    }
  },

  // Refund payment
  async refundPayment(paymentIntentId, amount = null) {
    try {
      const response = await api.post('/payments/refund', {
        paymentIntentId,
        amount,
      });

      // Track refund
      analyticsService.track('Payment Refunded', {
        paymentIntentId,
        amount: response.data.amount_refunded,
      });

      return response.data;
    } catch (error) {
      console.error('Refund payment error:', error);
      throw error;
    }
  },
};