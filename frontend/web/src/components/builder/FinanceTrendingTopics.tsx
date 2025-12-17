import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Activity, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FinanceTrendingTopicsProps {
  title?: string;
  maxTopics?: number;
  showVolume?: boolean;
  autoRefresh?: boolean;
  platforms?: string;
  apiEndpoint?: string;
}

interface TrendingTopic {
  id: string;
  topic: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  volume: string;
  change: number; // Percentage change in mentions
  category: 'macro' | 'sector' | 'company' | 'crypto';
}

export const FinanceTrendingTopics: React.FC<FinanceTrendingTopicsProps> = ({
  title = "Trending Topics",
  maxTopics = 5,
  showVolume = true,
  autoRefresh = true,
  platforms = "reddit,twitter,discord",
  apiEndpoint = "/api/proxy/trending-topics"
}) => {
  const [topics, setTopics] = useState<TrendingTopic[]>([
    {
      id: '1',
      topic: 'Fed Interest Rates',
      sentiment: 'neutral',
      volume: '8.9K discussions',
      change: 15.2,
      category: 'macro'
    },
    {
      id: '2',
      topic: 'Q4 Earnings',
      sentiment: 'bullish',
      volume: '12.5K discussions',
      change: 28.7,
      category: 'sector'
    },
    {
      id: '3',
      topic: 'AI Revolution',
      sentiment: 'bullish',
      volume: '15.6K discussions',
      change: 45.3,
      category: 'sector'
    },
    {
      id: '4',
      topic: 'Inflation Data',
      sentiment: 'neutral',
      volume: '7.2K discussions',
      change: -8.1,
      category: 'macro'
    },
    {
      id: '5',
      topic: 'Tech Regulation',
      sentiment: 'bearish',
      volume: '5.8K discussions',
      change: 22.4,
      category: 'sector'
    },
    {
      id: '6',
      topic: 'Bitcoin ETF',
      sentiment: 'bullish',
      volume: '11.3K discussions',
      change: 67.8,
      category: 'crypto'
    },
    {
      id: '7',
      topic: 'Energy Transition',
      sentiment: 'bullish',
      volume: '6.4K discussions',
      change: 12.9,
      category: 'sector'
    }
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!autoRefresh) return;

    const updateTopics = async () => {
      setLoading(true);
      try {
        // Simulate real-time updates
        setTopics(prevTopics => 
          prevTopics.map(topic => ({
            ...topic,
            change: topic.change + (Math.random() - 0.5) * 5,
            volume: `${(parseFloat(topic.volume) + Math.random() * 0.5).toFixed(1)}K discussions`
          }))
        );
      } catch (error) {
        console.error("Failed to update trending topics:", error);
      } finally {
        setLoading(false);
      }
    };

    const interval = setInterval(updateTopics, 45000); // Update every 45 seconds
    return () => clearInterval(interval);
  }, [autoRefresh, apiEndpoint, platforms]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'macro': return '🏛️';
      case 'sector': return '🏭';
      case 'company': return '🏢';
      case 'crypto': return '₿';
      default: return '📊';
    }
  };

  const getSentimentDot = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'bg-green-400';
      case 'bearish': return 'bg-red-400';
      default: return 'bg-amber-400';
    }
  };

  const displayedTopics = topics.slice(0, maxTopics);

  return (
    <Card className="finance-card border-0">
      <CardHeader className="border-b border-slate-700/50">
        <CardTitle className="flex items-center gap-2 text-white text-sm">
          <Activity className="w-4 h-4 text-blue-400" />
          {title}
          {loading && (
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {displayedTopics.map((topic, index) => (
            <div key={topic.id} className="flex items-center justify-between group hover:bg-slate-800/30 p-2 -m-2 rounded transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs">{getCategoryIcon(topic.category)}</span>
                  <Badge className={cn(
                    "w-2 h-2 p-0 rounded-full",
                    getSentimentDot(topic.sentiment)
                  )} />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-white group-hover:text-blue-400 transition-colors">
                    {topic.topic}
                  </span>
                  {showVolume && (
                    <div className="text-xs text-slate-500 mt-0.5">
                      {topic.volume}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className={cn(
                  "text-xs font-medium flex items-center gap-1",
                  topic.change >= 0 ? "text-green-400" : "text-red-400"
                )}>
                  {topic.change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <div className="w-3 h-3 rotate-180">
                      <TrendingUp className="w-3 h-3" />
                    </div>
                  )}
                  {topic.change >= 0 ? '+' : ''}{topic.change.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Platform Attribution */}
        <div className="mt-4 pt-3 border-t border-slate-700/50">
          <div className="text-xs text-slate-500 text-center">
            Trending across {platforms.split(',').join(', ')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
