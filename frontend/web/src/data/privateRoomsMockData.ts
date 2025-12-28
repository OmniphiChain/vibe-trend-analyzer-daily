import {
  PrivateRoom,
  RoomMessage,
  User,
  UserLimits,
  StockTwistPoll,
  WatchlistTicker,
  TradeIdea,
  SentimentAlert,
  RoomAnalytics,
  StockTwistSummary,
  Leaderboard,
  TrendingTicker,
  RoomInvite,
} from "@/types/privateRooms";

// Mock users
export const mockUsers: User[] = [
  {
    id: "user-1",
    username: "TechBull2024",
    email: "techbull@example.com",
    avatar: "/api/placeholder/32/32",
    role: "premium",
    isOnline: true,
    lastSeen: new Date(),
    isPremium: true,
    isVerified: true,
    tier: "premium",
    joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: "user-2",
    username: "ValueHunter",
    email: "value@example.com",
    avatar: "/api/placeholder/32/32",
    role: "verified",
    isOnline: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isPremium: false,
    isVerified: true,
    tier: "verified",
    joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  },
  {
    id: "user-3",
    username: "CryptoWhale",
    email: "crypto@example.com",
    avatar: "/api/placeholder/32/32",
    role: "member",
    isOnline: true,
    lastSeen: new Date(),
    isPremium: false,
    isVerified: false,
    tier: "free",
    joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: "user-4",
    username: "OptionsKing",
    email: "options@example.com",
    avatar: "/api/placeholder/32/32",
    role: "verified",
    isOnline: true,
    lastSeen: new Date(),
    isPremium: false,
    isVerified: true,
    tier: "verified",
    joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
  },
  {
    id: "user-5",
    username: "DividendKing",
    email: "dividend@example.com",
    avatar: "/api/placeholder/32/32",
    role: "premium",
    isOnline: false,
    lastSeen: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isPremium: true,
    isVerified: true,
    tier: "premium",
    joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  },
];

// Mock watchlist tickers
export const mockWatchlistTickers: WatchlistTicker[] = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 875.32,
    change: 15.67,
    changePercent: 1.82,
    sentiment: 85,
    volume: 45623000,
    lastUpdate: new Date(),
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc",
    price: 248.45,
    change: -5.23,
    changePercent: -2.06,
    sentiment: 42,
    volume: 89456000,
    lastUpdate: new Date(),
  },
  {
    symbol: "AAPL",
    name: "Apple Inc",
    price: 195.78,
    change: 2.34,
    changePercent: 1.21,
    sentiment: 67,
    volume: 67834000,
    lastUpdate: new Date(),
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 425.67,
    change: 8.92,
    changePercent: 2.14,
    sentiment: 78,
    volume: 34567000,
    lastUpdate: new Date(),
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc",
    price: 165.43,
    change: -1.87,
    changePercent: -1.12,
    sentiment: 59,
    volume: 23445000,
    lastUpdate: new Date(),
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc",
    price: 178.92,
    change: 4.56,
    changePercent: 2.62,
    sentiment: 72,
    volume: 45678000,
    lastUpdate: new Date(),
  },
];

// User limits by tier
export const mockUserLimits: Record<string, UserLimits> = {
  free: {
    maxPrivateRooms: 1,
    maxJoinedRooms: 5,
    maxRoomMembers: 10,
    maxInvitesPerHour: 5,
    canCreateStockTwistPosts: false,
    canCreatePolls: false,
    canPinMessages: false,
    canMentionAll: false,
    dailyMessageLimit: 50,
  },
  verified: {
    maxPrivateRooms: 5,
    maxJoinedRooms: 15,
    maxRoomMembers: 20,
    maxInvitesPerHour: 15,
    canCreateStockTwistPosts: true,
    canCreatePolls: false,
    canPinMessages: true,
    canMentionAll: false,
    dailyMessageLimit: 200,
  },
  premium: {
    maxPrivateRooms: 20,
    maxJoinedRooms: 50,
    maxRoomMembers: 50,
    maxInvitesPerHour: 25,
    canCreateStockTwistPosts: true,
    canCreatePolls: true,
    canPinMessages: true,
    canMentionAll: true,
    dailyMessageLimit: -1, // unlimited
  },
};

