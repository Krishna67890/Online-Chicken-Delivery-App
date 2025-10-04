import { useState, useEffect } from 'react';
import './FoodCard.css';

const FoodCard = ({ 
  item, 
  onAddToCart, 
  onCustomize,
  isPopular = false,
  isNew = false,
  discount = 0 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    setIsAdded(true);
    onAddToCart(item, quantity);
    
    // Reset animation after delay
    setTimeout(() => {
      setIsAdded(false);
      setQuantity(1);
    }, 2000);
  };

  const incrementQuantity = (e) => {
    e.stopPropagation();
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = (e) => {
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const finalPrice = discount > 0 
    ? item.price * (1 - discount / 100) 
    : item.price;

  return (
    <div 
      className={`food-card ${isHovered ? 'hovered' : ''} ${isPopular ? 'popular' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="card-badges">
        {isPopular && <span className="badge popular-badge">🔥 Popular</span>}
        {isNew && <span className="badge new-badge">🆕 New</span>}
        {discount > 0 && <span className="badge discount-badge">-{discount}%</span>}
      </div>

      {/* Image Container */}
      <div className="card-image-container">
        <div className="image-placeholder" style={{ display: imageLoaded ? 'none' : 'block' }}>
          <div className="loading-pulse"></div>
        </div>
        <img 
          src={item.image} 
          alt={item.name}
          className={`card-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Quick actions on hover */}
        <div className="image-overlay">
          <button 
            className="quick-view-btn"
            onClick={() => onCustomize(item)}
          >
            👁️ Quick View
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-content">
        <div className="card-header">
          <h3 className="item-name">{item.name}</h3>
          <div className="rating">
            <span className="stars">★★★★☆</span>
            <span className="rating-count">(128)</span>
          </div>
        </div>

        <p className="item-description">{item.description}</p>

        <div className="nutrition-info">
          <span className="nutrition-item">🔥 320 cal</span>
          <span className="nutrition-item">⏱ 15-20 min</span>
          {item.spiceLevel && (
            <span className="nutrition-item">
              🌶️ {Array.from({ length: item.spiceLevel }).map(() => '•').join('')}
            </span>
          )}
        </div>

        <div className="price-container">
          {discount > 0 ? (
            <div className="discount-pricing">
              <span className="original-price">${item.price.toFixed(2)}</span>
              <span className="current-price">${finalPrice.toFixed(2)}</span>
            </div>
          ) : (
            <span className="current-price">${item.price.toFixed(2)}</span>
          )}
        </div>

        <div className="card-footer">
          <div className="quantity-selector">
            <button 
              className="quantity-btn minus"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >−</button>
            <span className="quantity-value">{quantity}</span>
            <button 
              className="quantity-btn plus"
              onClick={incrementQuantity}
            >+</button>
          </div>

          <button 
            className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
            onClick={handleAddToCart}
          >
            <span className="btn-text">
              {isAdded ? 'Added!' : `Add $${(finalPrice * quantity).toFixed(2)}`}
            </span>
            <span className="cart-icon">🛒</span>
          </button>
        </div>
      </div>

      {/* Floating animation when added to cart */}
      {isAdded && (
        <div className="floating-confirmation">
          <span>+{quantity} Added to Cart</span>
        </div>
      )}
    </div>
  );
};

export default FoodCard;