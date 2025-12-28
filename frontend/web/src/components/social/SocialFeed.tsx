import { useState, useEffect } from "react";
import {
  Filter,
  TrendingUp,
  Clock,
  Star,
  Flame,
  BarChart3,
  Users,
  Hash,
  RefreshCw,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SocialPost } from "./SocialPost";
import { PostComposer } from "./PostComposer";
import { useAuth } from "@/contexts/AuthContext";
import {
  mockSocialPosts,
  mockTickers,
  mockTrendingData,
} from "@/data/socialMockData";
import type {
  SocialPost as SocialPostType,
  SentimentType,
  CreatePostData,
  TrendingTicker,
} from "@/types/social";

interface SocialFeedProps {
  onTickerClick?: (symbol: string) => void;
  onUserClick?: (userId: string) => void;
  watchlistOnly?: boolean;
}

export const SocialFeed = ({
  onTickerClick,
  onUserClick,
  watchlistOnly = false,
}: SocialFeedProps) => {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState<SocialPostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedType, setFeedType] = useState<"all" | "following" | "watchlist">(
    "all",
  );
  const [sentimentFilter, setSentimentFilter] = useState<"all" | SentimentType>(
    "all",
  );
  const [timeFilter, setTimeFilter] = useState<"1h" | "4h" | "24h" | "7d">(
    "24h",
  );
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "trending">(
    "recent",
  );
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Load posts based on filters
  useEffect(() => {
    setLoading(true);

    // Simulate API call delay
    const timer = setTimeout(() => {
      let filteredPosts = [...mockSocialPosts];

      // Apply watchlist filter
      if (watchlistOnly || feedType === "watchlist") {
        // In a real app, this would filter by user's watchlist
        const watchlistTickers = ["AAPL", "NVDA", "BTC", "ETH"]; // Mock watchlist
        filteredPosts = filteredPosts.filter((post) =>
          post.cashtags.some((tag) => watchlistTickers.includes(tag)),
        );
      }

      // Apply sentiment filter
      if (sentimentFilter !== "all") {
        filteredPosts = filteredPosts.filter(
          (post) => post.sentiment === sentimentFilter,
        );
      }

      // Apply following filter
      if (feedType === "following") {
        // In a real app, this would filter by followed users
        filteredPosts = filteredPosts.filter(
          (post) => ["user1", "user2", "user4"].includes(post.userId), // Mock following list
        );
      }

      // Sort posts
      filteredPosts.sort((a, b) => {
        if (sortBy === "popular") {
          return (
            b.likes + b.comments + b.shares - (a.likes + a.comments + a.shares)
          );
        } else if (sortBy === "trending") {
          return b.likes - a.likes; // Simple trending algorithm
        }
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      setPosts(filteredPosts);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [feedType, sentimentFilter, timeFilter, sortBy, watchlistOnly]);

  const handleAddPost = async (postData: CreatePostData) => {
    // Optimistically add post
    const newPost: SocialPostType = {
      ...postData,
      id: `post-${Date.now()}`,
      likes: 0,
      comments: 0,
      shares: 0,
      bookmarks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setPosts((prev) => [newPost, ...prev]);
  };

  const handleRefresh = () => {
    setLastRefresh(new Date());
    // In a real app, this would refresh the feed
    console.log("Refreshing feed...");
  };

  const handlePostAction = (postId: string, action: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          switch (action) {
            case "like":
              return {
                ...post,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                isLiked: !post.isLiked,
              };
            case "bookmark":
              return {
                ...post,
                bookmarks: post.isBookmarked
                  ? post.bookmarks - 1
                  : post.bookmarks + 1,
                isBookmarked: !post.isBookmarked,
              };
            default:
              return post;
          }
        }
        return post;
      }),
    );
  };

  const handleFollow = (userId: string) => {
    console.log(`Following user: ${userId}`);
    // In real app, call API to follow user
    // await followUser(userId);
  };

  const handleUnfollow = (userId: string) => {
    console.log(`Unfollowing user: ${userId}`);
    // In real app, call API to unfollow user
    // await unfollowUser(userId);
  };

  const handleToggleAlerts = (userId: string, enabled: boolean) => {
    console.log(`${enabled ? 'Enabling' : 'Disabling'} alerts for user: ${userId}`);
    // In real app, call API to update alert preferences
    // await updateUserAlertSettings(userId, enabled);
  };

  return (
    <div className="space-y-6">
      {/* Feed Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {watchlistOnly ? "Watchlist Feed" : "Market Discussion"}
          </h2>
          <p className="text-muted-foreground">
            {watchlistOnly
              ? "Posts from your watched tickers"
              : "Real-time financial discussions and analysis"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>

          <Badge variant="outline" className="text-xs">
            Updated {lastRefresh.toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Feed Type Tabs */}
            {!watchlistOnly && (
              <Tabs
                value={feedType}
                onValueChange={(value: any) => setFeedType(value)}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="following"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Following
                  </TabsTrigger>
                  <TabsTrigger
                    value="watchlist"
                    className="flex items-center gap-2"
                  >
                    <Star className="h-4 w-4" />
                    Watchlist
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            {/* Sentiment Filter */}
            <Select
              value={sentimentFilter}
              onValueChange={(value: any) => setSentimentFilter(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiment</SelectItem>
                <SelectItem value="bullish">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Bullish
                  </div>
                </SelectItem>
                <SelectItem value="bearish">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                    Bearish
                  </div>
                </SelectItem>
                <SelectItem value="neutral">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-gray-600" />
                    Neutral
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Time Filter */}
            <Select
              value={timeFilter}
              onValueChange={(value: any) => setTimeFilter(value)}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1H</SelectItem>
                <SelectItem value="4h">4H</SelectItem>
                <SelectItem value="24h">24H</SelectItem>
                <SelectItem value="7d">7D</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <Select
              value={sortBy}
              onValueChange={(value: any) => setSortBy(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent
                  </div>
                </SelectItem>
                <SelectItem value="popular">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Popular
                  </div>
                </SelectItem>
                <SelectItem value="trending">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4" />
                    Trending
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Advanced Filters */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Post Composer */}
      {isAuthenticated && (
        <PostComposer
          onSubmit={handleAddPost}
          placeholder="Share your market insights..."
        />
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-muted-foreground">Loading posts...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts */}
      {!loading && (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-4">
                  {watchlistOnly || feedType === "watchlist"
                    ? "No posts from your watchlist tickers."
                    : "No posts match your current filters."}
                </p>
                {watchlistOnly || feedType === "watchlist" ? (
                  <Button variant="outline" onClick={() => setFeedType("all")}>
                    View All Posts
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSentimentFilter("all");
                      setTimeFilter("24h");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Active Filters Display */}
              {(sentimentFilter !== "all" ||
                feedType !== "all" ||
                timeFilter !== "24h" ||
                sortBy !== "recent") && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">
                    Active filters:
                  </span>
                  {feedType !== "all" && (
                    <Badge variant="secondary" className="text-xs">
                      {feedType}
                    </Badge>
                  )}
                  {sentimentFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs">
                      {sentimentFilter} sentiment
                    </Badge>
                  )}
                  {timeFilter !== "24h" && (
                    <Badge variant="secondary" className="text-xs">
                      Last {timeFilter}
                    </Badge>
                  )}
                  {sortBy !== "recent" && (
                    <Badge variant="secondary" className="text-xs">
                      Sort by {sortBy}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFeedType("all");
                      setSentimentFilter("all");
                      setTimeFilter("24h");
                      setSortBy("recent");
                    }}
                    className="h-6 text-xs"
                  >
                    Clear all
                  </Button>
                </div>
              )}

              {/* Posts List */}
              {posts.map((post) => (
                <SocialPost
                  key={post.id}
                  post={post}
                  onLike={(postId) => handlePostAction(postId, "like")}
                  onBookmark={(postId) => handlePostAction(postId, "bookmark")}
                  onComment={(postId) =>
                    console.log("Comment on post:", postId)
                  }
                  onShare={(postId) => console.log("Share post:", postId)}
                  onFollow={handleFollow}
                  onUnfollow={handleUnfollow}
                  onToggleAlerts={handleToggleAlerts}
                  onTickerClick={onTickerClick}
                  onUserClick={onUserClick}
                />
              ))}

              {/* Load More */}
              <Card>
                <CardContent className="p-6 text-center">
                  <Button variant="outline" className="w-full">
                    Load More Posts
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Showing {posts.length} posts
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Real-time Updates Indicator */}
      {isAuthenticated && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="bg-background/90 backdrop-blur border">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Live updates</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