// Mock private rooms
export const mockPrivateRooms: PrivateRoom[] = [
  {
    id: "room-1",
    name: "AI Tech Watchlist",
    description: "Tracking NVDA, MSFT, GOOGL movements and AI sector trends",
    tickers: ["NVDA", "MSFT", "GOOGL"],
    createdBy: "user-1",
    creatorName: "TechBull2024",
    members: [
      {
        userId: "user-1",
        username: "TechBull2024",
        avatar: "/api/placeholder/32/32",
        role: "admin",
        joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        isOnline: true,
        lastSeen: new Date(),
        permissions: {
          canPost: true,
          canReact: true,
          canCreatePolls: true,
          canInvite: true,
          canManageMembers: true,
          canArchiveRoom: true,
        },
      },
      {
        userId: "user-2",
        username: "ValueHunter",
        avatar: "/api/placeholder/32/32",
        role: "member",
        joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        isOnline: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
        permissions: {
          canPost: true,
          canReact: true,
          canCreatePolls: false,
          canInvite: true,
          canManageMembers: false,
          canArchiveRoom: false,
        },
      },
      {
        userId: "user-4",
        username: "OptionsKing",
        avatar: "/api/placeholder/32/32",
        role: "member",
        joinedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        isOnline: true,
        lastSeen: new Date(),
        permissions: {
          canPost: true,
          canReact: true,
          canCreatePolls: false,
          canInvite: true,
          canManageMembers: false,
          canArchiveRoom: false,
        },
      },
    ],
    settings: {
      isPrivate: true,
      allowReactions: true,
      allowThreads: true,
      allowPolls: true,
      alertOnSentimentChange: true,
      aiSummaryEnabled: true,
      profanityFilter: true,
      inviteExpiry: 48,
      maxMembers: 50,
      autoArchiveDays: 30,
    },
    inviteToken: "inv-ai-tech-abc123",
    tokenExpiry: new Date(Date.now() + 48 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 30 * 60 * 1000),
    isArchived: false,
    messageCount: 156,
    unreadCount: 3,
    type: "private",
    status: "active",
    category: "watchlist",
  },
  {
    id: "room-2",
    name: "EV Revolution",
    description: "Tesla and EV sector analysis",
    tickers: ["TSLA", "RIVN", "LCID"],
    createdBy: "user-2",
    creatorName: "ValueHunter",
    members: [
      {
        userId: "user-2",
        username: "ValueHunter",
        avatar: "/api/placeholder/32/32",
        role: "admin",
        joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        isOnline: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
        permissions: {
          canPost: true,
          canReact: true,
          canCreatePolls: false,
          canInvite: true,
          canManageMembers: true,
          canArchiveRoom: true,
        },
      },
      {
        userId: "user-3",
        username: "CryptoWhale",
        avatar: "/api/placeholder/32/32",
        role: "member",
        joinedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        isOnline: true,
        lastSeen: new Date(),
        permissions: {
          canPost: true,
          canReact: true,
          canCreatePolls: false,
          canInvite: false,
          canManageMembers: false,
          canArchiveRoom: false,
        },
      },
    ],
    settings: {
      isPrivate: true,
      allowReactions: true,
      allowThreads: false,
      allowPolls: false,
      alertOnSentimentChange: true,
      aiSummaryEnabled: false,
      profanityFilter: true,
      inviteExpiry: 24,
      maxMembers: 20,
      autoArchiveDays: 30,
    },
    inviteToken: "inv-ev-xyz789",
    tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isArchived: false,
    messageCount: 89,
    unreadCount: 0,
    type: "private",
    status: "active",
    category: "watchlist",
  },
  {
    id: "stocktwist-room",
    name: "StockTwist Room",
    description: "Real-time trade ideas and market insights sharing",
    tickers: [], // All tickers allowed
    createdBy: "system",
    creatorName: "System",
    members: [], // Dynamic membership
    settings: {
      isPrivate: false,
      allowReactions: true,
      allowThreads: true,
      allowPolls: true,
      alertOnSentimentChange: false,
      aiSummaryEnabled: true,
      profanityFilter: true,
      inviteExpiry: 0,
      maxMembers: -1, // unlimited
      autoArchiveDays: -1, // never archive
    },
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(),
    isArchived: false,
    messageCount: 15678,
    unreadCount: 12,
    type: "stocktwist",
    status: "active",
    category: "trading",
  },
];

