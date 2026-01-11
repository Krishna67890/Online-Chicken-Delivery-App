import { api } from './api/apiClient';
import { ENDPOINTS, buildUrl } from './api/endpoints';

export const notificationService = {
  // Get user notifications
  async getNotifications(filters = {}) {
    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 20,
        unreadOnly: filters.unreadOnly || false,
        ...filters,
      };

      const response = await api.get(ENDPOINTS.NOTIFICATIONS.BASE, { params });
      return response.data;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const response = await api.post(buildUrl(`${ENDPOINTS.NOTIFICATIONS.READ}/:id`, { id: notificationId }));
      return response.data;
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const response = await api.post(ENDPOINTS.NOTIFICATIONS.READ);
      return response.data;
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error;
    }
  },

  // Get notification settings
  async getNotificationSettings() {
    try {
      const response = await api.get(ENDPOINTS.NOTIFICATIONS.SETTINGS);
      return response.data;
    } catch (error) {
      console.error('Get notification settings error:', error);
      throw error;
    }
  },

  // Update notification settings
  async updateNotificationSettings(settings) {
    try {
      const response = await api.put(ENDPOINTS.NOTIFICATIONS.SETTINGS, settings);
      return response.data;
    } catch (error) {
      console.error('Update notification settings error:', error);
      throw error;
    }
  },

  // Get unread count
  async getUnreadCount() {
    try {
      const response = await api.get(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
      return response.data;
    } catch (error) {
      console.error('Get unread count error:', error);
      throw error;
    }
  },

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      await api.delete(buildUrl(`${ENDPOINTS.NOTIFICATIONS.BASE}/:id`, { id: notificationId }));
      return true;
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  },

  // Subscribe to push notifications
  async subscribeToPushNotifications(subscription) {
    try {
      const response = await api.post('/notifications/push/subscribe', subscription);
      return response.data;
    } catch (error) {
      console.error('Subscribe to push notifications error:', error);
      throw error;
    }
  },

  // Unsubscribe from push notifications
  async unsubscribeFromPushNotifications() {
    try {
      await api.post('/notifications/push/unsubscribe');
      return true;
    } catch (error) {
      console.error('Unsubscribe from push notifications error:', error);
      throw error;
    }
  },
};