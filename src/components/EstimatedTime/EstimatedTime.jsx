// src/components/EstimatedTime/EstimatedTime.jsx
import React, { useState, useEffect } from 'react';
import './EstimatedTime.css';

const EstimatedTime = ({ status, estimatedTimes, createdAt, updatedAt }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  const getTimeRemaining = (targetTime) => {
    if (!targetTime) return null;
    const diff = new Date(targetTime) - currentTime;
    
    if (diff <= 0) return 'Now';

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  const getStatusInfo = () => {
    switch (status) {
      case 'pending':
        return {
          title: 'Order Confirmed',
          subtitle: 'Getting ready for preparation',
          icon: '🛒',
          timeLabel: 'Estimated Ready Time',
          timeValue: estimatedTimes?.readyAt ? formatTime(estimatedTimes.readyAt) : 'TBD',
          timeRemaining: estimatedTimes?.readyAt ? getTimeRemaining(estimatedTimes.readyAt) : null
        };
      case 'confirmed':
        return {
          title: 'Order Confirmed',
          subtitle: 'Preparing your order',
          icon: '✅',
          timeLabel: 'Estimated Ready Time',
          timeValue: estimatedTimes?.readyAt ? formatTime(estimatedTimes.readyAt) : 'TBD',
          timeRemaining: estimatedTimes?.readyAt ? getTimeRemaining(estimatedTimes.readyAt) : null
        };
      case 'preparing':
        return {
          title: 'Preparing Your Order',
          subtitle: 'Chef is preparing your meal',
          icon: '👨‍🍳',
          timeLabel: 'Estimated Ready Time',
          timeValue: estimatedTimes?.readyAt ? formatTime(estimatedTimes.readyAt) : 'TBD',
          timeRemaining: estimatedTimes?.readyAt ? getTimeRemaining(estimatedTimes.readyAt) : null
        };
      case 'ready':
        return {
          title: 'Order Ready',
          subtitle: 'Ready for pickup or delivery',
          icon: '📦',
          timeLabel: 'Estimated Delivery',
          timeValue: estimatedTimes?.deliveryAt ? formatTime(estimatedTimes.deliveryAt) : 'TBD',
          timeRemaining: estimatedTimes?.deliveryAt ? getTimeRemaining(estimatedTimes.deliveryAt) : null
        };
      case 'out_for_delivery':
        return {
          title: 'On the Way!',
          subtitle: 'Your order is out for delivery',
          icon: '🚚',
          timeLabel: 'Estimated Arrival',
          timeValue: estimatedTimes?.deliveryAt ? formatTime(estimatedTimes.deliveryAt) : 'TBD',
          timeRemaining: estimatedTimes?.deliveryAt ? getTimeRemaining(estimatedTimes.deliveryAt) : null
        };
      case 'delivered':
        return {
          title: 'Delivered!',
          subtitle: 'Your order has been delivered',
          icon: '🎉',
          timeLabel: 'Delivered at',
          timeValue: updatedAt ? formatTime(updatedAt) : 'TBD',
          timeRemaining: null
        };
      default:
        return {
          title: 'Order Status',
          subtitle: 'Tracking your order',
          icon: '📦',
          timeLabel: 'Estimated Time',
          timeValue: 'TBD',
          timeRemaining: null
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="estimated-time">
      <div className="status-header">
        <div className="status-icon">{statusInfo.icon}</div>
        <div className="status-text">
          <h3>{statusInfo.title}</h3>
          <p>{statusInfo.subtitle}</p>
        </div>
      </div>

      <div className="time-info">
        <div className="time-label">{statusInfo.timeLabel}</div>
        <div className="time-display">
          <span className="time-value">{statusInfo.timeValue}</span>
          {statusInfo.timeRemaining && (
            <span className="time-remaining">({statusInfo.timeRemaining})</span>
          )}
        </div>
      </div>

      {createdAt && (
        <div className="order-timeline-info">
          <div className="timeline-item">
            <span className="timeline-label">Ordered at:</span>
            <span className="timeline-value">{formatTime(createdAt)}</span>
          </div>
          {updatedAt && status !== 'delivered' && (
            <div className="timeline-item">
              <span className="timeline-label">Last updated:</span>
              <span className="timeline-value">{formatTime(updatedAt)}</span>
            </div>
          )}
        </div>
      )}

      {statusInfo.timeRemaining && (
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: status === 'out_for_delivery' ? '75%' : 
                     status === 'ready' ? '60%' : 
                     status === 'preparing' ? '40%' : 
                     status === 'confirmed' ? '20%' : '10%' 
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default EstimatedTime;