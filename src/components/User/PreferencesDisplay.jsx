// src/components/User/PreferencesDisplay.jsx
import React from 'react';
import '../../pages/Profile/Profile.css';

const PreferencesDisplay = ({ preferences, onEdit }) => {
  return (
    <div className="preferences-section">
      <h2 className="section-title">Account Preferences</h2>
      <div className="preferences-content">
        <div className="preferences-card">
          <h3>🍽️ Dietary Preferences</h3>
          <p>Manage your dietary restrictions and food preferences</p>
          <div className="preferences-list">
            {preferences.dietaryRestrictions?.length > 0 ? (
              <div className="dietary-tags">
                {preferences.dietaryRestrictions.map((restriction, index) => (
                  <span key={index} className="tag tag-primary">
                    {restriction.charAt(0).toUpperCase() + restriction.slice(1).replace(/([A-Z])/g, ' $1')}
                  </span>
                ))}
              </div>
            ) : (
              <p className="no-preferences">No dietary restrictions set</p>
            )}
          </div>
        </div>

        <div className="preferences-card">
          <h3>🔔 Notification Settings</h3>
          <p>Control how you receive notifications</p>
          <div className="notification-settings">
            <div className="setting-item">
              <span>Email: </span>
              <span className={`status-badge ${preferences.notificationSettings?.email ? 'status-active' : 'status-inactive'}`}>
                {preferences.notificationSettings?.email ? 'On' : 'Off'}
              </span>
            </div>
            <div className="setting-item">
              <span>SMS: </span>
              <span className={`status-badge ${preferences.notificationSettings?.sms ? 'status-active' : 'status-inactive'}`}>
                {preferences.notificationSettings?.sms ? 'On' : 'Off'}
              </span>
            </div>
            <div className="setting-item">
              <span>Push: </span>
              <span className={`status-badge ${preferences.notificationSettings?.push ? 'status-active' : 'status-inactive'}`}>
                {preferences.notificationSettings?.push ? 'On' : 'Off'}
              </span>
            </div>
          </div>
        </div>

        <div className="preferences-card">
          <h3>🚚 Delivery Preferences</h3>
          <p>Manage your delivery settings</p>
          <div className="delivery-settings">
            <div className="setting-item">
              <span>Auto-confirm orders: </span>
              <span className={`status-badge ${preferences.deliveryPreferences?.autoConfirm ? 'status-active' : 'status-inactive'}`}>
                {preferences.deliveryPreferences?.autoConfirm ? 'On' : 'Off'}
              </span>
            </div>
            <div className="setting-item">
              <span>Save delivery notes: </span>
              <span className={`status-badge ${preferences.deliveryPreferences?.saveDeliveryNotes ? 'status-active' : 'status-inactive'}`}>
                {preferences.deliveryPreferences?.saveDeliveryNotes ? 'On' : 'Off'}
              </span>
            </div>
            <div className="setting-item">
              <span>Preferred delivery time: </span>
              <span className="status-badge status-info">
                {preferences.deliveryPreferences?.preferredDeliveryTime?.charAt(0).toUpperCase() + preferences.deliveryPreferences?.preferredDeliveryTime?.slice(1) || 'Any Time'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="preferences-actions">
        <button 
          className="btn-primary"
          onClick={onEdit}
        >
          Edit Preferences
        </button>
      </div>
    </div>
  );
};

export default PreferencesDisplay;