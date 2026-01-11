import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Chicken Admin</h2>
        </div>
        <ul className="sidebar-links">
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/admin/menu">Menu</Link></li>
          <li><Link to="/admin/orders">Orders</Link></li>
          <li><Link to="/admin/users">Users</Link></li>
          <li><Link to="/">Exit Admin</Link></li>
        </ul>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;