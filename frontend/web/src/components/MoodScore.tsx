import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface MoodScoreProps {
  score: number;
  previousScore?: number;
}

export const MoodScore = ({ score, previousScore = 68 }: MoodScoreProps) => {
  const [displayScore, setDisplayScore] = useState(previousScore);
  const [isAnimating, setIsAnimating] = useState(false);

  const change = score - previousScore;
  const isPositive = change >= 0;

  // Animate score changes
  useEffect(() => {
    if (displayScore !== score) {
      setIsAnimating(true);
      const duration = 1500;
      const steps = 30;
      const increment = (score - displayScore) / steps;
      let current = displayScore;

      const timer = setInterval(() => {
        current += increment;
        if (
          (increment > 0 && current >= score) ||
          (increment < 0 && current <= score)
        ) {
          current = score;
          clearInterval(timer);
          setIsAnimating(false);
        }
        setDisplayScore(Math.round(current));
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [score, displayScore]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 70) return "text-emerald-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 50) return "text-orange-400";
    if (score >= 40) return "text-red-400";
    return "text-red-600";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-500/20 to-emerald-500/10";
    if (score >= 70) return "from-emerald-500/20 to-green-400/10";
    if (score >= 60) return "from-yellow-500/20 to-amber-400/10";
    if (score >= 50) return "from-orange-400/20 to-yellow-400/10";
    if (score >= 40) return "from-red-400/20 to-orange-400/10";
    return "from-red-600/20 to-red-400/10";
  };

  const getProgressGradient = (score: number) => {
    if (score >= 80) return "bg-gradient-to-r from-green-500 to-emerald-400";
    if (score >= 70) return "bg-gradient-to-r from-emerald-500 to-green-400";
    if (score >= 60) return "bg-gradient-to-r from-yellow-500 to-amber-400";
    if (score >= 50) return "bg-gradient-to-r from-orange-400 to-yellow-400";
    if (score >= 40) return "bg-gradient-to-r from-red-400 to-orange-400";
    return "bg-gradient-to-r from-red-600 to-red-400";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 85) return "Extremely Bullish";
    if (score >= 75) return "Very Positive";
    if (score >= 65) return "Positive";
    if (score >= 55) return "Mildly Positive";
    if (score >= 45) return "Neutral";
    if (score >= 35) return "Mildly Negative";
    if (score >= 25) return "Negative";
    return "Very Bearish";
  };

  const getMoodEmoji = (score: number) => {
    if (score >= 80) return "🚀";
    if (score >= 70) return "😊";
    if (score >= 60) return "🙂";
    if (score >= 50) return "😐";
    if (score >= 40) return "😕";
    return "😰";
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-lg">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getScoreGradient(displayScore)}`}
      />
      <CardHeader className="relative pb-2">
        <CardTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
          <Activity className="h-5 w-5" />
          Daily Mood Score
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-6">
        {/* Main Score Display */}
        <div className="text-center space-y-3">
          <div className="relative">
            <div
              className={`text-7xl md:text-8xl font-black ${getScoreColor(displayScore)} transition-all duration-300 ${isAnimating ? "scale-110" : "scale-100"}`}
            >
              {displayScore}
              <span className="text-3xl ml-2">
                {getMoodEmoji(displayScore)}
              </span>
            </div>
            {isAnimating && (
              <div className="absolute inset-0 rounded-full bg-current opacity-20 animate-ping"></div>
            )}
          </div>
          <div className="text-lg font-semibold text-foreground/80">
            {getScoreDescription(displayScore)}
          </div>
        </div>

        {/* Change Indicator */}
        <div className="flex items-center justify-center gap-2 py-2">
          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
              isPositive
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>
              {isPositive ? "+" : ""}
              {change.toFixed(1)} from yesterday
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Bearish</span>
            <span>Neutral</span>
            <span>Bullish</span>
          </div>
          <div className="relative">
            <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressGradient(displayScore)} shadow-lg`}
                style={{
                  width: `${displayScore}%`,
                  boxShadow: `0 0 10px ${displayScore >= 70 ? "#10b981" : displayScore >= 50 ? "#f59e0b" : "#ef4444"}40`,
                }}
              />
            </div>
            {/* Score markers */}
            <div className="absolute top-0 left-1/4 w-0.5 h-3 bg-muted-foreground/30"></div>
            <div className="absolute top-0 left-1/2 w-0.5 h-3 bg-muted-foreground/50"></div>
            <div className="absolute top-0 left-3/4 w-0.5 h-3 bg-muted-foreground/30"></div>
          </div>
        </div>

        {/* Meta Information */}
        <div className="text-center space-y-1">
          <div className="text-sm font-medium text-foreground/70">
            Live • Updated 2 min ago
          </div>
          <div className="text-xs text-muted-foreground">
            Based on 127,350 data points across all sources
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
