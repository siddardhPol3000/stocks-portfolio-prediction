
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StockCard from "@/components/StockCard";
import StockChart from "@/components/StockChart";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getHistoricalData, getPopularStocks, getIndianPopularStocks, searchStock, formatChartData, ChartDataPoint } from "@/lib/api";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeMarket, setActiveMarket] = useState<"US" | "India">("US");

  // Fetch popular stocks based on active market
  const {
    data: popularStocks,
    isLoading: isLoadingPopular,
    error: popularError,
  } = useQuery({
    queryKey: ["popularStocks", activeMarket],
    queryFn: () => activeMarket === "US" ? getPopularStocks() : getIndianPopularStocks(),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Fetch historical data for selected stock
  const {
    data: historicalData,
    isLoading: isLoadingHistorical,
    error: historicalError,
  } = useQuery({
    queryKey: ["historicalData", selectedStock],
    queryFn: () => getHistoricalData(selectedStock),
    enabled: !!selectedStock,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Handle stock selection
  const handleSelectStock = (symbol: string) => {
    setSelectedStock(symbol);
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a stock symbol or name");
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchStock(searchQuery);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast.info("No stocks found. Try a different search term.");
      } else if (results.length === 1) {
        // If only one result, auto-select it
        setSelectedStock(results[0].symbol);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search for stocks. Using mock data instead.");
    } finally {
      setIsSearching(false);
    }
  };

  // Format chart data
  const chartData: ChartDataPoint[] = historicalData ? formatChartData(historicalData) : [];

  // Navigate to prediction page
  const navigateToPrediction = () => {
    if (selectedStock) {
      navigate(`/predict?symbol=${selectedStock}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Stock Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor stock performance and analyze historical data
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks by symbol or company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? <LoadingSpinner size="sm" /> : "Search"}
          </Button>
        </div>
      </div>

      {/* Market Selection */}
      <div className="mb-6">
        <Tabs defaultValue={activeMarket} onValueChange={(value) => setActiveMarket(value as "US" | "India")}>
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="US" className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> US Market (USD)
            </TabsTrigger>
            <TabsTrigger value="India" className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> Indian Market (INR)
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Stocks List */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Search Results</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {searchResults.map((stock) => (
                  <StockCard
                    key={stock.symbol}
                    symbol={stock.symbol}
                    name={stock.name}
                    price={stock.price}
                    change={stock.change}
                    changePercent={stock.changePercent}
                    currency={stock.currency || (stock.symbol.includes(".BSE") ? "INR" : "USD")}
                    onClick={() => handleSelectStock(stock.symbol)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Popular Stocks */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {activeMarket === "US" ? "Popular US Stocks" : "Popular Indian Stocks"}
            </h2>
            
            {isLoadingPopular ? (
              <div className="flex justify-center p-8">
                <LoadingSpinner />
              </div>
            ) : popularError ? (
              <div className="text-center p-8 text-muted-foreground">
                Unable to load popular stocks. Please try again later.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {popularStocks?.map((stock) => (
                  <StockCard
                    key={stock.symbol}
                    symbol={stock.symbol}
                    name={stock.name}
                    price={stock.price}
                    change={stock.change}
                    changePercent={stock.changePercent}
                    currency={stock.currency || (stock.symbol.includes(".BSE") ? "INR" : "USD")}
                    onClick={() => handleSelectStock(stock.symbol)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chart and Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedStock ? (
            <>
              <StockChart
                data={chartData}
                symbol={selectedStock}
                isLoading={isLoadingHistorical}
                currency={selectedStock.includes(".BSE") ? "INR" : "USD"}
              />
              
              <div className="flex justify-end">
                <Button onClick={navigateToPrediction}>
                  Generate Price Prediction
                </Button>
              </div>
            </>
          ) : (
            <div className="bg-card rounded-lg border border-border h-[400px] flex items-center justify-center p-6 text-center">
              <div className="max-w-md">
                <h3 className="text-xl font-medium mb-2">No Stock Selected</h3>
                <p className="text-muted-foreground mb-6">
                  Select a stock from the list or search for a specific stock to view its historical data and chart.
                </p>
                {searchQuery && (
                  <Button onClick={handleSearch}>
                    Search for "{searchQuery}"
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
