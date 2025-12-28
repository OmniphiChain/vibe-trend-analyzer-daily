import { useState, useEffect, useCallback } from "react";
import { useTopHeadlines, useNewsSearch } from "./useNewsApi";
import { useSerpTopNews, useSerpNewsSearch } from "./useSerpApi";
import { NewsArticle } from "../data/mockData";

interface UseCombinedNewsOptions {
  refreshInterval?: number;
  enabled?: boolean;
  includeNewsApi?: boolean;
  includeSerpApi?: boolean;
  maxArticles?: number;
}

interface UseCombinedNewsResult {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  sources: {
    newsApi: {
      articles: NewsArticle[];
      loading: boolean;
      error: string | null;
    };
    serpApi: {
      articles: NewsArticle[];
      loading: boolean;
      error: string | null;
    };
  };
}

/**
 * Hook that combines news from both NewsAPI and SerpAPI
 */
export function useCombinedTopNews(
  options: UseCombinedNewsOptions = {},
): UseCombinedNewsResult {
  const {
    refreshInterval = 0,
    enabled = true,
    includeNewsApi = true,
    includeSerpApi = true,
    maxArticles = 40,
  } = options;

  // Fetch from NewsAPI
  const newsApiResult = useTopHeadlines("us", "business", {
    refreshInterval,
    enabled: enabled && includeNewsApi,
  });

  // Fetch from SerpAPI
  const serpApiResult = useSerpTopNews({
    refreshInterval,
    enabled: enabled && includeSerpApi,
  });

  const [combinedArticles, setCombinedArticles] = useState<NewsArticle[]>([]);
  const [combinedError, setCombinedError] = useState<string | null>(null);

  // Combine and deduplicate articles
  const combineArticles = useCallback(() => {
    const allArticles: NewsArticle[] = [];
    const errors: string[] = [];

    // Add NewsAPI articles
    if (includeNewsApi && newsApiResult.articles.length > 0) {
      allArticles.push(...newsApiResult.articles);
    }
    if (includeNewsApi && newsApiResult.error) {
      errors.push(`NewsAPI: ${newsApiResult.error}`);
    }

    // Add SerpAPI articles
    if (includeSerpApi && serpApiResult.articles.length > 0) {
      allArticles.push(...serpApiResult.articles);
    }
    if (includeSerpApi && serpApiResult.error) {
      errors.push(`SerpAPI: ${serpApiResult.error}`);
    }

    // Deduplicate by headline similarity (simple approach)
    const uniqueArticles = allArticles.filter((article, index, arr) => {
      return (
        arr.findIndex(
          (other) =>
            other.headline.toLowerCase().trim() ===
            article.headline.toLowerCase().trim(),
        ) === index
      );
    });

    // Sort by published date (newest first)
    uniqueArticles.sort(
      (a, b) =>
        new Date(b.source.publishedAt).getTime() -
        new Date(a.source.publishedAt).getTime(),
    );

    // Limit the number of articles
    const limitedArticles = uniqueArticles.slice(0, maxArticles);

    setCombinedArticles(limitedArticles);
    setCombinedError(errors.length > 0 ? errors.join("; ") : null);
  }, [
    newsApiResult.articles,
    newsApiResult.error,
    serpApiResult.articles,
    serpApiResult.error,
    includeNewsApi,
    includeSerpApi,
    maxArticles,
  ]);

  useEffect(() => {
    combineArticles();
  }, [combineArticles]);

  const refetch = useCallback(async () => {
    const promises: Promise<void>[] = [];

    if (includeNewsApi) {
      promises.push(newsApiResult.refetch());
    }

    if (includeSerpApi) {
      promises.push(serpApiResult.refetch());
    }

    await Promise.all(promises);
  }, [
    newsApiResult.refetch,
    serpApiResult.refetch,
    includeNewsApi,
    includeSerpApi,
  ]);

  return {
    articles: combinedArticles,
    loading:
      (includeNewsApi ? newsApiResult.loading : false) ||
      (includeSerpApi ? serpApiResult.loading : false),
    error: combinedError,
    refetch,
    sources: {
      newsApi: {
        articles: newsApiResult.articles,
        loading: newsApiResult.loading,
        error: newsApiResult.error,
      },
      serpApi: {
        articles: serpApiResult.articles,
        loading: serpApiResult.loading,
        error: serpApiResult.error,
      },
    },
  };
}

