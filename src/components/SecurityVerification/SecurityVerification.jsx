import React, { useState } from 'react';
import './SecurityVerification.css';

const SecurityVerification = ({ 
  isOpen, 
  onClose, 
  onVerify, 
  title = 'Security Verification', 
  description = 'Please verify your identity to proceed',
  verificationType = 'code' // code, biometric, password
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (verificationCode.trim() === '') {
        throw new Error('Please enter the verification code');
      }

      if (verificationCode.length < 4) {
        throw new Error('Invalid verification code');
      }

      // Call the onVerify callback
      await onVerify(verificationCode);
      onClose();
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    // Simulate resending code
    console.log('Resending verification code...');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="security-verification-modal">
        <div className="modal-header">
          <div className="modal-icon">🔐</div>
          <h3 className="modal-title">{title}</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">{description}</p>

          {verificationType === 'code' && (
            <form onSubmit={handleSubmit} className="verification-form">
              <div className="input-group">
                <label htmlFor="verification-code">Verification Code</label>
                <input
                  id="verification-code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  autoFocus
                />
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="verification-options">
                <button 
                  type="button"
                  className="btn-resend"
                  onClick={handleResendCode}
                >
                  Resend Code
                </button>
              </div>
            </form>
          )}

          {verificationType === 'password' && (
            <form onSubmit={handleSubmit} className="verification-form">
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
            </form>
          )}

          {verificationType === 'biometric' && (
            <div className="biometric-verification">
              <div className="biometric-icon">👆</div>
              <p>Place your finger on the fingerprint scanner</p>
              <p className="subtext">Or use alternative verification method</p>
              
              <div className="alternative-options">
                <button 
                  type="button"
                  className="btn-alternative"
                  onClick={() => {}}
                >
                  Use Verification Code
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          
          {verificationType !== 'biometric' && (
            <button 
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityVerification;