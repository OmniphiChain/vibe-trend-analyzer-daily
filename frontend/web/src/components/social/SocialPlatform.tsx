import { useState, useEffect } from "react";
import {
  Home,
  TrendingUp,
  Star,
  Users,
  Search,
  Bell,
  MessageSquare,
  Hash,
  BarChart3,
  Crown,
  Settings,
  Twitter,
  Instagram,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialFeed } from "./SocialFeed";
import { TickerPage } from "./TickerPage";
import { WatchlistManager } from "./WatchlistManager";
import { CommunityRooms } from "./CommunityRooms";
import { TwitterTrending } from "./TwitterTrending";
import { InstagramProfile } from "./InstagramProfile";
import { InstagramTrending } from "./InstagramTrending";
import { mockTrendingData, mockTickers } from "@/data/socialMockData";
import { useAuth } from "@/contexts/AuthContext";
import { RealTimePrice, StockGrid } from "./RealTimePrice";
import { CryptoPrice } from "../crypto/CryptoPrice";
import { useMultipleQuotes } from "@/hooks/useFinnhub";
import { useCryptoQuotes } from "@/hooks/useCoinMarketCap";

type ViewType =
  | "feed"
  | "watchlist"
  | "ticker"
  | "trending"
  | "rooms"
  | "twitter"
  | "instagram";

