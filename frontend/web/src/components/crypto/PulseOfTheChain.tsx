import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";

interface PulseOfTheChainProps {
  className?: string;
}

export const PulseOfTheChain: React.FC<PulseOfTheChainProps> = ({ className }) => {
  const { themeMode } = useMoodTheme();

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden",
      themeMode === 'light'
        ? 'bg-[#F5F7FA]'
        : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
      className
    )}>
      {/* Ambient Background Effects - Only in Dark Mode */}
      {themeMode !== 'light' && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-violet-500/8 to-indigo-500/8 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header: Pulse of the Chain */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className={cn(
              "w-20 h-20 rounded-xl flex items-center justify-center shadow-lg animate-pulse",
              themeMode === 'light'
                ? 'bg-orange-100 text-orange-600'
                : 'bg-gradient-to-r from-orange-500/20 via-yellow-500/20 to-orange-500/20 shadow-orange-500/20'
            )}>
              <span className="text-4xl">⚡</span>
            </div>
            <div className="text-center">
              <h1 className={cn(
                "text-5xl font-bold mb-2",
                themeMode === 'light'
                  ? 'text-[#1E1E1E]'
                  : 'bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent'
              )}>
                Pulse of the Chain
              </h1>
              <p className={cn(
                "text-lg",
                themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'
              )}>
                Real-time crypto market sentiment & AI insights
              </p>
            </div>
          </div>
        </div>

        {/* Hero: Crypto Mood Score */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="w-80 h-80 rounded-full relative">
              {/* Animated gradient ring */}
              <div className={cn(
                "absolute inset-0 rounded-full p-2",
                themeMode === 'light'
                  ? 'bg-gradient-to-r from-orange-400 via-yellow-400 via-green-400 to-orange-400'
                  : 'bg-gradient-to-r from-orange-500 via-yellow-400 via-green-400 to-orange-500 animate-spin-slow'
              )}>
                <div className={cn(
                  "w-full h-full rounded-full backdrop-blur-sm",
                  themeMode === 'light'
                    ? 'bg-white border-2 border-gray-200'
                    : 'bg-gradient-to-br from-slate-900/90 to-purple-900/90'
                )} />
              </div>

              {/* Fixed content */}
              <div className="absolute inset-2 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-4 animate-bounce">😃</div>
                  <div className={cn(
                    "text-7xl font-bold mb-2",
                    themeMode === 'light'
                      ? 'text-orange-600'
                      : 'bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400 bg-clip-text text-transparent'
                  )}>
                    78
                  </div>
                  <div className={cn(
                    "text-xl font-bold mb-1",
                    themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                  )}>
                    Crypto Mood
                  </div>
                  <div className={cn(
                    "text-sm uppercase tracking-wider",
                    themeMode === 'light' ? 'text-orange-600 font-semibold' : 'text-orange-300'
                  )}>
                    BULLISH SENTIMENT
                  </div>
                </div>
              </div>

              {/* Pulse rings - Only in Dark Mode */}
              {themeMode !== 'light' && (
                <>
                  <div className="absolute inset-0 rounded-full border-2 animate-ping border-orange-400/40" />
                  <div className="absolute inset-2 rounded-full border animate-ping delay-75 border-yellow-400/30" />
                  <div className="absolute inset-4 rounded-full border animate-ping delay-150 border-green-400/20" />
                </>
              )}
            </div>
          </div>

          <p className={cn(
            "text-lg max-w-3xl mx-auto mb-8",
            themeMode === 'light' ? 'text-[#666]' : 'text-gray-200'
          )}>
            AI-powered sentiment analysis combining price momentum (40%), news sentiment (30%), and social buzz (30%)
          </p>

          {/* Mood Source Breakdown */}
          <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { label: 'Price Momentum', value: 82, percentage: '40%', color: 'from-orange-500 to-red-500', icon: '📈' },
              { label: 'News Sentiment', value: 75, percentage: '30%', color: 'from-yellow-500 to-orange-500', icon: '📰' },
              { label: 'Social Buzz', value: 71, percentage: '30%', color: 'from-green-500 to-yellow-500', icon: '💬' }
            ].map((item) => (
              <div key={item.label} className={cn(
                "rounded-2xl p-6 border transition-all duration-300",
                themeMode === 'light'
                  ? 'bg-white border-gray-200 shadow-md hover:shadow-lg hover:-translate-y-1'
                  : 'bg-black/40 backdrop-blur-sm border-orange-500/20 hover:border-orange-400/40'
              )}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className={cn(
                  "text-2xl font-bold mb-2",
                  themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                )}>
                  {item.value}
                </div>
                <div className={cn(
                  "font-medium mb-1",
                  themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'
                )}>
                  {item.label}
                </div>
                <div className={cn(
                  "text-sm mb-3",
                  themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                )}>
                  {item.percentage} weight
                </div>
                <div className={cn(
                  "h-2 rounded-full overflow-hidden",
                  themeMode === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                )}>
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 10 Cryptocurrencies by Market Cap */}
        <Card className={cn(
          "border backdrop-blur-xl",
          themeMode === 'light'
            ? 'bg-white border-gray-200 shadow-lg'
            : 'bg-black/40 border-orange-500/20'
        )}>
          <CardHeader className={cn(
            "border-b",
            themeMode === 'light' ? 'border-gray-200' : 'border-orange-500/20'
          )}>
            <CardTitle className={cn(
              "flex items-center gap-2",
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            )}>
              👑 Top 10 Cryptocurrencies by Market Cap
              <Badge className={cn(
                "ml-auto",
                themeMode === 'light'
                  ? 'bg-blue-100 text-blue-700 border-blue-300'
                  : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
              )}>
                Live Readings
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { rank: 1, symbol: 'BTC', name: 'Bitcoin', icon: '₿', price: '$67,234.56', marketCap: '$1.31T', change: '+2.34%', trend: 'up', bars: [100, 95, 100, 90, 85] },
                { rank: 2, symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', price: '$2,657.89', marketCap: '$319.2B', change: '-1.23%', trend: 'down', bars: [80, 85, 75, 70, 65] },
                { rank: 3, symbol: 'USDT', name: 'Tether USDt', icon: '₮', price: '$1.0001', marketCap: '$118.4B', change: '+0.01%', trend: 'up', bars: [100, 100, 100, 100, 100] },
                { rank: 4, symbol: 'BNB', name: 'BNB', icon: '◉', price: '$312.45', marketCap: '$48.2B', change: '+4.67%', trend: 'up', bars: [60, 70, 80, 85, 90] },
                { rank: 5, symbol: 'SOL', name: 'Solana', icon: '◎', price: '$156.78', marketCap: '$42.1B', change: '+8.45%', trend: 'up', bars: [45, 55, 65, 75, 85] },
                { rank: 6, symbol: 'USDC', name: 'USD Coin', icon: '$', price: '$0.9999', marketCap: '$38.9B', change: '-0.01%', trend: 'down', bars: [99, 100, 99, 100, 99] },
                { rank: 7, symbol: 'XRP', name: 'Ripple', icon: '◉', price: '$0.5234', marketCap: '$29.7B', change: '-2.87%', trend: 'down', bars: [70, 65, 60, 55, 50] },
                { rank: 8, symbol: 'ADA', name: 'Cardano', icon: '♠', price: '$0.5845', marketCap: '$20.6B', change: '+5.21%', trend: 'up', bars: [40, 50, 60, 70, 75] }
              ].map((crypto) => (
                <div key={crypto.symbol} className={cn(
                  "rounded-xl p-4 border transition-all duration-300 group cursor-pointer",
                  themeMode === 'light'
                    ? 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                    : crypto.trend === 'up'
                      ? 'bg-gradient-to-br from-green-900/20 to-black/60 border-green-500/20 hover:border-green-400/40'
                      : 'bg-gradient-to-br from-red-900/20 to-black/60 border-red-500/20 hover:border-red-400/40'
                )}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold",
                        themeMode === 'light'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-blue-500/20 text-blue-400'
                      )}>
                        #{crypto.rank}
                      </div>
                      <span className="text-2xl">{crypto.icon}</span>
                      <div>
                        <div className={cn(
                          "text-lg font-bold",
                          themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                        )}>
                          {crypto.symbol}
                        </div>
                        <div className={cn(
                          "text-sm",
                          themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                        )}>
                          {crypto.name}
                        </div>
                      </div>
                    </div>
                    <Badge className={cn(
                      crypto.trend === 'up'
                        ? (themeMode === 'light'
                            ? 'bg-green-100 text-green-700 border-green-300'
                            : 'bg-green-500/20 text-green-400 border-green-500/30')
                        : (themeMode === 'light'
                            ? 'bg-red-100 text-red-700 border-red-300'
                            : 'bg-red-500/20 text-red-400 border-red-500/30')
                    )}>
                      {crypto.change}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={cn(
                          "text-xs uppercase tracking-wider mb-1",
                          themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                        )}>
                          Price
                        </div>
                        <div className={cn(
                          "text-xl font-bold",
                          themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                        )}>
                          {crypto.price}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={cn(
                          "text-xs uppercase tracking-wider mb-1",
                          themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                        )}>
                          Market Cap
                        </div>
                        <div className={cn(
                          "text-lg font-bold",
                          themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                        )}>
                          {crypto.marketCap}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className={cn(
                        "text-xs uppercase tracking-wider mb-2",
                        themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                      )}>
                        24h Trend
                      </div>
                      <div className="flex items-end justify-between h-8 gap-1">
                        {crypto.bars.map((height, index) => (
                          <div
                            key={index}
                            className={cn(
                              "flex-1 rounded-sm transition-all duration-500",
                              crypto.trend === 'up'
                                ? 'bg-gradient-to-t from-green-400 to-green-300'
                                : 'bg-gradient-to-t from-red-400 to-red-300'
                            )}
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI-Tagged Crypto News */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className={cn(
              "border backdrop-blur-xl",
              themeMode === 'light'
                ? 'bg-white border-gray-200 shadow-lg'
                : 'bg-black/40 border-orange-500/20'
            )}>
              <CardHeader className={cn(
                "border-b",
                themeMode === 'light' ? 'border-gray-200' : 'border-orange-500/20'
              )}>
                <CardTitle className={cn(
                  "flex items-center gap-2",
                  themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                )}>
                  📰 AI-Tagged Crypto News
                  <div className="flex gap-2 ml-auto">
                    <Badge className={cn(
                      themeMode === 'light'
                        ? 'bg-purple-100 text-purple-700 border-purple-300'
                        : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                    )}>
                      DeFi
                    </Badge>
                    <Badge className={cn(
                      themeMode === 'light'
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    )}>
                      24h
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    {
                      title: "Bitcoin ETFs see record $2.1B inflows as institutional adoption accelerates",
                      description: "Major financial institutions are driving unprecedented capital flows into Bitcoin ETFs, signaling broader institutional acceptance of cryptocurrency as a legitimate asset class.",
                      tags: ['Bullish', 'ETF', 'Institutional'],
                      sentiment: 'bullish',
                      source: 'CoinDesk',
                      time: '1h ago'
                    },
                    {
                      title: "Ethereum staking yields hit 5.2% as network upgrades boost validator rewards",
                      description: "Recent protocol improvements have enhanced staking efficiency, making Ethereum more attractive to both retail and institutional stakers seeking passive income.",
                      tags: ['Bullish', 'Staking', 'DeFi'],
                      sentiment: 'bullish',
                      source: 'CryptoNews',
                      time: '3h ago'
                    },
                    {
                      title: "SEC Chairman signals stricter crypto regulations ahead of 2024 elections",
                      description: "Regulatory uncertainty continues to weigh on altcoin markets as the SEC prepares more comprehensive crypto oversight frameworks.",
                      tags: ['Bearish', 'Regulation', 'SEC', 'Politics'],
                      sentiment: 'bearish',
                      source: 'Bloomberg Crypto',
                      time: '5h ago'
                    }
                  ].map((news, index) => (
                    <div key={index} className={cn(
                      "rounded-xl p-4 border transition-all duration-300 cursor-pointer group",
                      themeMode === 'light'
                        ? 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                        : 'bg-gradient-to-br from-black/60 to-purple-900/20 border-purple-500/20 hover:border-purple-400/40'
                    )}>
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                          news.sentiment === 'bullish'
                            ? (themeMode === 'light'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-green-500/20 text-green-400')
                            : (themeMode === 'light'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-red-500/20 text-red-400')
                        )}>
                          {news.sentiment === 'bullish' ? '📈' : '📉'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className={cn(
                              "text-lg font-bold leading-tight",
                              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                            )}>
                              {news.title}
                            </h3>
                            <div className="flex gap-1 ml-2">
                              {news.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} className={cn(
                                  "text-xs",
                                  tag === 'Bullish'
                                    ? (themeMode === 'light'
                                        ? 'bg-green-100 text-green-700 border-green-300'
                                        : 'bg-green-500/20 text-green-400 border-green-500/30')
                                    : tag === 'Bearish'
                                    ? (themeMode === 'light'
                                        ? 'bg-red-100 text-red-700 border-red-300'
                                        : 'bg-red-500/20 text-red-400 border-red-500/30')
                                    : (themeMode === 'light'
                                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30')
                                )}>
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <p className={cn(
                            "text-sm mb-3 leading-relaxed",
                            themeMode === 'light' ? 'text-[#666]' : 'text-gray-300'
                          )}>
                            {news.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className={cn(
                              "text-xs",
                              themeMode === 'light' ? 'text-[#888]' : 'text-gray-400'
                            )}>
                              {news.source} • {news.time}
                            </div>
                            <div className="flex gap-1">
                              {news.tags.slice(2).map((tag) => (
                                <Badge key={tag} variant="outline" className={cn(
                                  "text-xs",
                                  themeMode === 'light'
                                    ? 'border-gray-300 text-gray-600'
                                    : 'border-gray-600 text-gray-400'
                                )}>
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social Buzz & Trends + Your Crypto Watchlist */}
          <div className="space-y-6">
            {/* Social Buzz & Trends */}
            <Card className={cn(
              "border backdrop-blur-xl",
              themeMode === 'light'
                ? 'bg-white border-gray-200 shadow-lg'
                : 'bg-black/40 border-orange-500/20'
            )}>
              <CardHeader className={cn(
                "border-b pb-3",
                themeMode === 'light' ? 'border-gray-200' : 'border-orange-500/20'
              )}>
                <CardTitle className={cn(
                  "flex items-center gap-2 text-base",
                  themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                )}>
                  🌊 Social Buzz & Trends
                </CardTitle>
                <p className={cn(
                  "text-sm",
                  themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                )}>
                  Trending on X/Reddit (Last 1h)
                </p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {[
                    { hashtag: '#BitcoinETF', mentions: '+240%', sentiment: 'positive' },
                    { hashtag: '#ETH2024', mentions: '+156%', sentiment: 'positive' },
                    { hashtag: '#CryptoRegulation', mentions: '+89%', sentiment: 'negative' },
                    { hashtag: '#DeFiSummer', mentions: '+67%', sentiment: 'positive' }
                  ].map((trend) => (
                    <div key={trend.hashtag} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          trend.sentiment === 'positive' ? 'bg-green-400' : 'bg-red-400'
                        )} />
                        <span className={cn(
                          "text-sm font-medium",
                          themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                        )}>
                          {trend.hashtag}
                        </span>
                      </div>
                      <Badge className={cn(
                        "text-xs",
                        trend.sentiment === 'positive'
                          ? (themeMode === 'light'
                              ? 'bg-green-100 text-green-700 border-green-300'
                              : 'bg-green-500/20 text-green-400 border-green-500/30')
                          : (themeMode === 'light'
                              ? 'bg-red-100 text-red-700 border-red-300'
                              : 'bg-red-500/20 text-red-400 border-red-500/30')
                      )}>
                        {trend.mentions}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className={cn(
                  "mt-4 p-3 rounded-lg",
                  themeMode === 'light'
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-blue-900/20 border border-blue-500/30'
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🐋</span>
                    <span className={cn(
                      "text-sm font-semibold",
                      themeMode === 'light' ? 'text-blue-700' : 'text-blue-400'
                    )}>
                      Whale Alert
                    </span>
                  </div>
                  <p className={cn(
                    "text-xs",
                    themeMode === 'light' ? 'text-blue-600' : 'text-blue-300'
                  )}>
                    Large BTC transfer detected: 1,247 BTC ($84.3M) moved to unknown wallet. Market sentiment: Neutral
                  </p>
                  <p className={cn(
                    "text-xs mt-1",
                    themeMode === 'light' ? 'text-blue-500' : 'text-blue-400'
                  )}>
                    2 minutes ago
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Your Crypto Watchlist */}
            <Card className={cn(
              "border backdrop-blur-xl",
              themeMode === 'light'
                ? 'bg-white border-gray-200 shadow-lg'
                : 'bg-black/40 border-orange-500/20'
            )}>
              <CardHeader className={cn(
                "border-b pb-3",
                themeMode === 'light' ? 'border-gray-200' : 'border-orange-500/20'
              )}>
                <CardTitle className={cn(
                  "flex items-center gap-2 text-base",
                  themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                )}>
                  ⭐ Your Crypto Watchlist
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {[
                    { symbol: 'BTC', price: '$67,234', change: '+2.34%', sentiment: 'positive' },
                    { symbol: 'ETH', price: '$2,657', change: '-1.23%', sentiment: 'negative' },
                    { symbol: 'SOL', price: '$156.78', change: '+8.45%', sentiment: 'positive' }
                  ].map((crypto) => (
                    <div key={crypto.symbol} className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      themeMode === 'light'
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-black/40 border-gray-700'
                    )}>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          crypto.sentiment === 'positive' ? 'bg-green-400' : 'bg-red-400'
                        )} />
                        <span className={cn(
                          "font-medium",
                          themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                        )}>
                          {crypto.symbol}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={cn(
                          "text-sm font-semibold",
                          themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                        )}>
                          {crypto.price}
                        </div>
                        <div className={cn(
                          "text-xs",
                          crypto.sentiment === 'positive'
                            ? (themeMode === 'light' ? 'text-green-600' : 'text-green-400')
                            : (themeMode === 'light' ? 'text-red-600' : 'text-red-400')
                        )}>
                          {crypto.change} 24h
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Market Insight */}
        <Card className={cn(
          "border backdrop-blur-xl",
          themeMode === 'light'
            ? 'bg-white border-gray-200 shadow-lg'
            : 'bg-black/40 border-orange-500/20'
        )}>
          <CardHeader className={cn(
            "border-b",
            themeMode === 'light' ? 'border-gray-200' : 'border-orange-500/20'
          )}>
            <CardTitle className={cn(
              "flex items-center gap-2",
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            )}>
              🧠 AI Market Insight
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pattern Detection */}
              <div className={cn(
                "rounded-xl p-6 border",
                themeMode === 'light'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gradient-to-br from-blue-900/40 to-black/60 border-blue-500/30'
              )}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">💡</span>
                  <h3 className={cn(
                    "text-lg font-bold",
                    themeMode === 'light' ? 'text-blue-700' : 'text-blue-300'
                  )}>
                    Pattern Detection
                  </h3>
                </div>
                <p className={cn(
                  "text-sm mb-4 leading-relaxed",
                  themeMode === 'light' ? 'text-blue-600' : 'text-blue-200'
                )}>
                  Bitcoin is showing unusual bullish sentiment (95%) while price remains consolidating. This divergence often precedes significant breakouts.
                </p>
                <Badge className={cn(
                  themeMode === 'light'
                    ? 'bg-green-100 text-green-700 border-green-300'
                    : 'bg-green-500/20 text-green-400 border-green-500/30'
                )}>
                  Confidence: 87%
                </Badge>
              </div>

              {/* Whale Activity */}
              <div className={cn(
                "rounded-xl p-6 border",
                themeMode === 'light'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-gradient-to-br from-amber-900/40 to-black/60 border-amber-500/30'
              )}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🐋</span>
                  <h3 className={cn(
                    "text-lg font-bold",
                    themeMode === 'light' ? 'text-amber-700' : 'text-amber-300'
                  )}>
                    Whale Activity
                  </h3>
                </div>
                <p className={cn(
                  "text-sm mb-4 leading-relaxed",
                  themeMode === 'light' ? 'text-amber-600' : 'text-amber-200'
                )}>
                  Large Ethereum accumulation detected from institutional wallets. Staking activity up 23% this week.
                </p>
                <Badge className={cn(
                  themeMode === 'light'
                    ? 'bg-orange-100 text-orange-700 border-orange-300'
                    : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                )}>
                  Alert: High Volume
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Movers Section */}
        <Card className={cn(
          "border backdrop-blur-xl",
          themeMode === 'light'
            ? 'bg-white border-gray-200 shadow-lg'
            : 'bg-black/40 border-orange-500/20'
        )}>
          <CardHeader className={cn(
            "border-b",
            themeMode === 'light' ? 'border-gray-200' : 'border-orange-500/20'
          )}>
            <CardTitle className={cn(
              "flex items-center gap-2",
              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
            )}>
              <TrendingUp className={cn(
                "w-6 h-6",
                themeMode === 'light' ? 'text-orange-600' : 'text-orange-400'
              )} />
              Top Movers & Sentiment Leaders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="bullish" className="w-full">
              <TabsList className={cn(
                "grid w-full grid-cols-4 border",
                themeMode === 'light'
                  ? 'bg-gray-100 border-gray-200'
                  : 'bg-black/20 backdrop-blur-xl border-gray-700/50'
              )}>
                <TabsTrigger value="bullish" className={cn(
                  themeMode === 'light'
                    ? 'data-[state=active]:bg-green-100 data-[state=active]:text-green-700 text-gray-600'
                    : 'data-[state=active]:bg-green-600/30 data-[state=active]:text-green-300 text-gray-400'
                )}>
                  🟢 Top Bullish
                </TabsTrigger>
                <TabsTrigger value="bearish" className={cn(
                  themeMode === 'light'
                    ? 'data-[state=active]:bg-red-100 data-[state=active]:text-red-700 text-gray-600'
                    : 'data-[state=active]:bg-red-600/30 data-[state=active]:text-red-300 text-gray-400'
                )}>
                  🔴 Top Bearish
                </TabsTrigger>
                <TabsTrigger value="gainers" className={cn(
                  themeMode === 'light'
                    ? 'data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 text-gray-600'
                    : 'data-[state=active]:bg-emerald-600/30 data-[state=active]:text-emerald-300 text-gray-400'
                )}>
                  📈 Biggest Gainers
                </TabsTrigger>
                <TabsTrigger value="losers" className={cn(
                  themeMode === 'light'
                    ? 'data-[state=active]:bg-rose-100 data-[state=active]:text-rose-700 text-gray-600'
                    : 'data-[state=active]:bg-rose-600/30 data-[state=active]:text-rose-300 text-gray-400'
                )}>
                  📉 Biggest Losers
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bullish" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { symbol: 'BTC', name: 'Bitcoin', price: '$67,234', change: '+2.34%', sentiment: 95, mentions: '12.4K', icon: '₿' },
                    { symbol: 'SOL', name: 'Solana', price: '$156.78', change: '+8.45%', sentiment: 89, mentions: '8.2K', icon: '◎' },
                    { symbol: 'ADA', name: 'Cardano', price: '$0.58', change: '+5.21%', sentiment: 84, mentions: '5.1K', icon: '♠' }
                  ].map((token) => (
                    <div key={token.symbol} className={cn(
                      "rounded-xl p-4 border transition-all duration-300 group cursor-pointer",
                      themeMode === 'light'
                        ? 'bg-green-50 border-green-200 hover:border-green-300 hover:shadow-md'
                        : 'bg-gradient-to-br from-black/60 to-green-900/20 border-green-500/20 hover:border-green-400/40'
                    )}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{token.icon}</span>
                          <div>
                            <div className={cn(
                              "text-lg font-bold",
                              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                            )}>
                              {token.symbol}
                            </div>
                            <div className={cn(
                              "text-sm",
                              themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                            )}>
                              {token.name}
                            </div>
                          </div>
                        </div>
                        <Badge className={cn(
                          themeMode === 'light'
                            ? 'bg-green-100 text-green-700 border-green-300'
                            : 'bg-green-500/20 text-green-400 border-green-500/30'
                        )}>
                          {token.sentiment.toFixed(2)}% 😃
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-xl font-bold",
                            themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                          )}>
                            {token.price}
                          </span>
                          <span className={cn(
                            "font-medium flex items-center gap-1",
                            themeMode === 'light' ? 'text-green-600' : 'text-green-400'
                          )}>
                            <ArrowUp className="w-4 h-4" />
                            {token.change}
                          </span>
                        </div>
                        <div className={cn(
                          "h-2 rounded-full overflow-hidden",
                          themeMode === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                        )}>
                          <div className="h-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-1000" style={{ width: `${token.sentiment}%` }} />
                        </div>
                        <div className={cn(
                          "text-xs text-center",
                          themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                        )}>
                          {token.mentions} mentions
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="bearish" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { symbol: 'DOGE', name: 'Dogecoin', price: '$0.08', change: '-4.12%', sentiment: 25, mentions: '15.7K', icon: 'Ð' },
                    { symbol: 'XRP', name: 'Ripple', price: '$0.52', change: '-2.87%', sentiment: 31, mentions: '9.3K', icon: '◉' },
                    { symbol: 'DOT', name: 'Polkadot', price: '$7.42', change: '-1.95%', sentiment: 38, mentions: '4.8K', icon: '●' }
                  ].map((token) => (
                    <div key={token.symbol} className={cn(
                      "rounded-xl p-4 border transition-all duration-300 group cursor-pointer",
                      themeMode === 'light'
                        ? 'bg-red-50 border-red-200 hover:border-red-300 hover:shadow-md'
                        : 'bg-gradient-to-br from-black/60 to-red-900/20 border-red-500/20 hover:border-red-400/40'
                    )}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{token.icon}</span>
                          <div>
                            <div className={cn(
                              "text-lg font-bold",
                              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                            )}>
                              {token.symbol}
                            </div>
                            <div className={cn(
                              "text-sm",
                              themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                            )}>
                              {token.name}
                            </div>
                          </div>
                        </div>
                        <Badge className={cn(
                          themeMode === 'light'
                            ? 'bg-red-100 text-red-700 border-red-300'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        )}>
                          {token.sentiment.toFixed(2)}% 😡
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-xl font-bold",
                            themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                          )}>
                            {token.price}
                          </span>
                          <span className={cn(
                            "font-medium flex items-center gap-1",
                            themeMode === 'light' ? 'text-red-600' : 'text-red-400'
                          )}>
                            <ArrowDown className="w-4 h-4" />
                            {token.change}
                          </span>
                        </div>
                        <div className={cn(
                          "h-2 rounded-full overflow-hidden",
                          themeMode === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                        )}>
                          <div className="h-full bg-gradient-to-r from-red-400 to-rose-400 transition-all duration-1000" style={{ width: `${token.sentiment}%` }} />
                        </div>
                        <div className={cn(
                          "text-xs text-center",
                          themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                        )}>
                          {token.mentions} mentions
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="gainers" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { symbol: 'MATIC', name: 'Polygon', price: '$0.89', change: '+15.67%', sentiment: 72, mentions: '6.2K', icon: '⬟' },
                    { symbol: 'AVAX', name: 'Avalanche', price: '$38.45', change: '+12.34%', sentiment: 68, mentions: '4.9K', icon: '🔺' },
                    { symbol: 'ATOM', name: 'Cosmos', price: '$12.67', change: '+9.87%', sentiment: 65, mentions: '3.1K', icon: '⚛' }
                  ].map((token) => (
                    <div key={token.symbol} className={cn(
                      "rounded-xl p-4 border transition-all duration-300 group cursor-pointer",
                      themeMode === 'light'
                        ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-300 hover:shadow-md'
                        : 'bg-gradient-to-br from-black/60 to-emerald-900/20 border-emerald-500/20 hover:border-emerald-400/40'
                    )}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{token.icon}</span>
                          <div>
                            <div className={cn(
                              "text-lg font-bold",
                              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                            )}>
                              {token.symbol}
                            </div>
                            <div className={cn(
                              "text-sm",
                              themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                            )}>
                              {token.name}
                            </div>
                          </div>
                        </div>
                        <Badge className={cn(
                          themeMode === 'light'
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        )}>
                          📈 {token.change}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-xl font-bold",
                            themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                          )}>
                            {token.price}
                          </span>
                          <span className={cn(
                            "font-medium",
                            themeMode === 'light' ? 'text-emerald-600' : 'text-emerald-400'
                          )}>
                            Sentiment: {token.sentiment.toFixed(2)}%
                          </span>
                        </div>
                        <div className={cn(
                          "h-2 rounded-full overflow-hidden",
                          themeMode === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                        )}>
                          <div className="h-full bg-gradient-to-r from-emerald-400 to-green-400 transition-all duration-1000" style={{ width: `${token.sentiment}%` }} />
                        </div>
                        <div className={cn(
                          "text-xs text-center",
                          themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                        )}>
                          {token.mentions} mentions
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="losers" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { symbol: 'LTC', name: 'Litecoin', price: '$73.21', change: '-8.45%', sentiment: 42, mentions: '2.8K', icon: 'Ł' },
                    { symbol: 'BCH', name: 'Bitcoin Cash', price: '$145.67', change: '-6.32%', sentiment: 38, mentions: '1.9K', icon: '🅱' },
                    { symbol: 'ETC', name: 'Ethereum Classic', price: '$26.78', change: '-5.21%', sentiment: 35, mentions: '1.2K', icon: 'Ξ' }
                  ].map((token) => (
                    <div key={token.symbol} className={cn(
                      "rounded-xl p-4 border transition-all duration-300 group cursor-pointer",
                      themeMode === 'light'
                        ? 'bg-rose-50 border-rose-200 hover:border-rose-300 hover:shadow-md'
                        : 'bg-gradient-to-br from-black/60 to-rose-900/20 border-rose-500/20 hover:border-rose-400/40'
                    )}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{token.icon}</span>
                          <div>
                            <div className={cn(
                              "text-lg font-bold",
                              themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                            )}>
                              {token.symbol}
                            </div>
                            <div className={cn(
                              "text-sm",
                              themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                            )}>
                              {token.name}
                            </div>
                          </div>
                        </div>
                        <Badge className={cn(
                          themeMode === 'light'
                            ? 'bg-rose-100 text-rose-700 border-rose-300'
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        )}>
                          📉 {token.change}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-xl font-bold",
                            themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                          )}>
                            {token.price}
                          </span>
                          <span className={cn(
                            "font-medium",
                            themeMode === 'light' ? 'text-rose-600' : 'text-rose-400'
                          )}>
                            Sentiment: {token.sentiment.toFixed(2)}%
                          </span>
                        </div>
                        <div className={cn(
                          "h-2 rounded-full overflow-hidden",
                          themeMode === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                        )}>
                          <div className="h-full bg-gradient-to-r from-rose-400 to-red-400 transition-all duration-1000" style={{ width: `${token.sentiment}%` }} />
                        </div>
                        <div className={cn(
                          "text-xs text-center",
                          themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                        )}>
                          {token.mentions} mentions
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PulseOfTheChain;
