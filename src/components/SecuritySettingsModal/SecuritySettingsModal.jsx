import React, { useState } from 'react';
import './SecuritySettingsModal.css';

const SecuritySettingsModal = ({ 
  isOpen, 
  onClose, 
  user, 
  onSave,
  title = 'Security Settings',
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    recoveryEmail: user?.email || '',
    trustedDevices: []
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('password');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (formData.newPassword) {
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (activeTab === 'recovery' && !formData.recoveryEmail) {
      newErrors.recoveryEmail = 'Recovery email is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSave(formData);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const securityTabs = [
    { id: 'password', label: 'Password', icon: '🔒' },
    { id: '2fa', label: 'Two-Factor', icon: '📱' },
    { id: 'devices', label: 'Devices', icon: '💻' },
    { id: 'recovery', label: 'Recovery', icon: '📧' }
  ];

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="security-settings-modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="security-tabs">
            {securityTabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="security-form">
            {activeTab === 'password' && (
              <div className="password-settings">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={errors.currentPassword ? 'error' : ''}
                    placeholder="Enter current password"
                  />
                  {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={errors.newPassword ? 'error' : ''}
                    placeholder="Enter new password"
                  />
                  {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
              </div>
            )}

            {activeTab === '2fa' && (
              <div className="two-factor-settings">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Two-Factor Authentication</h4>
                    <p>Protect your account with an extra layer of security</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="twoFactorEnabled"
                      checked={formData.twoFactorEnabled}
                      onChange={handleChange}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                {formData.twoFactorEnabled && (
                  <div className="two-factor-setup">
                    <div className="setup-step">
                      <h5>Setup Steps:</h5>
                      <ol>
                        <li>Download Google Authenticator or similar app</li>
                        <li>Scan the QR code with your app</li>
                        <li>Enter the 6-digit code from the app</li>
                        <li>Save your backup codes in a secure location</li>
                      </ol>
                    </div>
                    <div className="qr-code-placeholder">
                      <div className="qr-placeholder">QR CODE PLACEHOLDER</div>
                      <p>Or use this setup key: <code>ABCD-EFGH-IJKL-MNOP</code></p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'devices' && (
              <div className="trusted-devices">
                <h4>Trusted Devices</h4>
                <p>Manage devices that have accessed your account</p>
                
                <div className="device-list">
                  <div className="device-item">
                    <div className="device-info">
                      <div className="device-icon">💻</div>
                      <div className="device-details">
                        <h5>Chrome on Windows</h5>
                        <p>Last active: Today at 10:30 AM</p>
                      </div>
                    </div>
                    <button className="btn-secondary">Sign Out</button>
                  </div>
                  
                  <div className="device-item">
                    <div className="device-info">
                      <div className="device-icon">📱</div>
                      <div className="device-details">
                        <h5>Mobile Safari on iPhone</h5>
                        <p>Last active: Yesterday at 7:45 PM</p>
                      </div>
                    </div>
                    <button className="btn-secondary">Sign Out</button>
                  </div>
                  
                  <div className="device-item current-device">
                    <div className="device-info">
                      <div className="device-icon">🌐</div>
                      <div className="device-details">
                        <h5>This Device</h5>
                        <p>Currently active</p>
                      </div>
                    </div>
                    <span className="current-label">Current</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'recovery' && (
              <div className="recovery-settings">
                <div className="form-group">
                  <label htmlFor="recoveryEmail">Recovery Email</label>
                  <input
                    type="email"
                    id="recoveryEmail"
                    name="recoveryEmail"
                    value={formData.recoveryEmail}
                    onChange={handleChange}
                    className={errors.recoveryEmail ? 'error' : ''}
                    placeholder="Enter recovery email"
                  />
                  {errors.recoveryEmail && <span className="error-message">{errors.recoveryEmail}</span>}
                  <p className="help-text">We'll use this email to help you recover your account if needed</p>
                </div>

                <div className="form-group">
                  <label>Backup Codes</label>
                  <div className="backup-codes">
                    <p>Generate backup codes for account recovery:</p>
                    <button type="button" className="btn-outline">Generate Backup Codes</button>
                    <p className="help-text">Store these codes securely. Each code can only be used once.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsModal;