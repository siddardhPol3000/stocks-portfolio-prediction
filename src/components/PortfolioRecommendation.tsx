
import { useState, useEffect } from "react";
import { 
  PieChart as PieChartIcon, 
  ArrowDownToLine, 
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip
} from "recharts";
import { MOCK_INDIAN_STOCKS } from "@/lib/stockData";

interface PortfolioRecommendationProps {
  amount: number;
  riskProfile: "low" | "medium" | "high";
}

interface StockAllocation {
  symbol: string;
  name: string;
  amount: number;
  percentage: number;
  riskLevel: "low" | "medium" | "high";
  sector: string;
  color: string;
}

const PortfolioRecommendation = ({ amount, riskProfile }: PortfolioRecommendationProps) => {
  const [allocations, setAllocations] = useState<StockAllocation[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Generate portfolio based on risk profile and amount
    const portfolioAllocation = generatePortfolio(amount, riskProfile);
    setAllocations(portfolioAllocation);
    
    // Animation delay
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [amount, riskProfile]);

  const totalAllocation = allocations.reduce((sum, stock) => sum + stock.amount, 0);
  
  // Prepare data for pie chart
  const chartData = allocations.map(stock => ({
    name: stock.symbol,
    value: stock.percentage,
    color: stock.color
  }));

  return (
    <div className={`space-y-8 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-primary" />
          Your Personalized Portfolio
        </h2>
        <p className="text-muted-foreground mt-1">
          Based on your ₹{amount.toLocaleString()} investment and {riskProfile} risk profile
        </p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Allocation Summary</h3>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={1}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Allocation']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Risk Level</span>
              <span className="font-medium capitalize">{riskProfile}</span>
            </div>
            <Progress 
              value={riskProfile === "low" ? 33 : riskProfile === "medium" ? 66 : 100} 
              className="h-2" 
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Investment Summary</h3>
          
          <div className="space-y-1 mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Investment</span>
              <span className="font-semibold">₹{amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Number of Stocks</span>
              <span>{allocations.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Risk Profile</span>
              <span className="capitalize">{riskProfile}</span>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h4 className="text-sm font-medium mb-2">Sector Allocation</h4>
            {getSectorAllocation(allocations).map((sector, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>{sector.name}</span>
                  <span>{sector.percentage.toFixed(1)}%</span>
                </div>
                <Progress value={sector.percentage} className="h-1.5" />
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <Button variant="outline" className="w-full flex items-center gap-1">
              <ArrowDownToLine className="w-4 h-4" />
              Download Portfolio Report
            </Button>
          </div>
        </Card>
      </div>

      {/* Stock Allocations Table */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Stock Allocations</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Stock</th>
                <th className="text-left py-3 px-2">Sector</th>
                <th className="text-right py-3 px-2">Amount</th>
                <th className="text-right py-3 px-2">Allocation</th>
                <th className="text-center py-3 px-2">Risk</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((stock, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-2">
                    <div>
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-xs text-muted-foreground">{stock.name}</div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground">{stock.sector}</td>
                  <td className="py-3 px-2 text-right">₹{stock.amount.toLocaleString()}</td>
                  <td className="py-3 px-2 text-right">{stock.percentage.toFixed(1)}%</td>
                  <td className="py-3 px-2">
                    <div className="flex justify-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span 
                              className={`px-2 py-1 rounded-full text-xs font-medium
                                ${stock.riskLevel === "low" ? "bg-green-100 text-green-800" :
                                  stock.riskLevel === "medium" ? "bg-yellow-100 text-yellow-800" :
                                  "bg-red-100 text-red-800"}`}
                            >
                              {stock.riskLevel.charAt(0).toUpperCase() + stock.riskLevel.slice(1)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{getRiskDescription(stock.riskLevel)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="py-3 px-2 font-medium">Total</td>
                <td className="py-3 px-2 text-right font-medium">₹{totalAllocation.toLocaleString()}</td>
                <td className="py-3 px-2 text-right font-medium">100%</td>
                <td className="py-3 px-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg flex items-start gap-2">
          <Info className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p>This portfolio recommendation is for educational purposes only and not financial advice. 
            Consider consulting with a financial advisor before making investment decisions.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Helper functions
function generatePortfolio(amount: number, riskProfile: "low" | "medium" | "high"): StockAllocation[] {
  // Sample Indian stocks to choose from
  const stocks = [...MOCK_INDIAN_STOCKS]; 
  
  // Sectors and their risk profiles
  const sectors = [
    { name: "Banking & Finance", risk: "medium" },
    { name: "IT & Technology", risk: "medium" },
    { name: "FMCG", risk: "low" },
    { name: "Pharmaceuticals", risk: "medium" },
    { name: "Energy", risk: "medium" },
    { name: "Automobile", risk: "high" },
    { name: "Metals", risk: "high" },
    { name: "Infrastructure", risk: "high" },
  ];
  
  // Colors for the pie chart
  const colors = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", 
    "#82CA9D", "#8DD1E1", "#A4DE6C", "#D0ED57", "#F5A623"
  ];
  
  let allocations: StockAllocation[] = [];
  
  // Determine allocation percentages based on risk profile
  if (riskProfile === "low") {
    // Conservative portfolio - more low risk, less high risk
    allocations = [
      { 
        symbol: "HDFCBANK.BSE", 
        name: "HDFC Bank", 
        amount: Math.round(amount * 0.25), 
        percentage: 25, 
        riskLevel: "low",
        sector: "Banking & Finance",
        color: colors[0]
      },
      { 
        symbol: "TCS.BSE", 
        name: "Tata Consultancy Services", 
        amount: Math.round(amount * 0.20), 
        percentage: 20, 
        riskLevel: "low",
        sector: "IT & Technology",
        color: colors[1]
      },
      { 
        symbol: "HINDUNILVR.BSE", 
        name: "Hindustan Unilever", 
        amount: Math.round(amount * 0.20), 
        percentage: 20, 
        riskLevel: "low",
        sector: "FMCG",
        color: colors[2]
      },
      { 
        symbol: "RELIANCE.BSE", 
        name: "Reliance Industries", 
        amount: Math.round(amount * 0.15), 
        percentage: 15, 
        riskLevel: "medium",
        sector: "Energy",
        color: colors[3]
      },
      { 
        symbol: "INFY.BSE", 
        name: "Infosys", 
        amount: Math.round(amount * 0.10), 
        percentage: 10, 
        riskLevel: "medium",
        sector: "IT & Technology",
        color: colors[4]
      },
      { 
        symbol: "SUNPHARMA.BSE", 
        name: "Sun Pharmaceutical", 
        amount: Math.round(amount * 0.10), 
        percentage: 10, 
        riskLevel: "medium",
        sector: "Pharmaceuticals",
        color: colors[5]
      },
    ];
  } else if (riskProfile === "medium") {
    // Balanced portfolio
    allocations = [
      { 
        symbol: "HDFCBANK.BSE", 
        name: "HDFC Bank", 
        amount: Math.round(amount * 0.20), 
        percentage: 20, 
        riskLevel: "low",
        sector: "Banking & Finance",
        color: colors[0]
      },
      { 
        symbol: "RELIANCE.BSE", 
        name: "Reliance Industries", 
        amount: Math.round(amount * 0.20), 
        percentage: 20, 
        riskLevel: "medium",
        sector: "Energy",
        color: colors[1]
      },
      { 
        symbol: "TCS.BSE", 
        name: "Tata Consultancy Services", 
        amount: Math.round(amount * 0.15), 
        percentage: 15, 
        riskLevel: "low",
        sector: "IT & Technology",
        color: colors[2]
      },
      { 
        symbol: "INFY.BSE", 
        name: "Infosys", 
        amount: Math.round(amount * 0.15), 
        percentage: 15, 
        riskLevel: "medium",
        sector: "IT & Technology",
        color: colors[3]
      },
      { 
        symbol: "TATAMOTORS.BSE", 
        name: "Tata Motors", 
        amount: Math.round(amount * 0.10), 
        percentage: 10, 
        riskLevel: "high",
        sector: "Automobile",
        color: colors[4]
      },
      { 
        symbol: "AXISBANK.BSE", 
        name: "Axis Bank", 
        amount: Math.round(amount * 0.10), 
        percentage: 10, 
        riskLevel: "medium",
        sector: "Banking & Finance",
        color: colors[5]
      },
      { 
        symbol: "HINDUNILVR.BSE", 
        name: "Hindustan Unilever", 
        amount: Math.round(amount * 0.10), 
        percentage: 10, 
        riskLevel: "low",
        sector: "FMCG",
        color: colors[6]
      },
    ];
  } else {
    // Aggressive portfolio - more high risk, less low risk
    allocations = [
      { 
        symbol: "TATAMOTORS.BSE", 
        name: "Tata Motors", 
        amount: Math.round(amount * 0.20), 
        percentage: 20, 
        riskLevel: "high",
        sector: "Automobile",
        color: colors[0]
      },
      { 
        symbol: "RELIANCE.BSE", 
        name: "Reliance Industries", 
        amount: Math.round(amount * 0.20), 
        percentage: 20, 
        riskLevel: "medium",
        sector: "Energy",
        color: colors[1]
      },
      { 
        symbol: "SBIN.BSE", 
        name: "State Bank of India", 
        amount: Math.round(amount * 0.15), 
        percentage: 15, 
        riskLevel: "high",
        sector: "Banking & Finance",
        color: colors[2]
      },
      { 
        symbol: "ICICIBANK.BSE", 
        name: "ICICI Bank", 
        amount: Math.round(amount * 0.15), 
        percentage: 15, 
        riskLevel: "medium",
        sector: "Banking & Finance",
        color: colors[3]
      },
      { 
        symbol: "INFY.BSE", 
        name: "Infosys", 
        amount: Math.round(amount * 0.10), 
        percentage: 10, 
        riskLevel: "medium",
        sector: "IT & Technology",
        color: colors[4]
      },
      { 
        symbol: "ADANIENT.BSE", 
        name: "Adani Enterprises", 
        amount: Math.round(amount * 0.10), 
        percentage: 10, 
        riskLevel: "high",
        sector: "Infrastructure",
        color: colors[5]
      },
      { 
        symbol: "HDFCBANK.BSE", 
        name: "HDFC Bank", 
        amount: Math.round(amount * 0.05), 
        percentage: 5, 
        riskLevel: "low",
        sector: "Banking & Finance",
        color: colors[6]
      },
      { 
        symbol: "TATASTEEL.BSE", 
        name: "Tata Steel", 
        amount: Math.round(amount * 0.05), 
        percentage: 5, 
        riskLevel: "high",
        sector: "Metals",
        color: colors[7]
      },
    ];
  }
  
  // Ensure allocations add up to the exact amount
  const totalAllocated = allocations.reduce((sum, stock) => sum + stock.amount, 0);
  const difference = amount - totalAllocated;
  
  if (difference !== 0 && allocations.length > 0) {
    // Add the difference to the largest allocation
    allocations.sort((a, b) => b.amount - a.amount);
    allocations[0].amount += difference;
  }
  
  return allocations;
}

function getSectorAllocation(allocations: StockAllocation[]) {
  const sectors: Record<string, number> = {};
  
  // Calculate amount per sector
  allocations.forEach(stock => {
    if (!sectors[stock.sector]) {
      sectors[stock.sector] = 0;
    }
    sectors[stock.sector] += stock.amount;
  });
  
  // Calculate total amount
  const totalAmount = allocations.reduce((sum, stock) => sum + stock.amount, 0);
  
  // Calculate percentage per sector
  return Object.entries(sectors).map(([name, amount]) => ({
    name,
    amount,
    percentage: (amount / totalAmount) * 100
  }));
}

function getRiskDescription(riskLevel: "low" | "medium" | "high") {
  switch (riskLevel) {
    case "low":
      return "Low risk stocks are generally more stable with less price volatility, but may offer lower returns.";
    case "medium":
      return "Medium risk stocks have moderate price volatility and potential for moderate returns.";
    case "high":
      return "High risk stocks have higher price volatility but potential for higher returns.";
    default:
      return "";
  }
}

export default PortfolioRecommendation;
