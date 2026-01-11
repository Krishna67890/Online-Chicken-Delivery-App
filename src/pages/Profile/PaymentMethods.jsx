// src/pages/Profile/PaymentMethods.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../Contexts/NotificationContext';
import './PaymentMethods.css';

const PaymentMethods = () => {
  const navigate = useNavigate();
  const { showSuccess } = useNotifications();
  const [methods, setMethods] = useState([
    { id: '1', type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true, icon: '💳' },
    { id: '2', type: 'Mastercard', last4: '8812', expiry: '08/26', isDefault: false, icon: '💳' }
  ]);

  const handleAddMethod = (e) => {
    e.preventDefault();
    showSuccess('New payment method added to demo account!');
  };

  return (
    <div className="payment-methods-page">
      <div className="container">
        <div className="payment-header">
          <h1>💳 Payment Methods</h1>
          <p>Securely manage your saved cards and wallets</p>
        </div>

        <div className="payment-grid">
          {methods.map((method) => (
            <div key={method.id} className="payment-card-advanced animate-fade-in">
              <div className="card-type-icon">{method.icon}</div>
              <div className="card-details">
                <h3>{method.type} •••• {method.last4}</h3>
                <p>Expires {method.expiry}</p>
              </div>
              <div className="card-footer-actions">
                {method.isDefault ? (
                  <span className="default-badge">Primary</span>
                ) : (
                  <button className="btn-set-default">Set Default</button>
                )}
                <button className="btn-remove-card">Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="add-new-payment">
          <h2>Add New Card</h2>
          <form className="payment-form-grid" onSubmit={handleAddMethod}>
            <input type="text" className="payment-input" placeholder="Cardholder Name" required />
            <input type="text" className="payment-input" placeholder="Card Number" required />
            <input type="text" className="payment-input" placeholder="MM/YY" required />
            <input type="text" className="payment-input" placeholder="CVV" required />
            <button type="submit" className="btn-add-method">Save Card Details 🔒</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;