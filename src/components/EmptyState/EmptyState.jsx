import React from 'react';
import './EmptyState.css';

const EmptyState = ({ type = 'default', title, message, action }) => {
  // Define icons for different types
  const icons = {
    order: '📋',
    search: '🔍',
    cart: '🛒',
    favorite: '❤️',
    notification: '🔔',
    error: '⚠️',
    success: '✅',
    default: '📭'
  };

  const icon = icons[type] || icons.default;

  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icon}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {action && (
        <button 
          className={`btn-${action.variant || 'primary'}`}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;