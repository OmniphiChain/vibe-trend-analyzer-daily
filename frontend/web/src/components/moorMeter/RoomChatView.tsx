import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  MessageSquare,
  Send,
  TrendingUp,
  TrendingDown,
  Minus,
  Smile,
  Star,
  Users,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Share,
  Flag,
  Crown,
  Shield,
  Target,
  ThumbsUp,
  Brain,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface Room {
  id: string;
  name: string;
  type: "private";
  tickers: string[];
  memberCount: number;
  description?: string;
}

interface Message {
  id: string;
  content: string;
  sentiment: "bullish" | "bearish" | "neutral";
  timestamp: Date;
  user: {
    username: string;
    avatar: string;
    role: "admin" | "member" | "premium" | "verified";
  };
  reactions: Record<string, number>;
  replies: Message[];
  isTradeIdea?: boolean;
  tradeData?: {
    ticker: string;
    action: "buy" | "sell";
    entryPrice: number;
    targetPrice?: number;
    stopLoss?: number;
  };
}

interface RoomChatViewProps {
  room: Room;
  onBackToRooms: () => void;
}

const EMOJI_LIST = [
  "😀",
  "😂",
  "😍",
  "🤔",
  "😎",
  "🚀",
  "📈",
  "📉",
  "💎",
  "🐻",
  "🐂",
  "🔥",
  "💯",
  "👍",
  "👎",
];

