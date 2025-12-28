// Geo-Sentiment Types

export interface CountrySentiment {
  country: string;
  countryCode: string;
  continent: 'americas' | 'europe' | 'asia' | 'africa' | 'oceania';
  bullish: number;
  bearish: number;
  neutral: number;
  moodScore: number;
  topTickers: string[];
  discussions: number;
  marketReturn: number;
  coordinates: [number, number]; // [lat, lng]
  lastUpdated: Date;
  sentimentSources: {
    news: number;
    social: number;
    community: number;
  };
  economicIndicators: {
    gdpGrowth: number;
    inflation: number;
    unemployment: number;
  };
}

export interface FilterOptions {
  assetType: 'all' | 'stocks' | 'crypto' | 'etfs';
  source: 'all' | 'news' | 'social' | 'community';
  timeframe: 'today' | '7d' | '30d';
  region: 'all' | 'americas' | 'europe' | 'asia' | 'oceania' | 'africa';
}

export interface GeoSentimentAnalytics {
  totalCountries: number;
  averageMoodScore: number;
  totalDiscussions: number;
  averageMarketReturn: number;
  topBullishCountries: CountrySentiment[];
  topBearishCountries: CountrySentiment[];
  sentimentDistribution: {
    bullish: number;
    neutral: number;
    bearish: number;
  };
  topTickers: { ticker: string; mentions: number }[];
  regionalBreakdown: { [key: string]: { moodScore: number; countries: number } };
}

export interface GeoSentimentCorrelation {
  country: string;
  correlation: number; // Correlation between sentiment and market performance
}

export interface SentimentTrend {
  date: string;
  country: string;
  moodScore: number;
  marketReturn: number;
}

export interface RegionalData {
  region: string;
  countries: CountrySentiment[];
  averageMoodScore: number;
  totalDiscussions: number;
  topTickers: string[];
}

export interface GeoMapTooltipData {
  country: CountrySentiment;
  visible: boolean;
  position: { x: number; y: number };
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'png';
  includeCharts: boolean;
  dateRange: {
    from: Date;
    to: Date;
  };
  regions: string[];
}

export interface SentimentHeatmapConfig {
  colorScheme: 'default' | 'red-green' | 'blue-orange';
  showLabels: boolean;
  showTooltips: boolean;
  animationDuration: number;
}

export interface GeoSentimentState {
  data: CountrySentiment[];
  filteredData: CountrySentiment[];
  filters: FilterOptions;
  selectedCountry: CountrySentiment | null;
  hoveredCountry: CountrySentiment | null;
  analytics: GeoSentimentAnalytics | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// API Response Types
export interface GeoSentimentAPIResponse {
  success: boolean;
  data: CountrySentiment[];
  meta: {
    totalCountries: number;
    lastUpdated: string;
    apiVersion: string;
  };
  error?: string;
}

export interface GeoSentimentUpdatePayload {
  countryCode: string;
  sentiment: {
    bullish: number;
    bearish: number;
    neutral: number;
  };
  tickers: string[];
  source: 'news' | 'social' | 'community' | 'ai';
}

// Hook return types
export interface UseGeoSentimentReturn {
  data: CountrySentiment[];
  analytics: GeoSentimentAnalytics | null;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  selectedCountry: CountrySentiment | null;
  setSelectedCountry: (country: CountrySentiment | null) => void;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  exportData: (format: 'csv' | 'json') => string;
}

// Utility types
export type SentimentLevel = 'bullish' | 'neutral' | 'bearish';
export type ContinentCode = 'americas' | 'europe' | 'asia' | 'africa' | 'oceania';
export type AssetType = 'stocks' | 'crypto' | 'etfs';
export type DataSource = 'news' | 'social' | 'community';
export type TimeframeOption = 'today' | '7d' | '30d';

// Constants
export const SENTIMENT_COLORS = {
  bullish: '#4CAF50',
  neutral: '#FFC107', 
  bearish: '#F44336'
} as const;

export const CONTINENT_LABELS = {
  americas: 'Americas',
  europe: 'Europe', 
  asia: 'Asia',
  africa: 'Africa',
  oceania: 'Oceania'
} as const;

export const ASSET_TYPE_LABELS = {
  all: 'All Assets',
  stocks: 'Stocks',
  crypto: 'Cryptocurrency',
  etfs: 'ETFs'
} as const;

export const SOURCE_LABELS = {
  all: 'All Sources',
  news: 'News Articles',
  social: 'Social Media',
  community: 'Community Polls'
} as const;

export const TIMEFRAME_LABELS = {
  today: 'Today',
  '7d': '7 Days',
  '30d': '30 Days'
} as const;
