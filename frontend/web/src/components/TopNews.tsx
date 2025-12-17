import { useState } from "react";
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NewsDetailModal } from "./NewsDetailModal";
import { useCombinedBusinessNews } from "@/hooks/useCombinedBusinessNews";
import { newsArticles } from "@/data/mockData";
import YFinanceSetupStatus from "./YFinanceSetupStatus";

export const TopNews = () => {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get combined business news from NewsAPI and YFinance
  const { articles, loading, error, refetch, sources } =
    useCombinedBusinessNews({
      refreshInterval: 180000, // Refresh every 3 minutes
      enabled: true,
      includeNewsApi: true,
      includeYFinanceNews: true,
      maxArticles: 25,
    });

  // Debug logging
  console.log(
    "TopNews - Combined articles:",
    articles.length,
    "NewsAPI:",
    sources.newsApi.articles.length,
    "YFinance:",
    sources.yfinance.articles.length,
    "loading:",
    loading,
    "error:",
    error,
  );

  // Use mock articles if no articles from any API
  const displayArticles = articles.length > 0 ? articles : newsArticles;

  const handleArticleClick = (article: any) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const getSentimentColor = (score: number) => {
    if (score >= 70) return "text-positive";
    if (score >= 40) return "text-neutral";
    return "text-negative";
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 70) return "Positive";
    if (score >= 40) return "Neutral";
    return "Negative";
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Newspaper className="h-5 w-5" />
              Top Business News
              <div className="flex gap-1 ml-2">
                {sources.newsApi.articles.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    NewsAPI: {sources.newsApi.articles.length}
                  </Badge>
                )}
                {sources.yfinance.articles.length > 0 ? (
                  <Badge variant="outline" className="text-xs">
                    YFinance: {sources.yfinance.articles.length}
                  </Badge>
                ) : sources.yfinance.error?.includes("service not available") ||
                  sources.yfinance.error?.includes("setup_required") ? (
                  <Badge variant="secondary" className="text-xs">
                    YFinance: Setup Required
                  </Badge>
                ) : null}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={refetch}
              disabled={loading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </CardTitle>
        </CardHeader>

        {/* Show YFinance setup component if service is not available */}
        {sources.yfinance.error?.includes("service not available") ||
        sources.yfinance.error?.includes("setup_required") ? (
          <CardContent className="pt-0 pb-4">
            <YFinanceSetupStatus />
          </CardContent>
        ) : null}

        <CardContent className="space-y-4">
          {loading && displayArticles.length === 0 ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Loading latest news...</p>
            </div>
          ) : error && displayArticles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">Error loading news</p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button variant="outline" onClick={refetch} size="sm">
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {displayArticles.slice(0, 5).map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm leading-tight mb-2 hover:text-primary transition-colors">
                        {article.headline}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
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
                </div>
              ))}

              <div className="mt-4 p-3 bg-muted/30 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">
                  Click any article to see detailed sentiment analysis and
                  insights
                </p>
              </div>
            </>
          )}

          {error && displayArticles.length > 0 && (
            <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-center">
              <p className="text-xs text-orange-600">{error}</p>
            </div>
          )}

          {sources.yfinance.error?.includes("service not available") && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-center">
              <p className="text-xs text-blue-600">
                📊 Enhanced financial news from YFinance requires Python setup.
                Currently showing NewsAPI business news.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <NewsDetailModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
