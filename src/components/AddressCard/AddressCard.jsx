import React from 'react';
import './AddressCard.css';

const AddressCard = ({ 
  address, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onSetDefault,
  showActions = true
}) => {
  const getAddressIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'home':
        return '🏠';
      case 'work':
        return '🏢';
      case 'other':
      default:
        return '📍';
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    
    const parts = [];
    if (addr.street) parts.push(addr.street);
    if (addr.city) parts.push(addr.city);
    if (addr.state) parts.push(addr.state);
    if (addr.zipCode) parts.push(addr.zipCode);
    
    return parts.join(', ');
  };

  return (
    <div className={`address-card ${isSelected ? 'selected' : ''} ${address.isDefault ? 'default' : ''}`}>
      <div className="address-header">
        <div className="address-icon">
          {getAddressIcon(address.type)}
        </div>
        <div className="address-type">
          {address.type?.charAt(0).toUpperCase() + address.type?.slice(1) || 'Address'}
        </div>
        {address.isDefault && (
          <span className="default-badge">Default</span>
        )}
      </div>

      <div className="address-content">
        <div className="address-name">
          <strong>{address.name || address.recipientName || 'Unnamed'}</strong>
        </div>
        
        <div className="address-details">
          <div className="full-address">
            {formatAddress(address)}
          </div>
          
          {address.phoneNumber && (
            <div className="address-phone">
              <span className="phone-label">Phone:</span>
              <span className="phone-value">{address.phoneNumber}</span>
            </div>
          )}
          
          {address.instructions && (
            <div className="address-instructions">
              <span className="instructions-label">Notes:</span>
              <span className="instructions-value">{address.instructions}</span>
            </div>
          )}
        </div>
      </div>

      {showActions && (
        <div className="address-actions">
          {!address.isDefault && (
            <button 
              className="btn-set-default"
              onClick={() => onSetDefault && onSetDefault(address.id)}
            >
              Set Default
            </button>
          )}
          
          <div className="action-buttons">
            <button 
              className="btn-edit"
              onClick={() => onEdit && onEdit(address)}
            >
              Edit
            </button>
            
            <button 
              className="btn-delete"
              onClick={() => onDelete && onDelete(address)}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <div 
        className="address-select-overlay"
        onClick={() => onSelect && onSelect(address)}
      ></div>
    </div>
  );
};

export default AddressCard;