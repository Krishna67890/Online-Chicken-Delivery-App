import React, { useState, useEffect } from 'react';
import { cartService } from '../../services/cartService';
import './CartIcon.css';

const CartIcon = ({ onClick }) => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const count = cartService.getTotalItems();
      setCartCount(count);
    };

    // Initial load
    updateCartCount();

    // Listen for storage changes (in case cart is modified from another tab)
    window.addEventListener('storage', updateCartCount);

    // Set up interval to periodically check for changes
    const interval = setInterval(updateCartCount, 1000);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="cart-icon-wrapper" onClick={onClick}>
      <span className="cart-icon">🛒</span>
      {cartCount > 0 && (
        <span className="cart-count-badge">{cartCount}</span>
      )}
    </div>
  );
};

export default CartIcon;