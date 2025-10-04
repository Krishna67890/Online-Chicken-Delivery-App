// src/utils/formatters.js

import { CURRENCY, DATE_FORMATS } from './constants';

/**
 * Currency and Price Formatters
 */
export const priceFormatters = {
  /**
   * Format price with currency symbol
   */
  formatPrice: (amount, currency = CURRENCY.SYMBOL) => {
    if (amount === null || amount === undefined) return `${currency}0.00`;
    
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numericAmount)) return `${currency}0.00`;
    
    return `${currency}${numericAmount.toFixed(CURRENCY.DECIMAL_PLACES)}`;
  },

  /**
   * Format price with discount calculation
   */
  formatDiscountedPrice: (originalPrice, discountPercent) => {
    if (!originalPrice || !discountPercent) {
      return priceFormatters.formatPrice(originalPrice);
    }
    
    const discountAmount = (originalPrice * discountPercent) / 100;
    const finalPrice = originalPrice - discountAmount;
    
    return {
      original: priceFormatters.formatPrice(originalPrice),
      discounted: priceFormatters.formatPrice(finalPrice),
      discountAmount: priceFormatters.formatPrice(discountAmount),
      savingsPercent: discountPercent
    };
  },

  /**
   * Format delivery fee with free delivery threshold
   */
  formatDeliveryFee: (fee, orderTotal, freeDeliveryThreshold) => {
    if (orderTotal >= freeDeliveryThreshold) {
      return {
        amount: priceFormatters.formatPrice(0),
        message: 'FREE',
        isFree: true
      };
    }
    
    return {
      amount: priceFormatters.formatPrice(fee),
      message: `Add ${priceFormatters.formatPrice(freeDeliveryThreshold - orderTotal)} for free delivery`,
      isFree: false
    };
  },

  /**
   * Format order total with breakdown
   */
  formatOrderTotal: (subtotal, deliveryFee, tax, discount = 0) => {
    const total = subtotal + deliveryFee + tax - discount;
    
    return {
      subtotal: priceFormatters.formatPrice(subtotal),
      deliveryFee: priceFormatters.formatPrice(deliveryFee),
      tax: priceFormatters.formatPrice(tax),
      discount: priceFormatters.formatPrice(discount),
      total: priceFormatters.formatPrice(total),
      numericTotal: total
    };
  }
};

/**
 * Date and Time Formatters
 */
export const dateFormatters = {
  /**
   * Format date for display
   */
  formatDate: (dateString, format = DATE_FORMATS.DISPLAY_DATE) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    
    return date.toLocaleDateString('en-US', options);
  },

  /**
   * Format time for display
   */
  formatTime: (timeString, format = DATE_FORMATS.DISPLAY_TIME) => {
    if (!timeString) return 'N/A';
    
    const date = new Date(`2000-01-01T${timeString}`);
    if (isNaN(date.getTime())) return 'Invalid Time';
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  },

  /**
   * Format datetime for display
   */
  formatDateTime: (dateTimeString, format = DATE_FORMATS.DISPLAY_DATETIME) => {
    if (!dateTimeString) return 'N/A';
    
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  },

  /**
   * Format delivery time estimate
   */
  formatDeliveryTime: (minutes) => {
    if (minutes <= 0) return 'Ready now';
    
    if (minutes < 60) {
      return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    
    return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} min${remainingMinutes !== 1 ? 's' : ''}`;
  },

  /**
   * Format order preparation time
   */
  formatPreparationTime: (minutes) => {
    if (minutes <= 15) return 'Quick (15 mins)';
    if (minutes <= 30) return 'Standard (30 mins)';
    if (minutes <= 45) return 'Moderate (45 mins)';
    return 'Extended (60+ mins)';
  }
};

/**
 * Text and String Formatters
 */
export const textFormatters = {
  /**
   * Capitalize first letter of each word
   */
  capitalizeWords: (str) => {
    if (!str) return '';
    return str.replace(/\b\w/g, char => char.toUpperCase());
  },

  /**
   * Format chicken category names for display
   */
  formatCategoryName: (categoryKey) => {
    const categoryMap = {
      'fried_chicken': 'Fried Chicken',
      'grilled_chicken': 'Grilled Chicken',
      'roasted_chicken': 'Roasted Chicken',
      'chicken_wings': 'Chicken Wings',
      'chicken_burgers': 'Chicken Burgers',
      'chicken_sandwiches': 'Chicken Sandwiches',
      'chicken_rice_bowls': 'Chicken Rice Bowls',
      'sides': 'Side Dishes',
      'beverages': 'Beverages',
      'desserts': 'Desserts'
    };
    
    return categoryMap[categoryKey] || textFormatters.capitalizeWords(categoryKey.replace(/_/g, ' '));
  },

  /**
   * Format spice level for display
   */
  formatSpiceLevel: (spiceLevel) => {
    const spiceMap = {
      'mild': 'Mild 🌶',
      'medium': 'Medium 🌶🌶',
      'hot': 'Hot 🌶🌶🌶',
      'extra_hot': 'Extra Hot 🌶🌶🌶🌶'
    };
    
    return spiceMap[spiceLevel] || textFormatters.capitalizeWords(spiceLevel);
  },

  /**
   * Format portion size for display
   */
  formatPortionSize: (portionSize) => {
    const portionMap = {
      'single': 'Single Serving',
      'combo': 'Combo Meal',
      'family': 'Family Pack',
      'party': 'Party Size'
    };
    
    return portionMap[portionSize] || textFormatters.capitalizeWords(portionSize);
  },

  /**
   * Truncate text with ellipsis
   */
  truncateText: (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength).trim() + '...';
  },

  /**
   * Format address for display
   */
  formatAddress: (address) => {
    if (!address) return '';
    
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode
    ].filter(Boolean);
    
    return parts.join(', ');
  },

  /**
   * Format phone number
   */
  formatPhoneNumber: (phoneNumber) => {
    if (!phoneNumber) return '';
    
    // Remove all non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (cleaned.length === 10) {
      return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
    }
    
    // Return original if not standard US number
    return phoneNumber;
  }
};

/**
 * Order and Cart Formatters
 */
export const orderFormatters = {
  /**
   * Format order status for display
   */
  formatOrderStatus: (status) => {
    const statusMap = {
      'pending': 'Order Received',
      'confirmed': 'Order Confirmed',
      'preparing': 'Preparing Your Order',
      'ready': 'Ready for Pickup',
      'out_for_delivery': 'Out for Delivery',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled',
      'failed': 'Failed'
    };
    
    return statusMap[status] || textFormatters.capitalizeWords(status);
  },

  /**
   * Format order items summary
   */
  formatOrderSummary: (items) => {
    if (!items || !items.length) return 'No items';
    
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems === 1) {
      return `1 item: ${items[0].name}`;
    }
    
    const mainItem = items[0].name;
    const remainingCount = totalItems - 1;
    
    if (remainingCount === 0) {
      return `${totalItems} item${totalItems !== 1 ? 's' : ''}: ${mainItem}`;
    }
    
    return `${totalItems} items: ${mainItem} +${remainingCount} more`;
  },

  /**
   * Format cart item count
   */
  formatCartItemCount: (count) => {
    if (!count || count === 0) return 'Empty';
    if (count > 99) return '99+';
    return count.toString();
  },

  /**
   * Format loyalty points
   */
  formatLoyaltyPoints: (points) => {
    if (!points) return '0 points';
    
    if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}k points`;
    }
    
    return `${points} point${points !== 1 ? 's' : ''}`;
  },

  /**
   * Format rating with stars
   */
  formatRating: (rating, maxRating = 5) => {
    if (!rating || rating === 0) return 'No ratings';
    
    const fullStars = '★'.repeat(Math.floor(rating));
    const emptyStars = '☆'.repeat(maxRating - Math.floor(rating));
    
    return `${fullStars}${emptyStars} ${rating.toFixed(1)}`;
  }
};

