import numpy as np
import pandas as pd
import joblib
import os
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import requests
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

def fetch_crypto_data(symbol='bitcoin', days=365):
    """Fetch cryptocurrency data from CoinGecko API"""
    print(f"Fetching {days} days of {symbol} data...")
    
    try:
        url = f"https://api.coingecko.com/api/v3/coins/{symbol}/market_chart"
        params = {
            'vs_currency': 'usd',
            'days': days,
            'interval': 'daily'
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        prices = data['prices']
        
        # Convert to DataFrame
        df = pd.DataFrame(prices, columns=['timestamp', 'price'])
        df['date'] = pd.to_datetime(df['timestamp'], unit='ms')
        df = df.drop('timestamp', axis=1)
        
        print(f"Successfully fetched {len(df)} data points")
        return df
        
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

def prepare_features(df, lookback=10):
    """Prepare features for model training"""
    print("Preparing features...")
    
    # Price-based features
    df['price_change'] = df['price'].pct_change()
    df['price_ma_7'] = df['price'].rolling(window=7).mean()
    df['price_ma_14'] = df['price'].rolling(window=14).mean()
    df['price_ma_20'] = df['price'].rolling(window=20).mean()
    df['price_ma_30'] = df['price'].rolling(window=30).mean()
    df['volatility'] = df['price_change'].rolling(window=7).std()
    
    # Technical indicators
    df['rsi'] = calculate_rsi(df['price'], window=14)
    df['macd'] = calculate_macd(df['price'])
    df['bollinger_upper'] = df['price_ma_20'] + (df['price'].rolling(window=20).std() * 2)
    df['bollinger_lower'] = df['price_ma_20'] - (df['price'].rolling(window=20).std() * 2)
    
    # Volume features (if available)
    if 'volume' in df.columns:
        df['volume_ma'] = df['volume'].rolling(window=7).mean()
        df['volume_ratio'] = df['volume'] / df['volume_ma']
    else:
        df['volume_ma'] = 1
        df['volume_ratio'] = 1
    
    # Target variable (next day's price)
    df['target'] = df['price'].shift(-1)
    
    # Remove NaN values
    df = df.dropna()
    
    if len(df) < lookback + 1:
        print("Insufficient data for training")
        return None, None
    
    # Create sequences for LSTM
    X_lstm = []
    y_lstm = []
    
    for i in range(lookback, len(df) - 1):
        feature_sequence = df.iloc[i-lookback:i][['price', 'price_change', 'price_ma_7', 'price_ma_14', 'price_ma_20', 'price_ma_30', 'volatility', 'rsi', 'macd', 'bollinger_upper', 'bollinger_lower', 'volume_ratio']].values
        X_lstm.append(feature_sequence)
        y_lstm.append(df.iloc[i]['target'])
    
    X_lstm = np.array(X_lstm)
    y_lstm = np.array(y_lstm)
    
    # Create features for sklearn models
    feature_columns = ['price', 'price_change', 'price_ma_7', 'price_ma_14', 'price_ma_20', 'price_ma_30', 'volatility', 'rsi', 'macd', 'bollinger_upper', 'bollinger_lower', 'volume_ratio']
    X_sklearn = df[feature_columns].values[:-1]  # Remove last row since target is shifted
    y_sklearn = df['target'].values[:-1]
    
    print(f"Features prepared: LSTM shape {X_lstm.shape}, Sklearn shape {X_sklearn.shape}")
    return (X_lstm, y_lstm), (X_sklearn, y_sklearn)

def calculate_rsi(prices, window=14):
    """Calculate RSI technical indicator"""
    delta = prices.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

def calculate_macd(prices, fast=12, slow=26, signal=9):
    """Calculate MACD technical indicator"""
    ema_fast = prices.ewm(span=fast).mean()
    ema_slow = prices.ewm(span=slow).mean()
    macd = ema_fast - ema_slow
    signal_line = macd.ewm(span=signal).mean()
    return macd - signal_line

def train_lstm_model(X_train, y_train, X_val, y_val):
    """Train LSTM model"""
    print("Training LSTM model...")
    
    model = Sequential([
        LSTM(50, return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2])),
        Dropout(0.2),
        LSTM(50, return_sequences=False),
        Dropout(0.2),
        Dense(25),
        Dense(1)
    ])
    
    model.compile(optimizer='adam', loss='mse', metrics=['mae'])
    
    # Early stopping to prevent overfitting
    early_stopping = keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=10,
        restore_best_weights=True
    )
    
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=100,
        batch_size=32,
        callbacks=[early_stopping],
        verbose=1
    )
    
    # Evaluate model
    val_loss, val_mae = model.evaluate(X_val, y_val, verbose=0)
    print(f"LSTM Validation Loss: {val_loss:.4f}, MAE: {val_mae:.4f}")
    
    return model

