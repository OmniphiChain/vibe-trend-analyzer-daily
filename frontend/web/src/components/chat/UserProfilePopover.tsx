import { useState, useEffect } from "react";
import {
  Users,
  Bell,
  BellOff,
  ExternalLink,
  Shield,
  Star,
  TrendingUp,
  Activity,
  Award,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface UserProfileData {
  id: string;
  username: string;
  handle: string;
  avatar: string;
  bio: string;
  sentiment: "bullish" | "bearish" | "neutral";
  isVerified: boolean;
  isPremium: boolean;
  credibilityScore: number;
  accuracyScore: number;
  followers: number;
  following: number;
  isFollowing: boolean;
  alertsEnabled: boolean;
  badges: string[];
  joinedDate: string;
  topPercentile: number;
  recentActivity: string;
}

interface UserProfilePopoverProps {
  userId: string;
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
  onToggleAlerts: (userId: string, enabled: boolean) => void;
  onViewProfile: (userId: string) => void;
}

export const UserProfilePopover = ({
  userId,
  isVisible,
  position,
  onClose,
  onFollow,
  onUnfollow,
  onToggleAlerts,
  onViewProfile,
}: UserProfilePopoverProps) => {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data - in real app, fetch from API
  const mockUserData: { [key: string]: UserProfileData } = {
    user1: {
      id: "user1",
      username: "CryptoKing",
      handle: "@cryptoking",
      avatar: "/api/placeholder/64/64",
      bio: "Professional crypto trader with 8+ years experience. Focus on DeFi and Layer 1 protocols.",
      sentiment: "bullish",
      isVerified: true,
      isPremium: true,
      credibilityScore: 94,
      accuracyScore: 87,
      followers: 12450,
      following: 234,
      isFollowing: false,
      alertsEnabled: false,
      badges: ["Momentum Expert", "Top 1%", "DeFi Specialist"],
      joinedDate: "Jan 2022",
      topPercentile: 1,
      recentActivity: "Posted about $ETH 2h ago",
    },
    user2: {
      id: "user2",
      username: "BearMarketBae",
      handle: "@bearmarketbae",
      avatar: "/api/placeholder/64/64",
      bio: "Risk management specialist. Helping traders navigate volatile markets with smart strategies.",
      sentiment: "bearish",
      isVerified: true,
      isPremium: false,
      credibilityScore: 89,
      accuracyScore: 92,
      followers: 8920,
      following: 156,
      isFollowing: true,
      alertsEnabled: true,
      badges: ["Risk Analyst", "Technical Expert"],
      joinedDate: "Mar 2021",
      topPercentile: 3,
      recentActivity: "Shared market analysis 1h ago",
    },
    user3: {
      id: "user3",
      username: "AITraderBot",
      handle: "@aitraderbot",
      avatar: "/api/placeholder/64/64",
      bio: "AI-powered sentiment analysis and market predictions. Automated trading insights 24/7.",
      sentiment: "neutral",
      isVerified: true,
      isPremium: true,
      credibilityScore: 96,
      accuracyScore: 91,
      followers: 45200,
      following: 0,
      isFollowing: false,
      alertsEnabled: true,
      badges: ["AI Bot", "Sentiment Expert", "Verified Bot"],
      joinedDate: "Sep 2023",
      topPercentile: 0.1,
      recentActivity: "Updated market sentiment 5m ago",
    },
  };

  useEffect(() => {
    if (isVisible && userId) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setUserData(mockUserData[userId] || mockUserData.user1);
        setIsLoading(false);
      }, 300);
    }
  }, [isVisible, userId]);

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
        return "shadow-emerald-500/30 ring-emerald-500/20";
      case "bearish":
        return "shadow-red-500/30 ring-red-500/20";
      default:
        return "shadow-gray-500/20 ring-gray-500/10";
    }
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 95) return "text-purple-400 bg-purple-500/20";
    if (score >= 90) return "text-blue-400 bg-blue-500/20";
    if (score >= 85) return "text-emerald-400 bg-emerald-500/20";
    if (score >= 80) return "text-yellow-400 bg-yellow-500/20";
    return "text-gray-400 bg-gray-500/20";
  };

  const handleFollow = () => {
    if (!userData) return;
    if (userData.isFollowing) {
      onUnfollow(userData.id);
    } else {
      onFollow(userData.id);
    }
    setUserData(prev => prev ? { ...prev, isFollowing: !prev.isFollowing } : null);
  };

  const handleToggleAlerts = () => {
    if (!userData) return;
    onToggleAlerts(userData.id, !userData.alertsEnabled);
    setUserData(prev => prev ? { ...prev, alertsEnabled: !prev.alertsEnabled } : null);
  };

  if (!isVisible || !userData) return null;

  const popoverStyle = {
    position: "fixed" as const,
    left: `${Math.max(10, Math.min(position.x, window.innerWidth - 320))}px`,
    top: `${Math.max(10, Math.min(position.y, window.innerHeight - 400))}px`,
    zIndex: 9999,
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998]"
        onClick={onClose}
      />
      
      {/* Popover Card */}
      <Card
        style={popoverStyle}
        className="w-80 bg-gradient-to-br from-slate-900/95 to-purple-900/95 border-purple-500/30 backdrop-blur-xl shadow-2xl shadow-purple-500/20 animate-in fade-in zoom-in-95 duration-200"
      >
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-400 text-sm mt-2">Loading profile...</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-4 border-b border-purple-500/20">
                <div className="flex items-start gap-3">
                  {/* Avatar with Sentiment Ring */}
                  <div className={`relative ring-2 ${getSentimentGlow(userData.sentiment)} rounded-full hover:ring-4 transition-all`}>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={userData.avatar} />
                      <AvatarFallback>{userData.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r ${getSentimentColor(userData.sentiment)} animate-pulse`}></div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white truncate">{userData.username}</h3>
                      {userData.isVerified && (
                        <CheckCircle className="h-4 w-4 text-blue-400" />
                      )}
                      {userData.isPremium && (
                        <Star className="h-4 w-4 text-yellow-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{userData.handle}</p>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1">
                      {userData.badges.slice(0, 2).map(badge => (
                        <Badge key={badge} className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30 px-1.5 py-0.5">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-300 mt-3 leading-relaxed">
                  {userData.bio}
                </p>
              </div>

              {/* Stats */}
              <div className="p-4 border-b border-purple-500/20">
                <div className="grid grid-cols-2 gap-4">
                  {/* Credibility Score */}
                  <div className="text-center">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold ${getCredibilityColor(userData.credibilityScore)}`}>
                      <Award className="h-3 w-3" />
                      {userData.credibilityScore}%
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Credibility</p>
                  </div>

                  {/* Accuracy Score */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold text-cyan-400 bg-cyan-500/20">
                      <TrendingUp className="h-3 w-3" />
                      {userData.accuracyScore}%
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Accuracy</p>
                  </div>
                </div>

                {/* Follower Stats */}
                <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-purple-500/10">
                  <div className="text-center">
                    <p className="font-semibold text-white">{userData.followers.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-white">{userData.following.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-emerald-400">Top {userData.topPercentile}%</p>
                    <p className="text-xs text-gray-400">Trader</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-4 pt-4 border-t border-purple-500/10">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Activity className="h-3 w-3" />
                    <span>{userData.recentActivity}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleFollow}
                    className={`flex-1 ${
                      userData.isFollowing
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    }`}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    {userData.isFollowing ? "Unfollow" : "Follow"}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleAlerts}
                    className={`${
                      userData.alertsEnabled ? "text-yellow-400 hover:text-yellow-300" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {userData.alertsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewProfile(userData.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                {/* Member Since */}
                <p className="text-xs text-gray-500 text-center mt-3">
                  Member since {userData.joinedDate}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};
