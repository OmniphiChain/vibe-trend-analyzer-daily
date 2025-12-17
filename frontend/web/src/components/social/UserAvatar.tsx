import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Shield } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserAvatarProps {
  userId: string;
  username: string;
  avatar?: string;
  size?: "sm" | "md" | "lg" | "xl";
  verified?: boolean;
  premium?: boolean;
  credibilityScore?: number;
  showBadges?: boolean;
  showHover?: boolean;
  className?: string;
  onUserClick?: (userId: string) => void;
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8", 
  lg: "w-10 h-10",
  xl: "w-12 h-12"
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  userId,
  username,
  avatar,
  size = "md",
  verified = false,
  premium = false,
  credibilityScore,
  showBadges = false,
  showHover = true,
  className = "",
  onUserClick,
}) => {
  const handleClick = () => {
    onUserClick?.(userId);
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 90) return "ring-purple-500/50";
    if (score >= 80) return "ring-blue-500/50";
    if (score >= 70) return "ring-green-500/50";
    return "ring-yellow-500/50";
  };

  const avatarElement = (
    <button
      onClick={handleClick}
      className={`relative group transition-all duration-200 ${className}`}
      disabled={!onUserClick}
    >
      <Avatar 
        className={`
          ${sizeClasses[size]} 
          ring-2 ring-gray-200 dark:ring-gray-700 
          hover:ring-purple-500/30 transition-all cursor-pointer
          ${credibilityScore && credibilityScore >= 80 ? getCredibilityColor(credibilityScore) : ""}
          group-hover:scale-105
        `}
      >
        <AvatarImage src={avatar} alt={username} />
        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
          {username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Status Indicators */}
      {showBadges && (
        <div className="absolute -top-1 -right-1 flex flex-col gap-1">
          {verified && (
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          )}
          {premium && (
            <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
              <Crown className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      )}

      {/* Hover Ring Animation */}
      <div className="absolute inset-0 rounded-full border-2 border-purple-500/0 group-hover:border-purple-500/50 transition-all duration-300 animate-pulse opacity-0 group-hover:opacity-100" />
    </button>
  );

  // Wrap with tooltip if hover preview is enabled
  if (showHover && onUserClick) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {avatarElement}
          </TooltipTrigger>
          <TooltipContent side="top" className="p-3 bg-white dark:bg-gray-900 border shadow-lg">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={avatar} alt={username} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                  {username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{username}</span>
                  {verified && <CheckCircle className="w-3 h-3 text-blue-500" />}
                  {premium && <Crown className="w-3 h-3 text-yellow-500" />}
                </div>
                <div className="text-xs text-muted-foreground">@{username}</div>
                {credibilityScore && (
                  <Badge className="text-xs mt-1" variant="outline">
                    <Shield className="w-3 h-3 mr-1" />
                    {credibilityScore}% credibility
                  </Badge>
                )}
                <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  Click to view profile
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return avatarElement;
};

export default UserAvatar;
