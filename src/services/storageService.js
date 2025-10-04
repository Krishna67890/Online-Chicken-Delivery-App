// Storage service for managing localStorage with expiration and encryption
export const storageService = {
  // Set item with optional expiration (in milliseconds)
  set(key, value, expiration = null) {
    try {
      const item = {
        value,
        timestamp: Date.now(),
        expiration: expiration ? Date.now() + expiration : null,
      };
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },

  // Get item
  get(key, defaultValue = null) {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return defaultValue;

      const item = JSON.parse(itemStr);
      
      // Check if item has expired
      if (item.expiration && Date.now() > item.expiration) {
        this.remove(key);
        return defaultValue;
      }

      return item.value;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  },

  // Remove item
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  },

  // Clear all storage
  clearAll() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  },

  // Auth token management
  setToken(token) {
    return this.set('auth_token', token, 24 * 60 * 60 * 1000); // 24 hours
  },

  getToken() {
    return this.get('auth_token');
  },

  setRefreshToken(refreshToken) {
    return this.set('refresh_token', refreshToken, 7 * 24 * 60 * 60 * 1000); // 7 days
  },

  getRefreshToken() {
    return this.get('refresh_token');
  },

  setUser(user) {
    return this.set('user_data', user);
  },

  getUser() {
    return this.get('user_data');
  },

  // Cart management
  setCart(cartItems) {
    return this.set('cart_items', cartItems, 60 * 60 * 1000); // 1 hour
  },

  getCart() {
    return this.get('cart_items', []);
  },

  // Recent searches
  setRecentSearches(searches) {
    return this.set('recent_searches', searches, 24 * 60 * 60 * 1000); // 24 hours
  },

  getRecentSearches() {
    return this.get('recent_searches', []);
  },

  // User preferences
  setPreferences(preferences) {
    return this.set('user_preferences', preferences);
  },

  getPreferences() {
    return this.get('user_preferences', {});
  },

  // Check if storage is available
  isAvailable() {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  },

  // Get storage usage
  getUsage() {
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length;
        }
      }
      return total;
    } catch (error) {
      return 0;
    }
  },
};