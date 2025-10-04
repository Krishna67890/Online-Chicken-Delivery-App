// src/pages/Menu/Menu.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import FoodCard from '../../components/FoodCard/FoodCard';
import Cart from '../../components/Cart/Cart';
import './Menu.css';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [spiceLevel, setSpiceLevel] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('menu');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const navigate = useNavigate();
  const { category } = useParams();

  // Set active category from URL parameter
  useEffect(() => {
    if (category && categories.some(c => c.id === category)) {
      setActiveCategory(category);
    }
  }, [category]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('chickenCart')) || [];
    setCartItems(savedCart);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('chickenCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Menu categories
  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️', count: 45, color: '#FF6B6B' },
    { id: 'fried', name: 'Fried Chicken', icon: '🍗', count: 12, color: '#FFD166' },
    { id: 'grilled', name: 'Grilled Chicken', icon: '🔥', count: 8, color: '#06D6A0' },
    { id: 'wings', name: 'Chicken Wings', icon: '🍗', count: 6, color: '#118AB2' },
    { id: 'sandwiches', name: 'Sandwiches', icon: '🥪', count: 9, color: '#073B4C' },
    { id: 'sides', name: 'Sides & Extras', icon: '🍟', count: 7, color: '#FF9E64' },
    { id: 'combos', name: 'Meal Combos', icon: '🎯', count: 5, color: '#7209B7' },
    { id: 'specials', name: 'Special Offers', icon: '🎁', count: 5, color: '#F72585' },
  ];

  // Sample menu items data
  const menuItems = [
    {
      id: 1,
      name: "Crispy Fried Chicken Bucket",
      description: "8 pieces of our signature crispy fried chicken with secret blend of 11 herbs and spices. Perfect for sharing with family and friends.",
      price: 24.99,
      image: "/images/crispy-bucket.jpg",
      category: "fried",
      spiceLevel: 2,
      isPopular: true,
      isNew: false,
      discount: 15,
      rating: 4.8,
      reviewCount: 128,
      prepTime: "20-25 min",
      calories: 320,
      tags: ["popular", "family", "crispy", "shareable"],
      ingredients: ["Chicken", "Secret Spices", "Buttermilk", "Flour", "Vegetable Oil"],
      nutrition: {
        protein: 35,
        carbs: 12,
        fat: 18,
        sodium: 890
      },
      customization: [
        {
          name: "Spice Level",
          options: ["Mild", "Medium", "Hot", "Extra Hot"],
          default: "Medium"
        },
        {
          name: "Dipping Sauce",
          options: ["Ranch", "Honey Mustard", "BBQ", "Buffalo"],
          default: "Ranch"
        }
      ]
    },
    {
      id: 2,
      name: "Grilled Chicken Platter",
      description: "Juicy grilled chicken breast with roasted vegetables and signature herb sauce. A healthy and delicious option for fitness enthusiasts.",
      price: 18.99,
      image: "/images/grilled-platter.jpg",
      category: "grilled",
      spiceLevel: 1,
      isPopular: false,
      isNew: true,
      discount: 0,
      rating: 4.6,
      reviewCount: 89,
      prepTime: "15-20 min",
      calories: 280,
      tags: ["healthy", "grilled", "new", "protein"],
      ingredients: ["Chicken Breast", "Bell Peppers", "Zucchini", "Herb Sauce", "Olive Oil"],
      nutrition: {
        protein: 42,
        carbs: 8,
        fat: 9,
        sodium: 560
      },
      customization: [
        {
          name: "Vegetables",
          options: ["Mixed", "Broccoli Only", "Carrots Only", "No Vegetables"],
          default: "Mixed"
        },
        {
          name: "Sauce",
          options: ["Herb", "Lemon", "Garlic", "No Sauce"],
          default: "Herb"
        }
      ]
    },
    {
      id: 3,
      name: "Spicy Buffalo Wings",
      description: "12 pieces of crispy wings tossed in your choice of sauce (Mild, Hot, or Extra Hot). Perfect for game night or parties.",
      price: 16.99,
      image: "/images/spicy-wings.jpg",
      category: "wings",
      spiceLevel: 3,
      isPopular: true,
      isNew: false,
      discount: 10,
      rating: 4.7,
      reviewCount: 204,
      prepTime: "18-22 min",
      calories: 380,
      tags: ["spicy", "popular", "shareable", "appetizer"],
      ingredients: ["Chicken Wings", "Buffalo Sauce", "Butter", "Garlic", "Celery"],
      nutrition: {
        protein: 28,
        carbs: 6,
        fat: 26,
        sodium: 1120
      },
      customization: [
        {
          name: "Sauce Heat",
          options: ["Mild", "Medium", "Hot", "Extra Hot"],
          default: "Hot"
        },
        {
          name: "Side",
          options: ["Celery Sticks", "Carrot Sticks", "Both", "None"],
          default: "Celery Sticks"
        }
      ]
    },
    {
      id: 4,
      name: "Classic Chicken Sandwich",
      description: "Crispy chicken fillet with lettuce, tomato, mayo on brioche bun. Our signature sandwich that never disappoints.",
      price: 12.99,
      image: "/images/chicken-sandwich.jpg",
      category: "sandwiches",
      spiceLevel: 2,
      isPopular: true,
      isNew: false,
      discount: 5,
      rating: 4.5,
      reviewCount: 156,
      prepTime: "12-15 min",
      calories: 420,
      tags: ["classic", "lunch", "popular", "quick"],
      ingredients: ["Chicken Breast", "Brioche Bun", "Lettuce", "Tomato", "Mayo"],
      nutrition: {
        protein: 32,
        carbs: 38,
        fat: 16,
        sodium: 780
      },
      customization: [
        {
          name: "Toppings",
          options: ["All", "No Tomato", "No Lettuce", "No Mayo"],
          default: "All"
        },
        {
          name: "Cheese",
          options: ["Add Cheese (+$1)", "No Cheese"],
          default: "No Cheese"
        }
      ]
    },
    {
      id: 5,
      name: "Family Feast Combo",
      description: "12 pieces chicken, 4 sides, 4 biscuits, and 1-liter drink - feeds 4-5 people. The perfect meal for the whole family.",
      price: 39.99,
      image: "/images/family-feast.jpg",
      category: "combos",
      spiceLevel: 2,
      isPopular: true,
      isNew: false,
      discount: 20,
      rating: 4.9,
      reviewCount: 92,
      prepTime: "25-30 min",
      calories: 0,
      tags: ["family", "combo", "value", "shareable"],
      ingredients: ["Mixed Chicken Pieces", "Potatoes", "Coleslaw", "Biscuits", "Drink"],
      nutrition: {
        protein: 0,
        carbs: 0,
        fat: 0,
        sodium: 0
      },
      customization: [
        {
          name: "Chicken Type",
          options: ["All Fried", "All Grilled", "Mixed"],
          default: "Mixed"
        },
        {
          name: "Sides",
          options: ["Fries & Coleslaw", "Mashed Potato & Gravy", "Mac & Cheese & Greens"],
          default: "Fries & Coleslaw"
        }
      ]
    },
    {
      id: 6,
      name: "Crispy Chicken Tenders",
      description: "6 pieces of hand-breaded chicken tenders with your choice of dipping sauce. Kids love them, and adults can't resist!",
      price: 14.99,
      image: "/images/chicken-tenders.jpg",
      category: "fried",
      spiceLevel: 1,
      isPopular: false,
      isNew: true,
      discount: 0,
      rating: 4.4,
      reviewCount: 67,
      prepTime: "15-18 min",
      calories: 340,
      tags: ["kids", "tenders", "new", "finger food"],
      ingredients: ["Chicken Tenders", "Breading", "Seasoning", "Oil"],
      nutrition: {
        protein: 30,
        carbs: 22,
        fat: 16,
        sodium: 670
      },
      customization: [
        {
          name: "Dipping Sauce",
          options: ["Ranch", "Honey Mustard", "BBQ", "Buffalo", "Ketchup"],
          default: "Ranch"
        },
        {
          name: "Portion Size",
          options: ["6 Pieces", "12 Pieces (+$8)"],
          default: "6 Pieces"
        }
      ]
    },
    {
      id: 7,
      name: "BBQ Chicken Quarter",
      description: "Smoky BBQ grilled chicken quarter with cornbread and coleslaw. A Southern classic done right.",
      price: 15.99,
      image: "/images/bbq-chicken.jpg",
      category: "grilled",
      spiceLevel: 2,
      isPopular: false,
      isNew: false,
      discount: 0,
      rating: 4.3,
      reviewCount: 45,
      prepTime: "20-25 min",
      calories: 380,
      tags: ["bbq", "grilled", "dinner", "southern"],
      ingredients: ["Chicken Quarter", "BBQ Sauce", "Cornbread", "Coleslaw", "Spices"],
      nutrition: {
        protein: 36,
        carbs: 24,
        fat: 18,
        sodium: 920
      },
      customization: [
        {
          name: "BBQ Sauce",
          options: ["Sweet", "Spicy", "Smoky", "Extra Sauce"],
          default: "Sweet"
        },
        {
          name: "Side",
          options: ["Coleslaw", "Cornbread", "Both", "Fries instead"],
          default: "Both"
        }
      ]
    },
    {
      id: 8,
      name: "Loaded Fries",
      description: "Crispy fries topped with cheese, bacon, and chopped chicken. The ultimate comfort food for sharing.",
      price: 8.99,
      image: "/images/loaded-fries.jpg",
      category: "sides",
      spiceLevel: 1,
      isPopular: true,
      isNew: false,
      discount: 0,
      rating: 4.6,
      reviewCount: 178,
      prepTime: "10-12 min",
      calories: 520,
      tags: ["sides", "shareable", "popular", "comfort food"],
      ingredients: ["Potatoes", "Cheese", "Bacon", "Chicken", "Green Onions"],
      nutrition: {
        protein: 18,
        carbs: 42,
        fat: 28,
        sodium: 1040
      },
      customization: [
        {
          name: "Toppings",
          options: ["All", "No Bacon", "Extra Cheese", "No Green Onions"],
          default: "All"
        },
        {
          name: "Size",
          options: ["Regular", "Large (+$2)", "Family Size (+$4)"],
          default: "Regular"
        }
      ]
    },
    {
      id: 9,
      name: "Chicken & Waffles",
      description: "Crispy chicken tenders served with fluffy waffles and maple syrup. The perfect sweet and savory combination.",
      price: 17.99,
      image: "/images/chicken-waffles.jpg",
      category: "specials",
      spiceLevel: 1,
      isPopular: false,
      isNew: true,
      discount: 15,
      rating: 4.7,
      reviewCount: 63,
      prepTime: "18-22 min",
      calories: 580,
      tags: ["breakfast", "special", "new", "sweet & savory"],
      ingredients: ["Chicken Tenders", "Waffle", "Maple Syrup", "Butter", "Powdered Sugar"],
      nutrition: {
        protein: 26,
        carbs: 64,
        fat: 22,
        sodium: 720
      },
      customization: [
        {
          name: "Syrup",
          options: ["Maple", "Honey", "Berry", "None"],
          default: "Maple"
        },
        {
          name: "Chicken Style",
          options: ["Crispy", "Grilled", "Spicy"],
          default: "Crispy"
        }
      ]
    },
    {
      id: 10,
      name: "Spicy Chicken Wrap",
      description: "Grilled spicy chicken with fresh veggies and chipotle mayo in tortilla. A healthy and portable option for on-the-go.",
      price: 11.99,
      image: "/images/chicken-wrap.jpg",
      category: "sandwiches",
      spiceLevel: 3,
      isPopular: false,
      isNew: false,
      discount: 0,
      rating: 4.2,
      reviewCount: 34,
      prepTime: "10-12 min",
      calories: 320,
      tags: ["healthy", "wrap", "lunch", "portable"],
      ingredients: ["Grilled Chicken", "Tortilla", "Lettuce", "Tomato", "Chipotle Mayo"],
      nutrition: {
        protein: 28,
        carbs: 26,
        fat: 12,
        sodium: 640
      },
      customization: [
        {
          name: "Spice Level",
          options: ["Mild", "Medium", "Hot", "Extra Hot"],
          default: "Hot"
        },
        {
          name: "Vegetables",
          options: ["All", "No Tomato", "Extra Lettuce", "Add Avocado (+$1.5)"],
          default: "All"
        }
      ]
    }
  ];

  // Filter and sort menu items
  const filteredItems = useMemo(() => {
    let result = [...menuItems];

    // Apply category filter
    if (activeCategory !== 'all') {
      result = result.filter(item => item.category === activeCategory);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply price filter
    result = result.filter(item => 
      item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Apply spice level filter
    if (spiceLevel !== 'all') {
      const level = parseInt(spiceLevel);
      result = result.filter(item => item.spiceLevel === level);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'new':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'popular':
      default:
        result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
    }

    return result;
  }, [activeCategory, sortBy, searchQuery, priceRange, spiceLevel]);

  const addToCart = (item, quantity = 1, customizations = {}) => {
    const itemWithCustomizations = {
      ...item,
      customizations,
      uniqueId: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    setCartItems(prevItems => {
      // Check if exact same item with same customizations exists
      const existingIndex = prevItems.findIndex(i => 
        i.id === itemWithCustomizations.id && 
        JSON.stringify(i.customizations) === JSON.stringify(itemWithCustomizations.customizations)
      );
      
      if (existingIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + quantity
        };
        return updatedItems;
      }
      return [...prevItems, { ...itemWithCustomizations, quantity }];
    });
  };

  const openItemModal = (item) => {
    setSelectedItem(item);
    setIsItemModalOpen(true);
  };

  const closeItemModal = () => {
    setIsItemModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    navigate(`/menu/${categoryId}`);
  };

  return (
    <div className="app">
      <Header 
        cartItemsCount={cartItemsCount}
        onCartClick={() => setIsCartOpen(true)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      
      <div className="menu-page">
        {/* Header Section */}
        <div className="menu-header">
          <div className="header-content">
            <h1>Our Delicious Menu</h1>
            <p>Discover our mouth-watering chicken dishes made with love and secret recipes</p>
            <div className="header-stats">
              <div className="stat">
                <span className="stat-number">{menuItems.length}+</span>
                <span className="stat-label">Menu Items</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.7</span>
                <span className="stat-label">Average Rating</span>
              </div>
              <div className="stat">
                <span className="stat-number">15-25</span>
                <span className="stat-label">Min Prep Time</span>
              </div>
            </div>
          </div>
          <div className="header-image">
            <img src="/images/menu-header.jpg" alt="Chicken Menu" />
            <div className="header-badge">
              <span>🔥 Most Popular: Crispy Fried Chicken</span>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="menu-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="menu-search"
            />
            <span className="search-icon">🔍</span>
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          <div className="control-group">
            <div className="select-wrapper">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="new">Newest Items</option>
              </select>
              <span className="select-arrow">▼</span>
            </div>

            <div className="select-wrapper">
              <select 
                value={spiceLevel} 
                onChange={(e) => setSpiceLevel(e.target.value)}
                className="spice-select"
              >
                <option value="all">All Spice Levels</option>
                <option value="1">Mild 🌶️</option>
                <option value="2">Medium 🌶️🌶️</option>
                <option value="3">Spicy 🌶️🌶️🌶️</option>
              </select>
              <span className="select-arrow">▼</span>
            </div>
          </div>
        </div>

        {/* Price Filter */}
        <div className="price-filter">
          <div className="price-filter-header">
            <label>Price Range</label>
            <span>${priceRange[0]} - ${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="price-slider"
          />
          <div className="price-labels">
            <span>$0</span>
            <span>$25</span>
            <span>$50</span>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="category-nav">
          <div className="category-scroll">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
                style={{ '--category-color': category.color }}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
                {category.count > 0 && (
                  <span className="category-count">{category.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="menu-content">
          <div className="results-info">
            <p>
              Showing {filteredItems.length} of {menuItems.length} items
              {searchQuery && ` for "${searchQuery}"`}
              {activeCategory !== 'all' && ` in ${categories.find(c => c.id === activeCategory)?.name}`}
            </p>
            {(searchQuery || activeCategory !== 'all' || priceRange[1] < 50 || spiceLevel !== 'all') && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setPriceRange([0, 50]);
                  setSpiceLevel('all');
                }}
                className="reset-filters-btn"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🍗</div>
              <h3>No items found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setPriceRange([0, 50]);
                  setSpiceLevel('all');
                }}
                className="reset-filters-btn"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="menu-grid">
              {filteredItems.map(item => (
                <FoodCard
                  key={item.id}
                  item={item}
                  onAddToCart={addToCart}
                  onViewDetails={openItemModal}
                  isPopular={item.isPopular}
                  isNew={item.isNew}
                  discount={item.discount}
                />
              ))}
            </div>
          )}
        </div>

        {/* Special Offers Banner */}
        <div className="special-offers">
          <div className="offer-banner">
            <div className="offer-content">
              <h3>🎉 Special Friday Offer!</h3>
              <p>Get 20% off all family combos this weekend</p>
              <span className="offer-code">Use code: FRIDAY20</span>
            </div>
            <div className="offer-timer">
              <span>⏰ Offer ends in: 02:15:33</span>
            </div>
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      {isItemModalOpen && selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={closeItemModal}
          onAddToCart={addToCart}
        />
      )}

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        updateQuantity={(id, quantity) => {
          setCartItems(prev => prev.map(item => 
            item.id === id ? { ...item, quantity } : item
          ));
        }}
        removeFromCart={(id) => {
          setCartItems(prev => prev.filter(item => item.uniqueId !== id));
        }}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

// Item Detail Modal Component
const ItemDetailModal = ({ item, onClose, onAddToCart }) => {
  const [selectedCustomizations, setSelectedCustomizations] = useState({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Initialize customizations with default values
    const initialCustomizations = {};
    item.customization?.forEach(custom => {
      initialCustomizations[custom.name] = custom.default;
    });
    setSelectedCustomizations(initialCustomizations);
  }, [item]);

  const handleCustomizationChange = (customizationName, value) => {
    setSelectedCustomizations(prev => ({
      ...prev,
      [customizationName]: value
    }));
  };

  const handleAddToCart = () => {
    onAddToCart(item, quantity, selectedCustomizations);
    onClose();
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="item-detail-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-content">
          <div className="modal-image">
            <img src={item.image} alt={item.name} />
            {item.discount > 0 && (
              <div className="discount-badge">{item.discount}% OFF</div>
            )}
          </div>
          
          <div className="modal-details">
            <h2>{item.name}</h2>
            <p className="item-description">{item.description}</p>
            
            <div className="item-meta">
              <div className="meta-item">
                <span className="meta-label">Prep Time</span>
                <span className="meta-value">{item.prepTime}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Calories</span>
                <span className="meta-value">{item.calories}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Spice Level</span>
                <span className="meta-value">
                  {'🌶️'.repeat(item.spiceLevel)}
                </span>
              </div>
            </div>

            <div className="nutrition-info">
              <h4>Nutrition Information (per serving)</h4>
              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <span className="nutrition-value">{item.nutrition.protein}g</span>
                  <span className="nutrition-label">Protein</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-value">{item.nutrition.carbs}g</span>
                  <span className="nutrition-label">Carbs</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-value">{item.nutrition.fat}g</span>
                  <span className="nutrition-label">Fat</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-value">{item.nutrition.sodium}mg</span>
                  <span className="nutrition-label">Sodium</span>
                </div>
              </div>
            </div>

            <div className="ingredients">
              <h4>Ingredients</h4>
              <div className="ingredients-list">
                {item.ingredients.map((ingredient, index) => (
                  <span key={index} className="ingredient-tag">{ingredient}</span>
                ))}
              </div>
            </div>

            {item.customization && item.customization.length > 0 && (
              <div className="customization-section">
                <h4>Customize Your Order</h4>
                {item.customization.map((custom, index) => (
                  <div key={index} className="customization-group">
                    <label>{custom.name}</label>
                    <div className="customization-options">
                      {custom.options.map(option => (
                        <button
                          key={option}
                          className={`customization-option ${
                            selectedCustomizations[custom.name] === option ? 'selected' : ''
                          }`}
                          onClick={() => handleCustomizationChange(custom.name, option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="modal-actions">
              <div className="quantity-selector">
                <button onClick={decreaseQuantity}>−</button>
                <span>{quantity}</span>
                <button onClick={increaseQuantity}>+</button>
              </div>
              
              <div className="price-section">
                {item.discount > 0 ? (
                  <>
                    <span className="original-price">${item.price.toFixed(2)}</span>
                    <span className="discounted-price">
                      ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="final-price">${item.price.toFixed(2)}</span>
                )}
              </div>

              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart - $
                {item.discount > 0 
                  ? (item.price * (1 - item.discount / 100) * quantity).toFixed(2)
                  : (item.price * quantity).toFixed(2)
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;