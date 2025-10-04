import { api, buildUrl } from './api/apiClient';
import { ENDPOINTS } from './api/endpoints';

export const trackingService = {
  // Get order tracking data
  async getTrackingData(orderId) {
    try {
      const response = await api.get(buildUrl(`${ENDPOINTS.TRACKING.ORDER}/:id`, { id: orderId }));
      return response.data;
    } catch (error) {
      console.error('Get tracking data error:', error);
      throw error;
    }
  },

  // Get driver location
  async getDriverLocation(driverId) {
    try {
      const response = await api.get(buildUrl(`${ENDPOINTS.TRACKING.DRIVER_LOCATION}/:id`, { id: driverId }));
      return response.data;
    } catch (error) {
      console.error('Get driver location error:', error);
      throw error;
    }
  },

  // Get delivery estimate
  async getDeliveryEstimate(orderId) {
    try {
      const response = await api.get(buildUrl(`${ENDPOINTS.TRACKING.ESTIMATE}/:id`, { id: orderId }));
      return response.data;
    } catch (error) {
      console.error('Get delivery estimate error:', error);
      throw error;
    }
  },

  // Subscribe to order updates (WebSocket)
  subscribeToOrderUpdates(orderId, callback) {
    // This would typically connect to a WebSocket or use Server-Sent Events
    // For now, we'll simulate with setInterval
    const interval = setInterval(async () => {
      try {
        const trackingData = await this.getTrackingData(orderId);
        callback(trackingData);
      } catch (error) {
        console.error('Order update subscription error:', error);
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  },

  // Get order timeline
  async getOrderTimeline(orderId) {
    try {
      const response = await api.get(buildUrl(`${ENDPOINTS.TRACKING.ORDER}/:id/timeline`, { id: orderId }));
      return response.data;
    } catch (error) {
      console.error('Get order timeline error:', error);
      throw error;
    }
  },

  // Report delivery issue
  async reportDeliveryIssue(orderId, issue, description) {
    try {
      const response = await api.post(buildUrl(`${ENDPOINTS.TRACKING.ORDER}/:id/report-issue`, { id: orderId }), {
        issue,
        description,
      });
      return response.data;
    } catch (error) {
      console.error('Report delivery issue error:', error);
      throw error;
    }
  },

  // Get delivery proof (photo/signature)
  async getDeliveryProof(orderId) {
    try {
      const response = await api.get(buildUrl(`${ENDPOINTS.TRACKING.ORDER}/:id/proof`, { id: orderId }));
      return response.data;
    } catch (error) {
      console.error('Get delivery proof error:', error);
      throw error;
    }
  },
};