// Mock room messages
export const mockRoomMessages: Record<string, RoomMessage[]> = {
  "room-1": [
    {
      id: "msg-1",
      roomId: "room-1",
      userId: "user-1",
      username: "TechBull2024",
      userAvatar: "/api/placeholder/32/32",
      userRole: "premium",
      content:
        "$NVDA looking strong after the earnings beat. Target $950 by next week 📈",
      cashtags: ["NVDA"],
      sentiment: "bullish",
      tradeIdea: {
        ticker: "NVDA",
        action: "buy",
        entryPrice: 875.32,
        targetPrice: 950.0,
        stopLoss: 825.0,
        sentiment: "bullish",
        confidence: 4,
        timeframe: "swing",
        strategy: "Earnings momentum play",
        notes: "Strong guidance, AI demand accelerating",
      },
      reactions: [
        {
          emoji: "📈",
          count: 3,
          users: ["user-2", "user-4", "user-5"],
          userReacted: false,
        },
        {
          emoji: "🚀",
          count: 2,
          users: ["user-2", "user-4"],
          userReacted: false,
        },
        { emoji: "💎", count: 1, users: ["user-4"], userReacted: false },
      ],
      isPinned: true,
      type: "trade_idea",
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      mentions: [],
      attachments: [],
    },
    {
      id: "msg-2",
      roomId: "room-1",
      userId: "user-2",
      username: "ValueHunter",
      userAvatar: "/api/placeholder/32/32",
      userRole: "verified",
      content:
        "Agreed! The guidance was solid. Also watching $MSFT for cloud growth",
      cashtags: ["MSFT"],
      sentiment: "bullish",
      parentMessageId: "msg-1",
      reactions: [
        {
          emoji: "✅",
          count: 2,
          users: ["user-1", "user-4"],
          userReacted: false,
        },
      ],
      isPinned: false,
      type: "message",
      createdAt: new Date(Date.now() - 25 * 60 * 1000),
      mentions: [],
      attachments: [],
    },
    {
      id: "msg-3",
      roomId: "room-1",
      userId: "system",
      username: "MoorMeter AI",
      userRole: "premium",
      content:
        "🚨 Sentiment Alert: $NVDA sentiment increased by +15% in the last hour",
      cashtags: ["NVDA"],
      reactions: [],
      isPinned: false,
      type: "sentiment_alert",
      createdAt: new Date(Date.now() - 15 * 60 * 1000),
      mentions: [],
      attachments: [],
    },
  ],
  "stocktwist-room": [
    {
      id: "st-msg-1",
      roomId: "stocktwist-room",
      userId: "user-1",
      username: "TechBull2024",
      userAvatar: "/api/placeholder/32/32",
      userRole: "premium",
      content:
        "💬 Buy $SOFI at 7.10 / Target 8.20 / SL 6.90 📈 Bullish on fintech recovery",
      cashtags: ["SOFI"],
      sentiment: "bullish",
      tradeIdea: {
        ticker: "SOFI",
        action: "buy",
        entryPrice: 7.1,
        targetPrice: 8.2,
        stopLoss: 6.9,
        sentiment: "bullish",
        confidence: 3,
        timeframe: "day",
        strategy: "Fintech recovery play",
      },
      reactions: [
        { emoji: "✅", count: 12, users: [], userReacted: false },
        { emoji: "⚠️", count: 3, users: [], userReacted: false },
        { emoji: "🧠", count: 8, users: [], userReacted: false },
      ],
      isPinned: false,
      type: "trade_idea",
      createdAt: new Date(Date.now() - 45 * 60 * 1000),
      mentions: [],
      attachments: [],
    },
    {
      id: "st-msg-2",
      roomId: "stocktwist-room",
      userId: "user-4",
      username: "OptionsKing",
      userAvatar: "/api/placeholder/32/32",
      userRole: "verified",
      content:
        "$AAPL 175 calls looking juicy for next week. Expecting bounce from support 📊",
      cashtags: ["AAPL"],
      sentiment: "bullish",
      reactions: [
        { emoji: "✅", count: 18, users: [], userReacted: false },
        { emoji: "🧠", count: 15, users: [], userReacted: false },
      ],
      isPinned: false,
      type: "message",
      createdAt: new Date(Date.now() - 20 * 60 * 1000),
      mentions: [],
      attachments: [],
    },
  ],
};

// Mock StockTwist polls
export const mockStockTwistPolls: StockTwistPoll[] = [
  {
    id: "poll-1",
    question: "Which ticker will move the most today?",
    options: [
      {
        id: "opt-1",
        text: "$NVDA",
        ticker: "NVDA",
        votes: 45,
        voters: [],
        percentage: 36.3,
      },
      {
        id: "opt-2",
        text: "$TSLA",
        ticker: "TSLA",
        votes: 32,
        voters: [],
        percentage: 25.8,
      },
      {
        id: "opt-3",
        text: "$AAPL",
        ticker: "AAPL",
        votes: 28,
        voters: [],
        percentage: 22.6,
      },
      {
        id: "opt-4",
        text: "$MSFT",
        ticker: "MSFT",
        votes: 19,
        voters: [],
        percentage: 15.3,
      },
    ],
    createdBy: "user-1",
    createdByUsername: "TechBull2024",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    totalVotes: 124,
    isActive: true,
    category: "ticker",
  },
  {
    id: "poll-2",
    question: "Market sentiment for next week?",
    options: [
      {
        id: "opt-5",
        text: "🚀 Very Bullish",
        votes: 67,
        voters: [],
        percentage: 41.6,
      },
      {
        id: "opt-6",
        text: "📈 Moderately Bullish",
        votes: 54,
        voters: [],
        percentage: 33.5,
      },
      {
        id: "opt-7",
        text: "📊 Sideways",
        votes: 28,
        voters: [],
        percentage: 17.4,
      },
      {
        id: "opt-8",
        text: "📉 Bearish",
        votes: 12,
        voters: [],
        percentage: 7.5,
      },
    ],
    createdBy: "user-5",
    createdByUsername: "DividendKing",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000),
    totalVotes: 161,
    isActive: true,
    category: "sentiment",
  },
];

