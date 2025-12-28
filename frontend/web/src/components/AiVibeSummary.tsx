import {
  Brain,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Zap,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

interface AiVibeSummaryProps {
  summary: string;
  score: number;
  confidenceLevel?: number;
}

export const AiVibeSummary = ({
  summary,
  score,
  confidenceLevel = 87,
}: AiVibeSummaryProps) => {
  const [isTyping, setIsTyping] = useState(true);
  const [displayText, setDisplayText] = useState("");

  // Typing animation effect
  useEffect(() => {
    if (summary) {
      setIsTyping(true);
      setDisplayText("");
      let currentIndex = 0;

      const typeTimer = setInterval(() => {
        if (currentIndex < summary.length) {
          setDisplayText(summary.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typeTimer);
        }
      }, 30);

      return () => clearInterval(typeTimer);
    }
  }, [summary]);

  const getScoreMood = (score: number) => {
    if (score >= 80)
      return {
        mood: "Extremely Bullish",
        emoji: "🚀",
        color: "text-green-600",
      };
    if (score >= 70)
      return { mood: "Bullish", emoji: "📈", color: "text-green-500" };
    if (score >= 60)
      return { mood: "Optimistic", emoji: "😊", color: "text-yellow-500" };
    if (score >= 50)
      return { mood: "Neutral", emoji: "😐", color: "text-gray-500" };
    if (score >= 40)
      return { mood: "Cautious", emoji: "😕", color: "text-orange-500" };
    if (score >= 30)
      return { mood: "Bearish", emoji: "📉", color: "text-red-500" };
    return { mood: "Very Bearish", emoji: "😰", color: "text-red-600" };
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-500";
    if (confidence >= 75) return "bg-yellow-500";
    if (confidence >= 60) return "bg-orange-500";
    return "bg-red-500";
  };

  const getTrendDirection = (score: number) => {
    if (score >= 65)
      return {
        icon: TrendingUp,
        direction: "Positive trend",
        color: "text-green-600",
      };
    if (score >= 45)
      return {
        icon: Zap,
        direction: "Mixed signals",
        color: "text-yellow-600",
      };
    return {
      icon: TrendingDown,
      direction: "Negative trend",
      color: "text-red-600",
    };
  };

  const { mood, emoji, color } = getScoreMood(score);
  const {
    icon: TrendIcon,
    direction,
    color: trendColor,
  } = getTrendDirection(score);

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          AI Market Sentiment Analysis
          <Badge variant="outline" className="ml-auto">
            <Zap className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-6">
        {/* AI Summary Text */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lightbulb className="h-4 w-4" />
            <span>Today's AI-Generated Market Insight</span>
            {isTyping && (
              <div className="w-2 h-4 bg-current animate-pulse ml-1" />
            )}
          </div>

          <div className="p-4 bg-card/50 rounded-lg border-l-4 border-l-blue-500">
            <p className="text-base leading-relaxed font-medium">
              "{displayText}"
              {isTyping && <span className="animate-pulse">|</span>}
            </p>
          </div>
        </div>

        {/* Mood & Trend Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-card/30 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{emoji}</span>
              <div>
                <h4 className="font-semibold text-sm">Current Mood</h4>
                <p className={`text-lg font-bold ${color}`}>{mood}</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Score: {score}/100
            </div>
          </div>

          <div className="p-4 bg-card/30 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <TrendIcon className={`h-5 w-5 ${trendColor}`} />
              <div>
                <h4 className="font-semibold text-sm">Market Direction</h4>
                <p className={`text-lg font-bold ${trendColor}`}>{direction}</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Based on cross-source analysis
            </div>
          </div>
        </div>

        {/* AI Confidence Meter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">AI Confidence Level</span>
            </div>
            <Badge
              variant="outline"
              className={
                confidenceLevel >= 80
                  ? "border-green-500 text-green-700"
                  : "border-yellow-500 text-yellow-700"
              }
            >
              {confidenceLevel}%
            </Badge>
          </div>
          <Progress value={confidenceLevel} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low Confidence</span>
            <span>High Confidence</span>
          </div>
        </div>

        {/* Key Insights */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Key AI Insights
          </h4>
          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Tech sector shows strong momentum</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span>Mixed signals from financial markets</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Social sentiment remains positive</span>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between pt-4 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Generated 3 minutes ago</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              GPT-4 Powered
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Real-time
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
