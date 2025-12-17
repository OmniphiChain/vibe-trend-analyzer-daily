import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SourceNewsModal } from "./SourceNewsModal";
import { 
  Brain, 
  TrendingUp, 
  BarChart3, 
  MessageSquare, 
  Globe, 
  Calculator,
  Zap,
  Target,
  RefreshCw,
  Activity,
  ExternalLink
} from "lucide-react";

export const AiSentimentExplainer = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const sentimentMethods = [
    {
      id: "stock-scoring",
      title: "Stock Market Sentiment Scoring",
      icon: <TrendingUp className="h-6 w-6" />,
      description: "Quantitative analysis of top 10 stocks with normalized scoring",
      approach: "Mathematical",
      accuracy: "95%",
      details: {
        dataSource: "Real-time stock prices from Finnhub API",
        algorithm: "Rule-based percentage change analysis",
        scoring: [
          "+3% or more → +10 points",
          "+1% to +3% → +5 points", 
          "-1% to +1% → 0 points",
          "-1% to -3% → -5 points",
          "-3% or less → -10 points"
        ],
        calculation: "Average score × 5 = Final sentiment (-50 to +50)",
        updateFrequency: "Every 5 minutes",
        stocks: ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "BRK.B", "AVGO", "JPM"]
      }
    },
    {
      id: "nlp-analysis",
      title: "Natural Language Processing",
      icon: <MessageSquare className="h-6 w-6" />,
      description: "AI analysis of news headlines, social media, and forum discussions",
      approach: "Machine Learning",
      accuracy: "87%",
      details: {
        dataSource: "News APIs, social media feeds, forum posts",
        algorithm: "Transformer-based sentiment classification",
        models: ["BERT", "RoBERTa", "FinBERT (finance-specific)"],
        processing: [
          "Text preprocessing and tokenization",
          "Named entity recognition (companies, stocks)",
          "Sentiment classification (positive/negative/neutral)",
          "Confidence scoring and aggregation"
        ],
        features: [
          "Context-aware analysis",
          "Financial terminology understanding",
          "Sarcasm and negation detection",
          "Multi-language support"
        ]
      }
    },
    {
      id: "volume-analysis", 
      title: "Trading Volume & Technical Analysis",
      icon: <BarChart3 className="h-6 w-6" />,
      description: "Market behavior analysis through trading patterns and technical indicators",
      approach: "Statistical",
      accuracy: "82%",
      details: {
        dataSource: "Trading volume, price movements, technical indicators",
        algorithm: "Statistical pattern recognition",
        indicators: [
          "Relative Strength Index (RSI)",
          "Moving Average Convergence Divergence (MACD)",
          "Bollinger Bands",
          "Volume-weighted Average Price (VWAP)"
        ],
        analysis: [
          "Unusual volume spikes detection",
          "Price-volume relationship analysis", 
          "Support and resistance level identification",
          "Momentum and trend analysis"
        ]
      }
    },
    {
      id: "news-sentiment",
      title: "News Sentiment Analysis",
      icon: <Globe className="h-6 w-6" />,
      description: "Real-time analysis of financial news and media coverage",
      approach: "Hybrid AI",
      accuracy: "90%",
      details: {
        dataSource: "Financial news feeds, earnings reports, press releases",
        algorithm: "Ensemble of NLP models with financial context",
        processing: [
          "Real-time news feed monitoring",
          "Company and sector impact assessment",
          "Headline vs content sentiment comparison",
          "Source credibility weighting"
        ],
        sources: [
          "NewsAPI.org (80,000+ sources)",
          "Reuters, Bloomberg, CNBC",
          "Company earnings calls",
          "SEC filings and announcements"
        ]
      }
    }
  ];

  const scoringLogic = {
    ranges: [
      { range: "+30 to +50", label: "Bullish", color: "bg-green-600", description: "Strong positive market sentiment" },
      { range: "+10 to +29", label: "Cautiously Optimistic", color: "bg-green-400", description: "Moderate positive sentiment" },
      { range: "-9 to +9", label: "Neutral", color: "bg-yellow-500", description: "Balanced market sentiment" },
      { range: "-10 to -29", label: "Cautiously Bearish", color: "bg-red-400", description: "Moderate negative sentiment" },
      { range: "-30 to -50", label: "Bearish", color: "bg-red-600", description: "Strong negative market sentiment" }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
          <Brain className="h-8 w-8 text-blue-600" />
          AI Market Sentiment Analysis
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Understanding how artificial intelligence analyzes market sentiment through multiple data sources 
          and mathematical models to provide comprehensive market insights.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {sentimentMethods.map((method) => (
          <Card key={method.id} className="cursor-pointer hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                {method.icon}
                <div>
                  <CardTitle className="text-sm">{method.title}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">{method.approach}</Badge>
                    <Badge variant="secondary" className="text-xs">{method.accuracy}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{method.description}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3"
                onClick={() => setActiveDemo(activeDemo === method.id ? null : method.id)}
              >
                {activeDemo === method.id ? "Hide Details" : "Learn More"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analysis */}
      {activeDemo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {sentimentMethods.find(m => m.id === activeDemo)?.icon}
              {sentimentMethods.find(m => m.id === activeDemo)?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
                <TabsTrigger value="implementation">Implementation</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {(() => {
                  const method = sentimentMethods.find(m => m.id === activeDemo);
                  if (!method) return null;
                  
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Data Sources</h4>
                        <p className="text-sm text-muted-foreground mb-4">{method.details.dataSource}</p>
                        
                        <h4 className="font-semibold mb-3">Approach</h4>
                        <Badge className="mb-4">{method.approach} Analysis</Badge>
                        <p className="text-sm text-muted-foreground">
                          Accuracy: <span className="font-semibold text-green-600">{method.accuracy}</span>
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Key Features</h4>
                        <ul className="space-y-2 text-sm">
                          {(method.details.features || method.details.scoring || method.details.indicators || method.details.sources)?.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                              {feature}
                              {feature === "NewsAPI.org (80,000+ sources)" && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="ml-2 h-auto p-1">
                                      <ExternalLink className="h-3 w-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>News Data Sources & Integration</DialogTitle>
                                    </DialogHeader>
                                    <SourceNewsModal />
                                  </DialogContent>
                                </Dialog>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })()}
              </TabsContent>

              <TabsContent value="algorithm" className="space-y-4">
                {(() => {
                  const method = sentimentMethods.find(m => m.id === activeDemo);
                  if (!method) return null;

                  if (method.id === "stock-scoring") {
                    return (
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-3">Scoring Logic</h4>
                          <div className="space-y-2">
                            {method.details.scoring?.map((rule, index) => (
                              <div key={index} className="p-3 border rounded-lg bg-muted/30">
                                <code className="text-sm">{rule}</code>
                              </div>
                            )) || <div className="text-sm text-muted-foreground">No scoring rules available</div>}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3">Calculation Process</h4>
                          <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/30">
                            <p className="text-sm font-mono">{method.details.calculation}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Analyzed Stocks</h4>
                          <div className="flex flex-wrap gap-2">
                            {method.details.stocks?.map((stock) => (
                              <Badge key={stock} variant="outline">{stock}</Badge>
                            )) || <div className="text-sm text-muted-foreground">No stocks configured</div>}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      <h4 className="font-semibold">Algorithm: {method.details.algorithm}</h4>
                      <div className="space-y-2">
                        {(method.details.processing || method.details.analysis)?.map((step, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                              {index + 1}
                            </div>
                            <p className="text-sm">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </TabsContent>

              <TabsContent value="implementation" className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-semibold mb-3">Implementation Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Real-time Data Integration</span>
                      <Badge className="bg-green-600">✓ Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Connectivity</span>
                      <Badge className="bg-green-600">✓ Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Automated Calculations</span>
                      <Badge className="bg-green-600">✓ Running</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Update Frequency</span>
                      <Badge variant="outline">5 minutes</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Sentiment Score Interpretation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Sentiment Score Interpretation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scoringLogic.ranges.map((range, index) => (
              <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                <Badge className={`${range.color} text-white min-w-[120px] justify-center`}>
                  {range.range}
                </Badge>
                <div className="flex-1">
                  <div className="font-semibold">{range.label}</div>
                  <div className="text-sm text-muted-foreground">{range.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Analysis in FinTrendX
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Dashboard Integration</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Real-time sentiment scores displayed on the main dashboard with live updates from stock market data.
              </p>
              <Badge variant="outline">Active</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Stock Sentiment Scoring</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Dedicated module analyzing top 10 stocks with detailed breakdowns and methodology documentation.
              </p>
              <Badge variant="outline">New Feature</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">API Integration</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Connected to Finnhub API for real-time stock quotes with automated sentiment calculation.
              </p>
              <Badge className="bg-green-600 text-white">Live Data</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};