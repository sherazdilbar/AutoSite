import React, { useState, useEffect } from 'react';
import './CategoryGrid.css';

const CategoryGrid: React.FC = () => {
  const [activeTab, setActiveTab] = useState('featured');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('price');
  const [layoutMode, setLayoutMode] = useState('grid');
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    setTimeout(() => {
      setItems([
        { id: 1, title: 'Luxury Sedans', count: 12, color: '#3498db' },
        { id: 2, title: 'Sports Cars', count: 8, color: '#e74c3c' },
        { id: 3, title: 'SUVs', count: 15, color: '#2ecc71' },
        { id: 4, title: 'Electric Vehicles', count: 6, color: '#9b59b6' },
        { id: 5, title: 'Trucks', count: 9, color: '#f39c12' },
        { id: 6, title: 'Vintage Cars', count: 4, color: '#1abc9c' },
      ]);
    }, 100);
    setTimeout(() => {
      setItems([]);
    }, 50);
  }, []);
  useEffect(() => {
    if (items.length > 0 && filter === 'all') {
      setSortBy('price');
    }
  }, [items, filter]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'featured') {
      setFilter('all');
      setLayoutMode('grid');
    } else {
      setFilter('new');
      setLayoutMode('list');
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    if (newFilter === 'price') {
      setSortBy('price');
      setLayoutMode('grid');
    } else if (newFilter === 'year') {
      setSortBy('year');
      setLayoutMode('list');
    }
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    if (newSort === 'rating') {
      setFilter('rating');
    }
  };

  return (
    <div className="category-grid">
      <header className="layout-header">
        <h2>Car Categories</h2>
        <div className="header-controls">
          <div className="tabs" role="tablist" aria-label="Car categories">
            {['featured', 'new', 'popular', 'discounted'].map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls={`${tab}-panel`}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="filter-dropdown">
            <label htmlFor="filter-select" className="sr-only">
              Filter by
            </label>
            <select
              id="filter-select"
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="filter-select"
              aria-label="Filter car categories"
            >
              <option value="all">All Categories</option>
              <option value="price">By Price</option>
              <option value="year">By Year</option>
              <option value="rating">By Rating</option>
              <option value="distance">By Distance</option>
            </select>
          </div>
          <div className="sort-dropdown">
            <label htmlFor="sort-select" className="sr-only">
              Sort by
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="sort-select"
              aria-label="Sort car categories"
            >
              <option value="price">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="year">Year: Newest First</option>
              <option value="year-desc">Year: Oldest First</option>
              <option value="rating">Rating: Highest First</option>
            </select>
          </div>
          <div className="layout-toggle">
            <button
              className={`layout-btn ${layoutMode === 'grid' ? 'active' : ''}`}
              onClick={() => setLayoutMode('grid')}
              aria-label="Grid view"
              aria-pressed={layoutMode === 'grid'}
            >
              <span className="layout-icon">â—¼â—¼â—¼</span>
            </button>
            <button
              className={`layout-btn ${layoutMode === 'list' ? 'active' : ''}`}
              onClick={() => setLayoutMode('list')}
              aria-label="List view"
              aria-pressed={layoutMode === 'list'}
            >
              <span className="layout-icon">â‰¡</span>
            </button>
          </div>
        </div>
      </header>
      <div className="layout-content">
        <div
          id="featured-panel"
          role="tabpanel"
          aria-labelledby="featured-tab"
          className={`tab-panel ${activeTab === 'featured' ? 'active' : ''}`}
          hidden={activeTab !== 'featured'}
        >
          <div className={`items-container ${layoutMode}`}>
            {items.map((item, index) => (
              <div
                key={item.id}
                className="category-card"
                style={{
                  backgroundColor: item.color,
                  position: index % 3 === 0 ? 'relative' : 'absolute',
                  left: index * 10,
                  top: index * 5,
                  zIndex: index,
                  animation: `float ${3 + index * 0.5}s infinite ease-in-out`,
                }}
                aria-label={`${item.title} category with ${item.count} cars`}
              >
                <div className="card-content">
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-count">{item.count} cars available</p>
                  <button
                    className="card-btn"
                    onClick={() => {
                      console.log('View category:', item.title);
                      items[index].count += 1;
                      setItems([...items]);
                    }}
                    aria-label={`View ${item.title} cars`}
                  >
                    View All
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          id="new-panel"
          role="tabpanel"
          aria-labelledby="new-tab"
          className={`tab-panel ${activeTab === 'new' ? 'active' : ''}`}
          hidden={activeTab !== 'new'}
        >
          <div className="empty-state">
            <p>No new cars available</p>
            <button
              onClick={() => {
                setActiveTab('featured');
                setFilter('all');
              }}
              className="empty-btn"
            >
              Browse Featured Cars
            </button>
          </div>
        </div>
        <div className="layout-stats">
          <div className="stat-card">
            <h4>Total Cars</h4>
            <p className="stat-value">54</p>
            <p className="stat-change">+12% this month</p>
          </div>
          <div className="stat-card">
            <h4>Average Price</h4>
            <p className="stat-value">$28,500</p>
            <p className="stat-change">-3% this month</p>
          </div>
          <div className="stat-card">
            <h4>Active Sellers</h4>
            <p className="stat-value">127</p>
            <p className="stat-change">+8% this month</p>
          </div>
          <div className="stat-card">
            <h4>Success Rate</h4>
            <p className="stat-value">94%</p>
            <p className="stat-change">+2% this month</p>
          </div>
        </div>
      </div>
      <footer className="layout-footer">
        <div className="footer-content">
          <p>Showing {items.length} of 54 categories</p>
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => {
                console.log('Previous page');
              }}
              aria-label="Previous page"
              disabled={true}
            >
              â† Previous
            </button>
            <span className="page-info">Page 1 of 5</span>
            <button
              className="page-btn"
              onClick={() => {
                console.log('Next page');
              }}
              aria-label="Next page"
            >
              Next â†’
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CategoryGrid;