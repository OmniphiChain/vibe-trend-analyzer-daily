// Badge System Configuration for MoodMeter

import type { BadgeDefinition, BadgeType } from "@/types/badges";

export const BADGE_DEFINITIONS: Record<BadgeType, BadgeDefinition> = {
  // CREDIBILITY-BASED BADGES
  trusted_contributor: {
    id: "trusted_contributor",
    name: "Trusted Contributor",
    description: "Consistently provides high-quality, verified content with 80+ credibility score",
    category: "credibility",
    rarity: "epic",
    icon: "✅",
    color: "#10B981",
    backgroundColor: "#ECFDF5",
    criteria: "Maintain 80+ average credibility score across 10+ posts",
    requirements: {
      minCredibilityScore: 80,
      minVerifiedPosts: 10,
      timeframe: "all_time"
    },
    isVisible: true,
    order: 1
  },

  verified_insights: {
    id: "verified_insights",
    name: "Data-Driven Analyst",
    description: "Posts consistently include charts, sources, or data-backed analysis",
    category: "credibility",
    rarity: "rare",
    icon: "📊",
    color: "#3B82F6",
    backgroundColor: "#EFF6FF",
    criteria: "Include sources or data in 80% of posts (min 5 posts)",
    requirements: {
      minSourcedPosts: 5,
      minAccuracyRate: 80,
      timeframe: "monthly"
    },
    isVisible: true,
    order: 2
  },

  smart_takes: {
    id: "smart_takes",
    name: "Thoughtful Voice",
    description: "High-quality long-form commentary that drives meaningful discussion",
    category: "credibility",
    rarity: "rare",
    icon: "🤔",
    color: "#8B5CF6",
    backgroundColor: "#F5F3FF",
    criteria: "Post 5+ high-engagement long-form analyses per week",
    requirements: {
      minPosts: 5,
      minEngagementRate: 70,
      timeframe: "weekly"
    },
    isVisible: true,
    order: 3
  },

  fact_checked: {
    id: "fact_checked",
    name: "AI-Verified Expert",
    description: "Posts have been AI-reviewed and confirmed with 90%+ factual accuracy",
    category: "credibility",
    rarity: "legendary",
    icon: "🔍",
    color: "#059669",
    backgroundColor: "#ECFDF5",
    criteria: "Achieve 90%+ AI verification score across 15+ posts",
    requirements: {
      minVerifiedPosts: 15,
      minAccuracyRate: 90,
      timeframe: "all_time"
    },
    isVisible: true,
    order: 4
  },

  // PERFORMANCE-BASED BADGES
  top_predictor: {
    id: "top_predictor",
    name: "Market Oracle",
    description: "5+ predictions with >70% accuracy tracked against real market movement",
    category: "performance",
    rarity: "epic",
    icon: "🚀",
    color: "#DC2626",
    backgroundColor: "#FEF2F2",
    criteria: "Make 5+ predictions with 70%+ accuracy rate",
    requirements: {
      minPredictions: 5,
      minAccuracyRate: 70,
      timeframe: "monthly"
    },
    isVisible: true,
    order: 1
  },

  mood_forecaster: {
    id: "mood_forecaster",
    name: "Sentiment Seer",
    description: "Consistently predicts market mood shifts before they happen",
    category: "performance",
    rarity: "epic",
    icon: "🧠",
    color: "#7C3AED",
    backgroundColor: "#F5F3FF",
    criteria: "Predict mood changes with 75%+ accuracy (10+ predictions)",
    requirements: {
      minPredictions: 10,
      minAccuracyRate: 75,
      customLogic: "mood_prediction_accuracy"
    },
    isVisible: true,
    order: 2
  },

  trade_signal_pro: {
    id: "trade_signal_pro",
    name: "Signal Master",
    description: "3+ AI-approved trade signals that hit their targets",
    category: "performance",
    rarity: "rare",
    icon: "🎯",
    color: "#059669",
    backgroundColor: "#ECFDF5",
    criteria: "Generate 3+ successful trade signals verified by AI",
    requirements: {
      minSuccessfulSignals: 3,
      minAccuracyRate: 80,
      timeframe: "monthly"
    },
    isVisible: true,
    order: 3
  },

  accuracy_master: {
    id: "accuracy_master",
    name: "Precision Trader",
    description: "Maintains exceptional accuracy across all predictions and signals",
    category: "performance",
    rarity: "legendary",
    icon: "🏆",
    color: "#F59E0B",
    backgroundColor: "#FFFBEB",
    criteria: "Maintain 85%+ accuracy across 20+ predictions/signals",
    requirements: {
      minPredictions: 20,
      minAccuracyRate: 85,
      timeframe: "all_time"
    },
    isVisible: true,
    order: 4
  },

  // COMMUNITY-BASED BADGES
  trending_voice: {
    id: "trending_voice",
    name: "Viral Creator",
    description: "Posts frequently trend and reach the top of community discussions",
    category: "community",
    rarity: "rare",
    icon: "🔥",
    color: "#DC2626",
    backgroundColor: "#FEF2F2",
    criteria: "Have 3+ posts reach trending status in a month",
    requirements: {
      minTrendingPosts: 3,
      timeframe: "monthly"
    },
    isVisible: true,
    order: 1
  },

  engagement_hero: {
    id: "engagement_hero",
    name: "Community Champion",
    description: "Exceptional engagement rates and meaningful interactions",
    category: "community",
    rarity: "rare",
    icon: "💬",
    color: "#3B82F6",
    backgroundColor: "#EFF6FF",
    criteria: "Maintain 80%+ engagement rate with 50+ interactions weekly",
    requirements: {
      minEngagementRate: 80,
      minComments: 50,
      timeframe: "weekly"
    },
    isVisible: true,
    order: 2
  },

  mood_mentor: {
    id: "mood_mentor",
    name: "Guiding Light",
    description: "Frequently helps newcomers and answers community questions",
    category: "community",
    rarity: "epic",
    icon: "🌐",
    color: "#059669",
    backgroundColor: "#ECFDF5",
    criteria: "Help 10+ new users with 90%+ helpful rating",
    requirements: {
      minHelpfulVotes: 90,
      customLogic: "mentor_activity",
      timeframe: "monthly"
    },
    isVisible: true,
    order: 3
  },

  community_champion: {
    id: "community_champion",
    name: "MoodMeter MVP",
    description: "Outstanding overall contribution to the community",
    category: "community",
    rarity: "legendary",
    icon: "👑",
    color: "#F59E0B",
    backgroundColor: "#FFFBEB",
    criteria: "Top 1% community contributor with 1000+ positive interactions",
    requirements: {
      minLikes: 1000,
      minEngagementRate: 85,
      customLogic: "top_contributor",
      timeframe: "all_time"
    },
    isVisible: true,
    order: 4
  },

  // MODERATION BADGES (some hidden)
  flagged_content: {
    id: "flagged_content",
    name: "Under Review",
    description: "Content has been flagged and is pending moderation review",
    category: "moderation",
    rarity: "common",
    icon: "🚩",
    color: "#DC2626",
    backgroundColor: "#FEF2F2",
    criteria: "Automatic when content is flagged",
    requirements: {
      customLogic: "content_flagged"
    },
    isVisible: false, // Hidden badge for moderation purposes
    order: 1
  },

  under_review: {
    id: "under_review",
    name: "Account Warning",
    description: "Multiple posts flagged or under moderator review",
    category: "moderation",
    rarity: "common",
    icon: "🛠️",
    color: "#F59E0B",
    backgroundColor: "#FFFBEB",
    criteria: "Automatic when account is flagged multiple times",
    requirements: {
      maxFlags: 0, // Inverse requirement
      customLogic: "multiple_flags"
    },
    isVisible: false,
    order: 2
  },

  new_voice: {
    id: "new_voice",
    name: "Fresh Perspective",
    description: "New to MoodMeter community - account less than 7 days",
    category: "moderation",
    rarity: "common",
    icon: "🧪",
    color: "#6B7280",
    backgroundColor: "#F9FAFB",
    criteria: "Account age less than 7 days or fewer than 3 posts",
    requirements: {
      maxDaysActive: 7,
      maxPosts: 3
    },
    isVisible: true,
    order: 3
  },

  trusted_reporter: {
    id: "trusted_reporter",
    name: "Community Guardian",
    description: "Accurately reports inappropriate content and helps moderate",
    category: "moderation",
    rarity: "rare",
    icon: "🛡️",
    color: "#059669",
    backgroundColor: "#ECFDF5",
    criteria: "Submit 10+ accurate content reports with 90%+ success rate",
    requirements: {
      customLogic: "accurate_reporting",
      minAccuracyRate: 90,
      timeframe: "all_time"
    },
    isVisible: true,
    order: 4
  },

  // PERSONALITY BADGES
  bullish_beast: {
    id: "bullish_beast",
    name: "The Bull",
    description: "Consistently optimistic about market trends and opportunities",
    category: "personality",
    rarity: "common",
    icon: "🐂",
    color: "#059669",
    backgroundColor: "#ECFDF5",
    criteria: "80%+ bullish sentiment in posts (min 10 posts)",
    requirements: {
      minPosts: 10,
      customLogic: "bullish_sentiment_80"
    },
    isVisible: true,
    order: 1
  },

  bear_watcher: {
    id: "bear_watcher",
    name: "The Bear",
    description: "Frequently posts cautious or bearish market analysis",
    category: "personality",
    rarity: "common",
    icon: "🐻",
    color: "#DC2626",
    backgroundColor: "#FEF2F2",
    criteria: "70%+ bearish/cautious sentiment in posts (min 10 posts)",
    requirements: {
      minPosts: 10,
      customLogic: "bearish_sentiment_70"
    },
    isVisible: true,
    order: 2
  },

  diamond_hands: {
    id: "diamond_hands",
    name: "Unshaken",
    description: "Known for long-term conviction and diamond-hand mentality",
    category: "personality",
    rarity: "rare",
    icon: "💎",
    color: "#3B82F6",
    backgroundColor: "#EFF6FF",
    criteria: "Consistently advocates for long-term holds (diamond hands content)",
    requirements: {
      customLogic: "diamond_hands_content",
      minPosts: 5,
      timeframe: "monthly"
    },
    isVisible: true,
    order: 3
  },

  momentum_junkie: {
    id: "momentum_junkie",
    name: "Speed Demon",
    description: "Focuses on high-volatility, short-term momentum trades",
    category: "personality",
    rarity: "common",
    icon: "🧃",
    color: "#F59E0B",
    backgroundColor: "#FFFBEB",
    criteria: "Frequently posts about day trading and momentum plays",
    requirements: {
      customLogic: "momentum_trading_content",
      minPosts: 8,
      timeframe: "monthly"
    },
    isVisible: true,
    order: 4
  },

  meme_lord: {
    id: "meme_lord",
    name: "Meme Machine",
    description: "Consistently creates viral and funny market-related content",
    category: "personality",
    rarity: "rare",
    icon: "🐸",
    color: "#8B5CF6",
    backgroundColor: "#F5F3FF",
    criteria: "Create highly-engaged meme content (high like/comment ratio)",
    requirements: {
      customLogic: "meme_content_engagement",
      minEngagementRate: 85,
      timeframe: "monthly"
    },
    isVisible: true,
    order: 5
  },

  // SPECIAL BADGES
  early_adopter: {
    id: "early_adopter",
    name: "Pioneer",
    description: "One of the first 1000 users to join MoodMeter",
    category: "special",
    rarity: "legendary",
    icon: "🏆",
    color: "#F59E0B",
    backgroundColor: "#FFFBEB",
    criteria: "Joined MoodMeter in the first 1000 users",
    requirements: {
      customLogic: "early_adopter_rank"
    },
    isVisible: true,
    order: 1
  },

  beta_tester: {
    id: "beta_tester",
    name: "Beta Hero",
    description: "Participated in MoodMeter beta testing and provided feedback",
    category: "special",
    rarity: "epic",
    icon: "⚡",
    color: "#7C3AED",
    backgroundColor: "#F5F3FF",
    criteria: "Participated in beta testing program",
    requirements: {
      customLogic: "beta_tester"
    },
    isVisible: true,
    order: 2
  },

  premium_member: {
    id: "premium_member",
    name: "Premium Pro",
    description: "Active MoodMeter premium subscription member",
    category: "special",
    rarity: "rare",
    icon: "⭐",
    color: "#F59E0B",
    backgroundColor: "#FFFBEB",
    criteria: "Active premium subscription",
    requirements: {
      customLogic: "premium_subscription"
    },
    isVisible: true,
    order: 3
  },

  verified_trader: {
    id: "verified_trader",
    name: "Verified Pro",
    description: "Identity and trading credentials verified by MoodMeter",
    category: "special",
    rarity: "epic",
    icon: "🔐",
    color: "#059669",
    backgroundColor: "#ECFDF5",
    criteria: "Complete identity and trading verification process",
    requirements: {
      customLogic: "identity_verified"
    },
    isVisible: true,
    order: 4
  }
};

