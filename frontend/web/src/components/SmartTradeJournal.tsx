import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { useMoodTheme } from '../contexts/MoodThemeContext';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Brain,
  BarChart3,
  Download,
  Filter,
  Calendar,
  PieChart,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Trade {
  id: string;
  ticker: string;
  entryPrice: number;
  exitPrice?: number;
  positionType: 'buy' | 'sell';
  quantity: number;
  entryDate: string;
  exitDate?: string;
  sentimentScore: number;
  emotionTag: {
    emoji: string;
    label: string;
  };
  notes?: string;
  pnl?: number;
  status: 'open' | 'closed';
}

interface EmotionTag {
  emoji: string;
  label: string;
  description: string;
}

const emotionTags: EmotionTag[] = [
  { emoji: '🧠', label: 'Confident', description: 'High conviction, well-researched decision' },
  { emoji: '🐂', label: 'Greedy', description: 'FOMO or excessive optimism' },
  { emoji: '😰', label: 'Fearful', description: 'Panic or anxiety-driven decision' },
  { emoji: '🎯', label: 'Strategic', description: 'Planned, systematic approach' },
  { emoji: '⚡', label: 'Impulsive', description: 'Quick, reactive decision' },
  { emoji: '🤔', label: 'Uncertain', description: 'Hesitant or doubtful' },
  { emoji: '😎', label: 'Calm', description: 'Composed and rational' },
  { emoji: '🔥', label: 'Euphoric', description: 'Extremely optimistic' }
];

