// src/pages/Menu/Menu.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../../Contexts/CartContext';
import { useNotifications } from '../../hooks/useNotifications';
import FoodCard from '../../components/FoodCard/FoodCard';
import CategoryFilter from '../../components/Menu/CategoryFilter';
import SearchFilter from '../../components/Menu/SearchFilter';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './Menu.css';

const Menu = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const { addToCart } = useCart();
  const { showSuccess } = useNotifications();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

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

  const images = {
    fried: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&fit=crop",
    grilled: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&fit=crop",
    wings: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&fit=crop",
    tenders: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&fit=crop",
    burgers: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&fit=crop",
    wraps: "https://images.unsplash.com/photo-1626700051175-6818013e184f?w=500&fit=crop",
    sides: "https://images.unsplash.com/photo-1573016608438-3dc1fa5745a7?w=500&fit=crop",
    drinks: "https://images.unsplash.com/photo-1544145945-f904253d0c7b?w=500&fit=crop",
    desserts: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&fit=crop"
  };

  const menuItems = useMemo(() => {
    let dishes = [];
    Object.keys(images).forEach((catId) => {
      for(let i = 1; i <= 15; i++) {
        dishes.push({
          id: `${catId}-${i}`,
          name: `${catId.charAt(0).toUpperCase() + catId.slice(1)} Special ${i}`,
          description: `Signature ${catId} chicken prepared with Matoshri campus secret spices.`,
          price: 12.99 + (i % 10),
          category: catId,
          image: images[catId],
          rating: 4.5
        });
      }
    });
    return dishes;
  }, []);

  useEffect(() => {
    if (category) setActiveCategory(category);
    setTimeout(() => setLoading(false), 500);
  }, [category]);

  const filteredItems = useMemo(() => {
    let result = menuItems;
    if (activeCategory !== 'all') {
      result = result.filter(item => item.category === activeCategory);
    }
    if (searchQuery) {
      result = result.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return result;
  }, [activeCategory, searchQuery, menuItems]);

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    showSuccess(`${item.name} added to cart!`);
  };

  const handleBuyNow = (item) => {
    addToCart(item, 1);
    navigate('/orders');
  };

  if (loading) return <LoadingSpinner size="large" />;

  return (
    <div className="menu-page advanced-ui">
      <div className="container">
        <div className="menu-header-box">
          <h1 className="section-title">Matoshri Campus Menu</h1>
          <div className="filter-bar">
            <CategoryFilter categories={menuCategories} selectedCategory={activeCategory} onCategoryChange={setActiveCategory} />
            <SearchFilter value={searchQuery} onChange={setSearchQuery} placeholder="Search chicken dishes..." />
          </div>
        </div>

        <div className="menu-grid">
          {filteredItems.map(item => (
            <FoodCard 
              key={item.id} 
              item={item} 
              onAddToCart={() => handleAddToCart(item)} 
              onBuyClick={() => handleBuyNow(item)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;