/**
 * Number and Quantity Formatters
 */
export const numberFormatters = {
  /**
   * Format quantity with proper pluralization
   */
  formatQuantity: (quantity, itemName) => {
    if (quantity === 1) {
      return `1 ${itemName}`;
    }
    
    // Handle common plural forms
    const pluralMap = {
      'piece': 'pieces',
      'box': 'boxes',
      'pack': 'packs',
      'set': 'sets'
    };
    
    const pluralName = pluralMap[itemName] || `${itemName}s`;
    return `${quantity} ${pluralName}`;
  },

  /**
   * Format distance in miles or kilometers
   */
  formatDistance: (distanceInMiles, useMetric = false) => {
    if (useMetric) {
      const km = distanceInMiles * 1.60934;
      return `${km.toFixed(1)} km`;
    }
    
    return `${distanceInMiles.toFixed(1)} mi`;
  },

  /**
   * Format percentage
   */
  formatPercentage: (value, decimalPlaces = 0) => {
    if (!value && value !== 0) return 'N/A';
    
    const percentage = (value * 100).toFixed(decimalPlaces);
    return `${percentage}%`;
  }
};

/**
 * Validation Formatters
 */
export const validationFormatters = {
  /**
   * Format credit card number for display (masked)
   */
  formatCreditCard: (cardNumber) => {
    if (!cardNumber) return '';
    
    const cleaned = cardNumber.replace(/\s+/g, '');
    const lastFour = cleaned.slice(-4);
    
    return `•••• •••• •••• ${lastFour}`;
  },

  /**
   * Format expiration date
   */
  formatExpirationDate: (month, year) => {
    if (!month || !year) return '';
    
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  }
};

/**
 * Export all formatters as a single object
 */
export default {
  price: priceFormatters,
  date: dateFormatters,
  text: textFormatters,
  order: orderFormatters,
  number: numberFormatters,
  validation: validationFormatters
};

/**
 * Helper function to format any value based on its type
 */
export const formatValue = (value, type, options = {}) => {
  const formatters = {
    price: () => priceFormatters.formatPrice(value, options.currency),
    date: () => dateFormatters.formatDate(value, options.format),
    time: () => dateFormatters.formatTime(value, options.format),
    datetime: () => dateFormatters.formatDateTime(value, options.format),
    phone: () => textFormatters.formatPhoneNumber(value),
    address: () => textFormatters.formatAddress(value),
    percentage: () => numberFormatters.formatPercentage(value, options.decimalPlaces),
    quantity: () => numberFormatters.formatQuantity(value, options.itemName),
    rating: () => orderFormatters.formatRating(value, options.maxRating),
    spice: () => textFormatters.formatSpiceLevel(value),
    portion: () => textFormatters.formatPortionSize(value),
    category: () => textFormatters.formatCategoryName(value),
    status: () => orderFormatters.formatOrderStatus(value)
  };

  const formatter = formatters[type];
  return formatter ? formatter() : String(value);
};