def train_linear_regression(X_train, y_train, X_val, y_val):
    """Train Linear Regression model"""
    print("Training Linear Regression model...")
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_val_scaled = scaler.transform(X_val)
    
    model = LinearRegression()
    model.fit(X_train_scaled, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_val_scaled)
    mse = mean_squared_error(y_val, y_pred)
    r2 = r2_score(y_val, y_pred)
    
    print(f"Linear Regression MSE: {mse:.4f}, R²: {r2:.4f}")
    
    return model, scaler

def train_random_forest(X_train, y_train, X_val, y_val):
    """Train Random Forest model"""
    print("Training Random Forest model...")
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_val_scaled = scaler.transform(X_val)
    
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train_scaled, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_val_scaled)
    mse = mean_squared_error(y_val, y_pred)
    r2 = r2_score(y_val, y_pred)
    
    print(f"Random Forest MSE: {mse:.4f}, R²: {r2:.4f}")
    
    return model, scaler

def save_models(lstm_model, lr_model, lr_scaler, rf_model, rf_scaler):
    """Save all trained models"""
    print("Saving models...")
    
    # Create models directory if it doesn't exist
    models_dir = 'trained_models'
    os.makedirs(models_dir, exist_ok=True)
    
    # Save LSTM model
    if lstm_model:
        lstm_model.save(os.path.join(models_dir, 'lstm_model.h5'))
        print("LSTM model saved")
    
    # Save Linear Regression model and scaler
    if lr_model and lr_scaler:
        joblib.dump(lr_model, os.path.join(models_dir, 'linear_regression_model.pkl'))
        joblib.dump(lr_scaler, os.path.join(models_dir, 'linear_regression_scaler.pkl'))
        print("Linear Regression model and scaler saved")
    
    # Save Random Forest model and scaler
    if rf_model and rf_scaler:
        joblib.dump(rf_model, os.path.join(models_dir, 'random_forest_model.pkl'))
        joblib.dump(rf_scaler, os.path.join(models_dir, 'random_forest_scaler.pkl'))
        print("Random Forest model and scaler saved")

def main():
    """Main training function"""
    print("Starting model training...")
    
    # Fetch data
    df = fetch_crypto_data('bitcoin', days=365)
    if df is None:
        print("Failed to fetch data. Exiting.")
        return
    
    # Prepare features
    (X_lstm, y_lstm), (X_sklearn, y_sklearn) = prepare_features(df)
    if X_lstm is None:
        print("Failed to prepare features. Exiting.")
        return
    
    # Split data for LSTM
    split_idx = int(len(X_lstm) * 0.8)
    X_lstm_train, X_lstm_val = X_lstm[:split_idx], X_lstm[split_idx:]
    y_lstm_train, y_lstm_val = y_lstm[:split_idx], y_lstm[split_idx:]
    
    # Split data for sklearn models
    X_train, X_val, y_train, y_val = train_test_split(
        X_sklearn, y_sklearn, test_size=0.2, random_state=42
    )
    
    print(f"Training set sizes: LSTM {len(X_lstm_train)}, Sklearn {len(X_train)}")
    
    # Train models
    try:
        # Train LSTM
        lstm_model = train_lstm_model(X_lstm_train, y_lstm_train, X_lstm_val, y_lstm_val)
        
        # Train Linear Regression
        lr_model, lr_scaler = train_linear_regression(X_train, y_train, X_val, y_val)
        
        # Train Random Forest
        rf_model, rf_scaler = train_random_forest(X_train, y_train, X_val, y_val)
        
        # Save all models
        save_models(lstm_model, lr_model, lr_scaler, rf_model, rf_scaler)
        
        print("All models trained and saved successfully!")
        
    except Exception as e:
        print(f"Error during training: {e}")

if __name__ == "__main__":
    main()

