// src/pages/Checkout/Checkout.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../Contexts/CartContext';
import CheckoutProgress from '../../components/CheckoutProgress/CheckoutProgress';
import DeliveryForm from '../../components/DeliveryForm/DeliveryForm';
import PaymentForm from '../../components/PaymentForm/PaymentForm';
import OrderSummary from '../../components/OrderSummary/OrderSummary';
import OrderConfirmation from '../../components/OrderConfirmation/OrderConfirmation';
import './Checkout.css';

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState({
    delivery: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      deliveryInstructions: '',
      deliveryTime: 'asap'
    },
    payment: {
      method: 'card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: '',
      upiId: '',
      cashAmount: '',
      cardType: '',
      last4Digits: '',
      saveCard: false
    },
    orderNotes: '',
    specialRequests: '',
    promoCode: '',
    tip: 0
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  // Check if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/menu');
    }
  }, [cartItems, navigate]);

  // Calculate order totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const deliveryFee = subtotal > 0 ? 5.99 : 0;
  const tipAmount = (subtotal + tax + deliveryFee) * (orderData.tip / 100);
  const total = subtotal + tax + deliveryFee + tipAmount;

  const handleDeliverySubmit = (data) => {
    setOrderData(prev => ({ ...prev, delivery: data }));
    setCurrentStep(2);
  };

  const handlePaymentSubmit = (data) => {
    setOrderData(prev => ({ ...prev, payment: data }));
    setCurrentStep(3);
  };

  const validateOrderData = () => {
    const errors = [];
    
    // Validate delivery data
    if (!orderData.delivery.firstName.trim()) {
      errors.push('First name is required');
    }
    if (!orderData.delivery.lastName.trim()) {
      errors.push('Last name is required');
    }
    if (!orderData.delivery.email.trim()) {
      errors.push('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(orderData.delivery.email)) {
      errors.push('Email is invalid');
    }
    if (!orderData.delivery.phone.trim()) {
      errors.push('Phone number is required');
    }
    if (!orderData.delivery.address.trim()) {
      errors.push('Address is required');
    }
    if (!orderData.delivery.city.trim()) {
      errors.push('City is required');
    }
    if (!orderData.delivery.zipCode.trim()) {
      errors.push('ZIP code is required');
    }
    
    // Validate payment data if using card
    if (orderData.payment.method === 'card') {
      if (!orderData.payment.cardNumber.trim()) {
        errors.push('Card number is required');
      }
      if (!orderData.payment.nameOnCard.trim()) {
        errors.push('Card holder name is required');
      }
      if (!orderData.payment.expiryDate.trim()) {
        errors.push('Expiry date is required');
      }
      if (!orderData.payment.cvv.trim()) {
        errors.push('CVV is required');
      }
    }
    
    return errors;
  };

  const handlePlaceOrder = async () => {
    const validationErrors = validateOrderData();
    
    if (validationErrors.length > 0) {
      alert(`Please fix the following errors:\n\n${validationErrors.join('\n')}`);
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate random order ID
      const newOrderId = 'CHK' + Date.now().toString().slice(-8);
      setOrderId(newOrderId);
      
      // Clear cart
      clearCart();
      
      setOrderComplete(true);
      setCurrentStep(4);
    } catch (error) {
      console.error('Order failed:', error);
      alert('Order failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { number: 1, title: 'Delivery', active: currentStep === 1, completed: currentStep > 1 },
    { number: 2, title: 'Payment', active: currentStep === 2, completed: currentStep > 2 },
    { number: 3, title: 'Review', active: currentStep === 3, completed: currentStep > 3 },
    { number: 4, title: 'Confirmation', active: currentStep === 4, completed: false }
  ];

  if (orderComplete) {
    return (
      <OrderConfirmation 
        orderId={orderId}
        orderData={orderData}
        total={total}
      />
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <CheckoutProgress steps={steps} />
      </div>

      <div className="checkout-content">
        <div className="checkout-forms">
          {currentStep === 1 && (
            <DeliveryForm 
              data={orderData.delivery}
              onSubmit={handleDeliverySubmit}
              onBack={() => navigate('/cart')}
            />
          )}
          
          {currentStep === 2 && (
            <PaymentForm 
              data={orderData.payment}
              onSubmit={handlePaymentSubmit}
              onBack={() => setCurrentStep(1)}
            />
          )}
          
          {currentStep === 3 && (
            <div className="review-step">
              <h2>Review Your Order</h2>
              
              <div className="review-sections">
                <div className="review-section">
                  <h3>Delivery Information</h3>
                  <div className="review-info">
                    <p>{orderData.delivery.firstName} {orderData.delivery.lastName}</p>
                    <p>{orderData.delivery.email}</p>
                    <p>{orderData.delivery.phone}</p>
                    <p>{orderData.delivery.address}</p>
                    {orderData.delivery.apartment && <p>Apt: {orderData.delivery.apartment}</p>}
                    <p>{orderData.delivery.city}, {orderData.delivery.state} {orderData.delivery.zipCode}</p>
                    {orderData.delivery.deliveryInstructions && (
                      <p>Instructions: {orderData.delivery.deliveryInstructions}</p>
                    )}
                    <p>Delivery Time: {orderData.delivery.deliveryTime === 'asap' ? 'As soon as possible' : `In ${orderData.delivery.deliveryTime}`}</p>
                  </div>
                  <button 
                    className="edit-btn"
                    onClick={() => setCurrentStep(1)}
                  >
                    Edit Delivery
                  </button>
                </div>

                <div className="review-section">
                  <h3>Payment Method</h3>
                  <div className="review-info">
                    <p>Method: {orderData.payment.method.toUpperCase()}</p>
                    {orderData.payment.method === 'card' && (
                      <>
                        <p>Card: **** **** **** {orderData.payment.last4Digits || orderData.payment.cardNumber.slice(-4)}</p>
                        <p>Expires: {orderData.payment.expiryDate}</p>
                        <p>Name: {orderData.payment.nameOnCard}</p>
                      </>
                    )}
                    {orderData.payment.method === 'upi' && (
                      <p>UPI ID: {orderData.payment.upiId}</p>
                    )}
                    {orderData.payment.method === 'cash' && (
                      <p>Cash: ${orderData.payment.cashAmount || 'Exact amount'}</p>
                    )}
                  </div>
                  <button 
                    className="edit-btn"
                    onClick={() => setCurrentStep(2)}
                  >
                    Edit Payment
                  </button>
                </div>

                <div className="review-section">
                  <h3>Order Notes</h3>
                  <div className="review-info">
                    <textarea
                      placeholder="Any special instructions for your order?"
                      value={orderData.orderNotes}
                      onChange={(e) => setOrderData(prev => ({ 
                        ...prev, 
                        orderNotes: e.target.value 
                      }))}
                      className="notes-textarea"
                    />
                  </div>
                </div>

                <div className="review-section">
                  <h3>Special Requests</h3>
                  <div className="review-info">
                    <textarea
                      placeholder="Any special requests or dietary restrictions?"
                      value={orderData.specialRequests}
                      onChange={(e) => setOrderData(prev => ({ 
                        ...prev, 
                        specialRequests: e.target.value 
                      }))}
                      className="notes-textarea"
                    />
                  </div>
                </div>

                <div className="review-section">
                  <h3>Promo Code</h3>
                  <div className="review-info">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={orderData.promoCode}
                      onChange={(e) => setOrderData(prev => ({ 
                        ...prev, 
                        promoCode: e.target.value 
                      }))}
                      className="promo-input"
                    />
                    <button className="apply-promo-btn">Apply</button>
                  </div>
                </div>

                <div className="review-section">
                  <h3>Tip</h3>
                  <div className="review-info">
                    <div className="tip-options">
                      <button 
                        className={`tip-btn ${orderData.tip === 0 ? 'active' : ''}`}
                        onClick={() => setOrderData(prev => ({ ...prev, tip: 0 }))}
                      >
                        No Tip
                      </button>
                      <button 
                        className={`tip-btn ${orderData.tip === 10 ? 'active' : ''}`}
                        onClick={() => setOrderData(prev => ({ ...prev, tip: 10 }))}
                      >
                        10%
                      </button>
                      <button 
                        className={`tip-btn ${orderData.tip === 15 ? 'active' : ''}`}
                        onClick={() => setOrderData(prev => ({ ...prev, tip: 15 }))}
                      >
                        15%
                      </button>
                      <button 
                        className={`tip-btn ${orderData.tip === 20 ? 'active' : ''}`}
                        onClick={() => setOrderData(prev => ({ ...prev, tip: 20 }))}
                      >
                        20%
                      </button>
                    </div>
                    <input
                      type="number"
                      placeholder="Custom tip %"
                      value={orderData.tip}
                      onChange={(e) => setOrderData(prev => ({ 
                        ...prev, 
                        tip: parseFloat(e.target.value) || 0 
                      }))}
                      className="tip-input"
                      min="0"
                      max="100"
                      step="1"
                    />
                  </div>
                </div>
              </div>

              <div className="review-actions">
                <button 
                  className="back-btn"
                  onClick={() => setCurrentStep(2)}
                >
                  Back to Payment
                </button>
                <button 
                  className="place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner"></span>
                      Processing Your Order...
                    </>
                  ) : (
                    `Place Order - $${total.toFixed(2)}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="checkout-sidebar">
          <OrderSummary 
            subtotal={subtotal}
            tax={tax}
            deliveryFee={deliveryFee}
            total={total}
            estimatedDelivery="30-45 min"
          />
        </div>
      </div>

      {/* Security Badges */}
      <div className="security-badges">
        <div className="security-item">
          <span className="security-icon">🔒</span>
          <span>Secure SSL Encryption</span>
        </div>
        <div className="security-item">
          <span className="security-icon">💳</span>
          <span>Payment Protection</span>
        </div>
        <div className="security-item">
          <span className="security-icon">🚚</span>
          <span>Fast Delivery Guarantee</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;