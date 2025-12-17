import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Plus, Settings, MoreHorizontal, Heart, MessageSquare, 
  Share2, Brain, Users, Volume2, VolumeX, Pin, Star, TrendingUp,
  Send, Smile, Paperclip, Hash, Shield, ChevronDown, ChevronRight,
  BarChart3, Zap, Clock, Target, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

// CSS Variables for refined dark mode theme
const cssVars = `
  .live-chat-theme {
    --bg: #0B1020;
    --panel: #10162A;
    --panel-soft: #141A2B;
    --text: #E7ECF4;
    --muted: #8EA0B6;
    --accent: #7FD1FF;
    --success: #1DD882;
    --warn: #F8C06B;
    --danger: #FF7A7A;
    --shadow: 0 8px 24px rgba(0,0,0,0.35);

    /* Sentiment colors with better contrast */
    --bullish-bg: rgba(29,216,130,.16);
    --bullish-text: #91F0C8;
    --bearish-bg: rgba(255,122,122,.16);
    --bearish-text: #FF9D9D;
    --neutral-bg: rgba(248,192,107,.16);
    --neutral-text: #FFD89A;

    /* AI button styling */
    --ai-border: rgba(127,209,255,.5);
    --ai-bg: rgba(127,209,255,.08);
    --ai-bg-hover: rgba(127,209,255,.14);
  }
`;

interface Room {
  id: string;
  name: string;
  icon: string;
  category: string;
  onlineCount: number;
  unreadCount: number;
  isPinned: boolean;
  isVip: boolean;
  description: string;
}

interface Message {
  id: string;
  user: {
    name: string;
    handle: string;
    avatar: string;
    reputation: number;
    sentiment: 'bullish' | 'bearish' | 'neutral';
  };
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  isLiked: boolean;
  isFollowing: boolean;
  badges: string[];
  tickers: string[];
  sentimentTags: string[];
}

