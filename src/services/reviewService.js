import { api, buildUrl } from './api/apiClient';
import { ENDPOINTS } from './api/endpoints';
import { analyticsService } from './analyticsService';

export const reviewService = {
  // Get reviews for an item
  async getItemReviews(itemId, filters = {}) {
    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 10,
        sort: filters.sortBy,
        rating: filters.rating,
        ...filters,
      };

      const response = await api.get(buildUrl(`${ENDPOINTS.REVIEWS.ITEM_REVIEWS}/:id`, { id: itemId }), { params });
      return response.data;
    } catch (error) {
      console.error('Get item reviews error:', error);
      throw error;
    }
  },

  // Get user's reviews
  async getUserReviews(filters = {}) {
    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 10,
        ...filters,
      };

      const response = await api.get(ENDPOINTS.REVIEWS.USER_REVIEWS, { params });
      return response.data;
    } catch (error) {
      console.error('Get user reviews error:', error);
      throw error;
    }
  },

  // Submit review
  async submitReview(reviewData) {
    try {
      const response = await api.post(ENDPOINTS.REVIEWS.BASE, reviewData);
      
      // Track review submission
      analyticsService.track('Review Submitted', {
        itemId: reviewData.itemId,
        rating: reviewData.rating,
        hasPhotos: !!(reviewData.photos && reviewData.photos.length > 0),
        hasComment: !!reviewData.comment,
      });

      return response.data;
    } catch (error) {
      console.error('Submit review error:', error);
      throw error;
    }
  },

  // Update review
  async updateReview(reviewId, updates) {
    try {
      const response = await api.put(buildUrl(`${ENDPOINTS.REVIEWS.BASE}/:id`, { id: reviewId }), updates);
      return response.data;
    } catch (error) {
      console.error('Update review error:', error);
      throw error;
    }
  },

  // Delete review
  async deleteReview(reviewId) {
    try {
      await api.delete(buildUrl(`${ENDPOINTS.REVIEWS.BASE}/:id`, { id: reviewId }));
      
      // Track review deletion
      analyticsService.track('Review Deleted', {
        reviewId,
      });

      return true;
    } catch (error) {
      console.error('Delete review error:', error);
      throw error;
    }
  },

  // Like review
  async likeReview(reviewId) {
    try {
      const response = await api.post(buildUrl(`${ENDPOINTS.REVIEWS.LIKE}/:id/like`, { id: reviewId }));
      return response.data;
    } catch (error) {
      console.error('Like review error:', error);
      throw error;
    }
  },

  // Report review
  async reportReview(reviewId, reason) {
    try {
      const response = await api.post(buildUrl(`${ENDPOINTS.REVIEWS.REPORT}/:id/report`, { id: reviewId }), { reason });
      
      // Track review report
      analyticsService.track('Review Reported', {
        reviewId,
        reason,
      });

      return response.data;
    } catch (error) {
      console.error('Report review error:', error);
      throw error;
    }
  },

  // Get review statistics
  async getReviewStats(itemId) {
    try {
      const response = await api.get(buildUrl(`${ENDPOINTS.REVIEWS.ITEM_REVIEWS}/:id/stats`, { id: itemId }));
      return response.data;
    } catch (error) {
      console.error('Get review stats error:', error);
      throw error;
    }
  },

  // Upload review photos
  async uploadReviewPhotos(reviewId, files, onProgress = null) {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('photos', file);
      });

      const response = await api.upload(
        buildUrl(`${ENDPOINTS.REVIEWS.BASE}/:id/photos`, { id: reviewId }),
        formData,
        onProgress
      );

      return response.data;
    } catch (error) {
      console.error('Upload review photos error:', error);
      throw error;
    }
  },
};