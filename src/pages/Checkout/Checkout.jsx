// src/pages/Checkout/Checkout.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
      deliveryInstructions: ''
    },
    payment: {
      method: 'card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: '',
      upiId: '',
      cashAmount: ''
    },
    orderNotes: ''
  });
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();

  // Load cart items from localStorage or context
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('chickenCart')) || [];
    setCartItems(savedCart);
    
    if (savedCart.length === 0) {
      navigate('/menu');
    }
  }, [navigate]);

  // Calculate order totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const deliveryFee = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + tax + deliveryFee;

  const handleDeliverySubmit = (data) => {
    setOrderData(prev => ({ ...prev, delivery: data }));
    setCurrentStep(2);
  };

  const handlePaymentSubmit = (data) => {
    setOrderData(prev => ({ ...prev, payment: data }));
    setCurrentStep(3);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate random order ID
      const newOrderId = 'CHK' + Date.now().toString().slice(-8);
      setOrderId(newOrderId);
      
      // Clear cart
      localStorage.removeItem('chickenCart');
      
      setOrderComplete(true);
      setCurrentStep(4);
    } catch (error) {
      console.error('Order failed:', error);
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
        cartItems={cartItems}
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
                        <p>Card: **** **** **** {orderData.payment.cardNumber.slice(-4)}</p>
                        <p>Expires: {orderData.payment.expiryDate}</p>
                        <p>Name: {orderData.payment.nameOnCard}</p>
                      </>
                    )}
                    {orderData.payment.method === 'upi' && (
                      <p>UPI ID: {orderData.payment.upiId}</p>
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
            cartItems={cartItems}
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