import React, { useState, useEffect } from 'react';
import './OrderTracker.css';

const OrderTracker = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [driverInfo, setDriverInfo] = useState(null);

  // Simulated order data
  const mockOrderData = {
    id: orderId || "7892",
    status: "preparing",
    orderTime: new Date(Date.now() - 20 * 60000), // 20 minutes ago
    estimatedDelivery: new Date(Date.now() + 25 * 60000), // 25 minutes from now
    items: [
      { name: "Crispy Fried Chicken", quantity: 2, price: 12.99 },
      { name: "French Fries", quantity: 1, price: 4.99 },
      { name: "Coleslaw", quantity: 1, price: 3.99 },
      { name: "Biscuits", quantity: 3, price: 2.99 }
    ],
    total: 38.94,
    deliveryFee: 2.99,
    tax: 3.50,
    grandTotal: 45.43,
    deliveryAddress: "123 Main Street, Apt 4B, Cityville",
    customerName: "John Doe",
    phone: "(555) 123-4567",
    specialInstructions: "Please ring the bell twice"
  };

  // Simulated driver data
  const mockDriverData = {
    name: "Michael Rodriguez",
    rating: 4.8,
    vehicle: "Honda Civic (Blue)",
    licensePlate: "ABC-123",
    phone: "(555) 987-6543",
    estimatedArrival: new Date(Date.now() + 15 * 60000) // 15 minutes from now
  };

  // Order status progression simulation
  useEffect(() => {
    // Simulate initial loading
    const loadTimer = setTimeout(() => {
      setOrder(mockOrderData);
      setDriverInfo(mockDriverData);
      setLoading(false);
    }, 1500);

    // Simulate order status changes
    const statusTimers = [
      setTimeout(() => updateOrderStatus("preparing"), 5000),
      setTimeout(() => updateOrderStatus("cooking"), 10000),
      setTimeout(() => updateOrderStatus("ready"), 18000),
      setTimeout(() => {
        updateOrderStatus("out_for_delivery");
        // Update driver's estimated arrival when order is out for delivery
        setDriverInfo(prev => ({
          ...prev,
          estimatedArrival: new Date(Date.now() + 15 * 60000)
        }));
      }, 25000),
      setTimeout(() => updateOrderStatus("delivered"), 40000)
    ];

    // Update current time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      clearTimeout(loadTimer);
      statusTimers.forEach(timer => clearTimeout(timer));
      clearInterval(timeInterval);
    };
  }, []);

  const updateOrderStatus = (newStatus) => {
    setOrder(prev => ({ ...prev, status: newStatus }));
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getTimeRemaining = (deliveryTime) => {
    const now = currentTime;
    const diffMs = deliveryTime - now;
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins <= 0) return "Any moment now";
    return `in ${diffMins} min`;
  };

  const getStatusPercentage = () => {
    const statusWeights = {
      "preparing": 25,
      "cooking": 50,
      "ready": 75,
      "out_for_delivery": 90,
      "delivered": 100
    };
    return statusWeights[order?.status] || 0;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "preparing": return "📋";
      case "cooking": return "👨‍🍳";
      case "ready": return "✅";
      case "out_for_delivery": return "🚗";
      case "delivered": return "🎉";
      default: return "📦";
    }
  };

  const getStatusDescription = (status) => {
    switch(status) {
      case "preparing": return "Your order is being prepared";
      case "cooking": return "Your food is being cooked";
      case "ready": return "Your order is ready for pickup";
      case "out_for_delivery": return "Your order is on the way";
      case "delivered": return "Your order has been delivered";
      default: return "Order received";
    }
  };

  if (loading) {
    return (
      <div className="order-tracker">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-tracker">
      <div className="tracker-card">
        <div className="tracker-header">
          <h1>Order #{order.id}</h1>
          <p className="order-time">
            {formatDate(order.orderTime)} at {formatTime(order.orderTime)}
          </p>
        </div>

        <div className="status-section">
          <div className="status-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${getStatusPercentage()}%` }}
              ></div>
            </div>
            <div className="status-indicators">
              <div className={`status-indicator ${order.status === 'preparing' ? 'active' : ''}`}>
                <span className="status-icon">📋</span>
                <span className="status-label">Preparing</span>
              </div>
              <div className={`status-indicator ${order.status === 'cooking' ? 'active' : ''}`}>
                <span className="status-icon">👨‍🍳</span>
                <span className="status-label">Cooking</span>
              </div>
              <div className={`status-indicator ${order.status === 'ready' ? 'active' : ''}`}>
                <span className="status-icon">✅</span>
                <span className="status-label">Ready</span>
              </div>
              <div className={`status-indicator ${order.status === 'out_for_delivery' ? 'active' : ''}`}>
                <span className="status-icon">🚗</span>
                <span className="status-label">On the way</span>
              </div>
              <div className={`status-indicator ${order.status === 'delivered' ? 'active' : ''}`}>
                <span className="status-icon">🎉</span>
                <span className="status-label">Delivered</span>
              </div>
            </div>
          </div>

          <div className="current-status">
            <div className="status-badge">
              <span className="status-emoji">{getStatusIcon(order.status)}</span>
              <div>
                <h3>{getStatusDescription(order.status)}</h3>
                <p>Estimated delivery: {formatTime(order.estimatedDelivery)}</p>
              </div>
            </div>
          </div>
        </div>

        {order.status === "out_for_delivery" && driverInfo && (
          <div className="driver-section">
            <h2>Your driver is on the way</h2>
            <div className="driver-card">
              <div className="driver-info">
                <div className="driver-avatar">
                  {driverInfo.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="driver-details">
                  <h3>{driverInfo.name}</h3>
                  <p>⭐ {driverInfo.rating} • {driverInfo.vehicle}</p>
                  <p>Estimated arrival: {getTimeRemaining(driverInfo.estimatedArrival)}</p>
                </div>
              </div>
              <div className="driver-actions">
                <button className="action-btn call">
                  <span>📞</span> Call
                </button>
                <button className="action-btn message">
                  <span>💬</span> Message
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="order-details">
          <h2>Order Summary</h2>
          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <span className="item-quantity">{item.quantity}x</span>
                <span className="item-name">{item.name}</span>
                <span className="item-price">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-line">
              <span>Subtotal</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
            <div className="total-line">
              <span>Delivery Fee</span>
              <span>${order.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="total-line">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="total-line grand-total">
              <span>Total</span>
              <span>${order.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="delivery-info">
          <h2>Delivery Information</h2>
          <div className="info-card">
            <div className="info-row">
              <span className="info-label">Delivery Address:</span>
              <span className="info-value">{order.deliveryAddress}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Contact:</span>
              <span className="info-value">{order.phone}</span>
            </div>
            {order.specialInstructions && (
              <div className="info-row">
                <span className="info-label">Special Instructions:</span>
                <span className="info-value">{order.specialInstructions}</span>
              </div>
            )}
          </div>
        </div>

        <div className="tracker-actions">
          <button className="btn primary">Contact Support</button>
          <button className="btn secondary">View Receipt</button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracker;