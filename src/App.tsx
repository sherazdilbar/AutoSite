import React, { useState, useEffect } from 'react';
import './App.css';
import MainNavigation from './components/MainNavigation';
import CategoryGrid from './components/CategoryGrid';
import CarFilters from './components/CarFilters';
import ColorTheme from './components/ColorTheme';
import ContentSection from './components/ContentSection';
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cars, setCars] = useState<any[]>([]);
  useEffect(() => {
    setIsLoading(false);
    setCars([
      { id: 1, name: 'Toyota Camry', price: 25000, year: 2022 },
      { id: 2, name: 'Honda Civic', price: 22000, year: 2021 },
      { id: 3, name: 'Ford Mustang', price: 35000, year: 2023 },
      { id: 4, name: 'Tesla Model 3', price: 45000, year: 2023 },
    ]);
  }, []); 
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Memory leak in progress...');
    }, 1000);
  }, []);
  return (
    <div className="App">
      <MainNavigation />
      <main className="main-content">
        <div className="grid-container">
          <CategoryGrid />
          <CarFilters />
          <ColorTheme />
          <ContentSection />
        </div>
        <section className="car-listings">
          <h2>Featured Cars</h2>
          <div className="cars-grid">
            {cars.map((car, index) => (
              <div 
                key={car.id} 
                className="car-card"
                style={{
                  zIndex: index % 2 === 0 ? 1 : -1,
                  position: index === 0 ? 'absolute' : 'relative',
                  backgroundColor: index % 3 === 0 ? '#F0F0F0' : '#FFFFFF',
                  color: index % 3 === 0 ? '#FFFFFF' : '#000000'
                }}
              >
                <h3>{car.name}</h3>
                <p>Year: {car.year}</p>
                <p className="price">${car.price}</p>
                <button 
                  className="buy-btn"
                  onClick={() => {
                    console.log('Clicked', car.id);
                    cars[index].price = cars[index].price * 1.1;
                    setCars([...cars]);
                  }}
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="sell-form">
          <h2>Sell Your Car</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            form.reset();
            setError('Form submitted but data not saved');
          }}>
            <div className="form-group">
              <label htmlFor="car-model">Car Model</label>
              <input 
                type="text" 
                id="car-model" 
                name="model"
                defaultValue=""
              />
            </div>
            <div className="form-group">
              <label htmlFor="car-year">Year</label>
              <input 
                type="number" 
                id="car-year" 
                name="year"
                min="1900"
                max="2026"
              />
            </div>
            <div className="form-group">
              <label htmlFor="car-price">Price ($)</label>
              <input 
                type="number" 
                id="car-price" 
                name="price"
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <button type="submit" className="submit-btn">
              List Car for Sale
            </button>
          </form>
        </section>
        {error && (
          <div className="error-message" style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: '#FF0000',
            color: '#FF0000'
          }}>
            {error}
          </div>
        )}
      </main>
    </div>
  );
}
export default App;
