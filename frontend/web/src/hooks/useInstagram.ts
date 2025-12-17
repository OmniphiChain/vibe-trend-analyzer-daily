import { useState, useCallback, useRef, useEffect } from "react";

interface InstagramUser {
  user_id: string;
  username: string;
  full_name: string;
  biography: string;
  follower_count: number;
  following_count: number;
  media_count: number;
  is_verified: boolean;
  is_private: boolean;
  profile_pic_url?: string;
  external_url?: string;
}

interface InstagramPost {
  id: string;
  shortcode: string;
  caption: string;
  like_count: number;
  comment_count: number;
  taken_at: string;
  media_type: number;
  thumbnail_url?: string;
  url?: string;
  hashtag?: string;
  user?: {
    username: string;
    full_name: string;
    is_verified: boolean;
    profile_pic_url?: string;
  };
}

interface UseInstagramUserOptions {
  enabled?: boolean;
  refreshInterval?: number;
}

interface UseInstagramUserResult {
  user: InstagramUser | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseInstagramHashtagOptions {
  enabled?: boolean;
  refreshInterval?: number;
  limit?: number;
}

interface UseInstagramHashtagResult {
  posts: InstagramPost[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseInstagramTrendingResult {
  posts: InstagramPost[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch Instagram user information
 */
export function useInstagramUser(
  username: string,
  options: UseInstagramUserOptions = {},
): UseInstagramUserResult {
  const { enabled = true, refreshInterval = 0 } = options;
  const [user, setUser] = useState<InstagramUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchUser = useCallback(async () => {
    if (!enabled || !username) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/proxy/instagram/user/${encodeURIComponent(username)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "error") {
        throw new Error(data.message || "Failed to fetch user data");
      }

      setUser(data.data);
    } catch (err) {
      console.warn("Instagram user API failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch Instagram user data";
      setError(errorMessage);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [username, enabled]);

  const refetch = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (enabled && username) {
      fetchUser();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(fetchUser, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchUser, refreshInterval, enabled]);

  return {
    user,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to search Instagram posts by hashtag
 */
export function useInstagramHashtag(
  hashtag: string,
  options: UseInstagramHashtagOptions = {},
): UseInstagramHashtagResult {
  const { enabled = true, refreshInterval = 0, limit = 20 } = options;
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchHashtag = useCallback(async () => {
    if (!enabled || !hashtag) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/proxy/instagram/hashtag/${encodeURIComponent(hashtag)}?limit=${limit}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "error") {
        throw new Error(data.message || "Failed to fetch hashtag data");
      }

      setPosts(data.data.posts || []);
    } catch (err) {
      console.warn("Instagram hashtag API failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch Instagram hashtag data";
      setError(errorMessage);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [hashtag, enabled, limit]);

  const refetch = useCallback(async () => {
    await fetchHashtag();
  }, [fetchHashtag]);

  useEffect(() => {
    if (enabled && hashtag) {
      fetchHashtag();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(fetchHashtag, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchHashtag, refreshInterval, enabled]);

  return {
    posts,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to fetch trending financial content from Instagram
 */
export function useInstagramTrending(
  options: UseInstagramUserOptions = {},
): UseInstagramTrendingResult {
  const { enabled = true, refreshInterval = 0 } = options;
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchTrending = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/proxy/instagram/trending/finance");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "error") {
        throw new Error(data.message || "Failed to fetch trending data");
      }

      setPosts(data.data.posts || []);
    } catch (err) {
      console.warn("Instagram trending API failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch Instagram trending data";
      setError(errorMessage);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  const refetch = useCallback(async () => {
    await fetchTrending();
  }, [fetchTrending]);

  useEffect(() => {
    if (enabled) {
      fetchTrending();

      if (refreshInterval > 0) {
        intervalRef.current = setInterval(fetchTrending, refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchTrending, refreshInterval, enabled]);

  return {
    posts,
    loading,
    error,
    refetch,
  };
}

/**
 * Format large numbers for display
 */
export function formatInstagramCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Extract hashtags from Instagram caption
 */
export function extractInstagramHashtags(caption: string): string[] {
  const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
  const matches = caption.match(hashtagRegex);
  return matches ? matches.map((tag) => tag.substring(1)) : [];
}

/**
 * Extract mentions from Instagram caption
 */
export function extractInstagramMentions(caption: string): string[] {
  const mentionRegex = /@([a-zA-Z0-9_.]+)/g;
  const matches = caption.match(mentionRegex);
  return matches ? matches.map((tag) => tag.substring(1)) : [];
}