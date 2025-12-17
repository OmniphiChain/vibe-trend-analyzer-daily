import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { EmojiIcon } from '../lib/iconUtils';
import {
  Search,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Eye,
  BarChart3,
  Plus,
  Check,
  Flame,
  Activity,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Star,
  StarOff
} from 'lucide-react';
import { cn } from '../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface StockData {
  rank: number;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  sparklineData: number[];
  high52w: number;
  low52w: number;
  isWatched: boolean;
  lastUpdate: string;
}

interface StockActivityDashboardProps {
  className?: string;
  showHeader?: boolean;
  defaultTab?: string;
}

const StockActivityDashboard: React.FC<StockActivityDashboardProps> = ({
  className,
  showHeader = true,
  defaultTab = "trending"
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [timeframe, setTimeframe] = useState<"1D" | "7D" | "30D">("1D");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"change" | "volume" | "marketCap" | "price">("change");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"compact" | "expanded">("compact");

  // Mock data for different categories
  const stockCategories = {
    trending: [
      { rank: 1, symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.28, change: 23.45, changePercent: 2.76, volume: '89.2M', marketCap: '$2.16T', sentiment: 'bullish' as const, sparklineData: [850, 860, 870, 875, 880, 875], high52w: 950.02, low52w: 108.13, isWatched: true, lastUpdate: '2m ago' },
      { rank: 2, symbol: 'TSLA', name: 'Tesla, Inc.', price: 248.50, change: -8.22, changePercent: -3.21, volume: '156.7M', marketCap: '$790B', sentiment: 'bearish' as const, sparklineData: [260, 255, 250, 248, 245, 248], high52w: 299.29, low52w: 152.37, isWatched: false, lastUpdate: '1m ago' },
      { rank: 3, symbol: 'AAPL', name: 'Apple Inc.', price: 190.64, change: 4.12, changePercent: 2.21, volume: '67.3M', marketCap: '$2.91T', sentiment: 'bullish' as const, sparklineData: [185, 187, 189, 190, 192, 190], high52w: 199.62, low52w: 164.08, isWatched: true, lastUpdate: '3m ago' },
      { rank: 4, symbol: 'GOOGL', name: 'Alphabet Inc.', price: 139.69, change: -2.87, changePercent: -2.02, volume: '34.1M', marketCap: '$1.75T', sentiment: 'neutral' as const, sparklineData: [142, 141, 140, 139, 138, 139], high52w: 153.78, low52w: 83.34, isWatched: false, lastUpdate: '2m ago' },
      { rank: 5, symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.85, change: 7.44, changePercent: 2.00, volume: '28.9M', marketCap: '$2.81T', sentiment: 'bullish' as const, sparklineData: [370, 375, 377, 378, 380, 378], high52w: 384.30, low52w: 309.45, isWatched: true, lastUpdate: '1m ago' },
    ],
    mostActive: [
      { rank: 1, symbol: 'TSLA', name: 'Tesla, Inc.', price: 248.50, change: -8.22, changePercent: -3.21, volume: '156.7M', marketCap: '$790B', sentiment: 'bearish' as const, sparklineData: [260, 255, 250, 248, 245, 248], high52w: 299.29, low52w: 152.37, isWatched: false, lastUpdate: '1m ago' },
      { rank: 2, symbol: 'SQQQ', name: 'ProShares UltraPro Short QQQ', price: 8.77, change: 1.24, changePercent: 16.46, volume: '134.2M', marketCap: '$2.1B', sentiment: 'bullish' as const, sparklineData: [7.5, 8.0, 8.2, 8.5, 8.8, 8.7], high52w: 52.51, low52w: 7.22, isWatched: false, lastUpdate: '30s ago' },
      { rank: 3, symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.28, change: 23.45, changePercent: 2.76, volume: '89.2M', marketCap: '$2.16T', sentiment: 'bullish' as const, sparklineData: [850, 860, 870, 875, 880, 875], high52w: 950.02, low52w: 108.13, isWatched: true, lastUpdate: '2m ago' },
      { rank: 4, symbol: 'AMD', name: 'Advanced Micro Devices', price: 142.56, change: 5.23, changePercent: 3.81, volume: '78.4M', marketCap: '$230B', sentiment: 'bullish' as const, sparklineData: [135, 138, 140, 142, 145, 142], high52w: 227.30, low52w: 93.12, isWatched: false, lastUpdate: '45s ago' },
      { rank: 5, symbol: 'AAPL', name: 'Apple Inc.', price: 190.64, change: 4.12, changePercent: 2.21, volume: '67.3M', marketCap: '$2.91T', sentiment: 'bullish' as const, sparklineData: [185, 187, 189, 190, 192, 190], high52w: 199.62, low52w: 164.08, isWatched: true, lastUpdate: '3m ago' },
    ],
    watchers: [
      { rank: 1, symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.28, change: 23.45, changePercent: 2.76, volume: '89.2M', marketCap: '$2.16T', sentiment: 'bullish' as const, sparklineData: [850, 860, 870, 875, 880, 875], high52w: 950.02, low52w: 108.13, isWatched: true, lastUpdate: '2m ago' },
      { rank: 2, symbol: 'AAPL', name: 'Apple Inc.', price: 190.64, change: 4.12, changePercent: 2.21, volume: '67.3M', marketCap: '$2.91T', sentiment: 'bullish' as const, sparklineData: [185, 187, 189, 190, 192, 190], high52w: 199.62, low52w: 164.08, isWatched: true, lastUpdate: '3m ago' },
      { rank: 3, symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.85, change: 7.44, changePercent: 2.00, volume: '28.9M', marketCap: '$2.81T', sentiment: 'bullish' as const, sparklineData: [370, 375, 377, 378, 380, 378], high52w: 384.30, low52w: 309.45, isWatched: true, lastUpdate: '1m ago' },
    ],
    topGainers: [
      { rank: 1, symbol: 'SQQQ', name: 'ProShares UltraPro Short QQQ', price: 8.77, change: 1.24, changePercent: 16.46, volume: '134.2M', marketCap: '$2.1B', sentiment: 'bullish' as const, sparklineData: [7.5, 8.0, 8.2, 8.5, 8.8, 8.7], high52w: 52.51, low52w: 7.22, isWatched: false, lastUpdate: '30s ago' },
      { rank: 2, symbol: 'PLTR', name: 'Palantir Technologies', price: 22.45, change: 2.87, changePercent: 14.67, volume: '45.3M', marketCap: '$48.2B', sentiment: 'bullish' as const, sparklineData: [19, 20, 21, 22, 23, 22.4], high52w: 39.50, low52w: 13.69, isWatched: false, lastUpdate: '1m ago' },
      { rank: 3, symbol: 'RIVN', name: 'Rivian Automotive', price: 11.23, change: 1.45, changePercent: 14.83, volume: '23.7M', marketCap: '$10.4B', sentiment: 'bullish' as const, sparklineData: [9.5, 10, 10.5, 11, 11.5, 11.2], high52w: 179.47, low52w: 8.26, isWatched: false, lastUpdate: '2m ago' },
      { rank: 4, symbol: 'AMD', name: 'Advanced Micro Devices', price: 142.56, change: 5.23, changePercent: 3.81, volume: '78.4M', marketCap: '$230B', sentiment: 'bullish' as const, sparklineData: [135, 138, 140, 142, 145, 142], high52w: 227.30, low52w: 93.12, isWatched: false, lastUpdate: '45s ago' },
      { rank: 5, symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.28, change: 23.45, changePercent: 2.76, volume: '89.2M', marketCap: '$2.16T', sentiment: 'bullish' as const, sparklineData: [850, 860, 870, 875, 880, 875], high52w: 950.02, low52w: 108.13, isWatched: true, lastUpdate: '2m ago' },
    ],
    topLosers: [
      { rank: 1, symbol: 'COIN', name: 'Coinbase Global', price: 145.67, change: -12.34, changePercent: -7.81, volume: '12.4M', marketCap: '$37.1B', sentiment: 'bearish' as const, sparklineData: [165, 160, 155, 150, 145, 145], high52w: 283.86, low52w: 40.83, isWatched: false, lastUpdate: '1m ago' },
      { rank: 2, symbol: 'PYPL', name: 'PayPal Holdings', price: 58.92, change: -3.45, changePercent: -5.53, volume: '8.7M', marketCap: '$67.8B', sentiment: 'bearish' as const, sparklineData: [62, 61, 60, 59, 58, 58.9], high52w: 129.09, low52w: 50.25, isWatched: false, lastUpdate: '2m ago' },
      { rank: 3, symbol: 'NFLX', name: 'Netflix Inc.', price: 445.32, change: -18.76, changePercent: -4.04, volume: '5.2M', marketCap: '$192B', sentiment: 'bearish' as const, sparklineData: [470, 465, 460, 450, 445, 445], high52w: 691.69, low52w: 344.73, isWatched: false, lastUpdate: '3m ago' },
      { rank: 4, symbol: 'TSLA', name: 'Tesla, Inc.', price: 248.50, change: -8.22, changePercent: -3.21, volume: '156.7M', marketCap: '$790B', sentiment: 'bearish' as const, sparklineData: [260, 255, 250, 248, 245, 248], high52w: 299.29, low52w: 152.37, isWatched: false, lastUpdate: '1m ago' },
      { rank: 5, symbol: 'GOOGL', name: 'Alphabet Inc.', price: 139.69, change: -2.87, changePercent: -2.02, volume: '34.1M', marketCap: '$1.75T', sentiment: 'neutral' as const, sparklineData: [142, 141, 140, 139, 138, 139], high52w: 153.78, low52w: 83.34, isWatched: false, lastUpdate: '2m ago' },
    ]
  };

  const getCurrentData = () => {
    const data = stockCategories[activeTab as keyof typeof stockCategories] || stockCategories.trending;
    
    // Filter by search query
    let filteredData = data.filter(stock => 
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort data
    filteredData.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'change':
          aValue = a.changePercent;
          bValue = b.changePercent;
          break;
        case 'volume':
          aValue = parseFloat(a.volume.replace(/[^\d.]/g, ''));
          bValue = parseFloat(b.volume.replace(/[^\d.]/g, ''));
          break;
        case 'marketCap':
          aValue = parseFloat(a.marketCap.replace(/[^\d.]/g, ''));
          bValue = parseFloat(b.marketCap.replace(/[^\d.]/g, ''));
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        default:
          aValue = a.changePercent;
          bValue = b.changePercent;
      }
      
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });

    return filteredData;
  };

  const toggleWatchlist = (symbol: string) => {
    // In a real app, this would update the backend
    console.log(`Toggle watchlist for ${symbol}`);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <EmojiIcon emoji="😃" className="w-4 h-4" />;
      case 'bearish': return <EmojiIcon emoji="😡" className="w-4 h-4" />;
      default: return <EmojiIcon emoji="😐" className="w-4 h-4" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const MiniSparkline: React.FC<{ data: number[]; isPositive: boolean }> = ({ data, isPositive }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    return (
      <div className="w-16 h-8 relative">
        <svg className="w-full h-full" viewBox="0 0 64 32">
          <path
            d={data.map((point, i) => {
              const x = (i / (data.length - 1)) * 64;
              const y = 32 - ((point - min) / range) * 32;
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            stroke={isPositive ? '#10b981' : '#ef4444'}
            strokeWidth="1.5"
            fill="none"
            className="drop-shadow-sm"
          />
        </svg>
      </div>
    );
  };

  const StockRow: React.FC<{ stock: StockData; index: number }> = ({ stock, index }) => {
    const isPositive = stock.change >= 0;
    
    return (
      <div className={cn(
        "group relative bg-gradient-to-r from-black/40 via-gray-900/30 to-black/40 rounded-lg p-4 border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10",
        viewMode === "expanded" && "p-6"
      )}>
        {/* Live Update Indicator */}
        {stock.lastUpdate.includes('s ago') && (
          <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        )}

        <div className="flex items-center justify-between">
          {/* Left Section: Rank, Symbol, Name */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 font-bold">
                #{stock.rank}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-white">{stock.symbol[0]}</span>
              </div>
              
              <div className="min-w-0">
                <div className="text-white font-bold text-sm">{stock.symbol}</div>
                <div className="text-gray-400 text-xs truncate">{stock.name}</div>
              </div>
            </div>
          </div>

          {/* Middle Section: Sparkline */}
          <div className="hidden md:flex items-center justify-center px-4">
            <MiniSparkline data={stock.sparklineData} isPositive={isPositive} />
          </div>

          {/* Right Section: Price, Change, Volume, Actions */}
          <div className="flex items-center gap-4">
            {/* Price & Change */}
            <div className="text-right">
              <div className="text-white font-bold">${stock.price.toFixed(2)}</div>
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                isPositive ? "text-green-400" : "text-red-400"
              )}>
                {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </div>
            </div>

            {/* Volume - Hidden on mobile */}
            <div className="hidden lg:block text-right min-w-[60px]">
              <div className="text-gray-400 text-xs">Volume</div>
              <div className="text-white text-sm font-medium">{stock.volume}</div>
            </div>

            {/* Sentiment */}
            <div className="hidden xl:flex items-center justify-center w-8">
              <span className="text-lg" title={`${stock.sentiment} sentiment`}>
                {getSentimentIcon(stock.sentiment)}
              </span>
            </div>

            {/* Watchlist Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleWatchlist(stock.symbol)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                stock.isWatched 
                  ? "text-yellow-400 hover:text-yellow-300 bg-yellow-500/10 hover:bg-yellow-500/20" 
                  : "text-gray-400 hover:text-purple-300 hover:bg-purple-500/10"
              )}
            >
              {stock.isWatched ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Expanded View Additional Info */}
        {viewMode === "expanded" && (
          <div className="mt-4 pt-4 border-t border-gray-800/50 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-gray-400">Market Cap</div>
              <div className="text-white font-medium">{stock.marketCap}</div>
            </div>
            <div>
              <div className="text-gray-400">52W High</div>
              <div className="text-white font-medium">${stock.high52w.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-gray-400">52W Low</div>
              <div className="text-white font-medium">${stock.low52w.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-gray-400">Last Update</div>
              <div className="text-purple-300 font-medium">{stock.lastUpdate}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className={cn("bg-black/40 border-purple-500/20 backdrop-blur-xl", className)}>
      {showHeader && (
        <CardHeader className="border-b border-purple-500/20 pb-4">
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            Market Pulse Panel
            <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
              Live Data
            </Badge>
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className="p-6">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/40 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
            />
          </div>

          {/* Timeframe */}
          <div className="flex gap-1 bg-black/20 rounded-lg p-1">
            {(['1D', '7D', '30D'] as const).map((tf) => (
              <Button
                key={tf}
                size="sm"
                variant={timeframe === tf ? 'default' : 'ghost'}
                onClick={() => setTimeframe(tf)}
                className={cn(
                  "text-xs px-3 h-8",
                  timeframe === tf
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                )}
              >
                {tf}
              </Button>
            ))}
          </div>

          {/* Sort & View Controls */}
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <Filter className="w-4 h-4 mr-2" />
                  Sort: {sortBy}
                  {sortOrder === 'desc' ? <SortDesc className="w-4 h-4 ml-1" /> : <SortAsc className="w-4 h-4 ml-1" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 border-gray-700">
                {(['change', 'volume', 'marketCap', 'price'] as const).map((option) => (
                  <DropdownMenuItem 
                    key={option}
                    onClick={() => setSortBy(option)}
                    className="text-gray-300 hover:bg-gray-800"
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem 
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="text-gray-300 hover:bg-gray-800"
                >
                  {sortOrder === 'desc' ? 'Descending' : 'Ascending'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'compact' ? 'expanded' : 'compact')}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-black/20 backdrop-blur-xl border border-gray-700/50 mb-6">
            <TabsTrigger 
              value="trending" 
              className="data-[state=active]:bg-pink-600/30 data-[state=active]:text-pink-300 text-gray-400 flex items-center gap-2"
            >
              <Flame className="w-4 h-4" />
              <span className="hidden sm:inline">Trending</span>
            </TabsTrigger>
            <TabsTrigger 
              value="mostActive" 
              className="data-[state=active]:bg-blue-600/30 data-[state=active]:text-blue-300 text-gray-400 flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Most Active</span>
            </TabsTrigger>
            <TabsTrigger 
              value="watchers" 
              className="data-[state=active]:bg-yellow-600/30 data-[state=active]:text-yellow-300 text-gray-400 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Watchers</span>
            </TabsTrigger>
            <TabsTrigger 
              value="topGainers" 
              className="data-[state=active]:bg-green-600/30 data-[state=active]:text-green-300 text-gray-400 flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Gainers</span>
            </TabsTrigger>
            <TabsTrigger 
              value="topLosers" 
              className="data-[state=active]:bg-red-600/30 data-[state=active]:text-red-300 text-gray-400 flex items-center gap-2"
            >
              <TrendingDown className="w-4 h-4" />
              <span className="hidden sm:inline">Losers</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
            {getCurrentData().map((stock, index) => (
              <StockRow key={`${activeTab}-${stock.symbol}`} stock={stock} index={index} />
            ))}
          </div>
        </Tabs>

        {/* Footer Stats */}
        <div className="mt-6 pt-4 border-t border-gray-800/50 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-gray-400">Last updated: 30s ago</span>
            </div>
          </div>
          <div className="text-gray-400">
            Showing {getCurrentData().length} stocks
          </div>
        </div>
      </CardContent>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </Card>
  );
};

export default StockActivityDashboard;
