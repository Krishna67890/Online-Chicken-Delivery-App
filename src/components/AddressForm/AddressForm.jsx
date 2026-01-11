import React, { useState, useEffect } from 'react';
import './AddressForm.css';

const AddressForm = ({ 
  address = {}, 
  onSave, 
  onSubmit, // Alias for onSave
  onCancel, 
  onUseSuggestion,
  suggestedAddresses = [],
  serviceAreas = [],
  isLoading = false,
  title = 'Address Details',
  submitButtonText = 'Save Address'
}) => {
  
  // Use onSubmit if provided, otherwise fallback to onSave
  const handleSubmitInternal = onSubmit || onSave;
  const [formData, setFormData] = useState({
    name: address.name || address.recipientName || '',
    street: address.street || '',
    city: address.city || '',
    state: address.state || '',
    zipCode: address.zipCode || '',
    type: address.type || 'home',
    phoneNumber: address.phoneNumber || '',
    instructions: address.instructions || '',
    isDefault: address.isDefault || false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      name: address.name || address.recipientName || '',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.zipCode || '',
      type: address.type || 'home',
      phoneNumber: address.phoneNumber || '',
      instructions: address.instructions || '',
      isDefault: address.isDefault || false
    });
  }, [address]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Recipient name is required';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Invalid ZIP code format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      handleSubmitInternal({
        ...formData,
        recipientName: formData.name // backward compatibility
      });
    }
  };

  return (
    <div className="address-form-overlay">
      <div className="address-form">
        <div className="form-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onCancel} disabled={isLoading}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="address-form-content">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder="John Doe"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="street">Street Address *</label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className={errors.street ? 'error' : ''}
              placeholder="123 Main Street"
            />
            {errors.street && <span className="error-message">{errors.street}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={errors.city ? 'error' : ''}
                placeholder="New York"
              />
              {errors.city && <span className="error-message">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="state">State *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={errors.state ? 'error' : ''}
                placeholder="NY"
              />
              {errors.state && <span className="error-message">{errors.state}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="zipCode">ZIP Code *</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className={errors.zipCode ? 'error' : ''}
                placeholder="10001"
              />
              {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Address Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="instructions">Delivery Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Leave at front door, gate code, etc."
              rows="3"
            ></textarea>
          </div>

          {/* Suggested addresses section */}
          {suggestedAddresses.length > 0 && (
            <div className="suggested-addresses-section">
              <label>Suggested Addresses</label>
              <div className="suggested-addresses-list">
                {suggestedAddresses.map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="suggested-address-item"
                    onClick={() => {
                      setFormData({
                        name: suggestion.name || formData.name,
                        street: suggestion.street || suggestion.address || formData.street,
                        city: suggestion.city || formData.city,
                        state: suggestion.state || formData.state,
                        zipCode: suggestion.zipCode || suggestion.postalCode || formData.zipCode,
                        type: formData.type,
                        phoneNumber: formData.phoneNumber,
                        instructions: formData.instructions,
                        isDefault: formData.isDefault
                      });
                      if (onUseSuggestion) {
                        onUseSuggestion(suggestion);
                      }
                    }}
                  >
                    <div className="suggested-address-text">
                      {suggestion.address || suggestion.formatted_address || 
                       [suggestion.street, suggestion.city, suggestion.state, suggestion.zipCode].filter(Boolean).join(', ')}
                    </div>
                    <div className="suggested-address-details">
                      {suggestion.distance && <span>📍 {suggestion.distance}</span>}
                      {suggestion.eta && <span>⏱️ ETA: {suggestion.eta}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-checkbox">
            <label>
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
              />
              Set as default address
            </label>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;