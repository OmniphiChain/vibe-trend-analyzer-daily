import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Search, Bell, User, Zap, TrendingUp, TrendingDown, 
  Eye, Star, AlertTriangle, BarChart3, ArrowUpRight,
  ArrowDownRight, Wallet, Settings, RefreshCw, ChevronDown,
  Filter, Globe, Activity, DollarSign, Clock, Flame,
  Target, GamepadIcon, Sparkles, Coins, TrendingDown as TrendingDownIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface CoinData {
  rank: number;
  symbol: string;
  name: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  marketCap: string;
  volume24h: string;
  circulatingSupply: number;
  maxSupply: number;
  sparkline: number[];
  logo?: string;
}

interface MarketStats {
  cryptosCount: number;
  exchangesCount: number;
  globalMarketCap: string;
  volume24h: string;
  btcDominance: number;
  ethGas: number;
  fearGreedIndex: number;
}

interface TrendingCoin {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  sparkline: number[];
  volume24h: string;
}

interface NewsItem {
  title: string;
  source: string;
  time: string;
  engagement: number;
  logo: string;
}

export const NeonSenseCryptoDashboard = () => {
  const [selectedNarrative, setSelectedNarrative] = useState("market-up");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [visibleColumns, setVisibleColumns] = useState({
    rank: true,
    price: true,
    change1h: true,
    change24h: true,
    change7d: true,
    marketCap: true,
    volume: true,
    supply: true,
    chart: true
  });

  // Mock Market Stats
  const marketStats: MarketStats = {
    cryptosCount: 2847,
    exchangesCount: 156,
    globalMarketCap: "$2.64T",
    volume24h: "$89.2B",
    btcDominance: 52.3,
    ethGas: 23,
    fearGreedIndex: 73
  };

  // Mock Trending Coins
  const trendingCoins: TrendingCoin[] = [
    { symbol: 'SOL', name: 'Solana', price: 198.45, change24h: 12.3, sparkline: [180, 185, 192, 195, 198], volume24h: '4.8B' },
    { symbol: 'AVAX', name: 'Avalanche', price: 42.18, change24h: 8.7, sparkline: [39, 40, 41, 42, 42.18], volume24h: '890M' },
    { symbol: 'MATIC', name: 'Polygon', price: 0.945, change24h: 15.2, sparkline: [0.81, 0.85, 0.89, 0.92, 0.945], volume24h: '520M' },
    { symbol: 'NEAR', name: 'NEAR Protocol', price: 7.23, change24h: 9.8, sparkline: [6.5, 6.8, 7.0, 7.1, 7.23], volume24h: '340M' },
    { symbol: 'FTM', name: 'Fantom', price: 0.67, change24h: 22.1, sparkline: [0.55, 0.58, 0.62, 0.65, 0.67], volume24h: '180M' }
  ];

  // Mock DexScan Trending
  const dexTrending: TrendingCoin[] = [
    { symbol: 'PEPE', name: 'Pepe', price: 0.000012, change24h: 45.6, sparkline: [0.000008, 0.000009, 0.000011, 0.000012, 0.000012], volume24h: '2.1B' },
    { symbol: 'SHIB', name: 'Shiba Inu', price: 0.000024, change24h: 32.1, sparkline: [0.000018, 0.000020, 0.000022, 0.000023, 0.000024], volume24h: '1.8B' },
    { symbol: 'DOGE', name: 'Dogecoin', price: 0.38, change24h: 18.9, sparkline: [0.32, 0.34, 0.36, 0.37, 0.38], volume24h: '3.2B' },
    { symbol: 'FLOKI', name: 'FLOKI', price: 0.00019, change24h: 28.7, sparkline: [0.00015, 0.00016, 0.00017, 0.00018, 0.00019], volume24h: '450M' },
    { symbol: 'BONK', name: 'Bonk', price: 0.000035, change24h: 41.2, sparkline: [0.000025, 0.000028, 0.000031, 0.000033, 0.000035], volume24h: '890M' }
  ];

  // Mock News Headlines
  const newsHeadlines: NewsItem[] = [
    { title: "Bitcoin ETF sees record $2.1B inflows", source: "CoinDesk", time: "2h", engagement: 1247, logo: "📰" },
    { title: "Ethereum 2.0 staking rewards hit new high", source: "Decrypt", time: "4h", engagement: 892, logo: "📈" },
    { title: "Major bank announces crypto custody", source: "Reuters", time: "6h", engagement: 1556, logo: "🏦" },
    { title: "DeFi TVL surpasses $200B milestone", source: "The Block", time: "8h", engagement: 743, logo: "💰" }
  ];

  // Mock Comprehensive Coin Data
  const coinData: CoinData[] = [
    { rank: 1, symbol: 'BTC', name: 'Bitcoin', price: 67420.50, change1h: 0.5, change24h: 3.2, change7d: 8.5, marketCap: '1.32T', volume24h: '28.5B', circulatingSupply: 19800000, maxSupply: 21000000, sparkline: [65000, 66200, 66800, 67100, 67420] },
    { rank: 2, symbol: 'ETH', name: 'Ethereum', price: 3842.30, change1h: 1.2, change24h: 5.1, change7d: 12.3, marketCap: '462B', volume24h: '15.2B', circulatingSupply: 120280000, maxSupply: 0, sparkline: [3650, 3720, 3800, 3825, 3842] },
    { rank: 3, symbol: 'USDT', name: 'Tether', price: 1.00, change1h: 0.01, change24h: 0.02, change7d: -0.05, marketCap: '104B', volume24h: '42.8B', circulatingSupply: 104000000000, maxSupply: 0, sparkline: [0.999, 1.000, 1.001, 1.000, 1.000] },
    { rank: 4, symbol: 'BNB', name: 'BNB', price: 642.18, change1h: 0.8, change24h: 4.2, change7d: 7.9, marketCap: '93.2B', volume24h: '1.8B', circulatingSupply: 145200000, maxSupply: 200000000, sparkline: [615, 625, 635, 640, 642] },
    { rank: 5, symbol: 'SOL', name: 'Solana', price: 198.45, change1h: 2.1, change24h: 8.7, change7d: 22.1, marketCap: '93B', volume24h: '4.8B', circulatingSupply: 468600000, maxSupply: 0, sparkline: [180, 185, 192, 195, 198] },
    { rank: 6, symbol: 'USDC', name: 'USD Coin', price: 1.00, change1h: 0.00, change24h: 0.01, change7d: 0.02, marketCap: '32.1B', volume24h: '8.2B', circulatingSupply: 32100000000, maxSupply: 0, sparkline: [1.000, 1.000, 1.001, 1.000, 1.000] },
    { rank: 7, symbol: 'ADA', name: 'Cardano', price: 0.875, change1h: -0.5, change24h: -2.1, change7d: 5.8, marketCap: '31B', volume24h: '1.2B', circulatingSupply: 35400000000, maxSupply: 45000000000, sparkline: [0.89, 0.88, 0.87, 0.875, 0.875] },
    { rank: 8, symbol: 'AVAX', name: 'Avalanche', price: 42.18, change1h: 1.5, change24h: 6.3, change7d: 15.7, marketCap: '16B', volume24h: '890M', circulatingSupply: 379500000, maxSupply: 720000000, sparkline: [39, 40, 41, 42, 42.18] },
    { rank: 9, symbol: 'DOGE', name: 'Dogecoin', price: 0.38, change1h: 0.3, change24h: 18.9, change7d: 12.4, marketCap: '55.8B', volume24h: '3.2B', circulatingSupply: 146800000000, maxSupply: 0, sparkline: [0.32, 0.34, 0.36, 0.37, 0.38] },
    { rank: 10, symbol: 'DOT', name: 'Polkadot', price: 7.92, change1h: -0.2, change24h: -0.8, change7d: 3.2, marketCap: '11B', volume24h: '340M', circulatingSupply: 1390000000, maxSupply: 0, sparkline: [7.95, 7.93, 7.91, 7.90, 7.92] }
  ];

  const narrativeTabs = [
    { id: "market-up", label: "Why is the market up today?", icon: "📈" },
    { id: "altcoins", label: "Are altcoins outperforming Bitcoin?", icon: "🚀" },
    { id: "trending", label: "Trending narratives", icon: "🔥" },
    { id: "bullish", label: "Bullish momentum cryptos", icon: "💎" },
    { id: "events", label: "Upcoming events", icon: "📅" }
  ];

  const categoryFilters = [
    { id: "all", label: "All Crypto", icon: "🌐" },
    { id: "nfts", label: "NFTs", icon: "🎨" },
    { id: "defi", label: "DeFi", icon: "🏦" },
    { id: "unlocks", label: "Token Unlocks", icon: "🔓" },
    { id: "rwa", label: "Real-World Assets", icon: "🏢" },
    { id: "binance", label: "Binance Alpha", icon: "🔶" },
    { id: "memes", label: "Memes", icon: "🐸" },
    { id: "ai", label: "AI", icon: "🤖" },
    { id: "gaming", label: "Gaming", icon: "🎮" }
  ];

  const MiniSparkline = ({ data, isPositive }: { data: number[], isPositive: boolean }) => (
    <svg width="100" height="40" className="inline-block">
      <polyline
        points={data.map((val, i) => `${(i / (data.length - 1)) * 100},${40 - ((val - Math.min(...data)) / (Math.max(...data) - Math.min(...data))) * 40}`).join(' ')}
        fill="none"
        stroke={isPositive ? '#16C784' : '#EA3943'}
        strokeWidth="2"
      />
    </svg>
  );

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const getSortedData = () => {
    if (!sortColumn) return coinData;
    
    return [...coinData].sort((a, b) => {
      let aVal: any = a[sortColumn as keyof CoinData];
      let bVal: any = b[sortColumn as keyof CoinData];
      
      if (typeof aVal === 'string') {
        aVal = parseFloat(aVal.replace(/[^0-9.-]/g, ''));
        bVal = parseFloat(bVal.replace(/[^0-9.-]/g, ''));
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  };

  return (
    <div className="min-h-screen" style={{ background: '#0A0F1F' }}>
      {/* Enhanced Top Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-gray-800/50" style={{ background: 'rgba(15, 21, 43, 0.95)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3">

          {/* Bottom Row - Search */}
          <div className="flex items-center justify-center">
            <div className="relative max-w-2xl w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search coins, exchanges, pools, pairs and platforms..."
                className="pl-12 pr-4 py-3 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-0 text-lg rounded-xl"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-6">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Market Narrative Tabs */}
        <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {narrativeTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={selectedNarrative === tab.id ? "default" : "outline"}
                  className={cn(
                    "whitespace-nowrap text-sm",
                    selectedNarrative === tab.id 
                      ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-lg shadow-cyan-400/20" 
                      : "border-gray-700 text-gray-300 hover:border-cyan-400/50"
                  )}
                  onClick={() => setSelectedNarrative(tab.id)}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {/* Trending Coins */}
          <Card className="lg:col-span-2 border-gray-800/50" style={{ background: '#0F152B' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                Trending
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {trendingCoins.slice(0, 3).map((coin, i) => (
                <div key={coin.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">{i + 1}</span>
                    <span className="text-white font-medium text-sm">{coin.symbol}</span>
                    <span className="text-gray-400 text-xs">{coin.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm">${coin.price}</div>
                    <div className={cn("text-xs", coin.change24h >= 0 ? "text-green-400" : "text-red-400")}>
                      {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* DexScan Trending */}
          <Card className="lg:col-span-2 border-gray-800/50" style={{ background: '#0F152B' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                DexScan Trending
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {dexTrending.slice(0, 3).map((coin, i) => (
                <div key={coin.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">{i + 1}</span>
                    <span className="text-white font-medium text-sm">{coin.symbol}</span>
                    <span className="text-gray-400 text-xs">{coin.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm">${coin.price}</div>
                    <div className={cn("text-xs", coin.change24h >= 0 ? "text-green-400" : "text-red-400")}>
                      {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Market Cap */}
          <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-gray-400 text-xs mb-1">Market Cap</div>
                <div className="text-white font-bold text-lg">{marketStats.globalMarketCap}</div>
                <div className="text-green-400 text-xs">+2.4%</div>
                <MiniSparkline data={[2.4, 2.6, 2.5, 2.7, 2.64]} isPositive={true} />
              </div>
            </CardContent>
          </Card>

          {/* Fear & Greed */}
          <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-gray-400 text-xs mb-1">Fear & Greed</div>
                <div className="text-yellow-400 font-bold text-lg">{marketStats.fearGreedIndex}</div>
                <div className="text-yellow-400 text-xs">Neutral</div>
                <div className="w-16 h-2 bg-gray-700 rounded-full mx-auto mt-2">
                  <div 
                    className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" 
                    style={{ width: `${marketStats.fearGreedIndex}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* News Highlights */}
          <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                News
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {newsHeadlines.slice(0, 2).map((news, i) => (
                <div key={i} className="cursor-pointer hover:bg-gray-800/30 p-2 rounded">
                  <div className="text-white text-xs leading-tight mb-1">{news.title}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{news.source}</span>
                    <span className="text-gray-500">{news.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Category Filter Bar */}
        <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 overflow-x-auto">
              {categoryFilters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={selectedCategory === filter.id ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "whitespace-nowrap",
                    selectedCategory === filter.id 
                      ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-cyan-400" 
                      : "border-gray-700 text-gray-300 hover:border-cyan-400/50"
                  )}
                  onClick={() => setSelectedCategory(filter.id)}
                >
                  <span className="mr-2">{filter.icon}</span>
                  {filter.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Data Table */}
        <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Cryptocurrency Prices by Market Cap</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                  <Filter className="w-4 h-4 mr-2" />
                  Columns
                </Button>
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-2 text-gray-400 text-sm cursor-pointer hover:text-white" onClick={() => handleSort('rank')}>
                      #
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 text-sm">Name</th>
                    <th className="text-right py-3 px-4 text-gray-400 text-sm cursor-pointer hover:text-white" onClick={() => handleSort('price')}>
                      Price
                    </th>
                    <th className="text-right py-3 px-4 text-gray-400 text-sm cursor-pointer hover:text-white" onClick={() => handleSort('change1h')}>
                      1h %
                    </th>
                    <th className="text-right py-3 px-4 text-gray-400 text-sm cursor-pointer hover:text-white" onClick={() => handleSort('change24h')}>
                      24h %
                    </th>
                    <th className="text-right py-3 px-4 text-gray-400 text-sm cursor-pointer hover:text-white" onClick={() => handleSort('change7d')}>
                      7d %
                    </th>
                    <th className="text-right py-3 px-4 text-gray-400 text-sm cursor-pointer hover:text-white" onClick={() => handleSort('marketCap')}>
                      Market Cap
                    </th>
                    <th className="text-right py-3 px-4 text-gray-400 text-sm cursor-pointer hover:text-white" onClick={() => handleSort('volume24h')}>
                      Volume(24h)
                    </th>
                    <th className="text-center py-3 px-4 text-gray-400 text-sm">
                      Circulating Supply
                    </th>
                    <th className="text-center py-3 px-4 text-gray-400 text-sm">
                      Last 7 Days
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedData().map((coin) => (
                    <tr key={coin.symbol} className="border-b border-gray-800/50 hover:bg-gray-800/20 cursor-pointer group">
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-gray-600 hover:text-yellow-400 cursor-pointer" />
                          <span className="text-gray-400 font-medium">{coin.rank}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                            {coin.symbol[0]}
                          </div>
                          <div>
                            <div className="text-white font-medium">{coin.name}</div>
                            <div className="text-gray-400 text-sm">{coin.symbol}</div>
                          </div>
                          <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity bg-green-600 hover:bg-green-700 text-white text-xs">
                            Buy
                          </Button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-white font-medium">${coin.price.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={cn("font-medium", coin.change1h >= 0 ? "text-green-400" : "text-red-400")}>
                          {coin.change1h >= 0 ? '+' : ''}{coin.change1h}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={cn("font-medium", coin.change24h >= 0 ? "text-green-400" : "text-red-400")}>
                          {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={cn("font-medium", coin.change7d >= 0 ? "text-green-400" : "text-red-400")}>
                          {coin.change7d >= 0 ? '+' : ''}{coin.change7d}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-white">{coin.marketCap}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-white">{coin.volume24h}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-center">
                          <div className="text-white text-sm">{coin.circulatingSupply.toLocaleString()}</div>
                          {coin.maxSupply > 0 && (
                            <div className="w-16 h-1 bg-gray-700 rounded-full mx-auto mt-1">
                              <div 
                                className="h-1 bg-cyan-400 rounded-full" 
                                style={{ width: `${(coin.circulatingSupply / coin.maxSupply) * 100}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <MiniSparkline data={coin.sparkline} isPositive={coin.change7d >= 0} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Extra NeonSense Features Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Sentiment Pulse */}
          <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                AI Sentiment Pulse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="transform -rotate-90 w-24 h-24">
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="none" className="text-gray-700" />
                    <circle 
                      cx="48" cy="48" r="40" 
                      stroke="url(#sentiment-gradient)" 
                      strokeWidth="6" 
                      fill="none" 
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - marketStats.fearGreedIndex / 100)}`}
                      className="transition-all duration-700"
                    />
                    <defs>
                      <linearGradient id="sentiment-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#EA3943" />
                        <stop offset="50%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#16C784" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-400">{marketStats.fearGreedIndex}</div>
                      <div className="text-xs text-gray-400">Neutral</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Neon Brief */}
          <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Neon Brief
                </CardTitle>
                <Button variant="outline" size="sm" className="border-cyan-400/30 text-cyan-400">
                  <RefreshCw className="w-3 h-3 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                  <span className="text-gray-300">Bitcoin showing strong institutional accumulation patterns</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  <span className="text-gray-300">Altcoin season momentum building across DeFi tokens</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 flex-shrink-0" />
                  <span className="text-gray-300">Major options expiry this Friday may increase volatility</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Quick View */}
          <Card className="border-gray-800/50" style={{ background: '#0F152B' }}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-green-400" />
                Portfolio Quick View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">$247,580</div>
                  <div className="text-green-400 text-sm">+$14,037 (5.67%)</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">BTC</span>
                    <span className="text-white">3.847 BTC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">ETH</span>
                    <span className="text-white">127.23 ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Others</span>
                    <span className="text-white">$47,280</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white">
                  View Full Portfolio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
