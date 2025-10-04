// src/utils/validation.js

import { 
  ORDER_LIMITS, 
  PAYMENT_METHODS,
  DELIVERY_TYPES,
  SPICE_LEVELS,
  PORTION_SIZES,
  CHICKEN_CATEGORIES
} from './constants';

/**
 * Validation Schemas for Form Validation
 */
export const validationSchemas = {
  /**
   * User Registration Validation
   */
  register: {
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s'-]+$/,
      message: 'First name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes'
    },
    lastName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s'-]+$/,
      message: 'Last name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes'
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    phone: {
      required: true,
      pattern: /^[\+]?[1-9][\d]{0,15}$/,
      message: 'Please enter a valid phone number'
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
    }
  },

  /**
   * User Login Validation
   */
  login: {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    password: {
      required: true,
      minLength: 1,
      message: 'Password is required'
    }
  },

  /**
   * Delivery Address Validation
   */
  address: {
    street: {
      required: true,
      minLength: 5,
      maxLength: 200,
      message: 'Street address must be 5-200 characters'
    },
    city: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s\-]+$/,
      message: 'City must be 2-50 characters and contain only letters, spaces, and hyphens'
    },
    state: {
      required: true,
      pattern: /^[A-Z]{2}$/,
      message: 'Please select a valid state'
    },
    zipCode: {
      required: true,
      pattern: /^\d{5}(-\d{4})?$/,
      message: 'ZIP code must be 5 digits or 9 digits with hyphen'
    },
    apartment: {
      required: false,
      maxLength: 20,
      message: 'Apartment/suite must be less than 20 characters'
    },
    deliveryInstructions: {
      required: false,
      maxLength: 500,
      message: 'Delivery instructions must be less than 500 characters'
    }
  },

  /**
   * Payment Method Validation
   */
  payment: {
    cardNumber: {
      required: true,
      pattern: /^\d{16}$/,
      message: 'Card number must be 16 digits'
    },
    expiryDate: {
      required: true,
      pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
      message: 'Expiry date must be in MM/YY format'
    },
    cvv: {
      required: true,
      pattern: /^\d{3,4}$/,
      message: 'CVV must be 3 or 4 digits'
    },
    cardholderName: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s]+$/,
      message: 'Cardholder name must be 2-100 characters and contain only letters and spaces'
    }
  },

  /**
   * Order Validation
   */
  order: {
    deliveryType: {
      required: true,
      allowedValues: Object.values(DELIVERY_TYPES),
      message: 'Please select a valid delivery type'
    },
    deliveryTime: {
      required: false,
      custom: (value, formData) => {
        if (formData.deliveryType === DELIVERY_TYPES.SCHEDULED && !value) {
          return 'Delivery time is required for scheduled delivery';
        }
        return null;
      }
    },
    specialInstructions: {
      required: false,
      maxLength: 1000,
      message: 'Special instructions must be less than 1000 characters'
    }
  },

  /**
   * Menu Item Customization Validation
   */
  menuItem: {
    quantity: {
      required: true,
      min: 1,
      max: ORDER_LIMITS.MAX_QUANTITY_PER_ITEM,
      message: `Quantity must be between 1 and ${ORDER_LIMITS.MAX_QUANTITY_PER_ITEM}`
    },
    spiceLevel: {
      required: true,
      allowedValues: Object.values(SPICE_LEVELS),
      message: 'Please select a valid spice level'
    },
    portionSize: {
      required: true,
      allowedValues: Object.values(PORTION_SIZES),
      message: 'Please select a valid portion size'
    }
  }
};

/**
 * Validation Functions
 */
