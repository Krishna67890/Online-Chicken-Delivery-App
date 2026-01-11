// src/components/OrderTimeline/OrderTimeline.jsx
import React from 'react';
import './OrderTimeline.css';

const OrderTimeline = ({ status, events, estimatedTimes, currentStage }) => {
  const statusStages = [
    { key: 'pending', label: 'Order Placed', icon: '🛒' },
    { key: 'confirmed', label: 'Confirmed', icon: '✅' },
    { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
    { key: 'ready', label: 'Ready', icon: '📦' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚚' },
    { key: 'delivered', label: 'Delivered', icon: '🎉' }
  ];

  const getStatusClass = (stage) => {
    if (statusStages.findIndex(s => s.key === status) >= statusStages.findIndex(s => s.key === stage)) {
      return 'completed';
    }
    if (statusStages.findIndex(s => s.key === stage) === statusStages.findIndex(s => s.key === status) + 1) {
      return 'current';
    }
    return 'pending';
  };

  return (
    <div className="order-timeline">
      <h3 className="timeline-title">Order Progress</h3>
      <div className="timeline-stages">
        {statusStages.map((stage, index) => (
          <div key={stage.key} className={`timeline-stage ${getStatusClass(stage.key)}`}>
            <div className="stage-icon">
              <span className="icon">{stage.icon}</span>
              <div className="connector-line"></div>
            </div>
            <div className="stage-info">
              <div className="stage-label">{stage.label}</div>
              <div className="stage-status">
                {getStatusClass(stage.key) === 'completed' && 'Completed'}
                {getStatusClass(stage.key) === 'current' && 'In Progress'}
                {getStatusClass(stage.key) === 'pending' && 'Pending'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {events && events.length > 0 && (
        <div className="timeline-events">
          <h4>Order Events</h4>
          <div className="events-list">
            {events.map((event, index) => (
              <div key={index} className="event-item">
                <div className="event-time">{new Date(event.timestamp).toLocaleTimeString()}</div>
                <div className="event-description">{event.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {estimatedTimes && (Object.keys(estimatedTimes).length > 0) && (
        <div className="estimated-times">
          <h4>Estimated Times</h4>
          {estimatedTimes.readyAt && (
            <div className="estimated-time">
              <span className="time-label">Ready by:</span>
              <span className="time-value">{new Date(estimatedTimes.readyAt).toLocaleTimeString()}</span>
            </div>
          )}
          {estimatedTimes.deliveryAt && (
            <div className="estimated-time">
              <span className="time-label">Estimated Delivery:</span>
              <span className="time-value">{new Date(estimatedTimes.deliveryAt).toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;