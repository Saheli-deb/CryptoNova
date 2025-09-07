export interface MLPrediction {
  symbol: string;
  current_price: number;
  predictions: {
    lstm?: number;
    linear_regression?: number;
    random_forest?: number;
  };
  confidences: {
    lstm?: number;
    linear_regression?: number;
    random_forest?: number;
  };
  future_predictions: Array<{
    date: string;
    predicted_price: number;
    confidence: number;
  }>;
  timestamp: string;
}

export interface ModelStatus {
  lstm: {
    loaded: boolean;
    type: string;
    accuracy: number;
  };
  linear_regression: {
    loaded: boolean;
    type: string;
    accuracy: number;
  };
  random_forest: {
    loaded: boolean;
    type: string;
    accuracy: number;
  };
}

export interface HealthStatus {
  status: string;
  models_loaded: {
    lstm: boolean;
    linear_regression: boolean;
    random_forest: boolean;
  };
}

class MLService {
  private baseURL: string;

  constructor() {
    // In development, the Flask backend runs on port 5000
    this.baseURL = import.meta.env.VITE_ML_API_URL || 'http://localhost:5000';
  }

  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error in ML service request to ${endpoint}:`, error);
      throw error;
    }
  }

  async getHealthStatus(): Promise<HealthStatus> {
    return this.makeRequest<HealthStatus>('/api/health');
  }

  async getModelStatus(): Promise<ModelStatus> {
    return this.makeRequest<ModelStatus>('/api/models/status');
  }

  async getPrediction(symbol: string, timeframe: number): Promise<MLPrediction> {
    const apiSymbol = this.getCryptoSymbol(symbol);
    return this.makeRequest<MLPrediction>('/api/predict', {
      method: 'POST',
      body: JSON.stringify({
        symbol: apiSymbol,
        timeframe: timeframe,
      }),
    });
  }

  // Helper method to check if the ML backend is available
  async isBackendAvailable(): Promise<boolean> {
    try {
      await this.getHealthStatus();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Method to get crypto symbol mapping for API calls
  getCryptoSymbol(symbol: string): string {
    const symbolMap: { [key: string]: string } = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'SOL': 'solana',
      'ADA': 'cardano',
      'DOT': 'polkadot',
      'LINK': 'chainlink',
      'MATIC': 'matic-network',
      'AVAX': 'avalanche-2',
      'UNI': 'uniswap',
      'ATOM': 'cosmos',
    };
    
    return symbolMap[symbol] || symbol.toLowerCase();
  }

  // Method to format predictions for the frontend
  formatPredictionsForChart(prediction: MLPrediction, days: number = 30) {
    const data = [];
    const startDate = new Date();
    const currentPrice = prediction.current_price;
    
    // Add historical data (mock for now, you can extend this)
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(startDate);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        actual: i === days - 1 ? currentPrice : null, // Only show current price
        lstm: prediction.predictions.lstm || null,
        randomForest: prediction.predictions.random_forest || null,
        linearReg: prediction.predictions.linear_regression || null,
        confidence: prediction.future_predictions[0]?.confidence || 85,
      });
    }
    
    // Add future predictions
    prediction.future_predictions.forEach((future, index) => {
      const date = new Date(future.date);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        actual: null,
        // Use backend fused forecast for now so different coins plot different curves
        lstm: future.predicted_price,
        randomForest: future.predicted_price,
        linearReg: future.predicted_price,
        confidence: future.confidence,
      });
    });
    
    return data;
  }
}

export const mlService = new MLService();
export default mlService;

