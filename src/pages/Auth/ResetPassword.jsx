// src/pages/Auth/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { useTheme } from '../../hooks/useTheme';

// Assets (you can replace with your actual assets)
const PasswordResetIllustration = () => (
  <div className="password-reset-illustration">
    <div className="chicken-icon">🍗</div>
    <div className="password-graphic">
      <div className="lock-icon">🔒</div>
      <div className="key-icon">🔑</div>
      <div className="shield-icon">🛡️</div>
    </div>
  </div>
);

const PasswordStrengthIndicator = ({ strength }) => {
  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'weak': return '#ff4757';
      case 'fair': return '#ffa502';
      case 'good': return '#2ed573';
      case 'strong': return '#2ed573';
      default: return '#dfe4ea';
    }
  };

  const getStrengthText = (strength) => {
    switch (strength) {
      case 'weak': return 'Weak';
      case 'fair': return 'Fair';
      case 'good': return 'Good';
      case 'strong': return 'Strong';
      default: return 'Enter password';
    }
  };

  return (
    <div className="password-strength">
      <div className="strength-bars">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`strength-bar ${strength && bar <= getBarCount(strength) ? 'active' : ''}`}
            style={{
              backgroundColor: strength && bar <= getBarCount(strength) ? getStrengthColor(strength) : ''
            }}
          />
        ))}
      </div>
      <span className="strength-text" style={{ color: getStrengthColor(strength) }}>
        {getStrengthText(strength)}
      </span>
    </div>
  );
};

const getBarCount = (strength) => {
  switch (strength) {
    case 'weak': return 1;
    case 'fair': return 2;
    case 'good': return 3;
    case 'strong': return 4;
    default: return 0;
  }
};

const checkPasswordStrength = (password) => {
  if (!password) return null;

  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const criteriaMet = [
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar
  ].filter(Boolean).length;

  if (criteriaMet <= 2) return 'weak';
  if (criteriaMet === 3) return 'fair';
  if (criteriaMet === 4) return 'good';
  if (criteriaMet === 5) return 'strong';

  return 'weak';
};

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { resetPassword, authError, clearError } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const oobCode = searchParams.get('oobCode');

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
    
    // Check if we have a valid reset code
    if (!oobCode) {
      showError('Invalid or missing reset link. Please request a new password reset.');
      navigate('/auth/forgot-password');
    }
  }, [oobCode, clearError, showError, navigate]);

  // Check password strength
  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(formData.password));
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation errors when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    clearError();
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (passwordStrength === 'weak') {
      errors.password = 'Please choose a stronger password';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      // In a real app, you would use Firebase's confirmPasswordReset method
      // For now, we'll simulate the reset process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful password reset
      setIsSuccess(true);
      showSuccess('Password reset successfully! You can now login with your new password.');

      // Redirect to login after success
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);

    } catch (error) {
      showError('Failed to reset password. The link may have expired.');
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const getPasswordRequirements = () => {
    const password = formData.password;
    return [
      {
        met: password.length >= 8,
        text: 'At least 8 characters long'
      },
      {
        met: /[A-Z]/.test(password),
        text: 'One uppercase letter'
      },
      {
        met: /[a-z]/.test(password),
        text: 'One lowercase letter'
      },
      {
        met: /\d/.test(password),
        text: 'One number'
      },
      {
        met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        text: 'One special character'
      }
    ];
  };

  // Success state
  if (isSuccess) {
    return (
      <div className={`reset-password-container ${theme}`}>
        <div className="reset-password-card success-card">
          <div className="success-animation">
            <div className="success-checkmark">
              <div className="check-icon">✓</div>
            </div>
            <PasswordResetIllustration />
          </div>

          <div className="reset-password-header">
            <h1>Password Reset Successfully!</h1>
            <p className="success-message">
              Your password has been updated successfully.<br />
              You can now login with your new password.
            </p>
          </div>

          <div className="redirect-countdown">
            <p>Redirecting to login in <strong>3 seconds</strong>...</p>
          </div>

          <div className="action-buttons">
            <Link to="/auth/login" className="btn-primary">
              Go to Login
            </Link>
          </div>

          <div className="security-tips">
            <h3>Security Tips:</h3>
            <ul>
              <li>Use a unique password for your Chicken Express account</li>
              <li>Never share your password with anyone</li>
              <li>Log out from shared devices</li>
              <li>Enable two-factor authentication if available</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Main reset form
  return (
    <div className={`reset-password-container ${theme}`}>
      <div className="reset-password-card">
        <div className="reset-password-illustration">
          <PasswordResetIllustration />
        </div>

        <div className="reset-password-header">
          <h1>Create New Password</h1>
          <p>Choose a strong, unique password to secure your Chicken Express account.</p>
        </div>

        {authError && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              New Password
            </label>
            <div className="password-input-container">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your new password"
                className={`form-input ${validationErrors.password ? 'error' : ''}`}
                disabled={isLoading}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {formData.password && (
              <PasswordStrengthIndicator strength={passwordStrength} />
            )}
            {validationErrors.password && (
              <div className="field-error">{validationErrors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password
            </label>
            <div className="password-input-container">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                className={`form-input ${validationErrors.confirmPassword ? 'error' : ''}`}
                disabled={isLoading}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                disabled={isLoading}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <div className="field-error">{validationErrors.confirmPassword}</div>
            )}
            {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
              <div className="success-message-small">✓ Passwords match</div>
            )}
          </div>

          {/* Password Requirements */}
          {formData.password && (
            <div className="password-requirements">
              <h4>Password Requirements:</h4>
              <ul>
                {getPasswordRequirements().map((req, index) => (
                  <li key={index} className={req.met ? 'met' : 'not-met'}>
                    {req.met ? '✓' : '○'} {req.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !formData.password || !formData.confirmPassword}
            className={`btn-primary ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Resetting Password...
              </>
            ) : (
              'Reset Password'
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
            Your new password will be securely encrypted. Make sure it's unique and not used for other accounts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;