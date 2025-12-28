import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Search,
  RefreshCw,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Newspaper,
  Brain,
  ExternalLink
} from 'lucide-react';
import { cn } from '../lib/utils';

interface NewsItem {
  id: string;
  headline: string;
  description: string;
  source: string;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  isRising: boolean;
  category: string;
  aiAnalysis?: string;
  articleUrl?: string;
}

interface SmartNewsFeedProps {
  className?: string;
}

export const SmartNewsFeed: React.FC<SmartNewsFeedProps> = ({ className }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'bullish' | 'neutral' | 'bearish'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAnalysis, setExpandedAnalysis] = useState<string | null>(null);

  // Mock news data - replace with real API data
  const [newsItems] = useState<NewsItem[]>([
    {
      id: '1',
      headline: 'Tech stocks rally as investors eye AI-driven growth opportunities',
      description: 'Major technology companies see significant gains amid optimism around artificial intelligence earnings reports and continued innovation.',
      source: 'Wall Street Journal',
      timestamp: '0m ago',
      sentiment: 'positive',
      sentimentScore: 85,
      isRising: true,
      category: 'Tech',
      aiAnalysis: 'Strong positive sentiment driven by AI revenue growth across major tech companies. Market confidence is high based on analyst upgrades and increased institutional buying.',
      articleUrl: 'https://example.com/tech-rally-ai-growth'
    },
    {
      id: '2',
      headline: 'Federal Reserve hints at potential pause in aggressive rate hiking cycle',
      description: 'Fed officials signal a more cautious approach to future monetary policy decisions as inflation shows signs of cooling.',
      source: 'Reuters',
      timestamp: '15m ago',
      sentiment: 'neutral',
      sentimentScore: 55,
      isRising: false,
      category: 'Economy',
      aiAnalysis: 'Mixed market reaction to Fed commentary. While rate pause is positive for growth stocks, concerns remain about economic slowdown.',
      articleUrl: 'https://example.com/fed-rate-pause-signals'
    },
    {
      id: '3',
      headline: 'Tesla deliveries fall short of analyst expectations for Q4',
      description: 'Electric vehicle manufacturer reports quarterly delivery numbers below Wall Street forecasts, citing supply chain challenges.',
      source: 'CNBC',
      timestamp: '32m ago',
      sentiment: 'negative',
      sentimentScore: 25,
      isRising: false,
      category: 'Earnings',
      aiAnalysis: 'Negative sentiment primarily driven by missed delivery targets. However, long-term outlook remains positive based on expanding production capacity.',
      articleUrl: 'https://example.com/tesla-delivery-miss-q4'
    },
    {
      id: '4',
      headline: 'Bitcoin surges past $45K as institutional adoption accelerates',
      description: 'Cryptocurrency markets see renewed interest from large institutional investors and ETF approval speculation.',
      source: 'CoinDesk',
      timestamp: '45m ago',
      sentiment: 'positive',
      sentimentScore: 78,
      isRising: true,
      category: 'Crypto',
      aiAnalysis: 'Strong bullish momentum supported by institutional inflows and regulatory clarity. Technical indicators suggest continued upward trend.',
      articleUrl: 'https://example.com/bitcoin-surge-institutional'
    },
    {
      id: '5',
      headline: 'Consumer spending data reveals resilient economic fundamentals',
      description: 'Latest retail sales figures exceed expectations, showing continued consumer confidence despite inflation concerns.',
      source: 'Bloomberg',
      timestamp: '1h ago',
      sentiment: 'positive',
      sentimentScore: 72,
      isRising: true,
      category: 'Economy',
      aiAnalysis: 'Positive economic indicator suggesting consumer resilience. Supports arguments for soft landing scenario and reduced recession risk.',
      articleUrl: 'https://example.com/consumer-spending-resilient'
    },
    {
      id: '6',
      headline: 'Banking sector faces regulatory headwinds amid rate environment',
      description: 'Regional banks report mixed earnings as net interest margins face pressure from evolving rate landscape.',
      source: 'Financial Times',
      timestamp: '1h ago',
      sentiment: 'negative',
      sentimentScore: 35,
      isRising: false,
      category: 'Banking',
      aiAnalysis: 'Sector-specific challenges related to interest rate sensitivity. Some banks better positioned than others based on loan portfolios.',
      articleUrl: 'https://example.com/banking-regulatory-headwinds'
    },
    {
      id: '7',
      headline: 'Energy sector rebounds on improved demand outlook and supply constraints',
      description: 'Oil and gas companies benefit from tighter supply conditions and recovering global demand patterns.',
      source: 'MarketWatch',
      timestamp: '2h ago',
      sentiment: 'positive',
      sentimentScore: 68,
      isRising: true,
      category: 'Energy',
      aiAnalysis: 'Fundamental supply-demand dynamics supporting higher energy prices. Geopolitical factors adding additional upward pressure.',
      articleUrl: 'https://example.com/energy-sector-rebound'
    },
    {
      id: '8',
      headline: 'Healthcare innovation drives sector optimism despite regulatory uncertainty',
      description: 'Breakthrough treatments and FDA approvals offset concerns about drug pricing policies and regulatory changes.',
      source: 'Healthcare Finance',
      timestamp: '2h ago',
      sentiment: 'neutral',
      sentimentScore: 58,
      isRising: true,
      category: 'Healthcare',
      aiAnalysis: 'Mixed sentiment with innovation positives balanced against regulatory risks. Selective opportunities in biotech and medical devices.',
      articleUrl: 'https://example.com/healthcare-innovation-outlook'
    }
  ]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-emerald-400';
      case 'negative': return 'text-red-400';
      default: return 'text-amber-400';
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    const colors = {
      positive: 'bg-[#D1FADF] text-[#027A48] border-[#A7F3D0] dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
      negative: 'bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5] dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30',
      neutral: 'bg-[#FFF7ED] text-[#B45309] border-[#FED7AA] dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30'
    };
    return colors[sentiment as keyof typeof colors];
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '🟢';
      case 'negative': return '🔴';
      default: return '🟡';
    }
  };

  const getFilteredNews = () => {
    let filtered = newsItems;
    
    if (activeFilter !== 'all') {
      const sentimentMap = {
        'bullish': 'positive',
        'bearish': 'negative',
        'neutral': 'neutral'
      };
      filtered = filtered.filter(item => item.sentiment === sentimentMap[activeFilter]);
    }

    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.slice(0, 8);
  };

  return (
    <div className={cn("w-full", className)}>
      <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
        {/* Header with gradient */}
        <CardHeader className="bg-gradient-to-r from-purple-600/30 to-violet-600/30 border-b border-purple-500/20 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-6 h-6 text-cyan-400" />
                Smart News Feed
              </CardTitle>
              <Badge className="bg-purple-200/20 text-purple-300 border-purple-400/30">
                AI Powered
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search news, tickers, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 bg-black/30 border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:bg-black/50 focus:border-pink-400/50"
                />
              </div>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-purple-500/10 rounded-lg">
                <RefreshCw className="w-4 h-4 text-gray-300 hover:text-purple-400" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Filter Tabs */}
        <div className="p-4 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            {[
              { key: 'all', label: 'All News' },
              { key: 'bullish', label: 'Bullish' },
              { key: 'neutral', label: 'Neutral' },
              { key: 'bearish', label: 'Bearish' }
            ].map(filter => {
              const getFilterStyles = (filterKey: string, isActive: boolean) => {
                const baseStyles = "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 shadow-sm border";
                
                if (isActive) {
                  switch(filterKey) {
                    case 'all':
                      return `${baseStyles} bg-[#F4F6FA] text-[#1F2937] border-[#CBD5E1] dark:bg-purple-500/30 dark:text-purple-300 dark:border-purple-400/50`;
                    case 'bullish':
                      return `${baseStyles} bg-[#D1FADF] text-[#027A48] border-[#A7F3D0] dark:bg-emerald-500/30 dark:text-emerald-300 dark:border-emerald-400/50`;
                    case 'neutral':
                      return `${baseStyles} bg-[#FFF7ED] text-[#B45309] border-[#FCD34D] dark:bg-amber-500/30 dark:text-amber-300 dark:border-amber-400/50`;
                    case 'bearish':
                      return `${baseStyles} bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5] dark:bg-red-500/30 dark:text-red-300 dark:border-red-400/50`;
                    default:
                      return `${baseStyles} bg-[#F4F6FA] text-[#1F2937] border-[#CBD5E1]`;
                  }
                } else {
                  return `${baseStyles} bg-white text-[#9CA3AF] border-[#E6E6E6] hover:bg-[#F3F4F6] hover:text-[#4B5563] hover:border-[#D1D5DB] dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300`;
                }
              };

              return (
                <Button
                  key={filter.key}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveFilter(filter.key as any)}
                  className={getFilterStyles(filter.key, activeFilter === filter.key)}
                >
                  {filter.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* News Items */}
        <CardContent className="p-0">
          <div className="space-y-0">
            {getFilteredNews().map((item, index) => (
              <div
                key={item.id}
                className="p-5 border border-[#DDE3EC] dark:border-purple-500/10 bg-[#F4F6FA] dark:bg-transparent hover:bg-[#E8F0FE] dark:hover:bg-purple-500/5 transition-all duration-300 group rounded-xl shadow-sm mb-4"
              >
                {/* Header with source and timestamp */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#1F2937] dark:text-gray-400 font-medium">{item.source}</span>
                    <span className="text-xs text-[#4B5563] dark:text-gray-500">•</span>
                    <span className="text-xs text-[#4B5563] dark:text-gray-500">{item.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-xs", getSentimentBadge(item.sentiment))}>
                      {getSentimentEmoji(item.sentiment)} {item.sentiment}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {item.isRising ? (
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-400" />
                      )}
                      <span className={cn("text-xs font-medium", getSentimentColor(item.sentiment))}>
                        {item.sentimentScore}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Headline */}
                <h3 className="text-lg font-semibold text-[#1F2937] dark:text-white mb-2 leading-tight group-hover:text-[#3730A3] dark:group-hover:text-purple-300 transition-colors cursor-pointer flex items-center gap-2">
                  {item.headline}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>

                {/* Description */}
                <p className="text-[#4B5563] dark:text-gray-400 text-sm leading-relaxed mb-3">
                  {item.description}
                </p>

                {/* Category and AI Analysis */}
                <div className="flex items-center justify-between">
                  <Badge className="bg-[#E0E7EF] text-[#334155] border-[#CBD5E1] dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600/50 text-xs font-medium">
                    {item.category}
                  </Badge>
                  
                  {item.aiAnalysis && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedAnalysis(
                        expandedAnalysis === item.id ? null : item.id
                      )}
                      className="text-[#4338CA] hover:text-[#3730A3] dark:text-purple-400 dark:hover:text-purple-300 text-xs flex items-center gap-1 font-medium"
                    >
                      <Brain className="w-3 h-3" />
                      AI Analysis
                      <ChevronDown className={cn(
                        "w-3 h-3 transition-transform",
                        expandedAnalysis === item.id && "rotate-180"
                      )} />
                    </Button>
                  )}
                </div>

                {/* Expanded AI Analysis */}
                {expandedAnalysis === item.id && item.aiAnalysis && (
                  <div className="mt-4 p-4 bg-[#EEF2FF] border border-[#C7D2FE] dark:bg-purple-500/10 dark:border-purple-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-[#4338CA] dark:text-purple-400" />
                      <span className="text-sm font-medium text-[#4338CA] dark:text-purple-300">AI Analysis</span>
                    </div>
                    <p className="text-sm text-[#1F2937] dark:text-gray-300 leading-relaxed mb-3">
                      {item.aiAnalysis}
                    </p>
                    {/* Read Full Article Link */}
                    {item.articleUrl && (
                      <a
                        href={item.articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors group"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Read Full Article
                        <span className="text-xs text-gray-500 group-hover:text-gray-400">↗</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {getFilteredNews().length === 0 && (
            <div className="p-12 text-center">
              <Newspaper className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No news found</h3>
              <p className="text-sm text-gray-500">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
