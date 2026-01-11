import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cartService } from '../../services/cartService';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, total, items } = location.state || {};

  useEffect(() => {
    // Clear cart after successful order
    cartService.clearCart();
  }, []);

  if (!orderId) {
    return (
      <div className="order-confirmation-container">
        <div className="order-error">
          <h2>No Order Found</h2>
          <p>It seems there was an issue with your order. Please try again.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/menu')}
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation-container">
      <div className="order-confirmation-content">
        <div className="confirmation-icon">✅</div>
        <h1>Order Confirmed!</h1>
        <p className="confirmation-message">
          Thank you for your order! Your delicious chicken dishes are being prepared.
        </p>
        
        <div className="order-details">
          <h3>Order Details</h3>
          <div className="detail-item">
            <span className="label">Order ID:</span>
            <span className="value">#{orderId}</span>
          </div>
          <div className="detail-item">
            <span className="label">Total Amount:</span>
            <span className="value">${total?.toFixed(2)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Items Ordered:</span>
            <span className="value">{items?.length || 0}</span>
          </div>
        </div>

        <div className="estimated-time">
          <h3>Estimated Delivery Time</h3>
          <p className="time">25-35 minutes</p>
        </div>

        <div className="order-items">
          <h3>Items in Your Order</h3>
          <div className="items-list">
            {(items || []).map((item, index) => (
              <div key={index} className="order-item">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">Qty: {item.quantity}</span>
                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="confirmation-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/orders')}
          >
            View Order Status
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/menu')}
          >
            Order More
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;