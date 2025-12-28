import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, MoreHorizontal } from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import { UsernameLink } from "./UsernameLink";
import { MentionText } from "./MentionText";
import { ProfileHoverCard } from "./ProfileHoverCard";
import { useProfileNavigation } from "./ProfileNavigationProvider";

interface ChatMessageProps {
  id: string;
  userId: string;
  username: string;
  displayName?: string;
  avatar?: string;
  content: string;
  timestamp: string;
  verified?: boolean;
  premium?: boolean;
  credibilityScore?: number;
  needsReview?: boolean;
  communityFavorite?: boolean;
  likes?: number;
  replies?: number;
  isLiked?: boolean;
  userRole?: "admin" | "moderator" | "premium" | "verified" | "user";
  showHoverCard?: boolean;
  compact?: boolean;
  onLike?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  id,
  userId,
  username,
  displayName,
  avatar,
  content,
  timestamp,
  verified = false,
  premium = false,
  credibilityScore,
  needsReview = false,
  communityFavorite = false,
  likes = 0,
  replies = 0,
  isLiked = false,
  userRole = "user",
  showHoverCard = true,
  compact = false,
  onLike,
  onReply,
}) => {
  const {
    navigateToProfile,
    navigateToTicker,
    navigateToHashtag,
    handleFollow,
    handleUnfollow,
  } = useProfileNavigation();

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return { color: "bg-red-100 text-red-700 dark:bg-red-900/20", label: "Admin", icon: "👑" };
      case "moderator":
        return { color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20", label: "Mod", icon: "🛡️" };
      case "premium":
        return { color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20", label: "Pro", icon: "💎" };
      case "verified":
        return { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20", label: "Verified", icon: "✅" };
      default:
        return null;
    }
  };

  const roleBadge = getRoleBadge(userRole);

  const messageElement = (
    <div className={`flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-lg ${compact ? 'p-2' : ''}`}>
      <UserAvatar
        userId={userId}
        username={username}
        avatar={avatar}
        size={compact ? "sm" : "md"}
        verified={verified}
        premium={premium}
        credibilityScore={credibilityScore}
        showBadges={!compact}
        onUserClick={navigateToProfile}
      />

      <div className="flex-1 min-w-0 space-y-1">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <UsernameLink
            userId={userId}
            username={username}
            displayName={displayName}
            avatar={avatar}
            verified={verified}
            premium={premium}
            credibilityScore={credibilityScore}
            showHandle={false}
            showBadges={true}
            showHover={false} // We'll use ProfileHoverCard instead
            size={compact ? "xs" : "sm"}
            onUserClick={navigateToProfile}
          />

          {roleBadge && (
            <Badge className={`text-xs px-2 py-0.5 ${roleBadge.color}`}>
              {roleBadge.icon} {roleBadge.label}
            </Badge>
          )}

          {needsReview && (
            <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 text-xs">
              ⚠️ Needs Review
            </Badge>
          )}

          {communityFavorite && (
            <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900/20 text-xs">
              ⭐ Community Favorite
            </Badge>
          )}

          <span className="text-xs text-muted-foreground ml-auto">
            {timestamp}
          </span>
        </div>

        {/* Content */}
        <div className={`text-sm leading-relaxed ${compact ? 'text-xs' : ''}`}>
          <MentionText
            text={content}
            onUserClick={navigateToProfile}
            onTickerClick={navigateToTicker}
            onHashtagClick={navigateToHashtag}
          />
        </div>

        {/* Actions */}
        {!compact && (likes > 0 || replies > 0 || onLike || onReply) && (
          <div className="flex items-center gap-4 pt-1">
            {onLike && (
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 px-2 text-xs ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                onClick={() => onLike(id)}
              >
                <Heart className={`h-3 w-3 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                {likes > 0 && likes}
              </Button>
            )}

            {onReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-muted-foreground"
                onClick={() => onReply(id)}
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                {replies > 0 && replies}
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // Wrap with hover card if enabled
  if (showHoverCard) {
    return (
      <ProfileHoverCard
        userId={userId}
        username={username}
        displayName={displayName}
        avatar={avatar}
        verified={verified}
        premium={premium}
        credibilityScore={credibilityScore}
        followerCount={Math.floor(Math.random() * 10000) + 100} // Mock data
        accuracy={credibilityScore}
        joinDate={new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)}
        onUserClick={navigateToProfile}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
      >
        <div className="group">
          {messageElement}
        </div>
      </ProfileHoverCard>
    );
  }

  return <div className="group">{messageElement}</div>;
};

export default ChatMessage;
