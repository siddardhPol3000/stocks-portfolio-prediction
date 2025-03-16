import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Search, Calendar, Globe } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "sonner";

interface PredictionFormProps {
  onSubmit: (data: { symbol: string; days: number }) => void;
  isLoading?: boolean;
}

const popularUSStocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla, Inc." },
  { symbol: "META", name: "Meta Platforms, Inc." },
];

const popularIndianStocks = [
  { symbol: "RELIANCE.BSE", name: "Reliance Industries" },
  { symbol: "TCS.BSE", name: "Tata Consultancy Services" },
  { symbol: "HDFCBANK.BSE", name: "HDFC Bank" },
  { symbol: "INFY.BSE", name: "Infosys" },
  { symbol: "HINDUNILVR.BSE", name: "Hindustan Unilever" },
  { symbol: "TATAMOTORS.BSE", name: "Tata Motors" },
];

const PredictionForm = ({ onSubmit, isLoading = false }: PredictionFormProps) => {
  const [symbol, setSymbol] = useState("");
  const [days, setDays] = useState("30");
  const [activeMarket, setActiveMarket] = useState<"US" | "India">("US");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!symbol) {
      toast.error("Please enter a stock symbol");
      return;
    }

    // Validate stock symbol against the predefined list
    const validStocks = activeMarket === "US" ? popularUSStocks : popularIndianStocks;
    const isValidSymbol = validStocks.some(stock => stock.symbol === symbol.toUpperCase());

    if (!isValidSymbol) {
      toast.error("Invalid stock symbol. Please select from the suggested stocks.");
      return;
    }

    const daysNumber = parseInt(days);
    if (isNaN(daysNumber) || daysNumber < 1 || daysNumber > 30) {
      toast.error("Please enter a valid number of days (1-30)");
      return;
    }

    onSubmit({ symbol: symbol.toUpperCase(), days: daysNumber });
  };

  const handleQuickSelect = (stock: { symbol: string; name: string }) => {
    setSymbol(stock.symbol);
    toast.info(`Selected ${stock.name} (${stock.symbol})`);
  };

  return (
    <Card className="p-6 animate-fade-in">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Stock Price Prediction</h2>
        <p className="text-muted-foreground text-sm">
          Enter a stock symbol and prediction timeframe to forecast future prices using our LSTM model
        </p>
      </div>

      {/* Market Selection */}
      <div className="mb-6">
        <Tabs defaultValue={activeMarket} onValueChange={(value) => setActiveMarket(value as "US" | "India")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="US" className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> US (USD)
            </TabsTrigger>
            <TabsTrigger value="India" className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> India (INR)
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="symbol">Stock Symbol</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="symbol"
              placeholder={activeMarket === "US" ? "AAPL, MSFT, GOOGL..." : "RELIANCE.BSE, TCS.BSE..."}
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="pl-9"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="days">Prediction Period (Days)</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Select value={days} onValueChange={setDays}>
              <SelectTrigger className="pl-9">
                <SelectValue placeholder="Select days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="21">21 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
          {isLoading ? "Generating Prediction..." : "Predict Stock Price"}
        </Button>
      </form>

      <div className="mt-8">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Popular {activeMarket === "US" ? "US" : "Indian"} Stocks
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(activeMarket === "US" ? popularUSStocks : popularIndianStocks).map((stock) => (
            <Button
              key={stock.symbol}
              variant="outline"
              size="sm"
              className="justify-start"
              onClick={() => handleQuickSelect(stock)}
            >
              {stock.symbol}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PredictionForm;
