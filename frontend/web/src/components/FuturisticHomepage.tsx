import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useMoodTheme } from '../contexts/MoodThemeContext';
import {
    Search,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Bell,
  Settings,
  Brain,
  Moon,
  Plus,
  UserCircle,
  LogOut,
  LogIn,
  Flame,
  Newspaper,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Users,
  Menu,
  X,
  DollarSign,
  Filter,
  BookOpen,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DynamicThemeSelector from './DynamicThemeSelector';
import { cn } from '../lib/utils';
import { WatchlistContainerBlock } from './watchlist/WatchlistContainerBlock';
import { ChatInterface } from './moorMeter/ChatInterface';
import { SpaceSwitcherWidget } from './community/SpaceSwitcherWidget';
import { PrivateRoomsContainer } from './privateRooms/PrivateRoomsContainer';
import { SentimentHeatMap } from './moorMeter/SentimentHeatMap';
import { MoodTrendChart } from './moorMeter/MoodTrendChart';
import { SmartNewsFeed } from './SmartNewsFeed';
import { MarketMoodPage } from './MarketMoodPage';
import { AISentimentEngine } from './mood/AISentimentEngine';
import StockActivityDashboard from './StockActivityDashboard';
import EarningsCalendarDashboard from './EarningsCalendarDashboard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { AuthModal } from './auth/AuthModal';
import AdvancedStockScreener from './AdvancedStockScreener';
import StrategyProfiler from './StrategyProfiler';
import GeoSentimentMap from './finance/GeoSentimentMap';
import BasicScreener from './BasicScreener';
import { NeonSenseCryptoDashboard } from './crypto/NeonSenseCryptoDashboard';
import SmartTradeJournal from './SmartTradeJournal';
import CommunitySentimentPolls from './CommunitySentimentPolls';
import { DailyMoodRecap } from './builder/DailyMoodRecap';
import { EmojiIcon, IconText } from '../lib/iconUtils';






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
  trendData: number[];
}

interface TrendingTopic {
  topic: string;
  label: string;
  mentions: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  icon: string;
}

interface FuturisticHomepageProps {
  onNavigate?: (section: string) => void;
  initialSection?: string;
}

