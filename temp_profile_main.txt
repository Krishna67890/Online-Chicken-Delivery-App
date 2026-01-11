// src/pages/Profile/Profile.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { useOrders } from '../hooks/useOrders';
import { usePreferences } from './hooks/usePreferences';
import { useNotifications } from './hooks/useNotifications';
import ProfileHeader from '../../components/ProfileHeader/ProfileHeader';
import ProfileStats from '../../components/ProfileStats/ProfileStats';
import QuickActions from '../../components/QuickActions/QuickActions';
import ActivityFeed from '../../components/ActivityFeed/ActivityFeed';
import LoyaltyCard from '../../components/LoyaltyCard/LoyaltyCard';
import PreferencesPanel from '../../components/PreferencesPanel/PreferencesPanel';
import EditProfileModal from '../../components/EditProfileModal/EditProfileModal';
import SecuritySettingsModal from '../../components/SecuritySettingsModal/SecuritySettingsModal';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import { profileService } from '../../services/profileService';
import { dateFormatters, priceFormatters } from '../../utils/formatters';
import { validationSchemas } from '../../utils/validation';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, updateUser } = useAuth();
  const { showSuccess, showError, showWarning } = useNotifications();
  
  const {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    refreshProfile
  } = useProfile();

  const {
    orders,
    stats: orderStats,
    refreshOrders
  } = useOrders();

  const {
    preferences,
    updatePreferences,
    loading: preferencesLoading
  } = usePreferences();

  const [activeTab, setActiveTab] = useState('overview');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loyaltyProgress, setLoyaltyProgress] = useState({});
  const [dietaryPreferences, setDietaryPreferences] = useState({});
  const [orderSuggestions, setOrderSuggestions] = useState([]);

  // Initialize from URL hash or default to overview
  useEffect(() => {
    if (location.hash) {
      const tab = location.hash.replace('#', '');
      if (['overview', 'orders', 'addresses', 'payments', 'preferences'].includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, [location.hash]);

  // Load additional profile data
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const [
          activityData,
          loyaltyData,
          dietaryData,
          suggestionsData
        ] = await Promise.all([
          profileService.getRecentActivity(),
          profileService.getLoyaltyProgress(),
          profileService.getDietaryPreferences(),
          profileService.getOrderSuggestions()
        ]);

        setRecentActivity(activityData);
        setLoyaltyProgress(loyaltyData);
        setDietaryPreferences(dietaryData);
        setOrderSuggestions(suggestionsData);
      } catch (err) {
        console.error('Failed to load profile data:', err);
      }
    };

    if (user) {
      loadProfileData();
    }
  }, [user]);

  // Quick actions for profile
  const quickActions = [
    {
      id: 'edit-profile',
      icon: '👤',
      label: 'Edit Profile',
      description: 'Update your personal information',
      onClick: () => setEditModalOpen(true),
      color: 'var(--primary)'
    },
    {
      id: 'order-history',
      icon: '📋',
      label: 'Order History',
      description: 'View your past orders',
      onClick: () => navigate('/profile/orders'),
      color: 'var(--secondary)'
    },
    {
      id: 'address-book',
      icon: '🏠',
      label: 'Address Book',
      description: 'Manage delivery addresses',
      onClick: () => navigate('/profile/addresses'),
      color: 'var(--success)'
    },
    {
      id: 'payment-methods',
      icon: '💳',
      label: 'Payment Methods',
      description: 'Manage payment options',
      onClick: () => navigate('/profile/payments'),
      color: 'var(--warning)'
    },
    {
      id: 'preferences',
      icon: '⚙️',
      label: 'Preferences',
      description: 'Customize your experience',
      onClick: () => setPreferencesOpen(true),
      color: 'var(--info)'
    },
    {
      id: 'security',
      icon: '🔒',
      label: 'Security',
      description: 'Privacy and security settings',
      onClick: () => setSecurityModalOpen(true),
      color: 'var(--error)'
    }
  ];

  // Profile stats data
  const profileStats = {
    orders: orderStats?.total || 0,
    totalSpent: orderStats?.totalSpent || 0,
    loyaltyPoints: profile?.loyaltyPoints || 0,
    addresses: profile?.savedAddresses?.length || 0,
    favoriteItems: profile?.favoriteItems?.length || 0,
    memberSince: profile?.memberSince || user?.createdAt
  };

  // Handle avatar upload
  const handleAvatarUpload = async (file) => {
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const avatarUrl = await uploadAvatar(file);
      await updateUser({ avatar: avatarUrl });
      showSuccess('Profile picture updated successfully');
    } catch (err) {
      showError('Failed to upload profile picture');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (profileData) => {
    try {
      await updateProfile(profileData);
      setEditModalOpen(false);
      showSuccess('Profile updated successfully');
    } catch (err) {
      showError(err.message || 'Failed to update profile');
    }
  };

  // Handle preferences update
  const handlePreferencesUpdate = async (newPreferences) => {
    try {
      await updatePreferences(newPreferences);
      setPreferencesOpen(false);
      showSuccess('Preferences updated successfully');
    } catch (err) {
      showError('Failed to update preferences');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Logged out successfully');
      navigate('/');
    } catch (err) {
      showError('Failed to logout');
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      await profileService.deleteAccount();
      await logout();
      showSuccess('Account deleted successfully');
      navigate('/');
    } catch (err) {
      showError('Failed to delete account');
    }
  };

  // Get user level based on loyalty points
  const getUserLevel = useCallback(() => {
    const points = profileStats.loyaltyPoints;
    if (points >= 5000) return { level: 'Gold', color: '#FFD700', next: null };
    if (points >= 2000) return { level: 'Silver', color: '#C0C0C0', next: 5000 };
    if (points >= 500) return { level: 'Bronze', color: '#CD7F32', next: 2000 };
    return { level: 'Member', color: 'var(--primary)', next: 500 };
  }, [profileStats.loyaltyPoints]);

  // Get dietary restrictions summary
  const getDietarySummary = useCallback(() => {
    const restrictions = [];
    if (dietaryPreferences.isVegetarian) restrictions.push('Vegetarian');
    if (dietaryPreferences.isVegan) restrictions.push('Vegan');
    if (dietaryPreferences.isGlutenFree) restrictions.push('Gluten-Free');
    if (dietaryPreferences.isDairyFree) restrictions.push('Dairy-Free');
    if (dietaryPreferences.isHalal) restrictions.push('Halal');
    
    return restrictions.length > 0 ? restrictions.join(', ') : 'No restrictions';
  }, [dietaryPreferences]);

  // Get favorite items
  const getFavoriteItems = useCallback(() => {
    return profile?.favoriteItems?.slice(0, 3) || [];
  }, [profile]);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <LoadingSpinner size="large" />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="profile-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Unable to Load Profile</h2>
          <p>{error}</p>
          <button 
            className="btn-primary"
            onClick={refreshProfile}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="profile-page">
        {/* Profile Header */}
        <ProfileHeader
          user={user}
          profile={profile}
          stats={profileStats}
          userLevel={getUserLevel()}
          dietarySummary={getDietarySummary()}
          onEditProfile={() => setEditModalOpen(true)}
          onUploadAvatar={handleAvatarUpload}
          uploadingAvatar={uploadingAvatar}
        />

        {/* Main Content */}
        <div className="profile-content">
          <div className="container">
            <div className="profile-layout">
              {/* Sidebar */}
              <aside className="profile-sidebar">
                <nav className="sidebar-nav">
                  <button
                    className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    <span className="nav-icon">📊</span>
                    <span className="nav-label">Overview</span>
                  </button>
                  
                  <button
                    className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                  >
                    <span className="nav-icon">📋</span>
                    <span className="nav-label">Orders</span>
                    {orderStats?.pending > 0 && (
                      <span className="nav-badge">{orderStats.pending}</span>
                    )}
                  </button>
                  
                  <button
                    className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                    onClick={() => setActiveTab('addresses')}
                  >
                    <span className="nav-icon">🏠</span>
                    <span className="nav-label">Addresses</span>
                  </button>
                  
                  <button
                    className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('payments')}
                  >
                    <span className="nav-icon">💳</span>
                    <span className="nav-label">Payments</span>
                  </button>
                  
                  <button
                    className={`nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
                    onClick={() => setActiveTab('preferences')}
                  >
                    <span className="nav-icon">⚙️</span>
                    <span className="nav-label">Preferences</span>
                  </button>
                </nav>

                {/* Loyalty Card */}
                <LoyaltyCard
                  points={profileStats.loyaltyPoints}
                  level={getUserLevel()}
                  progress={loyaltyProgress}
                  onViewRewards={() => navigate('/rewards')}
                />

                {/* Quick Stats */}
                <div className="sidebar-stats">
                  <h4>Quick Stats</h4>
                  <div className="stat-item">
                    <span className="stat-label">Total Orders</span>
                    <span className="stat-value">{profileStats.orders}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Spent</span>
                    <span className="stat-value">
                      {priceFormatters.formatPrice(profileStats.totalSpent)}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Member Since</span>
                    <span className="stat-value">
                      {dateFormatters.formatDate(profileStats.memberSince)}
                    </span>
                  </div>
                </div>
              </aside>

              {/* Main Content Area */}
              <main className="profile-main">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="tab-content">
                    {/* Quick Actions */}
                    <section className="section">
                      <h2 className="section-title">Quick Actions</h2>
                      <QuickActions
                        actions={quickActions}
                        columns={3}
                      />
                    </section>

                    {/* Recent Activity */}
                    <section className="section">
                      <div className="section-header">
                        <h2 className="section-title">Recent Activity</h2>
                        <button 
                          className="btn-text"
                          onClick={() => navigate('/profile/orders')}
                        >
                          View All
                        </button>
                      </div>
                      <ActivityFeed
                        activities={recentActivity}
                        onViewOrder={(orderId) => navigate(`/orders/${orderId}`)}
                      />
                    </section>

                    {/* Favorite Items */}
                    {getFavoriteItems().length > 0 && (
                      <section className="section">
                        <h2 className="section-title">Your Favorites</h2>
                        <div className="favorites-grid">
                          {getFavoriteItems().map(item => (
                            <div key={item.id} className="favorite-item">
                              <div className="item-image">{item.image}</div>
                              <div className="item-info">
                                <h4>{item.name}</h4>
                                <p>{item.description}</p>
                                <span className="item-price">
                                  {priceFormatters.formatPrice(item.price)}
                                </span>
                              </div>
                              <button 
                                className="btn-outline btn-sm"
                                onClick={() => navigate(`/menu/item/${item.id}`)}
                              >
                                Order Again
                              </button>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Order Suggestions */}
                    {orderSuggestions.length > 0 && (
                      <section className="section">
                        <h2 className="section-title">You Might Like</h2>
                        <div className="suggestions-grid">
                          {orderSuggestions.slice(0, 3).map(suggestion => (
                            <div key={suggestion.id} className="suggestion-card">
                              <div className="suggestion-image">{suggestion.image}</div>
                              <div className="suggestion-content">
                                <h4>{suggestion.name}</h4>
                                <p>{suggestion.description}</p>
                                <div className="suggestion-actions">
                                  <span className="suggestion-price">
                                    {priceFormatters.formatPrice(suggestion.price)}
                                  </span>
                                  <button 
                                    className="btn-primary btn-sm"
                                    onClick={() => navigate(`/menu/item/${suggestion.id}`)}
                                  >
                                    Try It
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className="tab-content">
                    <ProfileStats
                      stats={orderStats}
                      onRefresh={refreshOrders}
                    />
                    
                    <div className="orders-preview">
                      <h2 className="section-title">Recent Orders</h2>
                      {orders.slice(0, 5).map(order => (
                        <div key={order.id} className="order-preview-item">
                          <div className="order-info">
                            <div className="order-main">
                              <span className="order-number">{order.orderNumber}</span>
                              <span className="order-date">
                                {dateFormatters.formatDate(order.createdAt)}
                              </span>
                            </div>
                            <div className="order-details">
                              <span className="order-total">
                                {priceFormatters.formatPrice(order.total)}
                              </span>
                              <span className={`order-status status-${order.status}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="order-actions">
                            <button 
                              className="btn-outline btn-sm"
                              onClick={() => navigate(`/orders/${order.id}`)}
                            >
                              View Details
                            </button>
                            {order.status === 'delivered' && (
                              <button 
                                className="btn-primary btn-sm"
                                onClick={() => {
                                  // Handle reorder logic
                                }}
                              >
                                Reorder
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {orders.length === 0 && (
                        <div className="empty-state">
                          <div className="empty-icon">📋</div>
                          <h3>No Orders Yet</h3>
                          <p>Start your first order and it will appear here</p>
                          <button 
                            className="btn-primary"
                            onClick={() => navigate('/menu')}
                          >
                            Browse Menu
                          </button>
                        </div>
                      )}
                      
                      {orders.length > 5 && (
                        <div className="view-all-container">
                          <button 
                            className="btn-outline"
                            onClick={() => navigate('/profile/orders')}
                          >
                            View All Orders
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Other tabs would have similar structures */}
                {activeTab === 'addresses' && (
                  <div className="tab-content">
                    {/* Addresses content */}
                  </div>
                )}

                {activeTab === 'payments' && (
                  <div className="tab-content">
                    {/* Payments content */}
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="tab-content">
                    {/* Preferences content */}
                  </div>
                )}
              </main>
            </div>
          </div>
        </div>

        {/* Account Actions Footer */}
        <footer className="profile-footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-actions">
                <button 
                  className="btn-outline"
                  onClick={handleLogout}
                >
                  Logout
                </button>
                <button 
                  className="btn-text danger"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
              </div>
              <div className="footer-info">
                <span>Account ID: {user?.id}</span>
                <span>Last login: {dateFormatters.formatDateTime(user?.lastLogin)}</span>
              </div>
            </div>
          </div>
        </footer>

        {/* Modals */}
        {editModalOpen && (
          <EditProfileModal
            user={user}
            profile={profile}
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSave={handleProfileUpdate}
            onUploadAvatar={handleAvatarUpload}
          />
        )}

        {securityModalOpen && (
          <SecuritySettingsModal
            isOpen={securityModalOpen}
            onClose={() => setSecurityModalOpen(false)}
            onChangePassword={async (currentPassword, newPassword) => {
              // Handle password change
            }}
            onEnable2FA={async () => {
              // Handle 2FA enable
            }}
          />
        )}

        {preferencesOpen && (
          <PreferencesPanel
            preferences={preferences}
            isOpen={preferencesOpen}
            onClose={() => setPreferencesOpen(false)}
            onSave={handlePreferencesUpdate}
            loading={preferencesLoading}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Profile;