import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Search,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Globe,
  Bell,
  ExternalLink,
  Plus,
  Activity,
  ChevronUp,
  ChevronDown,
  Minus,
  Calendar,
  DollarSign,
  PieChart,
  LineChart,
  AlertCircle
} from 'lucide-react';
import { useMoodTheme } from '../contexts/MoodThemeContext';
import { useStockSentiment } from '../hooks/useStockSentiment';
import { useCombinedBusinessNews } from '../hooks/useCombinedBusinessNews';
import { cn } from '../lib/utils';

interface MoodScore {
  overall: number;
  stocks: number;
  news: number;
  social: number;
  timestamp: Date;
}

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  volume: string;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  timestamp: Date;
  source: string;
}

interface MarketReaction {
  id: string;
  user: string;
  avatar: string;
  message: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  timestamp: Date;
  likes: number;
}

export const FinanceHomepage: React.FC = () => {
  const { setMoodScore } = useMoodTheme();
  const { data: stockSentiment } = useStockSentiment();
  const { articles: newsArticles } = useCombinedBusinessNews();
  const [activeTab, setActiveTab] = useState('Home');

  // Professional finance data
  const [moodScore] = useState<MoodScore>({
    overall: 72,
    stocks: 68,
    news: 75,
    social: 74,
    timestamp: new Date()
  });

  const [topStocks] = useState<StockData[]>([
    { symbol: 'TSLA', name: 'Tesla Inc', price: 248.50, change: -3.22, changePercent: -1.28, sentiment: 'bearish', volume: '45.2M' },
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 875.28, change: 12.45, changePercent: 1.44, sentiment: 'bullish', volume: '38.7M' },
    { symbol: 'AAPL', name: 'Apple Inc', price: 190.64, change: 2.18, changePercent: 1.16, sentiment: 'bullish', volume: '52.1M' },
    { symbol: 'GOOGL', name: 'Alphabet Inc', price: 139.69, change: 1.87, changePercent: 1.36, sentiment: 'bullish', volume: '28.9M' },
    { symbol: 'MSFT', name: 'Microsoft Corp', price: 378.85, change: -2.44, changePercent: -0.64, sentiment: 'neutral', volume: '31.4M' },
    { symbol: 'AMZN', name: 'Amazon.com Inc', price: 155.74, change: 4.12, changePercent: 2.72, sentiment: 'bullish', volume: '41.3M' },
    { symbol: 'META', name: 'Meta Platforms', price: 501.92, change: -8.33, changePercent: -1.63, sentiment: 'bearish', volume: '19.8M' },
    { symbol: 'JPM', name: 'JPMorgan Chase', price: 178.25, change: 1.95, changePercent: 1.11, sentiment: 'neutral', volume: '12.7M' },
    { symbol: 'V', name: 'Visa Inc', price: 267.89, change: 3.44, changePercent: 1.30, sentiment: 'bullish', volume: '6.8M' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', price: 156.33, change: -0.87, changePercent: -0.55, sentiment: 'neutral', volume: '8.9M' }
  ]);

  const [trendingTopics] = useState([
    { topic: 'Fed Interest Rates', sentiment: 'neutral', volume: '8.9K discussions' },
    { topic: 'Q4 Earnings', sentiment: 'bullish', volume: '12.5K discussions' },
    { topic: 'AI Revolution', sentiment: 'bullish', volume: '15.6K discussions' },
    { topic: 'Inflation Data', sentiment: 'neutral', volume: '7.2K discussions' },
    { topic: 'Tech Regulation', sentiment: 'bearish', volume: '5.8K discussions' }
  ]);

  const [marketReactions] = useState<MarketReaction[]>([
    {
      id: '1',
      user: 'Michael Chen',
      avatar: '/api/placeholder/32/32',
      message: 'Strong Q4 earnings across tech sector. AI momentum continuing into 2024.',
      sentiment: 'bullish',
      timestamp: new Date(Date.now() - 300000),
      likes: 47
    },
    {
      id: '2',
      user: 'Sarah Williams',
      avatar: '/api/placeholder/32/32',
      message: 'Fed policy uncertainty creating volatility in financials. Watching for guidance.',
      sentiment: 'neutral',
      timestamp: new Date(Date.now() - 900000),
      likes: 23
    },
    {
      id: '3',
      user: 'David Rodriguez',
      avatar: '/api/placeholder/32/32',
      message: 'Energy sector showing strength on supply concerns. Long-term outlook positive.',
      sentiment: 'bullish',
      timestamp: new Date(Date.now() - 1200000),
      likes: 31
    }
  ]);

  const [moodTrend] = useState([
    { day: 'Mon', score: 58 },
    { day: 'Tue', score: 62 },
    { day: 'Wed', score: 55 },
    { day: 'Thu', score: 68 },
    { day: 'Fri', score: 72 },
    { day: 'Sat', score: 69 },
    { day: 'Sun', score: 72 }
  ]);

  // Update mood context
  useEffect(() => {
    setMoodScore(moodScore);
  }, [moodScore, setMoodScore]);

  const getMoodLabel = (score: number) => {
    if (score >= 80) return 'Very Bullish';
    if (score >= 70) return 'Bullish';
    if (score >= 60) return 'Optimistic';
    if (score >= 50) return 'Neutral';
    if (score >= 40) return 'Cautious';
    if (score >= 30) return 'Bearish';
    return 'Very Bearish';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-amber-400';
    }
  };

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

  return (
    <div className="min-h-screen finance-gradient">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Nav */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-white">MoorMeter</h1>
              </div>
              
              <nav className="hidden md:flex items-center gap-6">
                {['Home', 'Market Mood', 'Watchlist', 'Economic Insights', 'Community'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveTab(item)}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      item === activeTab
                        ? "text-blue-400 border-b border-blue-400 pb-1"
                        : "text-slate-300 hover:text-white"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </div>

            {/* Search and User */}
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search tickers or keywords..."
                  className="pl-10 pr-4 w-80 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
              
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4 text-slate-300" />
                <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 bg-red-500 text-white text-xs">3</Badge>
              </Button>
              
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-slate-700 text-slate-300">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Hero Mood Score */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="sentiment-gauge">
                  <div className="sentiment-ring">
                    <div className="sentiment-inner">
                      <div className="text-4xl font-bold text-white mb-1">{moodScore.overall}</div>
                      <div className="text-sm text-blue-400 font-medium">{getMoodLabel(moodScore.overall)}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Today's sentiment suggests rising investor confidence led by strong tech earnings and positive economic indicators.
              </p>
              
              {/* Sentiment Breakdown */}
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-8">
                {[
                  { label: 'Stocks', value: moodScore.stocks, weight: '40%' },
                  { label: 'News', value: moodScore.news, weight: '30%' },
                  { label: 'Forums', value: moodScore.social, weight: '30%' }
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-1000"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-400">{item.label} {item.weight}</div>
                    <div className="text-sm text-white font-medium">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Stocks */}
            <Card className="finance-card border-0">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Top 10 Stocks Today
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-700/50">
                  {topStocks.map((stock, index) => (
                    <div key={stock.symbol} className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-400 w-6">{index + 1}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{stock.symbol}</span>
                            <Badge className={cn(
                              "text-xs px-2",
                              stock.sentiment === 'bullish' ? "bg-green-500/20 text-green-400" :
                              stock.sentiment === 'bearish' ? "bg-red-500/20 text-red-400" :
                              "bg-amber-500/20 text-amber-400"
                            )}>
                              {getSentimentIcon(stock.sentiment)}
                              {stock.sentiment}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-400">{stock.name}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-white font-medium">${stock.price}</div>
                        <div className={cn(
                          "text-sm font-medium",
                          stock.change >= 0 ? "text-green-400" : "text-red-400"
                        )}>
                          {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
                        </div>
                      </div>
                      
                      <div className="text-right text-xs text-slate-400">
                        Vol: {stock.volume}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mood Trend Chart */}
            <Card className="finance-card border-0">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="flex items-center gap-2 text-white">
                  <LineChart className="w-5 h-5 text-blue-400" />
                  7-Day Mood Trend
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-64 flex items-end justify-between gap-2">
                  {moodTrend.map((day, index) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-blue-500/60 to-blue-400/80 rounded-t transition-all duration-500 hover:from-blue-500/80"
                        style={{ height: `${day.score * 2.5}px` }}
                      />
                      <div className="text-xs text-slate-400 mt-2">{day.day}</div>
                      <div className="text-xs text-white">{day.score}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Smart News Feed */}
            <Card className="finance-card border-0">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Globe className="w-5 h-5 text-blue-400" />
                  Smart News Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { title: 'Federal Reserve Maintains Rate Pause Amid Economic Stability', summary: 'The Fed keeps rates steady as inflation shows signs of cooling while employment remains strong.', sentiment: 'neutral', source: 'Reuters' },
                    { title: 'Tech Giants Report Strong Q4 Earnings Driven by AI Innovation', summary: 'Major technology companies exceed expectations with AI-related revenue growth.', sentiment: 'bullish', source: 'Bloomberg' },
                    { title: 'Energy Sector Rallies on Supply Chain Concerns', summary: 'Oil and gas stocks surge amid geopolitical tensions affecting global supply.', sentiment: 'bullish', source: 'CNBC' }
                  ].map((news, index) => (
                    <div key={index} className="group p-4 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <Badge className={cn(
                          "mt-1 text-xs",
                          news.sentiment === 'bullish' ? "bg-green-500/20 text-green-400" :
                          news.sentiment === 'bearish' ? "bg-red-500/20 text-red-400" :
                          "bg-amber-500/20 text-amber-400"
                        )}>
                          {getSentimentIcon(news.sentiment)}
                        </Badge>
                        <div className="flex-1">
                          <h3 className="text-white font-medium mb-2 group-hover:text-blue-400 transition-colors">
                            {news.title}
                          </h3>
                          <p className="text-slate-400 text-sm mb-2">{news.summary}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">{news.source}</span>
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Reactions */}
            <Card className="finance-card border-0">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="w-5 h-5 text-blue-400" />
                  Market Reactions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {marketReactions.map((reaction) => (
                    <div key={reaction.id} className="flex items-start gap-3 p-4 rounded-lg border border-slate-700/50">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={reaction.avatar} />
                        <AvatarFallback className="bg-slate-700 text-slate-300 text-xs">
                          {reaction.user.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white">{reaction.user}</span>
                          <Badge className={cn(
                            "text-xs px-2",
                            reaction.sentiment === 'bullish' ? "bg-green-500/20 text-green-400" :
                            reaction.sentiment === 'bearish' ? "bg-red-500/20 text-red-400" :
                            "bg-amber-500/20 text-amber-400"
                          )}>
                            {getSentimentIcon(reaction.sentiment)}
                          </Badge>
                          <span className="text-xs text-slate-500">{formatTimeAgo(reaction.timestamp)}</span>
                        </div>
                        <p className="text-slate-300 text-sm mb-2">{reaction.message}</p>
                        <div className="flex items-center gap-2">
                          <button className="text-xs text-slate-500 hover:text-slate-400">
                            👍 {reaction.likes}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Personal Mood Score */}
            <Card className="finance-card border-0">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="text-white text-sm">Your Portfolio Mood</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-white mb-1">67</div>
                  <div className="text-sm text-amber-400">Calm Optimism</div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Ticker
                </Button>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="finance-card border-0">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="flex items-center gap-2 text-white text-sm">
                  <Activity className="w-4 h-4 text-blue-400" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between group hover:bg-slate-800/30 p-2 -m-2 rounded transition-colors">
                      <div className="flex items-center gap-3">
                        <Badge className={cn(
                          "w-2 h-2 p-0 rounded-full",
                          topic.sentiment === 'bullish' ? "bg-green-400" :
                          topic.sentiment === 'bearish' ? "bg-red-400" :
                          "bg-amber-400"
                        )} />
                        <span className="text-sm text-white group-hover:text-blue-400 transition-colors">
                          {topic.topic}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">{topic.volume.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Status */}
            <Card className="finance-card border-0">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="flex items-center gap-2 text-white text-sm">
                  <PieChart className="w-4 h-4 text-blue-400" />
                  Market Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">S&P 500</span>
                    <span className="text-sm text-green-400">+0.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">NASDAQ</span>
                    <span className="text-sm text-green-400">+1.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">DOW</span>
                    <span className="text-sm text-red-400">-0.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">VIX</span>
                    <span className="text-sm text-amber-400">14.2</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/60 px-6 py-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-6 mb-4 md:mb-0">
              <span className="text-slate-400 text-sm hover:text-white transition-colors cursor-pointer">About</span>
              <span className="text-slate-400 text-sm hover:text-white transition-colors cursor-pointer">API Access</span>
              <span className="text-slate-400 text-sm hover:text-white transition-colors cursor-pointer">Legal</span>
              <span className="text-slate-400 text-sm hover:text-white transition-colors cursor-pointer">Contact</span>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Mood Score API: ✅ Live
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
