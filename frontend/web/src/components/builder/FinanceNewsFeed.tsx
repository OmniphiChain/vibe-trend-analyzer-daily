import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Globe, ExternalLink, ChevronUp, ChevronDown, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useMoodTheme } from '../../contexts/MoodThemeContext';

interface FinanceNewsFeedProps {
  title?: string;
  maxArticles?: number;
  showSentiment?: boolean;
  showSummary?: boolean;
  autoRefresh?: boolean;
  categories?: string;
  apiEndpoint?: string;
}

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  source: string;
  timestamp: Date;
  url?: string;
}

export const FinanceNewsFeed: React.FC<FinanceNewsFeedProps> = ({
  title = "Smart News Feed",
  maxArticles = 5,
  showSentiment = true,
  showSummary = true,
  autoRefresh = true,
  categories = "finance,technology,economy",
  apiEndpoint = "/api/proxy/newsapi/top-headlines"
}) => {
  const { themeMode } = useMoodTheme();
  const [articles, setArticles] = useState<NewsArticle[]>([
    {
      id: '1',
      title: 'Federal Reserve Maintains Rate Pause Amid Economic Stability',
      summary: 'The Fed keeps rates steady as inflation shows signs of cooling while employment remains strong.',
      sentiment: 'neutral',
      source: 'Reuters',
      timestamp: new Date(Date.now() - 1800000), // 30 min ago
    },
    {
      id: '2',
      title: 'Tech Giants Report Strong Q4 Earnings Driven by AI Innovation',
      summary: 'Major technology companies exceed expectations with AI-related revenue growth driving significant gains.',
      sentiment: 'bullish',
      source: 'Bloomberg',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
      id: '3',
      title: 'Energy Sector Rallies on Supply Chain Concerns',
      summary: 'Oil and gas stocks surge amid geopolitical tensions affecting global supply chains.',
      sentiment: 'bullish',
      source: 'CNBC',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    },
    {
      id: '4',
      title: 'Cryptocurrency Market Shows Mixed Signals After Recent Volatility',
      summary: 'Bitcoin and Ethereum trade sideways as institutional investors remain cautious.',
      sentiment: 'neutral',
      source: 'CoinDesk',
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
    },
    {
      id: '5',
      title: 'Manufacturing Data Points to Economic Resilience',
      summary: 'Latest PMI data suggests manufacturing sector continues to expand despite global headwinds.',
      sentiment: 'bullish',
      source: 'Financial Times',
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
    }
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!autoRefresh) return;

    const fetchNews = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would fetch from the API
        // For now, we'll simulate updating timestamps
        setArticles(prevArticles => 
          prevArticles.map(article => ({
            ...article,
            timestamp: new Date(article.timestamp.getTime() + 60000) // Add 1 minute
          }))
        );
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };

    const interval = setInterval(fetchNews, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [autoRefresh, apiEndpoint, categories]);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <ChevronUp className="w-3 h-3" />;
      case 'bearish': return <ChevronDown className="w-3 h-3" />;
      default: return <Minus className="w-3 h-3" />;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const displayedArticles = articles.slice(0, maxArticles);

  return (
    <Card className={themeMode === 'light' ? "widget-news enhanced-card-light" : "finance-card border-0"}>
      <CardHeader className={themeMode === 'light' ? "border-b border-[#E0E0E0]" : "border-b border-slate-700/50"}>
        <CardTitle className="flex items-center gap-2 text-white">
          <Globe className="w-5 h-5 text-blue-400" />
          {title}
          {loading && (
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {displayedArticles.map((article) => (
            <div key={article.id} className="group p-4 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-all cursor-pointer">
              <div className="flex items-start gap-3">
                {showSentiment && (
                  <Badge className={cn(
                    "mt-1 text-xs flex-shrink-0",
                    article.sentiment === 'bullish' ? "bg-green-500/20 text-green-400" :
                    article.sentiment === 'bearish' ? "bg-red-500/20 text-red-400" :
                    "bg-amber-500/20 text-amber-400"
                  )}>
                    {getSentimentIcon(article.sentiment)}
                  </Badge>
                )}
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-2 group-hover:text-blue-400 transition-colors leading-tight">
                    {article.title}
                  </h3>
                  {showSummary && (
                    <p className="text-slate-400 text-sm mb-3 leading-relaxed">{article.summary}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{article.source}</span>
                      <span className="text-xs text-slate-600">•</span>
                      <span className="text-xs text-slate-500">{formatTimeAgo(article.timestamp)}</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
