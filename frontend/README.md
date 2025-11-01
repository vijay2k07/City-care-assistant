# Heat Health Assistant - React Frontend

A modern React.js frontend application for the Heat Health Assistant that connects to the backend API at `https://city-care-assistant.onrender.com`.

## 🌟 Features

- 🌡️ **Real-time Weather Data** - Get current weather information for any city
- 🤖 **AI-Powered Health Tips** - Personalized health recommendations based on weather conditions
- 📍 **Nearby Places Discovery** - Find hotels, hospitals, movie theaters, cafes, and shopping malls
- 🎬 **Theatre Schedule** - View local movie showtimes
- 💅 **Modern UI** - Beautiful dark theme with glassmorphism design
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open automatically at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
  ├── public/
  │   └── index.html          # HTML template
  ├── src/
  │   ├── components/
  │   │   ├── WeatherCard.js      # Weather display component
  │   │   ├── HealthTips.js       # AI health tips component
  │   │   ├── NearbyPlaces.js     # Nearby places component
  │   │   └── TheatreSchedule.js  # Theatre schedule component
  │   ├── App.js                  # Main application component
  │   ├── App.css                 # Application styles
  │   ├── index.js                # React entry point
  │   └── index.css               # Global styles
  ├── package.json                # Dependencies and scripts
  ├── .gitignore                  # Git ignore rules
  └── README.md                   # This file
```

## 🔌 Backend Integration

The frontend is configured to connect to the backend API:

- **Base URL**: `https://city-care-assistant.onrender.com`
- **Endpoint**: `/api/weather?city=<city_name>`

To change the backend URL, update the `API_BASE_URL` constant in `src/App.js`:

```javascript
const API_BASE_URL = 'https://your-backend-url.com';
```

## 📡 API Response Format

The frontend expects the following JSON structure from the backend:

```json
{
  "temperature": 35.2,
  "humidity": 68,
  "description": "hot and humid",
  "lat": 13.0827,
  "lon": 80.2707,
  "city": "Chennai",
  "country": "IN",
  "tips": [
    "Stay hydrated by drinking water regularly",
    "Avoid prolonged exposure to direct sunlight",
    "Wear light, breathable clothing"
  ],
  "places": {
    "hotel": [...],
    "hospital": [...],
    "movie_theater": [...],
    "cafe": [...],
    "shopping_mall": [...]
  },
  "theatre_schedule": {
    "Theatre Name": [
      {"movie": "Movie Name", "start": 10, "end": 13}
    ]
  }
}
```

## 🎨 Features Explained

### Weather Information
- Current temperature in Celsius
- Humidity percentage
- Weather description
- Heat index calculation
- Geographic coordinates

### AI Health Tips
- Personalized recommendations powered by Google Gemini AI
- Based on current weather conditions (temperature and humidity)
- Up to 5 tips displayed

### Nearby Places
- **Hotels** - Accommodation options
- **Hospitals** - Healthcare facilities (with temperature-based status indicators)
- **Movie Theaters** - Entertainment venues
- **Cafes** - Dining options
- **Shopping Malls** - Retail locations

### Theatre Schedule
- Local movie showtimes
- Multiple theater locations
- Show start and end times

## 🛠️ Available Scripts

- `npm start` - Runs the app in development mode at `http://localhost:3000`
- `npm run build` - Creates an optimized production build in the `build` folder
- `npm test` - Launches the test runner

## 🚀 Building for Production

To create a production build:

```bash
npm run build
```

This will create an optimized build in the `build/` directory that can be deployed to any static hosting service like:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Any web server

## 📱 Responsive Design

The application is fully responsive and adapts to different screen sizes:
- **Desktop**: Two-column layout with sidebar
- **Tablet**: Stacked layout
- **Mobile**: Optimized single-column layout

## 🎯 Technologies Used

- **React 18.2.0** - UI library
- **React DOM** - DOM rendering
- **CSS3** - Styling with CSS Variables
- **Fetch API** - HTTP requests

## 📝 License

MIT

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Backend API**: [https://city-care-assistant.onrender.com](https://city-care-assistant.onrender.com)

