import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  variant = 'default' // default, danger, warning, info
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantClasses = {
    default: 'confirm-modal-default',
    danger: 'confirm-modal-danger',
    warning: 'confirm-modal-warning',
    info: 'confirm-modal-info'
  };

  const variantIcons = {
    default: '❓',
    danger: '⚠️',
    warning: '!',
    info: 'ℹ️'
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`confirm-modal ${variantClasses[variant]}`}>
        <div className="modal-header">
          <div className="modal-icon">
            {variantIcons[variant]}
          </div>
          <h3 className="modal-title">{title}</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            {cancelText}
          </button>
          <button 
            className={`btn btn-${variant === 'danger' ? 'danger' : 'primary'}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;