// src/components/PaymentForm/PaymentForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import './PaymentForm.css';

const PaymentForm = ({ 
  onNext, 
  onBack, 
  paymentInfo, 
  setPaymentInfo, 
  isSubmitting = false 
}) => {
  const [formData, setFormData] = useState(paymentInfo || {
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    cardType: '',
    saveCard: false
  });

  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  const [cardFlip, setCardFlip] = useState(false);
  const [isCardValid, setIsCardValid] = useState(false);
  const cardRef = useRef(null);

  const cardTypes = {
    visa: { pattern: /^4/, icon: '💳', name: 'Visa' },
    mastercard: { pattern: /^5[1-5]/, icon: '💳', name: 'Mastercard' },
    amex: { pattern: /^3[47]/, icon: '💳', name: 'Amex' },
    discover: { pattern: /^6(?:011|5)/, icon: '💳', name: 'Discover' }
  };

  useEffect(() => {
    // Detect card type
    const detectedType = Object.entries(cardTypes).find(([_, data]) => 
      data.pattern.test(formData.cardNumber.replace(/\s/g, ''))
    )?.[0] || '';

    setFormData(prev => ({
      ...prev,
      cardType: detectedType
    }));

    // Validate card number using Luhn algorithm
    const isValid = validateCardNumber(formData.cardNumber);
    setIsCardValid(isValid && formData.cardNumber.replace(/\s/g, '').length >= 13);
  }, [formData.cardNumber]);

  const validateCardNumber = (number) => {
    const digits = number.replace(/\s/g, '').split('').map(Number).reverse();
    if (digits.length < 13) return false;

    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      let digit = digits[i];
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  };

  const validateForm = () => {
    const newErrors = {};

    // Card Number validation
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!isCardValid) {
      newErrors.cardNumber = 'Invalid card number';
    }

    // Card Holder validation
    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = 'Card holder name is required';
    } else if (formData.cardHolder.trim().length < 3) {
      newErrors.cardHolder = 'Name is too short';
    }

    // Expiry Date validation
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid format (MM/YY)';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const expiry = new Date(2000 + parseInt(year), parseInt(month));
      const now = new Date();
      if (expiry < now) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    // CVV validation
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = formData.cardType === 'amex' ? '4 digits required' : '3 digits required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let formattedValue = value;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
    }
    
    // Format CVV
    if (name === 'cvv') {
      const maxLength = formData.cardType === 'amex' ? 4 : 3;
      formattedValue = value.replace(/\D/g, '').slice(0, maxLength);
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : formattedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setPaymentInfo({
        ...formData,
        last4Digits: formData.cardNumber.slice(-4).replace(/\s/g, '')
      });
      onNext();
    }
  };

  const handleFocus = (field) => {
    setFocusedField(field);
    if (field === 'cvv') {
      setCardFlip(true);
    }
  };

  const handleBlur = () => {
    setFocusedField('');
    setCardFlip(false);
  };

  const formatCardNumber = (number) => {
    return number.replace(/\d{4}(?=.)/g, '$& ');
  };

  const getCardIcon = () => {
    if (formData.cardType && cardTypes[formData.cardType]) {
      return cardTypes[formData.cardType].icon;
    }
    return '💳';
  };

  return (
    <div className="payment-form-container">
      <div className="payment-header">
        <h2>Payment Information</h2>
        <p>Enter your card details securely</p>
      </div>

      <div className="payment-content">
        {/* Animated Credit Card */}
        <div className="credit-card-preview">
          <div 
            ref={cardRef}
            className={`credit-card ${cardFlip ? 'flipped' : ''} ${formData.cardType}`}
          >
            <div className="card-front">
              <div className="card-header">
                <div className="card-chip">🔶</div>
                <div className="card-wireless">📶</div>
              </div>
              
              <div className="card-number">
                {formData.cardNumber || '•••• •••• •••• ••••'}
              </div>
              
              <div className="card-footer">
                <div className="card-holder">
                  <div className="card-label">Card Holder</div>
                  <div className="card-value">
                    {formData.cardHolder || 'YOUR NAME'}
                  </div>
                </div>
                
                <div className="card-expiry">
                  <div className="card-label">Expires</div>
                  <div className="card-value">
                    {formData.expiryDate || 'MM/YY'}
                  </div>
                </div>
              </div>
              
              <div className="card-type">
                {getCardIcon()} {formData.cardType ? cardTypes[formData.cardType]?.name : 'Card'}
              </div>
            </div>

            <div className="card-back">
              <div className="card-magnetic-strip"></div>
              <div className="card-cvv">
                <div className="cvv-label">CVV</div>
                <div className="cvv-value">
                  {formData.cvv ? '•'.repeat(formData.cvv.length) : '•••'}
                </div>
              </div>
              <div className="card-contactless">📶</div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cardNumber" className="form-label">
                Card Number
                {formData.cardType && (
                  <span className="card-type-badge">
                    {getCardIcon()} {cardTypes[formData.cardType]?.name}
                  </span>
                )}
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                onFocus={() => handleFocus('cardNumber')}
                onBlur={handleBlur}
                placeholder="1234 5678 9012 3456"
                className={`form-input ${errors.cardNumber ? 'error' : ''} ${isCardValid ? 'valid' : ''}`}
                maxLength={19}
              />
              {errors.cardNumber && (
                <span className="error-message">{errors.cardNumber}</span>
              )}
              {isCardValid && formData.cardNumber && (
                <span className="success-icon">✅</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cardHolder" className="form-label">
                Card Holder Name
              </label>
              <input
                type="text"
                id="cardHolder"
                name="cardHolder"
                value={formData.cardHolder}
                onChange={handleChange}
                onFocus={() => handleFocus('cardHolder')}
                onBlur={handleBlur}
                placeholder="John Doe"
                className={`form-input ${errors.cardHolder ? 'error' : ''}`}
              />
              {errors.cardHolder && (
                <span className="error-message">{errors.cardHolder}</span>
              )}
            </div>
          </div>

          <div className="form-row columns">
            <div className="form-group">
              <label htmlFor="expiryDate" className="form-label">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                onFocus={() => handleFocus('expiryDate')}
                onBlur={handleBlur}
                placeholder="MM/YY"
                className={`form-input ${errors.expiryDate ? 'error' : ''}`}
                maxLength={5}
              />
              {errors.expiryDate && (
                <span className="error-message">{errors.expiryDate}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="cvv" className="form-label">
                CVV
                <button 
                  type="button" 
                  className="cvv-help"
                  onMouseEnter={() => setCardFlip(true)}
                  onMouseLeave={() => setCardFlip(false)}
                >
                  ?
                </button>
              </label>
              <input
                type="password"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                onFocus={() => handleFocus('cvv')}
                onBlur={handleBlur}
                placeholder={formData.cardType === 'amex' ? '1234' : '123'}
                className={`form-input ${errors.cvv ? 'error' : ''}`}
                maxLength={formData.cardType === 'amex' ? 4 : 3}
              />
              {errors.cvv && (
                <span className="error-message">{errors.cvv}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="saveCard"
                checked={formData.saveCard}
                onChange={handleChange}
                className="checkbox-input"
              />
              <span className="checkmark"></span>
              Save this card for future purchases
            </label>
          </div>

          {/* Security Badges */}
          <div className="security-features">
            <div className="security-badge">
              <div className="security-icon">🔒</div>
              <div className="security-text">
                <strong>256-bit SSL Encryption</strong>
                <span>Your data is securely protected</span>
              </div>
            </div>
            
            <div className="payment-methods">
              <div className="payment-method">💳</div>
              <div className="payment-method">💳</div>
              <div className="payment-method">💳</div>
              <div className="payment-method">💳</div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              onClick={onBack}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              ← Back to Delivery
            </button>
            
            <button 
              type="submit" 
              className={`btn-primary ${isSubmitting ? 'submitting' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner"></div>
                  Processing Payment...
                </>
              ) : (
                'Continue to Review'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Payment Tips */}
      <div className="payment-tips">
        <h4>💡 Payment Tips</h4>
        <ul>
          <li>Double-check your card number and expiration date</li>
          <li>CVV is usually 3 digits on the back of your card</li>
          <li>American Express cards have 4-digit CVV on the front</li>
          <li>We never store your complete card information</li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentForm;