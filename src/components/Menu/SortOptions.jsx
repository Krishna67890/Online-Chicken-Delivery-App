import React from 'react';

const SortOptions = ({ sortBy, onSortChange }) => {
  return (
    <div className="sort-options">
      <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
        <option value="popular">Most Popular</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="newest">Newest First</option>
      </select>
    </div>
  );
};

export default SortOptions;