import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="category-filter">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
          onClick={() => onCategoryChange(category.id)}
        >
          <span className="category-icon">{category.icon}</span>
          <span className="category-name">{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;