// src/pages/TrackOrder/TrackOrder.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { useNotifications } from '../hooks/useNotifications';
import { useGeolocation } from '../hooks/useGeolocation';
import OrderTimeline from '../components/OrderTimeline/OrderTimeline';
import DeliveryMap from '../components/DeliveryMap/DeliveryMap';
import OrderSummary from '../components/OrderSummary/OrderSummary';
import DriverInfo from '../components/DriverInfo/DriverInfo';
import EstimatedTime from '../components/EstimatedTime/EstimatedTime';
import SupportOptions from '../components/SupportOptions/SupportOptions';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import EmptyState from '../components/EmptyState/EmptyState';
import ShareOrderModal from '../components/ShareOrderModal/ShareOrderModal';
import RatingModal from '../components/RatingModal/RatingModal';
import { orderService } from '../services/orderService';
import { trackingService } from '../services/trackingService';
import { analyticsService } from '../services/analyticsService';
import { dateFormatters, priceFormatters } from '../utils/formatters';
import './TrackOrder.css';

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError, showWarning } = useNotifications();
  const { getCurrentPosition, loading: geoLoading } = useGeolocation();

  const {
    orders,
    getOrderById,
    updateOrderStatus,
    refreshOrders
  } = useOrders();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline', 'map', 'details'
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [estimatedTimes, setEstimatedTimes] = useState({});
  const [orderEvents, setOrderEvents] = useState([]);
  const [isPolling, setIsPolling] = useState(false);

  const mapRef = useRef(null);
  const notificationPermissionRef = useRef(false);

  // Load order data
  useEffect(() => {
    const loadOrderData = async () => {
      try {
        setLoading(true);
        
        let orderData;
        if (orderId) {
          // Fetch specific order
          orderData = await orderService.getOrderById(orderId);
        } else if (orders.length > 0) {
          // Get latest active order
          orderData = orders
            .filter(o => ['preparing', 'ready', 'out_for_delivery'].includes(o.status))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        }

        if (!orderData) {
          setError('Order not found');
          return;
        }

        setOrder(orderData);
        
        // Load tracking data
        const tracking = await trackingService.getTrackingData(orderData.id);
        setTrackingData(tracking);
        
        // Load driver location if order is out for delivery
        if (orderData.status === 'out_for_delivery' && tracking.driverId) {
          const driverLoc = await trackingService.getDriverLocation(tracking.driverId);
          setDriverLocation(driverLoc);
        }

        // Load order events
        const events = await orderService.getOrderEvents(orderData.id);
        setOrderEvents(events);

        // Calculate estimated times
        const estimates = calculateEstimatedTimes(orderData, tracking);
        setEstimatedTimes(estimates);

        // Track page view
        analyticsService.trackEvent('order_tracking_view', { 
          orderId: orderData.id, 
          status: orderData.status 
        });

      } catch (err) {
        setError(err.message || 'Failed to load order tracking');
        console.error('Order tracking error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [orderId, orders]);

  // Setup auto-refresh for active orders
  useEffect(() => {
    if (!order || !autoRefresh || !isOrderActive(order)) return;

    const interval = setInterval(async () => {
      try {
        setIsPolling(true);
        const updatedOrder = await orderService.getOrderById(order.id);
        setOrder(updatedOrder);

        // Update tracking data
        const tracking = await trackingService.getTrackingData(order.id);
        setTrackingData(tracking);

        // Update driver location
        if (updatedOrder.status === 'out_for_delivery' && tracking.driverId) {
          const driverLoc = await trackingService.getDriverLocation(tracking.driverId);
          setDriverLocation(driverLoc);
        }

        // Check for status changes
        if (updatedOrder.status !== order.status) {
          handleStatusChange(updatedOrder.status);
        }

      } catch (err) {
        console.error('Auto-refresh error:', err);
      } finally {
        setIsPolling(false);
      }
    }, 10000); // Refresh every 10 seconds

    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [order, autoRefresh]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        notificationPermissionRef.current = permission === 'granted';
      });
    }
  }, []);

  // Get user location
  const handleGetUserLocation = async () => {
    try {
      const position = await getCurrentPosition();
      setUserLocation({
        latitude: position.latitude,
        longitude: position.longitude
      });
      
      // Update map with user location
      if (mapRef.current) {
        mapRef.current.updateUserLocation(position);
      }
    } catch (err) {
      showError('Unable to get your location');
    }
  };

  // Calculate estimated times
  const calculateEstimatedTimes = (orderData, tracking) => {
    const estimates = {};
    const now = new Date();
    
    switch (orderData.status) {
      case 'preparing':
        estimates.readyAt = new Date(now.getTime() + 15 * 60000); // 15 minutes
        estimates.deliveryAt = new Date(now.getTime() + 30 * 60000); // 30 minutes
        break;
      case 'ready':
        estimates.deliveryAt = new Date(now.getTime() + 20 * 60000); // 20 minutes
        break;
      case 'out_for_delivery':
        if (driverLocation && userLocation) {
          const distance = calculateDistance(
            driverLocation.latitude,
            driverLocation.longitude,
            userLocation.latitude,
            userLocation.longitude
          );
          const travelTime = (distance / 0.5) * 60; // Assuming 30 km/h average speed
          estimates.deliveryAt = new Date(now.getTime() + travelTime * 60000);
        } else {
          estimates.deliveryAt = new Date(now.getTime() + 15 * 60000); // 15 minutes fallback
        }
        break;
      default:
        break;
    }
    
    return estimates;
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Handle status changes
  const handleStatusChange = useCallback((newStatus) => {
    if (notificationsEnabled && notificationPermissionRef.current) {
      showOrderNotification(newStatus);
    }

    // Track status change
    analyticsService.trackEvent('order_status_changed', {
      orderId: order.id,
      fromStatus: order.status,
      toStatus: newStatus
    });

    // Show success message for important status changes
    if (newStatus === 'out_for_delivery') {
      showSuccess('Your order is out for delivery! 🚚');
    } else if (newStatus === 'delivered') {
      showSuccess('Order delivered! Enjoy your meal! 🎉');
      setRatingModalOpen(true);
    }
  }, [order, notificationsEnabled, showSuccess]);

  // Show browser notification
  const showOrderNotification = (status) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const statusMessages = {
      'preparing': '👨‍🍳 Your order is being prepared',
      'ready': '✅ Your order is ready for pickup',
      'out_for_delivery': '🚚 Your order is out for delivery',
      'delivered': '🎉 Order delivered! Enjoy your meal!'
    };

    new Notification('Order Update', {
      body: statusMessages[status] || `Order status: ${status}`,
      icon: '/favicon.ico',
      tag: `order-${order.id}`
    });
  };

  // Check if order is active
  const isOrderActive = (orderData) => {
    return ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(orderData.status);
  };

  // Handle contact driver
  const handleContactDriver = () => {
    if (trackingData?.driver?.phone) {
      window.open(`tel:${trackingData.driver.phone}`, '_self');
    } else {
      showWarning('Driver contact information not available');
    }
  };

  // Handle contact restaurant
  const handleContactRestaurant = () => {
    if (order?.restaurant?.phone) {
      window.open(`tel:${order.restaurant.phone}`, '_self');
    } else {
      showWarning('Restaurant contact information not available');
    }
  };

  // Handle share order
  const handleShareOrder = () => {
    setShareModalOpen(true);
  };

  // Handle rate order
  const handleRateOrder = async (rating, review) => {
    try {
      await orderService.rateOrder(order.id, rating, review);
      showSuccess('Thank you for your feedback!');
      setRatingModalOpen(false);
      
      analyticsService.trackEvent('order_rated', {
        orderId: order.id,
        rating: rating
      });
    } catch (err) {
      showError('Failed to submit rating');
    }
  };

  // Handle reorder
  const handleReorder = () => {
    navigate('/reorder', { state: { orderId: order.id } });
  };

  // Get progress percentage
  const getProgressPercentage = () => {
    const statusWeights = {
      'pending': 10,
      'confirmed': 20,
      'preparing': 50,
      'ready': 80,
      'out_for_delivery': 90,
      'delivered': 100
    };
    
    return statusWeights[order?.status] || 0;
  };

  // Quick actions based on order status
  const getQuickActions = () => {
    if (!order) return [];

    const baseActions = [
      {
        id: 'share',
        icon: '📤',
        label: 'Share Order',
        action: handleShareOrder
      },
      {
        id: 'support',
        icon: '💬',
        label: 'Get Help',
        action: () => navigate('/contact', { state: { orderId: order.id } })
      }
    ];

    const statusActions = {
      'preparing': [
        {
          id: 'contact-restaurant',
          icon: '🍗',
          label: 'Contact Restaurant',
          action: handleContactRestaurant
        }
      ],
      'out_for_delivery': [
        {
          id: 'contact-driver',
          icon: '🚗',
          label: 'Contact Driver',
          action: handleContactDriver
        },
        {
          id: 'my-location',
          icon: '📍',
          label: 'Use My Location',
          action: handleGetUserLocation,
          loading: geoLoading
        }
      ],
      'delivered': [
        {
          id: 'reorder',
          icon: '🔄',
          label: 'Reorder',
          action: handleReorder
        },
        {
          id: 'rate',
          icon: '⭐',
          label: 'Rate Order',
          action: () => setRatingModalOpen(true)
        }
      ]
    };

    return [...(statusActions[order.status] || []), ...baseActions];
  };

  if (loading) {
    return (
      <div className="track-order-page">
        <div className="loading-container">
          <LoadingSpinner size="large" />
          <p>Loading order tracking...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="track-order-page">
        <EmptyState
          type="error"
          title="Order Not Found"
          message={error || "We couldn't find the order you're looking for."}
          action={{
            label: 'View Order History',
            onClick: () => navigate('/profile/orders')
          }}
        />
      </div>
    );
  }

  return (
    <div className="track-order-page">
      {/* Header Section */}
      <section className="tracking-header">
        <div className="container">
          <div className="header-content">
            <button 
              className="back-button"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
            
            <div className="header-main">
              <h1 className="page-title">Track Your Order</h1>
              <p className="order-number">Order #{order.orderNumber}</p>
              
              {/* Progress Bar */}
              <div className="progress-section">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
                <div className="progress-label">
                  <span>{getProgressPercentage()}% Complete</span>
                  <span>{order.status.replace(/_/g, ' ')}</span>
                </div>
              </div>
            </div>

            <div className="header-actions">
              <button
                className={`btn-icon ${autoRefresh ? 'active' : ''}`}
                onClick={() => setAutoRefresh(!autoRefresh)}
                title={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
              >
                {autoRefresh ? '🔄' : '⏸️'}
                {isPolling && <div className="pulse-dot"></div>}
              </button>
              
              <button
                className={`btn-icon ${notificationsEnabled ? 'active' : ''}`}
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                title={notificationsEnabled ? 'Notifications enabled' : 'Notifications disabled'}
              >
                {notificationsEnabled ? '🔔' : '🔕'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <div className="container">
          <div className="quick-actions-grid">
            {getQuickActions().map(action => (
              <button
                key={action.id}
                className="quick-action-btn"
                onClick={action.action}
                disabled={action.loading}
              >
                <span className="action-icon">{action.icon}</span>
                <span className="action-label">{action.label}</span>
                {action.loading && <LoadingSpinner size="small" />}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="tracking-main">
        <div className="container">
          <div className="tracking-layout">
            {/* Left Column - Timeline & Details */}
            <div className="tracking-left">
              {/* Navigation Tabs */}
              <div className="tracking-tabs">
                <button
                  className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
                  onClick={() => setActiveTab('timeline')}
                >
                  📋 Timeline
                </button>
                <button
                  className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
                  onClick={() => setActiveTab('map')}
                >
                  🗺️ Live Map
                </button>
                <button
                  className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  📄 Order Details
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {/* Timeline Tab */}
                {activeTab === 'timeline' && (
                  <div className="tab-panel">
                    <OrderTimeline
                      status={order.status}
                      events={orderEvents}
                      estimatedTimes={estimatedTimes}
                      currentStage={trackingData?.currentStage}
                    />
                  </div>
                )}

                {/* Map Tab */}
                {activeTab === 'map' && (
                  <div className="tab-panel">
                    <DeliveryMap
                      ref={mapRef}
                      order={order}
                      driverLocation={driverLocation}
                      userLocation={userLocation}
                      restaurantLocation={order.restaurant?.location}
                      deliveryAddress={order.deliveryAddress}
                      onLocationUpdate={setDriverLocation}
                    />
                    
                    {order.status === 'out_for_delivery' && !userLocation && (
                      <div className="location-prompt">
                        <p>Enable location to see real-time delivery tracking</p>
                        <button
                          className="btn-outline"
                          onClick={handleGetUserLocation}
                          disabled={geoLoading}
                        >
                          {geoLoading ? 'Getting Location...' : 'Use My Location'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="tab-panel">
                    <OrderSummary
                      order={order}
                      trackingData={trackingData}
                      onReorder={handleReorder}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="tracking-sidebar">
              {/* Estimated Time */}
              <div className="sidebar-section">
                <EstimatedTime
                  status={order.status}
                  estimatedTimes={estimatedTimes}
                  createdAt={order.createdAt}
                  updatedAt={order.updatedAt}
                />
              </div>

              {/* Driver Info */}
              {order.status === 'out_for_delivery' && trackingData?.driver && (
                <div className="sidebar-section">
                  <DriverInfo
                    driver={trackingData.driver}
                    vehicle={trackingData.vehicle}
                    onContact={handleContactDriver}
                  />
                </div>
              )}

              {/* Restaurant Info */}
              <div className="sidebar-section">
                <div className="restaurant-info">
                  <h3>Restaurant</h3>
                  <div className="restaurant-details">
                    <strong>{order.restaurant?.name}</strong>
                    <p>{order.restaurant?.address}</p>
                    {order.restaurant?.phone && (
                      <a href={`tel:${order.restaurant.phone}`} className="contact-link">
                        📞 {order.restaurant.phone}
                      </a>
                    )}
                  </div>
                  <button
                    className="btn-outline btn-sm"
                    onClick={handleContactRestaurant}
                  >
                    Contact Restaurant
                  </button>
                </div>
              </div>

              {/* Support Options */}
              <div className="sidebar-section">
                <SupportOptions
                  orderId={order.id}
                  orderNumber={order.orderNumber}
                  status={order.status}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {shareModalOpen && (
        <ShareOrderModal
          order={order}
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
        />
      )}

      {ratingModalOpen && (
        <RatingModal
          order={order}
          isOpen={ratingModalOpen}
          onClose={() => setRatingModalOpen(false)}
          onSubmit={handleRateOrder}
        />
      )}

      {/* Auto-refresh Indicator */}
      {isPolling && (
        <div className="refresh-indicator">
          <div className="container">
            <div className="refresh-content">
              <LoadingSpinner size="small" />
              <span>Updating tracking information...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;