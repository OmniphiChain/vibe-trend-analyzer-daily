import { useState } from "react";
import { 
  Bell, 
  BellOff, 
  UserPlus, 
  UserCheck, 
  UserX 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface PostInteractionBarProps {
  userId: string;
  username: string;
  compact?: boolean;
  className?: string;
  onFollow?: (userId: string) => void;
  onUnfollow?: (userId: string) => void;
  onToggleAlerts?: (userId: string, enabled: boolean) => void;
}

interface UserInteractionState {
  isFollowing: boolean;
  alertsEnabled: boolean;
  isLoading: boolean;
}

export const PostInteractionBar = ({
  userId,
  username,
  compact = false,
  className,
  onFollow,
  onUnfollow,
  onToggleAlerts,
}: PostInteractionBarProps) => {
  const { user, isAuthenticated } = useAuth();
  
  // Mock initial state - in real app, fetch from API based on current user's following status
  const [interactionState, setInteractionState] = useState<UserInteractionState>({
    isFollowing: false,
    alertsEnabled: false,
    isLoading: false,
  });

  // Don't show if viewing own post
  if (!isAuthenticated || user?.id === userId) {
    return null;
  }

  const handleFollow = async () => {
    if (interactionState.isLoading) return;
    
    setInteractionState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Optimistic update
      const newFollowingState = !interactionState.isFollowing;
      setInteractionState(prev => ({ 
        ...prev, 
        isFollowing: newFollowingState,
        // Disable alerts if unfollowing
        alertsEnabled: newFollowingState ? prev.alertsEnabled : false
      }));
      
      // Call parent callback
      if (newFollowingState) {
        onFollow?.(userId);
      } else {
        onUnfollow?.(userId);
      }
      
      // In real app, make API call here
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
    } catch (error) {
      // Revert on error
      setInteractionState(prev => ({ 
        ...prev, 
        isFollowing: !prev.isFollowing 
      }));
      console.error('Follow/unfollow failed:', error);
    } finally {
      setInteractionState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleToggleAlerts = async () => {
    if (!interactionState.isFollowing || interactionState.isLoading) return;
    
    setInteractionState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Optimistic update
      const newAlertsState = !interactionState.alertsEnabled;
      setInteractionState(prev => ({ 
        ...prev, 
        alertsEnabled: newAlertsState 
      }));
      
      // Call parent callback
      onToggleAlerts?.(userId, newAlertsState);
      
      // In real app, make API call here
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
      
    } catch (error) {
      // Revert on error
      setInteractionState(prev => ({ 
        ...prev, 
        alertsEnabled: !prev.alertsEnabled 
      }));
      console.error('Toggle alerts failed:', error);
    } finally {
      setInteractionState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleRequireAuth = () => {
    // In real app, trigger login modal
    console.log('Authentication required');
  };

  if (!isAuthenticated) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          variant="outline"
          size={compact ? "sm" : "default"}
          onClick={handleRequireAuth}
          className="h-8 px-3 text-xs"
        >
          <UserPlus className="h-3 w-3 mr-1" />
          Follow
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={cn(
        "flex items-center gap-1.5",
        compact ? "flex-col sm:flex-row" : "flex-row",
        className
      )}>
        {/* Follow/Following Button */}
        {interactionState.isFollowing ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size={compact ? "sm" : "default"}
                disabled={interactionState.isLoading}
                className="h-8 px-3 text-xs border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-300 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
              >
                <UserCheck className="h-3 w-3 mr-1" />
                Following
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom">
              <DropdownMenuItem 
                onClick={handleFollow}
                className="text-red-600 focus:text-red-600"
              >
                <UserX className="h-4 w-4 mr-2" />
                Unfollow @{username}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="outline"
            size={compact ? "sm" : "default"}
            onClick={handleFollow}
            disabled={interactionState.isLoading}
            className="h-8 px-3 text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 hover:from-blue-600 hover:to-indigo-600 hover:scale-105 transition-all duration-200"
          >
            <UserPlus className="h-3 w-3 mr-1" />
            Follow
          </Button>
        )}

        {/* Alert Bell Toggle - Only show if following */}
        {interactionState.isFollowing && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleAlerts}
                disabled={interactionState.isLoading}
                className={cn(
                  "h-8 w-8 p-0 transition-all duration-200",
                  interactionState.alertsEnabled 
                    ? "text-yellow-600 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-400" 
                    : "text-muted-foreground hover:text-yellow-600 hover:bg-yellow-50"
                )}
              >
                {interactionState.alertsEnabled ? (
                  <Bell className="h-4 w-4 fill-current" />
                ) : (
                  <BellOff className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">
                {interactionState.alertsEnabled 
                  ? `Turn off alerts from @${username}` 
                  : `Get sentiment alerts from @${username}`}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};

export default PostInteractionBar;