export const validators = {
  /**
   * Required field validator
   */
  required: (value, fieldName = 'This field') => {
    if (value === null || value === undefined || value === '') {
      return `${fieldName} is required`;
    }
    return null;
  },

  /**
   * Minimum length validator
   */
  minLength: (value, min, fieldName = 'This field') => {
    if (value && value.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return null;
  },

  /**
   * Maximum length validator
   */
  maxLength: (value, max, fieldName = 'This field') => {
    if (value && value.length > max) {
      return `${fieldName} must be less than ${max} characters`;
    }
    return null;
  },

  /**
   * Pattern validator
   */
  pattern: (value, regex, message) => {
    if (value && !regex.test(value)) {
      return message;
    }
    return null;
  },

  /**
   * Email validator
   */
  email: (value) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  /**
   * Phone number validator
   */
  phone: (value) => {
    if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return null;
  },

  /**
   * Number range validator
   */
  numberRange: (value, min, max, fieldName = 'This field') => {
    const num = Number(value);
    if (isNaN(num)) {
      return `${fieldName} must be a number`;
    }
    if (num < min || num > max) {
      return `${fieldName} must be between ${min} and ${max}`;
    }
    return null;
  },

  /**
   * Minimum value validator
   */
  minValue: (value, min, fieldName = 'This field') => {
    const num = Number(value);
    if (!isNaN(num) && num < min) {
      return `${fieldName} must be at least ${min}`;
    }
    return null;
  },

  /**
   * Maximum value validator
   */
  maxValue: (value, max, fieldName = 'This field') => {
    const num = Number(value);
    if (!isNaN(num) && num > max) {
      return `${fieldName} must be less than or equal to ${max}`;
    }
    return null;
  },

  /**
   * Allowed values validator
   */
  allowedValues: (value, allowed, fieldName = 'This field') => {
    if (value && !allowed.includes(value)) {
      return `${fieldName} must be one of: ${allowed.join(', ')}`;
    }
    return null;
  },

  /**
   * Credit card expiry validator
   */
  cardExpiry: (value) => {
    if (!value) return 'Expiry date is required';
    
    const [month, year] = value.split('/');
    if (!month || !year) return 'Invalid expiry date format';
    
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    const expiryMonth = parseInt(month, 10);
    const expiryYear = parseInt(year, 10);
    
    if (expiryMonth < 1 || expiryMonth > 12) {
      return 'Invalid expiry month';
    }
    
    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
      return 'Card has expired';
    }
    
    return null;
  },

  /**
   * ZIP code validator
   */
  zipCode: (value) => {
    if (value && !/^\d{5}(-\d{4})?$/.test(value)) {
      return 'Please enter a valid ZIP code (5 or 9 digits)';
    }
    return null;
  },

  /**
   * Password strength validator
   */
  passwordStrength: (value) => {
    if (!value) return 'Password is required';
    
    const requirements = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /\d/.test(value),
      special: /[@$!%*?&]/.test(value)
    };
    
    const missing = Object.entries(requirements)
      .filter(([_, met]) => !met)
      .map(([req]) => req);
    
    if (missing.length > 0) {
      return `Password must include: ${missing.join(', ')}`;
    }
    
    return null;
  },

  /**
   * Confirm password validator
   */
  confirmPassword: (value, password) => {
    if (value !== password) {
      return 'Passwords do not match';
    }
    return null;
  },

  /**
   * Delivery time validator
   */
  deliveryTime: (value, deliveryType) => {
    if (deliveryType === DELIVERY_TYPES.SCHEDULED && !value) {
      return 'Delivery time is required for scheduled delivery';
    }
    
    if (value) {
      const selectedTime = new Date(value);
      const now = new Date();
      const minTime = new Date(now.getTime() + 30 * 60000); // 30 minutes from now
      
      if (selectedTime < minTime) {
        return 'Delivery time must be at least 30 minutes from now';
      }
      
      // Check if within operating hours
      const deliveryHour = selectedTime.getHours();
      if (deliveryHour < 9 || deliveryHour >= 23) {
        return 'Delivery time must be between 9:00 AM and 11:00 PM';
      }
    }
    
    return null;
  }
};

/**
 * Form Validation Helper
 */
