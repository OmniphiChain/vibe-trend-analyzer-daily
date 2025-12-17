// Enhanced types for Private Watchlist Rooms and StockTwist Room

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: "admin" | "member" | "premium" | "verified";
  isOnline: boolean;
  lastSeen: Date;
  isPremium: boolean;
  isVerified: boolean;
  tier: "free" | "premium" | "verified";
  joinedAt: Date;
}

export interface WatchlistTicker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sentiment: number;
  volume: number;
  lastUpdate: Date;
}

export interface PrivateRoom {
  id: string;
  name: string;
  description?: string;
  tickers: string[]; // Selected from user's watchlist (1-5 tickers)
  createdBy: string;
  creatorName: string;
  members: RoomMember[];
  settings: RoomSettings;
  inviteToken?: string;
  tokenExpiry?: Date;
  createdAt: Date;
  lastActivity: Date;
  isArchived: boolean;
  messageCount: number;
  unreadCount: number;
  type: "private" | "public";
  status: "active" | "archived" | "read-only";
  category?: "watchlist" | "general" | "trading";
}

export interface RoomMember {
  userId: string;
  username: string;
  avatar?: string;
  role: "admin" | "member";
  joinedAt: Date;
  isOnline: boolean;
  lastSeen: Date;
  permissions: RoomPermissions;
}

export interface RoomPermissions {
  canPost: boolean;
  canReact: boolean;
  canCreatePolls: boolean;
  canInvite: boolean;
  canManageMembers: boolean;
  canArchiveRoom: boolean;
}

export interface RoomSettings {
  isPrivate: boolean;
  allowReactions: boolean;
  allowThreads: boolean;
  allowPolls: boolean;
  alertOnSentimentChange: boolean;
  aiSummaryEnabled: boolean;
  profanityFilter: boolean;
  inviteExpiry: number; // hours
  maxMembers: number;
  autoArchiveDays: number;
}

export interface RoomMessage {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  userAvatar?: string;
  userRole: "admin" | "member" | "premium" | "verified";
  content: string;
  cashtags: string[];
  sentiment?: "bullish" | "bearish" | "neutral";
  tradeIdea?: TradeIdea;
  parentMessageId?: string; // for threading
  reactions: MessageReaction[];
  isPinned: boolean;
  type: "message" | "trade_idea" | "system" | "sentiment_alert" | "poll";
  createdAt: Date;
  editedAt?: Date;
  mentions: string[]; // @username mentions
  attachments?: MessageAttachment[];
}

export interface TradeIdea {
  ticker: string;
  action: "buy" | "sell" | "hold";
  entryPrice: number;
  targetPrice?: number;
  stopLoss?: number;
  sentiment: "bullish" | "bearish";
  confidence: number; // 1-5 stars
  timeframe: "day" | "swing" | "long";
  strategy?: string;
  notes?: string;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
  userReacted: boolean;
}

export interface MessageAttachment {
  id: string;
  type: "image" | "chart" | "link" | "file";
  url: string;
  name: string;
  size?: number;
  preview?: string;
}

// StockTwist Room specific types
export interface StockTwistPoll {
  id: string;
  question: string;
  options: PollOption[];
  createdBy: string;
  createdByUsername: string;
  createdAt: Date;
  expiresAt: Date;
  totalVotes: number;
  isActive: boolean;
  category: "ticker" | "sentiment" | "general";
}

export interface PollOption {
  id: string;
  text: string;
  ticker?: string;
  votes: number;
  voters: string[];
  percentage: number;
}

export interface StockTwistSummary {
  id: string;
  timeframe: "hourly" | "daily";
  generatedAt: Date;
  topTickers: TrendingTicker[];
  sentiment: {
    bullish: number;
    bearish: number;
    neutral: number;
  };
  topMessages: string[]; // message IDs
  insights: string[];
}

export interface TrendingTicker {
  symbol: string;
  mentions: number;
  sentiment: number;
  change: number;
  volume: number;
  rank: number;
}

export interface Leaderboard {
  period: "daily" | "weekly" | "monthly";
  users: LeaderboardUser[];
  generatedAt: Date;
}

export interface LeaderboardUser {
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  accuracy: number; // percentage
  totalPosts: number;
  likesReceived: number;
  rank: number;
  tier: "free" | "premium" | "verified";
}

// User limits and permissions
export interface UserLimits {
  maxPrivateRooms: number;
  maxJoinedRooms: number;
  maxRoomMembers: number;
  maxInvitesPerHour: number;
  canCreateStockTwistPosts: boolean;
  canCreatePolls: boolean;
  canPinMessages: boolean;
  canMentionAll: boolean;
  dailyMessageLimit: number;
}

// Invite system
export interface RoomInvite {
  id: string;
  roomId: string;
  inviterId: string;
  inviterName: string;
  inviteeEmail?: string;
  inviteeUsername?: string;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
  usedAt?: Date;
  createdAt: Date;
  personalMessage?: string;
}

// Sentiment alerts
export interface SentimentAlert {
  id: string;
  ticker: string;
  roomId?: string;
  previousScore: number;
  currentScore: number;
  change: number;
  changePercent: number;
  triggeredAt: Date;
  alertType: "spike" | "drop" | "volatility";
  threshold: number;
}

// Room analytics
export interface RoomAnalytics {
  roomId: string;
  period: "24h" | "7d" | "30d";
  messageCount: number;
  activeMembers: number;
  topTickers: string[];
  sentimentBreakdown: {
    bullish: number;
    bearish: number;
    neutral: number;
  };
  peakActivity: Date;
  engagementRate: number;
}

// Search and filters
export interface RoomFilter {
  type?: "private" | "public" | "stocktwist";
  tickers?: string[];
  createdBy?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  hasUnread?: boolean;
  isActive?: boolean;
}

export interface MessageFilter {
  userId?: string;
  sentiment?: "bullish" | "bearish" | "neutral";
  hasTradeIdea?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  cashtags?: string[];
  isPinned?: boolean;
}

// Utility types
export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  nextCursor?: string;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

// Real-time events
export interface RoomEvent {
  type:
    | "message"
    | "reaction"
    | "user_join"
    | "user_leave"
    | "typing"
    | "sentiment_alert";
  roomId: string;
  userId: string;
  data: any;
  timestamp: Date;
}

export interface TypingIndicator {
  userId: string;
  username: string;
  roomId: string;
  timestamp: Date;
}

// Moderation
export interface ModerationAction {
  id: string;
  type: "warn" | "mute" | "kick" | "ban" | "delete_message";
  targetUserId: string;
  moderatorId: string;
  roomId: string;
  reason: string;
  duration?: number; // minutes
  createdAt: Date;
  isActive: boolean;
}

// Export configuration
export interface ExportConfig {
  format: "csv" | "json" | "pdf";
  includeMessages: boolean;
  includeSentiment: boolean;
  includeAnalytics: boolean;
  dateRange: {
    start: Date;
    end: Date;
  };
  roomIds: string[];
}
