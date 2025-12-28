import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, BarChart3, Eye, Star, Activity, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconText } from "@/lib/iconUtils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";

interface TrendingHubProps {
  className?: string;
}

const TrendingHub: React.FC<TrendingHubProps> = ({ className }) => {
  const { themeMode } = useMoodTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('1D');
  const [sortBy, setSortBy] = useState('change');
  const [activeTab, setActiveTab] = useState('trending');

  const marketData = [
    {
      rank: 1,
      symbol: 'NVDA',
      company: 'NVIDIA Corporation',
      price: '$875.28',
      change: '+2.76%',
      volume: '89.2M',
      sparkline: [70, 75, 80, 85, 90, 95, 88],
      trending: true
    },
    {
      rank: 2,
      symbol: 'AAPL',
      company: 'Apple Inc',
      price: '$190.64',
      change: '+2.21%',
      volume: '67.3M',
      sparkline: [75, 78, 82, 85, 87, 90, 85],
      trending: true
    },
    {
      rank: 3,
      symbol: 'MSFT',
      company: 'Microsoft Corporation',
      price: '$378.85',
      change: '+2.00%',
      volume: '28.5M',
      sparkline: [80, 82, 85, 88, 90, 92, 89],
      trending: true
    },
    {
      rank: 4,
      symbol: 'GOOGL',
      company: 'Alphabet Inc',
      price: '$139.69',
      change: '-2.02%',
      volume: '34.1M',
      sparkline: [85, 82, 78, 75, 72, 70, 68],
      trending: false
    },
    {
      rank: 5,
      symbol: 'TSLA',
      company: 'Tesla, Inc.',
      price: '$248.50',
      change: '-3.21%',
      volume: '156.7M',
      sparkline: [90, 85, 80, 75, 70, 65, 62],
      trending: false
    }
  ];

  const trendingNews = [
    {
      title: "NVIDIA's AI chip demand surges 400% as tech giants race for supremacy",
      description: "Major cloud providers are scrambling to secure NVIDIA's latest H100 chips, driving unprecedented demand.",
      tags: ['AI/Tech'],
      source: 'TechCrunch',
      time: '2h ago',
      sentiment: 'bullish',
      impact: '+195 ⧫⧫⧫⧫⧫'
    },
    {
      title: "Solana DeFi ecosystem explodes with new protocol launches",
      description: "Three major DeFi protocols launched on Solana this week, driving massive trading volume.",
      tags: ['DeFi'],
      source: 'CoinDesk',
      time: '4h ago',
      sentiment: 'bullish',
      impact: '+87% ⧫⧫⧫⧫⧫'
    },
    {
      title: "Tesla's robotaxi reveal sparks mixed reactions from investors",
      description: "While some see potential, others question the timeline and feasibility of full autonomy.",
      tags: ['Automotive'],
      source: 'Reuters',
      time: '1h ago',
      sentiment: 'mixed',
      impact: '+67% ⧫⧫⧫⧫⧫'
    }
  ];

  const spotlightCards = [
    {
      type: 'Most Trending',
      icon: '⧫⧫⧫⧫',
      title: 'NVIDIA',
      subtitle: '+456% trending',
      description: 'AI Revolution',
      color: 'from-purple-500 to-pink-500'
    },
    {
      type: 'Biggest Mover',
      icon: '◎',
      title: 'Solana',
      subtitle: '+186.7% today',
      description: 'DeFi Surge',
      color: 'from-blue-500 to-purple-500'
    },
    {
      type: 'Social Leader',
      icon: 'Ð',
      title: 'Dogecoin',
      subtitle: '5.6M mentions',
      description: 'Viral Trend',
      color: 'from-orange-500 to-yellow-500'
    }
  ];

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'bullish') return 'text-green-400';
    if (sentiment === 'bearish') return 'text-red-400';
    return 'text-yellow-400';
  };

  const getSentimentBadge = (sentiment: string) => {
    if (themeMode === 'light') {
      if (sentiment === 'bullish') return 'bg-green-100 text-green-700 border-green-300';
      if (sentiment === 'bearish') return 'bg-red-100 text-red-700 border-red-300';
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    } else {
      if (sentiment === 'bullish') return 'bg-green-500/20 text-green-400 border-green-500/30';
      if (sentiment === 'bearish') return 'bg-red-500/20 text-red-400 border-red-500/30';
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden",
      themeMode === 'light'
        ? 'bg-[#F5F7FA]'
        : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
      className
    )}>
      {/* Header */}
      <div className={cn(
        "relative z-40 border-b backdrop-blur-xl",
        themeMode === 'light'
          ? 'bg-white/80 border-gray-200'
          : 'bg-black/40 border-purple-500/20'
      )}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center mb-6">
            <h1 className={cn(
              "text-4xl font-bold mb-2 flex items-center justify-center gap-3",
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            )}>
              🔥 Trending Hub
            </h1>
            <p className={cn(
              "text-lg",
              themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
            )}>
              Real-time trending assets, topics, and market movers
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Market Pulse Panel */}
        <Card className={cn(
          "border backdrop-blur-xl",
          themeMode === 'light'
            ? 'bg-white border-gray-200 shadow-lg'
            : 'bg-black/40 border-purple-500/20'
        )}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className={cn(
                "flex items-center gap-2 text-xl",
                themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
              )}>
                📊 Market Pulse Panel
              </CardTitle>
              <Badge className={cn(
                "animate-pulse",
                themeMode === 'light'
                  ? 'bg-green-100 text-green-700 border-green-300'
                  : 'bg-green-500/20 text-green-400 border-green-500/30'
              )}>
                Live Data
              </Badge>
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-4 flex-wrap mt-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "pl-10 w-64",
                    themeMode === 'light'
                      ? 'bg-white border-gray-300'
                      : 'bg-black/40 border-gray-600 text-white'
                  )}
                />
              </div>
              
              <div className="flex gap-2">
                {['1D', '7D', '30D'].map((period) => (
                  <Button
                    key={period}
                    variant={timeFilter === period ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeFilter(period)}
                    className={cn(
                      timeFilter === period && themeMode === 'light' && 'bg-purple-600 hover:bg-purple-700',
                      timeFilter === period && themeMode !== 'light' && 'bg-purple-500 hover:bg-purple-600'
                    )}
                  >
                    {period}
                  </Button>
                ))}
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className={cn(
                  "w-40",
                  themeMode === 'light'
                    ? 'bg-white border-gray-300'
                    : 'bg-black/40 border-gray-600 text-white'
                )}>
                  <SelectValue placeholder="Sort: change" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="change">Sort: change</SelectItem>
                  <SelectItem value="volume">Sort: volume</SelectItem>
                  <SelectItem value="price">Sort: price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={cn(
                "grid w-full grid-cols-5 border",
                themeMode === 'light'
                  ? 'bg-gray-100 border-gray-200'
                  : 'bg-black/20 backdrop-blur-xl border-gray-700/50'
              )}>
                <TabsTrigger value="trending" className={cn(
                  "flex items-center gap-2",
                  themeMode === 'light'
                    ? 'data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700 text-gray-600'
                    : 'data-[state=active]:bg-pink-600/30 data-[state=active]:text-pink-300 text-gray-400'
                )}>
                  🔥 Trending
                </TabsTrigger>
                <TabsTrigger value="active" className={cn(
                  "flex items-center gap-2",
                  themeMode === 'light'
                    ? 'data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-gray-600'
                    : 'data-[state=active]:bg-blue-600/30 data-[state=active]:text-blue-300 text-gray-400'
                )}>
                  📊 Most Active
                </TabsTrigger>
                <TabsTrigger value="watchers" className={cn(
                  "flex items-center gap-2",
                  themeMode === 'light'
                    ? 'data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 text-gray-600'
                    : 'data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-300 text-gray-400'
                )}>
                  👁 Watchers
                </TabsTrigger>
                <TabsTrigger value="gainers" className={cn(
                  "flex items-center gap-2",
                  themeMode === 'light'
                    ? 'data-[state=active]:bg-green-100 data-[state=active]:text-green-700 text-gray-600'
                    : 'data-[state=active]:bg-green-600/30 data-[state=active]:text-green-300 text-gray-400'
                )}>
                  📈 Gainers
                </TabsTrigger>
                <TabsTrigger value="losers" className={cn(
                  "flex items-center gap-2",
                  themeMode === 'light'
                    ? 'data-[state=active]:bg-red-100 data-[state=active]:text-red-700 text-gray-600'
                    : 'data-[state=active]:bg-red-600/30 data-[state=active]:text-red-300 text-gray-400'
                )}>
                  📉 Losers
                </TabsTrigger>
              </TabsList>

              <TabsContent value="trending" className="mt-6">
                <div className="space-y-3">
                  {marketData.map((stock) => (
                    <div
                      key={stock.symbol}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer group",
                        themeMode === 'light'
                          ? 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                          : 'bg-gradient-to-r from-black/60 to-purple-900/20 border-purple-500/20 hover:border-purple-400/40'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold",
                          themeMode === 'light'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-purple-500/20 text-purple-400'
                        )}>
                          #{stock.rank}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-white",
                            stock.symbol === 'NVDA' ? 'bg-green-600' :
                            stock.symbol === 'AAPL' ? 'bg-gray-600' :
                            stock.symbol === 'MSFT' ? 'bg-blue-600' :
                            stock.symbol === 'GOOGL' ? 'bg-red-600' : 'bg-red-500'
                          )}>
                            {stock.symbol.charAt(0)}
                          </div>
                          
                          <div>
                            <div className={cn(
                              "font-bold text-lg",
                              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                            )}>
                              {stock.symbol}
                            </div>
                            <div className={cn(
                              "text-sm",
                              themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                            )}>
                              {stock.company}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Sparkline */}
                        <div className="w-24 h-8">
                          <svg width="96" height="32" className="overflow-visible">
                            <defs>
                              <linearGradient id={`gradient-${stock.symbol}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={stock.trending ? "#10B981" : "#EF4444"} stopOpacity="0.8" />
                                <stop offset="100%" stopColor={stock.trending ? "#059669" : "#DC2626"} stopOpacity="0.4" />
                              </linearGradient>
                            </defs>
                            <path
                              d={`M 0 ${32 - (stock.sparkline[0] * 32 / 100)} ${stock.sparkline.map((point, index) => 
                                `L ${(index * 16)} ${32 - (point * 32 / 100)}`
                              ).join(' ')}`}
                              stroke={`url(#gradient-${stock.symbol})`}
                              strokeWidth="2"
                              fill="none"
                            />
                          </svg>
                        </div>

                        <div className="text-right">
                          <div className={cn(
                            "font-bold text-xl",
                            themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                          )}>
                            {stock.price}
                          </div>
                          <div className={cn(
                            "font-medium",
                            stock.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                          )}>
                            {stock.change}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className={cn(
                            "text-sm",
                            themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                          )}>
                            Volume
                          </div>
                          <div className={cn(
                            "font-medium",
                            themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                          )}>
                            {stock.volume}
                          </div>
                        </div>

                        <Button variant="ghost" size="sm">
                          <Star className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mt-6 text-sm">
                  <div className={cn(
                    "flex items-center gap-2",
                    themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                  )}>
                    <Clock className="w-4 h-4" />
                    Last updated: 30s ago
                  </div>
                  <div className={cn(
                    themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                  )}>
                    Showing 5 stocks
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* What's Trending Now */}
        <Card className={cn(
          "border backdrop-blur-xl",
          themeMode === 'light'
            ? 'bg-white border-gray-200 shadow-lg'
            : 'bg-black/40 border-purple-500/20'
        )}>
          <CardHeader>
            <CardTitle className={cn(
              "flex items-center gap-2 text-xl",
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            )}>
              🔥 What's Trending Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="news" className="w-full">
              <TabsList className={cn(
                "grid w-full grid-cols-3 border",
                themeMode === 'light'
                  ? 'bg-gray-100 border-gray-200'
                  : 'bg-black/20 backdrop-blur-xl border-gray-700/50'
              )}>
                <TabsTrigger value="news">📰 Trending News</TabsTrigger>
                <TabsTrigger value="buzz">💬 Social Buzz</TabsTrigger>
                <TabsTrigger value="searches">🔍 Top Searches</TabsTrigger>
              </TabsList>

              <TabsContent value="news" className="mt-6">
                <div className="space-y-4">
                  {trendingNews.map((news, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded-xl border transition-all duration-300 cursor-pointer group",
                        themeMode === 'light'
                          ? 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                          : 'bg-gradient-to-r from-black/60 to-purple-900/20 border-purple-500/20 hover:border-purple-400/40'
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className={cn(
                          "font-bold text-lg leading-tight",
                          themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                        )}>
                          {news.title}
                        </h3>
                        <Badge className={getSentimentBadge(news.sentiment)}>
                          {news.impact}
                        </Badge>
                      </div>

                      <p className={cn(
                        "text-sm mb-3 leading-relaxed",
                        themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'
                      )}>
                        {news.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {news.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className={cn(
                              "text-xs",
                              themeMode === 'light'
                                ? 'border-gray-300 text-gray-600'
                                : 'border-gray-600 text-gray-400'
                            )}>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className={cn(
                          "text-xs",
                          themeMode === 'light' ? 'text-[#888]' : 'text-gray-400'
                        )}>
                          {news.source} • {news.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="buzz" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      platform: 'Twitter',
                      hashtag: '#NVDAtoTheMoon',
                      mentions: '245K',
                      growth: '+340%',
                      color: 'from-blue-500 to-blue-600',
                      textColor: 'text-blue-400',
                      bgColor: themeMode === 'light' ? 'bg-blue-50' : 'bg-blue-500/10'
                    },
                    {
                      platform: 'Reddit',
                      hashtag: 'r/wallstreetbets',
                      mentions: '189K',
                      growth: '+156%',
                      color: 'from-orange-500 to-red-500',
                      textColor: 'text-orange-400',
                      bgColor: themeMode === 'light' ? 'bg-orange-50' : 'bg-orange-500/10'
                    },
                    {
                      platform: 'Discord',
                      hashtag: '#SolanaGang',
                      mentions: '78K',
                      growth: '+234%',
                      color: 'from-purple-500 to-purple-600',
                      textColor: 'text-purple-400',
                      bgColor: themeMode === 'light' ? 'bg-purple-50' : 'bg-purple-500/10'
                    },
                    {
                      platform: 'Telegram',
                      hashtag: '#DogecoinRise',
                      mentions: '567K',
                      growth: '+89%',
                      color: 'from-cyan-500 to-blue-500',
                      textColor: 'text-cyan-400',
                      bgColor: themeMode === 'light' ? 'bg-cyan-50' : 'bg-cyan-500/10'
                    },
                    {
                      platform: 'TikTok',
                      hashtag: '#CryptoTok',
                      mentions: '1.2M',
                      growth: '+45%',
                      color: 'from-pink-500 to-rose-500',
                      textColor: 'text-pink-400',
                      bgColor: themeMode === 'light' ? 'bg-pink-50' : 'bg-pink-500/10'
                    },
                    {
                      platform: 'Instagram',
                      hashtag: '#TeslaNews',
                      mentions: '134K',
                      growth: '+23%',
                      color: 'from-purple-500 to-pink-500',
                      textColor: 'text-purple-400',
                      bgColor: themeMode === 'light' ? 'bg-purple-50' : 'bg-purple-500/10'
                    }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded-xl border transition-all duration-300 cursor-pointer group",
                        themeMode === 'light'
                          ? 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                          : 'bg-gradient-to-r from-black/60 to-purple-900/20 border-purple-500/20 hover:border-purple-400/40'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white",
                            item.bgColor
                          )}>
                            <span className={item.textColor}>
                              {item.platform.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className={cn(
                              "text-xs uppercase tracking-wider font-semibold",
                              themeMode === 'light' ? 'text-gray-500' : 'text-gray-400'
                            )}>
                              {item.platform}
                            </div>
                            <div className={cn(
                              "font-bold text-sm",
                              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                            )}>
                              {item.hashtag}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className={cn(
                            "font-bold text-lg",
                            themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                          )}>
                            {item.mentions}
                          </div>
                          <div className="text-xs text-gray-400">mentions</div>
                        </div>

                        <div className="text-right">
                          <Badge className={cn(
                            "text-xs font-medium",
                            item.growth.startsWith('+')
                              ? themeMode === 'light'
                                ? 'bg-green-100 text-green-700 border-green-300'
                                : 'bg-green-500/20 text-green-400 border-green-500/30'
                              : themeMode === 'light'
                                ? 'bg-red-100 text-red-700 border-red-300'
                                : 'bg-red-500/20 text-red-400 border-red-500/30'
                          )}>
                            {item.growth}
                          </Badge>
                          <div className="text-xs text-gray-400 mt-1">24h growth</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="searches" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      term: 'NVIDIA stock prediction',
                      region: 'Global',
                      searches: '2.3M',
                      trend: '+456%',
                      color: 'from-green-500 to-emerald-600'
                    },
                    {
                      term: 'Solana price target',
                      region: 'US',
                      searches: '1.8M',
                      trend: '+234%',
                      color: 'from-purple-500 to-violet-600'
                    },
                    {
                      term: 'Tesla robotaxi news',
                      region: 'Global',
                      searches: '3.1M',
                      trend: '+189%',
                      color: 'from-red-500 to-rose-600'
                    },
                    {
                      term: 'Bitcoin ETF approval',
                      region: 'US',
                      searches: '4.2M',
                      trend: '+123%',
                      color: 'from-orange-500 to-amber-600'
                    },
                    {
                      term: 'Dogecoin price crash',
                      region: 'Global',
                      searches: '5.6M',
                      trend: '+567%',
                      color: 'from-yellow-500 to-yellow-600'
                    },
                    {
                      term: 'Apple earnings report',
                      region: 'US',
                      searches: '2.7M',
                      trend: '+78%',
                      color: 'from-blue-500 to-cyan-600'
                    }
                  ].map((search, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded-xl border transition-all duration-300 cursor-pointer group hover:scale-105",
                        themeMode === 'light'
                          ? 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-lg'
                          : 'bg-gradient-to-br from-black/60 to-purple-900/30 border-purple-500/20 hover:border-purple-400/40'
                      )}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge className={cn(
                            "text-xs font-medium px-2 py-1",
                            search.region === 'Global'
                              ? themeMode === 'light'
                                ? 'bg-blue-100 text-blue-700 border-blue-300'
                                : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              : themeMode === 'light'
                                ? 'bg-purple-100 text-purple-700 border-purple-300'
                                : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                          )}>
                            {search.region}
                          </Badge>
                          <Badge className={cn(
                            "text-xs font-medium px-2 py-1",
                            themeMode === 'light'
                              ? 'bg-green-100 text-green-700 border-green-300'
                              : 'bg-green-500/20 text-green-400 border-green-500/30'
                          )}>
                            {search.trend}
                          </Badge>
                        </div>

                        <div>
                          <h4 className={cn(
                            "font-bold text-sm leading-tight mb-2",
                            themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                          )}>
                            {search.term}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className={cn(
                              "font-bold text-lg",
                              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                            )}>
                              {search.searches}
                            </div>
                            <div className="text-xs text-gray-400">searches</div>
                          </div>

                          <div className="text-right">
                            <div className="text-xs text-gray-400 mb-1">24h growth</div>
                            <div className={cn(
                              "text-sm font-semibold",
                              search.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
                            )}>
                              {search.trend}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Spotlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {spotlightCards.map((card, index) => (
            <Card
              key={index}
              className={cn(
                "border backdrop-blur-xl overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105",
                themeMode === 'light'
                  ? 'bg-white border-gray-200 shadow-lg hover:shadow-xl'
                  : 'bg-black/40 border-purple-500/20 hover:border-purple-400/40'
              )}
            >
              <CardContent className="p-6 text-center">
                <div className={cn(
                  "text-xs uppercase tracking-wider mb-2 font-semibold",
                  themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                )}>
                  {card.type}
                </div>
                
                <div className="mb-3"><IconText value={card.icon} className="w-8 h-8" textClassName="text-4xl" /></div>
                
                <h3 className={cn(
                  "text-2xl font-bold mb-1",
                  themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                )}>
                  {card.title}
                </h3>
                
                <div className={cn(
                  "text-sm font-medium mb-2",
                  themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                )}>
                  {card.subtitle}
                </div>
                
                <Badge className={cn(
                  `bg-gradient-to-r ${card.color} text-white border-0`
                )}>
                  {card.description}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-8 py-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className={cn(
              "text-sm",
              themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
            )}>
              📊 Trending Data Live
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className={cn(
              "text-sm",
              themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
            )}>
              💬 Social Analytics Active
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-purple-500" />
            <span className={cn(
              "text-sm",
              themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
            )}>
              🔍 Search Trends Real-time
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingHub;
