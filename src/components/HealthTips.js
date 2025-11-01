import React from 'react';

function HealthTips({ tips }) {
  if (!tips || tips.length === 0) {
    return (
      <ol className="tips-list">
        <li>No tips available</li>
      </ol>
    );
  }

  return (
    <ol className="tips-list">
      {tips.slice(0, 5).map((tip, index) => (
        <li key={index}>{tip}</li>
      ))}
    </ol>
  );
}

export default HealthTips;

