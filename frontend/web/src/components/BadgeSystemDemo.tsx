import React, { useState } from "react";
import { BadgeType } from '@/types/common';
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Trophy,
  Award,
  Star,
  Crown,
  Target,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Settings,
  BarChart3,
  Clock,
  ChevronRight,
  Bell,
  Gift,
} from "lucide-react";

// Import badge components
import { BadgeDisplay } from "@/components/badges/BadgeDisplay";
import { BadgeManagement } from "@/components/badges/BadgeManagement";
import { UserCredibilityProfile } from "@/components/moderation/UserCredibilityProfile";
import { BADGE_DEFINITIONS, BADGE_CONFIG } from "@/data/badgeDefinitions";
import { generateMockUserBadges, generateMockBadgeProgress, badgeService } from "@/services/badgeService";

// Mock users for demo
const demoUsers = [
  {
    id: "user1",
    username: "TechTrader23",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=faces",
    role: "verified",
    credibilityScore: 87,
    badges: ["trusted_contributor", "verified_insights", "top_predictor", "bullish_beast", "premium_member"],
    progress: ["mood_forecaster", "accuracy_master"]
  },
  {
    id: "user2",
    username: "CryptoQueen", 
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b4e0?w=50&h=50&fit=crop&crop=faces",
    role: "premium",
    credibilityScore: 82,
    badges: ["mood_forecaster", "engagement_hero", "diamond_hands", "bear_watcher", "beta_tester"],
    progress: ["trusted_contributor", "community_champion"]
  },
  {
    id: "user3",
    username: "WallStreetWolf",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=faces", 
    role: "member",
    credibilityScore: 74,
    badges: ["smart_takes", "trending_voice", "meme_lord", "momentum_junkie"],
    progress: ["trade_signal_pro", "trusted_reporter"]
  },
  {
    id: "user4",
    username: "Newbie2024",
    role: "member",
    credibilityScore: 45,
    badges: ["new_voice"],
    progress: ["verified_insights", "bullish_beast", "engagement_hero"]
  },
];

