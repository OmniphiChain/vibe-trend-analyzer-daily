import { useState, useEffect, useCallback, useRef } from "react";

interface UseTwitterUserOptions {
  enabled?: boolean;
  refreshInterval?: number;
}

interface TwitterUser {
  id: string;
  name: string;
  username: string;
  created_at: string;
  description?: string;
  location?: string;
  pinned_tweet_id?: string;
  profile_image_url?: string;
  protected: boolean;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
    like_count: number;
  };
  url?: string;
  verified: boolean;
  verified_type?: string;
}

interface TwitterTweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  public_metrics: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
    bookmark_count?: number;
    impression_count?: number;
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
  lang: string;
  possibly_sensitive?: boolean;
  referenced_tweets?: Array<{
    type: "retweeted" | "quoted" | "replied_to";
    id: string;
  }>;
  reply_settings: string;
  source?: string;
}

interface TwitterApiResponse {
  data?: TwitterUser;
  error?: {
    message: string;
    type: string;
  };
}

interface TwitterTweetsResponse {
  data?: TwitterTweet[];
  meta?: {
    result_count: number;
    newest_id?: string;
    oldest_id?: string;
    next_token?: string;
  };
  error?: {
    message: string;
    type: string;
  };
}

interface UseTwitterUserResult {
  user: TwitterUser | null;
  tweets: TwitterTweet[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fetchTweets: () => Promise<void>;
}

/**
 * Hook to fetch Twitter user data and tweets
 */
export function useTwitterUser(
  username: string,
  options: UseTwitterUserOptions = {},
): UseTwitterUserResult {
  const { enabled = true, refreshInterval = 0 } = options;
  const [user, setUser] = useState<TwitterUser | null>(null);
  const [tweets, setTweets] = useState<TwitterTweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchUserData = useCallback(async () => {
    if (!enabled || !username) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/proxy/twitter/user/${encodeURIComponent(username)}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TwitterApiResponse = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.data) {
        setUser(data.data);
      } else {
        throw new Error("No user data returned");
      }
    } catch (err) {
      console.warn("Twitter user API failed:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch Twitter user data";
      setError(errorMessage);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [username, enabled]);

  const fetchTweets = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `/api/proxy/twitter/user/${user.id}/tweets?max_results=10`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TwitterTweetsResponse = await response.json();

      if (data.error) {
        console.warn("Twitter tweets API error:", data.error.message);
        return;
      }

      if (data.data) {
        setTweets(data.data);
      }
    } catch (err) {
      console.warn("Twitter tweets API failed:", err);
    }
  }, [user?.id]);

  const refetch = useCallback(async () => {
    await fetchUserData();
    // fetchTweets will be called automatically when user data updates
  }, [fetchUserData]);

  useEffect(() => {
    if (enabled && username) {
      fetchUserData();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(fetchUserData, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchUserData, refreshInterval, enabled]);

  // Fetch tweets when user data is available
  useEffect(() => {
    if (user?.id) {
      fetchTweets();
    }
  }, [user?.id, fetchTweets]);

  return {
    user,
    tweets,
    loading,
    error,
    refetch,
    fetchTweets,
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
 * Extract mentions from Twitter text
 */
export function extractMentions(text: string): string[] {
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;
  const matches = text.match(mentionRegex);
  return matches ? matches.map((mention) => mention.substring(1)) : [];
}

/**
 * Convert Twitter user to SocialProfile format
 */
export function convertTwitterUserToSocialProfile(
  twitterUser: TwitterUser,
): any {
  return {
    userId: twitterUser.id,
    username: twitterUser.username,
    displayName: twitterUser.name,
    bio: twitterUser.description,
    avatar: twitterUser.profile_image_url,
    location: twitterUser.location,
    website: twitterUser.url,
    followers: twitterUser.public_metrics.followers_count,
    following: twitterUser.public_metrics.following_count,
    totalPosts: twitterUser.public_metrics.tweet_count,
    totalLikes: twitterUser.public_metrics.like_count,
    joinedAt: new Date(twitterUser.created_at),
    lastActive: new Date(), // We don't have this from Twitter API
    isVerified: twitterUser.verified,
    isPremium:
      twitterUser.verified_type === "blue" ||
      twitterUser.verified_type === "business",
    isPrivate: twitterUser.protected,
    showStats: true,
    allowMessages: !twitterUser.protected,
  };
}

/**
 * Convert Twitter tweet to SocialPost format
 */
export function convertTwitterTweetToSocialPost(
  tweet: TwitterTweet,
  user: TwitterUser,
): any {
  const cashtags =
    tweet.entities?.cashtags?.map((c) => c.tag) || extractCashtags(tweet.text);
  const hashtags =
    tweet.entities?.hashtags?.map((h) => h.tag) || extractHashtags(tweet.text);
  const mentions =
    tweet.entities?.mentions?.map((m) => m.username) ||
    extractMentions(tweet.text);

  return {
    id: tweet.id,
    userId: user.id,
    username: user.username,
    userAvatar: user.profile_image_url,
    userRole: user.verified ? "verified" : "member",
    content: tweet.text,
    sentiment: "neutral", // We'd need sentiment analysis for this
    cashtags,
    hashtags,
    mentions,
    type: "twit",
    likes: tweet.public_metrics.like_count,
    comments: tweet.public_metrics.reply_count,
    shares: tweet.public_metrics.retweet_count,
    bookmarks: tweet.public_metrics.bookmark_count || 0,
    createdAt: new Date(tweet.created_at),
    updatedAt: new Date(tweet.created_at),
    isVerified: user.verified,
  };
}
