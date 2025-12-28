import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  Pin,
  Flag,
  Star,
  CheckCircle,
  AlertTriangle,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  MoreHorizontal,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserAvatar } from "./UserAvatar";
import { UsernameLink } from "./UsernameLink";
import { MentionText } from "./MentionText";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { formatDistanceToNow } from "date-fns";
import { PostInteractionBar } from "./PostInteractionBar";
import type { ChatMessage } from "@/types/social";
import { cn } from "@/lib/utils";

interface EnhancedCommunityMessageProps {
  message: ChatMessage;
  showAvatar?: boolean;
  onReaction?: (messageId: string, emoji: string) => void;
  onFlag?: (message: ChatMessage) => void;
  onFollow?: (userId: string) => void;
  onUnfollow?: (userId: string) => void;
  onToggleAlerts?: (userId: string, enabled: boolean) => void;
  onNavigateToProfile?: (userId: string) => void;
  compact?: boolean;
}

interface MessageMetrics {
  credibilityScore: number;
  needsReview: boolean;
  communityFavorite: boolean;
  verificationLevel: "verified" | "trusted" | "new" | "flagged";
}

export const EnhancedCommunityMessage = ({
  message,
  showAvatar = true,
  onReaction,
  onFlag,
  onFollow,
  onUnfollow,
  onToggleAlerts,
  onNavigateToProfile,
  compact = false,
}: EnhancedCommunityMessageProps) => {
  // Mock metrics - in real app, fetch from API based on userId
  const [metrics] = useState<MessageMetrics>({
    credibilityScore: Math.floor(Math.random() * 40 + 60) / 10, // 6.0 - 10.0
    needsReview: Math.random() > 0.8, // 20% chance
    communityFavorite: Math.random() > 0.9, // 10% chance
    verificationLevel: ["verified", "trusted", "new"][Math.floor(Math.random() * 3)] as any,
  });

  const getUserRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <CheckCircle className="h-4 w-4 text-red-500" />;
      case "moderator":
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      case "verified":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "premium":
        return <Star className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "bearish":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return <TrendingUp className="h-3 w-3" />;
      case "bearish":
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 9.0) return "text-purple-600 bg-purple-100 dark:bg-purple-900/20";
    if (score >= 8.0) return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
    if (score >= 7.0) return "text-green-600 bg-green-100 dark:bg-green-900/20";
    if (score >= 6.0) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
    return "text-red-600 bg-red-100 dark:bg-red-900/20";
  };

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

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

  return (
    <div className={cn("flex gap-3", compact ? "py-1" : "py-2")}>
      {/* Avatar Section */}
      <div className="w-10 flex-shrink-0">
        {showAvatar && (
          <UserAvatar
            userId={message.userId}
            username={message.username}
            avatar={message.userAvatar}
            size="md"
            verified={message.userRole === "verified" || message.userRole === "admin" || message.userRole === "moderator"}
            premium={message.userRole === "premium"}
            credibilityScore={metrics.credibilityScore}
            showBadges={true}
            onUserClick={onNavigateToProfile}
          />
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {showAvatar && (
          <div className="flex items-start justify-between mb-2">
            {/* User Info and Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <UsernameLink
                userId={message.userId}
                username={message.username}
                verified={message.userRole === "verified" || message.userRole === "admin" || message.userRole === "moderator"}
                premium={message.userRole === "premium"}
                credibilityScore={metrics.credibilityScore}
                showBadges={true}
                onUserClick={onNavigateToProfile}
              />
              
              {/* User Role Icon */}
              {getUserRoleIcon(message.userRole)}
              
              {/* Credibility Score */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      className={cn(
                        "text-xs px-2 py-0.5 font-semibold",
                        getCredibilityColor(metrics.credibilityScore)
                      )}
                    >
                      {metrics.credibilityScore.toFixed(1)}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Credibility Score: {metrics.credibilityScore.toFixed(1)}/10.0</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Needs Review Badge */}
              {metrics.needsReview && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 text-xs px-2 py-0.5">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Needs Review
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This post requires community review</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* Community Favorite Badge */}
              {metrics.communityFavorite && (
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

              {/* Sentiment Badge */}
              <Badge
                className={cn(
                  "text-xs px-2 py-0.5",
                  getSentimentColor(message.sentiment)
                )}
              >
                {getSentimentIcon(message.sentiment)}
                <span className="ml-1 capitalize">{message.sentiment}</span>
              </Badge>

              {/* Timestamp */}
              <span className="text-xs text-muted-foreground">
                {formatMessageTime(message.createdAt)}
              </span>
            </div>

            {/* Post Interaction Bar */}
            <PostInteractionBar
              userId={message.userId}
              username={message.username}
              compact={true}
              onFollow={onFollow}
              onUnfollow={onUnfollow}
              onToggleAlerts={onToggleAlerts}
              className="opacity-60 hover:opacity-100 transition-opacity"
            />
          </div>
        )}

        {/* Message Content */}
        <div className="group relative">
          <div className="text-sm leading-relaxed break-words mb-2">
            <MentionText
              text={message.content}
              onUserClick={onNavigateToProfile}
              enableMentions={true}
            />
          </div>

          {/* Message Actions (on hover) */}
          <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-1 bg-background border rounded-lg p-1 shadow-sm">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => onReaction?.(message.id, "👍")}
              >
                👍
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => onReaction?.(message.id, "📈")}
              >
                📈
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => onReaction?.(message.id, "📉")}
              >
                📉
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => onFlag?.(message)}
                title="Report message"
              >
                <Flag className="h-3 w-3" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Pin className="h-4 w-4 mr-2" />
                    Pin Message
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.reactions.map((reaction, idx) => (
                <button
                  key={idx}
                  onClick={() => onReaction?.(message.id, reaction.emoji)}
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
                    reaction.userReacted
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  <span>{reaction.emoji}</span>
                  <span>{reaction.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Engagement Stats (for important messages) */}
        {(message.likes > 5 || message.comments > 2) && (
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <span>{message.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              <span>{message.comments}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share className="h-3 w-3" />
              <span>{message.shares}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
