import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Activity, TrendingUp, Calendar, BarChart3 } from "lucide-react";

interface MoodTrendChartProps {
  data: Array<{
    date: string;
    score: number;
    stocks: number;
    news: number;
    social: number;
  }>;
  timeframe: "1D" | "7D" | "30D";
  setTimeframe: (timeframe: "1D" | "7D" | "30D") => void;
}

export const MoodTrendChart: React.FC<MoodTrendChartProps> = ({
  data,
  timeframe,
  setTimeframe,
}) => {
  const maxScore = Math.max(
    ...data.map((d) => Math.max(d.score, d.stocks, d.news, d.social)),
  );
  const minScore = Math.min(
    ...data.map((d) => Math.min(d.score, d.stocks, d.news, d.social)),
  );
  const range = maxScore - minScore;

  const normalizeValue = (value: number) => {
    return ((value - minScore) / range) * 100;
  };

  const generatePath = (values: number[]) => {
    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 100 - normalizeValue(value);
      return `${x},${y}`;
    });
    return `M ${points.join(" L ")}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-[#16A34A] dark:text-green-400";
    if (score >= 50) return "text-[#374151] dark:text-yellow-400";
    return "text-[#DC2626] dark:text-red-400";
  };

  const currentScore = data[data.length - 1]?.score || 50;
  const previousScore = data[data.length - 2]?.score || 50;
  const scoreDiff = currentScore - previousScore;

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-800 dark:to-red-900/20">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white" style={{ background: 'linear-gradient(to right, #3A7AFE, #7B61FF)' }}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-white drop-shadow-md" />
            <span className="text-white font-semibold drop-shadow-md">Mood Over Time</span>
            <Badge variant="secondary" className="bg-white/20 text-white" style={{ textShadow: '0 1px 3px rgba(255, 255, 255, 1)' }}>
              Trending
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            {["1D", "7D", "30D"].map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setTimeframe(period as "1D" | "7D" | "30D")}
                className={
                  timeframe === period
                    ? "bg-white/20 text-white drop-shadow-md border-b-2 border-white"
                    : "text-white drop-shadow-md hover:bg-white/10"
                }
              >
                {period}
              </Button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Current Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-[#FAFAFA] dark:bg-gray-800 hover:bg-[#F3F4F6] transition-colors border border-[#E6E6E6] shadow-sm theme-card-background theme-hover theme-border">
            <div
              className={`text-2xl font-bold tracking-tight ${getScoreColor(currentScore)}`}
            >
              {Math.round(currentScore)}
            </div>
            <div className="text-sm text-[#374151] dark:text-gray-400 font-medium">
              Current
            </div>
            <div className="flex items-center justify-center mt-1">
              {scoreDiff >= 0 ? (
                <TrendingUp className="w-3 h-3 text-[#16A34A] mr-1" />
              ) : (
                <TrendingUp className="w-3 h-3 text-[#DC2626] mr-1 rotate-180" />
              )}
              <span
                className={`text-xs font-medium ${scoreDiff >= 0 ? "text-[#16A34A]" : "text-[#DC2626]"}`}
              >
                {scoreDiff >= 0 ? "+" : ""}
                {scoreDiff.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="text-center p-3 rounded-lg bg-[#FAFAFA] dark:bg-blue-900/20 hover:bg-[#F3F4F6] transition-colors border border-[#E6E6E6] shadow-sm theme-card-background theme-hover theme-border">
            <div className="text-2xl font-bold tracking-tight text-[#16A34A] dark:text-blue-400 sentiment-positive">
              {Math.round(data[data.length - 1]?.stocks || 50)}
            </div>
            <div className="text-sm text-[#374151] dark:text-gray-400 font-medium">
              Stocks
            </div>
            <div className="w-full bg-[#E6E6E6] dark:bg-blue-800 rounded-full h-1 mt-2">
              <div
                className="bg-[#16A34A] h-1 rounded-full transition-all duration-300 metric-stocks-progress"
                style={{ width: `${data[data.length - 1]?.stocks || 50}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center p-3 rounded-lg bg-[#FAFAFA] dark:bg-purple-900/20 hover:bg-[#F3F4F6] transition-colors border border-[#E6E6E6] shadow-sm theme-card-background theme-hover theme-border">
            <div className="text-2xl font-bold tracking-tight text-[#7C3AED] dark:text-purple-400 sentiment-positive">
              {Math.round(data[data.length - 1]?.news || 50)}
            </div>
            <div className="text-sm text-[#374151] dark:text-gray-400 font-medium">News</div>
            <div className="w-full bg-[#E6E6E6] dark:bg-purple-800 rounded-full h-1 mt-2">
              <div
                className="bg-[#7C3AED] h-1 rounded-full transition-all duration-300 metric-news-progress"
                style={{ width: `${data[data.length - 1]?.news || 50}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center p-3 rounded-lg bg-[#FAFAFA] dark:bg-indigo-900/20 hover:bg-[#F3F4F6] transition-colors border border-[#E6E6E6] shadow-sm theme-card-background theme-hover theme-border">
            <div className="text-2xl font-bold tracking-tight text-[#DC2626] dark:text-indigo-400 sentiment-negative">
              {Math.round(data[data.length - 1]?.social || 50)}
            </div>
            <div className="text-sm text-[#374151] dark:text-gray-400 font-medium">
              Social
            </div>
            <div className="w-full bg-[#E6E6E6] dark:bg-indigo-800 rounded-full h-1 mt-2">
              <div
                className="bg-[#DC2626] h-1 rounded-full transition-all duration-300 metric-social-progress"
                style={{ width: `${data[data.length - 1]?.social || 50}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="relative">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white mb-2 tracking-tight">
              Sentiment Trend - Last {timeframe}
            </h3>
            <p className="text-sm text-[#9CA3AF] dark:text-gray-400 font-medium">
              Multi-source sentiment analysis over time
            </p>
          </div>

          <div className="relative h-64 bg-white dark:bg-gray-800 rounded-xl p-4 overflow-hidden border border-[#E6E6E6] dark:border-gray-600 theme-background theme-border">
            {/* Grid Lines */}
            <div className="absolute inset-4">
              {[0, 25, 50, 75, 100].map((line) => (
                <div
                  key={line}
                  className="absolute w-full border-t border-[#E5E7EB] dark:border-gray-600 border-dashed chart-gridline"
                  style={{ top: `${100 - line}%` }}
                >
                  <span className="absolute -left-8 -top-2 text-xs font-medium text-[#4B5563] dark:text-gray-400 chart-axis-text">
                    {Math.round(minScore + (line / 100) * range)}
                  </span>
                </div>
              ))}
            </div>

            {/* Chart SVG */}
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* Overall Mood Line */}
              <path
                d={generatePath(data.map((d) => d.score))}
                fill="none"
                stroke="url(#overallGradient)"
                strokeWidth="0.8"
                className="drop-shadow-sm chart-line-overall"
              />

              {/* Stocks Line */}
              <path
                d={generatePath(data.map((d) => d.stocks))}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="0.6"
                strokeDasharray="2,2"
                opacity="0.7"
                className="chart-line-stocks"
              />

              {/* News Line */}
              <path
                d={generatePath(data.map((d) => d.news))}
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="0.6"
                strokeDasharray="2,2"
                opacity="0.7"
                className="chart-line-news"
              />

              {/* Social Line */}
              <path
                d={generatePath(data.map((d) => d.social))}
                fill="none"
                stroke="#6366F1"
                strokeWidth="0.6"
                strokeDasharray="2,2"
                opacity="0.7"
                className="chart-line-social"
              />

              {/* Data Points */}
              {data.map((point, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = 100 - normalizeValue(point.score);
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="1"
                    fill="url(#overallGradient)"
                    className="drop-shadow-sm"
                  />
                );
              })}

              {/* Gradients */}
              <defs>
                <linearGradient
                  id="overallGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: "#10B981", stopOpacity: 1 }}
                  />
                  <stop
                    offset="50%"
                    style={{ stopColor: "#F59E0B", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#EF4444", stopOpacity: 1 }}
                  />
                </linearGradient>
              </defs>
            </svg>

            {/* Date Labels */}
            <div className="absolute bottom-0 left-4 right-4 flex justify-between">
              {data.map((point, index) => {
                if (
                  index % Math.ceil(data.length / 4) === 0 ||
                  index === data.length - 1
                ) {
                  return (
                    <span
                      key={index}
                      className="text-xs font-medium text-[#4B5563] dark:text-gray-400"
                    >
                      {point.date}
                    </span>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 p-3 bg-[#FAFAFA] dark:bg-gray-800 rounded-lg border border-[#E6E6E6] dark:border-gray-600 theme-card-background theme-border">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-gradient-to-r from-green-500 to-red-500 rounded chart-line-overall" style={{backgroundColor: 'var(--color-overall-mood)'}}></div>
              <span className="text-sm text-[#374151] dark:text-gray-400 font-medium">
                Overall Mood
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-blue-500 rounded opacity-70 chart-line-stocks" style={{backgroundColor: 'var(--color-stocks)'}}></div>
              <span className="text-sm text-[#374151] dark:text-gray-400 font-medium">
                Stocks
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-purple-500 rounded opacity-70 chart-line-news" style={{backgroundColor: 'var(--color-news)'}}></div>
              <span className="text-sm text-[#374151] dark:text-gray-400 font-medium">
                News
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-indigo-500 rounded opacity-70 chart-line-social" style={{backgroundColor: 'var(--color-social)'}}></div>
              <span className="text-sm text-[#374151] dark:text-gray-400 font-medium">
                Social
              </span>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-6 p-4 bg-[#F9FAFB] dark:bg-gradient-to-r dark:from-[#3A7AFE] dark:to-[#7B61FF] dark:text-white rounded-lg border border-[#E6E6E6] border-l-4 border-l-[#3A7AFE] dark:border-green-700 shadow-sm theme-card-background theme-border">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="w-4 h-4 text-blue-500 dark:text-white drop-shadow-md" />
            <span className="font-medium text-[#1A1A1A] dark:text-[#F4F4F6] dark:drop-shadow-md">
              Trend Analysis
            </span>
          </div>
          <p className="text-sm text-[#374151] dark:text-[#F4F4F6] dark:drop-shadow-md font-medium">
            {scoreDiff > 5
              ? "Strong positive momentum detected. Market sentiment is improving across multiple sources."
              : scoreDiff < -5
                ? "Declining sentiment trend. Increased caution recommended as multiple indicators show bearish signals."
                : "Stable sentiment range. Market mood remains relatively unchanged with minor fluctuations."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTrendChart;
