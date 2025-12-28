import { useState, useRef, useEffect } from "react";
import {
  Send,
  Heart,
  MessageCircle,
  Pin,
  Flag,
  TrendingUp,
  TrendingDown,
  Users,
  Bot,
  Search,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Smile,
  DollarSign,
  Hash,
  Zap,
  Activity,
  Eye,
  Bell,
  BellOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { ReplyThreadView } from "./ReplyThreadView";
import { UserProfilePopover } from "./UserProfilePopover";
import { AIMoodSummaryBubble } from "./AIMoodSummaryBubble";

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: Date;
  sentiment: "bullish" | "bearish" | "neutral";
  isPinned?: boolean;
  reactions: { emoji: string; count: number; userReacted: boolean }[];
  badges: string[];
  tickers: string[];
  aiDetected?: {
    sentiment: string;
    confidence: number;
  };
}

interface TrendingTicker {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  mentions: number;
}

interface ActiveTrader {
  id: string;
  username: string;
  avatar: string;
  sentiment: "bullish" | "bearish" | "neutral";
  isFollowing: boolean;
  alertsEnabled: boolean;
  badges: string[];
}

interface FuturisticChatInterfaceProps {
  roomName: string;
  roomType: "general" | "crypto" | "stocks" | "ai";
  onNavigateToProfile?: (userId: string) => void;
}

