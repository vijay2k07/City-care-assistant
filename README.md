# Heat Health Assistant - Weather & Nearby Places App

A modern web application that provides weather information, AI-generated health tips, and nearby places recommendations. Features a responsive single-file frontend and Python Flask backend.

## Features

- 🌤️ **Real-time Weather Data** - Temperature, humidity, heat index from OpenWeatherMap
- 🧠 **AI Health Tips** - Personalized health recommendations using Google Gemini AI
- 📍 **Nearby Places** - Hotels, hospitals, movie theaters, cafes, and shopping malls
- 🎬 **Theatre Schedule** - Local movie showtimes and schedules
- 🎨 **Modern UI** - Responsive design with custom animated cursor
- 📱 **Mobile Friendly** - Works on all devices
- 🔄 **JSON Fallback** - Paste JSON data when backend is unavailable

## Quick Start

### Option 1: Use the Single-File Frontend Only

1. Open `weather_places_ui.html` in your browser
2. Click "Paste JSON" and paste the output from your Python script
3. Click "Apply JSON" to see the data

### Option 2: Full Frontend + Backend Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the backend server:**
   ```bash
   python backend_api.py
   ```

3. **Open the frontend:**
   - Navigate to `http://localhost:5000` in your browser
   - Or open `weather_places_ui.html` directly

4. **Enter a city name** and click "Fetch" to get real-time data

## API Endpoints

The Flask backend provides these endpoints:

- `GET /api/weather?city=<city>` - Get weather and places data
- `GET /api/health` - Health check
- `GET /api/sample` - Sample data for testing
- `GET /` - Serve the frontend

## File Structure

```
heat-health-assistant/
├── weather_places_ui.html    # Single-file frontend (HTML/CSS/JS)
├── backend_api.py            # Flask backend API
├── requirements.txt           # Python dependencies
├── heat_health_assistant_project.py  # Original Python script
└── README.md                 # This file
```

## Configuration

### API Keys

The backend uses these API keys (already configured):

- **OpenWeatherMap**: `a4258a0bcaf1065be9e765a729bb1672`
- **Google Gemini**: `AIzaSyDo1mbXDOxDxvjRPD06S3xKH2k2loNbfd0`
- **Geoapify**: `25e6a35eaaa14ddfafbab36abc88472c`

### Customizing Endpoints

In `weather_places_ui.html`, update the `WEATHER_ENDPOINT` variable:

```javascript
const WEATHER_ENDPOINT = '/api/weather';  // Change this to your backend URL
```

## Usage Examples

### Frontend Only (JSON Fallback)

1. Run your original Python script:
   ```bash
   python heat_health_assistant_project.py
   ```

2. Copy the JSON output from the terminal

3. Open `weather_places_ui.html` in your browser

4. Click "Paste JSON" and paste the copied data

5. Click "Apply JSON" to display the information

### Full Stack

1. Start the backend:
   ```bash
   python backend_api.py
   ```

2. Open `http://localhost:5000` in your browser

3. Enter a city name (e.g., "Chennai", "Mumbai", "Delhi")

4. Click "Fetch" to get real-time data

## Sample JSON Format

The application expects JSON data in this format:

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
    "Drink small amounts of water often rather than a lot at once.",
    "Avoid direct sunlight between 11am-4pm. Use shade and hats.",
    "Wear loose, light-colored clothing and rest frequently."
  ],
  "places": {
    "hotel": [{"name": "Hotel SeaView", "formatted": "Raja St, Chennai"}],
    "hospital": [{"name": "Apollo Hospital", "formatted": "Greams Rd"}],
    "movie_theater": [{"name": "PVR Phoenix", "formatted": "Velachery"}],
    "cafe": [{"name": "Brew & Co", "formatted": "Mount Road"}],
    "shopping_mall": [{"name": "Phoenix MarketCity", "formatted": "Velachery"}]
  },
  "theatre_schedule": {
    "PVR Phoenix": [
      {"movie": "Barbie", "start": 15, "end": 18},
      {"movie": "Dune", "start": 19, "end": 22}
    ]
  }
}
```

## Features in Detail

### Weather Information
- Current temperature and humidity
- Weather description
- Heat index calculation
- Geographic coordinates

### AI Health Tips
- Personalized recommendations based on weather conditions
- Generated using Google Gemini AI
- Focused on hydration and heat safety

### Nearby Places
- **Hotels**: Accommodation options
- **Hospitals**: Medical facilities with safety recommendations
- **Movie Theaters**: Entertainment venues with showtimes
- **Cafes**: Food and beverage options
- **Shopping Malls**: Retail locations

### Theatre Schedule
- Real-time movie showtimes
- Multiple theater locations
- Current and upcoming shows

## Troubleshooting

### Backend Issues
- Ensure all API keys are valid
- Check internet connection
- Verify Python dependencies are installed

### Frontend Issues
- Use the JSON fallback if backend is unavailable
- Check browser console for errors
- Ensure JavaScript is enabled

### API Rate Limits
- OpenWeatherMap: 1000 calls/day (free tier)
- Google Gemini: Check your quota
- Geoapify: 3000 calls/day (free tier)

## Development

### Adding New Features
1. Update the backend API in `backend_api.py`
2. Modify the frontend in `weather_places_ui.html`
3. Test with sample data first

### Customizing the UI
- Modify CSS variables in the `:root` section
- Update color schemes and animations
- Add new place categories

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify API keys and dependencies
3. Test with the sample data endpoint