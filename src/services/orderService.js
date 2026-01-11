import { api } from './api/apiClient';
import { ENDPOINTS, buildUrl } from './api/endpoints';
import { analyticsService } from './analyticsService';

export const orderService = {
  // Create new order
  async createOrder(orderData) {
    try {
      const response = await api.post(ENDPOINTS.ORDERS.CREATE, orderData);
      const order = response.data;

      // Track order creation
      analyticsService.track('Order Created', {
        orderId: order.id,
        total: order.total,
        itemCount: order.items.length,
        paymentMethod: order.paymentMethod,
      });

      return order;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const response = await api.get(buildUrl(`${ENDPOINTS.ORDERS.DETAILS}/:id`, { id: orderId }));
      return response.data;
    } catch (error) {
      console.error('Get order error:', error);
      throw error;
    }
  },

  // Get user specific orders
  async getUserOrders(userId) {
    try {
      const response = await api.get(ENDPOINTS.ORDERS.HISTORY, { params: { userId } });
      return response.data;
    } catch (error) {
      console.error('Get user orders error:', error);
      return []; // Return empty array on error to prevent crashes
    }
  },

  // Get order history
  async getOrderHistory(filters = {}) {
    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 10,
        status: filters.status,
        sort: filters.sortBy,
        ...filters,
      };

      const response = await api.get(ENDPOINTS.ORDERS.HISTORY, { params });
      return response.data;
    } catch (error) {
      console.error('Get order history error:', error);
      throw error;
    }
  },

  // Cancel order
  async cancelOrder(orderId, reason = '') {
    try {
      const response = await api.post(buildUrl(`${ENDPOINTS.ORDERS.CANCEL}/:id/cancel`, { id: orderId }), { reason });
      
      // Track cancellation
      analyticsService.track('Order Cancelled', {
        orderId,
        reason,
      });

      return response.data;
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  },

  // Rate order
  async rateOrder(orderId, rating, review = '') {
    try {
      const response = await api.post(buildUrl(`${ENDPOINTS.ORDERS.RATE}/:id/rate`, { id: orderId }), {
        rating,
        review,
      });

      // Track rating
      analyticsService.track('Order Rated', {
        orderId,
        rating,
        hasReview: !!review,
      });

      return response.data;
    } catch (error) {
      console.error('Rate order error:', error);
      throw error;
    }
  },

  // Reorder
  async reorder(orderId, modifications = {}) {
    try {
      const response = await api.post(buildUrl(`${ENDPOINTS.ORDERS.REORDER}/:id/reorder`, { id: orderId }), {
        modifications,
      });

      // Track reorder
      analyticsService.track('Order Reordered', {
        originalOrderId: orderId,
        hasModifications: Object.keys(modifications).length > 0,
      });

      return response.data;
    } catch (error) {
      console.error('Reorder error:', error);
      throw error;
    }
  },

  // Get order estimate
  async getOrderEstimate(orderData) {
    try {
      const response = await api.post(ENDPOINTS.ORDERS.ESTIMATE, orderData);
      return response.data;
    } catch (error) {
      console.error('Get order estimate error:', error);
      throw error;
    }
  },

  // Get order events (timeline)
  async getOrderEvents(orderId) {
    try {
      const response = await api.get(buildUrl(`${ENDPOINTS.ORDERS.DETAILS}/:id/events`, { id: orderId }));
      return response.data;
    } catch (error) {
      console.error('Get order events error:', error);
      throw error;
    }
  },

  // Update order status (admin only)
  async updateOrderStatus(orderId, status, notes = '') {
    try {
      const response = await api.patch(buildUrl(`${ENDPOINTS.ORDERS.DETAILS}/:id/status`, { id: orderId }), {
        status,
        notes,
      });
      return response.data;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  },

  // Export order history
  async exportOrderHistory(format = 'csv', filters = {}) {
    try {
      const response = await api.get('/orders/export', {
        params: { format, ...filters },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Export order history error:', error);
      throw error;
    }
  },
};