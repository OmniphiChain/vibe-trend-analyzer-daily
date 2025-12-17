import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  RefreshCw, 
  Users, 
  Grid3X3, 
  CheckCircle,
  ExternalLink,
  Heart,
  MessageCircle,
  Eye
} from "lucide-react";
import { useInstagramUser, formatInstagramCount } from "@/hooks/useInstagram";

interface InstagramProfileProps {
  onUsernameSelect?: (username: string) => void;
}

export const InstagramProfile = ({ onUsernameSelect }: InstagramProfileProps) => {
  const [searchUsername, setSearchUsername] = useState("");
  const [currentUsername, setCurrentUsername] = useState("investopedia");
  
  const { user, loading, error, refetch } = useInstagramUser(currentUsername, {
    enabled: true,
    refreshInterval: 300000, // 5 minutes
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      setCurrentUsername(searchUsername.trim());
      onUsernameSelect?.(searchUsername.trim());
    }
  };

  const popularFinanceAccounts = [
    "investopedia", "cnbc", "bloomberg", "marketwatch", 
    "nasdaq", "wallstreetjournal", "forbes", "cryptocurrency"
  ];

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Instagram Profile Search
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <Input
              placeholder="Enter Instagram username..."
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!searchUsername.trim()}>
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Quick Access */}
          <div className="flex flex-wrap gap-2">
            {popularFinanceAccounts.map((username) => (
              <Button
                key={username}
                variant={currentUsername === username ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCurrentUsername(username);
                  setSearchUsername(username);
                  onUsernameSelect?.(username);
                }}
              >
                @{username}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5" />
            Profile: @{currentUsername}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-60" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">
                {error.includes("private") ? "This account is private" : "Unable to load profile"}
              </p>
              <p className="text-sm text-muted-foreground">
                {error}
              </p>
            </div>
          ) : user ? (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.profile_pic_url} alt={user.username} />
                  <AvatarFallback>
                    {user.full_name?.slice(0, 2).toUpperCase() || user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">
                      {user.full_name || `@${user.username}`}
                    </h3>
                    {user.is_verified && (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    )}
                    {user.is_private && (
                      <Badge variant="secondary">Private</Badge>
                    )}
                  </div>

                  <p className="text-muted-foreground">@{user.username}</p>

                  {user.external_url && (
                    <div className="flex items-center gap-1 text-sm text-blue-600">
                      <ExternalLink className="h-4 w-4" />
                      <a 
                        href={user.external_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {user.external_url.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">
                    {formatInstagramCount(user.media_count)}
                  </div>
                  <div className="text-sm text-muted-foreground">Posts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {formatInstagramCount(user.follower_count)}
                  </div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {formatInstagramCount(user.following_count)}
                  </div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
              </div>

              {/* Biography */}
              {user.biography && (
                <div>
                  <h4 className="font-semibold mb-2">Biography</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {user.biography}
                  </p>
                </div>
              )}

              {/* Instagram Link */}
              <div className="pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(`https://instagram.com/${user.username}`, '_blank')}
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Instagram
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Search for an Instagram profile to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};