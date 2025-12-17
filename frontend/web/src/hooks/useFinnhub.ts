import { useState, useEffect, useCallback, useRef } from "react";
import {
  finnhubApi,
  type FinnhubSymbolLookupResponse,
  type FinnhubQuoteResponse,
  type FinnhubCandleResponse,
} from "../services/finnhubApi";
import { stockDataFallback } from "../services/stockDataFallback";

interface UseFinnhubOptions {
  refreshInterval?: number;
  enabled?: boolean;
}

interface UseFinnhubSymbolLookupResult {
  data: FinnhubSymbolLookupResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseFinnhubQuoteResult {
  data: FinnhubQuoteResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseFinnhubCandleResult {
  data: FinnhubCandleResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to search for symbols
 */
export function useFinnhubSymbolLookup(
  query: string,
  options: UseFinnhubOptions = {},
): UseFinnhubSymbolLookupResult {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<FinnhubSymbolLookupResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchSymbolLookup = useCallback(async () => {
    if (!enabled || !query) return;

    setLoading(true);
    setError(null);

    try {
      const response = await finnhubApi.symbolLookup(query);
      setData(response);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch symbol lookup:", error);

      // Fallback to mock data if API fails
      const mockSymbols = [
        "AAPL",
        "MSFT",
        "GOOGL",
        "AMZN",
        "TSLA",
        "META",
        "NVDA",
        "NFLX",
        "V",
        "JPM",
      ];
      const filteredSymbols = mockSymbols.filter((symbol) =>
        symbol.toLowerCase().includes(query.toLowerCase()),
      );

      const mockResponse: FinnhubSymbolLookupResponse = {
        count: filteredSymbols.length,
        result: filteredSymbols.map((symbol) => ({
          description: `${symbol} - Mock Company`,
          displaySymbol: symbol,
          symbol: symbol,
          type: "Common Stock",
        })),
      };

      setData(mockResponse);
      setError(
        error instanceof Error
          ? error.message + " - using fallback data"
          : "Failed to fetch symbol lookup - using fallback data",
      );
    } finally {
      setLoading(false);
    }
  }, [query, enabled]);

  useEffect(() => {
    if (enabled && query) {
      fetchSymbolLookup();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(fetchSymbolLookup, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchSymbolLookup, refreshInterval, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchSymbolLookup,
  };
}

/**
 * Hook to fetch real-time quote for a symbol
 */
export function useFinnhubQuote(
  symbol: string,
  options: UseFinnhubOptions = {},
): UseFinnhubQuoteResult {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<FinnhubQuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchQuote = useCallback(async () => {
    if (!enabled || !symbol) return;

    setLoading(true);
    setError(null);

    try {
      const response = await finnhubApi.getQuote(symbol);
      setData(response);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch quote:", error);

      // Fallback to mock data if API fails
      const mockTickers = stockDataFallback.getMockTickers([symbol]);
      const mockTicker = mockTickers.find((t) => t.symbol === symbol);

      if (mockTicker) {
        const mockQuote: FinnhubQuoteResponse = {
          c: mockTicker.price, // Current price
          d: (mockTicker.changePercent * mockTicker.price) / 100, // Change
          dp: mockTicker.changePercent, // Percent change
          h: mockTicker.price * 1.02, // High (mock as 2% above current)
          l: mockTicker.price * 0.98, // Low (mock as 2% below current)
          o: mockTicker.price * 0.995, // Open (mock as slightly below current)
          pc:
            mockTicker.price -
            (mockTicker.changePercent * mockTicker.price) / 100, // Previous close
          t: Date.now() / 1000, // Timestamp
        };
        setData(mockQuote);
      } else {
        setData(null);
      }

      setError(
        error instanceof Error
          ? error.message + " - using fallback data"
          : "Failed to fetch quote - using fallback data",
      );
    } finally {
      setLoading(false);
    }
  }, [symbol, enabled]);

  useEffect(() => {
    if (enabled && symbol) {
      fetchQuote();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(fetchQuote, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchQuote, refreshInterval, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchQuote,
  };
}

/**
 * Hook to fetch candlestick data for a symbol
 */
export function useFinnhubCandles(
  symbol: string,
  resolution: string = "D",
  from?: number,
  to?: number,
  options: UseFinnhubOptions = {},
): UseFinnhubCandleResult {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<FinnhubCandleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchCandles = useCallback(async () => {
    if (!enabled || !symbol) return;

    setLoading(true);
    setError(null);

    try {
      const response = await finnhubApi.getCandles(
        symbol,
        resolution,
        from,
        to,
      );
      setData(response);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch candles:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch candle data",
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [symbol, resolution, from, to, enabled]);

  useEffect(() => {
    if (enabled && symbol) {
      fetchCandles();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(fetchCandles, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchCandles, refreshInterval, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchCandles,
  };
}

// Backward compatibility aliases
export function useQuote(symbol: string, options: UseFinnhubOptions = {}) {
  return useFinnhubQuote(symbol, options);
}

export function useMultipleQuotes(
  symbols: string[],
  refreshIntervalMs: number = 300000,
) {
  const results: Record<string, UseFinnhubQuoteResult> = {};

  symbols.forEach((symbol) => {
    results[symbol] = useFinnhubQuote(symbol, {
      refreshInterval: refreshIntervalMs,
      enabled: true,
    });
  });

  return results;
}
