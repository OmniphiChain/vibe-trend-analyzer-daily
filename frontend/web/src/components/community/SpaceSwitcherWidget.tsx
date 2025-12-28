import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TrendingUp,
  TrendingDown,
  Send,
  Hash,
  Users,
  ThumbsUp,
  MessageSquare,
  Star,
  Shield,
  Zap,
  DollarSign,
  Activity,
  Coffee,
  Image,
  Smile,
  Heart,
  Flame,
  Share2,
  Trophy,
  Pin,
  Award,
  Laugh,
  Eye,
  Upload,
  Camera,
  MoreHorizontal,
} from "lucide-react";
import { useCryptoListings } from "@/hooks/useCoinMarketCap";
import { useAuth } from "@/contexts/AuthContext";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import { UserAvatar } from "../social/UserAvatar";
import { UsernameLink } from "../social/UsernameLink";
import { MentionText } from "../social/MentionText";
import { ProfileNavigationProvider, useProfileNavigation } from "../social/ProfileNavigationProvider";

interface CryptoChannel {
  id: string;
  ticker: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  online: number;
  totalMessages: number;
}

interface CryptoMessage {
  id: string;
  user: {
    name: string;
    avatar: string;
    badge?: string;
  };
  content: string;
  timestamp: string;
  ticker: string;
  sentiment: number;
  likes: number;
  replies: number;
  isPinned?: boolean;
}

interface OffTopicSection {
  id: string;
  name: string;
  description: string;
  icon: string;
  memberCount: number;
  isActive?: boolean;
}

interface OffTopicPost {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  tags?: string[];
  isPinned?: boolean;
  reactions: { emoji: string; count: number }[];
}

interface SpaceSwitcherWidgetProps {
  onNavigateToProfile?: (userId: string) => void;
}

