import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Flame, 
  Clock, 
  TrendingUp, 
  Eye, 
  Sparkles, 
  Search,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Settings,
  Plus,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  TrendingDown,
  Shield,
  Award,
  Star,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PostData {
  id: string;
  user: {
    username: string;
    avatar: string;
    verified: boolean;
    premium: boolean;
    badge?: "Top Contributor" | "Verified Pro" | "Analyst";
    credibilityScore: number;
  };
  content: string;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  tickers: Array<{
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    sparkline?: number[];
  }>;
  tags: string[];
  categories: string[];
  timestamp: string;
  engagement: {
    likes: number;
    comments: number;
    reposts: number;
    saves: number;
    views: number;
  };
  isLiked: boolean;
  isSaved: boolean;
  isReposted: boolean;
  qualityScore?: number;
  hasChart?: boolean;
  comments?: Array<{
    id: string;
    user: string;
    content: string;
    time: string;
    likes: number;
  }>;
}

interface EnhancedSentimentFeedProps {
  onNavigateToProfile?: (userId: string) => void;
}

// Template options for composer
const composerTemplates = [
  {
    id: "setup",
    name: "Setup (Entry/Target/Stop)",
    template: "📈 ${ticker} Setup\n\nEntry: $\nTarget: $\nStop: $\n\nReason: "
  },
  {
    id: "news",
    name: "News (Source/Impact/Tickers)",
    template: "📰 News Alert\n\nSource: \nImpact: \nAffected: ${ticker}\n\nAnalysis: "
  },
  {
    id: "analysis",
    name: "Technical Analysis", 
    template: "🔍 ${ticker} Analysis\n\nTechnical outlook:\nKey levels:\nRisk/Reward:\n\nTimeframe: "
  }
];

