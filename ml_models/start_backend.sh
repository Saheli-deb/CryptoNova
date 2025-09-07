#!/bin/bash

echo "🚀 Starting ML Backend for Crypto Predictions..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed or not in PATH"
    echo "Please install Python 3.8+ and try again"
    exit 1
fi

echo "✅ Python found. Starting backend..."
echo

# Change to the ml_models directory
cd "$(dirname "$0")"

# Start the backend
python3 start_backend.py

echo
echo "Backend stopped."

