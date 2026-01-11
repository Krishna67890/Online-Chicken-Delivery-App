import React from 'react';
import './PaymentCard.css';

const PaymentCard = ({ 
  paymentMethod, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onSetDefault,
  showActions = true
}) => {
  const getCardIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      case 'discover':
        return '💳';
      case 'paypal':
        return '💸';
      case 'apple_pay':
        return '🍎';
      case 'google_pay':
        return 'oogle';
      default:
        return '💳';
    }
  };

  const maskCardNumber = (number) => {
    if (!number) return '**** **** **** ****';
    const str = number.toString();
    return `**** **** **** ${str.slice(-4)}`;
  };

  const formatDate = (expiry) => {
    if (!expiry) return 'MM/YY';
    return expiry.length === 4 
      ? `${expiry.slice(0, 2)}/${expiry.slice(2, 4)}` 
      : expiry;
  };

  return (
    <div className={`payment-card ${isSelected ? 'selected' : ''} ${paymentMethod.isDefault ? 'default' : ''}`}>
      <div className="card-header">
        <div className="card-icon">
          {getCardIcon(paymentMethod.type)}
        </div>
        <div className="card-type">
          {paymentMethod.type?.replace('_', ' ').toUpperCase() || 'CARD'}
        </div>
        {paymentMethod.isDefault && (
          <span className="default-badge">Default</span>
        )}
      </div>

      <div className="card-number">
        {maskCardNumber(paymentMethod.cardNumber || paymentMethod.number)}
      </div>

      <div className="card-details">
        <div className="card-holder">
          <span className="detail-label">Card Holder</span>
          <span className="detail-value">{paymentMethod.cardHolderName || paymentMethod.name || 'N/A'}</span>
        </div>
        
        <div className="card-expiry">
          <span className="detail-label">Expires</span>
          <span className="detail-value">
            {formatDate(paymentMethod.expiryDate || paymentMethod.expiry)}
          </span>
        </div>
      </div>

      {showActions && (
        <div className="card-actions">
          {!paymentMethod.isDefault && (
            <button 
              className="btn-set-default"
              onClick={() => onSetDefault && onSetDefault(paymentMethod.id)}
            >
              Set Default
            </button>
          )}
          
          <div className="action-buttons">
            <button 
              className="btn-edit"
              onClick={() => onEdit && onEdit(paymentMethod)}
            >
              Edit
            </button>
            
            <button 
              className="btn-delete"
              onClick={() => onDelete && onDelete(paymentMethod)}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <div 
        className="card-select-overlay"
        onClick={() => onSelect && onSelect(paymentMethod)}
      ></div>
    </div>
  );
};

export default PaymentCard;