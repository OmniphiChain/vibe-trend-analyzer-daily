import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Bot,
  TrendingUp,
  TrendingDown,
  Clock,
  RefreshCw,
  BarChart3,
  Users,
  MessageSquare,
  AlertCircle,
  Sparkles,
  Target,
  Flame,
  Eye,
} from "lucide-react";

interface TickerSentiment {
  ticker: string;
  mentions: number;
  bullishPercent: number;
  bearishPercent: number;
  sentimentChange: number;
  avgPrice: number;
  topIdea: string;
}

interface SummaryData {
  timestamp: Date;
  totalMessages: number;
  activeUsers: number;
  topTickers: TickerSentiment[];
  marketSentiment: "bullish" | "bearish" | "neutral";
  sentimentScore: number;
  keyInsights: string[];
  trendingTopics: string[];
  riskLevel: "low" | "medium" | "high";
}

export const AISummaryWidget: React.FC = () => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Mock AI summary data
  const mockSummaryData: SummaryData = {
    timestamp: new Date(),
    totalMessages: 1247,
    activeUsers: 89,
    topTickers: [
      {
        ticker: "NVDA",
        mentions: 156,
        bullishPercent: 78,
        bearishPercent: 22,
        sentimentChange: +12,
        avgPrice: 875,
        topIdea: "Buy at 875, target 950 - AI earnings catalyst",
      },
      {
        ticker: "TSLA",
        mentions: 89,
        bullishPercent: 65,
        bearishPercent: 35,
        sentimentChange: -8,
        avgPrice: 195,
        topIdea: "Mixed signals, watching for 200 breakout",
      },
      {
        ticker: "SPY",
        mentions: 67,
        bullishPercent: 45,
        bearishPercent: 55,
        sentimentChange: -15,
        avgPrice: 425,
        topIdea: "Fed concerns driving bearish sentiment",
      },
    ],
    marketSentiment: "bullish",
    sentimentScore: 73,
    keyInsights: [
      "🚀 AI sector momentum continues with NVDA leading charge",
      "⚠️ Fed meeting concerns causing SPY weakness",
      "📈 Tech earnings optimism driving 73% overall bullish sentiment",
      "🎯 High conviction trades showing 89% accuracy this week",
      "🔥 Options activity increased 45% vs yesterday",
    ],
    trendingTopics: [
      "AI Earnings",
      "Fed Meeting",
      "Tech Rally",
      "Options Flow",
    ],
    riskLevel: "medium",
  };

  useEffect(() => {
    // Load initial summary
    setSummary(mockSummaryData);
    setLastUpdate(new Date());
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update with slight variations
    const updatedSummary = {
      ...mockSummaryData,
      timestamp: new Date(),
      totalMessages:
        mockSummaryData.totalMessages + Math.floor(Math.random() * 50),
      activeUsers:
        mockSummaryData.activeUsers + Math.floor(Math.random() * 10 - 5),
      sentimentScore: Math.max(
        0,
        Math.min(
          100,
          mockSummaryData.sentimentScore + Math.floor(Math.random() * 10 - 5),
        ),
      ),
    };

    setSummary(updatedSummary);
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "text-green-600";
      case "bearish":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  if (!summary) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Bot className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading AI summary...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="h-5 w-5 text-blue-500" />
            AI Market Summary
            <Badge variant="outline" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          Last updated {formatTimeAgo(lastUpdate)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Sentiment */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Market Sentiment</span>
            <div className="flex items-center gap-2">
              <Badge className={getSentimentColor(summary.marketSentiment)}>
                {summary.marketSentiment === "bullish" ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : summary.marketSentiment === "bearish" ? (
                  <TrendingDown className="h-3 w-3 mr-1" />
                ) : (
                  <BarChart3 className="h-3 w-3 mr-1" />
                )}
                {summary.sentimentScore}% {summary.marketSentiment}
              </Badge>
              <Badge className={getRiskColor(summary.riskLevel)}>
                {summary.riskLevel} risk
              </Badge>
            </div>
          </div>
          <Progress value={summary.sentimentScore} className="h-2" />
        </div>

        <Separator />

        {/* Activity Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-primary">
              {summary.totalMessages}
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <MessageSquare className="h-3 w-3" />
              Messages
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {summary.activeUsers}
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Users className="h-3 w-3" />
              Active
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              {summary.topTickers.length}
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Target className="h-3 w-3" />
              Tickers
            </div>
          </div>
        </div>

        <Separator />

        {/* Top Tickers */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="font-medium text-sm">Top Discussed</span>
          </div>
          <div className="space-y-2">
            {summary.topTickers.map((ticker, index) => (
              <div key={ticker.ticker} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="font-medium text-sm">
                      ${ticker.ticker}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {ticker.mentions} mentions
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {ticker.sentimentChange > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span
                      className={
                        ticker.sentimentChange > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {ticker.sentimentChange > 0 ? "+" : ""}
                      {ticker.sentimentChange}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-green-600">
                        Bullish {ticker.bullishPercent}%
                      </span>
                      <span className="text-red-600">
                        Bearish {ticker.bearishPercent}%
                      </span>
                    </div>
                    <Progress value={ticker.bullishPercent} className="h-1" />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                  💡 {ticker.topIdea}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Key Insights */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="font-medium text-sm">Key Insights</span>
          </div>
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {summary.keyInsights.map((insight, index) => (
                <div key={index} className="text-xs p-2 bg-muted/30 rounded">
                  {insight}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        {/* Trending Topics */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4" />
            <span className="font-medium text-sm">Trending Topics</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {summary.trendingTopics.map((topic) => (
              <Badge key={topic} variant="secondary" className="text-xs">
                #{topic}
              </Badge>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-muted-foreground bg-amber-50 dark:bg-amber-950 p-2 rounded border border-amber-200 dark:border-amber-800">
          <AlertCircle className="h-3 w-3 inline mr-1" />
          AI-generated summary for informational purposes only. Not financial
          advice.
        </div>
      </CardContent>
    </Card>
  );
};
