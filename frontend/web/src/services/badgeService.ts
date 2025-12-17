// Badge System Service for MoodMeter

import type { 
  UserBadge, 
  BadgeProgress, 
  BadgeType, 
  BadgeEarnEvent,
  BadgeContext,
  BadgeStats,
  BadgeNotification
} from "@/types/badges";
import { BADGE_DEFINITIONS, BADGE_CONFIG } from "@/data/badgeDefinitions";
import type { SocialPost } from "@/types/social";
import type { PostCredibility } from "@/types/moderation";

interface UserMetrics {
  totalPosts: number;
  verifiedPosts: number;
  sourcedPosts: number;
  averageCredibilityScore: number;
  totalLikes: number;
  totalComments: number;
  engagementRate: number;
  predictions: number;
  successfulPredictions: number;
  accuracyRate: number;
  trendingPosts: number;
  flagsReceived: number;
  helpfulVotes: number;
  daysActive: number;
  sentimentDistribution: {
    bullish: number;
    bearish: number;
    neutral: number;
  };
}

class BadgeService {
  private userBadges = new Map<string, UserBadge[]>();
  private userProgress = new Map<string, BadgeProgress[]>();
  private userMetrics = new Map<string, UserMetrics>();

  /**
   * Initialize user metrics and badges
   */
  async initializeUser(userId: string): Promise<void> {
    if (!this.userMetrics.has(userId)) {
      this.userMetrics.set(userId, {
        totalPosts: 0,
        verifiedPosts: 0,
        sourcedPosts: 0,
        averageCredibilityScore: 50,
        totalLikes: 0,
        totalComments: 0,
        engagementRate: 0,
        predictions: 0,
        successfulPredictions: 0,
        accuracyRate: 0,
        trendingPosts: 0,
        flagsReceived: 0,
        helpfulVotes: 0,
        daysActive: 1,
        sentimentDistribution: { bullish: 0, bearish: 0, neutral: 0 }
      });
    }

    if (!this.userBadges.has(userId)) {
      this.userBadges.set(userId, []);
      // Give new users the "new_voice" badge
      await this.awardBadge(userId, "new_voice", {
        achievementType: "community",
        details: { reason: "new_user" }
      });
    }

    if (!this.userProgress.has(userId)) {
      this.userProgress.set(userId, []);
    }
  }

  /**
   * Update user metrics after a post
   */
  async updateUserMetrics(
    userId: string, 
    post: SocialPost, 
    credibility?: PostCredibility
  ): Promise<BadgeEarnEvent[]> {
    await this.initializeUser(userId);
    
    const metrics = this.userMetrics.get(userId)!;
    const events: BadgeEarnEvent[] = [];

    // Update basic metrics
    metrics.totalPosts++;
    if (credibility) {
      if (credibility.score >= 70) metrics.verifiedPosts++;
      if (credibility.factors.hasSourceLinks) metrics.sourcedPosts++;
      
      // Update average credibility
      metrics.averageCredibilityScore = 
        (metrics.averageCredibilityScore * (metrics.totalPosts - 1) + credibility.score) / metrics.totalPosts;
    }

    // Update sentiment distribution
    if (post.sentiment) {
      metrics.sentimentDistribution[post.sentiment]++;
    }

    // Update engagement (mock - would come from real data)
    metrics.totalLikes += post.likes || 0;
    metrics.totalComments += post.comments || 0;
    metrics.engagementRate = metrics.totalPosts > 0 
      ? ((metrics.totalLikes + metrics.totalComments) / metrics.totalPosts) 
      : 0;

    // Check for badge earnings
    events.push(...await this.checkBadgeEarnings(userId, {
      achievementType: "post",
      details: { postId: post.id, credibilityScore: credibility?.score }
    }));

    return events;
  }

  /**
   * Award a badge to a user
   */
  async awardBadge(
    userId: string, 
    badgeId: BadgeType, 
    context: BadgeContext
  ): Promise<UserBadge> {
    const userBadges = this.userBadges.get(userId) || [];
    
    // Check if user already has this badge
    const existingBadge = userBadges.find(badge => badge.badgeId === badgeId);
    if (existingBadge && existingBadge.isActive) {
      return existingBadge;
    }

    const newBadge: UserBadge = {
      badgeId,
      userId,
      earnedAt: new Date(),
      isActive: true,
      metadata: {
        context: JSON.stringify(context),
        triggerValue: context.details?.triggerValue
      }
    };

    userBadges.push(newBadge);
    this.userBadges.set(userId, userBadges);

    // Remove from progress tracking
    const progress = this.userProgress.get(userId) || [];
    this.userProgress.set(userId, progress.filter(p => p.badgeId !== badgeId));

    // Create notification (mock)
    await this.createBadgeNotification(userId, badgeId, "earned");

    return newBadge;
  }

