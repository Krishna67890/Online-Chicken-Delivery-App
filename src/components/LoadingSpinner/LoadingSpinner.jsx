import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', message }) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.medium;
  
  return (
    <div className="loading-spinner-container">
      <div className={`loading-spinner ${sizeClass}`}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;