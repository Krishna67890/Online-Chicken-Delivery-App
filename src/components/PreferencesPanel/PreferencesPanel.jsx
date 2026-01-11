import React, { useState } from 'react';
import './PreferencesPanel.css';

const PreferencesPanel = ({ 
  preferences = {}, 
  onPreferencesChange,
  title = 'Preferences',
  showSaveButton = true,
  onSave 
}) => {
  const [localPreferences, setLocalPreferences] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: true
    },
    privacy: {
      profilePublic: false,
      locationSharing: true,
      dataSharing: false
    },
    delivery: {
      autoConfirm: true,
      contactless: true,
      specificInstructions: true
    },
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false
    },
    ...preferences
  });

  const handlePreferenceChange = (category, key, value) => {
    const updatedPreferences = {
      ...localPreferences,
      [category]: {
        ...localPreferences[category],
        [key]: value
      }
    };
    
    setLocalPreferences(updatedPreferences);
    
    if (onPreferencesChange) {
      onPreferencesChange(updatedPreferences);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(localPreferences);
    }
  };

  const preferenceSections = [
    {
      id: 'notifications',
      title: 'Notifications',
      icon: '🔔',
      preferences: [
        { key: 'email', label: 'Email Notifications', type: 'toggle' },
        { key: 'push', label: 'Push Notifications', type: 'toggle' },
        { key: 'sms', label: 'SMS Notifications', type: 'toggle' },
        { key: 'marketing', label: 'Marketing Communications', type: 'toggle' }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy',
      icon: '🔒',
      preferences: [
        { key: 'profilePublic', label: 'Profile Visible to Public', type: 'toggle' },
        { key: 'locationSharing', label: 'Share Location for Delivery', type: 'toggle' },
        { key: 'dataSharing', label: 'Share Data with Partners', type: 'toggle' }
      ]
    },
    {
      id: 'delivery',
      title: 'Delivery',
      icon: '🚚',
      preferences: [
        { key: 'autoConfirm', label: 'Auto-confirm Orders', type: 'toggle' },
        { key: 'contactless', label: 'Prefer Contactless Delivery', type: 'toggle' },
        { key: 'specificInstructions', label: 'Show Delivery Instructions', type: 'toggle' }
      ]
    },
    {
      id: 'dietary',
      title: 'Dietary Preferences',
      icon: '🥗',
      preferences: [
        { key: 'vegetarian', label: 'Vegetarian', type: 'toggle' },
        { key: 'vegan', label: 'Vegan', type: 'toggle' },
        { key: 'glutenFree', label: 'Gluten Free', type: 'toggle' },
        { key: 'dairyFree', label: 'Dairy Free', type: 'toggle' }
      ]
    }
  ];

  return (
    <div className="preferences-panel">
      <h3 className="preferences-title">{title}</h3>
      
      {preferenceSections.map(section => (
        <div key={section.id} className="preference-section">
          <div className="section-header">
            <div className="section-icon">{section.icon}</div>
            <h4 className="section-title">{section.title}</h4>
          </div>
          
          <div className="preference-items">
            {section.preferences.map(pref => (
              <div key={pref.key} className="preference-item">
                <label className="preference-label">
                  <input
                    type="checkbox"
                    checked={localPreferences[section.id]?.[pref.key] || false}
                    onChange={(e) => handlePreferenceChange(section.id, pref.key, e.target.checked)}
                    className="preference-checkbox"
                  />
                  <span className="preference-text">{pref.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      {showSaveButton && (
        <div className="preferences-actions">
          <button className="btn-save-preferences" onClick={handleSave}>
            Save Preferences
          </button>
        </div>
      )}
    </div>
  );
};

export default PreferencesPanel;