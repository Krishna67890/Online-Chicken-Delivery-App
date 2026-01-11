import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import './DeliveryForm.css';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '12px',
  marginTop: '15px'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

const DeliveryForm = ({ onSubmit }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    apartment: '',
    city: '',
    zipCode: '',
    deliveryInstructions: '',
    deliveryTime: 'asap'
  });

  const [markerPos, setMarkerPos] = useState(defaultCenter);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const onMapClick = (e) => {
    const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPos(newPos);
    // In a real app, we would reverse-geocode this to update the address field
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setTimeout(() => {
        if (onSubmit) onSubmit({ ...formData, coordinates: markerPos });
        setIsSubmitting(false);
      }, 1500);
    }
  };

  return (
    <div className="delivery-form-container">
      <div className="form-header">
        <h2>🚚 Delivery Tracking & Details</h2>
        <p>Pin your location on the map for precise delivery</p>
      </div>
      
      <form onSubmit={handleSubmit} className="delivery-form">
        <div className="form-section">
          <div className="map-wrapper">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={markerPos}
                zoom={13}
                onClick={onMapClick}
              >
                <Marker position={markerPos} draggable={true} />
              </GoogleMap>
            ) : (
              <div className="map-placeholder">Loading Map...</div>
            )}
            <small className="map-hint">Tap the map to set your exact delivery point</small>
          </div>
        </div>

        <div className="form-section">
          <h3>Contact Info</h3>
          <div className="form-row">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className={errors.name ? 'error' : ''} />
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className={errors.phone ? 'error' : ''} />
          </div>
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street Address" className={errors.address ? 'error' : ''} />
        </div>
        
        <button type="submit" className={`submit-button ${isSubmitting ? 'submitting' : ''}`} disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Confirm Order Location'}
        </button>
      </form>
    </div>
  );
};

export default DeliveryForm;