import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  Star,
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  Search,
  Target,
} from "lucide-react";

interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sentiment: number;
  addedDate: Date;
}

export const WatchlistWidget: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingStock, setIsAddingStock] = useState(false);

  // Mock watchlist data
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 175.43,
      change: 2.34,
      changePercent: 1.35,
      sentiment: 72,
      addedDate: new Date("2024-01-15"),
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      price: 348.1,
      change: -1.23,
      changePercent: -0.35,
      sentiment: 68,
      addedDate: new Date("2024-01-20"),
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 142.56,
      change: -3.44,
      changePercent: -2.36,
      sentiment: 45,
      addedDate: new Date("2024-02-01"),
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      price: 248.87,
      change: 8.23,
      changePercent: 3.42,
      sentiment: 78,
      addedDate: new Date("2024-02-10"),
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      price: 722.48,
      change: 15.67,
      changePercent: 2.22,
      sentiment: 82,
      addedDate: new Date("2024-02-15"),
    },
  ]);

  // Mock search suggestions
  const searchSuggestions = [
    { symbol: "META", name: "Meta Platforms Inc." },
    { symbol: "AMZN", name: "Amazon.com Inc." },
    { symbol: "NFLX", name: "Netflix Inc." },
    { symbol: "AMD", name: "Advanced Micro Devices" },
    { symbol: "CRM", name: "Salesforce Inc." },
  ].filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return "text-green-600 dark:text-green-400";
    if (sentiment >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getSentimentBadge = (sentiment: number) => {
    if (sentiment >= 70)
      return {
        label: "😊",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
      };
    if (sentiment >= 50)
      return {
        label: "😐",
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
      };
    return {
      label: "😕",
      color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
    };
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist((prev) => prev.filter((item) => item.symbol !== symbol));
  };

  const addToWatchlist = (suggestion: (typeof searchSuggestions)[0]) => {
    const newItem: WatchlistItem = {
      symbol: suggestion.symbol,
      name: suggestion.name,
      price: 100 + Math.random() * 200,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      sentiment: 30 + Math.random() * 60,
      addedDate: new Date(),
    };
    setWatchlist((prev) => [...prev, newItem]);
    setSearchQuery("");
    setIsAddingStock(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-800 dark:via-gray-800 dark:to-indigo-900/20">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white dark:from-blue-600 dark:to-indigo-600 light:from-[#3F51B5] light:to-[#2196F3] light:text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span className="text-sm">Watchlist</span>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {watchlist.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => setIsAddingStock(!isAddingStock)}
          >
            {isAddingStock ? (
              <X className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        {/* Add Stock Section */}
        {isAddingStock && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {searchQuery && searchSuggestions.length > 0 && (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {searchSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.symbol}
                    className="flex items-center justify-between p-2 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer transition-colors"
                    onClick={() => addToWatchlist(suggestion)}
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {suggestion.symbol}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {suggestion.name}
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-blue-500" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Watchlist Items */}
        <div className="space-y-3">
          {watchlist.length === 0 ? (
            <div className="text-center py-8">
              <Star className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Your watchlist is empty
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingStock(true)}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Stocks
              </Button>
            </div>
          ) : (
            watchlist.map((item) => {
              const sentimentBadge = getSentimentBadge(item.sentiment);

              return (
                <div
                  key={item.symbol}
                  className="group p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-800"
                >
                  {/* Stock Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                        {item.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {item.symbol}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-20">
                          {item.name.split(" ")[0]}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                      onClick={() => removeFromWatchlist(item.symbol)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Price Info */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.price)}
                    </div>
                    <div className="flex items-center space-x-1">
                      {item.change >= 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span
                        className={`text-xs font-medium ${item.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                      >
                        {item.change >= 0 ? "+" : ""}
                        {item.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Sentiment */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Sentiment:
                      </div>
                      <Badge className={`text-xs ${sentimentBadge.color}`}>
                        {sentimentBadge.label} {Math.round(item.sentiment)}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-400">
                      Added {item.addedDate.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Watchlist Stats */}
        {watchlist.length > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {watchlist.filter((item) => item.change >= 0).length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Gainers
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {Math.round(
                    watchlist.reduce((sum, item) => sum + item.sentiment, 0) /
                      watchlist.length,
                  )}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Avg Sentiment
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 space-y-2">
          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <Target className="w-3 h-3 mr-2" />
            Optimize Portfolio
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            View Full Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WatchlistWidget;
