import React, { useState, useEffect } from 'react';
import { cartService } from '../../services/cartService';
import { paymentService } from '../../services/paymentService';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = ({ onCartChange }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadCartItems();
    loadPaymentMethods();
  }, []);

  const loadCartItems = () => {
    try {
      const items = cartService.getCartItems();
      setCartItems(items);
      setLoading(false);
    } catch (error) {
      console.error('Error loading cart items:', error);
      setLoading(false);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      // In a real app, this would fetch from the backend
      // For demo purposes, we'll use mock payment methods
      setPaymentMethods([
        { id: 'card-1', type: 'Visa', last4: '1234', expiry: '12/25', isDefault: true },
        { id: 'card-2', type: 'Mastercard', last4: '5678', expiry: '08/26', isDefault: false },
        { id: 'upi-1', type: 'UPI', identifier: 'user@paytm', isDefault: false },
        { id: 'wallet-1', type: 'PayPal', email: 'user@example.com', isDefault: false }
      ]);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const updateQuantity = (itemId, quantity) => {
    try {
      const updatedCart = cartService.updateQuantity(itemId, quantity);
      setCartItems(updatedCart);
      onCartChange && onCartChange();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = (itemId) => {
    try {
      const updatedCart = cartService.removeFromCart(itemId);
      setCartItems(updatedCart);
      onCartChange && onCartChange();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleProceedToPayment = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
    setShowPaymentOptions(true);
  };

  const handleCompletePayment = async () => {
    try {
      setLoading(true);
      const paymentResult = await paymentService.processCartPayment(
        cartItems, 
        selectedPaymentMethod
      );
      
      if (paymentResult.success) {
        // Clear cart after successful payment
        cartService.clearCart();
        onCartChange && onCartChange();
        
        // Navigate to order confirmation
        navigate('/order-confirmation', { 
          state: { 
            orderId: paymentResult.orderId,
            total: calculateTotal(),
            items: cartItems
          } 
        });
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add delicious chicken dishes to your cart and enjoy!</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/menu')}
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Your Cart ({calculateItemCount()} items)</h2>
      </div>
      
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img 
              src={item.image || '/images/default-food.jpg'} 
              alt={item.name}
              className="cart-item-image"
            />
            
            <div className="cart-item-details">
              <h4>{item.name}</h4>
              <p className="cart-item-description">{item.description}</p>
              
              <div className="cart-item-price">
                ${(item.price * item.quantity).toFixed(2)}
                <span className="item-unit-price">(${item.price.toFixed(2)}/each)</span>
              </div>
            </div>
            
            <div className="cart-item-controls">
              <div className="quantity-control">
                <button 
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              
              <button 
                className="remove-item-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${calculateTotal().toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax & Fees</span>
          <span>${(calculateTotal() * 0.1).toFixed(2)}</span>
        </div>
        <div className="summary-row total-row">
          <span>Total</span>
          <span className="total-amount">${(calculateTotal() * 1.1).toFixed(2)}</span>
        </div>
      </div>
      
      <div className="cart-actions">
        <div className="payment-options">
          <label htmlFor="payment-method">Select Payment Method:</label>
          <select
            id="payment-method"
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className="payment-select"
          >
            <option value="">Choose a payment method</option>
            {paymentMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.type} {method.last4 ? `•••• ${method.last4}` : ''}
                {method.identifier ? method.identifier : ''}
                {method.email ? method.email : ''}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          className="btn btn-success btn-lg"
          onClick={handleProceedToPayment}
          disabled={!selectedPaymentMethod}
        >
          Proceed to Payment (${(calculateTotal() * 1.1).toFixed(2)})
        </button>
      </div>
      
      {showPaymentOptions && (
        <div className="payment-modal">
          <div className="payment-modal-content">
            <h3>Complete Your Payment</h3>
            <p>Selected Payment Method: {paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.type}</p>
            
            <div className="payment-summary">
              <p>Total Amount: ${(calculateTotal() * 1.1).toFixed(2)}</p>
              <p>Items: {calculateItemCount()}</p>
            </div>
            
            <div className="payment-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowPaymentOptions(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-success"
                onClick={handleCompletePayment}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;