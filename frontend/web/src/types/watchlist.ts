export interface WatchlistAsset {
  id: string;
  ticker: string;
  name: string;
  type: 'stock' | 'crypto';
  currentPrice: number;
  dailyChange: number;
  dailyChangePercent: number;
  sentimentScore: number;
  sentimentTrend: 'rising' | 'falling' | 'stable';
  aiInsight: string;
  lastUpdated: Date;
  volume?: number;
  marketCap?: number;
  logo?: string;
}

export interface SentimentData {
  score: number;
  emoji: string;
  color: string;
  trend: number[];
  lastUpdated: Date;
}

export interface WatchlistStats {
  totalAssets: number;
  totalValue: number;
  dailyPnL: number;
  avgSentiment: number;
  topPerformer: string;
  worstPerformer: string;
}

export type SentimentLevel = 'bullish' | 'neutral' | 'bearish';

export interface AIInsight {
  id: string;
  ticker: string;
  insight: string;
  confidence: number;
  timestamp: Date;
  category: 'earnings' | 'news' | 'technical' | 'sentiment' | 'general';
}
