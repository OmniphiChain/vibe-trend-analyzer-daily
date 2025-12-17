import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Share2, 
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  Pin,
  Image as ImageIcon,
  Smile,
  Send,
  Info,
  ExternalLink,
  Lock,
  ChevronRight
} from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";
import { cn } from "@/lib/utils";

// Theme tokens as CSS variables
const themeStyles = `
  .builder-chat-room {
    --bg: #0B1020;
    --panel: #10162A;
    --soft: #141A2B;
    --text: #E7ECF4;
    --muted: #8EA0B6;
    --accent: #7FD1FF;
    --success: #1DD882;
    --warn: #F8C06B;
    --danger: #FF7A7A;
    --shadow: 0 8px 24px rgba(0,0,0,0.35);
  }
`;

interface BuilderChatRoomProps {
  onBack?: () => void;
}

export const BuilderChatRoom: React.FC<BuilderChatRoomProps> = ({ onBack }) => {
  // State initialization with dummy data
  const [state, setState] = useState({
    authed: false,
    joined: false,
    room: {
      id: "aapl-traders",
      icon: "🍎",
      name: "$AAPL Traders",
      description: "Real-time discussion for Apple traders.",
      category: "Stocks",
      price: {
        symbol: "AAPL",
        last: 198.40,
        changePct: 0.86
      },
      sentiment: {
        bullish: 62,
        bearish: 38
      },
      online: 892,
      today: 180,
      activityPct: 12
    },
    filter: "all",
    sentiment: "neutral",
    messageBody: "",
    messages: [
      {
        id: 1,
        user: "AlphaTrader",
        badge: "Top",
        time: "2m",
        text: "Watching $AAPL > 195 🚀",
        type: "text",
        sentiment: "bullish",
        likes: 12,
        replies: 3,
        avatar: "/placeholder.svg"
      },
      {
        id: 2,
        user: "ChartNerd",
        time: "5m",
        text: "4H wedge breakout nearing",
        type: "chart",
        img: "",
        sentiment: "neutral",
        likes: 7,
        replies: 1,
        avatar: "/placeholder.svg"
      },
      {
        id: 3,
        user: "OptionsPro",
        badge: "Verified",
        time: "8m",
        text: "IV expansion on weekly calls. #OptionsFlow suggests bullish momentum.",
        type: "text",
        sentiment: "bullish",
        likes: 15,
        replies: 5,
        avatar: "/placeholder.svg"
      }
    ],
    pinned: {
      user: "Mod",
      time: "1h",
      text: "Welcome! Share setups. No spam."
    },
    threadFor: null,
    dualPost: true,
    showRules: false,
    favorited: false,
    mobileTab: "chat"
  });

  const [showAuthModal, setShowAuthModal] = useState(false);

  // Filter messages based on current filter
  const filteredMessages = state.messages.filter(msg => {
    if (state.filter === "all") return true;
    if (state.filter === "charts") return msg.type === "chart";
    return msg.type === state.filter;
  });

  // Handlers
  const handleSendMessage = () => {
    if (!state.messageBody.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      user: "You",
      time: "Just now",
      text: state.messageBody,
      type: "text",
      sentiment: state.sentiment,
      likes: 0,
      replies: 0,
      avatar: "/placeholder.svg"
    };

    setState(prev => ({
      ...prev,
      messages: [newMessage, ...prev.messages],
      messageBody: ""
    }));

    if (state.dualPost) {
      console.log("Also posting to sentiment feed:", newMessage);
    }
  };

  const handleJoinRoom = () => {
    if (!state.authed) {
      setShowAuthModal(true);
      return;
    }
    setState(prev => ({ ...prev, joined: !prev.joined }));
  };

  const handleLike = (messageId: number) => {
    if (!state.authed || !state.joined) {
      setShowAuthModal(true);
      return;
    }
    
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(msg =>
        msg.id === messageId 
          ? { ...msg, likes: msg.likes + 1 }
          : msg
      )
    }));
  };

  const parseMessageText = (text: string) => {
    return text.split(/(\$[A-Z]+|#\w+)/).map((part, index) => {
      if (part.startsWith('$')) {
        return (
          <span key={index} className="inline-flex items-center rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400 cursor-pointer hover:bg-blue-500/30">
            {part}
          </span>
        );
      } else if (part.startsWith('#')) {
        return (
          <span key={index} className="inline-flex items-center rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-medium text-purple-400 cursor-pointer hover:bg-purple-500/30">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <>
      <style>{themeStyles}</style>
      <div className="builder-chat-room min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
        {/* Header / Ticker Bar */}
        <div className="sticky top-0 z-50" style={{ backgroundColor: "var(--panel)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="p-4">
            <div className="flex items-center justify-between">
              {/* Left: Room info */}
              <div className="flex items-center gap-4">
                {onBack && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    className="p-2"
                    style={{ color: "var(--muted)" }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{state.room.icon}</span>
                  <div>
                    <h1 className="font-bold text-lg" style={{ color: "var(--text)" }}>
                      {state.room.name}
                    </h1>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      {state.room.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setState(prev => ({ ...prev, favorited: !prev.favorited }))}
                  className={cn("p-2", state.favorited ? "text-yellow-400" : "")}
                  style={{ color: state.favorited ? "#F8C06B" : "var(--muted)" }}
                >
                  <Star className={cn("h-4 w-4", state.favorited && "fill-current")} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                  style={{ color: "var(--muted)" }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  onClick={handleJoinRoom}
                  className="font-medium"
                  style={{
                    backgroundColor: state.joined ? "rgba(255,122,122,0.2)" : "rgba(29,216,130,0.2)",
                    color: state.joined ? "var(--danger)" : "var(--success)"
                  }}
                >
                  {state.joined ? "Leave Room" : "Join Room"}
                </Button>
              </div>
            </div>

            {/* Stats Strip */}
            <div className="mt-4 flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-3">
                <Badge 
                  className="px-3 py-1"
                  style={{ 
                    backgroundColor: "rgba(29,216,130,0.2)", 
                    color: "var(--success)" 
                  }}
                >
                  Bullish {state.room.sentiment.bullish}%
                </Badge>
                <Badge 
                  className="px-3 py-1"
                  style={{ 
                    backgroundColor: "rgba(255,122,122,0.2)", 
                    color: "var(--danger)" 
                  }}
                >
                  Bearish {state.room.sentiment.bearish}%
                </Badge>
              </div>

              <div className="text-sm" style={{ color: "var(--text)" }}>
                {state.room.price.symbol} ${state.room.price.last} 
                <span 
                  className="ml-1"
                  style={{ color: state.room.price.changePct >= 0 ? "var(--success)" : "var(--danger)" }}
                >
                  ({state.room.price.changePct >= 0 ? '+' : ''}{state.room.price.changePct}%)
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm" style={{ color: "var(--muted)" }}>
                <span>👥 {state.room.online} Online</span>
                <span>💬 {state.room.today} Today</span>
                <span>📈 {state.room.activityPct}% Activity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden border-b" style={{ backgroundColor: "var(--panel)", borderColor: "rgba(255,255,255,0.06)" }}>
          <Tabs value={state.mobileTab} onValueChange={(value) => setState(prev => ({ ...prev, mobileTab: value }))}>
            <TabsList className="grid w-full grid-cols-3 bg-transparent">
              <TabsTrigger value="chat" className="text-sm">Chat</TabsTrigger>
              <TabsTrigger value="pinned" className="text-sm">Pinned</TabsTrigger>
              <TabsTrigger value="stats" className="text-sm">Stats</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main Layout */}
        <div className="flex">
          {/* Center Column (70%) */}
          <div className="flex-1 lg:w-[70%]">
            {/* Guest Preview Banner */}
            {(!state.authed || !state.joined) && (
              <div 
                className="m-4 p-4 rounded-xl border"
                style={{ 
                  backgroundColor: "rgba(127,209,255,0.12)", 
                  borderColor: "rgba(127,209,255,0.3)",
                  color: "var(--accent)"
                }}
              >
                <p className="text-sm mb-2">
                  Read-only preview • Sign in to post & react.
                </p>
                <Button 
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                  style={{ backgroundColor: "var(--success)", color: "var(--bg)" }}
                >
                  Sign in to Join
                </Button>
              </div>
            )}

            {/* Pinned Message */}
            {state.pinned && (
              <div 
                className="m-4 p-4 rounded-xl border-t-2"
                style={{ 
                  backgroundColor: "var(--soft)", 
                  borderTopColor: "var(--warn)"
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Pin className="h-4 w-4" style={{ color: "var(--warn)" }} />
                  <span className="text-sm font-medium" style={{ color: "var(--warn)" }}>
                    Pinned Message
                  </span>
                </div>
                <p className="text-sm" style={{ color: "var(--text)" }}>
                  {state.pinned.text}
                </p>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="px-4 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex gap-2">
                {["all", "charts", "options", "news"].map((filter) => (
                  <Button
                    key={filter}
                    variant="ghost"
                    size="sm"
                    onClick={() => setState(prev => ({ ...prev, filter }))}
                    className={cn(
                      "text-xs px-3 py-1",
                      state.filter === filter 
                        ? "bg-blue-500/20 text-blue-400" 
                        : ""
                    )}
                    style={{
                      color: state.filter === filter ? "var(--accent)" : "var(--muted)"
                    }}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages Feed */}
            <div className="p-4 space-y-4 pb-32">
              {filteredMessages.map((message) => (
                <div 
                  key={message.id} 
                  className="group p-4 rounded-xl transition-colors hover:bg-[#0F162C]"
                  style={{ backgroundColor: "var(--panel)" }}
                >
                  {/* Message Header */}
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={message.avatar} alt={message.user} />
                      <AvatarFallback>{message.user[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium" style={{ color: "var(--text)" }}>
                          {message.user}
                        </span>
                        {message.badge && (
                          <Badge 
                            variant="outline" 
                            className="text-xs px-2 py-0"
                            style={{ color: "var(--warn)", borderColor: "var(--warn)" }}
                          >
                            {message.badge}
                          </Badge>
                        )}
                        <span className="text-xs" style={{ color: "var(--muted)" }}>
                          {message.time}
                        </span>
                      </div>

                      {/* Message Content */}
                      <div className="mb-2" style={{ color: "var(--text)" }}>
                        {parseMessageText(message.text)}
                      </div>

                      {/* Chart placeholder */}
                      {message.type === "chart" && (
                        <div 
                          className="w-full h-32 rounded-lg mb-2 flex items-center justify-center border-2 border-dashed"
                          style={{ borderColor: "var(--muted)" }}
                        >
                          <span className="text-sm" style={{ color: "var(--muted)" }}>
                            📊 Chart Analysis
                          </span>
                        </div>
                      )}

                      {/* Sentiment Badge */}
                      {message.sentiment && (
                        <Badge 
                          className="mb-2 text-xs"
                          style={{
                            backgroundColor: message.sentiment === "bullish" ? "rgba(29,216,130,0.2)" :
                                           message.sentiment === "bearish" ? "rgba(255,122,122,0.2)" :
                                           "rgba(248,192,107,0.2)",
                            color: message.sentiment === "bullish" ? "var(--success)" :
                                   message.sentiment === "bearish" ? "var(--danger)" :
                                   "var(--warn)"
                          }}
                        >
                          {message.sentiment}
                        </Badge>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(message.id)}
                          className="h-8 px-3 text-xs gap-1"
                          style={{ color: "var(--muted)" }}
                          disabled={!state.authed || !state.joined}
                        >
                          <Heart className="h-3 w-3" />
                          {message.likes}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setState(prev => ({ ...prev, threadFor: message.id }))}
                          className="h-8 px-3 text-xs gap-1"
                          style={{ color: "var(--muted)" }}
                          disabled={!state.authed || !state.joined}
                        >
                          <MessageCircle className="h-3 w-3" />
                          {message.replies}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-xs gap-1"
                          style={{ color: "var(--muted)" }}
                          disabled={!state.authed || !state.joined}
                        >
                          <Share2 className="h-3 w-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-xs gap-1"
                          style={{ color: "var(--muted)" }}
                          disabled={!state.authed || !state.joined}
                        >
                          <Star className="h-3 w-3" />
                        </Button>

                        {(!state.authed || !state.joined) && (
                          <div className="flex items-center gap-1 ml-2">
                            <Lock className="h-3 w-3" style={{ color: "var(--muted)" }} />
                            <span className="text-xs" style={{ color: "var(--muted)" }}>
                              Sign in to interact
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Composer */}
            {state.authed && state.joined ? (
              <div 
                className="fixed bottom-0 left-0 right-0 lg:right-[30%] p-4 border-t"
                style={{ 
                  backgroundColor: "var(--panel)", 
                  borderColor: "rgba(255,255,255,0.06)",
                  boxShadow: "var(--shadow)"
                }}
              >
                {/* Sentiment Chips */}
                <div className="flex gap-2 mb-3">
                  {[
                    { key: "bullish", label: "Bullish", color: "var(--success)" },
                    { key: "bearish", label: "Bearish", color: "var(--danger)" },
                    { key: "neutral", label: "Neutral", color: "var(--warn)" }
                  ].map((option) => (
                    <Button
                      key={option.key}
                      variant="ghost"
                      size="sm"
                      onClick={() => setState(prev => ({ ...prev, sentiment: option.key }))}
                      className={cn(
                        "text-xs px-3 py-1",
                        state.sentiment === option.key && "ring-1"
                      )}
                      style={{
                        color: state.sentiment === option.key ? option.color : "var(--muted)",
                        backgroundColor: state.sentiment === option.key ? `${option.color}20` : "transparent",
                        ringColor: state.sentiment === option.key ? option.color : "transparent"
                      }}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>

                {/* Input Area */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <textarea
                      placeholder="Share your setup, levels, or news insight…"
                      value={state.messageBody}
                      onChange={(e) => setState(prev => ({ ...prev, messageBody: e.target.value }))}
                      className="w-full min-h-[60px] p-3 rounded-xl border resize-none focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: "var(--bg)",
                        borderColor: "rgba(127,209,255,0.25)",
                        color: "var(--text)",
                        focusRingColor: "var(--accent)"
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-2"
                          style={{ color: "var(--muted)" }}
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-2"
                          style={{ color: "var(--muted)" }}
                        >
                          <Smile className="h-4 w-4" />
                        </Button>
                        
                        <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: "var(--muted)" }}>
                          <input
                            type="checkbox"
                            checked={state.dualPost}
                            onChange={(e) => setState(prev => ({ ...prev, dualPost: e.target.checked }))}
                            className="w-3 h-3"
                          />
                          Post to Sentiment Feed
                        </label>
                      </div>

                      <Button
                        onClick={handleSendMessage}
                        disabled={!state.messageBody.trim()}
                        size="sm"
                        className="px-4"
                        style={{
                          background: "linear-gradient(90deg, var(--accent), #6CCEFF)",
                          color: "var(--bg)"
                        }}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                className="fixed bottom-0 left-0 right-0 lg:right-[30%] p-4 text-center border-t"
                style={{ 
                  backgroundColor: "var(--panel)", 
                  borderColor: "rgba(255,255,255,0.06)"
                }}
              >
                <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
                  Join the conversation! Sign in to chat, react, and share insights.
                </p>
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  style={{ backgroundColor: "var(--success)", color: "var(--bg)" }}
                >
                  Sign In to Chat
                </Button>
              </div>
            )}
          </div>

          {/* Right Sidebar (30%) - Desktop Only */}
          <div 
            className="hidden lg:block w-[30%] min-h-screen border-l p-4 space-y-4"
            style={{ 
              backgroundColor: "var(--bg)", 
              borderColor: "rgba(255,255,255,0.06)"
            }}
          >
            {/* Why Join Card (for guests) */}
            {(!state.authed || !state.joined) && (
              <div 
                className="p-4 rounded-xl border"
                style={{ 
                  backgroundColor: "var(--panel)", 
                  borderColor: "rgba(127,209,255,0.3)"
                }}
              >
                <h3 className="font-semibold mb-2" style={{ color: "var(--text)" }}>
                  Why Join?
                </h3>
                <ul className="text-sm space-y-1 mb-3" style={{ color: "var(--muted)" }}>
                  <li>• Real-time chat & reactions</li>
                  <li>• Share your trade setups</li>
                  <li>• Get alerts on key levels</li>
                  <li>• Follow top traders</li>
                </ul>
                <Button 
                  size="sm" 
                  onClick={() => setShowAuthModal(true)}
                  style={{ backgroundColor: "var(--success)", color: "var(--bg)" }}
                >
                  Sign In Now
                </Button>
              </div>
            )}

            {/* Room Guide */}
            <div 
              className="p-4 rounded-xl"
              style={{ backgroundColor: "var(--panel)" }}
            >
              <h3 className="font-semibold mb-2" style={{ color: "var(--text)" }}>
                Room Guide
              </h3>
              <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
                Share clear setups with entry/exit points. Use proper tickers and be respectful.
              </p>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setState(prev => ({ ...prev, showRules: true }))}
                className="text-xs p-0"
                style={{ color: "var(--accent)" }}
              >
                Read full rules →
              </Button>
            </div>

            {/* Hot Threads */}
            <div 
              className="p-4 rounded-xl"
              style={{ backgroundColor: "var(--panel)" }}
            >
              <h3 className="font-semibold mb-3" style={{ color: "var(--text)" }}>
                Hot Threads
              </h3>
              <div className="space-y-2">
                {state.messages.slice(0, 3).map((msg) => (
                  <div key={msg.id} className="text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium" style={{ color: "var(--text)" }}>
                        {msg.user}
                      </span>
                      <span style={{ color: "var(--muted)" }}>
                        {msg.likes} likes
                      </span>
                    </div>
                    <p className="truncate" style={{ color: "var(--muted)" }}>
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Contributors */}
            <div 
              className="p-4 rounded-xl"
              style={{ backgroundColor: "var(--panel)" }}
            >
              <h3 className="font-semibold mb-3" style={{ color: "var(--text)" }}>
                Top Contributors
              </h3>
              <div className="flex -space-x-2">
                {["AlphaTrader", "ChartNerd", "OptionsPro", "BullRun", "TechAnalyst"].map((name, index) => (
                  <Avatar key={name} className="h-8 w-8 border-2 border-[var(--panel)]">
                    <AvatarFallback className="text-xs">{name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div 
              className="p-4 rounded-xl"
              style={{ backgroundColor: "var(--panel)" }}
            >
              <h3 className="font-semibold mb-3" style={{ color: "var(--text)" }}>
                Quick Links
              </h3>
              <div className="space-y-2">
                {[
                  "AAPL News",
                  "Options Flow", 
                  "Analyst Ratings"
                ].map((link) => (
                  <Button
                    key={link}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-xs"
                    style={{ color: "var(--muted)" }}
                  >
                    {link}
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Thread Drawer */}
        <Drawer open={!!state.threadFor} onOpenChange={() => setState(prev => ({ ...prev, threadFor: null }))}>
          <DrawerContent 
            className="h-[80vh]"
            style={{ backgroundColor: "var(--panel)", color: "var(--text)" }}
          >
            <DrawerHeader>
              <DrawerTitle>Thread</DrawerTitle>
              <DrawerDescription style={{ color: "var(--muted)" }}>
                Replies to message
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Thread functionality would be implemented here...
              </p>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Rules Modal */}
        <Dialog open={state.showRules} onOpenChange={(open) => setState(prev => ({ ...prev, showRules: open }))}>
          <DialogContent style={{ backgroundColor: "var(--panel)", color: "var(--text)" }}>
            <DialogHeader>
              <DialogTitle>Room Rules</DialogTitle>
              <DialogDescription style={{ color: "var(--muted)" }}>
                Community guidelines for {state.room.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-sm" style={{ color: "var(--text)" }}>
              <p>1. Be respectful to all members</p>
              <p>2. No spam, pump schemes, or shilling</p>
              <p>3. Use proper ticker symbols ($AAPL)</p>
              <p>4. Share clear entry/exit points for setups</p>
              <p>5. Keep discussions relevant to {state.room.category}</p>
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
    </>
  );
};
