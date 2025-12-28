export interface CredibilityMetrics {
  postAccuracy: number; // 0-100, accuracy of predictions over time
  communityFeedback: number; // 0-100, based on upvote/downvote ratio
  dataEvidence: number; // 0-100, presence of charts, links, sources
  aiValidation: number; // 0-100, alignment with AI sentiment analysis
  userConsistency: number; // 0-100, historical performance consistency
}

export interface CredibilityScore {
  userId: string;
  postId?: string;
  overallScore: number; // 0-100 weighted combination
  metrics: CredibilityMetrics;
  lastUpdated: Date;
  trendDirection: 'up' | 'down' | 'stable';
}

export type BadgeType = 
  | 'verified-insight'
  | 'analyst-grade'
  | 'speculative'
  | 'needs-review'
  | 'sentiment-expert'
  | 'data-driven'
  | 'rising-voice'
  | 'accuracy-champion'
  | 'community-favorite';

export interface Badge {
  type: BadgeType;
  label: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  darkColor: string;
  darkBgColor: string;
  requirements: string[];
  scoreThreshold?: number;
  specialCriteria?: string[];
}

export interface UserCredibility {
  userId: string;
  username: string;
  currentScore: number;
  badges: BadgeType[];
  totalPosts: number;
  accuratePredictions: number;
  communityUpvotes: number;
  averageEngagement: number;
  joinDate: Date;
  scoreHistory: Array<{
    date: Date;
    score: number;
    reason?: string;
  }>;
  recentActivity: Array<{
    postId: string;
    score: number;
    outcome?: 'correct' | 'incorrect' | 'pending';
    date: Date;
  }>;
}

export interface PostCredibility {
  postId: string;
  authorId: string;
  score: number;
  badges: BadgeType[];
  metrics: CredibilityMetrics;
  flagReasons?: string[];
  moderationStatus: 'approved' | 'flagged' | 'under-review' | 'removed';
  communityVotes: {
    helpful: number;
    misleading: number;
    accurate: number;
    speculative: number;
  };
}

export interface CredibilityFilter {
  minScore?: number;
  maxScore?: number;
  requiredBadges?: BadgeType[];
  excludeBadges?: BadgeType[];
  moderationStatus?: PostCredibility['moderationStatus'][];
  sortBy?: 'score' | 'engagement' | 'accuracy' | 'recent';
  sortOrder?: 'asc' | 'desc';
}

// Badge definitions with complete styling and requirements
export const BADGE_DEFINITIONS: Record<BadgeType, Badge> = {
  'verified-insight': {
    type: 'verified-insight',
    label: 'Verified Insight',
    description: 'Consistently accurate predictions with strong evidence',
    icon: '✅',
    color: '#059669',
    bgColor: '#D1FAE5',
    darkColor: '#34D399',
    darkBgColor: '#064E3B',
    requirements: ['Score > 85', 'Last 5 posts aligned with outcomes'],
    scoreThreshold: 85,
    specialCriteria: ['accuracy_streak_5']
  },
  'analyst-grade': {
    type: 'analyst-grade',
    label: 'Analyst-Grade',
    description: 'High-quality analysis with data-backed insights',
    icon: '🧠',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    darkColor: '#A78BFA',
    darkBgColor: '#3C1A78',
    requirements: ['Score > 70', '3+ posts with technical evidence'],
    scoreThreshold: 70,
    specialCriteria: ['data_evidence_posts_3']
  },
  'speculative': {
    type: 'speculative',
    label: 'Speculative',
    description: 'Posts require additional verification',
    icon: '📉',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    darkColor: '#F87171',
    darkBgColor: '#7F1D1D',
    requirements: ['Score < 40', 'Lacks supporting evidence'],
    scoreThreshold: 40
  },
  'needs-review': {
    type: 'needs-review',
    label: 'Needs Review',
    description: 'New user or post awaiting validation',
    icon: '⚠️',
    color: '#D97706',
    bgColor: '#FEF3C7',
    darkColor: '#FBBF24',
    darkBgColor: '#78350F',
    requirements: ['New user', 'Awaiting validation'],
    specialCriteria: ['new_user', 'pending_validation']
  },
  'sentiment-expert': {
    type: 'sentiment-expert',
    label: 'Sentiment Expert',
    description: 'Master of market mood analysis',
    icon: '🎯',
    color: '#059669',
    bgColor: '#D1FAE5',
    darkColor: '#34D399',
    darkBgColor: '#064E3B',
    requirements: ['Score ≥ 80', '20+ accurate posts'],
    scoreThreshold: 80,
    specialCriteria: ['accurate_posts_20']
  },
  'data-driven': {
    type: 'data-driven',
    label: 'Data-Driven Analyst',
    description: 'Frequent use of charts, sources, and evidence',
    icon: '📊',
    color: '#2563EB',
    bgColor: '#DBEAFE',
    darkColor: '#60A5FA',
    darkBgColor: '#1E3A8A',
    requirements: ['Frequent chart/source usage', 'High evidence score'],
    specialCriteria: ['frequent_data_evidence']
  },
  'rising-voice': {
    type: 'rising-voice',
    label: 'Rising Voice',
    description: 'New member with high community engagement',
    icon: '🌟',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    darkColor: '#A78BFA',
    darkBgColor: '#3C1A78',
    requirements: ['New user', 'High engagement rate'],
    specialCriteria: ['new_user_high_engagement']
  },
  'accuracy-champion': {
    type: 'accuracy-champion',
    label: 'Accuracy Champion',
    description: 'Exceptional track record of correct predictions',
    icon: '🏆',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    darkColor: '#FBBF24',
    darkBgColor: '#78350F',
    requirements: ['90%+ accuracy rate', '50+ validated posts'],
    scoreThreshold: 90,
    specialCriteria: ['accuracy_rate_90', 'validated_posts_50']
  },
  'community-favorite': {
    type: 'community-favorite',
    label: 'Community Favorite',
    description: 'Highly valued by the trading community',
    icon: '❤️',
    color: '#EC4899',
    bgColor: '#FCE7F3',
    darkColor: '#F472B6',
    darkBgColor: '#831843',
    requirements: ['High upvote ratio', 'Strong community engagement'],
    specialCriteria: ['high_upvote_ratio', 'strong_engagement']
  }
};

