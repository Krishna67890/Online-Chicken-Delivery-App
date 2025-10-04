// src/utils/helpers.js

import { 
  ORDER_STATUS, 
  PAYMENT_METHODS, 
  DELIVERY_TYPES, 
  ORDER_LIMITS,
  DELIVERY_FEES,
  STORAGE_KEYS,
  CHICKEN_CATEGORIES,
  SPICE_LEVELS,
  CURRENCY
} from './constants';

/**
 * Cart and Order Helpers
 */
export const cartHelpers = {
  /**
   * Calculate cart total
   */
  calculateCartTotal: (items) => {
    if (!items || !items.length) return 0;
    
    return items.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      return total + itemTotal;
    }, 0);
  },

  /**
   * Calculate item total with modifications
   */
  calculateItemTotal: (item) => {
    let basePrice = item.price || 0;
    
    // Add extra charges for modifications
    if (item.modifications && item.modifications.extras) {
      item.modifications.extras.forEach(extra => {
        basePrice += extra.price || 0;
      });
    }
    
    return basePrice * (item.quantity || 1);
  },

  /**
   * Check if cart meets minimum order amount
   */
  meetsMinimumOrder: (cartTotal) => {
    return cartTotal >= ORDER_LIMITS.MIN_ORDER_AMOUNT;
  },

  /**
   * Check if cart exceeds maximum order amount
   */
  exceedsMaximumOrder: (cartTotal) => {
    return cartTotal > ORDER_LIMITS.MAX_ORDER_AMOUNT;
  },

  /**
   * Get delivery fee based on cart total and delivery type
   */
  calculateDeliveryFee: (cartTotal, deliveryType = DELIVERY_TYPES.STANDARD) => {
    if (cartTotal >= DELIVERY_FEES.FREE_DELIVERY_THRESHOLD) {
      return 0;
    }
    
    return DELIVERY_FEES[deliveryType.toUpperCase()] || DELIVERY_FEES.STANDARD;
  },

  /**
   * Calculate tax amount (simplified)
   */
  calculateTax: (subtotal, taxRate = 0.08) => {
    return subtotal * taxRate;
  },

  /**
   * Apply promo code discount
   */
  applyPromoCode: (subtotal, promoCode) => {
    if (!promoCode || !promoCode.isValid) return 0;
    
    let discount = 0;
    
    switch (promoCode.type) {
      case 'percentage':
        discount = subtotal * (promoCode.value / 100);
        break;
      case 'fixed_amount':
        discount = Math.min(promoCode.value, subtotal);
        break;
      case 'free_delivery':
        // Handled separately in delivery fee calculation
        break;
      default:
        break;
    }
    
    return discount;
  },

  /**
   * Validate cart items availability
   */
  validateCartItems: (cartItems, availableItems) => {
    const errors = [];
    const validatedItems = [];
    
    cartItems.forEach(item => {
      const availableItem = availableItems.find(avail => avail.id === item.id);
      
      if (!availableItem) {
        errors.push(`${item.name} is no longer available`);
        return;
      }
      
      if (!availableItem.inStock) {
        errors.push(`${item.name} is currently out of stock`);
        return;
      }
      
      if (item.quantity > availableItem.maxQuantity) {
        errors.push(`Maximum ${availableItem.maxQuantity} ${item.name} allowed per order`);
        return;
      }
      
      validatedItems.push({
        ...item,
        currentPrice: availableItem.price,
        inStock: availableItem.inStock
      });
    });
    
    return {
      isValid: errors.length === 0,
      validatedItems,
      errors
    };
  }
};

/**
 * Order Validation Helpers
 */
