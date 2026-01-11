import React, { useState } from 'react';
import './ReorderModal.css';

const ReorderModal = ({ order, isOpen, onClose, onConfirm }) => {
  const [quantities, setQuantities] = useState(
    order.items.reduce((acc, item) => {
      acc[item.id] = item.quantity || 1;
      return acc;
    }, {})
  );

  const [specialInstructions, setSpecialInstructions] = useState('');

  if (!isOpen || !order) return null;

  const handleQuantityChange = (itemId, change) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + change)
    }));
  };

  const handleConfirm = () => {
    const modifications = {
      quantities,
      specialInstructions
    };
    onConfirm(order, modifications);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content reorder-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Reorder Items</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="order-summary">
            <h3>Order #{order.orderNumber}</h3>
            <p>From: {order.restaurantName || 'Chicken Delivery Store'}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="reorder-items">
            <h4>Items to Reorder</h4>
            {order.items.map(item => (
              <div key={item.id} className="reorder-item">
                <div className="item-info">
                  <h5>{item.name}</h5>
                  <p className="item-price">${item.price?.toFixed(2)}</p>
                </div>
                
                <div className="quantity-control">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >
                    -
                  </button>
                  <span className="quantity-display">{quantities[item.id] || 1}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="special-instructions">
            <label htmlFor="special-instructions">Special Instructions</label>
            <textarea
              id="special-instructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special instructions for the kitchen..."
              rows="3"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={handleConfirm}>
            Confirm Reorder
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReorderModal;