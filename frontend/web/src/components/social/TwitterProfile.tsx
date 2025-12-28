import { useState } from "react";
import {
  Users,
  MessageCircle,
  Heart,
  Repeat2,
  ExternalLink,
  MapPin,
  Calendar,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  Hash,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTwitterUser } from "@/hooks/useTwitterUser";
import { formatDistanceToNow } from "date-fns";

interface TwitterProfileProps {
  username: string;
  onCashtagClick?: (symbol: string) => void;
  onHashtagClick?: (hashtag: string) => void;
}

export const TwitterProfile = ({
  username,
  onCashtagClick,
  onHashtagClick,
}: TwitterProfileProps) => {
  const { user, tweets, loading, error, refetch } = useTwitterUser(username, {
    enabled: true,
    refreshInterval: 300000, // Refresh every 5 minutes
  });

  const [showAllTweets, setShowAllTweets] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading Twitter Profile...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-red-600">Twitter Profile Error</span>
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Check if the username exists and the API is properly configured.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Twitter User Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Unable to find Twitter user: @{username}
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayedTweets = showAllTweets ? tweets : tweets.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Twitter Profile</span>
              {user.verified && (
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
              )}
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
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.profile_image_url} alt={user.name} />
              <AvatarFallback>
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg">{user.name}</h3>
                {user.verified && (
                  <CheckCircle2 className="h-5 w-5 text-blue-500" />
                )}
                {user.verified_type === "blue" && (
                  <Badge variant="secondary" className="text-xs">
                    Premium
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-2">@{user.username}</p>

              {user.description && (
                <p className="text-sm mb-3">{user.description}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {user.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {formatDistanceToNow(new Date(user.created_at))} ago
                </div>
                {user.url && (
                  <a
                    href={user.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="font-bold text-lg">
                {formatNumber(user.public_metrics.tweet_count)}
              </div>
              <div className="text-xs text-muted-foreground">Tweets</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">
                {formatNumber(user.public_metrics.followers_count)}
              </div>
              <div className="text-xs text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">
                {formatNumber(user.public_metrics.following_count)}
              </div>
              <div className="text-xs text-muted-foreground">Following</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">
                {formatNumber(user.public_metrics.like_count)}
              </div>
              <div className="text-xs text-muted-foreground">Likes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Tweets */}
      {tweets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Tweets</span>
              <Badge variant="outline">{tweets.length} tweets</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {displayedTweets.map((tweet) => (
              <div
                key={tweet.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div
                  className="text-sm mb-3 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: renderTweetText(tweet.text),
                  }}
                  onClick={handleTextClick}
                />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {formatDistanceToNow(new Date(tweet.created_at))} ago
                  </span>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {formatNumber(tweet.public_metrics.reply_count)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Repeat2 className="h-3 w-3" />
                      {formatNumber(tweet.public_metrics.retweet_count)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {formatNumber(tweet.public_metrics.like_count)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {tweets.length > 3 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAllTweets(!showAllTweets)}
              >
                {showAllTweets
                  ? "Show Less"
                  : `Show All ${tweets.length} Tweets`}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
