// Mock data for MoodMeter sentiment analysis
export interface SentimentSource {
  name: string;
  score: number;
  change: number;
  icon: string;
  samples: number;
}

export interface HistoricalData {
  date: string;
  score: number;
  sources: {
    news: number;
    social: number;
    forums: number;
    stocks: number;
  };
}

export interface VibePhrase {
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  source: string;
  influence: number;
}

export const currentMoodScore = 72;

export const sentimentSources: SentimentSource[] = [
  {
    name: "News",
    score: 68,
    change: -3.2,
    icon: "📰",
    samples: 15420,
  },
  {
    name: "Social Media",
    score: 75,
    change: 5.8,
    icon: "📱",
    samples: 45230,
  },
  {
    name: "Forums",
    score: 71,
    change: 2.1,
    icon: "💬",
    samples: 8760,
  },
  {
    name: "Stock Market",
    score: 76,
    change: 8.4,
    icon: "📈",
    samples: 12340,
    description: "Legacy sentiment score (to be replaced by new scoring module)"
  },
];

export const weeklyTrend: HistoricalData[] = [
  {
    date: "2025-01-08",
    score: 65,
    sources: { news: 62, social: 68, forums: 66, stocks: 64 },
  },
  {
    date: "2025-01-09",
    score: 68,
    sources: { news: 65, social: 71, forums: 68, stocks: 68 },
  },
  {
    date: "2025-01-10",
    score: 71,
    sources: { news: 69, social: 73, forums: 70, stocks: 72 },
  },
  {
    date: "2025-01-11",
    score: 69,
    sources: { news: 66, social: 72, forums: 69, stocks: 69 },
  },
  {
    date: "2025-01-12",
    score: 73,
    sources: { news: 70, social: 76, forums: 72, stocks: 74 },
  },
  {
    date: "2025-01-13",
    score: 75,
    sources: { news: 72, social: 78, forums: 74, stocks: 76 },
  },
  {
    date: "2025-01-14",
    score: 72,
    sources: { news: 68, social: 75, forums: 71, stocks: 76 },
  },
];

export const vibePhrases: VibePhrase[] = [
  {
    text: "breakthrough technology innovation",
    sentiment: "positive",
    source: "Tech News",
    influence: 8.2,
  },
  {
    text: "market volatility concerns",
    sentiment: "negative",
    source: "Financial Forums",
    influence: 6.7,
  },
  {
    text: "optimistic quarterly projections",
    sentiment: "positive",
    source: "Business News",
    influence: 7.9,
  },
  {
    text: "community rallying together",
    sentiment: "positive",
    source: "Social Media",
    influence: 5.4,
  },
  {
    text: "regulatory uncertainty ahead",
    sentiment: "negative",
    source: "Policy Forums",
    influence: 4.3,
  },
];

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  sentimentScore: number;
  keyPhrases: string[];
  source: {
    name: string;
    publishedAt: string;
  };
  originalUrl: string;
  whyItMatters: string;
  relatedTrends?: string[];
}

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    headline: "Tech Giants Report Record Quarterly Earnings Amid AI Boom",
    summary:
      "Major technology companies exceeded analyst expectations this quarter, driven by unprecedented demand for AI-powered services and cloud computing solutions.",
    sentimentScore: 78,
    keyPhrases: [
      "record earnings",
      "AI boom",
      "exceeded expectations",
      "strong demand",
      "innovation",
    ],
    source: {
      name: "Financial Times",
      publishedAt: "2024-01-15T14:30:00Z",
    },
    originalUrl: "https://example.com/tech-earnings",
    whyItMatters:
      "Strong tech earnings indicate market confidence in AI investments, boosting overall economic optimism and driving today's positive sentiment score.",
    relatedTrends: ["AI investment surge", "Cloud computing growth"],
  },
  {
    id: "2",
    headline:
      "Global Markets Show Signs of Volatility Amid Interest Rate Uncertainty",
    summary:
      "Financial markets experienced significant fluctuations as investors await central bank decisions on interest rates, creating uncertainty across major indices.",
    sentimentScore: 32,
    keyPhrases: [
      "market volatility",
      "uncertainty",
      "interest rates",
      "fluctuations",
      "investor concern",
    ],
    source: {
      name: "Reuters",
      publishedAt: "2024-01-15T11:45:00Z",
    },
    originalUrl: "https://example.com/market-volatility",
    whyItMatters:
      "Market uncertainty directly impacts investor confidence and consumer sentiment, contributing to today's mixed mood score readings.",
    relatedTrends: ["Federal Reserve policy", "Global inflation concerns"],
  },
  {
    id: "3",
    headline:
      "Breakthrough in Renewable Energy Storage Could Transform Climate Goals",
    summary:
      "Scientists announce a major advancement in battery technology that could solve renewable energy storage challenges, accelerating the transition to clean power.",
    sentimentScore: 85,
    keyPhrases: [
      "breakthrough",
      "renewable energy",
      "climate goals",
      "battery technology",
      "clean power",
    ],
    source: {
      name: "Nature",
      publishedAt: "2024-01-15T09:20:00Z",
    },
    originalUrl: "https://example.com/energy-breakthrough",
    whyItMatters:
      "This technological breakthrough offers hope for addressing climate change, significantly contributing to positive environmental sentiment trends.",
    relatedTrends: ["Green technology investment", "Climate action progress"],
  },
];

