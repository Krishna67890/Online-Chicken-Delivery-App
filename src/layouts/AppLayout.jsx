import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>&copy; 2026 Chicken Express. All rights reserved by Krishna Patil Rajput.</p>
      </footer>
    </div>
  );
};

export default AppLayout;