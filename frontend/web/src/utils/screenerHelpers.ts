export interface ScreenerMetrics {
  price: number;
  change1D: number;
  volume: number;
  marketCap: string;
  pe: number;
  eps: number;
  rsi: number;
  sentimentScore: number;
  socialMentions: number;
  newsScore: number;
  aiConfidence: number;
}

export interface ScreenerFilters {
  priceRange: [number, number];
  peRange: [number, number];
  rsiRange: [number, number];
  sentimentRange: [number, number];
  volumeFilter: string;
  marketCapFilter: string;
  sectorFilter: string;
  socialBuzzFilter: string;
  newsScoreRange: [number, number];
  change1DRange: [number, number];
  volatilityRange: [number, number];
}

export const defaultFilters: ScreenerFilters = {
  priceRange: [0, 500],
  peRange: [0, 100],
  rsiRange: [0, 100],
  sentimentRange: [0, 100],
  volumeFilter: "All",
  marketCapFilter: "All",
  sectorFilter: "All",
  socialBuzzFilter: "All",
  newsScoreRange: [0, 100],
  change1DRange: [-20, 20],
  volatilityRange: [0, 10]
};

export const getMarketCapBadgeColor = (cap: string) => {
  switch (cap) {
    case "Large": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Mid": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "Small": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

export const getSectorColor = (sector: string) => {
  const colors: { [key: string]: string } = {
    "Technology": "text-blue-400",
    "Finance": "text-green-400",
    "Healthcare": "text-red-400",
    "Consumer": "text-purple-400",
    "Energy": "text-yellow-400",
    "Automotive": "text-indigo-400",
    "Entertainment": "text-pink-400"
  };
  return colors[sector] || "text-gray-400";
};

export const getRSISignal = (rsi: number) => {
  if (rsi > 70) return { signal: "Overbought", color: "text-red-400" };
  if (rsi < 30) return { signal: "Oversold", color: "text-green-400" };
  return { signal: "Neutral", color: "text-gray-400" };
};

export const getSentimentSignal = (score: number) => {
  if (score >= 75) return { signal: "Very Bullish", color: "text-emerald-400" };
  if (score >= 60) return { signal: "Bullish", color: "text-green-400" };
  if (score >= 40) return { signal: "Neutral", color: "text-yellow-400" };
  if (score >= 25) return { signal: "Bearish", color: "text-orange-400" };
  return { signal: "Very Bearish", color: "text-red-400" };
};

export const formatMarketCap = (cap: string) => {
  const fullNames: { [key: string]: string } = {
    "Large": "Large Cap (>$10B)",
    "Mid": "Mid Cap ($2B-$10B)",
    "Small": "Small Cap (<$2B)"
  };
  return fullNames[cap] || cap;
};

export const formatSocialBuzz = (mentions: number) => {
  if (mentions >= 15000) return { level: "🔥 Hot", color: "text-red-400" };
  if (mentions >= 5000) return { level: "📈 Trending", color: "text-orange-400" };
  return { level: "📊 Normal", color: "text-gray-400" };
};

export const getAIConfidenceLevel = (confidence: number) => {
  if (confidence >= 80) return { level: "High", color: "text-green-400", icon: "🎯" };
  if (confidence >= 60) return { level: "Medium", color: "text-yellow-400", icon: "⚖️" };
  return { level: "Low", color: "text-red-400", icon: "⚠️" };
};

export const getVolumeCategory = (volume: number) => {
  if (volume >= 50000000) return { category: "Ultra High", color: "text-red-400" };
  if (volume >= 30000000) return { category: "High", color: "text-orange-400" };
  if (volume >= 10000000) return { category: "Medium", color: "text-yellow-400" };
  return { category: "Low", color: "text-gray-400" };
};

export const generateAIInsight = (stock: any) => {
  const insights = [];
  
  if (stock.rsi > 70) {
    insights.push("Technically overbought - potential pullback");
  } else if (stock.rsi < 30) {
    insights.push("Oversold conditions - potential bounce");
  }
  
  if (stock.sentimentScore > 75 && stock.socialMentions > 10000) {
    insights.push("Strong social sentiment with high buzz");
  }
  
  if (stock.newsScore > 80) {
    insights.push("Positive news catalyst detected");
  }
  
  if (stock.change1D > 5) {
    insights.push("Significant upward momentum");
  } else if (stock.change1D < -5) {
    insights.push("Under selling pressure");
  }
  
  return insights.length > 0 ? insights[0] : "No significant patterns detected";
};

// Predefined AI queries for quick selection
export const aiQueryTemplates = [
  "Find growth stocks with high sentiment in tech sector",
  "Show me oversold value stocks with insider buying",
  "Tech stocks with RSI < 40 and rising social buzz",
  "Dividend stocks with P/E < 20 and positive sentiment",
  "Small cap stocks with high volume and momentum",
  "Stocks breaking above 200-day moving average",
  "High sentiment stocks with recent news catalysts",
  "Undervalued stocks with improving AI confidence"
];

export const exportToCSV = (stocks: any[], filename: string = "screener-results") => {
  const headers = [
    "Ticker", "Company", "Price", "Change %", "Volume", "Market Cap", 
    "P/E", "RSI", "Sentiment Score", "Social Mentions", "News Score", "AI Confidence"
  ];
  
  const csvContent = [
    headers.join(","),
    ...stocks.map(stock => [
      stock.ticker,
      `"${stock.companyName}"`,
      stock.currentPrice,
      stock.change1D,
      stock.volume24h,
      stock.marketCap,
      stock.pe,
      stock.rsi,
      stock.sentimentScore,
      stock.socialMentions,
      stock.newsScore,
      stock.aiConfidence
    ].join(","))
  ].join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};
