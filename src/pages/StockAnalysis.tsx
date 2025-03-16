
import { useState } from "react";
import { 
  IndianRupee, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Info, 
  ArrowRight,
  BarChart3 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";
import StockCard from "@/components/StockCard";
import StockDetailView from "@/components/StockDetailView";
import { MOCK_INDIAN_STOCKS } from "@/lib/stockData";
import PortfolioRecommendation from "@/components/PortfolioRecommendation";
import StockBasicsGuide from "@/components/StockBasicsGuide";

const StockAnalysis = () => {
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  const [riskProfile, setRiskProfile] = useState<"low" | "medium" | "high">("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [activeTab, setActiveTab] = useState("trending");
  const [selectedStock, setSelectedStock] = useState<typeof MOCK_INDIAN_STOCKS[0] | null>(null);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers
    const value = e.target.value.replace(/[^0-9]/g, "");
    setInvestmentAmount(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!investmentAmount || parseInt(investmentAmount) < 1000) {
      toast.error("Please enter an investment amount of at least ₹1,000");
      return;
    }

    setIsLoading(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsLoading(false);
      setShowRecommendation(true);
      toast.success("Portfolio recommendation generated successfully!");
    }, 1500);
  };

  const handleStockSelect = (stock: typeof MOCK_INDIAN_STOCKS[0]) => {
    setSelectedStock(stock);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedStock(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Indian Stock Market Analysis</h1>
        <p className="text-muted-foreground">
          Learn about stocks and get personalized investment recommendations
        </p>
      </div>

      {selectedStock ? (
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBackToList} 
            className="mb-4"
          >
            ← Back to stock list
          </Button>
          <StockDetailView stock={selectedStock} />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="basics" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">Stock Market Basics</span>
              <span className="inline sm:hidden">Basics</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              <span className="hidden sm:inline">Portfolio Recommendation</span>
              <span className="inline sm:hidden">Portfolio</span>
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Trending Indian Stocks</span>
              <span className="inline sm:hidden">Trending</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="animate-in slide-in-from-left">
            <StockBasicsGuide />
          </TabsContent>

          <TabsContent value="portfolio" className="animate-in slide-in-from-left">
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xl font-semibold">Get Your Personalized Portfolio</h2>
                <p className="text-muted-foreground">
                  Enter your investment amount and risk tolerance to receive a customized stock portfolio recommendation.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Investment Amount (₹)</Label>
                    <div className="relative mt-1">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="amount"
                        type="text"
                        placeholder="10000"
                        value={investmentAmount}
                        onChange={handleAmountChange}
                        className="pl-9"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum recommended investment: ₹1,000
                    </p>
                  </div>

                  <div>
                    <Label>Risk Tolerance</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <Button
                        type="button"
                        variant={riskProfile === "low" ? "default" : "outline"}
                        className={riskProfile === "low" ? "border-primary" : ""}
                        onClick={() => setRiskProfile("low")}
                      >
                        Low
                      </Button>
                      <Button
                        type="button"
                        variant={riskProfile === "medium" ? "default" : "outline"}
                        className={riskProfile === "medium" ? "border-primary" : ""}
                        onClick={() => setRiskProfile("medium")}
                      >
                        Medium
                      </Button>
                      <Button
                        type="button"
                        variant={riskProfile === "high" ? "default" : "outline"}
                        className={riskProfile === "high" ? "border-primary" : ""}
                        onClick={() => setRiskProfile("high")}
                      >
                        High
                      </Button>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                  {isLoading ? "Analyzing Market Data..." : "Generate Portfolio Recommendation"}
                </Button>
              </form>

              {showRecommendation && !isLoading && (
                <div className="mt-8 animate-fade-in">
                  <PortfolioRecommendation 
                    amount={parseInt(investmentAmount)} 
                    riskProfile={riskProfile} 
                  />
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="trending" className="animate-in slide-in-from-left">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Trending Indian Stocks</h2>
              <p className="text-muted-foreground">
                Top performing BSE stocks to consider for your portfolio. Click on any stock for detailed analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_INDIAN_STOCKS.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  symbol={stock.symbol}
                  name={stock.name}
                  price={stock.price}
                  change={stock.change}
                  changePercent={stock.changePercent}
                  currency="INR"
                  market="India"
                  onClick={() => handleStockSelect(stock)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default StockAnalysis;