export const orderHelpers = {
  /**
   * Validate order before submission
   */
  validateOrder: (orderData) => {
    const errors = {};
    
    if (!orderData.items || !orderData.items.length) {
      errors.items = 'Cart is empty';
    }
    
    if (!orderData.deliveryAddress || !orderData.deliveryAddress.street) {
      errors.address = 'Delivery address is required';
    }
    
    if (!orderData.customerPhone) {
      errors.phone = 'Phone number is required';
    }
    
    if (orderData.paymentMethod === PAYMENT_METHODS.CREDIT_CARD && !orderData.paymentDetails) {
      errors.payment = 'Payment details are required';
    }
    
    const cartTotal = cartHelpers.calculateCartTotal(orderData.items);
    if (!cartHelpers.meetsMinimumOrder(cartTotal)) {
      errors.total = `Minimum order amount is ${CURRENCY.SYMBOL}${ORDER_LIMITS.MIN_ORDER_AMOUNT}`;
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Check if order can be cancelled
   */
  canCancelOrder: (orderStatus) => {
    const nonCancellableStatuses = [
      ORDER_STATUS.OUT_FOR_DELIVERY,
      ORDER_STATUS.DELIVERED,
      ORDER_STATUS.CANCELLED
    ];
    
    return !nonCancellableStatuses.includes(orderStatus);
  },

  /**
   * Estimate preparation time based on items
   */
  estimatePreparationTime: (items) => {
    const baseTime = 15; // minutes
    const itemTime = items.reduce((time, item) => {
      return time + (item.preparationTime || 5) * item.quantity;
    }, 0);
    
    return Math.min(baseTime + itemTime, 60); // Cap at 60 minutes
  },

  /**
   * Generate order tracking number
   */
  generateTrackingNumber: () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `CHK${timestamp}${random}`.toUpperCase();
  }
};

/**
 * User and Authentication Helpers
 */
export const userHelpers = {
  /**
   * Validate email format
   */
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone number
   */
  validatePhone: (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      
      return !!(token && userData);
    } catch (error) {
      return false;
    }
  },

  /**
   * Get user data from storage
   */
  getUserData: () => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  },

  /**
   * Save user data to storage
   */
  saveUserData: (userData, token) => {
    try {
      if (userData) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      }
      if (token) {
        localStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
      }
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  },

  /**
   * Clear user data from storage
   */
  clearUserData: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);
      return true;
    } catch (error) {
      console.error('Error clearing user data:', error);
      return false;
    }
  },

  /**
   * Check if user has saved addresses
   */
  hasSavedAddresses: () => {
    try {
      const userData = userHelpers.getUserData();
      return !!(userData && userData.addresses && userData.addresses.length > 0);
    } catch (error) {
      return false;
    }
  }
};

/**
 * Location and Delivery Helpers
 */
export const locationHelpers = {
  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceKm = R * c;
    const distanceMiles = distanceKm * 0.621371;
    
    return distanceMiles;
  },

  /**
   * Check if delivery is available to address
   */
  isDeliveryAvailable: (userAddress, restaurantLocation, maxDeliveryDistance = 10) => {
    const distance = locationHelpers.calculateDistance(
      userAddress.latitude,
      userAddress.longitude,
      restaurantLocation.latitude,
      restaurantLocation.longitude
    );
    
    return distance <= maxDeliveryDistance;
  },

  /**
   * Estimate delivery time based on distance and order size
   */
  estimateDeliveryTime: (distance, orderSize, trafficConditions = 'normal') => {
    const baseTime = 15; // minutes
    const distanceTime = distance * 3; // 3 minutes per mile
    const orderTime = orderSize > 5 ? 10 : 5; // Additional time for large orders
    
    let trafficMultiplier = 1;
    if (trafficConditions === 'heavy') trafficMultiplier = 1.5;
    if (trafficConditions === 'light') trafficMultiplier = 0.8;
    
    return Math.round((baseTime + distanceTime + orderTime) * trafficMultiplier);
  }
};

/**
 * Menu and Product Helpers
 */
