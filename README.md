# Heat Health Assistant - React Frontend

A modern React.js frontend for the Heat Health Assistant application that connects to your live backend at `https://city-care-assistant.onrender.com`.

## Features

- 🌡️ Real-time weather data fetching
- 🤖 AI-powered health tips
- 📍 Nearby places discovery (hotels, hospitals, movie theaters, cafes, shopping malls)
- 🎬 Theatre schedule display
- 💅 Modern, responsive UI with dark theme
- 📱 Mobile-friendly design

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
src/
  ├── components/
  │   ├── WeatherCard.js      # Weather display component
  │   ├── HealthTips.js        # AI health tips component
  │   ├── NearbyPlaces.js      # Nearby places component
  │   └── TheatreSchedule.js  # Theatre schedule component
  ├── App.js                   # Main application component
  ├── App.css                  # Application styles
  ├── index.js                 # React entry point
  └── index.css                # Global styles
```

## Backend Integration

The frontend is configured to connect to:
- **API Base URL**: `https://city-care-assistant.onrender.com`
- **Endpoint**: `/api/weather?city=<city_name>`

To change the backend URL, update the `API_BASE_URL` constant in `src/App.js`.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner

## Features Overview

### Weather Information
- Current temperature
- Humidity level
- Weather description
- Heat index calculation
- Coordinates (latitude/longitude)

### AI Health Tips
- Personalized health recommendations based on weather conditions
- Powered by Google Gemini AI

### Nearby Places
- Hotels
- Hospitals (with heat-based status indicators)
- Movie Theaters
- Cafes
- Shopping Malls

### Theatre Schedule
- Local movie showtimes
- Multiple theater locations

## Technologies Used

- React 18.2.0
- CSS3 with CSS Variables
- Fetch API for HTTP requests

## License

MIT
