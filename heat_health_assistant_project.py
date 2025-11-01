import os
import sys
import requests
from datetime import datetime
import google.generativeai as genai
from colorama import Fore, Style, init

# Initialize colorama
init(autoreset=True)

# --- SUPPRESS GEMINI/ABSEIL WARNINGS ---
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['GRPC_VERBOSITY'] = 'ERROR'

# 🔐 API KEYS
OPENWEATHER_API_KEY = "a4258a0bcaf1065be9e765a729bb1672"
GEMINI_API_KEY = "AIzaSyDo1mbXDOxDxvjRPD06S3xKH2k2loNbfd0"
GEOAPIFY_API_KEY = "25e6a35eaaa14ddfafbab36abc88472c"

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# 🌍 Get city name from user
city = input(Fore.YELLOW + "Enter city name: ")

# --- Weather from OpenWeatherMap ---
weather_url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
response = requests.get(weather_url)
data = response.json()

if data.get("cod") != 200:
    print(Fore.RED + f"\n❌ Error: {data.get('message', 'City not found!')}")
    exit()

temperature = data["main"]["temp"]
humidity = data["main"]["humidity"]
description = data["weather"][0]["description"]
lat = data["coord"]["lat"]
lon = data["coord"]["lon"]

print(Fore.CYAN + f"\n🌤 Weather in {city.title()}: {description}")
print(Fore.RED + f"🌡 Temperature: {temperature}°C")
print(Fore.BLUE + f"💧 Humidity: {humidity}%")

# --- Heat Index Calculation ---
heat_index = temperature + 0.33*humidity - 0.7
print(Fore.MAGENTA + f"🌞 Heat Index (Feels like): {heat_index:.1f}°C")

# --- AI Health Tips ---
prompt = f"""
The current weather in {city} is {temperature}°C with {humidity}% humidity.
Give 3 short practical health and hydration tips suitable for this condition.
Respond in numbered points.
"""
try:
    stderr_fileno = sys.stderr
    sys.stderr = open(os.devnull, 'w')

    model = genai.GenerativeModel("gemini-2.5-flash")
    ai_response = model.generate_content(prompt)

    sys.stderr.close()
    sys.stderr = stderr_fileno

    print(Fore.GREEN + Style.BRIGHT + "\n✅ AI Health Suggestions:")
    print(Style.RESET_ALL + ai_response.text)

except Exception as e:
    print(Fore.RED + "\n⚠ Could not connect to Gemini API.")
    print("Error:", e)

# --- Hospital Recommendation Logic ---
def hospital_recommendation(temp_c):
    if temp_c < 30:
        return Fore.GREEN + "Safe to visit"
    elif temp_c < 40:
        return Fore.YELLOW + "Caution: stay hydrated while going"
    else:
        return Fore.RED + "Only go if urgent; stay indoors otherwise"

# --- Simulated theatre schedule ---
theatre_schedule = {
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

# --- Nearby Places using Geoapify ---
def get_nearby_places(lat, lon, category):
    url = f"https://api.geoapify.com/v2/places?categories={category}&filter=circle:{lon},{lat},5000&limit=5&apiKey={GEOAPIFY_API_KEY}"
    response = requests.get(url)
    if response.status_code != 200:
        print(Fore.RED + f"❌ Could not fetch {category}. Status code: {response.status_code}")
        return []
    return response.json().get("features", [])

# Only include hotel, hospital, movie_theater, shopping_mall, cafe
places_categories = {
    "hotel": "accommodation.hotel",
    "hospital": "healthcare.hospital",
    "movie_theater": "entertainment.cinema",
    "shopping_mall": "commercial.shopping_mall",
    "cafe": "catering.cafe"
}

# Display Nearby Places
for place_type, geo_category in places_categories.items():
    features = get_nearby_places(lat, lon, geo_category)
    if features:
        print(Fore.MAGENTA + f"\n{place_type.title()}s:")
        for place in features:
            props = place["properties"]
            name = props.get("name", "Unknown")
            address = props.get("formatted", "")
            if place_type == "hotel":
                print(f"{name} - {address} → Special Today: No specific special item today")
            elif place_type == "hospital":
                status = hospital_recommendation(temperature)
                print(f"{name} - {address} → {status}")
            elif place_type == "movie_theater":
                theatre_name = name
                current_hour = int(datetime.now().strftime("%H"))
                current_movies = []
                for show in theatre_schedule.get(theatre_name, []):
                    if show["start"] <= current_hour < show["end"]:
                        current_movies.append(show["movie"])
                movies_text = ", ".join(current_movies) if current_movies else "No movies showing now"
                print(f"{name} - {address} → Movies Now: {movies_text}")
            else:
                print(f"{name} - {address}")
    else:
        print(Fore.RED + f"No {place_type} found nearby.")