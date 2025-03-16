// Popular US Stocks
export const US_STOCK_SYMBOLS = [
    "AAPL", // Apple
    "MSFT", // Microsoft
    "GOOGL", // Alphabet (Google)
    "AMZN", // Amazon
    "META", // Meta (Facebook)
    "TSLA", // Tesla
    "NVDA", // NVIDIA
    "JPM",  // JPMorgan Chase
    "JNJ",  // Johnson & Johnson
    "V",    // Visa
    "PG",   // Procter & Gamble
    "UNH",  // UnitedHealth Group
    "HD",   // Home Depot
    "BAC",  // Bank of America
    "XOM",  // Exxon Mobil
    "DIS",  // Disney
    "NFLX", // Netflix
    "ADBE", // Adobe
    "CSCO", // Cisco
    "CRM",  // Salesforce
    // Add more symbols as needed
  ];
  
  // Popular Indian Stocks (BSE)
  export const INDIA_STOCK_SYMBOLS = [
    "RELIANCE.BSE", // Reliance Industries
    "TCS.BSE",      // Tata Consultancy Services
    "HDFCBANK.BSE", // HDFC Bank
    "INFY.BSE",     // Infosys
    "HINDUNILVR.BSE", // Hindustan Unilever
    "ICICIBANK.BSE", // ICICI Bank
    "BHARTIARTL.BSE", // Bharti Airtel
    "KOTAKBANK.BSE", // Kotak Mahindra Bank
    "ITC.BSE",      // ITC Limited
    "SBIN.BSE",     // State Bank of India
    "BAJFINANCE.BSE", // Bajaj Finance
    "AXISBANK.BSE", // Axis Bank
    "LT.BSE",       // Larsen & Toubro
    "ASIANPAINT.BSE", // Asian Paints
    "MARUTI.BSE",   // Maruti Suzuki
    "TATAMOTORS.BSE", // Tata Motors
    "SUNPHARMA.BSE", // Sun Pharmaceutical
    "WIPRO.BSE",    // Wipro
    "HCLTECH.BSE",  // HCL Technologies
    "ULTRACEMCO.BSE", // UltraTech Cement
    "ADANIENT.BSE", // Adani Enterprises
    "TATASTEEL.BSE", // Tata Steel
    // Add more symbols as needed
  ];
  
  // Combined list of all valid stock symbols
  export const ALL_STOCK_SYMBOLS = [...US_STOCK_SYMBOLS, ...INDIA_STOCK_SYMBOLS];
  
  // Function to check if a symbol is valid
  export const isValidStockSymbol = (symbol: string): boolean => {
    return ALL_STOCK_SYMBOLS.includes(symbol.toUpperCase());
  };
  