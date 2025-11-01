import React from 'react';

function TheatreSchedule({ schedule }) {
  if (!schedule || Object.keys(schedule).length === 0) {
    return (
      <div className="muted" style={{ fontSize: '13px' }}>
        No schedule provided
      </div>
    );
  }

  return (
    <div className="theatre-schedule">
      {Object.entries(schedule).map(([theatreName, shows]) => (
        <div key={theatreName} style={{ marginBottom: '12px' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>
            {theatreName}
          </div>
          {shows.map((show, index) => (
            <div key={index} className="movie-row">
              <div style={{ fontSize: '13px' }}>{show.movie}</div>
              <div className="muted" style={{ fontSize: '12px' }}>
                {show.start}:00 - {show.end}:00
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default TheatreSchedule;

