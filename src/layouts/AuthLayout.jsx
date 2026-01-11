import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-header">
        <Link to="/" className="auth-logo">🍗 Chicken Express</Link>
      </div>
      <div className="auth-card">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;