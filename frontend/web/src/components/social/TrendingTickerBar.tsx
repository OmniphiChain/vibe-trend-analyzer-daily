import React from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TickerData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  statusColor: 'blue' | 'green' | 'red';
}

interface TrendingTickerBarProps {
  className?: string;
}

export const TrendingTickerBar: React.FC<TrendingTickerBarProps> = ({ className }) => {
  // Mock trending ticker data - in a real app this would come from props or API
  const trendingTickers: TickerData[] = [
    {
      symbol: 'SPY',
      price: 158.61,
      change: 4.29,
      changePercent: 4.32,
      statusColor: 'blue'
    },
    {
      symbol: 'AAPL',
      price: 236.65,
      change: -3.96,
      changePercent: -3.90,
      statusColor: 'green'
    },
    {
      symbol: 'NVDA',
      price: 454.65,
      change: -8.35,
      changePercent: -3.65,
      statusColor: 'red'
    },
    {
      symbol: 'DIA',
      price: 174.26,
      change: -6.45,
      changePercent: -3.45,
      statusColor: 'blue'
    },
    {
      symbol: 'TSLA',
      price: 245.67,
      change: 12.43,
      changePercent: 5.32,
      statusColor: 'green'
    }
  ];

  const marketSummary = 4.32; // Overall market change percentage

  const getStatusColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-[#00FF99]';
      case 'red':
        return 'bg-[#FF4B4B]';
      case 'blue':
      default:
        return 'bg-[#61A0FF]';
    }
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]';
  };

  const formatChange = (change: number) => {
    const symbol = change >= 0 ? '▲' : '▼';
    const sign = change >= 0 ? '+' : '';
    return `${symbol} ${sign}${change.toFixed(2)}%`;
  };

  return (
    <div className="w-full bg-[#0e1423] border-b border-[#2c3140] px-4 py-3 relative overflow-hidden text-[#ebb2b2]">
      <div className="flex items-center justify-between max-w-full">
        {/* Left Section - Trending Label */}
        <div className="flex items-center gap-3 flex-shrink-0 pr-3 border-r border-[#2c3140]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#FFA500]" />
            <span className="text-xs font-bold text-[#FFA500] uppercase tracking-wider">
              TRENDING
            </span>
          </div>
          
          {/* Market Summary Bubble */}
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#7B5FFF] to-[#00D2FF] shadow-lg">
            <span className="text-xs font-bold text-white">
              {marketSummary >= 0 ? '+' : ''}{marketSummary.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Center Section - Auto-Scrolling Ticker Strip */}
        <div className="flex-1 mx-4 overflow-hidden">
                      <div
            className="flex items-center gap-3"
            style={{
              width: '200%',
              animation: 'scroll-ticker 30s linear infinite',
              transform: 'translateX(0)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
            onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
          >
            {/* Duplicate tickers for seamless loop */}
            {trendingTickers.concat(trendingTickers).map((ticker, index) => (
              <div
                key={`${ticker.symbol}-${index}`}
                className="flex items-center gap-2 px-3 py-2 bg-[#1a1f2b] backdrop-blur-sm rounded-lg border border-[#2c3140] hover:border-[#7B5FFF]/30 transition-all duration-200 hover:bg-[#1a1f2b]/80 min-w-max hover:shadow-lg hover:shadow-[#7B5FFF]/10"
              >
                {/* Status Dot */}
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  getStatusColor(ticker.statusColor)
                )} />
                
                {/* Ticker Info */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">
                    ${ticker.symbol}
                  </span>
                  <span className="text-xs text-[#9CA3AF]">
                    ${ticker.price.toFixed(2)}
                  </span>
                  <span className={cn(
                    "text-xs font-medium",
                    getChangeColor(ticker.changePercent)
                  )}>
                    {formatChange(ticker.changePercent)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Refresh Info */}
        <div className="flex items-center gap-2 flex-shrink-0 pl-3">
          <div className="bg-[#1f2633] rounded-lg px-2 py-1 flex items-center gap-2">
            <RefreshCw className="w-3 h-3 text-[#9CA3AF] animate-spin" style={{
              animationDuration: '3s',
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite'
            }} />
            <span className="text-xs text-[#9CA3AF] hidden sm:inline">
              Updates every 30s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
