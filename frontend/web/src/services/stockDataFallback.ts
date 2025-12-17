import { Ticker } from "../types/social";
import { mockTickers, getMockTickerBySymbol } from "../data/socialMockData";
import { FinnhubApiError } from "./finnhubApi";
import { CoinMarketCapApiError } from "./coinMarketCapApi";
import { NewsApiError } from "./newsApi";

// Service to manage API fallbacks and caching
class StockDataFallbackService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private apiDisabled = false;
  private apiDisabledUntil: number | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly API_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

  // Check if API is currently disabled due to rate limits
  isApiDisabled(): boolean {
    if (this.apiDisabledUntil && Date.now() > this.apiDisabledUntil) {
      this.apiDisabled = false;
      this.apiDisabledUntil = null;
    }
    return this.apiDisabled;
  }

  // Disable API calls for a specified duration
  disableApi(durationMs: number = this.API_COOLDOWN): void {
    this.apiDisabled = true;
    this.apiDisabledUntil = Date.now() + durationMs;
    console.warn(
      `API disabled due to rate limits. Will retry after ${new Date(this.apiDisabledUntil).toLocaleString()}`,
    );
  }

  // Check if we should use cached data
  getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  // Cache API response
  setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Get mock ticker data as fallback
  getMockTicker(symbol: string): Ticker | null {
    const mockTicker = getMockTickerBySymbol(symbol);
    if (mockTicker) {
      return {
        ...mockTicker,
        lastUpdated: new Date(),
      };
    }

    // Create a basic mock ticker if not found
    return {
      symbol,
      name: `${symbol} Inc.`,
      type: "stock" as const,
      price: Math.random() * 1000 + 50,
      change: (Math.random() - 0.5) * 20,
      changePercent: (Math.random() - 0.5) * 5,
      volume: Math.floor(Math.random() * 10000000),
      sentimentScore: (Math.random() - 0.5) * 200,
      bullishCount: Math.floor(Math.random() * 1000),
      bearishCount: Math.floor(Math.random() * 1000),
      neutralCount: Math.floor(Math.random() * 1000),
      totalPosts: Math.floor(Math.random() * 3000),
      trendingScore: Math.random() * 10,
      postVolume24h: Math.floor(Math.random() * 1000),
      sentimentChange24h: (Math.random() - 0.5) * 50,
      lastUpdated: new Date(),
    };
  }

  // Get multiple mock tickers
  getMockTickers(symbols: string[]): Ticker[] {
    return symbols
      .map((symbol) => this.getMockTicker(symbol))
      .filter(Boolean) as Ticker[];
  }

  // Handle API errors and determine if we should disable the API
  handleApiError(error: any): boolean {
    if (
      error instanceof FinnhubApiError ||
      error instanceof CoinMarketCapApiError ||
      error instanceof NewsApiError
    ) {
      const message = error.message.toLowerCase();

      // Check for rate limit errors
      if (
        message.includes("run out of api credits") ||
        message.includes("rate limit") ||
        message.includes("daily limit") ||
        message.includes("api call limit") ||
        message.includes("credit limit") ||
        message.includes("quota exceeded")
      ) {
        this.disableApi();
        return true;
      }

      // Check for other errors that should temporarily disable the API
      if (
        message.includes("server error") ||
        message.includes("service unavailable") ||
        message.includes("internal server error") ||
        message.includes("bad gateway")
      ) {
        this.disableApi(60 * 60 * 1000); // 1 hour cooldown for server errors
        return true;
      }
    }

    return false;
  }

  // Get status information for display
  getStatus(): {
    apiDisabled: boolean;
    apiDisabledUntil: Date | null;
    cacheSize: number;
    message: string;
  } {
    return {
      apiDisabled: this.apiDisabled,
      apiDisabledUntil: this.apiDisabledUntil
        ? new Date(this.apiDisabledUntil)
        : null,
      cacheSize: this.cache.size,
      message: this.apiDisabled
        ? `API disabled due to rate limits. Will retry ${this.apiDisabledUntil ? `at ${new Date(this.apiDisabledUntil).toLocaleString()}` : "later"}`
        : "API available",
    };
  }

  // Clear cache manually
  clearCache(): void {
    this.cache.clear();
  }

  // Force enable API (for testing)
  enableApi(): void {
    this.apiDisabled = false;
    this.apiDisabledUntil = null;
  }
}

export const stockDataFallback = new StockDataFallbackService();
