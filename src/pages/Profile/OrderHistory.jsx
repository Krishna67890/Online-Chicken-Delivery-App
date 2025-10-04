// src/pages/Profile/OrderHistory.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useOrders } from './hooks/useOrders';
import { useNotifications } from './hooks/useNotifications';
import OrderCard from '../../components/OrderCard/OrderCard';
import OrderFilters from '../../components/OrderFilters/OrderFilters';
import OrderStats from '../../components/OrderStats/OrderStats';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/EmptyState/EmptyState';
import ReorderModal from '../../components/ReorderModal/ReorderModal';
import OrderTrackingModal from '../../components/OrderTrackingModal/OrderTrackingModal';
import RatingModal from '../../components/RatingModal/RatingModal';
import { orderService } from '../../services/orderService';
import { priceFormatters, dateFormatters } from '../../utils/formatters';
import { orderHelpers } from '../../utils/helpers';
import './OrderHistory.css';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();
  
  const {
    orders,
    loading,
    error,
    stats,
    refreshOrders,
    reorder,
    cancelOrder,
    rateOrder
  } = useOrders();

  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    sortBy: 'newest',
    searchTerm: ''
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reorderModalOpen, setReorderModalOpen] = useState(false);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('detailed'); // 'detailed' or 'compact'
  const [bulkSelection, setBulkSelection] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const rangeMap = {
        'today': new Date(now.setHours(0, 0, 0, 0)),
        'week': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        'month': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        '3months': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      };

      if (filters.dateRange in rangeMap) {
        filtered = filtered.filter(order => 
          new Date(order.createdAt) >= rangeMap[filters.dateRange]
        );
      }
    }

    // Apply search filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(term) ||
        order.items.some(item => item.name.toLowerCase().includes(term)) ||
        order.deliveryAddress?.street?.toLowerCase().includes(term)
      );
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price-high':
          return b.total - a.total;
        case 'price-low':
          return a.total - b.total;
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [orders, filters]);

  // Group orders by date
  const groupedOrders = useMemo(() => {
    const groups = {};
    filteredOrders.forEach(order => {
      const date = new Date(order.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(order);
    });
    return groups;
  }, [filteredOrders]);

  // Order statistics for the filtered set
  const filteredStats = useMemo(() => {
    const filteredStats = {
      total: filteredOrders.length,
      totalSpent: filteredOrders.reduce((sum, order) => sum + order.total, 0),
      averageOrder: filteredOrders.length > 0 ? 
        filteredOrders.reduce((sum, order) => sum + order.total, 0) / filteredOrders.length : 0,
      statusCounts: {
        delivered: filteredOrders.filter(o => o.status === 'delivered').length,
        cancelled: filteredOrders.filter(o => o.status === 'cancelled').length,
        pending: filteredOrders.filter(o => ['pending', 'confirmed', 'preparing'].includes(o.status)).length
      }
    };
    return filteredStats;
  }, [filteredOrders]);

  // Event handlers
  const handleReorder = useCallback(async (order) => {
    try {
      setSelectedOrder(order);
      setReorderModalOpen(true);
    } catch (err) {
      showError('Failed to prepare reorder');
    }
  }, [showError]);

  const handleConfirmReorder = useCallback(async (order, modifications = {}) => {
    try {
      await reorder(order.id, modifications);
      setReorderModalOpen(false);
      setSelectedOrder(null);
      showSuccess('Order placed successfully!');
      navigate('/cart');
    } catch (err) {
      showError(err.message || 'Failed to place reorder');
    }
  }, [reorder, showSuccess, showError, navigate]);

  const handleCancelOrder = useCallback(async (order) => {
    if (!orderHelpers.canCancelOrder(order.status)) {
      showError('This order cannot be cancelled');
      return;
    }

    try {
      await cancelOrder(order.id);
      showSuccess('Order cancelled successfully');
      refreshOrders();
    } catch (err) {
      showError(err.message || 'Failed to cancel order');
    }
  }, [cancelOrder, showSuccess, showError, refreshOrders]);

  const handleRateOrder = useCallback(async (order, rating, review) => {
    try {
      await rateOrder(order.id, rating, review);
      setRatingModalOpen(false);
      setSelectedOrder(null);
      showSuccess('Thank you for your feedback!');
      refreshOrders();
    } catch (err) {
      showError('Failed to submit rating');
    }
  }, [rateOrder, showSuccess, showError, refreshOrders]);

  const handleTrackOrder = useCallback((order) => {
    setSelectedOrder(order);
    setTrackingModalOpen(true);
  }, []);

  const handleViewOrderDetails = useCallback((order) => {
    navigate(`/orders/${order.id}`);
  }, [navigate]);

  const handleBulkSelect = useCallback((orderId) => {
    setBulkSelection(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  }, []);

  const handleBulkSelectAll = useCallback(() => {
    if (bulkSelection.length === filteredOrders.length) {
      setBulkSelection([]);
    } else {
      setBulkSelection(filteredOrders.map(order => order.id));
    }
  }, [bulkSelection.length, filteredOrders]);

  const handleExportOrders = useCallback(async () => {
    try {
      setExportLoading(true);
      const ordersToExport = bulkSelection.length > 0 
        ? orders.filter(order => bulkSelection.includes(order.id))
        : filteredOrders;
      
      await orderService.exportOrders(ordersToExport);
      showSuccess('Orders exported successfully');
      setBulkSelection([]);
    } catch (err) {
      showError('Failed to export orders');
    } finally {
      setExportLoading(false);
    }
  }, [bulkSelection, orders, filteredOrders, showSuccess, showError]);

  const handleContactSupport = useCallback((order) => {
    navigate('/support', { 
      state: { 
        orderId: order.id,
        orderNumber: order.orderNumber 
      } 
    });
  }, [navigate]);

  // Quick actions for orders
  const getOrderActions = useCallback((order) => {
    const baseActions = [
      {
        id: 'view-details',
        label: 'View Details',
        icon: '📋',
        onClick: () => handleViewOrderDetails(order)
      },
      {
        id: 'contact-support',
        label: 'Contact Support',
        icon: '💬',
        onClick: () => handleContactSupport(order)
      }
    ];

    const statusActions = [];
    
    if (orderHelpers.canCancelOrder(order.status)) {
      statusActions.push({
        id: 'cancel',
        label: 'Cancel Order',
        icon: '❌',
        onClick: () => handleCancelOrder(order),
        variant: 'danger'
      });
    }

    if (order.status === 'delivered' && !order.isRated) {
      statusActions.push({
        id: 'rate',
        label: 'Rate Order',
        icon: '⭐',
        onClick: () => {
          setSelectedOrder(order);
          setRatingModalOpen(true);
        }
      });
    }

    if (order.status !== 'cancelled') {
      statusActions.push({
        id: 'reorder',
        label: 'Reorder',
        icon: '🔄',
        onClick: () => handleReorder(order)
      });
    }

    if (['preparing', 'ready', 'out_for_delivery'].includes(order.status)) {
      statusActions.push({
        id: 'track',
        label: 'Track Order',
        icon: '🚚',
        onClick: () => handleTrackOrder(order)
      });
    }

    return [...statusActions, ...baseActions];
  }, [handleViewOrderDetails, handleContactSupport, handleCancelOrder, handleReorder, handleTrackOrder]);

  // Load orders on component mount
  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  if (loading && orders.length === 0) {
    return (
      <div className="order-history-page">
        <div className="loading-container">
          <LoadingSpinner size="large" />
          <p>Loading your order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      {/* Header Section */}
      <div className="orders-header">
        <div className="header-content">
          <button 
            className="back-button"
            onClick={() => navigate('/profile')}
          >
            ← Back to Profile
          </button>
          <h1 className="page-title">Order History</h1>
          <p className="page-subtitle">
            Track, reorder, and manage your past orders
          </p>
        </div>

        <OrderStats 
          stats={{ ...stats, filtered: filteredStats }}
          totalOrders={orders.length}
          filteredOrders={filteredOrders.length}
        />
      </div>

      {/* Bulk Actions Bar */}
      {bulkSelection.length > 0 && (
        <div className="bulk-actions-bar">
          <div className="container">
            <div className="bulk-actions-content">
              <span className="selection-count">
                {bulkSelection.length} order{bulkSelection.length !== 1 ? 's' : ''} selected
              </span>
              <div className="bulk-buttons">
                <button
                  className="btn-outline"
                  onClick={handleExportOrders}
                  disabled={exportLoading}
                >
                  {exportLoading ? <LoadingSpinner size="small" /> : '📥 Export Selected'}
                </button>
                <button
                  className="btn-text"
                  onClick={() => setBulkSelection([])}
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls Section */}
      <section className="controls-section">
        <div className="container">
          <OrderFilters
            filters={filters}
            onFiltersChange={setFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onBulkSelectAll={handleBulkSelectAll}
            isAllSelected={bulkSelection.length === filteredOrders.length && filteredOrders.length > 0}
            selectedCount={bulkSelection.length}
            totalCount={filteredOrders.length}
          />
        </div>
      </section>

      {/* Orders Section */}
      <section className="orders-section">
        <div className="container">
          {filteredOrders.length === 0 ? (
            <EmptyState
              type={filters.status !== 'all' || filters.searchTerm ? 'search' : 'order'}
              title={
                filters.searchTerm 
                  ? "No orders found" 
                  : filters.status !== 'all'
                  ? `No ${filters.status} orders`
                  : "No orders yet"
              }
              message={
                filters.searchTerm || filters.status !== 'all'
                  ? "Try adjusting your filters or search term"
                  : "Start your first order and it will appear here"
              }
              action={
                filters.searchTerm || filters.status !== 'all'
                  ? {
                      label: 'Clear Filters',
                      onClick: () => setFilters({
                        status: 'all',
                        dateRange: 'all',
                        sortBy: 'newest',
                        searchTerm: ''
                      })
                    }
                  : {
                      label: 'Browse Menu',
                      onClick: () => navigate('/menu')
                    }
              }
            />
          ) : (
            <div className="orders-container">
              {Object.entries(groupedOrders).map(([date, dateOrders]) => (
                <div key={date} className="order-group">
                  <h3 className="group-date">
                    {dateFormatters.formatDate(date)}
                    <span className="order-count">({dateOrders.length} orders)</span>
                  </h3>
                  
                  <div className="orders-list">
                    {dateOrders.map(order => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        viewMode={viewMode}
                        isSelected={bulkSelection.includes(order.id)}
                        onSelect={() => handleBulkSelect(order.id)}
                        actions={getOrderActions(order)}
                        onViewDetails={handleViewOrderDetails}
                        onReorder={handleReorder}
                        onTrackOrder={handleTrackOrder}
                        onRateOrder={() => {
                          setSelectedOrder(order);
                          setRatingModalOpen(true);
                        }}
                        onCancelOrder={handleCancelOrder}
                        onContactSupport={handleContactSupport}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Stats CTA */}
      {orders.length > 0 && (
        <section className="stats-cta-section">
          <div className="container">
            <div className="stats-cta">
              <div className="cta-content">
                <h3>Loyalty Rewards</h3>
                <p>
                  You've spent {priceFormatters.formatPrice(stats.totalSpent)} across {stats.total} orders. 
                  Keep ordering to unlock exclusive rewards!
                </p>
                <div className="loyalty-progress">
                  <div 
                    className="progress-bar"
                    style={{ width: `${Math.min((stats.totalSpent / 500) * 100, 100)}%` }}
                  ></div>
                  <span className="progress-text">
                    {priceFormatters.formatPrice(stats.totalSpent)} of {priceFormatters.formatPrice(500)} to Gold Status
                  </span>
                </div>
              </div>
              <div className="cta-actions">
                <Link to="/rewards" className="btn-primary">
                  View Rewards
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Modals */}
      {reorderModalOpen && selectedOrder && (
        <ReorderModal
          order={selectedOrder}
          isOpen={reorderModalOpen}
          onClose={() => {
            setReorderModalOpen(false);
            setSelectedOrder(null);
          }}
          onConfirm={handleConfirmReorder}
        />
      )}

      {trackingModalOpen && selectedOrder && (
        <OrderTrackingModal
          order={selectedOrder}
          isOpen={trackingModalOpen}
          onClose={() => {
            setTrackingModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {ratingModalOpen && selectedOrder && (
        <RatingModal
          order={selectedOrder}
          isOpen={ratingModalOpen}
          onClose={() => {
            setRatingModalOpen(false);
            setSelectedOrder(null);
          }}
          onSubmit={handleRateOrder}
        />
      )}

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <div className="container">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <span className="error-message">{error}</span>
              <button 
                className="retry-button"
                onClick={refreshOrders}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;