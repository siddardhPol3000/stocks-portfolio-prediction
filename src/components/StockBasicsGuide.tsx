
import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  BarChart4, 
  PieChart,
  Clock,
  ArrowRight
} from "lucide-react";

const StockBasicsGuide = () => {
  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Stock Market Basics for Beginners</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              What is the Stock Market?
            </h3>
            <p className="text-muted-foreground">
              The stock market is a marketplace where shares of publicly listed companies are bought and sold. 
              In India, the main stock exchanges are the Bombay Stock Exchange (BSE) and the National Stock Exchange (NSE).
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              How Stocks Work
            </h3>
            <p className="text-muted-foreground">
              When you buy a stock, you're purchasing a small piece of a company. As a shareholder, you may benefit from:
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
              <li>Share price appreciation (when stock values rise)</li>
              <li>Dividends (company profits distributed to shareholders)</li>
              <li>Voting rights on company decisions</li>
            </ul>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <BarChart4 className="h-5 w-5 text-primary" />
              Key Stock Market Terms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="font-medium">Bull Market</p>
                <p className="text-sm text-muted-foreground">A market that's rising or expected to rise</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="font-medium">Bear Market</p>
                <p className="text-sm text-muted-foreground">A market that's falling or expected to fall</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="font-medium">Dividend</p>
                <p className="text-sm text-muted-foreground">Portion of company's profit paid to shareholders</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="font-medium">Market Cap</p>
                <p className="text-sm text-muted-foreground">Total value of a company's outstanding shares</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Investment Strategies for Beginners</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Diversification is Key
            </h3>
            <p className="text-muted-foreground">
              Don't put all your money in one stock. Spread your investment across different sectors and companies to reduce risk.
              Our portfolio recommendation tool can help you create a balanced portfolio based on your risk tolerance.
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Long-term vs Short-term Investing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="border border-border p-4 rounded-lg">
                <p className="font-medium">Long-term (Recommended for beginners)</p>
                <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground space-y-1">
                  <li>Buy and hold for years</li>
                  <li>Less affected by market volatility</li>
                  <li>Potential for compounding returns</li>
                </ul>
              </div>
              <div className="border border-border p-4 rounded-lg">
                <p className="font-medium">Short-term</p>
                <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground space-y-1">
                  <li>Buy and sell within days/weeks/months</li>
                  <li>Requires more market knowledge</li>
                  <li>Higher risk and transaction costs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Button asChild>
            <Link to="/predict" className="flex items-center gap-2">
              Try Stock Price Prediction <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default StockBasicsGuide;
