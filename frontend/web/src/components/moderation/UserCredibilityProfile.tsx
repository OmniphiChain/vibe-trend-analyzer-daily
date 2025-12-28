import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Star,
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Shield,
  Clock,
  Brain,
  Users,
  BarChart3,
  Calendar,
  Flame,
  Crown,
  Medal,
  Zap,
} from "lucide-react";
import type {
  UserCredibility,
  CredibilityBadge,
  UserRestriction,
  CredibilityLevel
} from "@/types/moderation";
import { BadgeDisplay } from "@/components/badges/BadgeDisplay";
import { generateMockUserBadges, generateMockBadgeProgress } from "@/services/badgeService";

// Mock user credibility data
const mockUserCredibility: UserCredibility = {
  userId: "user-123",
  overallScore: 82,
  level: "trusted",
  stats: {
    totalPosts: 1247,
    verifiedPosts: 892,
    flaggedPosts: 3,
    accuratePredictions: 156,
    totalPredictions: 201,
    accuracyRate: 77.6,
    averagePostScore: 78.4,
  },
  scoreHistory: [
    { date: new Date("2024-01-01"), score: 65 },
    { date: new Date("2024-02-01"), score: 72 },
    { date: new Date("2024-03-01"), score: 78 },
    { date: new Date("2024-04-01"), score: 82 },
  ],
  badges: [
    {
      id: "trusted-contributor",
      name: "Trusted Contributor",
      description: "Consistently provides high-quality, verified content",
      icon: "🏆",
      color: "#FFD700",
      level: "gold",
      criteria: "Maintain 70+ credibility score for 3 months",
      earnedAt: new Date("2024-03-15"),
    },
    {
      id: "fact-checker",
      name: "Fact Checker",
      description: "Regularly provides sources and data-backed analysis",
      icon: "🔍",
      color: "#F4F6FA",
      level: "silver",
      criteria: "Include sources in 80% of posts",
      earnedAt: new Date("2024-02-01"),
    },
    {
      id: "accurate-predictor",
      name: "Accurate Predictor",
      description: "High accuracy rate in market predictions",
      icon: "🎯",
      color: "#059669",
      level: "silver",
      criteria: "75%+ prediction accuracy over 100+ predictions",
      earnedAt: new Date("2024-01-20"),
    },
  ],
  factors: {
    postQuality: 85,
    sourceUsage: 78,
    communityEngagement: 88,
    predictionAccuracy: 78,
    consistencyScore: 82,
  },
  restrictions: [],
  lastUpdated: new Date(),
};

interface UserCredibilityProfileProps {
  userId: string;
  variant?: "full" | "compact" | "badge-only";
  showActions?: boolean;
  className?: string;
}

const getCredibilityConfig = (score: number, level: CredibilityLevel) => {
  if (score >= 70) {
    return {
      label: "Trusted Contributor",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      icon: <CheckCircle className="w-4 h-4" />,
      description: "Highly reliable content creator",
    };
  } else if (score >= 40) {
    return {
      label: "Under Review",
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      icon: <AlertTriangle className="w-4 h-4" />,
      description: "Mixed track record",
    };
  } else {
    return {
      label: "Unverified",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      icon: <XCircle className="w-4 h-4" />,
      description: "Limited verification",
    };
  }
};

const getBadgeIcon = (badgeIcon: string) => {
  switch (badgeIcon) {
    case "🏆": return <Award className="w-4 h-4" />;
    case "🔍": return <Brain className="w-4 h-4" />;
    case "🎯": return <Target className="w-4 h-4" />;
    case "⚡": return <Zap className="w-4 h-4" />;
    case "🔥": return <Flame className="w-4 h-4" />;
    case "👑": return <Crown className="w-4 h-4" />;
    case "🥇": return <Medal className="w-4 h-4" />;
    default: return <Star className="w-4 h-4" />;
  }
};

const CredibilityFactors: React.FC<{ factors: UserCredibility["factors"] }> = ({ factors }) => {
  const { themeMode } = useMoodTheme();
  
  const factorData = [
    { name: "Post Quality", value: factors.postQuality, icon: Star },
    { name: "Source Usage", value: factors.sourceUsage, icon: Brain },
    { name: "Community Engagement", value: factors.communityEngagement, icon: Users },
    { name: "Prediction Accuracy", value: factors.predictionAccuracy, icon: Target },
    { name: "Consistency", value: factors.consistencyScore, icon: BarChart3 },
  ];

  return (
    <div className="space-y-4">
      {factorData.map(({ name, value, icon: Icon }) => (
        <div key={name} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-blue-500" />
              <span className={cn(
                "font-medium",
                themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'
              )}>
                {name}
              </span>
            </div>
            <span className={cn(
              "font-mono text-sm",
              themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
            )}>
              {value}/100
            </span>
          </div>
          <Progress value={value} className="h-2" />
        </div>
      ))}
    </div>
  );
};

