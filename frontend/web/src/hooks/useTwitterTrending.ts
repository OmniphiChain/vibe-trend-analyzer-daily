import { useState, useEffect, useCallback, useRef } from "react";

interface UseTwitterTrendingOptions {
  enabled?: boolean;
  refreshInterval?: number;
  woeid?: number; // Where On Earth ID (1 = worldwide, 23424977 = United States)
}

interface TwitterTrend {
  name: string;
  url: string;
  promoted_content?: string;
  query: string;
  tweet_volume?: number;
}

interface TwitterTrendingResponse {
  trends: TwitterTrend[];
  as_of: string;
  created_at: string;
  locations: Array<{
    name: string;
    woeid: number;
  }>;
}

interface TwitterSearchTweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  public_metrics: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
  };
  context_annotations?: Array<{
    domain: { id: string; name: string; description: string };
    entity: { id: string; name: string; description?: string };
  }>;
  entities?: {
    hashtags?: Array<{ start: number; end: number; tag: string }>;
    mentions?: Array<{
      start: number;
      end: number;
      username: string;
      id: string;
    }>;
    urls?: Array<{
      start: number;
      end: number;
      url: string;
      expanded_url: string;
      display_url: string;
    }>;
    cashtags?: Array<{ start: number; end: number; tag: string }>;
  };
}

interface TwitterSearchUser {
  id: string;
  name: string;
  username: string;
  verified: boolean;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
}

interface TwitterSearchResponse {
  data?: TwitterSearchTweet[];
  includes?: {
    users?: TwitterSearchUser[];
  };
  meta?: {
    result_count: number;
    newest_id?: string;
    oldest_id?: string;
    next_token?: string;
  };
}

interface UseTwitterTrendingResult {
  trending: TwitterTrend[];
  recentTweets: Array<TwitterSearchTweet & { user?: TwitterSearchUser }>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  searchTweets: (query: string) => Promise<void>;
}

/**
 * Hook to fetch what's happening on Twitter - trending topics and recent tweets
 */
