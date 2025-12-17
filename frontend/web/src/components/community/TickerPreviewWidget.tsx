import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Plus, Eye, ExternalLink, Loader2, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TickerData {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  marketCap?: string;
  dayRange?: [number, number];
  sparklineData?: number[];
}

interface TickerPreviewWidgetProps {
  ticker: string;
  isVisible: boolean;
  position: { x: number; y: number };
  onAddToWatchlist?: (ticker: string) => void;
  onViewFullPage?: (ticker: string) => void;
  onClose?: () => void;
}

// Mock data generator for demonstration
const generateMockTickerData = (symbol: string): TickerData => {
  const basePrice = Math.random() * 500 + 50;
  const change = (Math.random() - 0.5) * 20;
  const changePercent = (change / basePrice) * 100;
  
  // Generate mock sparkline data (24 points for 24 hours)
  const sparklineData = Array.from({ length: 24 }, (_, i) => {
    const variation = Math.sin(i * 0.5) * 5 + (Math.random() - 0.5) * 3;
    return basePrice + variation;
  });

  const companyNames: Record<string, string> = {
    'NVDA': 'NVIDIA Corporation',
    'TSLA': 'Tesla, Inc.',
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'META': 'Meta Platforms, Inc.',
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'SPY': 'SPDR S&P 500 ETF',
    'QQQ': 'Invesco QQQ Trust',
  };

  return {
    symbol,
    companyName: companyNames[symbol] || `${symbol} Corp.`,
    price: basePrice,
    change,
    changePercent,
    volume: Math.floor(Math.random() * 10000000),
    marketCap: `$${(Math.random() * 500 + 50).toFixed(1)}B`,
    dayRange: [basePrice - 10, basePrice + 10],
    sparklineData,
  };
};

const SparklineChart: React.FC<{ data: number[]; isPositive: boolean }> = ({ data, isPositive }) => {
  const width = 120;
  const height = 40;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-[120px] h-[40px] overflow-hidden">
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? "#10b981" : "#ef4444"}
          strokeWidth="2"
          className="drop-shadow-sm"
        />
        <defs>
          <linearGradient id={`gradient-${isPositive ? 'green' : 'red'}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={`0,${height} ${points} ${width},${height}`}
          fill={`url(#gradient-${isPositive ? 'green' : 'red'})`}
          stroke="none"
        />
      </svg>
    </div>
  );
};

