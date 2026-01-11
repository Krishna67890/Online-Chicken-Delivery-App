import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  const { register, loading } = useAuth();
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
    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }
    try {
      await register(formData);
      showSuccess('Account created! Welcome to the demo.');
      navigate('/');
    } catch (error) {
      showError(error.message || 'Registration failed');
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
          <h1>Join Demo</h1>
          <p>Create a demo account to start exploring</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn-primary btn-large" disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up for Demo'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/auth/login" className="auth-link">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;