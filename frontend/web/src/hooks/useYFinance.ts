import { useQuery, UseQueryResult } from "@tanstack/react-query";

// YFinance Article Interface
export interface YFinanceArticle {
  id: string;
  headline: string;
  url: string;
  time?: string;
  source: string;
  sentiment_score: number;
  symbol?: string;
}

// YFinance News Response Interface
export interface YFinanceNewsResponse {
  status: string;
  source: string;
  total: number;
  articles: YFinanceArticle[];
  error?: string;
}

// YFinance Sentiment Response Interface
export interface YFinanceSentimentResponse {
  status: string;
  source: string;
  sentiment_score: number;
  article_count: number;
  raw_sentiment: number;
  latest_articles: YFinanceArticle[];
  trending_articles: YFinanceArticle[];
  error?: string;
}

// YFinance Ticker Info Response Interface
export interface YFinanceTickerData {
  symbol: string;
  company_name: string;
  sector: string;
  industry: string;
  country: string;
  currency: string;
  exchange: string;
  website: string;
  business_summary: string;
  market_cap: number;
  enterprise_value: number;
  pe_ratio: number;
  forward_pe: number;
  peg_ratio: number;
  price_to_book: number;
  price_to_sales: number;
  debt_to_equity: number;
  return_on_equity: number;
  return_on_assets: number;
  profit_margin: number;
  gross_margin: number;
  operating_margin: number;
  dividend_yield: number;
  dividend_rate: number;
  payout_ratio: number;
  ex_dividend_date: string;
  shares_outstanding: number;
  float_shares: number;
  shares_short: number;
  short_ratio: number;
  beta: number;
  "52_week_high": number;
  "52_week_low": number;
  "50_day_average": number;
  "200_day_average": number;
  average_volume: number;
  average_volume_10days: number;
  bid: number;
  ask: number;
  bid_size: number;
  ask_size: number;
  total_revenue: number;
  revenue_per_share: number;
  earnings_per_share: number;
  forward_eps: number;
  earnings_growth: number;
  revenue_growth: number;
  recommendation: string;
  target_high_price: number;
  target_low_price: number;
  target_mean_price: number;
  number_of_analyst_opinions: number;
  full_time_employees: number;
  audit_risk: number;
  board_risk: number;
  compensation_risk: number;
  shareholder_rights_risk: number;
  overall_risk: number;
  current_price: number;
  price_change: number;
  price_change_percent: number;
  volume: number;
}

export interface YFinanceTickerResponse {
  status: string;
  source: string;
  symbol: string;
  data: YFinanceTickerData;
  error?: string;
}

