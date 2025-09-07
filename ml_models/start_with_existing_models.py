#!/usr/bin/env python3
"""
Startup script for ML Backend with existing trained models
This script will:
1. Check if required packages are installed (excluding TensorFlow)
2. Load existing trained models
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
    """Check and install required packages (excluding TensorFlow)"""
    required_packages = [
        'flask',
        'flask-cors',
        'numpy',
        'pandas',
        'scikit-learn',
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
        print(f"❌ Models directory '{models_dir}' not found!")
        print("Please create the directory and place your trained models there:")
        print(f"  {models_dir}/")
        print("  ├── lstm_model.h5")
        print("  ├── linear_regression_model.pkl")
        print("  └── random_forest_model.pkl")
        return False
    
    missing_models = []
    for model in required_models:
        model_path = os.path.join(models_dir, model)
        if not os.path.exists(model_path):
            missing_models.append(model)
    
    if missing_models:
        print(f"❌ Missing model files: {', '.join(missing_models)}")
        print(f"Please place all required model files in the '{models_dir}/' directory")
        return False
    
    print("✅ All required models found!")
    return True

def start_server():
    """Start the Flask server"""
    print("Starting Flask server...")
    try:
        from app import app
        print("🌐 Starting web server on http://localhost:5000")
        app.run(debug=True, host='0.0.0.0', port=5000)
    except Exception as e:
        print(f"Error starting server: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure your model files are in the 'trained_models/' directory")
        print("2. Check that model file names match exactly:")
        print("   - lstm_model.h5")
        print("   - linear_regression_model.pkl")
        print("   - random_forest_model.pkl")

def main():
    """Main startup function"""
    print("🚀 Starting ML Backend with existing models...")
    
    # Check and install requirements (excluding TensorFlow)
    if not check_and_install_requirements():
        print("❌ Failed to install required packages. Exiting.")
        return
    
    # Check if models exist
    if not check_models_exist():
        print("❌ Models not found. Please place your trained models in the 'trained_models/' directory.")
        print("\nExpected file structure:")
        print("trained_models/")
        print("├── lstm_model.h5")
        print("├── linear_regression_model.pkl")
        print("└── random_forest_model.pkl")
        return
    
    # Start the server
    start_server()

if __name__ == "__main__":
    main()

