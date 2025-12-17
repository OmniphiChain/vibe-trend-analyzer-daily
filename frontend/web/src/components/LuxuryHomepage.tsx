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
  Star,
  Users,
  Brain,
  Zap,
  ExternalLink,
  Plus,
  ArrowRight,
  Activity,
  Globe,
  MessageCircle,
  Bell
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
  sentiment: number;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  timestamp: Date;
  source: string;
}

interface CommunityReaction {
  id: string;
  user: string;
  avatar: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  message: string;
  moodEmoji: string;
  timestamp: Date;
}

export const LuxuryHomepage: React.FC = () => {
  const { setMoodScore } = useMoodTheme();
  const { data: stockSentiment } = useStockSentiment();
  const { articles: newsArticles } = useCombinedBusinessNews();

  // Mock data for luxury demo
  const [moodScore] = useState<MoodScore>({
    overall: 72,
    stocks: 68,
    news: 75,
    social: 74,
    timestamp: new Date()
  });

  const [topStocks] = useState<StockData[]>([
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 875.28, change: 12.45, changePercent: 1.44, sentiment: 85 },
    { symbol: 'TSLA', name: 'Tesla Inc', price: 248.50, change: -3.22, changePercent: -1.28, sentiment: 45 },
    { symbol: 'AAPL', name: 'Apple Inc', price: 190.64, change: 2.18, changePercent: 1.16, sentiment: 72 },
    { symbol: 'GOOGL', name: 'Alphabet Inc', price: 139.69, change: 1.87, changePercent: 1.36, sentiment: 78 }
  ]);

  const [trendingTopics] = useState([
    { topic: 'AI Revolution', sentiment: 'bullish', count: '12.5K' },
    { topic: 'Fed Meeting', sentiment: 'neutral', count: '8.9K' },
    { topic: 'Crypto Rally', sentiment: 'bullish', count: '15.6K' },
    { topic: 'Tech Earnings', sentiment: 'bullish', count: '7.2K' }
  ]);

  const [communityReactions] = useState<CommunityReaction[]>([
    {
      id: '1',
      user: 'Alex Chen',
      avatar: '/api/placeholder/40/40',
      sentiment: 'bullish',
      message: 'AI stocks absolutely crushing it today. The future is now. 🚀',
      moodEmoji: '🚀',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: '2',
      user: 'Sarah Kim',
      avatar: '/api/placeholder/40/40',
      sentiment: 'neutral',
      message: 'Market volatility creating interesting opportunities in defensive sectors.',
      moodEmoji: '🤔',
      timestamp: new Date(Date.now() - 900000)
    },
    {
      id: '3',
      user: 'Marcus Rodriguez',
      avatar: '/api/placeholder/40/40',
      sentiment: 'bullish',
      message: 'Breaking resistance levels across multiple sectors. Momentum building.',
      moodEmoji: '📈',
      timestamp: new Date(Date.now() - 1200000)
    }
  ]);

  const [moodTrend] = useState([
    { date: 'Mon', score: 58 },
    { date: 'Tue', score: 62 },
    { date: 'Wed', score: 55 },
    { date: 'Thu', score: 68 },
    { date: 'Fri', score: 72 }
  ]);

  // Update mood context
  useEffect(() => {
    setMoodScore(moodScore);
  }, [moodScore, setMoodScore]);

  const getMoodLabel = (score: number) => {
    if (score >= 80) return 'Euphoric';
    if (score >= 70) return 'Optimistic';
    if (score >= 60) return 'Positive';
    if (score >= 50) return 'Neutral';
    if (score >= 40) return 'Cautious';
    if (score >= 30) return 'Pessimistic';
    return 'Fearful';
  };

  const getMoodEmoji = (score: number) => {
    if (score >= 80) return '🚀';
    if (score >= 70) return '😊';
    if (score >= 60) return '📈';
    if (score >= 50) return '😐';
    if (score >= 40) return '📉';
    if (score >= 30) return '😕';
    return '😰';
  };

  const getSentimentColor = (sentiment: string | number) => {
    if (typeof sentiment === 'number') {
      if (sentiment >= 70) return 'text-green-400';
      if (sentiment >= 50) return 'text-yellow-400';
      return 'text-red-400';
    }
    switch (sentiment) {
      case 'bullish': return 'text-green-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  return (
    <div className="min-h-screen luxury-gradient">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/5 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        {/* Hero Section - Mood Score Display */}
        <section className="relative px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16" style={{ animation: 'emerge 1s ease-out' }}>
              <div className="inline-flex items-center gap-4 mb-8">
                <h1 className="text-6xl md:text-8xl font-light bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                  MoorMeter
                </h1>
                <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30 px-4 py-2 text-sm font-light">
                  AI-Powered
                </Badge>
              </div>
              
              <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto mb-16">
                Real-time market sentiment analysis powered by artificial intelligence
              </p>
            </div>

            {/* Mood Score Orb */}
            <div className="flex justify-center mb-16" style={{ animation: 'emerge 1.2s ease-out' }}>
              <div className="mood-orb relative">
                <div className="w-80 h-80 md:w-96 md:h-96 rounded-full glassmorphism luxury-glow flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-blue-400/10 animate-pulse" />
                  
                  {/* Mood Emoji */}
                  <div className="text-8xl mb-4 animate-float">
                    {getMoodEmoji(moodScore.overall)}
                  </div>
                  
                  {/* Mood Score */}
                  <div className="text-7xl md:text-8xl font-light text-white mb-2">
                    {moodScore.overall}
                  </div>
                  
                  {/* Mood Label */}
                  <div className="text-2xl text-yellow-300 font-light">
                    {getMoodLabel(moodScore.overall)}
                  </div>
                  
                  {/* Pulse rings */}
                  <div className="absolute inset-0 rounded-full border border-yellow-400/30 animate-ping" />
                  <div className="absolute inset-4 rounded-full border border-yellow-400/20 animate-ping delay-75" />
                </div>
              </div>
            </div>

            {/* Mood Breakdown */}
            <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto mb-20" style={{ animation: 'emerge 1.4s ease-out' }}>
              {[
                { label: 'Stocks', value: moodScore.stocks, weight: '40%', icon: TrendingUp },
                { label: 'News', value: moodScore.news, weight: '30%', icon: Globe },
                { label: 'Social', value: moodScore.social, weight: '30%', icon: MessageCircle }
              ].map((item, index) => (
                <Card key={item.label} className="luxury-card border-0">
                  <CardContent className="p-6 text-center">
                    <item.icon className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
                    <div className="text-3xl font-light text-white mb-1">{item.value}</div>
                    <div className="text-sm text-gray-400 mb-2">{item.label}</div>
                    <div className="text-xs text-yellow-400">{item.weight} weight</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Main Dashboard */}
        <section className="px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Top Stocks */}
                <Card className="luxury-card border-0" style={{ animation: 'emerge 1.6s ease-out' }}>
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="flex items-center gap-3 text-xl text-white font-light">
                      <BarChart3 className="w-6 h-6 text-yellow-400" />
                      Elite Stocks Today
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {topStocks.map((stock, index) => (
                        <div key={stock.symbol} className="group flex items-center justify-between p-4 rounded-xl glassmorphism hover:bg-white/5 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400/20 to-blue-400/20 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">{stock.symbol}</span>
                            </div>
                            <div>
                              <div className="text-white font-medium">{stock.name}</div>
                              <div className="text-sm text-gray-400">{stock.symbol}</div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-white font-medium">${stock.price}</div>
                            <div className={cn(
                              "text-sm font-medium flex items-center gap-1",
                              stock.change >= 0 ? "text-green-400" : "text-red-400"
                            )}>
                              {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                              {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
                            </div>
                          </div>
                          
                          <div className="w-16 h-16 rounded-full border-2 border-yellow-400/30 flex items-center justify-center relative">
                            <span className={cn("text-sm font-medium", getSentimentColor(stock.sentiment))}>
                              {stock.sentiment}
                            </span>
                            <div 
                              className="absolute inset-0 rounded-full border-2 border-yellow-400 opacity-30"
                              style={{ 
                                background: `conic-gradient(from 0deg, transparent 0deg, rgba(255, 215, 0, 0.3) ${stock.sentiment * 3.6}deg, transparent ${stock.sentiment * 3.6}deg)`
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Mood Chart */}
                <Card className="luxury-card border-0" style={{ animation: 'emerge 1.8s ease-out' }}>
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="flex items-center gap-3 text-xl text-white font-light">
                      <Activity className="w-6 h-6 text-yellow-400" />
                      Mood Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-64 flex items-end justify-between gap-4">
                      {moodTrend.map((day, index) => (
                        <div key={day.date} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-gradient-to-t from-yellow-400/60 to-yellow-400/20 rounded-t-lg transition-all duration-500 hover:from-yellow-400/80 hover:to-yellow-400/40"
                            style={{ height: `${day.score * 2.5}px` }}
                          />
                          <div className="text-sm text-gray-400 mt-2">{day.date}</div>
                          <div className="text-xs text-white">{day.score}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Smart News Feed */}
                <Card className="luxury-card border-0" style={{ animation: 'emerge 2s ease-out' }}>
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="flex items-center gap-3 text-xl text-white font-light">
                      <Globe className="w-6 h-6 text-yellow-400" />
                      Curated Intelligence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[
                        { title: 'AI Revolution Accelerates as Major Tech Giants Report Record Earnings', sentiment: 'bullish', source: 'Financial Times' },
                        { title: 'Federal Reserve Signals Potential Rate Adjustments in Q4', sentiment: 'neutral', source: 'Reuters' },
                        { title: 'Breakthrough in Quantum Computing Sends Tech Stocks Soaring', sentiment: 'bullish', source: 'Bloomberg' }
                      ].map((news, index) => (
                        <div key={index} className="group p-4 rounded-xl glassmorphism hover:bg-white/5 transition-all duration-300">
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "w-2 h-2 rounded-full mt-3 flex-shrink-0",
                              news.sentiment === 'bullish' ? 'bg-green-400' : 
                              news.sentiment === 'bearish' ? 'bg-red-400' : 'bg-yellow-400'
                            )} />
                            <div className="flex-1">
                              <h3 className="text-white font-medium group-hover:text-yellow-300 transition-colors">
                                {news.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-gray-400">{news.source}</span>
                                <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-8">
                
                {/* Personal Mood Score */}
                <Card className="luxury-card border-0" style={{ animation: 'emerge 1.6s ease-out' }}>
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="text-lg text-white font-light">Your Portfolio Mood</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-4xl font-light text-white mb-2">64</div>
                      <div className="text-sm text-yellow-400">Calm Optimism</div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 border border-yellow-400/30 text-yellow-300 hover:bg-yellow-400/30">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Ticker
                    </Button>
                  </CardContent>
                </Card>

                {/* Trending Topics */}
                <Card className="luxury-card border-0" style={{ animation: 'emerge 1.8s ease-out' }}>
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="flex items-center gap-3 text-lg text-white font-light">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      Trending Now
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {trendingTopics.map((topic, index) => (
                        <div key={index} className="flex items-center justify-between group hover:bg-white/5 p-2 rounded-lg transition-all">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              topic.sentiment === 'bullish' ? 'bg-green-400' : 
                              topic.sentiment === 'bearish' ? 'bg-red-400' : 'bg-yellow-400'
                            )} />
                            <span className="text-white text-sm group-hover:text-yellow-300 transition-colors">
                              {topic.topic}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">{topic.count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Community Reactions */}
                <Card className="luxury-card border-0" style={{ animation: 'emerge 2s ease-out' }}>
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="flex items-center gap-3 text-lg text-white font-light">
                      <Users className="w-5 h-5 text-yellow-400" />
                      Elite Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {communityReactions.map((reaction) => (
                        <div key={reaction.id} className="group p-4 rounded-xl glassmorphism hover:bg-white/5 transition-all duration-300">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={reaction.avatar} />
                              <AvatarFallback className="bg-yellow-400/20 text-yellow-300 text-xs">
                                {reaction.user.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-white">{reaction.user}</span>
                                <span className="text-lg">{reaction.moodEmoji}</span>
                              </div>
                              <p className="text-sm text-gray-300 leading-relaxed">{reaction.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black/20 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-8 mb-4 md:mb-0">
                <span className="text-yellow-400 font-light">About</span>
                <span className="text-gray-400 font-light">Terms</span>
                <span className="text-gray-400 font-light">Privacy</span>
                <span className="text-gray-400 font-light">Support</span>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  API Status: Stable ✅
                </Badge>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
