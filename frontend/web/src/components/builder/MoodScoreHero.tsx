"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Brain, Activity } from "lucide-react";
import { cn } from "../../lib/utils";
import { useMoodTheme } from "../../contexts/MoodThemeContext";

interface MoodScoreHeroProps {
  title?: string;
  subtitle?: string;
  apiEndpoint?: string;
  moodScore?: MoodData;
  timeframe?: "1D" | "7D" | "30D";
  onTimeframeChange?: (timeframe: "1D" | "7D" | "30D") => void;
}

interface MoodData {
  overall: number;
  stocks: number;
  news: number;
  social: number;
  timestamp: Date;
}

export const MoodScoreHero: React.FC<MoodScoreHeroProps> = ({
  title = "Today's Market Mood",
  subtitle = "Real-time sentiment analysis powered by AI",
  apiEndpoint = "/api/proxy/stock-sentiment",
  moodScore: propMoodScore,
  timeframe,
  onTimeframeChange,
}) => {
  const { themeMode, cardBackground, borderColor, bodyGradient, accentColor } = useMoodTheme();
    const [moodScore, setMoodScore] = useState<MoodData>(propMoodScore || {
    overall: 65,
    stocks: 70,
    news: 55,
    social: 68,
    timestamp: new Date(),
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMoodScore = async () => {
      setLoading(true);
      try {
        // You can replace this with actual API call
        // const response = await fetch(apiEndpoint);
        // const data = await response.json();

        // For now, simulate dynamic data
        const newScore = {
          overall: 45 + Math.random() * 40,
          stocks: 40 + Math.random() * 50,
          news: 35 + Math.random() * 45,
          social: 50 + Math.random() * 35,
          timestamp: new Date(),
        };

        setMoodScore(newScore);
      } catch (error) {
        console.error("Failed to fetch mood score:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodScore();
    const interval = setInterval(fetchMoodScore, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [apiEndpoint]);

  const getMoodEmoji = (score: number) => {
    if (score >= 80) return "🚀";
    if (score >= 70) return "😄";
    if (score >= 60) return "😊";
    if (score >= 50) return "😐";
    if (score >= 40) return "😕";
    return "😢";
  };

  const getMoodColor = (score: number) => {
    if (score >= 70) return "from-green-400 to-emerald-600";
    if (score >= 50) return "from-yellow-400 to-orange-500";
    return "from-red-400 to-red-600";
  };

  const getMoodLabel = (score: number) => {
    if (score >= 80) return "Euphoric";
    if (score >= 70) return "Bullish";
    if (score >= 60) return "Optimistic";
    if (score >= 50) return "Neutral";
    if (score >= 40) return "Cautious";
    return "Bearish";
  };

        return (
    <div className={cn(
      "relative mb-8 overflow-hidden rounded-3xl transition-all duration-700",
      "bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800"
    )}>
            <div className={cn(
        "absolute inset-0 transition-all duration-700",
        "bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20"
      )}></div>
      
      {/* Green sentiment ring overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 rounded-full border-4 border-green-400 opacity-30 animate-pulse"></div>
      </div>
      
      <div
        className={
          'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-20'
        }
      ></div>

      <div className="relative px-8 py-12">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-flex items-center space-x-4 mb-4">
              <div className="text-6xl animate-bounce">
                {getMoodEmoji(moodScore.overall)}
              </div>
              <div>
                <div className="text-5xl font-bold mb-2 text-white">
                  {loading ? "..." : Math.round(moodScore.overall)}
                </div>
                <div className="text-xl text-blue-200">
                  {getMoodLabel(moodScore.overall)}
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-2 text-white">{title}</h2>
            <p className="max-w-2xl mx-auto transition-colors duration-500 text-blue-200">{subtitle}</p>
          </div>

          {/* Mood Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="backdrop-blur-sm border-0 shadow-[0_2px_6px_rgba(0,0,0,0.05)] bg-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-blue-300" />
                    <span className="font-medium text-white">Stocks</span>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {Math.round(moodScore.stocks)}
                  </span>
                </div>
                <div className="w-full rounded-full h-2 bg-white/20">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${getMoodColor(moodScore.stocks)}`}
                    style={{ width: `${moodScore.stocks}%` }}
                  ></div>
                </div>
                <div className="text-sm mt-2 text-blue-200">40% weight</div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm border-0 shadow-[0_2px_6px_rgba(0,0,0,0.05)] bg-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-300" />
                    <span className="font-medium text-white">News</span>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {Math.round(moodScore.news)}
                  </span>
                </div>
                <div className="w-full rounded-full h-2 bg-white/20">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${getMoodColor(moodScore.news)}`}
                    style={{ width: `${moodScore.news}%` }}
                  ></div>
                </div>
                <div className="text-sm mt-2 text-purple-200">30% weight</div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm border-0 shadow-[0_2px_6px_rgba(0,0,0,0.05)] bg-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-indigo-300" />
                    <span className="font-medium text-white">Social</span>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {Math.round(moodScore.social)}
                  </span>
                </div>
                <div className="w-full rounded-full h-2 bg-white/20">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${getMoodColor(moodScore.social)}`}
                    style={{ width: `${moodScore.social}%` }}
                  ></div>
                </div>
                <div className="text-sm mt-2 text-indigo-200">30% weight</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodScoreHero;