export const TickerPreviewWidget: React.FC<TickerPreviewWidgetProps> = ({
  ticker,
  isVisible,
  position,
  onAddToWatchlist,
  onViewFullPage,
  onClose
}) => {
  const [tickerData, setTickerData] = useState<TickerData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoPosition, setAutoPosition] = useState(position);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && ticker) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setTickerData(generateMockTickerData(ticker));
        setIsLoading(false);
      }, 300);
    }
  }, [isVisible, ticker]);

  useEffect(() => {
    if (isVisible && widgetRef.current) {
      const widget = widgetRef.current;
      const rect = widget.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let newX = position.x;
      let newY = position.y;
      
      // Adjust horizontal position if widget would overflow
      if (position.x + rect.width > viewportWidth - 20) {
        newX = position.x - rect.width - 20;
      }
      
      // Adjust vertical position if widget would overflow
      if (position.y + rect.height > viewportHeight - 20) {
        newY = position.y - rect.height - 20;
      }
      
      // Ensure widget doesn't go off the left or top edge
      newX = Math.max(20, newX);
      newY = Math.max(20, newY);
      
      if (newX !== autoPosition.x || newY !== autoPosition.y) {
        setAutoPosition({ x: newX, y: newY });
      }
    }
  }, [isVisible, position, widgetRef.current]);

  if (!isVisible) return null;

  const isPositive = tickerData ? tickerData.change >= 0 : false;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const borderColor = isPositive ? 'border-green-500/30' : 'border-red-500/30';
  const shadowColor = isPositive ? 'shadow-green-500/10' : 'shadow-red-500/10';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-[1px] pointer-events-none"
      />
      
      {/* Widget */}
      <div
        ref={widgetRef}
        className={cn(
          "fixed z-[101] w-80 transition-all duration-300 transform",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
        style={{
          left: autoPosition.x,
          top: autoPosition.y,
        }}
      >
        <Card className={cn(
          "bg-slate-800/95 backdrop-blur-xl border shadow-2xl",
          borderColor,
          shadowColor,
          "animate-in slide-in-from-bottom-2 fade-in duration-300"
        )}>
          <CardContent className="p-4 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                <span className="ml-2 text-slate-400">Loading ${ticker}...</span>
              </div>
            ) : tickerData ? (
              <>
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        ${tickerData.symbol}
                        {isPositive ? (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                      </h3>
                      <p className="text-sm text-slate-400 truncate">{tickerData.companyName}</p>
                    </div>
                    <Badge className={cn(
                      "px-2 py-1 text-xs font-semibold border",
                      isPositive 
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    )}>
                      {isPositive ? '📈' : '📉'}
                    </Badge>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-white">
                      ${tickerData.price.toFixed(2)}
                    </span>
                    <div className={cn("flex items-center gap-1 text-sm font-semibold", changeColor)}>
                      <span>{isPositive ? '+' : ''}${tickerData.change.toFixed(2)}</span>
                      <span>({isPositive ? '+' : ''}{tickerData.changePercent.toFixed(2)}%)</span>
                    </div>
                  </div>
                </div>

                {/* Sparkline Chart */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">24H CHART</span>
                    {tickerData.volume && (
                      <span className="text-xs text-slate-400">
                        Vol: {(tickerData.volume / 1000000).toFixed(1)}M
                      </span>
                    )}
                  </div>
                  <div className="flex justify-center py-2">
                    {tickerData.sparklineData && (
                      <SparklineChart 
                        data={tickerData.sparklineData} 
                        isPositive={isPositive} 
                      />
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  {tickerData.marketCap && (
                    <div>
                      <span className="text-slate-400">Market Cap</span>
                      <div className="text-slate-200 font-semibold">{tickerData.marketCap}</div>
                    </div>
                  )}
                  {tickerData.dayRange && (
                    <div>
                      <span className="text-slate-400">Day Range</span>
                      <div className="text-slate-200 font-semibold">
                        ${tickerData.dayRange[0].toFixed(2)} - ${tickerData.dayRange[1].toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => onAddToWatchlist?.(ticker)}
                    className="flex-1 h-8 text-xs bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add to Watchlist
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewFullPage?.(ticker)}
                    className="h-8 px-3 text-xs border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500"
                    title="View Analytics"
                  >
                    <BarChart3 className="w-3 h-3" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-slate-400">Unable to load data for ${ticker}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

// Hook for ticker hover functionality
export const useTickerHover = () => {
  const [hoveredTicker, setHoveredTicker] = useState<{
    ticker: string;
    position: { x: number; y: number };
  } | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const showTickerPreview = (ticker: string, event: React.MouseEvent) => {
    const rect = (event.target as Element).getBoundingClientRect();
    clearHideTimeout();
    setHoveredTicker({
      ticker,
      position: {
        x: rect.right + 10,
        y: rect.top
      }
    });
  };

  const hideTickerPreview = () => {
    clearHideTimeout();
    setHoveredTicker(null);
  };

  const scheduleHide = (delay = 150) => {
    clearHideTimeout();
    hideTimeoutRef.current = window.setTimeout(() => {
      setHoveredTicker(null);
    }, delay);
  };

  return {
    hoveredTicker,
    showTickerPreview,
    hideTickerPreview,
    scheduleHide,
    cancelHide: clearHideTimeout,
  };
};

// Enhanced text renderer with ticker hover support
export const TickerAwareText: React.FC<{
  content: string;
  className?: string;
  onTickerHover?: (ticker: string, event: React.MouseEvent) => void;
  onTickerLeave?: () => void;
  onTickerClick?: (ticker: string) => void;
}> = ({ 
  content, 
  className, 
  onTickerHover, 
  onTickerLeave,
  onTickerClick 
}) => {
  const parts = content.split(/(\$[A-Z]{1,5}|\p{Emoji})/gu);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.match(/^\$[A-Z]{1,5}$/)) {
          const ticker = part.substring(1);
          return (
            <span
              key={index}
              className="text-cyan-400 font-semibold hover:text-cyan-300 cursor-pointer transition-all duration-200 hover:bg-cyan-500/10 px-1 py-0.5 rounded"
              onMouseEnter={(e) => onTickerHover?.(ticker, e)}
              onMouseLeave={onTickerLeave}
              onClick={(e) => {
                e.stopPropagation();
                onTickerClick?.(ticker);
              }}
            >
              {part}
            </span>
          );
        } else if (part.match(/\p{Emoji}/u)) {
          return (
            <span key={index} className="hover:scale-110 transition-transform inline-block duration-200">
              {part}
            </span>
          );
        }
        return part;
      })}
    </span>
  );
};
