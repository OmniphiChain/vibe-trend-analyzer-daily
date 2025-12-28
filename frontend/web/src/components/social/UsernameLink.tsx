import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Shield, Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UsernameLinkProps {
  userId: string;
  username: string;
  displayName?: string;
  avatar?: string;
  verified?: boolean;
  premium?: boolean;
  credibilityScore?: number;
  showHandle?: boolean;
  showBadges?: boolean;
  showHover?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  onUserClick?: (userId: string) => void;
}

const sizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg"
};

export const UsernameLink: React.FC<UsernameLinkProps> = ({
  userId,
  username,
  displayName,
  avatar,
  verified = false,
  premium = false,
  credibilityScore,
  showHandle = true,
  showBadges = true,
  showHover = true,
  size = "sm",
  className = "",
  onUserClick,
}) => {
  const handleClick = () => {
    onUserClick?.(userId);
  };

  const getCredibilityBadge = (score: number) => {
    if (score >= 90) return { color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20", label: "Top 1%" };
    if (score >= 80) return { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20", label: "Top 5%" };
    if (score >= 70) return { color: "bg-green-100 text-green-700 dark:bg-green-900/20", label: "Trusted" };
    return { color: "bg-gray-100 text-gray-700 dark:bg-gray-900/20", label: `${score}%` };
  };

  const usernameElement = (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-1 font-semibold transition-all duration-200
        hover:text-purple-600 dark:hover:text-purple-400 
        hover:underline cursor-pointer
        ${sizeClasses[size]} ${className}
      `}
      disabled={!onUserClick}
    >
      <span>{displayName || username}</span>
      
      {showBadges && (
        <>
          {verified && <CheckCircle className="w-3 h-3 text-blue-500" />}
          {premium && <Crown className="w-3 h-3 text-yellow-500" />}
          {credibilityScore && credibilityScore >= 80 && (
            <Star className="w-3 h-3 text-purple-500" />
          )}
        </>
      )}
      
      {showHandle && (
        <span className="text-muted-foreground font-normal">
          @{username}
        </span>
      )}
    </button>
  );

  // Wrap with tooltip if hover preview is enabled
  if (showHover && onUserClick) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {usernameElement}
          </TooltipTrigger>
          <TooltipContent side="top" className="p-4 bg-white dark:bg-gray-900 border shadow-xl max-w-xs">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 ring-2 ring-purple-500/30">
                  <AvatarImage src={avatar} alt={username} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                    {username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{displayName || username}</span>
                    {verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                    {premium && <Crown className="w-4 h-4 text-yellow-500" />}
                  </div>
                  <div className="text-sm text-muted-foreground">@{username}</div>
                </div>
              </div>
              
              {credibilityScore && (
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">
                    <Badge className={`text-xs ${getCredibilityBadge(credibilityScore).color}`}>
                      {getCredibilityBadge(credibilityScore).label} Credibility
                    </Badge>
                  </span>
                </div>
              )}
              
              <div className="text-xs text-purple-600 dark:text-purple-400 border-t pt-2">
                💡 Click to view full profile
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return usernameElement;
};

export default UsernameLink;
