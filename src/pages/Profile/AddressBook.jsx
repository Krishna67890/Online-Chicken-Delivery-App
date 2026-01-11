// src/pages/Profile/AddressBook.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../Contexts/NotificationContext';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import './AddressBook.css';

const mapContainerStyle = {
  width: '100%',
  height: '250px',
  borderRadius: '0 0 35px 35px'
};

const AddressBook = () => {
  const navigate = useNavigate();
  const { showSuccess } = useNotifications();
  const [selectedId, setSelectedId] = useState('1');
  const [addresses, setAddresses] = useState([
    { id: '1', type: 'home', label: 'Home', address: 'Flat 402, Sunshine Apts, Nashik', lat: 19.9975, lng: 73.7898 },
    { id: '2', type: 'work', label: 'Work', address: 'Matoshri College Campus, Odha', lat: 19.9415, lng: 73.8944 }
  ]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const handleSelectAddress = (id, label) => {
    setSelectedId(id);
    showSuccess(`${label} address set as delivery destination! 🚚`);
  };

  const handleAddAddress = (type) => {
    showSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} address updated!`);
  };

  return (
    <div className="address-book-page">
      <div className="container">
        <div className="address-header">
          <button className="btn-back" onClick={() => navigate('/home/profile')}>← Back</button>
          <h1>📍 My Saved Addresses</h1>
        </div>

        <p className="selection-hint">Tap an address card to set it as your primary delivery location.</p>

        <div className="address-grid">
          {addresses.map((addr) => (
            <div 
              key={addr.id} 
              className={`address-card-advanced clickable ${selectedId === addr.id ? 'selected' : ''}`}
              onClick={() => handleSelectAddress(addr.id, addr.label)}
            >
              <div className="addr-info">
                <div className="card-top-row">
                  <span className={`addr-badge ${addr.type}`}>{addr.label}</span>
                  {selectedId === addr.id && <span className="active-badge">Selected ✅</span>}
                </div>
                <h3>{addr.address}</h3>
                <div className="card-actions-mini">
                  <button className="btn-edit-mini" onClick={(e) => {e.stopPropagation();}}>Edit ✏️</button>
                </div>
              </div>
              
              <div className="addr-map-preview">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={{ lat: addr.lat, lng: addr.lng }}
                    zoom={15}
                    options={{ disableDefaultUI: true, gestureHandling: 'none' }}
                  >
                    <Marker position={{ lat: addr.lat, lng: addr.lng }} />
                  </GoogleMap>
                ) : (
                  <div className="map-placeholder">Loading Map...</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="quick-add-address">
          <h2>Add New Location</h2>
          <div className="btn-group">
            <button className="btn-outline-lg" onClick={() => handleAddAddress('home')}>🏠 Add Home</button>
            <button className="btn-outline-lg" onClick={() => handleAddAddress('work')}>💼 Add Work</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressBook;