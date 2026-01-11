import React from 'react';
import './ProfileStats.css';

const ProfileStats = ({ stats = {} }) => {
  const defaultStats = {
    totalOrders: 0,
    totalSpent: 0,
    favoriteItems: 0,
    deliveryAddresses: 0,
    loyaltyPoints: 0,
    avgOrderValue: 0
  };

  const mergedStats = { ...defaultStats, ...stats };

  const statCards = [
    {
      id: 'orders',
      title: 'Total Orders',
      value: mergedStats.totalOrders,
      icon: '🍽️',
      color: '#667eea'
    },
    {
      id: 'spent',
      title: 'Total Spent',
      value: `$${mergedStats.totalSpent.toFixed(2)}`,
      icon: '💰',
      color: '#764ba2'
    },
    {
      id: 'favorites',
      title: 'Favorite Items',
      value: mergedStats.favoriteItems,
      icon: '❤️',
      color: '#f093fb'
    },
    {
      id: 'addresses',
      title: 'Saved Addresses',
      value: mergedStats.deliveryAddresses,
      icon: '📍',
      color: '#4facfe'
    },
    {
      id: 'points',
      title: 'Loyalty Points',
      value: mergedStats.loyaltyPoints,
      icon: '⭐',
      color: '#ffecd2'
    },
    {
      id: 'avg',
      title: 'Avg Order Value',
      value: `$${mergedStats.avgOrderValue.toFixed(2)}`,
      icon: '📊',
      color: '#a6c1ee'
    }
  ];

  return (
    <div className="profile-stats">
      <h3 className="stats-title">Your Stats</h3>
      <div className="stats-grid">
        {statCards.map(stat => (
          <div key={stat.id} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-title">{stat.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileStats;