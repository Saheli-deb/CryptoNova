# ML Backend for Crypto Predictions

This directory contains the machine learning backend that provides cryptocurrency price predictions using three different models:

- **LSTM Neural Network** - Deep learning model for time series prediction
- **Random Forest Regressor** - Ensemble learning model
- **Linear Regression** - Simple linear model for baseline predictions

## Features

- Real-time cryptocurrency data fetching from CoinGecko API
- Technical indicators calculation (RSI, MACD, Bollinger Bands)
- Feature engineering for ML models
- RESTful API endpoints for predictions
- Automatic model training and saving
- CORS support for frontend integration

## Quick Start

### Option 1: Automatic Setup (Recommended)

```bash
cd ml_models
python start_backend.py
```

This script will:
1. Check and install required packages
2. Train models if they don't exist
3. Start the Flask server on port 5000

### Option 2: Manual Setup

1. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

2. **Train the models:**
```bash
python train_models.py
```

3. **Start the server:**
```bash
python app.py
```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns the health status and which models are loaded.

### Model Status
```
GET /api/models/status
```
Returns detailed information about each model's status and accuracy.

### Get Predictions
```
POST /api/predict
```
Body:
```json
{
  "symbol": "bitcoin",
  "timeframe": 7
}
```

Returns predictions from all available models and future price forecasts.

## Model Training

The models are trained on historical cryptocurrency data with the following features:

- **Price-based features:**
  - Current price
  - Price change percentage
  - Moving averages (7, 14, 30 days)
  - Volatility

- **Technical indicators:**
  - RSI (Relative Strength Index)
  - MACD (Moving Average Convergence Divergence)
  - Bollinger Bands

- **Volume features:**
  - Volume moving average
  - Volume ratio

## File Structure

```
ml_models/
├── app.py                 # Main Flask application
├── train_models.py        # Model training script
├── start_backend.py       # Automatic startup script
├── requirements.txt       # Python dependencies
├── README.md             # This file
└── trained_models/       # Directory for saved models
    ├── lstm_model.h5
    ├── linear_regression_model.pkl
    ├── random_forest_model.pkl
    └── *_scaler.pkl      # Feature scalers
```

## Configuration

### Environment Variables

You can set the following environment variables:

- `VITE_ML_API_URL` - Frontend environment variable for ML API URL (default: http://localhost:5000)

### Model Parameters

You can modify model parameters in `train_models.py`:

- **LSTM:** Layers, units, dropout rate, epochs
- **Random Forest:** Number of estimators, max depth
- **Feature Engineering:** Lookback period, technical indicator parameters

## Troubleshooting

### Common Issues

1. **Port 5000 already in use:**
   - Change the port in `app.py` or kill the process using the port

2. **Models fail to load:**
   - Ensure models are trained first using `train_models.py`
   - Check that all required files exist in `trained_models/` directory

3. **API requests fail:**
   - Verify the Flask server is running
   - Check CORS configuration
   - Ensure frontend is making requests to the correct URL

4. **Training takes too long:**
   - Reduce the number of epochs in LSTM training
   - Use smaller datasets for testing
   - Consider using GPU acceleration for TensorFlow

### Performance Optimization

- **GPU Acceleration:** Install TensorFlow-GPU for faster LSTM training
- **Model Caching:** Models are loaded once and cached in memory
- **Async Processing:** Consider implementing async prediction endpoints for high load

## Development

### Adding New Models

1. Create a new training function in `train_models.py`
2. Add model loading logic in `app.py`
3. Update the prediction endpoint to include the new model
4. Add model status information

### Extending Features

1. Add new technical indicators in the feature engineering functions
2. Implement additional data sources beyond CoinGecko
3. Add model ensemble methods for better predictions
4. Implement confidence scoring algorithms

## Security Considerations

- The current implementation is for development/demo purposes
- In production, consider:
  - API rate limiting
  - Authentication and authorization
  - Input validation and sanitization
  - HTTPS enforcement
  - Model versioning and rollback

## License

This project is part of the CryptoNova Dashboard visualization system.

