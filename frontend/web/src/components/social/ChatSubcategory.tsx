import React, { useState, useEffect, useRef } from "react";
import {
  Hash,
  Lock,
  Users,
  Crown,
  Shield,
  Send,
  Smile,
  Pin,
  Reply,
  Heart,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  UserPlus,
  VolumeX,
  Flag,
  Settings,
  Plus,
  Search,
  Mic,
  MicOff,
  Image,
  File,
  Paperclip,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { PostInteractionBar } from "./PostInteractionBar";
import { UserAvatar } from "./UserAvatar";
import { UsernameLink } from "./UsernameLink";
import { MentionText } from "./MentionText";
import { ProfileNavigationProvider, useProfileNavigation } from "./ProfileNavigationProvider";
import {
  CheckCircle,
  AlertTriangle,
  Award,
} from "lucide-react";

// Enhanced types for the new chat system
interface ChatRoom {
  id: string;
  name: string;
  description: string;
  type: "general" | "crypto" | "stocks" | "trading" | "ai" | "private";
  icon: string;
  memberCount: number;
  onlineCount: number;
  isPrivate: boolean;
  isVerified: boolean;
  lastActivity: Date;
  unreadCount?: number;
  isPinned?: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  userRole: "member" | "verified" | "premium" | "moderator" | "admin";
  content: string;
  type: "text" | "image" | "file" | "trade_alert" | "system";
  timestamp: Date;
  reactions: Array<{
    emoji: string;
    count: number;
    users: string[];
    userReacted: boolean;
  }>;
  attachments?: Array<{
    type: "image" | "file";
    url: string;
    name: string;
    size?: number;
  }>;
  replyTo?: {
    messageId: string;
    username: string;
    content: string;
  };
  isEdited?: boolean;
  isPinned?: boolean;
  tradeData?: {
    ticker: string;
    action: "buy" | "sell";
    price: number;
    sentiment: "bullish" | "bearish" | "neutral";
  };
  credibilityScore?: number;
  needsReview?: boolean;
  communityFavorite?: boolean;
}

// Mock data for demo
const mockRooms: ChatRoom[] = [
  {
    id: "general",
    name: "💬 General Chat",
    description: "Open discussion about markets and trading",
    type: "general",
    icon: "💬",
    memberCount: 1247,
    onlineCount: 89,
    isPrivate: false,
    isVerified: false,
    lastActivity: new Date(),
    unreadCount: 3,
    isPinned: true,
  },
  {
    id: "crypto",
    name: "₿ Crypto Central",
    description: "Bitcoin, Ethereum, and altcoin discussions",
    type: "crypto",
    icon: "₿",
    memberCount: 892,
    onlineCount: 156,
    isPrivate: false,
    isVerified: true,
    lastActivity: new Date(),
    unreadCount: 7,
  },
  {
    id: "stocks",
    name: "📈 Stock Talk",
    description: "Stock market analysis and DD",
    type: "stocks",
    icon: "📈",
    memberCount: 634,
    onlineCount: 45,
    isPrivate: false,
    isVerified: true,
    lastActivity: new Date(),
  },
  {
    id: "ai-signals",
    name: "🤖 AI Trading Signals",
    description: "AI-powered market insights and alerts",
    type: "ai",
    icon: "🤖",
    memberCount: 512,
    onlineCount: 78,
    isPrivate: false,
    isVerified: true,
    lastActivity: new Date(),
    unreadCount: 2,
  },
  {
    id: "vip-lounge",
    name: "👑 VIP Lounge",
    description: "Premium members only",
    type: "private",
    icon: "👑",
    memberCount: 89,
    onlineCount: 12,
    isPrivate: true,
    isVerified: true,
    lastActivity: new Date(),
  },
];

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    userId: "user1",
    username: "CryptoKing",
    userRole: "verified",
    content: "Just spotted a massive whale movement on $BTC! 🐋 This could signal a major price action incoming.",
    type: "text",
    timestamp: new Date(Date.now() - 300000),
    reactions: [
      { emoji: "🚀", count: 12, users: [], userReacted: false },
      { emoji: "👀", count: 8, users: [], userReacted: true },
    ],
    credibilityScore: 8.7,
    needsReview: false,
    communityFavorite: true,
  },
  {
    id: "2",
    userId: "user2",
    username: "StockGuru",
    userRole: "premium",
    content: "Technical analysis shows $AAPL breaking resistance at $175. Looking for a move to $180 next week.",
    type: "trade_alert",
    timestamp: new Date(Date.now() - 240000),
    reactions: [{ emoji: "📈", count: 15, users: [], userReacted: false }],
    tradeData: {
      ticker: "AAPL",
      action: "buy",
      price: 175,
      sentiment: "bullish",
    },
    credibilityScore: 9.1,
    needsReview: false,
    communityFavorite: false,
  },
  {
    id: "3",
    userId: "user3",
    username: "AITrader",
    userRole: "moderator",
    content: "Our sentiment analysis algorithm is showing extremely bullish signals across all major indices today. Market confidence is at a 3-month high.",
    type: "text",
    timestamp: new Date(Date.now() - 180000),
    reactions: [
      { emoji: "🤖", count: 9, users: [], userReacted: false },
      { emoji: "📊", count: 6, users: [], userReacted: true },
    ],
    isPinned: true,
    credibilityScore: 7.8,
    needsReview: true,
    communityFavorite: false,
  },
];

