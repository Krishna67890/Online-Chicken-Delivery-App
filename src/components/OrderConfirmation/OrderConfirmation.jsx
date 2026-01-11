// src/components/OrderConfirmation/OrderConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { useCart } from '../../Contexts/CartContext';
import './OrderConfirmation.css';

const OrderConfirmation = ({ orderDetails, onClose, onTrackOrder }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);
  const { cartItems } = useCart();

  // Generate random order details if none provided
  const order = orderDetails || {
    id: `CHK${Math.floor(10000 + Math.random() * 90000)}`,
    items: cartItems.length > 0 ? cartItems : [
      { name: 'Crispy Fried Chicken', quantity: 2, price: 12.99 },
      { name: 'French Fries', quantity: 1, price: 3.99 },
      { name: 'Coleslaw', quantity: 1, price: 2.99 }
    ],
    total: cartItems.length > 0 ? cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 32.96,
    deliveryAddress: '123 Main St, Anytown, USA',
    estimatedDelivery: new Date(Date.now() + 30 * 60000), // 30 minutes from now
    customerName: 'Youraj Khandhare'
  };

  const orderSteps = [
    { label: 'Order Received', icon: '📋', time: 'Just now' },
    { label: 'Preparing', icon: '👨‍🍳', time: '2 mins ago' },
    { label: 'Quality Check', icon: '✅', time: '5 mins ago' },
    { label: 'Out for Delivery', icon: '🚗', time: 'Coming soon' },
    { label: 'Delivered', icon: '🎉', time: 'Estimated: 25 min' }
  ];

  useEffect(() => {
    // Progress animation
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Step animation
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 3) {
          clearInterval(stepTimer);
          return 3;
        }
        return prev + 1;
      });
    }, 1500);

    // Confetti effect
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
      clearTimeout(confettiTimer);
    };
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="order-confirmation-overlay">
      {/* Confetti animation */}
      {showConfetti && (
        <div className="confetti">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i} 
              className="confetti-piece"
              style={{
                '--rotation': `${Math.random() * 360}deg`,
                '--delay': `${Math.random() * 2}s`,
                '--x': `${Math.random() * 100}vw`,
                '--y': `${Math.random() * 100}vh`,
                '--size': `${5 + Math.random() * 10}px`,
                '--color': `hsl(${Math.random() * 360}, 100%, 50%)`
              }}
            ></div>
          ))}
        </div>
      )}

      <div className="order-confirmation">
        {/* Header */}
        <div className="confirmation-header">
          <div className="success-animation">
            <div className="checkmark">✓</div>
            <div className="circle"></div>
          </div>
          <h1>Order Confirmed!</h1>
          <p className="confirmation-subtitle">
            Your delicious chicken is on its way to you
          </p>
        </div>

        {/* Order Summary */}
        <div className="order-summary-card">
          <h3>Order Summary</h3>
          <div className="order-details">
            <div className="detail-row">
              <span>Order #</span>
              <strong>{order.id}</strong>
            </div>
            <div className="detail-row">
              <span>Estimated Delivery</span>
              <strong>{formatTime(order.estimatedDelivery)}</strong>
            </div>
            <div className="detail-row">
              <span>Total Amount</span>
              <strong>${order.total.toFixed(2)}</strong>
            </div>
          </div>

          <div className="order-items">
            <h4>Items Ordered</h4>
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <span className="item-quantity">{item.quantity}x</span>
                <span className="item-name">{item.name}</span>
                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="progress-tracker">
          <h3>Order Status</h3>
          <div className="progress-steps">
            {orderSteps.map((step, index) => (
              <div 
                key={index} 
                className={`progress-step ${index <= currentStep ? 'completed' : ''} ${index === currentStep ? 'current' : ''}`}
              >
                <div className="step-icon">{step.icon}</div>
                <div className="step-content">
                  <span className="step-label">{step.label}</span>
                  <span className="step-time">{step.time}</span>
                </div>
                {index < orderSteps.length - 1 && (
                  <div className="step-connector"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Map (Placeholder) */}
        <div className="delivery-map">
          <h3>Delivery Route</h3>
          <div className="map-placeholder">
            <div className="map-marker">
              <div className="marker-pulse"></div>
              <div className="marker-icon">🍗</div>
            </div>
            <div className="route-line"></div>
            <div className="destination-marker">
              <div className="destination-icon">🏠</div>
            </div>
          </div>
          <p className="delivery-address">
            Delivery to: {order.deliveryAddress}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="confirmation-actions">
          <button 
            className="btn-primary track-order-btn"
            onClick={onTrackOrder}
          >
            <span className="btn-icon">🚗</span>
            Live Track Order
          </button>
          <button 
            className="btn-secondary view-receipt-btn"
            onClick={() => window.print()}
          >
            <span className="btn-icon">🧾</span>
            Download Receipt
          </button>
          <button 
            className="btn-text close-btn"
            onClick={onClose}
          >
            Continue Browsing
          </button>
        </div>

        {/* Support Info */}
        <div className="support-info">
          <p>Need help with your order?</p>
          <div className="support-contacts">
            <a href="tel:+15551234567" className="support-link">
              <span className="support-icon">📞</span>
              (555) 123-4567
            </a>
            <a href="mailto:support@chickendelight.com" className="support-link">
              <span className="support-icon">✉️</span>
              support@chickendelight.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;