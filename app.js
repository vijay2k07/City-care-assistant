// Heat Health Assistant - JavaScript Application
// Modern web interface for weather, health tips, and nearby places

// Import API keys from config file
import { API_KEYS } from './config.js';

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const resultsContainer = document.getElementById('results-container');

// Weather elements
const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const weatherDescription = document.getElementById('weather-description');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const heatIndex = document.getElementById('heat-index');

// AI tips elements
const aiTipsLoading = document.getElementById('ai-tips-loading');
const aiTipsText = document.getElementById('ai-tips-text');

// Places grid
const placesGrid = document.getElementById('places-grid');

// Place categories mapping
const placesCategories = {
    hotel: {
        category: 'accommodation.hotel',
        icon: 'fas fa-bed',
        name: 'Hotels'
    },
    hospital: {
        category: 'healthcare.hospital',
        icon: 'fas fa-hospital',
        name: 'Hospitals'
    },
    movie_theater: {
        category: 'entertainment.cinema',
        icon: 'fas fa-film',
        name: 'Movie Theaters'
    },
    shopping_mall: {
        category: 'commercial.shopping_mall',
        icon: 'fas fa-shopping-bag',
        name: 'Shopping Malls'
    },
    cafe: {
        category: 'catering.cafe',
        icon: 'fas fa-coffee',
        name: 'Cafes'
    }
};

// Weather icon mapping
const weatherIcons = {
    'clear sky': 'fas fa-sun',
    'few clouds': 'fas fa-cloud-sun',
    'scattered clouds': 'fas fa-cloud',
    'broken clouds': 'fas fa-cloud',
    'shower rain': 'fas fa-cloud-rain',
    'rain': 'fas fa-cloud-rain',
    'thunderstorm': 'fas fa-bolt',
    'snow': 'fas fa-snowflake',
    'mist': 'fas fa-smog',
    'fog': 'fas fa-smog',
    'haze': 'fas fa-smog'
};

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Main search function
async function handleSearch() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    try {
        showLoading();
        hideError();
        hideResults();
        
        // Fetch weather data
        const weatherData = await fetchWeather(city);
        
        // Display weather information
        displayWeather(weatherData);
        
        // Calculate and display heat index
        const heatIndexValue = calculateHeatIndex(weatherData.temperature, weatherData.humidity);
        displayHeatIndex(heatIndexValue);
        
        // Generate AI health tips
        generateHealthTips(city, weatherData.temperature, weatherData.humidity);
        
        // Fetch and display nearby places
        await fetchAndDisplayPlaces(weatherData.latitude, weatherData.longitude, weatherData.temperature);
        
        showResults();
        
    } catch (error) {
        console.error('Search error:', error);
        showError(error.message || 'An error occurred while fetching data');
    } finally {
        hideLoading();
    }
}

