import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Hash, TrendingUp, Users, MessageSquare, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useMoodTheme } from '../../contexts/MoodThemeContext';

interface SocialBuzzHeatmapProps {
  title?: string;
  maxTopics?: number;
  platforms?: string;
  autoRefresh?: boolean;
  apiEndpoint?: string;
}

interface TrendingTopic {
  keyword: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  volume: number;
  sentimentScore: number;
  platforms: {
    reddit: number;
    twitter: number;
    discord: number;
  };
  change24h: number;
  category: 'stock' | 'crypto' | 'sector' | 'general';
}

export const SocialBuzzHeatmap: React.FC<SocialBuzzHeatmapProps> = ({
  title = "Social Buzz Heatmap",
  maxTopics = 12,
  platforms = "reddit,twitter,discord",
  autoRefresh = true,
  apiEndpoint = "/api/social/trending"
}) => {
  const { themeMode } = useMoodTheme();
  const [topics, setTopics] = useState<TrendingTopic[]>([
    { keyword: '$NVDA', sentiment: 'bullish', volume: 15420, sentimentScore: 78, platforms: { reddit: 5200, twitter: 8100, discord: 2120 }, change24h: 145, category: 'stock' },
    { keyword: '$TSLA', sentiment: 'bearish', volume: 12340, sentimentScore: 32, platforms: { reddit: 4100, twitter: 6840, discord: 1400 }, change24h: -23, category: 'stock' },
    { keyword: 'AI Revolution', sentiment: 'bullish', volume: 9876, sentimentScore: 82, platforms: { reddit: 3200, twitter: 5276, discord: 1400 }, change24h: 67, category: 'sector' },
    { keyword: '$BTC', sentiment: 'bullish', volume: 18750, sentimentScore: 71, platforms: { reddit: 6200, twitter: 9800, discord: 2750 }, change24h: 89, category: 'crypto' },
    { keyword: 'Fed Meeting', sentiment: 'neutral', volume: 7654, sentimentScore: 52, platforms: { reddit: 2800, twitter: 3854, discord: 1000 }, change24h: 12, category: 'general' },
    { keyword: '$AAPL', sentiment: 'bullish', volume: 11230, sentimentScore: 65, platforms: { reddit: 3800, twitter: 6130, discord: 1300 }, change24h: 34, category: 'stock' },
    { keyword: 'Inflation', sentiment: 'bearish', volume: 6789, sentimentScore: 38, platforms: { reddit: 2500, twitter: 3489, discord: 800 }, change24h: -18, category: 'general' },
    { keyword: '$GOOGL', sentiment: 'neutral', volume: 8432, sentimentScore: 58, platforms: { reddit: 2900, twitter: 4632, discord: 900 }, change24h: 8, category: 'stock' },
    { keyword: 'Quantum Computing', sentiment: 'bullish', volume: 4567, sentimentScore: 74, platforms: { reddit: 1800, twitter: 2167, discord: 600 }, change24h: 156, category: 'sector' },
    { keyword: '$ETH', sentiment: 'bullish', volume: 13456, sentimentScore: 69, platforms: { reddit: 4500, twitter: 7456, discord: 1500 }, change24h: 72, category: 'crypto' },
    { keyword: 'Tech Earnings', sentiment: 'bullish', volume: 10234, sentimentScore: 76, platforms: { reddit: 3600, twitter: 5634, discord: 1000 }, change24h: 98, category: 'sector' },
    { keyword: 'Energy Crisis', sentiment: 'bearish', volume: 5678, sentimentScore: 29, platforms: { reddit: 2100, twitter: 2878, discord: 700 }, change24h: -45, category: 'sector' }
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setTopics(prev => prev.map(topic => ({
          ...topic,
          volume: Math.max(1000, topic.volume + (Math.random() - 0.5) * 1000),
          sentimentScore: Math.max(0, Math.min(100, topic.sentimentScore + (Math.random() - 0.5) * 10)),
          change24h: topic.change24h + (Math.random() - 0.5) * 20
        })));
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const categories = ['all', 'stock', 'crypto', 'sector', 'general'];
  
  const filteredTopics = selectedCategory === 'all' 
    ? topics.slice(0, maxTopics)
    : topics.filter(topic => topic.category === selectedCategory).slice(0, maxTopics);

  const getVolumeIntensity = (volume: number) => {
    const maxVolume = Math.max(...topics.map(t => t.volume));
    const intensity = (volume / maxVolume) * 100;
    if (intensity >= 80) return 'high';
    if (intensity >= 50) return 'medium';
    return 'low';
  };

  const getIntensityStyles = (intensity: string, sentiment: string) => {
    const baseStyles = "transition-all duration-300 hover:scale-105 cursor-pointer";

    if (themeMode === 'light') {
      // Light mode styling with proper contrast
      if (sentiment === 'bullish') {
        switch (intensity) {
          case 'high': return `${baseStyles} bg-[#E8F5E9] shadow-[0_4px_12px_rgba(76,175,80,0.3)] border-[#4CAF50] text-[#1E1E1E]`;
          case 'medium': return `${baseStyles} bg-[#F1F8E9] shadow-[0_2px_8px_rgba(76,175,80,0.2)] border-[#66BB6A] text-[#1E1E1E]`;
          default: return `${baseStyles} bg-[#F9FBE7] border-[#8BC34A] text-[#1E1E1E]`;
        }
      } else if (sentiment === 'bearish') {
        switch (intensity) {
          case 'high': return `${baseStyles} bg-[#FFEBEE] shadow-[0_4px_12px_rgba(244,67,54,0.3)] border-[#F44336] text-[#1E1E1E]`;
          case 'medium': return `${baseStyles} bg-[#FFF5F5] shadow-[0_2px_8px_rgba(244,67,54,0.2)] border-[#EF5350] text-[#1E1E1E]`;
          default: return `${baseStyles} bg-[#FAFAFA] border-[#E57373] text-[#1E1E1E]`;
        }
      } else {
        switch (intensity) {
          case 'high': return `${baseStyles} bg-[#FFF8E1] shadow-[0_4px_12px_rgba(255,152,0,0.3)] border-[#FF9800] text-[#1E1E1E]`;
          case 'medium': return `${baseStyles} bg-[#FFFDE7] shadow-[0_2px_8px_rgba(255,152,0,0.2)] border-[#FFA726] text-[#1E1E1E]`;
          default: return `${baseStyles} bg-[#FAFAFA] border-[#FFB74D] text-[#1E1E1E]`;
        }
      }
    } else {
      // Dark mode styling (original)
      if (sentiment === 'bullish') {
        switch (intensity) {
          case 'high': return `${baseStyles} bg-emerald-500/80 shadow-emerald-500/50 shadow-lg border-emerald-400`;
          case 'medium': return `${baseStyles} bg-emerald-500/50 shadow-emerald-500/30 shadow-md border-emerald-500`;
          default: return `${baseStyles} bg-emerald-500/20 border-emerald-600`;
        }
      } else if (sentiment === 'bearish') {
        switch (intensity) {
          case 'high': return `${baseStyles} bg-red-500/80 shadow-red-500/50 shadow-lg border-red-400`;
          case 'medium': return `${baseStyles} bg-red-500/50 shadow-red-500/30 shadow-md border-red-500`;
          default: return `${baseStyles} bg-red-500/20 border-red-600`;
        }
      } else {
        switch (intensity) {
          case 'high': return `${baseStyles} bg-amber-500/80 shadow-amber-500/50 shadow-lg border-amber-400`;
          case 'medium': return `${baseStyles} bg-amber-500/50 shadow-amber-500/30 shadow-md border-amber-500`;
          default: return `${baseStyles} bg-amber-500/20 border-amber-600`;
        }
      }
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return '📈';
      case 'bearish': return '📉';
      default: return '➡️';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'stock': return '📊';
      case 'crypto': return '₿';
      case 'sector': return '🏭';
      default: return '💬';
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return volume >= 100000000
        ? `${Math.round(volume / 1000000)}m`
        : `${(volume / 1000000).toFixed(1)}m`;
    }
    if (volume >= 1000) {
      return volume >= 100000
        ? `${Math.round(volume / 1000)}k`
        : `${(volume / 1000).toFixed(1)}k`;
    }
    return volume.toString();
  };

  return (
    <Card className={themeMode === 'light'
      ? 'bg-white border-[#E0E0E0] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200'
      : 'finance-card border-0'
    }>
      <CardHeader className={`border-b ${themeMode === 'light' ? 'border-[#E0E0E0]' : 'border-slate-700/50'}`}>
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center gap-2 font-bold ${
            themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
          }`}>
            <Hash className={`w-5 h-5 ${
              themeMode === 'light' ? 'text-[#9C27B0]' : 'text-purple-400'
            }`} />
            {title}
            {loading && (
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                themeMode === 'light' ? 'bg-[#9C27B0]' : 'bg-purple-400'
              }`} />
            )}
          </CardTitle>
          
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs h-7 px-3 capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Heatmap Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {filteredTopics.map((topic, index) => {
            const intensity = getVolumeIntensity(topic.volume);
            return (
              <div
                key={index}
                className={cn(
                  "relative rounded-xl p-4 border backdrop-blur-sm group",
                  getIntensityStyles(intensity, topic.sentiment)
                )}
              >
                {/* Topic Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(topic.category)}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        themeMode === 'light'
                          ? 'bg-white/80 text-[#666] border-[#E0E0E0]'
                          : 'bg-black/20 text-white border-white/30'
                      )}
                    >
                      {topic.category}
                    </Badge>
                  </div>
                  <div className="text-lg">{getSentimentIcon(topic.sentiment)}</div>
                </div>

                {/* Keyword */}
                <div className="mb-3">
                  <h3 className={`font-bold text-sm mb-1 ${
                    themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                  }`}>{topic.keyword}</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={themeMode === 'light' ? 'text-[#666]' : 'text-white/80'}>
                      {formatVolume(topic.volume)} mentions
                    </span>
                    <span className={cn(
                      "font-medium",
                      topic.change24h >= 0
                        ? (themeMode === 'light' ? 'text-[#4CAF50]' : 'text-emerald-300')
                        : (themeMode === 'light' ? 'text-[#F44336]' : 'text-red-300')
                    )}>
                      {topic.change24h >= 0 ? '+' : ''}{topic.change24h.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Sentiment Score */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={themeMode === 'light' ? 'text-[#666]' : 'text-white/70'}>Sentiment</span>
                    <span className={`font-bold ${
                      themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                    }`}>{topic.sentimentScore.toFixed(2)}</span>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${
                    themeMode === 'light' ? 'bg-[#E0E0E0]' : 'bg-black/30'
                  }`}>
                    <div
                      className={cn(
                        "h-full transition-all duration-500",
                        topic.sentiment === 'bullish'
                          ? (themeMode === 'light' ? 'bg-[#4CAF50]' : 'bg-emerald-300')
                          : topic.sentiment === 'bearish'
                          ? (themeMode === 'light' ? 'bg-[#F44336]' : 'bg-red-300')
                          : (themeMode === 'light' ? 'bg-[#FF9800]' : 'bg-amber-300')
                      )}
                      style={{ width: `${topic.sentimentScore}%` }}
                    />
                  </div>
                </div>

                {/* Platform Breakdown - Hidden by default, shown on hover */}
                <div className={cn(
                  "absolute inset-0 backdrop-blur-sm rounded-xl p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center",
                  themeMode === 'light'
                    ? 'bg-white/95 border border-[#E0E0E0] shadow-[0_4px_12px_rgba(0,0,0,0.15)]'
                    : 'bg-black/90'
                )}>
                  <h4 className={`font-bold text-sm mb-3 text-center ${
                    themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                  }`}>Platform Breakdown</h4>
                  <div className="space-y-2">
                    {Object.entries(topic.platforms).map(([platform, count]) => (
                      <div key={platform} className="flex items-center justify-between text-xs">
                        <span className={`capitalize ${
                          themeMode === 'light' ? 'text-[#666]' : 'text-white/80'
                        }`}>{platform}</span>
                        <span className={`font-medium ${
                          themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                        }`}>{formatVolume(count)}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "mt-3 h-6 text-xs",
                      themeMode === 'light'
                        ? 'text-[#9C27B0] hover:text-[#7B1FA2] hover:bg-[#F3E5F5]'
                        : 'text-purple-300 hover:text-purple-200'
                    )}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className={`flex flex-wrap items-center justify-center gap-6 pt-4 border-t ${
          themeMode === 'light' ? 'border-[#E0E0E0]' : 'border-slate-700/50'
        }`}>
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-3 h-3 rounded border ${
              themeMode === 'light' ? 'bg-[#E8F5E9] border-[#4CAF50]' : 'bg-emerald-500/50 border-emerald-400'
            }`} />
            <span className={`font-medium ${
              themeMode === 'light' ? 'text-[#666]' : 'text-slate-400'
            }`}>Bullish</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-3 h-3 rounded border ${
              themeMode === 'light' ? 'bg-[#FFEBEE] border-[#F44336]' : 'bg-red-500/50 border-red-400'
            }`} />
            <span className={`font-medium ${
              themeMode === 'light' ? 'text-[#666]' : 'text-slate-400'
            }`}>Bearish</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-3 h-3 rounded border ${
              themeMode === 'light' ? 'bg-[#FFF8E1] border-[#FF9800]' : 'bg-amber-500/50 border-amber-400'
            }`} />
            <span className={`font-medium ${
              themeMode === 'light' ? 'text-[#666]' : 'text-slate-400'
            }`}>Neutral</span>
          </div>
          <div className={`flex items-center gap-2 text-xs ${
            themeMode === 'light' ? 'text-[#666]' : 'text-slate-400'
          }`}>
            <span className="font-medium">Brightness = Volume</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
