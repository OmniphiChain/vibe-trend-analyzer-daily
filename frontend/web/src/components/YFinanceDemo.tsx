import { useState } from "react";
import { useYFinanceData, useYFinanceTickerInfo } from "@/hooks/useYFinance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Activity,
  BarChart3,
  CheckCircle,
  Clock,
  ExternalLink,
  Globe,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Search,
  Building,
  DollarSign,
  Percent,
  Users,
  TrendingDown,
} from "lucide-react";

export const YFinanceDemo = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [tickerSymbol, setTickerSymbol] = useState("AAPL");
  const { latestNews, stockNews, sentiment, isLoading, isError } =
    useYFinanceData(300000); // 5 minutes
  const tickerInfo = useYFinanceTickerInfo(tickerSymbol);

  // Check if any of the individual queries have errors
  const hasActualError =
    (latestNews.error || stockNews.error || sentiment.error) &&
    !(latestNews.data || stockNews.data || sentiment.data);

  const formatSentimentScore = (
    score: number,
  ): { label: string; color: string } => {
    if (score >= 75) return { label: "Very Positive", color: "text-green-600" };
    if (score >= 60) return { label: "Positive", color: "text-green-500" };
    if (score >= 45)
      return { label: "Slightly Positive", color: "text-blue-500" };
    if (score >= 35) return { label: "Neutral", color: "text-gray-500" };
    if (score >= 25)
      return { label: "Slightly Negative", color: "text-orange-500" };
    if (score >= 15) return { label: "Negative", color: "text-red-500" };
    return { label: "Very Negative", color: "text-red-600" };
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "Recently";
    if (timeStr.includes("hour")) return timeStr;
    if (timeStr.includes("minute")) return timeStr;
    if (timeStr.includes("day")) return timeStr;
    return timeStr;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
          <Globe className="h-8 w-8 text-blue-600" />
          YFinance Integration Demo
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Enhanced financial data integration using the yfinance Python package
          for real-time market news sentiment analysis and stock data.
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">YFinance Service</CardTitle>
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
              ) : hasActualError ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Badge
              variant={
                hasActualError
                  ? "destructive"
                  : isLoading
                    ? "secondary"
                    : "default"
              }
            >
              {hasActualError ? "Error" : isLoading ? "Loading" : "Active"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">News Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(latestNews.data?.total || 0) + (stockNews.data?.total || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Market + Stock News</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Sentiment Score</CardTitle>
          </CardHeader>
          <CardContent>
            {sentiment.data?.sentiment_score !== undefined ? (
              <div>
                <div className="text-2xl font-bold">
                  {sentiment.data.sentiment_score}
                </div>
                <p
                  className={`text-xs ${formatSentimentScore(sentiment.data.sentiment_score).color}`}
                >
                  {formatSentimentScore(sentiment.data.sentiment_score).label}
                </p>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Loading...</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {hasActualError && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to connect to YFinance service. This may be due to network
            issues or service configuration.
            {latestNews.error && (
              <div className="mt-1">
                Market News: {latestNews.error.message}
              </div>
            )}
            {stockNews.error && (
              <div className="mt-1">Stock News: {stockNews.error.message}</div>
            )}
            {sentiment.error && (
              <div className="mt-1">Sentiment: {sentiment.error.message}</div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="market">Market News</TabsTrigger>
          <TabsTrigger value="stocks">Stock News</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="ticker">Ticker Info</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market News Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Latest Market News
                </CardTitle>
              </CardHeader>
              <CardContent>
                {latestNews.data?.articles
                  ?.slice(0, 3)
                  .map((article, index) => (
                    <div
                      key={article.id}
                      className="border-b pb-3 mb-3 last:border-b-0 last:mb-0"
                    >
                      <h4 className="font-medium text-sm mb-1 line-clamp-2">
                        {article.headline}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatTime(article.time)}</span>
                        <Badge variant="outline" className="text-xs">
                          Sentiment:{" "}
                          {article.sentiment_score?.toFixed(2) || "N/A"}
                        </Badge>
                      </div>
                    </div>
                  )) || (
                  <div className="text-sm text-muted-foreground">
                    Loading news...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stock News Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  SPY Stock News
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stockNews.data?.articles?.slice(0, 3).map((article, index) => (
                  <div
                    key={article.id}
                    className="border-b pb-3 mb-3 last:border-b-0 last:mb-0"
                  >
                    <h4 className="font-medium text-sm mb-1 line-clamp-2">
                      {article.headline}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatTime(article.time)}</span>
                      <Badge variant="outline" className="text-xs">
                        Sentiment:{" "}
                        {article.sentiment_score?.toFixed(2) || "N/A"}
                      </Badge>
                    </div>
                  </div>
                )) || (
                  <div className="text-sm text-muted-foreground">
                    Loading stock news...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Market News Feed
                {latestNews.isLoading && (
                  <RefreshCw className="h-4 w-4 animate-spin ml-2" />
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Total: {latestNews.data?.total || 0} market articles from SPY,
                QQQ, IWM, VIX
              </p>
            </CardHeader>
            <CardContent>
              {latestNews.isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                    </div>
                  ))}
                </div>
              ) : latestNews.error ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Error loading market news: {latestNews.error.message}
                  </AlertDescription>
                </Alert>
              ) : latestNews.data?.articles?.length ? (
                <div className="space-y-4">
                  {latestNews.data.articles.map((article, index) => (
                    <div
                      key={article.id}
                      className="border-b pb-4 last:border-b-0"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium mb-2 line-clamp-2">
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 transition-colors"
                            >
                              {article.headline}
                            </a>
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{formatTime(article.time)}</span>
                            <Badge variant="outline">
                              {article.symbol || "Market"}
                            </Badge>
                            <Badge variant="outline">
                              Sentiment:{" "}
                              {article.sentiment_score?.toFixed(2) || "N/A"}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          #{index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No market news available at the moment.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stocks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                SPY Stock-Specific News
                {stockNews.isLoading && (
                  <RefreshCw className="h-4 w-4 animate-spin ml-2" />
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Total: {stockNews.data?.total || 0} SPY-related articles
              </p>
            </CardHeader>
            <CardContent>
              {stockNews.isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                    </div>
                  ))}
                </div>
              ) : stockNews.error ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Error loading stock news: {stockNews.error.message}
                  </AlertDescription>
                </Alert>
              ) : stockNews.data?.articles?.length ? (
                <div className="space-y-4">
                  {stockNews.data.articles.map((article, index) => (
                    <div
                      key={article.id}
                      className="border-b pb-4 last:border-b-0"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium mb-2 line-clamp-2">
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 transition-colors"
                            >
                              {article.headline}
                            </a>
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{formatTime(article.time)}</span>
                            <Badge variant="outline">{article.source}</Badge>
                            <Badge variant="outline">
                              Sentiment:{" "}
                              {article.sentiment_score?.toFixed(2) || "N/A"}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          #{index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No stock news available at the moment.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Enhanced Sentiment Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sentiment.data ? (
                <div className="space-y-6">
                  {/* Sentiment Score Display */}
                  <div className="text-center">
                    <div className="text-6xl font-bold mb-2">
                      {sentiment.data.sentiment_score}
                    </div>
                    <div
                      className={`text-xl font-medium ${formatSentimentScore(sentiment.data.sentiment_score).color}`}
                    >
                      {
                        formatSentimentScore(sentiment.data.sentiment_score)
                          .label
                      }
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Based on {sentiment.data.article_count} articles
                    </div>
                  </div>

                  {/* Sentiment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">
                        Raw Sentiment Score
                      </h4>
                      <div className="text-2xl font-bold">
                        {sentiment.data.raw_sentiment?.toFixed(2) || "N/A"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        (-1.0 to +1.0 scale)
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Articles Analyzed</h4>
                      <div className="text-2xl font-bold">
                        {sentiment.data.article_count}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Market news articles
                      </div>
                    </div>
                  </div>

                  {/* Sample Articles */}
                  <div>
                    <h4 className="font-semibold mb-3">Sample Articles Used</h4>
                    <div className="space-y-2">
                      {sentiment.data.latest_articles
                        ?.slice(0, 3)
                        .map((article) => (
                          <div
                            key={article.id}
                            className="text-sm p-3 border rounded-lg"
                          >
                            <div className="font-medium mb-1">
                              {article.headline}
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                              <span>
                                Sentiment:{" "}
                                {article.sentiment_score?.toFixed(2) || "N/A"}
                              </span>
                              <span>{article.source}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  Loading sentiment analysis...
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ticker" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Stock Ticker Information
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Get comprehensive stock information for any ticker symbol
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter ticker symbol (e.g., AAPL, TSLA, GOOGL)"
                    value={tickerSymbol}
                    onChange={(e) =>
                      setTickerSymbol(e.target.value.toUpperCase())
                    }
                    className="flex-1"
                  />
                  <Button
                    onClick={() => tickerInfo.refetch()}
                    disabled={tickerInfo.isLoading}
                  >
                    {tickerInfo.isLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {tickerInfo.isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : tickerInfo.error ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Error loading ticker information: {tickerInfo.error.message}
                  </AlertDescription>
                </Alert>
              ) : tickerInfo.data?.data ? (
                <div className="space-y-6">
                  {/* Company Overview */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      {tickerInfo.data.data.company_name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Symbol</p>
                        <p className="font-medium">
                          {tickerInfo.data.data.symbol}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Exchange
                        </p>
                        <p className="font-medium">
                          {tickerInfo.data.data.exchange}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Sector</p>
                        <p className="font-medium">
                          {tickerInfo.data.data.sector}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Industry
                        </p>
                        <p className="font-medium">
                          {tickerInfo.data.data.industry}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price Information */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Current Price
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Current Price
                        </p>
                        <p className="text-2xl font-bold">
                          ${tickerInfo.data.data.current_price?.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Price Change
                        </p>
                        <p
                          className={`text-xl font-medium ${tickerInfo.data.data.price_change >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {tickerInfo.data.data.price_change >= 0 ? "+" : ""}$
                          {tickerInfo.data.data.price_change?.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Change %
                        </p>
                        <p
                          className={`text-xl font-medium ${tickerInfo.data.data.price_change_percent >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {tickerInfo.data.data.price_change_percent >= 0
                            ? "+"
                            : ""}
                          {tickerInfo.data.data.price_change_percent?.toFixed(
                            2,
                          )}
                          %
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Metrics */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Financial Metrics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Market Cap
                        </p>
                        <p className="font-medium">
                          ${(tickerInfo.data.data.market_cap / 1e9).toFixed(2)}B
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          P/E Ratio
                        </p>
                        <p className="font-medium">
                          {tickerInfo.data.data.pe_ratio?.toFixed(2) || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">EPS</p>
                        <p className="font-medium">
                          $
                          {tickerInfo.data.data.earnings_per_share?.toFixed(
                            2,
                          ) || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Beta</p>
                        <p className="font-medium">
                          {tickerInfo.data.data.beta?.toFixed(2) || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          52W High
                        </p>
                        <p className="font-medium">
                          $
                          {tickerInfo.data.data["52_week_high"]?.toFixed(2) ||
                            "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">52W Low</p>
                        <p className="font-medium">
                          $
                          {tickerInfo.data.data["52_week_low"]?.toFixed(2) ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dividend Information */}
                  {tickerInfo.data.data.dividend_yield && (
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Percent className="h-5 w-5" />
                        Dividend Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Dividend Yield
                          </p>
                          <p className="font-medium">
                            {(
                              tickerInfo.data.data.dividend_yield * 100
                            ).toFixed(2)}
                            %
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Dividend Rate
                          </p>
                          <p className="font-medium">
                            $
                            {tickerInfo.data.data.dividend_rate?.toFixed(2) ||
                              "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Company Info */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Company Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Employees
                        </p>
                        <p className="font-medium">
                          {tickerInfo.data.data.full_time_employees?.toLocaleString() ||
                            "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <p className="font-medium">
                          {tickerInfo.data.data.website ? (
                            <a
                              href={tickerInfo.data.data.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Website
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </p>
                      </div>
                    </div>
                    {tickerInfo.data.data.business_summary && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Business Summary
                        </p>
                        <p className="text-sm leading-relaxed">
                          {tickerInfo.data.data.business_summary}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  Enter a ticker symbol to get comprehensive stock information
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
