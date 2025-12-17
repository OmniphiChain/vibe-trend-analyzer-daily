import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Info,
  PieChart,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SentimentSource } from "@/data/mockData";
import { SourceNewsModal } from "./SourceNewsModal";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface SentimentBreakdownProps {
  sources: SentimentSource[];
  sourceExplanations?: { [key: string]: string };
}

export const SentimentBreakdown = ({
  sources,
  sourceExplanations,
}: SentimentBreakdownProps) => {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "pie" | "bar">("list");

  const handleSourceClick = (sourceName: string) => {
    setSelectedSource(sourceName);
    setIsModalOpen(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "border-l-green-500 bg-green-500/5";
    if (score >= 70) return "border-l-emerald-500 bg-emerald-500/5";
    if (score >= 60) return "border-l-yellow-500 bg-yellow-500/5";
    if (score >= 50) return "border-l-orange-400 bg-orange-400/5";
    if (score >= 40) return "border-l-red-400 bg-red-400/5";
    return "border-l-red-600 bg-red-600/5";
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600 dark:text-green-400";
    if (change < 0) return "text-red-600 dark:text-red-400";
    return "text-muted-foreground";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "bg-gradient-to-r from-green-500 to-emerald-400";
    if (score >= 70) return "bg-gradient-to-r from-emerald-500 to-green-400";
    if (score >= 60) return "bg-gradient-to-r from-yellow-500 to-amber-400";
    if (score >= 50) return "bg-gradient-to-r from-orange-400 to-yellow-400";
    if (score >= 40) return "bg-gradient-to-r from-red-400 to-orange-400";
    return "bg-gradient-to-r from-red-600 to-red-400";
  };

  // Data for charts
  const pieData = sources.map((source, index) => ({
    name: source.name,
    value: source.score,
    fill: getChartColor(source.score, index),
    samples: source.samples,
  }));

  const barData = sources.map((source) => ({
    name: source.name.replace(" ", "\n"),
    score: source.score,
    change: source.change,
    samples: source.samples,
  }));

  function getChartColor(score: number, index: number) {
    const colors = {
      high: "#10b981", // green
      medium: "#f59e0b", // yellow
      low: "#ef4444", // red
    };

    if (score >= 70) return colors.high;
    if (score >= 50) return colors.medium;
    return colors.low;
  }

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    name: string;
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Sentiment by Source
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "pie" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("pie")}
              >
                <PieChart className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "bar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("bar")}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {viewMode === "list" && (
            <div className="space-y-4">
              {sources.map((source, index) => (
                <div
                  key={index}
                  onClick={() => handleSourceClick(source.name)}
                  className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:border-primary/50 ${getScoreColor(source.score)}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{source.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                            {source.name}
                            {source.name === "Stock Market" && (
                              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">LIVE</span>
                            )}
                          </h3>
                          {sourceExplanations?.[
                            source.name.toLowerCase().replace(" ", "")
                          ] && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="text-sm">
                                  {
                                    sourceExplanations[
                                      source.name.toLowerCase().replace(" ", "")
                                    ]
                                  }
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {source.samples.toLocaleString()} samples analyzed
                          {source.name === "Stock Market" && " (Real-time top 10 stocks)"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{source.score}</div>
                      <div
                        className={`flex items-center gap-1 text-sm font-semibold ${getChangeColor(source.change)}`}
                      >
                        {source.change > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : source.change < 0 ? (
                          <TrendingDown className="h-4 w-4" />
                        ) : null}
                        {source.change > 0 ? "+" : ""}
                        {source.change.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-muted/50 rounded-full h-3 mb-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${getScoreGradient(source.score)} shadow-sm`}
                      style={{
                        width: `${source.score}%`,
                        boxShadow: `0 0 8px ${source.score >= 70 ? "#10b981" : source.score >= 50 ? "#f59e0b" : "#ef4444"}30`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Click for detailed analysis</span>
                    <Badge variant="outline" className="text-xs">
                      {source.score >= 70
                        ? "Positive"
                        : source.score >= 50
                          ? "Neutral"
                          : "Negative"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === "pie" && (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleSourceClick(entry.name)}
                      />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.fill }}
                    />
                    <span className="text-sm">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === "bar" && (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <Bar
                    dataKey="score"
                    radius={[4, 4, 0, 0]}
                    className="cursor-pointer"
                    onClick={(data) => handleSourceClick(data.name)}
                  >
                    {barData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getChartColor(entry.score, index)}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Data Sources Active</span>
              <Badge variant="secondary">{sources.length} Active</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Data Points</span>
              <Badge variant="outline">
                {sources
                  .reduce((sum, source) => sum + source.samples, 0)
                  .toLocaleString()}
              </Badge>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Real-time analysis • AI-powered sentiment detection • Updated
              every 5 minutes
            </div>
          </div>
        </CardContent>

        <SourceNewsModal
          sourceName={selectedSource}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </Card>
    </TooltipProvider>
  );
};