export const RoomChatView: React.FC<RoomChatViewProps> = ({
  room,
  onBackToRooms,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sentiment, setSentiment] = useState<"bullish" | "bearish" | "neutral">(
    "neutral",
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(
    new Set(),
  );
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Mock messages data
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: "msg-1",
        content: `Just added more $${room.tickers[0]} to my position. The fundamentals are solid and I see strong upside potential.`,
        sentiment: "bullish",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        user: {
          username: "TechBull2024",
          avatar: "/api/placeholder/32/32",
          role: "premium",
        },
        reactions: { like: 12, smart: 5, risky: 1 },
        replies: [
          {
            id: "reply-1",
            content: "Agree! What's your price target?",
            sentiment: "neutral",
            timestamp: new Date(Date.now() - 3 * 60 * 1000),
            user: {
              username: "ValueHunter",
              avatar: "/api/placeholder/32/32",
              role: "verified",
            },
            reactions: { like: 3 },
            replies: [],
          },
        ],
        isTradeIdea: false,
        tradeData: undefined,
      },
      {
        id: "msg-2",
        content: `Market volatility is creating some interesting opportunities. What do you all think about ${room.tickers[1] || room.tickers[0]}?`,
        sentiment: "bearish",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        user: {
          username: "BearMarket",
          avatar: "/api/placeholder/32/32",
          role: "verified",
        },
        reactions: { risky: 8, smart: 2 },
        replies: [],
        isTradeIdea: false,
        tradeData: undefined,
      },
    ];

    setMessages(mockMessages);
  }, [room]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const isTradeIdea = false;

    let tradeData;
    if (isTradeIdea) {
      const buyMatch = newMessage.match(/buy\s+\$(\w+)\s+at\s+\$?(\d+\.?\d*)/i);
      const sellMatch = newMessage.match(
        /sell\s+\$(\w+)\s+at\s+\$?(\d+\.?\d*)/i,
      );
      const targetMatch = newMessage.match(/target\s+\$?(\d+\.?\d*)/i);
      const slMatch = newMessage.match(/sl\s+\$?(\d+\.?\d*)/i);

      if (buyMatch || sellMatch) {
        const match = buyMatch || sellMatch;
        tradeData = {
          ticker: match![1].toUpperCase(),
          action: (buyMatch ? "buy" : "sell") as "buy" | "sell",
          entryPrice: parseFloat(match![2]),
          targetPrice: targetMatch ? parseFloat(targetMatch[1]) : undefined,
          stopLoss: slMatch ? parseFloat(slMatch[1]) : undefined,
        };
      }
    }

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sentiment,
      timestamp: new Date(),
      user: {
        username: "You",
        avatar: "/api/placeholder/32/32",
        role: "member",
      },
      reactions: {},
      replies: [],
      isTradeIdea,
      tradeData,
    };

    if (replyingTo) {
      // Add as reply
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === replyingTo.id
            ? { ...msg, replies: [...msg.replies, message] }
            : msg,
        ),
      );
      setReplyingTo(null);
    } else {
      // Add as new message
      setMessages((prev) => [message, ...prev]);
    }

    setNewMessage("");
    setSentiment("neutral");
  };

  const handleReaction = (messageId: string, reaction: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const currentCount = msg.reactions[reaction] || 0;
          return {
            ...msg,
            reactions: { ...msg.reactions, [reaction]: currentCount + 1 },
          };
        }
        return msg;
      }),
    );
  };

  const toggleThread = (messageId: string) => {
    setExpandedThreads((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "border-l-green-500 bg-gradient-to-r from-green-50 to-transparent dark:from-green-900/20";
      case "bearish":
        return "border-l-red-500 bg-gradient-to-r from-red-50 to-transparent dark:from-red-900/20";
      default:
        return "border-l-gray-300 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-800/20";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case "bearish":
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <Minus className="w-3 h-3 text-gray-500" />;
    }
  };

  const getUserRoleIcon = (role: string) => {
    switch (role) {
      case "premium":
        return <Crown className="w-3 h-3 text-purple-500" />;
      case "verified":
        return <Shield className="w-3 h-3 text-blue-500" />;
      case "admin":
        return <Star className="w-3 h-3 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getReactionIcon = (reaction: string) => {
    switch (reaction) {
      case "like":
        return <ThumbsUp className="w-3 h-3" />;
      case "smart":
        return <Brain className="w-3 h-3" />;
      case "risky":
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <CheckCircle className="w-3 h-3" />;
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const insertEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const MessageCard = ({
    message,
    isReply = false,
  }: {
    message: Message;
    isReply?: boolean;
  }) => (
    <Card
      className={`${getSentimentColor(message.sentiment)} border-l-4 ${isReply ? "ml-6 mt-2" : ""} shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={message.user.avatar} />
              <AvatarFallback>{message.user.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-sm">
                  {message.user.username}
                </span>
                {getUserRoleIcon(message.user.role)}
                <Badge
                  className={`text-xs ${
                    message.sentiment === "bullish"
                      ? "bg-green-100 text-green-800"
                      : message.sentiment === "bearish"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {getSentimentIcon(message.sentiment)}
                  <span className="ml-1 capitalize">{message.sentiment}</span>
                </Badge>
              </div>
              <span className="text-xs text-gray-500">
                {getTimeAgo(message.timestamp)}
              </span>
            </div>
          </div>

          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </div>

        {/* Content */}
        <div className="mb-3">
          <p className="text-sm leading-relaxed">{message.content}</p>

          {/* Trade Idea Card */}
          {message.isTradeIdea && message.tradeData && (
            <Card className="mt-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[#E3F2FD] text-[#0D47A1] border-[#0D47A1]/20 font-semibold">
                    <Target className="w-3 h-3 mr-1" />
                    Trade Signal
                  </Badge>
                  <Badge
                    className={
                      message.tradeData.action === "buy"
                        ? "bg-[#E0F2F1] text-[#004D40] border-[#004D40]/20 font-semibold"
                        : "bg-[#FFEBEE] text-[#C62828] border-[#C62828]/20 font-semibold"
                    }
                  >
                    {message.tradeData.action.toUpperCase()} $
                    {message.tradeData.ticker}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">Entry:</span>
                    <div className="font-semibold">
                      ${message.tradeData.entryPrice}
                    </div>
                  </div>
                  {message.tradeData.targetPrice && (
                    <div>
                      <span className="text-gray-600">Target:</span>
                      <div className="font-semibold text-green-600">
                        ${message.tradeData.targetPrice}
                      </div>
                    </div>
                  )}
                  {message.tradeData.stopLoss && (
                    <div>
                      <span className="text-gray-600">Stop:</span>
                      <div className="font-semibold text-red-600">
                        ${message.tradeData.stopLoss}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Reactions */}
            {Object.entries(message.reactions).map(([reaction, count]) => (
              <Button
                key={reaction}
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => handleReaction(message.id, reaction)}
              >
                {getReactionIcon(reaction)}
                <span className="ml-1">{count}</span>
              </Button>
            ))}

            {/* Add Reaction */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  <Smile className="w-3 h-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <div className="grid grid-cols-3 gap-1">
                  {["like", "smart", "risky"].map((reaction) => (
                    <Button
                      key={reaction}
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs flex-col"
                      onClick={() => handleReaction(message.id, reaction)}
                    >
                      {getReactionIcon(reaction)}
                      <span className="text-xs capitalize">{reaction}</span>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Reply Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setReplyingTo(message)}
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              Reply
            </Button>

            {/* Thread Toggle */}
            {message.replies.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-blue-600"
                onClick={() => toggleThread(message.id)}
              >
                {expandedThreads.has(message.id) ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
                <span className="ml-1">{message.replies.length} replies</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <Share className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <Flag className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Expanded Replies */}
        {expandedThreads.has(message.id) &&
          message.replies.map((reply) => (
            <MessageCard key={reply.id} message={reply} isReply />
          ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Room Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToRooms}
                className="text-white hover:bg-white/20"
              >
                ← Back
              </Button>
              <div>
                <h2 className="text-lg font-semibold">{room.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  {room.tickers.map((ticker) => (
                    <Badge
                      key={ticker}
                      className="bg-white/20 text-white text-xs"
                    >
                      ${ticker}
                    </Badge>
                  ))}
                  <div className="flex items-center gap-1 text-sm opacity-80">
                    <Users className="w-3 h-3" />
                    {room.memberCount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>

      {/* Reply Context */}
      {replyingTo && (
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 mx-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Replying to {replyingTo.user.username}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(null)}
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/50">
        <div className="flex gap-2 mb-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/api/placeholder/32/32" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share your thoughts..."
              className="min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Select
                  value={sentiment}
                  onValueChange={(value: any) => setSentiment(value)}
                >
                  <SelectTrigger className="w-32 h-7 text-xs">
                    <div className="flex items-center gap-1">
                      {getSentimentIcon(sentiment)}
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bullish">📈 Bullish</SelectItem>
                    <SelectItem value="neutral">😐 Neutral</SelectItem>
                    <SelectItem value="bearish">📉 Bearish</SelectItem>
                  </SelectContent>
                </Select>

                <Popover
                  open={showEmojiPicker}
                  onOpenChange={setShowEmojiPicker}
                >
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7">
                      <Smile className="w-3 h-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2">
                    <div className="grid grid-cols-8 gap-1">
                      {EMOJI_LIST.map((emoji) => (
                        <Button
                          key={emoji}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => insertEmoji(emoji)}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Send className="w-3 h-3 mr-1" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
