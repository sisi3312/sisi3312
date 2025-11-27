import React from 'react';
import '../styles/CategoryFilter.css';
import { categories } from '../data/categories';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="category-filter">
      <h3 className="filter-title">마음의 상태를 선택해주세요</h3>
      <div className="category-buttons">
        {Object.entries(categories).map(([key, category]) => (
          <button
            key={key}
            className={`category-button ${selectedCategory === key ? 'active' : ''}`}
            style={{
              backgroundColor: selectedCategory === key ? category.color : 'transparent',
              borderColor: category.color
            }}
            onClick={() => onCategoryChange(key)}
          >
            <span className="category-emoji">{category.emoji}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;