export const BadgeSystemDemo: React.FC = () => {
  const { themeMode } = useMoodTheme();
  const [selectedUser, setSelectedUser] = useState(demoUsers[0]);
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "earned",
      badge: "trusted_contributor",
      message: "You've earned the Trusted Contributor badge!",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "2", 
      type: "progress",
      badge: "mood_forecaster",
      message: "You're 80% towards earning Sentiment Seer",
      time: "1 day ago",
      read: false,
    },
    {
      id: "3",
      type: "earned",
      badge: "verified_insights",
      message: "Data-Driven Analyst badge earned!",
      time: "3 days ago", 
      read: true,
    },
  ]);

  const mockUserBadges = selectedUser?.badges?.map((badgeId: BadgeType) => ({
    badgeId,
    userId: selectedUser?.id || 'demo-user',
    earnedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    isActive: true,
    metadata: {
      triggerValue: Math.floor(Math.random() * 100) + 50,
      context: "demo_data"
    }
  })) || [];

  const mockBadgeProgress = selectedUser?.progress?.map((badgeId: BadgeType) => ({
    badgeId,
    userId: selectedUser?.id || 'demo-user',
    progress: Math.floor(Math.random() * 40) + 60, // 60-100% progress
    currentValue: Math.floor(Math.random() * 80) + 10,
    targetValue: 100,
    lastUpdated: new Date(),
    isCloseToEarning: true
  })) || [];

  const getBadgeStats = () => {
    const totalBadges = mockUserBadges.length;
    const badgeScore = mockUserBadges.reduce((score, ub) => {
      const badge = BADGE_DEFINITIONS[ub.badgeId];
      return score + (badge ? BADGE_CONFIG.RARITY_SCORES[badge.rarity] : 0);
    }, 0);
    
    return { totalBadges, badgeScore };
  };

  const { totalBadges, badgeScore } = getBadgeStats();

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className={cn(
            "text-4xl font-bold",
            themeMode === 'light' ? 'text-gray-900' : 'text-white'
          )}>
            MoodMeter Badge System
          </h1>
        </div>
        <p className={cn(
          "text-lg max-w-2xl mx-auto",
          themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
        )}>
          Gamified credibility system with achievement badges, progress tracking, and community leaderboards
        </p>
      </div>

      {/* Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center p-6">
          <Award className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Trust Badges</h3>
          <p className="text-sm text-muted-foreground">
            Credibility and accuracy-based achievements
          </p>
        </Card>

        <Card className="text-center p-6">
          <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Performance</h3>
          <p className="text-sm text-muted-foreground">
            Trading accuracy and prediction badges
          </p>
        </Card>

        <Card className="text-center p-6">
          <Users className="w-8 h-8 text-purple-500 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Community</h3>
          <p className="text-sm text-muted-foreground">
            Engagement and mentorship recognition
          </p>
        </Card>

        <Card className="text-center p-6">
          <Zap className="w-8 h-8 text-orange-500 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Personality</h3>
          <p className="text-sm text-muted-foreground">
            Trading style and behavior badges
          </p>
        </Card>
      </div>

      {/* User Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Demo Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {demoUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={cn(
                  "p-4 rounded-lg border cursor-pointer transition-all",
                  selectedUser.id === user.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-8 h-8">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.username} />
                    ) : (
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{user.username}</div>
                    <div className="text-xs text-muted-foreground">
                      Score: {user.credibilityScore}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Badges:</span>
                    <span>{user.badges.length}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Progress:</span>
                    <span>{user.progress.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Demo Tabs */}
      <Tabs defaultValue="showcase" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="showcase">Badge Showcase</TabsTrigger>
          <TabsTrigger value="profile">User Profile</TabsTrigger>
          <TabsTrigger value="management">Badge Collection</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        {/* Badge Showcase */}
        <TabsContent value="showcase" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current User */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    {selectedUser.avatar ? (
                      <AvatarImage src={selectedUser.avatar} alt={selectedUser.username} />
                    ) : (
                      <AvatarFallback>{selectedUser.username[0]}</AvatarFallback>
                    )}
                  </Avatar>
                  {selectedUser.username}'s Badges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{totalBadges}</div>
                    <div className="text-sm text-muted-foreground">Badges</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{badgeScore}</div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{mockBadgeProgress.length}</div>
                    <div className="text-sm text-muted-foreground">Progress</div>
                  </div>
                </div>

                <Separator />

                {/* Badge Display Examples */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Compact View (for usernames)</h4>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{selectedUser.username}</span>
                      <BadgeDisplay
                        userBadges={mockUserBadges}
                        variant="compact"
                        maxDisplay={3}
                        showTooltip={true}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Profile View</h4>
                    <BadgeDisplay
                      userBadges={mockUserBadges}
                      badgeProgress={mockBadgeProgress}
                      variant="profile"
                      showProgress={true}
                      showTooltip={true}
                      allowModal={true}
                    />
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Full View with Progress</h4>
                    <BadgeDisplay
                      userBadges={mockUserBadges}
                      badgeProgress={mockBadgeProgress}
                      variant="full"
                      showProgress={true}
                      showTooltip={true}
                      allowModal={true}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Badge Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Badge Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries({
                    credibility: { icon: Shield, color: "text-green-500", name: "Trust & Accuracy" },
                    performance: { icon: TrendingUp, color: "text-blue-500", name: "Trading Performance" },
                    community: { icon: Users, color: "text-purple-500", name: "Community Engagement" },
                    personality: { icon: Zap, color: "text-orange-500", name: "Trading Style" },
                    special: { icon: Crown, color: "text-yellow-500", name: "Special Recognition" },
                  }).map(([category, config]) => {
                    const badgesInCategory = Object.values(BADGE_DEFINITIONS).filter(
                      badge => badge.category === category && badge.isVisible
                    );
                    const userBadgesInCategory = mockUserBadges.filter(ub => {
                      const badge = BADGE_DEFINITIONS[ub.badgeId];
                      return badge?.category === category;
                    });

                    return (
                      <div key={category} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <config.icon className={cn("w-5 h-5", config.color)} />
                          <div>
                            <div className="font-medium">{config.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {badgesInCategory.length} badges available
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{userBadgesInCategory.length}</div>
                          <div className="text-sm text-muted-foreground">earned</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Profile Integration */}
        <TabsContent value="profile">
          <div className="max-w-2xl mx-auto">
            <UserCredibilityProfile 
              userId={selectedUser.id}
              variant="full"
              showActions={true}
            />
          </div>
        </TabsContent>

        {/* Full Badge Management */}
        <TabsContent value="management">
          <BadgeManagement 
            userId={selectedUser.id}
            variant="full"
            showSettings={true}
          />
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Badge Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification) => {
                  const badge = BADGE_DEFINITIONS[notification.badge as keyof typeof BADGE_DEFINITIONS];
                  return (
                    <div 
                      key={notification.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border",
                        !notification.read && "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {notification.type === "earned" ? (
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                            <Gift className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <Target className="w-4 h-4" />
                          </div>
                        )}
                        
                        {badge && (
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                            style={{ backgroundColor: badge.color }}
                          >
                            {badge.icon}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium text-sm">{notification.message}</div>
                        <div className="text-xs text-muted-foreground">{notification.time}</div>
                      </div>
                      
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Examples */}
        <TabsContent value="integration" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chat Integration */}
            <Card>
              <CardHeader>
                <CardTitle>Chat Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    How badges appear in chat messages and user profiles
                  </div>
                  
                  {/* Mock chat messages */}
                  <div className="space-y-3">
                    {demoUsers.slice(0, 3).map((user) => (
                      <div key={user.id} className="flex gap-3 p-3 rounded-lg border">
                        <Avatar className="w-8 h-8">
                          {user.avatar ? (
                            <AvatarImage src={user.avatar} alt={user.username} />
                          ) : (
                            <AvatarFallback>{user.username[0]}</AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{user.username}</span>
                            <BadgeDisplay
                              userBadges={user.badges.map(badgeId => ({
                                badgeId: badgeId as any,
                                userId: user.id,
                                earnedAt: new Date(),
                                isActive: true,
                                metadata: {}
                              }))}
                              variant="compact"
                              maxDisplay={2}
                              showTooltip={true}
                            />
                            <span className="text-xs text-muted-foreground">2m ago</span>
                          </div>
                          <p className="text-sm">
                            {user.id === "user1" && "$AAPL looking strong above $195 resistance. My analysis shows..."}
                            {user.id === "user2" && "💎 Diamond hands on $BTC! This dip is just a buying opportunity..."}
                            {user.id === "user3" && "🐻 Market sentiment shifting bearish. Time to be cautious..."}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard Integration */}
            <Card>
              <CardHeader>
                <CardTitle>Leaderboard Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground mb-4">
                    Badge scoring system for community rankings
                  </div>
                  
                  {demoUsers.map((user, index) => {
                    const userBadges = user.badges.map((badgeId: BadgeType) => ({
                      badgeId,
                      userId: user.id,
                      earnedAt: new Date(),
                      isActive: true,
                      metadata: {}
                    }));
                    
                    const score = userBadges.reduce((total, ub) => {
                      const badge = BADGE_DEFINITIONS[ub.badgeId];
                      return total + (badge ? BADGE_CONFIG.RARITY_SCORES[badge.rarity] : 0);
                    }, 0);

                    return (
                      <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg border">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs",
                          index === 0 && "bg-yellow-500 text-white",
                          index === 1 && "bg-gray-400 text-white",
                          index === 2 && "bg-amber-600 text-white",
                          index > 2 && "bg-gray-200 text-gray-600"
                        )}>
                          {index + 1}
                        </div>
                        
                        <Avatar className="w-8 h-8">
                          {user.avatar ? (
                            <AvatarImage src={user.avatar} alt={user.username} />
                          ) : (
                            <AvatarFallback>{user.username[0]}</AvatarFallback>
                          )}
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="font-medium text-sm">{user.username}</div>
                          <div className="text-xs text-muted-foreground">
                            {user.badges.length} badges • {score} points
                          </div>
                        </div>
                        
                        <BadgeDisplay
                          userBadges={userBadges}
                          variant="compact" 
                          maxDisplay={3}
                          showTooltip={true}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Implementation Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Implementation Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">✅ Implemented Features</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 25+ badge types across 5 categories</li>
                    <li>• Real-time earning logic and progress tracking</li>
                    <li>• Rarity-based scoring system (Common to Legendary)</li>
                    <li>• Multiple display variants (compact, profile, full)</li>
                    <li>• Interactive badge collection management</li>
                    <li>• Progress notifications and milestones</li>
                    <li>• Leaderboard integration with badge scoring</li>
                    <li>• Seamless integration with credibility system</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">🎯 Badge Categories</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>Credibility:</strong> Trust, accuracy, verified content</li>
                    <li>• <strong>Performance:</strong> Trading accuracy, predictions</li>
                    <li>• <strong>Community:</strong> Engagement, mentorship, viral content</li>
                    <li>• <strong>Moderation:</strong> Safety, reporting, behavior</li>
                    <li>• <strong>Personality:</strong> Bull/bear, trading style</li>
                    <li>• <strong>Special:</strong> Early adopter, premium, verified</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BadgeSystemDemo;