interface ThreadReply {
  id: string;
  user: {
    name: string;
    handle: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

const mockRooms: Room[] = [
  {
    id: '1',
    name: 'General Chat',
    icon: '💬',
    category: 'general',
    onlineCount: 89,
    unreadCount: 3,
    isPinned: true,
    isVip: false,
    description: 'General market discussion'
  },
  {
    id: '2',
    name: 'Crypto Central',
    icon: '₿',
    category: 'crypto',
    onlineCount: 156,
    unreadCount: 0,
    isPinned: false,
    isVip: true,
    description: 'Cryptocurrency discussions'
  },
  {
    id: '3',
    name: 'Stock Analysis',
    icon: '📈',
    category: 'stocks',
    onlineCount: 78,
    unreadCount: 7,
    isPinned: false,
    isVip: false,
    description: 'Stock market analysis'
  },
  {
    id: '4',
    name: 'Options Trading',
    icon: '📊',
    category: 'stocks',
    onlineCount: 42,
    unreadCount: 1,
    isPinned: false,
    isVip: false,
    description: 'Options strategies and trades'
  },
  {
    id: '5',
    name: 'VIP Signals',
    icon: '🎯',
    category: 'signals',
    onlineCount: 23,
    unreadCount: 0,
    isPinned: false,
    isVip: true,
    description: 'Premium trading signals'
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    user: {
      name: 'Alex Chen',
      handle: '@alextrader',
      avatar: '/placeholder.svg',
      reputation: 8.7,
      sentiment: 'bullish'
    },
    content: 'Just analyzed $AAPL earnings report. Revenue growth looks solid at 8.2% YoY. Expecting a breakout above $185 resistance.',
    timestamp: '2 min ago',
    likes: 12,
    replies: 3,
    isLiked: false,
    isFollowing: true,
    badges: ['Community Favorite'],
    tickers: ['$AAPL'],
    sentimentTags: ['Bullish']
  },
  {
    id: '2',
    user: {
      name: 'Sarah Kim',
      handle: '@sarahcrypto',
      avatar: '/placeholder.svg',
      reputation: 9.2,
      sentiment: 'bearish'
    },
    content: 'Market correction might be incoming. Volume on $SPY is decreasing and we\'re seeing some unusual whale movements in $BTC.',
    timestamp: '5 min ago',
    likes: 8,
    replies: 1,
    isLiked: true,
    isFollowing: false,
    badges: ['Pinned'],
    tickers: ['$SPY', '$BTC'],
    sentimentTags: ['Bearish']
  }
];

const mockReplies: ThreadReply[] = [
  {
    id: '1',
    user: {
      name: 'Mike Johnson',
      handle: '@mikej',
      avatar: '/placeholder.svg'
    },
    content: 'Great analysis! What do you think about the guidance for next quarter?',
    timestamp: '1 min ago'
  }
];

export const LiveChatRooms: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState(mockRooms[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState<'bullish' | 'bearish' | 'neutral' | null>(null);
  const [isThreadOpen, setIsThreadOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [expandedCategories, setExpandedCategories] = useState({
    general: true,
    crypto: true,
    stocks: true,
    signals: true,
    vip: true
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roomsByCategory = mockRooms.reduce((acc, room) => {
    if (!acc[room.category]) acc[room.category] = [];
    acc[room.category].push(room);
    return acc;
  }, {} as Record<string, Room[]>);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'bg-green-500';
      case 'bearish': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Bullish': return 'bg-[var(--bullish-bg)] text-[var(--bullish-text)] border-[var(--bullish-text)]/30';
      case 'Bearish': return 'bg-[var(--bearish-bg)] text-[var(--bearish-text)] border-[var(--bearish-text)]/30';
      default: return 'bg-[var(--neutral-bg)] text-[var(--neutral-text)] border-[var(--neutral-text)]/30';
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle message sending logic
      setMessageInput('');
      setSelectedSentiment(null);
    }
  };

  const handleThreadOpen = (message: Message) => {
    setSelectedMessage(message);
    setIsThreadOpen(true);
  };

  return (
    <>
      <style>{cssVars}</style>
      <div className="live-chat-theme h-[800px] bg-[#0B1020] text-[#E7ECF4] rounded-lg overflow-hidden relative flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-gray-700/30 bg-[#10162A] flex items-center justify-between flex-shrink-0">
          <Button
            size="sm"
            onClick={() => setIsMobileMenuOpen(true)}
            className="bg-[#7FD1FF]/10 hover:bg-[#7FD1FF]/20 text-[#7FD1FF] border-[#7FD1FF]/30"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Rooms
          </Button>
          <div className="flex items-center gap-2">
            <div className="text-lg">{selectedRoom.icon}</div>
            <h2 className="text-lg font-semibold text-[#E7ECF4]">{selectedRoom.name}</h2>
          </div>
          <div className="flex items-center gap-1 text-sm text-[#8EA0B6]">
            <Users className="h-4 w-4" />
            {selectedRoom.onlineCount}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1 min-h-0">

          {/* Left Sidebar - Chat Rooms */}
          <div className="hidden lg:block lg:col-span-3 bg-[#0F1421] border-r border-gray-700/30">
            <div className="p-4 border-b border-gray-700/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#E7ECF4]">Chat Rooms</h3>
                <Button 
                  size="sm" 
                  className="bg-[#7FD1FF]/10 hover:bg-[#7FD1FF]/20 text-[#7FD1FF] border-[#7FD1FF]/30"
                  data-room="create"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8EA0B6]" />
                <Input
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#141A2B] border-gray-600/30 text-[#E7ECF4] placeholder:text-[#8EA0B6] focus:border-[#7FD1FF]/50"
                />
              </div>
            </div>

            <ScrollArea className="flex-1 min-h-0">
              <div className="p-2">
                {Object.entries(roomsByCategory).map(([category, rooms]) => (
                  <div key={category} className="mb-4">
                    <button
                      onClick={() => setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }))}
                      className="flex items-center gap-2 w-full p-2 text-sm font-medium text-[#8EA0B6] hover:text-[#E7ECF4] transition-colors"
                    >
                      {expandedCategories[category] ? 
                        <ChevronDown className="h-3 w-3" /> : 
                        <ChevronRight className="h-3 w-3" />
                      }
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                    
                    {expandedCategories[category] && (
                      <div className="space-y-1 ml-2">
                        {rooms.map((room) => (
                          <div
                            key={room.id}
                            onClick={() => setSelectedRoom(room)}
                            className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-[var(--panel-soft)] hover:-translate-y-0.5 hover:shadow-[var(--shadow)] group ${
                              selectedRoom.id === room.id ? 'bg-[var(--panel-soft)] shadow-lg' : ''
                            }`}
                            data-room={room.id}
                          >
                            <div className="text-lg">{room.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm truncate text-[#E7ECF4]">{room.name}</span>
                                {room.isPinned && <Pin className="h-3 w-3 text-orange-400" />}
                                {room.isVip && <Shield className="h-3 w-3 text-purple-400" />}
                              </div>
                              <div className="text-xs text-[#8EA0B6]">{room.onlineCount} online</div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {room.unreadCount > 0 && (
                                <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
                                  {room.unreadCount}
                                </Badge>
                              )}
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Center Panel - Messages */}
          <div className="col-span-1 lg:col-span-6 bg-[#0B1020] flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-700/30 bg-[#10162A] flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-xl">{selectedRoom.icon}</div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#E7ECF4]">{selectedRoom.name}</h2>
                    <p className="text-sm text-[#8EA0B6]">{selectedRoom.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm text-[#8EA0B6]">
                    <Users className="h-4 w-4" />
                    {selectedRoom.onlineCount}
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <Button size="sm" variant="ghost" className="text-[#8EA0B6] hover:text-[#E7ECF4]">
                    <VolumeX className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-[#8EA0B6] hover:text-[#E7ECF4]">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 overflow-auto">
              <div className="space-y-4">
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    className="group bg-[var(--panel)] rounded-2xl p-[18px] transition-all duration-200 hover:bg-[#0F162C] shadow-[var(--shadow)]"
                    data-message-id={message.id}
                    data-sentiment={message.user.sentiment}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={message.user.avatar} />
                          <AvatarFallback>{message.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#10162A] ${getSentimentColor(message.user.sentiment)}`}></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-[15px] text-[var(--text)]">{message.user.name}</span>
                          <span className="text-[14px] text-[var(--muted)]">{message.user.handle}</span>
                          <Badge className="bg-[rgba(127,209,255,.15)] text-[var(--accent)] border-[var(--accent)]/30 text-xs px-2 py-0.5 rounded-full font-medium">
                            {message.user.reputation}
                          </Badge>
                          {message.badges.map((badge) => (
                            <Badge key={badge} className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 text-xs px-2 py-0.5 rounded-full">
                              {badge}
                            </Badge>
                          ))}
                          <span className="text-[13px] text-[var(--muted)] ml-auto font-medium">{message.timestamp}</span>
                        </div>
                        
                        <p className="text-[15px] text-[var(--text)] leading-[1.55] mb-4 line-clamp-3">
                          {message.content}
                          {message.content.length > 150 && (
                            <button className="text-[var(--accent)] hover:text-[var(--accent)]/80 ml-2 text-sm font-medium">
                              Read more
                            </button>
                          )}
                        </p>

                        {/* Tickers and Sentiment Tags */}
                        <div className="flex items-center gap-2 mb-4">
                          {message.tickers.map((ticker) => (
                            <Badge
                              key={ticker}
                              className="bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/30 text-xs px-2 py-1 rounded-lg hover:bg-[var(--accent)]/15 cursor-pointer transition-colors"
                              data-ticker={ticker}
                            >
                              {ticker}
                            </Badge>
                          ))}
                          {message.sentimentTags.map((tag) => (
                            <Badge
                              key={tag}
                              className={`text-xs px-2 py-1 rounded-lg cursor-pointer transition-colors ${getSentimentBadgeColor(tag)}`}
                              title={`${tag} sentiment — expecting ${tag.toLowerCase()} movement`}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        {/* Action Row */}
                        <div className="flex items-center gap-3 text-sm">
                          <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:bg-white/5 ${message.isLiked ? 'text-red-400' : 'text-[var(--muted)] hover:text-red-400'}`}>
                            <Heart className={`h-4 w-4 ${message.isLiked ? 'fill-current' : ''}`} />
                            <span className="font-medium">{message.likes}</span>
                          </button>
                          <button
                            onClick={() => handleThreadOpen(message)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:bg-white/5 text-[var(--muted)] hover:text-[var(--accent)]"
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span className="font-medium">{message.replies}</span>
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:bg-white/5 text-[var(--muted)] hover:text-[var(--text)]">
                            <Share2 className="h-4 w-4" />
                            <span className="font-medium">Share</span>
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--ai-border)] bg-[var(--ai-bg)] text-[var(--accent)] hover:bg-[var(--ai-bg-hover)] transition-all font-medium">
                            <Brain className="h-4 w-4" />
                            <span>AI Summarize</span>
                          </button>
                          <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:bg-white/5 font-medium ${
                            message.isFollowing
                              ? 'text-[var(--success)]'
                              : 'text-[var(--muted)] hover:text-[var(--success)]'
                          }`}>
                            <span>{message.isFollowing ? 'Following' : 'Follow'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Message Composer */}
            <div
              className="sticky bottom-0 bg-[#0F162C] backdrop-blur-md border-t border-white/[0.06] shadow-[0_-8px_28px_rgba(0,0,0,0.45)] z-20 p-[14px_16px] rounded-t-2xl"
              style={{
                backdropFilter: 'saturate(120%) blur(6px)'
              }}
            >
              {/* Sentiment Selection */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-[#8EA0B6] opacity-90">Sentiment:</span>
                {(['bullish', 'bearish', 'neutral'] as const).map((sentiment) => (
                  <button
                    key={sentiment}
                    onClick={() => setSelectedSentiment(selectedSentiment === sentiment ? null : sentiment)}
                    className={`px-2 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      selectedSentiment === sentiment
                        ? sentiment === 'bullish' ? 'bg-[rgba(29,216,130,.16)] text-[#91F0C8] border border-[#91F0C8]/30' :
                          sentiment === 'bearish' ? 'bg-[rgba(255,122,122,.16)] text-[#FF9D9D] border border-[#FF9D9D]/30' :
                          'bg-[rgba(248,192,107,.16)] text-[#FFD89A] border border-[#FFD89A]/30'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border border-gray-600/30'
                    }`}
                  >
                    {sentiment}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="flex items-end gap-2">
                <Textarea
                  placeholder="Share an insight..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 min-h-[56px] max-h-[120px] bg-[#0B1020] border border-[rgba(127,209,255,0.25)] text-[#E7ECF4] placeholder:text-[#8EA0B6] placeholder:opacity-90 focus:border-[#7FD1FF] focus:outline-none focus:ring-[3px] focus:ring-[rgba(127,209,255,0.18)] resize-vertical rounded-xl text-sm p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button size="sm" variant="ghost" className="h-10 w-10 text-[#8EA0B6] hover:text-[#E7ECF4] hover:bg-white/5 rounded-lg">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-10 w-10 text-[#8EA0B6] hover:text-[#E7ECF4] hover:bg-white/5 rounded-lg">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="h-10 w-10 bg-[#7FD1FF] hover:bg-[#7FD1FF]/80 text-black rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:scale-100"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Insights */}
          <div className="hidden lg:block lg:col-span-3 bg-[#0F1421] border-l border-gray-700/30 p-4">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                
                {/* Room Metrics */}
                <Card className="bg-[var(--panel)] border-gray-700/30 shadow-[var(--shadow)]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-[18px] text-[var(--text)] font-bold">Room Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[14px] text-[var(--muted)] font-medium">Online now</span>
                      <span className="text-[15px] font-bold text-[var(--text)]">{selectedRoom.onlineCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[14px] text-[var(--muted)] font-medium">Msgs last hour</span>
                      <span className="text-[15px] font-bold text-[var(--text)]">247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[14px] text-[var(--muted)] font-medium">Trend vs. daily avg</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-[var(--success)]" />
                        <span className="text-[15px] font-bold text-[var(--success)]">+32%</span>
                      </div>
                    </div>
                    <button className="w-full h-16 bg-[var(--panel-soft)] rounded-lg flex items-center justify-center hover:bg-[var(--panel-soft)]/80 transition-colors cursor-pointer group">
                      <Activity className="h-6 w-6 text-[var(--accent)] group-hover:scale-110 transition-transform" />
                    </button>
                  </CardContent>
                </Card>

                {/* Trending Tickers */}
                <Card className="bg-[var(--panel)] border-gray-700/30 shadow-[var(--shadow)]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-[18px] text-[var(--text)] font-bold">Trending Tickers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {['$AAPL', '$TSLA', '$BTC', '$ETH', '$NVDA'].map((ticker, index) => {
                      const isPositive = index % 2 === 0;
                      const change = Math.floor(Math.random() * 5) + 1;
                      return (
                        <button
                          key={ticker}
                          className="w-full flex items-center justify-between p-3 bg-[var(--panel-soft)] rounded-lg hover:bg-[var(--panel-soft)]/80 transition-colors cursor-pointer group"
                          data-ticker={ticker}
                        >
                          <span className="text-[14px] font-bold text-[var(--accent)] group-hover:text-[var(--accent)]/80">{ticker}</span>
                          <div className="flex items-center gap-3">
                            <div className="flex h-2 w-12 rounded-full bg-gray-700/50 overflow-hidden">
                              <div className={`h-full ${isPositive ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'}`} style={{width: `${60 + Math.random() * 40}%`}}></div>
                            </div>
                            <span className={`text-[13px] font-bold min-w-[40px] text-right ${isPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                              {isPositive ? '+' : '-'}{change}%
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* AI Assistant */}
                <Card className="bg-[var(--panel)] border-gray-700/30 shadow-[var(--shadow)]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-[18px] text-[var(--text)] font-bold flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-400" />
                      AI Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full h-12 bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 text-purple-300 border-purple-500/30 font-semibold transition-all duration-200 hover:scale-[1.02]"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Summarize last 50 messages
                    </Button>
                    <Button
                      className="w-full h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 text-blue-300 border-blue-500/30 font-semibold transition-all duration-200 hover:scale-[1.02]"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Show sentiment shift (2h)
                    </Button>
                  </CardContent>
                </Card>

              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Mobile Rooms Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="absolute left-0 top-0 h-full w-80 bg-[#0F1421] transform transition-transform duration-300" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-700/30 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#E7ECF4]">Chat Rooms</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#8EA0B6] hover:text-[#E7ECF4]"
                >
                  ×
                </Button>
              </div>

              <div className="relative p-4">
                <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8EA0B6]" />
                <Input
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#141A2B] border-gray-600/30 text-[#E7ECF4] placeholder:text-[#8EA0B6] focus:border-[#7FD1FF]/50"
                />
              </div>

              <ScrollArea className="h-[500px] p-2">
                {Object.entries(roomsByCategory).map(([category, rooms]) => (
                  <div key={category} className="mb-4">
                    <button
                      onClick={() => setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }))}
                      className="flex items-center gap-2 w-full p-2 text-sm font-medium text-[#8EA0B6] hover:text-[#E7ECF4] transition-colors"
                    >
                      {expandedCategories[category] ?
                        <ChevronDown className="h-3 w-3" /> :
                        <ChevronRight className="h-3 w-3" />
                      }
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>

                    {expandedCategories[category] && (
                      <div className="space-y-1 ml-2">
                        {rooms.map((room) => (
                          <div
                            key={room.id}
                            onClick={() => {
                              setSelectedRoom(room);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-[#141A2B]/70 group ${
                              selectedRoom.id === room.id ? 'bg-[#141A2B] shadow-lg' : ''
                            }`}
                            data-room={room.id}
                          >
                            <div className="text-lg">{room.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm truncate text-[#E7ECF4]">{room.name}</span>
                                {room.isPinned && <Pin className="h-3 w-3 text-orange-400" />}
                                {room.isVip && <Shield className="h-3 w-3 text-purple-400" />}
                              </div>
                              <div className="text-xs text-[#8EA0B6]">{room.onlineCount} online</div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {room.unreadCount > 0 && (
                                <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
                                  {room.unreadCount}
                                </Badge>
                              )}
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Thread Drawer */}
        {isThreadOpen && selectedMessage && (
          <div className="absolute inset-y-0 right-0 w-1/3 bg-[#0F1421] border-l border-gray-700/30 z-50 transform transition-transform duration-300">
            <div className="p-4 border-b border-gray-700/30 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#E7ECF4]">Thread</h3>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setIsThreadOpen(false)}
                className="text-[#8EA0B6] hover:text-[#E7ECF4]"
              >
                ×
              </Button>
            </div>
            
            <ScrollArea className="h-[600px] p-4">
              {/* Parent Message */}
              <div className="bg-[#10162A] rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedMessage.user.avatar} />
                    <AvatarFallback>{selectedMessage.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-[#E7ECF4]">{selectedMessage.user.name}</span>
                      <span className="text-xs text-[#8EA0B6]">{selectedMessage.timestamp}</span>
                    </div>
                    <p className="text-sm text-[#E7ECF4]">{selectedMessage.content}</p>
                  </div>
                </div>
              </div>
              
              {/* Replies */}
              <div className="space-y-3">
                {mockReplies.map((reply) => (
                  <div key={reply.id} className="bg-[#141A2B] rounded-lg p-3 ml-6">
                    <div className="flex items-start gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={reply.user.avatar} />
                        <AvatarFallback>{reply.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-xs text-[#E7ECF4]">{reply.user.name}</span>
                          <span className="text-xs text-[#8EA0B6]">{reply.timestamp}</span>
                        </div>
                        <p className="text-xs text-[#E7ECF4]">{reply.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </>
  );
};

export default LiveChatRooms;
