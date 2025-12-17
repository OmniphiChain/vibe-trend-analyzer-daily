import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, AlertCircle, Clock, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";

interface AdvancedChartsProps {
  className?: string;
}

export const AdvancedCharts: React.FC<AdvancedChartsProps> = ({ className }) => {
  const { themeMode } = useMoodTheme();
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [tradeType, setTradeType] = useState<'long' | 'short'>('long');
  const [entryPrice, setEntryPrice] = useState('67234');
  const [stopLoss, setStopLoss] = useState('65500');
  const [takeProfit, setTakeProfit] = useState('69500');

  const timeframes = ['5m', '30m', '1h', '1d', '1w', '1M', '1y'];
  
  const technicalIndicators = [
    { name: 'MA(50)', value: '566.847', color: 'text-green-400' },
    { name: 'MA(200)', value: '550.324', color: 'text-green-400' },
    { name: 'RSI', value: '65.3 (NORM)', color: 'text-blue-400' },
    { name: 'MACD', value: '+234.5 ▲▲▲', color: 'text-green-400' },
    { name: 'Sentiment', value: '82% 🚀', color: 'text-green-400' }
  ];

  const recentTrades = [
    { price: '67,234', volume: '0.15', time: '14:23:30', type: 'buy' },
    { price: '67,230', volume: '0.08', time: '14:23:29', type: 'sell' },
    { price: '67,235', volume: '0.25', time: '14:23:25', type: 'buy' },
    { price: '67,228', volume: '0.12', time: '14:23:20', type: 'sell' },
    { price: '67,240', volume: '0.18', time: '14:23:15', type: 'buy' },
    { price: '67,225', volume: '0.09', time: '14:23:10', type: 'sell' }
  ];

  const marketDepthData = [
    { price: '67,245', amount: '2.45 BTC', side: 'sell' },
    { price: '67,240', amount: '1.23 BTC', side: 'sell' },
    { price: '67,235', amount: '3.67 BTC', side: 'sell' },
    { price: '67,230', amount: '1.89 BTC', side: 'buy' },
    { price: '67,225', amount: '4.12 BTC', side: 'buy' }
  ];

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden",
      themeMode === 'light'
        ? 'bg-[#F5F7FA]'
        : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
      className
    )}>
      {/* Header */}
      <div className={cn(
        "relative z-40 border-b backdrop-blur-xl",
        themeMode === 'light'
          ? 'bg-white/80 border-gray-200'
          : 'bg-black/40 border-purple-500/20'
      )}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={cn(
                "text-3xl font-bold flex items-center gap-3",
                themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
              )}>
                <BarChart3 className={cn(
                  "w-8 h-8",
                  themeMode === 'light' ? 'text-purple-600' : 'text-purple-400'
                )} />
                Advanced Charts
              </h1>
              <p className={cn(
                "text-sm",
                themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
              )}>
                Interactive trading charts and technical analysis
              </p>
            </div>
            
            {/* BTC/USD Info */}
            <div className={cn(
              "flex items-center gap-6 p-4 rounded-xl border",
              themeMode === 'light'
                ? 'bg-white border-gray-200'
                : 'bg-black/40 border-purple-500/20'
            )}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  ₿
                </div>
                <div>
                  <div className={cn(
                    "font-bold text-lg",
                    themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                  )}>
                    BTC/USD
                  </div>
                  <div className={cn(
                    "text-sm",
                    themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                  )}>
                    $67,234.56
                  </div>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                +2.34% (+$1,567.89)
              </Badge>
            </div>
          </div>

          {/* Timeframe Selection */}
          <div className="flex items-center gap-2">
            {timeframes.map((tf) => (
              <Button
                key={tf}
                variant={selectedTimeframe === tf ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeframe(tf)}
                className={cn(
                  selectedTimeframe === tf && themeMode === 'light' && 'bg-purple-600 hover:bg-purple-700',
                  selectedTimeframe === tf && themeMode !== 'light' && 'bg-purple-500 hover:bg-purple-600'
                )}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Live Technical Analysis */}
          <div className="lg:col-span-3">
            <Card className={cn(
              "border backdrop-blur-xl h-fit",
              themeMode === 'light'
                ? 'bg-white border-gray-200 shadow-lg'
                : 'bg-black/40 border-purple-500/20'
            )}>
              <CardHeader className="pb-3">
                <CardTitle className={cn(
                  "flex items-center gap-2 text-lg",
                  themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                )}>
                  📊 Live Technical Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {technicalIndicators.map((indicator, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className={cn(
                      "text-sm font-medium",
                      themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                    )}>
                      {indicator.name}
                    </span>
                    <span className={cn("text-sm font-bold", indicator.color)}>
                      {indicator.value}
                    </span>
                  </div>
                ))}
                
                <div className={cn(
                  "mt-6 p-4 rounded-lg border",
                  themeMode === 'light'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-green-900/20 border-green-500/30'
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className={cn(
                      "text-sm font-semibold",
                      themeMode === 'light' ? 'text-green-700' : 'text-green-400'
                    )}>
                      AI Forecast
                    </span>
                  </div>
                  <p className={cn(
                    "text-xs",
                    themeMode === 'light' ? 'text-green-600' : 'text-green-300'
                  )}>
                    Bullish momentum with 87% confidence. 
                    Potential breakout to $69,500 within 24h.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Chart Area */}
          <div className="lg:col-span-6">
            <Card className={cn(
              "border backdrop-blur-xl",
              themeMode === 'light'
                ? 'bg-white border-gray-200 shadow-lg'
                : 'bg-black/40 border-purple-500/20'
            )}>
              <CardContent className="p-6">
                {/* Chart Canvas */}
                <div className={cn(
                  "h-96 rounded-lg border-2 border-dashed flex items-center justify-center relative overflow-hidden",
                  themeMode === 'light'
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-black/40'
                )}>
                  {/* Simulated Chart Elements */}
                  <div className="absolute inset-4">
                    {/* Price Line */}
                    <svg className="w-full h-full">
                      <defs>
                        <linearGradient id="priceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                          <stop offset="50%" stopColor="#A855F7" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#C084FC" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 50 200 Q 100 180 150 160 T 250 140 T 350 120 T 450 100"
                        stroke="url(#priceGradient)"
                        strokeWidth="3"
                        fill="none"
                        className="animate-pulse"
                      />
                    </svg>
                    
                    {/* Candlesticks */}
                    <div className="absolute inset-0 flex items-end justify-around">
                      {[80, 65, 90, 70, 85, 60, 95].map((height, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div className={cn(
                            "w-2 rounded-sm mb-1",
                            index % 2 === 0 ? 'bg-green-500' : 'bg-red-500'
                          )} style={{ height: `${height}px` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className={cn(
                    "text-lg font-medium",
                    themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'
                  )}>
                    Interactive Chart View
                  </div>
                </div>

                {/* Volume Chart */}
                <div className="mt-6">
                  <div className={cn(
                    "text-sm font-medium mb-2",
                    themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                  )}>
                    Volume
                  </div>
                  <div className="flex items-end justify-between h-16 gap-1">
                    {[30, 45, 25, 60, 40, 55, 35, 50].map((height, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex-1 rounded-sm transition-all duration-300",
                          index % 2 === 0 
                            ? 'bg-gradient-to-t from-green-400 to-green-300'
                            : 'bg-gradient-to-t from-blue-400 to-blue-300'
                        )}
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  
                  {/* Indicators */}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-green-500" />
                      <span className={cn(
                        "text-xs",
                        themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                      )}>
                        RSI
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-blue-500" />
                      <span className={cn(
                        "text-xs",
                        themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                      )}>
                        MACD
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-orange-500" />
                      <span className={cn(
                        "text-xs",
                        themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                      )}>
                        MA
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-purple-500" />
                      <span className={cn(
                        "text-xs",
                        themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                      )}>
                        BB
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Quick Trade */}
          <div className="lg:col-span-3">
            <Card className={cn(
              "border backdrop-blur-xl h-fit",
              themeMode === 'light'
                ? 'bg-white border-gray-200 shadow-lg'
                : 'bg-black/40 border-purple-500/20'
            )}>
              <CardHeader className="pb-3">
                <CardTitle className={cn(
                  "flex items-center gap-2 text-lg",
                  themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                )}>
                  ⚡ Quick Trade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Trade Type Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={tradeType === 'long' ? 'default' : 'outline'}
                    onClick={() => setTradeType('long')}
                    className={cn(
                      'h-12 font-bold',
                      tradeType === 'long' 
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white'
                    )}
                  >
                    LONG
                  </Button>
                  <Button
                    variant={tradeType === 'short' ? 'default' : 'outline'}
                    onClick={() => setTradeType('short')}
                    className={cn(
                      'h-12 font-bold',
                      tradeType === 'short'
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                    )}
                  >
                    SHORT
                  </Button>
                </div>

                {/* Trade Form */}
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="entry" className={cn(
                      "text-sm",
                      themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                    )}>
                      Entry
                    </Label>
                    <Input
                      id="entry"
                      value={entryPrice}
                      onChange={(e) => setEntryPrice(e.target.value)}
                      className={cn(
                        "font-mono",
                        themeMode === 'light'
                          ? 'bg-white border-gray-300'
                          : 'bg-black/40 border-gray-600 text-white'
                      )}
                    />
                    <div className={cn(
                      "text-xs mt-1",
                      themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                    )}>
                      $67,234
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="stopLoss" className={cn(
                      "text-sm",
                      themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                    )}>
                      Stop Loss
                    </Label>
                    <Input
                      id="stopLoss"
                      value={stopLoss}
                      onChange={(e) => setStopLoss(e.target.value)}
                      className={cn(
                        "font-mono",
                        themeMode === 'light'
                          ? 'bg-white border-gray-300'
                          : 'bg-black/40 border-gray-600 text-white'
                      )}
                    />
                    <div className={cn(
                      "text-xs mt-1",
                      themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                    )}>
                      $65,500
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="takeProfit" className={cn(
                      "text-sm",
                      themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                    )}>
                      Take Profit
                    </Label>
                    <Input
                      id="takeProfit"
                      value={takeProfit}
                      onChange={(e) => setTakeProfit(e.target.value)}
                      className={cn(
                        "font-mono",
                        themeMode === 'light'
                          ? 'bg-white border-gray-300'
                          : 'bg-black/40 border-gray-600 text-white'
                      )}
                    />
                    <div className={cn(
                      "text-xs mt-1",
                      themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                    )}>
                      $69,500
                    </div>
                  </div>
                </div>

                <Button 
                  className={cn(
                    "w-full h-12 font-bold",
                    tradeType === 'long'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  )}
                >
                  {tradeType === 'long' ? 'BUY' : 'SELL'} BTC
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Market Data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Market Depth */}
          <Card className={cn(
            "border backdrop-blur-xl",
            themeMode === 'light'
              ? 'bg-white border-gray-200 shadow-lg'
              : 'bg-black/40 border-purple-500/20'
          )}>
            <CardHeader className="pb-3">
              <CardTitle className={cn(
                "flex items-center gap-2 text-lg",
                themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
              )}>
                📊 Market Depth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn(
                "text-center mb-4 p-3 rounded-lg",
                themeMode === 'light'
                  ? 'bg-gray-100'
                  : 'bg-gray-800/50'
              )}>
                <div className={cn(
                  "text-2xl font-bold",
                  themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                )}>
                  $67,234.56
                </div>
                <div className={cn(
                  "text-sm",
                  themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                )}>
                  Current Price
                </div>
              </div>
              
              <div className="space-y-2">
                <div className={cn(
                  "text-xs font-medium",
                  themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                )}>
                  Order Book
                </div>
                {marketDepthData.map((order, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className={cn(
                      "font-mono",
                      themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                    )}>
                      {order.price}
                    </span>
                    <span className={cn(
                      "text-xs",
                      order.side === 'buy' 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    )}>
                      {order.amount}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Trades */}
          <Card className={cn(
            "border backdrop-blur-xl",
            themeMode === 'light'
              ? 'bg-white border-gray-200 shadow-lg'
              : 'bg-black/40 border-purple-500/20'
          )}>
            <CardHeader className="pb-3">
              <CardTitle className={cn(
                "flex items-center gap-2 text-lg",
                themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
              )}>
                ⚡ Recent Trades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentTrades.map((trade, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        trade.type === 'buy' ? 'bg-green-400' : 'bg-red-400'
                      )} />
                      <span className={cn(
                        "font-mono",
                        themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                      )}>
                        {trade.price}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "text-xs",
                        themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                      )}>
                        {trade.volume}
                      </div>
                      <div className={cn(
                        "text-xs",
                        themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                      )}>
                        {trade.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 24h Statistics */}
          <Card className={cn(
            "border backdrop-blur-xl",
            themeMode === 'light'
              ? 'bg-white border-gray-200 shadow-lg'
              : 'bg-black/40 border-purple-500/20'
          )}>
            <CardHeader className="pb-3">
              <CardTitle className={cn(
                "flex items-center gap-2 text-lg",
                themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
              )}>
                📈 24h Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className={cn(
                  "text-sm",
                  themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                )}>
                  24h High
                </span>
                <span className={cn(
                  "text-sm font-medium text-green-400"
                )}>
                  $67,845.32
                </span>
              </div>
              <div className="flex justify-between">
                <span className={cn(
                  "text-sm",
                  themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                )}>
                  24h Low
                </span>
                <span className={cn(
                  "text-sm font-medium text-red-400"
                )}>
                  $65,234.18
                </span>
              </div>
              <div className="flex justify-between">
                <span className={cn(
                  "text-sm",
                  themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                )}>
                  24h Volume
                </span>
                <span className={cn(
                  "text-sm font-medium",
                  themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                )}>
                  28,456 BTC
                </span>
              </div>
              <div className="flex justify-between">
                <span className={cn(
                  "text-sm",
                  themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                )}>
                  24h Change
                </span>
                <span className="text-sm font-medium text-green-400">
                  +2.34%
                </span>
              </div>
              <div className="flex justify-between">
                <span className={cn(
                  "text-sm",
                  themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                )}>
                  Market Cap
                </span>
                <span className={cn(
                  "text-sm font-medium",
                  themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                )}>
                  $1.31T
                </span>
              </div>
              <div className="flex justify-between">
                <span className={cn(
                  "text-sm",
                  themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                )}>
                  Dominance
                </span>
                <span className={cn(
                  "text-sm font-medium",
                  themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                )}>
                  48.7%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCharts;
