import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Bell,
  BellRing,
  Users,
  Star,
  Trophy,
  Target,
  Calendar,
  MapPin,
  Globe,
  CheckCircle,
  Award,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  UserPlus,
  MessageCircle,
  Heart,
  Pin,
  Filter,
  ArrowUpCircle,
  ArrowDownCircle,
  MoreHorizontal,
  Zap,
  Brain,
  Shield,
  Eye,
  Flame,
  FileText,
  Briefcase,
  LineChart,
  Wallet,
  Settings,
  Play,
  Pause,
  ArrowLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PostCard, type PostCardData } from "../social/PostCard";
import type { User, UserPost } from "@/types/user";
import { getMockUserData, getUserProfileBreadcrumb } from "@/utils/profileNavigation";
import { PurchaseHistory } from "./PurchaseHistory";

interface TraderProfileProps {
  userId?: string;
  isCurrentUser?: boolean;
  onNavigateBack?: () => void;
}

interface TradeHistoryItem {
  id: string;
  ticker: string;
  entryPrice: number;
  exitPrice?: number;
  pnlPercentage?: number;
  notes: string;
  date: Date;
  status: 'open' | 'closed';
  assetType: 'stock' | 'crypto' | 'options';
}

interface SentimentCall {
  id: string;
  ticker: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  note: string;
  timestamp: Date;
  accuracy?: 'correct' | 'incorrect' | 'pending';
}

interface PortfolioHolding {
  ticker: string;
  percentage: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  value: number;
}

