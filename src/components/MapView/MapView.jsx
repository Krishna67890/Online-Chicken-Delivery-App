import React, { useState, useEffect } from 'react';
import './MapView.css';

const MapView = ({ 
  address, 
  coordinates, 
  isOpen, 
  onClose, 
  title = 'Location Map',
  showControls = true 
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentCoordinates, setCurrentCoordinates] = useState({
    lat: coordinates?.lat || address?.latitude || 40.7128, // Default to NYC
    lng: coordinates?.lng || address?.longitude || -74.0060
  });

  useEffect(() => {
    if (address?.latitude && address?.longitude) {
      setCurrentCoordinates({
        lat: address.latitude,
        lng: address.longitude
      });
    } else if (coordinates) {
      setCurrentCoordinates(coordinates);
    }
  }, [address, coordinates]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Format address for display
  const formattedAddress = address ? [
    address.street,
    address.city,
    address.state,
    address.zipCode
  ].filter(Boolean).join(', ') : 'Location';

  return (
    <div className="map-modal-backdrop" onClick={handleBackdropClick}>
      <div className="map-modal">
        <div className="map-header">
          <h3 className="map-title">{title}</h3>
          <button className="map-close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="map-content">
          <div className="map-container">
            {/* Mock map implementation - in a real app, this would be an actual map component */}
            <div className="mock-map">
              <div className="map-center-marker">📍</div>
              <div className="map-grid">
                {/* Grid lines for mock map */}
                <div className="grid-line horizontal"></div>
                <div className="grid-line horizontal bottom"></div>
                <div className="grid-line vertical"></div>
                <div className="grid-line vertical right"></div>
              </div>
              <div className="map-location-pin" style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}>
                <div className="location-marker">📍</div>
              </div>
            </div>
          </div>

          <div className="map-info">
            <div className="location-info">
              <h4>Address</h4>
              <p className="location-address">{formattedAddress}</p>
              <p className="location-coordinates">
                {currentCoordinates.lat.toFixed(6)}, {currentCoordinates.lng.toFixed(6)}
              </p>
            </div>

            {showControls && (
              <div className="map-controls">
                <button className="map-control-btn">📍 My Location</button>
                <button className="map-control-btn">🔍 Search</button>
                <button className="map-control-btn">🚗 Directions</button>
              </div>
            )}
          </div>
        </div>

        <div className="map-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapView;