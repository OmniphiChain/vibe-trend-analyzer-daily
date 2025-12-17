import type { WatchlistAsset, AIInsight, WatchlistStats } from "@/types/watchlist";

export const mockWatchlistAssets: WatchlistAsset[] = [
  {
    id: "aapl",
    ticker: "$AAPL",
    name: "Apple Inc.",
    type: "stock",
    currentPrice: 195.32,
    dailyChange: 4.67,
    dailyChangePercent: 2.45,
    sentimentScore: 78,
    sentimentTrend: "rising",
    aiInsight: "Sentiment rising due to strong Q4 earnings and positive 2024 guidance. AI chip development driving optimism.",
    lastUpdated: new Date(),
    volume: 85420000,
    marketCap: 3100000000000,
    logo: "🍎"
  },
  {
    id: "tsla",
    ticker: "$TSLA",
    name: "Tesla Inc.",
    type: "stock",
    currentPrice: 248.85,
    dailyChange: -12.35,
    dailyChangePercent: -4.73,
    sentimentScore: 42,
    sentimentTrend: "falling",
    aiInsight: "Bearish sentiment amid production concerns and increased competition in EV market. Awaiting delivery numbers.",
    lastUpdated: new Date(),
    volume: 127340000,
    marketCap: 790000000000,
    logo: "⚡"
  },
  {
    id: "btc",
    ticker: "$BTC",
    name: "Bitcoin",
    type: "crypto",
    currentPrice: 67842.50,
    dailyChange: 2156.33,
    dailyChangePercent: 3.28,
    sentimentScore: 85,
    sentimentTrend: "rising",
    aiInsight: "Institutional adoption accelerating. ETF inflows remain strong despite volatility concerns.",
    lastUpdated: new Date(),
    volume: 24500000000,
    marketCap: 1330000000000,
    logo: "₿"
  },
  {
    id: "eth",
    ticker: "$ETH",
    name: "Ethereum",
    type: "crypto",
    currentPrice: 3567.89,
    dailyChange: 89.42,
    dailyChangePercent: 2.57,
    sentimentScore: 72,
    sentimentTrend: "stable",
    aiInsight: "DeFi activity increasing post-Shanghai upgrade. Layer 2 solutions gaining traction among developers.",
    lastUpdated: new Date(),
    volume: 15800000000,
    marketCap: 428000000000,
    logo: "◊"
  },
  {
    id: "nvda",
    ticker: "$NVDA",
    name: "NVIDIA Corporation",
    type: "stock",
    currentPrice: 875.28,
    dailyChange: 31.45,
    dailyChangePercent: 3.73,
    sentimentScore: 89,
    sentimentTrend: "rising",
    aiInsight: "AI boom driving unprecedented demand. Data center revenue projections exceeding expectations significantly.",
    lastUpdated: new Date(),
    volume: 45230000,
    marketCap: 2150000000000,
    logo: "🔥"
  },
  {
    id: "googl",
    ticker: "$GOOGL",
    name: "Alphabet Inc.",
    type: "stock",
    currentPrice: 142.65,
    dailyChange: -2.18,
    dailyChangePercent: -1.50,
    sentimentScore: 58,
    sentimentTrend: "falling",
    aiInsight: "Mixed signals on AI integration progress. Search revenue stabilizing but cloud growth slower than expected.",
    lastUpdated: new Date(),
    volume: 32150000,
    marketCap: 1800000000000,
    logo: "🔍"
  }
];

export const mockAIInsights: AIInsight[] = [
  {
    id: "insight-1",
    ticker: "$AAPL",
    insight: "Technical analysis shows strong support at $190. Bullish momentum likely to continue through earnings season.",
    confidence: 87,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: "technical"
  },
  {
    id: "insight-2", 
    ticker: "$BTC",
    insight: "Whale accumulation detected. Large addresses adding positions suggests institutional confidence.",
    confidence: 92,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    category: "sentiment"
  },
  {
    id: "insight-3",
    ticker: "$NVDA",
    insight: "Earnings pre-announcement likely within 2 weeks. Historical patterns suggest positive surprise potential.",
    confidence: 78,
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    category: "earnings"
  }
];

export const mockWatchlistStats: WatchlistStats = {
  totalAssets: 6,
  totalValue: 125847.50,
  dailyPnL: 3240.89,
  avgSentiment: 71,
  topPerformer: "$NVDA",
  worstPerformer: "$TSLA"
};

// Utility functions
export const getSentimentEmoji = (score: number): string => {
  if (score >= 70) return "😃";
  if (score >= 50) return "😐";
  return "😟";
};

export const getSentimentColor = (score: number): string => {
  if (score >= 70) return "emerald";
  if (score >= 50) return "yellow";
  return "red";
};

export const formatCurrency = (value: number, type: 'stock' | 'crypto'): string => {
  if (type === 'crypto' && value > 1000) {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${value.toFixed(2)}`;
};

export const formatLargeNumber = (value: number): string => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
};
