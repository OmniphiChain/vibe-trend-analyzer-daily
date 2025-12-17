import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useFinnhubQuote } from "@/hooks/useFinnhub";

interface StockData {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  sentimentScore: number;
}

interface SentimentResult {
  score: number;
  label: string;
  color: string;
  emoji: string;
  stocks: StockData[];
  averageChange: number;
}

// Top 10 US stocks by market cap
const TOP_10_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "BRK.B", name: "Berkshire Hathaway Inc." },
  { symbol: "AVGO", name: "Broadcom Inc." },
  { symbol: "JPM", name: "JPMorgan Chase & Co." }
];

export const StockSentimentScoring = () => {
  const [sentimentResult, setSentimentResult] = useState<SentimentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Calculate sentiment score based on percentage change
  const calculateSentimentScore = (changePercent: number): number => {
    if (changePercent >= 3) return 10;
    if (changePercent >= 1) return 5;
    if (changePercent > -1) return 0;
    if (changePercent >= -3) return -5;
    return -10;
  };

  // Get sentiment label and styling
  const getSentimentLabel = (score: number) => {
    if (score >= 30) return { label: "Bullish", color: "bg-green-600", emoji: "🟢" };
    if (score >= 10) return { label: "Cautiously Optimistic", color: "bg-green-400", emoji: "🟢" };
    if (score >= -9) return { label: "Neutral", color: "bg-yellow-500", emoji: "🟡" };
    if (score >= -29) return { label: "Cautiously Bearish", color: "bg-red-400", emoji: "🔴" };
    return { label: "Bearish", color: "bg-red-600", emoji: "🔴" };
  };

  // Fetch stock data and calculate sentiment
  const calculateMarketSentiment = async () => {
    setIsLoading(true);
    try {
      const stockPromises = TOP_10_STOCKS.map(async (stock) => {
        const response = await fetch(`/api/proxy/finnhub/quote?symbol=${stock.symbol}`);
        const data = await response.json();
        
        const changePercent = data.dp || 0;
        const sentimentScore = calculateSentimentScore(changePercent);
        
        return {
          symbol: stock.symbol,
          name: stock.name,
          currentPrice: data.c || 0,
          change: data.d || 0,
          changePercent: changePercent,
          sentimentScore: sentimentScore
        };
      });

      const stockData = await Promise.all(stockPromises);
      
      // Calculate average sentiment score
      const totalSentimentScore = stockData.reduce((sum, stock) => sum + stock.sentimentScore, 0);
      const averageSentimentScore = totalSentimentScore / stockData.length;
      
      // Scale to -50 to +50 range
      const scaledScore = Math.round(averageSentimentScore * 5);
      
      // Calculate average percentage change
      const averageChange = stockData.reduce((sum, stock) => sum + stock.changePercent, 0) / stockData.length;
      
      const sentimentInfo = getSentimentLabel(scaledScore);
      
      setSentimentResult({
        score: scaledScore,
        label: sentimentInfo.label,
        color: sentimentInfo.color,
        emoji: sentimentInfo.emoji,
        stocks: stockData,
        averageChange: averageChange
      });
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error calculating sentiment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    calculateMarketSentiment();
  }, []);

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Stock Market Sentiment Scoring</h2>
          <p className="text-muted-foreground">
            Real-time sentiment analysis of top 10 US stocks with normalized scoring (-50 to +50)
          </p>
        </div>
        <Button onClick={calculateMarketSentiment} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Calculating..." : "Refresh Sentiment"}
        </Button>
      </div>

      {/* Sentiment Score Display */}
      {sentimentResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{sentimentResult.emoji}</span>
              Stock Market Sentiment Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Score */}
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">
                  {sentimentResult.score > 0 ? '+' : ''}{sentimentResult.score}
                </div>
                <Badge className={`${sentimentResult.color} text-white px-4 py-2 text-lg`}>
                  {sentimentResult.label}
                </Badge>
              </div>

              {/* Metrics */}
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Average Price Change</div>
                  <div className={`text-xl font-semibold ${getChangeColor(sentimentResult.averageChange)}`}>
                    {sentimentResult.averageChange > 0 ? '+' : ''}{sentimentResult.averageChange.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Stocks Analyzed</div>
                  <div className="text-xl font-semibold">{sentimentResult.stocks.length}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Last Updated</div>
                  <div className="text-sm">{lastUpdated?.toLocaleTimeString()}</div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="space-y-2">
                <div className="text-sm font-semibold">Scoring Logic</div>
                <div className="text-xs space-y-1">
                  <div>+3% or more → +10 points</div>
                  <div>+1% to +3% → +5 points</div>
                  <div>-1% to +1% → 0 points</div>
                  <div>-1% to -3% → -5 points</div>
                  <div>-3% or less → -10 points</div>
                  <div className="pt-2 border-t">Final score = Average × 5</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Stock Analysis */}
      {sentimentResult && (
        <Card>
          <CardHeader>
            <CardTitle>Individual Stock Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sentimentResult.stocks.map((stock) => (
                <div key={stock.symbol} className="p-4 border rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{stock.symbol}</div>
                      <div className="text-xs text-muted-foreground truncate">{stock.name}</div>
                    </div>
                    {getChangeIcon(stock.changePercent)}
                  </div>
                  
                  <div className="text-lg font-bold">
                    ${stock.currentPrice.toFixed(2)}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className={`text-sm ${getChangeColor(stock.changePercent)}`}>
                      {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </div>
                    <Badge variant={stock.sentimentScore >= 0 ? "default" : "destructive"}>
                      {stock.sentimentScore > 0 ? '+' : ''}{stock.sentimentScore}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Methodology */}
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Scoring Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Data Source</h4>
              <p className="text-sm text-muted-foreground">
                Real-time stock quotes from Finnhub API for the top 10 US stocks by market capitalization.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Calculation Process</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Fetch daily price change percentage for each stock</li>
                <li>Apply sentiment scoring rules based on percentage thresholds</li>
                <li>Calculate average sentiment score across all 10 stocks</li>
                <li>Scale result by factor of 5 to achieve -50 to +50 range</li>
                <li>Apply sentiment labels based on final score ranges</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Sentiment Labels</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                <Badge className="bg-[#E0F2F1] text-[#004D40] border-[#004D40]/20 font-semibold">+30 to +50: Bullish</Badge>
                <Badge className="bg-[#E3F2FD] text-[#0D47A1] border-[#0D47A1]/20 font-semibold">+10 to +29: Cautiously Optimistic</Badge>
                <Badge className="bg-[#EDE7F6] text-[#4527A0] border-[#4527A0]/20 font-semibold">-9 to +9: Neutral</Badge>
                <Badge className="bg-[#FFF3E0] text-[#E65100] border-[#E65100]/20 font-semibold">-10 to -29: Cautiously Bearish</Badge>
                <Badge className="bg-[#FFEBEE] text-[#C62828] border-[#C62828]/20 font-semibold">-30 to -50: Bearish</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};