/**
 * Hook that combines news search from both NewsAPI and SerpAPI
 */
export function useCombinedNewsSearch(
  query: string,
  options: UseCombinedNewsOptions = {},
): UseCombinedNewsResult {
  const {
    refreshInterval = 0,
    enabled = true,
    includeNewsApi = true,
    includeSerpApi = true,
    maxArticles = 40,
  } = options;

  // Search from NewsAPI
  const newsApiResult = useNewsSearch(query, {
    refreshInterval,
    enabled: enabled && includeNewsApi,
  });

  // Search from SerpAPI
  const serpApiResult = useSerpNewsSearch(query, {
    refreshInterval,
    enabled: enabled && includeSerpApi,
  });

  const [combinedArticles, setCombinedArticles] = useState<NewsArticle[]>([]);
  const [combinedError, setCombinedError] = useState<string | null>(null);

  // Combine and deduplicate articles
  const combineArticles = useCallback(() => {
    const allArticles: NewsArticle[] = [];
    const errors: string[] = [];

    // Add NewsAPI articles
    if (includeNewsApi && newsApiResult.articles.length > 0) {
      allArticles.push(...newsApiResult.articles);
    }
    if (includeNewsApi && newsApiResult.error) {
      errors.push(`NewsAPI: ${newsApiResult.error}`);
    }

    // Add SerpAPI articles
    if (includeSerpApi && serpApiResult.articles.length > 0) {
      allArticles.push(...serpApiResult.articles);
    }
    if (includeSerpApi && serpApiResult.error) {
      errors.push(`SerpAPI: ${serpApiResult.error}`);
    }

    // Deduplicate by headline similarity
    const uniqueArticles = allArticles.filter((article, index, arr) => {
      return (
        arr.findIndex(
          (other) =>
            other.headline.toLowerCase().trim() ===
            article.headline.toLowerCase().trim(),
        ) === index
      );
    });

    // Sort by published date (newest first)
    uniqueArticles.sort(
      (a, b) =>
        new Date(b.source.publishedAt).getTime() -
        new Date(a.source.publishedAt).getTime(),
    );

    // Limit the number of articles
    const limitedArticles = uniqueArticles.slice(0, maxArticles);

    setCombinedArticles(limitedArticles);
    setCombinedError(errors.length > 0 ? errors.join("; ") : null);
  }, [
    newsApiResult.articles,
    newsApiResult.error,
    serpApiResult.articles,
    serpApiResult.error,
    includeNewsApi,
    includeSerpApi,
    maxArticles,
  ]);

  useEffect(() => {
    combineArticles();
  }, [combineArticles]);

  const refetch = useCallback(async () => {
    const promises: Promise<void>[] = [];

    if (includeNewsApi) {
      promises.push(newsApiResult.refetch());
    }

    if (includeSerpApi) {
      promises.push(serpApiResult.refetch());
    }

    await Promise.all(promises);
  }, [
    newsApiResult.refetch,
    serpApiResult.refetch,
    includeNewsApi,
    includeSerpApi,
  ]);

  return {
    articles: combinedArticles,
    loading:
      (includeNewsApi ? newsApiResult.loading : false) ||
      (includeSerpApi ? serpApiResult.loading : false),
    error: combinedError,
    refetch,
    sources: {
      newsApi: {
        articles: newsApiResult.articles,
        loading: newsApiResult.loading,
        error: newsApiResult.error,
      },
      serpApi: {
        articles: serpApiResult.articles,
        loading: serpApiResult.loading,
        error: serpApiResult.error,
      },
    },
  };
}

/**
 * Hook for combined business news
 */
export function useCombinedBusinessNews(options: UseCombinedNewsOptions = {}) {
  return useCombinedNewsSearch("business", options);
}

/**
 * Hook for combined technology news
 */
export function useCombinedTechnologyNews(
  options: UseCombinedNewsOptions = {},
) {
  return useCombinedNewsSearch("technology", options);
}

/**
 * Hook for combined cryptocurrency news
 */
export function useCombinedCryptoNews(options: UseCombinedNewsOptions = {}) {
  return useCombinedNewsSearch("cryptocurrency bitcoin", options);
}
