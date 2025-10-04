import { useState, useEffect, useMemo, useCallback } from 'react';
import './Cart.css';

// Simple icon components using Unicode characters
const Icon = ({ children, className = "", ...props }) => (
  <span className={`icon ${className}`} {...props}>{children}</span>
);

// Create named icon components (replace all lucide-react imports)
const X = (props) => <Icon {...props}>✕</Icon>;
const Plus = (props) => <Icon {...props}>+</Icon>;
const Minus = (props) => <Icon {...props}>-</Icon>;
const Trash2 = (props) => <Icon {...props}>🗑️</Icon>;
const Clock = (props) => <Icon {...props}>⏰</Icon>;
const Truck = (props) => <Icon {...props}>🚚</Icon>;
const Shield = (props) => <Icon {...props}>🛡️</Icon>;
const Star = (props) => <Icon {...props}>⭐</Icon>;
const CheckCircle2 = (props) => <Icon {...props}>✅</Icon>;
const Loader2 = (props) => <Icon {...props}>⏳</Icon>;
const MapPin = (props) => <Icon {...props}>📍</Icon>;
const Phone = (props) => <Icon {...props}>📞</Icon>;
const User = (props) => <Icon {...props}>👤</Icon>;

const Cart = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  updateQuantity, 
  removeFromCart, 
  clearCart, 
  onCheckout,
  user 
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState('cart'); // 'cart', 'delivery', 'payment', 'confirmation'
  const [formData, setFormData] = useState({
    name: user?.name || '',
    address: user?.address || '',
    phone: user?.phone || '',
    notes: '',
    deliveryTime: 'asap',
    paymentMethod: 'card'
  });
  const [formErrors, setFormErrors] = useState({});
  const [suggestedItems, setSuggestedItems] = useState([]);

  // Memoized calculations for performance
  const { subtotal, tax, deliveryFee, discount, total, itemCount } = useMemo(() => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const deliveryFee = subtotal > 0 ? 5.99 : 0;
    const discount = subtotal > 25 ? 5.99 : 0;
    const total = Math.max(0, subtotal + tax + deliveryFee - discount);
    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return { subtotal, tax, deliveryFee, discount, total, itemCount };
  }, [cartItems]);

  // Suggested items based on cart contents
  useEffect(() => {
    if (cartItems.length > 0) {
      const categories = [...new Set(cartItems.map(item => item.category))];
      // Simulate API call for suggestions
      const suggestions = [
        { id: 's1', name: 'Garlic Bread', price: 3.99, image: '🍞', category: 'sides' },
        { id: 's2', name: 'Coleslaw', price: 2.99, image: '🥗', category: 'sides' },
        { id: 's3', name: 'Chocolate Milkshake', price: 4.99, image: '🥤', category: 'drinks' }
      ].filter(item => !categories.includes(item.category));
      
      setSuggestedItems(suggestions.slice(0, 3));
    } else {
      setSuggestedItems([]);
    }
  }, [cartItems]);

  // Form validation
  const validateForm = useCallback(() => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (formData.phone.trim() && !/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Handle form input changes with validation
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [formErrors]);

  // Handle quantity updates with debouncing
  const handleQuantityUpdate = useCallback((itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  }, [updateQuantity]);

  // Quick quantity adjustment
  const handleQuickAdd = useCallback((itemId, amount) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      handleQuantityUpdate(itemId, item.quantity + amount);
    }
  }, [cartItems, handleQuantityUpdate]);

  // Checkout process with proper state management
  const handleCheckout = useCallback(async () => {
    if (!validateForm()) {
      setCurrentStep('delivery');
      return;
    }

    setIsCheckingOut(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderData = {
        ...formData,
        total,
        items: cartItems,
        orderId: `ORD-${Date.now()}`,
        estimatedDelivery: calculateDeliveryTime()
      };
      
      onCheckout(orderData);
      setOrderSuccess(true);
      setCurrentStep('confirmation');
      
      // Auto-close after success
      setTimeout(() => {
        setIsCheckingOut(false);
        onClose();
        setCurrentStep('cart');
        setFormData({ name: '', address: '', phone: '', notes: '', deliveryTime: 'asap', paymentMethod: 'card' });
      }, 3000);
      
    } catch (error) {
      console.error('Checkout failed:', error);
      setIsCheckingOut(false);
    }
  }, [formData, total, cartItems, onCheckout, onClose, validateForm]);

  // Calculate delivery time
  const calculateDeliveryTime = useCallback(() => {
    const now = new Date();
    const deliveryMinutes = formData.deliveryTime === 'asap' ? 45 : 90;
    now.setMinutes(now.getMinutes() + deliveryMinutes);
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [formData.deliveryTime]);

  // Close handlers
  const handleClose = useCallback(() => {
    if (isCheckingOut) return;
    onClose();
  }, [isCheckingOut, onClose]);

  // Keyboard and overlay close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isCheckingOut) handleClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleClose, isCheckingOut]);

  // Reset form when opening
  useEffect(() => {
    if (isOpen && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        address: user.address || prev.address,
        phone: user.phone || prev.phone
      }));
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const renderCartItems = () => (
    <div className="cart-section">
      <div className="section-header">
        <h3>Your Order ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h3>
        <button 
          className="clear-all-btn"
          onClick={clearCart}
          disabled={cartItems.length === 0}
        >
          <Trash2 size={16} />
          Clear All
        </button>
      </div>

      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item" data-testid={`cart-item-${item.id}`}>
            <div className="item-image">
              <span className="item-emoji">{item.image}</span>
            </div>
            
            <div className="item-details">
              <h4>{item.name}</h4>
              <p className="item-description">{item.description}</p>
              <div className="item-meta">
                <span className="item-price">${item.price.toFixed(2)}</span>
                {item.spicy && <span className="spicy-tag">🌶️ Spicy</span>}
              </div>
            </div>

            <div className="quantity-section">
              <div className="quantity-controls">
                <button 
                  onClick={() => handleQuickAdd(item.id, -1)}
                  disabled={item.quantity <= 1}
                  className="quantity-btn"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                
                <div className="quantity-display">
                  <span>{item.quantity}</span>
                </div>
                
                <button 
                  onClick={() => handleQuickAdd(item.id, 1)}
                  className="quantity-btn"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              
              <div className="quantity-actions">
                <button 
                  className="quick-add-btn"
                  onClick={() => handleQuickAdd(item.id, 2)}
                >
                  +2
                </button>
                <button 
                  className="quick-add-btn"
                  onClick={() => handleQuickAdd(item.id, 5)}
                >
                  +5
                </button>
              </div>
            </div>

            <div className="item-total-section">
              <div className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <button 
                className="remove-item"
                onClick={() => removeFromCart(item.id)}
                aria-label="Remove item"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDeliveryForm = () => (
    <div className="cart-section">
      <div className="section-header">
        <h3>
          <Truck size={20} />
          Delivery Information
        </h3>
        <div className="delivery-estimate">
          <Clock size={16} />
          Est. {calculateDeliveryTime()}
        </div>
      </div>

      <div className="delivery-form">
        <div className="form-group">
          <label htmlFor="name">
            <User size={16} />
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleInputChange}
            className={formErrors.name ? 'error' : ''}
          />
          {formErrors.name && <span className="error-message">{formErrors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">
            <Phone size={16} />
            Phone Number *
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="(555) 123-4567"
            value={formData.phone}
            onChange={handleInputChange}
            className={formErrors.phone ? 'error' : ''}
          />
          {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="address">
            <MapPin size={16} />
            Delivery Address *
          </label>
          <input
            id="address"
            type="text"
            name="address"
            placeholder="Enter your complete delivery address"
            value={formData.address}
            onChange={handleInputChange}
            className={formErrors.address ? 'error' : ''}
          />
          {formErrors.address && <span className="error-message">{formErrors.address}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Delivery Time</label>
            <select 
              name="deliveryTime" 
              value={formData.deliveryTime}
              onChange={handleInputChange}
            >
              <option value="asap">ASAP (30-45 min)</option>
              <option value="later">Later (90 min)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Payment Method</label>
            <select 
              name="paymentMethod" 
              value={formData.paymentMethod}
              onChange={handleInputChange}
            >
              <option value="card">Credit/Debit Card</option>
              <option value="cash">Cash on Delivery</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Special Instructions (Optional)</label>
          <textarea
            name="notes"
            placeholder="Any special delivery instructions, allergies, or preferences..."
            value={formData.notes}
            onChange={handleInputChange}
            rows="3"
          />
        </div>
      </div>
    </div>
  );

  const renderSuggestedItems = () => {
    if (suggestedItems.length === 0) return null;

    return (
      <div className="suggested-items">
        <h4>You might also like</h4>
        <div className="suggested-grid">
          {suggestedItems.map(item => (
            <div key={item.id} className="suggested-item">
              <span className="suggested-emoji">{item.image}</span>
              <div className="suggested-details">
                <span className="suggested-name">{item.name}</span>
                <span className="suggested-price">${item.price.toFixed(2)}</span>
              </div>
              <button 
                className="add-suggested-btn"
                onClick={() => updateQuantity(item.id, 1)}
              >
                <Plus size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOrderSummary = () => (
    <div className="order-summary">
      <h4>Order Summary</h4>
      
      <div className="summary-rows">
        <div className="summary-row">
          <span>Subtotal ({itemCount} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="summary-row">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        <div className="summary-row">
          <span>Delivery Fee</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="summary-row discount">
            <span>
              <Star size={14} fill="currentColor" />
              Free Delivery Discount
            </span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="summary-divider"></div>
      
      <div className="summary-total">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {subtotal < 25 && (
        <div className="free-delivery-notice">
          <Star size={14} />
          Add ${(25 - subtotal).toFixed(2)} more for free delivery!
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'active' : ''}`} onClick={handleClose}></div>
      
      <div className={`cart-container ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="cart-header">
          <div className="header-content">
            <h2>
              <span className="cart-icon">🛒</span>
              Your Order
            </h2>
            <button 
              className="close-cart" 
              onClick={handleClose}
              disabled={isCheckingOut}
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="progress-steps">
            {['cart', 'delivery', 'confirmation'].map((step, index) => (
              <div 
                key={step}
                className={`step ${currentStep === step ? 'active' : ''} ${
                  ['cart', 'delivery'].indexOf(currentStep) > index ? 'completed' : ''
                }`}
              >
                <div className="step-indicator">
                  {['cart', 'delivery'].indexOf(currentStep) > index ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="step-label">
                  {step === 'cart' ? 'Cart' : step === 'delivery' ? 'Details' : 'Confirm'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🍗</div>
              <h3>Your cart is empty</h3>
              <p>Browse our menu and add some delicious chicken!</p>
              <button className="browse-menu-btn" onClick={onClose}>
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {currentStep === 'cart' && (
                <>
                  {renderCartItems()}
                  {renderSuggestedItems()}
                </>
              )}
              
              {currentStep === 'delivery' && renderDeliveryForm()}
              
              {renderOrderSummary()}

              {/* Trust Badges */}
              <div className="trust-badges">
                <div className="trust-badge">
                  <Shield size={16} />
                  <span>Secure Payment</span>
                </div>
                <div className="trust-badge">
                  <Clock size={16} />
                  <span>30-45 min delivery</span>
                </div>
                <div className="trust-badge">
                  <Star size={16} />
                  <span>4.8 ★ (2k+ reviews)</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="footer-actions">
              {currentStep === 'cart' ? (
                <button 
                  className="continue-to-details-btn"
                  onClick={() => setCurrentStep('delivery')}
                >
                  Continue to Delivery
                  <Truck size={18} />
                </button>
              ) : (
                <div className="checkout-actions">
                  <button 
                    className="back-to-cart-btn"
                    onClick={() => setCurrentStep('cart')}
                    disabled={isCheckingOut}
                  >
                    Back to Cart
                  </button>
                  
                  <button 
                    className={`checkout-btn ${isCheckingOut ? 'processing' : ''}`}
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 size={18} className="spinner" />
                        Processing Order...
                      </>
                    ) : (
                      <>
                        Place Order • ${total.toFixed(2)}
                        <CheckCircle2 size={18} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Success Overlay */}
        {orderSuccess && (
          <div className="order-success-overlay">
            <div className="order-success-modal">
              <div className="success-animation">
                <CheckCircle2 size={48} />
              </div>
              <h3>Order Confirmed! 🎉</h3>
              <p>Your delicious chicken is being prepared and will arrive around {calculateDeliveryTime()}</p>
              <div className="order-details">
                <div className="order-number">
                  Order #ORD-{Date.now().toString().slice(-6)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;