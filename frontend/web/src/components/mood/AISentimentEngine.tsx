import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Brain, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Share, 
  Download,
  RefreshCw,
  Clock,
  Database,
  Activity,
  Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface AISentimentEngineProps {
  moodScore: {
    overall: number;
    stocks: number;
    news: number;
    social: number;
  };
  className?: string;
}

export const AISentimentEngine: React.FC<AISentimentEngineProps> = ({
  moodScore,
  className
}) => {
  const [activeTab, setActiveTab] = useState<'mood' | 'insight'>('mood');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getSentimentStatus = (score: number): 'bullish' | 'neutral' | 'bearish' => {
    if (score >= 70) return 'bullish';
    if (score >= 50) return 'neutral';
    return 'bearish';
  };

  const getSentimentLabel = (score: number): string => {
    if (score >= 70) return 'Bullish';
    if (score >= 50) return 'Neutral';
    return 'Bearish';
  };

  const getSentimentEmoji = (score: number): string => {
    if (score >= 70) return '😊';
    if (score >= 50) return '😐';
    return '😢';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-700 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-500/10 dark:border-green-500/20';
      case 'bearish': return 'text-red-700 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const overallSentiment = getSentimentStatus(moodScore.overall);

  // Mock data for mood breakdown
  const stockContributors = [
    { symbol: 'AAPL', change: '+2.50%', price: '$190.64', sentiment: 'bullish' },
    { symbol: 'NVDA', change: '+3.10%', price: '$875.28', sentiment: 'bullish' },
    { symbol: 'TSLA', change: '-1.70%', price: '$248.50', sentiment: 'bearish' }
  ];

  const newsHighlights = [
    'Fed hints at rate pause amid CPI data',
    'Tech earnings beat expectations',
    'Consumer confidence rebounds strongly'
  ];

  const forumTrends = ['#airevolution', '#softlanding', '#techrally'];

  // Mock data for AI market insight
  const aiInsight = {
    interpretation: "Markets showing cautious optimism as Fed policy uncertainty diminishes. Risk-on sentiment returning with tech leadership.",
    confidence: 87,
    keyDrivers: ['Fed Policy Shift', 'Earnings Momentum', 'Consumer Resilience', 'AI Innovation'],
    dataSources: ['Federal Reserve', 'S&P Global', 'Reuters', 'Bloomberg'],
    lastUpdate: new Date(),
    marketRegime: 'Risk-On Rotation'
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting AI sentiment data...');
  };

  const handleShare = () => {
    // Share functionality
    console.log('Sharing AI sentiment insights...');
  };

  return (
    <Card className={cn("bg-card border-border backdrop-blur-xl shadow-lg", className)}>
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-primary/30 rounded-xl flex items-center justify-center animate-pulse">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                AI Sentiment Engine
              </CardTitle>
              <p className="text-muted-foreground text-sm">Real-time intelligence & mood analysis</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="hover:bg-muted"
            >
              <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              className="hover:bg-muted text-primary"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="hover:bg-muted text-primary"
            >
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'mood' | 'insight')}>
          <TabsList className="mood-sentiment-tabs grid w-full grid-cols-2 bg-muted backdrop-blur-xl border border-border mb-6">
            <TabsTrigger
              value="mood"
              className="flex items-center gap-2 transition-all duration-300"
            >
              <Brain className="w-4 h-4" />
              Today's Mood Breakdown
            </TabsTrigger>
            <TabsTrigger
              value="insight"
              className="flex items-center gap-2 transition-all duration-300"
            >
              <BarChart3 className="w-4 h-4" />
              AI Market Insight
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Today's Mood Breakdown */}
          <TabsContent value="mood" className="space-y-6 animate-in fade-in-0 duration-500">
            
            {/* Main Sentiment Status */}
            <div className="text-center mb-6">
              <div className={cn(
                "inline-flex items-center gap-3 p-4 rounded-2xl border",
                overallSentiment === 'bullish' ? 'bg-gradient-to-r from-green-500/10 to-green-600/20 border-green-500/20' :
                overallSentiment === 'bearish' ? 'bg-gradient-to-r from-red-500/10 to-red-600/20 border-red-500/20' :
                'bg-gradient-to-r from-muted/50 to-muted border-border'
              )}>
                <div className="text-4xl">{getSentimentEmoji(moodScore.overall)}</div>
                <div>
                  <div className="text-2xl font-bold text-white dark:text-card-foreground">
                    {getSentimentLabel(moodScore.overall)} ({Math.round(moodScore.overall)})
                  </div>
                  <Badge className={cn("mt-1", getSentimentColor(overallSentiment))}>
                    Market Sentiment
                  </Badge>
                </div>
              </div>
            </div>

            {/* AI Generated Summary */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-4">
                <p className="text-slate-800 dark:text-slate-100 leading-relaxed">
                  <strong className="bg-primary text-primary-foreground px-2 py-1 rounded-md">AI Summary:</strong> Today's market mood is{' '}
                  <strong className="text-slate-900 dark:text-white font-bold">{getSentimentLabel(moodScore.overall)}</strong>.
                  Optimism is driven primarily by strong earnings from mega-cap tech stocks and favorable economic data.
                  Social sentiment aligns with institutional positioning.
                </p>
              </CardContent>
            </Card>

            {/* Source Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Stocks */}
              <Card className="bg-card border-border hover:border-primary/40 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-card-foreground text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Stocks (40%)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{moodScore.stocks.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">Sentiment Score</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-white">Top Contributors:</div>
                    {stockContributors.map((stock, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">{stock.symbol}</span>
                        <div className="text-right">
                          <div className={cn(
                            "font-bold",
                            stock.sentiment === 'bullish' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          )}>
                            {stock.change}
                          </div>
                          <div className="text-muted-foreground text-xs">{stock.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* News */}
              <Card className="bg-card border-border hover:border-secondary/40 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-card-foreground text-sm flex items-center gap-2">
                    📰 News (30%)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary dark:text-white">{moodScore.news.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">Sentiment Score</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-card-foreground">Key Headlines:</div>
                    {newsHighlights.map((headline, i) => (
                      <div key={i} className="text-xs text-muted-foreground line-clamp-2">
                        • {headline}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Forums */}
              <Card className="bg-card border-border hover:border-accent/40 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-card-foreground text-sm flex items-center gap-2">
                    💬 Forums (30%)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary dark:text-white">{moodScore.social.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">Sentiment Score</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-card-foreground">Trending:</div>
                    <div className="flex flex-wrap gap-1">
                      {forumTrends.map((trend, i) => (
                        <Badge key={i} className="bg-accent/10 text-accent border-accent/30 text-xs">
                          {trend}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Reddit buzz rising on AI-related tickers
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab 2: AI Market Insight */}
          <TabsContent value="insight" className="space-y-6 animate-in fade-in-0 duration-500">
            
            {/* Market Regime & Interpretation */}
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-border">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-primary/10 text-primary border-primary/30">
                        {aiInsight.marketRegime}
                      </Badge>
                      <Badge className="bg-muted text-muted-foreground border-border">
                        Live Analysis
                      </Badge>
                    </div>
                    <p className="text-card-foreground text-lg leading-relaxed">
                      {aiInsight.interpretation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Confidence Score */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-secondary" />
                  AI Confidence Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-card-foreground font-medium">Confidence Level</span>
                      <span className="text-secondary font-bold text-lg">{aiInsight.confidence}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-1000"
                        style={{ width: `${aiInsight.confidence}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-4xl">🎯</div>
                </div>
              </CardContent>
            </Card>

            {/* Key Market Drivers */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  Key Market Drivers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {aiInsight.keyDrivers.map((driver, i) => (
                    <Badge
                      key={i}
                      className="bg-accent/10 text-accent border-accent/30 justify-center p-2"
                    >
                      {driver}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Data Sources & Timestamp */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-muted-foreground" />
                    <span className="text-card-foreground text-sm font-medium">Data Sources</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    Updated {aiInsight.lastUpdate.toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiInsight.dataSources.map((source, i) => (
                    <Badge
                      key={i}
                      className="bg-muted/50 text-muted-foreground border-border text-xs"
                    >
                      {source}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
