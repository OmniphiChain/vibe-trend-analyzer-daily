import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  RefreshCw, 
  TrendingUp, 
  Heart, 
  MessageCircle,
  ExternalLink,
  Hash,
  Calendar
} from "lucide-react";
import { 
  useInstagramTrending, 
  useInstagramHashtag, 
  formatInstagramCount,
  extractInstagramHashtags 
} from "@/hooks/useInstagram";

interface InstagramTrendingProps {
  onHashtagClick?: (hashtag: string) => void;
  onUserClick?: (username: string) => void;
}

export const InstagramTrending = ({ 
  onHashtagClick, 
  onUserClick 
}: InstagramTrendingProps) => {
  const [searchHashtag, setSearchHashtag] = useState("");
  const [currentHashtag, setCurrentHashtag] = useState("");
  
  const { 
    posts: trendingPosts, 
    loading: trendingLoading, 
    error: trendingError, 
    refetch: refetchTrending 
  } = useInstagramTrending({
    enabled: true,
    refreshInterval: 300000, // 5 minutes
  });

  const { 
    posts: hashtagPosts, 
    loading: hashtagLoading, 
    error: hashtagError, 
    refetch: refetchHashtag 
  } = useInstagramHashtag(currentHashtag, {
    enabled: !!currentHashtag,
    refreshInterval: 300000,
    limit: 20,
  });

  const handleHashtagSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchHashtag.trim()) {
      const cleanHashtag = searchHashtag.replace('#', '').trim();
      setCurrentHashtag(cleanHashtag);
      onHashtagClick?.(cleanHashtag);
    }
  };

  const popularFinanceHashtags = [
    "investing", "stocks", "trading", "crypto", 
    "bitcoin", "ethereum", "finance", "money"
  ];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const PostCard = ({ post, showHashtag = false }: { post: any; showHashtag?: boolean }) => (
    <div className="border rounded-lg p-4 space-y-3">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-0.5">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <span className="text-xs font-bold text-gray-700">
              {post.user?.username?.slice(0, 2).toUpperCase() || "IG"}
            </span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUserClick?.(post.user?.username || "")}
              className="font-semibold text-sm hover:underline"
            >
              @{post.user?.username || "unknown"}
            </button>
            {post.user?.is_verified && (
              <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {post.taken_at && formatTimeAgo(post.taken_at)}
          </div>
        </div>
        {showHashtag && post.hashtag && (
          <Badge variant="secondary" className="text-xs">
            #{post.hashtag}
          </Badge>
        )}
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="text-sm">
          <p className="line-clamp-3">{post.caption}</p>
          {post.caption.length > 150 && (
            <button className="text-blue-600 text-xs mt-1 hover:underline">
              Read more
            </button>
          )}
        </div>
      )}

      {/* Hashtags */}
      {post.caption && (
        <div className="flex flex-wrap gap-1">
          {extractInstagramHashtags(post.caption).slice(0, 5).map((hashtag, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentHashtag(hashtag);
                setSearchHashtag(hashtag);
                onHashtagClick?.(hashtag);
              }}
              className="text-xs text-blue-600 hover:underline"
            >
              #{hashtag}
            </button>
          ))}
        </div>
      )}

      {/* Engagement */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {formatInstagramCount(post.like_count)}
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {formatInstagramCount(post.comment_count)}
          </div>
        </div>
        
        {post.url && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(post.url, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Hashtag Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Hashtag Search
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => currentHashtag ? refetchHashtag() : refetchTrending()}
              disabled={hashtagLoading || trendingLoading}
            >
              <RefreshCw className={`h-4 w-4 ${(hashtagLoading || trendingLoading) ? "animate-spin" : ""}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleHashtagSearch} className="flex gap-2 mb-4">
            <Input
              placeholder="Search hashtag (e.g., investing, crypto)..."
              value={searchHashtag}
              onChange={(e) => setSearchHashtag(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!searchHashtag.trim()}>
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Popular Hashtags */}
          <div className="flex flex-wrap gap-2">
            {popularFinanceHashtags.map((hashtag) => (
              <Button
                key={hashtag}
                variant={currentHashtag === hashtag ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCurrentHashtag(hashtag);
                  setSearchHashtag(hashtag);
                  onHashtagClick?.(hashtag);
                }}
              >
                #{hashtag}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Results */}
      {currentHashtag ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              #{currentHashtag} Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hashtagLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-16 w-full" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : hashtagError ? (
              <div className="text-center py-8">
                <Hash className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Unable to load hashtag posts</p>
                <p className="text-sm text-muted-foreground">{hashtagError}</p>
              </div>
            ) : hashtagPosts.length > 0 ? (
              <div className="space-y-4">
                {hashtagPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Hash className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No posts found for #{currentHashtag}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trending Financial Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trendingLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-5 w-16 ml-auto" />
                    </div>
                    <Skeleton className="h-16 w-full" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : trendingError ? (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Unable to load trending content</p>
                <p className="text-sm text-muted-foreground">{trendingError}</p>
              </div>
            ) : trendingPosts.length > 0 ? (
              <div className="space-y-4">
                {trendingPosts.map((post) => (
                  <PostCard key={post.id} post={post} showHashtag />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No trending content available</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};