import React from 'react';
import './OrderTrackingModal.css';

const OrderTrackingModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  // Define order status progression
  const statusSteps = [
    { status: 'confirmed', label: 'Order Confirmed', icon: '✅' },
    { status: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
    { status: 'ready', label: 'Ready for Pickup', icon: '📦' },
    { status: 'out_for_delivery', label: 'Out for Delivery', icon: '🚚' },
    { status: 'delivered', label: 'Delivered', icon: '🎉' }
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.status === order.status);
  const isDelivered = order.status === 'delivered';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content tracking-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Track Order</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="tracking-header">
            <h3>Order #{order.orderNumber}</h3>
            <div className="order-status">
              <span className={`status-badge ${order.status}`}>
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="order-time">
              Placed: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="tracking-timeline">
            <h4>Order Progress</h4>
            <div className="timeline-steps">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div 
                    key={step.status} 
                    className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                  >
                    <div className="step-icon">
                      {isCompleted ? '✓' : step.icon}
                    </div>
                    <div className="step-content">
                      <h5>{step.label}</h5>
                      {isCurrent && (
                        <p className="current-status">Current Status</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="tracking-details">
            <h4>Order Details</h4>
            <div className="detail-item">
              <span className="detail-label">Restaurant</span>
              <span className="detail-value">{order.restaurantName || 'Chicken Delivery Store'}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Delivery Address</span>
              <span className="detail-value">{order.deliveryAddress?.street || order.deliveryAddress}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Estimated Delivery</span>
              <span className="detail-value">
                {order.estimatedDelivery 
                  ? new Date(order.estimatedDelivery).toLocaleTimeString() 
                  : 'Calculating...'}
              </span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Total</span>
              <span className="detail-value">${order.total?.toFixed(2)}</span>
            </div>
          </div>

          {order.driver && (
            <div className="driver-info">
              <h4>Driver Information</h4>
              <div className="driver-details">
                <div className="driver-avatar">
                  {order.driver.name?.charAt(0) || 'D'}
                </div>
                <div className="driver-content">
                  <h5>{order.driver.name || 'Delivery Driver'}</h5>
                  <p>Driver ID: {order.driver.id}</p>
                  {order.driver.phone && (
                    <a href={`tel:${order.driver.phone}`} className="contact-link">
                      📞 {order.driver.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;