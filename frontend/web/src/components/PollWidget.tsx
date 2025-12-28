import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { useMoodTheme } from '../contexts/MoodThemeContext';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  CheckCircle,
  Timer,
  Zap,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

interface PollData {
  ticker: string;
  bullish: number;
  bearish: number;
  holding: number;
  totalVotes: number;
  userVote?: 'bullish' | 'bearish' | 'holding';
  aiSentiment?: number;
  lastUpdated: string;
}

interface PollWidgetProps {
  ticker: string;
  variant?: 'compact' | 'sidebar' | 'inline';
  className?: string;
  showAI?: boolean;
  onVoteChange?: (ticker: string, sentiment: 'bullish' | 'bearish' | 'holding') => void;
}

const mockPollData: Record<string, PollData> = {
  'AAPL': {
    ticker: 'AAPL',
    bullish: 68,
    bearish: 22,
    holding: 10,
    totalVotes: 1247,
    userVote: 'bullish',
    aiSentiment: 72,
    lastUpdated: '2 min ago'
  },
  'TSLA': {
    ticker: 'TSLA',
    bullish: 45,
    bearish: 38,
    holding: 17,
    totalVotes: 892,
    userVote: 'bearish',
    aiSentiment: 58,
    lastUpdated: '5 min ago'
  },
  'NVDA': {
    ticker: 'NVDA',
    bullish: 82,
    bearish: 12,
    holding: 6,
    totalVotes: 2156,
    aiSentiment: 85,
    lastUpdated: '1 min ago'
  },
  'BTC': {
    ticker: 'BTC',
    bullish: 71,
    bearish: 19,
    holding: 10,
    totalVotes: 3421,
    userVote: 'holding',
    aiSentiment: 68,
    lastUpdated: '3 min ago'
  }
};

