import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { TrendingUp, TrendingDown, Brain, Zap, Activity } from "lucide-react";

interface MarketSentiment {
  percentage: number;
  label: "Bullish" | "Bearish" | "Neutral";
  change: number;
  confidence: number;
  lastUpdated: Date;
}

interface AISummaryWidgetProps {
  className?: string;
}

export const AISummaryWidget: React.FC<AISummaryWidgetProps> = ({
  className,
}) => {
  const [sentiment, setSentiment] = useState<MarketSentiment>({
    percentage: 73,
    label: "Bullish",
    change: 5.2,
    confidence: 87,
    lastUpdated: new Date(),
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);
      setTimeout(() => {
        setSentiment((prev) => ({
          ...prev,
          percentage: Math.max(
            20,
            Math.min(90, prev.percentage + (Math.random() - 0.5) * 4),
          ),
          change: (Math.random() - 0.5) * 10,
          confidence: Math.max(
            60,
            Math.min(95, prev.confidence + (Math.random() - 0.5) * 6),
          ),
          lastUpdated: new Date(),
        }));
        setIsUpdating(false);
      }, 500);
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const getSentimentColor = (percentage: number) => {
    if (percentage >= 70) return "from-green-500 to-emerald-600";
    if (percentage >= 50) return "from-blue-500 to-cyan-600";
    return "from-red-500 to-rose-600";
  };

  const getSentimentLabel = (percentage: number): MarketSentiment["label"] => {
    if (percentage >= 60) return "Bullish";
    if (percentage >= 40) return "Neutral";
    return "Bearish";
  };

  const getBadgeColor = (label: string) => {
    switch (label) {
      case "Bullish":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Bearish":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const currentSentimentLabel = getSentimentLabel(sentiment.percentage);

  return (
    <Card
      className={`bg-gradient-to-br ${getSentimentColor(sentiment.percentage)}/20 border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 overflow-hidden w-full max-w-full rounded-xl ${className || ""}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2 text-lg font-bold">
          🤖 AI Summary
          {isUpdating && (
            <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
          )}
        </CardTitle>
        <div className="text-sm text-blue-200">Market Sentiment Analysis</div>
      </CardHeader>
      <CardContent className="space-y-3 overflow-y-auto max-h-[200px] p-4">
        <div className="text-center space-y-3">
          <div className="relative px-4 overflow-hidden">
            <div className="text-[clamp(1.25rem,4vw,2.25rem)] font-bold text-white mb-1 w-full text-center truncate">
              {sentiment.percentage.toFixed(2)}%
            </div>
            <div className="text-[clamp(0.875rem,2.5vw,1.25rem)] font-semibold text-white/90 truncate">
              {currentSentimentLabel}
            </div>

            {/* Animated indicator */}
            <div className="absolute top-0 right-0">
              <div
                className={`w-3 h-3 rounded-full ${
                  currentSentimentLabel === "Bullish"
                    ? "bg-green-400"
                    : currentSentimentLabel === "Bearish"
                      ? "bg-red-400"
                      : "bg-blue-400"
                } animate-pulse`}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                sentiment.change > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {sentiment.change > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="whitespace-nowrap">
                {sentiment.change > 0 ? "+" : ""}
                {sentiment.change.toFixed(2)}% from yesterday
              </span>
            </div>
          </div>

          <Badge
            className={`${getBadgeColor(currentSentimentLabel)} text-sm px-3 py-1`}
          >
            {sentiment.confidence >= 85
              ? "Strong"
              : sentiment.confidence >= 70
                ? "Moderate"
                : "Weak"}{" "}
            {currentSentimentLabel}
          </Badge>
        </div>

        {/* Confidence meter */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-blue-200 overflow-hidden">
            <span className="truncate">AI Confidence</span>
            <span className="whitespace-nowrap">
              {sentiment.confidence.toFixed(2)}%
            </span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${
                sentiment.confidence >= 80
                  ? "from-green-400 to-emerald-500"
                  : sentiment.confidence >= 60
                    ? "from-yellow-400 to-orange-500"
                    : "from-red-400 to-rose-500"
              }`}
              style={{ width: `${sentiment.confidence}%` }}
            />
          </div>
        </div>

        {/* Key insights */}
        <div className="space-y-2 pt-2 border-t border-blue-500/20">
          <div className="text-[10px] text-blue-200 font-medium mb-1">
            Key Insights:
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-white/80 flex items-center gap-2">
              <Brain className="w-3 h-3 text-blue-400" />
              {currentSentimentLabel === "Bullish"
                ? "Strong buying momentum across tech sector"
                : currentSentimentLabel === "Bearish"
                  ? "Risk-off sentiment dominates market"
                  : "Mixed signals from institutional traders"}
            </div>
            <div className="text-[10px] text-white/80 flex items-center gap-2">
              <Activity className="w-3 h-3 text-green-400" />
              Social sentiment:{" "}
              {sentiment.percentage > 60
                ? "Positive"
                : sentiment.percentage > 40
                  ? "Neutral"
                  : "Negative"}{" "}
              trend
            </div>
          </div>
        </div>

        <div className="text-xs text-blue-300/60 text-center">
          Last updated: {sentiment.lastUpdated.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};
