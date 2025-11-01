#!/usr/bin/env python3
"""
Simple Flask Backend for Heat Health Assistant
Integrates with the existing heat_health_assistant_project.py script
"""

import os
import sys
import requests
import json
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
from colorama import Fore, Style, init

# Initialize colorama
init(autoreset=True)

# Suppress warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['GRPC_VERBOSITY'] = 'ERROR'

# API Keys (same as your original script)
OPENWEATHER_API_KEY = "a4258a0bcaf1065be9e765a729bb1672"
GEMINI_API_KEY = "AIzaSyDo1mbXDOxDxvjRPD06S3xKH2k2loNbfd0"
GEOAPIFY_API_KEY = "25e6a35eaaa14ddfafbab36abc88472c"

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Flask app setup
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Theatre schedule (same as your original script)
THEATRE_SCHEDULE = {
    "SPI Cinemas - Ampa Skywalk": [
        {"movie": "Spider-Man", "start": 10, "end": 13},
        {"movie": "Dune", "start": 14, "end": 17},
        {"movie": "Barbie", "start": 18, "end": 21}
    ],
    "PVR Cinemas - Phoenix Marketcity": [
        {"movie": "Fast X", "start": 11, "end": 14},
        {"movie": "Barbie", "start": 15, "end": 18},
        {"movie": "Dune", "start": 19, "end": 22}
    ]
}

def get_weather_data(city):
    """Get weather data from OpenWeatherMap API (same logic as your script)"""
    weather_url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
    response = requests.get(weather_url)
    data = response.json()

    if data.get("cod") != 200:
        raise Exception(data.get('message', 'City not found!'))

    return {
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "description": data["weather"][0]["description"],
        "lat": data["coord"]["lat"],
        "lon": data["coord"]["lon"],
        "city": data["name"],
        "country": data["sys"]["country"]
    }

def get_ai_health_tips(city, temperature, humidity):
    """Generate AI health tips using Google Gemini (same logic as your script)"""
    prompt = f"""
    The current weather in {city} is {temperature}°C with {humidity}% humidity.
    Give 3 short practical health and hydration tips suitable for this condition.
    Respond in numbered points.
    """
    
    try:
        # Suppress stderr to avoid warnings (same as your script)
        stderr_fileno = sys.stderr
        sys.stderr = open(os.devnull, 'w')

        model = genai.GenerativeModel("gemini-2.5-flash")
        ai_response = model.generate_content(prompt)

        sys.stderr.close()
        sys.stderr = stderr_fileno

        # Parse the response into individual tips
        tips_text = ai_response.text
        tips = []
        lines = tips_text.split('\n')
        
        for line in lines:
            line = line.strip()
            if line and (line.startswith(('1.', '2.', '3.', '4.', '5.')) or 
                        line.startswith(('•', '-', '*'))):
                tip = line.lstrip('123456789.•-* ').strip()
                if tip:
                    tips.append(tip)
        
        return tips[:5]  # Return up to 5 tips
        
    except Exception as e:
        print(f"AI tips error: {e}")
        return [
            "Stay hydrated by drinking water regularly",
            "Avoid prolonged exposure to direct sunlight", 
            "Wear light, breathable clothing"
        ]

def get_nearby_places(lat, lon, category):
    """Get nearby places using Geoapify API (same logic as your script)"""
    url = f"https://api.geoapify.com/v2/places?categories={category}&filter=circle:{lon},{lat},5000&limit=5&apiKey={GEOAPIFY_API_KEY}"
    response = requests.get(url)
    
    if response.status_code != 200:
        print(f"Could not fetch {category}. Status code: {response.status_code}")
        return []
    
    places = []
    for feature in response.json().get("features", []):
        props = feature.get("properties", {})
        places.append({
            "name": props.get("name", "Unknown"),
            "formatted": props.get("formatted", ""),
            "address": props.get("address_line2", "")
        })
    
    return places

def get_all_nearby_places(lat, lon):
    """Get all categories of nearby places (same categories as your script)"""
    places_categories = {
        "hotel": "accommodation.hotel",
        "hospital": "healthcare.hospital", 
        "movie_theater": "entertainment.cinema",
        "shopping_mall": "commercial.shopping_mall",
        "cafe": "catering.cafe"
    }
    
    places = {}
    for place_type, geo_category in places_categories.items():
        places[place_type] = get_nearby_places(lat, lon, geo_category)
    
    return places

@app.route('/')
def serve_frontend():
    """Serve the main HTML file"""
    return send_from_directory('.', 'weather_places_ui.html')

@app.route('/api/weather')
def get_weather():
    """Main API endpoint - integrates with your existing script logic"""
    try:
        city = request.args.get('city', '').strip()
        if not city:
            return jsonify({"error": "City parameter is required"}), 400
        
        print(f"{Fore.CYAN}Fetching data for: {city}")
        
        # Get weather data (same as your script)
        weather_data = get_weather_data(city)
        
        # Get AI health tips (same as your script)
        tips = get_ai_health_tips(city, weather_data["temperature"], weather_data["humidity"])
        
        # Get nearby places (same as your script)
        places = get_all_nearby_places(weather_data["lat"], weather_data["lon"])
        
        # Prepare response in the format expected by the frontend
        response_data = {
            "temperature": weather_data["temperature"],
            "humidity": weather_data["humidity"],
            "description": weather_data["description"],
            "lat": weather_data["lat"],
            "lon": weather_data["lon"],
            "city": weather_data["city"],
            "country": weather_data["country"],
            "tips": tips,
            "places": places,
            "theatre_schedule": THEATRE_SCHEDULE
        }
        
        print(f"{Fore.GREEN}Successfully processed data for {city}")
        return jsonify(response_data)
        
    except Exception as e:
        print(f"{Fore.RED}Error processing request: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

if __name__ == '__main__':
    print(f"{Fore.GREEN}🌡 Heat Health Assistant - Simple Flask Backend")
    print(f"{Fore.YELLOW}📡 API Endpoints:")
    print(f"   GET  /api/weather?city=<city>  - Get weather and places data")
    print(f"   GET  /api/health               - Health check")
    print(f"   GET  /                         - Serve frontend")
    print(f"{Fore.CYAN}🚀 Starting Flask server on http://localhost:5000")
    print(f"{Fore.MAGENTA}💡 This backend uses the same logic as your heat_health_assistant_project.py")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