export function PollWidget({ 
  ticker, 
  variant = 'compact', 
  className, 
  showAI = true,
  onVoteChange 
}: PollWidgetProps) {
  const { themeMode } = useMoodTheme();
  const [pollData, setPollData] = useState<PollData>(
    mockPollData[ticker] || {
      ticker,
      bullish: 50,
      bearish: 30,
      holding: 20,
      totalVotes: 0,
      lastUpdated: 'No data'
    }
  );
  const [voteModalOpen, setVoteModalOpen] = useState(false);

  const handleVote = (sentiment: 'bullish' | 'bearish' | 'holding') => {
    setPollData(prev => {
      let newBullish = prev.bullish;
      let newBearish = prev.bearish;
      let newHolding = prev.holding;
      let newTotal = prev.totalVotes;

      // Remove previous vote if exists
      if (prev.userVote) {
        if (prev.userVote === 'bullish') newBullish -= 1;
        else if (prev.userVote === 'bearish') newBearish -= 1;
        else if (prev.userVote === 'holding') newHolding -= 1;
        newTotal -= 1;
      }

      // Add new vote
      if (sentiment === 'bullish') newBullish += 1;
      else if (sentiment === 'bearish') newBearish += 1;
      else if (sentiment === 'holding') newHolding += 1;
      newTotal += 1;

      // Recalculate percentages
      const total = newBullish + newBearish + newHolding;
      newBullish = Math.round((newBullish / total) * 100);
      newBearish = Math.round((newBearish / total) * 100);
      newHolding = 100 - newBullish - newBearish;

      const updated = {
        ...prev,
        bullish: newBullish,
        bearish: newBearish,
        holding: newHolding,
        totalVotes: newTotal,
        userVote: sentiment,
        lastUpdated: 'now'
      };

      onVoteChange?.(ticker, sentiment);
      return updated;
    });
    setVoteModalOpen(false);
  };

  const getSentimentColor = (percentage: number) => {
    if (percentage > 60) return 'text-green-400';
    if (percentage < 40) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getDominantSentiment = () => {
    const max = Math.max(pollData.bullish, pollData.bearish, pollData.holding);
    if (max === pollData.bullish) return { label: 'Bullish', color: 'text-green-400', icon: TrendingUp };
    if (max === pollData.bearish) return { label: 'Bearish', color: 'text-red-400', icon: TrendingDown };
    return { label: 'Holding', color: 'text-yellow-400', icon: Minus };
  };

  const dominant = getDominantSentiment();
  const DominantIcon = dominant.icon;

  if (variant === 'compact') {
    return (
      <>
        <Card className={cn(
          'hover:shadow-lg transition-all duration-200',
          themeMode === 'light' 
            ? 'enhanced-card-light hover:border-[#3F51B5]/30' 
            : 'bg-black/40 border-gray-700/50 hover:border-purple-500/50',
          className
        )}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className={`text-sm font-medium ${themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}`}>
                  Community Poll
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {pollData.totalVotes}
              </Badge>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <DominantIcon className={`w-5 h-5 ${dominant.color}`} />
              <div>
                <div className={`font-semibold ${dominant.color}`}>
                  {Math.max(pollData.bullish, pollData.bearish, pollData.holding)}% {dominant.label}
                </div>
                <div className={`text-xs ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>
                  {pollData.lastUpdated}
                </div>
              </div>
            </div>

            {showAI && pollData.aiSentiment && (
              <div className="flex items-center justify-between mb-3 p-2 rounded bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                <span className={`text-xs ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>
                  AI Sentiment
                </span>
                <span className={`text-sm font-medium ${getSentimentColor(pollData.aiSentiment)}`}>
                  {pollData.aiSentiment}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              {pollData.userVote ? (
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span className={`text-xs ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>
                    Voted {pollData.userVote}
                  </span>
                </div>
              ) : (
                <span className={`text-xs ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>
                  Not voted
                </span>
              )}
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => setVoteModalOpen(true)}
                className={`text-xs h-6 px-2 ${
                  themeMode === 'light'
                    ? 'border-[#3F51B5] text-[#3F51B5] hover:bg-[#3F51B5]/10'
                    : 'border-purple-500 text-purple-400 hover:bg-purple-500/20'
                }`}
              >
                Vote
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vote Modal */}
        <Dialog open={voteModalOpen} onOpenChange={setVoteModalOpen}>
          <DialogContent className={`max-w-sm ${
            themeMode === 'light' 
              ? 'bg-white border-[#E0E0E0]' 
              : 'bg-black/95 border-purple-500/30'
          }`}>
            <DialogHeader>
              <DialogTitle className={`text-center ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>
                Vote on ${ticker}
              </DialogTitle>
              <DialogDescription className={`text-center ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>
                What's your 24h sentiment?
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <Button
                onClick={() => handleVote('bullish')}
                className={`flex flex-col items-center gap-1 h-16 ${
                  pollData.userVote === 'bullish' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : themeMode === 'light'
                      ? 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'
                      : 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">Bullish</span>
              </Button>

              <Button
                onClick={() => handleVote('holding')}
                className={`flex flex-col items-center gap-1 h-16 ${
                  pollData.userVote === 'holding' 
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                    : themeMode === 'light'
                      ? 'bg-yellow-50 border border-yellow-200 text-yellow-700 hover:bg-yellow-100'
                      : 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30'
                }`}
              >
                <Minus className="w-4 h-4" />
                <span className="text-xs font-medium">Holding</span>
              </Button>

              <Button
                onClick={() => handleVote('bearish')}
                className={`flex flex-col items-center gap-1 h-16 ${
                  pollData.userVote === 'bearish' 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : themeMode === 'light'
                      ? 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100'
                      : 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                <span className="text-xs font-medium">Bearish</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (variant === 'sidebar') {
    return (
      <>
        <Card className={cn(
          'hover:shadow-lg transition-all duration-200',
          themeMode === 'light' 
            ? 'enhanced-card-light' 
            : 'bg-black/40 border-gray-700/50 hover:border-purple-500/50',
          className
        )}>
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className={`text-sm font-medium ${themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}`}>
                  Community Sentiment
                </span>
              </div>
              <div className={`text-xs ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>
                {pollData.totalVotes} votes • {pollData.lastUpdated}
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className={`text-xs ${themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}`}>
                    Bullish
                  </span>
                </div>
                <span className="text-xs font-bold text-green-400">{pollData.bullish}%</span>
              </div>
              <Progress value={pollData.bullish} className="h-1.5">
                <div 
                  className="h-full bg-green-500 transition-all duration-500 rounded-full"
                  style={{ width: `${pollData.bullish}%` }}
                />
              </Progress>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Minus className="w-3 h-3 text-yellow-400" />
                  <span className={`text-xs ${themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}`}>
                    Holding
                  </span>
                </div>
                <span className="text-xs font-bold text-yellow-400">{pollData.holding}%</span>
              </div>
              <Progress value={pollData.holding} className="h-1.5">
                <div 
                  className="h-full bg-yellow-500 transition-all duration-500 rounded-full"
                  style={{ width: `${pollData.holding}%` }}
                />
              </Progress>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-3 h-3 text-red-400" />
                  <span className={`text-xs ${themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}`}>
                    Bearish
                  </span>
                </div>
                <span className="text-xs font-bold text-red-400">{pollData.bearish}%</span>
              </div>
              <Progress value={pollData.bearish} className="h-1.5">
                <div 
                  className="h-full bg-red-500 transition-all duration-500 rounded-full"
                  style={{ width: `${pollData.bearish}%` }}
                />
              </Progress>
            </div>

            {showAI && pollData.aiSentiment && (
              <div className="p-2 rounded mb-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>
                    AI vs Community
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${getSentimentColor(pollData.aiSentiment)}`}>
                      AI: {pollData.aiSentiment}
                    </span>
                    <span className={`text-xs ${getSentimentColor(pollData.bullish)}`}>
                      Community: {pollData.bullish}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              {pollData.userVote ? (
                <div className="mb-2">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span className={`text-xs ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>
                      You voted {pollData.userVote}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mb-2">
                  <AlertCircle className={`w-4 h-4 mx-auto mb-1 ${themeMode === 'light' ? 'text-[#888]' : 'text-gray-400'}`} />
                  <span className={`text-xs ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>
                    Haven't voted yet
                  </span>
                </div>
              )}
              
              <Button
                size="sm"
                onClick={() => setVoteModalOpen(true)}
                className={`w-full text-xs ${
                  themeMode === 'light'
                    ? 'ai-analysis-btn-light hover:opacity-90'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-[#F4F4F6] drop-shadow-md'
                }`}
              >
                {pollData.userVote ? 'Change Vote' : 'Vote Now'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vote Modal */}
        <Dialog open={voteModalOpen} onOpenChange={setVoteModalOpen}>
          <DialogContent className={`max-w-sm ${
            themeMode === 'light' 
              ? 'bg-white border-[#E0E0E0]' 
              : 'bg-black/95 border-purple-500/30'
          }`}>
            <DialogHeader>
              <DialogTitle className={`text-center ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>
                Vote on ${ticker}
              </DialogTitle>
              <DialogDescription className={`text-center ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>
                What's your 24h sentiment?
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <Button
                onClick={() => handleVote('bullish')}
                className={`flex flex-col items-center gap-1 h-16 ${
                  pollData.userVote === 'bullish' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : themeMode === 'light'
                      ? 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'
                      : 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">Bullish</span>
              </Button>

              <Button
                onClick={() => handleVote('holding')}
                className={`flex flex-col items-center gap-1 h-16 ${
                  pollData.userVote === 'holding' 
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                    : themeMode === 'light'
                      ? 'bg-yellow-50 border border-yellow-200 text-yellow-700 hover:bg-yellow-100'
                      : 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30'
                }`}
              >
                <Minus className="w-4 h-4" />
                <span className="text-xs font-medium">Holding</span>
              </Button>

              <Button
                onClick={() => handleVote('bearish')}
                className={`flex flex-col items-center gap-1 h-16 ${
                  pollData.userVote === 'bearish' 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : themeMode === 'light'
                      ? 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100'
                      : 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                <span className="text-xs font-medium">Bearish</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Inline variant
  return (
    <div className={cn(
      'flex items-center gap-4 p-3 rounded-lg transition-all duration-200',
      themeMode === 'light' 
        ? 'bg-[#F5F5F5] border border-[#E0E0E0] hover:border-[#3F51B5]/30' 
        : 'bg-black/20 border border-gray-700/50 hover:border-purple-500/50',
      className
    )}>
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-purple-400" />
        <span className={`text-sm font-medium ${themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}`}>
          Poll:
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-1 ${getSentimentColor(pollData.bullish)}`}>
          <TrendingUp className="w-3 h-3" />
          <span className="text-sm font-medium">{pollData.bullish}%</span>
        </div>
        <div className={`flex items-center gap-1 ${getSentimentColor(pollData.holding)}`}>
          <Minus className="w-3 h-3" />
          <span className="text-sm font-medium">{pollData.holding}%</span>
        </div>
        <div className={`flex items-center gap-1 ${getSentimentColor(pollData.bearish)}`}>
          <TrendingDown className="w-3 h-3" />
          <span className="text-sm font-medium">{pollData.bearish}%</span>
        </div>
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={() => setVoteModalOpen(true)}
        className={`text-xs h-6 px-2 ml-auto ${
          themeMode === 'light'
            ? 'border-[#3F51B5] text-[#3F51B5] hover:bg-[#3F51B5]/10'
            : 'border-purple-500 text-purple-400 hover:bg-purple-500/20'
        }`}
      >
        Vote
      </Button>

      {/* Vote Modal */}
      <Dialog open={voteModalOpen} onOpenChange={setVoteModalOpen}>
        <DialogContent className={`max-w-sm ${
          themeMode === 'light' 
            ? 'bg-white border-[#E0E0E0]' 
            : 'bg-black/95 border-purple-500/30'
        }`}>
          <DialogHeader>
            <DialogTitle className={`text-center ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>
              Vote on ${ticker}
            </DialogTitle>
            <DialogDescription className={`text-center ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>
              What's your 24h sentiment?
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <Button
              onClick={() => handleVote('bullish')}
              className={`flex flex-col items-center gap-1 h-16 ${
                pollData.userVote === 'bullish' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : themeMode === 'light'
                    ? 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'
                    : 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">Bullish</span>
            </Button>

            <Button
              onClick={() => handleVote('holding')}
              className={`flex flex-col items-center gap-1 h-16 ${
                pollData.userVote === 'holding' 
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                  : themeMode === 'light'
                    ? 'bg-yellow-50 border border-yellow-200 text-yellow-700 hover:bg-yellow-100'
                    : 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30'
              }`}
            >
              <Minus className="w-4 h-4" />
              <span className="text-xs font-medium">Holding</span>
            </Button>

            <Button
              onClick={() => handleVote('bearish')}
              className={`flex flex-col items-center gap-1 h-16 ${
                pollData.userVote === 'bearish' 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : themeMode === 'light'
                    ? 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100'
                    : 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-medium">Bearish</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
