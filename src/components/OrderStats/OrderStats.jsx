import React from 'react';
import './OrderStats.css';

const OrderStats = ({ stats, totalOrders, filteredOrders, onRefresh }) => {
  const { total, totalSpent, averageOrder, statusCounts } = stats;

  // Calculate percentages for status counts
  const totalStatusOrders = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="order-stats">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Total Orders</h3>
            <button className="refresh-btn" onClick={onRefresh} title="Refresh">
              ↻
            </button>
          </div>
          <div className="stat-value">{totalOrders}</div>
          <div className="stat-subtitle">All time</div>
        </div>

        <div className="stat-card">
          <h3>Total Spent</h3>
          <div className="stat-value">${totalSpent?.toFixed(2) || '0.00'}</div>
          <div className="stat-subtitle">Lifetime value</div>
        </div>

        <div className="stat-card">
          <h3>Average Order</h3>
          <div className="stat-value">${averageOrder?.toFixed(2) || '0.00'}</div>
          <div className="stat-subtitle">Per order</div>
        </div>

        <div className="stat-card">
          <h3>Filtered Orders</h3>
          <div className="stat-value">{filteredOrders}</div>
          <div className="stat-subtitle">Currently displayed</div>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="status-breakdown">
        <h3>Order Status Breakdown</h3>
        <div className="status-bars">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="status-item">
              <div className="status-label">
                <span className="status-name">{status.replace(/_/g, ' ')}</span>
                <span className="status-count">{count}</span>
              </div>
              <div className="status-bar">
                <div 
                  className="status-fill"
                  style={{ 
                    width: totalStatusOrders > 0 ? `${(count / totalStatusOrders) * 100}%` : '0%' 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick insights */}
      <div className="insights-section">
        <h3>Quick Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">📊</div>
            <div className="insight-content">
              <h4>Order Completion Rate</h4>
              <p>
                {totalStatusOrders > 0 
                  ? `${Math.round((statusCounts.delivered / totalStatusOrders) * 100)}%` 
                  : '0%'} delivered
              </p>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">💰</div>
            <div className="insight-content">
              <h4>Revenue Insights</h4>
              <p>${totalSpent?.toFixed(2) || '0.00'} total spent</p>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">🔄</div>
            <div className="insight-content">
              <h4>Order Frequency</h4>
              <p>
                {totalOrders > 0 
                  ? `${(totalOrders / 12).toFixed(1)}/month avg` 
                  : 'No orders yet'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;