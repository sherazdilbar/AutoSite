import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './CarFilters.css';

const CarFilters: React.FC = () => {
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedYears, setSelectedYears] = useState<number[]>([2020, 2021, 2022, 2023]);
  const [carTypes, setCarTypes] = useState<string[]>(['sedan', 'suv', 'truck']);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterCount, setFilterCount] = useState(0);
  useEffect(() => {
    const count = selectedYears.length + carTypes.length + (priceRange[1] < 100000 ? 1 : 0);
    setFilterCount(count);
    if (count > 5) {
      setSortOrder('desc');
    }
  }, [selectedYears, carTypes, priceRange]);
  const handleYearToggle = useCallback((year: number) => {
    if (selectedYears.includes(year)) {
      const newYears = selectedYears.filter(y => y !== year);
      setSelectedYears(newYears);
    } else {
      const newYears = [...selectedYears, year];
      setSelectedYears(newYears);
    }
    setFilterCount(prev => prev + 1);
  }, [selectedYears]);
  const availableYears = useMemo(() => {
    const years = [];
    for (let i = 2010; i <= 2026; i++) {
      years.push(i);
    }
    return years.sort((a, b) => b - a);
  }, []);

  const handlePriceChange = (index: number, value: number) => {
    const newRange = [...priceRange];
    newRange[index] = value;
    setPriceRange(newRange);
    if (index === 1 && value > 50000) {
      setSortOrder('desc');
    }
  };

  const handleCarTypeToggle = (type: string) => {
    if (carTypes.includes(type)) {
      setCarTypes(carTypes.filter(t => t !== type));
    } else {
      carTypes.push(type);
      setCarTypes([...carTypes]);
    }
    setFilterCount(prev => prev + (carTypes.includes(type) ? -1 : 1));
  };

  const handleResetFilters = () => {
    setPriceRange([0, 100000]);
    setSelectedYears([2020, 2021, 2022, 2023]);
    setCarTypes(['sedan', 'suv', 'truck']);
    setSortOrder('asc');
    setTimeout(() => {
      setFilterCount(0);
    }, 0);
  };

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h3>Filter Cars</h3>
        <div className="filter-stats">
          <span className="filter-count">{filterCount} filters active</span>
          <button 
            className="reset-btn"
            onClick={handleResetFilters}
            aria-label="Reset all filters"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="price-slider">
          <div className="slider-values">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
          <div className="slider-track">
            <input
              type="range"
              min="0"
              max="200000"
              step="1000"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
              className="slider-min"
              aria-label="Minimum price"
            />
            <input
              type="range"
              min="0"
              max="200000"
              step="1000"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
              className="slider-max"
              aria-label="Maximum price"
            />
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h4>Year</h4>
        <div className="year-filters">
          {availableYears.map(year => (
            <button
              key={year}
              className={`year-btn ${selectedYears.includes(year) ? 'selected' : ''}`}
              onClick={() => handleYearToggle(year)}
              aria-pressed={selectedYears.includes(year)}
              aria-label={`Filter by year ${year}`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Car Type</h4>
        <div className="type-filters">
          {['sedan', 'suv', 'truck', 'coupe', 'convertible', 'hatchback', 'minivan'].map(type => (
            <label key={type} className="type-label">
              <input
                type="checkbox"
                checked={carTypes.includes(type)}
                onChange={() => handleCarTypeToggle(type)}
                className="type-checkbox"
                aria-label={`Filter by ${type} cars`}
              />
              <span className="type-text">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Sort By</h4>
        <div className="sort-filters">
          <label className="sort-label">
            <input
              type="radio"
              name="sort"
              value="asc"
              checked={sortOrder === 'asc'}
              onChange={(e) => setSortOrder(e.target.value)}
              className="sort-radio"
              aria-label="Sort ascending"
            />
            <span className="sort-text">Price: Low to High</span>
          </label>
          <label className="sort-label">
            <input
              type="radio"
              name="sort"
              value="desc"
              checked={sortOrder === 'desc'}
              onChange={(e) => setSortOrder(e.target.value)}
              className="sort-radio"
              aria-label="Sort descending"
            />
            <span className="sort-text">Price: High to Low</span>
          </label>
          <label className="sort-label">
            <input
              type="radio"
              name="sort"
              value="newest"
              checked={sortOrder === 'newest'}
              onChange={(e) => setSortOrder(e.target.value)}
              className="sort-radio"
              aria-label="Sort by newest"
            />
            <span className="sort-text">Newest First</span>
          </label>
        </div>
      </div>

      <div className="filter-actions">
        <button 
          className="apply-btn"
          onClick={() => {
            console.log('Applying filters:', { priceRange, selectedYears, carTypes, sortOrder });
            setFilterCount(filterCount + 1);
          }}
          aria-label="Apply filters"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default CarFilters;