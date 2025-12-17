import { useState, useEffect, useCallback, useRef } from "react";
import {
  newsApi,
  rateLimitedNewsApi,
  NewsAPIResponse,
  NewsAPIArticle,
  NewsApiError,
  convertNewsAPIToNewsArticle,
} from "../services/newsApi";
import { stockDataFallback } from "../services/stockDataFallback";
import { NewsArticle } from "../data/mockData";
import { robustFetchJson, FetchError } from "../lib/robustFetch";

interface UseNewsOptions {
  refreshInterval?: number; // in milliseconds
  enabled?: boolean;
}

interface UseNewsResult {
  data: NewsAPIResponse | null;
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch top headlines
 */
export function useTopHeadlines(
  country: string = "us",
  category?:
    | "business"
    | "entertainment"
    | "general"
    | "health"
    | "science"
    | "sports"
    | "technology",
  options: UseNewsOptions = {},
): UseNewsResult {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<NewsAPIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchNews = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    // In development mode, provide immediate mock data to prevent FullStory fetch issues
    const isDevelopment = import.meta.env.DEV;
    if (isDevelopment) {
      const mockArticles = [
        {
          source: { id: "reuters", name: "Reuters" },
          author: "John Smith",
          title: "Markets Rally as Tech Earnings Beat Expectations (Mock)",
          description:
            "Major technology companies reported stronger-than-expected quarterly earnings, driving broad market gains.",
          url: "https://example.com/tech-earnings-rally",
          urlToImage: null,
          publishedAt: new Date(
            Date.now() - Math.random() * 24 * 60 * 60 * 1000,
          ).toISOString(),
          content: "Technology stocks led broader market gains today...",
        },
        {
          source: { id: "bloomberg", name: "Bloomberg" },
          author: "Jane Doe",
          title:
            "Federal Reserve Signals Cautious Approach to Interest Rates (Mock)",
          description:
            "Central bank officials indicate measured approach to monetary policy amid economic uncertainty.",
          url: "https://example.com/fed-interest-rates",
          urlToImage: null,
          publishedAt: new Date(
            Date.now() - Math.random() * 24 * 60 * 60 * 1000,
          ).toISOString(),
          content: "Federal Reserve officials signaled...",
        },
      ];

      const mockResponse = {
        status: "ok",
        totalResults: mockArticles.length,
        articles: mockArticles,
      };

      setData(mockResponse);
      setError("Development mode - using mock data");
      setLoading(false);
      return;
    }

    try {
      // Use the proxy server to fetch real news data
      const data = await robustFetchJson(
        `/api/proxy/newsapi/top-headlines?country=${country}&category=${category || "business"}&pageSize=20`,
        {
          retry: {
            maxRetries: 1,
            retryDelay: 2000,
            timeout: 12000,
          },
        },
      );

      // Check if the response contains valid articles
      if (
        data.status === "ok" &&
        data.articles &&
        Array.isArray(data.articles)
      ) {
        setData(data);
        stockDataFallback.setCachedData(
          `news_headlines_${country}_${category}`,
          data,
        );
      } else {
        // If invalid response structure, fall through to catch block
        throw new Error(`Invalid response structure: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      console.warn("News API proxy failed, falling back to mock data:", err);

      // Fallback to mock data if proxy fails
      const mockArticles = [
        {
          source: { id: "reuters", name: "Reuters" },
          author: "John Smith",
          title: "Markets Rally as Tech Earnings Beat Expectations",
          description:
            "Major technology companies reported stronger-than-expected quarterly earnings, driving broad market gains.",
          url: "https://example.com/tech-earnings-rally",
          urlToImage: null,
          publishedAt: new Date(
            Date.now() - Math.random() * 24 * 60 * 60 * 1000,
          ).toISOString(),
          content: "Technology stocks led broader market gains today...",
        },
        {
          source: { id: "bloomberg", name: "Bloomberg" },
          author: "Jane Doe",
          title: "Federal Reserve Signals Cautious Approach to Interest Rates",
          description:
            "Central bank officials indicate measured approach to monetary policy amid economic uncertainty.",
          url: "https://example.com/fed-interest-rates",
          urlToImage: null,
          publishedAt: new Date(
            Date.now() - Math.random() * 24 * 60 * 60 * 1000,
          ).toISOString(),
          content: "Federal Reserve officials signaled...",
        },
        {
          source: { id: "cnbc", name: "CNBC" },
          author: "Mike Johnson",
          title: "Cryptocurrency Market Shows Signs of Recovery",
          description:
            "Bitcoin and major altcoins post gains as institutional interest returns to digital assets.",
          url: "https://example.com/crypto-recovery",
          urlToImage: null,
          publishedAt: new Date(
            Date.now() - Math.random() * 24 * 60 * 60 * 1000,
          ).toISOString(),
          content: "The cryptocurrency market showed...",
        },
        {
          source: { id: "financial-times", name: "Financial Times" },
          author: "Sarah Wilson",
          title: "Global Supply Chain Shows Signs of Normalization",
          description:
            "International shipping costs decline as supply chain bottlenecks ease across major trade routes.",
          url: "https://example.com/supply-chain-update",
          urlToImage: null,
          publishedAt: new Date(
            Date.now() - Math.random() * 12 * 60 * 60 * 1000,
          ).toISOString(),
          content: "Supply chain improvements continue...",
        },
        {
          source: { id: "wall-street-journal", name: "Wall Street Journal" },
          author: "David Chen",
          title: "Energy Sector Posts Strong Quarterly Results",
          description:
            "Oil and gas companies report robust earnings as energy demand remains steady amid economic uncertainty.",
          url: "https://example.com/energy-earnings",
          urlToImage: null,
          publishedAt: new Date(
            Date.now() - Math.random() * 6 * 60 * 60 * 1000,
          ).toISOString(),
          content: "The energy sector's performance...",
        },
      ];

      const mockResponse = {
        status: "ok",
        totalResults: mockArticles.length,
        articles: mockArticles,
      };

      setData(mockResponse);
      setError("Using mock data - API proxy unavailable");
    } finally {
      setLoading(false);
    }
  }, [country, category, enabled]);

  useEffect(() => {
    if (enabled) {
      fetchNews();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(fetchNews, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchNews, refreshInterval, enabled]);

  const articles =
    data && data.articles
      ? data.articles.map((article) => convertNewsAPIToNewsArticle(article))
      : [];

  return {
    data,
    articles,
    loading,
    error,
    refetch: fetchNews,
  };
}

/**
 * Hook to search for news articles
 */
export function useNewsSearch(
  query: string,
  options: UseNewsOptions = {},
): UseNewsResult {
  const { refreshInterval = 0, enabled = true } = options;
  const [data, setData] = useState<NewsAPIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const searchNews = useCallback(async () => {
    if (!enabled || !query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Use the proxy server to search for real news data
      const data = await robustFetchJson(
        `/api/proxy/newsapi/everything?q=${encodeURIComponent(query)}&pageSize=20&sortBy=publishedAt`,
        {
          retry: {
            maxRetries: 1,
            retryDelay: 2000,
            timeout: 12000,
          },
        },
      );

      // Check if the response contains valid articles
      if (
        data.status === "ok" &&
        data.articles &&
        Array.isArray(data.articles)
      ) {
        setData(data);
        stockDataFallback.setCachedData(`news_search_${query}`, data);
      } else {
        // If invalid response structure, fall through to catch block
        throw new Error(
          `Invalid search response structure: ${JSON.stringify(data)}`,
        );
      }
    } catch (err) {
      console.warn("News search proxy failed, falling back to mock data:", err);

      // Fallback to mock search results
      const mockArticles = [
        {
          source: { id: "reuters", name: "Reuters" },
          author: "News Reporter",
          title: `Latest developments in ${query}: Market Analysis`,
          description: `Comprehensive analysis of recent ${query} trends and their market impact.`,
          url: `https://example.com/${query.replace(/\s+/g, "-").toLowerCase()}`,
          urlToImage: null,
          publishedAt: new Date(
            Date.now() - Math.random() * 12 * 60 * 60 * 1000,
          ).toISOString(),
          content: `Recent developments in ${query}...`,
        },
        {
          source: { id: "bloomberg", name: "Bloomberg" },
          author: "Market Analyst",
          title: `${query} Outlook: Expert Predictions and Analysis`,
          description: `Industry experts weigh in on the future prospects of ${query} in current market conditions.`,
          url: `https://example.com/${query.replace(/\s+/g, "-").toLowerCase()}-outlook`,
          urlToImage: null,
          publishedAt: new Date(
            Date.now() - Math.random() * 18 * 60 * 60 * 1000,
          ).toISOString(),
          content: `Experts predict that ${query}...`,
        },
      ];

      const mockResponse = {
        status: "ok",
        totalResults: mockArticles.length,
        articles: mockArticles,
      };

      setData(mockResponse);
      setError("Using mock data - API proxy unavailable");
    } finally {
      setLoading(false);
    }
  }, [query, enabled]);

  useEffect(() => {
    if (enabled && query.trim()) {
      searchNews();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(searchNews, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [searchNews, refreshInterval, enabled]);

  const articles =
    data && data.articles
      ? data.articles.map((article) => convertNewsAPIToNewsArticle(article))
      : [];

  return {
    data,
    articles,
    loading,
    error,
    refetch: searchNews,
  };
}

/**
 * Hook for business news specifically
 */
export function useBusinessNews(options: UseNewsOptions = {}) {
  return useTopHeadlines("us", "business", options);
}

/**
 * Hook for technology news specifically
 */
export function useTechnologyNews(options: UseNewsOptions = {}) {
  return useTopHeadlines("us", "technology", options);
}

/**
 * Hook for real-time news updates
 */
export function useRealTimeNews(
  category?: "business" | "technology",
  refreshIntervalMs: number = 300000, // 5 minutes
) {
  return useTopHeadlines("us", category, {
    refreshInterval: refreshIntervalMs,
    enabled: true,
  });
}
