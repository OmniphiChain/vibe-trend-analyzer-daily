import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Eye,
  EyeOff,
  Star,
  StarOff,
  ExternalLink,
  Calendar,
  Users,
  MessageSquare,
  Activity,
  Info,
  Plus,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Progress } from "@/components/ui/progress";
import { SocialPost } from "./SocialPost";
import { PostComposer } from "./PostComposer";
import { useAuth } from "@/contexts/AuthContext";
import {
  mockTickers,
  mockSocialPosts,
  getMockTickerBySymbol,
  getMockPostsByTicker,
} from "@/data/socialMockData";
import type {
  Ticker,
  SocialPost as SocialPostType,
  SentimentType,
  CreatePostData,
} from "@/types/social";
import { useQuote } from "@/hooks/useFinnhub";
import { Skeleton } from "@/components/ui/skeleton";

interface TickerPageProps {
  symbol: string;
  onBack?: () => void;
}

export const TickerPage = ({ symbol, onBack }: TickerPageProps) => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<SocialPostType[]>([]);
  const [isWatching, setIsWatching] = useState(false);
  const [sentimentFilter, setSentimentFilter] = useState<"all" | SentimentType>(
    "all",
  );
  const [timeFilter, setTimeFilter] = useState<"1h" | "24h" | "7d" | "all">(
    "24h",
  );
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");

  // Load real ticker data from Finnhub API
  const {
    data: ticker,
    loading: tickerLoading,
    error: tickerError,
    refetch,
  } = useQuote(symbol, {
    refreshInterval: 300000, // Refresh every 5 minutes
    enabled: true,
  });

  // Load mock social sentiment data and merge with real price data
  useEffect(() => {
    if (ticker) {
      const mockTicker = getMockTickerBySymbol(symbol);
      if (mockTicker) {
        // Merge real price data with mock sentiment data
        setIsWatching(mockTicker.isWatched || false);
      }
    }
  }, [symbol, ticker]);

  // Load posts
  useEffect(() => {
    const tickerPosts = getMockPostsByTicker(symbol);

    // Filter posts
    let filteredPosts = tickerPosts;

    if (sentimentFilter !== "all") {
      filteredPosts = filteredPosts.filter(
        (post) => post.sentiment === sentimentFilter,
      );
    }

    // Sort posts
    filteredPosts.sort((a, b) => {
      if (sortBy === "popular") {
        return (
          b.likes + b.comments + b.shares - (a.likes + a.comments + a.shares)
        );
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setPosts(filteredPosts);
  }, [symbol, sentimentFilter, timeFilter, sortBy]);

  if (!ticker) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Ticker not found</p>
            {onBack && (
              <Button onClick={onBack} className="mt-4">
                Go Back
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddPost = async (postData: CreatePostData) => {
    // In a real app, this would call an API
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

  const toggleWatchlist = () => {
    setIsWatching(!isWatching);
    // In a real app, this would call an API to update user's watchlist
  };

  const handleFollow = (userId: string) => {
    console.log(`Following user: ${userId}`);
  };

  const handleUnfollow = (userId: string) => {
    console.log(`Unfollowing user: ${userId}`);
  };

  const handleToggleAlerts = (userId: string, enabled: boolean) => {
    console.log(`${enabled ? 'Enabling' : 'Disabling'} alerts for user: ${userId}`);
  };

  const formatPrice = (price: number) => {
    if (ticker?.type === "crypto") {
      return price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    const color = isPositive ? "text-green-600" : "text-red-600";
    const icon = isPositive ? (
      <TrendingUp className="h-4 w-4" />
    ) : (
      <TrendingDown className="h-4 w-4" />
    );

    return (
      <div className={`flex items-center gap-1 ${color}`}>
        {icon}
        <span>
          {isPositive ? "+" : ""}
          {change.toFixed(2)}
        </span>
        <span>
          ({isPositive ? "+" : ""}
          {changePercent.toFixed(2)}%)
        </span>
      </div>
    );
  };

  const getSentimentColor = (score: number) => {
    if (score > 50) return "text-green-600";
    if (score > -50) return "text-yellow-600";
    return "text-red-600";
  };

  const getSentimentGradient = (score: number) => {
    const normalizedScore = ((score + 100) / 200) * 100; // Convert -100 to 100 range to 0-100
    if (score > 50) return "bg-gradient-to-r from-green-500 to-emerald-400";
    if (score > -50) return "bg-gradient-to-r from-yellow-500 to-amber-400";
    return "bg-gradient-to-r from-red-500 to-red-400";
  };

  // Show loading or error states
  if (tickerLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              ← Back
            </Button>
          )}
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-6 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (tickerError) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              ← Back
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold">${symbol}</h1>
            <p className="text-muted-foreground">Failed to load ticker data</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">
              Error loading stock data: {tickerError}
            </p>
            <Button onClick={refetch} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!ticker) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              ← Back
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold">${symbol}</h1>
            <p className="text-muted-foreground">Ticker not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              ← Back
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              ${ticker.symbol}
              <Badge variant="outline" className="text-xs">
                {ticker.type.toUpperCase()}
              </Badge>
              {tickerLoading && <Skeleton className="h-4 w-4 rounded-full" />}
            </h1>
            <p className="text-xl text-muted-foreground">{ticker.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Watch/Unwatch Button */}
          {isAuthenticated && (
            <Button
              onClick={toggleWatchlist}
              variant={isWatching ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              {isWatching ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
              {isWatching ? "Watching" : "Watch"}
            </Button>
          )}

          {/* External Links */}
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Chart
          </Button>
        </div>
      </div>

      {/* Price & Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Price Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Current Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-4xl font-bold">
                {formatPrice(ticker.price)}
              </div>
              <div className="flex items-center justify-between">
                {formatChange(ticker.change, ticker.changePercent)}
                <Badge variant="outline" className="text-xs">
                  Vol: {ticker.volume.toLocaleString()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div
                className={`text-3xl font-bold ${getSentimentColor(ticker.sentimentScore)}`}
              >
                {ticker.sentimentScore > 0 ? "+" : ""}
                {ticker.sentimentScore}
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-full rounded-full ${getSentimentGradient(ticker.sentimentScore)}`}
                  style={{
                    width: `${((ticker.sentimentScore + 100) / 200) * 100}%`,
                  }}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {ticker.totalPosts} posts analyzed
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Posts 24h</span>
                <span className="font-semibold">{ticker.postVolume24h}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Bullish</span>
                <span className="font-semibold text-green-600">
                  {ticker.bullishCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Bearish</span>
                <span className="font-semibold text-red-600">
                  {ticker.bearishCount}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Breakdown</CardTitle>
          <CardDescription>
            Community sentiment distribution over the last 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-600">
                  Bullish
                </span>
                <span className="text-sm">
                  {((ticker.bullishCount / ticker.totalPosts) * 100).toFixed(1)}
                  %
                </span>
              </div>
              <Progress
                value={(ticker.bullishCount / ticker.totalPosts) * 100}
                className="h-2"
              />
              <div className="text-xs text-muted-foreground">
                {ticker.bullishCount} posts
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-600">
                  Bearish
                </span>
                <span className="text-sm">
                  {((ticker.bearishCount / ticker.totalPosts) * 100).toFixed(1)}
                  %
                </span>
              </div>
              <Progress
                value={(ticker.bearishCount / ticker.totalPosts) * 100}
                className="h-2"
              />
              <div className="text-xs text-muted-foreground">
                {ticker.bearishCount} posts
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Neutral
                </span>
                <span className="text-sm">
                  {((ticker.neutralCount / ticker.totalPosts) * 100).toFixed(1)}
                  %
                </span>
              </div>
              <Progress
                value={(ticker.neutralCount / ticker.totalPosts) * 100}
                className="h-2"
              />
              <div className="text-xs text-muted-foreground">
                {ticker.neutralCount} posts
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="feed" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="feed">Discussion Feed</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="news">News & Updates</TabsTrigger>
          </TabsList>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <Select
              value={sentimentFilter}
              onValueChange={(value: any) => setSentimentFilter(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="bullish">Bullish</SelectItem>
                <SelectItem value="bearish">Bearish</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value: any) => setSortBy(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="feed" className="space-y-6">
          {/* Post Composer */}
          {isAuthenticated && (
            <PostComposer
              onSubmit={handleAddPost}
              placeholder={`Share your thoughts on $${ticker.symbol}...`}
            />
          )}

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No posts found for ${ticker.symbol}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Be the first to share your analysis!
                  </p>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <SocialPost
                  key={post.id}
                  post={post}
                  onFollow={handleFollow}
                  onUnfollow={handleUnfollow}
                  onToggleAlerts={handleToggleAlerts}
                  onTickerClick={(symbol) => {
                    // Navigate to ticker page
                    console.log("Navigate to ticker:", symbol);
                  }}
                  onUserClick={(userId) => {
                    // Navigate to user profile
                    console.log("Navigate to user:", userId);
                  }}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Analysis</CardTitle>
              <CardDescription>
                Key metrics and indicators for ${ticker.symbol}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">
                      {ticker.trendingScore.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Trending Score
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">
                      {ticker.sentimentChange24h > 0 ? "+" : ""}
                      {ticker.sentimentChange24h.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Sentiment Change
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">
                      {ticker.postVolume24h}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Posts Today
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">
                      #{Math.floor(Math.random() * 10) + 1}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Trending Rank
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Price Chart</h4>
                  <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        Chart integration coming soon
                      </p>
                      <p className="text-sm text-muted-foreground">
                        TradingView widget will be embedded here
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Latest News & Updates</CardTitle>
              <CardDescription>
                Recent news and announcements related to ${ticker.symbol}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: `${ticker.name} Reports Strong Q4 Earnings`,
                    summary:
                      "Company beats analyst expectations with record revenue growth.",
                    time: "2 hours ago",
                    sentiment: "bullish",
                  },
                  {
                    title: "Analyst Upgrades Price Target",
                    summary:
                      "Wall Street analyst raises price target citing strong fundamentals.",
                    time: "4 hours ago",
                    sentiment: "bullish",
                  },
                  {
                    title: "Market Volatility Concerns",
                    summary:
                      "Broader market concerns may impact sector performance.",
                    time: "6 hours ago",
                    sentiment: "bearish",
                  },
                ].map((news, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{news.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {news.summary}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {news.time}
                          </span>
                          <Badge
                            className={`text-xs ${
                              news.sentiment === "bullish"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {news.sentiment}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