const BadgeCollection: React.FC<{ badges: CredibilityBadge[] }> = ({ badges }) => {
  const { themeMode } = useMoodTheme();

  return (
    <div className="grid grid-cols-1 gap-3">
      {badges.map((badge) => (
        <TooltipProvider key={badge.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(
                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                themeMode === 'light' 
                  ? 'bg-white border-gray-200 hover:bg-gray-50' 
                  : 'bg-gray-800 border-gray-700 hover:bg-gray-750'
              )}>
                <div className="flex items-center justify-center w-10 h-10 rounded-full" 
                     style={{ backgroundColor: badge.color + '20' }}>
                  <span className="text-lg">{badge.icon}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={cn(
                      "font-medium text-sm",
                      themeMode === 'light' ? 'text-gray-900' : 'text-white'
                    )}>
                      {badge.name}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs capitalize",
                        badge.level === 'gold' && 'border-yellow-500 text-yellow-700 dark:text-yellow-400',
                        badge.level === 'silver' && 'border-gray-500 text-gray-700 dark:text-gray-400',
                        badge.level === 'bronze' && 'border-orange-500 text-orange-700 dark:text-orange-400'
                      )}
                    >
                      {badge.level}
                    </Badge>
                  </div>
                  <p className={cn(
                    "text-xs mt-1",
                    themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
                  )}>
                    {badge.description}
                  </p>
                </div>
                
                <div className={cn(
                  "text-xs",
                  themeMode === 'light' ? 'text-gray-500' : 'text-gray-500'
                )}>
                  {badge.earnedAt.toLocaleDateString()}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs">
                <p className="font-medium">{badge.criteria}</p>
                <p className="text-muted-foreground">
                  Earned {badge.earnedAt.toLocaleDateString()}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export const UserCredibilityProfile: React.FC<UserCredibilityProfileProps> = ({
  userId,
  variant = "full",
  showActions = false,
  className,
}) => {
  const { themeMode } = useMoodTheme();
  const [credibility] = useState<UserCredibility>(mockUserCredibility);
  const [userBadges] = useState(() => generateMockUserBadges(userId));
  const [badgeProgress] = useState(() => generateMockBadgeProgress(userId));
  const config = getCredibilityConfig(credibility.overallScore, credibility.level);

  // Badge only variant
  if (variant === "badge-only") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium border",
              config.bgColor,
              config.color,
              config.borderColor,
              className
            )}>
              {config.icon}
              <span>{config.label}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Credibility Score: {credibility.overallScore}/100</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Compact variant
  if (variant === "compact") {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              config.bgColor
            )}>
              {config.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={cn(
                  "font-semibold text-sm",
                  config.color
                )}>
                  {config.label}
                </h3>
                <span className={cn(
                  "text-xs font-mono",
                  themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
                )}>
                  {credibility.overallScore}/100
                </span>
              </div>
              <p className={cn(
                "text-xs",
                themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
              )}>
                {credibility.stats.accuracyRate.toFixed(1)}% prediction accuracy
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <BadgeDisplay
                userBadges={userBadges}
                badgeProgress={badgeProgress}
                variant="compact"
                maxDisplay={2}
                showTooltip={true}
              />
              <div className={cn(
                "text-xs",
                themeMode === 'light' ? 'text-gray-500' : 'text-gray-500'
              )}>
                {userBadges.length} badges
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full variant
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Credibility Profile
          </CardTitle>
          
          {showActions && (
            <Button variant="outline" size="sm">
              View Details
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center space-y-2">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
            config.bgColor,
            config.borderColor,
            "border"
          )}>
            {config.icon}
            <span className={cn("font-semibold", config.color)}>
              {config.label}
            </span>
          </div>
          
          <div className="space-y-1">
            <div className="text-3xl font-bold">
              {credibility.overallScore}/100
            </div>
            <p className={cn(
              "text-sm",
              themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
            )}>
              {config.description}
            </p>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {credibility.stats.accuracyRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Prediction Accuracy</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {credibility.stats.verifiedPosts}
            </div>
            <p className="text-xs text-muted-foreground">Verified Posts</p>
          </div>
        </div>

        {/* Tabs for detailed view */}
        <Tabs defaultValue="factors" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="factors">Factors</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="awards">Awards</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="factors">
            <CredibilityFactors factors={credibility.factors} />
          </TabsContent>
          
          <TabsContent value="badges">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Achievement Badges</h4>
                <span className="text-sm text-muted-foreground">{userBadges.length} earned</span>
              </div>
              <BadgeDisplay
                userBadges={userBadges}
                badgeProgress={badgeProgress}
                variant="profile"
                showProgress={true}
                showTooltip={true}
                allowModal={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="awards">
            <BadgeCollection badges={credibility.badges} />
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span>Total Posts:</span>
                <span className="font-mono">{credibility.stats.totalPosts}</span>
              </div>
              <div className="flex justify-between">
                <span>Flagged Posts:</span>
                <span className="font-mono">{credibility.stats.flaggedPosts}</span>
              </div>
              <div className="flex justify-between">
                <span>Predictions:</span>
                <span className="font-mono">{credibility.stats.totalPredictions}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Score:</span>
                <span className="font-mono">{credibility.stats.averagePostScore}</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Score Trend */}
        <div className="space-y-2">
          <h4 className={cn(
            "text-sm font-medium",
            themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'
          )}>
            Score Trend (Last 4 Months)
          </h4>
          
          <div className="flex items-end gap-2 h-16">
            {credibility.scoreHistory.map((point, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(point.score / 100) * 100}%` }}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {point.date.toLocaleDateString('en-US', { month: 'short' })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t border-border">
          <Clock className="w-3 h-3" />
          <span>Updated {credibility.lastUpdated.toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCredibilityProfile;
