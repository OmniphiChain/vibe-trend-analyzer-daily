import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface SentimentHeatMapProps {
  onRefresh?: () => void;
}

export const SentimentHeatMap: React.FC<SentimentHeatMapProps> = ({
  onRefresh,
}) => {
  // State management
  const [sentimentTimeframe, setSentimentTimeframe] = useState<
    "24h" | "7d" | "30d"
  >("24h");
  const [sentimentViewMode, setSentimentViewMode] = useState<
    "absolute" | "net"
  >("absolute");
  const [hoveredCell, setHoveredCell] = useState<{
    ticker: string;
    time: string;
    data: any;
  } | null>(null);

  // Generate sentiment data based on timeframe
  const generateSentimentData = (timeframe: "24h" | "7d" | "30d") => {
    const watchlistTickers = [
      "AAPL",
      "MSFT",
      "GOOGL",
      "AMZN",
      "NVDA",
      "TSLA",
      "META",
      "JPM",
    ];

    const getTimePoints = () => {
      switch (timeframe) {
        case "24h":
          return Array.from({ length: 24 }, (_, i) => {
            const hour = new Date();
            hour.setHours(hour.getHours() - (23 - i));
            return hour.getHours() + ":00";
          });
        case "7d":
          return Array.from({ length: 7 }, (_, i) => {
            const day = new Date();
            day.setDate(day.getDate() - (6 - i));
            return day.toLocaleDateString("en-US", { weekday: "short" });
          });
        case "30d":
          return Array.from({ length: 30 }, (_, i) => {
            const day = new Date();
            day.setDate(day.getDate() - (29 - i));
            return day.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          });
      }
    };

    const timePoints = getTimePoints();

    return watchlistTickers.map((ticker) => ({
      ticker,
      data: timePoints.map((time) => {
        const bullishCount = Math.floor(Math.random() * 50) + 5;
        const bearishCount = Math.floor(Math.random() * 30) + 2;
        const netSentiment = bullishCount - bearishCount;
        const totalVolume = bullishCount + bearishCount;
        const intensity = Math.min(totalVolume / 50, 1);

        return {
          time,
          bullish: bullishCount,
          bearish: bearishCount,
          net: netSentiment,
          total: totalVolume,
          intensity,
          dominantSentiment:
            bullishCount > bearishCount ? "bullish" : "bearish",
          ratio: bullishCount / (bullishCount + bearishCount),
        };
      }),
    }));
  };

  const sentimentHeatmapData = generateSentimentData(sentimentTimeframe);

  // Export functions
  const exportHeatmapAsPNG = () => {
    console.log("Exporting heatmap as PNG...");
    const link = document.createElement("a");
    link.download = `sentiment-heatmap-${sentimentTimeframe}.png`;
    link.href =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
    link.click();
  };

  const exportHeatmapAsCSV = () => {
    const headers = ["Ticker", "Time", "Bullish", "Bearish", "Net", "Total"];
    const rows = sentimentHeatmapData.flatMap((ticker) =>
      ticker.data.map((point) => [
        ticker.ticker,
        point.time,
        point.bullish,
        point.bearish,
        point.net,
        point.total,
      ]),
    );

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `sentiment-heatmap-${sentimentTimeframe}.csv`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportHeatmapAsJSON = () => {
    const jsonData = {
      timeframe: sentimentTimeframe,
      viewMode: sentimentViewMode,
      exportDate: new Date().toISOString(),
      data: sentimentHeatmapData,
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `sentiment-heatmap-${sentimentTimeframe}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Card with Controls */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              📊 Sentiment HeatMap
              <Badge variant="secondary" className="text-xs">
                Watchlist
              </Badge>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Bullish/bearish sentiment intensity over time for your watchlist
              tickers
            </p>
          </div>

          {/* Export Buttons */}
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={exportHeatmapAsPNG}>
              📷 PNG
            </Button>
            <Button variant="outline" size="sm" onClick={exportHeatmapAsCSV}>
              📋 CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportHeatmapAsJSON}>
              📄 JSON
            </Button>
            <Button variant="outline" size="sm" onClick={onRefresh}>
              🔄 Refresh
            </Button>
          </div>
        </div>

        {/* Time Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Range
            </label>
            <div className="flex space-x-2">
              {(["24h", "7d", "30d"] as const).map((timeframe) => (
                <Button
                  key={timeframe}
                  variant={
                    sentimentTimeframe === timeframe ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSentimentTimeframe(timeframe)}
                  className="flex-1"
                >
                  {timeframe}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              View Mode
            </label>
            <div className="flex space-x-2">
              {(["absolute", "net"] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={sentimentViewMode === mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSentimentViewMode(mode)}
                  className="flex-1 capitalize"
                >
                  {mode}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                alert(
                  "AI Summary: Overall watchlist sentiment is trending bullish with NVDA showing strongest positive momentum. TSLA showing mixed signals with increased volatility.",
                );
              }}
              className="w-full"
            >
              🤖 AI Summary
            </Button>
          </div>
        </div>

        {/* Sentiment Heatmap Grid */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <div className="overflow-x-auto">
            <div className="min-w-max">
              {/* Time Headers */}
              <div className="flex mb-2">
                <div className="w-16 text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
                  Ticker
                </div>
                <div className="w-16 text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
                  Trend
                </div>
                {sentimentHeatmapData[0]?.data.map((point, i) => (
                  <div
                    key={i}
                    className="w-12 text-xs font-medium text-gray-500 dark:text-gray-400 py-2 text-center"
                  >
                    {point.time}
                  </div>
                ))}
              </div>

              {/* Heatmap Rows */}
              {sentimentHeatmapData.map((ticker) => (
                <div key={ticker.ticker} className="flex items-center mb-1">
                  {/* Ticker Symbol */}
                  <div className="w-16 text-sm font-semibold text-gray-900 dark:text-white py-1">
                    ${ticker.ticker}
                  </div>

                  {/* Mini Sparkline */}
                  <div className="w-16 px-1">
                    <div className="h-6 flex items-end space-x-px">
                      {ticker.data.slice(-8).map((point, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-sm ${
                            point.dominantSentiment === "bullish"
                              ? "bg-green-400"
                              : "bg-red-400"
                          }`}
                          style={{
                            height: `${Math.max(2, point.intensity * 20)}px`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Sentiment Cells */}
                  {ticker.data.map((point, i) => {
                    const cellValue =
                      sentimentViewMode === "absolute"
                        ? point.total
                        : point.net;
                    const intensity =
                      sentimentViewMode === "absolute"
                        ? point.intensity
                        : Math.abs(point.net) / 50;

                    const cellColor =
                      sentimentViewMode === "absolute"
                        ? point.dominantSentiment === "bullish"
                          ? `rgba(34, 197, 94, ${0.3 + intensity * 0.7})`
                          : `rgba(239, 68, 68, ${0.3 + intensity * 0.7})`
                        : point.net > 0
                          ? `rgba(34, 197, 94, ${0.3 + intensity * 0.7})`
                          : `rgba(239, 68, 68, ${0.3 + intensity * 0.7})`;

                    return (
                      <div
                        key={i}
                        className="w-12 h-8 cursor-pointer border border-gray-200 dark:border-gray-600 flex items-center justify-center text-xs font-medium transition-all duration-200 hover:scale-110"
                        style={{ backgroundColor: cellColor }}
                        onMouseEnter={() =>
                          setHoveredCell({
                            ticker: ticker.ticker,
                            time: point.time,
                            data: point,
                          })
                        }
                        onMouseLeave={() => setHoveredCell(null)}
                        title={`${ticker.ticker} at ${point.time}: ${point.bullish} bullish, ${point.bearish} bearish posts`}
                      >
                        {Math.abs(cellValue)}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <div className="bg-gray-900 text-white text-xs rounded-lg p-3 mb-4 border-l-4 border-blue-500">
            <div className="font-semibold">
              ${hoveredCell.ticker} at {hoveredCell.time}
            </div>
            <div className="space-y-1 mt-1">
              <div>🟢 Bullish: {hoveredCell.data.bullish} posts</div>
              <div>🔴 Bearish: {hoveredCell.data.bearish} posts</div>
              <div>
                📊 Net: {hoveredCell.data.net > 0 ? "+" : ""}
                {hoveredCell.data.net}
              </div>
              <div>📈 Total Volume: {hoveredCell.data.total}</div>
              <div>
                🎯 Ratio: {(hoveredCell.data.ratio * 100).toFixed(1)}% bullish
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Strong Bullish
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-300 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Bullish
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-300 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Bearish
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Strong Bearish
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Intensity = Volume |{" "}
              {sentimentViewMode === "absolute"
                ? "Color = Dominant"
                : "Color = Net"}{" "}
              Sentiment
            </span>
          </div>
        </div>
      </Card>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            📊 Sentiment Overview
          </h3>
          <div className="space-y-3">
            {(() => {
              const totalBullish = sentimentHeatmapData.reduce(
                (sum, ticker) =>
                  sum + ticker.data.reduce((s, point) => s + point.bullish, 0),
                0,
              );
              const totalBearish = sentimentHeatmapData.reduce(
                (sum, ticker) =>
                  sum + ticker.data.reduce((s, point) => s + point.bearish, 0),
                0,
              );
              const total = totalBullish + totalBearish;

              return (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Bullish Posts
                    </span>
                    <span className="font-semibold text-green-600">
                      {totalBullish} (
                      {((totalBullish / total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Bearish Posts
                    </span>
                    <span className="font-semibold text-red-600">
                      {totalBearish} (
                      {((totalBearish / total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Net Sentiment
                    </span>
                    <span
                      className={`font-semibold ${totalBullish > totalBearish ? "text-green-600" : "text-red-600"}`}
                    >
                      {totalBullish > totalBearish ? "+" : ""}
                      {totalBullish - totalBearish}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            🏆 Most Bullish
          </h3>
          <div className="space-y-2">
            {sentimentHeatmapData
              .map((ticker) => ({
                ticker: ticker.ticker,
                totalBullish: ticker.data.reduce(
                  (sum, point) => sum + point.bullish,
                  0,
                ),
                ratio:
                  ticker.data.reduce((sum, point) => sum + point.bullish, 0) /
                  ticker.data.reduce((sum, point) => sum + point.total, 0),
              }))
              .sort((a, b) => b.totalBullish - a.totalBullish)
              .slice(0, 3)
              .map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="font-medium">${item.ticker}</span>
                  <span className="text-green-600 font-semibold">
                    {item.totalBullish} ({(item.ratio * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            📉 Most Bearish
          </h3>
          <div className="space-y-2">
            {sentimentHeatmapData
              .map((ticker) => ({
                ticker: ticker.ticker,
                totalBearish: ticker.data.reduce(
                  (sum, point) => sum + point.bearish,
                  0,
                ),
                ratio:
                  ticker.data.reduce((sum, point) => sum + point.bearish, 0) /
                  ticker.data.reduce((sum, point) => sum + point.total, 0),
              }))
              .sort((a, b) => b.totalBearish - a.totalBearish)
              .slice(0, 3)
              .map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="font-medium">${item.ticker}</span>
                  <span className="text-red-600 font-semibold">
                    {item.totalBearish} ({(item.ratio * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            🔥 Highest Activity
          </h3>
          <div className="space-y-2">
            {sentimentHeatmapData
              .map((ticker) => ({
                ticker: ticker.ticker,
                totalVolume: ticker.data.reduce(
                  (sum, point) => sum + point.total,
                  0,
                ),
              }))
              .sort((a, b) => b.totalVolume - a.totalVolume)
              .slice(0, 3)
              .map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="font-medium">${item.ticker}</span>
                  <span className="font-semibold text-blue-600">
                    {item.totalVolume} posts
                  </span>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Builder.io Integration Note */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-100">
          🧱 Builder.io Sentiment HeatMap
        </h3>
        <p className="text-blue-700 dark:text-blue-300 mb-4">
          This Sentiment HeatMap is designed as a modular Builder.io component
          with advanced features:
        </p>
        <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-2">
          <li className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Watchlist integration with real-time sentiment analysis
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Time-series heatmap with 24h/7d/30d views
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Export functionality (PNG, CSV, JSON)
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Interactive tooltips and sparkline trends
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            AI-powered sentiment summaries and insights
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Absolute vs Net sentiment view modes
          </li>
        </ul>
        <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>API Integration:</strong> Connect to{" "}
            <code>GET /api/watchlist/sentiment</code>,{" "}
            <code>GET /api/posts/sentiment?ticker=XYZ</code>, and{" "}
            <code>POST /api/ai/summary</code> for live data
          </p>
        </div>
      </div>
    </div>
  );
};