// Mock trending tickers for StockTwist
export const mockTrendingTickers: TrendingTicker[] = [
  {
    symbol: "NVDA",
    mentions: 1247,
    sentiment: 85,
    change: 3.42,
    volume: 45623000,
    rank: 1,
  },
  {
    symbol: "TSLA",
    mentions: 743,
    sentiment: -23,
    change: -2.15,
    volume: 89456000,
    rank: 2,
  },
  {
    symbol: "AAPL",
    mentions: 534,
    sentiment: 12,
    change: 0.87,
    volume: 67834000,
    rank: 3,
  },
  {
    symbol: "MSFT",
    mentions: 421,
    sentiment: 34,
    change: 1.23,
    volume: 34567000,
    rank: 4,
  },
  {
    symbol: "GOOGL",
    mentions: 318,
    sentiment: -8,
    change: -0.45,
    volume: 23445000,
    rank: 5,
  },
];

// Mock leaderboard
export const mockLeaderboard: Leaderboard = {
  period: "daily",
  users: [
    {
      userId: "user-1",
      username: "TechBull2024",
      avatar: "/api/placeholder/32/32",
      score: 2847,
      accuracy: 87.3,
      totalPosts: 23,
      likesReceived: 245,
      rank: 1,
      tier: "premium",
    },
    {
      userId: "user-4",
      username: "OptionsKing",
      avatar: "/api/placeholder/32/32",
      score: 2156,
      accuracy: 82.1,
      totalPosts: 18,
      likesReceived: 189,
      rank: 2,
      tier: "verified",
    },
    {
      userId: "user-5",
      username: "DividendKing",
      avatar: "/api/placeholder/32/32",
      score: 1934,
      accuracy: 79.8,
      totalPosts: 31,
      likesReceived: 156,
      rank: 3,
      tier: "premium",
    },
  ],
  generatedAt: new Date(),
};

// Utility functions
export const getUserById = (userId: string): User | undefined => {
  return mockUsers.find((user) => user.id === userId);
};

export const getRoomById = (roomId: string): PrivateRoom | undefined => {
  return mockPrivateRooms.find((room) => room.id === roomId);
};

export const getUserLimits = (tier: string): UserLimits => {
  return mockUserLimits[tier] || mockUserLimits.free;
};

export const parseCashtags = (content: string): string[] => {
  const cashtagRegex = /\$([A-Z]{1,5})\b/g;
  const matches = content.match(cashtagRegex);
  return matches ? matches.map((tag) => tag.substring(1)) : [];
};

export const formatTradeIdea = (idea: TradeIdea): string => {
  const { ticker, action, entryPrice, targetPrice, stopLoss, sentiment } = idea;
  const emoji = sentiment === "bullish" ? "📈" : "📉";
  let formatted = `💬 ${action.toUpperCase()} $${ticker} at ${entryPrice}`;
  if (targetPrice) formatted += ` / Target ${targetPrice}`;
  if (stopLoss) formatted += ` / SL ${stopLoss}`;
  formatted += ` ${emoji} ${sentiment}`;
  return formatted;
};

export const generateInviteToken = (): string => {
  return `inv-${Math.random().toString(36).substring(2, 15)}`;
};

export const isValidTicker = (ticker: string): boolean => {
  return /^[A-Z]{1,5}$/.test(ticker);
};

export const calculateSentimentScore = (messages: RoomMessage[]): number => {
  if (messages.length === 0) return 50;

  let totalSentiment = 0;
  let count = 0;

  messages.forEach((msg) => {
    if (msg.sentiment) {
      const score =
        msg.sentiment === "bullish"
          ? 80
          : msg.sentiment === "bearish"
            ? 20
            : 50;
      totalSentiment += score;
      count++;
    }
  });

  return count > 0 ? Math.round(totalSentiment / count) : 50;
};

export const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
};
