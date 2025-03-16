
import { toast } from "sonner";

// Configure API URLs
const API_URL = "http://localhost:5000";
const ALPHA_VANTAGE_API_URL = "https://www.alphavantage.co/query";
const ALPHA_VANTAGE_API_KEY = "XY3W2TUNOD1WUJ0A";

// Set this to true to use mock data instead of real API
const USE_MOCK_DATA = true;

interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface PredictionData {
  date: string;
  prediction: number;
}

export interface StockInfo {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency?: string;
  market?: string;
}

// Define a more flexible chart data type that can include prediction data
export interface ChartDataPoint {
  date: string;
  actual?: number;
  predicted?: number;
}

// Mock data for development and demonstration
const MOCK_POPULAR_STOCKS: StockInfo[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 175.25, change: 2.35, changePercent: 1.36, currency: "USD", market: "US" },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 325.80, change: 1.15, changePercent: 0.35, currency: "USD", market: "US" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 135.60, change: -0.75, changePercent: -0.55, currency: "USD", market: "US" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 142.20, change: 3.45, changePercent: 2.48, currency: "USD", market: "US" },
  { symbol: "TSLA", name: "Tesla, Inc.", price: 230.15, change: -5.30, changePercent: -2.25, currency: "USD", market: "US" },
  { symbol: "META", name: "Meta Platforms, Inc.", price: 298.65, change: 4.20, changePercent: 1.43, currency: "USD", market: "US" },
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 720.35, change: 15.60, changePercent: 2.21, currency: "USD", market: "US" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", price: 158.75, change: 0.95, changePercent: 0.60, currency: "USD", market: "US" },
];

// Mock Indian stocks data
const MOCK_INDIAN_STOCKS: StockInfo[] = [
  { symbol: "RELIANCE.BSE", name: "Reliance Industries", price: 2456.75, change: 32.50, changePercent: 1.34, currency: "INR", market: "India" },
  { symbol: "TCS.BSE", name: "Tata Consultancy Services", price: 3578.20, change: -45.30, changePercent: -1.25, currency: "INR", market: "India" },
  { symbol: "HDFCBANK.BSE", name: "HDFC Bank", price: 1675.40, change: 23.75, changePercent: 1.44, currency: "INR", market: "India" },
  { symbol: "INFY.BSE", name: "Infosys", price: 1520.85, change: 18.30, changePercent: 1.22, currency: "INR", market: "India" },
  { symbol: "HINDUNILVR.BSE", name: "Hindustan Unilever", price: 2480.60, change: -12.35, changePercent: -0.50, currency: "INR", market: "India" },
  { symbol: "TATAMOTORS.BSE", name: "Tata Motors", price: 765.25, change: 21.40, changePercent: 2.88, currency: "INR", market: "India" },
];

// Generate mock historical data
const generateMockHistorical = (symbol: string): StockData[] => {
  const data: StockData[] = [];
  const isIndianStock = symbol.includes(".BSE");
  const stockList = isIndianStock ? MOCK_INDIAN_STOCKS : MOCK_POPULAR_STOCKS;
  const basePrice = stockList.find(stock => stock.symbol === symbol)?.price || 100;
  const volatility = 0.02; // 2% daily volatility
  
  const today = new Date();
  let currentPrice = basePrice;
  
  // Generate 90 days of historical data
  for (let i = 90; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Random daily change with volatility
    const change = currentPrice * volatility * (Math.random() - 0.5) * 2;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + (currentPrice * volatility * Math.random());
    const low = Math.min(open, close) - (currentPrice * volatility * Math.random());
    const volume = Math.floor(Math.random() * 10000000) + 1000000;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume,
    });
    
    currentPrice = close;
  }
  
  return data;
};

