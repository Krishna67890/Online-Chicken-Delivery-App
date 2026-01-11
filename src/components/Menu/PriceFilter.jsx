import React from 'react';

const PriceFilter = ({ minPrice, maxPrice, onPriceChange }) => {
  return (
    <div className="price-filter">
      <h4>Price Range</h4>
      <div className="price-inputs">
        <input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => onPriceChange('min', e.target.value)}
        />
        <span>-</span>
        <input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => onPriceChange('max', e.target.value)}
        />
      </div>
    </div>
  );
};

export default PriceFilter;