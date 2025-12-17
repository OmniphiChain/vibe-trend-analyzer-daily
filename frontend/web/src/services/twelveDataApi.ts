// Twelve Data API Service
// Documentation: https://twelvedata.com/docs

const API_KEY = "ff61abbc948c4555911fc88d218c9b6b";
const BASE_URL = "https://api.twelvedata.com";

// Twelve Data API Response Types
export interface TwelveDataQuote {
  symbol: string;
  name: string;
  exchange: string;
  mic_code: string;
  currency: string;
  datetime: string;
  timestamp: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  previous_close: string;
  change: string;
  percent_change: string;
  average_volume: string;
  is_market_open: boolean;
  fifty_two_week: {
    low: string;
    high: string;
    low_change: string;
    high_change: string;
    low_change_percent: string;
    high_change_percent: string;
    range: string;
  };
}

export interface TwelveDataTimeSeriesValue {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export interface TwelveDataTimeSeries {
  meta: {
    symbol: string;
    interval: string;
    currency: string;
    exchange_timezone: string;
    exchange: string;
    mic_code: string;
    type: string;
  };
  values: TwelveDataTimeSeriesValue[];
  status: string;
}

export interface TwelveDataMarketState {
  name: string;
  code: string;
  country: string;
  is_market_open: boolean;
  time_after_open: string;
  time_to_open: string;
  time_to_close: string;
}

export interface TwelveDataError {
  code: number;
  message: string;
  status: string;
}

// Custom error class
export class TwelveDataApiError extends Error {
  constructor(
    message: string,
    public code?: number,
    public status?: string,
  ) {
    super(message);
    this.name = "TwelveDataApiError";
  }
}

// API Service Class
class TwelveDataService {
  private baseURL = BASE_URL;
  private apiKey = API_KEY;

  private async fetchFromApi<T>(
    endpoint: string,
    params: Record<string, string> = {},
  ): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);

    // Add API key and other parameters
    url.searchParams.append("apikey", this.apiKey);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString());
      const data = await response.json();

      // Check for API errors
      if (data.status === "error" || data.code) {
        throw new TwelveDataApiError(
          data.message || "API request failed",
          data.code,
          data.status,
        );
      }

      if (!response.ok) {
        throw new TwelveDataApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof TwelveDataApiError) {
        throw error;
      }
      throw new TwelveDataApiError(
        `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Get real-time quote for a single symbol
   */
  async getQuote(symbol: string): Promise<TwelveDataQuote> {
    return this.fetchFromApi<TwelveDataQuote>("/quote", { symbol });
  }

  /**
   * Get real-time quotes for multiple symbols
   */
  async getQuotes(symbols: string[]): Promise<Record<string, TwelveDataQuote>> {
    const symbolString = symbols.join(",");
    const data = await this.fetchFromApi<Record<string, TwelveDataQuote>>(
      "/quote",
      {
        symbol: symbolString,
      },
    );

    // Handle single symbol response (not wrapped in object)
    if (symbols.length === 1 && !data[symbols[0]]) {
      return { [symbols[0]]: data as unknown as TwelveDataQuote };
    }

    return data;
  }

  /**
   * Get historical time series data
   */
  async getTimeSeries(
    symbol: string,
    interval:
      | "1min"
      | "5min"
      | "15min"
      | "30min"
      | "45min"
      | "1h"
      | "2h"
      | "4h"
      | "1day"
      | "1week"
      | "1month" = "1day",
    outputsize: number = 30,
  ): Promise<TwelveDataTimeSeries> {
    return this.fetchFromApi<TwelveDataTimeSeries>("/time_series", {
      symbol,
      interval,
      outputsize: outputsize.toString(),
    });
  }

  /**
   * Get market state information
   */
  async getMarketState(markets?: string[]): Promise<TwelveDataMarketState[]> {
    const params: Record<string, string> = {};
    if (markets && markets.length > 0) {
      params.code = markets.join(",");
    }

    return this.fetchFromApi<TwelveDataMarketState[]>("/market_state", params);
  }

  /**
   * Search for symbols
   */
  async symbolSearch(query: string): Promise<
    Array<{
      symbol: string;
      instrument_name: string;
      exchange: string;
      mic_code: string;
      exchange_timezone: string;
      instrument_type: string;
      country: string;
      currency: string;
    }>
  > {
    return this.fetchFromApi("/symbol_search", { symbol: query });
  }

  /**
   * Get logo URL for a symbol (if available)
   */
  getLogoUrl(
    symbol: string,
    size: "small" | "medium" | "large" = "medium",
  ): string {
    return `${this.baseURL}/logo/${symbol}?size=${size}&apikey=${this.apiKey}`;
  }
}

// Export singleton instance
export const twelveDataApi = new TwelveDataService();

// Utility functions to convert Twelve Data responses to our app's Ticker format
export function convertToTicker(
  quote: TwelveDataQuote,
  additionalData?: Partial<import("../types/social").Ticker>,
): import("../types/social").Ticker {
  const change = parseFloat(quote.change) || 0;
  const price = parseFloat(quote.close) || 0;
  const changePercent = parseFloat(quote.percent_change) || 0;
  const volume = parseFloat(quote.volume) || 0;

  return {
    symbol: quote.symbol,
    name: quote.name,
    type: "stock" as const,
    exchange: quote.exchange,
    price,
    change,
    changePercent,
    volume,
    sentimentScore: 0, // This would come from social sentiment analysis
    bullishCount: 0,
    bearishCount: 0,
    neutralCount: 0,
    totalPosts: 0,
    trendingScore: 0,
    postVolume24h: 0,
    sentimentChange24h: 0,
    lastUpdated: new Date(),
    ...additionalData,
  };
}

export function convertMultipleToTickers(
  quotes: Record<string, TwelveDataQuote>,
  additionalData?: Record<string, Partial<import("../types/social").Ticker>>,
): import("../types/social").Ticker[] {
  return Object.values(quotes).map((quote) =>
    convertToTicker(quote, additionalData?.[quote.symbol]),
  );
}

// Rate limiting helper (Twelve Data has rate limits)
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests: number = 800, timeWindowMs: number = 60000) {
    // 800 requests per minute for free tier
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  async checkLimit(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(
      (time) => now - time < this.timeWindow,
    );

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.timeWindow - (now - oldestRequest);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return this.checkLimit();
    }

    this.requests.push(now);
  }
}

export const rateLimiter = new RateLimiter();

// Enhanced API service with rate limiting
export class RateLimitedTwelveDataService extends TwelveDataService {
  async getQuote(symbol: string): Promise<TwelveDataQuote> {
    await rateLimiter.checkLimit();
    return super.getQuote(symbol);
  }

  async getQuotes(symbols: string[]): Promise<Record<string, TwelveDataQuote>> {
    await rateLimiter.checkLimit();
    return super.getQuotes(symbols);
  }

  async getTimeSeries(
    symbol: string,
    interval:
      | "1min"
      | "5min"
      | "15min"
      | "30min"
      | "45min"
      | "1h"
      | "2h"
      | "4h"
      | "1day"
      | "1week"
      | "1month" = "1day",
    outputsize: number = 30,
  ): Promise<TwelveDataTimeSeries> {
    await rateLimiter.checkLimit();
    return super.getTimeSeries(symbol, interval, outputsize);
  }
}

export const rateLimitedTwelveDataApi = new RateLimitedTwelveDataService();
