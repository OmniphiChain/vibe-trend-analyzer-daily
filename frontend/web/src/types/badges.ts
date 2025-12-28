// Comprehensive Badge System for MoodMeter

export type BadgeCategory = 
  | "credibility" 
  | "performance" 
  | "community" 
  | "moderation" 
  | "personality" 
  | "special";

export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

export type BadgeType = 
  // Credibility-based badges
  | "trusted_contributor" 
  | "verified_insights" 
  | "smart_takes" 
  | "fact_checked"
  // Performance-based badges
  | "top_predictor" 
  | "mood_forecaster" 
  | "trade_signal_pro"
  | "accuracy_master"
  // Community-based badges
  | "trending_voice" 
  | "engagement_hero" 
  | "mood_mentor"
  | "community_champion"
  // Moderation badges
  | "flagged_content" 
  | "under_review" 
  | "new_voice"
  | "trusted_reporter"
  // Personality badges
  | "bullish_beast" 
  | "bear_watcher" 
  | "diamond_hands" 
  | "momentum_junkie" 
  | "meme_lord"
  // Special badges
  | "early_adopter"
  | "beta_tester"
  | "premium_member"
  | "verified_trader";

export interface BadgeDefinition {
  id: BadgeType;
  name: string;
  description: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  icon: string; // Emoji or icon identifier
  color: string; // Hex color
  backgroundColor?: string;
  criteria: string;
  requirements: BadgeRequirements;
  isVisible: boolean; // Some badges might be hidden (like moderation warnings)
  order: number; // Display order within category
}

export interface BadgeRequirements {
  // Credibility requirements
  minCredibilityScore?: number;
  minVerifiedPosts?: number;
  minSourcedPosts?: number;
  minAccuracyRate?: number;
  
  // Activity requirements
  minPosts?: number;
  minDaysActive?: number;
  minComments?: number;
  minLikes?: number;
  
  // Community requirements
  minFollowers?: number;
  minEngagementRate?: number;
  minHelpfulVotes?: number;
  
  // Performance requirements
  minPredictions?: number;
  minSuccessfulSignals?: number;
  minTrendingPosts?: number;
  
  // Moderation requirements
  maxFlags?: number;
  maxWarnings?: number;
  
  // Time-based requirements
  timeframe?: "daily" | "weekly" | "monthly" | "all_time";
  
  // Special requirements
  customLogic?: string; // For complex badge logic
}

export interface UserBadge {
  badgeId: BadgeType;
  userId: string;
  earnedAt: Date;
  progress?: number; // 0-100 for badges in progress
  isActive: boolean;
  metadata?: {
    triggerValue?: number; // The value that triggered earning this badge
    context?: string; // Additional context about how it was earned
    expiresAt?: Date; // For temporary badges
  };
}

export interface BadgeProgress {
  badgeId: BadgeType;
  userId: string;
  progress: number; // 0-100
  currentValue: number;
  targetValue: number;
  lastUpdated: Date;
  isCloseToEarning: boolean; // True if progress > 80%
}

export interface BadgeStats {
  userId: string;
  totalBadges: number;
  badgesByCategory: Record<BadgeCategory, number>;
  badgesByRarity: Record<BadgeRarity, number>;
  recentBadges: UserBadge[];
  progressBadges: BadgeProgress[];
  badgeScore: number; // Calculated score based on badge rarity and quantity
  rank: number; // User's rank based on badge score
}

export interface BadgeNotification {
  id: string;
  userId: string;
  badgeId: BadgeType;
  type: "earned" | "progress" | "milestone";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  metadata?: {
    progress?: number;
    milestone?: string;
  };
}

// Badge achievement contexts
export interface BadgeContext {
  postId?: string;
  predictionId?: string;
  commentId?: string;
  achievementType: "post" | "prediction" | "engagement" | "community" | "moderation";
  details: Record<string, any>;
}

// Badge display preferences
export interface BadgeDisplaySettings {
  userId: string;
  maxVisibleBadges: number; // How many badges to show next to username
  preferredCategories: BadgeCategory[]; // Which categories to prioritize
  showRareBadgesFirst: boolean;
  showProgressBadges: boolean;
  hidePersonalityBadges: boolean;
  hideModerationBadges: boolean;
}

// Leaderboard integration
export interface BadgeLeaderboard {
  period: "daily" | "weekly" | "monthly" | "all_time";
  topUsers: Array<{
    userId: string;
    username: string;
    avatar?: string;
    badgeScore: number;
    recentBadges: BadgeType[];
    rank: number;
  }>;
  generatedAt: Date;
}

// Export utility types
export type BadgeFilterOptions = {
  category?: BadgeCategory[];
  rarity?: BadgeRarity[];
  earned?: boolean;
  inProgress?: boolean;
  sortBy?: "earned_date" | "rarity" | "category" | "progress";
  sortOrder?: "asc" | "desc";
};

export type BadgeEarnEvent = {
  userId: string;
  badgeId: BadgeType;
  context: BadgeContext;
  timestamp: Date;
  notifyUser: boolean;
};
