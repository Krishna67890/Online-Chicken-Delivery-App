// src/pages/Menu/FriedChicken.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FriedChicken.css';

const FriedChicken = ({ addToCart }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Sample fried chicken data
  const friedChickenItems = [
    {
      id: 1,
      name: 'Original Recipe',
      price: 12.99,
      description: 'Our signature blend of 11 herbs and spices, crispy golden perfection',
      image: '🍗',
      category: 'classic',
      spiceLevel: 1,
      rating: 4.9,
      reviews: 1245,
      popular: true,
      tags: ['signature', 'best seller'],
      ingredients: ['Chicken', 'Wheat Flour', 'Secret Spice Blend', 'Buttermilk'],
      nutrition: { calories: 320, protein: 28, fat: 18, carbs: 12 }
    },
    {
      id: 2,
      name: 'Extra Crispy',
      price: 13.99,
      description: 'Double-breaded for an extra crunchy texture that stays crispy longer',
      image: '🍗🔥',
      category: 'crispy',
      spiceLevel: 1,
      rating: 4.7,
      reviews: 876,
      popular: true,
      tags: ['crunchy', 'double-breaded'],
      ingredients: ['Chicken', 'Wheat Flour', 'Cornstarch', 'Seasoning', 'Buttermilk'],
      nutrition: { calories: 380, protein: 26, fat: 22, carbs: 18 }
    },
    {
      id: 3,
      name: 'Nashville Hot',
      price: 14.99,
      description: 'Fiery hot chicken with cayenne pepper glaze and pickles',
      image: '🌶️🍗',
      category: 'spicy',
      spiceLevel: 4,
      rating: 4.8,
      reviews: 1023,
      popular: false,
      tags: ['spicy', 'hot'],
      ingredients: ['Chicken', 'Cayenne Pepper', 'Brown Sugar', 'Paprika', 'Garlic'],
      nutrition: { calories: 350, protein: 29, fat: 20, carbs: 14 }
    },
    {
      id: 4,
      name: 'Honey Glazed',
      price: 13.49,
      description: 'Sweet honey glaze over crispy chicken with a touch of spice',
      image: '🍯🍗',
      category: 'glazed',
      spiceLevel: 1,
      rating: 4.6,
      reviews: 654,
      popular: false,
      tags: ['sweet', 'glazed'],
      ingredients: ['Chicken', 'Honey', 'Brown Sugar', 'Soy Sauce', 'Ginger'],
      nutrition: { calories: 390, protein: 27, fat: 19, carbs: 24 }
    },
    {
      id: 5,
      name: 'Korean Style',
      price: 15.99,
      description: 'Double-fried with gochujang glaze, sesame seeds, and scallions',
      image: '🇰🇷🍗',
      category: 'premium',
      spiceLevel: 3,
      rating: 4.9,
      reviews: 789,
      popular: true,
      tags: ['premium', 'asian'],
      ingredients: ['Chicken', 'Gochujang', 'Soy Sauce', 'Sesame Oil', 'Ginger', 'Garlic'],
      nutrition: { calories: 370, protein: 30, fat: 21, carbs: 16 }
    },
    {
      id: 6,
      name: 'Buttermilk Fried',
      price: 12.49,
      description: 'Marinated in buttermilk for 24 hours, tender and juicy inside',
      image: '🥛🍗',
      category: 'classic',
      spiceLevel: 1,
      rating: 4.5,
      reviews: 543,
      popular: false,
      tags: ['juicy', 'marinated'],
      ingredients: ['Chicken', 'Buttermilk', 'Flour', 'Seasonings'],
      nutrition: { calories: 340, protein: 31, fat: 19, carbs: 13 }
    }
  ];

  const categories = [
    { id: 'all', name: 'All Chicken', icon: '🍗' },
    { id: 'classic', name: 'Classic', icon: '👑' },
    { id: 'crispy', name: 'Extra Crispy', icon: '🔥' },
    { id: 'spicy', name: 'Spicy', icon: '🌶️' },
    { id: 'glazed', name: 'Glazed', icon: '🍯' },
    { id: 'premium', name: 'Premium', icon: '⭐' }
  ];

  const sortOptions = [
    { id: 'popular', name: 'Most Popular' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Highest Rated' }
  ];

  const filteredItems = friedChickenItems
    .filter(item => activeFilter === 'all' || item.category === activeFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
        default:
          return (b.popular - a.popular) || (b.rating - a.rating);
      }
    });

  const openModal = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedItem(null);
    document.body.style.overflow = 'auto';
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(selectedItem);
    }
    closeModal();
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.keyCode === 27) closeModal();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="fried-chicken-page">
      {/* Hero Section */}
      <section className="chicken-hero">
        <div className="hero-content">
          <h1 className="hero-title">Crispy Fried Chicken</h1>
          <p className="hero-subtitle">Hand-breaded, freshly prepared, and cooked to golden perfection</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">24hr</span>
              <span className="stat-label">Marinated</span>
            </div>
            <div className="stat">
              <span className="stat-number">11</span>
              <span className="stat-label">Secret Herbs & Spices</span>
            </div>
            <div className="stat">
              <span className="stat-number">4.8★</span>
              <span className="stat-label">Customer Rating</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-chicken">🍗</div>
          <div className="floating-ingredient">🌿</div>
          <div className="floating-ingredient">🧂</div>
          <div className="floating-ingredient">🔥</div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="filter-section">
        <div className="container">
          <div className="filter-header">
            <h2>Choose Your Style</h2>
            <div className="filter-controls">
              <div className="category-filters">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`filter-btn ${activeFilter === category.id ? 'active' : ''}`}
                    onClick={() => setActiveFilter(category.id)}
                  >
                    <span className="filter-icon">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
              
              <div className="sort-dropdown">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="menu-section">
        <div className="container">
          <div className="chicken-grid">
            {filteredItems.map(item => (
              <div key={item.id} className="chicken-card">
                <div className="card-image">
                  <span className="food-emoji">{item.image}</span>
                  {item.popular && <span className="popular-badge">Popular</span>}
                </div>
                
                <div className="card-content">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                  
                  <div className="item-meta">
                    <div className="spice-level">
                      <span>Spice: </span>
                      {[...Array(4)].map((_, i) => (
                        <span
                          key={i}
                          className={`spice-dot ${i < item.spiceLevel ? 'active' : ''}`}
                        ></span>
                      ))}
                    </div>
                    
                    <div className="rating">
                      <span className="star">⭐</span>
                      {item.rating} <span className="reviews">({item.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="item-tags">
                    {item.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  
                  <div className="card-footer">
                    <span className="item-price">${item.price}</span>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => openModal(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Combo Section */}
      <section className="combo-section">
        <div className="container">
          <h2>Chicken Combos</h2>
          <div className="combo-grid">
            <div className="combo-card">
              <div className="combo-image">🍗🍟🥤</div>
              <h3>Classic Combo</h3>
              <p>2 pc Chicken, Fries, and Drink</p>
              <div className="combo-price">$15.99 <span className="original-price">$18.99</span></div>
            </div>
            
            <div className="combo-card">
              <div className="combo-image">🍗🍗🍟🥤</div>
              <h3>Family Feast</h3>
              <p>8 pc Chicken, 2 Large Sides, 4 Biscuits</p>
              <div className="combo-price">$29.99 <span className="original-price">$35.99</span></div>
            </div>
            
            <div className="combo-card">
              <div className="combo-image">🍗🍗🍗🍟🥤</div>
              <h3>Party Pack</h3>
              <p>16 pc Chicken, 3 Large Sides, 6 Biscuits</p>
              <div className="combo-price">$49.99 <span className="original-price">$59.99</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-body">
              <div className="modal-image">
                <span className="food-emoji-large">{selectedItem.image}</span>
              </div>
              
              <div className="modal-details">
                <h2>{selectedItem.name}</h2>
                <p className="modal-description">{selectedItem.description}</p>
                
                <div className="nutrition-info">
                  <h4>Nutrition Facts</h4>
                  <div className="nutrition-grid">
                    <div className="nutrition-item">
                      <span className="nutrition-value">{selectedItem.nutrition.calories}</span>
                      <span className="nutrition-label">Calories</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-value">{selectedItem.nutrition.protein}g</span>
                      <span className="nutrition-label">Protein</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-value">{selectedItem.nutrition.fat}g</span>
                      <span className="nutrition-label">Fat</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-value">{selectedItem.nutrition.carbs}g</span>
                      <span className="nutrition-label">Carbs</span>
                    </div>
                  </div>
                </div>
                
                <div className="ingredients">
                  <h4>Ingredients</h4>
                  <div className="ingredients-list">
                    {selectedItem.ingredients.map((ingredient, index) => (
                      <span key={index} className="ingredient-tag">{ingredient}</span>
                    ))}
                  </div>
                </div>
                
                <div className="quantity-selector">
                  <label htmlFor="quantity">Quantity:</label>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >−</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                </div>
                
                <div className="modal-actions">
                  <div className="modal-price">${(selectedItem.price * quantity).toFixed(2)}</div>
                  <button className="add-to-cart-modal" onClick={handleAddToCart}>
                    Add {quantity} to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriedChicken;