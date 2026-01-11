import { storageService } from './storageService';

export const cartService = {
  // Get cart items from storage
  getCartItems() {
    try {
      const cart = storageService.get('cart') || [];
      return cart;
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  },

  // Add item to cart
  addToCart(item, quantity = 1) {
    try {
      const cart = this.getCartItems();
      const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        cart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        const cartItem = {
          ...item,
          quantity: quantity,
          addedAt: new Date().toISOString()
        };
        cart.push(cartItem);
      }
      
      storageService.set('cart', cart);
      return cart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Update item quantity in cart
  updateQuantity(itemId, quantity) {
    try {
      const cart = this.getCartItems();
      const itemIndex = cart.findIndex(item => item.id === itemId);
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          cart.splice(itemIndex, 1); // Remove item if quantity is 0 or less
        } else {
          cart[itemIndex].quantity = quantity;
        }
        storageService.set('cart', cart);
      }
      
      return cart;
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart(itemId) {
    try {
      const cart = this.getCartItems();
      const updatedCart = cart.filter(item => item.id !== itemId);
      storageService.set('cart', updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Clear entire cart
  clearCart() {
    try {
      storageService.remove('cart');
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  // Get cart total items count
  getTotalItems() {
    try {
      const cart = this.getCartItems();
      return cart.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error('Error getting total items:', error);
      return 0;
    }
  },

  // Get cart total price
  getTotalPrice() {
    try {
      const cart = this.getCartItems();
      return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    } catch (error) {
      console.error('Error getting total price:', error);
      return 0;
    }
  },

  // Check if item is in cart
  isInCart(itemId) {
    try {
      const cart = this.getCartItems();
      return cart.some(item => item.id === itemId);
    } catch (error) {
      console.error('Error checking if item is in cart:', error);
      return false;
    }
  },

  // Get cart item by ID
  getCartItemById(itemId) {
    try {
      const cart = this.getCartItems();
      return cart.find(item => item.id === itemId);
    } catch (error) {
      console.error('Error getting cart item by ID:', error);
      return null;
    }
  },

  // Apply discount to cart
  applyDiscount(discountCode) {
    try {
      // In a real implementation, this would validate the discount code
      // For now, we'll just return the current cart with discount applied
      const cart = this.getCartItems();
      
      // Example discount calculation - this would be more complex in reality
      const discountPercentage = 10; // 10% discount
      const totalBeforeDiscount = this.getTotalPrice();
      const discountAmount = totalBeforeDiscount * (discountPercentage / 100);
      const totalAfterDiscount = totalBeforeDiscount - discountAmount;
      
      return {
        cart,
        discountApplied: discountCode,
        discountPercentage,
        totalBeforeDiscount,
        discountAmount,
        totalAfterDiscount
      };
    } catch (error) {
      console.error('Error applying discount:', error);
      throw error;
    }
  }
};

// Export utility functions
export const cartUtils = {
  // Format cart for checkout
  formatForCheckout(cartItems) {
    return {
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      })),
      totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      timestamp: new Date().toISOString()
    };
  },

  // Validate cart items availability
  validateCartItems(cartItems, menuItems) {
    const validationResults = cartItems.map(cartItem => {
      const menuItem = menuItems.find(item => item.id === cartItem.id);
      return {
        id: cartItem.id,
        name: cartItem.name,
        available: menuItem && menuItem.available,
        inStock: menuItem ? (menuItem.inStock !== false) : true, // Assume in stock if not specified
        maxQuantity: menuItem ? (menuItem.maxQuantity || 50) : 50
      };
    });

    const unavailableItems = validationResults.filter(item => !item.available);
    const outOfStockItems = validationResults.filter(item => !item.inStock);
    
    return {
      isValid: unavailableItems.length === 0 && outOfStockItems.length === 0,
      unavailableItems,
      outOfStockItems,
      validationResults
    };
  }
};