import React from 'react';

const SearchFilter = ({ value, onChange, placeholder }) => {
  return (
    <div className="search-filter">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search..."}
        className="search-input"
      />
    </div>
  );
};

export default SearchFilter;