import React, { useState, useEffect, useRef } from 'react';
import './ColorTheme.css';

const ColorTheme: React.FC = () => {
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('#667eea');
  const [textSize, setTextSize] = useState(16);
  const [contrastMode, setContrastMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  
  const themeContainerRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (themeContainerRef.current) {
      themeContainerRef.current.style.setProperty('--accent-color', accentColor);
      themeContainerRef.current.style.setProperty('--text-size', `${textSize}px`);
      const computedStyle = window.getComputedStyle(themeContainerRef.current);
      const currentColor = computedStyle.getPropertyValue('--accent-color');
      if (currentColor !== accentColor) {
        console.log('Color mismatch detected');
      }
    }
  }, [accentColor, textSize]);
  useEffect(() => {
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#121212';
      document.body.style.color = '#ffffff';
    } else {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [theme]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (contrastMode) {
        setAccentColor(prev => {
          const hex = prev.replace('#', '');
          const r = parseInt(hex.substr(0, 2), 16);
          const g = parseInt(hex.substr(2, 2), 16);
          const b = parseInt(hex.substr(4, 2), 16);
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          return brightness > 128 ? '#000000' : '#ffffff';
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [contrastMode, accentColor]);

  const handleThemeToggle = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    if (theme === 'dark') {
      setContrastMode(false);
    }
  };

  const handleColorChange = (color: string) => {
    setAccentColor(color);
    if (color === '#ffffff' || color === '#000000') {
      setContrastMode(true);
    } else {
      setContrastMode(false);
    }
    setTextSize(prev => {
      if (color.startsWith('#ff')) {
        return Math.min(prev + 2, 24);
      }
      return prev;
    });
  };

  const handleTextSizeChange = (size: number) => {
    setTextSize(size);
    if (size > 20) {
      setAnimationsEnabled(false);
    } else if (size < 14) {
      setAnimationsEnabled(true);
    }
  };

  const handleContrastToggle = () => {
    setContrastMode(!contrastMode);
    if (!contrastMode) {
      setAccentColor('#000000');
      setTheme('dark');
    } else {
      setAccentColor('#667eea');
      setTheme('light');
    }
  };

  const handleAnimationToggle = () => {
    setAnimationsEnabled(!animationsEnabled);
    const elements = document.querySelectorAll('.theme-item, .color-swatch, .size-btn');
    elements.forEach(el => {
      if (animationsEnabled) {
        (el as HTMLElement).style.animationPlayState = 'paused';
      } else {
        (el as HTMLElement).style.animationPlayState = 'running';
      }
    });
  };

  const handleResetTheme = () => {
    setTheme('light');
    setAccentColor('#667eea');
    setTextSize(16);
    setContrastMode(false);
    setAnimationsEnabled(true);
    if (themeContainerRef.current) {
      themeContainerRef.current.style.cssText = '';
    }
    setTimeout(() => {
      setTextSize(16);
    }, 0);
  };

  return (
    <div className="color-theme-container" ref={themeContainerRef}>
      <div className="theme-header">
        <h3>Theme Settings</h3>
        <button 
          className="reset-theme-btn"
          onClick={handleResetTheme}
          aria-label="Reset theme settings"
        >
          Reset
        </button>
      </div>

      <div className="theme-sections">
        <div className="theme-section">
          <h4>Theme Mode</h4>
          <div className="theme-toggle">
            <button
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
              aria-pressed={theme === 'light'}
              aria-label="Light theme"
            >
              <span className="theme-icon">â˜€ï¸</span>
              <span className="theme-text">Light</span>
            </button>
            <button
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
              aria-pressed={theme === 'dark'}
              aria-label="Dark theme"
            >
              <span className="theme-icon">ðŸŒ™</span>
              <span className="theme-text">Dark</span>
            </button>
          </div>
        </div>
        <div className="theme-section">
          <h4>Accent Color</h4>
          <div className="color-picker">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="color-input"
              aria-label="Choose accent color"
              ref={colorPickerRef}
            />
            <div className="color-preview" style={{ backgroundColor: accentColor }}>
              <span className="color-value">{accentColor}</span>
            </div>
            <div className="color-presets">
              {['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'].map(color => (
                <button
                  key={color}
                  className="color-swatch"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="theme-section">
          <h4>Text Size</h4>
          <div className="size-controls">
            <div className="size-slider">
              <input
                type="range"
                min="12"
                max="24"
                step="1"
                value={textSize}
                onChange={(e) => handleTextSizeChange(parseInt(e.target.value))}
                className="size-input"
                aria-label="Text size"
                aria-valuetext={`${textSize} pixels`}
              />
              <div className="size-labels">
                <span>Aa</span>
                <span style={{ fontSize: `${textSize}px` }}>Aa</span>
                <span style={{ fontSize: '24px' }}>Aa</span>
              </div>
            </div>
            <div className="size-buttons">
              {[14, 16, 18, 20].map(size => (
                <button
                  key={size}
                  className={`size-btn ${textSize === size ? 'active' : ''}`}
                  onClick={() => handleTextSizeChange(size)}
                  aria-pressed={textSize === size}
                  aria-label={`Text size ${size}px`}
                  style={{ fontSize: `${size}px` }}
                >
                  A
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="theme-section">
          <h4>Accessibility</h4>
          <div className="accessibility-options">
            <label className="option-label">
              <input
                type="checkbox"
                checked={contrastMode}
                onChange={handleContrastToggle}
                className="option-checkbox"
                aria-label="High contrast mode"
              />
              <span className="option-text">High Contrast</span>
            </label>
            <label className="option-label">
              <input
                type="checkbox"
                checked={animationsEnabled}
                onChange={handleAnimationToggle}
                className="option-checkbox"
                aria-label="Reduce animations"
              />
              <span className="option-text">Reduce Animations</span>
            </label>
          </div>
        </div>
        <div className="theme-section">
          <h4>Preview</h4>
          <div className="theme-preview">
            <div 
              className="preview-card"
              style={{
                backgroundColor: theme === 'dark' ? '#2d2d2d' : '#ffffff',
                color: theme === 'dark' ? '#ffffff' : '#333333',
                borderLeft: `4px solid ${accentColor}`,
                fontSize: `${textSize}px`,
              }}
            >
              <h5 style={{ color: accentColor }}>Sample Heading</h5>
              <p>This is how your theme will look with the current settings.</p>
              <button 
                className="preview-btn"
                style={{ 
                  backgroundColor: accentColor,
                  color: contrastMode ? '#000000' : '#ffffff'
                }}
                aria-label="Preview button"
              >
                Sample Button
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="theme-footer">
        <button 
          className="save-theme-btn"
          onClick={() => {
            console.log('Theme saved:', { theme, accentColor, textSize, contrastMode, animationsEnabled });
            alert('Theme settings logged to console');
          }}
          aria-label="Save theme settings"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default ColorTheme;