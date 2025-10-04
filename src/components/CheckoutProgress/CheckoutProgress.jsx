import React, { useState } from 'react';
import './CheckoutProgress.css';

const CheckoutProgress = ({ currentStep = 1 }) => {
  const [activeStep, setActiveStep] = useState(currentStep);
  
  const steps = [
    { id: 1, label: "Cart", icon: "🛒" },
    { id: 2, label: "Details", icon: "📝" },
    { id: 3, label: "Payment", icon: "💳" },
    { id: 4, label: "Confirmation", icon: "✅" }
  ];

  const handleStepClick = (stepId) => {
    if (stepId < activeStep) {
      setActiveStep(stepId);
    }
  };

  return (
    <div className="checkout-progress">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
      
      <div className="steps-container">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`step ${step.id === activeStep ? 'active' : ''} ${step.id < activeStep ? 'completed' : ''}`}
            onClick={() => handleStepClick(step.id)}
          >
            <div className="step-icon">
              {step.id < activeStep ? "✓" : step.icon}
            </div>
            <span className="step-label">{step.label}</span>
            {index < steps.length - 1 && <div className="step-connector"></div>}
          </div>
        ))}
      </div>
      
      <div className="step-details">
        {activeStep === 1 && <CartStep />}
        {activeStep === 2 && <DetailsStep />}
        {activeStep === 3 && <PaymentStep />}
        {activeStep === 4 && <ConfirmationStep />}
      </div>
      
      <div className="navigation-buttons">
        {activeStep > 1 && (
          <button 
            className="nav-button prev-button"
            onClick={() => setActiveStep(activeStep - 1)}
          >
            Previous
          </button>
        )}
        
        {activeStep < steps.length ? (
          <button 
            className="nav-button next-button"
            onClick={() => setActiveStep(activeStep + 1)}
          >
            Next
          </button>
        ) : (
          <button 
            className="nav-button confirm-button"
            onClick={() => alert('Order placed successfully!')}
          >
            Confirm Order
          </button>
        )}
      </div>
    </div>
  );
};

// Step Components
const CartStep = () => (
  <div className="step-content">
    <h3>Your Cart</h3>
    <div className="cart-item">
      <img src="https://via.placeholder.com/60x60/ff6b6b/white?text=P" alt="Pizza" />
      <div className="item-details">
        <h4>Pepperoni Pizza</h4>
        <p>Large | Thin Crust</p>
      </div>
      <div className="item-price">$15.99</div>
    </div>
    <div className="cart-item">
      <img src="https://via.placeholder.com/60x60/4ecdc4/white?text=S" alt="Soda" />
      <div className="item-details">
        <h4>Soft Drink</h4>
        <p>2L Bottle</p>
      </div>
      <div className="item-price">$3.49</div>
    </div>
    <div className="cart-total">
      <h4>Total: $19.48</h4>
    </div>
  </div>
);

const DetailsStep = () => (
  <div className="step-content">
    <h3>Delivery Details</h3>
    <form className="details-form">
      <div className="form-row">
        <input type="text" placeholder="Full Name" />
        <input type="tel" placeholder="Phone Number" />
      </div>
      <textarea placeholder="Delivery Address"></textarea>
      <div className="form-row">
        <input type="text" placeholder="City" />
        <input type="text" placeholder="ZIP Code" />
      </div>
      <div className="delivery-notes">
        <label>Delivery Notes (optional)</label>
        <textarea placeholder="e.g., Gate code, floor, etc."></textarea>
      </div>
    </form>
  </div>
);

const PaymentStep = () => (
  <div className="step-content">
    <h3>Payment Method</h3>
    <div className="payment-options">
      <div className="payment-option active">
        <div className="payment-icon">💳</div>
        <span>Credit/Debit Card</span>
      </div>
      <div className="payment-option">
        <div className="payment-icon">📱</div>
        <span>Mobile Payment</span>
      </div>
      <div className="payment-option">
        <div className="payment-icon">💵</div>
        <span>Cash on Delivery</span>
      </div>
    </div>
    
    <div className="card-form">
      <input type="text" placeholder="Card Number" />
      <div className="form-row">
        <input type="text" placeholder="MM/YY" />
        <input type="text" placeholder="CVV" />
      </div>
      <input type="text" placeholder="Cardholder Name" />
    </div>
  </div>
);

const ConfirmationStep = () => (
  <div className="step-content confirmation">
    <div className="confirmation-icon">✅</div>
    <h3>Ready to Order!</h3>
    <p>Please review your order details before confirming</p>
    
    <div className="order-summary">
      <h4>Order Summary</h4>
      <div className="summary-item">
        <span>Items:</span>
        <span>$19.48</span>
      </div>
      <div className="summary-item">
        <span>Delivery Fee:</span>
        <span>$2.99</span>
      </div>
      <div className="summary-item">
        <span>Tax:</span>
        <span>$1.76</span>
      </div>
      <div className="summary-item total">
        <span>Total:</span>
        <span>$24.23</span>
      </div>
    </div>
    
    <div className="delivery-estimate">
      <h4>Estimated Delivery Time</h4>
      <p>25-35 minutes</p>
    </div>
  </div>
);

export default CheckoutProgress;