import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { HistoricalData } from "@/data/mockData";

interface TrendChartProps {
  data: HistoricalData[];
}

export const TrendChart = ({ data }: TrendChartProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const chartData = data.map((item) => ({
    ...item,
    formattedDate: formatDate(item.date),
    overall: item.score,
  }));

import { TooltipPayload } from '@/types/common';

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map(
            (entry, index) => (
              <p key={index} style={{ color: entry.color }} className="text-sm">
                {entry.name}: {entry.value}
              </p>
            ),
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          7-Day Mood Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="formattedDate"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="overall"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                name="Overall Score"
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 2,
                }}
              />
              <Line
                type="monotone"
                dataKey="sources.news"
                stroke="hsl(var(--chart-secondary))"
                strokeWidth={2}
                name="News"
                dot={false}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="sources.social"
                stroke="hsl(var(--chart-tertiary))"
                strokeWidth={2}
                name="Social Media"
                dot={false}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="sources.stocks"
                stroke="hsl(var(--chart-quaternary))"
                strokeWidth={2}
                name="Stocks"
                dot={false}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-primary">Overall</div>
            <div className="text-muted-foreground">7-day avg: 70.1</div>
          </div>
          <div className="text-center">
            <div
              className="font-semibold"
              style={{ color: "hsl(var(--chart-secondary))" }}
            >
              News
            </div>
            <div className="text-muted-foreground">7-day avg: 67.4</div>
          </div>
          <div className="text-center">
            <div
              className="font-semibold"
              style={{ color: "hsl(var(--chart-tertiary))" }}
            >
              Social
            </div>
            <div className="text-muted-foreground">7-day avg: 73.3</div>
          </div>
          <div className="text-center">
            <div
              className="font-semibold"
              style={{ color: "hsl(var(--chart-quaternary))" }}
            >
              Stocks
            </div>
            <div className="text-muted-foreground">7-day avg: 69.9</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