// Generate mock prediction data
const generateMockPrediction = (symbol: string, days: number): PredictionData[] => {
  const mockHistorical = generateMockHistorical(symbol);
  const lastDay = mockHistorical[mockHistorical.length - 1];
  const predictions: PredictionData[] = [];
  
  let currentPrice = lastDay.close;
  const today = new Date();
  const trend = Math.random() > 0.5 ? 1 : -1; // Random trend direction
  const volatility = 0.015; // Lower volatility for predictions
  
  for (let i = 1; i <= days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Add a slight trend with random noise
    const change = currentPrice * volatility * (Math.random() - 0.3) * 2 + (currentPrice * 0.002 * trend);
    currentPrice += change;
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      prediction: currentPrice,
    });
  }
  
  return predictions;
};

// Search mock stocks
const searchMockStocks = (query: string): StockInfo[] => {
  const allStocks = [...MOCK_POPULAR_STOCKS, ...MOCK_INDIAN_STOCKS];
  const results = allStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(query.toLowerCase()) || 
    stock.name.toLowerCase().includes(query.toLowerCase())
  );
  return results.slice(0, 5); // Return max 5 results
};

// Helper function to handle API errors
const handleApiError = (error: any, customMessage?: string) => {
  console.error("API Error:", error);
  const errorMessage = customMessage || "An error occurred. Please try again later.";
  toast.error(errorMessage);
  throw error;
};

// Get historical stock data
export const getHistoricalData = async (symbol: string): Promise<StockData[]> => {
  if (USE_MOCK_DATA) {
    // Add a small delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateMockHistorical(symbol);
  }
  
  try {
    // Check if it's an Indian stock
    if (symbol.includes(".BSE")) {
      // Use Alpha Vantage API for Indian stocks
      const url = `${ALPHA_VANTAGE_API_URL}?function=TIME_SERIES_DAILY&symbol=${symbol.replace('.BSE', '.BSE')}&outputsize=full&apikey=${ALPHA_VANTAGE_API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check if we received valid data
      if (data['Error Message'] || !data['Time Series (Daily)']) {
        console.warn("Alpha Vantage API returned an error or no data, using mock data instead");
        return generateMockHistorical(symbol);
      }
      
      // Transform Alpha Vantage data to our format
      const timeSeriesData = data['Time Series (Daily)'];
      const formattedData: StockData[] = Object.keys(timeSeriesData)
        .slice(0, 90) // Get last 90 days
        .map(date => ({
          date,
          open: parseFloat(timeSeriesData[date]['1. open']),
          high: parseFloat(timeSeriesData[date]['2. high']),
          low: parseFloat(timeSeriesData[date]['3. low']),
          close: parseFloat(timeSeriesData[date]['4. close']),
          volume: parseInt(timeSeriesData[date]['5. volume']),
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date ascending
      
      return formattedData;
    } else {
      // Use original API for US stocks
      const response = await fetch(`${API_URL}/api/historical/${symbol}`);
      
      if (!response.ok) {
        // Fallback to mock data if API fails
        console.warn("API request failed, using mock data instead");
        return generateMockHistorical(symbol);
      }
      
      return await response.json();
    }
  } catch (error) {
    console.warn("API error, using mock data instead");
    return generateMockHistorical(symbol);
  }
};

// Get stock price prediction
export const getPrediction = async (symbol: string, days: number): Promise<PredictionData[]> => {
  if (USE_MOCK_DATA) {
    // Add a small delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    return generateMockPrediction(symbol, days);
  }
  
  try {
    const response = await fetch(`${API_URL}/api/predict/${symbol}?days=${days}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      // Fallback to mock data if API fails
      console.warn("API request failed, using mock data instead");
      return generateMockPrediction(symbol, days);
    }
    
    return await response.json();
  } catch (error) {
    console.warn("API error, using mock data instead");
    return generateMockPrediction(symbol, days);
  }
};

// Get popular stocks
export const getPopularStocks = async (): Promise<StockInfo[]> => {
  if (USE_MOCK_DATA) {
    // Add a small delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_POPULAR_STOCKS;
  }
  
  try {
    const response = await fetch(`${API_URL}/api/popular-stocks`);
    
    if (!response.ok) {
      // Fallback to mock data if API fails
      console.warn("API request failed, using mock data instead");
      return MOCK_POPULAR_STOCKS;
    }
    
    return await response.json();
  } catch (error) {
    console.warn("API error, using mock data instead");
    return MOCK_POPULAR_STOCKS;
  }
};