export const TraderProfile = ({ userId, isCurrentUser = false, onNavigateBack }: TraderProfileProps) => {
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [tradeFilter, setTradeFilter] = useState("all");
  const [dynamicMode, setDynamicMode] = useState(false);
  const [watchlistIndex, setWatchlistIndex] = useState(0);
  
  // Get user data - in real app, fetch based on userId
  const resolvedUserId = userId || "user-cryptowolf";
  const mockUserData = getMockUserData(resolvedUserId);

  const traderUser: User = {
    id: resolvedUserId,
    email: `${mockUserData?.username || "trader"}@example.com`,
    username: mockUserData?.username || "cryptowolf",
    firstName: mockUserData?.firstName || "Alex",
    lastName: mockUserData?.lastName || "Thompson",
    avatar: mockUserData?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces",
    bio: "Professional trader with 8+ years experience in crypto and tech stocks. Focus on momentum trading and sentiment analysis. 🚀",
    location: "New York, NY",
    website: `https://${mockUserData?.username || "cryptowolf"}.trading`,
    isVerified: mockUserData?.verified || true,
    isPremium: mockUserData?.premium || true,
    createdAt: new Date("2021-03-15"),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
    preferences: {} as any,
    stats: {
      id: "1",
      userId: resolvedUserId,
      totalLogins: 245,
      totalPredictions: 186,
      accurateePredictions: 152,
      accuracyRate: 94.7,
      currentStreak: 28,
      longestStreak: 45,
      totalPointsEarned: 8450,
      badgesEarned: ["top_trader", "accuracy_master", "streak_king"],
      lastPredictionAt: new Date(),
      updatedAt: new Date()
    }
  };

  // Top watchlist tickers for auto-scroll
  const watchlistTickers = [
    { symbol: "NVDA", price: 875.28, change: 4.2 },
    { symbol: "TSLA", price: 248.42, change: -1.8 },
    { symbol: "AAPL", price: 185.64, change: 2.1 },
    { symbol: "BTC", price: 42850, change: 3.7 },
    { symbol: "MSFT", price: 374.58, change: 0.9 },
  ];

  // Auto-scroll watchlist
  useEffect(() => {
    const interval = setInterval(() => {
      setWatchlistIndex((prev) => (prev + 1) % watchlistTickers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Mock posts converted to PostCard format
  const mockPosts: PostCardData[] = [
    {
      id: "1",
      user: {
        id: traderUser.id,
        username: traderUser.username,
        handle: `@${traderUser.username}`,
        avatar: traderUser.avatar || "",
        verified: traderUser.isVerified,
        premium: traderUser.isPremium,
        credibilityScore: traderUser.stats.accuracyRate,
        topPercentage: 1,
      },
      timestamp: "2 hours ago",
      content: "🔥 $NVDA is showing incredible momentum with AI sector rally. Volume spike confirms institutional buying. This could easily hit $900 before Q1 ends. What are your thoughts? 🧠",
      tickers: [
        { symbol: "NVDA", price: 875.28, change: 35.42, changePercent: 4.23 }
      ],
      sentiment: "Bullish",
      tags: ["AI Momentum"],
      categories: ["AI", "Prediction"],
      engagement: { likes: 247, comments: 68, reposts: 34, saves: 89, views: 3421 },
      isFollowing: false,
      alertsEnabled: false,
      isLiked: false,
      isSaved: false,
      isReposted: false,
      isPinned: true,
      isTrending: true,
    },
    {
      id: "2",
      user: {
        id: traderUser.id,
        username: traderUser.username,
        handle: `@${traderUser.username}`,
        avatar: traderUser.avatar || "",
        verified: traderUser.isVerified,
        premium: traderUser.isPremium,
        credibilityScore: traderUser.stats.accuracyRate,
        topPercentage: 1,
      },
      timestamp: "6 hours ago",
      content: "Market volatility is creating some interesting opportunities. 🧊 Fear & Greed index at 72 - market getting overheated. Expecting a pullback in tech names. Taking profits on $AAPL and $MSFT positions.",
      tickers: [
        { symbol: "AAPL", price: 185.64, change: -2.87, changePercent: -1.52 },
        { symbol: "MSFT", price: 374.58, change: -4.12, changePercent: -1.09 }
      ],
      sentiment: "Bearish",
      tags: ["Risk Management"],
      categories: ["Market Analysis", "Risk Management"],
      engagement: { likes: 156, comments: 42, reposts: 18, saves: 67, views: 2103 },
      isFollowing: false,
      alertsEnabled: false,
      isLiked: false,
      isSaved: false,
      isReposted: false,
    },
  ];

  const mockTrades: TradeHistoryItem[] = [
    {
      id: "1",
      ticker: "NVDA",
      entryPrice: 128.50,
      exitPrice: 142.30,
      pnlPercentage: 10.74,
      notes: "AI rally momentum play",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'closed',
      assetType: 'stock'
    },
    {
      id: "2",
      ticker: "BTC",
      entryPrice: 43200,
      exitPrice: 45800,
      pnlPercentage: 6.02,
      notes: "ETF approval momentum",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'closed',
      assetType: 'crypto'
    },
    {
      id: "3",
      ticker: "TSLA",
      entryPrice: 242.00,
      notes: "Oversold bounce play",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'open',
      assetType: 'stock'
    }
  ];

  const mockSentimentCalls: SentimentCall[] = [
    {
      id: "1",
      ticker: "AAPL",
      sentiment: "bullish",
      confidence: 85,
      note: "iPhone 15 sales exceeding expectations",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      accuracy: "correct"
    },
    {
      id: "2", 
      ticker: "AMZN",
      sentiment: "bearish",
      confidence: 72,
      note: "AWS growth concerns in Q4",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      accuracy: "pending"
    },
    {
      id: "3",
      ticker: "META",
      sentiment: "neutral",
      confidence: 60,
      note: "Mixed signals on VR adoption",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      accuracy: "incorrect"
    }
  ];

  const mockPortfolio: PortfolioHolding[] = [
    { ticker: "NVDA", percentage: 25, sentiment: "bullish", value: 12500 },
    { ticker: "BTC", percentage: 20, sentiment: "bullish", value: 10000 },
    { ticker: "AAPL", percentage: 15, sentiment: "neutral", value: 7500 },
    { ticker: "TSLA", percentage: 15, sentiment: "bearish", value: 7500 },
    { ticker: "MSFT", percentage: 10, sentiment: "bullish", value: 5000 },
    { ticker: "Cash", percentage: 15, sentiment: "neutral", value: 7500 }
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'bearish': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="h-4 w-4" />;
      case 'bearish': return <TrendingDown className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const getAccuracyBadge = (accuracy?: string) => {
    switch (accuracy) {
      case 'correct': return <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">✓ Correct</Badge>;
      case 'incorrect': return <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">✗ Incorrect</Badge>;
      default: return <Badge variant="secondary">⏳ Pending</Badge>;
    }
  };

  const winRate = mockTrades.filter(t => t.status === 'closed' && (t.pnlPercentage || 0) > 0).length / 
                   mockTrades.filter(t => t.status === 'closed').length * 100;
  const avgGain = mockTrades.filter(t => t.status === 'closed').reduce((acc, t) => acc + (t.pnlPercentage || 0), 0) /
                  mockTrades.filter(t => t.status === 'closed').length;

  const currentTicker = watchlistTickers[watchlistIndex];

  return (
    <div className={`min-h-screen transition-all duration-1000 ${
      dynamicMode 
        ? "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 animate-pulse" 
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    }`}>
      {/* Aurora Background Animation */}
      {dynamicMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-bounce"></div>
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto space-y-6 p-6">
        {/* Back Navigation */}
        {!isCurrentUser && onNavigateBack && (
          <Button
            variant="outline"
            onClick={onNavigateBack}
            className="mb-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Community
          </Button>
        )}

        {/* Modern Header Section */}
        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-cyan-500/5"></div>
          <CardContent className="relative p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 relative z-10">
              {/* Avatar with Gradient Ring */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative flex-shrink-0">
                  <div className={`rounded-full ${traderUser.isPremium ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'} p-1 shadow-xl hover:shadow-2xl transition-shadow duration-300`}>
                    <div className="w-36 h-36 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-300">
                      <Avatar className="w-32 h-32">
                        <AvatarImage src={traderUser.avatar} alt={traderUser.username} />
                        <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                          {traderUser.firstName?.[0]}{traderUser.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 text-center sm:text-left flex-1 min-w-0">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold flex items-center gap-3 justify-center sm:justify-start">
                      {traderUser.firstName} {traderUser.lastName}
                      {traderUser.isVerified && (
                        <CheckCircle className="h-6 w-6 text-blue-500" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDynamicMode(!dynamicMode)}
                        className="ml-2 p-1 h-6 w-6"
                      >
                        {dynamicMode ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </h1>
                    <p className="text-xl text-muted-foreground">@{traderUser.username}</p>
                    <p className="text-base leading-relaxed max-w-md">{traderUser.bio}</p>
                  </div>
                  
                  {/* Glowing Pills */}
                  <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm hover:shadow-lg transition-all cursor-pointer">
                            <Brain className="h-4 w-4 mr-2" />
                            🔥 Top 1%
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ranked in the top 1% of all traders by accuracy</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 text-sm hover:shadow-lg transition-all cursor-pointer">
                            <Target className="h-4 w-4 mr-2" />
                            🎯 Momentum Expert
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Specialized in momentum trading strategies</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {traderUser.isVerified && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm hover:shadow-lg transition-all cursor-pointer">
                              <Shield className="h-4 w-4 mr-2" />
                              👨‍🏫 Verified Educator
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Verified financial educator and analyst</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>

                  {/* Live Watchlist Ticker */}
                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 min-w-[280px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Top Watchlist:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">${currentTicker.symbol}</span>
                        <span className="font-semibold">${currentTicker.price.toLocaleString()}</span>
                        <span className={`text-sm font-medium ${currentTicker.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {currentTicker.change >= 0 ? '+' : ''}{currentTicker.change}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 bg-gray-300 dark:bg-gray-600 rounded-full h-1">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-3000"
                        style={{ width: `${((watchlistIndex + 1) / watchlistTickers.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {traderUser.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{traderUser.location}</span>
                      </div>
                    )}
                    {traderUser.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <a href={traderUser.website} target="_blank" rel="noopener noreferrer" 
                           className="hover:text-primary transition-colors">
                          {traderUser.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {traderUser.createdAt.toLocaleDateString('en-US', { 
                        year: 'numeric', month: 'long' 
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mood Score Alignment Bar */}
              <div className="flex-1 space-y-4">
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Mood Score Alignment</span>
                        <span className="text-sm text-muted-foreground">94% sync with top traders</span>
                      </div>
                      <Progress value={94} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Your sentiment closely aligns with other top-performing traders
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                {!isCurrentUser && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`px-8 py-3 text-lg ${isFollowing 
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all'
                      }`}
                    >
                      <UserPlus className="h-5 w-5 mr-2" />
                      {isFollowing ? 'Following' : 'Follow & Sync'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setAlertsEnabled(!alertsEnabled)}
                      className={`px-8 py-3 text-lg border-2 ${alertsEnabled 
                        ? 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100' 
                        : 'hover:bg-blue-50 hover:border-blue-300'
                      }`}
                    >
                      {alertsEnabled ? <BellRing className="h-5 w-5 mr-2" /> : <Bell className="h-5 w-5 mr-2" />}
                      {alertsEnabled ? 'Alerts On' : 'Get Alerts'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Floating Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">{traderUser.stats.accuracyRate}%</div>
              <div className="text-sm opacity-90">Accuracy Rate</div>
              <div className="mt-2 h-1 bg-white/20 rounded">
                <div className="h-1 bg-white rounded" style={{ width: `${traderUser.stats.accuracyRate}%` }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">{traderUser.stats.currentStreak}</div>
              <div className="text-sm opacity-90">Current Streak</div>
              <div className="mt-2 h-1 bg-white/20 rounded">
                <div className="h-1 bg-white rounded" style={{ width: `${(traderUser.stats.currentStreak / traderUser.stats.longestStreak) * 100}%` }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">2.8K</div>
              <div className="text-sm opacity-90">Followers</div>
              <div className="mt-2 flex justify-center">
                <Users className="h-5 w-5 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">{winRate.toFixed(0)}%</div>
              <div className="text-sm opacity-90">Win Rate</div>
              <div className="mt-2 flex justify-center">
                <Trophy className="h-5 w-5 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Icon-Based Navigation */}
        <div className="sticky top-16 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border-0 shadow-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 h-16 bg-transparent">
              <TabsTrigger 
                value="posts" 
                className="flex flex-col items-center gap-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-sm font-medium h-full rounded-xl transition-all"
              >
                <FileText className="h-5 w-5" />
                Posts
              </TabsTrigger>
              <TabsTrigger 
                value="trades" 
                className="flex flex-col items-center gap-1 data-[state=active]:bg-green-500 data-[state=active]:text-white text-sm font-medium h-full rounded-xl transition-all"
              >
                <LineChart className="h-5 w-5" />
                History
              </TabsTrigger>
              <TabsTrigger 
                value="sentiment" 
                className="flex flex-col items-center gap-1 data-[state=active]:bg-purple-500 data-[state=active]:text-white text-sm font-medium h-full rounded-xl transition-all"
              >
                <Brain className="h-5 w-5" />
                Insights
              </TabsTrigger>
              <TabsTrigger
                value="portfolio"
                className="flex flex-col items-center gap-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm font-medium h-full rounded-xl transition-all"
              >
                <Briefcase className="h-5 w-5" />
                Portfolio
              </TabsTrigger>
              <TabsTrigger
                value="purchases"
                className="flex flex-col items-center gap-1 data-[state=active]:bg-rose-500 data-[state=active]:text-white text-sm font-medium h-full rounded-xl transition-all"
              >
                <Wallet className="h-5 w-5" />
                Purchases
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <div className="mt-6">
              {/* Posts Tab */}
              <TabsContent value="posts" className="space-y-4">
                {mockPosts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post}
                    showEngagementCounts={true}
                  />
                ))}
              </TabsContent>

              {/* Trade History Tab */}
              <TabsContent value="trades" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-green-600">{winRate.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Win Rate</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600">+{avgGain.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Avg Gain</div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Trade History</CardTitle>
                      <Select value={tradeFilter} onValueChange={setTradeFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Trades</SelectItem>
                          <SelectItem value="stock">Stocks</SelectItem>
                          <SelectItem value="crypto">Crypto</SelectItem>
                          <SelectItem value="options">Options</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockTrades
                        .filter(trade => tradeFilter === 'all' || trade.assetType === tradeFilter)
                        .map((trade) => (
                        <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all">
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="uppercase font-mono">{trade.ticker}</Badge>
                            <div>
                              <p className="font-medium">${trade.entryPrice.toFixed(2)}</p>
                              <p className="text-sm text-muted-foreground">Entry</p>
                            </div>
                            {trade.exitPrice && (
                              <div>
                                <p className="font-medium">${trade.exitPrice.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">Exit</p>
                              </div>
                            )}
                            {trade.pnlPercentage && (
                              <Badge className={trade.pnlPercentage > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                {trade.pnlPercentage > 0 ? '+' : ''}{trade.pnlPercentage.toFixed(1)}%
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{trade.notes}</p>
                            <p className="text-xs text-muted-foreground">{trade.date.toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sentiment Calls Tab */}
              <TabsContent value="sentiment" className="space-y-4">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      AI-Powered Sentiment Calls
                    </CardTitle>
                    <CardDescription>Sentiment predictions with real-time accuracy tracking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockSentimentCalls.map((call) => (
                        <div key={call.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all">
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="uppercase font-mono">{call.ticker}</Badge>
                            <div className="flex items-center gap-2">
                              <Badge className={getSentimentColor(call.sentiment)}>
                                {getSentimentIcon(call.sentiment)}
                                <span className="ml-1 capitalize">{call.sentiment}</span>
                              </Badge>
                              <span className="text-sm text-muted-foreground">{call.confidence}% confidence</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{call.note}</p>
                              <p className="text-xs text-muted-foreground">{call.timestamp.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getAccuracyBadge(call.accuracy)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Portfolio Tab */}
              <TabsContent value="portfolio" className="space-y-4">
                {traderUser.isPremium ? (
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Portfolio Allocation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockPortfolio.map((holding) => (
                          <div key={holding.ticker} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all">
                            <div className="flex items-center gap-3">
                              <span className="font-medium w-16">{holding.ticker}</span>
                              <Badge className={getSentimentColor(holding.sentiment)} variant="outline">
                                {getSentimentIcon(holding.sentiment)}
                                <span className="ml-1 capitalize">{holding.sentiment}</span>
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-medium">{holding.percentage}%</p>
                                <p className="text-sm text-muted-foreground">${holding.value.toLocaleString()}</p>
                              </div>
                              <div className="w-20">
                                <Progress value={holding.percentage} className="h-2" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-12 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Award className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-2">Premium Feature</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Unlock portfolio insights, real-time allocation tracking, and advanced analytics with Premium.
                      </p>
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3 text-lg">
                        Upgrade to Premium
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Purchases Tab */}
              <TabsContent value="purchases" className="space-y-4">
                <PurchaseHistory />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
