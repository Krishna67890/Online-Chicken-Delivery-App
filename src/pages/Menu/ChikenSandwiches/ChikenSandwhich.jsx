// src/pages/Menu/ChickenSandwich.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';
import { useCart } from '../../hooks/useCart';
import { usePreferences } from '../../hooks/usePreferences';
import FoodCard from '../../components/FoodCard/FoodCard';
import AdvancedFilter from '../../components/AdvancedFilter/AdvancedFilter';
import QuickViewModal from '../../components/QuickViewModal/QuickViewModal';
import NutritionInfo from '../../components/NutritionInfo/NutritionInfo';
import LoadingGrid from '../../components/LoadingGrid/LoadingGrid';
import EmptyState from '../../components/EmptyState/EmptyState';
import { sandwichService } from '../../services/sandwichService';
import { priceFormatters, textFormatters } from '../../utils/formatters';
import { menuHelpers } from '../../utils/helpers';
import './ChickenSandwich.css';

const ChickenSandwich = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sandwichItems, setSandwichItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    category: searchParams.get('category') || 'all',
    spiceLevel: searchParams.get('spice') || 'all',
    priceRange: searchParams.get('price') || 'all',
    dietary: searchParams.get('dietary') || 'all',
    rating: searchParams.get('rating') || '0'
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popular');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const { addToCart, isItemInCart, getCartQuantity } = useCart();
  const { isFavorite, toggleFavorite, favorites } = useFavorites();
  const { userPreferences, updatePreferences } = usePreferences();

  // Fetch sandwich data
  useEffect(() => {
    const fetchSandwiches = async () => {
      try {
        setLoading(true);
        const data = await sandwichService.getSandwiches();
        setSandwichItems(data);
      } catch (err) {
        setError('Failed to load sandwiches. Please try again.');
        console.error('Error fetching sandwiches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSandwiches();
  }, []);

  // Update URL with current filters
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (selectedFilters.category !== 'all') params.set('category', selectedFilters.category);
    if (selectedFilters.spiceLevel !== 'all') params.set('spice', selectedFilters.spiceLevel);
    if (selectedFilters.priceRange !== 'all') params.set('price', selectedFilters.priceRange);
    if (selectedFilters.dietary !== 'all') params.set('dietary', selectedFilters.dietary);
    if (selectedFilters.rating !== '0') params.set('rating', selectedFilters.rating);
    if (sortBy !== 'popular') params.set('sort', sortBy);
    if (searchTerm) params.set('search', searchTerm);

    setSearchParams(params);
  }, [selectedFilters, sortBy, searchTerm, setSearchParams]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = [...sandwichItems];

    // Apply search filter
    if (searchTerm) {
      filtered = menuHelpers.searchItems(filtered, searchTerm);
    }

    // Apply category filter
    if (selectedFilters.category !== 'all') {
      filtered = filtered.filter(item => item.category === selectedFilters.category);
    }

    // Apply spice level filter
    if (selectedFilters.spiceLevel !== 'all') {
      const spiceLevel = parseInt(selectedFilters.spiceLevel);
      filtered = filtered.filter(item => item.spiceLevel === spiceLevel);
    }

    // Apply price range filter
    if (selectedFilters.priceRange !== 'all') {
      const [min, max] = selectedFilters.priceRange.split('-').map(Number);
      filtered = filtered.filter(item => {
        if (max) return item.price >= min && item.price <= max;
        return item.price >= min;
      });
    }

    // Apply dietary filter
    if (selectedFilters.dietary !== 'all') {
      filtered = filtered.filter(item => 
        item.dietaryInfo?.[selectedFilters.dietary] === true
      );
    }

    // Apply rating filter
    if (selectedFilters.rating !== '0') {
      const minRating = parseFloat(selectedFilters.rating);
      filtered = filtered.filter(item => item.rating >= minRating);
    }

    // Sort items
    filtered = menuHelpers.sortItems(filtered, sortBy);

    return filtered;
  }, [sandwichItems, selectedFilters, sortBy, searchTerm]);

  // Get recommended items based on user preferences
  const recommendedItems = useMemo(() => {
    return menuHelpers.getRecommendedItems(sandwichItems, userPreferences);
  }, [sandwichItems, userPreferences]);

  // Filter options
  const filterOptions = {
    categories: [
      { id: 'all', name: 'All Sandwiches', icon: '🥪', count: sandwichItems.length },
      { id: 'classic', name: 'Classic', icon: '👑', count: sandwichItems.filter(i => i.category === 'classic').length },
      { id: 'spicy', name: 'Spicy', icon: '🌶️', count: sandwichItems.filter(i => i.category === 'spicy').length },
      { id: 'premium', name: 'Premium', icon: '⭐', count: sandwichItems.filter(i => i.category === 'premium').length },
      { id: 'healthy', name: 'Healthy', icon: '🥗', count: sandwichItems.filter(i => i.category === 'healthy').length },
      { id: 'signature', name: 'Signature', icon: '🏆', count: sandwichItems.filter(i => i.category === 'signature').length }
    ],
    spiceLevels: [
      { id: 'all', name: 'All Spice Levels' },
      { id: '0', name: 'Mild', level: 0 },
      { id: '1', name: 'Medium', level: 1 },
      { id: '2', name: 'Spicy', level: 2 },
      { id: '3', name: 'Extra Hot', level: 3 },
      { id: '4', name: 'Fire', level: 4 }
    ],
    priceRanges: [
      { id: 'all', name: 'Any Price' },
      { id: '0-8', name: 'Under $8' },
      { id: '8-12', name: '$8 - $12' },
      { id: '12-15', name: '$12 - $15' },
      { id: '15-20', name: '$15 - $20' },
      { id: '20-', name: 'Over $20' }
    ],
    dietaryOptions: [
      { id: 'all', name: 'All Dietary' },
      { id: 'glutenFree', name: 'Gluten Free' },
      { id: 'lowCalorie', name: 'Low Calorie' },
      { id: 'highProtein', name: 'High Protein' },
      { id: 'ketoFriendly', name: 'Keto Friendly' }
    ],
    ratings: [
      { id: '0', name: 'Any Rating' },
      { id: '4.5', name: '4.5+ Stars' },
      { id: '4.0', name: '4.0+ Stars' },
      { id: '3.5', name: '3.5+ Stars' },
      { id: '3.0', name: '3.0+ Stars' }
    ]
  };

  const sortOptions = [
    { id: 'popular', name: 'Most Popular' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'spice-low', name: 'Spice: Mild to Hot' },
    { id: 'spice-high', name: 'Spice: Hot to Mild' },
    { id: 'calories-low', name: 'Calories: Low to High' },
    { id: 'calories-high', name: 'Calories: High to Low' },
    { id: 'name', name: 'Name: A to Z' }
  ];

  // Event handlers
  const handleFilterChange = useCallback((filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  const handleQuickView = useCallback(async (item) => {
    try {
      const detailedItem = await sandwichService.getSandwichDetails(item.id);
      setQuickViewItem(detailedItem);
    } catch (err) {
      setQuickViewItem(item); // Fallback to basic item data
    }
  }, []);

  const handleAddToCart = useCallback((item, modifications = {}) => {
    addToCart({
      ...item,
      modifications,
      type: 'sandwich'
    });
    
    // Track user preference
    updatePreferences({
      lastOrderedCategory: 'sandwich',
      previouslyOrdered: [...(userPreferences.previouslyOrdered || []), item.id]
    });
  }, [addToCart, updatePreferences, userPreferences]);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedFilters({
      category: 'all',
      spiceLevel: 'all',
      priceRange: 'all',
      dietary: 'all',
      rating: '0'
    });
    setSearchTerm('');
    setSortBy('popular');
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="chicken-sandwich-page">
        <LoadingGrid count={6} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="chicken-sandwich-page">
        <EmptyState
          type="error"
          title="Unable to Load Sandwiches"
          message={error}
          action={{
            label: 'Try Again',
            onClick: () => window.location.reload()
          }}
        />
      </div>
    );
  }

  return (
    <div className="chicken-sandwich-page">
      {/* Enhanced Hero Section */}
      <section className="sandwich-hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="breadcrumb">
                <Link to="/menu">Menu</Link> / <span>Chicken Sandwiches</span>
              </div>
              <h1 className="hero-title">
                Premium Chicken <span className="highlight">Sandwiches</span>
              </h1>
              <p className="hero-subtitle">
                Handcrafted sandwiches featuring crispy, grilled, or spicy chicken breast, 
                fresh ingredients, and artisan breads. Made fresh to order in 15 minutes or less.
              </p>
              
              <div className="hero-features">
                <div className="feature">
                  <span className="feature-icon">🔥</span>
                  <span>Freshly Prepared</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🌱</span>
                  <span>Quality Ingredients</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">⚡</span>
                  <span>Fast Delivery</span>
                </div>
              </div>

              <div className="hero-actions">
                <button 
                  className="btn-primary"
                  onClick={() => document.getElementById('menu-grid').scrollIntoView({ behavior: 'smooth' })}
                >
                  Order Now
                </button>
                <button className="btn-secondary">
                  <span>📋</span>
                  View Nutrition
                </button>
              </div>
            </div>
            
            <div className="hero-visual">
              <div className="featured-sandwich">
                <div className="sandwich-image">
                  🥪
                </div>
                <div className="sandwich-badge">
                  <span className="badge-text">Most Popular</span>
                </div>
              </div>
              <div className="floating-ingredients">
                {['🍅', '🥬', '🧀', '🥓', '🥑'].map((ingredient, index) => (
                  <div 
                    key={index} 
                    className="floating-ingredient"
                    style={{ animationDelay: `${index * 0.5}s` }}
                  >
                    {ingredient}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Filter Section */}
      <section className="filter-section">
        <div className="container">
          <AdvancedFilter
            filters={selectedFilters}
            filterOptions={filterOptions}
            sortBy={sortBy}
            sortOptions={sortOptions}
            searchTerm={searchTerm}
            viewMode={viewMode}
            onFilterChange={handleFilterChange}
            onSortChange={setSortBy}
            onSearch={handleSearch}
            onViewModeChange={setViewMode}
            onClearFilters={clearAllFilters}
            resultCount={filteredItems.length}
            totalCount={sandwichItems.length}
          />
        </div>
      </section>

      {/* Recommended Section */}
      {recommendedItems.length > 0 && userPreferences.previouslyOrdered && (
        <section className="recommended-section">
          <div className="container">
            <div className="section-header">
              <h2>Recommended For You</h2>
              <p>Based on your preferences and order history</p>
            </div>
            <div className="sandwich-grid compact">
              {recommendedItems.slice(0, 3).map(item => (
                <FoodCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                  onQuickView={handleQuickView}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={isFavorite(item.id)}
                  isInCart={isItemInCart(item.id)}
                  cartQuantity={getCartQuantity(item.id)}
                  viewMode="compact"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Menu Grid */}
      <section id="menu-grid" className="menu-section">
        <div className="container">
          <div className="section-header">
            <h2>All Sandwiches ({filteredItems.length})</h2>
            {filteredItems.length === 0 && (
              <EmptyState
                type="search"
                title="No sandwiches found"
                message="Try adjusting your filters or search term"
                action={{
                  label: 'Clear All Filters',
                  onClick: clearAllFilters
                }}
              />
            )}
          </div>

          <div className={`sandwich-container ${viewMode}`}>
            {filteredItems.map(item => (
              <FoodCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite(item.id)}
                isInCart={isItemInCart(item.id)}
                cartQuantity={getCartQuantity(item.id)}
                viewMode={viewMode}
                customContent={
                  <div className="sandwich-details">
                    <div className="sandwich-tags">
                      {item.tags?.map(tag => (
                        <span key={tag} className={`tag tag-${tag.replace(' ', '-')}`}>
                          {tag}
                        </span>
                      ))}
                      {item.isNew && <span className="tag tag-new">New</span>}
                      {item.isLimited && <span className="tag tag-limited">Limited</span>}
                    </div>
                    
                    <div className="sandwich-meta">
                      <div className="meta-item">
                        <span className="meta-label">Spice:</span>
                        <div className="spice-level">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`spice-dot ${i < item.spiceLevel ? 'active' : ''}`}
                            />
                          ))}
                          <span className="spice-text">
                            {textFormatters.formatSpiceLevel(item.spiceLevel)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="meta-item">
                        <span className="meta-label">Prep:</span>
                        <span className="prep-time">{item.prepTime} min</span>
                      </div>
                      
                      <div className="meta-item">
                        <span className="meta-label">Calories:</span>
                        <span className="calories">{item.calories}</span>
                      </div>
                    </div>

                    {item.nutritionInfo && (
                      <NutritionInfo info={item.nutritionInfo} compact />
                    )}
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Customization CTA */}
      <section className="customization-cta">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Create Your Perfect Sandwich</h2>
              <p>
                Don't see what you're looking for? Build your custom sandwich with your choice of 
                bread, toppings, sauces, and cooking preferences.
              </p>
              <div className="cta-features">
                <div className="cta-feature">
                  <span className="feature-icon">🍞</span>
                  <span>5 Bread Options</span>
                </div>
                <div className="cta-feature">
                  <span className="feature-icon">🥬</span>
                  <span>12+ Toppings</span>
                </div>
                <div className="cta-feature">
                  <span className="feature-icon">🧴</span>
                  <span>8 Signature Sauces</span>
                </div>
                <div className="cta-feature">
                  <span className="feature-icon">🌶️</span>
                  <span>Custom Spice Levels</span>
                </div>
              </div>
              <div className="cta-actions">
                <Link to="/custom-sandwich" className="btn-primary">
                  Build Custom Sandwich
                </Link>
                <Link to="/contact" className="btn-secondary">
                  Special Dietary Needs
                </Link>
              </div>
            </div>
            <div className="cta-visual">
              <div className="customization-preview">
                <div className="bread-top">🍞</div>
                <div className="ingredients-stack">
                  <div className="ingredient">🍗</div>
                  <div className="ingredient">🧀</div>
                  <div className="ingredient">🥬</div>
                  <div className="ingredient">🍅</div>
                </div>
                <div className="bread-bottom">🍞</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewItem && (
        <QuickViewModal
          item={quickViewItem}
          isOpen={!!quickViewItem}
          onClose={() => setQuickViewItem(null)}
          onAddToCart={handleAddToCart}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite(quickViewItem.id)}
          isInCart={isItemInCart(quickViewItem.id)}
        />
      )}
    </div>
  );
};

export default ChickenSandwich;