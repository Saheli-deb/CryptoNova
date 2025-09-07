#!/usr/bin/env python3
"""
Startup script for the ML Backend
This script will:
1. Check if required packages are installed
2. Train models if they don't exist
3. Start the Flask server
"""

import os
import sys
import subprocess
import importlib.util

def check_package(package_name):
    """Check if a package is installed"""
    spec = importlib.util.find_spec(package_name)
    return spec is not None

def install_package(package_name):
    """Install a package using pip"""
    print(f"Installing {package_name}...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package_name])
        return True
    except subprocess.CalledProcessError:
        print(f"Failed to install {package_name}")
        return False

def check_and_install_requirements():
    """Check and install required packages"""
    required_packages = [
        'flask',
        'flask-cors',
        'numpy',
        'pandas',
        'scikit-learn',
        'tensorflow',
        'keras',
        'joblib',
        'requests'
    ]
    
    missing_packages = []
    for package in required_packages:
        if not check_package(package):
            missing_packages.append(package)
    
    if missing_packages:
        print("Missing packages detected. Installing...")
        for package in missing_packages:
            if not install_package(package):
                print(f"Failed to install {package}. Please install manually.")
                return False
    
    print("All required packages are installed.")
    return True

def check_models_exist():
    """Check if trained models exist"""
    models_dir = 'trained_models'
    required_models = [
        'lstm_model.h5',
        'linear_regression_model.pkl',
        'random_forest_model.pkl'
    ]
    
    if not os.path.exists(models_dir):
        return False
    
    for model in required_models:
        if not os.path.exists(os.path.join(models_dir, model)):
            return False
    
    return True

def train_models():
    """Train the ML models"""
    print("Training models...")
    try:
        from train_models import main as train_main
        train_main()
        return True
    except Exception as e:
        print(f"Error training models: {e}")
        return False

def start_server():
    """Start the Flask server"""
    print("Starting Flask server...")
    try:
        from app import app
        app.run(debug=True, host='0.0.0.0', port=5000)
    except Exception as e:
        print(f"Error starting server: {e}")

def main():
    """Main startup function"""
    print("Starting ML Backend...")
    
    # Check and install requirements
    if not check_and_install_requirements():
        print("❌ Failed to install required packages. Exiting.")
        return
    
    # Check if models exist, train if they don't
    if not check_models_exist():
        print("Models not found. Training new models...")
        if not train_models():
            print("Failed to train models. Exiting.")
            return
        print("Models trained successfully!")
    else:
        print("Models found. Skipping training.")
    
    # Start the server
    print("Starting web server on http://localhost:5000")
    start_server()

if __name__ == "__main__":
    main()

