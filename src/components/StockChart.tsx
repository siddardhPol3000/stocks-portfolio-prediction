
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "./LoadingSpinner";

interface ChartDataPoint {
  date: string;
  actual?: number;
  predicted?: number;
}

interface StockChartProps {
  data: ChartDataPoint[];
  symbol: string;
  isLoading?: boolean;
  showPrediction?: boolean;
  className?: string;
  currency?: string;
}

const CustomTooltip = ({ active, payload, label, currency = "USD" }: any) => {
  const currencySymbol = currency === "INR" ? "₹" : "$";
  
  if (active && payload && payload.length) {
    return (
      <div className="glass-morphism p-3 rounded-lg border border-border/50 shadow-sm">
        <p className="text-sm font-medium">{format(new Date(label), "MMM d, yyyy")}</p>
        {payload.map((entry: any, index: number) => (
          <p
            key={`tooltip-${index}`}
            className={cn(
              "text-sm",
              entry.name === "actual" ? "text-primary" : "text-orange-500"
            )}
          >
            <span className="font-medium">{entry.name === "actual" ? "Actual" : "Predicted"}: </span>
            {currencySymbol}{entry.value.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const timeRanges = [
  { key: "1W", label: "1 Week" },
  { key: "1M", label: "1 Month" },
  { key: "3M", label: "3 Months" },
  { key: "6M", label: "6 Months" },
  { key: "1Y", label: "1 Year" },
];

const StockChart = ({
  data,
  symbol,
  isLoading = false,
  showPrediction = false,
  className,
  currency = "USD",
}: StockChartProps) => {
  const [selectedRange, setSelectedRange] = useState("1M");
  const [visibleData, setVisibleData] = useState<ChartDataPoint[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const currencySymbol = currency === "INR" ? "₹" : "$";

  useEffect(() => {
    if (data && data.length > 0) {
      const now = new Date();
      let cutoffDate = new Date();

      switch (selectedRange) {
        case "1W":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "1M":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "3M":
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case "6M":
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
        case "1Y":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          cutoffDate.setMonth(now.getMonth() - 1);
      }

      const filtered = data.filter(
        (item) => new Date(item.date) >= cutoffDate
      );
      setVisibleData(filtered);
    }
  }, [data, selectedRange]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <Card className={cn("p-6 h-[400px] flex items-center justify-center", className)}>
        <LoadingSpinner size="lg" />
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className={cn("p-6 h-[400px] flex items-center justify-center", className)}>
        <p className="text-muted-foreground text-center">No data available</p>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "p-6 opacity-0 transform translate-y-4 transition-all duration-500", 
        isVisible && "opacity-100 translate-y-0",
        className
      )}
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">{symbol} Price Chart</h3>
          <p className="text-muted-foreground text-sm mt-1">
            {showPrediction ? "Historical & Predicted Prices" : "Historical Prices"} ({currency})
          </p>
        </div>

        <Tabs defaultValue={selectedRange} onValueChange={setSelectedRange} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-5 w-full sm:w-auto">
            {timeRanges.map((range) => (
              <TabsTrigger key={range.key} value={range.key}>
                {range.key}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={visibleData}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), "MMM d")}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={["auto", "auto"]}
              tickFormatter={(value) => `${currencySymbol}${value.toFixed(0)}`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip currency={currency} />} />
            <Legend
              formatter={(value) =>
                value === "actual" ? "Actual Price" : "Predicted Price"
              }
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              name="actual"
            />
            {showPrediction && (
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#ff9800"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 6 }}
                name="predicted"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default StockChart;
