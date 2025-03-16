
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StockCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency?: string;
  market?: string;
  onClick?: () => void;
}

const StockCard = ({
  symbol,
  name,
  price,
  change,
  changePercent,
  currency = "USD",
  market,
  onClick,
}: StockCardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slight delay to trigger animation
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  const isPositive = change >= 0;
  const formattedChange = change.toFixed(2);
  const formattedChangePercent = changePercent.toFixed(2);
  
  // Format the currency symbol
  const currencySymbol = currency === "INR" ? "₹" : "$";

  return (
    <Card
      className={cn(
        "p-5 cursor-pointer transition-all duration-300 hover:shadow-md border-2 border-border/50 hover:border-primary/30",
        "opacity-0 transform translate-y-4",
        isVisible && "opacity-100 translate-y-0",
        onClick && "hover:scale-[1.02]"
      )}
      onClick={onClick}
      style={{
        transitionDelay: `${Math.random() * 0.3}s`,
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-sm uppercase font-medium text-muted-foreground">
              {symbol}
            </span>
            {market && (
              <span className="text-xs px-1.5 py-0.5 bg-muted rounded-full">
                {market}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-lg mt-1 line-clamp-1">{name}</h3>
        </div>

        <div
          className={cn(
            "flex items-center py-1 px-2 rounded-full",
            isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1" />
          )}
          <span className="text-xs font-medium">{formattedChangePercent}%</span>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-end">
        <span className="text-2xl font-bold">{currencySymbol}{price.toFixed(2)}</span>
        <span
          className={cn(
            "font-medium",
            isPositive ? "text-green-600" : "text-red-600"
          )}
        >
          {isPositive ? "+" : ""}
          {formattedChange}
        </span>
      </div>
    </Card>
  );
};

export default StockCard;
