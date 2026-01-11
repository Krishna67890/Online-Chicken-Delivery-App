import React from 'react';
import './ActivityFeed.css';

const ActivityFeed = ({ activities = [], title = 'Recent Activity', showLoadMore = true, onLoadMore }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="activity-feed">
        <h3 className="activity-title">{title}</h3>
        <div className="empty-activity">
          <div className="empty-icon">📅</div>
          <p>No recent activity</p>
        </div>
      </div>
    );
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order_placed':
        return '🛒';
      case 'order_confirmed':
        return '✅';
      case 'order_ready':
        return '📦';
      case 'order_delivered':
        return '🚚';
      case 'payment_completed':
        return '💳';
      case 'review_submitted':
        return '⭐';
      case 'loyalty_points':
        return '💎';
      case 'promotion_applied':
        return '🎁';
      default:
        return '📝';
    }
  };

  const getActivityMessage = (activity) => {
    switch (activity.type) {
      case 'order_placed':
        return `Placed order #${activity.orderNumber} for $${activity.amount}`;
      case 'order_confirmed':
        return `Order #${activity.orderNumber} confirmed`;
      case 'order_ready':
        return `Order #${activity.orderNumber} is ready for pickup`;
      case 'order_delivered':
        return `Order #${activity.orderNumber} delivered`;
      case 'payment_completed':
        return `Payment of $${activity.amount} completed`;
      case 'review_submitted':
        return `Submitted review for ${activity.item}`;
      case 'loyalty_points':
        return `Earned ${activity.points} loyalty points`;
      case 'promotion_applied':
        return `Applied promotion: ${activity.promotion}`;
      default:
        return activity.message || 'Activity occurred';
    }
  };

  return (
    <div className="activity-feed">
      <h3 className="activity-title">{title}</h3>
      <div className="activity-list">
        {activities.map((activity, index) => (
          <div key={activity.id || index} className="activity-item">
            <div className="activity-icon">
              {getActivityIcon(activity.type)}
            </div>
            <div className="activity-content">
              <div className="activity-message">
                {getActivityMessage(activity)}
              </div>
              <div className="activity-time">
                {typeof activity.timestamp === 'string' 
                  ? activity.timestamp 
                  : new Date(activity.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showLoadMore && onLoadMore && (
        <div className="load-more-container">
          <button className="btn-load-more" onClick={onLoadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;