import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  UserCircle, 
  Settings, 
  LogOut, 
  Crown, 
  Bell, 
  MessageSquare,
  TrendingUp,
  Shield,
} from "lucide-react";

interface TopNavAvatarProps {
  user: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    avatar?: string;
    isPremium?: boolean;
    isVerified?: boolean;
    credibilityScore?: number;
  };
  onNavigateToProfile: () => void;
  onNavigateToSettings: () => void;
  onLogout: () => void;
  notificationCount?: number;
}

export const TopNavAvatar: React.FC<TopNavAvatarProps> = ({
  user,
  onNavigateToProfile,
  onNavigateToSettings,
  onLogout,
  notificationCount = 0,
}) => {
  const getUserInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    return user.email.slice(0, 2).toUpperCase();
  };

  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username;
  };

  const getCredibilityBadge = (score: number) => {
    if (score >= 90) return { color: "text-purple-600", label: "Top 1%" };
    if (score >= 80) return { color: "text-blue-600", label: "Top 5%" };
    if (score >= 70) return { color: "text-green-600", label: "Trusted" };
    return { color: "text-gray-600", label: `${score}%` };
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-0 hover:bg-transparent rounded-full group transition-all duration-300"
        >
          <Avatar className="w-10 h-10 ring-2 ring-purple-500/30 group-hover:ring-purple-400/50 transition-all duration-300">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-sm group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          
          {/* Notification Badge */}
          {notificationCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {notificationCount > 9 ? "9+" : notificationCount}
            </Badge>
          )}

          {/* Premium Ring */}
          {user.isPremium && (
            <div className="absolute inset-0 rounded-full border-2 border-yellow-500/30 animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        align="end"
        className="w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-purple-500/20 animate-in fade-in-0 zoom-in-95 transition-all duration-300"
      >
        {/* User Info Header */}
        <div className="px-3 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 ring-2 ring-purple-500/30">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-semibold truncate">{getDisplayName()}</span>
                {user.isVerified && <Shield className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                {user.isPremium && <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
              </div>
              <div className="text-sm text-muted-foreground truncate">@{user.username}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              
              {user.credibilityScore && (
                <Badge 
                  variant="outline" 
                  className={`text-xs mt-1 ${getCredibilityBadge(user.credibilityScore).color}`}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {getCredibilityBadge(user.credibilityScore).label} Credibility
                </Badge>
              )}
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Navigation Items */}
        <DropdownMenuItem
          onClick={onNavigateToProfile}
          className="hover:bg-purple-500/10 focus:bg-purple-500/10 cursor-pointer transition-colors duration-200 px-3 py-2"
        >
          <UserCircle className="w-4 h-4 mr-3" />
          <div className="flex-1">
            <div className="font-medium">My Profile</div>
            <div className="text-xs text-muted-foreground">View your trader profile</div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="hover:bg-blue-500/10 focus:bg-blue-500/10 cursor-pointer transition-colors duration-200 px-3 py-2"
        >
          <Bell className="w-4 h-4 mr-3" />
          <div className="flex-1">
            <div className="font-medium">Notifications</div>
            <div className="text-xs text-muted-foreground">
              {notificationCount > 0 ? `${notificationCount} unread` : "No new notifications"}
            </div>
          </div>
          {notificationCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {notificationCount}
            </Badge>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="hover:bg-green-500/10 focus:bg-green-500/10 cursor-pointer transition-colors duration-200 px-3 py-2"
        >
          <MessageSquare className="w-4 h-4 mr-3" />
          <div className="flex-1">
            <div className="font-medium">Messages</div>
            <div className="text-xs text-muted-foreground">Chat with other traders</div>
          </div>
        </DropdownMenuItem>

        {user.isPremium && (
          <>
            <DropdownMenuSeparator />
            <div className="px-3 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 mx-1 rounded">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-600" />
                <div>
                  <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                    Premium Member
                  </div>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400">
                    Enjoying exclusive features
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onNavigateToSettings}
          className="hover:bg-gray-500/10 focus:bg-gray-500/10 cursor-pointer transition-colors duration-200 px-3 py-2"
        >
          <Settings className="w-4 h-4 mr-3" />
          Settings & Privacy
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onLogout}
          className="hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer transition-colors duration-200 text-red-600 dark:text-red-400 px-3 py-2"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TopNavAvatar;
