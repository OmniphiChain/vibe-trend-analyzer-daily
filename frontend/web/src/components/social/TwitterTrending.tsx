import { useState } from "react";
import {
  TrendingUp,
  Hash,
  MessageCircle,
  Heart,
  Repeat2,
  RefreshCw,
  Search,
  ExternalLink,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  useTwitterTrending,
  formatTweetVolume,
  extractCashtags,
} from "@/hooks/useTwitterTrending";
import { formatDistanceToNow } from "date-fns";

interface TwitterTrendingProps {
  onCashtagClick?: (symbol: string) => void;
  onHashtagClick?: (hashtag: string) => void;
}

export const TwitterTrending = ({
  onCashtagClick,
  onHashtagClick,
}: TwitterTrendingProps) => {
  const { trending, recentTweets, loading, error, refetch, searchTweets } =
    useTwitterTrending({
      enabled: true,
      refreshInterval: 300000, // Refresh every 5 minutes
      woeid: 1, // Worldwide trends
    });

  const [searchQuery, setSearchQuery] = useState("");
  const [showAllTrends, setShowAllTrends] = useState(false);
  const [showAllTweets, setShowAllTweets] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await searchTweets(searchQuery);
    }
  };

  const renderTweetText = (text: string) => {
    return text.replace(
      /(\$[A-Z]{1,5})|(@\w+)|(#\w+)|(https?:\/\/[^\s]+)/g,
      (match) => {
        if (match.startsWith("$")) {
          return `<span class="text-green-600 font-medium cursor-pointer hover:underline" data-cashtag="${match.substring(1)}">${match}</span>`;
        } else if (match.startsWith("@")) {
          return `<span class="text-blue-600 font-medium">${match}</span>`;
        } else if (match.startsWith("#")) {
          return `<span class="text-blue-600 font-medium cursor-pointer hover:underline" data-hashtag="${match.substring(1)}">${match}</span>`;
        } else if (match.startsWith("http")) {
          return `<a href="${match}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${match}</a>`;
        }
        return match;
      },
    );
  };

  const handleTextClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const cashtag = target.getAttribute("data-cashtag");
    const hashtag = target.getAttribute("data-hashtag");

    if (cashtag && onCashtagClick) {
      onCashtagClick(cashtag);
    } else if (hashtag && onHashtagClick) {
      onHashtagClick(hashtag);
    }
  };

  const displayedTrends = showAllTrends ? trending : trending.slice(0, 5);
  const displayedTweets = showAllTweets
    ? recentTweets
    : recentTweets.slice(0, 3);

  if (loading && trending.length === 0 && recentTweets.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Loading What's Happening...
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Twitter
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search for stocks, crypto, or financial topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!searchQuery.trim()}>
              <Search className="h-4 w-4" />
            </Button>
          </form>
          {error && (
            <div className="mt-2 text-xs text-orange-600 p-2 bg-orange-50 rounded">
              {error.includes("mock data")
                ? "API unavailable - showing sample data"
                : error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              What's Trending
            </div>
            <Badge variant="outline">{trending.length} topics</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {displayedTrends.map((trend, index) => (
            <div
              key={trend.name}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => {
                if (trend.name.startsWith("#") && onHashtagClick) {
                  onHashtagClick(trend.name.substring(1));
                } else if (searchQuery !== trend.name) {
                  setSearchQuery(trend.name);
                  searchTweets(trend.name);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">
                  #{index + 1}
                </span>
                <div className="flex-1">
                  <div className="font-semibold flex items-center gap-2">
                    {trend.name.startsWith("#") && (
                      <Hash className="h-4 w-4 text-blue-600" />
                    )}
                    {trend.name}
                  </div>
                  {trend.tweet_volume && (
                    <div className="text-xs text-muted-foreground">
                      {formatTweetVolume(trend.tweet_volume)} tweets
                    </div>
                  )}
                </div>
              </div>

              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}

          {trending.length > 5 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAllTrends(!showAllTrends)}
            >
              {showAllTrends
                ? "Show Less"
                : `Show All ${trending.length} Trends`}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Recent Tweets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Financial Discussions</span>
            <Badge variant="outline">{recentTweets.length} tweets</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {displayedTweets.map((tweet) => (
            <div
              key={tweet.id}
              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              {/* User Info */}
              {tweet.user && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="font-semibold flex items-center gap-1">
                    {tweet.user.name}
                    {tweet.user.verified && (
                      <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <span className="text-muted-foreground">
                    @{tweet.user.username}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(tweet.created_at))} ago
                  </span>
                </div>
              )}

              {/* Tweet Content */}
              <div
                className="text-sm mb-3 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: renderTweetText(tweet.text),
                }}
                onClick={handleTextClick}
              />

              {/* Cashtags */}
              {tweet.entities?.cashtags &&
                tweet.entities.cashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {tweet.entities.cashtags.map((cashtag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs cursor-pointer hover:bg-green-100"
                        onClick={() => onCashtagClick?.(cashtag.tag)}
                      >
                        <DollarSign className="h-3 w-3 mr-1" />
                        {cashtag.tag}
                      </Badge>
                    ))}
                  </div>
                )}

              {/* Engagement Metrics */}
              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  {tweet.public_metrics.reply_count}
                </div>
                <div className="flex items-center gap-1">
                  <Repeat2 className="h-3 w-3" />
                  {tweet.public_metrics.retweet_count}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {tweet.public_metrics.like_count}
                </div>

                {tweet.user && (
                  <div className="ml-auto">
                    {tweet.user.public_metrics.followers_count >= 1000 && (
                      <span className="text-xs text-blue-600">
                        {formatTweetVolume(
                          tweet.user.public_metrics.followers_count,
                        )}{" "}
                        followers
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {recentTweets.length > 3 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAllTweets(!showAllTweets)}
            >
              {showAllTweets
                ? "Show Less"
                : `Show All ${recentTweets.length} Tweets`}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
