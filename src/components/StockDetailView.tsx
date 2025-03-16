
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Info, Calendar, BarChart3, Clock } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import StockChart from "./StockChart";
import { formatChartData, ChartDataPoint } from "@/lib/api";

interface StockDetailProps {
  stock: {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    currency: string;
    market: string;
    todayHigh?: number;
    todayLow?: number;
    todayOpen?: number;
    prevClose?: number;
    week52High?: number;
    week52Low?: number;
    volume?: number;
    lastUpdated?: string;
  };
}

const StockDetailView = ({ stock }: StockDetailProps) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [tab, setTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("1M");
  const [showSignals, setShowSignals] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const {
    symbol,
    name,
    price,
    change,
    changePercent,
    currency,
    market,
    todayHigh,
    todayLow,
    todayOpen,
    prevClose,
    week52High,
    week52Low,
    volume,
    lastUpdated,
  } = stock;

  const isPositive = change >= 0;
  const currencySymbol = currency === "INR" ? "₹" : "$";

  useEffect(() => {
    // Generate mock chart data
    setIsLoading(true);
    
    // Generate random candlestick data for the chart
    const generateMockChartData = () => {
      const data: ChartDataPoint[] = [];
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 90); // 3 months ago
      
      let basePrice = price;
      const volatility = 0.02; // 2% volatility
      
      for (let i = 0; i < 90; i++) {
        currentDate.setDate(currentDate.getDate() + 1);
        // Skip weekends
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
          continue;
        }
        
        const randomChange = basePrice * volatility * (Math.random() - 0.5) * 2;
        basePrice = basePrice + randomChange;
        
        data.push({
          date: currentDate.toISOString().split('T')[0],
          actual: basePrice,
        });
      }
      
      return data;
    };
    
    const mockData = generateMockChartData();
    setChartData(mockData);
    setIsLoading(false);
  }, [price, symbol]);

  // Determine if the stock is near its 52-week high or low
  const isNear52WeekHigh = week52High && (price / week52High > 0.9);
  const isNear52WeekLow = week52Low && (price / week52Low < 1.1);
  
  // Calculate support and resistance levels (simplified mock calculation)
  const supportLevel = Math.round((price - (price * 0.05)) * 100) / 100;
  const resistanceLevel = Math.round((price + (price * 0.05)) * 100) / 100;
  
  // Determine technical signals (simplified for mock data)
  const rsi = Math.floor(Math.random() * 100); // Random RSI value
  const macd = Math.random() > 0.5 ? "bullish" : "bearish";
  const movingAvg50 = Math.random() > 0.5 ? "above" : "below";
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stock Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">{name}</h1>
            <Badge variant="outline" className="uppercase">{symbol}</Badge>
            <Badge variant="secondary">{market}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">{currencySymbol}{price.toFixed(2)}</span>
            <div 
              className={cn(
                "flex items-center px-2 py-1 rounded",
                isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              )}
            >
              {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span className="font-medium">
                {isPositive ? "+" : ""}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          {lastUpdated && (
            <div className="text-sm text-muted-foreground flex items-center mt-1">
              <Clock className="w-3 h-3 mr-1" /> Last Updated: {lastUpdated}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Info className="w-4 h-4 mr-1" /> Company Info
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-1" /> Financial Reports
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-1" /> Competitors
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Key Stats */}
        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Today's Trading</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="font-medium">{currencySymbol}{todayOpen?.toFixed(2) || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prev. Close</p>
                <p className="font-medium">{currencySymbol}{prevClose?.toFixed(2) || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's High</p>
                <p className="font-medium">{currencySymbol}{todayHigh?.toFixed(2) || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Low</p>
                <p className="font-medium">{currencySymbol}{todayLow?.toFixed(2) || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Volume</p>
                <p className="font-medium">{volume?.toLocaleString() || "-"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">52 Week Range</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>{currencySymbol}{week52Low?.toFixed(2) || "-"}</span>
                <span>{currencySymbol}{week52High?.toFixed(2) || "-"}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full relative">
                {week52Low && week52High && (
                  <div 
                    className="absolute top-0 bottom-0 bg-primary rounded-full"
                    style={{
                      left: `${Math.max(0, ((price - week52Low) / (week52High - week52Low)) * 100)}%`,
                      width: '8px',
                      transform: 'translateX(-50%)'
                    }}
                  />
                )}
              </div>
              <div className="text-xs text-center text-muted-foreground">
                Current price in 52-week range
              </div>

              <div className="mt-4 space-y-2">
                {isNear52WeekHigh && (
                  <Badge variant="outline" className="w-full justify-start text-yellow-600 bg-yellow-50 hover:bg-yellow-50">
                    Trading near 52-week high
                  </Badge>
                )}
                {isNear52WeekLow && (
                  <Badge variant="outline" className="w-full justify-start text-blue-600 bg-blue-50 hover:bg-blue-50">
                    Trading near 52-week low
                  </Badge>
                )}
              </div>
            </div>
          </Card>

          {showSignals && (
            <Card className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Technical Signals</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-80">
                        Technical signals are indicators based on price patterns and historical data.
                        They are not financial advice. Always do your own research.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Support Level</span>
                    <span className="font-medium text-sm">{currencySymbol}{supportLevel}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Resistance Level</span>
                    <span className="font-medium text-sm">{currencySymbol}{resistanceLevel}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">RSI (14)</span>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        rsi > 70 ? "bg-red-50 text-red-700" : 
                        rsi < 30 ? "bg-green-50 text-green-700" : 
                        "bg-gray-50 text-gray-700"
                      )}
                    >
                      {rsi} {rsi > 70 ? "(Overbought)" : rsi < 30 ? "(Oversold)" : "(Neutral)"}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">MACD</span>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        macd === "bullish" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      )}
                    >
                      {macd === "bullish" ? "Bullish" : "Bearish"}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">50-Day MA</span>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        movingAvg50 === "above" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      )}
                    >
                      Price {movingAvg50} MA
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Columns - Chart and Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="fundamental">Fundamental</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Price Chart</h3>
                    <Badge variant={showSignals ? "default" : "outline"} onClick={() => setShowSignals(!showSignals)}>
                      Signals
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 bg-muted rounded-md">
                    {["1W", "1M", "3M", "6M", "1Y"].map((period) => (
                      <Button 
                        key={period}
                        variant={timeframe === period ? "secondary" : "ghost"} 
                        size="sm"
                        onClick={() => setTimeframe(period)}
                        className="h-7 px-2"
                      >
                        {period}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <StockChart 
                  data={chartData}
                  symbol={symbol}
                  isLoading={isLoading}
                  showPrediction={false}
                  currency={currency}
                  className="h-[350px] mt-2"
                />
              </Card>
              
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Market Sentiment</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">40%</div>
                    <div className="text-sm text-muted-foreground">Buy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-600">35%</div>
                    <div className="text-sm text-muted-foreground">Hold</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">25%</div>
                    <div className="text-sm text-muted-foreground">Sell</div>
                  </div>
                </div>
                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden flex">
                  <div className="bg-green-500 h-full" style={{ width: "40%" }}></div>
                  <div className="bg-gray-500 h-full" style={{ width: "35%" }}></div>
                  <div className="bg-red-500 h-full" style={{ width: "25%" }}></div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Based on technical indicators and market sentiment. This is not financial advice.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="technical">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Technical Analysis</h3>
                <p className="text-muted-foreground mb-4">
                  More detailed technical analysis would be shown here, including multiple indicators,
                  chart patterns, and trend analysis.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Moving Averages</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>MA (20): <span className="font-medium">₹{(price * 0.98).toFixed(2)}</span></div>
                      <div>MA (50): <span className="font-medium">₹{(price * 0.95).toFixed(2)}</span></div>
                      <div>MA (100): <span className="font-medium">₹{(price * 0.92).toFixed(2)}</span></div>
                      <div>MA (200): <span className="font-medium">₹{(price * 0.88).toFixed(2)}</span></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Oscillators</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>RSI (14): <span className="font-medium">{rsi}</span></div>
                      <div>MACD: <span className="font-medium capitalize">{macd}</span></div>
                      <div>Stochastic: <span className="font-medium">65.3</span></div>
                      <div>CCI: <span className="font-medium">-88.5</span></div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="fundamental">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Fundamental Analysis</h3>
                <p className="text-muted-foreground mb-4">
                  Key financial metrics and fundamental data would be displayed here, including revenue,
                  earnings, ratios, and growth projections.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Market Cap</p>
                    <p className="font-medium">₹345,678 Cr</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">P/E Ratio</p>
                    <p className="font-medium">24.5</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">EPS (TTM)</p>
                    <p className="font-medium">₹86.25</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dividend Yield</p>
                    <p className="font-medium">1.85%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Book Value</p>
                    <p className="font-medium">₹1,245.60</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">PEG Ratio</p>
                    <p className="font-medium">1.35</p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StockDetailView;
