import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  Crown,
  Shield,
  Zap,
  Hash,
  DollarSign,
  Image as ImageIcon,
  BarChart3,
  Pin,
  Bell,
  BellOff,
  Send,
  Smile,
  ThumbsUp,
  Rocket,
  Bear,
  Minus
} from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";
import { cn } from "@/lib/utils";

interface Room {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  sentiment: { label: string; pct: number };
  online: number;
  today: number;
  activityPct: number;
  price?: number;
  priceChange?: number;
  marketStatus?: "Open" | "Closed" | "Pre-Market" | "After-Hours";
  isJoined?: boolean;
  isFavorited?: boolean;
}

interface Message {
  id: number;
  user: string;
  avatar?: string;
  time: string;
  text: string;
  sentiment?: "bullish" | "bearish" | "neutral";
  type?: string;
  likes?: number;
  replies?: number;
  isLiked?: boolean;
  isShared?: boolean;
  badge?: "Verified" | "Pro" | "Moderator";
  reactions?: { emoji: string; count: number; users: string[] }[];
  parentId?: number;
}

interface Contributor {
  id: string;
  name: string;
  avatar: string;
  messageCount: number;
  badge?: string;
}

interface PinnedMessage {
  id: number;
  user: string;
  text: string;
  time: string;
  badge?: string;
}

interface EnhancedChatRoomPageProps {
  room: Room;
  onBack?: () => void;
  authed?: boolean;
}

