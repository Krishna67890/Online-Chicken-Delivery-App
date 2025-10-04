// src/pages/Home/Home.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useNotifications } from '../../hooks/useNotifications';
import { useGeolocation } from '../../hooks/useGeolocation';
import Header from '../../components/Header/Header';
import FoodCard from '../../components/FoodCard/FoodCard';
import Cart from '../../components/Cart/Cart';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter';
import SearchBar from '../../components/SearchBar/SearchBar';
import SpecialOffers from '../../components/SpecialOffers/SpecialOffers';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import LocationPrompt from '../../components/LocationPrompt/LocationPrompt';
import { menuService } from '../../services/menuService';
import { offerService } from '../../services/offerService';
import { analyticsService } from '../../services/analyticsService';
import { priceFormatters } from '../../utils/formatters';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToCart, cartItems, updateQuantity, removeFromCart, cartItemsCount } = useCart();
  const { showSuccess, showError } = useNotifications();
  const { getCurrentPosition, loading: geoLoading, location: userLocation } = useGeolocation();

  const [menuItems, setMenuItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [deliveryTime, setDeliveryTime] = useState(30);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list' | 'featured'

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        const [menuData, featuredData, offersData] = await Promise.all([
          menuService.getItems(),
          menuService.getPopularItems(8),
          offerService.getActiveOffers()
        ]);

        setMenuItems(menuData);
        setFeaturedItems(featuredData);
        setSpecialOffers(offersData);

        // Track home page view
        analyticsService.trackPageView('Home', {
          userLoggedIn: isAuthenticated,
          itemCount: menuData.length
        });

      } catch (err) {
        setError('Failed to load menu items');
        console.error('Home data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [isAuthenticated]);

  // Check for user location on component mount
  useEffect(() => {
    if (!userLocation && !geoLoading) {
      const hasSeenPrompt = localStorage.getItem('location_prompt_seen');
      if (!hasSeenPrompt) {
        setTimeout(() => setShowLocationPrompt(true), 2000);
      }
    }
  }, [userLocation, geoLoading]);

  // Filter and sort menu items
  const filteredItems = useMemo(() => {
    let filtered = [...menuItems];

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'calories':
          return (a.calories || 0) - (b.calories || 0);
        case 'cook-time':
          return (a.cookTime || 0) - (b.cookTime || 0);
        case 'popular':
        default:
          return (b.popularity || 0) - (a.popularity || 0);
      }
    });

    return filtered;
  }, [menuItems, selectedCategory, searchQuery, sortBy]);

  // Categories for filter
  const categories = useMemo(() => [
    { id: 'all', name: 'All Items', icon: '🍗', count: menuItems.length },
    { id: 'fried', name: 'Fried Chicken', icon: '🔥', count: menuItems.filter(item => item.category === 'fried').length },
    { id: 'grilled', name: 'Grilled', icon: '🥗', count: menuItems.filter(item => item.category === 'grilled').length },
    { id: 'wings', name: 'Chicken Wings', icon: '🍗', count: menuItems.filter(item => item.category === 'wings').length },
    { id: 'sandwiches', name: 'Sandwiches', icon: '🥪', count: menuItems.filter(item => item.category === 'sandwiches').length },
    { id: 'international', name: 'International', icon: '🌍', count: menuItems.filter(item => item.category === 'international').length },
    { id: 'healthy', name: 'Healthy Options', icon: '💪', count: menuItems.filter(item => item.category === 'healthy').length },
    { id: 'family', name: 'Family Meals', icon: '👨‍👩‍👧‍👦', count: menuItems.filter(item => item.category === 'family').length }
  ], [menuItems]);

  // Quick stats
  const quickStats = useMemo(() => ({
    totalItems: menuItems.length,
    deliveryTime: deliveryTime,
    rating: 4.8,
    deliveryFee: userLocation ? 2.99 : 4.99
  }), [menuItems.length, deliveryTime, userLocation]);

  // Handle add to cart with analytics
  const handleAddToCart = useCallback((item, quantity = 1, customization = {}) => {
    addToCart(item, quantity, customization);
    
    // Track add to cart event
    analyticsService.track('Product Added to Cart', {
      productId: item.id,
      productName: item.name,
      quantity,
      price: item.price,
      category: item.category,
      hasCustomization: Object.keys(customization).length > 0
    });

    showSuccess(`${item.name} added to cart!`);
  }, [addToCart, showSuccess]);

  // Handle quick category selection
  const handleQuickCategorySelect = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    
    // Scroll to menu section
    document.getElementById('menu-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });

    // Track category selection
    analyticsService.track('Category Selected', {
      categoryId,
      categoryName: categories.find(cat => cat.id === categoryId)?.name
    });
  }, [categories]);

  // Handle location enable
  const handleEnableLocation = async () => {
    try {
      await getCurrentPosition();
      setShowLocationPrompt(false);
      localStorage.setItem('location_prompt_seen', 'true');
      showSuccess('Location enabled! Enjoy faster delivery estimates.');
    } catch (err) {
      showError('Unable to access your location. You can still order!');
    }
  };

  // Handle location dismiss
  const handleDismissLocation = () => {
    setShowLocationPrompt(false);
    localStorage.setItem('location_prompt_seen', 'true');
  };

  // Handle view all menu
  const handleViewAllMenu = () => {
    navigate('/menu');
    analyticsService.track('View All Menu Clicked');
  };

  // Handle quick order
  const handleQuickOrder = (item) => {
    handleAddToCart(item, 1);
    setIsCartOpen(true);
    
    analyticsService.track('Quick Order', {
      productId: item.id,
      productName: item.name
    });
  };

  if (loading) {
    return (
      <div className="home-page">
        <Header />
        <div className="loading-container">
          <LoadingSpinner size="large" />
          <p>Loading delicious chicken options...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <Header />
        <div className="error-container">
          <div className="error-icon">🍗</div>
          <h2>Unable to Load Menu</h2>
          <p>{error}</p>
          <button 
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Header */}
      <Header 
        onCartClick={() => setIsCartOpen(true)}
        cartItemsCount={cartItemsCount}
      />

      {/* Location Prompt */}
      {showLocationPrompt && (
        <LocationPrompt
          onEnable={handleEnableLocation}
          onDismiss={handleDismissLocation}
          loading={geoLoading}
        />
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                <span>🔥 Most Popular Chicken in Town</span>
              </div>
              <h1 className="hero-title">
                Fresh Chicken, 
                <span className="highlight"> Delivered Hot</span>
              </h1>
              <p className="hero-subtitle">
                From crispy fried to healthy grilled, discover 100+ chicken dishes 
                prepared by expert chefs and delivered to your door in {deliveryTime} minutes or less.
              </p>
              
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">{quickStats.totalItems}+</span>
                  <span className="stat-label">Chicken Dishes</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{quickStats.deliveryTime}min</span>
                  <span className="stat-label">Avg. Delivery</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{quickStats.rating}★</span>
                  <span className="stat-label">Customer Rating</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{priceFormatters.formatPrice(quickStats.deliveryFee)}</span>
                  <span className="stat-label">Delivery Fee</span>
                </div>
              </div>

              <div className="hero-actions">
                <button 
                  className="btn-primary btn-large"
                  onClick={() => document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' })}
                >
                  🍗 Order Now
                </button>
                <button 
                  className="btn-outline"
                  onClick={handleViewAllMenu}
                >
                  View Full Menu
                </button>
              </div>

              {userLocation && (
                <div className="location-info">
                  <span className="location-icon">📍</span>
                  <span>Delivering to your area • {quickStats.deliveryTime} min</span>
                </div>
              )}
            </div>

            <div className="hero-visual">
              <div className="floating-food-cards">
                {featuredItems.slice(0, 3).map((item, index) => (
                  <div 
                    key={item.id}
                    className="floating-card"
                    style={{ animationDelay: `${index * 0.5}s` }}
                  >
                    <img src={item.image} alt={item.name} />
                    <div className="card-overlay">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">{priceFormatters.formatPrice(item.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hero-main-image">
                <img 
                  src="https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&h=400&fit=crop" 
                  alt="Delicious chicken variety" 
                />
                <div className="image-badge">
                  <span>Most Ordered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="quick-categories-section">
        <div className="container">
          <h2 className="section-title">Craving Something Specific?</h2>
          <p className="section-subtitle">Quickly find your favorite type of chicken</p>
          
          <div className="categories-scroll">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-pill ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => handleQuickCategorySelect(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
                <span className="category-count">{category.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      {specialOffers.length > 0 && (
        <section className="offers-section">
          <div className="container">
            <SpecialOffers 
              offers={specialOffers}
              onClaimOffer={(offer) => {
                analyticsService.track('Offer Viewed', { offerId: offer.id });
              }}
            />
          </div>
        </section>
      )}

      {/* Featured Items */}
      {featuredItems.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <div className="section-header">
              <div className="header-content">
                <h2 className="section-title">🔥 Customer Favorites</h2>
                <p className="section-subtitle">Most loved dishes by our customers</p>
              </div>
              <button 
                className="btn-text"
                onClick={handleViewAllMenu}
              >
                View All ›
              </button>
            </div>

            <div className="featured-grid">
              {featuredItems.map(item => (
                <FoodCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                  onQuickOrder={handleQuickOrder}
                  featured={true}
                  showQuickActions={true}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Menu Section */}
      <section id="menu-section" className="menu-section">
        <div className="container">
          <div className="section-header">
            <div className="header-content">
              <h2 className="section-title">Our Chicken Menu</h2>
              <p className="section-subtitle">
                {filteredItems.length} delicious options waiting for you
              </p>
            </div>

            <div className="menu-controls">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search chicken dishes..."
                className="menu-search"
              />
              
              <div className="view-controls">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="calories">Calories: Low to High</option>
                  <option value="cook-time">Cook Time</option>
                </select>

                <div className="view-buttons">
                  <button
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    ◼◼
                  </button>
                  <button
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    ≡
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="results-info">
            <span className="results-count">
              Showing {filteredItems.length} of {menuItems.length} items
            </span>
            {(selectedCategory !== 'all' || searchQuery) && (
              <button
                className="btn-text"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Menu Grid */}
          {filteredItems.length > 0 ? (
            <div className={`menu-grid ${viewMode}`}>
              {filteredItems.map(item => (
                <FoodCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                  onQuickOrder={handleQuickOrder}
                  viewMode={viewMode}
                  showNutrition={viewMode === 'list'}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No dishes found</h3>
              <p>Try adjusting your search or filters</p>
              <button
                className="btn-primary"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Chicken Lovers Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Lightning Fast Delivery</h3>
              <p>Hot food delivered in 30 minutes or less, guaranteed fresh and delicious</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🍗</div>
              <h3>Premium Quality Chicken</h3>
              <p>100% antibiotic-free, farm-raised chicken with no artificial hormones</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍🍳</div>
              <h3>Expert Chefs</h3>
              <p>Professional chefs with years of experience in international cuisines</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💝</div>
              <h3>Customizable Orders</h3>
              <p>Adjust spice levels, portions, and ingredients to match your taste</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Ready to Satisfy Your Chicken Craving?</h2>
              <p>Join thousands of happy customers and get your favorite chicken dishes delivered hot and fresh</p>
              <div className="cta-stats">
                <div className="stat">
                  <span className="stat-number">10,000+</span>
                  <span className="stat-label">Happy Customers</span>
                </div>
                <div className="stat">
                  <span className="stat-number">4.8★</span>
                  <span className="stat-label">Average Rating</span>
                </div>
                <div className="stat">
                  <span className="stat-number">30min</span>
                  <span className="stat-label">Avg. Delivery</span>
                </div>
              </div>
              <div className="cta-actions">
                <button 
                  className="btn-primary btn-large"
                  onClick={() => document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' })}
                >
                  🍗 Start Ordering
                </button>
                {!isAuthenticated && (
                  <button 
                    className="btn-outline"
                    onClick={() => navigate('/auth')}
                  >
                    Create Account & Save 15%
                  </button>
                )}
              </div>
            </div>
            <div className="cta-visual">
              <div className="cta-image">
                <img 
                  src="https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=400&fit=crop" 
                  alt="Happy customer with chicken" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          navigate('/checkout');
        }}
      />
    </div>
  );
};

export default Home;