  /**
   * Check if user qualifies for any badges
   */
  private async checkBadgeEarnings(
    userId: string, 
    context: BadgeContext
  ): Promise<BadgeEarnEvent[]> {
    const metrics = this.userMetrics.get(userId)!;
    const userBadges = this.userBadges.get(userId) || [];
    const earnedBadgeIds = new Set(userBadges.map(b => b.badgeId));
    const events: BadgeEarnEvent[] = [];

    // Check each badge definition
    for (const [badgeId, definition] of Object.entries(BADGE_DEFINITIONS)) {
      if (earnedBadgeIds.has(badgeId as BadgeType)) continue;

      const qualified = this.checkBadgeRequirements(metrics, definition.requirements);
      
      if (qualified) {
        const badge = await this.awardBadge(userId, badgeId as BadgeType, context);
        events.push({
          userId,
          badgeId: badgeId as BadgeType,
          context,
          timestamp: new Date(),
          notifyUser: true
        });
      } else {
        // Update progress
        const progress = this.calculateBadgeProgress(metrics, definition.requirements);
        if (progress > 0) {
          await this.updateBadgeProgress(userId, badgeId as BadgeType, progress);
        }
      }
    }

    return events;
  }

  /**
   * Check if user meets badge requirements
   */
  private checkBadgeRequirements(
    metrics: UserMetrics, 
    requirements: any
  ): boolean {
    // Credibility requirements
    if (requirements.minCredibilityScore && metrics.averageCredibilityScore < requirements.minCredibilityScore) {
      return false;
    }

    if (requirements.minVerifiedPosts && metrics.verifiedPosts < requirements.minVerifiedPosts) {
      return false;
    }

    if (requirements.minSourcedPosts && metrics.sourcedPosts < requirements.minSourcedPosts) {
      return false;
    }

    if (requirements.minAccuracyRate && metrics.accuracyRate < requirements.minAccuracyRate) {
      return false;
    }

    // Activity requirements
    if (requirements.minPosts && metrics.totalPosts < requirements.minPosts) {
      return false;
    }

    if (requirements.minLikes && metrics.totalLikes < requirements.minLikes) {
      return false;
    }

    if (requirements.minEngagementRate && metrics.engagementRate < requirements.minEngagementRate) {
      return false;
    }

    // Performance requirements
    if (requirements.minPredictions && metrics.predictions < requirements.minPredictions) {
      return false;
    }

    if (requirements.minTrendingPosts && metrics.trendingPosts < requirements.minTrendingPosts) {
      return false;
    }

    // Special logic checks
    if (requirements.customLogic) {
      return this.checkCustomLogic(requirements.customLogic, metrics);
    }

    return true;
  }

  /**
   * Calculate progress towards badge
   */
  private calculateBadgeProgress(
    metrics: UserMetrics, 
    requirements: any
  ): number {
    const factors: number[] = [];

    // Check each requirement and calculate progress
    if (requirements.minCredibilityScore) {
      factors.push(Math.min(100, (metrics.averageCredibilityScore / requirements.minCredibilityScore) * 100));
    }

    if (requirements.minVerifiedPosts) {
      factors.push(Math.min(100, (metrics.verifiedPosts / requirements.minVerifiedPosts) * 100));
    }

    if (requirements.minPosts) {
      factors.push(Math.min(100, (metrics.totalPosts / requirements.minPosts) * 100));
    }

    if (requirements.minAccuracyRate) {
      factors.push(Math.min(100, (metrics.accuracyRate / requirements.minAccuracyRate) * 100));
    }

    if (requirements.minEngagementRate) {
      factors.push(Math.min(100, (metrics.engagementRate / requirements.minEngagementRate) * 100));
    }

    if (factors.length === 0) return 0;

    // Return minimum progress (all requirements must be met)
    return Math.min(...factors);
  }

  /**
   * Handle custom badge logic
   */
  private checkCustomLogic(logic: string, metrics: UserMetrics): boolean {
    switch (logic) {
      case "bullish_sentiment_80":
        const totalSentiment = Object.values(metrics.sentimentDistribution).reduce((a, b) => a + b, 0);
        return totalSentiment > 0 && (metrics.sentimentDistribution.bullish / totalSentiment) >= 0.8;
      
      case "bearish_sentiment_70":
        const totalSentiment2 = Object.values(metrics.sentimentDistribution).reduce((a, b) => a + b, 0);
        return totalSentiment2 > 0 && (metrics.sentimentDistribution.bearish / totalSentiment2) >= 0.7;
      
      case "content_flagged":
        return metrics.flagsReceived > 0;
      
      case "multiple_flags":
        return metrics.flagsReceived >= 3;
      
      default:
        return false;
    }
  }