// Hook for fetching latest market news
export function useYFinanceLatestNews(
  refreshInterval: number = 300000,
): UseQueryResult<YFinanceNewsResponse> {
  return useQuery({
    queryKey: ["yfinance", "news", "latest"],
    queryFn: async (): Promise<YFinanceNewsResponse> => {
      try {
        const response = await fetch("/api/proxy/yfinance/news/latest", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // If service returns error, provide mock data
        if (data.error) {
          return createMockLatestNews();
        }

        return data;
      } catch (error) {
        console.warn("YFinance latest news failed, using mock data:", error);
        return createMockLatestNews();
      }
    },
    refetchInterval: refreshInterval,
    staleTime: 240000, // 4 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook for fetching stock-specific news
export function useYFinanceStockNews(
  symbol: string = "SPY",
  refreshInterval: number = 300000,
): UseQueryResult<YFinanceNewsResponse> {
  return useQuery({
    queryKey: ["yfinance", "news", "stock", symbol],
    queryFn: async (): Promise<YFinanceNewsResponse> => {
      try {
        const response = await fetch(
          `/api/proxy/yfinance/news/trending?symbol=${symbol}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // If service returns error, provide mock data
        if (data.error) {
          return createMockStockNews(symbol);
        }

        return data;
      } catch (error) {
        console.warn(
          `YFinance stock news for ${symbol} failed, using mock data:`,
          error,
        );
        return createMockStockNews(symbol);
      }
    },
    refetchInterval: refreshInterval,
    staleTime: 240000, // 4 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: true,
  });
}

// Hook for fetching enhanced market sentiment data
export function useYFinanceSentiment(
  refreshInterval: number = 300000,
): UseQueryResult<YFinanceSentimentResponse> {
  return useQuery({
    queryKey: ["yfinance", "sentiment"],
    queryFn: async (): Promise<YFinanceSentimentResponse> => {
      try {
        const response = await fetch("/api/proxy/yfinance/sentiment", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // If service returns error, provide mock data
        if (data.error) {
          return createMockSentiment();
        }

        return data;
      } catch (error) {
        console.warn("YFinance sentiment failed, using mock data:", error);
        return createMockSentiment();
      }
    },
    refetchInterval: refreshInterval,
    staleTime: 240000, // 4 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook for fetching comprehensive ticker information
export function useYFinanceTickerInfo(
  symbol: string,
  refreshInterval: number = 300000,
): UseQueryResult<YFinanceTickerResponse> {
  return useQuery({
    queryKey: ["yfinance", "ticker", symbol],
    queryFn: async (): Promise<YFinanceTickerResponse> => {
      try {
        const response = await fetch(
          `/api/proxy/yfinance/ticker?symbol=${symbol}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // If service returns error, provide mock data
        if (data.error) {
          return createMockTickerInfo(symbol);
        }

        return data;
      } catch (error) {
        console.warn(
          `YFinance ticker info for ${symbol} failed, using mock data:`,
          error,
        );
        return createMockTickerInfo(symbol);
      }
    },
    enabled: !!symbol,
    refetchInterval: refreshInterval,
    staleTime: 240000, // 4 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Combined hook for all YFinance data
export function useYFinanceData(refreshInterval: number = 300000) {
  const latestNews = useYFinanceLatestNews(refreshInterval);
  const stockNews = useYFinanceStockNews("SPY", refreshInterval);
  const sentiment = useYFinanceSentiment(refreshInterval);

  return {
    latestNews,
    stockNews,
    sentiment,
    isLoading:
      latestNews.isLoading || stockNews.isLoading || sentiment.isLoading,
    isError:
      (latestNews.isError || stockNews.isError || sentiment.isError) &&
      !(latestNews.data || stockNews.data || sentiment.data),
    hasData: latestNews.data || stockNews.data || sentiment.data,
  };
}

// Mock data creation functions
function createMockLatestNews(): YFinanceNewsResponse {
  const articles: YFinanceArticle[] = [
    {
      id: "mock_market_1",
      headline: "S&P 500 Reaches New Highs on Strong Earnings Reports",
      url: "https://example.com/sp500-highs",
      time: "2 hours ago",
      source: "Financial News",
      sentiment_score: 0.75,
      symbol: "SPY",
    },
    {
      id: "mock_market_2",
      headline: "Federal Reserve Signals Cautious Approach to Interest Rates",
      url: "https://example.com/fed-rates",
      time: "4 hours ago",
      source: "Reuters",
      sentiment_score: 0.15,
      symbol: "^VIX",
    },
    {
      id: "mock_market_3",
      headline: "Technology Sector Shows Continued Growth Momentum",
      url: "https://example.com/tech-growth",
      time: "6 hours ago",
      source: "Bloomberg",
      sentiment_score: 0.65,
      symbol: "QQQ",
    },
    {
      id: "mock_market_4",
      headline: "Small-Cap Stocks Outperform Amid Economic Optimism",
      url: "https://example.com/small-cap",
      time: "8 hours ago",
      source: "MarketWatch",
      sentiment_score: 0.55,
      symbol: "IWM",
    },
  ];

  return {
    status: "success",
    source: "YFinance Market News (Mock Data)",
    total: articles.length,
    articles: articles,
    error: "Using mock data - YFinance service not available",
  };
}

function createMockStockNews(symbol: string): YFinanceNewsResponse {
  const companyNames: Record<string, string> = {
    AAPL: "Apple Inc.",
    MSFT: "Microsoft Corporation",
    GOOGL: "Alphabet Inc.",
    AMZN: "Amazon.com Inc.",
    TSLA: "Tesla Inc.",
    SPY: "SPDR S&P 500 ETF",
  };

  const companyName = companyNames[symbol] || `${symbol} Corporation`;

  const articles: YFinanceArticle[] = [
    {
      id: `mock_${symbol}_1`,
      headline: `${companyName} Reports Strong Quarterly Results`,
      url: `https://example.com/${symbol.toLowerCase()}-earnings`,
      time: "1 hour ago",
      source: "Financial Times",
      sentiment_score: 0.8,
      symbol: symbol,
    },
    {
      id: `mock_${symbol}_2`,
      headline: `Analysts Upgrade ${companyName} Price Target`,
      url: `https://example.com/${symbol.toLowerCase()}-upgrade`,
      time: "3 hours ago",
      source: "CNBC",
      sentiment_score: 0.7,
      symbol: symbol,
    },
    {
      id: `mock_${symbol}_3`,
      headline: `${companyName} Announces Strategic Partnership`,
      url: `https://example.com/${symbol.toLowerCase()}-partnership`,
      time: "5 hours ago",
      source: "Wall Street Journal",
      sentiment_score: 0.6,
      symbol: symbol,
    },
  ];

  return {
    status: "success",
    source: `YFinance News for ${symbol} (Mock Data)`,
    total: articles.length,
    articles: articles,
    error: "Using mock data - YFinance service not available",
  };
}

function createMockSentiment(): YFinanceSentimentResponse {
  const mockArticles: YFinanceArticle[] = [
    {
      id: "mock_sentiment_1",
      headline: "Market Optimism Drives Tech Rally",
      url: "https://example.com/tech-rally",
      time: "1 hour ago",
      source: "Bloomberg",
      sentiment_score: 0.8,
    },
    {
      id: "mock_sentiment_2",
      headline: "Economic Data Shows Mixed Signals",
      url: "https://example.com/economic-data",
      time: "3 hours ago",
      source: "Reuters",
      sentiment_score: 0.2,
    },
  ];

  return {
    status: "success",
    source: "YFinance Enhanced via Market News (Mock Data)",
    sentiment_score: 68,
    article_count: 15,
    raw_sentiment: 0.36,
    latest_articles: mockArticles,
    trending_articles: mockArticles,
    error: "Using mock data - YFinance service not available",
  };
}

function createMockTickerInfo(symbol: string): YFinanceTickerResponse {
  const companyData: Record<string, Partial<YFinanceTickerData>> = {
    AAPL: {
      company_name: "Apple Inc.",
      sector: "Technology",
      industry: "Consumer Electronics",
      country: "United States",
      market_cap: 3000000000000,
      pe_ratio: 28.5,
      current_price: 185.5,
      price_change: 2.35,
      price_change_percent: 1.28,
    },
    MSFT: {
      company_name: "Microsoft Corporation",
      sector: "Technology",
      industry: "Software",
      country: "United States",
      market_cap: 2800000000000,
      pe_ratio: 32.1,
      current_price: 378.25,
      price_change: -1.45,
      price_change_percent: -0.38,
    },
    GOOGL: {
      company_name: "Alphabet Inc.",
      sector: "Technology",
      industry: "Internet Content & Information",
      country: "United States",
      market_cap: 2100000000000,
      pe_ratio: 24.8,
      current_price: 168.75,
      price_change: 3.22,
      price_change_percent: 1.95,
    },
  };

  const baseData = companyData[symbol] || {
    company_name: `${symbol} Corporation`,
    sector: "Technology",
    industry: "Software",
    country: "United States",
    market_cap: 100000000000,
    pe_ratio: 25.0,
    current_price: 150.0,
    price_change: 1.5,
    price_change_percent: 1.0,
  };

  const mockData: YFinanceTickerData = {
    symbol: symbol,
    company_name: baseData.company_name!,
    sector: baseData.sector!,
    industry: baseData.industry!,
    country: baseData.country!,
    currency: "USD",
    exchange: "NASDAQ",
    website: `https://www.${symbol.toLowerCase()}.com`,
    business_summary: `${baseData.company_name} is a leading company in the ${baseData.industry} industry.`,
    market_cap: baseData.market_cap!,
    enterprise_value: baseData.market_cap! * 1.1,
    pe_ratio: baseData.pe_ratio!,
    forward_pe: baseData.pe_ratio! * 0.9,
    peg_ratio: 1.2,
    price_to_book: 4.5,
    price_to_sales: 6.8,
    debt_to_equity: 45.2,
    return_on_equity: 0.18,
    return_on_assets: 0.12,
    profit_margin: 0.22,
    gross_margin: 0.38,
    operating_margin: 0.28,
    dividend_yield: 0.015,
    dividend_rate: 2.4,
    payout_ratio: 0.3,
    ex_dividend_date: "2024-08-15",
    shares_outstanding: baseData.market_cap! / baseData.current_price!,
    float_shares: (baseData.market_cap! / baseData.current_price!) * 0.95,
    shares_short: 50000000,
    short_ratio: 2.1,
    beta: 1.15,
    "52_week_high": baseData.current_price! * 1.25,
    "52_week_low": baseData.current_price! * 0.75,
    "50_day_average": baseData.current_price! * 0.98,
    "200_day_average": baseData.current_price! * 0.95,
    average_volume: 75000000,
    average_volume_10days: 80000000,
    bid: baseData.current_price! - 0.05,
    ask: baseData.current_price! + 0.05,
    bid_size: 1000,
    ask_size: 1200,
    total_revenue: 380000000000,
    revenue_per_share: 25.5,
    earnings_per_share: 6.8,
    forward_eps: 7.2,
    earnings_growth: 0.08,
    revenue_growth: 0.05,
    recommendation: "BUY",
    target_high_price: baseData.current_price! * 1.3,
    target_low_price: baseData.current_price! * 1.1,
    target_mean_price: baseData.current_price! * 1.2,
    number_of_analyst_opinions: 25,
    full_time_employees: 150000,
    audit_risk: 2,
    board_risk: 1,
    compensation_risk: 3,
    shareholder_rights_risk: 2,
    overall_risk: 2,
    current_price: baseData.current_price!,
    price_change: baseData.price_change!,
    price_change_percent: baseData.price_change_percent!,
    volume: 65000000,
  };

  return {
    status: "success",
    source: "YFinance (Mock Data)",
    symbol: symbol,
    data: mockData,
    error: "Using mock data - YFinance service not available",
  };
}