// Source-specific news articles
export const newsArticlesBySource = {
  News: [
    {
      id: "news1",
      headline:
        "Economic Recovery Shows Steady Progress in Manufacturing Sector",
      summary:
        "New data reveals manufacturing output has increased for the third consecutive month, signaling economic resilience despite global challenges.",
      sentimentScore: 72,
      keyPhrases: [
        "economic recovery",
        "steady progress",
        "manufacturing growth",
        "resilience",
        "positive outlook",
      ],
      source: {
        name: "Wall Street Journal",
        publishedAt: "2024-01-15T16:20:00Z",
      },
      originalUrl: "https://example.com/manufacturing-recovery",
      whyItMatters:
        "Manufacturing growth indicates economic stability and job creation, directly boosting consumer confidence and sentiment.",
      relatedTrends: ["Job market recovery", "Industrial growth"],
    },
    {
      id: "news2",
      headline: "Inflation Concerns Rise as Consumer Prices Edge Higher",
      summary:
        "Latest consumer price index shows a modest increase, raising questions about future monetary policy and economic stability.",
      sentimentScore: 42,
      keyPhrases: [
        "inflation concerns",
        "consumer prices",
        "monetary policy",
        "economic uncertainty",
        "price increases",
      ],
      source: {
        name: "CNN Business",
        publishedAt: "2024-01-15T13:15:00Z",
      },
      originalUrl: "https://example.com/inflation-concerns",
      whyItMatters:
        "Rising inflation affects purchasing power and consumer spending, contributing to cautious economic sentiment.",
      relatedTrends: [
        "Federal Reserve decisions",
        "Consumer spending patterns",
      ],
    },
  ],
  "Social Media": [
    {
      id: "social1",
      headline: "Viral Sustainability Movement Gains Momentum Across Platforms",
      summary:
        "Social media users are rallying around environmental initiatives, creating viral content that promotes sustainable living and climate action.",
      sentimentScore: 81,
      keyPhrases: [
        "viral movement",
        "sustainability",
        "environmental initiatives",
        "climate action",
        "positive change",
      ],
      source: {
        name: "Twitter Trends",
        publishedAt: "2024-01-15T18:45:00Z",
      },
      originalUrl: "https://example.com/sustainability-movement",
      whyItMatters:
        "Grassroots environmental movements on social media reflect growing public awareness and optimism about climate action.",
      relatedTrends: ["Environmental activism", "Youth engagement"],
    },
    {
      id: "social2",
      headline: "Online Communities Rally Support for Local Businesses",
      summary:
        "Social media campaigns are driving increased support for small businesses, with users sharing positive experiences and encouraging local shopping.",
      sentimentScore: 76,
      keyPhrases: [
        "community support",
        "local businesses",
        "positive experiences",
        "encouraging",
        "solidarity",
      ],
      source: {
        name: "Instagram Stories",
        publishedAt: "2024-01-15T15:30:00Z",
      },
      originalUrl: "https://example.com/local-business-support",
      whyItMatters:
        "Community-driven business support demonstrates social cohesion and economic optimism at the local level.",
      relatedTrends: ["Community engagement", "Small business growth"],
    },
  ],
  Forums: [
    {
      id: "forum1",
      headline: "Tech Community Debates Future of AI Development Ethics",
      summary:
        "Developer forums are buzzing with discussions about responsible AI development, highlighting both opportunities and concerns for the technology sector.",
      sentimentScore: 68,
      keyPhrases: [
        "AI ethics",
        "responsible development",
        "technology debate",
        "opportunities",
        "thoughtful discussion",
      ],
      source: {
        name: "Stack Overflow",
        publishedAt: "2024-01-15T12:10:00Z",
      },
      originalUrl: "https://example.com/ai-ethics-debate",
      whyItMatters:
        "Thoughtful discussions about AI ethics show the tech community's commitment to responsible innovation.",
      relatedTrends: ["AI governance", "Tech responsibility"],
    },
    {
      id: "forum2",
      headline:
        "Gaming Communities Express Mixed Feelings About Industry Changes",
      summary:
        "Popular gaming forums show divided opinions on recent industry developments, with concerns about monetization balanced by excitement for new technologies.",
      sentimentScore: 55,
      keyPhrases: [
        "mixed feelings",
        "industry changes",
        "monetization concerns",
        "new technologies",
        "divided opinions",
      ],
      source: {
        name: "Reddit Gaming",
        publishedAt: "2024-01-15T14:25:00Z",
      },
      originalUrl: "https://example.com/gaming-industry-sentiment",
      whyItMatters:
        "Gaming industry sentiment reflects broader consumer attitudes toward technology and entertainment value.",
      relatedTrends: ["Gaming innovation", "Consumer expectations"],
    },
  ],
  "Stock Market": [
    {
      id: "market1",
      headline:
        "Green Energy Stocks Surge on Government Investment Announcement",
      summary:
        "Renewable energy stocks experienced significant gains following news of increased government funding for clean energy infrastructure projects.",
      sentimentScore: 84,
      keyPhrases: [
        "green energy surge",
        "government investment",
        "significant gains",
        "clean energy",
        "infrastructure funding",
      ],
      source: {
        name: "Bloomberg Markets",
        publishedAt: "2024-01-15T09:30:00Z",
      },
      originalUrl: "https://example.com/green-energy-surge",
      whyItMatters:
        "Strong performance in green energy stocks indicates investor confidence in sustainable technologies and government policy support.",
      relatedTrends: ["Renewable energy investment", "ESG investing"],
    },
    {
      id: "market2",
      headline: "Banking Sector Faces Headwinds Amid Regulatory Scrutiny",
      summary:
        "Financial stocks declined as investors react to potential new regulations and increased oversight from federal banking authorities.",
      sentimentScore: 35,
      keyPhrases: [
        "banking headwinds",
        "regulatory scrutiny",
        "financial decline",
        "oversight concerns",
        "investor uncertainty",
      ],
      source: {
        name: "MarketWatch",
        publishedAt: "2024-01-15T11:00:00Z",
      },
      originalUrl: "https://example.com/banking-regulatory-concerns",
      whyItMatters:
        "Banking sector uncertainty affects broader financial market confidence and lending conditions for businesses and consumers.",
      relatedTrends: ["Financial regulation", "Banking stability"],
    },
  ],
};

