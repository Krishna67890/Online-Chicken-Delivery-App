// src/pages/Profile/AddressBook.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";

import { useAddress } from './hooks/useAddress';
import { useGeolocation } from './hooks/useGeolocation';
import { useNotifications } from './hooks/useNotifications';
import AddressCard from '../../components/AddressCard/AddressCard';
import AddressForm from '../../components/AddressForm/AddressForm';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import MapView from '../../components/MapView/MapView';
import { addressService } from '../../services/addressService';
import { deliveryValidators } from '../../utils/validation';
import { textFormatters, dateFormatters } from '../../utils/formatters';
import './AddressBook.css';

const AddressBook = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError, showWarning } = useNotifications();
  const { getCurrentPosition, loading: geoLoading } = useGeolocation();
  
  const {
    addresses,
    loading,
    error,
    defaultAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    refreshAddresses
  } = useAddress();

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingAddress, setDeletingAddress] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterType, setFilterType] = useState('all'); // 'all', 'home', 'work', 'other'
  const [serviceAreas, setServiceAreas] = useState([]);
  const [suggestedAddresses, setSuggestedAddresses] = useState([]);

  // Load service areas on component mount
  useEffect(() => {
    const loadServiceAreas = async () => {
      try {
        const areas = await addressService.getServiceAreas();
        setServiceAreas(areas);
      } catch (err) {
        console.error('Failed to load service areas:', err);
      }
    };

    loadServiceAreas();
  }, []);

  // Filter addresses based on type
  const filteredAddresses = addresses.filter(address => {
    if (filterType === 'all') return true;
    return address.type === filterType;
  });

  // Get address statistics
  const addressStats = {
    total: addresses.length,
    home: addresses.filter(addr => addr.type === 'home').length,
    work: addresses.filter(addr => addr.type === 'work').length,
    other: addresses.filter(addr => addr.type === 'other').length,
    default: defaultAddress ? 1 : 0
  };

  // Handle address form submission
  const handleSubmitAddress = async (addressData) => {
    try {
      // Validate service area
      const areaValidation = deliveryValidators.validateServiceArea(addressData, serviceAreas);
      if (areaValidation) {
        showWarning(areaValidation);
        return;
      }

      if (editingAddress) {
        await updateAddress(editingAddress.id, addressData);
        showSuccess('Address updated successfully');
      } else {
        await addAddress(addressData);
        showSuccess('Address added successfully');
      }

      setShowForm(false);
      setEditingAddress(null);
      refreshAddresses();
    } catch (err) {
      showError(err.message || 'Failed to save address');
    }
  };

  // Handle address deletion
  const handleDeleteAddress = async () => {
    if (!deletingAddress) return;

    try {
      await deleteAddress(deletingAddress.id);
      showSuccess('Address deleted successfully');
      setDeletingAddress(null);
      refreshAddresses();
    } catch (err) {
      showError(err.message || 'Failed to delete address');
    }
  };

  // Handle set default address
  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress(addressId);
      showSuccess('Default address updated');
      refreshAddresses();
    } catch (err) {
      showError(err.message || 'Failed to set default address');
    }
  };

  // Use current location to suggest addresses
  const handleUseCurrentLocation = async () => {
    try {
      const position = await getCurrentPosition();
      const suggested = await addressService.getAddressSuggestions(
        position.latitude,
        position.longitude
      );
      
      setSuggestedAddresses(suggested);
      setShowForm(true);
      
      if (suggested.length > 0) {
        showSuccess('Found addresses near your current location');
      }
    } catch (err) {
      showError('Unable to get your current location');
    }
  };

  // Duplicate address
  const handleDuplicateAddress = (address) => {
    setEditingAddress(null);
    setShowForm(true);
    // The form will be pre-filled with the address data for duplication
  };

  // View address on map
  const handleViewOnMap = (address) => {
    setSelectedAddress(address);
    setShowMap(true);
  };

  // Check delivery availability for an address
  const checkDeliveryAvailability = (address) => {
    return deliveryValidators.validateServiceArea(address, serviceAreas) === null;
  };

  // Get address usage statistics
  const getAddressUsage = (address) => {
    const usage = address.usageStats || {};
    return {
      orders: usage.orderCount || 0,
      lastUsed: usage.lastUsed ? dateFormatters.formatDate(usage.lastUsed) : 'Never',
      successRate: usage.deliverySuccessRate || '100%'
    };
  };

  // Quick actions for addresses
  const quickActions = [
    {
      id: 'current-location',
      icon: '📍',
      label: 'Use Current Location',
      onClick: handleUseCurrentLocation,
      disabled: geoLoading
    },
    {
      id: 'add-home',
      icon: '🏠',
      label: 'Add Home Address',
      onClick: () => {
        setEditingAddress(null);
        setShowForm(true);
        // Form will pre-select 'home' type
      }
    },
    {
      id: 'add-work',
      icon: '💼',
      label: 'Add Work Address',
      onClick: () => {
        setEditingAddress(null);
        setShowForm(true);
        // Form will pre-select 'work' type
      }
    }
  ];

  if (loading) {
    return (
      <div className="address-book-page">
        <div className="loading-container">
          <LoadingSpinner size="large" />
          <p>Loading your addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="address-book-page">
      {/* Header Section */}
      <div className="address-header">
        <div className="header-content">
          <button 
            className="back-button"
            onClick={() => navigate('/profile')}
          >
            ← Back to Profile
          </button>
          <h1 className="page-title">Address Book</h1>
          <p className="page-subtitle">
            Manage your delivery addresses for faster checkout
          </p>
        </div>

        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-number">{addressStats.total}</div>
            <div className="stat-label">Total Addresses</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{addressStats.default}</div>
            <div className="stat-label">Default</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{addressStats.home}</div>
            <div className="stat-label">Home</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{addressStats.work}</div>
            <div className="stat-label">Work</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <div className="container">
          <h3 className="section-title">Quick Add</h3>
          <div className="quick-actions-grid">
            {quickActions.map(action => (
              <button
                key={action.id}
                className="quick-action-card"
                onClick={action.onClick}
                disabled={action.disabled}
              >
                <span className="action-icon">{action.icon}</span>
                <span className="action-label">{action.label}</span>
                {action.disabled && <LoadingSpinner size="small" />}
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
                🏠 Grid
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                📋 List
              </button>
            </div>

            <div className="filter-controls">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Addresses ({addressStats.total})</option>
                <option value="home">Home ({addressStats.home})</option>
                <option value="work">Work ({addressStats.work})</option>
                <option value="other">Other ({addressStats.other})</option>
              </select>
            </div>

            <button
              className="btn-primary"
              onClick={() => {
                setEditingAddress(null);
                setShowForm(true);
              }}
            >
              + Add New Address
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="addresses-section">
        <div className="container">
          {filteredAddresses.length === 0 ? (
            <EmptyState
              type="address"
              title={filterType === 'all' ? "No addresses saved" : `No ${filterType} addresses`}
              message={
                filterType === 'all' 
                  ? "Add your first address to get started with faster deliveries"
                  : `You haven't saved any ${filterType} addresses yet`
              }
              action={{
                label: 'Add Your First Address',
                onClick: () => setShowForm(true)
              }}
            />
          ) : (
            <div className={`addresses-container ${viewMode}`}>
              {filteredAddresses.map(address => (
                <AddressCard
                  key={address.id}
                  address={address}
                  isDefault={defaultAddress?.id === address.id}
                  isDeliveryAvailable={checkDeliveryAvailability(address)}
                  usageStats={getAddressUsage(address)}
                  viewMode={viewMode}
                  onEdit={() => {
                    setEditingAddress(address);
                    setShowForm(true);
                  }}
                  onDelete={() => setDeletingAddress(address)}
                  onSetDefault={handleSetDefault}
                  onDuplicate={handleDuplicateAddress}
                  onViewOnMap={handleViewOnMap}
                  onUseForOrder={() => {
                    // Set as delivery address and navigate to menu
                    localStorage.setItem('deliveryAddress', JSON.stringify(address));
                    navigate('/menu');
                    showSuccess(`Delivery set to ${address.nickname || address.type}`);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Service Area Notice */}
      <section className="service-notice-section">
        <div className="container">
          <div className="service-notice">
            <div className="notice-icon">🚚</div>
            <div className="notice-content">
              <h4>Delivery Coverage</h4>
              <p>
                We currently deliver to most areas within 10 miles of our restaurants. 
                Some remote locations may have additional delivery fees.
              </p>
            </div>
            <button 
              className="btn-outline"
              onClick={() => navigate('/delivery-areas')}
            >
              Check Your Area
            </button>
          </div>
        </div>
      </section>

      {/* Address Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AddressForm
              address={editingAddress}
              suggestedAddresses={suggestedAddresses}
              serviceAreas={serviceAreas}
              onSubmit={handleSubmitAddress}
              onCancel={() => {
                setShowForm(false);
                setEditingAddress(null);
                setSuggestedAddresses([]);
              }}
              onUseSuggestion={(suggestion) => {
                setSuggestedAddresses([]);
                // Auto-fill form with suggested address
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingAddress && (
        <ConfirmModal
          isOpen={!!deletingAddress}
          title="Delete Address"
          message={`Are you sure you want to delete "${deletingAddress.nickname || deletingAddress.type}" address? This action cannot be undone.`}
          confirmText="Delete Address"
          cancelText="Keep Address"
          onConfirm={handleDeleteAddress}
          onCancel={() => setDeletingAddress(null)}
          type="danger"
        />
      )}

      {/* Map View Modal */}
      {showMap && selectedAddress && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>Address Location</h3>
              <button 
                className="close-button"
                onClick={() => setShowMap(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <MapView
                address={selectedAddress}
                height="400px"
                showMarker
                interactive
              />
              <div className="address-details">
                <h4>{selectedAddress.nickname || textFormatters.capitalizeWords(selectedAddress.type)}</h4>
                <p>{textFormatters.formatAddress(selectedAddress)}</p>
                {selectedAddress.landmark && (
                  <p className="landmark">Near: {selectedAddress.landmark}</p>
                )}
              </div>
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
                onClick={refreshAddresses}
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

export default AddressBook;