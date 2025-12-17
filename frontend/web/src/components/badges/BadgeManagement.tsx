import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Award,
  Trophy,
  Target,
  TrendingUp,
  Star,
  Crown,
  Zap,
  Filter,
  Search,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  ChevronRight,
} from "lucide-react";
import { BadgeDisplay } from "./BadgeDisplay";
import type { 
  UserBadge, 
  BadgeProgress, 
  BadgeStats, 
  BadgeCategory,
  BadgeRarity,
  BadgeFilterOptions 
} from "@/types/badges";
import { BADGE_DEFINITIONS, BADGE_CONFIG, getBadgesByCategory } from "@/data/badgeDefinitions";
import { badgeService, generateMockUserBadges, generateMockBadgeProgress } from "@/services/badgeService";

interface BadgeManagementProps {
  userId: string;
  variant?: "full" | "summary";
  showSettings?: boolean;
  className?: string;
}

interface BadgeLeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  badgeScore: number;
  totalBadges: number;
  recentBadges: string[];
  rank: number;
}

export const BadgeManagement: React.FC<BadgeManagementProps> = ({
  userId,
  variant = "full",
  showSettings = true,
  className,
}) => {
  const { themeMode } = useMoodTheme();
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [badgeProgress, setBadgeProgress] = useState<BadgeProgress[]>([]);
  const [badgeStats, setBadgeStats] = useState<BadgeStats | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | "all">("all");
  const [selectedRarity, setSelectedRarity] = useState<BadgeRarity | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock leaderboard data
  const [leaderboard] = useState<BadgeLeaderboardEntry[]>([
    {
      userId: "user1",
      username: "TechTrader23",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=faces",
      badgeScore: 47,
      totalBadges: 12,
      recentBadges: ["trusted_contributor", "top_predictor", "verified_insights"],
      rank: 1,
    },
    {
      userId: "user2", 
      username: "CryptoQueen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b4e0?w=50&h=50&fit=crop&crop=faces",
      badgeScore: 38,
      totalBadges: 9,
      recentBadges: ["mood_forecaster", "bullish_beast", "engagement_hero"],
      rank: 2,
    },
    {
      userId: "user3",
      username: "WallStreetWolf", 
      badgeScore: 31,
      totalBadges: 8,
      recentBadges: ["bear_watcher", "smart_takes", "trending_voice"],
      rank: 3,
    },
    {
      userId: userId,
      username: "You",
      badgeScore: 23,
      totalBadges: 6,
      recentBadges: ["verified_insights", "new_voice", "premium_member"],
      rank: 7,
    },
  ]);

  useEffect(() => {
    loadUserBadges();
  }, [userId]);

  const loadUserBadges = async () => {
    setLoading(true);
    try {
      // In a real app, these would be API calls
      const badges = generateMockUserBadges(userId);
      const progress = generateMockBadgeProgress(userId);
      const stats = await badgeService.getUserStats(userId);
      
      setUserBadges(badges);
      setBadgeProgress(progress);
      setBadgeStats(stats);
    } catch (error) {
      console.error("Failed to load badges:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBadges = Object.entries(BADGE_DEFINITIONS)
    .filter(([_, badge]) => {
      if (!badge.isVisible) return false;
      if (selectedCategory !== "all" && badge.category !== selectedCategory) return false;
      if (selectedRarity !== "all" && badge.rarity !== selectedRarity) return false;
      if (searchQuery && !badge.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .map(([badgeId, badge]) => {
      const userBadge = userBadges.find(ub => ub.badgeId === badgeId);
      const progress = badgeProgress.find(bp => bp.badgeId === badgeId);
      
      return {
        ...badge,
        earned: !!userBadge,
        earnedAt: userBadge?.earnedAt,
        progress: progress?.progress || 0,
        isInProgress: !!progress && progress.progress > 0,
      };
    });

  const getCategoryIcon = (category: BadgeCategory) => {
    const icons = {
      credibility: Trophy,
      performance: TrendingUp,
      community: Award,
      moderation: Settings,
      personality: Zap,
      special: Crown,
    };
    return icons[category] || Award;
  };

  const getRarityColor = (rarity: BadgeRarity) => {
    const colors = {
      common: "text-gray-500",
      rare: "text-blue-500", 
      epic: "text-purple-500",
      legendary: "text-yellow-500",
    };
    return colors[rarity];
  };

  if (variant === "summary") {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Badge Collection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{userBadges.length}</div>
                <div className="text-sm text-muted-foreground">Earned</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{badgeProgress.length}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{badgeStats?.badgeScore || 0}</div>
                <div className="text-sm text-muted-foreground">Badge Score</div>
              </div>
            </div>

            {/* Recent Badges */}
            <div>
              <h4 className="font-medium mb-2">Recent Badges</h4>
              <BadgeDisplay
                userBadges={userBadges.slice(0, 5)}
                variant="profile"
                showTooltip={true}
                allowModal={true}
              />
            </div>

            {/* Progress Preview */}
            {badgeProgress.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Close to Earning</h4>
                <div className="space-y-2">
                  {badgeProgress.slice(0, 2).map((progress) => {
                    const badge = BADGE_DEFINITIONS[progress.badgeId];
                    return (
                      <div key={progress.badgeId} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          {badge.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{badge.name}</div>
                          <Progress value={progress.progress} className="h-1 mt-1" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {progress.progress}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn(
            "text-3xl font-bold flex items-center gap-2",
            themeMode === 'light' ? 'text-gray-900' : 'text-white'
          )}>
            <Trophy className="w-8 h-8 text-yellow-500" />
            Badge Collection
          </h1>
          <p className={cn(
            "text-sm mt-1",
            themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
          )}>
            Track your achievements and progress on MoodMeter
          </p>
        </div>
        
        {showSettings && (
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <div className="text-2xl font-bold">{userBadges.length}</div>
            <div className="text-sm text-muted-foreground">Badges Earned</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <div className="text-2xl font-bold">{badgeProgress.length}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <div className="text-2xl font-bold">{badgeStats?.badgeScore || 0}</div>
            <div className="text-sm text-muted-foreground">Badge Score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <div className="text-2xl font-bold">#{badgeStats?.rank || "N/A"}</div>
            <div className="text-sm text-muted-foreground">Global Rank</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="collection" className="space-y-4">
        <TabsList>
          <TabsTrigger value="collection">My Collection</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="all">All Badges</TabsTrigger>
        </TabsList>

        {/* My Collection */}
        <TabsContent value="collection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Earned Badges</CardTitle>
            </CardHeader>
            <CardContent>
              {userBadges.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {userBadges.map((userBadge) => {
                    const badge = BADGE_DEFINITIONS[userBadge.badgeId];
                    if (!badge) return null;
                    
                    return (
                      <div key={userBadge.badgeId} className="p-4 rounded-lg border text-center bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <div className="flex justify-center mb-3">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg"
                            style={{ backgroundColor: badge.color }}
                          >
                            {badge.icon}
                          </div>
                        </div>
                        <div className="font-medium text-sm">{badge.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {badge.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          Earned {userBadge.earnedAt.toLocaleDateString()}
                        </div>
                        <Badge 
                          className={cn("mt-2", getRarityColor(badge.rarity))}
                          variant="outline"
                        >
                          {badge.rarity}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <div className="text-muted-foreground">No badges earned yet</div>
                  <div className="text-sm text-muted-foreground">
                    Start posting and engaging to earn your first badge!
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Badge Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {badgeProgress.length > 0 ? (
                <div className="space-y-4">
                  {badgeProgress.map((progress) => {
                    const badge = BADGE_DEFINITIONS[progress.badgeId];
                    if (!badge) return null;
                    
                    return (
                      <div key={progress.badgeId} className="flex items-center gap-4 p-4 rounded-lg border">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                          style={{ 
                            backgroundColor: progress.progress > 80 ? badge.color : '#9CA3AF',
                            opacity: progress.progress > 80 ? 1 : 0.6 
                          }}
                        >
                          {badge.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{badge.name}</div>
                          <div className="text-sm text-muted-foreground">{badge.criteria}</div>
                          <div className="mt-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{progress.progress}%</span>
                            </div>
                            <Progress value={progress.progress} className="h-2" />
                          </div>
                        </div>
                        <Badge 
                          className={getRarityColor(badge.rarity)}
                          variant="outline"
                        >
                          {badge.rarity}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <div className="text-muted-foreground">No badges in progress</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Badge Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboard.map((entry) => (
                  <div 
                    key={entry.userId}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg",
                      entry.userId === userId 
                        ? "bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                      entry.rank <= 3 ? "text-white" : "text-muted-foreground",
                      entry.rank === 1 && "bg-yellow-500",
                      entry.rank === 2 && "bg-gray-400", 
                      entry.rank === 3 && "bg-amber-600",
                      entry.rank > 3 && "bg-muted"
                    )}>
                      {entry.rank}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium">{entry.username}</div>
                      <div className="text-sm text-muted-foreground">
                        {entry.totalBadges} badges • {entry.badgeScore} points
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      {entry.recentBadges.slice(0, 3).map((badgeId, index) => {
                        const badge = BADGE_DEFINITIONS[badgeId as keyof typeof BADGE_DEFINITIONS];
                        return badge ? (
                          <div 
                            key={index}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white"
                            style={{ backgroundColor: badge.color }}
                          >
                            {badge.icon}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Badges */}
        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <Input
                    placeholder="Search badges..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="credibility">Credibility</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="personality">Personality</SelectItem>
                    <SelectItem value="special">Special</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedRarity} onValueChange={(value: any) => setSelectedRarity(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Rarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rarities</SelectItem>
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="epic">Epic</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Badge Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBadges.map((badge) => (
              <Card 
                key={badge.id}
                className={cn(
                  "transition-all",
                  badge.earned && "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20",
                  badge.isInProgress && !badge.earned && "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                )}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg"
                      style={{ 
                        backgroundColor: badge.earned ? badge.color : '#9CA3AF',
                        opacity: badge.earned ? 1 : 0.6 
                      }}
                    >
                      {badge.icon}
                    </div>
                  </div>
                  
                  <div className="font-medium">{badge.name}</div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {badge.description}
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <Badge 
                      className={getRarityColor(badge.rarity)}
                      variant="outline"
                    >
                      {badge.rarity}
                    </Badge>
                    
                    {badge.earned ? (
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                        ✓ Earned {badge.earnedAt?.toLocaleDateString()}
                      </div>
                    ) : badge.isInProgress ? (
                      <div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                          {badge.progress}% Complete
                        </div>
                        <Progress value={badge.progress} className="h-1" />
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">
                        Not started
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                    {badge.criteria}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BadgeManagement;
