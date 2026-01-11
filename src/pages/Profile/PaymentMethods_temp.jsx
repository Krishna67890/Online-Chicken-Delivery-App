// src/pages/Profile/PaymentMethods.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { usePayment } from './hooks/usePayment';
import { useNotifications } from './hooks/useNotifications';
import PaymentCard from '../../components/PaymentCard/PaymentCard';
import PaymentForm from '../../components/PaymentForm/PaymentForm';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import SecurityVerification from '../../components/SecurityVerification/SecurityVerification';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { paymentService } from '../../services/paymentService';
import { validationSchemas, validators } from '../../utils/validation';
import { textFormatters, dateFormatters } from '../../utils/formatters';
import './PaymentMethods.css';

const PaymentMethods = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError, showWarning } = useNotifications();

  const {
    paymentMethods,
    loading,
    error,
    defaultMethod,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultMethod,
    refreshPaymentMethods
  } = usePayment();

  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [deletingMethod, setDeletingMethod] = useState(null);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterType, setFilterType] = useState('all'); // 'all', 'card', 'digital', 'bank'
  const [securityCode, setSecurityCode] = useState({});
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);

  // Load transaction history
  useEffect(() => {
    const loadTransactionHistory = async () => {
      try {
        const history = await paymentService.getTransactionHistory();
        setTransactionHistory(history);
      } catch (err) {
        console.error('Failed to load transaction history:', err);
      }
    };

    loadTransactionHistory();
  }, []);

  // Filter payment methods
  const filteredMethods = paymentMethods.filter(method => {
    if (filterType === 'all') return true;
    return method.type === filterType;
  });

  // Payment method statistics
  const paymentStats = {
    total: paymentMethods.length,
    cards: paymentMethods.filter(m => m.type === 'card').length,
    digital: paymentMethods.filter(m => m.type === 'digital_wallet').length,
    bank: paymentMethods.filter(m => m.type === 'bank_account').length,
    default: defaultMethod ? 1 : 0
  };

  // Handle security verification
  const handleSecurityVerification = useCallback((action, method = null) => {
    setPendingAction({ type: action, method });
    setVerificationOpen(true);
  }, []);

  const handleVerificationComplete = useCallback(async (verified) => {
    if (!verified || !pendingAction) {
      setPendingAction(null);
      setVerificationOpen(false);
      return;
    }

    try {
      const { type, method } = pendingAction;

      switch (type) {
        case 'delete':
          await deletePaymentMethod(method.id);
          showSuccess('Payment method deleted successfully');
          break;
        
        case 'setDefault':
          await setDefaultMethod(method.id);
          showSuccess('Default payment method updated');
          break;
        
        case 'edit':
          setEditingMethod(method);
          setShowForm(true);
          break;
        
        default:
          break;
      }

      refreshPaymentMethods();
    } catch (err) {
      showError(err.message || 'Failed to complete action');
    } finally {
      setPendingAction(null);
      setVerificationOpen(false);
    }
  }, [pendingAction, deletePaymentMethod, setDefaultMethod, showSuccess, showError, refreshPaymentMethods]);

  // Handle form submission
  const handleSubmitPaymentMethod = async (paymentData) => {
    try {
      // Validate card details
      if (paymentData.type === 'card') {
        const expiryError = validators.cardExpiry(paymentData.expiryDate);
        if (expiryError) {
          showError(expiryError);
          return;
        }

        const cvvError = validators.pattern(
          paymentData.cvv, 
          /^\d{3,4}$/, 
          'CVV must be 3 or 4 digits'
        );
        if (cvvError) {
          showError(cvvError);
          return;
        }
      }

      if (editingMethod) {
        await updatePaymentMethod(editingMethod.id, paymentData);
        showSuccess('Payment method updated successfully');
      } else {
        await addPaymentMethod(paymentData);
        showSuccess('Payment method added successfully');
      }

      setShowForm(false);
      setEditingMethod(null);
      refreshPaymentMethods();
    } catch (err) {
      showError(err.message || 'Failed to save payment method');
    }
  };

  // Handle set default with security check
  const handleSetDefault = (method) => {
    if (method.requiresVerification) {
      handleSecurityVerification('setDefault', method);
    } else {
      setDefaultMethod(method.id);
      showSuccess('Default payment method updated');
    }
  };

  // Handle delete with security check
  const handleDelete = (method) => {
    if (method.requiresVerification || method.isDefault) {
      handleSecurityVerification('delete', method);
    } else {
      setDeletingMethod(method);
    }
  };

  // Handle edit with security check
  const handleEdit = (method) => {
    if (method.requiresVerification) {
      handleSecurityVerification('edit', method);
    } else {
      setEditingMethod(method);
      setShowForm(true);
    }
  };

  // Handle quick actions
  const handleQuickAction = (action) => {
    switch (action) {
      case 'add-card':
        setEditingMethod(null);
        setShowForm(true);
        break;
      
      case 'add-wallet':
        setEditingMethod(null);
        setShowForm(true);
        // Pre-select digital wallet type
        break;
      
      case 'security-settings':
        navigate('/profile/security');
        break;
      
      case 'transaction-history':
        setShowTransactionHistory(true);
        break;
      
      default:
        break;
    }
  };

  // Quick actions
  const quickActions = [
    {
      id: 'add-card',
      icon: '💳',
      label: 'Add Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      color: 'var(--primary)'
    },
    {
      id: 'add-wallet',
      icon: '📱',
      label: 'Add Digital Wallet',
      description: 'Apple Pay, Google Pay, PayPal',
      color: 'var(--secondary)'
    },
    {
      id: 'security-settings',
      icon: '🔒',
      label: 'Security Settings',
      description: 'Manage payment security',
      color: 'var(--warning)'
    },
    {
      id: 'transaction-history',
      icon: '📊',
      label: 'Transaction History',
      description: 'View payment history',
      color: 'var(--info)'
    }
  ];

  // Get payment method usage stats
  const getMethodUsage = (method) => {
    const usage = method.usageStats || {};
    return {
      orders: usage.orderCount || 0,
      lastUsed: usage.lastUsed ? dateFormatters.formatDate(usage.lastUsed) : 'Never',
      successRate: `${usage.successRate || 100}%`
    };
  };

  // Check if payment method is expired
  const isMethodExpired = (method) => {
    if (method.type !== 'card') return false;
    
    const [month, year] = method.expiryDate.split('/');
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    return expiryDate < new Date();
  };

  if (loading && paymentMethods.length === 0) {
    return (
      <div className="payment-methods-page">
        <div className="loading-container">
          <LoadingSpinner size="large" />
          <p>Loading your payment methods...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-methods-page">
      {/* Header Section */}
      <div className="payment-header">
        <div className="header-content">
          <button 
            className="back-button"
            onClick={() => navigate('/profile')}
          >
            ← Back to Profile
          </button>
          <h1 className="page-title">Payment Methods</h1>
          <p className="page-subtitle">
            Manage your payment options for faster checkout
          </p>
        </div>

        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-number">{paymentStats.total}</div>
            <div className="stat-label">Total Methods</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{paymentStats.default}</div>
            <div className="stat-label">Default</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{paymentStats.cards}</div>
            <div className="stat-label">Cards</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{paymentStats.digital}</div>
            <div className="stat-label">Digital</div>
          </div>
        </div>
      </div>

      {/* Security Alert Banner */}
      <div className="security-alert">
        <div className="container">
          <div className="alert-content">
            <span className="alert-icon">🔒</span>
            <div className="alert-text">
              <strong>Your payment information is secure</strong>
              <span>We use bank-level encryption to protect your data</span>
            </div>
            <button 
              className="alert-action"
              onClick={() => navigate('/security')}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <div className="container">
          <h3 className="section-title">Quick Actions</h3>
          <div className="quick-actions-grid">
            {quickActions.map(action => (
              <button
                key={action.id}
                className="quick-action-card"
                onClick={() => handleQuickAction(action.id)}
                style={{ '--action-color': action.color }}
              >
                <div className="action-icon-wrapper">
                  <span className="action-icon">{action.icon}</span>
                </div>
                <div className="action-content">
                  <span className="action-label">{action.label}</span>
                  <span className="action-description">{action.description}</span>
                </div>
                <div className="action-arrow">→</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Controls Bar */}
      <section className="controls-section">
        <div className="container">
          <div className="controls-bar">
            <div className="view-controls">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                🏠 Grid View
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                📋 List View
              </button>
            </div>

            <div className="filter-controls">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Methods ({paymentStats.total})</option>
                <option value="card">Cards ({paymentStats.cards})</option>
                <option value="digital_wallet">Digital Wallets ({paymentStats.digital})</option>
                <option value="bank_account">Bank Accounts ({paymentStats.bank})</option>
              </select>
            </div>

            <button
              className="btn-primary"
              onClick={() => {
                setEditingMethod(null);
                setShowForm(true);
              }}
            >
              + Add Payment Method
            </button>
          </div>
        </div>
      </section>

      {/* Payment Methods Grid */}
      <section className="methods-section">
        <div className="container">
          {filteredMethods.length === 0 ? (
            <EmptyState
              type="payment"
              title={filterType === 'all' ? "No payment methods" : `No ${filterType} methods`}
              message={
                filterType === 'all' 
                  ? "Add your first payment method for faster checkout"
                  : `You haven't saved any ${filterType} payment methods yet`
              }
              action={{
                label: 'Add Payment Method',
                onClick: () => setShowForm(true)
              }}
            />
          ) : (
            <div className={`methods-container ${viewMode}`}>
              {filteredMethods.map(method => (
                <PaymentCard
                  key={method.id}
                  method={method}
                  isDefault={defaultMethod?.id === method.id}
                  isExpired={isMethodExpired(method)}
                  usageStats={getMethodUsage(method)}
                  viewMode={viewMode}
                  securityCode={securityCode[method.id]}
                  onSecurityCodeChange={(code) => setSecurityCode(prev => ({
                    ...prev,
                    [method.id]: code
                  }))}
                  onEdit={() => handleEdit(method)}
                  onDelete={() => handleDelete(method)}
                  onSetDefault={() => handleSetDefault(method)}
                  onViewTransactions={() => {
                    setShowTransactionHistory(true);
                    // Filter transactions for this method
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Security Features Section */}
      <section className="security-features-section">
        <div className="container">
          <h3 className="section-title">Security Features</h3>
          <div className="security-features">
            <div className="security-feature">
              <div className="feature-icon">🔐</div>
              <div className="feature-content">
                <h4>Tokenization</h4>
                <p>Your payment details are tokenized and never stored on our servers</p>
              </div>
            </div>
            <div className="security-feature">
              <div className="feature-icon">🛡️</div>
              <div className="feature-content">
                <h4>PCI DSS Compliant</h4>
                <p>We maintain the highest level of payment security standards</p>
              </div>
            </div>
            <div className="security-feature">
              <div className="feature-icon">👁️</div>
              <div className="feature-content">
                <h4>Fraud Monitoring</h4>
                <p>24/7 monitoring to detect and prevent suspicious activity</p>
              </div>
            </div>
            <div className="security-feature">
              <div className="feature-icon">🔔</div>
              <div className="feature-content">
                <h4>Instant Alerts</h4>
                <p>Get notified immediately of any payment activity</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <PaymentForm
              method={editingMethod}
              onSubmit={handleSubmitPaymentMethod}
              onCancel={() => {
                setShowForm(false);
                setEditingMethod(null);
              }}
              mode={editingMethod ? 'edit' : 'add'}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingMethod && (
        <ConfirmModal
          isOpen={!!deletingMethod}
          title="Delete Payment Method"
          message={
            <div>
              <p>Are you sure you want to delete this payment method?</p>
              {deletingMethod.isDefault && (
                <p className="warning-text">
                  ⚠️ This is your default payment method. You'll need to set a new default method.
                </p>
              )}
            </div>
          }
          confirmText="Delete Method"
          cancelText="Keep Method"
          onConfirm={async () => {
            try {
              await deletePaymentMethod(deletingMethod.id);
              showSuccess('Payment method deleted successfully');
              setDeletingMethod(null);
              refreshPaymentMethods();
            } catch (err) {
              showError(err.message || 'Failed to delete payment method');
            }
          }}
          onCancel={() => setDeletingMethod(null)}
          type="danger"
        />
      )}

      {/* Security Verification Modal */}
      {verificationOpen && (
        <SecurityVerification
          isOpen={verificationOpen}
          onClose={() => {
            setVerificationOpen(false);
            setPendingAction(null);
          }}
          onComplete={handleVerificationComplete}
          actionType={pendingAction?.type}
          method={pendingAction?.method}
        />
      )}

      {/* Transaction History Modal */}
      {showTransactionHistory && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>Transaction History</h3>
              <button 
                className="close-button"
                onClick={() => setShowTransactionHistory(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="transaction-list">
                {transactionHistory.slice(0, 10).map(transaction => (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-info">
                      <div className="transaction-main">
                        <span className="transaction-amount">
                          {priceFormatters.formatPrice(transaction.amount)}
                        </span>
                        <span className="transaction-description">
                          {transaction.description}
                        </span>
                      </div>
                      <div className="transaction-meta">
                        <span className="transaction-date">
                          {dateFormatters.formatDateTime(transaction.date)}
                        </span>
                        <span className={`transaction-status status-${transaction.status}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                    <div className="transaction-method">
                      {textFormatters.formatCreditCard(transaction.paymentMethod)}
                    </div>
                  </div>
                ))}
              </div>
              {transactionHistory.length === 0 && (
                <EmptyState
                  type="transaction"
                  title="No transactions yet"
                  message="Your transaction history will appear here"
                />
              )}
            </div>
          </div>
        </div>
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
                onClick={refreshPaymentMethods}
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

export default PaymentMethods;