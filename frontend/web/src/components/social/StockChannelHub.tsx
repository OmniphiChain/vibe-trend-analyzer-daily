import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TrendingTickerBar } from "./TrendingTickerBar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import {
  Search,
  TrendingUp,
  TrendingDown,
  MessageCircle,
  ThumbsUp,
  Pin,
  MessageSquare,
  Heart,
  Share,
  MoreHorizontal,
  Bell,
  Settings,
  Hash,
  ChevronRight,
  Users,
  Activity,
  Trophy,
  Target,
  Brain,
  Rocket,
  AlertTriangle,
  Flame,
  Plus,
} from "lucide-react";
import { formatCurrency, cn } from "../../lib/utils";
import { ShareMoodModal, MoodPostDisplay } from "./ShareMoodModal";
import { PostInteractionBar } from "./PostInteractionBar";
import {
  CheckCircle,
  Award,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface StockChannel {
  ticker: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  sentiment: "bullish" | "bearish" | "neutral";
  messageCount: number;
  engagementCount: number;
  isActive?: boolean;
}

interface StockMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  timestamp: Date;
  content: string;
  sentiment: "bullish" | "bearish" | "neutral";
  badges: string[];
  likes: number;
  comments: number;
  isPinned?: boolean;
  tickers: string[];
  type?: 'message' | 'mood';
  credibilityScore?: number;
  needsReview?: boolean;
  communityFavorite?: boolean;
  moodData?: {
    mood: {
      id: string;
      label: string;
      emoji: string;
      color: string;
      score: number;
    };
    tickers: string[];
  };
}

interface TrendingTicker {
  ticker: string;
  companyName: string;
  change: number;
  changePercent: number;
  volume: number;
}

interface TopPoster {
  username: string;
  avatar: string;
  points: number;
  accuracy: number;
  badge: string;
}

