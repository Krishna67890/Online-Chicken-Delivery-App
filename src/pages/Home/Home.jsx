// src/pages/Home/Home.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../Contexts/CartContext';
import { useNotifications } from '../../hooks/useNotifications';
import FoodCard from '../../components/FoodCard/FoodCard';
import CategoryFilter from '../../components/Menu/CategoryFilter';
import SearchFilter from '../../components/Menu/SearchFilter';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import './Home.css';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  border: '2px solid #ff6b35'
};

// Precise coordinates for Matoshri College Of Engineering from the URL
const restaurantLocation = {
  lat: 19.9904826,
  lng: 73.9107203
};

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showSuccess } = useNotifications();
  const [activeTab, setActiveTab] = useState('menu');
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const menuCategories = [
    {id: 'all', name: 'All', icon: '🍗'},
    {id: 'fried', name: 'Fried', icon: '🔥'},
    {id: 'grilled', name: 'Grilled', icon: '🥗'},
    {id: 'wings', name: 'Wings', icon: '🍗'},
    {id: 'tenders', name: 'Tenders', icon: '🥓'},
    {id: 'burgers', name: 'Burgers', icon: '🍔'},
    {id: 'wraps', name: 'Wraps', icon: '🌯'},
    {id: 'sides', name: 'Sides', icon: '🍟'},
    {id: 'drinks', name: 'Drinks', icon: '🥤'},
    {id: 'desserts', name: 'Desserts', icon: '🍰'}
  ];

  useEffect(() => {
    const generateDishes = () => {
      const dishData = {
        fried: {
          names: ["Crispy Bucket", "Zesty Thighs", "Golden Drumsticks", "Spicy Breast", "Southern Classic"],
          image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&fit=crop"
        },
        grilled: {
          names: ["Herb Platter", "Lemon Pepper Breast", "Peri-Peri Quarter", "Tandoori Roast", "Garlic Glazed"],
          image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&fit=crop"
        },
        wings: {
          names: ["Buffalo Wings", "BBQ Glazed", "Honey Garlic", "Korean Spicy", "Lemon Pepper Wings"],
          image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&fit=crop"
        },
        tenders: {
          names: ["Crispy Strips", "Spicy Tenders", "Buttermilk Fingers", "Honey Glazed Strips", "Classic Tenders"],
          image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&fit=crop"
        },
        burgers: {
          names: ["Zinger Max", "Chicken Cheese Blast", "Double Decker", "Grilled Fillet Burger", "Spicy Tower"],
          image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&fit=crop"
        },
        wraps: {
          names: ["Mexican Salsa Wrap", "Chicken Caesar Wrap", "Spicy Mayo Roll", "Grilled Veggie Chicken Wrap", "BBQ Wrap"],
          image: "https://images.unsplash.com/photo-1626700051175-6818013e184f?w=500&fit=crop"
        },
        sides: {
          names: ["French Fries", "Onion Rings", "Coleslaw", "Mashed Potato", "Garlic Bread"],
          image: "https://images.unsplash.com/photo-1573016608438-3dc1fa5745a7?w=500&fit=crop"
        },
        drinks: {
          names: ["Chilled Coke", "Fresh Lime Soda", "Iced Tea", "Orange Juice", "Water Bottle"],
          image: "https://images.unsplash.com/photo-1544145945-f904253d0c7b?w=500&fit=crop"
        },
        desserts: {
          names: ["Choco Lava Cake", "Vanilla Muffin", "Fruit Salad", "Chicken Shaped Cookie", "Brownie Blast"],
          image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&fit=crop"
        }
      };

      const categories = Object.keys(dishData);
      let dishes = [];
      
      categories.forEach((catId) => {
        const data = dishData[catId];
        for(let i = 1; i <= 20; i++) {
          const nameBase = data.names[i % data.names.length];
          dishes.push({
            id: `${catId}-${i}`,
            name: `${nameBase} ${i > data.names.length ? 'Ex' + i : ''}`,
            description: `Freshly prepared ${catId} selection with secret Matoshri campus spices.`,
            price: (catId === 'sides' || catId === 'drinks') ? 99 + (i % 100) : 249 + (i % 200),
            category: catId,
            image: data.image,
            rating: 4.2 + (Math.random() * 0.8)
          });
        }
      });

      setMenuItems(dishes.sort(() => Math.random() - 0.5));
      setLoading(false);
    };
    generateDishes();
  }, []);

  const filteredItems = useMemo(() => {
    let filtered = menuItems;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [menuItems, selectedCategory, searchQuery]);

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    showSuccess(`${item.name} added to cart!`);
  };

  const handleBuyNow = (item) => {
    addToCart(item, 1);
    navigate('/home/orders');
  };

  const handleOpenGoogleMaps = () => {
    const url = "https://www.google.com/maps/place/Matoshri+College+Of+Engineering+%26+Research+Centre,+Eklhare,+Nashik/@19.9904823,73.9090436,18z/";
    window.open(url, '_blank');
  };

  if (loading) return <LoadingSpinner size="large" />;

  return (
    <div className="home-page advanced-ui">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="animate-pop">Premium Chicken <span className="highlight">Express</span></h1>
            <p>Freshly Prepared at Matoshri Campus. Delivered in 30 Mins.</p>
            <div className="hero-stats">
              <div className="stat"><span>4.9★</span> Rating</div>
              <div className="stat"><span>200+</span> Dishes</div>
              <div className="stat"><span>Fast</span> Delivery</div>
            </div>
            <div className="hero-actions">
              <button className="btn-primary-lg" onClick={() => { setActiveTab('menu'); document.getElementById('main-tabs').scrollIntoView({behavior: 'smooth'}); }}>
                View Full Menu 🍗
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section id="main-tabs" className="tabs-section">
        <div className="container">
          <div className="tabs-nav-container">
            <div className="tabs-nav">
              <button className={`tab-link ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>
                🍴 <span className="tab-text">Delicious Menu</span>
              </button>
              <button className={`tab-link ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
                📍 <span className="tab-text">Find Us</span>
              </button>
              <button className={`tab-link ${activeTab === 'rating' ? 'active' : ''}`} onClick={() => setActiveTab('rating')}>
                ⭐ <span className="tab-text">Rate Us</span>
              </button>
              <button className={`tab-link ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>
                👥 <span className="tab-text">About Us</span>
              </button>
            </div>
          </div>

          <div className="tab-content-wrapper">
            {/* Menu Tab */}
            {activeTab === 'menu' && (
              <div className="menu-tab-pane animate-fade-in">
                <div className="menu-header-box">
                  <h2 className="section-title">Fresh Selection</h2>
                  <div className="filter-bar">
                    <CategoryFilter 
                      categories={menuCategories} 
                      selectedCategory={selectedCategory} 
                      onCategoryChange={setSelectedCategory} 
                    />
                    <div className="home-search-wrapper">
                      <SearchFilter value={searchQuery} onChange={setSearchQuery} placeholder="Search dishes (Burgers, Wraps, Desserts...)" />
                    </div>
                  </div>
                </div>
                {filteredItems.length > 0 ? (
                  <div className="menu-grid">
                    {filteredItems.map(item => (
                      <FoodCard key={item.id} item={item} onAddToCart={() => handleAddToCart(item)} onBuyClick={() => handleBuyNow(item)} />
                    ))}
                  </div>
                ) : (
                  <div className="no-items-found">
                    <p>No dishes found matching your search.</p>
                    <button className="btn-text" onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}>Clear filters</button>
                  </div>
                )}
              </div>
            )}

            {/* Google Maps Tab */}
            {activeTab === 'map' && (
              <div className="map-tab-pane animate-fade-in">
                <div className="map-info">
                  <h2>Our Main Kitchen</h2>
                  <p>Located at Matoshri College of Engineering & Research Centre, Nashik (Odha).</p>
                  <button className="btn-get-directions" onClick={handleOpenGoogleMaps}>
                    🚀 Open in Google Maps Site
                  </button>
                </div>
                <div className="map-container-enhanced">
                  {isLoaded ? (
                    <GoogleMap mapContainerStyle={mapContainerStyle} center={restaurantLocation} zoom={17}>
                      <Marker position={restaurantLocation} title="Chicken Express @ Matoshri College" />
                    </GoogleMap>
                  ) : (
                    <div className="map-loading">Loading Maps...</div>
                  )}
                </div>
              </div>
            )}

            {/* Rating Tab */}
            {activeTab === 'rating' && (
              <div className="rating-tab-pane animate-fade-in">
                <div className="rating-card">
                  <h2>How was your meal?</h2>
                  <form className="rating-form" onSubmit={(e) => {e.preventDefault(); showSuccess("Review submitted!");}}>
                    <div className="star-rating-input">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`star ${star <= userRating ? 'selected' : ''}`} onClick={() => setUserRating(star)}>★</span>
                      ))}
                    </div>
                    <textarea placeholder="Your feedback..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} required></textarea>
                    <button type="submit" className="btn-submit-rating">Submit Review</button>
                  </form>
                </div>
              </div>
            )}

            {/* About Us Tab */}
            {activeTab === 'about' && (
              <div className="about-tab-pane animate-fade-in">
                <div className="about-card">
                  <div className="about-header">
                    <h2>Meet Our Team</h2>
                    <p>Delivering flavor and quality to every student and food lover in Nashik.</p>
                  </div>
                  <div className="team-grid">
                    <div className="team-member">
                      <div className="member-avatar">KP</div>
                      <h3>Krishna Patil Rajput</h3>
                      <p className="role">Developer & Founder</p>
                    </div>
                    <div className="team-member">
                      <div className="member-avatar">NS</div>
                      <h3>Nomaan Sayyed</h3>
                      <p className="role">Valued Client & Partner</p>
                    </div>
                  </div>
                  <div className="about-mission">
                    <h3>Our Mission</h3>
                    <p>At Chicken Express, we believe in serving high-quality, fresh chicken dishes that bring people together. Operating from the heart of Matoshri College, we take pride in our campus-fresh ingredients and lightning-fast delivery.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;