  /**
   * Update badge progress
   */
  private async updateBadgeProgress(
    userId: string, 
    badgeId: BadgeType, 
    progress: number
  ): Promise<void> {
    const userProgress = this.userProgress.get(userId) || [];
    const existingProgress = userProgress.find(p => p.badgeId === badgeId);

    if (existingProgress) {
      const oldProgress = existingProgress.progress;
      existingProgress.progress = progress;
      existingProgress.lastUpdated = new Date();
      existingProgress.isCloseToEarning = progress >= 80;

      // Check for progress milestones
      for (const threshold of BADGE_CONFIG.PROGRESS_THRESHOLDS) {
        if (oldProgress < threshold && progress >= threshold) {
          await this.createBadgeNotification(userId, badgeId, "progress", { progress });
        }
      }
    } else {
      const newProgress: BadgeProgress = {
        badgeId,
        userId,
        progress,
        currentValue: 0, // Would be calculated based on requirements
        targetValue: 100,
        lastUpdated: new Date(),
        isCloseToEarning: progress >= 80
      };
      userProgress.push(newProgress);
    }

    this.userProgress.set(userId, userProgress);
  }

  /**
   * Create badge notification
   */
  private async createBadgeNotification(
    userId: string, 
    badgeId: BadgeType, 
    type: "earned" | "progress",
    metadata?: any
  ): Promise<void> {
    const badge = BADGE_DEFINITIONS[badgeId];
    if (!badge) return;

    const notification: BadgeNotification = {
      id: `badge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      badgeId,
      type,
      title: type === "earned" ? `Badge Earned: ${badge.name}!` : `Progress: ${badge.name}`,
      message: type === "earned" 
        ? `Congratulations! You've earned the "${badge.name}" badge.`
        : `You're ${metadata?.progress}% towards earning "${badge.name}"`,
      isRead: false,
      createdAt: new Date(),
      metadata
    };

    // In a real app, this would be sent to the notification system
    console.log("Badge notification:", notification);
  }

  /**
   * Get user badges
   */
  async getUserBadges(userId: string): Promise<UserBadge[]> {
    await this.initializeUser(userId);
    return this.userBadges.get(userId) || [];
  }

  /**
   * Get user badge progress
   */
  async getUserProgress(userId: string): Promise<BadgeProgress[]> {
    await this.initializeUser(userId);
    return this.userProgress.get(userId) || [];
  }

