// Mock Analytics Service
class AnalyticsService {
  /**
   * Initialize analytics service
   */
  init() {
    console.log('Analytics service initialized (mock)');
  }

  /**
   * Track a custom event
   * @param {string} eventName - Name of the event
   * @param {Object} params - Event parameters
   */
  trackEvent(eventName, params = {}) {
    console.log(`Analytics event tracked: ${eventName}`, params);
    // In a real implementation, this would send data to an analytics provider
  }

  /**
   * Track page view
   * @param {string} pageName - Name of the page
   */
  trackPageView(pageName) {
    console.log(`Page view tracked: ${pageName}`);
    // In a real implementation, this would send data to an analytics provider
  }

  /**
   * Track user signup
   */
  trackSignUp() {
    this.trackEvent('user_signup', {
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track user login
   */
  trackLogin() {
    this.trackEvent('user_login', {
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track order placement
   * @param {Object} orderData - Order information
   */
  trackOrderPlaced(orderData) {
    this.trackEvent('order_placed', {
      orderId: orderData.id,
      total: orderData.total,
      itemsCount: orderData.items?.length || 0,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track item added to cart
   * @param {Object} itemData - Item information
   */
  trackItemAddedToCart(itemData) {
    this.trackEvent('item_added_to_cart', {
      itemId: itemData.id,
      itemName: itemData.name,
      price: itemData.price,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track checkout started
   */
  trackCheckoutStarted() {
    this.trackEvent('checkout_started', {
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track checkout completed
   * @param {Object} orderData - Order information
   */
  trackCheckoutCompleted(orderData) {
    this.trackEvent('checkout_completed', {
      orderId: orderData.id,
      total: orderData.total,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track search query
   * @param {string} query - Search query
   */
  trackSearch(query) {
    this.trackEvent('search_performed', {
      query: query,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track filter applied
   * @param {string} filterType - Type of filter
   * @param {string} filterValue - Filter value
   */
  trackFilterApplied(filterType, filterValue) {
    this.trackEvent('filter_applied', {
      filterType: filterType,
      filterValue: filterValue,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track item viewed
   * @param {Object} itemData - Item information
   */
  trackItemViewed(itemData) {
    this.trackEvent('item_viewed', {
      itemId: itemData.id,
      itemName: itemData.name,
      category: itemData.category,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track address added
   */
  trackAddressAdded() {
    this.trackEvent('address_added', {
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track profile updated
   */
  trackProfileUpdated() {
    this.trackEvent('profile_updated', {
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track payment method added
   */
  trackPaymentMethodAdded() {
    this.trackEvent('payment_method_added', {
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track app opened
   */
  trackAppOpened() {
    this.trackEvent('app_opened', {
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track app closed
   */
  trackAppClosed() {
    this.trackEvent('app_closed', {
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track error
   * @param {string} error - Error message
   * @param {string} location - Location where error occurred
   */
  trackError(error, location) {
    this.trackEvent('error_occurred', {
      error: error,
      location: location,
      timestamp: new Date().toISOString()
    });
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;