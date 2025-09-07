# 🚀 CryptoNova – AI-Powered Cryptocurrency Price Prediction

CryptoNova is an AI/ML-driven project that predicts cryptocurrency prices using both Machine Learning (Linear Regression, Random Forest) and Deep Learning (LSTM).  

## 📂 Project Structure
- `backend/` → FastAPI backend for serving predictions
- `colab/` → Model training notebooks
- `docs/` → Reports, diagrams, SRS, and presentation

## ⚙️ Tech Stack
- **Backend**: FastAPI, Uvicorn
- **ML/DL**: Scikit-learn, TensorFlow
- **Data Source**: CoinGecko API
- **Visualization**: Matplotlib

## 🚀 How to Run
```bash
# Clone repo
git clone https://github.com/YOUR-USERNAME/CryptoNova.git
cd CryptoNova/backend

# Install dependencies
pip install -r requirements.txt

# Run server
python -m uvicorn app:app --reload

