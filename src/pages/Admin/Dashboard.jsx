import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome to the Chicken Express administration panel.</p>
      
      <div className="admin-stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">$0.00</p>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <p className="stat-value">0</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;