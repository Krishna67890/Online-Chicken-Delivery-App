import React from 'react';

const MaintenanceMode = () => {
  return (
    <div className="maintenance-mode" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div className="maintenance-icon" style={{ fontSize: '64px', marginBottom: '20px' }}>🍗🛠️</div>
      <h1>Under Maintenance</h1>
      <p>We're currently updating our kitchen to serve you better.</p>
      <p>Please check back soon for the most delicious chicken in town!</p>
      <div className="estimated-time" style={{ marginTop: '20px', fontStyle: 'italic', color: '#666' }}>
        Estimated time until reopening: 2 hours
      </div>
    </div>
  );
};

export default MaintenanceMode;