import { useState, useEffect } from "react";
import {
  Plus,
  Star,
  StarOff,
  Edit,
  Trash2,
  Search,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Bell,
  BellOff,
  Settings,
  Eye,
  Lock,
  Globe,
  Filter,
  MoreHorizontal,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { mockWatchlists, mockTickers } from "@/data/socialMockData";
import type { Watchlist, Ticker } from "@/types/social";

interface WatchlistManagerProps {
  onTickerClick?: (symbol: string) => void;
  compact?: boolean;
}

export const WatchlistManager = ({
  onTickerClick,
  compact = false,
}: WatchlistManagerProps) => {
  const { user, isAuthenticated } = useAuth();
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingWatchlist, setEditingWatchlist] = useState<Watchlist | null>(
    null,
  );
  const [newWatchlistData, setNewWatchlistData] = useState({
    name: "",
    description: "",
    isPrivate: false,
    notifications: {
      trending: true,
      sentimentShift: true,
      priceAlerts: false,
      followedUserPosts: true,
      sentimentThreshold: 15,
    },
  });

  // Load user's watchlists
  useEffect(() => {
    if (isAuthenticated && user) {
      // In a real app, this would fetch from API
      const userWatchlists = mockWatchlists.filter((w) => w.userId === user.id);
      setWatchlists(userWatchlists);
      if (userWatchlists.length > 0 && !selectedWatchlist) {
        const defaultWatchlist =
          userWatchlists.find((w) => w.isDefault) || userWatchlists[0];
        setSelectedWatchlist(defaultWatchlist.id);
      }
    }
  }, [isAuthenticated, user, selectedWatchlist]);

  const currentWatchlist = watchlists.find((w) => w.id === selectedWatchlist);
  const watchlistTickers =
    currentWatchlist?.tickers
      .map((symbol) => mockTickers.find((t) => t.symbol === symbol))
      .filter(Boolean) || [];

  // Filter tickers based on search
  const filteredTickers = watchlistTickers.filter(
    (ticker) =>
      ticker &&
      (ticker.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticker.name.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleCreateWatchlist = () => {
    if (!user || !newWatchlistData.name.trim()) return;

    const newWatchlist: Watchlist = {
      id: `watchlist-${Date.now()}`,
      userId: user.id,
      name: newWatchlistData.name.trim(),
      description: newWatchlistData.description.trim(),
      tickers: [],
      isPrivate: newWatchlistData.isPrivate,
      notifications: newWatchlistData.notifications,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setWatchlists((prev) => [...prev, newWatchlist]);
    setSelectedWatchlist(newWatchlist.id);
    setIsCreateDialogOpen(false);
    setNewWatchlistData({
      name: "",
      description: "",
      isPrivate: false,
      notifications: {
        trending: true,
        sentimentShift: true,
        priceAlerts: false,
        followedUserPosts: true,
        sentimentThreshold: 15,
      },
    });
  };

  const handleDeleteWatchlist = (watchlistId: string) => {
    setWatchlists((prev) => prev.filter((w) => w.id !== watchlistId));
    if (selectedWatchlist === watchlistId) {
      const remaining = watchlists.filter((w) => w.id !== watchlistId);
      setSelectedWatchlist(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleRemoveTicker = (symbol: string) => {
    if (!currentWatchlist) return;

    setWatchlists((prev) =>
      prev.map((w) =>
        w.id === currentWatchlist.id
          ? {
              ...w,
              tickers: w.tickers.filter((t) => t !== symbol),
              updatedAt: new Date(),
            }
          : w,
      ),
    );
  };

  const handleUpdateNotifications = (
    watchlistId: string,
    notifications: any,
  ) => {
    setWatchlists((prev) =>
      prev.map((w) =>
        w.id === watchlistId
          ? { ...w, notifications, updatedAt: new Date() }
          : w,
      ),
    );
  };

  const formatPrice = (price: number, type: string) => {
    if (type === "crypto") {
      return price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return `$${price.toFixed(2)}`;
  };

  const getSentimentColor = (score: number) => {
    if (score > 50) return "text-green-600";
    if (score > -50) return "text-yellow-600";
    return "text-red-600";
  };

  const getSentimentIcon = (score: number) => {
    if (score > 50) return <TrendingUp className="h-4 w-4" />;
    if (score > -50) return <BarChart3 className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Create Your Watchlist</h3>
          <p className="text-muted-foreground mb-4">
            Sign in to create personalized watchlists and track your favorite
            tickers.
          </p>
          <Button>Sign In to Continue</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Watchlists</h2>
          <p className="text-muted-foreground">
            Track your favorite stocks and cryptocurrencies
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Watchlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Watchlist</DialogTitle>
              <DialogDescription>
                Create a personalized watchlist to track specific tickers
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Watchlist Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Tech Stocks, Crypto Portfolio"
                  value={newWatchlistData.name}
                  onChange={(e) =>
                    setNewWatchlistData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of your watchlist..."
                  value={newWatchlistData.description}
                  onChange={(e) =>
                    setNewWatchlistData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="private"
                  checked={newWatchlistData.isPrivate}
                  onCheckedChange={(checked) =>
                    setNewWatchlistData((prev) => ({
                      ...prev,
                      isPrivate: checked,
                    }))
                  }
                />
                <Label htmlFor="private" className="flex items-center gap-2">
                  {newWatchlistData.isPrivate ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Globe className="h-4 w-4" />
                  )}
                  Private Watchlist
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateWatchlist}
                disabled={!newWatchlistData.name.trim()}
              >
                Create Watchlist
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Watchlist Tabs */}
      <Tabs
        value={selectedWatchlist || ""}
        onValueChange={setSelectedWatchlist}
      >
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid grid-cols-auto gap-1">
            {watchlists.map((watchlist) => (
              <TabsTrigger
                key={watchlist.id}
                value={watchlist.id}
                className="flex items-center gap-2 relative"
              >
                {watchlist.isPrivate ? (
                  <Lock className="h-3 w-3" />
                ) : (
                  <Globe className="h-3 w-3" />
                )}
                {watchlist.name}
                {watchlist.isDefault && (
                  <Badge variant="secondary" className="text-xs ml-1">
                    Default
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-48"
              />
            </div>
          </div>
        </div>

        {/* Watchlist Content */}
        {watchlists.map((watchlist) => (
          <TabsContent
            key={watchlist.id}
            value={watchlist.id}
            className="space-y-6"
          >
            {/* Watchlist Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {watchlist.isPrivate ? (
                        <Lock className="h-5 w-5" />
                      ) : (
                        <Globe className="h-5 w-5" />
                      )}
                      {watchlist.name}
                      {watchlist.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </CardTitle>
                    {watchlist.description && (
                      <CardDescription>{watchlist.description}</CardDescription>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setEditingWatchlist(watchlist)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Watchlist
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Notification Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteWatchlist(watchlist.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Watchlist
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{watchlist.tickers.length} tickers</span>
                  <span>•</span>
                  <span>
                    Updated {watchlist.updatedAt.toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    {watchlist.notifications.trending ? (
                      <Bell className="h-3 w-3" />
                    ) : (
                      <BellOff className="h-3 w-3" />
                    )}
                    <span>
                      Notifications{" "}
                      {watchlist.notifications.trending ? "on" : "off"}
                    </span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Tickers Grid */}
            {filteredTickers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  {watchlist.tickers.length === 0 ? (
                    <>
                      <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Add Your First Ticker
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Start tracking stocks and cryptocurrencies in this
                        watchlist
                      </p>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Ticker
                      </Button>
                    </>
                  ) : (
                    <>
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No Results Found
                      </h3>
                      <p className="text-muted-foreground">
                        No tickers match your search query "{searchQuery}"
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTickers.map(
                  (ticker) =>
                    ticker && (
                      <Card
                        key={ticker.symbol}
                        className="cursor-pointer hover:shadow-md transition-all duration-200"
                        onClick={() => onTickerClick?.(ticker.symbol)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg">
                                  ${ticker.symbol}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                  {ticker.type.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {ticker.name}
                              </p>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => onTickerClick?.(ticker.symbol)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveTicker(ticker.symbol);
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove from Watchlist
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <div className="text-2xl font-bold">
                                {formatPrice(ticker.price, ticker.type)}
                              </div>
                              <div
                                className={`flex items-center gap-1 text-sm ${
                                  ticker.change >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {ticker.change >= 0 ? (
                                  <TrendingUp className="h-4 w-4" />
                                ) : (
                                  <TrendingDown className="h-4 w-4" />
                                )}
                                <span>
                                  {ticker.change >= 0 ? "+" : ""}
                                  {ticker.change.toFixed(2)}
                                </span>
                                <span>
                                  ({ticker.change >= 0 ? "+" : ""}
                                  {ticker.changePercent.toFixed(2)}%)
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="text-center">
                                <div
                                  className={`text-lg font-semibold ${getSentimentColor(ticker.sentimentScore)}`}
                                >
                                  {ticker.sentimentScore > 0 ? "+" : ""}
                                  {ticker.sentimentScore}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Sentiment
                                </div>
                              </div>

                              <div className="text-center">
                                <div className="text-lg font-semibold">
                                  {ticker.totalPosts}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Posts
                                </div>
                              </div>

                              <div className="text-center">
                                <div className="text-lg font-semibold">
                                  {ticker.trendingScore.toFixed(1)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Trending
                                </div>
                              </div>
                            </div>

                            {/* Alerts */}
                            {Math.abs(ticker.sentimentChange24h) >
                              watchlist.notifications.sentimentThreshold && (
                              <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
                                <AlertTriangle className="h-3 w-3 text-yellow-600" />
                                <span>
                                  Sentiment shifted{" "}
                                  {ticker.sentimentChange24h.toFixed(1)}% in 24h
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ),
                )}
              </div>
            )}

            {/* Add Ticker Button */}
            {watchlist.tickers.length > 0 && (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add More Tickers
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
