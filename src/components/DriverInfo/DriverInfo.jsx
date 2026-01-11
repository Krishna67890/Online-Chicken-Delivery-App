// src/components/DriverInfo/DriverInfo.jsx
import React from 'react';
import './DriverInfo.css';

const DriverInfo = ({ driver, vehicle, onContact }) => {
  if (!driver) {
    return (
      <div className="driver-info">
        <h3>Driver Information</h3>
        <div className="no-driver-info">
          <p>Driver information will be available when your order is out for delivery.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-info">
      <h3>Driver Information</h3>
      
      <div className="driver-details">
        <div className="driver-avatar">
          <div className="avatar-placeholder">👨‍✈️</div>
        </div>
        
        <div className="driver-basic-info">
          <h4>{driver.name || 'John Doe'}</h4>
          <div className="driver-rating">
            <span className="rating-stars">⭐⭐⭐⭐⭐</span>
            <span className="rating-value">{driver.rating || '4.9'}</span>
          </div>
          <div className="driver-status">
            <span className="status-indicator active"></span>
            <span>Online & Available</span>
          </div>
        </div>
      </div>

      {vehicle && (
        <div className="vehicle-info">
          <h5>Vehicle</h5>
          <div className="vehicle-details">
            <div className="vehicle-item">
              <span className="vehicle-label">Make & Model:</span>
              <span className="vehicle-value">{vehicle.make || 'Toyota'} {vehicle.model || 'Camry'}</span>
            </div>
            <div className="vehicle-item">
              <span className="vehicle-label">License Plate:</span>
              <span className="vehicle-value">{vehicle.licensePlate || 'ABC-123'}</span>
            </div>
            <div className="vehicle-item">
              <span className="vehicle-label">Color:</span>
              <span className="vehicle-value">{vehicle.color || 'White'}</span>
            </div>
          </div>
        </div>
      )}

      <div className="driver-actions">
        <button className="btn-primary" onClick={onContact}>
          📞 Contact Driver
        </button>
        
        <div className="driver-eta">
          <span className="eta-label">Estimated Arrival:</span>
          <span className="eta-value">{driver.eta || '5-10 min'}</span>
        </div>
      </div>

      {driver.specialNotes && (
        <div className="driver-notes">
          <h5>Special Notes</h5>
          <p>{driver.specialNotes}</p>
        </div>
      )}
    </div>
  );
};

export default DriverInfo;