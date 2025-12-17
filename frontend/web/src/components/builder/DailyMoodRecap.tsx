import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Brain, TrendingUp, TrendingDown, ArrowRight, Hash, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useMoodTheme } from '../../contexts/MoodThemeContext';

interface DailyMoodRecapProps {
  className?: string;
}

interface MoodFlip {
  symbol: string;
  from: 'bullish' | 'bearish' | 'neutral';
  to: 'bullish' | 'bearish' | 'neutral';
  change: string;
}

interface TrendingTopic {
  tag: string;
  momentum: number;
  direction: 'up' | 'down';
}

interface TopMover {
  symbol: string;
  mood: 'bullish' | 'bearish';
  change: string;
}

export const DailyMoodRecap: React.FC<DailyMoodRecapProps> = ({
  className
}) => {
  const { themeMode } = useMoodTheme();
  const [currentMood] = useState({
    overall: 72,
    trend: 'up',
    change: '+4%'
  });

  const [moodSummary] = useState(
    "Market sentiment is up 4% today, leaning bullish after tech earnings surprise."
  );

  const [topMovers] = useState<TopMover[]>([
    { symbol: 'TSLA', mood: 'bullish', change: '+24%' },
    { symbol: 'GOOGL', mood: 'bearish', change: '-8%' },
    { symbol: 'NVDA', mood: 'bullish', change: '+12%' }
  ]);

  const [headlineSummary] = useState(
    "Fed rate talk and AI innovation dominate news sentiment."
  );

  const [trendingTopics] = useState<TrendingTopic[]>([
    { tag: '#AI', momentum: 34, direction: 'up' },
    { tag: '#RateHikes', momentum: 12, direction: 'down' },
    { tag: '#TechEarnings', momentum: 28, direction: 'up' },
    { tag: '#BTC', momentum: 15, direction: 'down' }
  ]);

  const [moodFlip] = useState<MoodFlip>({
    symbol: 'NFLX',
    from: 'bearish',
    to: 'bullish',
    change: '+18%'
  });

  const getSentimentColor = (mood: string) => {
    switch (mood) {
      case 'bullish': return 'text-[#16A34A] sentiment-positive';
      case 'bearish': return 'text-[#DC2626] sentiment-negative';
      default: return 'text-[#7C3AED] sentiment-neutral';
    }
  };

  const getSentimentBadge = (mood: string) => {
    switch (mood) {
      case 'bullish': return 'bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/30 sentiment-positive sentiment-positive-bg';
      case 'bearish': return 'bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/30 sentiment-negative sentiment-negative-bg';
      default: return 'bg-[#FAF5FF] text-[#7C3AED] border-[#7C3AED]/30 sentiment-neutral sentiment-neutral-bg';
    }
  };

  const getMoodGlow = (mood: number) => {
    if (mood >= 70) return 'shadow-lg shadow-[#16A34A]/20 border-[#16A34A]/30';
    if (mood >= 50) return 'shadow-lg shadow-[#7C3AED]/20 border-[#7C3AED]/30';
    return 'shadow-lg shadow-[#DC2626]/20 border-[#DC2626]/30';
  };



  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Section Title */}
      <div className="text-center mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            themeMode === 'light'
              ? 'bg-gradient-to-r from-[#3A7AFE]/20 to-[#7B61FF]/20 shadow-lg shadow-[#3A7AFE]/20'
              : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 shadow-lg shadow-purple-500/20'
          }`}>
            <Brain className="w-6 h-6 text-[#3A7AFE]" />
          </div>
          <h2 className={`text-2xl sm:text-3xl font-semibold tracking-tight text-center sm:text-left tracking-tight ${
            themeMode === 'light'
              ? 'text-[#1A1A1A]'
              : 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent'
          }`}>
            🧠 Daily Mood Recap
          </h2>
        </div>
        <p className={`text-base sm:text-lg px-4 sm:px-0 font-medium leading-relaxed ${
          themeMode === 'light' ? 'text-[#4B5563]' : 'text-gray-300'
        }`}>
          AI-generated summary of today's market emotions, sentiment moves, and trending topics
        </p>
      </div>

      {/* Main Recap Card */}
      <Card className={cn(
        "relative overflow-hidden transition-all duration-500 hover:scale-[1.02]",
        themeMode === 'light'
          ? 'bg-[#F9FAFB] border border-[#E0E3EB] shadow-sm'
          : `bg-black/40 backdrop-blur-xl ${getMoodGlow(currentMood.overall)}`,
        themeMode !== 'light' && getMoodGlow(currentMood.overall)
      )}>
        
        {/* Animated background effect */}
        {themeMode !== 'light' && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 animate-pulse" />
        )}

        <CardHeader className={themeMode === 'light' ? "border-b border-[#E0E3EB]" : "border-b border-purple-500/20"}>
          <CardTitle className={`flex items-center gap-3 ${
            themeMode === 'light' ? 'text-[#1A1A1A]' : 'text-white'
          }`}>
            <Brain className="w-6 h-6 animate-pulse" style={{color: 'var(--color-overall-mood)'}} />
            <span>AI Market Mood Summary</span>
            <Badge className={cn(
              "animate-pulse",
              currentMood.overall >= 70
                ? "sentiment-positive sentiment-positive-bg"
                : currentMood.overall >= 50
                ? "sentiment-neutral sentiment-neutral-bg"
                : "sentiment-negative sentiment-negative-bg"
            )}>
              {currentMood.trend === 'up' ? '↗' : '↘'} {currentMood.change}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          
          {/* Mood Summary */}
          <div className={`p-5 rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
            themeMode === 'light'
              ? 'bg-gradient-to-r from-[rgba(58,122,254,0.1)] to-[rgba(123,97,255,0.1)] border border-[#E6E6E6] theme-card-background theme-border'
              : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20'
          }`}>
            <h3 className={`text-lg font-semibold tracking-tight mb-3 flex items-center gap-2 ${
              themeMode === 'light' ? 'text-[#1A1A1A]' : 'text-white'
            }`}>
              📈 Mood Summary
              <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: 'var(--color-overall-mood)'}} />
            </h3>
            <p className={`text-base leading-relaxed ${
              themeMode === 'light' ? 'text-[#4B5563]' : 'text-gray-300'
            }`}>
              {moodSummary}
            </p>
          </div>

          {/* Top Movers */}
          <div className={`p-5 rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
            themeMode === 'light'
              ? 'bg-gradient-to-r from-[#E8F8F4] to-[#F3F4F6] border border-[#E6E6E6] theme-card-background theme-border'
              : 'bg-gradient-to-r from-emerald-500/10 to-amber-500/10 border border-emerald-500/20'
          }`}>
            <h3 className={`text-lg font-semibold tracking-tight mb-4 flex items-center gap-2 ${
              themeMode === 'light' ? 'text-[#1A1A1A]' : 'text-white'
            }`}>
              🔥 Top Mood Movers
              <div className="w-2 h-2 bg-[#16A34A] rounded-full animate-pulse" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2">
              {topMovers.map((mover, index) => (
                <Badge
                  key={index}
                  className={cn(
                    "text-sm font-medium px-3 py-2 transition-all duration-300 hover:scale-105 cursor-pointer",
                    getSentimentBadge(mover.mood),
                    mover.mood === 'bullish' ? 'hover:bg-[#DCFCE7] shadow-sm' : 'hover:bg-[#FEE2E2] shadow-sm'
                  )}
                >
                  <span className="font-bold">${mover.symbol}</span> → {mover.mood === 'bullish' ? '📈' : '📉'}
                  <span className="font-bold ml-1">{mover.change}</span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Headline Summary */}
          <div className={`p-5 rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
            themeMode === 'light'
              ? 'bg-gradient-to-r from-[#E3F2FD] to-[#F1F8E9] border border-[#E6E6E6] theme-card-background theme-border'
              : 'bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/20'
          }`}>
            <h3 className={`text-lg font-semibold tracking-tight mb-3 flex items-center gap-2 ${
              themeMode === 'light' ? 'text-[#1A1A1A]' : 'text-white'
            }`}>
              📰 News Headlines Summary
              <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: 'var(--color-news)'}} />
            </h3>
            <p className={`text-base leading-relaxed ${
              themeMode === 'light' ? 'text-[#4B5563]' : 'text-gray-300'
            }`}>
              {headlineSummary}
            </p>
          </div>

          {/* Trending Topics */}
          <div className={`p-5 rounded-xl transition-all duration-300 hover:scale-[1.01] ${
            themeMode === 'light'
              ? 'bg-gradient-to-r from-[#FFF3E0] to-[#FCE4EC] border border-[#E6E6E6] theme-card-background theme-border'
              : 'bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20'
          }`}>
            <h3 className={`text-lg font-semibold tracking-tight mb-4 ${
              themeMode === 'light' ? 'text-[#1A1A1A]' : 'text-white'
            }`}>
              🔥 Trending Topics
            </h3>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              {trendingTopics.map((topic, index) => (
                <Badge
                  key={index}
                  className={cn(
                    "text-sm font-medium px-3 py-2 flex items-center justify-center gap-1 transition-all duration-300 hover:scale-105 cursor-pointer",
                    topic.direction === 'up'
                      ? "sentiment-positive sentiment-positive-bg shadow-sm border theme-border"
                      : "sentiment-negative sentiment-negative-bg shadow-sm border theme-border"
                  )}
                >
                  <Hash className="w-3 h-3" />
                  <span className="truncate">{topic.tag}</span>
                  {topic.direction === 'up' ?
                    <ChevronUp className="w-3 h-3 animate-bounce" /> :
                    <ChevronDown className="w-3 h-3 animate-bounce" />
                  }
                  <span className="font-bold">{topic.momentum}%</span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Mood Flip of the Day */}
          <div className={`p-5 rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
            themeMode === 'light'
              ? 'bg-gradient-to-r from-[rgba(123,97,255,0.1)] to-[rgba(58,122,254,0.1)] border border-[#E6E6E6] theme-card-background theme-border'
              : 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20'
          }`}>
            <h3 className={`text-lg font-semibold tracking-tight mb-3 flex items-center gap-2 ${
              themeMode === 'light' ? 'text-[#1A1A1A]' : 'text-white'
            }`}>
              🔄 Mood Flip of the Day
              <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: 'var(--color-social)'}} />
            </h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 font-semibold tracking-tight transition-all duration-300 hover:scale-105 theme-border">
                ${moodFlip.symbol}
              </Badge>
              <span className={`text-sm hidden sm:inline ${
                themeMode === 'light' ? 'text-[#4B5563]' : 'text-gray-400'
              }`}>flipped from</span>
              <span className={`text-xs sm:hidden ${
                themeMode === 'light' ? 'text-[#4B5563]' : 'text-gray-400'
              }`}>from</span>
              <Badge className={cn(getSentimentBadge(moodFlip.from), "transition-all duration-300 hover:scale-105")}>
                {moodFlip.from}
              </Badge>
              <ArrowRight className="w-4 h-4 text-purple-400 animate-pulse" />
              <Badge className={cn(getSentimentBadge(moodFlip.to), "transition-all duration-300 hover:scale-105")}>
                {moodFlip.to}
              </Badge>
              <span className={`text-sm font-semibold tracking-tight ${getSentimentColor(moodFlip.to)} animate-pulse`}>
                {moodFlip.change}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center pt-4">
            <Button 
              className={themeMode === 'light'
                ? "ai-analysis-btn-light hover:opacity-90 px-6 py-3"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3"
              }
            >
              🔍 View Full Mood Breakdown
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyMoodRecap;