export const validateForm = (formData, schema) => {
  const errors = {};
  
  Object.keys(schema).forEach(field => {
    const fieldSchema = schema[field];
    const value = formData[field];
    
    // Skip validation if field is not required and empty
    if (!fieldSchema.required && (value === null || value === undefined || value === '')) {
      return;
    }
    
    // Required validation
    if (fieldSchema.required) {
      const requiredError = validators.required(value, field);
      if (requiredError) {
        errors[field] = requiredError;
        return;
      }
    }
    
    // Min length validation
    if (fieldSchema.minLength && typeof value === 'string') {
      const minLengthError = validators.minLength(value, fieldSchema.minLength, field);
      if (minLengthError) {
        errors[field] = minLengthError;
        return;
      }
    }
    
    // Max length validation
    if (fieldSchema.maxLength && typeof value === 'string') {
      const maxLengthError = validators.maxLength(value, fieldSchema.maxLength, field);
      if (maxLengthError) {
        errors[field] = maxLengthError;
        return;
      }
    }
    
    // Pattern validation
    if (fieldSchema.pattern && value) {
      const patternError = validators.pattern(value, fieldSchema.pattern, fieldSchema.message);
      if (patternError) {
        errors[field] = patternError;
        return;
      }
    }
    
    // Allowed values validation
    if (fieldSchema.allowedValues && value) {
      const allowedError = validators.allowedValues(value, fieldSchema.allowedValues, field);
      if (allowedError) {
        errors[field] = allowedError;
        return;
      }
    }
    
    // Number range validation
    if (fieldSchema.min !== undefined && fieldSchema.max !== undefined && value) {
      const rangeError = validators.numberRange(value, fieldSchema.min, fieldSchema.max, field);
      if (rangeError) {
        errors[field] = rangeError;
        return;
      }
    }
    
    // Custom validation
    if (fieldSchema.custom && value) {
      const customError = fieldSchema.custom(value, formData);
      if (customError) {
        errors[field] = customError;
        return;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Specific Validation Functions for Chicken Delivery App
 */
export const deliveryValidators = {
  /**
   * Validate cart meets minimum order amount
   */
  validateCartTotal: (cartTotal) => {
    if (cartTotal < ORDER_LIMITS.MIN_ORDER_AMOUNT) {
      return `Minimum order amount is $${ORDER_LIMITS.MIN_ORDER_AMOUNT}`;
    }
    
    if (cartTotal > ORDER_LIMITS.MAX_ORDER_AMOUNT) {
      return `Maximum order amount is $${ORDER_LIMITS.MAX_ORDER_AMOUNT}`;
    }
    
    return null;
  },

  /**
   * Validate delivery address is within service area
   */
  validateServiceArea: (address, serviceAreas) => {
    if (!address.zipCode) {
      return 'ZIP code is required';
    }
    
    const zipPrefix = address.zipCode.substring(0, 3);
    const isInServiceArea = serviceAreas.some(area => 
      area.zipCodes.includes(zipPrefix) || area.cities.includes(address.city)
    );
    
    if (!isInServiceArea) {
      return 'Sorry, we do not deliver to this area yet';
    }
    
    return null;
  },

  /**
   * Validate item availability
   */
  validateItemAvailability: (item, availableItems) => {
    const availableItem = availableItems.find(avail => avail.id === item.id);
    
    if (!availableItem) {
      return `${item.name} is no longer available`;
    }
    
    if (!availableItem.inStock) {
      return `${item.name} is currently out of stock`;
    }
    
    if (item.quantity > availableItem.maxQuantity) {
      return `Maximum ${availableItem.maxQuantity} ${item.name} allowed per order`;
    }
    
    return null;
  },

  /**
   * Validate order time is within operating hours
   */
  validateOperatingHours: (orderTime = new Date()) => {
    const hour = orderTime.getHours();
    const isWithinHours = hour >= 9 && hour < 23; // 9 AM to 11 PM
    
    if (!isWithinHours) {
      return 'We are currently closed. Operating hours: 9:00 AM - 11:00 PM';
    }
    
    return null;
  },

  /**
   * Validate spice level compatibility
   */
  validateSpiceLevel: (spiceLevel, item) => {
    if (!item.availableSpiceLevels.includes(spiceLevel)) {
      return `Spice level "${spiceLevel}" is not available for ${item.name}`;
    }
    
    return null;
  },

  /**
   * Validate portion size availability
   */
  validatePortionSize: (portionSize, item) => {
    if (!item.availablePortionSizes.includes(portionSize)) {
      return `Portion size "${portionSize}" is not available for ${item.name}`;
    }
    
    return null;
  }
};

/**
 * Async Validation Functions
 */
export const asyncValidators = {
  /**
   * Validate email uniqueness (simulated API call)
   */
  validateEmailUnique: async (email) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // In real app, this would be an API call
        const takenEmails = ['existing@example.com', 'test@example.com'];
        const isUnique = !takenEmails.includes(email);
        
        resolve(isUnique ? null : 'Email is already registered');
      }, 500);
    });
  },

  /**
   * Validate phone number uniqueness
   */
  validatePhoneUnique: async (phone) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In real app, this would be an API call
        const takenPhones = ['+1234567890', '+1987654321'];
        const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
        const isUnique = !takenPhones.includes(cleanedPhone);
        
        resolve(isUnique ? null : 'Phone number is already registered');
      }, 500);
    });
  },

  /**
   * Validate promo code
   */
  validatePromoCode: async (code) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In real app, this would be an API call
        const validCodes = {
          'WELCOME10': { type: 'percentage', value: 10, minOrder: 15 },
          'FREEDELIVERY': { type: 'free_delivery', minOrder: 20 },
          'SAVE5': { type: 'fixed_amount', value: 5, minOrder: 25 }
        };
        
        const promo = validCodes[code.toUpperCase()];
        
        if (!promo) {
          resolve({ isValid: false, message: 'Invalid promo code' });
        } else {
          resolve({ isValid: true, promo });
        }
      }, 500);
    });
  }
};