// Badge earning thresholds and multipliers
export const BADGE_CONFIG = {
  // Rarity scoring for leaderboards
  RARITY_SCORES: {
    common: 1,
    rare: 3,
    epic: 5,
    legendary: 10
  },

  // Progress notification thresholds
  PROGRESS_THRESHOLDS: [25, 50, 75, 90],

  // Maximum badges to display in compact mode
  MAX_COMPACT_BADGES: 3,
  MAX_PROFILE_BADGES: 8,

  // Badge refresh intervals
  REFRESH_INTERVALS: {
    realtime: ["flagged_content", "under_review"],
    daily: ["trending_voice", "engagement_hero"],
    weekly: ["smart_takes", "mood_forecaster"],
    monthly: ["trusted_contributor", "top_predictor"]
  }
};

// Helper functions
export const getBadgesByCategory = (category: string) => {
  return Object.values(BADGE_DEFINITIONS).filter(badge => badge.category === category);
};

export const getBadgesByRarity = (rarity: string) => {
  return Object.values(BADGE_DEFINITIONS).filter(badge => badge.rarity === rarity);
};

export const getVisibleBadges = () => {
  return Object.values(BADGE_DEFINITIONS).filter(badge => badge.isVisible);
};

export const getBadgeScore = (badges: string[]) => {
  return badges.reduce((score, badgeId) => {
    const badge = BADGE_DEFINITIONS[badgeId as BadgeType];
    return score + (badge ? BADGE_CONFIG.RARITY_SCORES[badge.rarity] : 0);
  }, 0);
};