export const EnhancedSentimentFeed: React.FC<EnhancedSentimentFeedProps> = ({ onNavigateToProfile }) => {
  // Enhanced state management with localStorage persistence
  const [activeTab, setActiveTab] = useState<"hot" | "new" | "top" | "watchlist" | "ai-picks">(() => {
    return (localStorage.getItem('sentiment-feed-tab') as any) || "hot";
  });
  
  const [sentimentFilter, setSentimentFilter] = useState<string | null>(() => {
    return localStorage.getItem('sentiment-filter') || null;
  });
  
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem('sentiment-search') || "";
  });
  
  const [viewDensity, setViewDensity] = useState<"comfortable" | "compact">(() => {
    return (localStorage.getItem('view-density') as any) || "comfortable";
  });

  const [showComposer, setShowComposer] = useState(false);
  const [composerTemplate, setComposerTemplate] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set());

  // Mock data with enhanced fields
  const [posts] = useState<PostData[]>([
    {
      id: "1",
      user: {
        username: "AlphaTrader",
        avatar: "/placeholder.svg",
        verified: true,
        premium: true,
        badge: "Top Contributor",
        credibilityScore: 95
      },
      content: "Massive volume surge in $AAPL ahead of earnings. Options flow heavily favoring upside with 2:1 call/put ratio. Key resistance at $195, if we break with volume, targeting $205. Stop below $185. #earnings #options",
      sentiment: "Bullish",
      tickers: [
        { symbol: "AAPL", price: 192.45, change: 2.34, changePercent: 1.23, sparkline: [190, 189, 191, 193, 192] }
      ],
      tags: ["earnings", "options", "breakout"],
      categories: ["Setup"],
      timestamp: "2m ago",
      engagement: { likes: 47, comments: 12, reposts: 8, saves: 23, views: 342 },
      isLiked: false,
      isSaved: false,
      isReposted: false,
      qualityScore: 92,
      hasChart: true,
      comments: [
        { id: "c1", user: "TechAnalyst", content: "Great setup! Also watching volume at that resistance level.", time: "1m", likes: 5 },
        { id: "c2", user: "OptionsPro", content: "IV is elevated but still reasonable for the move", time: "2m", likes: 3 }
      ]
    },
    {
      id: "2", 
      user: {
        username: "ChartMaster",
        avatar: "/placeholder.svg",
        verified: false,
        premium: true,
        badge: "Verified Pro",
        credibilityScore: 87
      },
      content: "🔥 $TSLA forming a beautiful cup and handle on the 4H. Volume confirming the pattern. This could be the catalyst for a move to $280. Risk management is key here - tight stops below $245.",
      sentiment: "Bullish",
      tickers: [
        { symbol: "TSLA", price: 251.30, change: -1.45, changePercent: -0.57, sparkline: [255, 252, 249, 250, 251] }
      ],
      tags: ["technicals", "patterns", "EV"],
      categories: ["Analysis"],
      timestamp: "5m ago",
      engagement: { likes: 34, comments: 8, reposts: 5, saves: 19, views: 287 },
      isLiked: true,
      isSaved: false,
      isReposted: false,
      qualityScore: 88,
      hasChart: true,
      comments: [
        { id: "c3", user: "SwingTrader", content: "Been watching this pattern too, nice call!", time: "3m", likes: 4 }
      ]
    },
    {
      id: "3",
      user: {
        username: "NewsHunter",
        avatar: "/placeholder.svg", 
        verified: true,
        premium: false,
        badge: "Analyst",
        credibilityScore: 91
      },
      content: "⚠️ $NVDA guidance concerns spreading through semiconductor sector. $AMD, $INTC showing weakness. May create short opportunity if broader tech selloff continues. Watch $QQQ for confirmation.",
      sentiment: "Bearish",
      tickers: [
        { symbol: "NVDA", price: 456.78, change: -8.90, changePercent: -1.91, sparkline: [465, 460, 458, 457, 456] },
        { symbol: "AMD", price: 98.45, change: -2.10, changePercent: -2.09, sparkline: [100, 99, 98.5, 98, 98.4] }
      ],
      tags: ["semiconductors", "guidance", "tech"],
      categories: ["News"],
      timestamp: "8m ago",
      engagement: { likes: 28, comments: 15, reposts: 12, saves: 16, views: 445 },
      isLiked: false,
      isSaved: true,
      isReposted: false,
      qualityScore: 85,
      comments: [
        { id: "c4", user: "TechBear", content: "Agree on the sector rotation concern", time: "4m", likes: 7 },
        { id: "c5", user: "SemiExpert", content: "Guidance revisions typically cascade through the sector", time: "6m", likes: 5 }
      ]
    }
  ]);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('sentiment-feed-tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('sentiment-filter', sentimentFilter || '');
  }, [sentimentFilter]);

  useEffect(() => {
    localStorage.setItem('sentiment-search', searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem('view-density', viewDensity);
  }, [viewDensity]);

  // Calculate quality scores and apply filtering/sorting
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts.filter(post => {
      // Sentiment filter
      if (sentimentFilter && post.sentiment !== sentimentFilter) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          post.content.toLowerCase().includes(query) ||
          post.user.username.toLowerCase().includes(query) ||
          post.tickers.some(t => t.symbol.toLowerCase().includes(query)) ||
          post.tags.some(t => t.toLowerCase().includes(query))
        );
      }
      
      return true;
    });

    // Apply sorting based on active tab
    return filtered.sort((a, b) => {
      switch (activeTab) {
        case "hot":
          // Quality score algorithm
          const scoreA = 0.35 * Math.log(1 + a.engagement.likes * 2 + a.engagement.comments * 3 + a.engagement.saves * 4) +
                        0.25 * (a.user.credibilityScore / 100) +
                        0.25 * (1 / (new Date().getTime() - new Date(a.timestamp).getTime() + 1)) +
                        0.15 * (a.qualityScore || 50) / 100;
          
          const scoreB = 0.35 * Math.log(1 + b.engagement.likes * 2 + b.engagement.comments * 3 + b.engagement.saves * 4) +
                        0.25 * (b.user.credibilityScore / 100) +
                        0.25 * (1 / (new Date().getTime() - new Date(b.timestamp).getTime() + 1)) +
                        0.15 * (b.qualityScore || 50) / 100;
          
          return scoreB - scoreA;
        
        case "top":
          return b.engagement.likes - a.engagement.likes;
        
        case "new":
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });
  }, [posts, sentimentFilter, searchQuery, activeTab]);

  // Render trust badge
  const renderTrustBadge = (user: PostData['user']) => {
    if (user.badge) {
      const badgeColors = {
        "Top Contributor": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        "Verified Pro": "bg-blue-500/20 text-blue-400 border-blue-500/30", 
        "Analyst": "bg-purple-500/20 text-purple-400 border-purple-500/30"
      };
      
      const badgeIcons = {
        "Top Contributor": Star,
        "Verified Pro": Shield,
        "Analyst": Award
      };
      
      const Icon = badgeIcons[user.badge];
      
      return (
        <Badge variant="outline" className={cn("text-xs", badgeColors[user.badge])}>
          <Icon className="w-3 h-3 mr-1" />
          {user.badge}
        </Badge>
      );
    }
    
    if (user.verified) {
      return (
        <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
          <Zap className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      );
    }
    
    return null;
  };

  // Render ticker card with sparkline
  const renderTickerCard = (ticker: PostData['tickers'][0]) => {
    const isPositive = ticker.change >= 0;
    return (
      <div className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors",
        isPositive ? "bg-green-500/10 border-green-500/30 hover:bg-green-500/20" : "bg-red-500/10 border-red-500/30 hover:bg-red-500/20"
      )}>
        <span className="font-medium text-sm">${ticker.symbol}</span>
        <div className="flex items-center gap-1">
          {/* Mini sparkline */}
          {ticker.sparkline && (
            <div className="flex items-end gap-0.5 h-4">
              {ticker.sparkline.map((point, i) => (
                <div
                  key={i}
                  className={cn("w-0.5 rounded-full", isPositive ? "bg-green-400" : "bg-red-400")}
                  style={{ height: `${(point / Math.max(...ticker.sparkline!)) * 16}px` }}
                />
              ))}
            </div>
          )}
          <span className={cn("text-xs font-medium", isPositive ? "text-green-400" : "text-red-400")}>
            {isPositive ? "+" : ""}{ticker.changePercent.toFixed(2)}%
          </span>
        </div>
      </div>
    );
  };

  const handleTemplateSelect = (template: typeof composerTemplates[0]) => {
    setComposerTemplate(template.template);
    setSelectedTemplate(template.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Enhanced Sentiment Feed 🚀
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Real-time trader sentiment with enhanced UX, quality scoring, and trust indicators
          </p>
        </div>

        {/* Clickable Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card 
            className={cn(
              "cursor-pointer transition-all hover:scale-105 bg-gradient-to-r from-green-900/50 to-green-800/50 border-green-700/50",
              sentimentFilter === "Bullish" && "ring-2 ring-green-400"
            )}
            onClick={() => setSentimentFilter(sentimentFilter === "Bullish" ? null : "Bullish")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">73%</div>
              <div className="text-sm text-green-300">Bullish Sentiment</div>
            </CardContent>
          </Card>
          
          <Card 
            className={cn(
              "cursor-pointer transition-all hover:scale-105 bg-gradient-to-r from-red-900/50 to-red-800/50 border-red-700/50",
              sentimentFilter === "Bearish" && "ring-2 ring-red-400"
            )}
            onClick={() => setSentimentFilter(sentimentFilter === "Bearish" ? null : "Bearish")}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">18%</div>
              <div className="text-sm text-red-300">Bearish Sentiment</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 border-blue-700/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">2.4k</div>
              <div className="text-sm text-blue-300">Active Traders</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-900/50 to-purple-800/50 border-purple-700/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">156</div>
              <div className="text-sm text-purple-300">Posts/Hour</div>
            </CardContent>
          </Card>
        </div>

        {/* Sticky Controls */}
        <div className="relative z-50 mb-6">
          <Card className="bg-slate-800/95 backdrop-blur-xl border-slate-700/50">
            <CardContent className="p-4">
              {/* Main Navigation */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
                  <TabsList className="grid grid-cols-5 bg-slate-700/50">
                    <TabsTrigger value="hot" className="flex items-center gap-2">
                      <Flame className="h-4 w-4" />
                      Hot
                    </TabsTrigger>
                    <TabsTrigger value="new" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      New
                    </TabsTrigger>
                    <TabsTrigger value="top" className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Top
                    </TabsTrigger>
                    <TabsTrigger value="watchlist" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Watchlist
                    </TabsTrigger>
                    <TabsTrigger value="ai-picks" className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      AI Picks
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search posts, users, tickers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64 bg-slate-700/50 border-slate-600"
                    />
                  </div>

                  {/* View Density Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewDensity(viewDensity === "comfortable" ? "compact" : "comfortable")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {viewDensity === "comfortable" ? "Compact" : "Comfortable"}
                  </Button>

                  {/* Create Post */}
                  <Button onClick={() => setShowComposer(true)} className="bg-gradient-to-r from-purple-500 to-pink-500">
                    <Plus className="h-4 w-4 mr-2" />
                    Post
                  </Button>
                </div>
              </div>

              {/* Composer Templates */}
              {showComposer && (
                <div className="space-y-4 p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium">Quick Templates:</span>
                    {composerTemplates.map((template) => (
                      <Button
                        key={template.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleTemplateSelect(template)}
                        className={cn(
                          "text-xs",
                          selectedTemplate === template.id && "bg-purple-500/20 border-purple-500"
                        )}
                      >
                        {template.name}
                      </Button>
                    ))}
                  </div>
                  
                  <textarea
                    placeholder="Share your market insight..."
                    value={composerTemplate}
                    onChange={(e) => setComposerTemplate(e.target.value)}
                    className="w-full h-32 p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none"
                  />
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-slate-400">
                      💡 Use templates for better visibility and quality scores
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowComposer(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Posts Feed */}
        <div className="space-y-6">
          {filteredAndSortedPosts.map((post) => (
            <Card key={post.id} className={cn(
              "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all",
              viewDensity === "compact" ? "p-4" : "p-6"
            )}>
              <CardContent className={cn("p-0")}>
                {/* Compact Post Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.user.avatar} alt={post.user.username} />
                      <AvatarFallback>{post.user.username[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-white">{post.user.username}</span>
                      {renderTrustBadge(post.user)}
                      <span className="text-slate-400 text-sm">•</span>
                      <span className="text-slate-400 text-sm">{post.timestamp}</span>
                      
                      {/* Quality indicator */}
                      {(post.qualityScore || 0) > 85 && (
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                          🔥 Hot
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content */}
                <div className="mb-4 text-slate-200 leading-relaxed">
                  {post.content}
                </div>

                {/* Consistent Ticker Cards */}
                {post.tickers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tickers.map((ticker) => renderTickerCard(ticker))}
                  </div>
                )}

                {/* Tags with "+X more" collapsible */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, expandedTags.has(post.id) ? undefined : 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs opacity-70">
                        #{tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newExpanded = new Set(expandedTags);
                          if (expandedTags.has(post.id)) {
                            newExpanded.delete(post.id);
                          } else {
                            newExpanded.add(post.id);
                          }
                          setExpandedTags(newExpanded);
                        }}
                        className="h-6 px-2 text-xs"
                      >
                        {expandedTags.has(post.id) ? "Show less" : `+${post.tags.length - 3} more`}
                      </Button>
                    )}
                  </div>
                )}

                {/* Inline Comment Preview */}
                {post.comments && post.comments.length > 0 && (
                  <div className="mb-4">
                    <div className="bg-slate-700/30 rounded-lg p-3 space-y-2">
                      {post.comments.slice(0, expandedComments.has(post.id) ? undefined : 2).map((comment) => (
                        <div key={comment.id} className="text-sm">
                          <span className="font-medium text-slate-300">{comment.user}:</span>
                          <span className="text-slate-400 ml-2">{comment.content}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">{comment.time}</span>
                            <Button variant="ghost" size="sm" className="h-5 px-1 text-xs">
                              <Heart className="h-3 w-3 mr-1" />
                              {comment.likes}
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {post.comments.length > 2 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newExpanded = new Set(expandedComments);
                            if (expandedComments.has(post.id)) {
                              newExpanded.delete(post.id);
                            } else {
                              newExpanded.add(post.id);
                            }
                            setExpandedComments(newExpanded);
                          }}
                          className="text-slate-400 text-xs"
                        >
                          {expandedComments.has(post.id) ? (
                            <>
                              <ChevronUp className="h-3 w-3 mr-1" />
                              Show less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3 mr-1" />
                              View all {post.comments.length} comments
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Engagement Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "gap-2 text-slate-400 hover:text-red-400",
                        post.isLiked && "text-red-400"
                      )}
                    >
                      <Heart className={cn("h-4 w-4", post.isLiked && "fill-current")} />
                      {post.engagement.likes}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-blue-400">
                      <MessageCircle className="h-4 w-4" />
                      {post.engagement.comments}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-green-400">
                      <Share2 className="h-4 w-4" />
                      {post.engagement.reposts}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "gap-2 text-slate-400 hover:text-yellow-400",
                        post.isSaved && "text-yellow-400"
                      )}
                    >
                      <Bookmark className={cn("h-4 w-4", post.isSaved && "fill-current")} />
                      {post.engagement.saves}
                    </Button>
                  </div>
                  
                  <div className="text-xs text-slate-500">
                    {post.engagement.views} views
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Floating Action Button - Mobile */}
        <Button 
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg md:hidden"
          onClick={() => setShowComposer(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
