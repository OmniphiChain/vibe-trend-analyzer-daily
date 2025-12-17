import { useState } from "react";
import {
  Newspaper,
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Clock,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useBusinessNews,
  useTechnologyNews,
  useNewsSearch,
} from "@/hooks/useNewsApi";

export const NewsDemo = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  // Get business news
  const {
    articles: businessArticles,
    loading: businessLoading,
    error: businessError,
    refetch: refetchBusiness,
  } = useBusinessNews({
    refreshInterval: 180000, // Refresh every 3 minutes
  });

  // Get technology news
  const {
    articles: techArticles,
    loading: techLoading,
    error: techError,
    refetch: refetchTech,
  } = useTechnologyNews({
    refreshInterval: 180000, // Refresh every 3 minutes
  });

  // Search news
  const {
    articles: searchArticles,
    loading: searchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useNewsSearch(activeSearch, { enabled: !!activeSearch });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setActiveSearch(searchQuery.trim());
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSentimentColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 70) return "Positive";
    if (score >= 40) return "Neutral";
    return "Negative";
  };

import { NewsArticle } from '@/types/common';

  const renderArticleCard = (article: NewsArticle, index: number) => (
    <div
      key={article.id || index}
      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => window.open(article.originalUrl, "_blank")}
    >
      <div className="space-y-3">
        <h3 className="font-medium text-sm leading-tight hover:text-primary transition-colors">
          {article.headline}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-2">
          {article.summary}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={`text-xs ${getSentimentColor(article.sentimentScore)}`}
            >
              <div className="flex items-center gap-1">
                {article.sentimentScore >= 50 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {getSentimentLabel(article.sentimentScore)}{" "}
                {article.sentimentScore}
              </div>
            </Badge>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDate(article.source.publishedAt)}
            </div>
          </div>

          <span className="text-xs font-medium text-muted-foreground">
            {article.source.name}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Newspaper className="h-8 w-8" />
          NewsAPI Integration Demo
        </h1>
        <p className="text-muted-foreground">
          Real-time business and technology news powered by NewsAPI
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search News
          </CardTitle>
          <CardDescription>
            Search for specific news topics and keywords
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search news (e.g., artificial intelligence, cryptocurrency)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={searchLoading}>
              {searchLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </Button>
          </div>

          {activeSearch && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">
                  Search Results for "{activeSearch}"
                </h4>
                <Button variant="ghost" size="sm" onClick={refetchSearch}>
                  <RefreshCw
                    className={`h-4 w-4 ${searchLoading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>

              {searchLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Searching for news...</p>
                </div>
              ) : searchError ? (
                <div className="text-center py-8 text-red-600">
                  <p>Error: {searchError}</p>
                </div>
              ) : searchArticles.length > 0 ? (
                <div className="grid gap-4">
                  {searchArticles.map((article, index) =>
                    renderArticleCard(article, index),
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No articles found for "{activeSearch}"</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* News Tabs */}
      <Tabs defaultValue="business" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="business">Business News</TabsTrigger>
          <TabsTrigger value="technology">Technology News</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Latest Business News</span>
                <Button variant="ghost" size="sm" onClick={refetchBusiness}>
                  <RefreshCw
                    className={`h-4 w-4 ${businessLoading ? "animate-spin" : ""}`}
                  />
                </Button>
              </CardTitle>
              <CardDescription>
                Top business headlines from major news sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              {businessLoading && businessArticles.length === 0 ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Loading business news...</p>
                </div>
              ) : businessError && businessArticles.length === 0 ? (
                <div className="text-center py-8 text-red-600">
                  <p>Error: {businessError}</p>
                  <Button
                    variant="outline"
                    onClick={refetchBusiness}
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {businessArticles.map((article, index) =>
                    renderArticleCard(article, index),
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technology" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Latest Technology News</span>
                <Button variant="ghost" size="sm" onClick={refetchTech}>
                  <RefreshCw
                    className={`h-4 w-4 ${techLoading ? "animate-spin" : ""}`}
                  />
                </Button>
              </CardTitle>
              <CardDescription>
                Top technology headlines and industry updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {techLoading && techArticles.length === 0 ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Loading technology news...</p>
                </div>
              ) : techError && techArticles.length === 0 ? (
                <div className="text-center py-8 text-red-600">
                  <p>Error: {techError}</p>
                  <Button
                    variant="outline"
                    onClick={refetchTech}
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {techArticles.map((article, index) =>
                    renderArticleCard(article, index),
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* API Status */}
      <Card>
        <CardHeader>
          <CardTitle>NewsAPI Integration Status</CardTitle>
          <CardDescription>Current status and limitations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="destructive">CORS Restriction</Badge>
              <span className="font-medium">Using Mock Data</span>
            </div>
            <p className="text-sm text-muted-foreground">
              NewsAPI requires server-side implementation due to browser CORS
              restrictions. The demo shows realistic mock data that represents
              how the integration would work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">API Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Top headlines by category</li>
                <li>• News search functionality</li>
                <li>• Multiple news sources</li>
                <li>• Real-time updates</li>
                <li>• Sentiment analysis integration</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Production Setup</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Server-side API proxy needed</li>
                <li>• Rate limit: 1000 requests/day</li>
                <li>• Real-time sentiment scoring</li>
                <li>• Cache management</li>
                <li>• Error handling & fallbacks</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
