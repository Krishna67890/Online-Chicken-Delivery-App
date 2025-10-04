// Main services export file
export { authService } from './authService';
export { userService } from './userService';
export { menuService } from './menuService';
export { orderService } from './orderService';
export { paymentService } from './paymentService';
export { addressService } from './addressService';
export { reviewService } from './reviewService';
export { offerService } from './offerService';
export { trackingService } from './trackingService';
export { notificationService } from './notificationService';
export { analyticsService } from './analyticsService';
export { storageService } from './storageService';

// API exports
export { api, createCancelToken } from './api/apiClient';
export { ENDPOINTS, buildUrl } from './api/endpoints';

// Service initialization
export const initServices = () => {
  // Initialize analytics
  analyticsService.init();
  
  // Check storage availability
  if (!storageService.isAvailable()) {
    console.warn('Local storage is not available. Some features may not work properly.');
  }

  console.log('🚀 Services initialized successfully');
};