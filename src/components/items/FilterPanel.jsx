import React from 'react';
import { Filter, RotateCcw, Check, Sparkles, Tag } from 'lucide-react';
import { CATEGORIES } from '../../constants/categories';
import './FilterPanel.css';

export default function FilterPanel({
  selectedType, // 'all' | 'lost' | 'found'
  onTypeChange,
  selectedCategory,
  onCategoryChange,
  onResetFilters,
  totalResultsCount,
  showOnlyAiMatches,
  onToggleAiMatches,
}) {
  const isFiltered =
    selectedType !== 'all' ||
    selectedCategory !== 'All Categories' ||
    showOnlyAiMatches;

  return (
    <div className="filter-panel card">
      <div className="filter-panel-header">
        <div className="filter-title-group">
          <Filter size={18} className="filter-icon" />
          <h2 className="filter-heading">Filters</h2>
          {totalResultsCount !== undefined && (
            <span className="filter-count-badge">{totalResultsCount} items</span>
          )}
        </div>

        {isFiltered && (
          <button
            type="button"
            className="filter-reset-btn"
            onClick={onResetFilters}
            title="Reset all filters"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Item Type (Lost vs Found) */}
      <div className="filter-section">
        <label className="filter-label">Report Type</label>
        <div className="filter-type-pill-group" role="radiogroup" aria-label="Item Type">
          <button
            type="button"
            role="radio"
            aria-checked={selectedType === 'all'}
            className={`type-pill ${selectedType === 'all' ? 'type-pill-active' : ''}`}
            onClick={() => onTypeChange('all')}
          >
            All Items
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={selectedType === 'lost'}
            className={`type-pill type-pill-lost ${selectedType === 'lost' ? 'type-pill-active-lost' : ''}`}
            onClick={() => onTypeChange('lost')}
          >
            Lost
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={selectedType === 'found'}
            className={`type-pill type-pill-found ${selectedType === 'found' ? 'type-pill-active-found' : ''}`}
            onClick={() => onTypeChange('found')}
          >
            Found
          </button>
        </div>
      </div>

      {/* Category Selection */}
      <div className="filter-section">
        <label className="filter-label">Category</label>
        <div className="filter-category-list">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                className={`filter-category-item ${isSelected ? 'category-item-selected' : ''}`}
                onClick={() => onCategoryChange(cat)}
              >
                <div className="category-item-content">
                  <Tag size={13} className="category-icon" />
                  <span>{cat}</span>
                </div>
                {isSelected && <Check size={14} className="category-check" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Matches Switch */}
      <div className="filter-section filter-ai-section">
        <button
          type="button"
          className={`ai-toggle-btn ${showOnlyAiMatches ? 'ai-toggle-active' : ''}`}
          onClick={onToggleAiMatches}
        >
          <div className="ai-toggle-left">
            <Sparkles size={16} className="ai-star" />
            <div className="ai-toggle-text">
              <span className="ai-toggle-title">AI Matches Only</span>
              <span className="ai-toggle-sub">Show high-confidence paired records</span>
            </div>
          </div>
          <div className={`switch-knob ${showOnlyAiMatches ? 'knob-on' : ''}`} />
        </button>
      </div>
    </div>
  );
}
