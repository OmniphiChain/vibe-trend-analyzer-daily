import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Search,
  TrendingUp,
  TrendingDown,
  X,
  Zap,
  Activity,
  Target,
  Flame,
} from "lucide-react";

interface WatchlistModuleProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const WatchlistModule: React.FC<WatchlistModuleProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  // Mock watchlist data
  const watchlistItems = [
    {
      ticker: "AAPL",
      name: "Apple Inc.",
      price: 195.32,
      change: 2.47,
      sentiment: 78,
      color: "green",
    },
    {
      ticker: "TSLA",
      name: "Tesla Inc.",
      price: 248.87,
      change: -1.23,
      sentiment: 42,
      color: "red",
    },
    {
      ticker: "NVDA",
      name: "NVIDIA Corp.",
      price: 785.92,
      change: 5.67,
      sentiment: 92,
      color: "green",
    },
    {
      ticker: "BTC",
      name: "Bitcoin",
      price: 43287,
      change: 3.21,
      sentiment: 65,
      color: "yellow",
    },
  ];

  const getSentimentEmoji = (sentiment: number) => {
    if (sentiment >= 80) return "🚀";
    if (sentiment >= 70) return "😊";
    if (sentiment >= 50) return "😐";
    if (sentiment >= 40) return "😕";
    return "😢";
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return "from-green-400 to-emerald-500";
    if (sentiment >= 50) return "from-yellow-400 to-orange-500";
    return "from-orange-400 to-red-500";
  };

  const getCardGradient = (color: string) => {
    switch (color) {
      case "green":
        return "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20";
      case "red":
        return "from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20";
      case "yellow":
        return "from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20";
      default:
        return "from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20";
    }
  };

  const getSparklineColor = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-400";
      case "red":
        return "bg-red-400";
      case "yellow":
        return "bg-orange-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📋 Your Watchlist
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your favorite assets with real-time sentiment analysis
          </p>
        </div>

        {/* Add to Watchlist */}
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search ticker..."
              className="pl-10 w-48"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            + Add to Watchlist
          </Button>
        </div>
      </div>

      {/* Watchlist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {watchlistItems.map((item, index) => (
          <Card
            key={index}
            className={`relative overflow-hidden border-0 bg-gradient-to-br ${getCardGradient(
              item.color,
            )} hover:shadow-lg transition-all duration-300`}
          >
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </Button>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.ticker}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.name}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">
                    ${item.price.toLocaleString()}
                  </div>
                  <div
                    className={`flex items-center text-sm ${
                      item.change > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.change > 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {item.change > 0 ? "+" : ""}
                    {item.change}%
                  </div>
                </div>
              </div>

              {/* Sentiment Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {getSentimentEmoji(item.sentiment)} Sentiment Score
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {item.sentiment}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${getSentimentColor(
                      item.sentiment,
                    )}`}
                    style={{ width: `${item.sentiment}%` }}
                  ></div>
                </div>
              </div>

              {/* Mini Sparkline Placeholder */}
              <div className="mb-4">
                <div className="flex items-center space-x-1 h-8">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div
                      key={i}
                      className={`${getSparklineColor(
                        item.color,
                      )} w-1 rounded-sm opacity-60`}
                      style={{ height: `${Math.random() * 24 + 8}px` }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* AI Insight */}
              <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    <strong>AI Insight:</strong> {getAIInsight(item.ticker)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Builder.io Integration Note */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-100">
          🧱 Builder.io Integration Ready
        </h3>
        <p className="text-blue-700 dark:text-blue-300 mb-4">
          This Watchlist module is designed as modular Builder.io components
          with the following features:
        </p>
        <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-2">
          <li className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Drag-and-drop asset cards
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Dynamic sentiment scoring with color-coded gradients
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Real-time price integration ready
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            AI insight components with custom logic
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Responsive grid layout for mobile/desktop
          </li>
        </ul>
        <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>API Integration:</strong> Connect to{" "}
            <code>GET /user/watchlist</code> and{" "}
            <code>GET /sentiment?ticker=XYZ</code> for live data
          </p>
        </div>
      </div>
    </div>
  );
};

function getAIInsight(ticker: string): string {
  const insights = {
    AAPL: "Sentiment rising due to strong Q4 earnings and positive guidance for 2024.",
    TSLA: "Mixed sentiment due to production concerns, but innovation pipeline remains strong.",
    NVDA: "Extremely bullish sentiment driven by AI boom and datacenter demand surge.",
    BTC: "Moderate optimism with ETF approval hopes and institutional adoption trends.",
  };
  return (
    insights[ticker as keyof typeof insights] || "Analyzing market sentiment..."
  );
}
