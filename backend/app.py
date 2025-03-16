
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import yfinance as yf
from model import LSTMModel
from datetime import datetime, timedelta
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the LSTM model
lstm_model = LSTMModel()

# Popular stocks for demo
POPULAR_STOCKS = [
    {"symbol": "AAPL", "name": "Apple Inc."},
    {"symbol": "MSFT", "name": "Microsoft Corporation"},
    {"symbol": "GOOGL", "name": "Alphabet Inc."},
    {"symbol": "AMZN", "name": "Amazon.com Inc."},
    {"symbol": "TSLA", "name": "Tesla, Inc."},
    {"symbol": "META", "name": "Meta Platforms, Inc."},
    {"symbol": "NVDA", "name": "NVIDIA Corporation"},
    {"symbol": "JPM", "name": "JPMorgan Chase & Co."},
]

# Sample stocks for search
SAMPLE_STOCKS = POPULAR_STOCKS + [
    {"symbol": "DIS", "name": "The Walt Disney Company"},
    {"symbol": "NFLX", "name": "Netflix, Inc."},
    {"symbol": "PEP", "name": "PepsiCo, Inc."},
    {"symbol": "KO", "name": "The Coca-Cola Company"},
    {"symbol": "WMT", "name": "Walmart Inc."},
    {"symbol": "SBUX", "name": "Starbucks Corporation"},
    {"symbol": "MCD", "name": "McDonald's Corporation"},
    {"symbol": "NKE", "name": "Nike, Inc."},
]

def fetch_stock_data(symbol, period="1y"):
    """Fetch historical stock data from Yahoo Finance"""
    try:
        stock = yf.Ticker(symbol)
        df = stock.history(period=period)
        
        if df.empty:
            logger.warning(f"No data found for symbol: {symbol}")
            return None
            
        # Get the latest price info
        info = stock.info
        
        return {
            "data": df,
            "info": info
        }
    except Exception as e:
        logger.error(f"Error fetching data for {symbol}: {str(e)}")
        return None

def prepare_stock_info(stock_data):
    """Prepare stock info with current price and change"""
    df = stock_data["data"]
    info = stock_data["info"]
    
    # Calculate daily change
    if len(df) > 1:
        latest_close = df['Close'].iloc[-1]
        prev_close = df['Close'].iloc[-2]
        change = latest_close - prev_close
        change_percent = (change / prev_close) * 100
    else:
        latest_close = df['Close'].iloc[-1] if not df.empty else 0
        change = 0
        change_percent = 0
    
    return {
        "symbol": info.get("symbol", ""),
        "name": info.get("shortName", ""),
        "price": latest_close,
        "change": float(change),
        "changePercent": float(change_percent)
    }

@app.route('/api/historical/<symbol>', methods=['GET'])
def get_historical_data(symbol):
    """Get historical stock data"""
    try:
        stock_data = fetch_stock_data(symbol)
        
        if not stock_data:
            return jsonify({"error": f"No data found for {symbol}"}), 404
            
        df = stock_data["data"]
        
        # Format data for frontend
        result = []
        for index, row in df.iterrows():
            result.append({
                "date": index.strftime('%Y-%m-%d'),
                "open": float(row['Open']),
                "high": float(row['High']),
                "low": float(row['Low']),
                "close": float(row['Close']),
                "volume": int(row['Volume'])
            })
            
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in historical data endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/predict/<symbol>', methods=['POST'])
def predict_stock(symbol):
    """Generate stock price predictions using LSTM model"""
    try:
        days = int(request.args.get('days', 7))
        
        # Limit prediction days to prevent excessive computation
        if days > 30:
            days = 30
            
        stock_data = fetch_stock_data(symbol)
        
        if not stock_data:
            return jsonify({"error": f"No data found for {symbol}"}), 404
            
        df = stock_data["data"]
        
        # Ensure we have enough historical data
        if len(df) < 60:  # Need at least 60 days for reliable predictions
            return jsonify({"error": "Not enough historical data for prediction"}), 400
            
        # Train the model with historical closing prices
        closing_prices = df['Close'].values
        lstm_model.train(closing_prices)
        
        # Generate predictions
        predictions = lstm_model.predict(days)
        
        # Generate dates for predictions
        last_date = df.index[-1]
        dates = [(last_date + timedelta(days=i+1)).strftime('%Y-%m-%d') for i in range(days)]
        
        # Format result
        result = []
        for i in range(days):
            result.append({
                "date": dates[i],
                "prediction": float(predictions[i])
            })
            
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in prediction endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/popular-stocks', methods=['GET'])
def get_popular_stocks():
    """Get a list of popular stocks with current prices"""
    try:
        results = []
        
        for stock in POPULAR_STOCKS:
            symbol = stock["symbol"]
            stock_data = fetch_stock_data(symbol, period="5d")
            
            if stock_data:
                stock_info = prepare_stock_info(stock_data)
                results.append(stock_info)
        
        return jsonify(results)
        
    except Exception as e:
        logger.error(f"Error in popular stocks endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/search', methods=['GET'])
def search_stocks():
    """Search for stocks by symbol or name"""
    try:
        query = request.args.get('q', '').upper()
        
        if not query or len(query) < 1:
            return jsonify([])
            
        # For demo purposes, we'll search our sample stock list
        results = []
        for stock in SAMPLE_STOCKS:
            if (query in stock["symbol"].upper() or 
                query in stock["name"].upper()):
                
                stock_data = fetch_stock_data(stock["symbol"], period="5d")
                
                if stock_data:
                    stock_info = prepare_stock_info(stock_data)
                    results.append(stock_info)
                
                # Limit to 5 results
                if len(results) >= 5:
                    break
        
        return jsonify(results)
        
    except Exception as e:
        logger.error(f"Error in search endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