export const menuHelpers = {
  /**
   * Filter menu items by category
   */
  filterByCategory: (items, category) => {
    if (!category || category === 'all') return items;
    return items.filter(item => item.category === category);
  },

  /**
   * Search menu items by name or description
   */
  searchItems: (items, searchTerm) => {
    if (!searchTerm) return items;
    
    const term = searchTerm.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.tags.some(tag => tag.toLowerCase().includes(term))
    );
  },

  /**
   * Sort menu items by various criteria
   */
  sortItems: (items, sortBy) => {
    const sortedItems = [...items];
    
    switch (sortBy) {
      case 'price_low_high':
        return sortedItems.sort((a, b) => a.price - b.price);
      
      case 'price_high_low':
        return sortedItems.sort((a, b) => b.price - a.price);
      
      case 'name':
        return sortedItems.sort((a, b) => a.name.localeCompare(b.name));
      
      case 'popularity':
        return sortedItems.sort((a, b) => b.popularity - a.popularity);
      
      case 'spice_level':
        const spiceOrder = { 'mild': 1, 'medium': 2, 'hot': 3, 'extra_hot': 4 };
        return sortedItems.sort((a, b) => spiceOrder[a.spiceLevel] - spiceOrder[b.spiceLevel]);
      
      default:
        return sortedItems;
    }
  },

  /**
   * Check if item is customizable
   */
  isCustomizable: (item) => {
    return item.allowModifications && (
      item.spiceOptions ||
      item.portionSizes ||
      item.extraToppings ||
      item.specialInstructions
    );
  },

  /**
   * Get recommended items based on user preferences
   */
  getRecommendedItems: (allItems, userPreferences = {}) => {
    let recommendations = [...allItems];
    
    // Filter by preferred spice level
    if (userPreferences.preferredSpiceLevel) {
      recommendations = recommendations.filter(
        item => item.spiceLevel === userPreferences.preferredSpiceLevel
      );
    }
    
    // Sort by popularity and user preferences
    recommendations = recommendations.sort((a, b) => {
      let scoreA = a.popularity || 0;
      let scoreB = b.popularity || 0;
      
      // Boost score for previously ordered items
      if (userPreferences.previouslyOrdered?.includes(a.id)) {
        scoreA += 10;
      }
      if (userPreferences.previouslyOrdered?.includes(b.id)) {
        scoreB += 10;
      }
      
      return scoreB - scoreA;
    });
    
    return recommendations.slice(0, 6); // Return top 6 recommendations
  }
};

/**
 * Local Storage Helpers
 */
export const storageHelpers = {
  /**
   * Save cart items to local storage
   */
  saveCart: (cartItems) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(cartItems));
      return true;
    } catch (error) {
      console.error('Error saving cart:', error);
      return false;
    }
  },

  /**
   * Load cart items from local storage
   */
  loadCart: () => {
    try {
      const cartData = localStorage.getItem(STORAGE_KEYS.CART_ITEMS);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  },

  /**
   * Save recent orders
   */
  saveRecentOrders: (orders) => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECENT_ORDERS, JSON.stringify(orders));
      return true;
    } catch (error) {
      console.error('Error saving recent orders:', error);
      return false;
    }
  },

  /**
   * Load recent orders
   */
  loadRecentOrders: () => {
    try {
      const ordersData = localStorage.getItem(STORAGE_KEYS.RECENT_ORDERS);
      return ordersData ? JSON.parse(ordersData) : [];
    } catch (error) {
      console.error('Error loading recent orders:', error);
      return [];
    }
  },

  /**
   * Clear all app data from storage
   */
  clearAllData: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
};

/**
 * Utility Helpers
 */
export const utilityHelpers = {
  /**
   * Debounce function for search inputs
   */
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Generate unique ID
   */
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * Deep clone object
   */
  deepClone: (obj) => {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Check if object is empty
   */
  isEmpty: (obj) => {
    if (!obj) return true;
    if (Array.isArray(obj)) return obj.length === 0;
    return Object.keys(obj).length === 0;
  },

  /**
   * Format error message from API response
   */
  formatErrorMessage: (error) => {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.response?.data?.message) return error.response.data.message;
    return 'An unexpected error occurred';
  },

  /**
   * Check if device is mobile
   */
  isMobileDevice: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  },

  /**
   * Copy to clipboard
   */
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  }
};

/**
 * Export all helpers as a single object
 */
export default {
  cart: cartHelpers,
  order: orderHelpers,
  user: userHelpers,
  location: locationHelpers,
  menu: menuHelpers,
  storage: storageHelpers,
  utility: utilityHelpers
};

/**
 * Helper function to initialize app data
 */
export const initializeAppData = () => {
  const userData = userHelpers.getUserData();
  const cartItems = storageHelpers.loadCart();
  const recentOrders = storageHelpers.loadRecentOrders();
  
  return {
    user: userData,
    cart: cartItems,
    recentOrders: recentOrders,
    isAuthenticated: userHelpers.isAuthenticated()
  };
};

/**
 * Helper function to validate delivery time slot
 */
export const isValidDeliveryTime = (selectedTime, leadTime = 30) => {
  const now = new Date();
  const selected = new Date(selectedTime);
  const minDeliveryTime = new Date(now.getTime() + leadTime * 60000);
  
  return selected >= minDeliveryTime;
};