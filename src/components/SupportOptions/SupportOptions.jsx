// src/components/SupportOptions/SupportOptions.jsx
import React, { useState } from 'react';
import './SupportOptions.css';

const SupportOptions = ({ orderId, orderNumber, status }) => {
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportOption, setSupportOption] = useState('');

  const supportOptions = [
    {
      id: 'delay',
      title: 'Order Delayed',
      description: 'Your order is taking longer than expected',
      icon: '⏱️',
      action: 'Request Update'
    },
    {
      id: 'missing',
      title: 'Missing Items',
      description: 'Items are missing from your order',
      icon: '📦',
      action: 'Report Issue'
    },
    {
      id: 'quality',
      title: 'Quality Issue',
      description: 'Food quality doesn\'t meet expectations',
      icon: '🍗',
      action: 'Report Issue'
    },
    {
      id: 'contact',
      title: 'Contact Support',
      description: 'Speak with a customer service representative',
      icon: '💬',
      action: 'Call Now'
    }
  ];

  const handleSupportOption = (optionId) => {
    setSupportOption(optionId);
    setShowSupportModal(true);
  };

  const getStatusSupportOptions = () => {
    switch (status) {
      case 'preparing':
        return supportOptions.filter(opt => ['delay', 'contact'].includes(opt.id));
      case 'out_for_delivery':
        return supportOptions.filter(opt => ['delay', 'missing', 'contact'].includes(opt.id));
      case 'delivered':
        return supportOptions.filter(opt => ['missing', 'quality', 'contact'].includes(opt.id));
      default:
        return supportOptions;
    }
  };

  return (
    <div className="support-options">
      <h3>Need Help?</h3>
      
      <div className="support-options-grid">
        {getStatusSupportOptions().map((option) => (
          <div 
            key={option.id} 
            className="support-option-card"
            onClick={() => handleSupportOption(option.id)}
          >
            <div className="option-icon">{option.icon}</div>
            <div className="option-content">
              <h4>{option.title}</h4>
              <p>{option.description}</p>
            </div>
            <div className="option-action">
              <span>{option.action}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="support-info">
        <div className="order-info">
          <h5>Order Information</h5>
          <div className="info-item">
            <span className="label">Order #:</span>
            <span className="value">{orderNumber || orderId || 'N/A'}</span>
          </div>
          <div className="info-item">
            <span className="label">Status:</span>
            <span className="value status-badge">{status?.replace(/_/g, ' ') || 'Unknown'}</span>
          </div>
        </div>
        
        <div className="contact-options">
          <h5>Quick Contact</h5>
          <div className="contact-buttons">
            <button className="contact-btn phone">
              📞 Call Support
            </button>
            <button className="contact-btn chat">
              💬 Live Chat
            </button>
          </div>
        </div>
      </div>

      {showSupportModal && (
        <div className="support-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>How can we help?</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowSupportModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>We're here to assist you with your order #{orderNumber || orderId}.</p>
              <p>Please describe your issue and we'll connect you with the right support:</p>
              <textarea 
                placeholder="Describe your issue..."
                rows="4"
                className="issue-description"
              ></textarea>
              <div className="modal-actions">
                <button 
                  className="btn-secondary" 
                  onClick={() => setShowSupportModal(false)}
                >
                  Cancel
                </button>
                <button className="btn-primary">
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportOptions;