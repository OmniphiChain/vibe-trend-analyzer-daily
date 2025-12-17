// Database schema types for user management system

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  isVerified: boolean;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  id: string;
  userId: string;
  // Dashboard preferences
  defaultRegion: string;
  defaultTopics: string[];
  realTimeUpdates: boolean;
  darkMode: boolean;
  // Notification preferences
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  alertThreshold: number; // sentiment score threshold for alerts
  // Privacy settings
  profileVisibility: "public" | "private" | "friends";
  showStatsPublicly: boolean;
  dataSharing: boolean;
  updatedAt: Date;
}

export interface UserStats {
  id: string;
  userId: string;
  totalLogins: number;
  totalPredictions: number;
  accurateePredictions: number;
  accuracyRate: number;
  currentStreak: number;
  longestStreak: number;
  totalPointsEarned: number;
  badgesEarned: string[];
  lastPredictionAt?: Date;
  updatedAt: Date;
}

export interface UserWatchlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  keywords: string[];
  sources: string[];
  alertEnabled: boolean;
  alertThreshold: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAlert {
  id: string;
  userId: string;
  type:
    | "sentiment_threshold"
    | "keyword_spike"
    | "trend_change"
    | "weekly_digest";
  title: string;
  message: string;
  data: Record<string, any>;
  isRead: boolean;
  priority: "low" | "medium" | "high";
  createdAt: Date;
  expiresAt?: Date;
}

export interface UserSavedInsight {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: "mood_score" | "trend_analysis" | "keyword_insight" | "custom";
  data: Record<string, any>;
  tags: string[];
  isPublic: boolean;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  deviceInfo: string;
  ipAddress: string;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  agreeToTerms: boolean;
  newsletter?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// User activity tracking
export interface UserActivity {
  id: string;
  userId: string;
  action:
    | "login"
    | "logout"
    | "prediction"
    | "watchlist_create"
    | "insight_save"
    | "dashboard_view";
  details: Record<string, any>;
  metadata: {
    userAgent: string;
    ipAddress: string;
    timestamp: Date;
  };
}

// Friendship/Following system
export interface UserConnection {
  id: string;
  followerId: string;
  followingId: string;
  status: "pending" | "accepted" | "blocked";
  createdAt: Date;
  updatedAt: Date;
}

// Community features
export interface UserPost {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: "prediction" | "insight" | "discussion" | "question";
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  isPublic: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  parentCommentId?: string;
  likes: number;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Premium features
export interface PremiumSubscription {
  id: string;
  userId: string;
  planType: "monthly" | "yearly" | "lifetime";
  status: "active" | "canceled" | "expired" | "past_due";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Export combined types for easy importing
export type DatabaseTables = {
  users: User;
  user_preferences: UserPreferences;
  user_stats: UserStats;
  user_watchlists: UserWatchlist;
  user_alerts: UserAlert;
  user_saved_insights: UserSavedInsight;
  user_sessions: UserSession;
  user_activities: UserActivity;
  user_connections: UserConnection;
  user_posts: UserPost;
  user_comments: UserComment;
  premium_subscriptions: PremiumSubscription;
};
