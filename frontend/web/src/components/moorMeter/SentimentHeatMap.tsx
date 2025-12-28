import React, { useState, useRef } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Calendar,
  Download,
  FileBarChart,
  BarChart,
  TrendingUp,
  TrendingDown,
  Zap,
  Activity,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface SentimentData {
  hour: string;
  bullish: number;
  bearish: number;
  netSentiment: number;
  volume: number;
}

interface TickerSentiment {
  ticker: string;
  name: string;
  data: SentimentData[];
  avgSentiment: number;
  trend: "up" | "down" | "neutral";
}

export const SentimentHeatMap: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<"24h" | "7d" | "30d">("24h");
  const [viewMode, setViewMode] = useState<"absolute" | "net">("absolute");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const heatmapRef = useRef<HTMLDivElement>(null);

  const handleTimeFilterChange = async (newFilter: "24h" | "7d" | "30d") => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setTimeFilter(newFilter);
    } catch (err) {
      setError("Failed to load sentiment data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for different time periods
  const generateMockData = (
    period: "24h" | "7d" | "30d",
  ): TickerSentiment[] => {
    const tickers = [
      { ticker: "AAPL", name: "Apple Inc." },
      { ticker: "TSLA", name: "Tesla Inc." },
      { ticker: "NVDA", name: "NVIDIA Corp." },
      { ticker: "BTC", name: "Bitcoin" },
      { ticker: "MSFT", name: "Microsoft Corp." },
      { ticker: "GOOGL", name: "Alphabet Inc." },
    ];

    const periods = {
      "24h": 24,
      "7d": 7,
      "30d": 30,
    };

    return tickers.map(({ ticker, name }) => {
      const dataPoints = periods[period];
      const data: SentimentData[] = [];

      for (let i = 0; i < dataPoints; i++) {
        const bullish = Math.floor(Math.random() * 100) + 10;
        const bearish = Math.floor(Math.random() * 80) + 5;
        const netSentiment = bullish - bearish;
        const volume = bullish + bearish;

        let hour: string;
        if (period === "24h") {
          hour = `${i}:00`;
        } else if (period === "7d") {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          hour = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        } else {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          hour = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        }

        data.push({ hour, bullish, bearish, netSentiment, volume });
      }

      const avgSentiment =
        data.reduce((acc, d) => acc + d.netSentiment, 0) / data.length;
      const trend =
        avgSentiment > 10 ? "up" : avgSentiment < -10 ? "down" : "neutral";

      return { ticker, name, data, avgSentiment, trend };
    });
  };

  const heatmapData = generateMockData(timeFilter);

  const getSentimentColor = (
    value: number,
    maxValue: number,
    isNet: boolean = false,
  ) => {
    if (isNet) {
      const intensity = Math.abs(value) / maxValue;
      if (value > 0) {
        return `bg-green-${Math.ceil(intensity * 9) * 100} bg-opacity-${Math.ceil(intensity * 100)}`;
      } else {
        return `bg-red-${Math.ceil(intensity * 9) * 100} bg-opacity-${Math.ceil(intensity * 100)}`;
      }
    } else {
      const intensity = value / maxValue;
      const opacityLevel = Math.ceil(intensity * 100);
      return value > 50
        ? `bg-green-500 bg-opacity-${Math.min(opacityLevel, 100)}`
        : `bg-red-500 bg-opacity-${Math.min(opacityLevel, 100)}`;
    }
  };

  const getCellValue = (data: SentimentData) => {
    return viewMode === "absolute" ? data.bullish : data.netSentiment;
  };

  const getMaxValue = () => {
    const allValues = heatmapData.flatMap((ticker) =>
      ticker.data.map((d) =>
        viewMode === "absolute" ? d.bullish : Math.abs(d.netSentiment),
      ),
    );
    return Math.max(...allValues);
  };

  const exportToPNG = async () => {
    // Note: This would require html2canvas library in a real implementation
    alert(
      "PNG export functionality would be implemented with html2canvas library",
    );
  };

  const exportToCSV = () => {
    const csvData = heatmapData.map((ticker) => ({
      ticker: ticker.ticker,
      name: ticker.name,
      avgSentiment: ticker.avgSentiment.toFixed(2),
      trend: ticker.trend,
      ...ticker.data.reduce(
        (acc, d, index) => ({
          ...acc,
          [`${d.hour}_bullish`]: d.bullish,
          [`${d.hour}_bearish`]: d.bearish,
          [`${d.hour}_net`]: d.netSentiment,
        }),
        {},
      ),
    }));

    const csv = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sentiment-heatmap-${timeFilter}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const jsonData = {
      timeFilter,
      viewMode,
      timestamp: new Date().toISOString(),
      data: heatmapData,
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sentiment-heatmap-${timeFilter}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const maxValue = getMaxValue();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🔥 Sentiment Heat Map
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize bullish/bearish sentiment intensity across your watchlist
            over time
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Time Filter */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden w-full sm:w-auto">
            {(["24h", "7d", "30d"] as const).map((period) => (
              <Button
                key={period}
                variant={timeFilter === period ? "default" : "ghost"}
                size="sm"
                className={`rounded-none border-0 flex-1 sm:flex-none ${
                  timeFilter === period
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => handleTimeFilterChange(period)}
                disabled={isLoading}
              >
                <Calendar className="w-4 h-4 mr-1" />
                {period}
              </Button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setViewMode(viewMode === "absolute" ? "net" : "absolute")
            }
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            {viewMode === "absolute" ? (
              <ToggleLeft className="w-4 h-4" />
            ) : (
              <ToggleRight className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {viewMode === "absolute" ? "Absolute" : "Net Sentiment"}
            </span>
            <span className="sm:hidden">
              {viewMode === "absolute" ? "Abs" : "Net"}
            </span>
          </Button>

          {/* Export Options */}
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToPNG}
              className="flex-1 sm:flex-none"
            >
              <Download className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">PNG</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              className="flex-1 sm:flex-none"
            >
              <FileBarChart className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">CSV</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToJSON}
              className="flex-1 sm:flex-none"
            >
              <BarChart className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">JSON</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Legend:
              </span>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {viewMode === "absolute" ? "High Bullish" : "Net Positive"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {viewMode === "absolute" ? "High Bearish" : "Net Negative"}
                </span>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              Showing {viewMode} sentiment for {timeFilter}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Activity className="w-4 h-4" />
              <span className="text-sm">{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setError(null)}
                className="ml-auto"
              >
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Heatmap */}
      <Card className="overflow-hidden relative">
        <CardContent className="p-0">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 z-10 flex items-center justify-center">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                <span className="text-sm">Loading sentiment data...</span>
              </div>
            </div>
          )}
          <div ref={heatmapRef} className="overflow-x-auto">
            {/* Time Headers */}
            <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <div className="p-2 sm:p-3 border-r border-gray-200 dark:border-gray-700">
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ticker
                </span>
              </div>
              <div
                className={`grid gap-0.5 sm:gap-1 p-2 sm:p-3 min-w-0 ${
                  timeFilter === "24h"
                    ? "grid-cols-12 sm:grid-cols-24"
                    : timeFilter === "7d"
                      ? "grid-cols-7"
                      : "grid-cols-8 sm:grid-cols-15"
                }`}
              >
                {heatmapData[0]?.data.map((_, index) => {
                  const shouldShow =
                    timeFilter === "24h"
                      ? index % 2 === 0
                      : timeFilter === "30d"
                        ? index % 2 === 0
                        : true;
                  return (
                    <div
                      key={index}
                      className={`text-xs text-center text-gray-600 dark:text-gray-400 min-w-0 truncate ${
                        timeFilter === "24h" && index % 2 !== 0
                          ? "hidden sm:block"
                          : ""
                      } ${
                        timeFilter === "30d" && index % 2 !== 0
                          ? "hidden sm:block"
                          : ""
                      }`}
                    >
                      {heatmapData[0].data[index].hour}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Heatmap Rows */}
            {heatmapData.map((ticker, tickerIndex) => (
              <div
                key={ticker.ticker}
                className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 group"
              >
                {/* Ticker Info */}
                <div className="p-2 sm:p-3 border-r border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                        {ticker.ticker}
                      </span>
                      {ticker.trend === "up" && (
                        <TrendingUp className="w-3 h-3 text-green-500 flex-shrink-0" />
                      )}
                      {ticker.trend === "down" && (
                        <TrendingDown className="w-3 h-3 text-red-500 flex-shrink-0" />
                      )}
                      {ticker.trend === "neutral" && (
                        <Activity className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate hidden sm:block">
                      {ticker.name}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 flex-shrink-0">
                    {ticker.avgSentiment.toFixed(0)}
                  </div>
                </div>

                {/* Sentiment Cells */}
                <div
                  className={`grid gap-0.5 sm:gap-1 p-2 sm:p-3 min-w-0 ${
                    timeFilter === "24h"
                      ? "grid-cols-12 sm:grid-cols-24"
                      : timeFilter === "7d"
                        ? "grid-cols-7"
                        : "grid-cols-8 sm:grid-cols-15"
                  }`}
                >
                  {ticker.data.map((dataPoint, cellIndex) => {
                    const cellValue = getCellValue(dataPoint);
                    const intensity = Math.abs(cellValue) / maxValue;

                    return (
                      <div
                        key={cellIndex}
                        className={`
                          aspect-square rounded-sm border border-gray-200 dark:border-gray-700 
                          cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10
                          ${cellValue > 0 ? `bg-green-500` : `bg-red-500`}
                        `}
                        style={{
                          opacity: Math.max(0.1, intensity),
                          backgroundColor:
                            cellValue > 0
                              ? `rgba(34, 197, 94, ${Math.max(0.1, intensity)})`
                              : `rgba(239, 68, 68, ${Math.max(0.1, intensity)})`,
                        }}
                        title={`${ticker.ticker} at ${dataPoint.hour}: ${
                          viewMode === "absolute"
                            ? `${dataPoint.bullish} bullish, ${dataPoint.bearish} bearish posts`
                            : `Net sentiment: ${dataPoint.netSentiment}`
                        } (Volume: ${dataPoint.volume})`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Most Bullish
                </div>
                <div className="font-bold text-gray-900 dark:text-white">
                  {
                    heatmapData.reduce((max, ticker) =>
                      ticker.avgSentiment > max.avgSentiment ? ticker : max,
                    ).ticker
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Most Bearish
                </div>
                <div className="font-bold text-gray-900 dark:text-white">
                  {
                    heatmapData.reduce((min, ticker) =>
                      ticker.avgSentiment < min.avgSentiment ? ticker : min,
                    ).ticker
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  AI Insight
                </div>
                <div className="font-bold text-gray-900 dark:text-white text-xs">
                  Market sentiment trending{" "}
                  {heatmapData.reduce(
                    (acc, ticker) => acc + ticker.avgSentiment,
                    0,
                  ) /
                    heatmapData.length >
                  0
                    ? "positive"
                    : "negative"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
