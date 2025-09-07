#!/usr/bin/env python3
"""
Quick start script for ML Backend with existing models
This script will:
1. Install basic required packages (excluding TensorFlow)
2. Start the Flask server
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

def install_basic_requirements():
    """Install basic required packages"""
    basic_packages = [
        'flask',
        'flask-cors',
        'numpy',
        'pandas',
        'scikit-learn',
        'joblib',
        'requests'
    ]
    
    missing_packages = []
    for package in basic_packages:
        if not check_package(package):
            missing_packages.append(package)
    
    if missing_packages:
        print("Installing missing packages...")
        for package in missing_packages:
            if not install_package(package):
                print(f"Failed to install {package}. Please install manually.")
                return False
    
    print("✅ Basic packages installed successfully!")
    return True

def check_models_directory():
    """Check if models directory exists"""
    models_dir = 'trained_models'
    if not os.path.exists(models_dir):
        print(f"❌ Models directory '{models_dir}' not found!")
        print("Please create the directory and place your trained models there:")
        print(f"  {models_dir}/")
        print("  ├── lstm_model.h5")
        print("  ├── linear_regression_model.pkl")
        print("  └── random_forest_model.pkl")
        return False
    
    print(f"✅ Models directory '{models_dir}' found!")
    return True

def start_server():
    """Start the Flask server"""
    print("🚀 Starting Flask server...")
    try:
        from app_simple import app
        print("🌐 Server starting on http://localhost:5000")
        print("📊 Available endpoints:")
        print("   - GET  /api/health")
        print("   - GET  /api/models/status")
        print("   - POST /api/predict")
        print("\nPress Ctrl+C to stop the server")
        app.run(debug=True, host='0.0.0.0', port=5000)
    except ImportError as e:
        print(f"❌ Error importing app: {e}")
        print("Make sure all required packages are installed")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

def main():
    """Main startup function"""
    print("🚀 Quick Start for ML Backend with Existing Models")
    print("=" * 50)
    
    # Install basic requirements
    if not install_basic_requirements():
        print("❌ Failed to install basic packages. Exiting.")
        return
    
    # Check models directory
    if not check_models_directory():
        print("\n📁 Please create the 'trained_models' directory and place your model files there.")
        print("Then run this script again.")
        return
    
    print("\n✅ Ready to start server!")
    print("Note: LSTM model will be skipped if TensorFlow is not available")
    print("      Linear Regression and Random Forest will work without TensorFlow")
    
    # Start the server
    start_server()

if __name__ == "__main__":
    main()

