import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const { login, loading, authError } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      showSuccess('Welcome back, ' + formData.email.split('@')[0] + '!');
      navigate('/');
    } catch (error) {
      showError(error.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page demo-login-theme">
      <div className="auth-container">
        <div className="educational-disclaimer">
          <span className="disclaimer-icon">⚠️</span>
          <p><strong>EDUCATIONAL PURPOSE ONLY:</strong> This website is a portfolio project. Please <strong>DO NOT</strong> enter your real personal data, credit card information, or sensitive credentials.</p>
        </div>

        <div className="auth-header">
          <h1>Demo Access</h1>
          <p>Login with Krishna or Atharva accounts</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="krishna@demo.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="password123"
            />
          </div>

          {authError && <div className="error-msg">{authError}</div>}

          <button 
            type="submit" 
            className="btn-primary btn-large"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Login to Demo Account'}
          </button>
        </form>

        <div className="demo-credentials-box">
          <h4>Test Credentials:</h4>
          <p>User 1: <strong>krishna@demo.com</strong></p>
          <p>User 2: <strong>atharva@demo.com</strong></p>
          <p>Pass: <strong>password123</strong></p>
        </div>

        <div className="auth-footer">
          <p>
            New here? <Link to="/register" className="auth-link">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;