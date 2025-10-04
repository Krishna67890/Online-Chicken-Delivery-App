import React, { useState } from 'react';
import './DeliveryForm.css';

const DeliveryForm = ({ onSubmit }) => {
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

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        if (onSubmit) onSubmit(formData);
        setIsSubmitting(false);
        alert('Delivery information submitted successfully!');
      }, 1500);
    }
  };

  return (
    <div className="delivery-form-container">
      <div className="form-header">
        <h2>Delivery Information</h2>
        <p>Please provide your delivery details</p>
      </div>
      
      <form onSubmit={handleSubmit} className="delivery-form">
        <div className="form-section">
          <h3>Contact Information</h3>
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
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
                placeholder="(123) 456-7890"
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="john.doe@example.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
        </div>
        
        <div className="form-section">
          <h3>Delivery Address</h3>
          <div className="form-group">
            <label htmlFor="address">Street Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
              placeholder="123 Main St"
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="apartment">Apartment, Suite, etc. (optional)</label>
            <input
              type="text"
              id="apartment"
              name="apartment"
              value={formData.apartment}
              onChange={handleChange}
              placeholder="Apt 456"
            />
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
              {errors.city && <span className="error-text">{errors.city}</span>}
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
              {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Delivery Options</h3>
          <div className="form-group">
            <label htmlFor="deliveryTime">Preferred Delivery Time</label>
            <select
              id="deliveryTime"
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleChange}
            >
              <option value="asap">As soon as possible</option>
              <option value="30min">In 30 minutes</option>
              <option value="45min">In 45 minutes</option>
              <option value="60min">In 60 minutes</option>
              <option value="schedule">Schedule for later</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="deliveryInstructions">Delivery Instructions (optional)</label>
            <textarea
              id="deliveryInstructions"
              name="deliveryInstructions"
              value={formData.deliveryInstructions}
              onChange={handleChange}
              placeholder="e.g., Gate code, floor, buzzer number, or special instructions"
              rows="3"
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            'Save Delivery Information'
          )}
        </button>
      </form>
    </div>
  );
};

export default DeliveryForm;