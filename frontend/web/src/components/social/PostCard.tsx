import { useState } from "react";
import {
  Heart,
  MessageSquare,
  Repeat2,
  Bookmark,
  Bell,
  BellOff,
  UserPlus,
  UserMinus,
  Clock,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  CheckCircle,
  Crown,
  Shield,
  Star,
  AlertTriangle,
  Award,
  Brain,
  Zap,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface PostCardUser {
  id: string;
  username: string;
  handle: string;
  avatar: string;
  verified: boolean;
  premium: boolean;
  credibilityScore: number;
  topPercentage?: number; // e.g., 1 for "Top 1%"
}

export interface PostCardTicker {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface PostCardEngagement {
  likes: number;
  comments: number;
  reposts: number;
  saves: number;
  views?: number;
}

export interface PostCardData {
  id: string;
  user: PostCardUser;
  timestamp: string;
  content: string;
  tickers: PostCardTicker[];
  sentiment: "Bullish" | "Bearish" | "Neutral";
  tags: string[];
  categories: string[]; // e.g., ["AI", "Crypto", "Earnings"]
  engagement: PostCardEngagement;
  isFollowing: boolean;
  alertsEnabled: boolean;
  isLiked: boolean;
  isSaved: boolean;
  isReposted: boolean;
  needsReview?: boolean;
  isPinned?: boolean;
  isTrending?: boolean;
}

interface PostCardProps {
  post: PostCardData;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onRepost?: (postId: string) => void;
  onSave?: (postId: string) => void;
  onFollow?: (userId: string) => void;
  onUnfollow?: (userId: string) => void;
  onToggleAlerts?: (userId: string) => void;
  onUserClick?: (userId: string) => void;
  onTickerClick?: (symbol: string, event?: React.MouseEvent) => void;
  onTickerHover?: (ticker: string, event: React.MouseEvent) => void;
  onTickerLeave?: () => void;
  compact?: boolean;
  showEngagementCounts?: boolean;
}

export const PostCard = ({
  post,
  onLike,
  onComment,
  onRepost,
  onSave,
  onFollow,
  onUnfollow,
  onToggleAlerts,
  onUserClick,
  onTickerClick,
  onTickerHover,
  onTickerLeave,
  compact = false,
  showEngagementCounts = true,
}: PostCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getSentimentConfig = (sentiment: string) => {
    switch (sentiment) {
      case "Bullish":
        return {
          color: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
          icon: <TrendingUp className="h-3 w-3" />,
        };
      case "Bearish":
        return {
          color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
          icon: <TrendingDown className="h-3 w-3" />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800",
          icon: <Zap className="h-3 w-3" />,
        };
    }
  };

  const getCredibilityBadge = (score: number, topPercentage?: number) => {
    if (topPercentage && topPercentage <= 1) {
      return {
        text: "Top 1%",
        color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none",
        icon: <Brain className="h-3 w-3" />,
      };
    }
    if (topPercentage && topPercentage <= 5) {
      return {
        text: "Top 5%",
        color: "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none",
        icon: <Star className="h-3 w-3" />,
      };
    }
    if (score >= 90) {
      return {
        text: `${score}%`,
        color: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
        icon: <Shield className="h-3 w-3" />,
      };
    }
    if (score >= 80) {
      return {
        text: `${score}%`,
        color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
        icon: <Star className="h-3 w-3" />,
      };
    }
    return {
      text: `${score}%`,
      color: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800",
      icon: <Eye className="h-3 w-3" />,
    };
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      AI: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
      Crypto: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300",
      Earnings: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
      "Market Analysis": "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
      "Technical Analysis": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300",
      "Risk Management": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
      Prediction: "bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300",
      Insight: "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
    };
    return colors[category] || "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300";
  };

  const formatContent = (content: string) => {
    // Enhanced ticker detection with hover support and emoji animations
    const parts = content.split(/(\$[A-Z]{1,5}|\p{Emoji})/gu);

    return parts.map((part, index) => {
      if (part.match(/^\$[A-Z]{1,5}$/)) {
        // This is a ticker symbol
        const symbol = part.substring(1);
        const ticker = post.tickers.find(t => t.symbol === symbol);

        return (
          <button
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-100 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 rounded-md font-semibold hover:bg-cyan-200 dark:hover:bg-cyan-900/40 transition-all duration-200 hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              onTickerClick?.(symbol, e);
            }}
            onMouseEnter={(e) => onTickerHover?.(symbol, e)}
            onMouseLeave={onTickerLeave}
          >
            ${symbol}
            {ticker && (
              <span className={`text-xs font-medium ${ticker.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {ticker.change >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
              </span>
            )}
          </button>
        );
      } else if (part.match(/\p{Emoji}/u)) {
        // Animate emojis on hover
        return (
          <span key={index} className="hover:scale-110 transition-transform inline-block duration-200 cursor-default">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const sentimentConfig = getSentimentConfig(post.sentiment);
  const credibilityBadge = getCredibilityBadge(post.user.credibilityScore, post.user.topPercentage);

  return (
    <Card 
      className={`group transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 hover:scale-[1.02] ${
        compact ? 'p-3' : 'hover:shadow-xl'
      } ${isHovered ? 'ring-2 ring-purple-500/20' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className={compact ? "p-4" : "p-6"}>
        <div className="space-y-4">
          {/* Top Bar - User Info Row */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <button onClick={() => onUserClick?.(post.user.id)}>
                <Avatar className={`ring-2 ring-gray-100 dark:ring-gray-800 hover:ring-purple-500/30 transition-all ${compact ? 'w-8 h-8' : 'w-10 h-10'}`}>
                  <AvatarImage src={post.user.avatar} alt={post.user.username} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                    {post.user.username.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </button>
              
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <button 
                    onClick={() => onUserClick?.(post.user.id)}
                    className={`font-bold hover:text-purple-600 dark:hover:text-purple-400 transition-colors ${compact ? 'text-sm' : 'text-base'}`}
                  >
                    {post.user.username}
                  </button>
                  
                  <span className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
                    {post.user.handle}
                  </span>
                  
                  {/* Verification Badge */}
                  {post.user.verified && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Verified Account</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {/* Premium Badge */}
                  {post.user.premium && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Crown className="h-4 w-4 text-yellow-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Premium Member</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {/* Credibility Badge */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className={`text-xs px-2 py-0.5 font-semibold flex items-center gap-1 ${credibilityBadge.color}`}>
                          {credibilityBadge.icon}
                          {credibilityBadge.text}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Credibility Score: {post.user.credibilityScore}%</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {/* Alert Tags */}
                  {post.needsReview && (
                    <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 text-xs px-2 py-0.5 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Needs Review
                    </Badge>
                  )}
                  
                  {post.isPinned && (
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-xs">
                      📌 Pinned
                    </Badge>
                  )}
                  
                  {post.isTrending && (
                    <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 text-xs flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Trending
                    </Badge>
                  )}
                </div>
                
                <div className={`flex items-center gap-2 text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
                  <Clock className="h-3 w-3" />
                  {post.timestamp}
                  {post.engagement.views && (
                    <>
                      <span>•</span>
                      <Eye className="h-3 w-3" />
                      {post.engagement.views.toLocaleString()} views
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Controls */}
            {!compact && (
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleAlerts?.(post.user.id)}
                  className={`h-8 w-8 p-0 ${post.alertsEnabled ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20' : ''}`}
                >
                  {post.alertsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant={post.isFollowing ? "default" : "outline"}
                  size="sm"
                  onClick={() => post.isFollowing ? onUnfollow?.(post.user.id) : onFollow?.(post.user.id)}
                  className="h-8"
                >
                  {post.isFollowing ? (
                    <UserMinus className="h-4 w-4" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Report Post</DropdownMenuItem>
                    <DropdownMenuItem>Mute User</DropdownMenuItem>
                    <DropdownMenuItem>Copy Link</DropdownMenuItem>
                    <DropdownMenuItem>Hide Post</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Post Body */}
          <div className="space-y-3">
            <div className={`leading-relaxed whitespace-pre-wrap ${compact ? 'text-sm' : 'text-base'}`}>
              {formatContent(post.content)}
            </div>
            
            {/* Tickers Display */}
            {post.tickers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tickers.map((ticker) => (
                  <button
                    key={ticker.symbol}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTickerClick?.(ticker.symbol, e);
                    }}
                    onMouseEnter={(e) => onTickerHover?.(ticker.symbol, e)}
                    onMouseLeave={onTickerLeave}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border hover:border-purple-500/30 transition-all group hover:scale-[1.02] hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between gap-3 min-w-[120px]">
                      <span className="font-bold text-lg">${ticker.symbol}</span>
                      <div className="text-right">
                        <div className="font-semibold">${ticker.price.toFixed(2)}</div>
                        <div className={`text-sm font-medium ${ticker.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {ticker.change >= 0 ? '+' : ''}{ticker.change.toFixed(2)} ({ticker.changePercent >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Post Labels & Tags */}
          <div className="flex flex-wrap gap-2">
            {/* Sentiment Badge */}
            <Badge className={`flex items-center gap-1 ${sentimentConfig.color}`}>
              {sentimentConfig.icon}
              {post.sentiment}
            </Badge>
            
            {/* Category Tags */}
            {post.categories.map((category) => (
              <Badge key={category} className={getCategoryColor(category)}>
                {category}
              </Badge>
            ))}
            
            {/* General Tags */}
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike?.(post.id)}
                className={`h-8 px-3 hover:bg-red-50 dark:hover:bg-red-900/20 ${
                  post.isLiked ? 'text-red-600 hover:text-red-700' : 'text-gray-600 hover:text-red-600'
                }`}
              >
                <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                {showEngagementCounts && post.engagement.likes}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onComment?.(post.id)}
                className="h-8 px-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                {showEngagementCounts && post.engagement.comments}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRepost?.(post.id)}
                className={`h-8 px-3 hover:bg-green-50 dark:hover:bg-green-900/20 ${
                  post.isReposted ? 'text-green-600 hover:text-green-700' : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <Repeat2 className="h-4 w-4 mr-1" />
                {showEngagementCounts && post.engagement.reposts}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSave?.(post.id)}
                className={`h-8 px-3 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 ${
                  post.isSaved ? 'text-yellow-600 hover:text-yellow-700' : 'text-gray-600 hover:text-yellow-600'
                }`}
              >
                <Bookmark className={`h-4 w-4 mr-1 ${post.isSaved ? 'fill-current' : ''}`} />
                {showEngagementCounts && post.engagement.saves}
              </Button>
            </div>
            
            {showEngagementCounts && (
              <div className="text-xs text-muted-foreground">
                {(post.engagement.likes + post.engagement.comments + post.engagement.reposts).toLocaleString()} interactions
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
