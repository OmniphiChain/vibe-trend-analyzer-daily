// Social Finance Platform Types - StockTwits-like functionality

export type SentimentType = "bullish" | "bearish" | "neutral";
export type PostType = "twit" | "chat" | "announcement";
export type RoomType = "ticker" | "theme" | "private" | "crypto" | "general";
export type UserRole =
  | "admin"
  | "moderator"
  | "verified"
  | "premium"
  | "member";

// Core Post/Twit Structure
export interface SocialPost {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  userRole: UserRole;
  content: string;
  sentiment: SentimentType;
  cashtags: string[]; // e.g., ['AAPL', 'TSLA', 'BTC']
  hashtags: string[];
  mentions: string[];
  type: PostType;

  // Engagement
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;

  // User interactions
  isLiked?: boolean;
  isBookmarked?: boolean;

  // Media
  images?: string[];
  charts?: ChartData[];

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  editedAt?: Date;
  isPinned?: boolean;
  isVerified?: boolean;

  // Room context
  roomId?: string;
  threadId?: string;
  replyToId?: string;
}

// Cashtag/Ticker Information
export interface Ticker {
  symbol: string; // e.g., "AAPL", "BTC"
  name: string; // e.g., "Apple Inc.", "Bitcoin"
  type: "stock" | "crypto" | "forex" | "commodity" | "index";
  exchange?: string;
  sector?: string;
  marketCap?: number;

  // Current metrics
  price: number;
  change: number;
  changePercent: number;
  volume: number;

  // Sentiment data
  sentimentScore: number; // -100 to 100
  bullishCount: number;
  bearishCount: number;
  neutralCount: number;
  totalPosts: number;

  // Trending data
  trendingScore: number;
  postVolume24h: number;
  sentimentChange24h: number;

  // Metadata
  isWatched?: boolean;
  lastUpdated: Date;
}

// User Watchlist
export interface Watchlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  tickers: string[]; // array of ticker symbols
  isPrivate: boolean;
  isDefault?: boolean;

  // Notification settings
  notifications: {
    trending: boolean;
    sentimentShift: boolean;
    priceAlerts: boolean;
    followedUserPosts: boolean;
    sentimentThreshold: number; // trigger when sentiment changes by this %
  };

  createdAt: Date;
  updatedAt: Date;
}

// Community Rooms
export interface CommunityRoom {
  id: string;
  name: string;
  description: string;
  type: RoomType;

  // Room settings
  isPrivate: boolean;
  isReadOnly: boolean;
  isArchived: boolean;
  requiresVerification: boolean;

  // Associated ticker (for ticker rooms)
  tickerSymbol?: string;

  // Membership
  memberCount: number;
  onlineCount: number;
  moderators: string[]; // user IDs
  bannedUsers: string[];

  // Activity
  lastMessage?: SocialPost;
  lastActivity: Date;
  messageCount: number;

  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;

  // Room settings
  settings: {
    allowImages: boolean;
    allowLinks: boolean;
    slowMode: number; // seconds between messages
    requireApproval: boolean;
  };
}

// Real-time Chat Message
export interface ChatMessage extends Omit<SocialPost, "type"> {
  type: "chat";
  roomId: string;

  // Chat-specific features
  reactions: ChatReaction[];
  isSystemMessage?: boolean;
  systemMessageType?: "join" | "leave" | "promotion" | "ban" | "announcement";

  // Threading
  threadId?: string;
  parentMessageId?: string;

  // Status
  isDeleted?: boolean;
  deletedBy?: string;
  deletedAt?: Date;
}

// Chat Reactions
export interface ChatReaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs who reacted
  userReacted?: boolean;
}

// User Social Profile
export interface SocialProfile {
  userId: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  banner?: string;
  location?: string;
  website?: string;

  // Social stats
  followers: number;
  following: number;
  totalPosts: number;
  totalLikes: number;

  // Trading stats
  accuratePredictions: number;
  totalPredictions: number;
  accuracyRate: number;
  sentimentDistribution: {
    bullish: number;
    bearish: number;
    neutral: number;
  };

  // Activity
  joinedAt: Date;
  lastActive: Date;
  postingStreak: number;

  // Verification & roles
  isVerified: boolean;
  isPremium: boolean;
  roles: UserRole[];
  badges: UserBadge[];

