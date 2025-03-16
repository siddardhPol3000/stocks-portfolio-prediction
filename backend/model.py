
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LSTMModel:
    def __init__(self):
        self.model = None
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        self.sequence_length = 60  # Number of previous days to use for prediction
        
    def _create_sequences(self, data):
        """Create input sequences and targets for LSTM training"""
        X, y = [], []
        for i in range(len(data) - self.sequence_length):
            X.append(data[i:i + self.sequence_length])
            y.append(data[i + self.sequence_length])
        return np.array(X), np.array(y)
    
    def _build_model(self, input_shape):
        """Build the LSTM model architecture"""
        model = Sequential()
        
        # First LSTM layer with dropout
        model.add(LSTM(units=50, return_sequences=True, input_shape=input_shape))
        model.add(Dropout(0.2))
        
        # Second LSTM layer with dropout
        model.add(LSTM(units=50, return_sequences=False))
        model.add(Dropout(0.2))
        
        # Dense output layer
        model.add(Dense(units=1))
        
        # Compile the model
        model.compile(optimizer='adam', loss='mean_squared_error')
        
        return model
    
    def train(self, closing_prices, epochs=50, batch_size=32, verbose=0):
        """Train the LSTM model with historical stock data"""
        try:
            # Scale the data
            scaled_data = self.scaler.fit_transform(closing_prices.reshape(-1, 1))
            
            # Create sequences for training
            X, y = self._create_sequences(scaled_data)
            
            # Reshape X for LSTM input format [samples, time steps, features]
            X = X.reshape(X.shape[0], X.shape[1], 1)
            
            # Build and train the model
            self.model = self._build_model((X.shape[1], 1))
            
            # Train the model with early stopping
            early_stopping = tf.keras.callbacks.EarlyStopping(
                monitor='loss', patience=10, restore_best_weights=True
            )
            
            self.model.fit(
                X, y, 
                epochs=epochs, 
                batch_size=batch_size, 
                verbose=verbose,
                callbacks=[early_stopping]
            )
            
            logger.info("LSTM model training completed successfully")
            
            # Save the last sequence for prediction
            self.last_sequence = scaled_data[-self.sequence_length:]
            
        except Exception as e:
            logger.error(f"Error training LSTM model: {str(e)}")
            raise
    
    def predict(self, days_to_predict=7):
        """Generate predictions for future stock prices"""
        if self.model is None:
            raise ValueError("Model not trained. Call train() first.")
        
        try:
            # Initialize predictions array
            predictions = []
            
            # Use the last sequence from the training data as our starting point
            current_sequence = self.last_sequence.reshape(1, self.sequence_length, 1)
            
            # Generate predictions day by day
            for _ in range(days_to_predict):
                # Get prediction for next day
                next_day_scaled = self.model.predict(current_sequence)[0]
                
                # Add to predictions
                predictions.append(next_day_scaled[0])
                
                # Update sequence for next prediction
                # Remove first element and add the new prediction at the end
                current_sequence = np.append(
                    current_sequence[:, 1:, :], 
                    [[next_day_scaled]], 
                    axis=1
                )
            
            # Inverse transform to get actual price predictions
            predictions = self.scaler.inverse_transform(np.array(predictions).reshape(-1, 1))
            
            return predictions.flatten()
            
        except Exception as e:
            logger.error(f"Error generating predictions: {str(e)}")
            raise