export function useTwitterTrending(
  options: UseTwitterTrendingOptions = {},
): UseTwitterTrendingResult {
  const { enabled = true, refreshInterval = 0, woeid = 1 } = options;
  const [trending, setTrending] = useState<TwitterTrend[]>([]);
  const [recentTweets, setRecentTweets] = useState<
    Array<TwitterSearchTweet & { user?: TwitterSearchUser }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchTrending = useCallback(async () => {
    if (!enabled) return;

    try {
      const response = await fetch(
        `/api/proxy/twitter/trending?woeid=${woeid}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TwitterTrendingResponse[] = await response.json();

      if (data && data.length > 0 && data[0].trends) {
        // Filter out promoted content and limit to 10 trends
        const filteredTrends = data[0].trends
          .filter((trend) => !trend.promoted_content)
          .slice(0, 10);
        setTrending(filteredTrends);
      } else {
        setTrending([]);
      }
    } catch (err) {
      console.warn("Twitter trending API failed:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch trending topics";

      // Fallback to mock trending data
      const mockTrending: TwitterTrend[] = [
        { name: "#Finance", url: "", query: "#Finance", tweet_volume: 125000 },
        {
          name: "#StockMarket",
          url: "",
          query: "#StockMarket",
          tweet_volume: 98000,
        },
        { name: "#Crypto", url: "", query: "#Crypto", tweet_volume: 87000 },
        {
          name: "#TradingTips",
          url: "",
          query: "#TradingTips",
          tweet_volume: 45000,
        },
        {
          name: "#Investing",
          url: "",
          query: "#Investing",
          tweet_volume: 67000,
        },
        { name: "#Bitcoin", url: "", query: "#Bitcoin", tweet_volume: 156000 },
        {
          name: "#MarketNews",
          url: "",
          query: "#MarketNews",
          tweet_volume: 34000,
        },
        { name: "#FinTech", url: "", query: "#FinTech", tweet_volume: 28000 },
        {
          name: "#WallStreet",
          url: "",
          query: "#WallStreet",
          tweet_volume: 41000,
        },
        { name: "#Economy", url: "", query: "#Economy", tweet_volume: 72000 },
      ];
      setTrending(mockTrending);
      setError("Twitter API rate limited - using sample data");
    }
  }, [enabled, woeid]);

  const fetchRecentTweets = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/proxy/twitter/search/recent?query=finance%20OR%20stocks%20OR%20markets%20OR%20trading&max_results=20",
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TwitterSearchResponse = await response.json();

      if (data.data && data.includes?.users) {
        // Combine tweets with user data
        const tweetsWithUsers = data.data.map((tweet) => {
          const user = data.includes?.users?.find(
            (u) => u.id === tweet.author_id,
          );
          return { ...tweet, user };
        });
        setRecentTweets(tweetsWithUsers);
      } else {
        setRecentTweets([]);
      }
    } catch (err) {
      console.warn("Twitter search API failed:", err);

      // Fallback to mock tweet data
      const mockTweets: Array<
        TwitterSearchTweet & { user?: TwitterSearchUser }
      > = [
        {
          id: "mock1",
          text: "Breaking: Major tech stocks surge after positive earnings reports. $AAPL $MSFT $GOOGL showing strong momentum #StockMarket #TechStocks",
          created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          author_id: "mock_user1",
          public_metrics: {
            retweet_count: 245,
            like_count: 1200,
            reply_count: 89,
            quote_count: 34,
          },
          entities: {
            cashtags: [
              { start: 82, end: 87, tag: "AAPL" },
              { start: 88, end: 93, tag: "MSFT" },
            ],
          },
          user: {
            id: "mock_user1",
            name: "Market Analyst",
            username: "marketpro",
            verified: true,
            public_metrics: {
              followers_count: 45000,
              following_count: 1200,
              tweet_count: 8900,
              listed_count: 234,
            },
          },
        },
        {
          id: "mock2",
          text: "🚨 BREAKING: Federal Reserve hints at potential rate changes in upcoming meeting. Market volatility expected. #Fed #InterestRates #Economy",
          created_at: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
          author_id: "mock_user2",
          public_metrics: {
            retweet_count: 567,
            like_count: 2100,
            reply_count: 156,
            quote_count: 89,
          },
          user: {
            id: "mock_user2",
            name: "Financial News",
            username: "finnews",
            verified: true,
            public_metrics: {
              followers_count: 125000,
              following_count: 890,
              tweet_count: 12000,
              listed_count: 567,
            },
          },
        },
      ];
      setRecentTweets(mockTweets);
      throw new Error("Search failed (using mock data)");
    }
  }, []);

  const searchTweets = useCallback(async (query: string) => {
    try {
      const response = await fetch(
        `/api/proxy/twitter/search/recent?query=${encodeURIComponent(query)}&max_results=10`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TwitterSearchResponse = await response.json();

      if (data.data && data.includes?.users) {
        const tweetsWithUsers = data.data.map((tweet) => {
          const user = data.includes?.users?.find(
            (u) => u.id === tweet.author_id,
          );
          return { ...tweet, user };
        });
        setRecentTweets(tweetsWithUsers);
      }
    } catch (err) {
      console.warn("Twitter search failed:", err);
    }
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([fetchTrending(), fetchRecentTweets()]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch Twitter data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchTrending, fetchRecentTweets]);

  useEffect(() => {
    if (enabled) {
      refetch();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(refetch, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refetch, refreshInterval, enabled]);

  return {
    trending,
    recentTweets,
    loading,
    error,
    refetch,
    searchTweets,
  };
}

/**
 * Extract cashtags from Twitter text
 */
export function extractCashtags(text: string): string[] {
  const cashtagRegex = /\$([A-Z]{1,5})/g;
  const matches = text.match(cashtagRegex);
  return matches ? matches.map((tag) => tag.substring(1)) : [];
}

/**
 * Extract hashtags from Twitter text
 */
export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
  const matches = text.match(hashtagRegex);
  return matches ? matches.map((tag) => tag.substring(1)) : [];
}

/**
 * Format large numbers for display
 */
export function formatTweetVolume(volume?: number): string {
  if (!volume) return "";
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`;
  }
  return volume.toString();
}
