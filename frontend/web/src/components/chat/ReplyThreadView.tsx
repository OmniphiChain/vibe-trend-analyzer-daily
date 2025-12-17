import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  X,
  Heart,
  TrendingUp,
  Eye,
  Flame,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Reply {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: Date;
  sentiment: "bullish" | "bearish" | "neutral";
  reactions: { emoji: string; count: number; userReacted: boolean }[];
  badges: string[];
}

interface ReplyThreadViewProps {
  messageId: string;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProfile?: (userId: string) => void;
}

export const ReplyThreadView = ({
  messageId,
  isOpen,
  onClose,
  onNavigateToProfile,
}: ReplyThreadViewProps) => {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock replies data
  const mockReplies: Reply[] = [
    {
      id: "reply1",
      userId: "user2",
      username: "TechnicalTrader",
      avatar: "/api/placeholder/32/32",
      content: "Agree! The volume breakout confirms this move. Looking at $200 next.",
      timestamp: new Date(Date.now() - 120000),
      sentiment: "bullish",
      reactions: [
        { emoji: "🔥", count: 3, userReacted: true },
        { emoji: "👀", count: 2, userReacted: false },
      ],
      badges: ["TA Expert"],
    },
    {
      id: "reply2",
      userId: "user3",
      username: "RiskManager",
      avatar: "/api/placeholder/32/32",
      content: "Watch the RSI divergence though. Could see a pullback before the next leg up.",
      timestamp: new Date(Date.now() - 60000),
      sentiment: "neutral",
      reactions: [
        { emoji: "📉", count: 1, userReacted: false },
        { emoji: "👀", count: 4, userReacted: true },
      ],
      badges: ["Risk Analyst"],
    },
    {
      id: "reply3",
      userId: "user4",
      username: "OptionsWizard",
      avatar: "/api/placeholder/32/32",
      content: "Perfect setup for a gamma squeeze! The 190 calls are loaded 🚀",
      timestamp: new Date(Date.now() - 30000),
      sentiment: "bullish",
      reactions: [
        { emoji: "🚀", count: 8, userReacted: true },
        { emoji: "💎", count: 5, userReacted: false },
      ],
      badges: ["Options Expert", "Top 1%"],
    },
  ];

  useEffect(() => {
    if (isOpen) {
      setReplies(mockReplies);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

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
        return "shadow-emerald-500/20 ring-emerald-500/10";
      case "bearish":
        return "shadow-red-500/20 ring-red-500/10";
      default:
        return "shadow-gray-500/10 ring-gray-500/5";
    }
  };

  const handleSendReply = () => {
    if (!newReply.trim()) return;

    const reply: Reply = {
      id: `reply-${Date.now()}`,
      userId: "current-user",
      username: "You",
      avatar: "/api/placeholder/32/32",
      content: newReply.trim(),
      timestamp: new Date(),
      sentiment: "neutral",
      reactions: [],
      badges: ["Member"],
    };

    setReplies(prev => [...prev, reply]);
    setNewReply("");
  };

  const handleReaction = (replyId: string, emoji: string) => {
    setReplies(prev =>
      prev.map(reply => {
        if (reply.id === replyId) {
          const existingReaction = reply.reactions.find(r => r.emoji === emoji);
          if (existingReaction) {
            return {
              ...reply,
              reactions: reply.reactions.map(r =>
                r.emoji === emoji
                  ? { ...r, count: r.userReacted ? r.count - 1 : r.count + 1, userReacted: !r.userReacted }
                  : r
              ).filter(r => r.count > 0),
            };
          } else {
            return {
              ...reply,
              reactions: [...reply.reactions, { emoji, count: 1, userReacted: true }],
            };
          }
        }
        return reply;
      })
    );
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m`;
    return `${Math.floor(diffMinutes / 60)}h`;
  };

  if (!isOpen) return null;

  const visibleReplies = isExpanded ? replies : replies.slice(0, 2);
  const hasMoreReplies = replies.length > 2;

  return (
    <div className="mt-3 ml-12">
      {/* Thread Container */}
      <div className="bg-gradient-to-br from-purple-900/20 to-slate-900/40 rounded-xl border border-purple-500/20 backdrop-blur-sm overflow-hidden">
        {/* Thread Header */}
        <div className="flex items-center justify-between p-3 border-b border-purple-500/10 bg-black/20">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {hasMoreReplies && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-purple-400 hover:text-purple-300 h-6 px-2"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Collapse
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    View all {replies.length}
                  </>
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Replies List */}
        <div className="max-h-80 overflow-y-auto">
          {visibleReplies.map((reply, index) => (
            <div key={reply.id} className="p-3 border-b border-purple-500/5 hover:bg-purple-500/5 transition-colors">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className={`relative ring-1 ${getSentimentGlow(reply.sentiment)} rounded-full`}>
                  <Avatar className="h-6 w-6 cursor-pointer" onClick={() => onNavigateToProfile?.(reply.userId)}>
                    <AvatarImage src={reply.avatar} />
                    <AvatarFallback className="text-xs">{reply.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-gradient-to-r ${getSentimentColor(reply.sentiment)}`}></div>
                </div>

                {/* Reply Content */}
                <div className="flex-1 min-w-0">
                  {/* Reply Header */}
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      className="text-sm font-medium text-white hover:text-purple-300 transition-colors"
                      onClick={() => onNavigateToProfile?.(reply.userId)}
                    >
                      {reply.username}
                    </button>
                    {reply.badges.map(badge => (
                      <Badge key={badge} className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30 px-1 py-0">
                        {badge}
                      </Badge>
                    ))}
                    <span className="text-xs text-gray-400">{formatTime(reply.timestamp)}</span>
                  </div>

                  {/* Reply Text */}
                  <p className="text-sm text-gray-200 mb-2 leading-relaxed">
                    {reply.content.split(/(\$[A-Z]{1,5}|#\w+|@\w+)/).map((part, i) => {
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

                  {/* Mini Reactions */}
                  <div className="flex items-center gap-1">
                    {reply.reactions.map((reaction, i) => (
                      <button
                        key={i}
                        onClick={() => handleReaction(reply.id, reaction.emoji)}
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs transition-all hover:scale-105 ${
                          reaction.userReacted
                            ? "bg-purple-500/30 text-purple-200"
                            : "bg-black/30 text-gray-300 hover:bg-purple-500/20"
                        }`}
                      >
                        <span className="text-xs">{reaction.emoji}</span>
                        <span className="text-xs">{reaction.count}</span>
                      </button>
                    ))}
                    {/* Quick Reaction Buttons */}
                    <div className="flex items-center gap-0.5 ml-2">
                      {["🔥", "👀", "📈"].map(emoji => (
                        <TooltipProvider key={emoji}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleReaction(reply.id, emoji)}
                                className="w-5 h-5 rounded-full bg-black/40 hover:bg-purple-500/20 flex items-center justify-center text-xs opacity-60 hover:opacity-100 transition-all"
                              >
                                {emoji}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>React with {emoji}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Input */}
        <div className="p-3 bg-black/20 border-t border-purple-500/10">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback className="text-xs">U</AvatarFallback>
            </Avatar>
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                placeholder="Reply to thread..."
                className="bg-slate-800/50 border-purple-500/20 text-white placeholder-gray-400 text-sm h-8 pr-8"
              />
            </div>
            <Button
              onClick={handleSendReply}
              disabled={!newReply.trim()}
              size="sm"
              className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 h-8 w-8 p-0"
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Thread Actions */}
        <div className="px-3 py-2 bg-black/10 border-t border-purple-500/5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3 text-gray-400">
              <button className="hover:text-purple-300 transition-colors">
                📌 Pin thread
              </button>
              <button className="hover:text-purple-300 transition-colors">
                📢 Follow thread
              </button>
            </div>
            <button 
              className="text-purple-400 hover:text-purple-300 transition-colors"
              onClick={() => setIsExpanded(true)}
            >
              View in modal →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