interface ChatSubcategoryProps {
  onNavigateToProfile?: (userId: string) => void;
}

export const ChatSubcategory: React.FC<ChatSubcategoryProps> = ({ onNavigateToProfile }) => {
  const { user, isAuthenticated } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<string>("general");
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate typing indicator
  useEffect(() => {
    if (newMessage.length > 0) {
      const timer = setTimeout(() => {
        setTypingUsers(["TradingBot", "MarketAnalyst"]);
        setTimeout(() => setTypingUsers([]), 3000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [newMessage]);

  const currentRoom = mockRooms.find((r) => r.id === selectedRoom);
  const filteredRooms = mockRooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFollow = (userId: string) => {
    console.log(`Following user: ${userId}`);
  };

  const handleUnfollow = (userId: string) => {
    console.log(`Unfollowing user: ${userId}`);
  };

  const handleToggleAlerts = (userId: string, enabled: boolean) => {
    console.log(`${enabled ? 'Enabling' : 'Disabling'} alerts for user: ${userId}`);
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 9.0) return "text-purple-600 bg-purple-100 dark:bg-purple-900/20";
    if (score >= 8.0) return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
    if (score >= 7.0) return "text-green-600 bg-green-100 dark:bg-green-900/20";
    if (score >= 6.0) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
    return "text-red-600 bg-red-100 dark:bg-red-900/20";
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    // Parse for trade patterns
    const tradePattern = /\$(\w+).*?(buy|sell).*?(\d+\.?\d*)/i;
    const match = newMessage.match(tradePattern);

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      userRole: user.isPremium ? "premium" : user.isVerified ? "verified" : "member",
      content: newMessage.trim(),
      type: match ? "trade_alert" : "text",
      timestamp: new Date(),
      reactions: [],
      tradeData: match ? {
        ticker: match[1].toUpperCase(),
        action: match[2].toLowerCase() as "buy" | "sell",
        price: parseFloat(match[3]),
        sentiment: match[2].toLowerCase() === "buy" ? "bullish" : "bearish",
      } : undefined,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    setTypingUsers([]);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    if (!user) return;

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
          if (existingReaction) {
            const userReacted = existingReaction.users.includes(user.id);
            return {
              ...msg,
              reactions: msg.reactions
                .map((r) =>
                  r.emoji === emoji
                    ? {
                        ...r,
                        count: userReacted ? r.count - 1 : r.count + 1,
                        users: userReacted
                          ? r.users.filter((id) => id !== user.id)
                          : [...r.users, user.id],
                        userReacted: !userReacted,
                      }
                    : r
                )
                .filter((r) => r.count > 0),
            };
          } else {
            return {
              ...msg,
              reactions: [
                ...msg.reactions,
                {
                  emoji,
                  count: 1,
                  users: [user.id],
                  userReacted: true,
                },
              ],
            };
          }
        }
        return msg;
      })
    );
  };

  const getRoomIcon = (room: ChatRoom) => {
    if (room.isPrivate) return <Lock className="h-4 w-4" />;
    return <Hash className="h-4 w-4" />;
  };

  const getUserRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-3 w-3 text-red-500" />;
      case "moderator":
        return <Shield className="h-3 w-3 text-purple-500" />;
      case "verified":
        return <Shield className="h-3 w-3 text-blue-500" />;
      case "premium":
        return <Crown className="h-3 w-3 text-yellow-500" />;
      default:
        return null;
    }
  };

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    const showAvatar =
      index === 0 || messages[index - 1].userId !== message.userId;
    const isConsecutive =
      index > 0 && messages[index - 1].userId === message.userId;

    return (
      <div
        key={message.id}
        className={`flex gap-3 group hover:bg-muted/30 px-4 py-2 rounded-lg transition-colors ${
          isConsecutive ? "mt-1" : "mt-4"
        } ${message.isPinned ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500" : ""}`}
      >
        <div className="w-10">
          {showAvatar && (
            <UserAvatar
              userId={message.userId}
              username={message.username}
              avatar={message.userAvatar}
              size="md"
              verified={message.userRole === "verified" || message.userRole === "admin" || message.userRole === "moderator"}
              premium={message.userRole === "premium"}
              credibilityScore={message.credibilityScore}
              showBadges={true}
              onUserClick={onNavigateToProfile}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {showAvatar && (
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <UsernameLink
                  userId={message.userId}
                  username={message.username}
                  verified={message.userRole === "verified" || message.userRole === "admin" || message.userRole === "moderator"}
                  premium={message.userRole === "premium"}
                  credibilityScore={message.credibilityScore}
                  showBadges={true}
                  onUserClick={onNavigateToProfile}
                />

                {/* User Role Icon */}
                {getUserRoleIcon(message.userRole)}

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

                <span className="text-xs text-muted-foreground">
                  {formatMessageTime(message.timestamp)}
                </span>

                {message.isPinned && (
                  <Badge variant="outline" className="text-xs">
                    <Pin className="h-2 w-2 mr-1" />
                    Pinned
                  </Badge>
                )}
              </div>

              {/* Post Interaction Bar for Chat Messages */}
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
          )}

          <div className="relative">
            {message.type === "trade_alert" && message.tradeData && (
              <div className="mb-2 p-3 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {message.tradeData.sentiment === "bullish" ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-green-600 dark:text-green-400">
                    {message.tradeData.action.toUpperCase()} ${message.tradeData.ticker}
                  </span>
                  <span className="text-muted-foreground">
                    @ ${message.tradeData.price}
                  </span>
                </div>
              </div>
            )}

            <div className="text-sm leading-relaxed break-words">
              <MentionText
                text={message.content}
                onUserClick={onNavigateToProfile}
                enableMentions={true}
              />
            </div>

            {/* Message Actions */}
            <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-1 bg-background border rounded-lg p-1 shadow-lg">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-muted"
                  onClick={() => handleReaction(message.id, "👍")}
                >
                  👍
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-muted"
                  onClick={() => handleReaction(message.id, "🚀")}
                >
                  🚀
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-muted"
                  onClick={() => handleReaction(message.id, "📈")}
                >
                  📈
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-muted"
                >
                  <Reply className="h-3 w-3" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-muted"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pin className="h-3 w-3 mr-2" />
                      Pin Message
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Flag className="h-3 w-3 mr-2" />
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Reactions */}
            {message.reactions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {message.reactions.map((reaction) => (
                  <button
                    key={reaction.emoji}
                    onClick={() => handleReaction(message.id, reaction.emoji)}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors ${
                      reaction.userReacted
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-muted hover:bg-muted/80 border-muted-foreground/20"
                    }`}
                  >
                    <span>{reaction.emoji}</span>
                    <span>{reaction.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Join the Chat</h3>
            <p className="text-muted-foreground mb-4">
              Sign in to participate in community discussions and connect with other traders.
            </p>
            <Button>Sign In to Chat</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-12 gap-6 h-[700px]">
        {/* Rooms Sidebar */}
        <div className="col-span-3">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Chat Rooms</CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-1 p-3">
                  {filteredRooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
                        selectedRoom === room.id
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : ""
                      }`}
                    >
                      <div className="text-lg">{room.icon}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">
                            {room.name.replace(/^[^\s]+ /, "")}
                          </span>
                          {room.isVerified && (
                            <Shield className="h-3 w-3 text-blue-500" />
                          )}
                          {room.isPinned && (
                            <Pin className="h-3 w-3 text-orange-500" />
                          )}
                        </div>
                        <div className="text-xs opacity-75">
                          {room.onlineCount} online
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {room.unreadCount && room.unreadCount > 0 && (
                          <Badge
                            variant="destructive"
                            className="h-5 w-5 p-0 text-xs flex items-center justify-center"
                          >
                            {room.unreadCount > 9 ? "9+" : room.unreadCount}
                          </Badge>
                        )}
                        {room.onlineCount > 0 && (
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="col-span-9">
          <Card className="h-full flex flex-col">
            {/* Chat Header */}
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{currentRoom?.icon}</div>
                  <div>
                    <h3 className="font-semibold">{currentRoom?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {currentRoom?.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {currentRoom?.memberCount.toLocaleString()}
                  </Badge>

                  <Badge variant="secondary" className="text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                    {currentRoom?.onlineCount} online
                  </Badge>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                    className={isVoiceEnabled ? "text-green-600" : ""}
                  >
                    {isVoiceEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pin className="h-4 w-4 mr-2" />
                        Pinned Messages
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Members
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <VolumeX className="h-4 w-4 mr-2" />
                        Mute Room
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Room Settings
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-[450px]">
                <div className="p-2 space-y-1">
                  {messages.map((message, index) => renderMessage(message, index))}
                  
                  {/* Typing Indicator */}
                  {typingUsers.length > 0 && (
                    <div className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <span>
                        {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
                      </span>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>

            {/* Message Input */}
            <div className="border-t bg-background p-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Input
                    placeholder={`Message #${currentRoom?.name.replace(/^[^\s]+ /, "") || "chat"}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="pr-24"
                  />
                  
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                    >
                      <Paperclip className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                  className="px-4"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Send
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>Quick actions:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setNewMessage("$AAPL buy at 175 target 180")}
                >
                  Trade Alert
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setNewMessage("What's the sentiment on ")}
                >
                  Ask AI
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setNewMessage("📈 Bullish on the market today! ")}
                >
                  Market Update
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatSubcategory;