/**
 * Validation Utility Functions
 */
export const validationUtils = {
  /**
   * Get field validation rules
   */
  getFieldRules: (schema, fieldName) => {
    return schema[fieldName] || null;
  },

  /**
   * Check if field is required
   */
  isFieldRequired: (schema, fieldName) => {
    const rules = validationUtils.getFieldRules(schema, fieldName);
    return rules ? rules.required : false;
  },

  /**
   * Validate single field
   */
  validateField: (value, rules, formData = {}) => {
    if (!rules) return null;
    
    // Required validation
    if (rules.required) {
      const requiredError = validators.required(value);
      if (requiredError) return requiredError;
    }
    
    // Skip further validation if value is empty and not required
    if (!value && !rules.required) return null;
    
    // Pattern validation
    if (rules.pattern && value) {
      const patternError = validators.pattern(value, rules.pattern, rules.message);
      if (patternError) return patternError;
    }
    
    // Min length validation
    if (rules.minLength && value) {
      const minLengthError = validators.minLength(value, rules.minLength);
      if (minLengthError) return minLengthError;
    }
    
    // Max length validation
    if (rules.maxLength && value) {
      const maxLengthError = validators.maxLength(value, rules.maxLength);
      if (maxLengthError) return maxLengthError;
    }
    
    // Custom validation
    if (rules.custom && value) {
      const customError = rules.custom(value, formData);
      if (customError) return customError;
    }
    
    return null;
  },

  /**
   * Sanitize input data
   */
  sanitizeInput: (value, type = 'string') => {
    if (value === null || value === undefined) return value;
    
    switch (type) {
      case 'string':
        return String(value).trim();
      case 'number':
        return Number(value);
      case 'email':
        return String(value).trim().toLowerCase();
      case 'phone':
        return String(value).replace(/[\s\-\(\)]/g, '');
      default:
        return value;
    }
  }
};

/**
 * Export all validation utilities
 */
export default {
  schemas: validationSchemas,
  validators,
  validateForm,
  delivery: deliveryValidators,
  async: asyncValidators,
  utils: validationUtils
};