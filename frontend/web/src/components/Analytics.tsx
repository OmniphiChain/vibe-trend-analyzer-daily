import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, TrendingUp, TrendingDown, BarChart3, Crown } from 'lucide-react';
import { cn } from '../lib/utils';
import StrategySwiper from './StrategySwiper';

export const Analytics = () => {
  const [activeTab, setActiveTab] = useState("Analytics");
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfiler, setShowProfiler] = useState(false);
  const [screenerType, setScreenerType] = useState("basic");
  const [aiQuery, setAiQuery] = useState("Ask AI: Find mid-cap tech stocks with rising sentiment and strong momentum...");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [peRatio, setPeRatio] = useState([0, 100]);
  const [rsi, setRsi] = useState([0, 100]);
  const [dayChange, setDayChange] = useState([-20, 20]);
  const [volatility, setVolatility] = useState([0, 10]);
  const [moodScore, setMoodScore] = useState([0, 100]);
  const [newsScore, setNewsScore] = useState([0, 100]);
  const [liveMode, setLiveMode] = useState(true);
  const [searchTicker, setSearchTicker] = useState("");
  const [selectedMarketCap, setSelectedMarketCap] = useState("All Sizes");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [selectedVolume, setSelectedVolume] = useState("All Volumes");
  const [selectedSocialBuzz, setSelectedSocialBuzz] = useState("All Levels");
  const [savedTemplates, setSavedTemplates] = useState<string[]>(["Growth Template", "Value Template"]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [loadTemplateTab, setLoadTemplateTab] = useState("All Templates");

  // Mock stock data for the screener
  const stockData = [
    { symbol: 'TSLA', name: 'Tesla, Inc.', price: 248.50, change: -3.21, sentiment: 35, marketCap: '789B', volume: '67M', sector: 'Automotive', lastClose: 257.23 },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 432.50, change: 5.23, sentiment: 92, marketCap: '1.1T', volume: '89M', sector: 'Technology', lastClose: 410.89 },
    { symbol: 'AAPL', name: 'Apple Inc.', price: 190.64, change: 2.34, sentiment: 78, marketCap: '2.9T', volume: '45M', sector: 'Technology', lastClose: 186.40 },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.', price: 154.32, change: -1.87, sentiment: 68, marketCap: '1.6T', volume: '23M', sector: 'Consumer', lastClose: 157.21 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 420.15, change: 1.89, sentiment: 85, marketCap: '3.1T', volume: '32M', sector: 'Technology', lastClose: 412.37 },
    { symbol: 'SPY', name: 'SPDR S&P 500', price: 154.32, change: 0.75, sentiment: 71, marketCap: '487B', volume: '89M', sector: 'ETF', lastClose: 153.16 },
    { symbol: 'JPM', name: 'JPMorgan Chase', price: 163.24, change: -0.89, sentiment: 65, marketCap: '478B', volume: '12M', sector: 'Finance', lastClose: 164.70 },
    { symbol: 'V', name: 'Visa Inc.', price: 267.91, change: 1.45, sentiment: 82, marketCap: '567B', volume: '8M', sector: 'Finance', lastClose: 264.10 },
    { symbol: 'WMT', name: 'Walmart Inc.', price: 163.56, change: 0.34, sentiment: 58, marketCap: '445B', volume: '15M', sector: 'Consumer', lastClose: 163.01 },
    { symbol: 'BTC', name: 'Bitcoin', price: 65.23, change: 2.18, sentiment: 79, marketCap: '1.3T', volume: '2.1B', sector: 'Crypto', lastClose: 63.84 },
    { symbol: 'SOL', name: 'Solana', price: 67.89, change: 7.45, sentiment: 88, marketCap: '31B', volume: '890M', sector: 'Crypto', lastClose: 63.21 },
    { symbol: 'COIN', name: 'Coinbase Global', price: 198.34, change: 4.12, sentiment: 73, marketCap: '49B', volume: '28M', sector: 'Crypto', lastClose: 190.53 },
    { symbol: 'SPW', name: 'SP Global Inc.', price: 8.76, change: -2.34, sentiment: 52, marketCap: '134B', volume: '6M', sector: 'Finance', lastClose: 8.97 },
    { symbol: 'IEF', name: 'iShares Bond ETF', price: 3.45, change: -1.23, sentiment: 48, marketCap: '21B', volume: '4M', sector: 'ETF', lastClose: 3.49 },
    { symbol: 'AMC', name: 'AMC Entertainment', price: 4.78, change: 12.34, sentiment: 67, marketCap: '2.1B', volume: '125M', sector: 'Entertainment', lastClose: 4.26 },
    { symbol: 'GME', name: 'GameStop Corp.', price: 16.89, change: 8.76, sentiment: 71, marketCap: '5.2B', volume: '67M', sector: 'Consumer', lastClose: 15.53 },
    { symbol: 'NFLX', name: 'Netflix, Inc.', price: 487.23, change: 2.45, sentiment: 75, marketCap: '210B', volume: '18M', sector: 'Technology', lastClose: 475.56 },
    { symbol: 'CRM', name: 'Salesforce.com', price: 267.89, change: 1.67, sentiment: 69, marketCap: '263B', volume: '11M', sector: 'Technology', lastClose: 263.51 }
  ];

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return 'text-green-400';
    if (sentiment >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSentimentBg = (sentiment: number) => {
    if (sentiment >= 70) return 'bg-green-500/20 border-green-500/30';
    if (sentiment >= 50) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const filteredStocks = stockData.filter(stock =>
    (searchQuery === "" ||
     stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
     stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     stock.sector.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (searchTicker === "" ||
     stock.symbol.toLowerCase().includes(searchTicker.toLowerCase()) ||
     stock.name.toLowerCase().includes(searchTicker.toLowerCase())) &&
    (selectedMarketCap === "All Sizes" ||
     (selectedMarketCap === "Large Cap" && parseFloat(stock.marketCap.replace(/[TB]/g, '')) > 10) ||
     (selectedMarketCap === "Mid Cap" && parseFloat(stock.marketCap.replace(/[TB]/g, '')) >= 2 && parseFloat(stock.marketCap.replace(/[TB]/g, '')) <= 10) ||
     (selectedMarketCap === "Small Cap" && parseFloat(stock.marketCap.replace(/[TB]/g, '')) < 2)) &&
    (selectedSector === "All Sectors" || stock.sector === selectedSector) &&
    stock.price >= (priceRange[0] ?? 0) && stock.price <= (priceRange[1] ?? 500) &&
    stock.sentiment >= (moodScore[0] ?? 0) && stock.sentiment <= (moodScore[1] ?? 100)
  );

  const handleSaveTemplate = () => {
    if (newTemplateName.trim()) {
      setSavedTemplates([...savedTemplates, newTemplateName.trim()]);
      setNewTemplateName("");
      setShowSaveDialog(false);
      alert(`Template "${newTemplateName}" saved successfully!`);
    }
  };

  const handleLoadTemplate = (templateName: string) => {
    // Load predefined template settings
    if (templateName === "Growth Template") {
      setPriceRange([50, 500]);
      setPeRatio([15, 40]);
      setRsi([40, 70]);
      setSelectedSector("Technology");
      setMoodScore([60, 100]);
    } else if (templateName === "Value Template") {
      setPriceRange([10, 200]);
      setPeRatio([5, 20]);
      setRsi([30, 60]);
      setSelectedSector("Finance");
      setMoodScore([40, 80]);
    }
    alert(`Template "${templateName}" loaded successfully!`);
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Symbol', 'Name', 'Price', 'Change %', 'Sentiment', 'Market Cap', 'Volume', 'Sector'],
      ...filteredStocks.map(stock => [
        stock.symbol,
        stock.name,
        stock.price.toString(),
        stock.change.toString(),
        stock.sentiment.toString(),
        stock.marketCap,
        stock.volume,
        stock.sector
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock_screener_results_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const applyGrowthFilter = () => {
    setSelectedSector("Technology");
    setPriceRange([100, 500]);
    setMoodScore([70, 100]);
    setRsi([50, 80]);
    alert("Growth Tech Stocks filter applied!");
  };

  const applyOversoldFilter = () => {
    setRsi([0, 30]);
    setDayChange([-10, -2]);
    setMoodScore([30, 60]);
    alert("Oversold Bounce Candidates filter applied!");
  };

  const resetAllFilters = () => {
    setPriceRange([0, 500]);
    setPeRatio([0, 100]);
    setRsi([0, 100]);
    setDayChange([-20, 20]);
    setVolatility([0, 10]);
    setMoodScore([0, 100]);
    setNewsScore([0, 100]);
    setSearchTicker("");
    setSelectedMarketCap("All Sizes");
    setSelectedSector("All Sectors");
    setSelectedVolume("All Volumes");
    setSelectedSocialBuzz("All Levels");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-black/20 backdrop-blur-xl border border-gray-700/50">
            <TabsTrigger
              value="HeatMap"
              className="data-[state=active]:bg-gray-700/50 data-[state=active]:text-white text-gray-400"
            >
              🔥 Heat Map
            </TabsTrigger>
            <TabsTrigger
              value="Analytics"
              className="data-[state=active]:bg-gray-700/50 data-[state=active]:text-white text-gray-400"
            >
              📈 Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="HeatMap" className="mt-6">
            <div className="space-y-6">
              {/* Dashboard Controls */}
              <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    🎛️ Dashboard Controls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Market Type */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Market Type</label>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-blue-600 text-white">Stocks</Button>
                        <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300">Crypto</Button>
                        <Button size="sm" className="bg-purple-600 text-white">Combined</Button>
                      </div>
                    </div>

                    {/* Data Type */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Data Type</label>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-purple-600 text-white">Sentiment</Button>
                        <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300">Price</Button>
                        <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300">Volume</Button>
                      </div>
                    </div>

                    {/* Timeframe */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Timeframe</label>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300">1H</Button>
                        <Button size="sm" className="bg-purple-600 text-white">24H</Button>
                        <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300">7D</Button>
                      </div>
                    </div>

                    {/* Search Symbol */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Search Symbol</label>
                      <div className="relative">
                        <Input
                          placeholder="BTC, AAPL, etc..."
                          className="bg-black/40 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-0"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Interactive Sentiment Grid */}
                <div className="lg:col-span-3">
                  <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                          📊 Interactive Sentiment Grid
                        </CardTitle>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Live Data
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {[
                          { symbol: 'AAPL', sentiment: 72, color: 'bg-green-500' },
                          { symbol: 'GOOGL', sentiment: 78, color: 'bg-green-500' },
                          { symbol: 'MSFT', sentiment: 68, color: 'bg-green-500' },
                          { symbol: 'TSLA', sentiment: 35, color: 'bg-red-500' },
                          { symbol: 'AMZN', sentiment: 65, color: 'bg-green-500' },
                          { symbol: 'NVDA', sentiment: 92, color: 'bg-green-500' },
                          { symbol: 'META', sentiment: 58, color: 'bg-yellow-500' },
                          { symbol: 'NFLX', sentiment: 63, color: 'bg-green-500' },
                          { symbol: 'BTC', sentiment: 69, color: 'bg-green-500' },
                          { symbol: 'ETH', sentiment: 71, color: 'bg-green-500' },
                          { symbol: 'SOL', sentiment: 85, color: 'bg-green-500' },
                          { symbol: 'ADA', sentiment: 42, color: 'bg-red-500' },
                          { symbol: 'DOT', sentiment: 48, color: 'bg-red-500' },
                          { symbol: 'MATIC', sentiment: 59, color: 'bg-yellow-500' },
                          { symbol: 'AVAX', sentiment: 67, color: 'bg-green-500' },
                          { symbol: 'LINK', sentiment: 74, color: 'bg-green-500' },
                          { symbol: 'TECH', sentiment: 81, color: 'bg-green-500' },
                          { symbol: 'FIN', sentiment: 52, color: 'bg-yellow-500' },
                          { symbol: 'HLTH', sentiment: 64, color: 'bg-green-500' },
                          { symbol: 'ENGY', sentiment: 47, color: 'bg-red-500' },
                          { symbol: 'DEFI', sentiment: 78, color: 'bg-green-500' },
                          { symbol: 'AI', sentiment: 91, color: 'bg-green-500' },
                          { symbol: 'GAME', sentiment: 75, color: 'bg-green-500' },
                          { symbol: 'MEME', sentiment: 38, color: 'bg-red-500' }
                        ].map((item, index) => (
                          <div
                            key={item.symbol}
                            className={`${item.color}/20 border ${item.color}/30 rounded-lg p-3 hover:${item.color}/30 transition-all duration-200 cursor-pointer hover:scale-105`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-bold text-sm">{item.symbol}</span>
                              <div className={`w-2 h-2 ${item.color} rounded-full`}></div>
                            </div>
                            <div className="text-center">
                              <div className="text-white font-bold text-lg">{item.sentiment}%</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Legend */}
                      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-700/50">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-gray-400 text-sm">Bullish (70-100%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-gray-400 text-sm">Neutral (50-69%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-gray-400 text-sm">Bearish (0-49%)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  {/* AI Market Alerts */}
                  <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2 text-lg">
                        🤖 AI Market Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                          <div>
                            <div className="text-yellow-400 font-medium text-sm">Bullish Surge</div>
                            <div className="text-gray-300 text-xs">$SOL sentiment surged 45% in last 24H after Bonk protocol announcements</div>
                            <div className="text-gray-400 text-xs mt-1">2 minutes ago</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                          <div>
                            <div className="text-red-400 font-medium text-sm">Bearish Flip</div>
                            <div className="text-gray-300 text-xs">$TSLA flipped bearish after earnings report missed expectations</div>
                            <div className="text-gray-400 text-xs mt-1">15 minutes ago</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                          <div>
                            <div className="text-blue-400 font-medium text-sm">AI Sector Alert</div>
                            <div className="text-gray-300 text-xs">AI tokens showing 91% bullish sentiment, up 23% from yesterday</div>
                            <div className="text-gray-400 text-xs mt-1">1 hour ago</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Market Summary */}
                  <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2 text-lg">
                        📊 Market Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Total Bullish</span>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-white font-medium">67%</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Total Bearish</span>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-white font-medium">21%</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Neutral</span>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span className="text-white font-medium">12%</span>
                          </div>
                        </div>

                        <div className="border-t border-gray-700/50 pt-3 mt-4">
                          <div className="text-gray-400 text-sm mb-2">Top Gainers (24h)</div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-white text-sm">SOL</span>
                              <span className="text-green-400 font-medium">+7.2%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white text-sm">NVDA</span>
                              <span className="text-green-400 font-medium">+5.4%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white text-sm">ADA</span>
                              <span className="text-green-400 font-medium">+4.1%</span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-700/50 pt-3">
                          <div className="text-gray-400 text-sm mb-2">Top Losers (24h)</div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-white text-sm">MEME</span>
                              <span className="text-red-400 font-medium">-5.2%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white text-sm">DOT</span>
                              <span className="text-red-400 font-medium">-3.2%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white text-sm">TSLA</span>
                              <span className="text-red-400 font-medium">-2.7%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="Analytics" className="mt-6">
            <div className="space-y-6">
              {/* Top Summary Bar */}
              <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl border-purple-500/30">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Overall Mood Score */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="text-3xl">🟢</div>
                        <div className="text-4xl font-bold text-green-400">73</div>
                      </div>
                      <div className="text-gray-300 text-sm">Overall Mood Score</div>
                      <div className="text-green-400 text-xs">Bullish</div>
                    </div>

                    {/* Trending Sentiment */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <TrendingUp className="w-6 h-6 text-green-400" />
                        <div className="text-2xl font-bold text-green-400">+12%</div>
                      </div>
                      <div className="text-gray-300 text-sm">24h Sentiment Trend</div>
                      <div className="text-green-400 text-xs">Rising</div>
                    </div>

                    {/* Top Market Movers */}
                    <div>
                      <div className="text-gray-300 text-sm mb-2">Top Movers</div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white">NVDA</span>
                          <span className="text-green-400">+15%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white">SOL</span>
                          <span className="text-green-400">+12%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white">TSLA</span>
                          <span className="text-red-400">-8%</span>
                        </div>
                      </div>
                    </div>

                    {/* Key News Events */}
                    <div>
                      <div className="text-gray-300 text-sm mb-2">Key Events</div>
                      <div className="space-y-1">
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Earnings Beat</Badge>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">AI Update</Badge>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Fed Policy</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Sentiment Over Time Chart */}
                  <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                          📈 Sentiment Over Time
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300">1H</Button>
                          <Button size="sm" className="bg-purple-600 text-white">24H</Button>
                          <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300">7D</Button>
                          <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300">30D</Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-gradient-to-b from-purple-900/20 to-transparent rounded-lg p-4 relative">
                        {/* Mock Chart Line */}
                        <div className="absolute inset-4">
                          <svg className="w-full h-full" viewBox="0 0 400 200">
                            <defs>
                              <linearGradient id="sentimentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="50%" stopColor="#eab308" />
                                <stop offset="100%" stopColor="#22c55e" />
                              </linearGradient>
                            </defs>
                            <path
                              d="M 20 150 Q 100 120 180 80 T 380 60"
                              fill="none"
                              stroke="url(#sentimentGradient)"
                              strokeWidth="3"
                              className="animate-pulse"
                            />
                            <circle cx="380" cy="60" r="4" fill="#22c55e" />
                          </svg>
                        </div>
                        <div className="absolute bottom-2 left-4 text-xs text-gray-400">
                          Last updated: 2 mins ago
                        </div>
                        <div className="absolute top-2 right-4 text-xs text-green-400">
                          Current: 73 (+5.2)
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sector & Category Heatmaps */}
                  <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        🗂️ Sector Heatmap
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {[
                          { sector: 'Technology', sentiment: 85, color: 'bg-green-500' },
                          { sector: 'Healthcare', sentiment: 72, color: 'bg-green-500' },
                          { sector: 'Finance', sentiment: 58, color: 'bg-yellow-500' },
                          { sector: 'Energy', sentiment: 42, color: 'bg-red-500' },
                          { sector: 'Consumer', sentiment: 67, color: 'bg-green-500' },
                          { sector: 'Real Estate', sentiment: 51, color: 'bg-yellow-500' },
                          { sector: 'Utilities', sentiment: 48, color: 'bg-red-500' },
                          { sector: 'Materials', sentiment: 61, color: 'bg-green-500' }
                        ].map((sector) => (
                          <div
                            key={sector.sector}
                            className={`${sector.color}/20 border ${sector.color}/30 rounded-lg p-3 hover:${sector.color}/30 transition-all duration-200 cursor-pointer hover:scale-105`}
                          >
                            <div className="text-white font-medium text-sm mb-1">{sector.sector}</div>
                            <div className="text-white font-bold text-lg">{sector.sentiment}%</div>
                            <div className={`w-full h-1 ${sector.color}/40 rounded-full mt-2`}>
                              <div className={`h-1 ${sector.color} rounded-full`} style={{width: `${sector.sentiment}%`}}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Positive & Negative Mentions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-black/40 backdrop-blur-xl border-green-500/20">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2 text-lg">
                          🔥 Top Positive
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            { symbol: 'NVDA', score: 92, mentions: '2.4k', source: 'Reddit' },
                            { symbol: 'SOL', score: 89, mentions: '1.8k', source: 'Twitter' },
                            { symbol: 'AI', score: 87, mentions: '1.2k', source: 'News' },
                            { symbol: 'MSFT', score: 84, mentions: '900', source: 'Forums' }
                          ].map((item) => (
                            <div key={item.symbol} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                  <span className="text-green-400 font-bold text-sm">{item.symbol}</span>
                                </div>
                                <div>
                                  <div className="text-white font-medium text-sm">{item.score}%</div>
                                  <div className="text-gray-400 text-xs">{item.mentions} mentions</div>
                                </div>
                              </div>
                              <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
                                {item.source}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-black/40 backdrop-blur-xl border-red-500/20">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2 text-lg">
                          ❄️ Top Negative
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            { symbol: 'TSLA', score: 35, mentions: '1.9k', source: 'News' },
                            { symbol: 'MEME', score: 38, mentions: '1.1k', source: 'Reddit' },
                            { symbol: 'DOT', score: 42, mentions: '750', source: 'Twitter' },
                            { symbol: 'ENGY', score: 45, mentions: '580', source: 'Forums' }
                          ].map((item) => (
                            <div key={item.symbol} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                                  <span className="text-red-400 font-bold text-sm">{item.symbol}</span>
                                </div>
                                <div>
                                  <div className="text-white font-medium text-sm">{item.score}%</div>
                                  <div className="text-gray-400 text-xs">{item.mentions} mentions</div>
                                </div>
                              </div>
                              <Badge variant="outline" className="border-red-500/30 text-red-400 text-xs">
                                {item.source}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  {/* Keyword & Topic Trends */}
                  <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2 text-lg">
                        🔤 Trending Keywords
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { keyword: 'AI breakthrough', sentiment: 'positive', size: 'text-lg' },
                          { keyword: 'earnings beat', sentiment: 'positive', size: 'text-base' },
                          { keyword: 'regulatory concerns', sentiment: 'negative', size: 'text-sm' },
                          { keyword: 'bullish outlook', sentiment: 'positive', size: 'text-base' },
                          { keyword: 'market volatility', sentiment: 'neutral', size: 'text-sm' },
                          { keyword: 'crypto surge', sentiment: 'positive', size: 'text-base' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className={`${item.size} font-medium ${
                              item.sentiment === 'positive' ? 'text-green-400' :
                              item.sentiment === 'negative' ? 'text-red-400' : 'text-yellow-400'
                            }`}>
                              {item.keyword}
                            </span>
                            <div className={`w-2 h-2 rounded-full ${
                              item.sentiment === 'positive' ? 'bg-green-500' :
                              item.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Source Breakdown */}
                  <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2 text-lg">
                        📊 Data Sources
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { source: 'Reddit', percentage: 35, color: 'bg-orange-500' },
                          { source: 'Twitter', percentage: 28, color: 'bg-blue-500' },
                          { source: 'News', percentage: 22, color: 'bg-purple-500' },
                          { source: 'Forums', percentage: 15, color: 'bg-green-500' }
                        ].map((item) => (
                          <div key={item.source} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm">{item.source}</span>
                              <span className="text-white font-medium text-sm">{item.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div className={`${item.color} h-2 rounded-full transition-all duration-300`} style={{width: `${item.percentage}%`}}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI-Generated Market Summary */}
                  <Card className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-xl border-blue-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2 text-lg">
                        🤖 AI Market Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          "Overall sentiment is moderately bullish today, driven by strong earnings reports in tech.
                          AI sector showing exceptional momentum with 91% positive sentiment.
                          Crypto markets recovering after regulatory clarity in EU markets."
                        </p>
                        <div className="border-t border-gray-700/50 pt-3">
                          <div className="text-gray-400 text-xs">
                            Generated 5 minutes ago • Confidence: 87%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pro Features Teaser */}
                  <Card className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-xl border-yellow-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2 text-lg">
                        ⭐ Pro Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">🚨</Badge>
                          <span className="text-gray-300 text-sm">Custom Alerts</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">📈</Badge>
                          <span className="text-gray-300 text-sm">Correlation Analysis</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">🔙</Badge>
                          <span className="text-gray-300 text-sm">Sentiment Backtesting</span>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-black font-semibold mt-3">
                          Upgrade to Pro
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="Scanner" className="mt-6">
            {/* Stock Screener Header */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Match Your Strategy</h2>
                </div>
                <p className="text-gray-300 text-sm">Discover your trading personality</p>

                {/* Strategy Button */}
                <div className="mt-4">
                  <Button
                    onClick={() => setShowProfiler(true)}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0"
                  >
                    ✨ Start Profiling →
                  </Button>
                </div>
              </div>
            </div>

            {/* Screener Tabs */}
            <div className="mb-6">
              <div className="flex gap-4">
                <Button
                  variant={screenerType === "basic" ? "default" : "outline"}
                  className={screenerType === "basic" ? "bg-purple-600 text-white" : "border-purple-500/30 text-purple-300"}
                  onClick={() => setScreenerType("basic")}
                >
                  Basic Screener
                </Button>
                <Button
                  variant={screenerType === "advanced" ? "default" : "outline"}
                  className={screenerType === "advanced" ? "bg-purple-600 text-white" : "border-purple-500/30 text-purple-300"}
                  onClick={() => setScreenerType("advanced")}
                >
                  Advanced Screener
                </Button>
              </div>
            </div>

            {/* Conditional Screener Content */}
            {screenerType === "basic" ? (
              <div>
                {/* Basic Stock Screener */}
                <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  🔍 Basic Stock Screener
                  <div className="ml-auto flex gap-2">
                    <Button size="sm" variant="outline" className="border-green-500/30 text-green-300">
                      Clear filters
                    </Button>
                    <Button size="sm" className="bg-purple-600 text-white">
                      Start analysis
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Ask for sector to ask stocks with using momentum and strong movements"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-black/40 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-0"
                    />
                    <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white px-4 py-1 h-8">
                      Search
                    </Button>
                  </div>
                </div>

                {/* Filters */}
                <div className="mb-6">
                  <h3 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                    🔧 Filters
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">Market Cap</label>
                      <select className="w-full bg-black/40 border border-purple-500/30 rounded text-white text-sm p-2">
                        <option>All Sizes</option>
                        <option>Large Cap</option>
                        <option>Mid Cap</option>
                        <option>Small Cap</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">Volume (24h)</label>
                      <select className="w-full bg-black/40 border border-purple-500/30 rounded text-white text-sm p-2">
                        <option>All Volumes</option>
                        <option>High Volume</option>
                        <option>Medium Volume</option>
                        <option>Low Volume</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">Sentiment Score</label>
                      <select className="w-full bg-black/40 border border-purple-500/30 rounded text-white text-sm p-2">
                        <option>All Sentiments</option>
                        <option>Bullish</option>
                        <option>Neutral</option>
                        <option>Bearish</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">Sector</label>
                      <select className="w-full bg-black/40 border border-purple-500/30 rounded text-white text-sm p-2">
                        <option>All Sectors</option>
                        <option>Technology</option>
                        <option>Finance</option>
                        <option>Consumer</option>
                        <option>Crypto</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Advanced Filters */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-white text-sm">Most Moow Advanced Filters</h4>
                    <div className="flex gap-2 text-xs">
                      <span className="text-gray-400">RSI - Moving Average - ROE ORM - Volume Analysis - News Alerts</span>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold px-6">
                    Upgrade to Pro
                  </Button>
                </div>

                {/* Results Count */}
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">
                    Found 35 results • <span className="text-purple-300 cursor-pointer hover:underline">See 35 results first time</span>
                  </p>
                </div>

                {/* Stock Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {filteredStocks.slice(0, 16).map((stock, index) => (
                    <Card key={stock.symbol} className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-white font-bold text-lg">{stock.symbol}</h3>
                            <p className="text-gray-400 text-xs truncate max-w-32">{stock.name}</p>
                          </div>
                          <Badge className={getSentimentBg(stock.sentiment)}>
                            {stock.sentiment}%
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-white">${stock.price}</span>
                            <div className={cn(
                              "flex items-center gap-1 text-sm font-medium",
                              stock.change >= 0 ? "text-green-400" : "text-red-400"
                            )}>
                              {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {stock.change >= 0 ? '+' : ''}{stock.change}%
                            </div>
                          </div>

                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Sentiment Score</span>
                              <span className={getSentimentColor(stock.sentiment)}>{stock.sentiment}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Market Cap</span>
                              <span className="text-gray-300">{stock.marketCap}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Volume</span>
                              <span className="text-gray-300">{stock.volume}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Last Close</span>
                              <span className="text-gray-300">${stock.lastClose}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Technology</span>
                              <span className="text-gray-300">{stock.sector}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 border-purple-500/30 text-purple-300 text-xs">
                            View
                          </Button>
                          <Button size="sm" className="bg-green-600 text-white text-xs">
                            Watch
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Unlock Full Results */}
            <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Crown className="w-8 h-8 text-yellow-400" />
                  <h3 className="text-2xl font-bold text-white">Unlock Full Results</h3>
                </div>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  You're viewing the top 16 results. Upgrade to PRO for all tools and access powerful filters and advanced strategies.
                </p>
                <div className="flex gap-4 justify-center mb-6">
                  <Button className="bg-yellow-500 text-black font-semibold hover:bg-yellow-400">
                    Upgrade to PRO
                  </Button>
                  <Button variant="outline" className="border-yellow-500/30 text-yellow-300">
                    Start Free Trial
                  </Button>
                  <Button variant="outline" className="border-yellow-500/30 text-yellow-300">
                    See Pricing
                  </Button>
                  <Button variant="outline" className="border-yellow-500/30 text-yellow-300">
                    Advanced Strategies
                  </Button>
                  <Button variant="outline" className="border-yellow-500/30 text-yellow-300">
                    Signal Features
                  </Button>
                </div>
                <Button className="bg-purple-600 text-white">
                  Upgrade to PRO
                </Button>
              </CardContent>
            </Card>
              </div>
            ) : (
              /* Advanced Stock Screener */
              <div className="space-y-6">
                {/* Smart Stock Screener Header */}
                <Card className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                        <Search className="w-4 h-4 text-emerald-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Smart Stock Screener</h2>
                    </div>
                    <p className="text-gray-300 text-sm mb-6">AI-powered screening with sentiment analysis</p>

                    {/* AI Search Bar */}
                    <div className="relative mb-6">
                      <Input
                        type="text"
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        className="pl-4 pr-20 py-4 bg-black/40 border-emerald-500/30 text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-0 text-lg rounded-xl"
                      />
                      <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-lg">
                        Search
                      </Button>
                    </div>

                    {/* Quick Filter Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Button size="sm" className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30" onClick={applyGrowthFilter}>
                        ⭐ Growth Tech Stocks
                      </Button>
                      <Button size="sm" className="bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30" onClick={applyOversoldFilter}>
                        ⭐ Oversold Bounce Candidates
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-500/30 text-gray-300" onClick={() => setShowSaveDialog(true)}>
                        📁 Save Template
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-500/30 text-gray-300" onClick={() => setShowLoadDialog(true)}>
                        📂 Load Template
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-500/30 text-gray-300" onClick={handleExportCSV}>
                        📊 Export CSV
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Main Advanced Screener Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Left Sidebar - Filters */}
                  <div className="lg:col-span-1">
                    <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          🔧 Filters
                          <div className="ml-auto flex gap-2">
                            <Button size="sm" variant="outline" className="border-gray-500/30 text-gray-300 text-xs" onClick={resetAllFilters}>
                              Reset
                            </Button>
                            <Button size="sm" variant="outline" className="border-gray-500/30 text-gray-300 text-xs">
                              Hide Filters
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Search */}
                        <div>
                          <Input
                            placeholder="Search ticker or company..."
                            value={searchTicker}
                            onChange={(e) => setSearchTicker(e.target.value)}
                            className="bg-black/40 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-0 text-sm"
                          />
                        </div>

                        {/* Fundamentals */}
                        <div>
                          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                            💰 Fundamentals
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-gray-400 text-xs mb-2 block">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
                              <div className="h-2 bg-gray-700 rounded-full relative">
                                <div
                                  className="absolute top-0 h-2 bg-purple-500 rounded-full"
                                  style={{
                                    left: `${((priceRange[0] ?? 0) / 500) * 100}%`,
                                    width: `${(((priceRange[1] ?? 500) - (priceRange[0] ?? 0)) / 500) * 100}%`
                                  }}
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="500"
                                  value={priceRange[0] ?? 0}
                                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1] ?? 500])}
                                  className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider"
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="500"
                                  value={priceRange[1] ?? 500}
                                  onChange={(e) => setPriceRange([priceRange[0] ?? 0, parseInt(e.target.value)])}
                                  className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-gray-400 text-xs mb-2 block">P/E Ratio: {peRatio[0]} - {peRatio[1]}</label>
                              <div className="h-2 bg-gray-700 rounded-full relative">
                                <div
                                  className="absolute top-0 h-2 bg-purple-500 rounded-full"
                                  style={{
                                    left: `${((peRatio[0] ?? 0) / 100) * 100}%`,
                                    width: `${(((peRatio[1] ?? 100) - (peRatio[0] ?? 0)) / 100) * 100}%`
                                  }}
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={peRatio[0] ?? 0}
                                  onChange={(e) => setPeRatio([parseInt(e.target.value), peRatio[1] ?? 100])}
                                  className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider"
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={peRatio[1] ?? 100}
                                  onChange={(e) => setPeRatio([peRatio[0] ?? 0, parseInt(e.target.value)])}
                                  className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-gray-400 text-xs mb-1 block">Market Cap</label>
                              <select
                                value={selectedMarketCap}
                                onChange={(e) => setSelectedMarketCap(e.target.value)}
                                className="w-full bg-black/40 border border-purple-500/30 rounded text-white text-sm p-2"
                              >
                                <option>All Sizes</option>
                                <option>Large Cap</option>
                                <option>Mid Cap</option>
                                <option>Small Cap</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-gray-400 text-xs mb-1 block">Sector</label>
                              <select
                                value={selectedSector}
                                onChange={(e) => setSelectedSector(e.target.value)}
                                className="w-full bg-black/40 border border-purple-500/30 rounded text-white text-sm p-2"
                              >
                                <option>All Sectors</option>
                                <option>Technology</option>
                                <option>Finance</option>
                                <option>Healthcare</option>
                                <option>Consumer</option>
                                <option>Automotive</option>
                                <option>Crypto</option>
                                <option>ETF</option>
                                <option>Entertainment</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Technicals */}
                        <div>
                          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                            📈 Technicals
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-gray-400 text-xs mb-2 block">RSI: {rsi[0]} - {rsi[1]}</label>
                              <div className="h-2 bg-gray-700 rounded-full relative">
                                <div
                                  className="absolute top-0 h-2 bg-blue-500 rounded-full"
                                  style={{
                                    left: `${(rsi[0] / 100) * 100}%`,
                                    width: `${((rsi[1] - rsi[0]) / 100) * 100}%`
                                  }}
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={rsi[0]}
                                  onChange={(e) => setRsi([parseInt(e.target.value), rsi[1]])}
                                  className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider"
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={rsi[1]}
                                  onChange={(e) => setRsi([rsi[0], parseInt(e.target.value)])}
                                  className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-gray-400 text-xs mb-1 block">Volume</label>
                              <select
                                value={selectedVolume}
                                onChange={(e) => setSelectedVolume(e.target.value)}
                                className="w-full bg-black/40 border border-purple-500/30 rounded text-white text-sm p-2"
                              >
                                <option>All Volumes</option>
                                <option>High Volume</option>
                                <option>Medium Volume</option>
                                <option>Low Volume</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Performance */}
                        <div>
                          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                            📊 Performance
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-gray-400 text-xs mb-2 block">1D Change: -20% - 20%</label>
                              <div className="h-2 bg-gray-700 rounded-full relative">
                                <div className="absolute left-1/2 top-0 h-2 bg-green-500 rounded-full" style={{width: '30%'}} />
                                <div className="absolute top-0 w-3 h-3 bg-green-400 rounded-full -mt-0.5 border-2 border-white" style={{left: '40%'}} />
                                <div className="absolute top-0 w-3 h-3 bg-green-400 rounded-full -mt-0.5 border-2 border-white" style={{left: '70%'}} />
                              </div>
                            </div>
                            <div>
                              <label className="text-gray-400 text-xs mb-2 block">Volatility: 0 - 10</label>
                              <div className="h-2 bg-gray-700 rounded-full relative">
                                <div className="absolute left-0 top-0 h-2 bg-orange-500 rounded-full" style={{width: '50%'}} />
                                <div className="absolute left-0 top-0 w-3 h-3 bg-orange-400 rounded-full -mt-0.5 border-2 border-white" style={{left: '0%'}} />
                                <div className="absolute top-0 w-3 h-3 bg-orange-400 rounded-full -mt-0.5 border-2 border-white" style={{left: '50%'}} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Sentiment */}
                        <div>
                          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                            🧠 Sentiment (MoodMeter)
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-gray-400 text-xs mb-2 block">Mood Score: {moodScore[0]} - {moodScore[1]}</label>
                              <div className="h-2 bg-gray-700 rounded-full relative">
                                <div
                                  className="absolute top-0 h-2 bg-emerald-500 rounded-full"
                                  style={{
                                    left: `${(moodScore[0] / 100) * 100}%`,
                                    width: `${((moodScore[1] - moodScore[0]) / 100) * 100}%`
                                  }}
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={moodScore[0]}
                                  onChange={(e) => setMoodScore([parseInt(e.target.value), moodScore[1]])}
                                  className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider"
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={moodScore[1]}
                                  onChange={(e) => setMoodScore([moodScore[0], parseInt(e.target.value)])}
                                  className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-gray-400 text-xs mb-1 block">Social Buzz</label>
                              <select
                                value={selectedSocialBuzz}
                                onChange={(e) => setSelectedSocialBuzz(e.target.value)}
                                className="w-full bg-black/40 border border-purple-500/30 rounded text-white text-sm p-2"
                              >
                                <option>All Levels</option>
                                <option>High Buzz</option>
                                <option>Medium Buzz</option>
                                <option>Low Buzz</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-gray-400 text-xs mb-2 block">News Score: 0 - 100</label>
                              <div className="h-2 bg-gray-700 rounded-full relative">
                                <div className="absolute left-0 top-0 h-2 bg-cyan-500 rounded-full" style={{width: '60%'}} />
                                <div className="absolute left-0 top-0 w-3 h-3 bg-cyan-400 rounded-full -mt-0.5 border-2 border-white" style={{left: '0%'}} />
                                <div className="absolute top-0 w-3 h-3 bg-cyan-400 rounded-full -mt-0.5 border-2 border-white" style={{left: '60%'}} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Live Mode */}
                        <div className="pt-4 border-t border-purple-500/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              <span className="text-white text-sm font-medium">Live Mode</span>
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">PRO</Badge>
                            </div>
                            <Button size="sm" variant={liveMode ? "default" : "outline"} className={liveMode ? "bg-green-600 text-white" : "border-gray-500/30 text-gray-400"} onClick={() => setLiveMode(!liveMode)}>
                              {liveMode ? "ON" : "OFF"}
                            </Button>
                          </div>
                          <p className="text-gray-400 text-xs mt-1">Auto-refresh every 30 seconds</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Main Content - Results */}
                  <div className="lg:col-span-3">
                    <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <CardTitle className="text-white">Found {filteredStocks.length} stocks</CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                                🕐 Real-time
                              </Badge>
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                                🤖 AI Enhanced
                              </Badge>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="border-gray-500/30 text-gray-300">
                            Hide Filters
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Advanced Stock Results Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { symbol: 'TSLA', name: 'Tesla, Inc.', price: 248.50, change: 5.20, sentiment: 32.5, rsi: 67.3, news: 82, badge: 'Bullish', analysis: 'Positive news catalyst detected' },
                            { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 421.25, change: -0.89, sentiment: 72.1, rsi: 58.7, news: 89, badge: 'Bullish', analysis: 'Technically overbought - potential pullback' },
                            { symbol: 'AAPL', name: 'Apple Inc.', price: 195.50, change: 1.60, sentiment: 58.7, rsi: 72.5, news: 76, badge: 'Neutral', analysis: 'No significant patterns detected' },
                            { symbol: 'AMD', name: 'Adv Micro Dev...', price: 142.80, change: -2.30, sentiment: 42.8, rsi: 61, news: 67, badge: 'Neutral', analysis: 'No significant patterns detected' },
                            { symbol: 'MSFT', name: 'Microsoft Corporation', price: 420.15, change: 1.41, sentiment: 64.4, rsi: 75, news: 74, badge: 'Bullish', analysis: 'No significant patterns detected' }
                          ].map((stock, index) => (
                            <Card key={stock.symbol} className="bg-gradient-to-br from-slate-800/60 to-purple-900/40 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                      {stock.symbol[0]}
                                    </div>
                                    <div>
                                      <h3 className="text-white font-bold text-lg">{stock.symbol}</h3>
                                      <p className="text-gray-400 text-xs">{stock.name}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <Badge className={stock.badge === 'Bullish' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                                      {stock.badge}
                                    </Badge>
                                    <p className="text-xs text-gray-400 mt-1">Technology</p>
                                  </div>
                                </div>

                                <div className="space-y-3 mb-4">
                                  <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-white">${stock.price}</span>
                                    <div className={cn(
                                      "flex items-center gap-1 text-sm font-medium",
                                      stock.change >= 0 ? "text-green-400" : "text-red-400"
                                    )}>
                                      {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                      {stock.change >= 0 ? '+' : ''}{stock.change}%
                                    </div>
                                  </div>

                                  {/* Price and Volume Info */}
                                  <div className="flex justify-between text-xs text-gray-400">
                                    <span>P/E 43.2 • Vol 68.1M</span>
                                    <span>RSI {stock.rsi} {stock.badge === 'Bullish' ? '(Overbought)' : '(Neutral)'}</span>
                                  </div>

                                  {/* Mood Score Progress Bar */}
                                  <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs text-gray-400">Mood Score</span>
                                      <span className="text-xs font-bold text-white">{Math.round(stock.sentiment)}/100</span>
                                    </div>
                                    <div className="h-2 bg-gray-700 rounded-full">
                                      <div className={cn("h-2 rounded-full", stock.sentiment > 60 ? 'bg-green-400' : stock.sentiment > 40 ? 'bg-yellow-400' : 'bg-red-400')} style={{width: `${stock.sentiment}%`}} />
                                    </div>
                                  </div>

                                  {/* Technical Indicators */}
                                  <div className="flex justify-between text-xs">
                                    <div className="flex items-center gap-1">
                                      <span className="text-gray-400">{Math.round(stock.rsi)}%</span>
                                      <div className="w-4 h-1 bg-gray-700 rounded">
                                        <div className="h-1 bg-blue-400 rounded" style={{width: `${stock.rsi}%`}} />
                                      </div>
                                      <span className="text-blue-400 font-bold">AI 75%</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-cyan-400">📰 News {stock.news}</span>
                                    </div>
                                  </div>

                                  {/* Analysis Text */}
                                  <div className="flex items-center gap-2 text-xs">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <span className="text-gray-400">{stock.analysis}</span>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="flex-1 border-purple-500/30 text-purple-300 text-xs">
                                    👁 View
                                  </Button>
                                  <Button size="sm" className="bg-green-600 text-white text-xs">
                                    📋 Watch
                                  </Button>
                                  <Button size="sm" variant="outline" className="border-gray-500/30 text-gray-400 text-xs">
                                    •••
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Strategy Profiler Modal */}
      {showProfiler && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <StrategySwiper
            placement="screener"
            onComplete={(profile) => {
              console.log('Profile completed:', profile);
              setShowProfiler(false);
            }}
            onClose={() => setShowProfiler(false)}
          />
        </div>
      )}

      {/* Load Template Dialog */}
      {showLoadDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/30 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <div>
                <h3 className="text-white text-xl font-bold">Load Filter Template</h3>
                <p className="text-gray-400 text-sm mt-1">Choose from preset templates or your saved custom filters.</p>
              </div>
              <Button
                onClick={() => setShowLoadDialog(false)}
                variant="outline"
                size="sm"
                className="border-gray-500/30 text-gray-300"
              >
                ✕ Close
              </Button>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-4">
              <div className="flex gap-2">
                <Button
                  variant={loadTemplateTab === "All Templates" ? "default" : "outline"}
                  className={loadTemplateTab === "All Templates" ? "bg-white text-black" : "border-gray-500/30 text-gray-300"}
                  onClick={() => setLoadTemplateTab("All Templates")}
                  size="sm"
                >
                  All Templates
                </Button>
                <Button
                  variant={loadTemplateTab === "Presets" ? "default" : "outline"}
                  className={loadTemplateTab === "Presets" ? "bg-purple-600 text-white" : "border-gray-500/30 text-gray-300"}
                  onClick={() => setLoadTemplateTab("Presets")}
                  size="sm"
                >
                  👑 Presets
                </Button>
                <Button
                  variant={loadTemplateTab === "Custom" ? "default" : "outline"}
                  className={loadTemplateTab === "Custom" ? "bg-blue-600 text-white" : "border-gray-500/30 text-gray-300"}
                  onClick={() => setLoadTemplateTab("Custom")}
                  size="sm"
                >
                  🔧 Custom
                </Button>
              </div>
            </div>

            {/* Template List */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {/* Growth Tech Stocks */}
                {(loadTemplateTab === "All Templates" || loadTemplateTab === "Presets") && (
                  <div className="bg-slate-800/50 border border-gray-700/50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white font-semibold">Growth Tech Stocks</h4>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                          👑 Preset
                        </Badge>
                        <div className="text-yellow-400 cursor-pointer hover:text-yellow-300">
                          ⭐
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">High-growth technology stocks with strong momentum</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>🕐 12/31/2023</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        handleLoadTemplate("Growth Template");
                        setShowLoadDialog(false);
                      }}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      size="sm"
                    >
                      ✓ Load
                    </Button>
                  </div>
                )}

                {/* Value Dividend Plays */}
                {(loadTemplateTab === "All Templates" || loadTemplateTab === "Presets") && (
                  <div className="bg-slate-800/50 border border-gray-700/50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white font-semibold">Value Dividend Plays</h4>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                          👑 Preset
                        </Badge>
                        <div className="text-gray-400 cursor-pointer hover:text-yellow-300">
                          ☆
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">Undervalued dividend-paying stocks</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>🕐 12/31/2023</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        handleLoadTemplate("Value Template");
                        setShowLoadDialog(false);
                      }}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      size="sm"
                    >
                      ✓ Load
                    </Button>
                  </div>
                )}

                {/* Oversold Bounce Candidates */}
                {(loadTemplateTab === "All Templates" || loadTemplateTab === "Presets") && (
                  <div className="bg-slate-800/50 border border-gray-700/50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white font-semibold">Oversold Bounce Candidates</h4>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                          👑 Preset
                        </Badge>
                        <div className="text-yellow-400 cursor-pointer hover:text-yellow-300">
                          ⭐
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">Stocks in oversold territory with potential for reversal</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>🕐 12/31/2023</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        applyOversoldFilter();
                        setShowLoadDialog(false);
                      }}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      size="sm"
                    >
                      ✓ Load
                    </Button>
                  </div>
                )}

                {/* Momentum Breakout */}
                {(loadTemplateTab === "All Templates" || loadTemplateTab === "Presets") && (
                  <div className="bg-slate-800/50 border border-gray-700/50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white font-semibold">Momentum Breakout</h4>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                          👑 Preset
                        </Badge>
                        <div className="text-gray-400 cursor-pointer hover:text-yellow-300">
                          ☆
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">Stocks breaking out with strong momentum signals</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>🕐 12/31/2023</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        // Apply momentum breakout filter
                        setRsi([60, 100]);
                        setDayChange([2, 20]);
                        setMoodScore([70, 100]);
                        setSelectedVolume("High Volume");
                        setShowLoadDialog(false);
                      }}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      size="sm"
                    >
                      ✓ Load
                    </Button>
                  </div>
                )}

                {/* Custom Templates */}
                {(loadTemplateTab === "All Templates" || loadTemplateTab === "Custom") && savedTemplates.map((template, index) => (
                  <div key={index} className="bg-slate-800/50 border border-gray-700/50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white font-semibold">{template}</h4>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                          🔧 Custom
                        </Badge>
                        <div className="text-gray-400 cursor-pointer hover:text-yellow-300">
                          ☆
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">Custom filter configuration saved by user</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>🕐 {new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        handleLoadTemplate(template);
                        setShowLoadDialog(false);
                      }}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      size="sm"
                    >
                      ✓ Load
                    </Button>
                  </div>
                ))}

                {/* Empty state for Custom tab */}
                {loadTemplateTab === "Custom" && savedTemplates.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-lg mb-2">📁</div>
                    <p className="text-gray-400">No custom templates found</p>
                    <p className="text-gray-500 text-sm">Save your current filters to create custom templates</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Template Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/30 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-white text-lg font-bold mb-4">Save Template</h3>
            <Input
              placeholder="Enter template name..."
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              className="mb-4 bg-black/40 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-0"
            />
            <div className="flex gap-3">
              <Button
                onClick={handleSaveTemplate}
                className="flex-1 bg-purple-600 text-white"
                disabled={!newTemplateName.trim()}
              >
                Save Template
              </Button>
              <Button
                onClick={() => {
                  setShowSaveDialog(false);
                  setNewTemplateName("");
                }}
                variant="outline"
                className="flex-1 border-gray-500/30 text-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
