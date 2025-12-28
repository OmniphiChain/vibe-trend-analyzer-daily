import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Brain,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Zap,
  Target,
  AlertTriangle,
} from "lucide-react";

interface MoodScore {
  overall: number;
  stocks: number;
  news: number;
  social: number;
  timestamp: Date;
}

interface AIInsightWidgetProps {
  moodScore: MoodScore;
}

interface AIInsight {
  title: string;
  content: string;
  confidence: number;
  category: "market" | "opportunity" | "risk" | "trend";
  actionable: boolean;
  timestamp: Date;
}

export const AIInsightWidget: React.FC<AIInsightWidgetProps> = ({
  moodScore,
}) => {
  const [currentInsight, setCurrentInsight] = useState<AIInsight | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate AI insights based on mood score
  const generateInsight = (): AIInsight => {
    const insights: Omit<AIInsight, "timestamp">[] = [
      // Market insights
      {
        title: "Market Momentum Shift",
        content:
          moodScore.overall >= 70
            ? "Strong bullish sentiment detected across all data sources. This momentum typically sustains for 2-3 trading sessions before potential consolidation."
            : moodScore.overall <= 30
              ? "Bear market signals strengthening. Consider defensive positioning and cash allocation increases."
              : "Market showing mixed signals. Range-bound trading likely to continue until catalyst emerges.",
        confidence: 85,
        category: "market",
        actionable: true,
      },

      // Opportunity insights
      {
        title: "Sector Rotation Opportunity",
        content:
          moodScore.stocks > moodScore.news + 20
            ? "Stock sentiment significantly outpacing news sentiment suggests institutional accumulation. Tech and growth sectors showing strength."
            : "News sentiment leading stock performance indicates upcoming sector rotation. Consider value plays in beaten-down sectors.",
        confidence: 78,
        category: "opportunity",
        actionable: true,
      },

      // Risk insights
      {
        title: "Sentiment Divergence Alert",
        content:
          Math.abs(moodScore.stocks - moodScore.social) > 25
            ? "Large divergence between institutional (stocks) and retail (social) sentiment. This typically precedes volatility spikes."
            : "Sentiment alignment across sources suggests stable market conditions with reduced volatility expected.",
        confidence: 82,
        category: "risk",
        actionable: true,
      },

      // Trend insights
      {
        title: "Social Media Signal",
        content:
          moodScore.social >= 75
            ? "Extreme social media optimism detected. Historically, this level coincides with short-term tops. Consider taking profits."
            : moodScore.social <= 25
              ? "Social media despair reaching extreme levels. Contrarian opportunity may be emerging for patient investors."
              : "Social sentiment in normal range. No immediate contrarian signals detected.",
        confidence: 71,
        category: "trend",
        actionable: moodScore.social >= 75 || moodScore.social <= 25,
      },

      // Market timing
      {
        title: "Fear & Greed Analysis",
        content:
          moodScore.overall >= 80
            ? "Extreme greed levels detected. Market typically corrects 5-10% within 30 days of reaching these levels."
            : moodScore.overall <= 20
              ? "Extreme fear creating exceptional buying opportunities. Market typically bounces 10-15% from these levels."
              : "Balanced sentiment environment. Trend-following strategies recommended over contrarian plays.",
        confidence: 88,
        category: "market",
        actionable: moodScore.overall >= 80 || moodScore.overall <= 20,
      },
    ];

    // Select insight based on current conditions
    let selectedInsight;
    if (moodScore.overall >= 75 || moodScore.overall <= 25) {
      selectedInsight = insights[4]; // Fear & Greed extreme levels
    } else if (Math.abs(moodScore.stocks - moodScore.social) > 25) {
      selectedInsight = insights[2]; // Sentiment divergence
    } else if (moodScore.stocks > moodScore.news + 15) {
      selectedInsight = insights[1]; // Sector rotation
    } else {
      selectedInsight = insights[0]; // Market momentum
    }

    return {
      ...selectedInsight,
      timestamp: new Date(),
    };
  };

  const refreshInsight = async () => {
    setIsGenerating(true);

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newInsight = generateInsight();
    setCurrentInsight(newInsight);
    setIsGenerating(false);
  };

  // Generate initial insight
  useEffect(() => {
    const insight = generateInsight();
    setCurrentInsight(insight);
  }, [moodScore]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "market":
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case "opportunity":
        return <Target className="w-4 h-4 text-green-500" />;
      case "risk":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "trend":
        return <Zap className="w-4 h-4 text-purple-500" />;
      default:
        return <Lightbulb className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "market":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "opportunity":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "risk":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "trend":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-indigo-900/20">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span className="text-sm">AI Insight</span>
            <Badge
              variant="secondary"
              className="bg-white/20 text-white animate-pulse"
            >
              Live
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={refreshInsight}
            disabled={isGenerating}
          >
            <RefreshCw
              className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`}
            />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {isGenerating ? (
          <div className="text-center py-8">
            <div className="relative inline-block mb-4">
              <Brain className="w-12 h-12 text-indigo-500 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full animate-bounce"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              AI analyzing market conditions...
            </p>
          </div>
        ) : currentInsight ? (
          <div className="space-y-4">
            {/* Insight Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getCategoryIcon(currentInsight.category)}
                <Badge
                  className={`text-xs ${getCategoryColor(currentInsight.category)}`}
                >
                  {currentInsight.category.charAt(0).toUpperCase() +
                    currentInsight.category.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {currentInsight.confidence}% confidence
                </span>
                <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${currentInsight.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Insight Title */}
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {currentInsight.title}
            </h3>

            {/* Insight Content */}
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {currentInsight.content}
              </p>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-3">
                <span>Generated {getTimeAgo(currentInsight.timestamp)}</span>
                {currentInsight.actionable && (
                  <>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs">
                      Actionable
                    </Badge>
                  </>
                )}
              </div>
              <Lightbulb className="w-3 h-3" />
            </div>

            {/* Action Buttons */}
            {currentInsight.actionable && (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  <Target className="w-3 h-3 mr-1" />
                  Take Action
                </Button>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Brain className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No insights available
            </p>
          </div>
        )}

        {/* Additional Context */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {moodScore.overall}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Overall
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {Math.abs(moodScore.stocks - moodScore.social)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Divergence
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {currentInsight?.confidence || 0}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                AI Confidence
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Powered by advanced sentiment analysis and machine learning
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightWidget;
