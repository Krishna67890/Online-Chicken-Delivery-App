// src/utils/constants.js

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://api.chickendelivery.com/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'ChickenExpress',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@chickendelivery.com',
  SUPPORT_PHONE: '+1-800-CHICKEN',
};

// Order Status Constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH_ON_DELIVERY: 'cash_on_delivery',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  DIGITAL_WALLET: 'digital_wallet',
  ONLINE_PAYMENT: 'online_payment',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Delivery Types
export const DELIVERY_TYPES = {
  STANDARD: 'standard',
  EXPRESS: 'express',
  SCHEDULED: 'scheduled',
};

// Delivery Fees
export const DELIVERY_FEES = {
  STANDARD: 2.99,
  EXPRESS: 4.99,
  FREE_DELIVERY_THRESHOLD: 25.00,
};

// Time Slots for Scheduled Delivery
export const DELIVERY_TIME_SLOTS = [
  '10:00 AM - 12:00 PM',
  '12:00 PM - 02:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
  '06:00 PM - 08:00 PM',
  '08:00 PM - 10:00 PM',
];

// Chicken Categories
export const CHICKEN_CATEGORIES = {
  FRIED_CHICKEN: 'fried_chicken',
  GRILLED_CHICKEN: 'grilled_chicken',
  ROASTED_CHICKEN: 'roasted_chicken',
  CHICKEN_WINGS: 'chicken_wings',
  CHICKEN_BURGERS: 'chicken_burgers',
  CHICKEN_SANDWICHES: 'chicken_sandwiches',
  CHICKEN_RICE_BOWLS: 'chicken_rice_bowls',
  SIDES: 'sides',
  BEVERAGES: 'beverages',
  DESSERTS: 'desserts',
};

// Spice Levels
export const SPICE_LEVELS = {
  MILD: 'mild',
  MEDIUM: 'medium',
  HOT: 'hot',
  EXTRA_HOT: 'extra_hot',
};

// Portion Sizes
export const PORTION_SIZES = {
  SINGLE: 'single',
  COMBO: 'combo',
  FAMILY: 'family',
  PARTY: 'party',
};

// Cooking Preferences
export const COOKING_PREFERENCES = {
  WELL_DONE: 'well_done',
  MEDIUM: 'medium',
  JUICY: 'juicy',
  CRISPY: 'crispy',
};

// Special Instructions
export const SPECIAL_INSTRUCTS = {
  EXTRA_SAUCE: 'extra_sauce',
  NO_SAUCE: 'no_sauce',
  EXTRA_SPICY: 'extra_spicy',
  LESS_SPICY: 'less_spicy',
  NO_SALT: 'no_salt',
  EXTRA_CRISPY: 'extra_crispy',
};

// Order Limits
export const ORDER_LIMITS = {
  MIN_ORDER_AMOUNT: 10.00,
  MAX_ORDER_AMOUNT: 200.00,
  MAX_QUANTITY_PER_ITEM: 10,
};

// Delivery Areas
export const DELIVERY_AREAS = {
  LOCAL: 'local',
  CITY_WIDE: 'city_wide',
  SUBURBS: 'suburbs',
};

// Operating Hours
export const OPERATING_HOURS = {
  OPEN: '09:00',
  CLOSE: '23:00',
  PRE_ORDER_START: '06:00',
};

// Promo Code Types
export const PROMO_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED_AMOUNT: 'fixed_amount',
  FREE_DELIVERY: 'free_delivery',
};

// Loyalty Program
export const LOYALTY_CONFIG = {
  POINTS_PER_DOLLAR: 10,
  MIN_POINTS_REDEEM: 1000,
  POINTS_VALUE: 0.01, // $0.01 per point
};

