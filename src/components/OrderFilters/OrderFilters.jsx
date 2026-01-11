import React from 'react';
import './OrderFilters.css';

const OrderFilters = ({ 
  filters, 
  onFiltersChange, 
  viewMode, 
  onViewModeChange,
  onBulkSelectAll,
  isAllSelected,
  selectedCount,
  totalCount
}) => {
  const handleStatusChange = (e) => {
    onFiltersChange({ ...filters, status: e.target.value });
  };

  const handleDateRangeChange = (e) => {
    onFiltersChange({ ...filters, dateRange: e.target.value });
  };

  const handleSortChange = (e) => {
    onFiltersChange({ ...filters, sortBy: e.target.value });
  };

  const handleSearchChange = (e) => {
    onFiltersChange({ ...filters, searchTerm: e.target.value });
  };

  return (
    <div className="order-filters">
      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="status-filter">Status</label>
          <select 
            id="status-filter"
            value={filters.status} 
            onChange={handleStatusChange}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="date-range-filter">Date Range</label>
          <select 
            id="date-range-filter"
            value={filters.dateRange} 
            onChange={handleDateRangeChange}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="3months">Last 3 Months</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-filter">Sort By</label>
          <select 
            id="sort-filter"
            value={filters.sortBy} 
            onChange={handleSortChange}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
          </select>
        </div>

        <div className="filter-group search-group">
          <label htmlFor="search-orders">Search Orders</label>
          <input
            id="search-orders"
            type="text"
            placeholder="Search by order #, items..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="filter-actions">
        <div className="view-mode-toggle">
          <button
            className={`btn-view-mode ${viewMode === 'detailed' ? 'active' : ''}`}
            onClick={() => onViewModeChange('detailed')}
          >
            Detailed
          </button>
          <button
            className={`btn-view-mode ${viewMode === 'compact' ? 'active' : ''}`}
            onClick={() => onViewModeChange('compact')}
          >
            Compact
          </button>
        </div>

        <div className="bulk-actions">
          <button
            className={`btn-bulk-select ${isAllSelected ? 'selected' : ''}`}
            onClick={onBulkSelectAll}
          >
            {isAllSelected ? `Unselect All (${totalCount})` : `Select All (${totalCount})`}
          </button>
          
          {selectedCount > 0 && (
            <span className="selected-count">
              {selectedCount} selected
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;