  // Privacy settings
  isPrivate: boolean;
  showStats: boolean;
  allowMessages: boolean;
}

// User Badges
export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedAt: Date;
}

// Follow Relationship
export interface UserFollow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
  notificationsEnabled: boolean;
}

// Notifications
export interface UserNotification {
  id: string;
  userId: string;
  type:
    | "like"
    | "comment"
    | "follow"
    | "mention"
    | "ticker_trending"
    | "sentiment_shift"
    | "room_activity";
  title: string;
  message: string;
  data: Record<string, any>;

  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  expiresAt?: Date;

  // Actions
  actionUrl?: string;
  actionText?: string;
}

// Trending Data
export interface TrendingData {
  timeframe: "1h" | "4h" | "24h" | "7d";
  tickers: TrendingTicker[];
  hashtags: TrendingHashtag[];
  updatedAt: Date;
}

export interface TrendingTicker {
  symbol: string;
  name: string;
  postCount: number;
  sentimentScore: number;
  priceChange: number;
  trendingScore: number;
  rank: number;
}

export interface TrendingHashtag {
  tag: string;
  count: number;
  change: number;
  rank: number;
}

// Price Chart Data
export interface ChartData {
  symbol: string;
  timeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w";
  data: PricePoint[];
}

export interface PricePoint {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Sentiment Analysis
export interface SentimentAnalysis {
  tickerSymbol: string;
  timeframe: "1h" | "4h" | "24h" | "7d" | "30d";

  overall: {
    score: number; // -100 to 100
    confidence: number; // 0 to 1
    trend: "rising" | "falling" | "stable";
  };

  breakdown: {
    bullish: {
      count: number;
      percentage: number;
      averageConfidence: number;
    };
    bearish: {
      count: number;
      percentage: number;
      averageConfidence: number;
    };
    neutral: {
      count: number;
      percentage: number;
      averageConfidence: number;
    };
  };

  influencers: {
    userId: string;
    username: string;
    sentiment: SentimentType;
    influence: number;
    postCount: number;
  }[];

  keywords: {
    word: string;
    sentiment: SentimentType;
    frequency: number;
    impact: number;
  }[];

  updatedAt: Date;
}

// Real-time Events
export interface RealtimeEvent {
  type:
    | "message"
    | "user_join"
    | "user_leave"
    | "typing"
    | "reaction"
    | "post_update";
  roomId?: string;
  userId: string;
  data: any;
  timestamp: Date;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  sentiment?: SentimentType[];
  tickers?: string[];
  hashtags?: string[];
  users?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  postType?: PostType[];
  hasImages?: boolean;
  hasCharts?: boolean;
  minLikes?: number;
  sortBy: "recent" | "popular" | "relevant";
}

// API Response Types
export interface FeedResponse {
  posts: SocialPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters?: SearchFilters;
}

export interface RoomMembership {
  userId: string;
  roomId: string;
  role: "member" | "moderator" | "admin";
  joinedAt: Date;
  lastRead?: Date;
  isMuted: boolean;
  isBanned: boolean;
  permissions: string[];
}

// AI Generated Summaries
export interface AISummary {
  id: string;
  type: "daily" | "weekly" | "ticker" | "room";
  targetId: string; // ticker symbol or room ID
  title: string;
  content: string;
  keyPoints: string[];
  sentimentShift: {
    from: number;
    to: number;
    change: number;
  };
  topInfluencers: string[];
  generatedAt: Date;
  isPublished: boolean;
}

// Heatmap Data
export interface SentimentHeatmap {
  userId: string;
  watchlistId: string;
  timeframe: "24h" | "7d" | "30d";
  data: {
    [tickerSymbol: string]: {
      sentiment: number;
      confidence: number;
      postCount: number;
      priceChange: number;
      color: string; // hex color for visualization
    };
  };
  generatedAt: Date;
}

// Export utility types
export type CreatePostData = Omit<
  SocialPost,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "likes"
  | "comments"
  | "shares"
  | "bookmarks"
>;
export type UpdatePostData = Partial<
  Pick<SocialPost, "content" | "sentiment" | "isPinned">
>;
export type CreateRoomData = Omit<
  CommunityRoom,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "memberCount"
  | "onlineCount"
  | "messageCount"
  | "lastActivity"
>;
