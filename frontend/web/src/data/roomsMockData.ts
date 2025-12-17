import {
  PrivateRoom,
  RoomMessage,
  UserLimits,
  WatchlistRoom,
  SentimentAlert,
  TickerSentimentData,
} from "@/types/rooms";

export const mockUserLimits: UserLimits = {
  maxPrivateRooms: 1, // Free user
  maxJoinedRooms: 5,
  maxRoomMembers: 10,
  maxInvitesPerHour: 5,

  canCreatePolls: false,
};

export const mockPremiumUserLimits: UserLimits = {
  maxPrivateRooms: 20,
  maxJoinedRooms: 50,
  maxRoomMembers: 50,
  maxInvitesPerHour: 25,

  canCreatePolls: true,
};

export const mockPrivateRooms: PrivateRoom[] = [
  {
    id: "room-1",
    name: "AI Tech Watch",
    description: "Tracking NVDA, MSFT, GOOGL movements and AI sector trends",
    createdBy: "user-1",
    creatorName: "TechTrader99",
    tickers: ["NVDA", "MSFT", "GOOGL"],
    members: [
      {
        userId: "user-1",
        username: "TechTrader99",
        avatar: "/api/placeholder/32/32",
        role: "admin",
        joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        isOnline: true,
        lastSeen: new Date(),
      },
      {
        userId: "user-2",
        username: "AIInvestor",
        avatar: "/api/placeholder/32/32",
        role: "member",
        joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        isOnline: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        userId: "user-3",
        username: "ChipWhisperer",
        avatar: "/api/placeholder/32/32",
        role: "member",
        joinedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        isOnline: true,
        lastSeen: new Date(),
      },
    ],
    inviteToken: "inv-tech-watch-abc123",
    tokenExpiry: new Date(Date.now() + 48 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 30 * 60 * 1000),
    isArchived: false,
    messageCount: 156,
    unreadCount: 3,
    settings: {
      isPrivate: true,
      allowReactions: true,
      allowThreads: true,
      alertOnSentimentChange: true,
      aiSummaryEnabled: true,
    },
  },
  {
    id: "room-2",
    name: "Energy Futures",
    description: "Oil, renewable energy, and battery tech watchlist discussion",
    createdBy: "user-4",
    creatorName: "EnergyBull",
    tickers: ["XOM", "TSLA", "ENPH"],
    members: [
      {
        userId: "user-4",
        username: "EnergyBull",
        avatar: "/api/placeholder/32/32",
        role: "admin",
        joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        isOnline: false,
        lastSeen: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        userId: "user-1",
        username: "TechTrader99",
        avatar: "/api/placeholder/32/32",
        role: "member",
        joinedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        isOnline: true,
        lastSeen: new Date(),
      },
    ],
    inviteToken: "inv-energy-xyz789",
    tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isArchived: false,
    messageCount: 89,
    unreadCount: 0,
    settings: {
      isPrivate: true,
      allowReactions: true,
      allowThreads: false,
      alertOnSentimentChange: true,
      aiSummaryEnabled: false,
    },
  },
];

export const mockRoomMessages: RoomMessage[] = [
  {
    id: "msg-1",
    roomId: "room-1",
    userId: "user-1",
    username: "TechTrader99",
    userAvatar: "/api/placeholder/32/32",
    userRole: "admin",
    content:
      "$NVDA looking strong after the earnings beat. Target $850 by next week 📈",
    cashtags: ["NVDA"],
    sentiment: "bullish",
    tradeIdea: {
      ticker: "NVDA",
      action: "buy",
      entryPrice: 789.5,
      targetPrice: 850.0,
      stopLoss: 750.0,
      sentiment: "bullish",
      confidence: 4,
      timeframe: "swing",
    },
    reactions: [
      {
        emoji: "📈",
        count: 3,
        users: ["user-2", "user-3", "user-4"],
        userReacted: false,
      },
      {
        emoji: "🚀",
        count: 2,
        users: ["user-2", "user-3"],
        userReacted: false,
      },
    ],
    isPinned: true,
    type: "trade_idea",
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "msg-2",
    roomId: "room-1",
    userId: "user-2",
    username: "AIInvestor",
    userAvatar: "/api/placeholder/32/32",
    userRole: "member",
    content:
      "Agreed! The guidance was solid. Also watching $MSFT for cloud growth",
    cashtags: ["MSFT"],
    sentiment: "bullish",
    parentMessageId: "msg-1",
    reactions: [
      {
        emoji: "✅",
        count: 2,
        users: ["user-1", "user-3"],
        userReacted: false,
      },
    ],
    isPinned: false,
    type: "message",
    createdAt: new Date(Date.now() - 25 * 60 * 1000),
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
  },
];

