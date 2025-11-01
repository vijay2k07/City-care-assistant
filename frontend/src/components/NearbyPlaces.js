import React from 'react';

function NearbyPlaces({ places, temperature }) {
  const getHospitalStatus = (temp) => {
    if (temp === undefined) return { text: 'Status unknown', class: 'status-caution' };
    if (temp < 30) return { text: 'Safe to visit', class: 'status-safe' };
    if (temp < 40) return { text: 'Caution: stay hydrated', class: 'status-caution' };
    return { text: 'Only urgent visits', class: 'status-urgent' };
  };

  const categories = ['hotel', 'hospital', 'movie_theater', 'cafe', 'shopping_mall'];
  const categoryLabels = {
    hotel: 'Hotels',
    hospital: 'Hospitals',
    movie_theater: 'Movie Theaters',
    cafe: 'Cafes',
    shopping_mall: 'Shopping Malls'
  };

  const hospitalStatus = getHospitalStatus(temperature);

  return (
    <div className="places-list">
      {categories.map((cat) => {
        const placesList = places[cat] || [];
        const label = categoryLabels[cat] || cat.replace('_', ' ');

        return (
          <div key={cat} style={{ marginTop: placesList.length > 0 ? '12px' : '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <strong style={{ fontSize: '14px' }}>{label}</strong>
              <span className="muted" style={{ fontSize: '12px' }}>
                {placesList.length} found
              </span>
            </div>

            {placesList.length === 0 ? (
              <div className="place-item">
                <div className="muted">No results</div>
              </div>
            ) : (
              placesList.slice(0, 5).map((place, index) => (
                <div key={index} className="place-item">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>
                      {place.name || 'Unknown'}
                    </div>
                    <div className="meta" style={{ fontSize: '12px', marginTop: '2px' }}>
                      {place.formatted || place.address || ''}
                    </div>
                  </div>
                  <div>
                    {cat === 'hospital' ? (
                      <div className={`status ${hospitalStatus.class}`}>
                        {hospitalStatus.text}
                      </div>
                    ) : cat === 'movie_theater' ? (
                      <div className="muted" style={{ fontSize: '12px' }}>Theatre</div>
                    ) : (
                      <div className="muted" style={{ fontSize: '12px' }}>Nearby</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        );
      })}
    </div>
  );
}

export default NearbyPlaces;

