import { useState, useEffect } from "react";
import {
  Brain,
  Zap,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  ChevronDown,
  ChevronUp,
  VolumeX,
  RefreshCw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MoodSummary {
  overallSentiment: "bullish" | "bearish" | "neutral";
  confidence: number;
  primaryInsight: string;
  trendingTickers: Array<{
    symbol: string;
    sentiment: "bullish" | "bearish" | "neutral";
    mentions: number;
    change: number;
  }>;
  marketEvents: string[];
  sentimentShift: {
    from: string;
    to: string;
    reason: string;
    timestamp: Date;
  } | null;
  messageAnalysis: {
    totalMessages: number;
    bullishPercentage: number;
    bearishPercentage: number;
    neutralPercentage: number;
  };
  topKeywords: string[];
  lastUpdated: Date;
}

interface AIMoodSummaryBubbleProps {
  roomName: string;
  position?: "top" | "sidebar";
  onViewDetails?: () => void;
}

export const AIMoodSummaryBubble = ({
  roomName,
  position = "top",
  onViewDetails,
}: AIMoodSummaryBubbleProps) => {
  const [moodData, setMoodData] = useState<MoodSummary | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdateTimer, setLastUpdateTimer] = useState(0);

  // Mock AI mood analysis data
  const mockMoodData: MoodSummary = {
    overallSentiment: "bullish",
    confidence: 78,
    primaryInsight: "Most messages today are **Bullish** with rising mentions of $NVDA and $AI. Sentiment has strengthened after the morning earnings beat.",
    trendingTickers: [
      { symbol: "NVDA", sentiment: "bullish", mentions: 127, change: 4.7 },
      { symbol: "AI", sentiment: "bullish", mentions: 89, change: 8.2 },
      { symbol: "SPY", sentiment: "neutral", mentions: 76, change: 0.3 },
      { symbol: "ETH", sentiment: "bearish", mentions: 54, change: -2.1 },
    ],
    marketEvents: [
      "NVDA earnings beat expectations",
      "Fed minutes suggest dovish stance",
      "Tech sector showing strength",
    ],
    sentimentShift: {
      from: "Neutral",
      to: "Bullish",
      reason: "Powell's speech on inflation",
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    },
    messageAnalysis: {
      totalMessages: 1247,
      bullishPercentage: 54,
      bearishPercentage: 28,
      neutralPercentage: 18,
    },
    topKeywords: ["breakout", "earnings", "AI revolution", "momentum", "resistance"],
    lastUpdated: new Date(),
  };

  useEffect(() => {
    // Initial load
    setMoodData(mockMoodData);

    // Auto-refresh every 60 seconds
    const refreshInterval = setInterval(() => {
      if (!isMuted) {
        refreshMoodData();
      }
    }, 60000);

    // Update timer every second
    const timerInterval = setInterval(() => {
      setLastUpdateTimer(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(timerInterval);
    };
  }, [isMuted]);

  const refreshMoodData = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setMoodData({
        ...mockMoodData,
        confidence: Math.floor(Math.random() * 20) + 70, // 70-90%
        lastUpdated: new Date(),
      });
      setLastUpdateTimer(0);
      setIsRefreshing(false);
    }, 1000);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "from-emerald-500 to-green-400";
      case "bearish":
        return "from-red-500 to-pink-400";
      default:
        return "from-gray-500 to-slate-400";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return <TrendingUp className="h-4 w-4" />;
      case "bearish":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (seconds: number) => {
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  if (isMuted || !moodData) return null;

  const cardClass = position === "sidebar" 
    ? "w-full bg-black/40 border-purple-500/20"
    : "w-96 bg-gradient-to-br from-slate-900/95 to-purple-900/95 border-purple-500/30 shadow-xl shadow-purple-500/20";

  return (
    <Card className={`${cardClass} backdrop-blur-xl overflow-hidden`}>
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 border-b border-purple-500/20 bg-black/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`p-2 rounded-full bg-gradient-to-r ${getSentimentColor(moodData.overallSentiment)} animate-pulse`}>
                  <Brain className="h-4 w-4 text-white" />
                </div>
                {isRefreshing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <RefreshCw className="h-3 w-3 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white flex items-center gap-2">
                  AI Mood Summary
                  <Badge className={`text-xs bg-gradient-to-r ${getSentimentColor(moodData.overallSentiment)} text-white border-0`}>
                    {getSentimentIcon(moodData.overallSentiment)}
                    <span className="ml-1 capitalize">{moodData.overallSentiment}</span>
                  </Badge>
                </h3>
                <p className="text-xs text-gray-400">
                  {moodData.confidence}% confidence • {formatTimeAgo(lastUpdateTimer)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={refreshMoodData}
                      disabled={isRefreshing}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    >
                      <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh Analysis</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    >
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isExpanded ? 'Collapse' : 'Expand'} Details</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMuted(true)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Hide AI Summary</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Primary Insight */}
        <div className="p-4">
          <p className="text-sm text-gray-200 leading-relaxed">
            {moodData.primaryInsight.split(/(\*\*[^*]+\*\*|\$[A-Z]{1,5})/).map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <span key={i} className="font-semibold text-white">
                    {part.slice(2, -2)}
                  </span>
                );
              } else if (part.startsWith('$')) {
                return (
                  <span key={i} className="text-emerald-400 font-semibold">
                    {part}
                  </span>
                );
              }
              return part;
            })}
          </p>

          {/* Sentiment Shift Alert */}
          {moodData.sentimentShift && (
            <div className="mt-3 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium text-yellow-300">Sentiment Shift Detected</span>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                From <span className="font-medium">{moodData.sentimentShift.from}</span> to{" "}
                <span className="font-medium">{moodData.sentimentShift.to}</span> due to{" "}
                <span className="text-yellow-300">{moodData.sentimentShift.reason}</span>
              </p>
            </div>
          )}
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-purple-500/20 bg-black/10">
            {/* Trending Tickers */}
            <div className="p-4 border-b border-purple-500/10">
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-400" />
                Trending Tickers
              </h4>
              <div className="space-y-2">
                {moodData.trendingTickers.map(ticker => (
                  <div key={ticker.symbol} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-emerald-400">
                        ${ticker.symbol}
                      </span>
                      <Badge className={`text-xs bg-gradient-to-r ${getSentimentColor(ticker.sentiment)} text-white border-0`}>
                        {ticker.sentiment}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-400">{ticker.mentions} mentions</span>
                      <span className={ticker.change >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {ticker.change >= 0 ? '+' : ''}{ticker.change}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Analysis */}
            <div className="p-4 border-b border-purple-500/10">
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-400" />
                Message Analysis
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Total Messages</span>
                  <span className="text-white font-medium">{moodData.messageAnalysis.totalMessages.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div className="h-full flex">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-green-400"
                      style={{ width: `${moodData.messageAnalysis.bullishPercentage}%` }}
                    />
                    <div 
                      className="bg-gradient-to-r from-red-500 to-pink-400"
                      style={{ width: `${moodData.messageAnalysis.bearishPercentage}%` }}
                    />
                    <div 
                      className="bg-gradient-to-r from-gray-500 to-slate-400"
                      style={{ width: `${moodData.messageAnalysis.neutralPercentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400">{moodData.messageAnalysis.bullishPercentage}% Bullish</span>
                  <span className="text-red-400">{moodData.messageAnalysis.bearishPercentage}% Bearish</span>
                  <span className="text-gray-400">{moodData.messageAnalysis.neutralPercentage}% Neutral</span>
                </div>
              </div>
            </div>

            {/* Top Keywords */}
            <div className="p-4">
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-400" />
                Trending Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {moodData.topKeywords.map(keyword => (
                  <Badge key={keyword} className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-3 border-t border-purple-500/10 bg-black/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMuted(true)}
                className="text-gray-400 hover:text-white text-xs h-6"
              >
                <VolumeX className="h-3 w-3 mr-1" />
                Mute AI Summary
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewDetails}
              className="text-purple-400 hover:text-purple-300 text-xs h-6"
            >
              See Full Details →
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
