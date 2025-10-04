// API Endpoints configuration
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },

  // Users
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    UPLOAD_AVATAR: '/users/avatar',
    CHANGE_PASSWORD: '/users/change-password',
    PREFERENCES: '/users/preferences',
  },

  // Menu
  MENU: {
    CATEGORIES: '/menu/categories',
    ITEMS: '/menu/items',
    ITEM_DETAILS: '/menu/items',
    SEARCH: '/menu/search',
    RECOMMENDATIONS: '/menu/recommendations',
    CUSTOMIZATIONS: '/menu/customizations',
  },

  // Orders
  ORDERS: {
    BASE: '/orders',
    CREATE: '/orders',
    DETAILS: '/orders',
    HISTORY: '/orders/history',
    CANCEL: '/orders',
    TRACK: '/orders',
    RATE: '/orders',
    REORDER: '/orders/reorder',
    ESTIMATE: '/orders/estimate',
  },

  // Cart
  CART: {
    BASE: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: '/cart/items',
    REMOVE_ITEM: '/cart/items',
    CLEAR: '/cart/clear',
  },

  // Addresses
  ADDRESSES: {
    BASE: '/addresses',
    DEFAULT: '/addresses/default',
    VERIFY: '/addresses/verify',
  },

  // Payments
  PAYMENTS: {
    METHODS: '/payment-methods',
    DEFAULT: '/payment-methods/default',
    SETUP_INTENT: '/payment-methods/setup-intent',
    TRANSACTIONS: '/payment-methods/transactions',
  },

  // Reviews
  REVIEWS: {
    BASE: '/reviews',
    ITEM_REVIEWS: '/reviews/items',
    USER_REVIEWS: '/reviews/users',
    LIKE: '/reviews',
    REPORT: '/reviews/report',
  },

  // Offers & Promotions
  OFFERS: {
    BASE: '/offers',
    ACTIVE: '/offers/active',
    CLAIM: '/offers/claim',
    VALIDATE: '/offers/validate',
    USER_OFFERS: '/offers/user',
  },

  // Tracking
  TRACKING: {
    ORDER: '/tracking/orders',
    DRIVER_LOCATION: '/tracking/drivers',
    ESTIMATE: '/tracking/estimate',
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: '/notifications',
    READ: '/notifications/read',
    SETTINGS: '/notifications/settings',
    UNREAD_COUNT: '/notifications/unread-count',
  },

  // Support
  SUPPORT: {
    CONTACT: '/support/contact',
    FAQ: '/support/faq',
    TICKETS: '/support/tickets',
  },
};

// Helper function to build URL with parameters
export const buildUrl = (endpoint, params = {}) => {
  let url = endpoint;
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, encodeURIComponent(params[key]));
  });
  return url;
};