export const SocialPlatform = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>("feed");

  // Get real-time data for trending tickers
  const trendingSymbols = mockTrendingData.tickers
    .slice(0, 5)
    .map((t) => t.symbol);
  const realTimeTickers = useMultipleQuotes(trendingSymbols, 300000); // 5 minutes
  const tickersLoading = Object.values(realTimeTickers).some(
    (ticker) => ticker.loading,
  );

  // Get crypto data for trending crypto
  const trendingCryptos = ["BTC", "ETH", "BNB"];
  const {
    tickers: cryptoTickers,
    loading: cryptoLoading,
    error: cryptoError,
  } = useCryptoQuotes(trendingCryptos, {
    refreshInterval: 300000, // 5 minutes to reduce API calls
    enabled: true,
  });
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-reset circuit breaker when error occurs
  useEffect(() => {
    if (cryptoError?.includes("Circuit breaker is open")) {
      console.log("Circuit breaker detected, attempting auto-reset...");
      // Automatically reset after a short delay
      const timer = setTimeout(() => {
        import("../../services/coinMarketCapApi").then(
          ({ resetCoinMarketCapCircuitBreaker }) => {
            resetCoinMarketCapCircuitBreaker();
            console.log("Circuit breaker auto-reset completed");
          },
        );
      }, 3000); // Reset after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [cryptoError]);

  // Handle ticker navigation
  const handleTickerClick = (symbol: string) => {
    setSelectedTicker(symbol);
    setCurrentView("ticker");
  };

  // Handle user navigation
  const handleUserClick = (userId: string) => {
    console.log("Navigate to user profile:", userId);
    // In a real app, this would navigate to user profile
  };

  // Render trending sidebar
  const renderTrendingSidebar = () => (
    <div className="space-y-4">
      {/* Trending Tickers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Tickers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockTrendingData.tickers.slice(0, 5).map((mockTicker, index) => {
            const realTicker = realTimeTickers[mockTicker.symbol];
            const isPositive = realTicker?.data
              ? realTicker.data.d >= 0
              : false;

            return (
              <div
                key={mockTicker.symbol}
                className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer transition-colors"
                onClick={() => handleTickerClick(mockTicker.symbol)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    #{mockTicker.rank}
                  </span>
                  <div>
                    <div className="font-semibold">${mockTicker.symbol}</div>
                    <div className="text-xs text-muted-foreground">
                      {mockTicker.name}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {tickersLoading ||
                  realTicker?.loading ||
                  !realTicker?.data ? (
                    <div className="text-right">
                      <div className="text-sm font-semibold text-muted-foreground">
                        Loading...
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {mockTicker.postCount} posts
                      </div>
                    </div>
                  ) : (
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        ${realTicker.data.c.toFixed(2)}
                      </div>
                      <div
                        className={`text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}
                      >
                        {isPositive ? "+" : ""}
                        {realTicker.data.dp.toFixed(2)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {mockTicker.postCount} posts
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setCurrentView("trending")}
          >
            View All Trending
          </Button>
        </CardContent>
      </Card>

      {/* Trending Cryptocurrencies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Crypto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cryptoError && (
            <div className="text-xs text-orange-600 p-2 bg-orange-50 rounded flex items-center justify-between">
              <span>
                {cryptoError.includes("Circuit breaker")
                  ? "API rate limited - showing mock data"
                  : cryptoError}
              </span>
              {cryptoError.includes("Circuit breaker") && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={async () => {
                    try {
                      const { resetCoinMarketCapCircuitBreaker } = await import(
                        "../../services/coinMarketCapApi"
                      );
                      resetCoinMarketCapCircuitBreaker();
                      console.log("Manual circuit breaker reset completed");
                      // Force refresh of crypto data
                      setTimeout(() => window.location.reload(), 500);
                    } catch (e) {
                      console.error("Failed to reset circuit breaker:", e);
                    }
                  }}
                >
                  Reset & Retry
                </Button>
              )}
            </div>
          )}
          {cryptoTickers.slice(0, 3).map((crypto, index) => (
            <div
              key={crypto.symbol}
              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer transition-colors"
              onClick={() => handleTickerClick(crypto.symbol)}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  #{index + 1}
                </span>
                <div>
                  <div className="font-semibold">{crypto.symbol}</div>
                  <div className="text-xs text-muted-foreground">
                    {crypto.name}
                  </div>
                </div>
              </div>

              <div className="text-right">
                {cryptoLoading ? (
                  <div className="text-sm font-semibold text-muted-foreground">
                    Loading...
                  </div>
                ) : (
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {crypto.price < 1
                        ? `$${crypto.price.toFixed(6)}`
                        : `$${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </div>
                    <div
                      className={`text-xs ${crypto.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {crypto.changePercent >= 0 ? "+" : ""}
                      {crypto.changePercent.toFixed(2)}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setCurrentView("trending")}
          >
            View All Crypto
          </Button>
        </CardContent>
      </Card>

      {/* Trending Hashtags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {mockTrendingData.hashtags.slice(0, 8).map((hashtag, index) => (
            <div
              key={hashtag.tag}
              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  #{hashtag.rank}
                </span>
                <span className="text-sm font-medium text-purple-600">
                  #{hashtag.tag}
                </span>
              </div>

              <div className="text-xs text-muted-foreground">
                {hashtag.count} posts
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Platform Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="text-lg font-bold">24.5K</div>
              <div className="text-xs text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="text-lg font-bold">156K</div>
              <div className="text-xs text-muted-foreground">Posts Today</div>
            </div>
          </div>

          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="text-lg font-bold">2.3M</div>
            <div className="text-xs text-muted-foreground">
              Total Discussions
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Rooms Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Active Rooms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { name: "$AAPL Traders", members: 15420, online: 892 },
            { name: "Crypto Central", members: 28453, online: 1247 },
            { name: "Options Trading", members: 8934, online: 234 },
          ].map((room, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer transition-colors"
            >
              <div>
                <div className="font-medium text-sm">{room.name}</div>
                <div className="text-xs text-muted-foreground">
                  {room.members.toLocaleString()} members
                </div>
              </div>

              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs text-muted-foreground">
                  {room.online}
                </span>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setCurrentView("rooms")}
          >
            Browse All Rooms
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Render main content based on current view
  const renderMainContent = () => {
    switch (currentView) {
      case "ticker":
        return selectedTicker ? (
          <TickerPage
            symbol={selectedTicker}
            onBack={() => setCurrentView("feed")}
          />
        ) : (
          <div>No ticker selected</div>
        );

      case "watchlist":
        return <WatchlistManager onTickerClick={handleTickerClick} />;

      case "trending":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Trending Now</h2>
                <p className="text-muted-foreground">
                  Most discussed tickers and topics in the last 24 hours
                </p>
              </div>
              <Button variant="outline" onClick={() => setCurrentView("feed")}>
                Back to Feed
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trending Tickers */}
              <Card>
                <CardHeader>
                  <CardTitle>Trending Tickers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockTrendingData.tickers.map((ticker) => (
                    <div
                      key={ticker.symbol}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleTickerClick(ticker.symbol)}
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">#{ticker.rank}</Badge>
                        <div>
                          <div className="font-semibold">${ticker.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            {ticker.name}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`font-semibold ${
                            ticker.priceChange >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {ticker.priceChange >= 0 ? "+" : ""}
                          {ticker.priceChange.toFixed(2)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {ticker.postCount} posts
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Trending Hashtags */}
              <Card>
                <CardHeader>
                  <CardTitle>Trending Topics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockTrendingData.hashtags.map((hashtag) => (
                    <div
                      key={hashtag.tag}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">#{hashtag.rank}</Badge>
                        <div className="font-semibold text-purple-600">
                          #{hashtag.tag}
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`font-semibold ${
                            hashtag.change >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {hashtag.change >= 0 ? "+" : ""}
                          {hashtag.change.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {hashtag.count} posts
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "rooms":
        return <CommunityRooms />;

      case "twitter":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">What's Happening</h2>
                <p className="text-muted-foreground">
                  Trending topics and financial discussions from Twitter/X
                </p>
              </div>
              <Button variant="outline" onClick={() => setCurrentView("feed")}>
                Back to Feed
              </Button>
            </div>

            <TwitterTrending
              onCashtagClick={handleTickerClick}
              onHashtagClick={(hashtag) =>
                console.log("Hashtag clicked:", hashtag)
              }
            />
          </div>
        );

      case "instagram":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Instagram Financial Content</h2>
                <p className="text-muted-foreground">
                  Browse financial profiles and trending content from Instagram
                </p>
              </div>
              <Button variant="outline" onClick={() => setCurrentView("feed")}>
                Back to Feed
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InstagramProfile />
              <InstagramTrending />
            </div>
          </div>
        );

      default:
        return (
          <SocialFeed
            onTickerClick={handleTickerClick}
            onUserClick={handleUserClick}
            watchlistOnly={currentView === "watchlist"}
          />
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Main Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[#111827] dark:text-transparent dark:bg-gradient-to-r dark:from-blue-600 dark:via-purple-600 dark:to-green-600 dark:bg-clip-text">
            FinTwits
          </h1>
          <p className="text-xl text-muted-foreground">
            Social finance platform for traders and investors
          </p>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                <Badge
                  variant="destructive"
                  className="ml-2 h-5 w-5 p-0 text-xs"
                >
                  3
                </Badge>
              </Button>

              <Button variant="outline" size="sm">
                <Crown className="h-4 w-4 mr-2" />
                Pro Features
              </Button>
            </>
          )}

          {/* Global Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickers, users, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs
        value={currentView}
        onValueChange={(value: any) => setCurrentView(value)}
        className="mb-8"
      >
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Feed
          </TabsTrigger>
          <TabsTrigger value="watchlist" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Watchlist
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="rooms" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Rooms
            <Badge variant="secondary" className="text-xs">
              Soon
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="twitter" className="flex items-center gap-2">
            <Twitter className="h-4 w-4" />
            Twitter
          </TabsTrigger>
          <TabsTrigger value="instagram" className="flex items-center gap-2">
            <Instagram className="h-4 w-4" />
            Instagram
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">{renderMainContent()}</div>

        {/* Sidebar */}
        <div className="lg:col-span-1">{renderTrendingSidebar()}</div>
      </div>
    </div>
  );
};
