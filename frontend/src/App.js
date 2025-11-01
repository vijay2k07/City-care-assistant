import React, { useState } from 'react';
import './App.css';
import WeatherCard from './components/WeatherCard';
import HealthTips from './components/HealthTips';
import NearbyPlaces from './components/NearbyPlaces';
import TheatreSchedule from './components/TheatreSchedule';

// Backend API endpoint - update this if your backend URL changes
const API_BASE_URL = 'https://city-care-assistant.onrender.com';

function App() {
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/weather?city=${encodeURIComponent(city.trim())}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const weatherData = await response.json();
      setData(weatherData);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data. Please try again.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeatherData();
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">🌡</div>
        <div>
          <h1>City care Assistant</h1>
          <p className="lead">
            Enter a city to get weather, AI health tips, and nearby places.
          </p>
        </div>
      </header>

      <div className="card controls-card">
        <div className="controls">
          <input
            type="text"
            id="cityInput"
            placeholder="Enter city (e.g., Chennai)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            aria-label="City name"
          />
          <button 
            id="fetchBtn" 
            onClick={fetchWeatherData}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Loading...
              </>
            ) : (
              'Fetch'
            )}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
          </div>
        )}

        {data && (
          <>
            <WeatherCard data={data} />
            <div className="tips-section">
              <div className="muted">AI Health Tips</div>
              <HealthTips tips={data.tips || []} />
            </div>
          </>
        )}

        <div style={{ marginTop: '12px', color: 'var(--muted)', fontSize: '13px' }}>
          <strong>💡 Tip:</strong> Backend API: {API_BASE_URL}
        </div>
      </div>

      {data && (
        <>
          <div style={{ height: '12px' }}></div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <strong>Theatre Schedule</strong>
              <span className="muted">Local shows</span>
            </div>
            <TheatreSchedule schedule={data.theatre_schedule || {}} />
          </div>
        </>
      )}

      <div className="right-column">
        {data && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <strong>Nearby Places</strong>
              <div className="muted">Showing up to 5 per category</div>
            </div>
            <NearbyPlaces places={data.places || {}} temperature={data.temperature} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

