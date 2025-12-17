import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, BarChart3, Eye, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TopMoversMarketSentimentProps {
  title?: string;
  maxStocks?: number;
  showSparklines?: boolean;
  autoRefresh?: boolean;
  apiEndpoint?: string;
}

interface StockMover {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  sentimentScore: number;
  volume: number;
  sparklineData: number[];
  category: 'top_bullish' | 'top_bearish';
  mentions: number;
  socialSentiment: number;
}

export const TopMoversMarketSentiment: React.FC<TopMoversMarketSentimentProps> = ({
  title = "Top Movers - Market Sentiment",
  maxStocks = 6,
  showSparklines = true,
  autoRefresh = true,
  apiEndpoint = "/api/stocks/top-movers"
}) => {
  const [movers, setMovers] = useState<StockMover[]>([
    // Top Bullish
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 875.28, change: 23.45, changePercent: 2.76, sentiment: 'bullish', sentimentScore: 87, volume: 45200000, sparklineData: [850, 860, 872, 885, 875], category: 'top_bullish', mentions: 15420, socialSentiment: 92 },
    { symbol: 'AAPL', name: 'Apple Inc', price: 190.64, change: 4.12, changePercent: 2.21, sentiment: 'bullish', sentimentScore: 78, volume: 52100000, sparklineData: [185, 187, 189, 192, 190], category: 'top_bullish', mentions: 11230, socialSentiment: 76 },
    { symbol: 'MSFT', name: 'Microsoft Corp', price: 378.85, change: 7.44, changePercent: 2.00, sentiment: 'bullish', sentimentScore: 82, volume: 28900000, sparklineData: [370, 375, 377, 380, 378], category: 'top_bullish', mentions: 8750, socialSentiment: 84 },
    
    // Top Bearish
    { symbol: 'TSLA', name: 'Tesla Inc', price: 248.50, change: -8.22, changePercent: -3.21, sentiment: 'bearish', sentimentScore: 32, volume: 89600000, sparklineData: [260, 255, 250, 245, 248], category: 'top_bearish', mentions: 12340, socialSentiment: 28 },
    { symbol: 'GOOGL', name: 'Alphabet Inc', price: 139.69, change: -2.87, changePercent: -2.02, sentiment: 'bearish', sentimentScore: 41, volume: 35400000, sparklineData: [145, 142, 140, 138, 139], category: 'top_bearish', mentions: 8432, socialSentiment: 45 },
    { symbol: 'AMZN', name: 'Amazon.com Inc', price: 155.74, change: -3.12, changePercent: -1.96, sentiment: 'bearish', sentimentScore: 38, volume: 41200000, sparklineData: [162, 158, 156, 154, 155], category: 'top_bearish', mentions: 6890, socialSentiment: 35 }
  ]);
  const [activeTab, setActiveTab] = useState<'bullish' | 'bearish'>('bullish');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setMovers(prev => prev.map(stock => ({
          ...stock,
          price: stock.price + (Math.random() - 0.5) * 2,
          change: stock.change + (Math.random() - 0.5) * 1,
          sentimentScore: Math.max(0, Math.min(100, stock.sentimentScore + (Math.random() - 0.5) * 5)),
          socialSentiment: Math.max(0, Math.min(100, stock.socialSentiment + (Math.random() - 0.5) * 8))
        })));
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const bullishMovers = movers.filter(stock => stock.category === 'top_bullish').slice(0, maxStocks / 2);
  const bearishMovers = movers.filter(stock => stock.category === 'top_bearish').slice(0, maxStocks / 2);

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getSentimentColor = (score: number) => {
    if (score >= 70) return 'text-emerald-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'bearish': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
  };

  const renderSparkline = (data: number[]) => {
    if (!showSparklines || data.length < 2) return null;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 15;
      return `${x},${y}`;
    }).join(' ');

    const isPositive = data[data.length - 1] >= data[0];
    
    return (
      <svg width="60" height="20" className="overflow-visible">
        <polyline
          fill="none"
          stroke={isPositive ? '#10b981' : '#ef4444'}
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    );
  };

  const StockCard = ({ stock }: { stock: StockMover }) => (
    <div className="bg-gradient-to-br from-black/60 to-purple-900/20 rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">{stock.symbol[0]}</span>
            </div>
            <div>
              <div className="font-bold text-white text-lg">{stock.symbol}</div>
              <div className="text-xs text-slate-400">{stock.name}</div>
            </div>
          </div>
        </div>
        <Badge className={getSentimentBadgeColor(stock.sentiment)}>
          {stock.sentiment}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <div className="text-lg font-bold text-white truncate">{formatPrice(stock.price)}</div>
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium",
            stock.change >= 0 ? "text-emerald-400" : "text-red-400"
          )}>
            {stock.change >= 0 ? <ArrowUp className="w-3 h-3 flex-shrink-0" /> : <ArrowDown className="w-3 h-3 flex-shrink-0" />}
            <span className="truncate">
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="text-right">
          {renderSparkline(stock.sparklineData)}
          <div className="text-xs text-slate-400 mt-1">5D trend</div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Sentiment Score */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 truncate flex-1">Market Sentiment</span>
            <span className={cn("font-medium text-xs ml-2 min-w-[30px] text-right", getSentimentColor(stock.sentimentScore))}>
              {Math.round(stock.sentimentScore)}
            </span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-500",
                stock.sentiment === 'bullish' ? 'bg-emerald-400' : 'bg-red-400'
              )}
              style={{ width: `${stock.sentimentScore}%` }}
            />
          </div>
        </div>

        {/* Social Sentiment */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 truncate flex-1">Social Sentiment</span>
            <span className={cn("font-medium text-xs ml-2 min-w-[30px] text-right", getSentimentColor(stock.socialSentiment))}>
              {Math.round(stock.socialSentiment)}
            </span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-500",
                stock.socialSentiment >= 50 ? 'bg-cyan-400' : 'bg-amber-400'
              )}
              style={{ width: `${stock.socialSentiment}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/50">
          <span className="truncate flex-1">Vol: {formatVolume(stock.volume)}</span>
          <span className="ml-2 whitespace-nowrap">{stock.mentions.toLocaleString()} mentions</span>
        </div>
      </div>

      {/* Expand Button - Hidden by default, shown on hover */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs text-purple-300 hover:text-purple-200 hover:bg-purple-500/10"
        >
          <Eye className="w-3 h-3 mr-1" />
          View Detailed Analysis
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="finance-card border-0">
      <CardHeader className="border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            {title}
            {loading && (
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            )}
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'bullish' ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab('bullish')}
            className={cn(
              "flex items-center gap-2",
              activeTab === 'bullish' ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : ""
            )}
          >
            <TrendingUp className="w-4 h-4" />
            Top Bullish ({bullishMovers.length})
          </Button>
          <Button
            variant={activeTab === 'bearish' ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab('bearish')}
            className={cn(
              "flex items-center gap-2",
              activeTab === 'bearish' ? "bg-red-500/20 text-red-400 border-red-500/30" : ""
            )}
          >
            <TrendingDown className="w-4 h-4" />
            Top Bearish ({bearishMovers.length})
          </Button>
        </div>

        {/* Stock Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(activeTab === 'bullish' ? bullishMovers : bearishMovers).map((stock, index) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-slate-700/50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-emerald-400">
                {bullishMovers.reduce((sum, stock) => sum + stock.sentimentScore, 0) / bullishMovers.length || 0}
              </div>
              <div className="text-xs text-slate-400">Avg Bullish Sentiment</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-400">
                {bearishMovers.reduce((sum, stock) => sum + stock.sentimentScore, 0) / bearishMovers.length || 0}
              </div>
              <div className="text-xs text-slate-400">Avg Bearish Sentiment</div>
            </div>
            <div>
              <div className="text-lg font-bold text-cyan-400">
                {formatVolume(movers.reduce((sum, stock) => sum + stock.volume, 0))}
              </div>
              <div className="text-xs text-slate-400">Total Volume</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
