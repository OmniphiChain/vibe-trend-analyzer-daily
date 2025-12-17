import React, { useState, useEffect } from 'react';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calendar,
  DollarSign,
  Target,
  AlertCircle,
  Plus,
  Bell,
  MessageSquare,
  Share2,
  ExternalLink,
  Activity,
  Users,
  Sparkles,
  Brain,
  ChevronDown,
  ChevronUp,
  PieChart,
  LineChart,
  Heart,
  Eye,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface TickerAnalyticsData {
  symbol: string;
  companyName: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  dayHigh: number;
  dayLow: number;
  week52High: number;
  week52Low: number;
  peRatio?: number;
  rsi?: number;
  sentiment: {
    overall: number; // 0-100 scale
    bullish: number;
    bearish: number;
    neutral: number;
    sources: {
      twitter: number;
      reddit: number;
      news: number;
      community: number;
    };
  };
  chartData: {
    timeframes: {
      '1D': number[];
      '7D': number[];
      '1M': number[];
    };
    currentTimeframe: '1D' | '7D' | '1M';
  };
  riskTags: string[];
  aiSummary: string;
}

interface CommunityPost {
  id: string;
  user: {
    username: string;
    avatar: string;
    verified: boolean;
    credibilityScore: number;
  };
  content: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface TickerAnalyticsDrawerProps {
  ticker: string | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToWatchlist?: (ticker: string) => void;
  onSetAlert?: (ticker: string) => void;
  onCreatePost?: (ticker: string) => void;
}

// Mock data generator
const generateTickerAnalyticsData = (symbol: string): TickerAnalyticsData => {
  const price = Math.random() * 500 + 50;
  const change = (Math.random() - 0.5) * 20;
  const changePercent = (change / price) * 100;
  
  // Generate realistic chart data
  const generateChartData = (length: number) => {
    const data = [price];
    for (let i = 1; i < length; i++) {
      const variation = (Math.random() - 0.5) * 5;
      data.push(Math.max(10, data[i - 1] + variation));
    }
    return data;
  };

  const companyData: Record<string, { name: string; sector: string; marketCap: string }> = {
    'NVDA': { name: 'NVIDIA Corporation', sector: 'Technology', marketCap: '$1.2T' },
    'TSLA': { name: 'Tesla, Inc.', sector: 'Automotive', marketCap: '$800B' },
    'AAPL': { name: 'Apple Inc.', sector: 'Technology', marketCap: '$3.0T' },
    'MSFT': { name: 'Microsoft Corporation', sector: 'Technology', marketCap: '$2.8T' },
    'BTC': { name: 'Bitcoin', sector: 'Cryptocurrency', marketCap: '$850B' },
    'ETH': { name: 'Ethereum', sector: 'Cryptocurrency', marketCap: '$280B' },
  };

  const company = companyData[symbol] || { name: `${symbol} Corp.`, sector: 'Technology', marketCap: '$50B' };
  
  // Generate sentiment data
  const bullish = Math.random() * 40 + 30; // 30-70%
  const bearish = Math.random() * 30 + 10; // 10-40%
  const neutral = 100 - bullish - bearish;
  const overall = bullish - bearish + 50; // Convert to 0-100 scale

  return {
    symbol,
    companyName: company.name,
    sector: company.sector,
    price,
    change,
    changePercent,
    volume: Math.floor(Math.random() * 50000000) + 1000000,
    marketCap: company.marketCap,
    dayHigh: price + Math.random() * 10,
    dayLow: price - Math.random() * 10,
    week52High: price + Math.random() * 50 + 20,
    week52Low: price - Math.random() * 30 - 10,
    peRatio: Math.random() * 50 + 10,
    rsi: Math.random() * 40 + 30,
    sentiment: {
      overall,
      bullish,
      bearish,
      neutral,
      sources: {
        twitter: Math.random() * 100,
        reddit: Math.random() * 100,
        news: Math.random() * 100,
        community: Math.random() * 100,
      }
    },
    chartData: {
      timeframes: {
        '1D': generateChartData(24),
        '7D': generateChartData(7),
        '1M': generateChartData(30),
      },
      currentTimeframe: '1D'
    },
    riskTags: overall > 70 ? ['🚀 Momentum', '⚡ High Volume'] : 
               overall < 30 ? ['⚠️ High Risk', '📉 Bearish'] : 
               ['🧠 Balanced', '📊 Stable'],
    aiSummary: `${symbol} is showing ${overall > 60 ? 'strong bullish momentum' : overall < 40 ? 'bearish pressure' : 'mixed signals'} with ${bullish.toFixed(0)}% of the community sentiment being bullish. The stock ${changePercent > 0 ? 'gained' : 'lost'} ${Math.abs(changePercent).toFixed(2)}% today on ${(Math.random() * 2 + 0.5).toFixed(1)}x average volume, indicating ${changePercent > 0 ? 'institutional buying' : 'profit-taking'}.`
  };
};

// Mock community posts
const generateCommunityPosts = (symbol: string): CommunityPost[] => [
  {
    id: '1',
    user: {
      username: 'TradingAlpha',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      verified: true,
      credibilityScore: 94
    },
    content: `$${symbol} breakout confirmed! 🚀 Volume is 3x average and we just cleared major resistance. This could run to $220+ 📈💎`,
    sentiment: 'Bullish',
    timestamp: '5m ago',
    likes: 127,
    comments: 34,
    isLiked: false
  },
  {
    id: '2',
    user: {
      username: 'BearMarketSurvivor',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=faces',
      verified: false,
      credibilityScore: 78
    },
    content: `Everyone's bullish on $${symbol} but I'm seeing divergence on the RSI. Might be time to take some profits 🤔📊`,
    sentiment: 'Bearish',
    timestamp: '12m ago',
    likes: 83,
    comments: 29,
    isLiked: true
  },
  {
    id: '3',
    user: {
      username: 'AIInvestor',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
      verified: true,
      credibilityScore: 91
    },
    content: `My AI model gives $${symbol} an 8.5/10 score this week. The fundamental analysis is extremely bullish 🤖✨`,
    sentiment: 'Bullish',
    timestamp: '18m ago',
    likes: 156,
    comments: 42,
    isLiked: false
  }
];

// Sentiment dial component
const SentimentDial: React.FC<{ value: number; size?: 'sm' | 'md' | 'lg' }> = ({ value, size = 'md' }) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return { container: 'w-16 h-16', text: 'text-sm' };
      case 'lg': return { container: 'w-32 h-32', text: 'text-xl' };
      default: return { container: 'w-24 h-24', text: 'text-base' };
    }
  };

  const sizeClasses = getSize();
  const angle = (value / 100) * 180 - 90; // Convert to -90 to 90 degrees
  const color = value > 60 ? 'text-green-400' : value < 40 ? 'text-red-400' : 'text-yellow-400';

  return (
    <div className={cn("relative", sizeClasses.container)}>
      <svg className="w-full h-full transform rotate-180" viewBox="0 0 100 100">
        {/* Background arc */}
        <path
          d="M 20 80 A 30 30 0 0 1 80 80"
          fill="none"
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Sentiment arc */}
        <path
          d="M 20 80 A 30 30 0 0 1 80 80"
          fill="none"
          stroke={value > 60 ? '#10b981' : value < 40 ? '#ef4444' : '#f59e0b'}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * 94.2} 94.2`}
          className="transition-all duration-1000"
        />
      </svg>
      <div className={cn("absolute inset-0 flex flex-col items-center justify-center", sizeClasses.text, color)}>
        <div className="font-bold">{value.toFixed(0)}</div>
        <div className="text-xs text-slate-400">Mood</div>
      </div>
    </div>
  );
};

// Mini chart component
const MiniChart: React.FC<{ data: number[]; isPositive: boolean; timeframe: string }> = ({ 
  data, 
  isPositive, 
  timeframe 
}) => {
  const width = 300;
  const height = 120;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-[120px] bg-slate-800/40 rounded-lg p-3 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-400 font-medium">{timeframe} CHART</span>
        <div className={cn("flex items-center gap-1 text-xs font-semibold", 
          isPositive ? "text-green-400" : "text-red-400"
        )}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? 'Bullish' : 'Bearish'}
        </div>
      </div>
      <svg width={width} height={height - 30} className="w-full h-[90px]">
        <defs>
          <linearGradient id={`chart-gradient-${isPositive ? 'green' : 'red'}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.4" />
            <stop offset="100%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={`0,${height - 30} ${points} ${width},${height - 30}`}
          fill={`url(#chart-gradient-${isPositive ? 'green' : 'red'})`}
          stroke="none"
        />
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? "#10b981" : "#ef4444"}
          strokeWidth="2"
          className="drop-shadow-sm"
        />
      </svg>
    </div>
  );
};