// Fetch weather data from OpenWeatherMap API
async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEYS.OPENWEATHER}&units=metric`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod !== 200) {
            throw new Error(data.message || 'City not found');
        }
        
        return {
            city: data.name,
            country: data.sys.country,
            temperature: Math.round(data.main.temp),
            humidity: data.main.humidity,
            description: data.weather[0].description,
            latitude: data.coord.lat,
            longitude: data.coord.lon,
            weatherMain: data.weather[0].main.toLowerCase()
        };
    } catch (error) {
        if (error.name === 'TypeError') {
            throw new Error('Network error. Please check your internet connection.');
        }
        throw error;
    }
}

// Calculate heat index
function calculateHeatIndex(temperature, humidity) {
    return Math.round((temperature + 0.33 * humidity - 0.7) * 10) / 10;
}

// Display weather information
function displayWeather(weatherData) {
    cityName.textContent = `${weatherData.city}, ${weatherData.country}`;
    weatherDescription.textContent = weatherData.description.charAt(0).toUpperCase() + weatherData.description.slice(1);
    temperature.textContent = `${weatherData.temperature}°C`;
    humidity.textContent = `${weatherData.humidity}%`;
    
    // Set weather icon
    const iconClass = weatherIcons[weatherData.description] || 'fas fa-cloud-sun';
    weatherIcon.className = `weather-icon ${iconClass}`;
}

// Display heat index
function displayHeatIndex(heatIndexValue) {
    heatIndex.textContent = `${heatIndexValue}°C`;
}

// Generate AI health tips using Google Gemini
async function generateHealthTips(city, temperature, humidity) {
    try {
        const prompt = `The current weather in ${city} is ${temperature}°C with ${humidity}% humidity. Give 3 short practical health and hydration tips suitable for this condition. Respond in numbered points.`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEYS.GEMINI}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate health tips');
        }
        
        const data = await response.json();
        const tipsText = data.candidates[0].content.parts[0].text;
        
        // Hide loading and show tips
        aiTipsLoading.classList.add('hidden');
        aiTipsText.textContent = tipsText;
        aiTipsText.classList.remove('hidden');
        
    } catch (error) {
        console.error('AI tips error:', error);
        aiTipsLoading.classList.add('hidden');
        aiTipsText.textContent = 'Unable to generate health tips at this time. Please try again later.';
        aiTipsText.classList.remove('hidden');
    }
}

// Fetch nearby places using Geoapify API
async function fetchNearbyPlaces(lat, lon, category) {
    const url = `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${lon},${lat},5000&limit=5&apiKey=${API_KEYS.GEOAPIFY}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch ${category} places`);
        }
        
        const data = await response.json();
        return data.features || [];
    } catch (error) {
        console.error(`Error fetching ${category} places:`, error);
        return [];
    }
}

// Get hospital safety recommendation
function getHospitalStatus(temperature) {
    if (temperature < 30) {
        return { status: 'Safe to visit', class: 'status-safe' };
    } else if (temperature < 40) {
        return { status: 'Caution: stay hydrated while going', class: 'status-caution' };
    } else {
        return { status: 'Only go if urgent; stay indoors otherwise', class: 'status-urgent' };
    }
}

// Fetch and display all nearby places
async function fetchAndDisplayPlaces(lat, lon, temperature) {
    placesGrid.innerHTML = '';
    
    for (const [placeType, config] of Object.entries(placesCategories)) {
        const places = await fetchNearbyPlaces(lat, lon, config.category);
        
        if (places.length > 0) {
            const placeSection = createPlaceSection(placeType, config, places, temperature);
            placesGrid.appendChild(placeSection);
        }
    }
    
    // If no places found, show message
    if (placesGrid.children.length === 0) {
        placesGrid.innerHTML = '<p style="text-align: center; color: var(--gray-500); grid-column: 1 / -1;">No nearby places found in this area.</p>';
    }
}

// Create place section HTML
function createPlaceSection(placeType, config, places, temperature) {
    const section = document.createElement('div');
    section.className = 'place-section';
    
    let placesHTML = '';
    
    places.forEach(place => {
        const props = place.properties;
        const name = props.name || 'Unknown';
        const address = props.formatted || '';
        
        let statusHTML = '';
        
        if (placeType === 'hospital') {
            const hospitalStatus = getHospitalStatus(temperature);
            statusHTML = `<div class="status ${hospitalStatus.class}">${hospitalStatus.status}</div>`;
        } else if (placeType === 'hotel') {
            statusHTML = '<div class="status status-safe">Available</div>';
        } else if (placeType === 'movie_theater') {
            statusHTML = '<div class="status status-safe">Open</div>';
        }
        
        placesHTML += `
            <div class="place-card">
                <h4>
                    <i class="${config.icon}"></i>
                    ${name}
                </h4>
                <p class="address">${address}</p>
                ${statusHTML}
            </div>
        `;
    });
    
    section.innerHTML = `
        <div class="section-header">
            <h3>
                <i class="${config.icon}"></i>
                ${config.name}
            </h3>
        </div>
        <div class="places-subgrid">
            ${placesHTML}
        </div>
    `;
    
    return section;
}

// UI State Management Functions
function showLoading() {
    loader.classList.remove('hidden');
}

function hideLoading() {
    loader.classList.add('hidden');
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function showResults() {
    resultsContainer.classList.remove('hidden');
}

function hideResults() {
    resultsContainer.classList.add('hidden');
}

// Initialize AI tips loading state
function initializeAITips() {
    aiTipsLoading.classList.remove('hidden');
    aiTipsText.classList.add('hidden');
}

// Reset AI tips when new search starts
cityInput.addEventListener('input', () => {
    if (aiTipsText.classList.contains('hidden')) {
        initializeAITips();
    }
});

// Add CSS for place sections
const style = document.createElement('style');
style.textContent = `
    .place-section {
        margin-bottom: var(--space-lg);
    }
    
    .place-section .section-header {
        margin-bottom: var(--space-md);
    }
    
    .place-section .section-header h3 {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--gray-800);
        display: flex;
        align-items: center;
        gap: var(--space-sm);
    }
    
    .place-section .section-header i {
        background: var(--primary-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .places-subgrid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--space-sm);
    }
`;
document.head.appendChild(style);