export const StockChannelHub: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<StockChannel | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<StockMessage[]>([]);

  // Interaction handlers
  const handleFollow = (userId: string) => {
    console.log(`Following user: ${userId}`);
  };

  const handleUnfollow = (userId: string) => {
    console.log(`Unfollowing user: ${userId}`);
  };

  const handleToggleAlerts = (userId: string, enabled: boolean) => {
    console.log(`${enabled ? 'Enabling' : 'Disabling'} alerts for user: ${userId}`);
  };

  // Utility functions
  const getCredibilityColor = (score: number) => {
    if (score >= 9.0) return "text-purple-600 bg-purple-100 dark:bg-purple-900/20";
    if (score >= 8.0) return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
    if (score >= 7.0) return "text-green-600 bg-green-100 dark:bg-green-900/20";
    if (score >= 6.0) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
    return "text-red-600 bg-red-100 dark:bg-red-900/20";
  };

  // Mock stock channels data
  const stockChannels: StockChannel[] = [
    {
      ticker: "TSLA",
      companyName: "Tesla Inc",
      price: 248.5,
      change: 12.85,
      changePercent: 5.46,
      sentiment: "bullish",
      messageCount: 15420,
      engagementCount: 1847,
      isActive: true,
    },
    {
      ticker: "AAPL",
      companyName: "Apple Inc",
      price: 189.25,
      change: -2.15,
      changePercent: -1.12,
      sentiment: "neutral",
      messageCount: 8934,
      engagementCount: 923,
    },
    {
      ticker: "NVDA",
      companyName: "NVIDIA Corp",
      price: 891.34,
      change: 23.67,
      changePercent: 2.73,
      sentiment: "bullish",
      messageCount: 12683,
      engagementCount: 2156,
    },
    {
      ticker: "MSFT",
      companyName: "Microsoft Corp",
      price: 378.85,
      change: -5.42,
      changePercent: -1.41,
      sentiment: "bearish",
      messageCount: 6245,
      engagementCount: 734,
    },
    {
      ticker: "GOOGL",
      companyName: "Alphabet Inc",
      price: 142.56,
      change: 1.83,
      changePercent: 1.3,
      sentiment: "bullish",
      messageCount: 4567,
      engagementCount: 589,
    },
  ];

  // Mock messages for the selected channel
  const channelMessages: StockMessage[] = [
    {
      id: "1",
      userId: "user-tech-bull-2024",
      username: "TechBull2024",
      avatar: "/api/placeholder/32/32",
      timestamp: new Date(Date.now() - 300000),
      content:
        "$TSLA breaking above $245 resistance! This could be the start of the next leg up 🚀 Volume is looking healthy",
      sentiment: "bullish",
      badges: ["Verified", "Diamond Hands"],
      likes: 47,
      comments: 12,
      isPinned: true,
      tickers: ["$TSLA"],
      credibilityScore: 9.2,
      needsReview: false,
      communityFavorite: true,
    },
    {
      id: "2",
      userId: "user-market-mood",
      username: "MarketMood",
      avatar: "/api/placeholder/32/32",
      timestamp: new Date(Date.now() - 180000),
      content: "NVDA is absolutely crushing it! The AI momentum is unstoppable. My portfolio is loving this bull run! 🤑",
      sentiment: "bullish",
      badges: ["Premium"],
      likes: 23,
      comments: 5,
      tickers: ["$NVDA"],
      type: 'mood',
      moodData: {
        mood: {
          id: 'extreme-greed',
          label: 'Extreme Greed',
          emoji: '🤑',
          color: 'from-green-500 to-green-600',
          score: 90
        },
        tickers: ['$NVDA', '$MSFT']
      },
      credibilityScore: 8.5,
      needsReview: false,
      communityFavorite: false,
    },
    {
      id: "3",
      userId: "user-chart-master",
      username: "ChartMaster",
      avatar: "/api/placeholder/32/32",
      timestamp: new Date(Date.now() - 600000),
      content:
        "Technical analysis on $TSLA shows strong support at $240. If we hold above this level, next target is $280. RSI looking good for continuation.",
      sentiment: "bullish",
      badges: ["Pro Trader"],
      likes: 34,
      comments: 8,
      tickers: ["$TSLA"],
      credibilityScore: 7.8,
      needsReview: true,
      communityFavorite: false,
    },
    {
      id: "4",
      username: "BearishBetty",
      avatar: "/api/placeholder/32/32",
      timestamp: new Date(Date.now() - 900000),
      content:
        "Not convinced about this rally. Volume is decreasing and we're seeing some divergence in momentum indicators. Be careful out there!",
      sentiment: "bearish",
      badges: ["Risk Manager"],
      likes: 15,
      comments: 18,
      tickers: ["$TSLA", "$SPY"],
    },
  ];

  useEffect(() => {
    if (stockChannels.length > 0 && !selectedChannel) {
      setSelectedChannel(stockChannels[0]);
    }
  }, []);

  useEffect(() => {
    setMessages(channelMessages);
  }, [selectedChannel]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "text-green-500";
      case "bearish":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "🟢";
      case "bearish":
        return "🔴";
      default:
        return "🟡";
    }
  };

  const handleMoodPost = (moodPost: any) => {
    const newMessage: StockMessage = {
      id: `mood-${Date.now()}`,
      username: "CurrentUser", // This would come from auth context
      avatar: "/api/placeholder/32/32",
      timestamp: moodPost.timestamp,
      content: moodPost.content,
      sentiment: moodPost.mood.score >= 70 ? "bullish" : moodPost.mood.score <= 30 ? "bearish" : "neutral",
      badges: ["Mood Tracker"],
      likes: 0,
      comments: 0,
      tickers: moodPost.tickers,
      type: 'mood',
      moodData: {
        mood: moodPost.mood,
        tickers: moodPost.tickers
      }
    };

    setMessages(prev => [newMessage, ...prev]);
  };

  const filteredChannels = stockChannels.filter(
    (channel) =>
      channel.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.companyName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

    return (
      <div className="flex flex-col h-full min-h-[600px]">
        {/* Trending Ticker Bar */}
        <TrendingTickerBar />
        {/* Main Chat Interface */}
        <div className="flex h-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Left Sidebar - Stock Channels */}
        <div className="w-fit pr-[3%] max-w-[220px] bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col min-h-0">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              # Stock Channels
            </h2>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search tickers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Channels List */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-2 space-y-1">
              {filteredChannels.map((channel) => {
                const isGainer = channel.change >= 0;
                const isSelected = selectedChannel?.ticker === channel.ticker;
                
                return (
                <div
                  key={channel.ticker}
                  onClick={() => setSelectedChannel(channel)}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition-all duration-200 border",
                    // Base styling based on gain/loss  
                    isGainer 
                      ? "bg-[#D1FADF] border-[#A7F3D0] hover:bg-[#BBFACA]" 
                      : "bg-[#FEE2E2] border-[#FCA5A5] hover:bg-[#FDD4D4]",
                    // Dark mode styling
                    "dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700",
                    // Selected state
                    isSelected && "ring-2 ring-blue-400 ring-opacity-50",
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1F2937] dark:text-white">
                        ${channel.ticker}
                      </span>
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          channel.sentiment === "bullish"
                            ? "bg-[#10B981]"
                            : channel.sentiment === "bearish"
                              ? "bg-[#EF4444]"
                              : "bg-[#FBBF24]",
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isGainer ? "text-[#027A48]" : "text-[#991B1B]",
                      )}
                    >
                      {channel.change >= 0 ? "+" : ""}
                      {channel.changePercent.toFixed(2)}%
                    </span>
                  </div>

                  <div className="text-xs text-[#4B5563] dark:text-gray-400 mb-2">
                    {channel.companyName}
                  </div>

                  <div className="text-sm font-medium text-[#1F2937] dark:text-white mb-2">
                    {formatCurrency(channel.price)}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-[#4B5563] dark:text-gray-400">
                      <MessageCircle className="w-3 h-3 text-[#9CA3AF]" />
                      {channel.messageCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-[#4B5563] dark:text-gray-400">
                      <ThumbsUp className="w-3 h-3 text-[#9CA3AF]" />
                      {channel.engagementCount.toLocaleString()}
                    </span>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Feed - Ticker Chatroom */}
        <div className="flex-1 flex flex-col min-h-0" style={{ flexGrow: 2 }}>
          {selectedChannel && (
            <>
              {/* Channel Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Hash className="w-6 h-6 text-blue-500" />
                    <div>
                      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        ${selectedChannel.ticker} - {selectedChannel.companyName}
                      </h1>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Discuss ${selectedChannel.ticker} trades, news, and
                        analysis
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(selectedChannel.price)}
                      </div>
                      <div
                        className={cn(
                          "text-sm font-medium",
                          selectedChannel.change >= 0
                            ? "text-green-500"
                            : "text-red-500",
                        )}
                      >
                        {selectedChannel.change >= 0 ? "+" : ""}
                        {selectedChannel.change.toFixed(2)} (
                        {selectedChannel.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Bell className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Rules Bar */}
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  <span>📝 Use cashtags</span>
                  <span>🚫 No spam</span>
                  <span>💡 Quality ideas</span>
                </div>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[550px] max-h-none lg:max-h-[600px]">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    {message.isPinned && (
                      <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 mb-1">
                        <Pin className="w-3 h-3" />
                        <span>Pinned Message</span>
                      </div>
                    )}

                    {message.type === 'mood' && message.moodData ? (
                      <MoodPostDisplay
                        post={{
                          mood: message.moodData.mood,
                          content: message.content,
                          tickers: message.moodData.tickers,
                          timestamp: message.timestamp
                        }}
                        user={{ username: message.username, avatar: message.avatar }}
                        onLike={() => {}}
                        onComment={() => {}}
                      />
                    ) : (
                      <div className="flex gap-3">
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarImage
                            src={message.avatar}
                            alt={message.username}
                          />
                          <AvatarFallback>{message.username[0]}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm text-gray-900 dark:text-white">
                                {message.username}
                              </span>

                              {/* Verification Icon */}
                              {message.badges.includes("Verified") && (
                                <CheckCircle className="h-4 w-4 text-blue-500" />
                              )}

                              {/* Credibility Score */}
                              {message.credibilityScore && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge
                                        className={`text-xs px-2 py-0.5 font-semibold ${getCredibilityColor(message.credibilityScore)}`}
                                      >
                                        {message.credibilityScore.toFixed(1)}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Credibility Score: {message.credibilityScore.toFixed(1)}/10.0</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}

                              {/* Sentiment Badge */}
                              <span
                                className={cn(
                                  "text-xs",
                                  getSentimentColor(message.sentiment),
                                )}
                              >
                                {getSentimentIcon(message.sentiment)}{" "}
                                {message.sentiment}
                              </span>

                              {/* User Badges */}
                              {message.badges.filter(badge => badge !== "Verified").map((badge, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700 font-medium"
                                >
                                  {badge}
                                </Badge>
                              ))}

                              {/* Needs Review Badge */}
                              {message.needsReview && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 text-xs px-2 py-0.5">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        Needs Review
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>This message requires community review</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}

                              {/* Community Favorite Badge */}
                              {message.communityFavorite && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 text-xs px-2 py-0.5">
                                        <Award className="h-3 w-3 mr-1" />
                                        Community Favorite
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Highly appreciated by the community</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}

                              <span className="text-xs text-gray-500">
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>

                            {/* Post Interaction Bar for Live Chat Messages */}
                            <PostInteractionBar
                              userId={message.userId}
                              username={message.username}
                              compact={true}
                              onFollow={handleFollow}
                              onUnfollow={handleUnfollow}
                              onToggleAlerts={handleToggleAlerts}
                              className="opacity-60 hover:opacity-100 transition-opacity"
                            />
                          </div>

                          <p className="text-sm text-gray-800 dark:text-gray-200 mb-2 break-words leading-relaxed">
                            {message.content}
                          </p>

                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 px-2"
                            >
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              {message.likes}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 px-2"
                            >
                              <MessageSquare className="w-3 h-3 mr-1" />
                              {message.comments}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 px-2"
                            >
                              <Pin className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <Separator />
                  </div>
                ))}
              </div>

              {/* Message Input with Share Mood */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex gap-2 mb-2">
                  <ShareMoodModal onMoodPost={handleMoodPost} />
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Media
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder={`Post your idea... Use $${selectedChannel.ticker} to link stocks`}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    maxLength={150}
                    className="flex-1"
                  />
                  <Button>Post</Button>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {messageInput.length}/150 characters
                </div>
              </div>
            </>
          )}
              </div>
      </div>
      </div>
    );
};
