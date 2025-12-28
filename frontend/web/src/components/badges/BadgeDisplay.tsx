import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  Crown,
  Star,
  Zap,
  Shield,
  TrendingUp,
  Clock,
  Users,
  Trophy,
  MoreHorizontal,
} from "lucide-react";
import type { 
  UserBadge, 
  BadgeProgress, 
  BadgeType, 
  BadgeCategory,
  BadgeDisplaySettings 
} from "@/types/badges";
import { BADGE_DEFINITIONS, BADGE_CONFIG } from "@/data/badgeDefinitions";

interface BadgeDisplayProps {
  userBadges: UserBadge[];
  badgeProgress?: BadgeProgress[];
  variant?: "compact" | "profile" | "full" | "inline";
  maxDisplay?: number;
  showProgress?: boolean;
  showTooltip?: boolean;
  allowModal?: boolean;
  className?: string;
}

interface BadgeItemProps {
  badgeId: BadgeType;
  earnedAt?: Date;
  progress?: number;
  variant: "compact" | "profile" | "full" | "inline";
  showTooltip: boolean;
}

const BadgeItem: React.FC<BadgeItemProps> = ({
  badgeId,
  earnedAt,
  progress,
  variant,
  showTooltip,
}) => {
  const { themeMode } = useMoodTheme();
  const badge = BADGE_DEFINITIONS[badgeId];
  
  if (!badge) return null;

  const isEarned = !!earnedAt;
  const showProgress = !isEarned && progress !== undefined;

  const getRarityIcon = () => {
    switch (badge.rarity) {
      case "legendary":
        return <Crown className="w-3 h-3 text-yellow-500" />;
      case "epic":
        return <Award className="w-3 h-3 text-purple-500" />;
      case "rare":
        return <Star className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const getBadgeSize = () => {
    switch (variant) {
      case "compact":
      case "inline":
        return "h-5 w-5 text-xs";
      case "profile":
        return "h-6 w-6 text-sm";
      case "full":
        return "h-8 w-8 text-base";
      default:
        return "h-6 w-6 text-sm";
    }
  };

  const badgeContent = (
    <div className={cn(
      "relative inline-flex items-center justify-center rounded-full font-medium transition-all",
      getBadgeSize(),
      isEarned
        ? cn(
            "text-white shadow-sm",
            `bg-gradient-to-br from-current to-current/80`
          )
        : showProgress
        ? "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600",
      variant === "compact" && "border-2 border-white dark:border-gray-900"
    )}
    style={{
      backgroundColor: isEarned ? badge.color : undefined,
    }}
  >
    <span className="text-current">{badge.icon}</span>
    
    {badge.rarity !== "common" && variant !== "compact" && (
      <div className="absolute -top-1 -right-1">
        {getRarityIcon()}
      </div>
    )}
    
    {showProgress && (
      <div className="absolute inset-0 rounded-full border-2 border-gray-300 dark:border-gray-600">
        <div 
          className="h-full rounded-full border-2 border-blue-500 transition-all duration-300"
          style={{
            clipPath: `polygon(50% 50%, 50% 0%, ${50 + (progress || 0) * 50 / 100}% 0%, ${50 + (progress || 0) * 50 / 100}% 100%, 50% 100%)`
          }}
        />
      </div>
    )}
  </div>
  );

  const tooltipContent = (
    <div className="max-w-xs">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-semibold">{badge.name}</span>
        {getRarityIcon()}
      </div>
      <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
      <div className="text-xs">
        <div className="font-medium">Criteria:</div>
        <div className="text-muted-foreground">{badge.criteria}</div>
      </div>
      {earnedAt && (
        <div className="text-xs text-muted-foreground mt-1">
          Earned {earnedAt.toLocaleDateString()}
        </div>
      )}
      {showProgress && (
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      )}
    </div>
  );

  if (!showTooltip) {
    return badgeContent;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeContent}
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const BadgeModal: React.FC<{
  userBadges: UserBadge[];
  badgeProgress?: BadgeProgress[];
  children: React.ReactNode;
}> = ({ userBadges, badgeProgress, children }) => {
  const { themeMode } = useMoodTheme();
  
  const earnedBadges = userBadges.filter(ub => ub.isActive);
  const progressBadges = badgeProgress?.filter(bp => bp.progress > 0) || [];
  
  const badgesByCategory = Object.keys(BADGE_DEFINITIONS).reduce((acc, badgeId) => {
    const badge = BADGE_DEFINITIONS[badgeId as BadgeType];
    if (!badge.isVisible) return acc;
    
    if (!acc[badge.category]) {
      acc[badge.category] = [];
    }
    
    const userBadge = earnedBadges.find(ub => ub.badgeId === badgeId);
    const progress = progressBadges.find(bp => bp.badgeId === badgeId);
    
    acc[badge.category].push({
      ...badge,
      earned: !!userBadge,
      earnedAt: userBadge?.earnedAt,
      progress: progress?.progress,
    });
    
    return acc;
  }, {} as Record<string, any[]>);

  const getCategoryIcon = (category: BadgeCategory) => {
    switch (category) {
      case "credibility":
        return <Shield className="w-5 h-5" />;
      case "performance":
        return <TrendingUp className="w-5 h-5" />;
      case "community":
        return <Users className="w-5 h-5" />;
      case "moderation":
        return <Shield className="w-5 h-5" />;
      case "personality":
        return <Zap className="w-5 h-5" />;
      case "special":
        return <Trophy className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  const getCategoryTitle = (category: BadgeCategory) => {
    const titles = {
      credibility: "Trust & Accuracy",
      performance: "Trading Performance", 
      community: "Community Engagement",
      moderation: "Behavior & Safety",
      personality: "Trading Style",
      special: "Special Recognition"
    };
    return titles[category] || category;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Badge Collection
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{earnedBadges.length}</div>
              <div className="text-sm text-muted-foreground">Badges Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{progressBadges.length}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {earnedBadges.reduce((score, ub) => {
                  const badge = BADGE_DEFINITIONS[ub.badgeId];
                  return score + (badge ? BADGE_CONFIG.RARITY_SCORES[badge.rarity] : 0);
                }, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Badge Score</div>
            </div>
          </div>

          <Separator />

          {/* Badges by Category */}
          {Object.entries(badgesByCategory).map(([category, badges]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2">
                {getCategoryIcon(category as BadgeCategory)}
                <h3 className="text-lg font-semibold">
                  {getCategoryTitle(category as BadgeCategory)}
                </h3>
                <Badge variant="outline" className="ml-auto">
                  {badges.filter(b => b.earned).length}/{badges.length}
                </Badge>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {badges.map((badge) => (
                  <div 
                    key={badge.id}
                    className={cn(
                      "p-3 rounded-lg border text-center transition-all",
                      badge.earned
                        ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                        : badge.progress
                        ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                        : "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/20"
                    )}
                  >
                    <div className="flex justify-center mb-2">
                      <BadgeItem
                        badgeId={badge.id}
                        earnedAt={badge.earnedAt}
                        progress={badge.progress}
                        variant="full"
                        showTooltip={false}
                      />
                    </div>
                    <div className="text-sm font-medium">{badge.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {badge.description}
                    </div>
                    {badge.progress && !badge.earned && (
                      <div className="mt-2">
                        <Progress value={badge.progress} className="h-1" />
                        <div className="text-xs text-muted-foreground mt-1">
                          {badge.progress}% complete
                        </div>
                      </div>
                    )}
                    {badge.earned && badge.earnedAt && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {badge.earnedAt.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  userBadges,
  badgeProgress = [],
  variant = "compact",
  maxDisplay,
  showProgress = false,
  showTooltip = true,
  allowModal = false,
  className,
}) => {
  const activeBadges = userBadges.filter(ub => ub.isActive);
  const displayLimit = maxDisplay || (variant === "compact" ? BADGE_CONFIG.MAX_COMPACT_BADGES : BADGE_CONFIG.MAX_PROFILE_BADGES);
  
  // Sort badges by rarity and earned date
  const sortedBadges = activeBadges
    .map(ub => ({
      ...ub,
      definition: BADGE_DEFINITIONS[ub.badgeId],
    }))
    .filter(ub => ub.definition?.isVisible)
    .sort((a, b) => {
      // Sort by rarity score (legendary first) then by earned date (newest first)
      const rarityDiff = BADGE_CONFIG.RARITY_SCORES[b.definition.rarity] - BADGE_CONFIG.RARITY_SCORES[a.definition.rarity];
      if (rarityDiff !== 0) return rarityDiff;
      return b.earnedAt.getTime() - a.earnedAt.getTime();
    });

  const displayBadges = sortedBadges.slice(0, displayLimit);
  const remainingCount = Math.max(0, sortedBadges.length - displayLimit);

  // Progress badges to show (if enabled)
  const progressToShow = showProgress 
    ? badgeProgress.filter(bp => bp.progress > 0 && bp.progress < 100).slice(0, 2)
    : [];

  if (displayBadges.length === 0 && progressToShow.length === 0) {
    return null;
  }

  const badgeElements = (
    <div className={cn(
      "flex items-center gap-1",
      variant === "full" && "gap-2",
      className
    )}>
      {/* Earned badges */}
      {displayBadges.map((userBadge) => (
        <BadgeItem
          key={userBadge.badgeId}
          badgeId={userBadge.badgeId}
          earnedAt={userBadge.earnedAt}
          variant={variant}
          showTooltip={showTooltip}
        />
      ))}
      
      {/* Progress badges */}
      {progressToShow.map((progress) => (
        <BadgeItem
          key={progress.badgeId}
          badgeId={progress.badgeId}
          progress={progress.progress}
          variant={variant}
          showTooltip={showTooltip}
        />
      ))}
      
      {/* Remaining count indicator */}
      {remainingCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(
                "flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium",
                variant === "compact" ? "h-5 w-5 text-xs" : "h-6 w-6 text-sm"
              )}>
                +{remainingCount}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{remainingCount} more badges</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );

  if (allowModal && (sortedBadges.length > displayLimit || progressToShow.length > 0)) {
    return (
      <BadgeModal userBadges={userBadges} badgeProgress={badgeProgress}>
        {badgeElements}
      </BadgeModal>
    );
  }

  return badgeElements;
};

export default BadgeDisplay;
