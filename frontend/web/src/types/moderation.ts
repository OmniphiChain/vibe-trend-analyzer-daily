// Moderation System Types for MoodMeter Platform

export type FlagReasonType = 
  | "spam" 
  | "misinformation" 
  | "harassment" 
  | "inappropriate_content" 
  | "scam" 
  | "hate_speech" 
  | "off_topic" 
  | "duplicate" 
  | "self_promotion" 
  | "other";

export type ModerationActionType = 
  | "approve" 
  | "remove" 
  | "ban_user" 
  | "mute_user" 
  | "warn_user" 
  | "shadowban" 
  | "restrict_links" 
  | "mark_spam" 
  | "dismiss_flag";

export type CredibilityLevel = "trusted" | "mixed" | "low" | "unverified";

export type ModerationStatus = "pending" | "reviewed" | "approved" | "rejected";

// Post Flag/Report Structure
export interface PostFlag {
  id: string;
  postId: string;
  reporterId: string;
  reporterUsername: string;
  reason: FlagReasonType;
  description?: string;
  status: ModerationStatus;
  
  // Review details
  reviewedBy?: string;
  reviewedAt?: Date;
  moderatorNotes?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// Post Credibility Score
export interface PostCredibility {
  postId: string;
  score: number; // 0-100
  level: CredibilityLevel;
  
  // Scoring factors
  factors: {
    hasSourceLinks: boolean;
    hasDataEvidence: boolean;
    authorReliability: number; // 0-100
    communityVotes: number;
    aiVerificationScore: number; // 0-100
    historicalAccuracy?: number; // for prediction posts
  };
  
  // AI Analysis
  aiAnalysis: {
    contentType: "data_backed" | "speculative" | "opinion" | "promotional";
    factualClaims: string[];
    verificationSources: string[];
    confidenceScore: number; // 0-1
    riskFlags: string[];
  };
  
  // Community feedback
  communityScore: number; // Average of community votes
  communityVotes: {
    helpful: number;
    misleading: number;
    accurate: number;
  };
  
  lastUpdated: Date;
  calculatedAt: Date;
}

// User Credibility Profile
export interface UserCredibility {
  userId: string;
  overallScore: number; // 0-100
  level: CredibilityLevel;
  
  // Historical performance
  stats: {
    totalPosts: number;
    verifiedPosts: number;
    flaggedPosts: number;
    accuratePredictions: number;
    totalPredictions: number;
    accuracyRate: number;
    averagePostScore: number;
  };
  
  // Trend data
  scoreHistory: {
    date: Date;
    score: number;
  }[];
  
  // Badges and achievements
  badges: CredibilityBadge[];
  
  // Reputation factors
  factors: {
    postQuality: number; // 0-100
    sourceUsage: number; // 0-100
    communityEngagement: number; // 0-100
    predictionAccuracy: number; // 0-100
    consistencyScore: number; // 0-100
  };
  
  // Restrictions
  restrictions: UserRestriction[];
  
  lastUpdated: Date;
}

// Credibility Badges
export interface CredibilityBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  level: "bronze" | "silver" | "gold" | "platinum";
  criteria: string;
  earnedAt: Date;
}

// User Restrictions
export interface UserRestriction {
  id: string;
  userId: string;
  type: "mute" | "ban" | "shadowban" | "link_restriction" | "posting_limit";
  reason: string;
  duration?: number; // minutes, null for permanent
  issuedBy: string;
  issuedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

// Moderation Action Record
export interface ModerationAction {
  id: string;
  targetType: "post" | "user" | "comment";
  targetId: string;
  action: ModerationActionType;
  reason: string;
  
  // Moderator details
  moderatorId: string;
  moderatorUsername: string;
  
  // Action details
  details: {
    flagId?: string;
    duration?: number; // for temporary actions
    notes?: string;
    evidence?: string[];
  };
  
  // Status
  status: "pending" | "executed" | "reversed" | "expired";
  executedAt?: Date;
  reversedAt?: Date;
  reversedBy?: string;
  reverseReason?: string;
  
  createdAt: Date;
}

// Moderation Queue Item
export interface ModerationQueueItem {
  id: string;
  type: "flagged_post" | "spam_detection" | "user_report" | "ai_alert";
  priority: "low" | "medium" | "high" | "urgent";
  
  // Content reference
  postId?: string;
  userId?: string;
  
  // Flag details
  flags: PostFlag[];
  totalFlags: number;
  uniqueReporters: number;
  
  // AI Detection
  aiSpamScore?: number; // 0-1
  aiRiskLevel?: "low" | "medium" | "high";
  aiTags?: string[];
  
  // Status
  status: ModerationStatus;
  assignedTo?: string;
  
  // Timing
  firstFlaggedAt: Date;
  lastFlaggedAt: Date;
  reviewDeadline?: Date;
  autoHiddenAt?: Date;
}

// AI Spam Detection Result
export interface SpamDetectionResult {
  postId: string;
  isSpam: boolean;
  confidence: number; // 0-1
  
  // Detection factors
  factors: {
    repetitiveContent: boolean;
    suspiciousLinks: boolean;
    promoPhrases: boolean;
    botLikePattern: boolean;
    duplicateContent: boolean;
    excessiveEmojis: boolean;
    excessiveCaps: boolean;
  };
  
  // Risk indicators
  riskScore: number; // 0-100
  riskFlags: string[];
  
  // Analysis details
  contentAnalysis: {
    sentiment: "promotional" | "neutral" | "informative";
    linkCount: number;
    suspiciousLinks: string[];
    detectedCopyPaste: boolean;
    languageQuality: number; // 0-1
  };
  
  processedAt: Date;
}

// Moderation Dashboard Stats
export interface ModerationStats {
  totalFlags: number;
  pendingReviews: number;
  resolvedToday: number;
  spamDetected: number;
  usersBanned: number;
  postsRemoved: number;
  
  // Queue breakdown
  queueBreakdown: {
    [key in FlagReasonType]: number;
  };
  
  // Response time metrics
  averageResponseTime: number; // minutes
  urgentItemsCount: number;
  
  // Period comparison
  periodChange: {
    flags: number;
    spam: number;
    resolutions: number;
  };
  
  generatedAt: Date;
}

// Moderation Settings
export interface ModerationSettings {
  autoHideThreshold: number; // number of flags to auto-hide
  spamDetectionEnabled: boolean;
  aiModerationEnabled: boolean;
  
  // AI thresholds
  spamConfidenceThreshold: number; // 0-1
  riskScoreThreshold: number; // 0-100
  
  // Auto-actions
  autoRemoveSpam: boolean;
  autoMuteSpammers: boolean;
  
  // Notification settings
  notifyModsOnFlags: boolean;
  notifyModsOnSpam: boolean;
  escalationThreshold: number;
  
  // Content filters
  blockedKeywords: string[];
  allowedDomains: string[];
  blockedDomains: string[];
  
  updatedAt: Date;
  updatedBy: string;
}

// Export utility types
export type CreateFlagData = Omit<PostFlag, "id" | "createdAt" | "updatedAt" | "status">;

export type ModerationFilters = {
  status?: ModerationStatus[];
  reason?: FlagReasonType[];
  priority?: ("low" | "medium" | "high" | "urgent")[];
  assignedTo?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: "newest" | "oldest" | "priority" | "most_flagged";
};

export type CredibilityUpdateData = {
  score: number;
  factors: PostCredibility["factors"];
  aiAnalysis: PostCredibility["aiAnalysis"];
  communityScore?: number;
};
