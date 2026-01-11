import React from 'react';
import './ProfileHeader.css';

const ProfileHeader = ({ 
  user, 
  onEditProfile,
  onLogout,
  showActions = true
}) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="profile-header">
      <div className="profile-avatar-section">
        <div className="profile-avatar">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || 'User'} />
          ) : (
            <div className="avatar-initials">
              {getInitials(user?.displayName || user?.email || 'User')}
            </div>
          )}
        </div>
        
        <div className="profile-info">
          <h1 className="profile-name">
            {user?.displayName || user?.email?.split('@')[0] || 'User'}
          </h1>
          
          <div className="profile-contact">
            {user?.email && <span className="email">{user.email}</span>}
            {user?.phoneNumber && <span className="phone">{user.phoneNumber}</span>}
          </div>
          
          {user?.memberSince && (
            <div className="membership-info">
              Member since {new Date(user.memberSince).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {showActions && (
        <div className="profile-actions">
          <button className="btn btn-primary" onClick={onEditProfile}>
            Edit Profile
          </button>
          <button className="btn btn-outline" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;