// Scoring algorithm weights
export const CREDIBILITY_WEIGHTS = {
  POST_ACCURACY: 0.35,
  COMMUNITY_FEEDBACK: 0.25,
  DATA_EVIDENCE: 0.15,
  AI_VALIDATION: 0.15,
  USER_CONSISTENCY: 0.10
} as const;

// Utility functions for score calculation
export const calculateOverallScore = (metrics: CredibilityMetrics): number => {
  const weighted = 
    metrics.postAccuracy * CREDIBILITY_WEIGHTS.POST_ACCURACY +
    metrics.communityFeedback * CREDIBILITY_WEIGHTS.COMMUNITY_FEEDBACK +
    metrics.dataEvidence * CREDIBILITY_WEIGHTS.DATA_EVIDENCE +
    metrics.aiValidation * CREDIBILITY_WEIGHTS.AI_VALIDATION +
    metrics.userConsistency * CREDIBILITY_WEIGHTS.USER_CONSISTENCY;
  
  return Math.min(Math.max(Math.round(weighted), 0), 100);
};

export const getScoreColor = (score: number, isDark: boolean = false): string => {
  if (score >= 80) return isDark ? '#34D399' : '#059669'; // Green
  if (score >= 60) return isDark ? '#60A5FA' : '#2563EB'; // Blue
  if (score >= 40) return isDark ? '#FBBF24' : '#D97706'; // Yellow
  return isDark ? '#F87171' : '#DC2626'; // Red
};

export const getScoreBgColor = (score: number, isDark: boolean = false): string => {
  if (score >= 80) return isDark ? '#064E3B' : '#D1FAE5'; // Green
  if (score >= 60) return isDark ? '#1E3A8A' : '#DBEAFE'; // Blue
  if (score >= 40) return isDark ? '#78350F' : '#FEF3C7'; // Yellow
  return isDark ? '#7F1D1D' : '#FEE2E2'; // Red
};

export const determineUserBadges = (credibility: UserCredibility): BadgeType[] => {
  const badges: BadgeType[] = [];
  const { currentScore, totalPosts, accuratePredictions, communityUpvotes } = credibility;
  
  // Score-based badges
  if (currentScore >= 90 && accuratePredictions >= 50) {
    badges.push('accuracy-champion');
  } else if (currentScore >= 85 && accuratePredictions >= 5) {
    badges.push('verified-insight');
  } else if (currentScore >= 80 && accuratePredictions >= 20) {
    badges.push('sentiment-expert');
  } else if (currentScore >= 70 && totalPosts >= 3) {
    badges.push('analyst-grade');
  } else if (currentScore < 40) {
    badges.push('speculative');
  }
  
  // Special badges
  if (communityUpvotes / Math.max(totalPosts, 1) >= 5) {
    badges.push('community-favorite');
  }
  
  // New user badges
  const daysSinceJoin = (Date.now() - credibility.joinDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceJoin <= 30 && currentScore >= 60) {
    badges.push('rising-voice');
  } else if (daysSinceJoin <= 7 || totalPosts < 3) {
    badges.push('needs-review');
  }
  
  return badges;
};