export const EnhancedChatRoomPage: React.FC<EnhancedChatRoomPageProps> = ({
  room: initialRoom,
  onBack,
  authed = false
}) => {
  // State management
  const [room, setRoom] = useState(initialRoom);
  const [filter, setFilter] = useState<string>("all");
  const [sentiment, setSentiment] = useState<string>("neutral");
  const [messageBody, setMessageBody] = useState<string>("");
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [postToFeed, setPostToFeed] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<"chat" | "pinned" | "stats">("chat");
  const [expandedThreads, setExpandedThreads] = useState<Set<number>>(new Set());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data
  const [pinnedMessages] = useState<PinnedMessage[]>([
    {
      id: 1,
      user: "TradingMod",
      text: "Welcome to $AAPL Traders! Share clear setups with entry/exit points. Use proper tickers and be respectful.",
      time: "Pinned",
      badge: "Moderator"
    },
    {
      id: 2,
      user: "AlphaTrader",
      text: "Key levels to watch: Support at $185, Resistance at $195. Volume has been strong above $190.",
      time: "1h ago",
      badge: "Pro"
    }
  ]);

  const [topContributors] = useState<Contributor[]>([
    { id: "1", name: "AlphaTrader", avatar: "/placeholder.svg", messageCount: 47, badge: "Pro" },
    { id: "2", name: "TechAnalyst", avatar: "/placeholder.svg", messageCount: 32, badge: "Verified" },
    { id: "3", name: "OptionsPro", avatar: "/placeholder.svg", messageCount: 28 },
    { id: "4", name: "SwingKing", avatar: "/placeholder.svg", messageCount: 19 },
    { id: "5", name: "DayTrader99", avatar: "/placeholder.svg", messageCount: 15 }
  ]);

  const [recentTrades] = useState([
    { ticker: "$AAPL", action: "LONG", price: "$192.50", time: "2m ago", sentiment: "bullish" },
    { ticker: "$AAPL", action: "CALLS", price: "$195", time: "5m ago", sentiment: "bullish" },
    { ticker: "$AAPL", action: "PUTS", price: "$185", time: "8m ago", sentiment: "bearish" }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      user: "AlphaTrader",
      avatar: "/placeholder.svg",
      time: "2m ago",
      text: "Watching $AAPL above 195 for a breakout. Volume is picking up nicely 🚀",
      sentiment: "bullish",
      likes: 5,
      replies: 2,
      isLiked: false,
      badge: "Pro",
      reactions: [
        { emoji: "🚀", count: 3, users: ["user1", "user2", "user3"] },
        { emoji: "👍", count: 2, users: ["user4", "user5"] }
      ]
    },
    {
      id: 2,
      user: "TechAnalyst",
      avatar: "/placeholder.svg",
      time: "4m ago",
      text: "IV is steady around 25%. Good setup for debit spreads if we break resistance. #OptionsPlay",
      sentiment: "neutral",
      likes: 3,
      replies: 1,
      isLiked: false,
      badge: "Verified",
      reactions: [
        { emoji: "🎯", count: 4, users: ["user1", "user2", "user3", "user6"] }
      ]
    },
    {
      id: 3,
      user: "BearTrader",
      avatar: "/placeholder.svg",
      time: "7m ago",
      text: "Still seeing distribution at these levels. $AAPL might see a pullback to $185 support 🐻",
      sentiment: "bearish",
      likes: 2,
      replies: 0,
      isLiked: false,
      reactions: [
        { emoji: "🐻", count: 2, users: ["user7", "user8"] }
      ]
    }
  ]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handlers
  const handleJoinRoom = () => {
    if (!authed) {
      setShowAuthModal(true);
      return;
    }
    setRoom(prev => ({ ...prev, isJoined: !prev.isJoined }));
  };

  const handleFavoriteRoom = () => {
    if (!authed) {
      setShowAuthModal(true);
      return;
    }
    setRoom(prev => ({ ...prev, isFavorited: !prev.isFavorited }));
  };

  const handleSentimentVote = (sentimentType: "bullish" | "bearish") => {
    if (!authed) {
      setShowAuthModal(true);
      return;
    }
    // Update room sentiment based on vote
    const currentPct = room.sentiment.pct;
    const newPct = sentimentType === "bullish" ? 
      Math.min(100, currentPct + 1) : 
      Math.max(0, currentPct - 1);
    
    setRoom(prev => ({
      ...prev,
      sentiment: {
        label: newPct > 60 ? "Bullish" : newPct < 40 ? "Bearish" : "Neutral",
        pct: newPct
      }
    }));
  };

  const handleSendMessage = () => {
    if (!messageBody.trim() || !authed) return;
    
    const newMessage: Message = {
      id: Date.now(),
      user: "You",
      time: "Just now",
      text: messageBody,
      sentiment: sentiment as any,
      likes: 0,
      replies: 0,
      isLiked: false,
      reactions: []
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageBody("");
    
    if (postToFeed) {
      // Logic to post to sentiment feed would go here
      console.log("Also posting to sentiment feed:", newMessage);
    }
  };

  const handleReaction = (messageId: number, emoji: string) => {
    if (!authed) {
      setShowAuthModal(true);
      return;
    }

    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existingReaction = reactions.find(r => r.emoji === emoji);
        
        if (existingReaction) {
          // Toggle reaction
          const userHasReacted = existingReaction.users.includes("You");
          return {
            ...msg,
            reactions: reactions.map(r => 
              r.emoji === emoji 
                ? {
                    ...r,
                    count: userHasReacted ? r.count - 1 : r.count + 1,
                    users: userHasReacted 
                      ? r.users.filter(u => u !== "You")
                      : [...r.users, "You"]
                  }
                : r
            ).filter(r => r.count > 0)
          };
        } else {
          // Add new reaction
          return {
            ...msg,
            reactions: [...reactions, { emoji, count: 1, users: ["You"] }]
          };
        }
      }
      return msg;
    }));
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "bullish": return "text-green-400";
      case "bearish": return "text-red-400";
      default: return "text-yellow-400";
    }
  };

  const getSentimentBg = (sentiment?: string) => {
    switch (sentiment) {
      case "bullish": return "bg-green-500/20";
      case "bearish": return "bg-red-500/20";
      default: return "bg-yellow-500/20";
    }
  };

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case "Moderator": return <Shield className="w-3 h-3 text-red-400" />;
      case "Pro": return <Crown className="w-3 h-3 text-yellow-400" />;
      case "Verified": return <Zap className="w-3 h-3 text-blue-400" />;
      default: return null;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="bg-[#0B1020] min-h-screen flex flex-col">
      {/* Header Bar */}
      <div className="bg-[#10162A] border-b border-white/6 p-4">
        <div className="flex items-center justify-between">
          {/* Left: Room info */}
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="text-white/60 hover:text-white/80">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center gap-3">
              <span className="text-3xl">{room.icon}</span>
              <div>
                <h1 className="text-[#E7ECF4] font-bold text-xl">{room.name}</h1>
                <p className="text-[#8EA0B6] text-sm">{room.description}</p>
              </div>
            </div>
          </div>

          {/* Middle: Sentiment & Price Stats */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={cn("text-lg font-bold", getSentimentColor(room.sentiment.label.toLowerCase()))}>
                  {room.sentiment.pct}%
                </div>
                <div className="text-xs text-[#8EA0B6]">{room.sentiment.label}</div>
              </div>
              
              {room.price && (
                <div className="text-center">
                  <div className="text-[#E7ECF4] font-bold">
                    {formatPrice(room.price)}
                  </div>
                  <div className={cn("text-xs flex items-center", 
                    (room.priceChange || 0) >= 0 ? "text-green-400" : "text-red-400"
                  )}>
                    {(room.priceChange || 0) >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {room.priceChange}%
                  </div>
                </div>
              )}
              
              <Badge variant="outline" className={cn(
                "text-xs",
                room.marketStatus === "Open" ? "text-green-400 border-green-400" : "text-red-400 border-red-400"
              )}>
                {room.marketStatus || "Closed"}
              </Badge>
            </div>

            {/* Sentiment Voting */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSentimentVote("bullish")}
                className="text-green-400 hover:bg-green-500/20"
              >
                <TrendingUp className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSentimentVote("bearish")}
                className="text-red-400 hover:bg-red-500/20"
              >
                <TrendingDown className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={handleJoinRoom}
              className={cn(
                "font-medium",
                room.isJoined 
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
              )}
            >
              {room.isJoined ? "Leave Room" : "Join Room"}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleFavoriteRoom}
              className={cn(
                "p-2",
                room.isFavorited ? "text-yellow-400" : "text-white/60 hover:text-yellow-400"
              )}
            >
              <Star className={cn("w-4 h-4", room.isFavorited && "fill-current")} />
            </Button>

            <Button size="sm" variant="ghost" className="text-white/60 hover:text-white/80">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden bg-[#10162A] border-b border-white/6">
        <Tabs value={mobileTab} onValueChange={(value) => setMobileTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3 bg-transparent">
            <TabsTrigger value="chat" className="text-[#8EA0B6] data-[state=active]:text-[#E7ECF4]">Chat</TabsTrigger>
            <TabsTrigger value="pinned" className="text-[#8EA0B6] data-[state=active]:text-[#E7ECF4]">Pinned</TabsTrigger>
            <TabsTrigger value="stats" className="text-[#8EA0B6] data-[state=active]:text-[#E7ECF4]">Stats</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Filter Tabs */}
          <div className="bg-[#0F1629] border-b border-white/6 p-3">
            <div className="flex gap-2">
              {["all", "charts", "options", "news", "calls", "puts"].map((filterOption) => (
                <Button
                  key={filterOption}
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilter(filterOption)}
                  className={cn(
                    "text-xs px-3 py-1",
                    filter === filterOption 
                      ? "bg-[#1b2741] text-[#E7ECF4]" 
                      : "text-[#8EA0B6] hover:text-[#E7ECF4] hover:bg-[#1b2741]"
                  )}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="group">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage src={message.avatar} alt={message.user} />
                    <AvatarFallback>{message.user[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    {/* User info */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-[#E7ECF4]">{message.user}</span>
                      {getBadgeIcon(message.badge)}
                      {message.sentiment && (
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs px-2 py-0", getSentimentBg(message.sentiment), getSentimentColor(message.sentiment))}
                        >
                          {message.sentiment}
                        </Badge>
                      )}
                      <span className="text-xs text-[#8EA0B6]">{message.time}</span>
                    </div>
                    
                    {/* Message content */}
                    <div className="text-[#E7ECF4] text-sm mb-2 leading-relaxed">
                      {message.text.split(/(\$[A-Z]+|#\w+)/).map((part, index) => {
                        if (part.startsWith('$')) {
                          return <span key={index} className="text-blue-400 cursor-pointer hover:underline">{part}</span>;
                        } else if (part.startsWith('#')) {
                          return <span key={index} className="text-purple-400 cursor-pointer hover:underline">{part}</span>;
                        }
                        return part;
                      })}
                    </div>
                    
                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex gap-1 mb-2">
                        {message.reactions.map((reaction, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReaction(message.id, reaction.emoji)}
                            className={cn(
                              "h-6 px-2 text-xs gap-1",
                              reaction.users.includes("You") 
                                ? "bg-blue-500/20 text-blue-400" 
                                : "bg-[#141A2B] text-[#8EA0B6] hover:bg-[#1b2741]"
                            )}
                          >
                            <span>{reaction.emoji}</span>
                            <span>{reaction.count}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Quick reactions */}
                      <div className="flex gap-1">
                        {["👍", "🚀", "🐻"].map((emoji) => (
                          <Button
                            key={emoji}
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReaction(message.id, emoji)}
                            className="h-6 w-6 p-0 text-xs hover:bg-[#1b2741]"
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setReplyToMessage(message)}
                        className="h-6 px-2 text-xs text-[#8EA0B6] hover:text-[#E7ECF4]"
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Composer */}
          {authed ? (
            <div className="bg-[#0F162C] border-t border-white/6 p-4">
              <div className="space-y-3">
                {/* Sentiment Selection */}
                <div className="flex gap-2">
                  {[
                    { key: "bullish", label: "Bullish", icon: TrendingUp, color: "text-green-400" },
                    { key: "bearish", label: "Bearish", icon: TrendingDown, color: "text-red-400" },
                    { key: "neutral", label: "Neutral", icon: Minus, color: "text-yellow-400" }
                  ].map((option) => (
                    <Button
                      key={option.key}
                      size="sm"
                      variant="ghost"
                      onClick={() => setSentiment(option.key)}
                      className={cn(
                        "gap-2",
                        sentiment === option.key 
                          ? `${option.color} bg-current/10` 
                          : "text-[#8EA0B6] hover:text-[#E7ECF4]"
                      )}
                    >
                      <option.icon className="w-3 h-3" />
                      {option.label}
                    </Button>
                  ))}
                </div>

                {/* Input Area */}
                <div className="flex gap-3">
                  <div className="flex-1 space-y-2">
                    <textarea
                      placeholder="Share your analysis, setup, or ask questions... Use $ for tickers and # for topics"
                      value={messageBody}
                      onChange={(e) => setMessageBody(e.target.value)}
                      className="w-full min-h-[60px] bg-[#0B1020] border border-[rgba(127,209,255,0.25)] text-[#E7ECF4] rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-[rgba(127,209,255,0.4)]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="text-[#8EA0B6] hover:text-[#E7ECF4]">
                          <ImageIcon className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-[#8EA0B6] hover:text-[#E7ECF4]">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                        <label className="flex items-center gap-2 text-xs text-[#8EA0B6] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={postToFeed}
                            onChange={(e) => setPostToFeed(e.target.checked)}
                            className="w-3 h-3"
                          />
                          Post to Sentiment Feed
                        </label>
                      </div>
                      
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageBody.trim()}
                        className="bg-gradient-to-r from-[#4DA8FF] to-[#6CCEFF] text-white font-medium hover:opacity-90 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0F162C] border-t border-white/6 p-4 text-center">
              <p className="text-[#8EA0B6] mb-3">Join the conversation! Sign in to chat, react, and share insights.</p>
              <Button onClick={() => setShowAuthModal(true)} className="bg-[#1DD882] text-[#041311] font-bold">
                Sign In to Chat
              </Button>
            </div>
          )}
        </div>

        {/* Right Sidebar - Desktop Only */}
        <div className="hidden lg:block w-80 bg-[#0F1629] border-l border-white/6 p-4 space-y-4">
          {/* Pinned Messages */}
          <div className="bg-[#10162A] rounded-xl p-4">
            <h3 className="text-[#E7ECF4] font-semibold mb-3 flex items-center gap-2">
              <Pin className="w-4 h-4 text-yellow-400" />
              Pinned Messages
            </h3>
            <div className="space-y-3">
              {pinnedMessages.map((pin) => (
                <div key={pin.id} className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[#E7ECF4]">{pin.user}</span>
                    {getBadgeIcon(pin.badge)}
                    <span className="text-xs text-[#8EA0B6]">{pin.time}</span>
                  </div>
                  <p className="text-[#8EA0B6] text-xs leading-relaxed">{pin.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Live Ticker Card */}
          <div className="bg-[#10162A] rounded-xl p-4">
            <h3 className="text-[#E7ECF4] font-semibold mb-3">Live Ticker</h3>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-[#E7ECF4]">
                {room.price ? formatPrice(room.price) : "$192.45"}
              </div>
              <div className={cn("flex items-center justify-center gap-1",
                (room.priceChange || 2.3) >= 0 ? "text-green-400" : "text-red-400"
              )}>
                {(room.priceChange || 2.3) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{room.priceChange || 2.3}%</span>
              </div>
              <div className="h-16 bg-[#0B1020] rounded-lg flex items-center justify-center">
                <span className="text-xs text-[#8EA0B6]">📈 Mini Chart</span>
              </div>
            </div>
          </div>

          {/* Top Contributors */}
          <div className="bg-[#10162A] rounded-xl p-4">
            <h3 className="text-[#E7ECF4] font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Top Contributors Today
            </h3>
            <div className="space-y-2">
              {topContributors.map((contributor, index) => (
                <div key={contributor.id} className="flex items-center gap-3">
                  <div className="text-xs text-[#8EA0B6] w-4">#{index + 1}</div>
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={contributor.avatar} alt={contributor.name} />
                    <AvatarFallback className="text-xs">{contributor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-[#E7ECF4] truncate">{contributor.name}</span>
                      {getBadgeIcon(contributor.badge)}
                    </div>
                  </div>
                  <span className="text-xs text-[#8EA0B6]">{contributor.messageCount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Trades */}
          <div className="bg-[#10162A] rounded-xl p-4">
            <h3 className="text-[#E7ECF4] font-semibold mb-3">Recent Trade Ideas</h3>
            <div className="space-y-2">
              {recentTrades.map((trade, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">{trade.ticker}</span>
                    <Badge 
                      variant="outline" 
                      className={cn("px-1 py-0", getSentimentBg(trade.sentiment), getSentimentColor(trade.sentiment))}
                    >
                      {trade.action}
                    </Badge>
                  </div>
                  <div className="text-[#8EA0B6]">
                    <div>{trade.price}</div>
                    <div>{trade.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      <Dialog open={!!replyToMessage} onOpenChange={() => setReplyToMessage(null)}>
        <DialogContent className="bg-[#10162A] text-[#E7ECF4] border-white/10">
          <DialogHeader>
            <DialogTitle>Reply to {replyToMessage?.user}</DialogTitle>
            <DialogDescription className="text-[#8EA0B6]">
              "{replyToMessage?.text}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <textarea
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full min-h-[80px] bg-[#0B1020] border border-[rgba(127,209,255,0.25)] text-[#E7ECF4] rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-[rgba(127,209,255,0.4)]"
            />
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setReplyToMessage(null)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  // Handle reply logic
                  setReplyToMessage(null);
                  setReplyText("");
                }}
                disabled={!replyText.trim()}
                className="bg-gradient-to-r from-[#4DA8FF] to-[#6CCEFF] text-white"
              >
                Send Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="login"
      />
    </div>
  );
};
