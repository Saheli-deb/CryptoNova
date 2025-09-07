@echo off
echo Starting ML Backend for Crypto Predictions...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

echo Python found. Starting backend...
echo.

REM Change to the ml_models directory
cd /d "%~dp0"

REM Start the backend
python start_backend.py

echo.
echo Backend stopped. Press any key to exit...
pause >nul

