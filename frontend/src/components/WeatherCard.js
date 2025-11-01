import React from 'react';

function WeatherCard({ data }) {
  const calculateHeatIndex = (temp, humidity) => {
    if (temp === undefined || humidity === undefined) return null;
    return (temp + 0.33 * humidity - 0.7).toFixed(1);
  };

  const heatIndex = calculateHeatIndex(data.temperature, data.humidity);

  return (
    <div className="weather-block">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="temp">
            {data.temperature !== undefined
              ? `${Math.round(data.temperature)}°C`
              : '--°C'}
          </div>
          <div className="desc">{data.description || '--'}</div>
        </div>
        {heatIndex && (
          <div className="tag">
            Heat index: {heatIndex}°C
          </div>
        )}
      </div>

      <div className="grid">
        <div className="grid-item">
          <div className="label">Humidity</div>
          <div className="value">
            {data.humidity !== undefined ? `${data.humidity}%` : '--%'}
          </div>
        </div>
        <div className="grid-item">
          <div className="label">Coordinates</div>
          <div className="value">
            {data.lat && data.lon
              ? `${parseFloat(data.lat).toFixed(3)}, ${parseFloat(data.lon).toFixed(3)}`
              : '--'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;

