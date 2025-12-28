import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useMoodTheme } from '../contexts/MoodThemeContext';
import { Plus, BarChart3, Activity, Download, AlertTriangle, CheckCircle, X, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';

interface Trade {
  id: string;
  ticker: string;
  action: 'BUY' | 'SELL';
  status: 'OPEN' | 'CLOSED';
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  pnl?: number;
  sentiment: number;
  emotion: string;
  notes: string;
  entryDate: string;
  exitDate?: string;
}

export default function TradeJournalClassic() {
  const { themeMode } = useMoodTheme();
  const [addTradeModalOpen, setAddTradeModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    ticker: '',
    positionType: 'Buy',
    entryPrice: '',
    exitPrice: '',
    quantity: '',
    emotion: '',
    notes: ''
  });

  const [trades, setTrades] = useState<Trade[]>([
    {
      id: '1',
      ticker: 'AAPL',
      action: 'BUY',
      status: 'CLOSED',
      entryPrice: 175.50,
      exitPrice: 182.30,
      quantity: 100,
      pnl: 680.00,
      sentiment: 72,
      emotion: 'Confident',
      notes: 'Strong earnings report expected, technical breakout confirmed',
      entryDate: '2024-01-15',
      exitDate: '2024-01-22'
    },
    {
      id: '2',
      ticker: 'TSLA',
      action: 'BUY',
      status: 'OPEN',
      entryPrice: 245.80,
      quantity: 50,
      sentiment: 45,
      emotion: 'Fearful',
      notes: 'Bought the dip but market sentiment very negative',
      entryDate: '2024-01-20'
    },
    {
      id: '3',
      ticker: 'NVDA',
      action: 'BUY',
      status: 'CLOSED',
      entryPrice: 520.00,
      exitPrice: 498.50,
      quantity: 25,
      pnl: -537.50,
      sentiment: 85,
      emotion: 'Greedy',
      notes: 'FOMO on AI hype, ignored technical signals',
      entryDate: '2024-01-10',
      exitDate: '2024-01-18'
    }
  ]);

  const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const closedTrades = trades.filter(trade => trade.status === 'CLOSED');
  const profitableTrades = closedTrades.filter(trade => trade.pnl && trade.pnl > 0);
  const winRate = closedTrades.length > 0 ? (profitableTrades.length / closedTrades.length) * 100 : 0;
  const avgSentiment = trades.length > 0 ? trades.reduce((sum, trade) => sum + trade.sentiment, 0) / trades.length : 0;

  const getTickerLogo = (ticker: string) => {
    const logos: Record<string, string> = {
      'AAPL': '🍎',
      'TSLA': '🚗',
      'NVDA': '🔥'
    };
    return logos[ticker] || '📈';
  };

  const emotionOptions = [
    { value: 'confident', label: 'Confident', icon: '🧠' },
    { value: 'greedy', label: 'Greedy', icon: '🐂' },
    { value: 'fearful', label: 'Fearful', icon: '😰' },
    { value: 'strategic', label: 'Strategic', icon: '🎯' },
    { value: 'impulsive', label: 'Impulsive', icon: '⚡' },
    { value: 'uncertain', label: 'Uncertain', icon: '😕' },
    { value: 'calm', label: 'Calm', icon: '😎' },
    { value: 'euphoric', label: 'Euphoric', icon: '🔥' }
  ];

  const handleAddTradeClick = () => {
    setAddTradeModalOpen(true);
  };

  const handleFormSubmit = () => {
    if (!formData.ticker || !formData.entryPrice || !formData.quantity || !formData.emotion) {
      return; // Validation - require these fields
    }

    const newTrade: Trade = {
      id: Date.now().toString(),
      ticker: formData.ticker.toUpperCase(),
      action: formData.positionType.toUpperCase() as 'BUY' | 'SELL',
      status: 'OPEN',
      entryPrice: parseFloat(formData.entryPrice),
      exitPrice: formData.exitPrice ? parseFloat(formData.exitPrice) : undefined,
      quantity: parseInt(formData.quantity),
      sentiment: 65, // Default market sentiment
      emotion: formData.emotion,
      notes: formData.notes,
      entryDate: new Date().toISOString().split('T')[0]
    };

    setTrades(prev => [newTrade, ...prev]);

    // Reset form
    setFormData({
      ticker: '',
      positionType: 'Buy',
      entryPrice: '',
      exitPrice: '',
      quantity: '',
      emotion: '',
      notes: ''
    });

    setAddTradeModalOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      ticker: '',
      positionType: 'Buy',
      entryPrice: '',
      exitPrice: '',
      quantity: '',
      emotion: '',
      notes: ''
    });
    setAddTradeModalOpen(false);
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
            <BarChart3 className="w-8 h-8 text-blue-400" />
            <h1 className={cn(
              "text-3xl font-bold",
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            )}>
              Smart Trade Journal
            </h1>
          </div>
          <p className={cn(
            "text-lg",
            themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'
          )}>
            Track, analyze, and improve your trading with emotion-based insights
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
              <Plus className="w-4 h-4 text-green-400" />
              <span className={cn(
                "text-sm font-medium",
                themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'
              )}>
                Total P&L
              </span>
            </div>
            <div className={cn(
              "text-2xl font-bold",
              totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
            )}>
              ${totalPnL.toFixed(2)}
            </div>
          </div>

          <div className={cn(
            "p-4 rounded-xl border",
            themeMode === 'light'
              ? 'bg-gray-50 border-gray-200'
              : 'bg-black/40 border-purple-500/20'
          )}>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className={cn(
                "text-sm font-medium",
                themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'
              )}>
                Win Rate
              </span>
            </div>
            <div className={cn(
              "text-2xl font-bold",
              winRate >= 50 ? 'text-green-400' : 'text-yellow-400'
            )}>
              {winRate.toFixed(1)}%
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
                Total Trades
              </span>
            </div>
            <div className={cn(
              "text-2xl font-bold",
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            )}>
              {trades.length}
            </div>
          </div>

          <div className={cn(
            "p-4 rounded-xl border",
            themeMode === 'light'
              ? 'bg-gray-50 border-gray-200'
              : 'bg-black/40 border-purple-500/20'
          )}>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-pink-400" />
              <span className={cn(
                "text-sm font-medium",
                themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'
              )}>
                Avg Sentiment
              </span>
            </div>
            <div className={cn(
              "text-2xl font-bold",
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            )}>
              {avgSentiment.toFixed(0)}
            </div>
          </div>
        </div>

        {/* Add New Trade Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleAddTradeClick}
            className={cn(
              "px-6 py-3 rounded-xl font-semibold flex items-center gap-2",
              themeMode === 'light'
                ? 'bg-[#3F51B5] hover:bg-[#303F9F] text-white'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
            )}
          >
            <Plus className="w-5 h-5" />
            Add New Trade
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="log" className="w-full">
        <TabsList className={cn(
          "grid w-full grid-cols-3",
          themeMode === 'light'
            ? 'bg-gray-100 border border-gray-200'
            : 'bg-purple-900/40 border border-purple-500/20'
        )}>
          <TabsTrigger
            value="log"
            className={cn(
              themeMode === 'light'
                ? 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-600'
                : 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300'
            )}
          >
            Trade Log
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className={cn(
              themeMode === 'light'
                ? 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-600'
                : 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300'
            )}
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className={cn(
              themeMode === 'light'
                ? 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-600'
                : 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300'
            )}
          >
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="log" className="mt-6">
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                themeMode === 'light'
                  ? 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  : 'border-gray-600 text-gray-300 hover:bg-gray-800'
              )}
            >
              All Trades
            </Button>
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
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>

          {/* Trade List */}
          <div className="space-y-4">
            {trades.map((trade) => (
              <Card
                key={trade.id}
                className={cn(
                  "border transition-all duration-300 cursor-pointer hover:shadow-lg",
                  themeMode === 'light'
                    ? 'bg-white border-gray-200 hover:border-gray-300'
                    : 'bg-gradient-to-r from-purple-900/40 to-purple-800/30 border-purple-500/20 hover:border-purple-400/40'
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{getTickerLogo(trade.ticker)}</div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={cn(
                            "text-xl font-bold",
                            themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                          )}>
                            ${trade.ticker}
                          </h3>
                          <Badge className={cn(
                            trade.action === 'BUY'
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                          )}>
                            {trade.action}
                          </Badge>
                          <Badge className={cn(
                            trade.status === 'OPEN'
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                          )}>
                            {trade.status}
                          </Badge>
                        </div>
                        <div className={cn(
                          "text-sm",
                          themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                        )}>
                          {trade.emotion} • {trade.entryDate}
                          {trade.exitDate && ` → ${trade.exitDate}`}
                        </div>
                      </div>
                    </div>
                    
                    {trade.pnl !== undefined && (
                      <div className="text-right">
                        <div className={cn(
                          "text-2xl font-bold",
                          trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                        )}>
                          {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                        </div>
                        <div className={cn(
                          "text-sm",
                          themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                        )}>
                          {trade.quantity} shares
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className={cn(
                        "text-sm",
                        themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                      )}>
                        Entry Price
                      </div>
                      <div className={cn(
                        "font-semibold",
                        themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                      )}>
                        ${trade.entryPrice.toFixed(2)}
                      </div>
                    </div>
                    {trade.exitPrice && (
                      <div>
                        <div className={cn(
                          "text-sm",
                          themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                        )}>
                          Exit Price
                        </div>
                        <div className={cn(
                          "font-semibold",
                          themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                        )}>
                          ${trade.exitPrice.toFixed(2)}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className={cn(
                        "text-sm",
                        themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                      )}>
                        Sentiment
                      </div>
                      <div className={cn(
                        "font-semibold",
                        themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                      )}>
                        {trade.sentiment}/100
                      </div>
                    </div>
                    <div>
                      <div className={cn(
                        "text-sm",
                        themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                      )}>
                        Quantity
                      </div>
                      <div className={cn(
                        "font-semibold",
                        themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                      )}>
                        {trade.quantity}
                      </div>
                    </div>
                  </div>

                  <div className={cn(
                    "p-3 rounded-lg",
                    themeMode === 'light'
                      ? 'bg-gray-50 border border-gray-200'
                      : 'bg-black/40 border border-purple-500/20'
                  )}>
                    <div className={cn(
                      "text-sm mb-1",
                      themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                    )}>
                      Notes:
                    </div>
                    <div className={cn(
                      "text-sm",
                      themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
                    )}>
                      {trade.notes}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emotion Distribution */}
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
                  🕒 Emotion Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { emotion: 'Confident', color: 'bg-purple-500', percentage: 33 },
                    { emotion: 'Fearful', color: 'bg-yellow-500', percentage: 33 },
                    { emotion: 'Greedy', color: 'bg-orange-500', percentage: 33 }
                  ].map((item) => (
                    <div key={item.emotion} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-3 h-3 rounded", item.color)} />
                          <span className={cn(
                            "text-sm font-medium",
                            themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
                          )}>
                            {item.emotion}
                          </span>
                        </div>
                        <span className={cn(
                          "text-sm font-medium",
                          themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
                        )}>
                          {item.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={cn("h-2 rounded-full transition-all duration-300", item.color)}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance by Emotion */}
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
                  📈 Performance by Emotion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { emotion: 'Confident', icon: '🧠', pnl: 680.00, count: 1 },
                    { emotion: 'Greedy', icon: '🤑', pnl: -537.50, count: 1 },
                    { emotion: 'Fearful', icon: '😰', pnl: 0.00, count: 1 }
                  ].map((item) => (
                    <div key={item.emotion} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <span className={cn(
                          "text-sm font-medium",
                          themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
                        )}>
                          {item.emotion}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "text-sm font-bold",
                          item.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                        )}>
                          {item.pnl >= 0 ? '+' : ''}${item.pnl.toFixed(2)}
                        </span>
                        <Badge variant="secondary" className="text-xs min-w-[20px]">
                          {item.count}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
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
                🧠 AI Trading Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Warning Insight */}
                <div className={cn(
                  "p-4 rounded-lg border-l-4",
                  themeMode === 'light'
                    ? 'bg-yellow-50 border-yellow-500 border-l-yellow-500'
                    : 'bg-yellow-500/10 border-yellow-500 border-l-yellow-500'
                )}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className={cn(
                      "text-sm",
                      themeMode === 'light' ? 'text-yellow-800' : 'text-yellow-200'
                    )}>
                      High frequency of greedy trades detected. Practice more disciplined entries.
                    </p>
                  </div>
                </div>

                {/* Success Insight */}
                <div className={cn(
                  "p-4 rounded-lg border-l-4",
                  themeMode === 'light'
                    ? 'bg-green-50 border-green-500 border-l-green-500'
                    : 'bg-green-500/10 border-green-500 border-l-green-500'
                )}>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className={cn(
                      "text-sm",
                      themeMode === 'light' ? 'text-green-800' : 'text-green-200'
                    )}>
                      Great job! You're up $142.50 overall. Keep following your strategy.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add New Trade Modal */}
      <Dialog open={addTradeModalOpen} onOpenChange={setAddTradeModalOpen}>
        <DialogContent className={cn(
          "max-w-2xl max-h-[90vh] overflow-y-auto",
          themeMode === 'light'
            ? 'bg-white border-gray-200'
            : 'bg-gray-900 border-purple-500/20'
        )}>
          <DialogHeader>
            <DialogTitle className={cn(
              "text-xl font-bold",
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            )}>
              Log New Trade
            </DialogTitle>
            <DialogDescription className={cn(
              "mt-2",
              themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'
            )}>
              Record your trade details and emotional state for better analysis.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* First Row: Ticker and Position Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-2",
                  themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
                )}>
                  Ticker
                </label>
                <Input
                  placeholder="e.g., AAPL"
                  value={formData.ticker}
                  onChange={(e) => setFormData(prev => ({ ...prev, ticker: e.target.value }))}
                  className={cn(
                    themeMode === 'light'
                      ? 'bg-white border-gray-300'
                      : 'bg-gray-800 border-gray-600 text-white'
                  )}
                />
              </div>
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-2",
                  themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
                )}>
                  Position Type
                </label>
                <Select value={formData.positionType} onValueChange={(value) => setFormData(prev => ({ ...prev, positionType: value }))}>
                  <SelectTrigger className={cn(
                    themeMode === 'light'
                      ? 'bg-white border-gray-300'
                      : 'bg-gray-800 border-gray-600 text-white'
                  )}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Buy">Buy</SelectItem>
                    <SelectItem value="Sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Second Row: Entry Price, Exit Price, Quantity */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-2",
                  themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
                )}>
                  Entry Price
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.entryPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, entryPrice: e.target.value }))}
                  className={cn(
                    themeMode === 'light'
                      ? 'bg-white border-gray-300'
                      : 'bg-gray-800 border-gray-600 text-white'
                  )}
                />
              </div>
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-2",
                  themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
                )}>
                  Exit Price (Optional)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.exitPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, exitPrice: e.target.value }))}
                  className={cn(
                    themeMode === 'light'
                      ? 'bg-white border-gray-300'
                      : 'bg-gray-800 border-gray-600 text-white'
                  )}
                />
              </div>
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-2",
                  themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
                )}>
                  Quantity
                </label>
                <Input
                  type="number"
                  placeholder="100"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  className={cn(
                    themeMode === 'light'
                      ? 'bg-white border-gray-300'
                      : 'bg-gray-800 border-gray-600 text-white'
                  )}
                />
              </div>
            </div>

            {/* Market Sentiment Indicator */}
            <div className={cn(
              "p-4 rounded-lg border",
              themeMode === 'light'
                ? 'bg-blue-50 border-blue-200'
                : 'bg-blue-900/20 border-blue-500/30'
            )}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span className={cn(
                  "font-medium",
                  themeMode === 'light' ? 'text-blue-800' : 'text-blue-300'
                )}>
                  Current Market Sentiment: 65/100
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: '65%' }}
                />
              </div>
            </div>

            {/* Emotion Selection */}
            <div>
              <label className={cn(
                "block text-sm font-medium mb-4",
                themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
              )}>
                How are you feeling about this trade?
              </label>
              <div className="grid grid-cols-4 gap-3">
                {emotionOptions.map((emotion) => (
                  <Button
                    key={emotion.value}
                    variant={formData.emotion === emotion.value ? "default" : "outline"}
                    onClick={() => setFormData(prev => ({ ...prev, emotion: emotion.value }))}
                    className={cn(
                      "h-20 flex flex-col items-center gap-2 text-sm transition-all duration-200",
                      formData.emotion === emotion.value
                        ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-500"
                        : themeMode === 'light'
                          ? 'border-gray-300 text-gray-600 hover:bg-gray-100'
                          : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                    )}
                  >
                    <span className="text-xl">{emotion.icon}</span>
                    <span>{emotion.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className={cn(
                "block text-sm font-medium mb-2",
                themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
              )}>
                Notes (Optional)
              </label>
              <Textarea
                rows={4}
                placeholder="Why did you make this trade? What was your reasoning?"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className={cn(
                  "resize-none",
                  themeMode === 'light'
                    ? 'bg-white border-gray-300'
                    : 'bg-gray-800 border-gray-600 text-white'
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleFormSubmit}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3"
              >
                Add Trade
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className={cn(
                  "px-6 py-3",
                  themeMode === 'light'
                    ? 'border-gray-300 text-gray-600 hover:bg-gray-100'
                    : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                )}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
