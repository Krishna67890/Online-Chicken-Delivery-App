import { useState } from 'react';
import './FoodCard.css';

const FoodCard = ({ 
  item, 
  onAddToCart, 
  onBuyClick
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="food-card">
      <div className="card-image-container">
        <img 
          src={item.image} 
          alt={item.name}
          className={`card-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      <div className="card-content">
        <h3 className="item-name">{item.name}</h3>
        <p className="item-description">{item.description}</p>
        
        <div className="price-container">
          <span className="current-price">${item.price.toFixed(2)}</span>
        </div>

        <div className="card-footer">
          <button 
            className="add-to-cart-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
          >
            Add to Cart 🛒
          </button>
          
          <button 
            className="buy-now-btn"
            onClick={(e) => {
              e.stopPropagation();
              onBuyClick(item);
            }}
          >
            Buy Now ⚡
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;