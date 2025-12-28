import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useMoodTheme } from '../contexts/MoodThemeContext';
import { Users, BarChart3, TrendingUp, Vote, Search, RefreshCw, Check, Trophy, Award, Star, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface StockPoll {
  id: string;
  ticker: string;
  fullName: string;
  votes: number;
  aiScore: number;
  updatedMinutesAgo: number;
  bullishPercentage: number;
  holdingPercentage: number;
  bearishPercentage: number;
  userVote?: 'bullish' | 'holding' | 'bearish' | null;
}

export default function CommunitySentimentPolls() {
  const { themeMode } = useMoodTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('most-votes');
  const [activeTab, setActiveTab] = useState('live');
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<StockPoll | null>(null);

  const [polls, setPolls] = useState<StockPoll[]>([
    {
      id: '1',
      ticker: 'BTC',
      fullName: '$BTC',
      votes: 3421,
      aiScore: 68,
      updatedMinutesAgo: 3,
      bullishPercentage: 71,
      holdingPercentage: 10,
      bearishPercentage: 19,
      userVote: 'holding'
    },
    {
      id: '2', 
      ticker: 'NVDA',
      fullName: '$NVDA',
      votes: 2156,
      aiScore: 85,
      updatedMinutesAgo: 1,
      bullishPercentage: 82,
      holdingPercentage: 6,
      bearishPercentage: 12,
      userVote: null
    },
    {
      id: '3',
      ticker: 'ETH',
      fullName: '$ETH', 
      votes: 1876,
      aiScore: 61,
      updatedMinutesAgo: 4,
      bullishPercentage: 64,
      holdingPercentage: 11,
      bearishPercentage: 25,
      userVote: null
    },
    {
      id: '4',
      ticker: 'AAPL',
      fullName: '$AAPL',
      votes: 1247,
      aiScore: 72,
      updatedMinutesAgo: 2,
      bullishPercentage: 66,
      holdingPercentage: 12,
      bearishPercentage: 22,
      userVote: 'bullish'
    },
    {
      id: '5',
      ticker: 'TSLA',
      fullName: '$TSLA',
      votes: 894,
      aiScore: 58,
      updatedMinutesAgo: 5,
      bullishPercentage: 45,
      holdingPercentage: 17,
      bearishPercentage: 38,
      userVote: 'bearish'
    }
  ]);

  const totalVotes = polls.reduce((sum, poll) => sum + poll.votes, 0);
  const avgBullish = Math.round(polls.reduce((sum, poll) => sum + poll.bullishPercentage, 0) / polls.length);
  const userVotesCount = polls.filter(poll => poll.userVote).length;
  const activePolls = polls.length;

  const getProgressBarColor = (type: 'bullish' | 'holding' | 'bearish') => {
    switch (type) {
      case 'bullish': return 'bg-green-500';
      case 'holding': return 'bg-yellow-500';
      case 'bearish': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleVoteClick = (poll: StockPoll) => {
    setSelectedPoll(poll);
    setVoteModalOpen(true);
  };

  const handleVoteSubmit = (voteType: 'bullish' | 'holding' | 'bearish') => {
    if (!selectedPoll) return;

    setPolls(prev => prev.map(poll => {
      if (poll.id === selectedPoll.id) {
        return {
          ...poll,
          userVote: voteType,
          votes: poll.votes + (poll.userVote ? 0 : 1)
        };
      }
      return poll;
    }));

    setVoteModalOpen(false);
    setSelectedPoll(null);
  };

  const VoteButton = ({ poll, voteType }: { poll: StockPoll, voteType: 'bullish' | 'holding' | 'bearish' }) => {
    const isUserVote = poll.userVote === voteType;
    const hasVoted = poll.userVote !== null;

    if (hasVoted && !isUserVote) {
      return null; // Don't show vote buttons for other options if user already voted
    }

    return (
      <Button
        variant={isUserVote ? "default" : "outline"}
        size="sm"
        onClick={() => handleVoteClick(poll)}
        className={cn(
          "text-xs",
          isUserVote
            ? "bg-purple-600 hover:bg-purple-700 text-white"
            : themeMode === 'light'
              ? 'border-gray-300 text-gray-600 hover:bg-gray-100'
              : 'border-gray-600 text-gray-300 hover:bg-gray-800'
        )}
      >
        {isUserVote ? 'Change Vote' : hasVoted ? 'Vote Now' : 'Vote Now'}
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={cn(
        "rounded-2xl p-6 border",
        themeMode === 'light'
          ? 'bg-white border-gray-200'
          : 'bg-gradient-to-br from-purple-900/80 via-purple-800/60 to-purple-900/80 backdrop-blur-xl border-purple-500/20'
      )}>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Users className="w-8 h-8 text-blue-400" />
            <h1 className={cn(
              "text-3xl font-bold",
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            )}>
              Community Sentiment Polls
            </h1>
          </div>
          <p className={cn(
            "text-lg",
            themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'
          )}>
            Vote on market sentiment and see real-time community predictions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={cn(
            "p-4 rounded-xl border",
            themeMode === 'light'
              ? 'bg-gray-50 border-gray-200'
              : 'bg-black/40 border-purple-500/20'
          )}>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span className={cn(
                "text-sm font-medium",
                themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'
              )}>
                Active Polls
              </span>
            </div>
            <div className={cn(
              "text-2xl font-bold",
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            )}>
              {activePolls}
            </div>
          </div>

          <div className={cn(
            "p-4 rounded-xl border",
            themeMode === 'light'
              ? 'bg-gray-50 border-gray-200'
              : 'bg-black/40 border-purple-500/20'
          )}>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span className={cn(
                "text-sm font-medium",
                themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'
              )}>
                Total Votes
              </span>
            </div>
            <div className={cn(
              "text-2xl font-bold",
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            )}>
              {totalVotes.toLocaleString()}
            </div>
          </div>

          <div className={cn(
            "p-4 rounded-xl border",
            themeMode === 'light'
              ? 'bg-gray-50 border-gray-200'
              : 'bg-black/40 border-purple-500/20'
          )}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className={cn(
                "text-sm font-medium",
                themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'
              )}>
                Avg Bullish
              </span>
            </div>
            <div className="text-2xl font-bold text-green-400">
              {avgBullish}%
            </div>
          </div>

          <div className={cn(
            "p-4 rounded-xl border",
            themeMode === 'light'
              ? 'bg-gray-50 border-gray-200'
              : 'bg-black/40 border-purple-500/20'
          )}>
            <div className="flex items-center gap-2 mb-1">
              <Vote className="w-4 h-4 text-yellow-400" />
              <span className={cn(
                "text-sm font-medium",
                themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'
              )}>
                Your Votes
              </span>
            </div>
            <div className={cn(
              "text-2xl font-bold",
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            )}>
              {userVotesCount}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search tickers (e.g., AAPL, BTC)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pl-10",
                themeMode === 'light'
                  ? 'bg-white border-gray-300'
                  : 'bg-black/40 border-gray-600 text-white'
              )}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className={cn(
              "w-48",
              themeMode === 'light'
                ? 'bg-white border-gray-300'
                : 'bg-black/40 border-gray-600 text-white'
            )}>
              <SelectValue placeholder="Most Votes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="most-votes">Most Votes</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="bullish">Most Bullish</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-2",
              themeMode === 'light'
                ? 'border-gray-300 text-gray-600 hover:bg-gray-100'
                : 'border-gray-600 text-gray-300 hover:bg-gray-800'
            )}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={cn(
          "grid w-full grid-cols-3",
          themeMode === 'light'
            ? 'bg-gray-100 border border-gray-200'
            : 'bg-purple-900/40 border border-purple-500/20'
        )}>
          <TabsTrigger
            value="live"
            className={cn(
              themeMode === 'light'
                ? 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-600'
                : 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300'
            )}
          >
            Live Polls
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className={cn(
              themeMode === 'light'
                ? 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-600'
                : 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300'
            )}
          >
            Leaderboard
          </TabsTrigger>
          <TabsTrigger
            value="my-votes"
            className={cn(
              themeMode === 'light'
                ? 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-600'
                : 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300'
            )}
          >
            My Votes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {polls.map((poll) => (
              <Card
                key={poll.id}
                className={cn(
                  "border transition-all duration-300 cursor-pointer hover:shadow-lg",
                  themeMode === 'light'
                    ? 'bg-white border-gray-200 hover:border-gray-300'
                    : 'bg-gradient-to-br from-purple-900/40 to-purple-800/30 border-purple-500/20 hover:border-purple-400/40'
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className={cn(
                        "text-lg font-bold",
                        themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                      )}>
                        {poll.ticker}
                      </h3>
                      <span className={cn(
                        "text-sm",
                        themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                      )}>
                        {poll.fullName}
                      </span>
                    </div>
                    <Badge className={cn(
                      "text-xs",
                      poll.aiScore >= 70
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : poll.aiScore >= 50
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                    )}>
                      AI {poll.aiScore}
                    </Badge>
                  </div>
                  <div className={cn(
                    "text-xs",
                    themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                  )}>
                    {poll.votes.toLocaleString()} votes • Updated {poll.updatedMinutesAgo} min ago
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* Bullish */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className={cn(
                          "text-sm font-medium",
                          themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
                        )}>
                          Bullish
                        </span>
                      </div>
                      <span className="text-sm font-bold text-green-400">
                        {poll.bullishPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${poll.bullishPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Holding */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded-sm" />
                        <span className={cn(
                          "text-sm font-medium",
                          themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
                        )}>
                          Holding
                        </span>
                      </div>
                      <span className="text-sm font-bold text-yellow-400">
                        {poll.holdingPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${poll.holdingPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Bearish */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded-sm rotate-180">
                          ▲
                        </div>
                        <span className={cn(
                          "text-sm font-medium",
                          themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
                        )}>
                          Bearish
                        </span>
                      </div>
                      <span className="text-sm font-bold text-red-400">
                        {poll.bearishPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${poll.bearishPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Vote Status */}
                  <div className="pt-2 border-t border-gray-700/50">
                    {poll.userVote ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-400" />
                          <span className={cn(
                            "text-sm",
                            themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
                          )}>
                            You voted {poll.userVote}
                          </span>
                        </div>
                        <VoteButton poll={poll} voteType={poll.userVote} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "text-sm",
                          themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                        )}>
                          Haven't voted yet
                        </span>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleVoteClick(poll)}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                        >
                          Vote Now
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          <Card className={cn(
            "border",
            themeMode === 'light'
              ? 'bg-white border-gray-200'
              : 'bg-purple-900/40 border-purple-500/20'
          )}>
            <CardHeader>
              <CardTitle className={cn(
                "flex items-center gap-2 text-lg",
                themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
              )}>
                🏆 Top Predictors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    rank: 1,
                    username: 'CryptoKing',
                    accuracy: 87.3,
                    votes: 245,
                    streak: 12,
                    badges: ['👤', '🏅', '📊']
                  },
                  {
                    rank: 2,
                    username: 'StockWizard',
                    accuracy: 84.1,
                    votes: 198,
                    streak: 8,
                    badges: ['👤', '📊']
                  },
                  {
                    rank: 3,
                    username: 'MarketSeer',
                    accuracy: 81.7,
                    votes: 312,
                    streak: 15,
                    badges: ['👤', '⭐']
                  },
                  {
                    rank: 4,
                    username: 'TradeMaster',
                    accuracy: 79.2,
                    votes: 167,
                    streak: 6,
                    badges: ['👤']
                  },
                  {
                    rank: 5,
                    username: 'BullBear',
                    accuracy: 76.8,
                    votes: 134,
                    streak: 4,
                    badges: ['👤']
                  }
                ].map((user) => (
                  <div
                    key={user.rank}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg transition-all duration-300",
                      themeMode === 'light'
                        ? 'bg-gray-50 hover:bg-gray-100'
                        : 'bg-black/20 hover:bg-black/30'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white",
                        user.rank === 1 ? 'bg-yellow-500' :
                        user.rank === 2 ? 'bg-gray-400' :
                        user.rank === 3 ? 'bg-amber-600' :
                        'bg-purple-500'
                      )}>
                        {user.rank}
                      </div>

                      {/* User Info */}
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className={cn(
                            "font-semibold",
                            themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                          )}>
                            {user.username}
                          </h4>
                          <div className="flex items-center gap-1 mt-1">
                            {user.badges.map((badge, index) => (
                              <span key={index} className="text-xs">
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className={cn(
                        "text-lg font-bold",
                        user.accuracy >= 85 ? 'text-green-400' :
                        user.accuracy >= 80 ? 'text-yellow-400' :
                        'text-blue-400'
                      )}>
                        {user.accuracy}%
                      </div>
                      <div className={cn(
                        "text-xs",
                        themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                      )}>
                        {user.votes} votes • {user.streak} streak
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-votes" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {polls.filter(poll => poll.userVote).map((poll) => (
              <Card
                key={poll.id}
                className={cn(
                  "border transition-all duration-300 cursor-pointer hover:shadow-lg",
                  themeMode === 'light'
                    ? 'bg-white border-gray-200 hover:border-gray-300'
                    : 'bg-gradient-to-br from-purple-900/40 to-purple-800/30 border-purple-500/20 hover:border-purple-400/40'
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className={cn(
                        "text-lg font-bold",
                        themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                      )}>
                        {poll.ticker}
                      </h3>
                      <span className={cn(
                        "text-sm",
                        themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                      )}>
                        {poll.fullName}
                      </span>
                    </div>
                    <Badge className={cn(
                      "text-xs",
                      poll.aiScore >= 70
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : poll.aiScore >= 50
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                    )}>
                      AI {poll.aiScore}
                    </Badge>
                  </div>
                  <div className={cn(
                    "text-xs",
                    themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                  )}>
                    {poll.votes.toLocaleString()} votes • Updated {poll.updatedMinutesAgo} min ago
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Bullish */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className={cn(
                          "text-sm font-medium",
                          themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
                        )}>
                          Bullish
                        </span>
                      </div>
                      <span className="text-sm font-bold text-green-400">
                        {poll.bullishPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${poll.bullishPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Holding */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded-sm" />
                        <span className={cn(
                          "text-sm font-medium",
                          themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
                        )}>
                          Holding
                        </span>
                      </div>
                      <span className="text-sm font-bold text-yellow-400">
                        {poll.holdingPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${poll.holdingPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Bearish */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded-sm rotate-180">
                          ▲
                        </div>
                        <span className={cn(
                          "text-sm font-medium",
                          themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
                        )}>
                          Bearish
                        </span>
                      </div>
                      <span className="text-sm font-bold text-red-400">
                        {poll.bearishPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${poll.bearishPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Vote Status */}
                  <div className="pt-2 border-t border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className={cn(
                          "text-sm",
                          themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
                        )}>
                          You voted {poll.userVote}
                        </span>
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleVoteClick(poll)}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                      >
                        Change Vote
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Voting Modal */}
      <Dialog open={voteModalOpen} onOpenChange={setVoteModalOpen}>
        <DialogContent className={cn(
          "max-w-md",
          themeMode === 'light'
            ? 'bg-white border-gray-200'
            : 'bg-gray-900 border-purple-500/20'
        )}>
          <DialogHeader>
            <DialogTitle className={cn(
              "text-xl font-bold text-center",
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            )}>
              Vote on {selectedPoll?.ticker}
            </DialogTitle>
            <DialogDescription className={cn(
              "text-center mt-2",
              themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'
            )}>
              Share your sentiment prediction for the next 24 hours.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-6">
            {/* Bullish Button */}
            <Button
              onClick={() => handleVoteSubmit('bullish')}
              className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg rounded-lg transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6" />
                <span>Bullish</span>
              </div>
            </Button>

            {/* Holding Button */}
            <Button
              onClick={() => handleVoteSubmit('holding')}
              className="w-full h-14 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-lg rounded-lg transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-sm flex items-center justify-center">
                  <span className="text-yellow-800 font-bold text-sm">—</span>
                </div>
                <span>Holding</span>
              </div>
            </Button>

            {/* Bearish Button */}
            <Button
              onClick={() => handleVoteSubmit('bearish')}
              className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg rounded-lg transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-sm flex items-center justify-center rotate-180">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span>Bearish</span>
              </div>
            </Button>
          </div>

          <div className={cn(
            "text-center text-sm mt-4",
            themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
          )}>
            You can change your vote within 24 hours
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
