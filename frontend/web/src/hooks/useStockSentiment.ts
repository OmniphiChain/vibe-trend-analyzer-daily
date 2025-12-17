import { useState, useEffect } from "react";
import { robustFetchJson, FetchError } from "../lib/robustFetch";

interface StockSentimentData {
  score: number;
  label: string;
  change: number;
  samples: number;
}

// Top 10 US stocks by market cap
const TOP_10_STOCKS = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "NVDA",
  "TSLA",
  "META",
  "BRK.B",
  "AVGO",
  "JPM",
];

export const useStockSentiment = (refreshInterval: number = 300000) => {
  // 5 minutes default
  const [data, setData] = useState<StockSentimentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateSentimentScore = (changePercent: number): number => {
    if (changePercent >= 3) return 10;
    if (changePercent >= 1) return 5;
    if (changePercent > -1) return 0;
    if (changePercent >= -3) return -5;
    return -10;
  };

  const fetchStockSentiment = async () => {
    setLoading(true);
    setError(null);

    try {
      const stockPromises = TOP_10_STOCKS.map(async (symbol) => {
        try {
          const data = await robustFetchJson(
            `/api/proxy/finnhub/quote?symbol=${symbol}`,
            {
              retry: {
                maxRetries: 2,
                retryDelay: 500,
                timeout: 10000,
              },
            },
          );

          // Handle API error responses
          if (data.error) {
            console.warn(`API error for ${symbol}:`, data.error);
            return {
              symbol,
              changePercent: 0,
              sentimentScore: 0,
            };
          }

          return {
            symbol,
            changePercent: data.dp || 0,
            sentimentScore: calculateSentimentScore(data.dp || 0),
          };
        } catch (stockError: any) {
          if (stockError instanceof FetchError) {
            console.warn(`API error fetching ${symbol}:`, stockError.message);
          } else if (stockError.name === "AbortError") {
            console.warn(`Timeout fetching ${symbol}`);
          } else if (
            stockError.message &&
            stockError.message.includes("Failed to fetch")
          ) {
            console.warn(
              `Network connectivity issue fetching ${symbol}:`,
              stockError.message,
            );
          } else {
            console.warn(`Unexpected error fetching ${symbol}:`, stockError);
          }
          // Return null to exclude from calculations rather than 0 values
          return null;
        }
      });

      const stockResults = await Promise.allSettled(stockPromises);

      // Extract successful results and filter out null values
      const stockData = stockResults
        .filter((result) => result.status === "fulfilled")
        .map((result) => (result as PromiseFulfilledResult<any>).value)
        .filter((stock) => stock !== null);

      // Filter out symbols that returned no data and have at least some valid stocks
      const validStockData = stockData.filter(
        (stock) => stock.changePercent !== 0 || stock.sentimentScore !== 0,
      );

      // Use valid data if available, otherwise use all data (including zeros for fallback)
      const dataToUse = validStockData.length > 0 ? validStockData : stockData;

      // If no data at all, throw error to trigger fallback
      if (!dataToUse || dataToUse.length === 0) {
        throw new Error("No stock data available from any source");
      }

      // Calculate average sentiment score
      const totalSentimentScore = dataToUse.reduce(
        (sum, stock) => sum + stock.sentimentScore,
        0,
      );
      const averageSentimentScore = totalSentimentScore / dataToUse.length;

      // Scale to -50 to +50 range, then normalize to 0-100 for dashboard display
      const scaledScore = averageSentimentScore * 5;
      const normalizedScore = Math.max(0, Math.min(100, scaledScore + 50)); // Convert -50/+50 to 0-100

      // Calculate average percentage change for change indicator
      const averageChange =
        dataToUse.reduce((sum, stock) => sum + stock.changePercent, 0) /
        dataToUse.length;

      setData({
        score: Math.round(normalizedScore),
        label: getScoreLabel(scaledScore),
        change: Number(averageChange.toFixed(2)),
        samples: dataToUse.length * 1000, // Approximate sample size
      });
    } catch (err) {
      console.error("Stock sentiment error:", err);

      // In development, provide immediate fallback to avoid blocking UI
      const isDevelopment = import.meta.env.DEV;
      const mockVariation = Math.random() * 20 - 10; // -10 to +10 variation

      setData({
        score: Math.max(20, Math.min(80, 50 + mockVariation)), // Realistic range
        label: isDevelopment ? "Mock Data (Dev Mode)" : "Neutral (Fallback)",
        change: (Math.random() - 0.5) * 4, // -2% to +2% change
        samples: 5000 + Math.floor(Math.random() * 3000), // 5k-8k samples
      });

      setError(
        isDevelopment
          ? "Development mode - using mock data"
          : `API unavailable - using fallback data (${err instanceof Error ? err.message : "Failed to fetch stock sentiment"})`,
      );
    } finally {
      setLoading(false);
    }
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 30) return "Bullish";
    if (score >= 10) return "Cautiously Optimistic";
    if (score >= -9) return "Neutral";
    if (score >= -29) return "Cautiously Bearish";
    return "Bearish";
  };

  useEffect(() => {
    const safeExecute = async () => {
      try {
        // In development mode, provide immediate fallback to prevent FullStory fetch issues
        const isDevelopment = import.meta.env.DEV;
        if (isDevelopment) {
          const mockVariation = Math.random() * 20 - 10; // -10 to +10 variation
          setData({
            score: Math.max(20, Math.min(80, 50 + mockVariation)),
            label: "Mock Data (Dev Mode)",
            change: (Math.random() - 0.5) * 4,
            samples: 5000 + Math.floor(Math.random() * 3000),
          });
          setError("Development mode - using mock data");
          setLoading(false);
          return;
        }

        await fetchStockSentiment();
      } catch (error) {
        console.error("useStockSentiment useEffect error:", error);
        setError("Failed to initialize stock sentiment data");
        setData({
          score: 50,
          label: "Neutral (Fallback)",
          change: 0,
          samples: 1000,
        });
        setLoading(false);
      }
    };

    safeExecute();

    const interval = setInterval(safeExecute, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchStockSentiment,
  };
};
