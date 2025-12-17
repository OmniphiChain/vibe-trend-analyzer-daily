export interface FinnhubSymbolLookupResult {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

export interface FinnhubSymbolLookupResponse {
  count: number;
  result: FinnhubSymbolLookupResult[];
}

export interface FinnhubQuoteResponse {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
}

export interface FinnhubCandleResponse {
  c: number[]; // Close prices
  h: number[]; // High prices
  l: number[]; // Low prices
  o: number[]; // Open prices
  s: string; // Status
  t: number[]; // Timestamps
  v: number[]; // Volumes
}

export class FinnhubApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FinnhubApiError";
  }
}

// For backward compatibility during transition
export class PolygonApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PolygonApiError";
  }
}

export class AlphaVantageApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AlphaVantageApiError";
  }
}

class FinnhubApiService {
  private baseUrl = "/api/proxy/finnhub";
  private circuitBreaker = {
    isOpen: false,
    failureCount: 0,
    threshold: 3,
    timeout: 300000, // 5 minutes
    lastFailureTime: 0,
  };

  private async fetchFromApi<T>(
    endpoint: string,
    params: Record<string, string> = {},
  ): Promise<T> {
    // Check circuit breaker
    if (this.circuitBreaker.isOpen) {
      const now = Date.now();
      if (
        now - this.circuitBreaker.lastFailureTime <
        this.circuitBreaker.timeout
      ) {
        throw new FinnhubApiError(
          "Finnhub service temporarily unavailable - circuit breaker is open",
        );
      } else {
        // Reset circuit breaker
        this.circuitBreaker.isOpen = false;
        this.circuitBreaker.failureCount = 0;
      }
    }
    const queryParams = new URLSearchParams(params);
    const url = `${this.baseUrl}${endpoint}?${queryParams.toString()}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        this.circuitBreaker.failureCount++;
        this.circuitBreaker.lastFailureTime = Date.now();

        if (this.circuitBreaker.failureCount >= this.circuitBreaker.threshold) {
          this.circuitBreaker.isOpen = true;
        }

        throw new FinnhubApiError(`Finnhub API error: ${response.status}`);
      }

      const data = await response.json();

      // Check for API error messages
      if (data.error) {
        this.circuitBreaker.failureCount++;
        this.circuitBreaker.lastFailureTime = Date.now();

        if (this.circuitBreaker.failureCount >= this.circuitBreaker.threshold) {
          this.circuitBreaker.isOpen = true;
        }

        throw new FinnhubApiError(data.error || "Finnhub API error");
      }

      // Reset failure count on success
      this.circuitBreaker.failureCount = 0;
      return data;
    } catch (error) {
      // Update circuit breaker on network error
      if (!(error instanceof FinnhubApiError)) {
        this.circuitBreaker.failureCount++;
        this.circuitBreaker.lastFailureTime = Date.now();

        if (this.circuitBreaker.failureCount >= this.circuitBreaker.threshold) {
          this.circuitBreaker.isOpen = true;
        }
      }

      throw error;
    }
  }

  /**
   * Search for symbols (symbol lookup)
   */
  async symbolLookup(query: string): Promise<FinnhubSymbolLookupResponse> {
    return this.fetchFromApi<FinnhubSymbolLookupResponse>("/symbol-lookup", {
      query,
    });
  }

  /**
   * Get real-time quote for a symbol
   */
  async getQuote(symbol: string): Promise<FinnhubQuoteResponse> {
    return this.fetchFromApi<FinnhubQuoteResponse>("/quote", {
      symbol,
    });
  }

  /**
   * Get candlestick data for a symbol
   */
  async getCandles(
    symbol: string,
    resolution: string = "D",
    from?: number,
    to?: number,
  ): Promise<FinnhubCandleResponse> {
    const params: Record<string, string> = {
      symbol,
      resolution,
    };

    if (from) params.from = from.toString();
    if (to) params.to = to.toString();

    return this.fetchFromApi<FinnhubCandleResponse>("/candles", params);
  }
}

export const finnhubApi = new FinnhubApiService();