export const mockSentimentAlerts: SentimentAlert[] = [
  {
    id: "alert-1",
    ticker: "NVDA",
    previousScore: 65,
    currentScore: 80,
    change: 15,
    changePercent: 23.1,
    triggeredAt: new Date(Date.now() - 15 * 60 * 1000),
    roomId: "room-1",
  },
  {
    id: "alert-2",
    ticker: "MSFT",
    previousScore: 72,
    currentScore: 58,
    change: -14,
    changePercent: -19.4,
    triggeredAt: new Date(Date.now() - 35 * 60 * 1000),
    roomId: "room-1",
  },
];

export const mockTickerSentimentData: TickerSentimentData[] = [
  {
    ticker: "NVDA",
    price: 789.5,
    change: 15.3,
    changePercent: 1.98,
    sentiment: 80,
    sentimentChange: 15,
    volume: 45623000,
    lastUpdate: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    ticker: "MSFT",
    price: 368.25,
    change: -2.15,
    changePercent: -0.58,
    sentiment: 58,
    sentimentChange: -14,
    volume: 28456000,
    lastUpdate: new Date(Date.now() - 3 * 60 * 1000),
  },
  {
    ticker: "GOOGL",
    price: 142.8,
    change: 1.95,
    changePercent: 1.38,
    sentiment: 67,
    sentimentChange: 3,
    volume: 15789000,
    lastUpdate: new Date(Date.now() - 8 * 60 * 1000),
  },
];

export const mockWatchlistRooms: WatchlistRoom[] = [
  {
    room: mockPrivateRooms[0],
    tickerData: mockTickerSentimentData,
    sentimentAlerts: mockSentimentAlerts,
  },
];

// Utility function to get user's watchlist tickers
export const getUserWatchlistTickers = (): string[] => {
  return [
    "NVDA",
    "MSFT",
    "GOOGL",
    "AAPL",
    "TSLA",
    "AMD",
    "META",
    "AMZN",
    "NFLX",
    "CRM",
  ];
};

// Utility function to check if user can create room
export const canUserCreateRoom = (
  currentRoomCount: number,
  userLimits: UserLimits,
): boolean => {
  return currentRoomCount < userLimits.maxPrivateRooms;
};

// Utility function to parse cashtags from message
export const parseCashtags = (content: string): string[] => {
  const cashtagRegex = /\$([A-Z]{1,5})/g;
  const matches = content.match(cashtagRegex);
  return matches ? matches.map((tag) => tag.substring(1)) : [];
};

// Utility function to format trade idea
export const formatTradeIdea = (idea: any): string => {
  const { ticker, action, entryPrice, targetPrice, stopLoss, sentiment } = idea;
  const emoji = sentiment === "bullish" ? "📈" : "📉";
  let formatted = `💬 ${action.toUpperCase()} $${ticker} at ${entryPrice}`;
  if (targetPrice) formatted += ` / Target ${targetPrice}`;
  if (stopLoss) formatted += ` / SL ${stopLoss}`;
  formatted += ` ${emoji} ${sentiment}`;
  return formatted;
};