export const FuturisticChatInterface = ({
  roomName,
  roomType,
  onNavigateToProfile,
}: FuturisticChatInterfaceProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showPinned, setShowPinned] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tickerSuggestions, setTickerSuggestions] = useState<string[]>([]);
  const [showTickerSuggestions, setShowTickerSuggestions] = useState(false);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [profilePopover, setProfilePopover] = useState<{
    userId: string;
    position: { x: number; y: number };
    isVisible: boolean;
  }>({ userId: "", position: { x: 0, y: 0 }, isVisible: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock data
  const mockMessages: ChatMessage[] = [
    {
      id: "1",
      userId: "user1",
      username: "CryptoKing",
      avatar: "/api/placeholder/40/40",
      content: "🚀 $NVDA breaking major resistance at $180! This AI rally is unstoppable. Next target $200 before Q1 ends.",
      timestamp: new Date(Date.now() - 300000),
      sentiment: "bullish",
      isPinned: true,
      reactions: [
        { emoji: "🚀", count: 12, userReacted: true },
        { emoji: "💎", count: 8, userReacted: false },
        { emoji: "📈", count: 15, userReacted: false },
      ],
      badges: ["Momentum Expert", "Top 1%"],
      tickers: ["NVDA"],
      aiDetected: {
        sentiment: "Very Bullish",
        confidence: 92,
      },
    },
    {
      id: "2",
      userId: "user2",
      username: "BearMarketBae",
      avatar: "/api/placeholder/40/40",
      content: "Careful with $SPY here. RSI showing major divergence and volume is declining. Could see a pullback to $420 support.",
      timestamp: new Date(Date.now() - 180000),
      sentiment: "bearish",
      reactions: [
        { emoji: "📉", count: 6, userReacted: false },
        { emoji: "⚠️", count: 4, userReacted: true },
      ],
      badges: ["Verified", "Risk Analyst"],
      tickers: ["SPY"],
      aiDetected: {
        sentiment: "Bearish",
        confidence: 87,
      },
    },
    {
      id: "3",
      userId: "user3",
      username: "AITraderBot",
      avatar: "/api/placeholder/40/40",
      content: "Market sentiment analysis: 68% bullish across major indices. Crypto sentiment at 72% positive. High probability reversal patterns detected in $ETH.",
      timestamp: new Date(Date.now() - 120000),
      sentiment: "neutral",
      reactions: [
        { emoji: "🤖", count: 18, userReacted: false },
        { emoji: "📊", count: 12, userReacted: true },
      ],
      badges: ["AI Bot", "Sentiment Expert"],
      tickers: ["ETH"],
    },
  ];

  const pinnedMessages = mockMessages.filter(msg => msg.isPinned);

  const trendingTickers: TrendingTicker[] = [
    { symbol: "NVDA", price: 183.50, change: 8.25, changePercent: 4.7, volume: 45600000, mentions: 127 },
    { symbol: "ETH", price: 3890, change: -45.30, changePercent: -1.2, volume: 28400000, mentions: 89 },
    { symbol: "SPY", price: 485.20, change: 2.15, changePercent: 0.4, volume: 67200000, mentions: 76 },
    { symbol: "BTC", price: 67420, change: 1240.50, changePercent: 1.9, volume: 31800000, mentions: 156 },
  ];

  const activeTraders: ActiveTrader[] = [
    {
      id: "user1",
      username: "CryptoKing",
      avatar: "/api/placeholder/32/32",
      sentiment: "bullish",
      isFollowing: false,
      alertsEnabled: false,
      badges: ["Momentum Expert"],
    },
    {
      id: "user2",
      username: "BearMarketBae",
      avatar: "/api/placeholder/32/32",
      sentiment: "bearish",
      isFollowing: true,
      alertsEnabled: true,
      badges: ["Risk Analyst"],
    },
    {
      id: "user4",
      username: "OptionsGuru",
      avatar: "/api/placeholder/32/32",
      sentiment: "neutral",
      isFollowing: false,
      alertsEnabled: false,
      badges: ["Options Expert"],
    },
  ];

  const roomMoodScore = 74; // Calculated from message sentiments

  useEffect(() => {
    setMessages(mockMessages);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "from-emerald-500 to-green-400";
      case "bearish":
        return "from-red-500 to-pink-400";
      default:
        return "from-gray-500 to-slate-400";
    }
  };

  const getSentimentGlow = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "shadow-emerald-500/30 ring-emerald-500/20";
      case "bearish":
        return "shadow-red-500/30 ring-red-500/20";
      default:
        return "shadow-gray-500/20 ring-gray-500/10";
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId: user.id,
      username: user.username,
      avatar: user.avatar || "/api/placeholder/40/40",
      content: newMessage.trim(),
      timestamp: new Date(),
      sentiment: "neutral", // Would be determined by AI
      reactions: [],
      badges: ["Member"],
      tickers: extractTickers(newMessage),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
    setShowTickerSuggestions(false);
  };

  const extractTickers = (text: string): string[] => {
    const tickerRegex = /\$([A-Z]{1,5})/g;
    const matches = text.match(tickerRegex);
    return matches ? matches.map(match => match.substring(1)) : [];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);

    // Show ticker suggestions when typing $
    if (value.includes("$") && !value.endsWith(" ")) {
      const lastDollar = value.lastIndexOf("$");
      const tickerStart = value.substring(lastDollar + 1);
      if (tickerStart.length > 0) {
        const suggestions = ["NVDA", "AAPL", "MSFT", "GOOGL", "TSLA", "ETH", "BTC", "SPY"]
          .filter(ticker => ticker.startsWith(tickerStart.toUpperCase()));
        setTickerSuggestions(suggestions);
        setShowTickerSuggestions(suggestions.length > 0);
      }
    } else {
      setShowTickerSuggestions(false);
    }
  };

  const handleUserHover = (userId: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setProfilePopover({
      userId,
      position: { x: rect.left + rect.width / 2, y: rect.bottom + 5 },
      isVisible: true,
    });
  };

  const handleUserLeave = () => {
    setTimeout(() => {
      setProfilePopover(prev => ({ ...prev, isVisible: false }));
    }, 300);
  };

  const handleFollow = (userId: string) => {
    console.log(`Following user: ${userId}`);
  };

  const handleUnfollow = (userId: string) => {
    console.log(`Unfollowing user: ${userId}`);
  };

  const handleToggleUserAlerts = (userId: string, enabled: boolean) => {
    console.log(`${enabled ? 'Enabling' : 'Disabling'} alerts for user: ${userId}`);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find(r => r.emoji === emoji);
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.map(r =>
                r.emoji === emoji
                  ? { ...r, count: r.userReacted ? r.count - 1 : r.count + 1, userReacted: !r.userReacted }
                  : r
              ).filter(r => r.count > 0),
            };
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, count: 1, userReacted: true }],
            };
          }
        }
        return msg;
      })
    );
  };

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-[800px] bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 rounded-xl border border-purple-500/20 backdrop-blur-xl overflow-hidden">
      <div className="grid grid-cols-12 h-full">
        {/* Main Chat Area */}
        <div className={`${sidebarCollapsed ? 'col-span-12' : 'col-span-8'} flex flex-col transition-all duration-300`}>
          {/* Chat Header */}
          <div className="p-4 border-b border-purple-500/20 bg-black/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <h2 className="text-xl font-bold text-white">#{roomName}</h2>
                <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">
                  Live
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                  <Users className="h-3 w-3 mr-1" />
                  1,247 online
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="text-gray-400 hover:text-white"
                >
                  {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* AI Mood Summary */}
          <div className="p-4 border-b border-purple-500/20">
            <AIMoodSummaryBubble
              roomName={roomName}
              position="top"
              onViewDetails={() => console.log('View mood details')}
            />
          </div>

          {/* Pinned Messages */}
          {showPinned && pinnedMessages.length > 0 && (
            <div className="p-4 border-b border-purple-500/20 bg-yellow-500/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Pin className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-300">Pinned Messages</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPinned(false)}
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  ×
                </Button>
              </div>
              {pinnedMessages.slice(0, 1).map(message => (
                <div
                  key={message.id}
                  className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-3 border border-yellow-500/20"
                >
                  <div className="flex items-start gap-3">
                    <div className={`relative ring-2 ${getSentimentGlow(message.sentiment)} rounded-full`}>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.avatar} />
                        <AvatarFallback>{message.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r ${getSentimentColor(message.sentiment)}`}></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-yellow-200">{message.username}</span>
                        {message.badges.map(badge => (
                          <Badge key={badge} className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                            {badge}
                          </Badge>
                        ))}
                        <span className="text-xs text-gray-400">{formatMessageTime(message.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-200 line-clamp-2">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {pinnedMessages.length > 1 && (
                <Button variant="ghost" size="sm" className="mt-2 text-yellow-400 hover:text-yellow-300">
                  View All {pinnedMessages.length} Pinned Messages
                </Button>
              )}
            </div>
          )}

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={message.id} className="group">
                  <div className="flex items-start gap-3">
                    {/* Avatar with Sentiment Ring */}
                    <div className={`relative ring-2 ${getSentimentGlow(message.sentiment)} rounded-full hover:ring-4 transition-all cursor-pointer`}
                         onClick={() => onNavigateToProfile?.(message.userId)}
                         onMouseEnter={(e) => handleUserHover(message.userId, e)}
                         onMouseLeave={handleUserLeave}>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={message.avatar} />
                        <AvatarFallback>{message.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r ${getSentimentColor(message.sentiment)} animate-pulse`}></div>
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      {/* Message Header */}
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          className="font-semibold text-white hover:text-purple-300 transition-colors"
                          onClick={() => onNavigateToProfile?.(message.userId)}
                          onMouseEnter={(e) => handleUserHover(message.userId, e)}
                          onMouseLeave={handleUserLeave}
                        >
                          {message.username}
                        </button>
                        {message.badges.map(badge => (
                          <Badge key={badge} className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                            {badge}
                          </Badge>
                        ))}
                        <Badge className="text-xs bg-slate-700/50 text-gray-400 border-slate-600/30">
                          {formatMessageTime(message.timestamp)}
                        </Badge>
                      </div>

                      {/* Message Bubble */}
                      <div className={`relative rounded-2xl p-4 bg-gradient-to-r from-black/60 to-purple-900/20 border ${getSentimentGlow(message.sentiment)} backdrop-blur-sm hover:shadow-lg transition-all`}>
                        <p className="text-gray-200 leading-relaxed">
                          {message.content.split(/(\$[A-Z]{1,5}|#\w+|@\w+)/).map((part, i) => {
                            if (part.startsWith('$')) {
                              return (
                                <span key={i} className="text-emerald-400 font-semibold hover:text-emerald-300 cursor-pointer">
                                  {part}
                                </span>
                              );
                            } else if (part.startsWith('#')) {
                              return (
                                <span key={i} className="text-blue-400 font-semibold hover:text-blue-300 cursor-pointer">
                                  {part}
                                </span>
                              );
                            } else if (part.startsWith('@')) {
                              return (
                                <span key={i} className="text-purple-400 font-semibold hover:text-purple-300 cursor-pointer">
                                  {part}
                                </span>
                              );
                            }
                            return part;
                          })}
                        </p>

                        {/* AI Detection Badge */}
                        {message.aiDetected && (
                          <div className="mt-2 flex items-center gap-2">
                            <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30">
                              <Bot className="h-3 w-3 mr-1" />
                              AI Detected: {message.aiDetected.sentiment} ({message.aiDetected.confidence}%)
                            </Badge>
                          </div>
                        )}

                        {/* Hover Actions */}
                        <div className="absolute -top-2 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded-lg p-1 flex items-center gap-1 backdrop-blur-sm border border-purple-500/20">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                                  onClick={() => handleReaction(message.id, "❤️")}
                                >
                                  <Heart className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>React</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300"
                                  onClick={() => setActiveThread(activeThread === message.id ? null : message.id)}
                                >
                                  <MessageCircle className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Thread</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-yellow-400 hover:text-yellow-300"
                                >
                                  <Pin className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Pin</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                                >
                                  <Flag className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Report</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>

                      {/* Reactions */}
                      {message.reactions.length > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          {message.reactions.map((reaction, i) => (
                            <button
                              key={i}
                              onClick={() => handleReaction(message.id, reaction.emoji)}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all hover:scale-105 ${
                                reaction.userReacted
                                  ? "bg-purple-500/30 border border-purple-500/50 text-purple-200"
                                  : "bg-black/40 border border-gray-600/30 text-gray-300 hover:border-purple-500/30"
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

                  {/* Reply Thread */}
                  <ReplyThreadView
                    messageId={message.id}
                    isOpen={activeThread === message.id}
                    onClose={() => setActiveThread(null)}
                    onNavigateToProfile={onNavigateToProfile}
                  />
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Bar */}
          <div className="p-4 border-t border-purple-500/20 bg-black/40 backdrop-blur-sm">
            <div className="relative">
              {/* Ticker Suggestions */}
              {showTickerSuggestions && (
                <div className="absolute bottom-full mb-2 left-0 right-0 bg-black/90 rounded-lg border border-purple-500/20 backdrop-blur-sm p-2">
                  <div className="text-xs text-gray-400 mb-1">Tickers:</div>
                  <div className="flex flex-wrap gap-1">
                    {tickerSuggestions.map(ticker => (
                      <button
                        key={ticker}
                        className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs hover:bg-emerald-500/30 transition-colors"
                        onClick={() => {
                          const lastDollar = newMessage.lastIndexOf("$");
                          const beforeDollar = newMessage.substring(0, lastDollar + 1);
                          setNewMessage(beforeDollar + ticker + " ");
                          setShowTickerSuggestions(false);
                          inputRef.current?.focus();
                        }}
                      >
                        ${ticker}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message... Use $TICKER, @mention, #hashtag"
                    className="bg-slate-800/50 border-purple-500/20 text-white placeholder-gray-400 pr-16 focus:border-purple-500/50 focus:ring-purple-500/20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
                      <Smile className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Commands */}
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <span>Quick:</span>
                <button className="text-emerald-400 hover:text-emerald-300" onClick={() => setNewMessage("/watchlist ")}>
                  /watchlist
                </button>
                <button className="text-blue-400 hover:text-blue-300" onClick={() => setNewMessage("/mood ")}>
                  /mood
                </button>
                <button className="text-purple-400 hover:text-purple-300" onClick={() => setNewMessage("$AAPL ")}>
                  $AAPL
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {!sidebarCollapsed && (
          <div className="col-span-4 border-l border-purple-500/20 bg-black/20 backdrop-blur-sm">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-6">
                {/* Room Mood Meter */}
                <Card className="bg-black/40 border-purple-500/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-white flex items-center gap-2">
                      <Activity className="h-4 w-4 text-emerald-400" />
                      Room Mood
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Bearish</span>
                      <span className="text-lg font-bold text-emerald-400">{roomMoodScore}%</span>
                      <span className="text-xs text-gray-400">Bullish</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500"
                        style={{ width: `${roomMoodScore}%` }}
                      />
                    </div>
                    <div className="text-xs text-center text-emerald-300">Market is Optimistic</div>
                  </CardContent>
                </Card>

                {/* Top Traders Active */}
                <Card className="bg-black/40 border-purple-500/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-white flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-400" />
                      Top Traders Active
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {activeTraders.map(trader => (
                      <div key={trader.id} className="flex items-center gap-3">
                        <div className={`relative ring-2 ${getSentimentGlow(trader.sentiment)} rounded-full`}>
                          <Avatar className="h-8 w-8 cursor-pointer" onClick={() => onNavigateToProfile?.(trader.id)}>
                            <AvatarImage src={trader.avatar} />
                            <AvatarFallback>{trader.username[0]}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r ${getSentimentColor(trader.sentiment)}`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <button
                              className="text-sm font-medium text-white hover:text-purple-300 truncate"
                              onClick={() => onNavigateToProfile?.(trader.id)}
                            >
                              {trader.username}
                            </button>
                            {trader.badges.slice(0, 1).map(badge => (
                              <Badge key={badge} className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 w-6 p-0 ${trader.isFollowing ? 'text-purple-400' : 'text-gray-400'} hover:text-purple-300`}
                          >
                            <Users className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 w-6 p-0 ${trader.alertsEnabled ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-300`}
                          >
                            {trader.alertsEnabled ? <Bell className="h-3 w-3" /> : <BellOff className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Trending Tickers */}
                <Card className="bg-black/40 border-purple-500/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-white flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                      Trending in Room
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {trendingTickers.map(ticker => (
                      <div key={ticker.symbol} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-emerald-400">${ticker.symbol}</span>
                          <Badge className="text-xs bg-slate-700/50 text-gray-400">
                            <MessageCircle className="h-2 w-2 mr-1" />
                            {ticker.mentions}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-white">
                            ${ticker.price.toLocaleString()}
                          </div>
                          <div className={`text-xs ${ticker.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {ticker.change >= 0 ? '+' : ''}{ticker.changePercent.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* User Profile Popover */}
      <UserProfilePopover
        userId={profilePopover.userId}
        isVisible={profilePopover.isVisible}
        position={profilePopover.position}
        onClose={() => setProfilePopover(prev => ({ ...prev, isVisible: false }))}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
        onToggleAlerts={handleToggleUserAlerts}
        onViewProfile={(userId) => {
          setProfilePopover(prev => ({ ...prev, isVisible: false }));
          onNavigateToProfile?.(userId);
        }}
      />
    </div>
  );
};
