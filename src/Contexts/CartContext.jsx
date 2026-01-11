// src/contexts/CartContext.jsx
import React, { createContext, useContext, useReducer } from 'react';
import { cartService } from '../services/cartService';

const CartContext = createContext();

// Cart reducer for managing complex cart state
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.item.id && 
        JSON.stringify(item.customizations || {}) === JSON.stringify(action.payload.item.customizations || {})
      );
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity
        };
        return { ...state, items: updatedItems };
      }
      
      return {
        ...state,
        items: [
          ...state.items,
          {
            ...action.payload.item,
            quantity: action.payload.quantity,
            uniqueId: `${action.payload.item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          }
        ]
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.uniqueId === action.payload.uniqueId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      return { ...state, items: updatedItems };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.uniqueId !== action.payload.uniqueId)
      };
    
    case 'CLEAR_CART':
      return { ...state, items: [] };
    
    case 'SET_CART':
      return { ...state, items: action.payload };
    
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  
  // Load cart from cart service on initial load
  React.useEffect(() => {
    try {
      const cartItems = cartService.getCartItems();
      // Convert cart items to match our context format
      const formattedItems = cartItems.map(item => ({
        ...item,
        uniqueId: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        quantity: item.quantity
      }));
      dispatch({ type: 'SET_CART', payload: formattedItems });
    } catch (error) {
      console.error('Failed to load cart from service:', error);
    }
  }, []);
  
  // Sync cart to service whenever it changes
  React.useEffect(() => {
    // Convert context items to service format
    const serviceItems = state.items.map(item => {
      const { uniqueId, quantity, ...itemWithoutUniqueId } = item;
      return {
        ...itemWithoutUniqueId,
        quantity: quantity
      };
    });
    
    // Update cart service
    try {
      // For simplicity, we'll clear and re-add items
      // In a production app, you'd want more sophisticated sync
      cartService.clearCart();
      serviceItems.forEach(item => {
        cartService.addToCart(item, item.quantity);
      });
    } catch (error) {
      console.error('Failed to sync cart to service:', error);
    }
  }, [state.items]);
  
  const addToCart = (item, quantity = 1, customizations = {}) => {
    const itemWithCustomizations = {
      ...item,
      customizations,
    };
    
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: { 
        item: itemWithCustomizations, 
        quantity 
      } 
    });
  };
  
  const updateQuantity = (uniqueId, quantity) => {
    dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { uniqueId, quantity } 
    });
  };
  
  const removeFromCart = (uniqueId) => {
    dispatch({ 
      type: 'REMOVE_ITEM', 
      payload: { uniqueId } 
    });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const cartItemsCount = state.items.reduce((total, item) => total + item.quantity, 0);
  
  const cartTotal = state.items.reduce((total, item) => {
    const itemPrice = item.customizations?.addOns 
      ? item.price + (item.customizations.addOns.reduce((sum, addOn) => sum + addOn.price, 0))
      : item.price;
    return total + (itemPrice * item.quantity);
  }, 0);
  
  const value = {
    cartItems: state.items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartItemsCount,
    cartTotal,
    cartCount: state.items.length,
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;