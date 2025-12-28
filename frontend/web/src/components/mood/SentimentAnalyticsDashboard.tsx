import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Download, 
  Share,
  X,
  Brain,
  Newspaper,
  MessageSquare,
  Activity,
  Target,
  Flame
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SentimentAnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SentimentAnalyticsDashboard: React.FC<SentimentAnalyticsDashboardProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedTicker, setSelectedTicker] = useState('NVDA');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for the analytics
  const sourceAnalytics = {
    stocks: {
      topContributors: [
        { symbol: 'AAPL', sentiment: 85, change: '+2.5%', volume: '1.2M' },
        { symbol: 'NVDA', sentiment: 92, change: '+3.1%', volume: '2.8M' },
        { symbol: 'MSFT', sentiment: 78, change: '+1.8%', volume: '890K' },
        { symbol: 'TSLA', sentiment: 35, change: '-1.7%', volume: '3.2M' }
      ],
      topKeywords: ['earnings', 'ai', 'growth', 'revenue', 'guidance']
    },
    news: {
      sentimentBreakdown: { positive: 65, neutral: 25, negative: 10 },
      topSources: ['Reuters', 'Bloomberg', 'CNBC', 'MarketWatch'],
      topKeywords: ['fed', 'rates', 'inflation', 'earnings', 'growth']
    },
    social: {
      platforms: [
        { name: 'Reddit', sentiment: 78, mentions: '45.2K' },
        { name: 'Twitter/X', sentiment: 74, mentions: '89.1K' },
        { name: 'Discord', sentiment: 82, mentions: '12.8K' }
      ],
      topKeywords: ['bullish', 'moon', 'buy', 'hold', 'pump']
    }
  };

  const trendData = [
    { time: '9:00', sentiment: 65, price: 67000, volume: 1200, social: 58 },
    { time: '10:00', sentiment: 68, price: 67200, volume: 980, social: 62 },
    { time: '11:00', sentiment: 72, price: 67400, volume: 1450, social: 68 },
    { time: '12:00', sentiment: 78, price: 67234, volume: 1350, social: 74 },
    { time: '13:00', sentiment: 75, price: 67100, volume: 890, social: 71 },
    { time: '14:00', sentiment: 82, price: 67456, volume: 1200, social: 78 }
  ];

  const tickerAnalysis = {
    NVDA: {
      sentiment: 92,
      news: [
        { headline: 'NVIDIA beats Q3 earnings expectations', sentiment: 'positive', time: '2h ago' },
        { headline: 'AI chip demand continues to surge', sentiment: 'positive', time: '4h ago' },
        { headline: 'Analysts raise price targets', sentiment: 'positive', time: '1d ago' }
      ],
      socialCommentary: [
        { platform: 'Reddit', comment: '$NVDA to the moon! 🚀', sentiment: 'bullish', upvotes: 142 },
        { platform: 'Twitter', comment: 'NVIDIA earnings were incredible', sentiment: 'bullish', likes: 89 },
        { platform: 'Discord', comment: 'Best AI play in the market', sentiment: 'bullish', reactions: 23 }
      ],
      technicals: { rsi: 68, macd: '+234', support: '$420', resistance: '$480' }
    },
    TSLA: {
      sentiment: 35,
      news: [
        { headline: 'Tesla deliveries miss analyst expectations', sentiment: 'negative', time: '1h ago' },
        { headline: 'Production concerns in China facility', sentiment: 'negative', time: '3h ago' },
        { headline: 'EV competition intensifies', sentiment: 'neutral', time: '6h ago' }
      ],
      socialCommentary: [
        { platform: 'Reddit', comment: 'TSLA struggling with deliveries', sentiment: 'bearish', upvotes: 67 },
        { platform: 'Twitter', comment: 'Time to buy the dip?', sentiment: 'neutral', likes: 34 },
        { platform: 'Discord', comment: 'Holding long term', sentiment: 'bullish', reactions: 12 }
      ],
      technicals: { rsi: 45, macd: '-156', support: '$240', resistance: '$280' }
    }
  };

  const sectorSentiment = [
    { sector: 'Technology', sentiment: 85, change: '+3.2%', color: 'green' },
    { sector: 'Healthcare', sentiment: 72, change: '+1.8%', color: 'green' },
    { sector: 'Finance', sentiment: 68, change: '+0.9%', color: 'yellow' },
    { sector: 'Energy', sentiment: 45, change: '-2.1%', color: 'red' },
    { sector: 'Consumer', sentiment: 62, change: '+0.5%', color: 'yellow' },
    { sector: 'Industrial', sentiment: 58, change: '-0.3%', color: 'yellow' }
  ];

  const getSentimentColor = (sentiment: number): string => {
    if (sentiment >= 70) return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (sentiment >= 50) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden bg-black/95 border-purple-500/30 text-white">
        <DialogHeader className="border-b border-purple-500/20 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  Sentiment Analytics Dashboard
                </DialogTitle>
                <p className="text-gray-400 text-sm">
                  Advanced multi-source sentiment analysis and insights
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="border-green-500/30 text-green-300 hover:bg-green-500/10">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button size="sm" variant="outline" className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <Tabs defaultValue="source-dive" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-black/20 backdrop-blur-xl border border-gray-700/50 mb-6">
              <TabsTrigger value="source-dive" className="data-[state=active]:bg-blue-600/30 data-[state=active]:text-blue-300">
                🔍 Source Deep Dive
              </TabsTrigger>
              <TabsTrigger value="trend-graph" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-300">
                🧠 AI Trend Graph
              </TabsTrigger>
              <TabsTrigger value="ticker-focus" className="data-[state=active]:bg-green-600/30 data-[state=active]:text-green-300">
                📌 Ticker Focus
              </TabsTrigger>
              <TabsTrigger value="sector-sentiment" className="data-[state=active]:bg-orange-600/30 data-[state=active]:text-orange-300">
                📊 Sector Sentiment
              </TabsTrigger>
              <TabsTrigger value="export-share" className="data-[state=active]:bg-cyan-600/30 data-[state=active]:text-cyan-300">
                📥 Export & Share
              </TabsTrigger>
            </TabsList>

            {/* Source Deep Dive Tab */}
            <TabsContent value="source-dive" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stocks Analysis */}
                <Card className="bg-black/40 border-pink-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-pink-400" />
                      Stocks Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-pink-400 mb-1">85%</div>
                      <div className="text-sm text-gray-400">Average Stock Sentiment</div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-white mb-3">Top Contributors</h4>
                      <div className="space-y-2">
                        {sourceAnalytics.stocks.topContributors.map((stock, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{stock.symbol}</span>
                              <Badge className={getSentimentColor(stock.sentiment)}>
                                {stock.sentiment.toFixed(2)}%
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className={cn(
                                "text-sm font-bold",
                                stock.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                              )}>
                                {stock.change}
                              </div>
                              <div className="text-xs text-gray-400">{stock.volume} vol</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-white mb-3">Top Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {sourceAnalytics.stocks.topKeywords.map((keyword, i) => (
                          <Badge key={i} className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* News Analysis */}
                <Card className="bg-black/40 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Newspaper className="w-5 h-5 text-blue-400" />
                      News Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-blue-400 mb-1">75%</div>
                      <div className="text-sm text-gray-400">Average News Sentiment</div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-white mb-3">Sentiment Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-green-400">Positive</span>
                          <span className="text-green-400 font-bold">
                            {sourceAnalytics.news.sentimentBreakdown.positive.toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-yellow-400">Neutral</span>
                          <span className="text-yellow-400 font-bold">
                            {sourceAnalytics.news.sentimentBreakdown.neutral.toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-red-400">Negative</span>
                          <span className="text-red-400 font-bold">
                            {sourceAnalytics.news.sentimentBreakdown.negative.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-white mb-3">Top Sources</h4>
                      <div className="space-y-1">
                        {sourceAnalytics.news.topSources.map((source, i) => (
                          <div key={i} className="text-sm text-blue-300 bg-blue-500/10 px-2 py-1 rounded">
                            {source}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-white mb-3">Top Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {sourceAnalytics.news.topKeywords.map((keyword, i) => (
                          <Badge key={i} className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Analysis */}
                <Card className="bg-black/40 border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-cyan-400" />
                      Social Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-cyan-400 mb-1">78%</div>
                      <div className="text-sm text-gray-400">Average Social Sentiment</div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-white mb-3">Platform Breakdown</h4>
                      <div className="space-y-2">
                        {sourceAnalytics.social.platforms.map((platform, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-white">{platform.name}</span>
                              <Badge className={getSentimentColor(platform.sentiment)}>
                                {platform.sentiment.toFixed(2)}%
                              </Badge>
                            </div>
                            <div className="text-cyan-300 text-sm">{platform.mentions}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-white mb-3">Top Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {sourceAnalytics.social.topKeywords.map((keyword, i) => (
                          <Badge key={i} className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* AI Trend Graph Tab */}
            <TabsContent value="trend-graph" className="space-y-6">
              <Card className="bg-black/40 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    Interactive Sentiment Trend Graph
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-6">
                    <div className="flex items-end justify-between h-full">
                      {trendData.map((point, i) => (
                        <div key={i} className="text-center flex-1 group cursor-pointer">
                          <div className="relative">
                            {/* Sentiment Bar */}
                            <div 
                              className="bg-gradient-to-t from-purple-400 to-pink-400 w-8 mx-auto rounded-sm mb-2 hover:from-purple-300 hover:to-pink-300 transition-colors"
                              style={{ height: `${point.sentiment * 3}px` }}
                            />
                            {/* Price Overlay */}
                            <div 
                              className="bg-gradient-to-t from-blue-400 to-cyan-400 w-2 mx-auto rounded-sm absolute left-1/2 transform -translate-x-1/2 opacity-70"
                              style={{ height: `${(point.price - 66000) / 20}px`, bottom: '20px' }}
                            />
                            {/* Volume Overlay */}
                            <div 
                              className="bg-gradient-to-t from-green-400 to-emerald-400 w-1 mx-auto rounded-sm absolute right-0 opacity-50"
                              style={{ height: `${point.volume / 10}px`, bottom: '20px' }}
                            />
                          </div>
                          <div className="text-xs text-gray-400">{point.time}</div>
                          
                          {/* Hover Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/90 border border-purple-500/30 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <div className="text-xs space-y-1 whitespace-nowrap">
                              <div>Sentiment: <span className="text-purple-400">{point.sentiment.toFixed(2)}%</span></div>
                              <div>Price: <span className="text-blue-400">${point.price.toLocaleString()}</span></div>
                              <div>Volume: <span className="text-green-400">{point.volume}K</span></div>
                              <div>Social: <span className="text-pink-400">{point.social}%</span></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Legend */}
                    <div className="flex items-center justify-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-sm" />
                        <span className="text-xs text-gray-400">Sentiment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-sm" />
                        <span className="text-xs text-gray-400">Price</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-sm" />
                        <span className="text-xs text-gray-400">Volume</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Ticker Focus Tab */}
            <TabsContent value="ticker-focus" className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search ticker (e.g., NVDA, TSLA, AAPL)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-black/40 border-green-500/30 text-white"
                  />
                </div>
                <div className="flex gap-2">
                  {['NVDA', 'TSLA', 'AAPL', 'GOOGL'].map((ticker) => (
                    <Button
                      key={ticker}
                      size="sm"
                      variant={selectedTicker === ticker ? 'default' : 'outline'}
                      onClick={() => setSelectedTicker(ticker)}
                      className={cn(
                        selectedTicker === ticker 
                          ? 'bg-green-600/30 text-green-300 border-green-500/30' 
                          : 'border-gray-600 text-gray-400'
                      )}
                    >
                      {ticker}
                    </Button>
                  ))}
                </div>
              </div>

              {tickerAnalysis[selectedTicker as keyof typeof tickerAnalysis] && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-black/40 border-green-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-400" />
                        {selectedTicker} Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">
                          {tickerAnalysis[selectedTicker as keyof typeof tickerAnalysis].sentiment.toFixed(2)}%
                        </div>
                        <div className="text-sm text-gray-400">Overall Sentiment</div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-white mb-3">Related News</h4>
                        <div className="space-y-2">
                          {tickerAnalysis[selectedTicker as keyof typeof tickerAnalysis].news.map((news, i) => (
                            <div key={i} className="p-3 bg-gray-800/50 rounded-lg">
                              <div className="flex items-start justify-between mb-1">
                                <div className="text-sm text-white font-medium line-clamp-2">
                                  {news.headline}
                                </div>
                                <Badge className={cn(
                                  "ml-2 flex-shrink-0 text-xs",
                                  news.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                                  news.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                                  'bg-yellow-500/20 text-yellow-400'
                                )}>
                                  {news.sentiment}
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-400">{news.time}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-white mb-3">Technical Indicators</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">RSI:</span>
                            <span className="text-cyan-400">{tickerAnalysis[selectedTicker as keyof typeof tickerAnalysis].technicals.rsi}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">MACD:</span>
                            <span className="text-purple-400">{tickerAnalysis[selectedTicker as keyof typeof tickerAnalysis].technicals.macd}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Support:</span>
                            <span className="text-green-400">{tickerAnalysis[selectedTicker as keyof typeof tickerAnalysis].technicals.support}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Resistance:</span>
                            <span className="text-red-400">{tickerAnalysis[selectedTicker as keyof typeof tickerAnalysis].technicals.resistance}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 border-cyan-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-cyan-400" />
                        Social Commentary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {tickerAnalysis[selectedTicker as keyof typeof tickerAnalysis].socialCommentary.map((comment, i) => (
                          <div key={i} className="p-3 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                                {comment.platform}
                              </Badge>
                              <Badge className={cn(
                                "text-xs",
                                comment.sentiment === 'bullish' ? 'bg-green-500/20 text-green-400' :
                                comment.sentiment === 'bearish' ? 'bg-red-500/20 text-red-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              )}>
                                {comment.sentiment}
                              </Badge>
                            </div>
                            <div className="text-sm text-white mb-2">{comment.comment}</div>
                            <div className="text-xs text-gray-400">
                              {comment.upvotes && `${comment.upvotes} upvotes`}
                              {comment.likes && `${comment.likes} likes`}
                              {comment.reactions && `${comment.reactions} reactions`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Sector Sentiment Tab */}
            <TabsContent value="sector-sentiment" className="space-y-6">
              <Card className="bg-black/40 border-orange-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    Sector Sentiment Heatmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {sectorSentiment.map((sector, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "p-6 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-105",
                          sector.color === 'green' ? 'bg-green-500/20 border-green-500/30' :
                          sector.color === 'yellow' ? 'bg-yellow-500/20 border-yellow-500/30' :
                          'bg-red-500/20 border-red-500/30'
                        )}
                      >
                        <div className="text-center">
                          <div className={cn(
                            "text-3xl font-bold mb-2",
                            sector.color === 'green' ? 'text-green-400' :
                            sector.color === 'yellow' ? 'text-yellow-400' :
                            'text-red-400'
                          )}>
                            {sector.sentiment.toFixed(2)}%
                          </div>
                          <div className="text-white font-medium mb-1">{sector.sector}</div>
                          <div className={cn(
                            "text-sm font-bold",
                            sector.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                          )}>
                            {sector.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Export & Share Tab */}
            <TabsContent value="export-share" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black/40 border-green-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Download className="w-5 h-5 text-green-400" />
                      Export Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30">
                      <Download className="w-4 h-4 mr-2" />
                      Download CSV Report
                    </Button>
                    <Button className="w-full bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF Report
                    </Button>
                    <Button className="w-full bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/30">
                      <Download className="w-4 h-4 mr-2" />
                      Export Raw Data
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Share className="w-5 h-5 text-cyan-400" />
                      Share Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/30">
                      <Share className="w-4 h-4 mr-2" />
                      Share on Twitter
                    </Button>
                    <Button className="w-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30">
                      <Share className="w-4 h-4 mr-2" />
                      Share on LinkedIn
                    </Button>
                    <Button className="w-full bg-pink-600/20 text-pink-400 border border-pink-500/30 hover:bg-pink-600/30">
                      <Share className="w-4 h-4 mr-2" />
                      Copy Shareable Link
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-black/40 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    Predictive Sentiment Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-6xl mb-4">🔮</div>
                    <div className="text-2xl font-bold text-purple-400">Tomorrow's Estimated Sentiment: 73</div>
                    <div className="text-gray-400">Neutral-Bullish Outlook</div>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      AI Confidence: 84%
                    </Badge>
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg border border-purple-500/20">
                      <div className="text-white font-medium mb-2">🧠 AI Smart Alert</div>
                      <div className="text-sm text-gray-300">
                        Watch $META �� sharp rise in bullish mentions (+220%) detected in the last 2 hours
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
