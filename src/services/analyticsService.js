// Analytics service for tracking user behavior and events
export const analyticsService = {
  // Initialize analytics
  init() {
    // Initialize your analytics SDKs here (Google Analytics, Mixpanel, etc.)
    if (typeof gtag !== 'undefined') {
      gtag('config', process.env.REACT_APP_GA_TRACKING_ID);
    }
  },

  // Track page views
  trackPageView(pageName, properties = {}) {
    const eventData = {
      page: pageName,
      timestamp: new Date().toISOString(),
      ...properties,
    };

    // Send to analytics services
    this._sendToGoogleAnalytics('page_view', eventData);
    this._sendToMixpanel('Page View', eventData);
    
    console.log('📊 Page View:', eventData);
  },

  // Track custom events
  track(eventName, properties = {}) {
    const eventData = {
      event: eventName,
      timestamp: new Date().toISOString(),
      ...properties,
    };

    // Send to analytics services
    this._sendToGoogleAnalytics('event', eventData);
    this._sendToMixpanel(eventName, eventData);
    
    console.log('📊 Event:', eventData);
  },

  // Identify user
  identify(userId, traits = {}) {
    const identifyData = {
      userId,
      traits,
      timestamp: new Date().toISOString(),
    };

    // Send to analytics services
    this._sendToMixpanel('Identify', identifyData);
    
    console.log('📊 Identify:', identifyData);
  },

  // Track e-commerce events
  trackEcommerce(eventName, properties = {}) {
    const ecommerceData = {
      event: eventName,
      ecommerce: true,
      timestamp: new Date().toISOString(),
      ...properties,
    };

    this.track(eventName, ecommerceData);
  },

  // Track errors
  trackError(error, context = {}) {
    const errorData = {
      event: 'Error Occurred',
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    };

    this.track('Error', errorData);
  },

  // Track performance metrics
  trackPerformance(metricName, value, properties = {}) {
    const performanceData = {
      event: 'Performance Metric',
      metric: metricName,
      value,
      timestamp: new Date().toISOString(),
      ...properties,
    };

    this.track('Performance', performanceData);
  },

  // Reset analytics (on logout)
  reset() {
    // Reset analytics services
    if (typeof mixpanel !== 'undefined') {
      mixpanel.reset();
    }
  },

  // Private method to send to Google Analytics
  _sendToGoogleAnalytics(eventType, data) {
    if (typeof gtag !== 'undefined') {
      if (eventType === 'page_view') {
        gtag('event', 'page_view', {
          page_title: data.page,
          page_location: window.location.href,
        });
      } else if (eventType === 'event') {
        gtag('event', data.event, data);
      }
    }
  },

  // Private method to send to Mixpanel
  _sendToMixpanel(eventName, data) {
    if (typeof mixpanel !== 'undefined') {
      if (eventName === 'Identify') {
        mixpanel.identify(data.userId);
        mixpanel.people.set(data.traits);
      } else {
        mixpanel.track(eventName, data);
      }
    }
  },
};