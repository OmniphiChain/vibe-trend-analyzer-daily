import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  Heart,
  TrendingUp,
  TrendingDown,
  Target,
  Settings,
  Zap,
} from "lucide-react";

export const PersonalMoodCard: React.FC = () => {
  const [personalScore] = useState(67); // Mock personal mood score

  // Mock watchlist stocks
  const watchlistStocks = [
    { symbol: "AAPL", sentiment: 72, weight: 25 },
    { symbol: "MSFT", sentiment: 68, weight: 20 },
    { symbol: "GOOGL", sentiment: 45, weight: 20 },
    { symbol: "TSLA", sentiment: 78, weight: 15 },
    { symbol: "NVDA", sentiment: 82, weight: 20 },
  ];

  const getMoodEmoji = (score: number) => {
    if (score >= 80) return "🚀";
    if (score >= 70) return "😄";
    if (score >= 60) return "😊";
    if (score >= 50) return "😐";
    if (score >= 40) return "😕";
    return "😢";
  };

  const getMoodLabel = (score: number) => {
    if (score >= 80) return "Euphoric";
    if (score >= 70) return "Bullish";
    if (score >= 60) return "Optimistic";
    if (score >= 50) return "Neutral";
    if (score >= 40) return "Cautious";
    return "Bearish";
  };

  const getMoodColor = (score: number) => {
    if (score >= 70) return "from-green-400 to-emerald-600";
    if (score >= 50) return "from-yellow-400 to-orange-500";
    return "from-red-400 to-red-600";
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return "text-green-600 dark:text-green-400";
    if (sentiment >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-pink-900/20">
      <CardHeader className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5" />
            <span className="text-sm">Your Mood</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {/* Personal Score Display */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 flex items-center justify-center mb-3 mx-auto">
              <div className="text-3xl">{getMoodEmoji(personalScore)}</div>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
          </div>

          <div className="text-3xl font-bold text-[#111827] dark:text-transparent dark:bg-gradient-to-r dark:from-pink-600 dark:to-purple-600 dark:bg-clip-text mb-1">
            {personalScore}
          </div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {getMoodLabel(personalScore)}
          </div>

          <Progress
            value={personalScore}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700"
          />
        </div>

        {/* Watchlist Impact */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Watchlist Impact
            </h4>
            <Badge variant="outline" className="text-xs">
              {watchlistStocks.length} stocks
            </Badge>
          </div>

          {watchlistStocks.map((stock) => (
            <div
              key={stock.symbol}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {stock.symbol.slice(0, 2)}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {stock.symbol}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {stock.weight}%
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm font-medium ${getSentimentColor(stock.sentiment)}`}
                >
                  {stock.sentiment}
                </span>
                {stock.sentiment >= 60 ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : stock.sentiment <= 40 ? (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mood Breakdown */}
        <div className="space-y-3 mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Mood Breakdown
          </h4>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Portfolio Sentiment
              </span>
              <span className="font-medium text-pink-600 dark:text-pink-400">
                72%
              </span>
            </div>
            <Progress value={72} className="h-1.5" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                News Impact
              </span>
              <span className="font-medium text-purple-600 dark:text-purple-400">
                58%
              </span>
            </div>
            <Progress value={58} className="h-1.5" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Social Buzz
              </span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                75%
              </span>
            </div>
            <Progress value={75} className="h-1.5" />
          </div>
        </div>

        {/* Insights */}
        <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg border border-pink-200 dark:border-pink-700">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-4 h-4 text-pink-600" />
            <span className="text-sm font-medium text-pink-800 dark:text-pink-300">
              Personal Insight
            </span>
          </div>
          <p className="text-xs text-pink-700 dark:text-pink-400">
            Your tech-heavy portfolio is driving positive sentiment. NVDA and
            TSLA are showing strong momentum. Consider monitoring GOOGL closely
            as it's impacting your overall mood.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-4 space-y-2">
          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <Target className="w-3 h-3 mr-2" />
            Customize Weights
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            View Portfolio Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalMoodCard;