  /**
   * Get user badge stats
   */
  async getUserStats(userId: string): Promise<BadgeStats> {
    const badges = await this.getUserBadges(userId);
    const progress = await this.getUserProgress(userId);
    
    const activeBadges = badges.filter(b => b.isActive);
    const badgesByCategory = activeBadges.reduce((acc, badge) => {
      const def = BADGE_DEFINITIONS[badge.badgeId];
      if (def) {
        acc[def.category] = (acc[def.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const badgesByRarity = activeBadges.reduce((acc, badge) => {
      const def = BADGE_DEFINITIONS[badge.badgeId];
      if (def) {
        acc[def.rarity] = (acc[def.rarity] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const badgeScore = activeBadges.reduce((score, badge) => {
      const def = BADGE_DEFINITIONS[badge.badgeId];
      return score + (def ? BADGE_CONFIG.RARITY_SCORES[def.rarity] : 0);
    }, 0);

    return {
      userId,
      totalBadges: activeBadges.length,
      badgesByCategory: badgesByCategory as any,
      badgesByRarity: badgesByRarity as any,
      recentBadges: activeBadges
        .sort((a, b) => b.earnedAt.getTime() - a.earnedAt.getTime())
        .slice(0, 5),
      progressBadges: progress.filter(p => p.isCloseToEarning),
      badgeScore,
      rank: 1 // Would be calculated from leaderboard
    };
  }

  /**
   * Get badge definition (for testing)
   */
  getBadgeDefinition(badgeType: BadgeType) {
    return BADGE_DEFINITIONS[badgeType];
  }

  /**
   * Check if user is eligible for a badge (for testing)
   */
  checkBadgeEligibility(badgeType: BadgeType, userMetrics: {
    id: string;
    credibilityScore: number;
    postsCount: number;
    verifiedPosts: number;
    helpfulFlags: number;
    communityEngagement: number;
  }): boolean {
    const definition = BADGE_DEFINITIONS[badgeType];
    if (!definition) return false;

    const requirements = definition.requirements;

    // Check credibility requirements
    if (requirements.minCredibilityScore && userMetrics.credibilityScore < requirements.minCredibilityScore) {
      return false;
    }

    // Check post requirements
    if (requirements.minPosts && userMetrics.postsCount < requirements.minPosts) {
      return false;
    }

    if (requirements.minVerifiedPosts && userMetrics.verifiedPosts < requirements.minVerifiedPosts) {
      return false;
    }

    // Check engagement requirements
    if (requirements.minEngagement && userMetrics.communityEngagement < requirements.minEngagement) {
      return false;
    }

    // Check helpful flags for moderation badges
    if (requirements.minHelpfulFlags && userMetrics.helpfulFlags < requirements.minHelpfulFlags) {
      return false;
    }

    return true;
  }

  /**
   * Simulate earning badges for demo/testing
   */
  async simulateUserActivity(userId: string): Promise<void> {
    await this.initializeUser(userId);
    
    const metrics = this.userMetrics.get(userId)!;
    
    // Simulate some activity
    metrics.totalPosts = Math.floor(Math.random() * 50) + 10;
    metrics.verifiedPosts = Math.floor(metrics.totalPosts * 0.6);
    metrics.sourcedPosts = Math.floor(metrics.totalPosts * 0.4);
    metrics.averageCredibilityScore = Math.floor(Math.random() * 40) + 60;
    metrics.totalLikes = Math.floor(Math.random() * 500) + 100;
    metrics.engagementRate = Math.floor(Math.random() * 50) + 50;
    metrics.predictions = Math.floor(Math.random() * 20) + 5;
    metrics.successfulPredictions = Math.floor(metrics.predictions * 0.7);
    metrics.accuracyRate = metrics.predictions > 0 
      ? (metrics.successfulPredictions / metrics.predictions) * 100 
      : 0;
    metrics.trendingPosts = Math.floor(Math.random() * 5);
    metrics.daysActive = Math.floor(Math.random() * 100) + 30;
    
    // Simulate sentiment distribution
    const bullishBias = Math.random() > 0.5;
    if (bullishBias) {
      metrics.sentimentDistribution.bullish = Math.floor(metrics.totalPosts * 0.6);
      metrics.sentimentDistribution.bearish = Math.floor(metrics.totalPosts * 0.2);
      metrics.sentimentDistribution.neutral = metrics.totalPosts - 
        metrics.sentimentDistribution.bullish - metrics.sentimentDistribution.bearish;
    } else {
      metrics.sentimentDistribution.bearish = Math.floor(metrics.totalPosts * 0.5);
      metrics.sentimentDistribution.bullish = Math.floor(metrics.totalPosts * 0.3);
      metrics.sentimentDistribution.neutral = metrics.totalPosts - 
        metrics.sentimentDistribution.bullish - metrics.sentimentDistribution.bearish;
    }

    // Check for earned badges
    await this.checkBadgeEarnings(userId, {
      achievementType: "community",
      details: { reason: "simulation" }
    });
  }
}

// Export singleton instance
export const badgeService = new BadgeService();

// Mock data generator for demo
export const generateMockUserBadges = (userId: string): UserBadge[] => {
  const mockBadges: BadgeType[] = [
    "trusted_contributor",
    "verified_insights", 
    "bullish_beast",
    "new_voice",
    "premium_member"
  ];

  return mockBadges.map((badgeId, index) => ({
    badgeId,
    userId,
    earnedAt: new Date(Date.now() - (index * 7 * 24 * 60 * 60 * 1000)), // Earned over past weeks
    isActive: true,
    metadata: {
      triggerValue: Math.floor(Math.random() * 100) + 50,
      context: "mock_data"
    }
  }));
};

export const generateMockBadgeProgress = (userId: string): BadgeProgress[] => {
  const progressBadges: BadgeType[] = [
    "mood_forecaster",
    "top_predictor",
    "engagement_hero"
  ];

  return progressBadges.map(badgeId => ({
    badgeId,
    userId,
    progress: Math.floor(Math.random() * 60) + 20, // 20-80% progress
    currentValue: Math.floor(Math.random() * 80) + 10,
    targetValue: 100,
    lastUpdated: new Date(),
    isCloseToEarning: Math.random() > 0.7
  }));
};