export const TickerAnalyticsDrawer: React.FC<TickerAnalyticsDrawerProps> = ({
  ticker,
  isOpen,
  onClose,
  onAddToWatchlist,
  onSetAlert,
  onCreatePost
}) => {
  const [tickerData, setTickerData] = useState<TickerAnalyticsData | null>(null);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [chartTimeframe, setChartTimeframe] = useState<'1D' | '7D' | '1M'>('1D');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && ticker) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setTickerData(generateTickerAnalyticsData(ticker));
        setCommunityPosts(generateCommunityPosts(ticker));
        setIsLoading(false);
      }, 500);
    }
  }, [isOpen, ticker]);

  const handleLikePost = (postId: string) => {
    setCommunityPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  if (!isOpen || !ticker) return null;

  const isPositive = tickerData ? tickerData.change >= 0 : false;
  const borderColor = isPositive ? 'border-green-500/30' : 'border-red-500/30';
  const accentColor = isPositive ? 'text-green-400' : 'text-red-400';

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full sm:w-[480px] lg:w-[600px] z-[201] transition-transform duration-300",
        "bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/50",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <div className={cn(
            "sticky top-0 z-10 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 p-6",
            borderColor
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">${ticker}</h2>
                  <p className="text-slate-400 text-sm">{tickerData?.companyName}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {tickerData && (
              <div className="space-y-3">
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-bold text-white">
                    ${tickerData.price.toFixed(2)}
                  </span>
                  <div className={cn("flex items-center gap-1 text-lg font-semibold", accentColor)}>
                    {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    <span>{isPositive ? '+' : ''}${tickerData.change.toFixed(2)}</span>
                    <span>({isPositive ? '+' : ''}{tickerData.changePercent.toFixed(2)}%)</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="outline" className="text-slate-300 border-slate-600">
                    {tickerData.sector}
                  </Badge>
                  {tickerData.riskTags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-purple-500/30 text-purple-400">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                <span className="ml-3 text-slate-400">Loading analytics...</span>
              </div>
            ) : tickerData ? (
              <>
                {/* Live Sentiment Overview */}
                <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-white">
                      <Brain className="w-5 h-5 text-purple-400" />
                      Live Sentiment Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <SentimentDial value={tickerData.sentiment.overall} size="lg" />
                      <div className="flex-1 ml-6 space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">Bullish</span>
                            <span className="text-sm font-semibold text-green-400">
                              {tickerData.sentiment.bullish.toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={tickerData.sentiment.bullish} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">Bearish</span>
                            <span className="text-sm font-semibold text-red-400">
                              {tickerData.sentiment.bearish.toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={tickerData.sentiment.bearish} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">Neutral</span>
                            <span className="text-sm font-semibold text-yellow-400">
                              {tickerData.sentiment.neutral.toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={tickerData.sentiment.neutral} className="h-2" />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-slate-700" />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                        <div className="text-blue-400 font-semibold">
                          {tickerData.sentiment.sources.twitter.toFixed(0)}
                        </div>
                        <div className="text-xs text-slate-400">🐦 Twitter</div>
                      </div>
                      <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                        <div className="text-orange-400 font-semibold">
                          {tickerData.sentiment.sources.reddit.toFixed(0)}
                        </div>
                        <div className="text-xs text-slate-400">🧵 Reddit</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Summary */}
                <Card className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-purple-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-purple-300 mb-2">AI Market Summary</h3>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {tickerData.aiSummary}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Chart and Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Mini Chart */}
                  <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/40">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-white">Price Chart</CardTitle>
                        <div className="flex gap-1">
                          {(['1D', '7D', '1M'] as const).map((tf) => (
                            <Button
                              key={tf}
                              variant={chartTimeframe === tf ? "default" : "ghost"}
                              size="sm"
                              onClick={() => setChartTimeframe(tf)}
                              className="h-7 px-2 text-xs"
                            >
                              {tf}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <MiniChart
                        data={tickerData.chartData.timeframes[chartTimeframe]}
                        isPositive={isPositive}
                        timeframe={chartTimeframe}
                      />
                    </CardContent>
                  </Card>

                  {/* Ticker Stats */}
                  <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/40">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">Key Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Market Cap</span>
                          <div className="font-semibold text-white">{tickerData.marketCap}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Volume</span>
                          <div className="font-semibold text-white">
                            {(tickerData.volume / 1000000).toFixed(1)}M
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-400">Day High</span>
                          <div className="font-semibold text-white">${tickerData.dayHigh.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Day Low</span>
                          <div className="font-semibold text-white">${tickerData.dayLow.toFixed(2)}</div>
                        </div>
                        {tickerData.peRatio && (
                          <div>
                            <span className="text-slate-400">P/E Ratio</span>
                            <div className="font-semibold text-white">{tickerData.peRatio.toFixed(1)}</div>
                          </div>
                        )}
                        {tickerData.rsi && (
                          <div>
                            <span className="text-slate-400">RSI</span>
                            <div className={cn("font-semibold", 
                              tickerData.rsi > 70 ? "text-red-400" : 
                              tickerData.rsi < 30 ? "text-green-400" : "text-white"
                            )}>
                              {tickerData.rsi.toFixed(1)}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Community Posts */}
                <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-white">
                      <Users className="w-5 h-5 text-blue-400" />
                      Top Community Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {communityPosts.map((post) => (
                      <div key={post.id} className="p-4 bg-slate-700/30 rounded-lg space-y-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={post.user.avatar} />
                            <AvatarFallback>{post.user.username.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white text-sm">{post.user.username}</span>
                              {post.user.verified && (
                                <Badge variant="outline" className="text-xs px-1 py-0 border-blue-500/30 text-blue-400">
                                  ✓
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs px-1 py-0 border-purple-500/30 text-purple-400">
                                {post.user.credibilityScore}
                              </Badge>
                            </div>
                            <span className="text-xs text-slate-400">{post.timestamp}</span>
                          </div>
                          <Badge className={cn("text-xs", 
                            post.sentiment === 'Bullish' ? "bg-green-500/20 text-green-400 border-green-500/30" :
                            post.sentiment === 'Bearish' ? "bg-red-500/20 text-red-400 border-red-500/30" :
                            "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          )}>
                            {post.sentiment}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{post.content}</p>
                        <div className="flex items-center gap-4 pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikePost(post.id)}
                            className={cn("h-7 px-2 text-xs", 
                              post.isLiked ? "text-pink-400" : "text-slate-400 hover:text-pink-400"
                            )}
                          >
                            <Heart className={cn("w-3 h-3 mr-1", post.isLiked && "fill-current")} />
                            {post.likes}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-slate-400 hover:text-blue-400"
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {post.comments}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Call to Action */}
                <Card className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-slate-600/50">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Button
                        onClick={() => onAddToWatchlist?.(ticker)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Watchlist
                      </Button>
                      <Button
                        onClick={() => onSetAlert?.(ticker)}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        Set Alert
                      </Button>
                      <Button
                        onClick={() => onCreatePost?.(ticker)}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Post About ${ticker}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 mx-auto text-slate-500 mb-4" />
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Unable to load data</h3>
                <p className="text-slate-400">Please try again later</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
