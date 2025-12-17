import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface DiscussedStock {
  id: string;
  symbol: string;
  name: string;
  mentions: number;
  sentiment: number;
  priceChange: number;
  price: number;
  volume: number;
  rank: number;
  changeFromPrevious: number;
}

interface TopDiscussedWidgetProps {
  className?: string;
}

export const TopDiscussedWidget: React.FC<TopDiscussedWidgetProps> = ({
  className,
}) => {
  const [stocks, setStocks] = useState<DiscussedStock[]>([
    {
      id: "1",
      symbol: "NVDA",
      name: "NVIDIA Corp",
      mentions: 1247,
      sentiment: 85,
      priceChange: 3.42,
      price: 875.28,
      volume: 89234567,
      rank: 1,
      changeFromPrevious: 2,
    },
    {
      id: "2",
      symbol: "TSLA",
      name: "Tesla Inc",
      mentions: 892,
      sentiment: 67,
      priceChange: -1.23,
      price: 248.42,
      volume: 45123890,
      rank: 2,
      changeFromPrevious: -1,
    },
    {
      id: "3",
      symbol: "AAPL",
      name: "Apple Inc",
      mentions: 743,
      sentiment: 45,
      priceChange: 0.89,
      price: 182.52,
      volume: 67890123,
      rank: 3,
      changeFromPrevious: 0,
    },
    {
      id: "4",
      symbol: "META",
      name: "Meta Platforms",
      mentions: 567,
      sentiment: -23,
      priceChange: -2.15,
      price: 306.34,
      volume: 23456789,
      rank: 4,
      changeFromPrevious: 3,
    },
    {
      id: "5",
      symbol: "AMD",
      name: "Advanced Micro",
      mentions: 423,
      sentiment: 78,
      priceChange: 2.78,
      price: 142.67,
      volume: 34567890,
      rank: 5,
      changeFromPrevious: -2,
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prev) =>
        prev.map((stock) => ({
          ...stock,
          mentions: Math.max(
            50,
            stock.mentions + Math.floor((Math.random() - 0.4) * 100),
          ),
          sentiment: Math.max(
            -100,
            Math.min(100, stock.sentiment + (Math.random() - 0.5) * 8),
          ),
          priceChange: stock.priceChange + (Math.random() - 0.5) * 2,
        })),
      );
    }, 25000); // Update every 25 seconds

    return () => clearInterval(interval);
  }, []);

  const getPriceChangeColor = (change: number) => {
    return change > 0
      ? "text-green-400"
      : change < 0
        ? "text-red-400"
        : "text-gray-400";
  };

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3 text-green-400" />;
    if (change < 0) return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Activity className="w-3 h-3 text-gray-400" />;
  };

  return (
    <Card
      className={`bg-gradient-to-br from-red-900/30 to-pink-900/30 border-red-500/20 hover:border-red-400/40 transition-all duration-300 overflow-hidden w-full max-w-full rounded-xl ${className || ""}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2 text-lg font-bold">
          💬 Top Discussed
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-[200px] p-4">
        <div className="space-y-3">
          {stocks.map((stock, index) => (
            <div
              key={stock.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-200 cursor-pointer border border-gray-600/20 hover:border-gray-500/50 overflow-hidden"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="text-gray-400 text-sm font-bold w-6">
                    #{index + 1}
                  </div>
                  {getRankChangeIcon(stock.changeFromPrevious)}
                  <span className="text-white font-bold text-lg">
                    ${stock.symbol}
                  </span>
                </div>

                <div
                  className={`text-lg font-medium ${getPriceChangeColor(stock.priceChange)}`}
                >
                  {stock.priceChange > 0 ? "+" : ""}
                  {stock.priceChange.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
