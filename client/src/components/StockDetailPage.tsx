import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Brain,
  MessageCircle,
  Newspaper,
  BarChart3,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMoodTheme } from '@/contexts/MoodThemeContext';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  pe: number;
  dividend: number;
  rsi: number;
  ma50: number;
  ma200: number;
  socialMentions: number;
  newsScore: number;
  aiConfidence: number;
  volatility: number;
}

interface StockDetailPageProps {
  stock?: StockData;
  onBack: () => void;
}

export const StockDetailPage: React.FC<StockDetailPageProps> = ({
  stock = {
    symbol: 'AAPL',
    price: 190.64,
    change: 2.50,
    changePercent: 1.32,
    marketCap: '$2.98T',
    pe: 28.5,
    dividend: 0.24,
    rsi: 58.2,
    ma50: 187.30,
    ma200: 175.20,
    socialMentions: 15200,
    newsScore: 78,
    aiConfidence: 85,
    volatility: 1.8,
  },
  onBack,
}) => {
  const { themeMode } = useMoodTheme();
  const [activeTab, setActiveTab] = useState<'sentiment' | 'sources' | 'technicals'>('sentiment');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isWatched, setIsWatched] = useState(false);

  const getSentimentStatus = (score: number) => {
    if (score >= 70) return { label: 'Bullish', color: 'text-green-500', bgColor: 'bg-green-500/10', emoji: '📈' };
    if (score >= 50) return { label: 'Neutral', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', emoji: '➡️' };
    return { label: 'Bearish', color: 'text-red-500', bgColor: 'bg-red-500/10', emoji: '📉' };
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const overallSentiment = getSentimentStatus(stock.aiConfidence);
  const newsSentiment = getSentimentStatus(stock.newsScore);
  const socialScore = stock.socialMentions > 10000 ? 75 : 55;
  const socialSentiment = getSentimentStatus(socialScore);

  const newsHighlights = [
    'Apple announces new AI features in iOS',
    'Q3 earnings beat analyst expectations',
    'Production capacity increases by 15%'
  ];

  const trendingTopics = ['#applenews', '#aievolution', '#techwatchlist', '#bullishsetup'];

  const sentimentSources = [
    { name: 'News Analysis', score: stock.newsScore, icon: Newspaper, mentions: '1,247 articles' },
    { name: 'Social Sentiment', score: socialScore, icon: MessageCircle, mentions: `${stock.socialMentions.toLocaleString()} mentions` },
    { name: 'Technical Analysis', score: 68, icon: BarChart3, mentions: 'RSI, MA, MACD' },
  ];

  return (
    <div className={cn(
      'min-h-screen',
      themeMode === 'light'
        ? 'bg-[#F5F7FA]'
        : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
    )}>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className={cn(
                'gap-2',
                themeMode === 'light'
                  ? 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  : 'border-slate-600 text-slate-300 hover:bg-slate-800'
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className={cn(
                'text-4xl font-bold',
                themeMode === 'light' ? 'text-gray-900' : 'text-white'
              )}>
                {stock.symbol}
              </h1>
              <p className={cn(
                'text-sm',
                themeMode === 'light' ? 'text-gray-600' : 'text-slate-400'
              )}>
                Sentiment Analysis & Market Overview
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsWatched(!isWatched)}
              className={cn(
                'gap-2',
                isWatched && 'bg-blue-500/20 border-blue-500 text-blue-400'
              )}
            >
              <Bookmark className={cn('w-4 h-4', isWatched && 'fill-current')} />
              {isWatched ? 'Watching' : 'Watch'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className={cn(
                'gap-2',
                isRefreshing && 'animate-spin'
              )}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className={cn(
            'border',
            themeMode === 'light'
              ? 'bg-white border-gray-200'
              : 'bg-slate-800/50 border-slate-700'
          )}>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-2">Price</div>
              <div className={cn('text-2xl font-bold', themeMode === 'light' ? 'text-gray-900' : 'text-white')}>
                ${stock.price.toFixed(2)}
              </div>
              <div className={cn(
                'text-sm font-semibold mt-2',
                stock.change >= 0 ? 'text-green-500' : 'text-red-500'
              )}>
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            'border',
            themeMode === 'light'
              ? 'bg-white border-gray-200'
              : 'bg-slate-800/50 border-slate-700'
          )}>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-2">Market Cap</div>
              <div className={cn('text-2xl font-bold', themeMode === 'light' ? 'text-gray-900' : 'text-white')}>
                {stock.marketCap}
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            'border',
            themeMode === 'light'
              ? 'bg-white border-gray-200'
              : 'bg-slate-800/50 border-slate-700'
          )}>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-2">P/E Ratio</div>
              <div className={cn('text-2xl font-bold', themeMode === 'light' ? 'text-gray-900' : 'text-white')}>
                {stock.pe.toFixed(1)}
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            'border',
            themeMode === 'light'
              ? 'bg-white border-gray-200'
              : 'bg-slate-800/50 border-slate-700'
          )}>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-2">Dividend</div>
              <div className={cn('text-2xl font-bold', themeMode === 'light' ? 'text-gray-900' : 'text-white')}>
                {stock.dividend.toFixed(2)}%
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            'border',
            themeMode === 'light'
              ? 'bg-white border-gray-200'
              : 'bg-slate-800/50 border-slate-700'
          )}>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-2">Volatility</div>
              <div className={cn('text-2xl font-bold', themeMode === 'light' ? 'text-gray-900' : 'text-white')}>
                {stock.volatility}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sentiment Overview */}
        <Card className={cn(
          'mb-8 border',
          themeMode === 'light'
            ? 'bg-white border-gray-200'
            : 'bg-slate-800/50 border-slate-700'
        )}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Sentiment Analysis
              </CardTitle>
              <Badge className={cn(overallSentiment.bgColor, overallSentiment.color, 'border-0')}>
                {overallSentiment.emoji} {overallSentiment.label} ({stock.aiConfidence.toFixed(2)}%)
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={cn('text-sm font-medium', themeMode === 'light' ? 'text-gray-700' : 'text-slate-300')}>
                    Overall Confidence
                  </span>
                  <span className={cn('text-sm font-bold', overallSentiment.color)}>
                    {stock.aiConfidence.toFixed(2)}%
                  </span>
                </div>
                <div className={cn(
                  'w-full h-2 rounded-full',
                  themeMode === 'light' ? 'bg-gray-200' : 'bg-slate-700'
                )}>
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      stock.aiConfidence >= 70 ? 'bg-green-500' : stock.aiConfidence >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    )}
                    style={{ width: `${stock.aiConfidence}%` }}
                  />
                </div>
              </div>

              <div className={cn(
                'p-4 rounded-lg',
                themeMode === 'light'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-blue-500/10 border border-blue-500/20'
              )}>
                <p className={cn(
                  'text-sm',
                  themeMode === 'light' ? 'text-blue-900' : 'text-blue-200'
                )}>
                  {stock.symbol} is showing {overallSentiment.label.toLowerCase()} signals with strong technical support.
                  News sentiment remains positive with {stock.newsScore}% positive mentions. Social engagement is{'  '}
                  {stock.socialMentions > 10000 ? 'high' : 'moderate'}.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis Tabs */}
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
          <TabsList className={cn(
            'grid w-full grid-cols-3 mb-8',
            themeMode === 'light'
              ? 'bg-gray-100'
              : 'bg-slate-800/50'
          )}>
            <TabsTrigger value="sentiment">Sentiment Breakdown</TabsTrigger>
            <TabsTrigger value="sources">News & Social</TabsTrigger>
            <TabsTrigger value="technicals">Technical Setup</TabsTrigger>
          </TabsList>

          <TabsContent value="sentiment" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sentimentSources.map((source) => {
                const sentiment = getSentimentStatus(source.score);
                const Icon = source.icon;
                return (
                  <Card key={source.name} className={cn(
                    'border',
                    themeMode === 'light'
                      ? 'bg-white border-gray-200'
                      : 'bg-slate-800/50 border-slate-700'
                  )}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-blue-500" />
                          <h3 className={cn('font-medium', themeMode === 'light' ? 'text-gray-900' : 'text-white')}>
                            {source.name}
                          </h3>
                        </div>
                        <Badge className={cn(sentiment.bgColor, sentiment.color, 'border-0')}>
                          {source.score.toFixed(2)}%
                        </Badge>
                      </div>
                      <p className={cn('text-xs', themeMode === 'light' ? 'text-gray-600' : 'text-slate-400')}>
                        {source.mentions}
                      </p>
                      <div className={cn(
                        'w-full h-1.5 rounded-full mt-3',
                        themeMode === 'light' ? 'bg-gray-200' : 'bg-slate-700'
                      )}>
                        <div
                          className={cn(
                            'h-full rounded-full',
                            source.score >= 70 ? 'bg-green-500' : source.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          )}
                          style={{ width: `${source.score}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-6">
            <Card className={cn(
              'border',
              themeMode === 'light'
                ? 'bg-white border-gray-200'
                : 'bg-slate-800/50 border-slate-700'
            )}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Newspaper className="w-5 h-5" />
                  News Highlights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {newsHighlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'flex gap-3 p-3 rounded-lg',
                      themeMode === 'light'
                        ? 'bg-gray-50 border border-gray-100'
                        : 'bg-slate-700/30 border border-slate-700'
                    )}
                  >
                    <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className={cn('text-sm', themeMode === 'light' ? 'text-gray-700' : 'text-slate-300')}>
                      {highlight}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className={cn(
              'border',
              themeMode === 'light'
                ? 'bg-white border-gray-200'
                : 'bg-slate-800/50 border-slate-700'
            )}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Trending Discussions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic, idx) => (
                    <Badge
                      key={idx}
                      className={cn(
                        'cursor-pointer',
                        themeMode === 'light'
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          : 'bg-blue-500/30 text-blue-300 hover:bg-blue-500/40'
                      )}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technicals" className="space-y-6">
            <Card className={cn(
              'border',
              themeMode === 'light'
                ? 'bg-white border-gray-200'
                : 'bg-slate-800/50 border-slate-700'
            )}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Technical Indicators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn('text-sm font-medium', themeMode === 'light' ? 'text-gray-700' : 'text-slate-300')}>
                      RSI (14)
                    </span>
                    <span className={cn('text-sm font-bold', stock.rsi > 70 ? 'text-red-500' : stock.rsi < 30 ? 'text-green-500' : 'text-yellow-500')}>
                      {stock.rsi.toFixed(1)}
                    </span>
                  </div>
                  <div className={cn(
                    'w-full h-2 rounded-full',
                    themeMode === 'light' ? 'bg-gray-200' : 'bg-slate-700'
                  )}>
                    <div
                      className={cn(
                        'h-full rounded-full',
                        stock.rsi > 70 ? 'bg-red-500' : stock.rsi < 30 ? 'bg-green-500' : 'bg-yellow-500'
                      )}
                      style={{ width: `${(stock.rsi / 100) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={cn(
                    'p-4 rounded-lg',
                    themeMode === 'light'
                      ? 'bg-gray-50 border border-gray-100'
                      : 'bg-slate-700/30 border border-slate-700'
                  )}>
                    <p className={cn('text-xs text-muted-foreground mb-1')}>50-day MA</p>
                    <p className={cn('text-lg font-bold', themeMode === 'light' ? 'text-gray-900' : 'text-white')}>
                      ${stock.ma50.toFixed(2)}
                    </p>
                  </div>
                  <div className={cn(
                    'p-4 rounded-lg',
                    themeMode === 'light'
                      ? 'bg-gray-50 border border-gray-100'
                      : 'bg-slate-700/30 border border-slate-700'
                  )}>
                    <p className={cn('text-xs text-muted-foreground mb-1')}>200-day MA</p>
                    <p className={cn('text-lg font-bold', themeMode === 'light' ? 'text-gray-900' : 'text-white')}>
                      ${stock.ma200.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className={cn(
                  'p-4 rounded-lg',
                  themeMode === 'light'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-green-500/10 border border-green-500/20'
                )}>
                  <p className={cn(
                    'text-sm',
                    themeMode === 'light' ? 'text-green-900' : 'text-green-200'
                  )}>
                    ✓ Price is above both 50 and 200-day moving averages, indicating uptrend.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