// Get Indian popular stocks
export const getIndianPopularStocks = async (): Promise<StockInfo[]> => {
  if (USE_MOCK_DATA) {
    // Add a small delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_INDIAN_STOCKS;
  }
  
  try {
    // In a real implementation, you would call the Alpha Vantage API here
    const stockSymbols = ["RELIANCE.BSE", "TCS.BSE", "HDFCBANK.BSE", "INFY.BSE", "HINDUNILVR.BSE", "TATAMOTORS.BSE"];
    const stocks: StockInfo[] = [];
    
    for (const symbol of stockSymbols) {
      const url = `${ALPHA_VANTAGE_API_URL}?function=GLOBAL_QUOTE&symbol=${symbol.replace('.BSE', '.BSE')}&apikey=${ALPHA_VANTAGE_API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data for ${symbol}`);
      }
      
      const data = await response.json();
      
      if (data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
        const quote = data['Global Quote'];
        stocks.push({
          symbol,
          name: symbol.split('.')[0], // Using symbol as name (would need another API call for full name)
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
          currency: "INR",
          market: "India"
        });
      }
    }
    
    return stocks.length > 0 ? stocks : MOCK_INDIAN_STOCKS;
  } catch (error) {
    console.warn("Alpha Vantage API error, using mock data instead");
    return MOCK_INDIAN_STOCKS;
  }
};

// Search for a stock
export const searchStock = async (query: string): Promise<StockInfo[]> => {
  if (USE_MOCK_DATA) {
    // Add a small delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 600));
    return searchMockStocks(query);
  }
  
  try {
    // Try to search for both US and Indian stocks
    const isIndianQuery = query.toUpperCase().includes(".BSE") || 
                         query.toLowerCase().includes("india") || 
                         query.toLowerCase().includes("bse");
                         
    if (isIndianQuery) {
      // Search using Alpha Vantage for Indian stocks
      const url = `${ALPHA_VANTAGE_API_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${ALPHA_VANTAGE_API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to search: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.bestMatches && data.bestMatches.length > 0) {
        const indianStocks = data.bestMatches
          .filter((match: any) => match['4. region'] === 'India' || match['4. region'].includes('BSE'))
          .map((match: any) => ({
            symbol: `${match['1. symbol']}.BSE`,
            name: match['2. name'],
            price: 0, // Price needs to be fetched separately
            change: 0,
            changePercent: 0,
            currency: "INR",
            market: "India"
          }));
        
        // If we found any Indian stocks, return them
        if (indianStocks.length > 0) {
          return indianStocks.slice(0, 5);
        }
      }
    }
    
    // If not an Indian query or no Indian stocks found, use the original API
    const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      // Fallback to mock data if API fails
      console.warn("API request failed, using mock data instead");
      return searchMockStocks(query);
    }
    
    return await response.json();
  } catch (error) {
    console.warn("API error, using mock data instead");
    return searchMockStocks(query);
  }
};

// Format API data for charts
export const formatChartData = (historicalData: StockData[], predictionData?: PredictionData[]): ChartDataPoint[] => {
  const chartData: ChartDataPoint[] = historicalData.map((item) => ({
    date: item.date,
    actual: item.close,
  }));

  // Add prediction data if available
  if (predictionData && predictionData.length > 0) {
    // Find the last historical data point
    const lastHistoricalDate = new Date(historicalData[historicalData.length - 1].date);
    
    // Add predictions to chart data
    predictionData.forEach((prediction) => {
      const predictionDate = new Date(prediction.date);
      
      // Only add prediction if it's after the last historical date
      if (predictionDate > lastHistoricalDate) {
        chartData.push({
          date: prediction.date,
          predicted: prediction.prediction,
        });
      } else {
        // If prediction date overlaps with historical data, add prediction to existing entry
        const existingEntry = chartData.find(item => item.date === prediction.date);
        if (existingEntry) {
          existingEntry.predicted = prediction.prediction;
        }
      }
    });
  }

  return chartData;
};