// Notification Types
export const NOTIFICATION_TYPES = {
  ORDER_CONFIRMATION: 'order_confirmation',
  ORDER_STATUS_UPDATE: 'order_status_update',
  DELIVERY_UPDATE: 'delivery_update',
  PROMOTIONAL: 'promotional',
  ORDER_REMINDER: 'order_reminder',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  ORDER_FAILED: 'Failed to place order. Please try again.',
  PAYMENT_FAILED: 'Payment failed. Please try another method.',
  DELIVERY_UNAVAILABLE: 'Delivery not available in your area.',
  ITEM_UNAVAILABLE: 'Sorry, this item is currently unavailable.',
  MIN_ORDER_NOT_MET: `Minimum order amount is $${ORDER_LIMITS.MIN_ORDER_AMOUNT}`,
  MAX_ORDER_EXCEEDED: `Maximum order amount is $${ORDER_LIMITS.MAX_ORDER_AMOUNT}`,
};

// Success Messages
export const SUCCESS_MESSAGES = {
  ORDER_PLACED: 'Order placed successfully!',
  PAYMENT_SUCCESS: 'Payment processed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  ADDRESS_ADDED: 'Address added successfully!',
  CART_UPDATED: 'Cart updated successfully!',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'chicken_app_token',
  USER_DATA: 'chicken_app_user',
  CART_ITEMS: 'chicken_app_cart',
  RECENT_ORDERS: 'chicken_app_recent_orders',
  FAVORITE_ITEMS: 'chicken_app_favorites',
  DELIVERY_ADDRESS: 'chicken_app_address',
};

// App Routes
export const ROUTES = {
  HOME: '/',
  MENU: '/menu',
  CATEGORY: '/category/:categoryId',
  ITEM_DETAILS: '/item/:itemId',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_TRACKING: '/tracking/:orderId',
  ORDER_HISTORY: '/orders',
  PROFILE: '/profile',
  ADDRESSES: '/addresses',
  FAVORITES: '/favorites',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about',
  CONTACT: '/contact',
  TERMS: '/terms',
  PRIVACY: '/privacy',
};

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/chickendelivery',
  INSTAGRAM: 'https://instagram.com/chickendelivery',
  TWITTER: 'https://twitter.com/chickendelivery',
};

// Rating Constants
export const RATING_CONFIG = {
  MIN_RATING: 1,
  MAX_RATING: 5,
  RATING_STEPS: 0.5,
};

// Currency Configuration
export const CURRENCY = {
  SYMBOL: '$',
  CODE: 'USD',
  DECIMAL_PLACES: 2,
};

// Date & Time Formats
export const DATE_FORMATS = {
  DISPLAY_DATE: 'MMM DD, YYYY',
  DISPLAY_TIME: 'hh:mm A',
  DISPLAY_DATETIME: 'MMM DD, YYYY hh:mm A',
  ORDER_DATE: 'YYYY-MM-DD',
  ORDER_TIME: 'HH:mm',
};

// App Features Flags
export const FEATURE_FLAGS = {
  ENABLE_LOYALTY_PROGRAM: true,
  ENABLE_PRE_ORDERS: true,
  ENABLE_SCHEDULED_DELIVERY: true,
  ENABLE_GIFT_ORDERS: false,
  ENABLE_SUBSCRIPTIONS: false,
};

// Default Values
export const DEFAULTS = {
  DELIVERY_TYPE: DELIVERY_TYPES.STANDARD,
  SPICE_LEVEL: SPICE_LEVELS.MEDIUM,
  PORTION_SIZE: PORTION_SIZES.SINGLE,
  COOKING_PREFERENCE: COOKING_PREFERENCES.MEDIUM,
};

// Export all constants as a single object (optional)
export default {
  API_CONFIG,
  APP_CONFIG,
  ORDER_STATUS,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  DELIVERY_TYPES,
  DELIVERY_FEES,
  DELIVERY_TIME_SLOTS,
  CHICKEN_CATEGORIES,
  SPICE_LEVELS,
  PORTION_SIZES,
  COOKING_PREFERENCES,
  SPECIAL_INSTRUCTS,
  ORDER_LIMITS,
  DELIVERY_AREAS,
  OPERATING_HOURS,
  PROMO_TYPES,
  LOYALTY_CONFIG,
  NOTIFICATION_TYPES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  ROUTES,
  SOCIAL_LINKS,
  RATING_CONFIG,
  CURRENCY,
  DATE_FORMATS,
  FEATURE_FLAGS,
  DEFAULTS,
};