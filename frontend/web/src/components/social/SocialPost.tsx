import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ExternalLink,
  Flag,
  Copy,
  Users,
  Clock,
  CheckCircle,
  Crown,
  Shield,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import type { SocialPost } from "@/types/social";
import { InlinePrice } from "./RealTimePrice";
import { InlineCryptoPrice } from "../crypto/CryptoPrice";
import { InlineCredibilityDisplay } from "@/components/credibility/UserCredibilityProfile";
import { CredibilityBadge } from "@/components/credibility/CredibilityBadge";
import { PostInteractionBar } from "./PostInteractionBar";

interface SocialPostProps {
  post: SocialPost;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onUserClick?: (userId: string) => void;
  onTickerClick?: (symbol: string) => void;
  onHashtagClick?: (hashtag: string) => void;
  onFollow?: (userId: string) => void;
  onUnfollow?: (userId: string) => void;
  onToggleAlerts?: (userId: string, enabled: boolean) => void;
  compact?: boolean;
  showEngagement?: boolean;
}

export const SocialPost = ({
  post,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onUserClick,
  onTickerClick,
  onHashtagClick,
  onFollow,
  onUnfollow,
  onToggleAlerts,
  compact = false,
  showEngagement = true,
}: SocialPostProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format post content with clickable cashtags and hashtags
  const formatContent = (content: string) => {
    return content
      .split(/(\$[A-Z]{1,10}\b|#[a-zA-Z0-9_]+|@[a-zA-Z0-9_]+)/g)
      .map((part, index) => {
        if (part.startsWith("$")) {
          const symbol = part.slice(1);
          // Common crypto symbols that should use crypto API
          const cryptoSymbols = [
            "BTC",
            "ETH",
            "BNB",
            "XRP",
            "ADA",
            "SOL",
            "DOT",
            "DOGE",
            "AVAX",
            "SHIB",
            "MATIC",
            "LINK",
            "UNI",
            "LTC",
            "BCH",
            "ATOM",
            "ICP",
            "NEAR",
            "ALGO",
            "FTM",
          ];
          const isCrypto = cryptoSymbols.includes(symbol);

          return (
            <button
              key={index}
              onClick={() => onTickerClick?.(symbol)}
              className="text-blue-600 hover:text-blue-800 hover:underline inline-block"
            >
              {isCrypto ? (
                <InlineCryptoPrice symbol={symbol} className="font-semibold" />
              ) : (
                <InlinePrice symbol={symbol} className="font-semibold" />
              )}
            </button>
          );
        } else if (part.startsWith("#")) {
          const hashtag = part.slice(1);
          return (
            <button
              key={index}
              onClick={() => onHashtagClick?.(hashtag)}
              className="text-purple-600 hover:text-purple-800 hover:underline"
            >
              {part}
            </button>
          );
        } else if (part.startsWith("@")) {
          return (
            <span key={index} className="text-green-600">
              {part}
            </span>
          );
        }
        return part;
      });
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
        return <BarChart3 className="h-3 w-3" />;
    }
  };

  const getUserRoleIcon = (role: string) => {
    switch (role) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "premium":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "moderator":
        return <Shield className="h-4 w-4 text-purple-500" />;
      case "admin":
        return <Shield className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const timeAgo = formatDistanceToNow(post.createdAt, { addSuffix: true });
  const isLongContent = post.content.length > 200;
  const displayContent =
    isLongContent && !isExpanded
      ? post.content.slice(0, 200) + "..."
      : post.content;

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${compact ? "border-0 shadow-none" : ""}`}
    >
      <CardContent className={compact ? "p-3" : "p-4"}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <button onClick={() => onUserClick?.(post.userId)}>
              <Avatar className={compact ? "h-8 w-8" : "h-10 w-10"}>
                <AvatarImage src={post.userAvatar} alt={post.username} />
                <AvatarFallback>
                  {post.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={() => onUserClick?.(post.userId)}
                  className="font-semibold text-foreground hover:underline truncate"
                >
                  {post.username}
                </button>
                {getUserRoleIcon(post.userRole)}
                {post.isVerified && (
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                )}
                <InlineCredibilityDisplay
                  userId={post.userId}
                  size={compact ? "sm" : "md"}
                  maxBadges={compact ? 1 : 2}
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>@{post.username}</span>
                <span>•</span>
                <span title={post.createdAt.toLocaleString()}>{timeAgo}</span>
                {post.editedAt && (
                  <>
                    <span>•</span>
                    <span className="text-xs">edited</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Interaction Bar and Sentiment Badge */}
          <div className="flex items-center gap-2">
            {/* Post Interaction Bar */}
            <PostInteractionBar
              userId={post.userId}
              username={post.username}
              compact={compact}
              onFollow={onFollow}
              onUnfollow={onUnfollow}
              onToggleAlerts={onToggleAlerts}
              className="mr-2"
            />

            <Badge
              className={`${getSentimentColor(post.sentiment)} text-xs px-2 py-1`}
            >
              {getSentimentIcon(post.sentiment)}
              <span className="ml-1 capitalize">{post.sentiment}</span>
            </Badge>

            {/* More Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(post.content)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy text
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Copy link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Flag className="h-4 w-4 mr-2" />
                  Report post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="mb-3">
          <div
            className={`text-foreground whitespace-pre-wrap leading-relaxed ${compact ? "text-sm" : "text-base"}`}
          >
            {formatContent(displayContent)}
          </div>

          {isLongContent && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:underline text-sm mt-1"
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div
            className={`grid gap-2 mb-3 ${
              post.images.length === 1
                ? "grid-cols-1"
                : post.images.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-2"
            }`}
          >
            {post.images.slice(0, 4).map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {post.images!.length > 4 && index === 3 && (
                  <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">
                      +{post.images!.length - 4} more
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Cashtags */}
        {post.cashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.cashtags.map((tag, index) => (
              <button
                key={index}
                onClick={() => onTickerClick?.(tag)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
              >
                ${tag}
              </button>
            ))}
          </div>
        )}

        {/* Engagement Actions */}
        {showEngagement && (
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-1">
              {/* Like */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike?.(post.id)}
                className={`h-8 gap-1 ${post.isLiked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-500"}`}
              >
                <Heart
                  className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`}
                />
                <span className="text-xs">{formatNumber(post.likes)}</span>
              </Button>

              {/* Comment */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onComment?.(post.id)}
                className="h-8 gap-1 text-muted-foreground hover:text-blue-500"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{formatNumber(post.comments)}</span>
              </Button>

              {/* Share */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare?.(post.id)}
                className="h-8 gap-1 text-muted-foreground hover:text-green-500"
              >
                <Share className="h-4 w-4" />
                <span className="text-xs">{formatNumber(post.shares)}</span>
              </Button>
            </div>

            <div className="flex items-center gap-1">
              {/* Room indicator */}
              {post.roomId && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-muted-foreground"
                >
                  <Users className="h-4 w-4" />
                </Button>
              )}

              {/* Bookmark */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBookmark?.(post.id)}
                className={`h-8 ${post.isBookmarked ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"}`}
              >
                <Bookmark
                  className={`h-4 w-4 ${post.isBookmarked ? "fill-current" : ""}`}
                />
              </Button>
            </div>
          </div>
        )}

        {/* Thread indicator */}
        {post.replyToId && (
          <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            <span>Replying to a post</span>
          </div>
        )}

        {/* Pinned indicator */}
        {post.isPinned && (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              📌 Pinned
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
