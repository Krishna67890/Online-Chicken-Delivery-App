// src/components/DeliveryMap/DeliveryMap.jsx
import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import './DeliveryMap.css';

const DeliveryMap = forwardRef(({ 
  order, 
  driverLocation, 
  userLocation, 
  restaurantLocation, 
  deliveryAddress,
  onLocationUpdate 
}, ref) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    updateUserLocation: (position) => {
      // Update user location state
      // This would be handled by the parent component
    }
  }));

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Simulate location updates
  useEffect(() => {
    if (order?.status === 'out_for_delivery' && driverLocation) {
      // Simulate driver location updates
      const interval = setInterval(() => {
        if (onLocationUpdate) {
          // In a real app, this would come from a location service
          onLocationUpdate({
            ...driverLocation,
            latitude: driverLocation.latitude + (Math.random() - 0.5) * 0.001,
            longitude: driverLocation.longitude + (Math.random() - 0.5) * 0.001
          });
        }
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [order?.status, driverLocation, onLocationUpdate]);

  return (
    <div className="delivery-map">
      <div className="map-header">
        <h3>Live Delivery Tracking</h3>
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-color restaurant-color"></div>
            <span>Restaurant</span>
          </div>
          <div className="legend-item">
            <div className="legend-color driver-color"></div>
            <span>Driver</span>
          </div>
          <div className="legend-item">
            <div className="legend-color user-color"></div>
            <span>Your Location</span>
          </div>
        </div>
      </div>

      <div className="map-container">
        {!mapLoaded ? (
          <div className="map-placeholder">
            <div className="loading-spinner">🗺️</div>
            <p>Loading map...</p>
          </div>
        ) : (
          <div className="map-visualization">
            {/* Restaurant location */}
            {restaurantLocation && (
              <div 
                className="map-marker restaurant-marker"
                style={{
                  top: `${50 - (restaurantLocation.latitude - 40.7128) * 1000}px`,
                  left: `${50 + (restaurantLocation.longitude - -74.0060) * 1000}px`
                }}
              >
                <div className="marker-icon">🍗</div>
                <div className="marker-label">Restaurant</div>
              </div>
            )}

            {/* Driver location */}
            {driverLocation && (
              <div 
                className="map-marker driver-marker"
                style={{
                  top: `${50 - (driverLocation.latitude - 40.7128) * 1000}px`,
                  left: `${50 + (driverLocation.longitude - -74.0060) * 1000}px`
                }}
              >
                <div className="marker-icon driver-icon">🚚</div>
                <div className="marker-label">Driver</div>
              </div>
            )}

            {/* User location */}
            {userLocation && (
              <div 
                className="map-marker user-marker"
                style={{
                  top: `${50 - (userLocation.latitude - 40.7128) * 1000}px`,
                  left: `${50 + (userLocation.longitude - -74.0060) * 1000}px`
                }}
              >
                <div className="marker-icon">📍</div>
                <div className="marker-label">You</div>
              </div>
            )}

            {/* Route visualization */}
            <div className="route-line">
              {restaurantLocation && driverLocation && (
                <svg className="route-svg" viewBox="0 0 100 100">
                  <path 
                    d={`M ${50 + (restaurantLocation.longitude - -74.0060) * 1000} ${50 - (restaurantLocation.latitude - 40.7128) * 1000} 
                        Q ${(50 + (restaurantLocation.longitude - -74.0060) * 1000 + 50 + (driverLocation.longitude - -74.0060) * 1000) / 2} 
                        ${(50 - (restaurantLocation.latitude - 40.7128) * 1000 + 50 - (driverLocation.latitude - 40.7128) * 1000) / 2} 
                        ${50 + (driverLocation.longitude - -74.0060) * 1000} ${50 - (driverLocation.latitude - 40.7128) * 1000}`}
                    stroke="var(--primary)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                  />
                </svg>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="map-info">
        <div className="delivery-info">
          <h4>Delivery Information</h4>
          <div className="info-item">
            <span className="info-label">Restaurant:</span>
            <span className="info-value">{order?.restaurant?.name || 'Chicken Express'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Delivery Address:</span>
            <span className="info-value">{deliveryAddress?.address || '123 Main St'}</span>
          </div>
          {driverLocation && (
            <div className="info-item">
              <span className="info-label">Driver Distance:</span>
              <span className="info-value">~{Math.floor(Math.random() * 5) + 1} min away</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

DeliveryMap.displayName = 'DeliveryMap';

export default DeliveryMap;