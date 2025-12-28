import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Brain, TrendingUp, TrendingDown, X, BarChart3 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AIMoodBreakdownPanelProps {
  isOpen: boolean;
  onClose: () => void;
  moodScore: {
    overall: number;
    stocks: number;
    news: number;
    social: number;
  };
}

export const AIMoodBreakdownPanel: React.FC<AIMoodBreakdownPanelProps> = ({
  isOpen,
  onClose,
  moodScore
}) => {
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

  const overallSentiment = getSentimentStatus(moodScore.overall);

  // Mock data for the breakdown
  const stockMovers = {
    bullish: [
      { symbol: 'AAPL', change: '+2.5%', reason: 'Strong earnings beat' },
      { symbol: 'NVDA', change: '+3.1%', reason: 'AI momentum continues' },
      { symbol: 'MSFT', change: '+1.8%', reason: 'Cloud growth acceleration' }
    ],
    bearish: [
      { symbol: 'TSLA', change: '-1.7%', reason: 'Delivery concerns' },
      { symbol: 'UBER', change: '-2.3%', reason: 'Regulatory headwinds' }
    ]
  };

  const trendingTopics = [
    { hashtag: '#softlanding', mentions: '45.2K', sentiment: 'bullish' as const },
    { hashtag: '#techrally', mentions: '38.7K', sentiment: 'bullish' as const },
    { hashtag: '#cpi', mentions: '29.1K', sentiment: 'neutral' as const }
  ];

  const newsBreakdown = [
    { source: 'Federal Reserve', impact: 80, description: 'Fed hints at rate pause, lower CPI data' },
    { source: 'Tech Earnings', impact: 75, description: 'Strong earnings from mega-cap tech stocks' },
    { source: 'Economic Data', impact: 65, description: 'Better than expected economic indicators' }
  ];

  const forumBreakdown = [
    { platform: 'Reddit', sentiment: 78, description: 'Rising buzz on AI-related tickers' },
    { platform: 'Twitter/X', sentiment: 74, description: 'TSLA sentiment spike, mixed reactions' },
    { platform: 'Discord', sentiment: 70, description: 'Active trading communities bullish' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-black/95 border-purple-500/30 text-white">
        <DialogHeader className="border-b border-purple-500/20 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  AI Mood Breakdown
                </DialogTitle>
                <p className="text-gray-400 text-sm">
                  Detailed analysis of today's market sentiment drivers
                </p>
              </div>
            </div>
            {/* Removed redundant close button; DialogContent already renders a close X at top-right */}
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-6">
          {/* Headline Summary */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                AI Generated Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg text-gray-200 leading-relaxed mb-4">
                "Today's market mood is <strong className="text-purple-400">
                {getSentimentLabel(moodScore.overall)} ({moodScore.overall.toFixed(2)}%)
                </strong>. Optimism is driven primarily by strong earnings from mega-cap tech stocks and favorable CPI news."
              </div>
              <Badge className={cn(
                "text-lg px-4 py-2",
                overallSentiment === 'bullish' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                overallSentiment === 'neutral' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                'bg-red-500/20 text-red-400 border-red-500/30'
              )}>
                {getSentimentEmoji(moodScore.overall)} {getSentimentLabel(moodScore.overall)} Sentiment
              </Badge>
            </CardContent>
          </Card>

          {/* Sentiment Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black/40 border-pink-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-pink-400" />
                  Stocks (40%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-pink-400 mb-2">{moodScore.stocks.toFixed(2)}</div>
                  <p className="text-sm text-gray-400">
                    "Positive price action in AAPL, NVDA, and MSFT contributed to bullish sentiment."
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-white mb-2">Top Contributors:</div>
                  {stockMovers.bullish.slice(0, 3).map((stock, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-green-400">{stock.symbol}</span>
                      <span className="text-green-400">{stock.change}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  📰 News (30%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-blue-400 mb-2">{moodScore.news.toFixed(2)}</div>
                  <p className="text-sm text-gray-400">
                    "Federal Reserve hints at rate pause. CPI lower than expected."
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-white mb-2">Key Stories:</div>
                  {newsBreakdown.map((news, i) => (
                    <div key={i} className="text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-400">{news.source}</span>
                        <span className="text-blue-400">{news.impact}/100</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{news.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  💬 Forums (30%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">{moodScore.social.toFixed(2)}</div>
                  <p className="text-sm text-gray-400">
                    "Reddit buzz rising on AI-related tickers. Twitter/X sentiment spikes for TSLA."
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-white mb-2">Platform Breakdown:</div>
                  {forumBreakdown.map((forum, i) => (
                    <div key={i} className="text-sm">
                      <div className="flex justify-between">
                        <span className="text-cyan-400">{forum.platform}</span>
                        <span className="text-cyan-400">{forum.sentiment}/100</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{forum.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Sentiment Movers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black/40 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Top Bullish Movers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stockMovers.bullish.map((stock, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div>
                        <div className="font-bold text-green-400">{stock.symbol}</div>
                        <div className="text-xs text-gray-400">{stock.reason}</div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {stock.change}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                  Top Bearish Movers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stockMovers.bearish.map((stock, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div>
                        <div className="font-bold text-red-400">{stock.symbol}</div>
                        <div className="text-xs text-gray-400">{stock.reason}</div>
                      </div>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        {stock.change}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trending Topics/Hashtags */}
          <Card className="bg-black/40 border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                🔥 Trending Topics/Hashtags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {trendingTopics.map((topic, i) => (
                  <div key={i} className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20 text-center">
                    <div className="font-bold text-orange-400 text-lg">{topic.hashtag}</div>
                    <div className="text-sm text-gray-400 mb-2">{topic.mentions} mentions</div>
                    <Badge className={cn(
                      topic.sentiment === 'bullish' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      topic.sentiment === 'neutral' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border-red-500/30'
                    )}>
                      {topic.sentiment === 'bullish' ? '🟢' : topic.sentiment === 'neutral' ? '🟡' : '🔴'} {topic.sentiment}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Quote Insight */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                AI Quote Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="text-xl text-center italic text-gray-200 leading-relaxed">
                "Retail sentiment appears aligned with institutional optimism — potential continuation of the current rally."
              </blockquote>
              <div className="text-center mt-4">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  Confidence: 87%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
