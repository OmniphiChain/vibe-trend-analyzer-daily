import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Globe,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Brain,
} from "lucide-react";
import { useBusinessNews } from "../../hooks/useNewsApi";

interface NewsWidgetProps {
  articles: any[];
  loading: boolean;
}

interface ProcessedArticle {
  id: string;
  title: string;
  summary: string;
  sentiment: number;
  source: string;
  timestamp: Date;
  url: string;
  tags: string[];
  aiInsight?: string;
}

export const NewsWidget: React.FC<NewsWidgetProps> = ({
  articles,
  loading,
}) => {
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "positive" | "negative" | "neutral"
  >("all");

  // Process articles and add AI sentiment analysis
  const processedArticles: ProcessedArticle[] = (articles || [])
    .slice(0, 10)
    .map((article, index) => {
      // Calculate sentiment score based on headline analysis
      const positiveWords = [
        "gain",
        "rise",
        "surge",
        "boost",
        "growth",
        "profit",
        "success",
        "strong",
        "bull",
        "rally",
      ];
      const negativeWords = [
        "fall",
        "drop",
        "decline",
        "loss",
        "crash",
        "fear",
        "bear",
        "weak",
        "concern",
        "risk",
      ];

      const title = article.headline || article.title || "";
      const lowerTitle = title.toLowerCase();

      let sentiment = 50; // Neutral baseline
      positiveWords.forEach((word) => {
        if (lowerTitle.includes(word)) sentiment += 10;
      });
      negativeWords.forEach((word) => {
        if (lowerTitle.includes(word)) sentiment -= 10;
      });

      sentiment = Math.max(0, Math.min(100, sentiment));

      return {
        id: article.id || `article-${index}`,
        title: title,
        summary:
          article.summary || article.description || "No summary available",
        sentiment,
        source:
          typeof article.source === "object" && article.source?.name
            ? article.source.name
            : article.source || "Unknown",
        timestamp: new Date(article.publishedAt || Date.now()),
        url: article.url || "#",
        tags: extractTags(title),
        aiInsight: generateAIInsight(sentiment, title),
      };
    });

  function extractTags(title: string): string[] {
    const tags = [];
    if (
      title.toLowerCase().includes("fed") ||
      title.toLowerCase().includes("federal")
    )
      tags.push("Fed");
    if (
      title.toLowerCase().includes("crypto") ||
      title.toLowerCase().includes("bitcoin")
    )
      tags.push("Crypto");
    if (
      title.toLowerCase().includes("stock") ||
      title.toLowerCase().includes("market")
    )
      tags.push("Markets");
    if (
      title.toLowerCase().includes("tech") ||
      title.toLowerCase().includes("ai")
    )
      tags.push("Tech");
    if (
      title.toLowerCase().includes("earn") ||
      title.toLowerCase().includes("profit")
    )
      tags.push("Earnings");
    return tags.slice(0, 3);
  }

  function generateAIInsight(sentiment: number, title: string): string {
    if (sentiment >= 70) {
      return "Bullish indicators suggest positive market impact. Expect increased investor confidence.";
    } else if (sentiment <= 30) {
      return "Bearish sentiment detected. Potential market volatility and risk-off behavior likely.";
    } else {
      return "Neutral market impact expected. Monitor for developing trends and sentiment shifts.";
    }
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return "text-green-600 dark:text-green-400";
    if (sentiment >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getSentimentBadge = (sentiment: number) => {
    if (sentiment >= 70)
      return {
        label: "Bullish",
        variant: "default" as const,
        color: "bg-green-500",
      };
    if (sentiment >= 50)
      return {
        label: "Neutral",
        variant: "secondary" as const,
        color: "bg-yellow-500",
      };
    return {
      label: "Bearish",
      variant: "destructive" as const,
      color: "bg-red-500",
    };
  };

  const filteredArticles = processedArticles.filter((article) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "positive") return article.sentiment >= 70;
    if (selectedFilter === "negative") return article.sentiment <= 30;
    return article.sentiment > 30 && article.sentiment < 70;
  });

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-purple-900/20">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="w-6 h-6" />
            <span>Smart News Feed</span>
            <Badge variant="secondary" className="bg-white/20 text-white">
              AI Powered
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6">
          {[
            { key: "all", label: "All News", count: processedArticles.length },
            {
              key: "positive",
              label: "Bullish",
              count: processedArticles.filter((a) => a.sentiment >= 70).length,
            },
            {
              key: "neutral",
              label: "Neutral",
              count: processedArticles.filter(
                (a) => a.sentiment > 30 && a.sentiment < 70,
              ).length,
            },
            {
              key: "negative",
              label: "Bearish",
              count: processedArticles.filter((a) => a.sentiment <= 30).length,
            },
          ].map((filter) => (
            <Button
              key={filter.key}
              variant={selectedFilter === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter.key as any)}
              className={
                selectedFilter === filter.key
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600"
                  : ""
              }
            >
              {filter.label}
              {filter.count > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {filter.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* News Articles */}
        <div className="space-y-4">
          {loading && (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-500" />
              <p className="text-gray-600 dark:text-gray-400">
                Loading latest news...
              </p>
            </div>
          )}

          {filteredArticles.map((article) => {
            const sentimentBadge = getSentimentBadge(article.sentiment);
            const isExpanded = expandedArticle === article.id;

            return (
              <div
                key={article.id}
                className="group p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-800"
              >
                {/* Article Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge
                        variant={sentimentBadge.variant}
                        className={`${sentimentBadge.color} text-white`}
                      >
                        {sentimentBadge.label}
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {article.source}
                      </span>
                      <span className="text-sm text-gray-400">
                        {getTimeAgo(article.timestamp)}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 mb-2">
                      {article.title}
                    </h3>

                    {/* Tags */}
                    {article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {article.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <div className="text-right">
                      <div
                        className={`font-bold ${getSentimentColor(article.sentiment)}`}
                      >
                        {Math.round(article.sentiment)}
                      </div>
                      <div className="text-xs text-gray-500">sentiment</div>
                    </div>
                    {article.sentiment >= 60 ? (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : article.sentiment <= 40 ? (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-yellow-500"></div>
                    )}
                  </div>
                </div>

                {/* Article Summary */}
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                  {article.summary}
                </p>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-purple-600 dark:text-purple-400">
                        AI Insight
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {article.aiInsight}
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Read Full Article
                      </a>
                    </Button>
                  </div>
                )}

                {/* Expand/Collapse Button */}
                <div className="flex items-center justify-between mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setExpandedArticle(isExpanded ? null : article.id)
                    }
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    {isExpanded ? "Hide Details" : "AI Analysis"}
                    <ChevronDown
                      className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </Button>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {!loading && filteredArticles.length === 0 && (
            <div className="text-center py-8">
              <Globe className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                No news articles match your filter
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>AI-powered sentiment analysis</span>
              <span>•</span>
              <span>Updated every 5 minutes</span>
            </div>
            <Button variant="outline" size="sm">
              View All News
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsWidget;
