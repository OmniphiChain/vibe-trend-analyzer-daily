import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  MessageSquare,
  Share,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Shield,
  Star,
  Flame,
  ChevronDown,
  ChevronUp,
  Reply,
  Send,
} from "lucide-react";

interface MessageCardProps {
  message: any;
  onReply: (message: any) => void;
  onReaction: (messageId: string, reaction: string) => void;
  onShare?: (message: any) => void;
  depth?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: (messageId: string) => void;
  onThreadToggle?: (messageId: string) => void;
  onReplyToggle?: (messageId: string) => void;
  isThreadExpanded?: boolean;
  showReplyInput?: boolean;
  onReplySubmit?: (content: string, parentId: string) => void;
}

const REACTIONS = [
  { emoji: "👍", name: "like", label: "Like" },
  { emoji: "🧠", name: "smart", label: "Smart" },
  { emoji: "🚀", name: "yolo", label: "YOLO" },
  { emoji: "📉", name: "bad", label: "Bad Call" },
  { emoji: "🐻", name: "bearish", label: "Bearish" },
  { emoji: "🔥", name: "fire", label: "Fire" },
];

export const MessageCard: React.FC<MessageCardProps> = ({
  message,
  onReply,
  onReaction,
  onShare,
  depth = 0,
  isCollapsed = false,
  onToggleCollapse,
  onThreadToggle,
  onReplyToggle,
  isThreadExpanded = false,
  showReplyInput = false,
  onReplySubmit,
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const formatContent = (content: string) => {
    // Convert markdown and cashtags to JSX
    let formatted = content
      // Bold
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Cashtags
      .replace(
        /(\$[A-Z]{1,5})/g,
        '<span style="color: #2563eb; font-weight: 600; background: #dbeafe; padding: 2px 4px; border-radius: 4px; cursor: pointer;">$1</span>',
      );

    return { __html: formatted };
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "border-l-green-500 bg-green-50/50 dark:bg-green-900/10";
      case "bearish":
        return "border-l-red-500 bg-red-50/50 dark:bg-red-900/10";
      default:
        return "border-l-gray-300 bg-gray-50/50 dark:bg-gray-800/50";
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
      case "pro":
        return <Star className="w-3 h-3 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getUserBadges = (message: any) => {
    const badges = [];

    if (message.isTopPost)
      badges.push({
        text: "🔥 Trending",
        class: "bg-orange-100 text-orange-800",
      });
    if (message.isTopToday)
      badges.push({
        text: "Top Post Today",
        class: "bg-yellow-100 text-yellow-800",
      });
    if (message.streak && message.streak >= 3)
      badges.push({
        text: `${message.streak} Day Streak`,
        class: "bg-purple-100 text-purple-800",
      });

    return badges;
  };

  const getTotalReactions = () => {
    return Object.values(message.reactions || {}).reduce(
      (sum: number, count: number) => sum + count,
      0,
    );
  };

  const marginLeft = depth * 24;

  if (isCollapsed) {
    return (
      <div
        className="flex items-center gap-2 py-2 px-3 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
        style={{ marginLeft }}
        onClick={() => onToggleCollapse && onToggleCollapse(message.id)}
      >
        <ChevronDown className="w-4 h-4" />
        <Avatar className="w-4 h-4">
          <AvatarImage src={message.user.avatar} />
          <AvatarFallback className="text-xs">
            {message.user.username[0]}
          </AvatarFallback>
        </Avatar>
        <span>{message.user.username}</span>
        <span>+{message.replies?.length || 0} replies</span>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div
        className={`border-l-4 transition-all duration-200 hover:shadow-md ${getSentimentColor(message.sentiment)}`}
        style={{ marginLeft }}
      >
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-1">
              <Tooltip>
                <TooltipTrigger>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.user.avatar} />
                    <AvatarFallback className="text-xs">
                      {message.user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="p-2 text-sm">
                    <div className="font-medium">{message.user.username}</div>
                    <div className="text-gray-500">
                      5.2K followers • Rank #234
                    </div>
                    <div className="text-gray-500">Trading accuracy: 78%</div>
                  </div>
                </TooltipContent>
              </Tooltip>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">
                    {message.user.username}
                  </span>
                  {getUserRoleIcon(message.user.role)}

                  {/* Badges */}
                  {getUserBadges(message).map((badge, i) => (
                    <Badge key={i} className={`text-xs ${badge.class}`}>
                      {badge.text}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{getTimeAgo(message.timestamp)}</span>
                  {getSentimentIcon(message.sentiment)}
                  <span className="capitalize">{message.sentiment}</span>
                  <span>•</span>
                  <span className="capitalize">{message.timeframe}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {message.replies &&
                message.replies.length > 0 &&
                onToggleCollapse && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleCollapse(message.id)}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </Button>
                )}

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-32 p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                  >
                    Report
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                  >
                    Block User
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div
              className="text-sm leading-relaxed"
              dangerouslySetInnerHTML={formatContent(message.content)}
            />

            {/* Tags */}
            {((message.cashtags && message.cashtags.length > 0) ||
              (message.hashtags && message.hashtags.length > 0)) && (
              <div className="flex gap-1 flex-wrap">
                {message.cashtags?.map((tag: string, i: number) => (
                  <Badge
                    key={`cash-${i}`}
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300"
                  >
                    {tag}
                  </Badge>
                ))}
                {message.hashtags?.map((tag: string, i: number) => (
                  <Badge
                    key={`hash-${i}`}
                    variant="outline"
                    className="text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* Reactions */}
              <Popover open={showReactions} onOpenChange={setShowReactions}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span className="mr-1">👍</span>
                    {getTotalReactions() > 0 && (
                      <span>{getTotalReactions()}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2">
                  <div className="grid grid-cols-3 gap-1">
                    {REACTIONS.map((reaction) => (
                      <Button
                        key={reaction.name}
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs flex-col"
                        onClick={() => {
                          onReaction(message.id, reaction.name);
                          setShowReactions(false);
                        }}
                      >
                        <span className="text-base">{reaction.emoji}</span>
                        <span className="text-xs">{reaction.label}</span>
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReplyToggle && onReplyToggle(message.id)}
                className="h-7 px-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </Button>

              {/* Thread toggle button for messages with replies */}
              {message.replies?.length > 0 && onThreadToggle && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onThreadToggle(message.id)}
                  className="h-7 px-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400"
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  🔗 {message.replies.length}{" "}
                  {message.replies.length === 1 ? "reply" : "replies"}
                  {message.replies.some(
                    (reply) =>
                      reply.timestamp > new Date(Date.now() - 5 * 60 * 1000),
                  ) && (
                    <span className="ml-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs px-1 rounded">
                      New
                    </span>
                  )}
                </Button>
              )}

              {onShare && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onShare(message)}
                  className="h-7 px-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Share className="w-3 h-3 mr-1" />
                  Share
                </Button>
              )}
            </div>

            {/* Performance Badge */}
            {message.performance && (
              <Badge
                className={`text-xs ${
                  message.performance > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message.performance > 0 ? "+" : ""}
                {message.performance}%
              </Badge>
            )}
          </div>

          {/* Reaction Summary */}
          {getTotalReactions() > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="flex gap-1">
                {Object.entries(message.reactions || {}).map(
                  ([reactionName, count]) => {
                    const reaction = REACTIONS.find(
                      (r) => r.name === reactionName,
                    );
                    if (!reaction || count === 0) return null;
                    return (
                      <span
                        key={reactionName}
                        className="flex items-center gap-1"
                      >
                        <span>{reaction.emoji}</span>
                        <span>{count}</span>
                      </span>
                    );
                  },
                )}
              </div>
            </div>
          )}

          {/* Inline Reply Input */}
          {showReplyInput && onReplySubmit && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback className="text-xs">You</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Input
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`Reply to ${message.user.username}...`}
                    className="text-sm"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (replyContent.trim()) {
                          onReplySubmit(replyContent, message.id);
                          setReplyContent("");
                        }
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      if (replyContent.trim()) {
                        onReplySubmit(replyContent, message.id);
                        setReplyContent("");
                      }
                    }}
                    disabled={!replyContent.trim()}
                    className="h-8 px-3"
                  >
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1 ml-8">
                💡 Use $TICKER to tag stocks • Enter to send • Shift+Enter for
                new line
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
