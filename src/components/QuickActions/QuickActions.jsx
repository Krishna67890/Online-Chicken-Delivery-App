import React from 'react';
import './QuickActions.css';

const QuickActions = ({ actions = [], title = 'Quick Actions' }) => {
  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div className="quick-actions">
      <h3 className="actions-title">{title}</h3>
      <div className="actions-grid">
        {actions.map((action, index) => (
          <button
            key={index}
            className="action-card"
            onClick={action.onClick}
            disabled={action.disabled}
          >
            <div className="action-icon">{action.icon}</div>
            <div className="action-content">
              <div className="action-title">{action.title}</div>
              <div className="action-description">{action.description}</div>
            </div>
            {action.badge && (
              <span className="action-badge">{action.badge}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;