// src/pages/SpecialOffers/SpecialOffers.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useOffers } from '../../hooks/useOffers';
import { useCart } from '../../hooks/useCart';
import { useNotifications } from '../../hooks/useNotifications';
import OfferCard from '../../components/OfferCard/OfferCard';
import OfferFilters from '../../components/OfferFilters/OfferFilters';
import CountdownTimer from '../../components/CountdownTimer/CountdownTimer';
import ClaimOfferModal from '../../components/ClaimOfferModal/ClaimOfferModal';
import LoadingGrid from '../../components/LoadingGrid/LoadingGrid';
import EmptyState from '../../components/EmptyState/EmptyState';
import { offerService } from '../../services/offerService';
import { analyticsService } from '../../services/analyticsService';
import { dateFormatters, priceFormatters } from '../../utils/formatters';
import './SpecialOffers.css';

const SpecialOffers = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { showSuccess, showError, showWarning } = useNotifications();

  const {
    offers,
    loading,
    error,
    claimedOffers,
    claimOffer,
    refreshOffers
  } = useOffers();

  const [filters, setFilters] = useState({
    category: 'all',
    status: 'active',
    sortBy: 'popular'
  });
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimingOffer, setClaimingOffer] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'featured'
  const [searchTerm, setSearchTerm] = useState('');
  const [autoClaimTimer, setAutoClaimTimer] = useState(null);

  // Load offers on component mount
  useEffect(() => {
    refreshOffers();
    
    // Track page view
    analyticsService.trackEvent('special_offers_page_view');
  }, [refreshOffers]);

  // Auto-claim flash offers
  useEffect(() => {
    const flashOffers = offers.filter(offer => 
      offer.type === 'flash' && 
      !isOfferClaimed(offer.id) && 
      isOfferActive(offer)
    );

    if (flashOffers.length > 0) {
      const timer = setTimeout(() => {
        handleAutoClaimFlashOffers(flashOffers);
      }, 5000); // Auto-claim after 5 seconds

      setAutoClaimTimer(timer);
    }

    return () => {
      if (autoClaimTimer) {
        clearTimeout(autoClaimTimer);
      }
    };
  }, [offers]);

  // Filter and sort offers
  const filteredOffers = useMemo(() => {
    let filtered = [...offers];

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(offer => offer.category === filters.category);
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(offer => {
        if (filters.status === 'active') return isOfferActive(offer);
        if (filters.status === 'upcoming') return isOfferUpcoming(offer);
        if (filters.status === 'expired') return isOfferExpired(offer);
        if (filters.status === 'claimed') return isOfferClaimed(offer.id);
        return true;
      });
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(offer => 
        offer.title.toLowerCase().includes(term) ||
        offer.description.toLowerCase().includes(term) ||
        offer.code?.toLowerCase().includes(term)
      );
    }

    // Sort offers
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'discount-high':
          return (b.discountValue || 0) - (a.discountValue || 0);
        case 'discount-low':
          return (a.discountValue || 0) - (b.discountValue || 0);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'ending-soon':
          return new Date(a.expiresAt) - new Date(b.expiresAt);
        case 'popular':
        default:
          return (b.popularity || 0) - (a.popularity || 0);
      }
    });

    return filtered;
  }, [offers, filters, searchTerm]);

  // Get featured offers (flash deals + popular)
  const featuredOffers = useMemo(() => {
    return offers
      .filter(offer => 
        (offer.isFeatured || offer.type === 'flash') && 
        isOfferActive(offer)
      )
      .slice(0, 3);
  }, [offers]);

  // Get offer categories
  const categories = useMemo(() => {
    const allCategories = ['all', ...new Set(offers.map(offer => offer.category))];
    return allCategories.map(category => ({
      id: category,
      name: category === 'all' ? 'All Offers' : category.replace(/-/g, ' '),
      count: offers.filter(offer => 
        category === 'all' || offer.category === category
      ).length
    }));
  }, [offers]);

  // Check offer status
  const isOfferActive = (offer) => {
    const now = new Date();
    return new Date(offer.startsAt) <= now && new Date(offer.expiresAt) > now;
  };

  const isOfferUpcoming = (offer) => {
    return new Date(offer.startsAt) > new Date();
  };

  const isOfferExpired = (offer) => {
    return new Date(offer.expiresAt) <= new Date();
  };

  const isOfferClaimed = (offerId) => {
    return claimedOffers.some(claimed => claimed.offerId === offerId);
  };

  // Handle offer selection
  const handleOfferSelect = (offer) => {
    setSelectedOffer(offer);
    analyticsService.trackEvent('offer_viewed', { offerId: offer.id, offerType: offer.type });
  };

  // Handle offer claim
  const handleClaimOffer = async (offer) => {
    if (!isAuthenticated) {
      showWarning('Please sign in to claim this offer');
      navigate('/login', { state: { returnUrl: '/special-offers' } });
      return;
    }

    if (isOfferClaimed(offer.id)) {
      showWarning('You have already claimed this offer');
      return;
    }

    if (!isOfferActive(offer)) {
      showError('This offer is no longer available');
      return;
    }

    setClaimingOffer(offer);
    setClaimModalOpen(true);
  };

  // Handle confirm claim
  const handleConfirmClaim = async (offer) => {
    try {
      await claimOffer(offer.id);
      setClaimModalOpen(false);
      setClaimingOffer(null);
      
      showSuccess(`🎉 Offer claimed successfully! ${offer.code ? `Use code: ${offer.code}` : ''}`);
      
      analyticsService.trackEvent('offer_claimed', { 
        offerId: offer.id, 
        offerType: offer.type,
        discountValue: offer.discountValue
      });

      // Auto-add to cart if it's an instant offer
      if (offer.autoApply) {
        addToCart({
          id: `offer-${offer.id}`,
          name: offer.title,
          price: 0,
          type: 'offer',
          offerId: offer.id
        });
        showSuccess('Offer added to your cart!');
      }
    } catch (err) {
      showError(err.message || 'Failed to claim offer');
    }
  };

  // Handle auto-claim flash offers
  const handleAutoClaimFlashOffers = async (flashOffers) => {
    for (const offer of flashOffers) {
      if (isAuthenticated && !isOfferClaimed(offer.id) && isOfferActive(offer)) {
        try {
          await claimOffer(offer.id);
          showSuccess(`⚡ Flash offer claimed: ${offer.title}`);
        } catch (err) {
          console.error('Failed to auto-claim flash offer:', err);
        }
      }
    }
  };

  // Handle quick action
  const handleQuickAction = (action) => {
    switch (action) {
      case 'browse-menu':
        navigate('/menu');
        break;
      case 'view-cart':
        navigate('/cart');
        break;
      case 'share-offers':
        if (navigator.share) {
          navigator.share({
            title: 'Amazing Chicken Deals!',
            text: 'Check out these exclusive offers from our chicken delivery app',
            url: window.location.href
          });
        } else {
          showSuccess('Share link copied to clipboard!');
          navigator.clipboard.writeText(window.location.href);
        }
        break;
      default:
        break;
    }
  };

  // Get offer badge type
  const getOfferBadge = (offer) => {
    if (offer.type === 'flash') return { text: '⚡ Flash Deal', color: 'var(--error)' };
    if (offer.type === 'first-order') return { text: '👋 First Order', color: 'var(--success)' };
    if (offer.type === 'loyalty') return { text: '⭐ Loyalty', color: 'var(--warning)' };
    if (offer.type === 'seasonal') return { text: '🎄 Seasonal', color: 'var(--info)' };
    return { text: '💫 Special', color: 'var(--primary)' };
  };

  // Quick actions
  const quickActions = [
    {
      id: 'flash-deals',
      icon: '⚡',
      title: 'Flash Deals',
      description: 'Limited time offers',
      action: () => setFilters(prev => ({ ...prev, category: 'flash-deals' })),
      count: offers.filter(o => o.type === 'flash' && isOfferActive(o)).length
    },
    {
      id: 'free-delivery',
      icon: '🚚',
      title: 'Free Delivery',
      description: 'No delivery fees',
      action: () => setFilters(prev => ({ ...prev, category: 'free-delivery' })),
      count: offers.filter(o => o.category === 'free-delivery' && isOfferActive(o)).length
    },
    {
      id: 'combo-deals',
      icon: '🍗',
      title: 'Combo Deals',
      description: 'Perfect combinations',
      action: () => setFilters(prev => ({ ...prev, category: 'combo-deals' })),
      count: offers.filter(o => o.category === 'combo-deals' && isOfferActive(o)).length
    },
    {
      id: 'share',
      icon: '📤',
      title: 'Share Offers',
      description: 'Tell your friends',
      action: () => handleQuickAction('share-offers')
    }
  ];

  // Sort options
  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'discount-high', label: 'Highest Discount' },
    { value: 'discount-low', label: 'Lowest Discount' },
    { value: 'newest', label: 'Newest First' },
    { value: 'ending-soon', label: 'Ending Soon' }
  ];

  if (loading && offers.length === 0) {
    return (
      <div className="special-offers-page">
        <LoadingGrid count={6} type="offer" />
      </div>
    );
  }

  return (
    <div className="special-offers-page">
      {/* Hero Section */}
      <section className="offers-hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Special <span className="highlight">Offers</span> & Deals
              </h1>
              <p className="hero-subtitle">
                Exclusive discounts, limited-time deals, and special promotions 
                crafted just for our chicken lovers. Don't miss out!
              </p>
              
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">
                    {offers.filter(o => isOfferActive(o)).length}
                  </span>
                  <span className="stat-label">Active Offers</span>
                </div>
                <div className="stat">
                  <span className="stat-number">
                    {claimedOffers.length}
                  </span>
                  <span className="stat-label">Claimed by You</span>
                </div>
                <div className="stat">
                  <span className="stat-number">
                    {offers.filter(o => o.type === 'flash').length}
                  </span>
                  <span className="stat-label">Flash Deals</span>
                </div>
              </div>

              <div className="hero-actions">
                <button 
                  className="btn-primary btn-large"
                  onClick={() => document.getElementById('offers-grid').scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Offers
                </button>
                <button 
                  className="btn-outline"
                  onClick={() => navigate('/menu')}
                >
                  Order Now
                </button>
              </div>
            </div>
            
            <div className="hero-visual">
              <div className="offers-illustration">
                <div className="floating-offer flash">⚡</div>
                <div className="floating-offer discount">%</div>
                <div className="floating-offer free">FREE</div>
                <div className="main-illustration">🍗🎁</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <div className="container">
          <h2 className="section-title">Quick Access</h2>
          <div className="quick-actions-grid">
            {quickActions.map(action => (
              <button
                key={action.id}
                className="quick-action-card"
                onClick={action.action}
              >
                <div className="action-icon">{action.icon}</div>
                <div className="action-content">
                  <h3 className="action-title">{action.title}</h3>
                  <p className="action-description">{action.description}</p>
                </div>
                {action.count > 0 && (
                  <div className="action-count">{action.count}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Offers Carousel */}
      {featuredOffers.length > 0 && (
        <section className="featured-offers-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">🔥 Featured Deals</h2>
              <div className="section-actions">
                <button 
                  className="btn-text"
                  onClick={() => setViewMode('featured')}
                >
                  View All Featured
                </button>
              </div>
            </div>
            <div className="featured-offers-carousel">
              {featuredOffers.map(offer => (
                <div key={offer.id} className="featured-offer-card">
                  <div className="offer-badge" style={{ 
                    backgroundColor: getOfferBadge(offer).color 
                  }}>
                    {getOfferBadge(offer).text}
                  </div>
                  
                  <div className="offer-content">
                    <h3 className="offer-title">{offer.title}</h3>
                    <p className="offer-description">{offer.description}</p>
                    
                    <div className="offer-discount">
                      {offer.discountType === 'percentage' && (
                        <span className="discount-amount">
                          {offer.discountValue}% OFF
                        </span>
                      )}
                      {offer.discountType === 'fixed' && (
                        <span className="discount-amount">
                          {priceFormatters.formatPrice(offer.discountValue)} OFF
                        </span>
                      )}
                      {offer.discountType === 'free' && (
                        <span className="discount-amount">
                          FREE {offer.freeItem}
                        </span>
                      )}
                    </div>

                    {offer.expiresAt && (
                      <div className="offer-timer">
                        <CountdownTimer 
                          endDate={offer.expiresAt}
                          onComplete={() => refreshOffers()}
                        />
                      </div>
                    )}

                    <div className="offer-actions">
                      <button
                        className="btn-primary"
                        onClick={() => handleClaimOffer(offer)}
                        disabled={isOfferClaimed(offer.id) || !isOfferActive(offer)}
                      >
                        {isOfferClaimed(offer.id) ? 'Claimed ✓' : 'Claim Offer'}
                      </button>
                      <button
                        className="btn-outline"
                        onClick={() => handleOfferSelect(offer)}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Offers Section */}
      <section id="offers-grid" className="offers-main-section">
        <div className="container">
          {/* Filters & Controls */}
          <div className="controls-section">
            <OfferFilters
              filters={filters}
              onFiltersChange={setFilters}
              categories={categories}
              sortOptions={sortOptions}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              totalResults={filteredOffers.length}
            />
          </div>

          {/* Offers Grid */}
          <div className="offers-content">
            {filteredOffers.length === 0 ? (
              <EmptyState
                type="offer"
                title="No offers found"
                message={
                  filters.category !== 'all' || filters.status !== 'active' || searchTerm
                    ? "Try adjusting your filters to see more offers"
                    : "Check back later for new offers and promotions"
                }
                action={
                  filters.category !== 'all' || filters.status !== 'active' || searchTerm
                    ? {
                        label: 'Clear Filters',
                        onClick: () => {
                          setFilters({
                            category: 'all',
                            status: 'active',
                            sortBy: 'popular'
                          });
                          setSearchTerm('');
                        }
                      }
                    : {
                        label: 'Browse Menu',
                        onClick: () => navigate('/menu')
                      }
                }
              />
            ) : (
              <div className={`offers-container ${viewMode}`}>
                {filteredOffers.map(offer => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    viewMode={viewMode}
                    isClaimed={isOfferClaimed(offer.id)}
                    isActive={isOfferActive(offer)}
                    isUpcoming={isOfferUpcoming(offer)}
                    onSelect={handleOfferSelect}
                    onClaim={handleClaimOffer}
                    onAddToCart={addToCart}
                    badge={getOfferBadge(offer)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Loyalty Program CTA */}
      <section className="loyalty-cta-section">
        <div className="container">
          <div className="loyalty-cta">
            <div className="cta-content">
              <h2>Join Our Loyalty Program</h2>
              <p>
                Earn points on every order, get exclusive member-only offers, 
                and enjoy special birthday treats. The more you order, the more you save!
              </p>
              <div className="loyalty-features">
                <div className="feature">
                  <span className="feature-icon">⭐</span>
                  <span>1 point per $1 spent</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🎁</span>
                  <span>Exclusive member offers</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🎂</span>
                  <span>Birthday freebies</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🚚</span>
                  <span>Free delivery rewards</span>
                </div>
              </div>
              <div className="cta-actions">
                {isAuthenticated ? (
                  <button 
                    className="btn-primary"
                    onClick={() => navigate('/profile/loyalty')}
                  >
                    View My Rewards
                  </button>
                ) : (
                  <button 
                    className="btn-primary"
                    onClick={() => navigate('/signup')}
                  >
                    Join Now - It's Free!
                  </button>
                )}
                <button 
                  className="btn-outline"
                  onClick={() => navigate('/loyalty-program')}
                >
                  Learn More
                </button>
              </div>
            </div>
            <div className="cta-visual">
              <div className="loyalty-illustration">
                <div className="reward-tier bronze">🥉</div>
                <div className="reward-tier silver">🥈</div>
                <div className="reward-tier gold">🥇</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Claim Offer Modal */}
      {claimModalOpen && claimingOffer && (
        <ClaimOfferModal
          offer={claimingOffer}
          isOpen={claimModalOpen}
          onClose={() => {
            setClaimModalOpen(false);
            setClaimingOffer(null);
          }}
          onConfirm={handleConfirmClaim}
          isClaimed={isOfferClaimed(claimingOffer.id)}
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
                onClick={refreshOffers}
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

export default SpecialOffers;