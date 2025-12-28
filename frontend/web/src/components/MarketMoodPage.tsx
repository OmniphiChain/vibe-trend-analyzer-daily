import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Hash, 
  Settings, 
  BarChart3,
  RefreshCw,
  Info,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useMoodTheme } from '../contexts/MoodThemeContext';

// Import our new Market Mood components
import { FinanceMoodGauge } from './builder/FinanceMoodGauge';
import { MarketDrivers } from './builder/MarketDrivers';
import { FinanceMoodChart } from './builder/FinanceMoodChart';
import { FinanceNewsFeed } from './builder/FinanceNewsFeed';
import { SocialBuzzHeatmap } from './builder/SocialBuzzHeatmap';

import { MarketMoodControls } from './builder/MarketMoodControls';
import { AIMoodBreakdownPanel } from './mood/AIMoodBreakdownPanel';
import { SentimentAnalyticsDashboard } from './mood/SentimentAnalyticsDashboard';
import { AISentimentEngine } from './mood/AISentimentEngine';
import { PollWidget } from './PollWidget';

interface MarketMoodPageProps {
  title?: string;
  subtitle?: string;
}

export const MarketMoodPage: React.FC<MarketMoodPageProps> = ({
  title = "Market Mood Dashboard",
  subtitle = "Real-time sentiment analysis powered by AI across stocks, news, and social media"
}) => {
  const { moodScore, themeMode, cardBackground, borderColor } = useMoodTheme();
  const [activeTimeframe, setActiveTimeframe] = useState<'1D' | '7D' | '30D' | '1Y'>('7D');
  const [activeSources, setActiveSources] = useState<string[]>(['stocks', 'news', 'social']);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExplainingMood, setIsExplainingMood] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isMoodBreakdownOpen, setIsMoodBreakdownOpen] = useState(false);
  const [isAnalyticsDashboardOpen, setIsAnalyticsDashboardOpen] = useState(false);

  // Auto-refresh timestamp
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDateRangeChange = (range: string) => {
    setActiveTimeframe(range as typeof activeTimeframe);
  };

  const handleSourceToggle = (sources: string[]) => {
    setActiveSources(sources);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleExplainMood = () => {
    setIsMoodBreakdownOpen(true);
  };

  const handleViewAnalytics = () => {
    setIsAnalyticsDashboardOpen(true);
  };

  const handleDriverClick = (driverId: string, category: string) => {
    // Open the AI Mood Breakdown panel for detailed analysis
    setIsMoodBreakdownOpen(true);
    // You can add additional logic here to focus on specific driver analysis
    console.log(`Driver clicked: ${driverId} (${category})`);
  };

  const getMoodSentiment = (score: number): 'positive' | 'neutral' | 'negative' => {
    if (score >= 70) return 'positive';
    if (score >= 40) return 'neutral';
    return 'negative';
  };

  const getSentimentEmoji = (sentiment: 'positive' | 'neutral' | 'negative'): string => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'neutral': return '😐';
      case 'negative': return '😢';
    }
  };

  const getSentimentGradient = (sentiment: 'positive' | 'neutral' | 'negative'): string => {
    switch (sentiment) {
      case 'positive': return 'from-emerald-500 via-green-400 via-cyan-400 to-emerald-500';
      case 'neutral': return 'from-gray-400 via-slate-300 via-purple-300 to-gray-400';
      case 'negative': return 'from-red-500 via-rose-400 via-purple-500 to-red-500';
    }
  };

  const currentSentiment = getMoodSentiment(moodScore?.overall || 72);

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      themeMode === 'light'
        ? 'bg-background'
        : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
    }`}>
      {/* Ambient Background Effects - Only in Dark Mode */}
      {themeMode !== 'light' && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-violet-500/8 to-indigo-500/8 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${
            themeMode === 'light'
              ? 'text-[#1E1E1E]'
              : 'bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent'
          }`}>
            {title}
          </h1>
          <p className={`text-xl max-w-3xl mx-auto mb-8 ${
            themeMode === 'light' ? 'text-[#555] font-normal' : 'text-gray-200'
          }`}>
            {subtitle}
          </p>
          
          {/* Status Bar */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Badge className={themeMode === 'light'
              ? 'bg-[#E8F5E9] text-[#4CAF50] border-[#4CAF50]/30 rounded-full px-3 py-1'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }>
              <Zap className="w-3 h-3 mr-1" />
              Real-time Data
            </Badge>
            <Badge className={themeMode === 'light'
              ? 'bg-[#E8EAF6] text-[#3F51B5] border-[#3F51B5]/30 rounded-full px-3 py-1'
              : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            }>
              <Brain className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
            <Badge className={themeMode === 'light'
              ? 'bg-[#F3E5F5] text-[#9C27B0] border-[#9C27B0]/30 rounded-full px-3 py-1'
              : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
            }>
              <RefreshCw className="w-3 h-3 mr-1" />
              Updated {lastUpdated.toLocaleTimeString()}
            </Badge>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column - Mood Score Hero */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <FinanceMoodGauge
                title="Current Market Mood"
                subtitle="Multi-source sentiment analysis"
                showBreakdown={true}
                size="large"
              />

              {/* Market Drivers */}
              <MarketDrivers
                onDriverClick={handleDriverClick}
                className="mt-6"
              />

              {/* Quick Stats */}
              <Card className={themeMode === 'light'
                ? 'bg-white border-[#E0E0E0] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200'
                : 'bg-black/40 border-purple-500/20 backdrop-blur-xl'
              }>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">{getSentimentEmoji(currentSentiment)}</div>
                  <div className={`text-lg font-bold mb-1 ${
                    themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                  }`}>
                    {currentSentiment === 'positive' ? 'Bullish Market' :
                     currentSentiment === 'negative' ? 'Bearish Market' : 'Neutral Market'}
                  </div>
                  <div className={`text-sm ${
                    themeMode === 'light' ? 'text-[#666]' : 'text-slate-400'
                  }`}>
                    {activeSources.length}/3 data sources active
                  </div>
                </CardContent>
              </Card>

              {/* Market Drivers (Top 3) - Compact Version */}
              <Card className={cn(
                "relative overflow-hidden transition-all duration-200 hover:scale-[1.02] rounded-2xl mt-4",
                themeMode === 'light'
                  ? 'bg-white border-[#E0E0E0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]'
                  : 'bg-[#111827] border-slate-700/50 hover:shadow-lg hover:shadow-purple-500/20'
              )}>

                {/* Rainbow accent border at top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />

                <CardHeader className={cn(
                  "pb-3",
                  themeMode === 'light' ? 'border-b border-gray-100' : 'border-b border-slate-700/50'
                )}>
                  <CardTitle className={cn(
                    "text-lg font-bold flex items-center gap-2",
                    themeMode === 'light' ? 'text-slate-900' : 'text-white'
                  )}>
                    🎯 Market Drivers (Top 3)
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 pt-0 space-y-3">
                  {/* Driver 1 */}
                  <div
                    onClick={() => {
                      const aiEngine = document.getElementById('ai-sentiment-engine');
                      if (aiEngine) {
                        aiEngine.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                      "hover:scale-[1.02] group",
                      themeMode === 'light'
                        ? 'hover:bg-gray-50 hover:shadow-sm'
                        : 'hover:bg-slate-800/50 hover:border hover:border-purple-500/20'
                    )}
                    aria-label="Driver 1: Tech earnings up 8 percent"
                  >
                    <div className="text-xl flex-shrink-0 animate-pulse">📈</div>
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "text-sm font-medium truncate group-hover:underline decoration-2 underline-offset-2",
                        themeMode === 'light' ? 'text-slate-700' : 'text-slate-200'
                      )}>
                        Tech earnings +8%
                      </div>
                      <div className={cn(
                        "text-xs mt-1",
                        themeMode === 'light' ? 'text-green-600' : 'text-green-400'
                      )}>
                        High Impact
                      </div>
                    </div>
                    <div className={cn(
                      "w-2 h-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100",
                      themeMode === 'light' ? 'bg-blue-500' : 'bg-purple-400'
                    )} />
                  </div>

                  {/* Driver 2 */}
                  <div
                    onClick={() => {
                      const aiEngine = document.getElementById('ai-sentiment-engine');
                      if (aiEngine) {
                        aiEngine.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                      "hover:scale-[1.02] group",
                      themeMode === 'light'
                        ? 'hover:bg-gray-50 hover:shadow-sm'
                        : 'hover:bg-slate-800/50 hover:border hover:border-purple-500/20'
                    )}
                    aria-label="Driver 2: Fed signals no rate hike"
                  >
                    <div className="text-xl flex-shrink-0 animate-pulse">📰</div>
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "text-sm font-medium truncate group-hover:underline decoration-2 underline-offset-2",
                        themeMode === 'light' ? 'text-slate-700' : 'text-slate-200'
                      )}>
                        Fed signals no hike
                      </div>
                      <div className={cn(
                        "text-xs mt-1",
                        themeMode === 'light' ? 'text-green-600' : 'text-green-400'
                      )}>
                        High Impact
                      </div>
                    </div>
                    <div className={cn(
                      "w-2 h-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100",
                      themeMode === 'light' ? 'bg-blue-500' : 'bg-purple-400'
                    )} />
                  </div>

                  {/* Driver 3 */}
                  <div
                    onClick={() => {
                      const aiEngine = document.getElementById('ai-sentiment-engine');
                      if (aiEngine) {
                        aiEngine.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                      "hover:scale-[1.02] group",
                      themeMode === 'light'
                        ? 'hover:bg-gray-50 hover:shadow-sm'
                        : 'hover:bg-slate-800/50 hover:border hover:border-purple-500/20'
                    )}
                    aria-label="Driver 3: Retail investor activity surge"
                  >
                    <div className="text-xl flex-shrink-0 animate-pulse">👥</div>
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "text-sm font-medium truncate group-hover:underline decoration-2 underline-offset-2",
                        themeMode === 'light' ? 'text-slate-700' : 'text-slate-200'
                      )}>
                        Retail investor activity surge
                      </div>
                      <div className={cn(
                        "text-xs mt-1",
                        themeMode === 'light' ? 'text-yellow-600' : 'text-yellow-400'
                      )}>
                        Medium Impact
                      </div>
                    </div>
                    <div className={cn(
                      "w-2 h-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100",
                      themeMode === 'light' ? 'bg-blue-500' : 'bg-purple-400'
                    )} />
                  </div>

                  {/* Footer link */}
                  <div className={cn(
                    "text-xs text-center pt-2 border-t",
                    themeMode === 'light'
                      ? 'text-gray-500 border-gray-100'
                      : 'text-slate-400 border-slate-700'
                  )}>
                    <button
                      onClick={() => {
                        const aiEngine = document.getElementById('ai-sentiment-engine');
                        if (aiEngine) {
                          aiEngine.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className={cn(
                        "hover:underline cursor-pointer transition-colors",
                        themeMode === 'light' ? 'hover:text-blue-600' : 'hover:text-purple-400'
                      )}
                    >
                      View full breakdown →
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Controls Section */}
            <MarketMoodControls
              title="Analysis Controls"
              showFilters={true}
              onSourceToggle={handleSourceToggle}
              onSearch={handleSearch}
              onExplainMood={handleExplainMood}
              onViewAnalytics={handleViewAnalytics}
            />

            {/* AI Sentiment Engine - Unified Module */}
            <div id="ai-sentiment-engine">
              <AISentimentEngine
                moodScore={moodScore || { overall: 72, stocks: 68, news: 75, social: 74 }}
                className="w-full"
              />
            </div>

            {/* Community Sentiment Polls Section */}
            <Card className={themeMode === 'light'
              ? 'bg-white border-[#E0E0E0] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
              : 'bg-black/40 border-purple-500/20 backdrop-blur-xl'
            }>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${
                  themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                }`}>
                  <Hash className="w-5 h-5 text-purple-400" />
                  Live Community Polls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <PollWidget ticker="AAPL" variant="compact" showAI={true} />
                  <PollWidget ticker="TSLA" variant="compact" showAI={true} />
                  <PollWidget ticker="NVDA" variant="compact" showAI={true} />
                  <PollWidget ticker="BTC" variant="compact" showAI={true} />
                  <PollWidget ticker="ETH" variant="compact" showAI={true} />
                  <PollWidget ticker="MSFT" variant="compact" showAI={true} />
                </div>
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // This would be handled by parent component navigation
                      console.log('Navigate to full sentiment polls page');
                    }}
                    className={themeMode === 'light'
                      ? 'border-[#3F51B5] text-[#3F51B5] hover:bg-[#3F51B5]/10'
                      : 'border-purple-500 text-purple-400 hover:bg-purple-500/20'
                    }
                  >
                    View All Polls
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mood Trend Chart */}
            <FinanceMoodChart
              title="Mood Trend Over Time"
              timeframe={activeTimeframe}
              height={300}
              showControls={true}
              showLegend={true}
            />

            {/* Social Buzz Heatmap - Full Width */}
            <SocialBuzzHeatmap
              title="Social Media Buzz Heatmap"
              maxTopics={12}
              platforms="reddit,twitter,discord"
              autoRefresh={true}
            />

            {/* Smart News Feed */}
            <FinanceNewsFeed
              title="AI-Curated Market News"
              maxArticles={6}
              showSentiment={true}
              showSummary={true}
              autoRefresh={true}
              categories="finance,technology,economy"
            />

            {/* Additional Insights Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Market Summary */}
              <Card className={themeMode === 'light'
                ? 'bg-white border-[#E0E0E0] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200'
                : 'bg-black/40 border-purple-500/20 backdrop-blur-xl'
              }>
                <CardHeader className={`border-b ${themeMode === 'light' ? 'border-[#E0E0E0]' : 'border-slate-700/50'}`}>
                  <CardTitle className={`text-sm font-semibold ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>Market Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${themeMode === 'light' ? 'text-[#666]' : 'text-slate-400'}`}>Bullish Signals</span>
                      <span className={`font-bold ${themeMode === 'light' ? 'text-[#4CAF50]' : 'text-emerald-400'}`}>67%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${themeMode === 'light' ? 'text-[#666]' : 'text-slate-400'}`}>Bearish Signals</span>
                      <span className={`font-bold ${themeMode === 'light' ? 'text-[#F44336]' : 'text-red-400'}`}>23%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${themeMode === 'light' ? 'text-[#666]' : 'text-slate-400'}`}>Neutral Signals</span>
                      <span className={`font-bold ${themeMode === 'light' ? 'text-[#FF9800]' : 'text-amber-400'}`}>10%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Volatility Index */}
              <Card className={themeMode === 'light'
                ? 'bg-white border-[#E0E0E0] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200'
                : 'bg-black/40 border-purple-500/20 backdrop-blur-xl'
              }>
                <CardHeader className={`border-b ${themeMode === 'light' ? 'border-[#E0E0E0]' : 'border-slate-700/50'}`}>
                  <CardTitle className={`text-sm font-semibold ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>Volatility Index</CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center">
                  <div className={`text-3xl font-bold mb-2 ${themeMode === 'light' ? 'text-[#FF9800]' : 'text-amber-400'}`}>18.4</div>
                  <div className={`text-sm mb-3 ${themeMode === 'light' ? 'text-[#666]' : 'text-slate-400'}`}>VIX Level</div>
                  <Badge className={themeMode === 'light'
                    ? 'bg-[#FFF8E1] text-[#FF9800] border-[#FF9800]/30 rounded-full px-3 py-1'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }>
                    Moderate
                  </Badge>
                </CardContent>
              </Card>

              {/* Data Quality */}
              <Card className={themeMode === 'light'
                ? 'bg-white border-[#E0E0E0] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200'
                : 'bg-black/40 border-purple-500/20 backdrop-blur-xl'
              }>
                <CardHeader className={`border-b ${themeMode === 'light' ? 'border-[#E0E0E0]' : 'border-slate-700/50'}`}>
                  <CardTitle className={`text-sm font-semibold ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>Data Quality</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className={themeMode === 'light' ? 'text-[#666]' : 'text-slate-400'}>API Health</span>
                      <Badge className={themeMode === 'light'
                        ? 'bg-[#E8F5E9] text-[#4CAF50] border-[#4CAF50]/30 rounded-full px-2 py-0.5 text-xs'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }>
                        98%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={themeMode === 'light' ? 'text-[#666]' : 'text-slate-400'}>Data Freshness</span>
                      <Badge className={themeMode === 'light'
                        ? 'bg-[#E0F7FA] text-[#00796B] border-[#00796B]/30 rounded-full px-2 py-0.5 text-xs'
                        : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                      }>
                        Live
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={themeMode === 'light' ? 'text-[#666]' : 'text-slate-400'}>Confidence</span>
                      <Badge className={themeMode === 'light'
                        ? 'bg-[#F3E5F5] text-[#9C27B0] border-[#9C27B0]/30 rounded-full px-2 py-0.5 text-xs'
                        : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                      }>
                        87%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className={`text-sm mb-4 ${
            themeMode === 'light' ? 'text-[#666]' : 'text-slate-400'
          }`}>
            Market Mood data powered by advanced AI sentiment analysis
          </div>
          <div className="flex items-center justify-center gap-4">
            <Badge className={themeMode === 'light'
              ? 'bg-[#E8F5E9] text-[#4CAF50] border-[#4CAF50]/30 rounded-full px-3 py-1'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }>
              <TrendingUp className="w-3 h-3 mr-1" />
              Stock API: Live
            </Badge>
            <Badge className={themeMode === 'light'
              ? 'bg-[#E8EAF6] text-[#3F51B5] border-[#3F51B5]/30 rounded-full px-3 py-1'
              : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            }>
              <Hash className="w-3 h-3 mr-1" />
              Social API: Live
            </Badge>
            <Badge className={themeMode === 'light'
              ? 'bg-[#F3E5F5] text-[#9C27B0] border-[#9C27B0]/30 rounded-full px-3 py-1'
              : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
            }>
              <Brain className="w-3 h-3 mr-1" />
              AI Engine: Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>

      {/* Modal Components */}
      <AIMoodBreakdownPanel
        isOpen={isMoodBreakdownOpen}
        onClose={() => setIsMoodBreakdownOpen(false)}
        moodScore={moodScore || { overall: 72, stocks: 68, news: 75, social: 74 }}
      />

      <SentimentAnalyticsDashboard
        isOpen={isAnalyticsDashboardOpen}
        onClose={() => setIsAnalyticsDashboardOpen(false)}
      />
    </div>
  );
};

export default MarketMoodPage;
