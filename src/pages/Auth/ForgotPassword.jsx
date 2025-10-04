// src/pages/Auth/ForgotPassword.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { useTheme } from '../../hooks/useTheme';

// Assets (you can replace with your actual assets)
const ChickenIllustration = () => (
  <div className="chicken-illustration">
    <div className="chicken-icon">🍗</div>
    <div className="forgot-password-graphic">
      <div className="key-icon">🔑</div>
      <div className="email-icon">✉️</div>
    </div>
  </div>
);

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { resetPassword, authError, clearError } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Clear errors when component mounts or email changes
  useEffect(() => {
    clearError();
  }, [email, clearError]);

  // Handle countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      showError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      showError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      await resetPassword(email);
      setIsSubmitted(true);
      setCountdown(60); // 60 seconds countdown
      showSuccess('Password reset email sent! Check your inbox.');
    } catch (error) {
      // Error is already handled in the auth context
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    try {
      await resetPassword(email);
      setCountdown(60);
      showSuccess('Reset email sent again!');
    } catch (error) {
      // Error is already handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/auth/login');
  };

  // Success state - email sent
  if (isSubmitted) {
    return (
      <div className={`forgot-password-container ${theme}`}>
        <div className="forgot-password-card success-card">
          <div className="success-animation">
            <div className="success-checkmark">
              <div className="check-icon">✓</div>
            </div>
            <ChickenIllustration />
          </div>

          <div className="forgot-password-header">
            <h1>Check Your Email</h1>
            <p className="success-message">
              We've sent a password reset link to<br />
              <strong>{email}</strong>
            </p>
          </div>

          <div className="instructions">
            <div className="instruction-step">
              <span className="step-number">1</span>
              <span className="step-text">Open the email from Chicken Express</span>
            </div>
            <div className="instruction-step">
              <span className="step-number">2</span>
              <span className="step-text">Click the reset password link</span>
            </div>
            <div className="instruction-step">
              <span className="step-number">3</span>
              <span className="step-text">Create your new password</span>
            </div>
          </div>

          <div className="action-buttons">
            <button
              onClick={handleResendEmail}
              disabled={countdown > 0 || isLoading}
              className={`btn-primary ${countdown > 0 ? 'btn-disabled' : ''}`}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Sending...
                </>
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                'Resend Email'
              )}
            </button>

            <button
              onClick={handleBackToLogin}
              className="btn-outline"
            >
              Back to Login
            </button>
          </div>

          <div className="support-info">
            <p>Didn't receive the email?</p>
            <ul>
              <li>Check your spam folder</li>
              <li>Make sure you entered the correct email</li>
              <li>Wait a few minutes and try again</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Initial state - request reset
  return (
    <div className={`forgot-password-container ${theme}`}>
      <div className="forgot-password-card">
        <div className="forgot-password-illustration">
          <ChickenIllustration />
        </div>

        <div className="forgot-password-header">
          <h1>Forgot Your Password?</h1>
          <p>Don't worry! Enter your email and we'll send you a reset link.</p>
        </div>

        {authError && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="form-input"
              disabled={isLoading}
              autoComplete="email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className={`btn-primary ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Sending Reset Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/auth/login" className="auth-link">
            ← Back to Login
          </Link>
          <span className="link-divider">|</span>
          <Link to="/auth/register" className="auth-link">
            Create New Account
          </Link>
        </div>

        <div className="security-notice">
          <div className="security-icon">🔒</div>
          <p>
            Your security is important to us. We'll only use your email to send 
            password reset instructions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;