import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    marketingEmails: false,
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, register } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!isLogin) {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }

      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }

      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe
        });
        showSuccess('Welcome back!');
      } else {
        await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          marketingEmails: formData.marketingEmails
        });
        showSuccess('Account created successfully! Welcome to ChickenExpress!');
      }
      
      navigate(from, { replace: true });
    } catch (error) {
      showError(error.message || `Failed to ${isLogin ? 'sign in' : 'create account'}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    // Reset form data but keep email for convenience
    setFormData(prev => ({
      firstName: '',
      lastName: '',
      email: prev.email, // Keep email when switching
      phone: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
      marketingEmails: false,
      rememberMe: false
    }));
  };

  const handleSocialLogin = (provider) => {
    // Implement social login logic here
    console.log(`Social login with ${provider}`);
    showSuccess(`${provider} login coming soon!`);
  };

  const benefits = [
    { icon: '🎁', text: '15% off your first order' },
    { icon: '⭐', text: 'Earn loyalty points' },
    { icon: '🚚', text: 'Free delivery on orders over $25' },
    { icon: '📱', text: 'Exclusive app-only deals' }
  ];

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Header */}
        <div className="auth-header">
          <div className="logo">
            <span className="logo-icon">🍗</span>
            <span className="logo-text">ChickenExpress</span>
          </div>
          <h1>{isLogin ? 'Welcome Back' : 'Join ChickenExpress'}</h1>
          <p>
            {isLogin 
              ? 'Sign in to your account to continue' 
              : 'Create your account and get 15% off your first order'
            }
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="social-auth">
          <button 
            className="btn-social google"
            onClick={() => handleSocialLogin('Google')}
            type="button"
          >
            <span className="social-icon">🔍</span>
            <span>Continue with Google</span>
          </button>
          <button 
            className="btn-social facebook"
            onClick={() => handleSocialLogin('Facebook')}
            type="button"
          >
            <span className="social-icon">👥</span>
            <span>Continue with Facebook</span>
          </button>
        </div>

        <div className="auth-divider">
          <span>or continue with email</span>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="name-fields">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder={isLogin ? "Enter your password" : "Create a password"}
              minLength="8"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            {!isLogin && <small>Must be at least 8 characters</small>}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          )}

          <div className="form-options">
            {isLogin ? (
              <>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </>
            ) : (
              <>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                  />
                  <span>
                    I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                  </span>
                </label>
                {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="marketingEmails"
                    checked={formData.marketingEmails}
                    onChange={handleChange}
                  />
                  <span>Send me special offers and updates</span>
                </label>
              </>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-primary btn-large"
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Auth Footer */}
        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              type="button" 
              className="auth-link"
              onClick={toggleMode}
            >
              {isLogin ? 'Sign up here' : 'Sign in here'}
            </button>
          </p>
        </div>

        {/* Benefits Section (for registration) */}
        {!isLogin && (
          <div className="benefits">
            <h3>Join ChickenExpress and enjoy:</h3>
            <div className="benefits-list">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <span className="benefit-icon">{benefit.icon}</span>
                  <span className="benefit-text">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;