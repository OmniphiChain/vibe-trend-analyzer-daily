import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, Crown, Shield, Users, Target, Calendar } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ProfileHoverCardProps {
  userId: string;
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  verified?: boolean;
  premium?: boolean;
  credibilityScore?: number;
  followerCount?: number;
  accuracy?: number;
  joinDate?: Date;
  isFollowing?: boolean;
  children: React.ReactNode;
  onUserClick?: (userId: string) => void;
  onFollow?: (userId: string) => void;
  onUnfollow?: (userId: string) => void;
}

export const ProfileHoverCard: React.FC<ProfileHoverCardProps> = ({
  userId,
  username,
  displayName,
  avatar,
  bio,
  verified = false,
  premium = false,
  credibilityScore,
  followerCount,
  accuracy,
  joinDate,
  isFollowing = false,
  children,
  onUserClick,
  onFollow,
  onUnfollow,
}) => {
  const getCredibilityBadge = (score: number) => {
    if (score >= 90) return { color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20", label: "Top 1%", icon: "🔥" };
    if (score >= 80) return { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20", label: "Top 5%", icon: "⭐" };
    if (score >= 70) return { color: "bg-green-100 text-green-700 dark:bg-green-900/20", label: "Trusted", icon: "✅" };
    return { color: "bg-gray-100 text-gray-700 dark:bg-gray-900/20", label: `${score}%`, icon: "📊" };
  };

  const credibilityBadge = credibilityScore ? getCredibilityBadge(credibilityScore) : null;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0" side="top">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start gap-3">
                <Avatar className="w-16 h-16 ring-2 ring-purple-500/30">
                  <AvatarImage src={avatar} alt={username} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold">
                    {username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-wrap">
                    <h4 className="font-bold text-lg truncate">
                      {displayName || username}
                    </h4>
                    {verified && <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                    {premium && <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground">@{username}</p>
                  
                  {bio && (
                    <p className="text-sm mt-2 line-clamp-2">{bio}</p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                {followerCount !== undefined && (
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{followerCount.toLocaleString()}</span>
                    <span className="text-muted-foreground">followers</span>
                  </div>
                )}
                
                {accuracy !== undefined && (
                  <div className="flex items-center gap-1 text-sm">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{accuracy}%</span>
                    <span className="text-muted-foreground">accuracy</span>
                  </div>
                )}
              </div>

              {/* Credibility Badge */}
              {credibilityBadge && (
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <Badge className={`text-xs ${credibilityBadge.color}`}>
                    {credibilityBadge.icon} {credibilityBadge.label} Credibility
                  </Badge>
                </div>
              )}

              {/* Join Date */}
              {joinDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>Joined {joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onUserClick?.(userId)}
                >
                  View Profile
                </Button>
                
                {onFollow && onUnfollow && (
                  <Button
                    variant={isFollowing ? "secondary" : "default"}
                    size="sm"
                    className="flex-1"
                    onClick={() => isFollowing ? onUnfollow(userId) : onFollow(userId)}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ProfileHoverCard;
