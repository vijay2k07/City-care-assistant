#!/usr/bin/env python3
"""
Test script for the Heat Health Assistant backend API
"""

import requests
import json
import time

def test_backend():
    """Test the backend API endpoints"""
    base_url = "http://localhost:5000"
    
    print("🧪 Testing Heat Health Assistant Backend API")
    print("=" * 50)
    
    # Test health check
    print("\n1. Testing health check endpoint...")
    try:
        response = requests.get(f"{base_url}/api/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False
    
    # Test sample data endpoint
    print("\n2. Testing sample data endpoint...")
    try:
        response = requests.get(f"{base_url}/api/sample")
        if response.status_code == 200:
            data = response.json()
            print("✅ Sample data retrieved")
            print(f"   Temperature: {data.get('temperature')}°C")
            print(f"   Humidity: {data.get('humidity')}%")
            print(f"   City: {data.get('city')}")
            print(f"   Tips count: {len(data.get('tips', []))}")
            print(f"   Places categories: {list(data.get('places', {}).keys())}")
        else:
            print(f"❌ Sample data failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Sample data error: {e}")
    
    # Test weather endpoint with Chennai
    print("\n3. Testing weather endpoint with Chennai...")
    try:
        response = requests.get(f"{base_url}/api/weather?city=Chennai")
        if response.status_code == 200:
            data = response.json()
            print("✅ Weather data retrieved for Chennai")
            print(f"   Temperature: {data.get('temperature')}°C")
            print(f"   Humidity: {data.get('humidity')}%")
            print(f"   Description: {data.get('description')}")
            print(f"   Coordinates: {data.get('lat')}, {data.get('lon')}")
            print(f"   AI Tips: {len(data.get('tips', []))} tips generated")
            
            # Check places data
            places = data.get('places', {})
            for category, items in places.items():
                print(f"   {category}: {len(items)} places found")
                
        else:
            print(f"❌ Weather data failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Weather data error: {e}")
    
    # Test invalid city
    print("\n4. Testing with invalid city...")
    try:
        response = requests.get(f"{base_url}/api/weather?city=InvalidCity123")
        if response.status_code == 400 or response.status_code == 500:
            print("✅ Invalid city handled correctly")
            print(f"   Status: {response.status_code}")
        else:
            print(f"❌ Invalid city not handled: {response.status_code}")
    except Exception as e:
        print(f"❌ Invalid city test error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Backend testing completed!")
    print("\nTo test the frontend:")
    print("1. Open http://localhost:5000 in your browser")
    print("2. Or open weather_places_ui.html directly")
    print("3. Try entering a city name and clicking 'Fetch'")

if __name__ == "__main__":
    print("Make sure the backend is running:")
    print("python backend_api.py")
    print("\nWaiting 2 seconds before testing...")
    time.sleep(2)
    test_backend()