export const SpaceSwitcherWidget: React.FC<SpaceSwitcherWidgetProps> = ({ onNavigateToProfile }) => {
  const { user, isAuthenticated } = useAuth();
  const { themeMode } = useMoodTheme();
  const [activeTab, setActiveTab] = useState("crypto");
  const [selectedChannel, setSelectedChannel] = useState("BTC");
  const [selectedSection, setSelectedSection] = useState("general");
  const [cryptoMessage, setCryptoMessage] = useState("");
  const [offTopicMessage, setOffTopicMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock crypto channels data
  const cryptoChannels: CryptoChannel[] = [
    {
      id: "BTC",
      ticker: "BTC",
      name: "Bitcoin",
      price: 67420.50,
      change24h: 3.2,
      volume: 28500000000,
      online: 1247,
      totalMessages: 15420,
    },
    {
      id: "ETH",
      ticker: "ETH",
      name: "Ethereum",
      price: 3890.75,
      change24h: -1.8,
      volume: 15200000000,
      online: 892,
      totalMessages: 8930,
    },
    {
      id: "DOGE",
      ticker: "DOGE",
      name: "Dogecoin",
      price: 0.385,
      change24h: 8.5,
      volume: 2100000000,
      online: 634,
      totalMessages: 12500,
    },
    {
      id: "SOL",
      ticker: "SOL",
      name: "Solana",
      price: 198.40,
      change24h: 5.7,
      volume: 4800000000,
      online: 423,
      totalMessages: 5680,
    },
  ];

  // Mock crypto messages
  const cryptoMessages: CryptoMessage[] = [
    {
      id: "1",
      user: { name: "CryptoKing", avatar: "/api/placeholder/32/32", badge: "TA Expert" },
      content: "🚀 BTC breaking $67k resistance! Next target $70k. RSI showing healthy pullback from overbought levels.",
      timestamp: "2m",
      ticker: "BTC",
      sentiment: 88,
      likes: 47,
      replies: 12,
      isPinned: true,
    },
    {
      id: "2",
      user: { name: "BlockchainBae", avatar: "/api/placeholder/32/32", badge: "Verified" },
      content: "ETH staking rewards looking solid. 4% APY with the new update 💎",
      timestamp: "5m",
      ticker: "ETH",
      sentiment: 76,
      likes: 23,
      replies: 8,
    },
    {
      id: "3",
      user: { name: "DegenTrader", avatar: "/api/placeholder/32/32" },
      content: "DOGE community pump incoming! Elon tweeted again 🐕🚀",
      timestamp: "7m",
      ticker: "DOGE",
      sentiment: 82,
      likes: 156,
      replies: 34,
    },
  ];

  // Mock off-topic sections
  const offTopicSections: OffTopicSection[] = [
    {
      id: "general",
      name: "General Chat",
      description: "Random discussions and daily vibes",
      icon: "💬",
      memberCount: 2847,
      isActive: true,
    },
    {
      id: "memes",
      name: "Meme Central",
      description: "Trading memes and market humor",
      icon: "😂",
      memberCount: 1923,
    },
    {
      id: "lifestyle",
      name: "Life & Lifestyle",
      description: "Beyond trading - hobbies and life",
      icon: "🌟",
      memberCount: 1156,
    },
  ];

  // Mock off-topic posts
  const offTopicPosts: OffTopicPost[] = [
    {
      id: "1",
      user: { name: "MemeMaster", avatar: "/api/placeholder/32/32", verified: true },
      content: "When you finally understand options trading but your portfolio still looks like abstract art 🎨📉",
      timestamp: "3m",
      likes: 89,
      comments: 24,
      shares: 7,
      tags: ["meme", "options", "portfolio"],
      isPinned: true,
      reactions: [
        { emoji: "😂", count: 45 },
        { emoji: "💀", count: 23 },
        { emoji: "📈", count: 12 },
      ],
    },
    {
      id: "2",
      user: { name: "CoffeeTrader", avatar: "/api/placeholder/32/32" },
      content: "Coffee update: On cup #6. Market stress or caffeine addiction? The world may never know ☕️",
      timestamp: "8m",
      likes: 52,
      comments: 15,
      shares: 3,
      tags: ["coffee", "stress", "mood"],
      reactions: [
        { emoji: "☕", count: 34 },
        { emoji: "😅", count: 18 },
      ],
    },
    {
      id: "3",
      user: { name: "ZenMaster", avatar: "/api/placeholder/32/32" },
      content: "Reminder: The market is emotional, but your decisions don't have to be. Breathe, analyze, execute 🧘‍♂️✨",
      timestamp: "15m",
      likes: 127,
      comments: 31,
      shares: 18,
      tags: ["wisdom", "mindset", "zen"],
      reactions: [
        { emoji: "🙏", count: 67 },
        { emoji: "💎", count: 29 },
        { emoji: "🧘", count: 31 },
      ],
    },
  ];

  const formatPrice = (price: number) => {
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString()}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`;
    return `$${volume.toLocaleString()}`;
  };

  const selectedChannelData = cryptoChannels.find(c => c.id === selectedChannel);
  const selectedSectionData = offTopicSections.find(s => s.id === selectedSection);

  return (
    <div className={`w-full max-w-7xl mx-auto p-6 rounded-xl ${
      themeMode === 'light'
        ? 'bg-[#F5F7FA]'
        : 'bg-[#0e1423]'
    }`}>
      {/* Custom Tab Switcher */}
      <div className="mb-6">
        <div className={`flex rounded-xl p-1 border ${
          themeMode === 'light'
            ? 'border-[#E0E0E0] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
            : 'border-gray-700/50 bg-[#1a1f2b]'
        }`}>
          <button
            onClick={() => setActiveTab("crypto")}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === "crypto"
                ? (themeMode === 'light' ? 'text-[#1C1E21] shadow-lg font-semibold border border-[#E0E0E0]' : 'text-white shadow-lg bg-[#0f111a]')
                : (themeMode === 'light' ? 'text-[#666] hover:text-[#1C1E21] hover:border hover:border-[#E0E0E0] bg-transparent' : 'text-[#94a3b8] hover:text-gray-300 bg-transparent')
            }`}
            style={activeTab === "crypto" && themeMode === 'light' ? {
              background: 'linear-gradient(90deg, #D2E3FC 0%, #B6D7FB 100%)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            } : {}}
            onMouseEnter={(e) => {
              if (activeTab !== "crypto" && themeMode === 'light') {
                e.currentTarget.style.background = 'linear-gradient(90deg, #E8F1FD 0%, #D2E9FC 100%)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.03)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "crypto" && themeMode === 'light') {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            <Hash className="h-4 w-4 inline mr-2" />
            Crypto Channels
          </button>
          <button
            onClick={() => setActiveTab("offtopic")}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === "offtopic"
                ? (themeMode === 'light' ? 'text-[#1C1E21] shadow-lg font-semibold border border-[#E0E0E0]' : 'text-white shadow-lg bg-[#0f111a]')
                : (themeMode === 'light' ? 'text-[#666] hover:text-[#1C1E21] hover:border hover:border-[#E0E0E0] bg-transparent' : 'text-[#94a3b8] hover:text-gray-300 bg-transparent')
            }`}
            style={activeTab === "offtopic" && themeMode === 'light' ? {
              background: 'linear-gradient(90deg, #D2E3FC 0%, #B6D7FB 100%)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            } : {}}
            onMouseEnter={(e) => {
              if (activeTab !== "offtopic" && themeMode === 'light') {
                e.currentTarget.style.background = 'linear-gradient(90deg, #E8F1FD 0%, #D2E9FC 100%)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.03)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "offtopic" && themeMode === 'light') {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            <Coffee className="h-4 w-4 inline mr-2" />
            Off-Topic Lounge
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "crypto" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Crypto Channels */}
          <div className="lg:col-span-1">
            <Card className="border-gray-700/50" style={{ background: '#1a1f2b' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-green-400" />
                  Active Channels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-3">
                {cryptoChannels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel.id)}
                    className={`w-full p-3 rounded-lg transition-all duration-200 text-left ${
                      selectedChannel === channel.id
                        ? "bg-green-500/20 border border-green-500/30"
                        : "bg-gray-800/50 hover:bg-gray-800/70 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium text-sm">${channel.ticker}</span>
                      <span className={`text-xs font-medium ${
                        channel.change24h >= 0 ? "text-green-400" : "text-red-400"
                      }`}>
                        {channel.change24h >= 0 ? "+" : ""}{channel.change24h.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mb-1">{formatPrice(channel.price)}</div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {channel.online}
                      </span>
                      <span>{formatVolume(channel.volume)}</span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Channel Stats */}
            <Card className="mt-4 border-gray-700/50" style={{ background: '#1a1f2b' }}>
              <CardContent className="p-4">
                <div className="text-xs text-gray-400 space-y-2">
                  <div className="flex justify-between">
                    <span>Total Channels:</span>
                    <span className="text-white">{cryptoChannels.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Online Users:</span>
                    <span className="text-green-400">
                      {cryptoChannels.reduce((sum, c) => sum + c.online, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Messages Today:</span>
                    <span className="text-blue-400">
                      {cryptoChannels.reduce((sum, c) => sum + c.totalMessages, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Chat Feed */}
          <div className="lg:col-span-3">
            <Card className="border-gray-700/50" style={{ background: '#1a1f2b' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    ${selectedChannelData?.ticker} Live Feed
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      {selectedChannelData?.online} watching
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Messages */}
                <ScrollArea className="h-96">
                  <div className="space-y-3 pr-4">
                    {cryptoMessages
                      .filter(msg => msg.ticker === selectedChannel)
                      .map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg border transition-all duration-200 ${
                          message.isPinned
                            ? "bg-yellow-500/10 border-yellow-500/30 ring-1 ring-yellow-500/20"
                            : "bg-gray-800/50 border-gray-700 hover:border-green-500/50"
                        }`}
                      >
                        {message.isPinned && (
                          <div className="flex items-center gap-1 mb-2">
                            <Pin className="h-3 w-3 text-yellow-400" />
                            <span className="text-xs text-yellow-400 font-medium">Pinned</span>
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <UserAvatar
                            userId={`user-${message.id}`}
                            username={message.user.name}
                            avatar={message.user.avatar}
                            size="sm"
                            verified={message.user.badge === "Verified" || message.user.badge === "TA Expert"}
                            premium={false}
                            showBadges={true}
                            onUserClick={onNavigateToProfile}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <UsernameLink
                                userId={`user-${message.id}`}
                                username={message.user.name}
                                verified={message.user.badge === "Verified" || message.user.badge === "TA Expert"}
                                premium={false}
                                showBadges={true}
                                onUserClick={onNavigateToProfile}
                              />
                              {message.user.badge && (
                                <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-300">
                                  {message.user.badge}
                                </Badge>
                              )}
                              <span className="text-gray-400 text-xs">{message.timestamp}</span>
                            </div>
                            <div className="text-gray-300 text-sm mb-2">
                              <MentionText
                                text={message.content}
                                onUserClick={onNavigateToProfile}
                                enableMentions={true}
                              />
                            </div>
                            <div className="flex items-center gap-4">
                              <button className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors">
                                <ThumbsUp className="h-3 w-3" />
                                <span className="text-xs">{message.likes}</span>
                              </button>
                              <button className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors">
                                <MessageSquare className="h-3 w-3" />
                                <span className="text-xs">{message.replies}</span>
                              </button>
                              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                                <Activity className="h-3 w-3 text-green-400" />
                                <span className="text-xs text-green-400">{message.sentiment}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                {isAuthenticated ? (
                  <div className="flex gap-2 pt-3 border-t border-gray-700">
                    <Input
                      value={cryptoMessage}
                      onChange={(e) => setCryptoMessage(e.target.value)}
                      placeholder={`Share your ${selectedChannel} insights...`}
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      onKeyPress={(e) => e.key === "Enter" && setCryptoMessage("")}
                    />
                    <Button
                      disabled={!cryptoMessage.trim()}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p className="text-gray-400">Sign in to join the discussion</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "offtopic" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Sections */}
          <div className="lg:col-span-1">
            <Card className="border-gray-700/50" style={{ background: '#1a1f2b' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2 text-sm">
                  <Coffee className="h-4 w-4 text-violet-400" />
                  Lounge Sections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-3">
                {offTopicSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full p-3 rounded-lg transition-all duration-200 text-left ${
                      selectedSection === section.id
                        ? "bg-violet-500/20 border border-violet-500/30"
                        : "bg-gray-800/50 hover:bg-gray-800/70 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{section.icon}</span>
                      <span className="text-white font-medium text-sm">{section.name}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{section.description}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="h-3 w-3" />
                      {section.memberCount.toLocaleString()} members
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Meme of the Week */}
            <Card className="mt-4 border-gray-700/50" style={{ background: '#1a1f2b' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  Meme of the Week
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center border border-violet-500/30">
                    <Laugh className="h-8 w-8 text-violet-400" />
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Submit your best trading meme!</p>
                  <Button 
                    size="sm" 
                    className="w-full text-white font-medium"
                    style={{ 
                      background: 'linear-gradient(135deg, #7b5fff 0%, #a855f7 100%)' 
                    }}
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Submit Meme
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Posts Feed */}
          <div className="lg:col-span-3">
            <Card className="border-gray-700/50" style={{ background: '#1a1f2b' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="text-lg">{selectedSectionData?.icon}</span>
                    {selectedSectionData?.name}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-violet-500/20 text-violet-300 border-violet-500/30 text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {selectedSectionData?.memberCount.toLocaleString()} members
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 italic">No tickers. Just vibes.</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Posts */}
                <ScrollArea className="h-96">
                  <div className="space-y-4 pr-4">
                    {offTopicPosts.map((post) => (
                      <div
                        key={post.id}
                        className={`p-4 rounded-lg border transition-all duration-200 ${
                          post.isPinned
                            ? "bg-violet-500/10 border-violet-500/30 ring-1 ring-violet-500/20"
                            : "bg-gray-800/50 border-gray-700 hover:border-violet-500/50"
                        }`}
                      >
                        {post.isPinned && (
                          <div className="flex items-center gap-1 mb-2">
                            <Pin className="h-3 w-3 text-violet-400" />
                            <span className="text-xs text-violet-400 font-medium">Pinned Post</span>
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <UserAvatar
                            userId={`user-${post.id}`}
                            username={post.user.name}
                            avatar={post.user.avatar}
                            size="sm"
                            verified={post.user.verified}
                            premium={false}
                            showBadges={true}
                            onUserClick={onNavigateToProfile}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <UsernameLink
                                userId={`user-${post.id}`}
                                username={post.user.name}
                                verified={post.user.verified}
                                premium={false}
                                showBadges={true}
                                onUserClick={onNavigateToProfile}
                              />
                              {post.user.verified && (
                                <Shield className="h-3 w-3 text-blue-400" />
                              )}
                              <span className="text-gray-400 text-xs">{post.timestamp}</span>
                            </div>
                            <div className="text-gray-300 text-sm mb-3">
                              <MentionText
                                text={post.content}
                                onUserClick={onNavigateToProfile}
                                enableMentions={true}
                              />
                            </div>
                            
                            {/* Tags */}
                            {post.tags && (
                              <div className="flex items-center gap-1 mb-3">
                                {post.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs bg-violet-500/20 text-violet-300 border-violet-500/30"
                                  >
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Reactions */}
                            <div className="flex items-center gap-3 mb-3">
                              {post.reactions.map((reaction) => (
                                <button
                                  key={reaction.emoji}
                                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-700 hover:border-violet-500/30"
                                >
                                  <span>{reaction.emoji}</span>
                                  <span className="text-xs text-gray-400">{reaction.count}</span>
                                </button>
                              ))}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                              <button className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors">
                                <Heart className="h-3 w-3" />
                                <span className="text-xs">{post.likes}</span>
                              </button>
                              <button className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors">
                                <MessageSquare className="h-3 w-3" />
                                <span className="text-xs">{post.comments}</span>
                              </button>
                              <button className="flex items-center gap-1 text-gray-400 hover:text-green-400 transition-colors">
                                <Share2 className="h-3 w-3" />
                                <span className="text-xs">{post.shares}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                {isAuthenticated ? (
                  <div className="space-y-3 pt-3 border-t border-gray-700">
                    <Textarea
                      value={offTopicMessage}
                      onChange={(e) => setOffTopicMessage(e.target.value)}
                      placeholder="What's on your mind? Share something fun with the community..."
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 min-h-[80px] resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Image className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Camera className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Smile className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        disabled={!offTopicMessage.trim()}
                        className="text-white font-medium"
                        style={{ 
                          background: 'linear-gradient(135deg, #7b5fff 0%, #a855f7 100%)' 
                        }}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Post
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p className="text-gray-400">Sign in to share your vibes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
