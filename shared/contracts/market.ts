/**
 * Market Data API Contracts
 *
 * Types for market data, news, and external API integrations.
 */

// =============================================================================
// News Types
// =============================================================================

export interface NewsSource {
  id: string | null;
  name: string;
}

export interface NewsArticle {
  source: NewsSource;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: 'ok' | 'error';
  totalResults: number;
  articles: NewsArticle[];
}

// =============================================================================
// Cryptocurrency Types
// =============================================================================

export interface CryptoQuote {
  price: number;
  volume_24h: number;
  volume_change_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  market_cap: number;
  market_cap_dominance: number;
  fully_diluted_market_cap: number;
  last_updated: string;
}

export interface CryptoListing {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmc_rank: number;
  num_market_pairs: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  last_updated: string;
  date_added: string;
  tags: string[];
  quote: {
    USD: CryptoQuote;
  };
}

export interface CryptoListingsResponse {
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
  };
  data: CryptoListing[];
}

export interface GlobalMetrics {
  active_cryptocurrencies: number;
  total_cryptocurrencies: number;
  active_exchanges: number;
  btc_dominance: number;
  eth_dominance: number;
  defi_volume_24h: number;
  defi_market_cap: number;
  stablecoin_volume_24h: number;
  stablecoin_market_cap: number;
  quote: {
    USD: {
      total_market_cap: number;
      total_volume_24h: number;
      altcoin_market_cap: number;
      last_updated: string;
    };
  };
}

// =============================================================================
// Stock Types
// =============================================================================

export interface StockQuote {
  c: number;  // Current price
  d: number;  // Change
  dp: number; // Percent change
  h: number;  // High price of the day
  l: number;  // Low price of the day
  o: number;  // Open price of the day
  pc: number; // Previous close price
  t: number;  // Timestamp
}

export interface StockCandles {
  c: number[];  // Close prices
  h: number[];  // High prices
  l: number[];  // Low prices
  o: number[];  // Open prices
  s: string;    // Status
  t: number[];  // Timestamps
  v: number[];  // Volume
}

export interface SymbolLookupResult {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

export interface SymbolLookupResponse {
  count: number;
  result: SymbolLookupResult[];
}

// =============================================================================
// Trending Types
// =============================================================================

export interface TwitterTrend {
  name: string;
  url: string;
  query: string;
  tweet_volume: number | null;
}

export interface TwitterTrendingResponse {
  trends: TwitterTrend[];
  as_of: string;
  created_at: string;
  locations: Array<{
    name: string;
    woeid: number;
  }>;
}

// =============================================================================
// Sentiment Types (Market-specific)
// =============================================================================

export interface MarketSentiment {
  ticker: string;
  sentiment_score: number;
  sentiment_label: 'very_bullish' | 'bullish' | 'neutral' | 'bearish' | 'very_bearish';
  social_mentions: number;
  news_sentiment: number;
  technical_sentiment: number;
  volume_trend: 'increasing' | 'stable' | 'decreasing';
  last_updated: string;
}

export interface MarketMoodIndex {
  overall_score: number;
  fear_greed_index: number;
  volatility_index: number;
  momentum_index: number;
  social_sentiment: number;
  news_sentiment: number;
  timestamp: string;
}
