export interface PrivateRoom {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  creatorName: string;
  tickers: string[];
  members: RoomMember[];
  inviteToken?: string;
  tokenExpiry?: Date;
  createdAt: Date;
  lastActivity: Date;
  isArchived: boolean;
  messageCount: number;
  unreadCount: number;
  settings: RoomSettings;
}

export interface RoomMember {
  userId: string;
  username: string;
  avatar?: string;
  role: "admin" | "member";
  joinedAt: Date;
  isOnline: boolean;
  lastSeen: Date;
}

export interface RoomSettings {
  isPrivate: boolean;
  allowReactions: boolean;
  allowThreads: boolean;
  alertOnSentimentChange: boolean;
  aiSummaryEnabled: boolean;
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
  type: "message" | "trade_idea" | "system" | "sentiment_alert";
  createdAt: Date;
  editedAt?: Date;
}

export interface TradeIdea {
  ticker: string;
  action: "buy" | "sell" | "hold";
  entryPrice: number;
  targetPrice?: number;
  stopLoss?: number;
  sentiment: "bullish" | "bearish";
  confidence: number; // 1-5
  timeframe: "day" | "swing" | "long";
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
  userReacted: boolean;
}

export interface SentimentAlert {
  id: string;
  ticker: string;
  previousScore: number;
  currentScore: number;
  change: number;
  changePercent: number;
  triggeredAt: Date;
  roomId?: string;
}

export interface WatchlistRoom {
  room: PrivateRoom;
  tickerData: TickerSentimentData[];
  sentimentAlerts: SentimentAlert[];
}

export interface TickerSentimentData {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  sentiment: number;
  sentimentChange: number;
  volume: number;
  lastUpdate: Date;
}

export interface UserLimits {
  maxPrivateRooms: number;
  maxJoinedRooms: number;
  maxRoomMembers: number;
  maxInvitesPerHour: number;
  canCreatePolls: boolean;
}
