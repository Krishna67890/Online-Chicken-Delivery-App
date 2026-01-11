// This hook is deprecated. Use the CartContext instead.
// The new cart functionality is managed through the CartContext.
// This file exists only to prevent import errors.

const useCart = () => {
  console.warn('useCart hook from hooks/useCart.js is deprecated. Use the CartContext instead.');
  return {
    cart: [],
    addToCart: () => {},
    removeFromCart: () => {},
    updateQuantity: () => {},
    clearCart: () => {},
    getCartTotal: () => 0,
    getCartItemsCount: () => 0,
  };
};

export default useCart;