// src/pages/Profile/Profile.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import EditProfileModal from '../../components/EditProfileModal/EditProfileModal';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const [activeTab, setActiveTab] = useState('overview');
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Logged out successfully. See you soon!');
      navigate('/');
    } catch (err) {
      showError('Logout failed');
    }
  };

  const handleSaveProfile = (updatedData) => {
    // In a real app, you would call an update profile service here
    showSuccess('Profile updated successfully!');
    setEditModalOpen(false);
  };

  const userInitials = user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('') : 'KP';

  return (
    <div className="profile-page">
      <div className="container">
        
        {/* Advanced Profile Header */}
        <div className="profile-header-card animate-fade-in">
          <div className="profile-avatar-large">{userInitials}</div>
          <div className="user-meta">
            <h1>{user?.displayName || 'Krishna Patil Rajput'}</h1>
            <p>{user?.email || 'krishna@demo.com'}</p>
            <div className="profile-actions-top">
              <button className="btn-edit-main" onClick={() => setEditModalOpen(true)}>Edit Profile ✏️</button>
            </div>
          </div>
        </div>

        <div className="profile-layout">
          {/* Responsive Sidebar */}
          <aside className="profile-sidebar">
            <nav className="sidebar-nav">
              <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                <span className="nav-icon">📊</span> Overview
              </button>
              <button className={`nav-item`} onClick={() => navigate('/home/orders')}>
                <span className="nav-icon">📋</span> My Orders
              </button>
              <button className={`nav-item`} onClick={() => navigate('/home/profile/addresses')}>
                <span className="nav-icon">🏠</span> Addresses
              </button>
              <button className={`nav-item`} onClick={() => navigate('/home/profile/payments')}>
                <span className="nav-icon">💳</span> Payments
              </button>
            </nav>
          </aside>

          {/* Attractive Content Area */}
          <main className="profile-main animate-fade-in">
            <h2 className="section-title">Account Overview</h2>
            
            <div className="overview-stats-grid">
              <div className="overview-stat">
                <span className="val">12</span>
                <span className="lab">Total Orders</span>
              </div>
              <div className="overview-stat">
                <span className="val">Gold</span>
                <span className="lab">Member Status</span>
              </div>
              <div className="overview-stat">
                <span className="val">450</span>
                <span className="lab">Loyalty Points</span>
              </div>
            </div>

            <div className="recent-activity-box">
              <h3>Recent Activity</h3>
              <p>You ordered "Crispy Fried Chicken Bucket" 2 days ago.</p>
              <p>Profile information was updated on March 10th.</p>
            </div>

            <div className="profile-footer">
              <button className="btn-logout" onClick={handleLogout}>Logout Account</button>
              <div className="account-id">ID: {user?.uid || 'DEMO_772'}</div>
            </div>
          </main>
        </div>
      </div>

      {/* Edit Profile Modal Integration */}
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default Profile;