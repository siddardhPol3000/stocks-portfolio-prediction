
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PredictionForm from "@/components/PredictionForm";
import StockChart from "@/components/StockChart";
import { getHistoricalData, getPrediction, formatChartData, ChartDataPoint } from "@/lib/api";
import { toast } from "sonner";

const Predict = () => {
  const [searchParams] = useSearchParams();
  const initialSymbol = searchParams.get("symbol") || "";
  
  const [predictionParams, setPredictionParams] = useState({
    symbol: initialSymbol,
    days: 30,
  });
  
  const [isPredicting, setIsPredicting] = useState(false);

  // Get historical data
  const {
    data: historicalData,
    isLoading: isLoadingHistorical,
    error: historicalError,
  } = useQuery({
    queryKey: ["historicalData", predictionParams.symbol],
    queryFn: () => getHistoricalData(predictionParams.symbol),
    enabled: !!predictionParams.symbol,
  });

  // State for prediction data
  const [predictionData, setPredictionData] = useState<any[]>([]);

  // Handle form submission
  const handlePredictionSubmit = async (data: { symbol: string; days: number }) => {
    setPredictionParams(data);
    
    if (!historicalData) {
      toast.error("Historical data is required for prediction");
      return;
    }
    
    setIsPredicting(true);
    
    try {
      const predictions = await getPrediction(data.symbol, data.days);
      setPredictionData(predictions);
      toast.success(`Generated ${data.days}-day prediction for ${data.symbol}`);
    } catch (error) {
      console.error("Prediction error:", error);
      // Error toast is already handled in the API function
    } finally {
      setIsPredicting(false);
    }
  };

  // Format chart data with predictions
  const chartData: ChartDataPoint[] = historicalData 
    ? formatChartData(historicalData, predictionData)
    : [];

  // Determine currency based on symbol
  const currency = predictionParams.symbol.includes(".BSE") ? "INR" : "USD";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Stock Price Prediction</h1>
        <p className="text-muted-foreground">
          Forecast future stock prices with our LSTM machine learning model
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Prediction Form */}
        <div className="md:col-span-1">
          <PredictionForm 
            onSubmit={handlePredictionSubmit} 
            isLoading={isLoadingHistorical || isPredicting}
          />
        </div>

        {/* Chart */}
        <div className="md:col-span-2">
          {predictionParams.symbol ? (
            <StockChart
              data={chartData}
              symbol={predictionParams.symbol}
              isLoading={isLoadingHistorical || isPredicting}
              showPrediction={predictionData.length > 0}
              currency={currency}
            />
          ) : (
            <div className="bg-card rounded-lg border border-border h-[400px] flex items-center justify-center p-6 text-center">
              <div className="max-w-md">
                <h3 className="text-xl font-medium mb-2">No Prediction Generated</h3>
                <p className="text-muted-foreground">
                  Enter a stock symbol and prediction timeframe to generate a forecast using our LSTM model.
                </p>
              </div>
            </div>
          )}

          {/* Prediction Details */}
          {predictionData.length > 0 && (
            <div className="mt-6 bg-card rounded-lg border border-border p-6 animate-slide-up">
              <h3 className="text-xl font-semibold mb-4">Prediction Details</h3>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Prediction Period</h4>
                  <p className="text-lg font-medium">{predictionParams.days} days</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Market/Currency</h4>
                  <p className="text-lg font-medium">
                    {predictionParams.symbol.includes(".BSE") ? "Indian (₹)" : "US ($)"}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">First Prediction Date</h4>
                  <p className="text-lg font-medium">
                    {predictionData[0]?.date ? new Date(predictionData[0].date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Last Prediction Date</h4>
                  <p className="text-lg font-medium">
                    {predictionData[predictionData.length - 1]?.date ? 
                      new Date(predictionData[predictionData.length - 1].date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Disclaimer</h4>
                <p className="text-sm text-muted-foreground">
                  These predictions are generated using historical data and machine learning models.
                  They should be used for informational purposes only and not as financial advice.
                  Past performance is not indicative of future results.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predict;