export default function SmartTradeJournal() {
  const { themeMode } = useMoodTheme();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isAddingTrade, setIsAddingTrade] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionTag | null>(null);
  const [currentSentiment, setCurrentSentiment] = useState(65); // Mock sentiment score
  const [filterBy, setFilterBy] = useState<'all' | 'open' | 'closed' | 'profitable' | 'losing'>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Mock trade data
  useEffect(() => {
    const mockTrades: Trade[] = [
      {
        id: '1',
        ticker: 'AAPL',
        entryPrice: 175.50,
        exitPrice: 182.30,
        positionType: 'buy',
        quantity: 100,
        entryDate: '2024-01-15',
        exitDate: '2024-01-22',
        sentimentScore: 72,
        emotionTag: { emoji: '🧠', label: 'Confident' },
        notes: 'Strong earnings report expected, technical breakout confirmed',
        pnl: 680,
        status: 'closed'
      },
      {
        id: '2',
        ticker: 'TSLA',
        entryPrice: 245.80,
        positionType: 'buy',
        quantity: 50,
        entryDate: '2024-01-20',
        sentimentScore: 45,
        emotionTag: { emoji: '😰', label: 'Fearful' },
        notes: 'Bought the dip but market sentiment very negative',
        status: 'open'
      },
      {
        id: '3',
        ticker: 'NVDA',
        entryPrice: 520.00,
        exitPrice: 498.50,
        positionType: 'buy',
        quantity: 25,
        entryDate: '2024-01-10',
        exitDate: '2024-01-18',
        sentimentScore: 85,
        emotionTag: { emoji: '🐂', label: 'Greedy' },
        notes: 'FOMO on AI hype, ignored technical signals',
        pnl: -537.5,
        status: 'closed'
      }
    ];
    setTrades(mockTrades);
  }, []);

  const [newTrade, setNewTrade] = useState({
    ticker: '',
    entryPrice: '',
    exitPrice: '',
    positionType: 'buy' as 'buy' | 'sell',
    quantity: '',
    notes: ''
  });

  const resetNewTrade = () => {
    setNewTrade({
      ticker: '',
      entryPrice: '',
      exitPrice: '',
      positionType: 'buy',
      quantity: '',
      notes: ''
    });
    setSelectedEmotion(null);
  };

  const handleAddTrade = () => {
    if (!newTrade.ticker || !newTrade.entryPrice || !newTrade.quantity || !selectedEmotion) {
      return;
    }

    const trade: Trade = {
      id: Date.now().toString(),
      ticker: newTrade.ticker.toUpperCase(),
      entryPrice: parseFloat(newTrade.entryPrice),
      exitPrice: newTrade.exitPrice ? parseFloat(newTrade.exitPrice) : undefined,
      positionType: newTrade.positionType,
      quantity: parseInt(newTrade.quantity),
      entryDate: new Date().toISOString().split('T')[0],
      exitDate: newTrade.exitPrice ? new Date().toISOString().split('T')[0] : undefined,
      sentimentScore: currentSentiment,
      emotionTag: selectedEmotion,
      notes: newTrade.notes,
      pnl: newTrade.exitPrice ? 
        (parseFloat(newTrade.exitPrice) - parseFloat(newTrade.entryPrice)) * parseInt(newTrade.quantity) 
        : undefined,
      status: newTrade.exitPrice ? 'closed' : 'open'
    };

    setTrades([trade, ...trades]);
    resetNewTrade();
    setIsAddingTrade(false);
  };

  const filteredTrades = trades.filter(trade => {
    if (filterBy === 'all') return true;
    if (filterBy === 'open') return trade.status === 'open';
    if (filterBy === 'closed') return trade.status === 'closed';
    if (filterBy === 'profitable') return trade.pnl && trade.pnl > 0;
    if (filterBy === 'losing') return trade.pnl && trade.pnl < 0;
    return true;
  });

  const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const profitableTrades = trades.filter(trade => trade.pnl && trade.pnl > 0).length;
  const totalTrades = trades.filter(trade => trade.status === 'closed').length;
  const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;

  const emotionDistribution = trades.reduce((acc, trade) => {
    const emotion = trade.emotionTag.label;
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getAIInsights = () => {
    const insights = [];
    
    if (winRate < 50) {
      insights.push({
        type: 'warning',
        message: `Your win rate is ${winRate.toFixed(1)}%. Consider reviewing your entry criteria.`
      });
    }

    const fearfulTrades = trades.filter(t => t.emotionTag.label === 'Fearful');
    const fearfulLosses = fearfulTrades.filter(t => t.pnl && t.pnl < 0).length;
    
    if (fearfulTrades.length > 0 && fearfulLosses / fearfulTrades.length > 0.7) {
      insights.push({
        type: 'warning',
        message: '75% of your fearful trades resulted in losses. Consider waiting for better sentiment.'
      });
    }

    const greedyTrades = trades.filter(t => t.emotionTag.label === 'Greedy');
    if (greedyTrades.length > trades.length * 0.3) {
      insights.push({
        type: 'caution',
        message: 'High frequency of greedy trades detected. Practice more disciplined entries.'
      });
    }

    if (totalPnL > 0) {
      insights.push({
        type: 'success',
        message: `Great job! You're up $${totalPnL.toFixed(2)} overall. Keep following your strategy.`
      });
    }

    return insights;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`rounded-2xl p-6 ${
        themeMode === 'light'
          ? 'enhanced-card-light border border-[#E0E0E0]'
          : 'bg-black/80 backdrop-blur-xl border border-purple-500/20'
      }`}>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg ${
              themeMode === 'light'
                ? 'bg-gradient-to-r from-[#3F51B5]/20 to-[#673AB7]/20 shadow-[#3F51B5]/20'
                : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-blue-500/20'
            }`}>
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className={`text-4xl font-bold ${
              themeMode === 'light'
                ? 'text-[#1E1E1E]'
                : 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'
            }`}>
              Smart Trade Journal
            </h1>
          </div>
          <p className={`text-xl max-w-2xl mx-auto mb-6 ${
            themeMode === 'light' ? 'text-[#444]' : 'text-gray-300'
          }`}>
            Track, analyze, and improve your trading with emotion-based insights
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className={themeMode === 'light' ? 'enhanced-card-light' : 'bg-black/40 border-gray-700/50'}>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className={`text-sm font-medium ${themeMode === 'light' ? 'text-[#444]' : 'text-gray-300'}`}>
                  Total P&L
                </span>
              </div>
              <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${totalPnL.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className={themeMode === 'light' ? 'enhanced-card-light' : 'bg-black/40 border-gray-700/50'}>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-400" />
                <span className={`text-sm font-medium ${themeMode === 'light' ? 'text-[#444]' : 'text-gray-300'}`}>
                  Win Rate
                </span>
              </div>
              <div className={`text-2xl font-bold ${winRate >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>
                {winRate.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card className={themeMode === 'light' ? 'enhanced-card-light' : 'bg-black/40 border-gray-700/50'}>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <span className={`text-sm font-medium ${themeMode === 'light' ? 'text-[#444]' : 'text-gray-300'}`}>
                  Total Trades
                </span>
              </div>
              <div className={`text-2xl font-bold ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>
                {trades.length}
              </div>
            </CardContent>
          </Card>

          <Card className={themeMode === 'light' ? 'enhanced-card-light' : 'bg-black/40 border-gray-700/50'}>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-pink-400" />
                <span className={`text-sm font-medium ${themeMode === 'light' ? 'text-[#444]' : 'text-gray-300'}`}>
                  Avg Sentiment
                </span>
              </div>
              <div className={`text-2xl font-bold ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>
                {trades.length > 0 ? (trades.reduce((sum, t) => sum + t.sentimentScore, 0) / trades.length).toFixed(0) : '0'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Trade Button */}
        <div className="flex justify-center">
          <Dialog open={isAddingTrade} onOpenChange={setIsAddingTrade}>
            <DialogTrigger asChild>
              <Button className={`${
                themeMode === 'light'
                  ? 'ai-analysis-btn-light hover:opacity-90'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              } px-6 py-3 rounded-xl font-semibold flex items-center gap-2`}>
                <Plus className="w-5 h-5" />
                Add New Trade
              </Button>
            </DialogTrigger>
            <DialogContent className={`max-w-2xl ${
              themeMode === 'light' 
                ? 'bg-white border-[#E0E0E0]' 
                : 'bg-black/95 border-purple-500/30'
            }`}>
              <DialogHeader>
                <DialogTitle className={themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}>
                  Log New Trade
                </DialogTitle>
                <DialogDescription className={themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}>
                  Record your trade details and emotional state for better analysis.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Basic Trade Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className={themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}>Ticker</Label>
                    <Input
                      placeholder="e.g., AAPL"
                      value={newTrade.ticker}
                      onChange={(e) => setNewTrade({...newTrade, ticker: e.target.value})}
                      className={themeMode === 'light' 
                        ? 'bg-white border-[#E0E0E0] text-[#1C1E21]' 
                        : 'bg-black/40 border-gray-700 text-white'
                      }
                    />
                  </div>
                  <div>
                    <Label className={themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}>Position Type</Label>
                    <Select value={newTrade.positionType} onValueChange={(value: 'buy' | 'sell') => setNewTrade({...newTrade, positionType: value})}>
                      <SelectTrigger className={themeMode === 'light' 
                        ? 'bg-white border-[#E0E0E0] text-[#1C1E21]' 
                        : 'bg-black/40 border-gray-700 text-white'
                      }>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className={themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}>Entry Price</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newTrade.entryPrice}
                      onChange={(e) => setNewTrade({...newTrade, entryPrice: e.target.value})}
                      className={themeMode === 'light' 
                        ? 'bg-white border-[#E0E0E0] text-[#1C1E21]' 
                        : 'bg-black/40 border-gray-700 text-white'
                      }
                    />
                  </div>
                  <div>
                    <Label className={themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}>Exit Price (Optional)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newTrade.exitPrice}
                      onChange={(e) => setNewTrade({...newTrade, exitPrice: e.target.value})}
                      className={themeMode === 'light' 
                        ? 'bg-white border-[#E0E0E0] text-[#1C1E21]' 
                        : 'bg-black/40 border-gray-700 text-white'
                      }
                    />
                  </div>
                  <div>
                    <Label className={themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}>Quantity</Label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={newTrade.quantity}
                      onChange={(e) => setNewTrade({...newTrade, quantity: e.target.value})}
                      className={themeMode === 'light' 
                        ? 'bg-white border-[#E0E0E0] text-[#1C1E21]' 
                        : 'bg-black/40 border-gray-700 text-white'
                      }
                    />
                  </div>
                </div>

                {/* P&L Display */}
                {newTrade.entryPrice && newTrade.exitPrice && newTrade.quantity && (
                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <span className="font-semibold">Calculated P&L:</span>
                      <span className={`font-bold text-lg ${
                        (parseFloat(newTrade.exitPrice) - parseFloat(newTrade.entryPrice)) * parseInt(newTrade.quantity) >= 0 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        ${((parseFloat(newTrade.exitPrice) - parseFloat(newTrade.entryPrice)) * parseInt(newTrade.quantity)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Current Sentiment */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold">Current Market Sentiment: {currentSentiment}/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${currentSentiment}%` }}
                    />
                  </div>
                </div>

                {/* Emotion Tags */}
                <div>
                  <Label className={`mb-3 block ${themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}`}>
                    How are you feeling about this trade?
                  </Label>
                  <div className="grid grid-cols-4 gap-3">
                    {emotionTags.map((emotion) => (
                      <button
                        key={emotion.label}
                        onClick={() => setSelectedEmotion(emotion)}
                        className={cn(
                          "p-3 rounded-lg border-2 transition-all duration-200 text-center",
                          selectedEmotion?.label === emotion.label
                            ? "border-purple-500 bg-purple-500/20"
                            : themeMode === 'light'
                              ? "border-[#E0E0E0] bg-white hover:border-[#3F51B5] hover:bg-[#3F51B5]/5"
                              : "border-gray-700 bg-black/20 hover:border-purple-500/50 hover:bg-purple-500/10"
                        )}
                      >
                        <div className="text-2xl mb-1">{emotion.emoji}</div>
                        <div className={`text-xs font-medium ${themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}`}>
                          {emotion.label}
                        </div>
                      </button>
                    ))}
                  </div>
                  {selectedEmotion && (
                    <p className={`text-sm mt-2 ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>
                      {selectedEmotion.description}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <Label className={themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}>Notes (Optional)</Label>
                  <Textarea
                    placeholder="Why did you make this trade? What was your reasoning?"
                    value={newTrade.notes}
                    onChange={(e) => setNewTrade({...newTrade, notes: e.target.value})}
                    className={themeMode === 'light' 
                      ? 'bg-white border-[#E0E0E0] text-[#1C1E21]' 
                      : 'bg-black/40 border-gray-700 text-white'
                    }
                    rows={3}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleAddTrade}
                    disabled={!newTrade.ticker || !newTrade.entryPrice || !newTrade.quantity || !selectedEmotion}
                    className={`flex-1 ${
                      themeMode === 'light'
                        ? 'ai-analysis-btn-light hover:opacity-90'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                    }`}
                  >
                    Add Trade
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetNewTrade();
                      setIsAddingTrade(false);
                    }}
                    className={themeMode === 'light' 
                      ? 'border-[#E0E0E0] text-[#666] hover:bg-[#F5F5F5]' 
                      : 'border-gray-700 text-gray-300 hover:bg-gray-800'
                    }
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="journal" className="w-full">
        <TabsList className={`grid w-full grid-cols-3 ${
          themeMode === 'light' 
            ? 'bg-[#F5F5F5] border border-[#E0E0E0]' 
            : 'bg-black/40 border border-gray-700/50'
        }`}>
          <TabsTrigger
            value="journal"
            className={
              themeMode === 'light'
                ? 'data-[state=active]:bg-[#3F51B5] data-[state=active]:text-white text-[#666]'
                : 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400'
            }
          >
            Trade Log
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className={
              themeMode === 'light'
                ? 'data-[state=active]:bg-[#3F51B5] data-[state=active]:text-white text-[#666]'
                : 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400'
            }
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className={
              themeMode === 'light'
                ? 'data-[state=active]:bg-[#3F51B5] data-[state=active]:text-white text-[#666]'
                : 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400'
            }
          >
            AI Insights
          </TabsTrigger>
        </TabsList>

        {/* Trade Log Tab */}
        <TabsContent value="journal" className="mt-6 space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
              <SelectTrigger className={`w-48 ${
                themeMode === 'light' 
                  ? 'bg-white border-[#E0E0E0] text-[#1C1E21]' 
                  : 'bg-black/40 border-gray-700 text-white'
              }`}>
                <SelectValue placeholder="Filter trades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trades</SelectItem>
                <SelectItem value="open">Open Positions</SelectItem>
                <SelectItem value="closed">Closed Positions</SelectItem>
                <SelectItem value="profitable">Profitable</SelectItem>
                <SelectItem value="losing">Losing</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className={`flex items-center gap-2 ${
                themeMode === 'light' 
                  ? 'border-[#E0E0E0] text-[#666] hover:bg-[#F5F5F5]' 
                  : 'border-gray-700 text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>

          {/* Trade Timeline */}
          <div className="space-y-4">
            {filteredTrades.length === 0 ? (
              <Card className={themeMode === 'light' ? 'enhanced-card-light' : 'bg-black/40 border-gray-700/50'}>
                <CardContent className="p-8 text-center">
                  <BookOpen className={`w-12 h-12 mx-auto mb-4 ${themeMode === 'light' ? 'text-[#888]' : 'text-gray-400'}`} />
                  <h3 className={`text-xl font-semibold mb-2 ${themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}`}>
                    No trades found
                  </h3>
                  <p className={themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}>
                    Start logging your trades to see insights and analytics.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredTrades.map((trade) => (
                <Card key={trade.id} className={themeMode === 'light' ? 'enhanced-card-light' : 'bg-black/40 border-gray-700/50'}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{trade.emotionTag.emoji}</div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`text-xl font-bold ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>
                              ${trade.ticker}
                            </h3>
                            <Badge className={`${
                              trade.positionType === 'buy' 
                                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                : 'bg-red-500/20 text-red-400 border-red-500/30'
                            }`}>
                              {trade.positionType.toUpperCase()}
                            </Badge>
                            <Badge className={`${
                              trade.status === 'open' 
                                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                                : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            }`}>
                              {trade.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className={`text-sm ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>
                            {trade.emotionTag.label} • {trade.entryDate}
                            {trade.exitDate && ` → ${trade.exitDate}`}
                          </div>
                        </div>
                      </div>
                      
                      {trade.pnl !== undefined && (
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                          </div>
                          <div className={`text-sm ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>
                            {trade.quantity} shares
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className={`text-sm ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>Entry Price</div>
                        <div className={`font-semibold ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>
                          ${trade.entryPrice.toFixed(2)}
                        </div>
                      </div>
                      {trade.exitPrice && (
                        <div>
                          <div className={`text-sm ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>Exit Price</div>
                          <div className={`font-semibold ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>
                            ${trade.exitPrice.toFixed(2)}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className={`text-sm ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>Sentiment</div>
                        <div className={`font-semibold ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>
                          {trade.sentimentScore}/100
                        </div>
                      </div>
                      <div>
                        <div className={`text-sm ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>Quantity</div>
                        <div className={`font-semibold ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>
                          {trade.quantity}
                        </div>
                      </div>
                    </div>

                    {trade.notes && (
                      <div className={`p-3 rounded-lg ${
                        themeMode === 'light' 
                          ? 'bg-[#F5F5F5] border border-[#E0E0E0]' 
                          : 'bg-gray-800/50 border border-gray-700/50'
                      }`}>
                        <div className={`text-sm ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'} mb-1`}>Notes:</div>
                        <div className={`text-sm ${themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}`}>
                          {trade.notes}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emotion Distribution */}
            <Card className={themeMode === 'light' ? 'enhanced-card-light' : 'bg-black/40 border-gray-700/50'}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>
                  <PieChart className="w-5 h-5 text-purple-400" />
                  Emotion Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(emotionDistribution).map(([emotion, count]) => {
                    const percentage = (count / trades.length) * 100;
                    const emotionTag = emotionTags.find(e => e.label === emotion);
                    return (
                      <div key={emotion} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{emotionTag?.emoji}</span>
                          <span className={`text-sm ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'}`}>
                            {emotion}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium ${themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}`}>
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Performance by Emotion */}
            <Card className={themeMode === 'light' ? 'enhanced-card-light' : 'bg-black/40 border-gray-700/50'}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>
                  <Activity className="w-5 h-5 text-green-400" />
                  Performance by Emotion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {emotionTags.map((emotion) => {
                    const emotionTrades = trades.filter(t => t.emotionTag.label === emotion.label);
                    const avgPnL = emotionTrades.length > 0 
                      ? emotionTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / emotionTrades.length 
                      : 0;
                    
                    if (emotionTrades.length === 0) return null;
                    
                    return (
                      <div key={emotion.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{emotion.emoji}</span>
                          <span className={`text-sm ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'}`}>
                            {emotion.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${avgPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {avgPnL >= 0 ? '+' : ''}${avgPnL.toFixed(2)}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {emotionTrades.length}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="mt-6 space-y-6">
          <Card className={themeMode === 'light' ? 'enhanced-card-light' : 'bg-black/40 border-gray-700/50'}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                AI Trading Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getAIInsights().map((insight, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    insight.type === 'success' 
                      ? 'bg-green-500/10 border-green-500 border-l-green-500'
                      : insight.type === 'warning'
                        ? 'bg-red-500/10 border-red-500 border-l-red-500'
                        : 'bg-yellow-500/10 border-yellow-500 border-l-yellow-500'
                  }`}>
                    <div className="flex items-start gap-3">
                      {insight.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />}
                      {insight.type === 'warning' && <XCircle className="w-5 h-5 text-red-400 mt-0.5" />}
                      {insight.type === 'caution' && <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />}
                      <p className={`text-sm ${themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}`}>
                        {insight.message}
                      </p>
                    </div>
                  </div>
                ))}
                
                {getAIInsights().length === 0 && (
                  <div className="text-center py-8">
                    <Brain className={`w-12 h-12 mx-auto mb-4 ${themeMode === 'light' ? 'text-[#888]' : 'text-gray-400'}`} />
                    <h3 className={`text-lg font-semibold mb-2 ${themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}`}>
                      No insights available yet
                    </h3>
                    <p className={`text-sm ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>
                      Add more trades to get personalized AI insights about your trading patterns.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