export const FuturisticHomepage: React.FC<FuturisticHomepageProps> = ({ onNavigate, initialSection }) => {
  const { setMoodScore, themeMode, cardBackground, borderColor } = useMoodTheme();
  const [activeSection, setActiveSection] = useState<'home' | 'market-mood' | 'watchlist' | 'news-feed' | 'community' | 'chat' | 'space' | 'rooms' | 'tool' | 'market' | 'crypto' | 'charts' | 'trending' | 'earnings' | 'finance' | 'screener' | 'trade-journal' | 'sentiment-polls'>(initialSection as any || 'home');
  const [activeToolSubtab, setActiveToolSubtab] = useState("Market");
  const [activeMarketSubtab, setActiveMarketSubtab] = useState("Tools");
  const [activeToolsSubtab, setActiveToolsSubtab] = useState("HeatMap");
  const [activeFinanceTab, setActiveFinanceTab] = useState("risk-analysis");
  const [selectedFinanceStock, setSelectedFinanceStock] = useState("AAPL");
  const [financeSearchQuery, setFinanceSearchQuery] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState<"1D" | "7D" | "30D">("7D");

  // Handle initialSection prop
  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection as any);
    }
  }, [initialSection]);

  // Core mood data
  const [moodScore] = useState<MoodScore>({
    overall: 72,
    stocks: 68,
    news: 75,
    social: 74,
    timestamp: new Date()
  });

  // Top 10 Movers data with logos and sentiment
  const [topMovers] = useState<StockData[]>([
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 875.28, change: 23.45, changePercent: 2.76, sentiment: 'bullish', trendData: [870, 872, 878, 875] },
    { symbol: 'TSLA', name: 'Tesla Inc', price: 248.50, change: -8.22, changePercent: -3.21, sentiment: 'bearish', trendData: [245, 247, 250, 248] },
    { symbol: 'AAPL', name: 'Apple Inc', price: 190.64, change: 4.12, changePercent: 2.21, sentiment: 'bullish', trendData: [192, 191, 189, 190] },
    { symbol: 'GOOGL', name: 'Alphabet Inc', price: 139.69, change: -2.87, changePercent: -2.02, sentiment: 'bearish', trendData: [142, 140, 138, 139] },
    { symbol: 'MSFT', name: 'Microsoft Corp', price: 378.85, change: 7.44, changePercent: 2.00, sentiment: 'bullish', trendData: [375, 377, 380, 378] },
    { symbol: 'AMZN', name: 'Amazon.com Inc', price: 155.74, change: -3.12, changePercent: -1.96, sentiment: 'bearish', trendData: [158, 156, 154, 155] }
  ]);

  const [trendingTopics] = useState<TrendingTopic[]>([
    { topic: '$NVDA', label: 'Hype', mentions: '2,847', sentiment: 'bullish', icon: '🚀' },
    { topic: '$TSLA', label: 'Panic', mentions: '1,923', sentiment: 'bearish', icon: '📉' },
    { topic: 'AI Revolution', label: 'Hype', mentions: '4,512', sentiment: 'bullish', icon: '🤖' },
    { topic: 'Fed Meeting', label: 'Neutral', mentions: '3,674', sentiment: 'neutral', icon: '🏛️' },
    { topic: '$BTC', label: 'Hype', mentions: '5,291', sentiment: 'bullish', icon: '₿' },
    { topic: 'Inflation Data', label: 'Neutral', mentions: '2,183', sentiment: 'neutral', icon: '���' }
  ]);

  const [moodTrendData] = useState([
    { date: 'Mon', score: 58, stocks: 55, news: 62, social: 57 },
    { date: 'Tue', score: 62, stocks: 58, news: 65, social: 63 },
    { date: 'Wed', score: 55, stocks: 52, news: 58, social: 55 },
    { date: 'Thu', score: 68, stocks: 65, news: 71, social: 68 },
    { date: 'Fri', score: 72, stocks: 68, news: 75, social: 74 },
    { date: 'Sat', score: 69, stocks: 66, news: 72, social: 70 },
    { date: 'Sun', score: 72, stocks: 69, news: 74, social: 73 }
  ]);

    const [smartNews] = useState([
    {
      headline: "Tech stocks rally as investors eye AI-driven growth",
      summary: "Major tech players saw gains amid optimism around AI earnings reports and continued innovation in artificial intelligence sectors.",
      sentiment: 'bullish' as const,
      source: "MarketWatch",
      timestamp: "2h ago"
    },
    {
      headline: "Federal Reserve signals pause in rate hikes",
      summary: "Fed commentary suggests a wait-and-see approach to further rate adjustments as officials monitor economic data.",
      sentiment: 'neutral' as const,
      source: "Reuters",
      timestamp: "4h ago"
    },
    {
      headline: "Tesla drops as deliveries fall short of analyst expectations",
      summary: "TSLA shares fell after quarterly delivery data missed estimates, raising concerns about electric vehicle demand.",
      sentiment: 'bearish' as const,
      source: "CNBC",
      timestamp: "1h ago"
    },
    {
      headline: "Consumer confidence rebounds in July",
      summary: "The latest index shows stronger than expected consumer sentiment, indicating economic resilience despite inflation concerns.",
      sentiment: 'bullish' as const,
      source: "Bloomberg",
      timestamp: "3h ago"
    },
    {
      headline: "China's economic data triggers global market caution",
      summary: "Weak export numbers from China created uncertainty across markets as investors assess global trade implications.",
      sentiment: 'bearish' as const,
      source: "Financial Times",
      timestamp: "5h ago"
    }
  ]);

  const [aiInsight] = useState({
    title: "Today's AI Market Insight",
    content: "Today's sentiment is driven by strong AI earnings momentum, with tech stocks leading the rally. The Fed's dovish stance is providing additional tailwinds for growth sectors.",
    confidence: 87,
    keyDrivers: ['AI Earnings', 'Fed Policy', 'Tech Rally']
  });

  const [userWatchlist] = useState([
    { symbol: 'NVDA', change: 2.76, mood: 'bullish' },
    { symbol: 'AAPL', change: 2.21, mood: 'bullish' },
    { symbol: 'GOOGL', change: -2.02, mood: 'bearish' }
  ]);

  // Update mood context
  useEffect(() => {
    setMoodScore(moodScore);
  }, [moodScore, setMoodScore]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-emerald-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-amber-400';
    }
  };

    const getSentimentBadge = (sentiment: string) => {
    const colors = {
      bullish: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      bearish: 'bg-red-500/20 text-red-400 border-red-500/30',
      neutral: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    };
    return colors[sentiment as keyof typeof colors];
  };

  // Dynamic sentiment-based mood scoring
  const getMoodSentiment = (score: number): 'positive' | 'neutral' | 'negative' => {
    if (score >= 70) return 'positive';
    if (score >= 40) return 'neutral';
    return 'negative';
  };

  const getSentimentEmoji = (sentiment: 'positive' | 'neutral' | 'negative'): string => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'neutral': return '😐';
      case 'negative': return '😢';
    }
  };

  const getSentimentGradient = (sentiment: 'positive' | 'neutral' | 'negative'): string => {
    switch (sentiment) {
      case 'positive': return 'from-emerald-500 via-green-400 via-cyan-400 to-emerald-500';
      case 'neutral': return 'from-gray-400 via-slate-300 via-purple-300 to-gray-400';
      case 'negative': return 'from-red-500 via-rose-400 via-purple-500 to-red-500';
    }
  };

  const getSentimentLabel = (sentiment: 'positive' | 'neutral' | 'negative'): string => {
    switch (sentiment) {
      case 'positive': return 'Market is Positive';
      case 'neutral': return 'Market is Neutral';
      case 'negative': return 'Market is Negative';
    }
  };

  const currentSentiment = getMoodSentiment(moodScore.overall);

  const getTrendingBadge = (label: string) => {
    switch (label) {
      case 'Hype': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Panic': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      themeMode === 'light'
        ? 'bg-white'
        : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
    }`}>
      {/* Ambient Background Effects - Only in Dark Mode */}
      {themeMode !== 'light' && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-violet-500/8 to-indigo-500/8 rounded-full blur-3xl animate-pulse delay-2000" />
          <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-gradient-to-r from-emerald-500/6 to-teal-500/6 rounded-full blur-3xl animate-pulse delay-3000" />
        </div>
      )}



            {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

                                        {activeSection === 'market-mood' ? (
          <MarketMoodPage />
        ) : activeSection === 'watchlist' ? (
          <WatchlistContainerBlock />
        ) : activeSection === 'finance' ? (
          <div className="space-y-8">
            {/* Finance Hub Header with Search */}
            <div className={`rounded-2xl p-6 mb-8 ${
              themeMode === 'light'
                ? 'enhanced-card-light border border-[#E6E6E6]'
                : 'bg-black/80 backdrop-blur-xl border border-purple-500/20'
            }`}>
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg ${
                    themeMode === 'light'
                      ? 'bg-gradient-to-r from-[#388E3C]/20 to-[#00796B]/20 shadow-[#388E3C]/20'
                      : 'bg-gradient-to-r from-green-500/20 to-purple-500/20 shadow-green-500/20'
                  }`}>
                    <span className="text-3xl">💰</span>
                  </div>
                  <h1 className={`text-4xl font-bold ${
                    themeMode === 'light'
                      ? 'text-[#1A1A1A]'
                      : 'bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent'
                  }`}>
                    Finance Hub
                  </h1>
                </div>
                <p className={`text-xl max-w-2xl mx-auto mb-6 ${
                  themeMode === 'light' ? 'text-[#4B5563]' : 'text-gray-300'
                }`}>
                  Advanced financial tools and analytics for portfolio management
                </p>
              </div>

              {/* Stock Search Bar */}
              <div className="max-w-md mx-auto mb-6">
                <div className="relative">
                  <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    themeMode === 'light' ? 'text-[#9CA3AF]' : 'text-gray-400'
                  }`} />
                  <Input
                    type="text"
                    placeholder="Search stock ticker (e.g., AAPL, TSLA, NVDA)..."
                    value={financeSearchQuery}
                    onChange={(e) => setFinanceSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && financeSearchQuery.trim()) {
                        setSelectedFinanceStock(financeSearchQuery.toUpperCase().trim());
                        setFinanceSearchQuery('');
                      }
                    }}
                    className={`pl-12 pr-20 py-4 rounded-xl text-lg focus:ring-0 focus:outline-none ${
                      themeMode === 'light'
                        ? 'bg-white border-[#E6E6E6] text-[#1A1A1A] placeholder-[#888] focus:bg-white focus:border-[#3A7AFE]/50'
                        : 'bg-black/40 border-purple-500/30 text-white placeholder-gray-400 focus:bg-black/60 focus:border-blue-400/50 backdrop-blur-sm'
                    }`}
                  />
                  <Button
                    onClick={() => {
                      if (financeSearchQuery.trim()) {
                        setSelectedFinanceStock(financeSearchQuery.toUpperCase().trim());
                        setFinanceSearchQuery('');
                      }
                    }}
                    className={themeMode === 'light'
                      ? "absolute right-2 top-1/2 transform -translate-y-1/2 ai-analysis-btn-light hover:opacity-90 px-4 py-2 rounded-lg"
                      : "absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg"
                    }
                  >
                    Search
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className={`text-sm ${themeMode === 'light' ? 'text-[#9CA3AF]' : 'text-gray-400'}`}>Currently analyzing:</span>
                  <Badge className={themeMode === 'light'
                    ? "bg-[rgba(58,122,254,0.1)] text-[#3A7AFE] border-[#3A7AFE]/30 font-semibold"
                    : "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-blue-500/30 font-semibold drop-shadow-md"
                  }>
                    ${selectedFinanceStock}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Finance Tabs */}
            <div className="relative z-30">
              <Tabs value={activeFinanceTab} onValueChange={setActiveFinanceTab}>
              <TabsList className={`grid w-full grid-cols-3 max-w-lg mx-auto ${
                themeMode === 'light'
                  ? 'bg-[#F5F5F5] border border-[#E6E6E6]'
                  : 'bg-[#2C2F4A]/80 backdrop-blur-xl border border-gray-600/30 shadow-lg'
              }`}>
                <TabsTrigger
                  value="risk-analysis"
                  className={themeMode === 'light'
                    ? "data-[state=active]:text-[#1A1A1A] data-[state=active]:font-semibold data-[state=active]:border data-[state=active]:border-[#E6E6E6] text-[#4B5563] flex items-center gap-2"
                    : "data-[state=active]:text-white text-[#E0E0E0] flex items-center gap-2 transition-all duration-300 hover:text-white/90"
                  }
                  style={themeMode === 'light' ? {
                    '--active-bg': 'linear-gradient(90deg, #D2E3FC 0%, #B6D7FB 100%)',
                    '--active-shadow': '0 2px 4px rgba(0, 0, 0, 0.05)'
                  } : {
                    '--active-bg': 'linear-gradient(to right, #2196F3, #3F51B5)',
                    '--active-shadow': '0 4px 12px rgba(33, 150, 243, 0.3)'
                  }}
                >
                  📊 Risk Analysis
                </TabsTrigger>
                <TabsTrigger
                  value="financial-reports"
                  className={themeMode === 'light'
                    ? "data-[state=active]:text-[#1A1A1A] data-[state=active]:font-semibold data-[state=active]:border data-[state=active]:border-[#E6E6E6] text-[#4B5563] flex items-center gap-2"
                    : "data-[state=active]:text-white text-[#E0E0E0] flex items-center gap-2 transition-all duration-300 hover:text-white/90"
                  }
                  style={themeMode === 'light' ? {
                    '--active-bg': 'linear-gradient(90deg, #D2E3FC 0%, #B6D7FB 100%)',
                    '--active-shadow': '0 2px 4px rgba(0, 0, 0, 0.05)'
                  } : {
                    '--active-bg': 'linear-gradient(to right, #9C27B0, #673AB7)',
                    '--active-shadow': '0 4px 12px rgba(156, 39, 176, 0.3)'
                  }}
                >
                  📁 Financial Reports
                </TabsTrigger>
                <TabsTrigger
                  value="geo-sentiment"
                  className={themeMode === 'light'
                    ? "data-[state=active]:text-[#1A1A1A] data-[state=active]:font-semibold data-[state=active]:border data-[state=active]:border-[#E6E6E6] text-[#4B5563] flex items-center gap-2"
                    : "data-[state=active]:text-white text-[#E0E0E0] flex items-center gap-2 transition-all duration-300 hover:text-white/90"
                  }
                  style={themeMode === 'light' ? {
                    '--active-bg': 'linear-gradient(90deg, #D2E3FC 0%, #B6D7FB 100%)',
                    '--active-shadow': '0 2px 4px rgba(0, 0, 0, 0.05)'
                  } : {
                    '--active-bg': 'linear-gradient(to right, #4CAF50, #3F51B5)',
                    '--active-shadow': '0 4px 12px rgba(76, 175, 80, 0.3)'
                  }}
                  data-active-style="background: var(--active-bg); box-shadow: var(--active-shadow);"
                >
                  🌍 Geo-Sentiment
                </TabsTrigger>
              </TabsList>

              {/* Risk Analysis Tab */}
              <TabsContent value="risk-analysis" className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Sentiment Risk Meter */}
                  <Card className={themeMode === 'light'
                    ? "enhanced-card-light widget-mood"
                    : "bg-black/40 border-blue-500/20 backdrop-blur-xl"
                  }>
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 ${
                        themeMode === 'light' ? 'text-[#388E3C]' : 'text-white'
                      }`}>
                        🎯 Sentiment Risk Meter
                        <Badge className={`ml-auto ${
                          themeMode === 'light'
                            ? 'bg-[#E8F8F4] text-[#22AB94] border-[#22AB94]/30'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}>
                          ${selectedFinanceStock}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-8">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <div className={`absolute inset-0 rounded-full p-1 animate-pulse ${
                          themeMode === 'light'
                            ? 'mood-gauge-light'
                            : 'bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-green-500/20'
                        }`}>
                          <div className={`w-full h-full rounded-full ${
                            themeMode === 'light'
                              ? 'bg-white'
                              : 'bg-gradient-to-br from-slate-900/90 to-blue-900/90'
                          }`} />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${
                              themeMode === 'light'
                                ? selectedFinanceStock === 'TSLA' ? 'text-[#F44336]' :
                                  selectedFinanceStock === 'NVDA' ? 'text-[#4CAF50]' :
                                  'text-[#FFB300]'
                                : selectedFinanceStock === 'TSLA' ? 'text-red-400' :
                                  selectedFinanceStock === 'NVDA' ? 'text-green-400' :
                                  'text-yellow-400'
                            }`}>
                              {selectedFinanceStock === 'TSLA' ? 'HIGH' :
                               selectedFinanceStock === 'NVDA' ? 'LOW' :
                               'MEDIUM'}
                            </div>
                            <div className={`text-sm ${themeMode === 'light' ? 'text-[#9CA3AF]' : 'text-gray-400'}`}>Risk Level</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className={themeMode === 'light' ? 'text-[#4CAF50]' : 'text-green-400'}>Low</span>
                          <span className={themeMode === 'light' ? 'text-[#FFB300]' : 'text-yellow-400'}>Medium</span>
                          <span className={themeMode === 'light' ? 'text-[#F44336]' : 'text-red-400'}>High</span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${
                          themeMode === 'light' ? 'bg-[#E6E6E6]' : 'bg-gray-700'
                        }`}>
                          <div className={`h-full transition-all duration-1000 ${
                            selectedFinanceStock === 'TSLA' ? 'w-5/6 bg-gradient-to-r from-yellow-400 to-red-400' :
                            selectedFinanceStock === 'NVDA' ? 'w-1/4 bg-gradient-to-r from-green-400 to-green-500' :
                            'w-3/5 bg-gradient-to-r from-green-400 to-yellow-400'
                          }`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Risk Grade Card */}
                  <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-blue-400" aria-hidden="true" /> AI Risk Grade
                        <Badge className="ml-auto bg-blue-500/20 text-blue-300 border-blue-500/30">
                          ${selectedFinanceStock}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-8">
                      <div className={`text-6xl font-bold mb-2 ${
                        selectedFinanceStock === 'TSLA' ? 'text-red-400' :
                        selectedFinanceStock === 'NVDA' ? 'text-green-400' :
                        selectedFinanceStock === 'GOOGL' ? 'text-yellow-400' :
                        'text-blue-400'
                      }`}>
                        {selectedFinanceStock === 'TSLA' ? 'C-' :
                         selectedFinanceStock === 'NVDA' ? 'A+' :
                         selectedFinanceStock === 'GOOGL' ? 'B' :
                         'B+'}
                      </div>
                      <div className="text-lg text-white mb-4">
                        {selectedFinanceStock === 'TSLA' ? 'High Risk' :
                         selectedFinanceStock === 'NVDA' ? 'Low Risk' :
                         'Moderate Risk'}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Beta</span>
                          <span className="text-blue-400">
                            {selectedFinanceStock === 'TSLA' ? '2.18' :
                             selectedFinanceStock === 'NVDA' ? '1.68' :
                             selectedFinanceStock === 'GOOGL' ? '1.05' :
                             '1.24'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Volume Spike</span>
                          <span className={selectedFinanceStock === 'TSLA' ? 'text-red-400' : 'text-yellow-400'}>
                            {selectedFinanceStock === 'TSLA' ? '+45%' :
                             selectedFinanceStock === 'NVDA' ? '+8%' :
                             '+15%'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Sentiment Shift</span>
                          <span className={selectedFinanceStock === 'TSLA' ? 'text-red-400' : 'text-green-400'}>
                            {selectedFinanceStock === 'TSLA' ? 'Declining' : 'Stable'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Volatility Forecast */}
                  <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        📈 Volatility Forecast
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-6">
                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-orange-400">+18.5%</div>
                        <div className="text-sm text-gray-400">7-Day Predicted Volatility</div>
                      </div>
                      <div className="h-24 bg-gradient-to-r from-blue-500/10 to-orange-500/10 rounded-lg flex items-end justify-center p-2">
                        <div className="flex items-end gap-1 h-full">
                          {[12, 15, 18, 22, 19, 16, 14].map((height, i) => (
                            <div
                              key={i}
                              className="bg-gradient-to-t from-blue-400 to-orange-400 w-3 rounded-sm"
                              style={{ height: `${height * 3}px` }}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Risk Heatmap */}
                  <Card className="lg:col-span-2 bg-black/40 border-blue-500/20 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        ⚠️ Sector Risk Heatmap
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { name: 'Tech', risk: 'high', color: 'bg-red-500/30 border-red-500/50' },
                          { name: 'Finance', risk: 'medium', color: 'bg-yellow-500/30 border-yellow-500/50' },
                          { name: 'Healthcare', risk: 'low', color: 'bg-green-500/30 border-green-500/50' },
                          { name: 'Energy', risk: 'high', color: 'bg-red-500/30 border-red-500/50' },
                          { name: 'Consumer', risk: 'medium', color: 'bg-yellow-500/30 border-yellow-500/50' },
                          { name: 'Industrial', risk: 'low', color: 'bg-green-500/30 border-green-500/50' },
                          { name: 'Utilities', risk: 'low', color: 'bg-green-500/30 border-green-500/50' },
                          { name: 'Materials', risk: 'medium', color: 'bg-yellow-500/30 border-yellow-500/50' }
                        ].map((sector, i) => (
                          <div key={i} className={`${sector.color} rounded-lg p-3 border text-center`}>
                            <div className="text-white font-medium">{sector.name}</div>
                            <div className="text-xs text-gray-300 capitalize">{sector.risk}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Live Risk Alerts */}
                  <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        🚨 Live Risk Alerts
                        <Badge className="ml-auto bg-blue-500/20 text-blue-300 border-blue-500/30">
                          ${selectedFinanceStock}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          {
                            alert: `$${selectedFinanceStock} ${selectedFinanceStock === 'TSLA' ? 'moved into High Risk Zone' : selectedFinanceStock === 'NVDA' ? 'showing strong momentum' : 'volatility detected'}`,
                            icon: selectedFinanceStock === 'TSLA' ? '📉' : selectedFinanceStock === 'NVDA' ? '🚀' : '⚠️',
                            time: '2m ago',
                            type: selectedFinanceStock === 'TSLA' ? 'danger' : 'info'
                          },
                          { alert: 'VIX spike detected', icon: '⚠️', time: '5m ago', type: 'warning' },
                          {
                            alert: `${selectedFinanceStock === 'NVDA' ? 'AI sector' : selectedFinanceStock === 'TSLA' ? 'EV sector' : 'Tech sector'} volatility increased`,
                            icon: '⚠️',
                            time: '8m ago',
                            type: 'warning'
                          },
                          { alert: 'Bond yields rising rapidly', icon: '📊', time: '12m ago', type: 'info' }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                            <EmojiIcon emoji={item.icon} className="w-4 h-4" />
                            <div className="flex-1">
                              <div className="text-sm text-white">{item.alert}</div>
                              <div className="text-xs text-gray-400">{item.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Financial Reports Tab */}
              <TabsContent value="financial-reports" className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Smart Earnings Summary */}
                  <Card className="bg-gradient-to-br from-purple-900/80 to-slate-900/80 border-purple-500/30 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm">🧠</span>
                        </div>
                        <CardTitle className="text-white text-lg">Smart Earnings Summary</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-sm text-purple-200 font-medium">
                          NVDA Q3 2024
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          NVIDIA exceeded expectations with EPS of $5.16 vs $4.64 expected, driven by strong
                          data center revenue growth of 279% YoY. Management raised guidance significantly,
                          citing continued AI demand momentum.
                        </p>
                        <div className="grid grid-cols-3 gap-4 pt-2">
                          <div className="text-center">
                            <div className="text-green-400 font-bold text-lg">$5.16</div>
                            <div className="text-xs text-gray-400">EPS Actual</div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-300 font-bold text-lg">$4.64</div>
                            <div className="text-xs text-gray-400">EPS Expected</div>
                          </div>
                          <div className="text-center">
                            <div className="text-green-400 font-bold text-lg">+11.2%</div>
                            <div className="text-xs text-gray-400">Beat</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Earnings Snapshot */}
                  <Card className="bg-gradient-to-br from-slate-900/80 to-purple-900/80 border-slate-500/30 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm">📊</span>
                        </div>
                        <CardTitle className="text-white text-lg">Earnings Snapshot</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { symbol: 'AAPL', eps: '+2.1%', rev: '+5.4%', status: 'Raised', statusColor: 'text-green-400' },
                          { symbol: 'GOOGL', eps: '-1.8%', rev: '+1.2%', status: 'Maintained', statusColor: 'text-gray-400' },
                          { symbol: 'MSFT', eps: '+4.3%', rev: '+7.1%', status: 'Raised', statusColor: 'text-green-400' },
                          { symbol: 'TSLA', eps: '-3.4%', rev: '-2.1%', status: 'Lowered', statusColor: 'text-red-400' }
                        ].map((item) => (
                          <div key={item.symbol} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg">
                            <div className="font-bold text-white">{item.symbol}</div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="text-center">
                                <div className={item.eps.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                                  EPS {item.eps}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className={item.rev.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                                  Rev {item.rev}
                                </div>
                              </div>
                              <div className={`text-center px-2 py-1 rounded text-xs ${item.statusColor}`}>
                                {item.status}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Mood vs. Earnings Timeline */}
                <Card className="bg-gradient-to-br from-slate-900/80 to-purple-900/80 border-slate-500/30 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm">📈</span>
                      </div>
                      <CardTitle className="text-white text-lg">Mood vs. Earnings Timeline</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-end h-40 px-4">
                      {[
                        { quarter: 'Q1', mood: 65, earnings: 85, moodColor: 'bg-green-500', earningsColor: 'bg-blue-500' },
                        { quarter: 'Q2', mood: 72, earnings: 90, moodColor: 'bg-green-500', earningsColor: 'bg-green-500' },
                        { quarter: 'Q3', mood: 58, earnings: 75, moodColor: 'bg-orange-500', earningsColor: 'bg-orange-500' },
                        { quarter: 'Q4', mood: 78, earnings: 95, moodColor: 'bg-green-500', earningsColor: 'bg-green-500' },
                        { quarter: 'Q1', mood: 68, earnings: 82, moodColor: 'bg-gray-500', earningsColor: 'bg-gray-500' }
                      ].map((item, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                          <div className="flex items-end gap-1 h-24">
                            <div
                              className={`w-3 ${item.moodColor} rounded-t`}
                              style={{ height: `${item.mood}%` }}
                            />
                            <div
                              className={`w-3 ${item.earningsColor} rounded-t`}
                              style={{ height: `${item.earnings}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-400">{item.quarter}</div>
                          <div className="text-xs text-white font-medium">{item.mood}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-700/50">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-xs text-gray-400">Mood</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-xs text-gray-400">Miss</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Geo-Sentiment Tab */}
              <TabsContent value="geo-sentiment" className="mt-8">
                <GeoSentimentMap />
              </TabsContent>
              </Tabs>
            </div>
          </div>
        ) : activeSection === 'crypto' ? (
          <div className="space-y-8">
            {/* Header: Pulse of the Chain */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500/20 via-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 animate-pulse">
                  <span className="text-4xl">⚡</span>
                </div>
                <div className="text-center">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                    Pulse of the Chain
                  </h1>
                  <p className="text-lg text-gray-300">Real-time crypto market sentiment & AI insights</p>
                </div>
              </div>
            </div>

            {/* Hero: Crypto Mood Score */}
            <div className="text-center mb-16">
              <div className="relative inline-block mb-8">
                <div className="w-80 h-80 rounded-full relative">
                  {/* Animated gradient ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-yellow-400 via-green-400 to-orange-500 p-2 animate-spin-slow">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-sm" />
                  </div>

                  {/* Fixed content */}
                  <div className="absolute inset-2 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl mb-4 animate-bounce">😃</div>
                      <div className="text-7xl font-bold bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400 bg-clip-text text-transparent mb-2">
                        78
                      </div>
                      <div className="text-xl font-bold text-white mb-1">Crypto Mood</div>
                      <div className="text-sm text-orange-300 uppercase tracking-wider">BULLISH SENTIMENT</div>
                    </div>
                  </div>

                  {/* Pulse rings */}
                  <div className="absolute inset-0 rounded-full border-2 animate-ping border-orange-400/40" />
                  <div className="absolute inset-2 rounded-full border animate-ping delay-75 border-yellow-400/30" />
                  <div className="absolute inset-4 rounded-full border animate-ping delay-150 border-green-400/20" />
                </div>
              </div>

              <p className="text-lg text-gray-200 max-w-3xl mx-auto mb-8">
                AI-powered sentiment analysis combining price momentum (40%), news sentiment (30%), and social buzz (30%)
              </p>

              {/* Mood Source Breakdown */}
              <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  { label: 'Price Momentum', value: 82, percentage: '40%', color: 'from-orange-500 to-red-500', icon: '📈' },
                  { label: 'News Sentiment', value: 75, percentage: '30%', color: 'from-yellow-500 to-orange-500', icon: '📰' },
                  { label: 'Social Buzz', value: 71, percentage: '30%', color: 'from-green-500 to-yellow-500', icon: '💬' }
                ].map((item) => (
                  <div key={item.label} className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <div className="text-2xl font-bold text-white mb-2">{item.value}</div>
                    <div className="text-gray-300 font-medium mb-1">{item.label}</div>
                    <div className="text-sm text-gray-400 mb-3">{item.percentage} weight</div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Movers Section */}
            <Card className="bg-black/40 border-orange-500/20 backdrop-blur-xl">
              <CardHeader className="border-b border-orange-500/20">
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                  Top Movers & Sentiment Leaders
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="bullish" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-xl border border-gray-700/50">
                    <TabsTrigger value="bullish" className="data-[state=active]:bg-green-600/30 data-[state=active]:text-green-300 text-gray-400">
                      <span className="inline-flex items-center gap-2"><EmojiIcon emoji="🟢" className="w-4 h-4" />Top Bullish</span>
                    </TabsTrigger>
                    <TabsTrigger value="bearish" className="data-[state=active]:bg-red-600/30 data-[state=active]:text-red-300 text-gray-400">
                      🔴 Top Bearish
                    </TabsTrigger>
                    <TabsTrigger value="gainers" className="data-[state=active]:bg-emerald-600/30 data-[state=active]:text-emerald-300 text-gray-400">
                      📈 Biggest Gainers
                    </TabsTrigger>
                    <TabsTrigger value="losers" className="data-[state=active]:bg-rose-600/30 data-[state=active]:text-rose-300 text-gray-400">
                      📉 Biggest Losers
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="bullish" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { symbol: 'BTC', name: 'Bitcoin', price: '$67,234', change: '+2.34%', sentiment: 95, mentions: '12.4K', icon: '₿' },
                        { symbol: 'SOL', name: 'Solana', price: '$156.78', change: '+8.45%', sentiment: 89, mentions: '8.2K', icon: '◎' },
                        { symbol: 'ADA', name: 'Cardano', price: '$0.58', change: '+5.21%', sentiment: 84, mentions: '5.1K', icon: '₳' }
                      ].map((token) => (
                        <div key={token.symbol} className="bg-gradient-to-br from-black/60 to-green-900/20 rounded-xl p-4 border border-green-500/20 hover:border-green-400/40 transition-all duration-300 group cursor-pointer">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl"><IconText value={token.icon} /></span>
                              <div>
                                <div className="text-lg font-bold text-white">{token.symbol}</div>
                                <div className="text-sm text-gray-400">{token.name}</div>
                              </div>
                            </div>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              {token.sentiment.toFixed(2)}% 😃
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xl font-bold text-white">{token.price}</span>
                              <span className="text-green-400 font-medium flex items-center gap-1">
                                <ArrowUp className="w-4 h-4" />
                                {token.change}
                              </span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-1000" style={{ width: `${token.sentiment}%` }} />
                            </div>
                            <div className="text-xs text-gray-400 text-center">{token.mentions} mentions</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="bearish" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { symbol: 'DOGE', name: 'Dogecoin', price: '$0.08', change: '-4.12%', sentiment: 25, mentions: '15.7K', icon: 'Ð' },
                        { symbol: 'XRP', name: 'Ripple', price: '$0.52', change: '-2.87%', sentiment: 31, mentions: '9.3K', icon: '◉' },
                        { symbol: 'DOT', name: 'Polkadot', price: '$7.42', change: '-1.95%', sentiment: 38, mentions: '4.8K', icon: '●' }
                      ].map((token) => (
                        <div key={token.symbol} className="bg-gradient-to-br from-black/60 to-red-900/20 rounded-xl p-4 border border-red-500/20 hover:border-red-400/40 transition-all duration-300 group cursor-pointer">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl"><IconText value={token.icon} /></span>
                              <div>
                                <div className="text-lg font-bold text-white">{token.symbol}</div>
                                <div className="text-sm text-gray-400">{token.name}</div>
                              </div>
                            </div>
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                              {token.sentiment.toFixed(2)}% 😡
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xl font-bold text-white">{token.price}</span>
                              <span className="text-red-400 font-medium flex items-center gap-1">
                                <ArrowDown className="w-4 h-4" />
                                {token.change}
                              </span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-red-400 to-rose-400 transition-all duration-1000" style={{ width: `${token.sentiment}%` }} />
                            </div>
                            <div className="text-xs text-gray-400 text-center">{token.mentions} mentions</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="gainers" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { symbol: 'MATIC', name: 'Polygon', price: '$0.89', change: '+15.67%', sentiment: 72, mentions: '6.2K', icon: '⬟' },
                        { symbol: 'AVAX', name: 'Avalanche', price: '$38.45', change: '+12.34%', sentiment: 68, mentions: '4.9K', icon: '🔺' },
                        { symbol: 'ATOM', name: 'Cosmos', price: '$12.67', change: '+9.87%', sentiment: 65, mentions: '3.1K', icon: '⚛' }
                      ].map((token) => (
                        <div key={token.symbol} className="bg-gradient-to-br from-black/60 to-emerald-900/20 rounded-xl p-4 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 group cursor-pointer">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl"><IconText value={token.icon} /></span>
                              <div>
                                <div className="text-lg font-bold text-white">{token.symbol}</div>
                                <div className="text-sm text-gray-400">{token.name}</div>
                              </div>
                            </div>
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                              📈 {token.change}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xl font-bold text-white">{token.price}</span>
                              <span className="text-emerald-400 font-medium">Sentiment: {token.sentiment.toFixed(2)}%</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-emerald-400 to-green-400 transition-all duration-1000" style={{ width: `${token.sentiment}%` }} />
                            </div>
                            <div className="text-xs text-gray-400 text-center">{token.mentions} mentions</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="losers" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { symbol: 'LTC', name: 'Litecoin', price: '$73.21', change: '-8.45%', sentiment: 42, mentions: '2.8K', icon: 'Ł' },
                        { symbol: 'BCH', name: 'Bitcoin Cash', price: '$145.67', change: '-6.32%', sentiment: 38, mentions: '1.9K', icon: 'Ƀ' },
                        { symbol: 'ETC', name: 'Ethereum Classic', price: '$26.78', change: '-5.21%', sentiment: 35, mentions: '1.2K', icon: 'Ξ' }
                      ].map((token) => (
                        <div key={token.symbol} className="bg-gradient-to-br from-black/60 to-rose-900/20 rounded-xl p-4 border border-rose-500/20 hover:border-rose-400/40 transition-all duration-300 group cursor-pointer">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl"><IconText value={token.icon} /></span>
                              <div>
                                <div className="text-lg font-bold text-white">{token.symbol}</div>
                                <div className="text-sm text-gray-400">{token.name}</div>
                              </div>
                            </div>
                            <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30">
                              <ArrowDown className="w-3 h-3 mr-1 inline-block" /> {token.change}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xl font-bold text-white">{token.price}</span>
                              <span className="text-rose-400 font-medium">Sentiment: {token.sentiment.toFixed(2)}%</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-rose-400 to-red-400 transition-all duration-1000" style={{ width: `${token.sentiment}%` }} />
                            </div>
                            <div className="text-xs text-gray-400 text-center">{token.mentions} mentions</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Top 10 Cryptocurrencies by Market Cap */}
            <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
              <CardHeader className="border-b border-cyan-500/20">
                <CardTitle className="text-white flex items-center gap-2">
                  <span className="text-2xl">👑</span>
                  Top 10 Cryptocurrencies by Market Cap
                  <div className="ml-auto">
                    <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 animate-pulse">
                      Live Rankings
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {[
                    { rank: 1, symbol: 'BTC', name: 'Bitcoin', price: '$67,234.56', change: '+2.34%', marketCap: '$1.31T', icon: '₿', changeColor: 'text-green-400', trendData: [65, 67, 66, 68, 67], glow: 'shadow-lg shadow-orange-500/20' },
                    { rank: 2, symbol: 'ETH', name: 'Ethereum', price: '$2,657.89', change: '-1.23%', marketCap: '$319.2B', icon: 'Ξ', changeColor: 'text-red-400', trendData: [27, 26, 28, 26, 27], glow: 'shadow-lg shadow-blue-500/20' },
                    { rank: 3, symbol: 'USDT', name: 'Tether USDt', price: '$1.0001', change: '+0.01%', marketCap: '$118.4B', icon: '₮', changeColor: 'text-green-400', trendData: [1, 1, 1, 1, 1], glow: 'shadow-lg shadow-green-500/20' },
                    { rank: 4, symbol: 'BNB', name: 'BNB', price: '$312.45', change: '+4.67%', marketCap: '$48.2B', icon: '⬡', changeColor: 'text-green-400', trendData: [310, 315, 312, 318, 312], glow: 'shadow-lg shadow-yellow-500/20' },
                    { rank: 5, symbol: 'SOL', name: 'Solana', price: '$156.78', change: '+8.45%', marketCap: '$42.1B', icon: '◎', changeColor: 'text-green-400', trendData: [150, 155, 160, 158, 157], glow: 'shadow-lg shadow-purple-500/20' },
                    { rank: 6, symbol: 'USDC', name: 'USD Coin', price: '$0.9999', change: '-0.01%', marketCap: '$38.9B', icon: '$', changeColor: 'text-red-400', trendData: [1, 1, 1, 1, 1], glow: 'shadow-lg shadow-blue-400/20' },
                    { rank: 7, symbol: 'XRP', name: 'Ripple', price: '$0.5234', change: '-2.87%', marketCap: '$28.7B', icon: '◉', changeColor: 'text-red-400', trendData: [0.53, 0.52, 0.54, 0.52, 0.52], glow: 'shadow-lg shadow-cyan-500/20' },
                    { rank: 8, symbol: 'ADA', name: 'Cardano', price: '$0.5845', change: '+5.21%', marketCap: '$20.6B', icon: '₳', changeColor: 'text-green-400', trendData: [0.55, 0.58, 0.56, 0.59, 0.58], glow: 'shadow-lg shadow-indigo-500/20' },
                    { rank: 9, symbol: 'DOGE', name: 'Dogecoin', price: '$0.0832', change: '-4.12%', marketCap: '$12.1B', icon: 'Ð', changeColor: 'text-red-400', trendData: [0.085, 0.083, 0.087, 0.081, 0.083], glow: 'shadow-lg shadow-amber-500/20' },
                    { rank: 10, symbol: 'AVAX', name: 'Avalanche', price: '$38.45', change: '+12.34%', marketCap: '$15.8B', icon: '🔺', changeColor: 'text-green-400', trendData: [35, 38, 36, 40, 38], glow: 'shadow-lg shadow-red-500/20' }
                  ].map((crypto) => (
                    <div key={crypto.rank} className={`group relative bg-gradient-to-br from-black/60 to-slate-900/40 rounded-xl p-5 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${crypto.glow} hover:shadow-xl`}>

                      {/* Rank Badge */}
                      <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-pulse">
                        <span className="text-white text-xs font-bold">#{crypto.rank}</span>
                      </div>

                      {/* Top 3 Crown Effect */}
                      {crypto.rank <= 3 && (
                        <div className="absolute -top-1 -right-1 text-yellow-400 text-lg animate-bounce">
                          {crypto.rank === 1 ? '👑' : crypto.rank === 2 ? '🥈' : '🥉'}
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center text-2xl font-bold text-white border border-cyan-400/30">
                            {crypto.icon}
                          </div>
                          <div>
                            <div className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {crypto.name}
                            </div>
                            <div className="text-sm text-gray-400 font-mono">
                              /{crypto.symbol.toLowerCase()}/
                            </div>
                          </div>
                        </div>

                        {/* Change Badge */}
                        <div className={cn(
                          "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold border",
                          crypto.changeColor === 'text-green-400'
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                        )}>
                          {crypto.changeColor === 'text-green-400' ? (
                            <ArrowUp className="w-3 h-3" />
                          ) : (
                            <ArrowDown className="w-3 h-3" />
                          )}
                          {crypto.change}
                        </div>
                      </div>

                      {/* Price and Market Cap */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Price</span>
                          <span className="text-xl font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            {crypto.price}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Market Cap</span>
                          <span className="text-sm font-medium text-gray-300">{crypto.marketCap}</span>
                        </div>
                      </div>

                      {/* Mini Sparkline Chart */}
                      <div className="relative">
                        <div className="text-xs text-gray-400 mb-2">24h Trend</div>
                        <div className="h-8 flex items-end justify-between gap-1">
                          {crypto.trendData.map((point, i) => {
                            const maxPoint = Math.max(...crypto.trendData);
                            const height = (point / maxPoint) * 100;
                            return (
                              <div
                                key={i}
                                className={cn(
                                  "flex-1 rounded-sm transition-all duration-300 group-hover:opacity-80",
                                  crypto.changeColor === 'text-green-400'
                                    ? 'bg-gradient-to-t from-green-400 to-emerald-400'
                                    : 'bg-gradient-to-t from-red-400 to-rose-400'
                                )}
                                style={{ height: `${Math.max(height, 10)}%` }}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  ))}
                </div>

                {/* Footer with Last Updated */}
                <div className="mt-6 pt-4 border-t border-cyan-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Last updated: 2 minutes ago
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-cyan-500/10 text-cyan-300 border-cyan-500/20 text-xs">
                      Powered by CoinGecko API
                    </Badge>
                    <Button size="sm" variant="outline" className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 text-xs">
                      View All →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* News Feed + AI Sentiment Tags */}
              <div className="lg:col-span-2">
                <Card className="bg-black/40 border-orange-500/20 backdrop-blur-xl">
                  <CardHeader className="border-b border-orange-500/20">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Newspaper className="w-6 h-6 text-orange-400" />
                      AI-Tagged Crypto News
                      <div className="ml-auto flex gap-2">
                        <Button size="sm" variant="outline" className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10">
                          DeFi
                        </Button>
                        <Button size="sm" variant="outline" className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10">
                          24h
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[
                        {
                          headline: "Bitcoin ETFs see record $2.1B inflows as institutional adoption accelerates",
                          summary: "Major financial institutions are driving unprecedented capital flows into Bitcoin ETFs, signaling broader institutional acceptance of cryptocurrency as a legitimate asset class.",
                          sentiment: 'Bullish',
                          source: "CoinDesk",
                          time: "1h ago",
                          topics: ['BTC', 'ETF', 'Institutional']
                        },
                        {
                          headline: "Ethereum staking yields hit 5.2% as network upgrades boost validator rewards",
                          summary: "Recent protocol improvements have enhanced staking efficiency, making Ethereum more attractive to both retail and institutional stakers seeking passive income.",
                          sentiment: 'Bullish',
                          source: "CryptoNews",
                          time: "3h ago",
                          topics: ['ETH', 'Staking', 'DeFi']
                        },
                        {
                          headline: "SEC Chairman signals stricter crypto regulations ahead of 2024 elections",
                          summary: "Regulatory uncertainty continues to weigh on altcoin markets as the SEC prepares more comprehensive crypto oversight frameworks.",
                          sentiment: 'Bearish',
                          source: "Bloomberg Crypto",
                          time: "5h ago",
                          topics: ['Regulation', 'SEC', 'Politics']
                        }
                      ].map((news, i) => (
                        <div key={i} className="p-5 bg-gradient-to-br from-black/60 to-orange-900/10 rounded-xl border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300 group cursor-pointer">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-orange-300 transition-colors">
                                {news.headline}
                              </h3>
                              <p className="text-sm text-gray-400 leading-relaxed mb-3">
                                {news.summary}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {news.topics.map((topic, j) => (
                                  <Badge key={j} className="bg-orange-500/10 text-orange-300 border-orange-500/20 text-xs">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Badge className={cn(
                              "ml-4 flex-shrink-0",
                              news.sentiment === 'Bullish' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                            )}>
                              {news.sentiment === 'Bullish' ? '���� Bullish' : '🔴 Bearish'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="font-medium">{news.source}</span>
                            <span>{news.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar: Social Buzz & Watchlist */}
              <div className="space-y-6">

                {/* Social Buzz / On-Chain Trends */}
                <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                  <CardHeader className="border-b border-purple-500/20">
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <span className="text-lg">💬</span>
                      Social Buzz & Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="text-sm text-gray-400 mb-3">Trending on X/Reddit (Last 1h)</div>
                      {[
                        { hashtag: '#BitcoinETF', mentions: '+240%', sentiment: 'bullish', platform: '𝕏' },
                        { hashtag: '#ETH2024', mentions: '+156%', sentiment: 'bullish', platform: 'R' },
                        { hashtag: '#CryptoRegulation', mentions: '+89%', sentiment: 'bearish', platform: '𝕏' },
                        { hashtag: '#DeFiSummer', mentions: '+67%', sentiment: 'neutral', platform: 'R' }
                      ].map((trend, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">{trend.platform}</span>
                            <span className="text-white text-sm font-medium">{trend.hashtag}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-xs font-bold",
                              trend.sentiment === 'bullish' ? "text-green-400" :
                              trend.sentiment === 'bearish' ? "text-red-400" : "text-gray-400"
                            )}>
                              {trend.sentiment === 'bullish' ? '😃' :
                               trend.sentiment === 'bearish' ? '😡' : '😐'}
                            </span>
                            <span className="text-purple-300 text-xs font-bold">{trend.mentions}</span>
                          </div>
                        </div>
                      ))}

                      <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                        <div className="text-sm text-white font-medium mb-2">🐋 Whale Alert</div>
                        <div className="text-xs text-gray-300 leading-relaxed">
                          Large BTC transfer detected: 1,247 BTC ($84.3M) moved to unknown wallet. Market sentiment: Neutral
                        </div>
                        <div className="text-xs text-purple-300 mt-1">2 minutes ago</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Token Watchlist */}
                <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
                  <CardHeader className="border-b border-cyan-500/20">
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <span className="text-lg">⭐</span>
                      Your Crypto Watchlist
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3 mb-4">
                      {[
                        { symbol: 'BTC', price: '$67,234', change: '+2.34%', sentiment: '😃', trend: 'up' },
                        { symbol: 'ETH', price: '$2,657', change: '-1.23%', sentiment: '😐', trend: 'down' },
                        { symbol: 'SOL', price: '$156.78', change: '+8.45%', sentiment: '😃', trend: 'up' }
                      ].map((token, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{token.sentiment}</span>
                            <div>
                              <div className="text-white font-medium text-sm">{token.symbol}</div>
                              <div className="text-xs text-gray-400">{token.price}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={cn(
                              "text-sm font-bold",
                              token.trend === 'up' ? "text-green-400" : "text-red-400"
                            )}>
                              {token.change}
                            </div>
                            <div className="text-xs text-gray-400">24h</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 text-cyan-300 border border-cyan-500/30">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Token
                    </Button>
                  </CardContent>
                </Card>

                {/* AI Insight Panel */}
                <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
                  <CardHeader className="border-b border-green-500/20">
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <Brain className="w-4 h-4 text-green-400" />
                      AI Market Insight
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
                        <div className="text-sm text-white font-medium mb-2">💡 Pattern Detection</div>
                        <div className="text-xs text-gray-300 leading-relaxed mb-2">
                          Bitcoin is showing unusual bullish sentiment (95%) while price remains consolidating. This divergence often precedes significant breakouts.
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                          Confidence: 87%
                        </Badge>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                        <div className="text-sm text-white font-medium mb-2">🐋 Whale Activity</div>
                        <div className="text-xs text-gray-300 leading-relaxed mb-2">
                          Large Ethereum accumulation detected from institutional wallets. Staking activity up 23% this week.
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                          Alert: High Volume
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Footer: Live Status */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  🟢 Price API: Live
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  ✅ Sentiment Engine: Active
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  ✅ Social Feed: Streaming
                </Badge>
              </div>
            </div>
          </div>
        ) : activeSection === 'trending' ? (
          <div className="space-y-8">
            {/* Trending Hub Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20 animate-pulse">
                  <Flame className="w-10 h-10 text-pink-400" />
                </div>
                <div className="text-center">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    Trending Hub
                  </h1>
                  <p className="text-lg text-gray-300">Real-time trending assets, topics, and market movers</p>
                </div>
              </div>
            </div>

            {/* Stock Activity Dashboard - Market Pulse Panel */}
            <StockActivityDashboard
              className="mt-8"
              showHeader={true}
              defaultTab="trending"
            />

            {/* Trending Categories Tabs */}
            <Card className="bg-black/40 border-pink-500/20 backdrop-blur-xl">
              <CardHeader className="border-b border-pink-500/20">
                <CardTitle className="text-white flex items-center gap-2">
                  <Flame className="w-6 h-6 text-pink-400" />
                  What's Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="news" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-xl border border-gray-700/50">
                    <TabsTrigger value="news" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-300 text-gray-400">
                      📰 Trending News
                    </TabsTrigger>
                    <TabsTrigger value="social" className="data-[state=active]:bg-blue-600/30 data-[state=active]:text-blue-300 text-gray-400">
                      💬 Social Buzz
                    </TabsTrigger>
                    <TabsTrigger value="searches" className="data-[state=active]:bg-orange-600/30 data-[state=active]:text-orange-300 text-gray-400">
                      🔎 Top Searches
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="news" className="mt-6">
                    <div className="space-y-4">
                      {[
                        {
                          headline: "NVIDIA's AI chip demand surges 400% as tech giants race for supremacy",
                          summary: "Major cloud providers are scrambling to secure NVIDIA's latest H100 chips, driving unprecedented demand.",
                          trending: "+156%",
                          source: "TechCrunch",
                          time: "2h ago",
                          category: "AI/Tech"
                        },
                        {
                          headline: "Solana DeFi ecosystem explodes with new protocol launches",
                          summary: "Three major DeFi protocols launched on Solana this week, driving massive trading volume.",
                          trending: "+89%",
                          source: "CoinDesk",
                          time: "4h ago",
                          category: "DeFi"
                        },
                        {
                          headline: "Tesla's robotaxi reveal sparks mixed reactions from investors",
                          summary: "While some see potential, others question the timeline and feasibility of full autonomy.",
                          trending: "+67%",
                          source: "Reuters",
                          time: "1h ago",
                          category: "Automotive"
                        }
                      ].map((news, i) => (
                        <div key={i} className="bg-gradient-to-br from-black/60 to-purple-900/20 rounded-xl p-5 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group cursor-pointer">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                                {news.headline}
                              </h3>
                              <p className="text-sm text-gray-400 leading-relaxed mb-3">
                                {news.summary}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                                  {news.category}
                                </Badge>
                              </div>
                            </div>
                            <Badge className="ml-4 bg-pink-500/20 text-pink-400 border-pink-500/30">
                              {news.trending} 🔥
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="font-medium">{news.source}</span>
                            <span>{news.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="social" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { platform: "Twitter", hashtag: "#NVDAtoTheMoon", mentions: "245K", sentiment: "bullish", growth: "+340%" },
                        { platform: "Reddit", hashtag: "r/wallstreetbets", mentions: "189K", sentiment: "mixed", growth: "+156%" },
                        { platform: "Discord", hashtag: "#SolanaGang", mentions: "78K", sentiment: "bullish", growth: "+234%" },
                        { platform: "Telegram", hashtag: "#DogecoinRise", mentions: "567K", sentiment: "bearish", growth: "+89%" },
                        { platform: "TikTok", hashtag: "#CryptoTok", mentions: "1.2M", sentiment: "bullish", growth: "+45%" },
                        { platform: "Instagram", hashtag: "#TeslaNews", mentions: "134K", sentiment: "neutral", growth: "+23%" }
                      ].map((social, i) => (
                        <div key={i} className="bg-gradient-to-br from-black/60 to-blue-900/20 rounded-xl p-4 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                                {social.platform}
                              </Badge>
                              <span className="text-white font-medium">{social.hashtag}</span>
                            </div>
                            <Badge className={cn(
                              "text-xs",
                              social.sentiment === 'bullish' ? "bg-green-500/20 text-green-400 border-green-500/30" :
                              social.sentiment === 'bearish' ? "bg-red-500/20 text-red-400 border-red-500/30" :
                              "bg-gray-500/20 text-gray-400 border-gray-500/30"
                            )}>
                              {social.sentiment === 'bullish' ? '😃' : social.sentiment === 'bearish' ? '😡' : '😐'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-lg font-bold text-white">{social.mentions}</div>
                              <div className="text-xs text-gray-400">mentions</div>
                            </div>
                            <div className="text-right">
                              <div className="text-pink-400 font-bold">{social.growth}</div>
                              <div className="text-xs text-gray-400">24h growth</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="searches" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { query: "NVIDIA stock prediction", volume: "2.3M", growth: "+456%", region: "Global" },
                        { query: "Solana price target", volume: "1.8M", growth: "+234%", region: "US" },
                        { query: "Tesla robotaxi news", volume: "3.1M", growth: "+189%", region: "Global" },
                        { query: "Bitcoin ETF approval", volume: "4.2M", growth: "+123%", region: "US" },
                        { query: "Dogecoin price crash", volume: "5.6M", growth: "+567%", region: "Global" },
                        { query: "Apple earnings report", volume: "2.7M", growth: "+78%", region: "US" }
                      ].map((search, i) => (
                        <div key={i} className="bg-gradient-to-br from-black/60 to-orange-900/20 rounded-xl p-4 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300">
                          <div className="mb-3">
                            <h4 className="text-white font-medium mb-1">{search.query}</h4>
                            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                              {search.region}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-lg font-bold text-white">{search.volume}</div>
                              <div className="text-xs text-gray-400">searches</div>
                            </div>
                            <div className="text-right">
                              <div className="text-orange-400 font-bold">{search.growth}</div>
                              <div className="text-xs text-gray-400">24h growth</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Real-time Trending Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-black/40 border-pink-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    🔥 Most Trending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl mb-2">⭐</div>
                    <div className="text-2xl font-bold text-pink-400">NVIDIA</div>
                    <div className="text-sm text-gray-400 mb-2">+456% trending</div>
                    <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">
                      AI Revolution
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    🔥 Biggest Mover
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl mb-2">◎</div>
                    <div className="text-2xl font-bold text-purple-400">Solana</div>
                    <div className="text-sm text-gray-400 mb-2">+18.67% today</div>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      DeFi Surge
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    💬 Social Leader
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl mb-2">🐕</div>
                    <div className="text-2xl font-bold text-blue-400">Dogecoin</div>
                    <div className="text-sm text-gray-400 mb-2">5.6M mentions</div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      Viral Trend
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer: Trending Status */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">
                  ✅ Trending Data: Live
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  ✅ Social Analytics: Active
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  ✅ Search Trends: Real-time
                </Badge>
              </div>
            </div>
          </div>
        ) : activeSection === 'earnings' ? (
          <EarningsCalendarDashboard />
        ) : activeSection === 'charts' ? (
          <div className="space-y-8">
            {/* Charts Hub Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 animate-pulse">
                  <BarChart3 className="w-10 h-10 text-indigo-400" />
                </div>
                <div className="text-center">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                    Advanced Charts
                  </h1>
                  <p className="text-lg text-gray-300">Interactive trading charts and technical analysis</p>
                </div>
              </div>
            </div>

            {/* TradingView-Style Chart Interface */}
            <Card className="bg-black/40 border-indigo-500/20 backdrop-blur-xl overflow-hidden">
              <CardHeader className="border-b border-indigo-500/20 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">₿</span>
                      <div>
                        <h3 className="text-xl font-bold text-white">BTC/USD</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-green-400 font-bold">$67,234.56</span>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            +2.34% (+$1,567.89)
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chart Type & Timeframe Controls */}
                  <div className="flex items-center gap-4">
                    {/* Chart Type Selector */}
                    <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
                      {[
                        { type: 'Candlestick', icon: '📊', active: true },
                        { type: 'Line', icon: '📈', active: false },
                        { type: 'Area', icon: '🌊', active: false },
                        { type: 'Sentiment', icon: '🧠', active: false }
                      ].map((chart) => (
                        <Button
                          key={chart.type}
                          size="sm"
                          variant={chart.active ? 'default' : 'ghost'}
                          className={cn(
                            "text-xs px-2 h-8",
                            chart.active
                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                          )}
                          title={chart.type}
                        >
                          <IconText value={chart.icon} />
                        </Button>
                      ))}
                    </div>

                    {/* Timeframe Selector */}
                    <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
                      {['5m', '30m', '1h', '1d', '1w', '1M', '1y'].map((tf) => (
                        <Button
                          key={tf}
                          size="sm"
                          variant={tf === '1h' ? 'default' : 'ghost'}
                          className={cn(
                            "text-xs px-3 h-8 font-medium",
                            tf === '1h'
                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                          )}
                        >
                          {tf}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Advanced Chart Visualization */}
                <div className="relative h-[600px] bg-gradient-to-br from-slate-900 via-indigo-950/30 to-purple-950/30">

                  {/* Chart Grid with Enhanced Design */}
                  <div className="absolute inset-0 opacity-20">
                    {/* Horizontal grid lines */}
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={`h-${i}`}
                        className="absolute w-full border-t border-dotted border-indigo-400/30"
                        style={{ top: `${i * 8.33}%` }}
                      />
                    ))}
                    {/* Vertical grid lines */}
                    {[...Array(16)].map((_, i) => (
                      <div
                        key={`v-${i}`}
                        className="absolute h-full border-l border-dotted border-indigo-400/30"
                        style={{ left: `${i * 6.25}%` }}
                      />
                    ))}
                  </div>

                  {/* Advanced Candlestick Chart with Technical Indicators */}
                  <div className="relative h-full p-8">

                    {/* Price Chart Area (70% height) */}
                    <div className="relative h-3/4 mb-4">

                      {/* Moving Average Lines */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {/* MA 20 - Green Line */}
                        <path
                          d="M 50 200 Q 150 180 250 190 T 450 185 T 650 175 T 850 170"
                          stroke="#00FFA3"
                          strokeWidth="2"
                          fill="none"
                          className="drop-shadow-[0_0_8px_rgba(0,255,163,0.6)]"
                        />
                        {/* MA 50 - Blue Line */}
                        <path
                          d="M 50 220 Q 150 210 250 215 T 450 210 T 650 205 T 850 200"
                          stroke="#00D4FF"
                          strokeWidth="2"
                          fill="none"
                          className="drop-shadow-[0_0_8px_rgba(0,212,255,0.6)]"
                        />
                        {/* Sentiment Overlay Line */}
                        <path
                          d="M 50 160 Q 150 140 250 155 T 450 145 T 650 135 T 850 130"
                          stroke="#FF00FF"
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray="5,5"
                          className="drop-shadow-[0_0_12px_rgba(255,0,255,0.8)] opacity-70"
                        />
                      </svg>

                      {/* Enhanced Candlestick Data */}
                      <div className="absolute inset-0 flex items-end justify-between px-8">
                        {[
                          { open: 65000, close: 66500, high: 67000, low: 64800, volume: 1200, sentiment: 78 },
                          { open: 66500, close: 65800, high: 67200, low: 65400, volume: 980, sentiment: 72 },
                          { open: 65800, close: 67100, high: 67400, low: 65600, volume: 1450, sentiment: 85 },
                          { open: 67100, close: 66900, high: 67800, low: 66700, volume: 1100, sentiment: 68 },
                          { open: 66900, close: 67234, high: 67500, low: 66500, volume: 1350, sentiment: 82 },
                          { open: 67234, close: 67400, high: 67600, low: 67100, volume: 890, sentiment: 88 },
                          { open: 67400, close: 67234, high: 67800, low: 67000, volume: 1200, sentiment: 75 },
                          { open: 67234, close: 67850, high: 68100, low: 67100, volume: 1600, sentiment: 92 },
                          { open: 67850, close: 67654, high: 68200, low: 67500, volume: 1250, sentiment: 79 },
                          { open: 67654, close: 68123, high: 68400, low: 67600, volume: 1800, sentiment: 95 }
                        ].map((candle, i) => {
                          const isGreen = candle.close > candle.open;
                          const bodyHeight = Math.abs(candle.close - candle.open) / 150;
                          const wickTop = (candle.high - Math.max(candle.open, candle.close)) / 150;
                          const wickBottom = (Math.min(candle.open, candle.close) - candle.low) / 150;

                          return (
                            <div key={i} className="relative flex flex-col items-center group cursor-crosshair" style={{ height: '85%' }}>
                              {/* Sentiment Alert Band */}
                              {candle.sentiment > 90 && (
                                <div className="absolute -inset-2 bg-green-400/10 rounded-lg animate-pulse" />
                              )}

                              {/* Upper wick with glow */}
                              <div
                                className={cn(
                                  "w-0.5 shadow-sm",
                                  isGreen
                                    ? 'bg-green-400 shadow-green-400/50'
                                    : 'bg-red-400 shadow-red-400/50'
                                )}
                                style={{ height: `${wickTop * 4}px` }}
                              />

                              {/* Candle body with enhanced styling */}
                              <div
                                className={cn(
                                  "w-4 border transition-all duration-200 group-hover:w-5",
                                  isGreen
                                    ? 'bg-green-400 border-green-300 shadow-lg shadow-green-400/30'
                                    : 'bg-red-400 border-red-300 shadow-lg shadow-red-400/30'
                                )}
                                style={{ height: `${Math.max(bodyHeight * 6, 12)}px` }}
                              />

                              {/* Lower wick with glow */}
                              <div
                                className={cn(
                                  "w-0.5 shadow-sm",
                                  isGreen
                                    ? 'bg-green-400 shadow-green-400/50'
                                    : 'bg-red-400 shadow-red-400/50'
                                )}
                                style={{ height: `${wickBottom * 4}px` }}
                              />

                              {/* Hover Tooltip */}
                              <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-indigo-500/30 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10 min-w-[160px]">
                                <div className="text-xs space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">O:</span>
                                    <span className="text-white">${candle.open.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">H:</span>
                                    <span className="text-white">${candle.high.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">L:</span>
                                    <span className="text-white">${candle.low.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">C:</span>
                                    <span className="text-white">${candle.close.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Vol:</span>
                                    <span className="text-indigo-300">{candle.volume}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Sentiment:</span>
                                    <span className="text-purple-300">{candle.sentiment.toFixed(2)}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Technical Indicators Panel (30% height) */}
                    <div className="relative h-1/4 border-t border-indigo-500/20 pt-4">

                      {/* Volume Bars */}
                      <div className="h-1/3 mb-2">
                        <div className="text-xs text-gray-400 mb-1">Volume</div>
                        <div className="flex items-end justify-between h-full px-8">
                          {[1200, 980, 1450, 1100, 1350, 890, 1200, 1600, 1250, 1800].map((vol, i) => (
                            <div
                              key={i}
                              className="bg-indigo-400/60 w-6 hover:bg-indigo-400/80 transition-colors"
                              style={{ height: `${(vol / 1800) * 100}%` }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* RSI Indicator */}
                      <div className="h-1/3 mb-2">
                        <div className="text-xs text-gray-400 mb-1">RSI (14): <span className="text-cyan-400 font-bold">68.3</span></div>
                        <div className="relative h-full bg-gray-800/30 rounded">
                          {/* RSI overbought/oversold zones */}
                          <div className="absolute top-0 left-0 right-0 h-1/5 bg-red-500/10 rounded-t" />
                          <div className="absolute bottom-0 left-0 right-0 h-1/5 bg-green-500/10 rounded-b" />
                          {/* RSI line */}
                          <svg className="absolute inset-0 w-full h-full">
                            <path
                              d="M 0 40 Q 80 35 160 42 T 320 38 T 480 35 T 640 32 T 800 30"
                              stroke="#00D4FF"
                              strokeWidth="2"
                              fill="none"
                              className="drop-shadow-[0_0_6px_rgba(0,212,255,0.8)]"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* MACD Indicator */}
                      <div className="h-1/3">
                        <div className="text-xs text-gray-400 mb-1">MACD: <span className="text-purple-400 font-bold">+234.5</span></div>
                        <div className="relative h-full bg-gray-800/30 rounded">
                          <div className="flex items-end justify-center h-full px-2">
                            {[12, -8, 15, 22, 18, -5, 25, 32, 28, 35].map((macd, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "w-6 mx-1",
                                  macd > 0
                                    ? 'bg-green-400/70'
                                    : 'bg-red-400/70'
                                )}
                                style={{
                                  height: `${Math.abs(macd) * 2}px`,
                                  marginTop: macd < 0 ? 'auto' : '0'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Technical Analysis Panel */}
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-xl rounded-lg p-4 border border-indigo-500/30 max-w-xs">
                    <div className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Live Technical Analysis
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">MA(20):</span>
                        <span className="text-green-400 font-bold">$66,847 ↗</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">MA(50):</span>
                        <span className="text-blue-400 font-bold">$65,234 ↗</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">RSI:</span>
                        <span className="text-yellow-400 font-bold">68.3 (Bullish)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">MACD:</span>
                        <span className="text-purple-400 font-bold">+234.5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Sentiment:</span>
                        <span className="text-pink-400 font-bold">85% 🚀</span>
                      </div>
                    </div>

                    {/* AI Prediction */}
                    <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                      <div className="text-purple-300 text-xs font-medium mb-1">🤖 AI Forecast</div>
                      <div className="text-xs text-gray-300">
                        Bullish momentum with 87% confidence. Potential breakout to $69,500 within 24h.
                      </div>
                    </div>
                  </div>

                  {/* Trading Panel */}
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-xl rounded-lg p-4 border border-indigo-500/30">
                    <div className="text-white text-sm font-medium mb-3">Quick Trade</div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" className="bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30 text-xs">
                          LONG
                        </Button>
                        <Button size="sm" className="bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 text-xs">
                          SHORT
                        </Button>
                      </div>
                      <div className="text-xs text-gray-400 space-y-1">
                        <div className="flex justify-between">
                          <span>Entry:</span>
                          <span className="text-white">$67,234</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Stop Loss:</span>
                          <span className="text-red-400">$65,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Take Profit:</span>
                          <span className="text-green-400">$69,500</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Indicators Toggle Panel */}
                  <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-xl rounded-lg p-3 border border-indigo-500/30">
                    <div className="text-white text-sm font-medium mb-2">Indicators</div>
                    <div className="flex gap-2">
                      {[
                        { name: 'RSI', active: true, color: 'cyan' },
                        { name: 'MACD', active: true, color: 'purple' },
                        { name: 'MA', active: true, color: 'green' },
                        { name: 'BB', active: false, color: 'orange' }
                      ].map((indicator) => (
                        <Button
                          key={indicator.name}
                          size="sm"
                          variant={indicator.active ? 'default' : 'outline'}
                          className={cn(
                            "text-xs px-2 h-6",
                            indicator.active
                              ? `bg-${indicator.color}-600/30 text-${indicator.color}-300 border-${indicator.color}-500/30`
                              : "border-gray-600 text-gray-400 hover:text-white"
                          )}
                        >
                          {indicator.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chart Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Market Depth */}
              <Card className="bg-black/40 border-indigo-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    📊 Market Depth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-white">$67,234.56</div>
                      <div className="text-sm text-gray-400">Current Price</div>
                    </div>

                    {/* Bid/Ask Visualization */}
                    <div className="space-y-2">
                      <div className="text-sm text-gray-400">Order Book</div>
                      {[
                        { price: '67,245', amount: '2.45', side: 'ask' },
                        { price: '67,240', amount: '1.23', side: 'ask' },
                        { price: '67,235', amount: '3.67', side: 'current' },
                        { price: '67,230', amount: '1.89', side: 'bid' },
                        { price: '67,225', amount: '4.12', side: 'bid' }
                      ].map((order, i) => (
                        <div key={i} className={cn(
                          "flex justify-between p-2 rounded text-sm",
                          order.side === 'ask' ? 'bg-red-500/10 text-red-300' :
                          order.side === 'bid' ? 'bg-green-500/10 text-green-300' :
                          'bg-indigo-500/20 text-indigo-300 font-bold'
                        )}>
                          <span>${order.price}</span>
                          <span>{order.amount} BTC</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Trades */}
              <Card className="bg-black/40 border-indigo-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    ⚡ Recent Trades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { price: '67,234', amount: '0.15', time: '14:23:45', side: 'buy' },
                      { price: '67,230', amount: '0.08', time: '14:23:42', side: 'sell' },
                      { price: '67,235', amount: '0.25', time: '14:23:38', side: 'buy' },
                      { price: '67,228', amount: '0.12', time: '14:23:35', side: 'sell' },
                      { price: '67,240', amount: '0.18', time: '14:23:30', side: 'buy' },
                      { price: '67,225', amount: '0.09', time: '14:23:28', side: 'sell' }
                    ].map((trade, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-gray-800/30 rounded text-sm">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            trade.side === 'buy' ? 'bg-green-400' : 'bg-red-400'
                          )} />
                          <span className="text-white font-medium">${trade.price}</span>
                        </div>
                        <span className="text-gray-400">{trade.amount}</span>
                        <span className="text-xs text-gray-500">{trade.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Chart Statistics */}
              <Card className="bg-black/40 border-indigo-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    📈 24h Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: '24h High', value: '$67,845.32', color: 'text-green-400' },
                      { label: '24h Low', value: '$65,234.18', color: 'text-red-400' },
                      { label: '24h Volume', value: '28,456 BTC', color: 'text-blue-400' },
                      { label: '24h Change', value: '+2.34%', color: 'text-green-400' },
                      { label: 'Market Cap', value: '$1.31T', color: 'text-purple-400' },
                      { label: 'Dominance', value: '48.7%', color: 'text-orange-400' }
                    ].map((stat, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">{stat.label}</span>
                        <span className={cn("font-bold text-sm", stat.color)}>
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer: Chart Status */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  ✅ Chart Data: Real-time
                </Badge>
                <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                  ✅ Technical Analysis: Active
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  📘 Order Book: Live
                </Badge>
              </div>
            </div>
          </div>
        ) : activeSection === 'screener' ? (
          <div className="space-y-8">
            {/* Strategy Profiler Banner */}
            <StrategyProfiler placement="screener" className="mb-6" />

            {/* Screener Hub Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-teal-500/20 via-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 animate-pulse">
                  <Filter className="w-10 h-10 text-teal-400" />
                </div>
                <div className="text-center">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                    Stock Screener
                  </h1>
                  <p className="text-lg text-gray-300">Filter and discover stocks based on your criteria</p>
                </div>
              </div>
            </div>

            {/* Stock Screener Tabs */}
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-gray-700/50">
                <TabsTrigger
                  value="basic"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400"
                >
                  Basic Screener
                </TabsTrigger>
                <TabsTrigger
                  value="advanced"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400"
                >
                  Advanced Screener
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="mt-6">
                <BasicScreener />
              </TabsContent>

              <TabsContent value="advanced" className="mt-6">
                <AdvancedStockScreener />
              </TabsContent>
            </Tabs>
          </div>
        ) : activeSection === 'trade-journal' ? (
          <SmartTradeJournal />
        ) : activeSection === 'sentiment-polls' ? (
          <CommunitySentimentPolls />
        ) : activeSection === 'news-feed' ? (
          <SmartNewsFeed />
        ) : activeSection === 'chat' ? (
          <ChatInterface />
        ) : activeSection === 'space' ? (
          <div className="space-y-6">
            {/* Strategy Profiler for Community */}
            <StrategyProfiler placement="community" />
            <SpaceSwitcherWidget />
          </div>
        ) : activeSection === 'rooms' ? (
          <PrivateRoomsContainer />
                ) : activeSection === 'tool' || activeSection === 'market' ? (
          <Tabs value={activeToolsSubtab} onValueChange={setActiveToolsSubtab}>
            <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-xl border border-gray-700/50">
              <TabsTrigger
                value="HeatMap"
                className="data-[state=active]:bg-gray-700/50 data-[state=active]:text-white text-gray-400"
              >
                🌡️ Heat Map
              </TabsTrigger>
              <TabsTrigger
                value="Analytics"
                className="data-[state=active]:bg-gray-700/50 data-[state=active]:text-white text-gray-400"
              >
                📈 Analytics
              </TabsTrigger>
              <TabsTrigger
                value="Scanner"
                className="data-[state=active]:bg-gray-700/50 data-[state=active]:text-white text-gray-400"
              >
                🔍 Scanner
              </TabsTrigger>
            </TabsList>

            <TabsContent value="HeatMap" className="mt-6">
              {/* Sentiment Surface - Futuristic Heatmap Dashboard */}
              <div className="space-y-6">

                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-green-500/20 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 animate-pulse">
                      <span className="text-3xl">🔥</span>
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 bg-clip-text text-transparent">
                      Sentiment Surface
                    </h2>
                  </div>
                  <p className="text-lg text-gray-300">Real-time sentiment & performance heatmap visualization</p>
                </div>

                {/* Category Filter Bar */}
                <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white flex items-center gap-2">
                      <span className="text-xl">🧭</span>
                      Dashboard Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                      {/* Market Type Filter */}
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Market Type</label>
                        <div className="flex gap-1">
                          {['Stocks', 'Crypto', 'Combined'].map((market) => (
                            <Button
                              key={market}
                              size="sm"
                              variant={market === 'Combined' ? 'default' : 'outline'}
                              className={cn(
                                "text-xs flex-1",
                                market === 'Combined'
                                  ? "bg-purple-600 text-white"
                                  : "border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                              )}
                            >
                              {market}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Data Type Filter */}
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Data Type</label>
                        <div className="flex gap-1">
                          {['Sentiment', 'Price', 'Volume'].map((type) => (
                            <Button
                              key={type}
                              size="sm"
                              variant={type === 'Sentiment' ? 'default' : 'outline'}
                              className={cn(
                                "text-xs flex-1",
                                type === 'Sentiment'
                                  ? "bg-purple-600 text-white"
                                  : "border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                              )}
                            >
                              {type}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Timeframe Filter */}
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Timeframe</label>
                        <div className="flex gap-1">
                          {['1H', '24H', '7D'].map((time) => (
                            <Button
                              key={time}
                              size="sm"
                              variant={time === '24H' ? 'default' : 'outline'}
                              className={cn(
                                "text-xs flex-1",
                                time === '24H'
                                  ? "bg-purple-600 text-white"
                                  : "border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                              )}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Search Control */}
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Search Symbol</label>
                        <Input
                          placeholder="BTC, AAPL, etc..."
                          className="bg-black/40 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-0 text-sm"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                  {/* Main Heatmap Grid */}
                  <div className="lg:col-span-3">
                    <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                      <CardHeader className="border-b border-purple-500/20">
                        <CardTitle className="text-white flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">🗺️</span>
                            Interactive Sentiment Grid
                          </div>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                            Live Data
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">

                        {/* Heatmap Grid */}
                        <div className="grid grid-cols-6 lg:grid-cols-8 gap-3 mb-6">
                          {[
                            // Stocks
                            { symbol: 'AAPL', name: 'Apple', sentiment: 78, change: '+2.1%', volume: '45M', category: 'stock', icon: '🍎' },
                            { symbol: 'GOOGL', name: 'Google', sentiment: 72, change: '+1.8%', volume: '28M', category: 'stock', icon: '🔍' },
                            { symbol: 'MSFT', name: 'Microsoft', sentiment: 85, change: '+3.2%', volume: '32M', category: 'stock', icon: '����' },
                            { symbol: 'TSLA', name: 'Tesla', sentiment: 35, change: '-2.7%', volume: '67M', category: 'stock', icon: '⚡' },
                            { symbol: 'AMZN', name: 'Amazon', sentiment: 68, change: '+0.9%', volume: '23M', category: 'stock', icon: '📦' },
                            { symbol: 'NVDA', name: 'NVIDIA', sentiment: 92, change: '+5.4%', volume: '89M', category: 'stock', icon: '🎮' },
                            { symbol: 'META', name: 'Meta', sentiment: 58, change: '+1.2%', volume: '41M', category: 'stock', icon: '👤' },
                            { symbol: 'NFLX', name: 'Netflix', sentiment: 43, change: '-1.1%', volume: '18M', category: 'stock', icon: '📺' },

                            // Crypto
                            { symbol: 'BTC', name: 'Bitcoin', sentiment: 82, change: '+3.8%', volume: '2.1B', category: 'crypto', icon: '₿' },
                            { symbol: 'ETH', name: 'Ethereum', sentiment: 76, change: '+2.4%', volume: '1.8B', category: 'crypto', icon: '⟐' },
                            { symbol: 'SOL', name: 'Solana', sentiment: 88, change: '+7.2%', volume: '890M', category: 'crypto', icon: '◎' },
                            { symbol: 'ADA', name: 'Cardano', sentiment: 71, change: '+4.1%', volume: '234M', category: 'crypto', icon: '₳' },
                            { symbol: 'DOT', name: 'Polkadot', sentiment: 39, change: '-3.2%', volume: '156M', category: 'crypto', icon: '●' },
                            { symbol: 'MATIC', name: 'Polygon', sentiment: 79, change: '+6.7%', volume: '312M', category: 'crypto', icon: '⬟' },
                            { symbol: 'AVAX', name: 'Avalanche', sentiment: 74, change: '+3.9%', volume: '245M', category: 'crypto', icon: '🔺' },
                            { symbol: 'LINK', name: 'Chainlink', sentiment: 66, change: '+2.1%', volume: '189M', category: 'crypto', icon: '🔗' },

                            // Sectors
                            { symbol: 'TECH', name: 'Technology', sentiment: 81, change: '+2.8%', volume: '12B', category: 'sector', icon: '��' },
                            { symbol: 'FIN', name: 'Finance', sentiment: 62, change: '+1.2%', volume: '8.4B', category: 'sector', icon: '🏦' },
                            { symbol: 'HLTH', name: 'Healthcare', sentiment: 54, change: '-0.3%', volume: '5.2B', category: 'sector', icon: '🏥' },
                            { symbol: 'ENGY', name: 'Energy', sentiment: 47, change: '-1.8%', volume: '6.7B', category: 'sector', icon: '⚡' },
                            { symbol: 'DEFI', name: 'DeFi', sentiment: 84, change: '+4.2%', volume: '3.1B', category: 'sector', icon: '🏛️' },
                            { symbol: 'AI', name: 'AI Tokens', sentiment: 91, change: '+8.1%', volume: '2.8B', category: 'sector', icon: '🤖' },
                            { symbol: 'GAME', name: 'Gaming', sentiment: 73, change: '+3.5%', volume: '1.9B', category: 'sector', icon: '🎮' },
                            { symbol: 'MEME', name: 'Meme Coins', sentiment: 38, change: '-5.2%', volume: '1.2B', category: 'sector', icon: '🐕' }
                          ].map((item, i) => {
                            const getSentimentColor = (sentiment: number) => {
                              if (sentiment >= 70) return 'from-green-500 to-emerald-600';
                              if (sentiment >= 50) return 'from-yellow-500 to-orange-500';
                              return 'from-red-500 to-rose-600';
                            };

                            const getSentimentGlow = (sentiment: number) => {
                              if (sentiment >= 70) return 'shadow-green-500/30';
                              if (sentiment >= 50) return 'shadow-yellow-500/30';
                              return 'shadow-red-500/30';
                            };

                            return (
                              <div
                                key={i}
                                className={cn(
                                  "relative group cursor-pointer rounded-xl p-3 transition-all duration-300 hover:scale-105",
                                  `bg-gradient-to-br ${getSentimentColor(item.sentiment)}`,
                                  `shadow-lg ${getSentimentGlow(item.sentiment)}`,
                                  "hover:shadow-xl"
                                )}
                              >
                                {/* Tile Content */}
                                <div className="text-center">
                                  <div className="text-2xl mb-1">{item.icon}</div>
                                  <div className="text-white font-bold text-sm">{item.symbol}</div>
                                  <div className="text-white/80 text-xs">{item.sentiment.toFixed(2)}%</div>
                                </div>

                                {/* Hover Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10">
                                  <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-lg p-3 min-w-[200px] shadow-xl">
                                    <div className="text-center space-y-2">
                                      <div className="flex items-center justify-center gap-2">
                                        <span className="text-xl">{item.icon}</span>
                                        <div>
                                          <div className="text-white font-bold">{item.symbol}</div>
                                          <div className="text-gray-400 text-xs">{item.name}</div>
                                        </div>
                                      </div>

                                      <div className="space-y-1 text-xs">
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">Sentiment:</span>
                                          <span className={cn(
                                            "font-bold",
                                            item.sentiment >= 70 ? "text-green-400" :
                                            item.sentiment >= 50 ? "text-yellow-400" : "text-red-400"
                                          )}>
                                            {item.sentiment.toFixed(2)}% {item.sentiment >= 70 ? "🟢" : item.sentiment >= 50 ? "🟡" : "🔴"}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">24h Change:</span>
                                          <span className={cn(
                                            "font-bold",
                                            item.change.startsWith('+') ? "text-green-400" : "text-red-400"
                                          )}>
                                            {item.change}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">Volume:</span>
                                          <span className="text-blue-400 font-bold">{item.volume}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">Category:</span>
                                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                                            {item.category}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-center gap-6 pt-4 border-t border-purple-500/20">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded"></div>
                            <span className="text-green-400">Bullish (70-100%)</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded"></div>
                            <span className="text-yellow-400">Neutral (50-69%)</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-rose-600 rounded"></div>
                            <span className="text-red-400">Bearish (0-49%)</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* AI Highlights Sidebar */}
                  <div className="space-y-6">

                    {/* Smart AI Highlights */}
                    <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
                      <CardHeader className="border-b border-green-500/20">
                        <CardTitle className="text-white text-sm flex items-center gap-2">
                          <Brain className="w-4 h-4 text-green-400" />
                          🧠 AI Market Alerts
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                            <div className="text-green-400 text-xs font-medium mb-1">🔥 Bullish Surge</div>
                            <div className="text-white text-sm leading-relaxed">
                              $SOL sentiment surged 45% in last 24H after DeFi protocol announcements
                            </div>
                            <div className="text-green-300 text-xs mt-1">2 minutes ago</div>
                          </div>

                          <div className="p-3 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-lg border border-red-500/20">
                            <div className="text-red-400 text-xs font-medium mb-1">📉 Bearish Flip</div>
                            <div className="text-white text-sm leading-relaxed">
                              $TSLA flipped bearish after earnings report missed expectations
                            </div>
                            <div className="text-red-300 text-xs mt-1">15 minutes ago</div>
                          </div>

                          <div className="p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                            <div className="text-blue-400 text-xs font-medium mb-1">🤖 AI Sector Alert</div>
                            <div className="text-white text-sm leading-relaxed">
                              AI tokens showing 91% bullish sentiment, up 23% from yesterday
                            </div>
                            <div className="text-blue-300 text-xs mt-1">1 hour ago</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Live Stats */}
                    <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
                      <CardHeader className="border-b border-purple-500/20">
                        <CardTitle className="text-white text-sm flex items-center gap-2">
                          <span className="text-lg">📊</span>
                          Market Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Total Bullish</span>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              <span className="text-green-400 font-bold">67%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Total Bearish</span>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                              <span className="text-red-400 font-bold">21%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Neutral</span>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                              <span className="text-yellow-400 font-bold">12%</span>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-purple-500/20">
                            <div className="text-gray-400 text-xs mb-2">Top Gainers (24h)</div>
                            <div className="space-y-1">
                              {[
                                { symbol: 'SOL', change: '+7.2%' },
                                { symbol: 'NVDA', change: '+5.4%' },
                                { symbol: 'ADA', change: '+4.1%' }
                              ].map((gainer, i) => (
                                <div key={i} className="flex justify-between text-xs">
                                  <span className="text-white">{gainer.symbol}</span>
                                  <span className="text-green-400 font-bold">{gainer.change}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-purple-500/20">
                            <div className="text-gray-400 text-xs mb-2">Top Losers (24h)</div>
                            <div className="space-y-1">
                              {[
                                { symbol: 'MEME', change: '-5.2%' },
                                { symbol: 'DOT', change: '-3.2%' },
                                { symbol: 'TSLA', change: '-2.7%' }
                              ].map((loser, i) => (
                                <div key={i} className="flex justify-between text-xs">
                                  <span className="text-white">{loser.symbol}</span>
                                  <span className="text-red-400 font-bold">{loser.change}</span>
                                </div>
                              ))}
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
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8">
                <div className="text-center space-y-4">
                  <div className="text-6xl mb-4">📈</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Advanced Analytics</h3>
                  <p className="text-gray-400 mb-4">
                    Comprehensive market analysis and trend insights coming soon.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Technical Indicators</Badge>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Trend Analysis</Badge>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Volume Patterns</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="Scanner" className="mt-6">
              {/* Strategy Profiler for Dashboard placement */}
              <div className="mb-6">
                <StrategyProfiler placement="dashboard" compact={true} />
              </div>

              {/* Stock Screener Tabs */}
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-gray-700/50 mb-6">
                  <TabsTrigger
                    value="basic"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400"
                  >
                    Basic Screener
                  </TabsTrigger>
                  <TabsTrigger
                    value="advanced"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400"
                  >
                    Advanced Screener
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic">
                  <BasicScreener />
                </TabsContent>

                <TabsContent value="advanced">
                  <AdvancedStockScreener />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        ) : (
          <>
        
        {/* Hero Mood Score Section - Theme Adaptive */}
        <div className="hero-sentiment-section text-center mb-16 relative">
          {/* Theme-adaptive overlay container */}
          <div className={`absolute inset-0 rounded-3xl -mx-6 -my-6 backdrop-blur-sm ${
            themeMode === 'light'
              ? 'bg-gradient-to-br from-blue-50/95 to-purple-50/95'
              : 'bg-gradient-to-br from-slate-900/95 to-purple-900/95'
          }`} />

          <div className="relative z-10 py-6">
            {/* Large Mood Score with Animated Character */}
            <div className="relative inline-block mb-8">
              <div className="w-96 h-96 rounded-full relative">
                              {/* Animated gradient ring - rotates around the content */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getSentimentGradient(currentSentiment)} p-2 animate-spin-slow`}>
                  <div className={`w-full h-full rounded-full backdrop-blur-sm ${
                    themeMode === 'light'
                      ? 'bg-gradient-to-br from-white/95 to-blue-50/95'
                      : 'bg-gradient-to-br from-slate-900/90 to-purple-900/90'
                  }`} />
                </div>

                {/* Fixed content container - does not rotate */}
                <div className="absolute inset-2 flex items-center justify-center">
                  <div className="text-center">
                    {/* Mood Emoji - Fixed in place */}
                    <div className="text-6xl mb-4 animate-bounce">
                      {getSentimentEmoji(currentSentiment)}
                    </div>
                    {/* Score */}
                    <div className="text-9xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                      {moodScore.overall}
                    </div>
                    {/* Dynamic Label */}
                    <div className={`text-2xl font-bold mb-1 ${
                      themeMode === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {getSentimentLabel(currentSentiment)}
                    </div>
                    <div className={`text-sm uppercase tracking-wider ${
                      themeMode === 'light' ? 'text-gray-600' : 'text-purple-300'
                    }`}>
                      AI SENTIMENT SCORE
                    </div>
                  </div>
                </div>

                              {/* Multiple pulse rings with sentiment-based colors */}
                <div className={`absolute inset-0 rounded-full border-2 animate-ping ${
                  currentSentiment === 'positive' ? 'border-emerald-400/40' :
                  currentSentiment === 'neutral' ? 'border-gray-400/40' :
                  'border-red-400/40'
                }`} />
                <div className={`absolute inset-2 rounded-full border animate-ping delay-75 ${
                  currentSentiment === 'positive' ? 'border-green-400/30' :
                  currentSentiment === 'neutral' ? 'border-slate-400/30' :
                  'border-rose-400/30'
                }`} />
                <div className={`absolute inset-4 rounded-full border animate-ping delay-150 ${
                  currentSentiment === 'positive' ? 'border-cyan-400/20' :
                  currentSentiment === 'neutral' ? 'border-purple-400/20' :
                  'border-purple-400/20'
                }`} />
              </div>
            </div>

            {/* Subtitle - Theme-adaptive text */}
            <p className={`text-xl max-w-3xl mx-auto mb-12 leading-relaxed on-gradient-text-soft ${
              themeMode === 'light' ? 'text-gray-700' : 'text-gray-200'
            }`}>
              Advanced AI-powered sentiment analysis with intelligent insights and mood breakdown
            </p>
          </div>
        </div>

        {/* Daily Mood Recap Section */}
        <DailyMoodRecap className="mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">

            {/* Top 10 Movers Widget */}
            <Card className={themeMode === 'light' ? `${cardBackground} border ${borderColor} shadow-[0_2px_6px_rgba(0,0,0,0.05)]` : "bg-black/40 border-purple-500/20 backdrop-blur-xl"}>
              <CardHeader className={themeMode === 'light' ? `border-b ${borderColor}` : "border-b border-purple-500/20"}>
                <CardTitle className={`flex items-center gap-2 ${themeMode === 'light' ? 'text-[#1A1A1A]' : 'text-white'}`}>
                  <TrendingUp className={`w-6 h-6 ${themeMode === 'light' ? 'text-[#4CAF50]' : 'text-emerald-400'}`} />
                  Top 10 Movers Today
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {topMovers.map((stock, index) => (
                    <div key={stock.symbol} className={themeMode === 'light'
                      ? `bg-white border border-[#E6E6E6] hover:border-red-400/30 rounded-xl p-4 transition-all duration-300 group cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]`
                      : "bg-gradient-to-br from-black/60 to-purple-900/20 rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group cursor-pointer"
                    }>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          themeMode === 'light'
                            ? 'bg-gradient-to-r from-red-400/10 to-pink-500/20'
                            : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20'
                        }`}>
                          <span className={`text-xs font-bold ${
                            themeMode === 'light' ? 'text-red-600' : 'text-white'
                          }`}>{stock.symbol[0]}</span>
                        </div>
                        <Badge className={getSentimentBadge(stock.sentiment)}>
                          {stock.sentiment}
                        </Badge>
                      </div>
                      <div className={`text-lg font-bold mb-1 ${themeMode === 'light' ? 'text-[#1A1A1A]' : 'text-white'}`}>{stock.symbol}</div>
                      <div className={`text-sm mb-2 ${themeMode === 'light' ? 'text-[#9CA3AF]' : 'text-gray-400'}`}>{stock.name}</div>
                      <div className={`text-xl font-bold mb-1 ${themeMode === 'light' ? 'text-[#1A1A1A]' : 'text-white'}`}>${stock.price}</div>
                      <div className={cn(
                        "flex items-center gap-1 text-sm font-medium",
                        stock.change >= 0 ? "text-emerald-400" : "text-red-400"
                      )}>
                        {stock.change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
                        </Card>

            {/* Smart News Feed */}
            <Card className={themeMode === 'light' ? `${cardBackground} border ${borderColor} shadow-[0_2px_6px_rgba(0,0,0,0.05)]` : "bg-black/40 border-purple-500/20 backdrop-blur-xl"}>
              <CardHeader className={themeMode === 'light' ? `border-b ${borderColor}` : "border-b border-purple-500/20"}>
                <CardTitle className={`flex items-center gap-2 ${themeMode === 'light' ? 'text-[#1A1A1A]' : 'text-white'}`}>
                  <Newspaper className={`w-6 h-6 ${themeMode === 'light' ? 'text-[#3F51B5]' : 'text-cyan-400'}`} />
                  Smart News Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {smartNews.map((news, index) => (
                    <div key={index} className={themeMode === 'light'
                      ? `bg-white rounded-xl p-5 border border-[#E6E6E6] hover:border-red-400/30 transition-all duration-300 group cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]`
                      : "bg-gradient-to-br from-black/60 to-purple-900/20 rounded-xl p-5 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group cursor-pointer"
                    }>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold mb-2 line-clamp-2 transition-colors ${
                            themeMode === 'light'
                              ? 'text-[#1A1A1A] group-hover:text-red-600'
                              : 'text-white group-hover:text-purple-300'
                          }`}>
                            {news.headline}
                          </h3>
                          <p className={`text-sm leading-relaxed line-clamp-3 ${
                            themeMode === 'light' ? 'text-[#4B5563]' : 'text-gray-400'
                          }`}>
                            {news.summary}
                          </p>
                        </div>
                        <Badge className={cn(
                          "ml-4 flex-shrink-0 text-xs font-medium px-3 py-1 rounded-full",
                          themeMode === 'light'
                            ? news.sentiment === 'bullish' ? 'sentiment-positive sentiment-positive-bg' :
                              news.sentiment === 'bearish' ? 'sentiment-negative sentiment-negative-bg' :
                              'sentiment-neutral sentiment-neutral-bg'
                            : news.sentiment === 'bullish' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                              news.sentiment === 'bearish' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                              'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        )}>
                          {news.sentiment === 'bullish' ? '🟢 Bullish' :
                           news.sentiment === 'bearish' ? '🔴 Bearish' :
                           '🟡 Neutral'}
                        </Badge>
                      </div>
                      <div className={`flex items-center justify-between text-xs ${
                        themeMode === 'light' ? 'text-[#9CA3AF]' : 'text-gray-500'
                      }`}>
                        <span className="font-medium">{news.source}</span>
                        <span>{news.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* MoodTrendChart Widget - Full Width */}
            <div className="w-full">
              <MoodTrendChart
                data={moodTrendData}
                timeframe={selectedTimeframe}
                setTimeframe={setSelectedTimeframe}
              />
            </div>

            {/* Trending Forum Topics */}
            <Card className={themeMode === 'light' ? `${cardBackground} border ${borderColor} shadow-[0_2px_6px_rgba(0,0,0,0.05)]` : "bg-black/40 border-purple-500/20 backdrop-blur-xl"}>
              <CardHeader className={themeMode === 'light' ? `border-b ${borderColor}` : "border-b border-purple-500/20"}>
                                <CardTitle className={`flex items-center gap-2 ${themeMode === 'light' ? 'text-[#1A1A1A]' : 'text-white'}`}>
                  <Flame className={`w-6 h-6 ${themeMode === 'light' ? 'text-[#F44336]' : 'text-orange-400'}`} />
                  Trending Forum Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className={themeMode === 'light'
                      ? `bg-white rounded-xl p-4 border border-[#E6E6E6] hover:border-red-400/30 transition-all duration-300 shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]`
                      : "bg-gradient-to-br from-black/60 to-purple-900/20 rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                    }>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{topic.icon}</span>
                        <Badge className={getTrendingBadge(topic.label)}>
                          {topic.label}
                        </Badge>
                      </div>
                      <div className={`text-lg font-semibold mb-1 ${themeMode === 'light' ? 'text-[#1A1A1A]' : 'text-white'}`}>{topic.topic}</div>
                      <div className={`text-sm ${themeMode === 'light' ? 'text-[#9CA3AF]' : 'text-gray-400'}`}>{topic.mentions} mentions</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Your Mood Score Card */}
            <Card className={themeMode === 'light' ? `${cardBackground} border ${borderColor} shadow-[0_2px_6px_rgba(0,0,0,0.05)]` : "bg-black/40 border-purple-500/20 backdrop-blur-xl"}>
              <CardHeader className={themeMode === 'light' ? `border-b ${borderColor}` : "border-b border-purple-500/20"}>
                <CardTitle className={`text-sm ${themeMode === 'light' ? 'text-[#1A1A1A]' : 'text-white'}`}>Your Mood Score</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className={`text-4xl font-bold mb-2 ${
                    themeMode === 'light'
                      ? 'bg-gradient-to-r from-[#4CAF50] to-[#3F51B5] bg-clip-text text-transparent'
                      : 'bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'
                  }`}>
                    +64
                  </div>
                  <div className={`text-sm mb-4 ${themeMode === 'light' ? 'text-[#4CAF50]' : 'text-emerald-400'}`}>Based on your watchlist</div>
                  <div className="space-y-2 mb-4">
                    {userWatchlist.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className={themeMode === 'light' ? 'text-[#4B5563]' : 'text-gray-300'}>{item.symbol}</span>
                        <span className={cn(
                          "font-medium",
                          item.change >= 0
                            ? themeMode === 'light' ? "text-[#4CAF50]" : "text-emerald-400"
                            : themeMode === 'light' ? "text-[#F44336]" : "text-red-400"
                        )}>
                          {item.change >= 0 ? '+' : ''}{item.change}%
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button className={themeMode === 'light'
                    ? "w-full bg-red-500 hover:bg-red-600 text-white border border-red-500 hover:border-red-600 transition-all font-medium"
                    : "w-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-300 border border-purple-500/30"
                  }>
                    <Plus className="w-4 h-4 mr-2" />
                    Add/Remove Ticker
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Footer Status */}
            <div className="text-center">
              <Badge className={themeMode === 'light'
                ? "bg-[#E8F8F4] text-[#22AB94] border-[#22AB94]/30"
                : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
              }>
                Mood Score API: ✅ Live
              </Badge>
            </div>
                    </div>
        </div>
          </>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
                .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
};
