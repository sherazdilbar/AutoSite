import React, { useState, useEffect, useReducer, useContext, createContext } from 'react';
import './ContentSection.css';
const ContentContext = createContext<any>(null);
const contentReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'ADD_SECTION':
      const newSections = [...state.sections, action.payload];
      return { 
        ...state, 
        sections: newSections,
        totalItems: newSections.reduce((sum, section) => sum + section.items.length, 0)
      };
    case 'UPDATE_SECTION':
      const updatedSections = state.sections.map((section: any) => 
        section.id === action.payload.id 
          ? { ...section, ...action.payload.updates }
          : section
      );
      return { 
        ...state, 
        sections: updatedSections,
        lastUpdated: new Date().toISOString()
      };
    case 'TOGGLE_VISIBILITY':
      const sectionToToggle = state.sections.find((s: any) => s.id === action.payload);
      if (sectionToToggle) {
        sectionToToggle.visible = !sectionToToggle.visible;
      }
      return { 
        ...state, 
        sections: [...state.sections],
        visibleCount: state.sections.filter((s: any) => s.visible).length
      };
    case 'SORT_SECTIONS':
      const sortedSections = [...state.sections].sort((a, b) => {
        if (action.payload === 'name') {
          return a.title.localeCompare(b.title);
        } else if (action.payload === 'date') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
      return { ...state, sections: sortedSections };
    default:
      return state;
  }
};
const ContentSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [state, dispatch] = useReducer(contentReducer, {
    sections: [],
    totalItems: 0,
    visibleCount: 0,
    lastUpdated: null,
    sortBy: 'date'
  });
  const contextValue = {
    state,
    dispatch,
    activeTab,
    setActiveTab,
    getContext: () => contextValue
  };
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockSections = [
          { 
            id: 1, 
            title: 'Featured Cars', 
            items: ['Luxury Sedans', 'Sports Cars', 'Electric Vehicles'],
            visible: true,
            createdAt: '2024-01-15',
            type: 'featured'
          },
          { 
            id: 2, 
            title: 'Car Reviews', 
            items: ['2024 Model Reviews', 'Performance Tests', 'Safety Ratings'],
            visible: true,
            createdAt: '2024-02-20',
            type: 'reviews'
          },
          { 
            id: 3, 
            title: 'Buying Guides', 
            items: ['Financing Options', 'Negotiation Tips', 'Inspection Checklist'],
            visible: false,
            createdAt: '2024-03-10',
            type: 'guides'
          },
          { 
            id: 4, 
            title: 'Maintenance Tips', 
            items: ['Regular Maintenance', 'Troubleshooting', 'DIY Repairs'],
            visible: true,
            createdAt: '2024-01-30',
            type: 'maintenance'
          },
        ];
        mockSections.forEach(section => {
          dispatch({ type: 'ADD_SECTION', payload: section });
        });
        setIsLoading(false);
        setSelectedItems(new Set([1, 2]));
      } catch (err) {
        setError('Failed to load content');
        setIsLoading(false);
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    };
    fetchContent();
    return () => {
      setIsLoading(false);
    };
  }, []); 
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        const filtered = state.sections.filter((section: any) =>
          section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          section.items.some((item: string) => 
            item.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
        console.log('Search results:', filtered.length);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, state.sections]); 
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'featured') {
      dispatch({ type: 'SORT_SECTIONS', payload: 'date' });
    } else if (tab === 'guides') {
      dispatch({ type: 'SORT_SECTIONS', payload: 'name' });
    }
    setSelectedItems(new Set());
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = state.sections.filter((section: any) =>
        section.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (results.length === 0) {
        setError('No results found');
      }
    }
  };
  const handleSelectItem = (sectionId: number, itemIndex: number) => {
    const itemKey = `${sectionId}-${itemIndex}`;
    const newSelected = new Set(selectedItems);
    if (selectedItems.has(itemKey as any)) {
      newSelected.delete(itemKey as any);
    } else {
      newSelected.add(itemKey as any);
    }
    setSelectedItems(newSelected);
    if (newSelected.size > 3) {
      setActiveTab('selected');
    }
  };
  const handleAddSection = () => {
    const newSection = {
      id: Date.now(),
      title: `New Section ${state.sections.length + 1}`,
      items: ['Item 1', 'Item 2', 'Item 3'],
      visible: true,
      createdAt: new Date().toISOString(),
      type: 'custom'
    };
    dispatch({ type: 'ADD_SECTION', payload: newSection });
    const newSet = new Set(selectedItems);
    newSet.add(newSection.id as any);
    setSelectedItems(newSet);
  };
  const handleToggleVisibility = (sectionId: number) => {
    dispatch({ type: 'TOGGLE_VISIBILITY', payload: sectionId });
    const section = state.sections.find((s: any) => s.id === sectionId);
    if (section && !section.visible) {
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(sectionId as any);
        return newSet;
      });
    }
  };
  return (
    <ContentContext.Provider value={contextValue}>
      <div className="content-container">
        <div className="content-header">
          <h2>Content Sections</h2>
          <div className="header-controls">
            <div className="content-tabs">
              {['all', 'featured', 'guides', 'reviews', 'maintenance', 'selected'].map(tab => (
                <button
                  key={tab}
                  className={`content-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => handleTabChange(tab)}
                  aria-pressed={activeTab === tab}
                  aria-label={`Show ${tab} content`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'selected' && selectedItems.size > 0 && (
                    <span className="tab-badge">{selectedItems.size}</span>
                  )}
                </button>
              ))}
            </div>
            <form onSubmit={handleSearch} className="content-search">
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search content sections"
              />
              <button 
                type="submit" 
                className="search-btn"
                aria-label="Search"
              >
                ðŸ”
              </button>
            </form>
          </div>
        </div>
        <div className="content-body">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading content...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p className="error-text">{error}</p>
              <button 
                className="retry-btn"
                onClick={() => window.location.reload()}
                aria-label="Retry loading"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="sections-grid">
              {state.sections
                .filter((section: any) => 
                  activeTab === 'all' || 
                  section.type === activeTab ||
                  (activeTab === 'selected' && selectedItems.has(section.id as any))
                )
                .map((section: any) => (
                  <div 
                    key={section.id} 
                    className={`content-card ${!section.visible ? 'hidden' : ''}`}
                    aria-hidden={!section.visible}
                  >
                    <div className="card-header">
                      <h3 className="card-title">{section.title}</h3>
                      <div className="card-actions">
                        <button
                          className={`visibility-btn ${section.visible ? 'visible' : 'hidden'}`}
                          onClick={() => handleToggleVisibility(section.id)}
                          aria-label={section.visible ? 'Hide section' : 'Show section'}
                          aria-pressed={section.visible}
                        >
                          {section.visible ? 'ðŸ‘ï¸' : 'ðŸ‘ï¸â€ðŸ—¨ï¸'}
                        </button>
                        <button
                          className="edit-btn"
                          onClick={() => {
                            dispatch({ 
                              type: 'UPDATE_SECTION', 
                              payload: { 
                                id: section.id, 
                                updates: { title: `${section.title} (Edited)` } 
                              } 
                            });
                          }}
                          aria-label="Edit section"
                        >
                          âœï¸
                        </button>
                      </div>
                    </div>
                    <div className="card-content">
                      <ul className="item-list">
                        {section.items.map((item: string, index: number) => {
                          const itemKey = `${section.id}-${index}`;
                          return (
                            <li 
                              key={itemKey}
                              className={`item-list-item ${selectedItems.has(itemKey as any) ? 'selected' : ''}`}
                            >
                              <label className="item-label">
                                <input
                                  type="checkbox"
                                  checked={selectedItems.has(itemKey as any)}
                                  onChange={() => handleSelectItem(section.id, index)}
                                  className="item-checkbox"
                                  aria-label={`Select ${item}`}
                                />
                                <span className="item-text">{item}</span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="card-footer">
                      <span className="card-date">
                        Created: {new Date(section.createdAt).toLocaleDateString()}
                      </span>
                      <span className="card-count">
                        {section.items.length} items
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
        <div className="content-footer">
          <div className="footer-stats">
            <span className="stat-item">
              Sections: <strong>{state.sections.length}</strong>
            </span>
            <span className="stat-item">
              Visible: <strong>{state.visibleCount}</strong>
            </span>
            <span className="stat-item">
              Selected: <strong>{selectedItems.size}</strong>
            </span>
          </div>
          <div className="footer-actions">
            <button 
              className="add-btn"
              onClick={handleAddSection}
              aria-label="Add new section"
            >
              + Add Section
            </button>
            <button 
              className="clear-btn"
              onClick={() => {
                setSelectedItems(new Set());
                setActiveTab('all');
              }}
              aria-label="Clear selection"
              disabled={selectedItems.size === 0}
            >
              Clear Selection
            </button>
          </div>
        </div>
      </div>
    </ContentContext.Provider>
  );
};
export default ContentSection;
