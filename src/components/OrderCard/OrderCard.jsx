import React, { useState } from 'react';
import './OrderCard.css';

const OrderCard = ({ order, onStatusUpdate, onReorder }) => {
  const [expanded, setExpanded] = useState(false);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return '#4CAF50';
      case 'preparing': return '#FF9800';
      case 'on-the-way': return '#2196F3';
      case 'cancelled': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`order-card ${order.status} ${expanded ? 'expanded' : ''}`}>
      <div className="order-header" onClick={toggleExpand}>
        <div className="order-info">
          <h3>Order #{order.id}</h3>
          <p className="order-date">{formatDate(order.orderDate)}</p>
        </div>
        <div className="order-status">
          <span 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(order.status) }}
          >
            {order.status.replace('-', ' ')}
          </span>
          <div className="order-price">${calculateTotal(order.items).toFixed(2)}</div>
        </div>
      </div>

      {expanded && (
        <div className="order-details">
          <div className="delivery-info">
            <h4>Delivery Information</h4>
            <p><strong>Address:</strong> {order.deliveryAddress}</p>
            <p><strong>Estimated Delivery:</strong> {formatDate(order.estimatedDelivery)}</p>
          </div>

          <div className="items-list">
            <h4>Order Items</h4>
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-details">
                  <h5>{item.name}</h5>
                  <p>{item.description}</p>
                </div>
                <div className="item-price">
                  <span>${item.price.toFixed(2)} x {item.quantity}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="order-actions">
            {order.status === 'delivered' && (
              <button 
                className="reorder-btn"
                onClick={() => onReorder(order)}
              >
                Reorder
              </button>
            )}
            
            {(order.status === 'preparing' || order.status === 'on-the-way') && (
              <button 
                className="track-btn"
                onClick={() => {/* Implement tracking */}}
              >
                Track Order
              </button>
            )}
            
            {order.status === 'delivered' && (
              <button 
                className="rate-btn"
                onClick={() => {/* Implement rating */}}
              >
                Rate Order
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ 
            width: order.status === 'preparing' ? '33%' : 
                   order.status === 'on-the-way' ? '66%' : 
                   order.status === 'delivered' ? '100%' : '0%' 
          }}
        ></div>
      </div>
    </div>
  );
};

export default OrderCard;