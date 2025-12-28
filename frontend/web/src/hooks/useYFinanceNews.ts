import { useState, useEffect, useCallback, useRef } from "react";
import { NewsArticle } from "../data/mockData";
import { robustFetchJson, FetchError } from "../lib/robustFetch";

interface UseYFinanceNewsOptions {
  refreshInterval?: number; // in milliseconds
  enabled?: boolean;
}

interface UseYFinanceNewsResult {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface YFinanceNewsResponse {
  status: string;
  source: string;
  total: number;
  articles: Array<{
    id: string;
    headline: string;
    url: string;
    time: string;
    source: string;
    sentiment_score: number;
    symbol?: string;
  }>;
  error?: string;
}

/**
 * Hook to fetch YFinance news data
 */
export function useYFinanceNews(
  options: UseYFinanceNewsOptions = {},
): UseYFinanceNewsResult {
  const { refreshInterval = 0, enabled = true } = options;
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchYFinanceNews = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    // In development mode, provide immediate fallback to prevent FullStory fetch issues
    const isDevelopment = import.meta.env.DEV;
    if (isDevelopment) {
      setError("Development mode - API calls disabled");
      setLoading(false);
      return;
    }

    try {
      const data: YFinanceNewsResponse = await robustFetchJson(
        "/api/proxy/yfinance/news/latest",
        {
          retry: {
            maxRetries: 2,
            retryDelay: 1000,
            timeout: 10000,
          },
        },
      );

      if (data.error) {
        throw new Error(data.error);
      }

      // Convert YFinance articles to our NewsArticle format
      const convertedArticles: NewsArticle[] = data.articles.map((article) => ({
        id: article.id,
        headline: article.headline,
        summary: `Latest market news from ${article.source}. Click to read the full article.`,
        sentimentScore: Math.round(((article.sentiment_score + 1) / 2) * 100), // Convert -1,1 to 0,100
        keyPhrases: extractKeyPhrasesFromHeadline(article.headline),
        source: {
          name: article.source,
          publishedAt: formatYFinanceTime(article.time),
        },
        originalUrl: article.url,
        whyItMatters:
          "This financial news may impact market sentiment and trading decisions.",
        relatedTrends: [],
      }));

      setArticles(convertedArticles);
    } catch (err) {
      console.warn("YFinance news API failed:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch YFinance news";
      setError(errorMessage);

      // Fallback to empty array but preserve any existing articles
      // Don't clear articles on error to maintain user experience
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (enabled) {
      fetchYFinanceNews();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(fetchYFinanceNews, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchYFinanceNews, refreshInterval, enabled]);

  return {
    articles,
    loading,
    error,
    refetch: fetchYFinanceNews,
  };
}

/**
 * Extract key phrases from headline for display
 */
function extractKeyPhrasesFromHeadline(headline: string): string[] {
  const words = headline
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .filter(
      (word) =>
        ![
          "with",
          "from",
          "than",
          "that",
          "this",
          "they",
          "them",
          "their",
          "there",
          "then",
          "when",
          "where",
          "what",
          "will",
          "were",
          "been",
          "have",
          "said",
          "says",
          "would",
          "could",
          "should",
        ].includes(word),
    );

  return words.slice(0, 5);
}

/**
 * Format YFinance time string to ISO format
 */
function formatYFinanceTime(timeStr: string): string {
  if (!timeStr || timeStr === "Recently") {
    return new Date().toISOString();
  }

  try {
    // Handle relative time strings like "2 hours ago"
    if (timeStr.includes("ago")) {
      const now = new Date();

      if (timeStr.includes("minute")) {
        const minutes = parseInt(timeStr) || 1;
        now.setMinutes(now.getMinutes() - minutes);
      } else if (timeStr.includes("hour")) {
        const hours = parseInt(timeStr) || 1;
        now.setHours(now.getHours() - hours);
      } else if (timeStr.includes("day")) {
        const days = parseInt(timeStr) || 1;
        now.setDate(now.getDate() - days);
      }

      return now.toISOString();
    }

    // Try to parse as a date string
    const parsed = new Date(timeStr);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }

    // Fallback to current time
    return new Date().toISOString();
  } catch {
    return new Date().toISOString();
  }
}