export const regions = [
  { name: "Global", code: "GLOBAL" },
  { name: "North America", code: "NA" },
  { name: "Europe", code: "EU" },
  { name: "Asia Pacific", code: "APAC" },
  { name: "Latin America", code: "LATAM" },
];

export const topics = [
  { name: "All Topics", value: "all" },
  { name: "Finance", value: "finance" },
  { name: "Technology", value: "technology" },
  { name: "Politics", value: "politics" },
  { name: "Healthcare", value: "healthcare" },
  { name: "Environment", value: "environment" },
  { name: "Entertainment", value: "entertainment" },
];

// Enhanced sentiment dashboard data
export interface TrendingKeyword {
  text: string;
  frequency: number;
  sentiment: "positive" | "negative" | "neutral";
  change: number;
  relatedHeadlines: string[];
}

export interface SentimentDashboardData {
  date: string;
  score: number;
  sources: {
    news: number;
    social: number;
    forums: number;
    markets: number;
  };
  keywords: TrendingKeyword[];
  trend: number[];
  summary: string;
  sourceExplanations: {
    [key: string]: string;
  };
}

export const trendingKeywords: TrendingKeyword[] = [
  {
    text: "AI stocks",
    frequency: 1247,
    sentiment: "positive",
    change: 15.3,
    relatedHeadlines: [
      "Tech Giants Report Record AI Revenue Growth",
      "AI Chip Manufacturers See Unprecedented Demand",
      "Investors Rally Behind Artificial Intelligence Sector",
    ],
  },
  {
    text: "interest rates",
    frequency: 892,
    sentiment: "negative",
    change: -8.2,
    relatedHeadlines: [
      "Federal Reserve Signals Potential Rate Adjustments",
      "Banking Sector Braces for Interest Rate Impact",
      "Market Volatility Linked to Rate Uncertainty",
    ],
  },
  {
    text: "earnings season",
    frequency: 756,
    sentiment: "positive",
    change: 12.7,
    relatedHeadlines: [
      "Q4 Earnings Exceed Wall Street Expectations",
      "Corporate Profits Show Strong Recovery Momentum",
      "Technology Sector Leads Earnings Growth",
    ],
  },
  {
    text: "climate action",
    frequency: 634,
    sentiment: "positive",
    change: 23.1,
    relatedHeadlines: [
      "Global Climate Summit Reaches Historic Agreement",
      "Green Energy Investment Hits Record Highs",
      "Companies Accelerate Carbon Neutral Commitments",
    ],
  },
  {
    text: "inflation concerns",
    frequency: 589,
    sentiment: "negative",
    change: -5.4,
    relatedHeadlines: [
      "Consumer Prices Show Mixed Signals",
      "Retailers Adjust Strategy Amid Cost Pressures",
      "Economic Data Points to Persistent Price Challenges",
    ],
  },
  {
    text: "renewable energy",
    frequency: 512,
    sentiment: "positive",
    change: 18.9,
    relatedHeadlines: [
      "Solar and Wind Power Reach Grid Parity",
      "Clean Energy Jobs Surge Across Multiple States",
      "Battery Technology Breakthrough Announced",
    ],
  },
  {
    text: "market volatility",
    frequency: 467,
    sentiment: "negative",
    change: -3.1,
    relatedHeadlines: [
      "Traders Navigate Uncertain Economic Landscape",
      "Currency Fluctuations Impact Global Markets",
      "Commodity Prices Experience Sharp Swings",
    ],
  },
  {
    text: "innovation",
    frequency: 423,
    sentiment: "positive",
    change: 9.8,
    relatedHeadlines: [
      "Breakthrough Medical Device Receives FDA Approval",
      "Startup Ecosystem Shows Resilient Growth",
      "Universities Partner with Industry on Research",
    ],
  },
];

export const sentimentDashboardData: SentimentDashboardData = {
  date: "2025-01-16",
  score: 67,
  sources: {
    news: 72,
    social: 59,
    forums: 64,
    markets: 70,
  },
  keywords: trendingKeywords,
  trend: [62, 63, 65, 60, 66, 67, 67],
  summary:
    "Market sentiment is mildly optimistic, led by tech rally and positive earnings reports, though concerns about interest rates and inflation continue to temper enthusiasm.",
  sourceExplanations: {
    news: "Traditional media sources aggregate breaking news, expert analysis, and financial reports. Higher news sentiment often correlates with positive economic indicators and corporate performance announcements.",
    social:
      "Social media platforms capture real-time public opinion and grassroots movements. This source reflects immediate emotional responses to current events and can be more volatile than traditional media.",
    forums:
      "Specialized discussion communities provide in-depth analysis and expert opinions. Forum sentiment tends to be more analytical and forward-looking, often predicting market trends.",
    markets:
      "Financial market data including stock prices, trading volumes, and volatility indices. Market sentiment directly reflects investor confidence and economic expectations.",
  },
};
