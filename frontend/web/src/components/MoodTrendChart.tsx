import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
  Eye,
  EyeOff,
} from "lucide-react";
import { HistoricalData } from "@/data/mockData";

interface MoodTrendChartProps {
  data: HistoricalData[];
}

export const MoodTrendChart = ({ data }: MoodTrendChartProps) => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");
  const [visibleLines, setVisibleLines] = useState({
    overall: true,
    news: true,
    social: true,
    forums: true,
    stocks: true,
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      weekday: "short",
    });
  };

  const chartData = data.map((item) => ({
    ...item,
    formattedDate: formatDate(item.date),
    overall: item.score,
    news: item.sources.news,
    social: item.sources.social,
    forums: item.sources.forums,
    stocks: item.sources.stocks,
  }));

  const toggleLineVisibility = (line: keyof typeof visibleLines) => {
    setVisibleLines((prev) => ({
      ...prev,
      [line]: !prev[line],
    }));
  };

  const getMoodLabel = (score: number) => {
    if (score >= 80) return "Very Bullish";
    if (score >= 70) return "Bullish";
    if (score >= 60) return "Positive";
    if (score >= 50) return "Neutral";
    if (score >= 40) return "Negative";
    if (score >= 30) return "Bearish";
    return "Very Bearish";
  };

  const getMoodColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: any[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const mainScore =
        payload.find((p: any) => p.dataKey === "overall")?.value || 0;
      return (
        <div className="bg-card border rounded-lg p-4 shadow-lg min-w-[200px]">
          <div className="font-semibold text-lg mb-2">{label}</div>
          <div
            className={`text-sm font-medium mb-2 ${getMoodColor(mainScore)}`}
          >
            {getMoodLabel(mainScore)} ({mainScore}/100)
          </div>
          <div className="space-y-1">
            {payload.map(
              (
                entry: { color: string; name: string; value: number },
                index: number,
              ) => (
                <div key={index} className="flex justify-between items-center">
                  <span
                    style={{ color: entry.color }}
                    className="text-sm font-medium"
                  >
                    {entry.name}:
                  </span>
                  <span
                    style={{ color: entry.color }}
                    className="text-sm font-bold"
                  >
                    {entry.value}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const calculateChange = () => {
    if (chartData.length < 2) return 0;
    const current = chartData[chartData.length - 1].overall;
    const previous = chartData[chartData.length - 2].overall;
    return current - previous;
  };

  const calculateAverage = (key: string) => {
    const values = chartData.map(
      (item: { [key: string]: number }) => item[key],
    );
    return (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(
      1,
    );
  };

  const change = calculateChange();
  const isPositive = change >= 0;

  const lineConfigs = [
    {
      key: "overall",
      name: "Overall Score",
      color: "#FF6B6B",
      strokeWidth: 4,
      visible: visibleLines.overall,
    },
    {
      key: "news",
      name: "News",
      color: "#FF5252",
      strokeWidth: 2,
      visible: visibleLines.news,
    },
    {
      key: "social",
      name: "Social Media",
      color: "#FF6B6B",
      strokeWidth: 2,
      visible: visibleLines.social,
    },
    {
      key: "forums",
      name: "Forums",
      color: "#FF8A80",
      strokeWidth: 2,
      visible: visibleLines.forums,
    },
    {
      key: "stocks",
      name: "Stock Market",
      color: "#FFAB91",
      strokeWidth: 2,
      visible: visibleLines.stocks,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-500" />
            7-Day Mood Trend Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant={isPositive ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {isPositive ? "+" : ""}
              {change.toFixed(1)} pts
            </Badge>
            <div className="flex gap-1">
              <Button
                variant={timeRange === "7d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("7d")}
              >
                7D
              </Button>
              <Button
                variant={timeRange === "30d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("30d")}
                disabled
              >
                30D
              </Button>
              <Button
                variant={timeRange === "90d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("90d")}
                disabled
              >
                90D
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Line Visibility Controls */}
        <div className="mb-4 flex flex-wrap gap-2">
          {lineConfigs.map((config) => (
            <Button
              key={config.key}
              variant={config.visible ? "default" : "outline"}
              size="sm"
              onClick={() =>
                toggleLineVisibility(config.key as keyof typeof visibleLines)
              }
              className="flex items-center gap-1"
            >
              {config.visible ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              {config.name}
            </Button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.3}
              />
              <XAxis
                dataKey="formattedDate"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tick={{ textAnchor: "middle" }}
              />
              <YAxis
                domain={[20, 100]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{
                  value: "Sentiment Score",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* Reference lines for sentiment zones */}
              <ReferenceLine
                y={70}
                stroke="#10b981"
                strokeDasharray="8 8"
                opacity={0.5}
              />
              <ReferenceLine
                y={50}
                stroke="#6b7280"
                strokeDasharray="8 8"
                opacity={0.5}
              />
              <ReferenceLine
                y={30}
                stroke="#ef4444"
                strokeDasharray="8 8"
                opacity={0.5}
              />

              {lineConfigs.map(
                (config) =>
                  config.visible && (
                    <Line
                      key={config.key}
                      type="monotone"
                      dataKey={config.key}
                      stroke={config.color}
                      strokeWidth={config.strokeWidth}
                      name={config.name}
                      dot={
                        config.key === "overall"
                          ? {
                              fill: config.color,
                              strokeWidth: 2,
                              r: 4,
                            }
                          : false
                      }
                      activeDot={{
                        r: 6,
                        stroke: config.color,
                        strokeWidth: 2,
                        fill: config.color,
                      }}
                      strokeDasharray={
                        config.key === "overall" ? undefined : "5 5"
                      }
                    />
                  ),
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics Grid */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          {lineConfigs.map((config) => (
            <div
              key={config.key}
              className="text-center p-3 bg-card/50 rounded-lg border"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="font-semibold text-sm">{config.name}</span>
              </div>
              <div
                className="text-lg font-bold"
                style={{ color: config.color }}
              >
                {calculateAverage(config.key)}
              </div>
              <div className="text-xs text-muted-foreground">7-day avg</div>
            </div>
          ))}
        </div>

        {/* Sentiment Zones Legend */}
        <div className="mt-4 flex justify-center">
          <div className="flex gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-green-500"></div>
              <span>Bullish (70+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-gray-500"></div>
              <span>Neutral (30-70)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-red-500"></div>
              <span>Bearish (30-)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Last updated: 5 minutes ago</span>
          </div>
          <span>Data points: {chartData.length * 5}</span>
        </div>
      </CardContent>
    </Card>
  );
};
