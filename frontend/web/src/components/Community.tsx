import { useState } from "react";
import {
  ChartColumn,
  Users,
  Search,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostCard, type PostCardData } from "./social/PostCard";



interface CommunityProps {
  onNavigateToProfile?: (userId: string) => void;
}

export const Community = ({ onNavigateToProfile }: CommunityProps) => {
  const [activeTab, setActiveTab] = useState<"all" | "following">("all");
  const [newPost, setNewPost] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for posts
  const mockPosts: PostCardData[] = [
    {
      id: "1",
      user: {
        id: "user1",
        username: "TechTrader",
        handle: "@techtrader",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
        verified: true,
        premium: true,
        credibilityScore: 94,
        topPercentage: 1,
      },
      timestamp: "32 minutes ago",
      content: "🔥 $NVDA is showing incredible strength post-earnings. The AI momentum is unstoppable and I'm seeing massive institutional buying. This could easily hit $200 before Q1 ends. What are your thoughts? 🧠",
      tickers: [
        { symbol: "NVDA", price: 173.50, change: 8.25, changePercent: 4.98 }
      ],
      sentiment: "Bullish",
      tags: ["AI"],
      categories: ["AI", "Earnings"],
      engagement: { likes: 127, comments: 34, reposts: 18, saves: 45, views: 1247 },
      isFollowing: false,
      alertsEnabled: false,
      isLiked: false,
      isSaved: false,
      isReposted: false,
      isTrending: true,
    },
    {
      id: "2",
      user: {
        id: "user2",
        username: "QuantAnalyst",
        handle: "@quantanalyst",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=faces",
        verified: true,
        premium: false,
        credibilityScore: 87,
        topPercentage: 5,
      },
      timestamp: "1 hour ago",
      content: "Market volatility is creating some interesting opportunities. 🧊 $TSLA is oversold here - expecting a bounce back to $220 resistance. Risk/reward looking favorable for swing traders.",
      tickers: [
        { symbol: "TSLA", price: 198.32, change: -12.45, changePercent: -5.89 }
      ],
      sentiment: "Neutral",
      tags: ["Swing Trading"],
      categories: ["Technical Analysis"],
      engagement: { likes: 89, comments: 21, reposts: 12, saves: 28, views: 856 },
      isFollowing: true,
      alertsEnabled: true,
      isLiked: true,
      isSaved: false,
      isReposted: false,
    },
    {
      id: "3",
      user: {
        id: "user3",
        username: "CryptoSage",
        handle: "@cryptosage",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
        verified: false,
        premium: true,
        credibilityScore: 76,
      },
      timestamp: "2 hours ago",
      content: "⚠️ Seeing some concerning signals in the broader market. Fed uncertainty + rising yields = potential correction ahead. Might be time to hedge positions. $SPY $QQQ showing weakness.",
      tickers: [
        { symbol: "SPY", price: 445.21, change: -2.87, changePercent: -0.64 },
        { symbol: "QQQ", price: 378.95, change: -4.12, changePercent: -1.07 }
      ],
      sentiment: "Bearish",
      tags: ["Fed Policy"],
      categories: ["Market Analysis", "Risk Management"],
      engagement: { likes: 156, comments: 67, reposts: 23, saves: 91, views: 2134 },
      isFollowing: false,
      alertsEnabled: false,
      isLiked: false,
      isSaved: true,
      isReposted: false,
      needsReview: true,
    },
  ];

  const handleFollow = (userId: string) => {
    console.log(`Following user: ${userId}`);
  };

  const handleUnfollow = (userId: string) => {
    console.log(`Unfollowing user: ${userId}`);
  };

  const handleToggleAlerts = (userId: string) => {
    console.log(`Toggling alerts for user: ${userId}`);
  };

  const handleLike = (postId: string) => {
    console.log(`Liking post: ${postId}`);
  };

  const handleComment = (postId: string) => {
    console.log(`Commenting on post: ${postId}`);
  };

  const handleRepost = (postId: string) => {
    console.log(`Reposting post: ${postId}`);
  };

  const handleSave = (postId: string) => {
    console.log(`Saving post: ${postId}`);
  };

  const handleUserClick = (userId: string) => {
    console.log(`Viewing user profile: ${userId}`);
    onNavigateToProfile?.(userId);
  };

  const handleTickerClick = (symbol: string) => {
    console.log(`Viewing ticker: ${symbol}`);
  };

  const filteredPosts = activeTab === "following" 
    ? mockPosts.filter(post => post.isFollowing)
    : mockPosts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-3 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Market Discussion
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time financial discussions and analysis from traders and sentiment AI
          </p>
        </div>

        {/* Tab Navigation - Sticky */}
        <div className="sticky top-16 z-40 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pb-4">
          <Card className="border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
                  <TabsList className="grid w-64 grid-cols-2 bg-white dark:bg-slate-800">
                    <TabsTrigger value="all" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      <ChartColumn className="h-4 w-4" />
                      All
                    </TabsTrigger>
                    <TabsTrigger value="following" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      <Users className="h-4 w-4" />
                      Following
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Post Composer */}
        <Card className="border-0 shadow-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <button onClick={() => onNavigateToProfile?.("current-user")}>
                <Avatar className="ring-2 ring-blue-100 dark:ring-blue-900 hover:ring-purple-500/30 transition-all cursor-pointer">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces" />
                  <AvatarFallback>YU</AvatarFallback>
                </Avatar>
              </button>
              <div className="flex-1 space-y-4">
                <Textarea
                  placeholder="Share your market insights... Use $TICKER to mention stocks 📊"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[100px] border-0 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 text-lg resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{newPost.length}/280</span>
                    <div className="flex gap-1">
                      {["$AAPL", "$NVDA", "$TSLA", "$MSFT"].map((ticker) => (
                        <Button
                          key={ticker}
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => setNewPost(prev => prev + ticker + " ")}
                        >
                          {ticker}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button 
                    disabled={!newPost.trim()} 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Post Insight
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onRepost={handleRepost}
                onSave={handleSave}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
                onToggleAlerts={handleToggleAlerts}
                onUserClick={handleUserClick}
                onTickerClick={handleTickerClick}
                showEngagementCounts={true}
              />
            ))
          ) : (
            <Card className="border-0 shadow-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No posts from followed users</h3>
                <p className="text-muted-foreground">
                  Start following traders and analysts to see their insights here
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setActiveTab("all")}
                >
                  Browse All Posts
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
