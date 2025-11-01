#!/usr/bin/env python3
"""
Startup script for Heat Health Assistant
"""

import subprocess
import sys
import time
import webbrowser
from pathlib import Path

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = ['flask', 'flask_cors', 'requests', 'google.generativeai', 'colorama']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("❌ Missing required packages:")
        for package in missing_packages:
            print(f"   - {package}")
        print("\nInstall them with:")
        print("pip install -r requirements.txt")
        return False
    
    print("✅ All required packages are installed")
    return True

def start_backend():
    """Start the Flask backend server"""
    print("🚀 Starting Heat Health Assistant Backend...")
    print("📡 API will be available at: http://localhost:5000")
    print("🌐 Frontend will be available at: http://localhost:5000")
    print("\nPress Ctrl+C to stop the server")
    print("=" * 50)
    
    try:
        subprocess.run([sys.executable, "backend_api.py"])
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped. Goodbye!")

def main():
    """Main startup function"""
    print("🌡 Heat Health Assistant - Startup Script")
    print("=" * 50)
    
    # Check if backend file exists
    if not Path("backend_api.py").exists():
        print("❌ backend_api.py not found!")
        print("Make sure you're in the correct directory.")
        return
    
    # Check dependencies
    if not check_dependencies():
        return
    
    # Check if frontend file exists
    if not Path("weather_places_ui.html").exists():
        print("❌ weather_places_ui.html not found!")
        print("Make sure you're in the correct directory.")
        return
    
    print("✅ All files found")
    
    # Ask user what they want to do
    print("\nWhat would you like to do?")
    print("1. Start the backend server (recommended)")
    print("2. Open frontend only (HTML file)")
    print("3. Run backend tests")
    
    choice = input("\nEnter your choice (1-3): ").strip()
    
    if choice == "1":
        start_backend()
    elif choice == "2":
        print("🌐 Opening frontend in browser...")
        webbrowser.open("weather_places_ui.html")
        print("✅ Frontend opened! Use 'Paste JSON' to test with sample data.")
    elif choice == "3":
        print("🧪 Running backend tests...")
        try:
            subprocess.run([sys.executable, "test_backend.py"])
        except FileNotFoundError:
            print("❌ test_backend.py not found!")
    else:
        print("❌ Invalid choice. Please run the script again.")

if __name__ == "__main__":
    main()
