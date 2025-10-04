// src/Common/components/OrderSummary/OrderSummary.jsx
import React, { useState, useEffect } from 'react';
import './OrderSummary.css';

const OrderSummary = ({ 
  cartItems, 
  total, 
  deliveryInfo, 
  paymentInfo, 
  onEditSection,
  onPlaceOrder,
  isSubmitting = false 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    items: true,
    delivery: true,
    payment: true
  });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');

  // Sample delivery fees and taxes
  const deliveryFee = 2.99;
  const taxRate = 0.0825; // 8.25%
  const taxAmount = total * taxRate;

  // Calculate final total
  const discountAmount = appliedCoupon ? total * (appliedCoupon.discount / 100) : 0;
  const finalTotal = total + deliveryFee + taxAmount - discountAmount;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const applyCoupon = () => {
    // Simulate coupon validation
    const coupons = {
      'CHICKEN10': { discount: 10, name: '10% Off' },
      'WELCOME15': { discount: 15, name: '15% Welcome Discount' },
      'FREEDELIVERY': { discount: deliveryFee, name: 'Free Delivery', isFixed: true }
    };

    if (coupons[couponCode.toUpperCase()]) {
      setAppliedCoupon(coupons[couponCode.toUpperCase()]);
      setCouponMessage('Coupon applied successfully!');
      setTimeout(() => setCouponMessage(''), 3000);
    } else {
      setCouponMessage('Invalid coupon code');
      setTimeout(() => setCouponMessage(''), 3000);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  // Animation effect for items
  useEffect(() => {
    const items = document.querySelectorAll('.order-item');
    items.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
    });
  }, [cartItems]);

  return (
    <div className="order-summary">
      <div className="summary-header">
        <h2>Order Summary</h2>
        <p>Review your order before placing it</p>
      </div>

      {/* Items Section */}
      <div className="summary-section">
        <div className="section-header" onClick={() => toggleSection('items')}>
          <div className="section-title">
            <span className="section-icon">🛒</span>
            <h3>Order Items ({cartItems.length})</h3>
          </div>
          <button className="toggle-btn">
            {expandedSections.items ? '▲' : '▼'}
          </button>
        </div>
        
        {expandedSections.items && (
          <div className="section-content">
            <div className="order-items">
              {cartItems.map((item, index) => (
                <div key={item.id} className="order-item">
                  <div className="item-image">{item.image}</div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="item-description">{item.description}</p>
                    <div className="item-meta">
                      <span className="item-price">${item.price.toFixed(2)} each</span>
                      <span className="item-calories">🔥 ~320 cal</span>
                    </div>
                  </div>
                  <div className="item-quantity">
                    <span className="quantity-badge">×{item.quantity}</span>
                    <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="edit-btn"
              onClick={() => onEditSection('items')}
            >
              Edit Items
            </button>
          </div>
        )}
      </div>

      {/* Delivery Section */}
      <div className="summary-section">
        <div className="section-header" onClick={() => toggleSection('delivery')}>
          <div className="section-title">
            <span className="section-icon">📍</span>
            <h3>Delivery Information</h3>
          </div>
          <button className="toggle-btn">
            {expandedSections.delivery ? '▲' : '▼'}
          </button>
        </div>
        
        {expandedSections.delivery && deliveryInfo && (
          <div className="section-content">
            <div className="delivery-details">
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{deliveryInfo.firstName} {deliveryInfo.lastName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{deliveryInfo.address}, {deliveryInfo.city}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Contact:</span>
                <span className="detail-value">{deliveryInfo.phone} • {deliveryInfo.email}</span>
              </div>
              {deliveryInfo.deliveryInstructions && (
                <div className="detail-row">
                  <span className="detail-label">Instructions:</span>
                  <span className="detail-value">{deliveryInfo.deliveryInstructions}</span>
                </div>
              )}
              <div className="delivery-estimate">
                <span className="estimate-icon">⏱</span>
                Estimated delivery: 25-35 minutes
              </div>
            </div>
            <button 
              className="edit-btn"
              onClick={() => onEditSection('delivery')}
            >
              Change Delivery
            </button>
          </div>
        )}
      </div>

      {/* Payment Section */}
      <div className="summary-section">
        <div className="section-header" onClick={() => toggleSection('payment')}>
          <div className="section-title">
            <span className="section-icon">💳</span>
            <h3>Payment Method</h3>
          </div>
          <button className="toggle-btn">
            {expandedSections.payment ? '▲' : '▼'}
          </button>
        </div>
        
        {expandedSections.payment && paymentInfo && (
          <div className="section-content">
            <div className="payment-details">
              <div className="payment-card">
                <div className="card-icon">💳</div>
                <div className="card-info">
                  <span className="card-type">{paymentInfo.cardType}</span>
                  <span className="card-number">•••• •••• •••• {paymentInfo.last4Digits}</span>
                </div>
              </div>
              <div className="billing-address">
                <span className="detail-label">Billing Address:</span>
                <span className="detail-value">Same as delivery address</span>
              </div>
            </div>
            <button 
              className="edit-btn"
              onClick={() => onEditSection('payment')}
            >
              Change Payment
            </button>
          </div>
        )}
      </div>

      {/* Coupon Section */}
      <div className="coupon-section">
        {!appliedCoupon ? (
          <div className="coupon-form">
            {showCouponForm ? (
              <div className="coupon-input-group">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="coupon-input"
                />
                <button onClick={applyCoupon} className="apply-coupon-btn">
                  Apply
                </button>
                <button 
                  onClick={() => setShowCouponForm(false)}
                  className="cancel-coupon-btn"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowCouponForm(true)}
                className="add-coupon-btn"
              >
                <span className="coupon-icon">🎁</span>
                Add a coupon code
              </button>
            )}
            {couponMessage && (
              <div className={`coupon-message ${couponMessage.includes('Invalid') ? 'error' : 'success'}`}>
                {couponMessage}
              </div>
            )}
          </div>
        ) : (
          <div className="applied-coupon">
            <span className="coupon-success">✅ Coupon Applied: {appliedCoupon.name}</span>
            <button onClick={removeCoupon} className="remove-coupon-btn">
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="price-breakdown">
        <div className="price-row">
          <span>Subtotal:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        
        {appliedCoupon && (
          <div className="price-row discount">
            <span>Discount ({appliedCoupon.name}):</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="price-row">
          <span>Delivery Fee:</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>
        
        <div className="price-row">
          <span>Tax ({taxRate * 100}%):</span>
          <span>${taxAmount.toFixed(2)}</span>
        </div>
        
        <div className="price-divider"></div>
        
        <div className="price-row total">
          <span>Total:</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="place-order-section">
        <button 
          onClick={onPlaceOrder}
          disabled={isSubmitting || cartItems.length === 0}
          className={`place-order-btn ${isSubmitting ? 'submitting' : ''}`}
        >
          {isSubmitting ? (
            <>
              <div className="loading-spinner"></div>
              Processing Your Order...
            </>
          ) : (
            `Place Order - $${finalTotal.toFixed(2)}`
          )}
        </button>
        
        <p className="order-disclaimer">
          By placing your order, you agree to our{' '}
          <a href="#terms">Terms of Service</a> and{' '}
          <a href="#privacy">Privacy Policy</a>
        </p>
      </div>

      {/* Security Badge */}
      <div className="security-badge">
        <div className="security-icon">🔒</div>
        <div className="security-text">
          <strong>Secure Payment</strong>
          <span>Your information is encrypted and secure</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;