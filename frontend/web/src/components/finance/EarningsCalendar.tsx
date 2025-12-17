import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, BarChart3, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";

interface EarningsData {
  date: string;
  companies: {
    symbol: string;
    name: string;
    epsEstimate: string;
    revenueEstimate: string;
    sentiment: 'bullish' | 'bearish' | 'neutral';
    sentimentScore: number;
    marketCap: 'large' | 'mid' | 'small';
    beforeMarket?: boolean;
    afterMarket?: boolean;
  }[];
}

interface EarningsCalendarProps {
  className?: string;
}

export const EarningsCalendar: React.FC<EarningsCalendarProps> = ({ className }) => {
  const { themeMode } = useMoodTheme();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1)); // July 2025
  const [viewMode, setViewMode] = useState<'calendar' | 'feed' | 'chart'>('calendar');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedCap, setSelectedCap] = useState('all');
  const [selectedSentiment, setSelectedSentiment] = useState('all');
  const [aiInsightsOn, setAiInsightsOn] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock earnings data
  const upcomingReports = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc',
      epsEstimate: '$1.53',
      revenueEstimate: '$94.5B',
      sentiment: 'neutral' as const,
      sentimentScore: 60,
      marketCap: 'large' as const,
      afterMarket: true
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc',
      epsEstimate: '$1.85',
      revenueEstimate: '$86.2B',
      sentiment: 'bullish' as const,
      sentimentScore: 76,
      marketCap: 'large' as const,
      beforeMarket: true
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      epsEstimate: '$2.78',
      revenueEstimate: '$62.8B',
      sentiment: 'bullish' as const,
      sentimentScore: 52,
      marketCap: 'large' as const,
      afterMarket: true
    }
  ];

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    let currentDay = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getSentimentColor = (sentiment: string, score: number) => {
    if (sentiment === 'bullish') return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (sentiment === 'bearish') return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  };

  const getSentimentBadgeColor = (sentiment: string) => {
    if (themeMode === 'light') {
      if (sentiment === 'bullish') return 'bg-green-100 text-green-700 border-green-300';
      if (sentiment === 'bearish') return 'bg-red-100 text-red-700 border-red-300';
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    } else {
      if (sentiment === 'bullish') return 'bg-green-500/20 text-green-400 border-green-500/30';
      if (sentiment === 'bearish') return 'bg-red-500/20 text-red-400 border-red-500/30';
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

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
                "text-3xl font-bold",
                themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
              )}>
                Earnings Radar
              </h1>
              <p className={cn(
                "text-sm",
                themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
              )}>
                Track upcoming and reported earnings with AI insights
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('calendar')}
                className={cn(
                  viewMode === 'calendar' && themeMode === 'light' && 'bg-purple-600 hover:bg-purple-700',
                  viewMode === 'calendar' && themeMode !== 'light' && 'bg-purple-500 hover:bg-purple-600'
                )}
              >
                <Calendar className="w-4 h-4 mr-1" />
                Calendar
              </Button>
              <Button
                variant={viewMode === 'feed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('feed')}
                className={cn(
                  viewMode === 'feed' && themeMode === 'light' && 'bg-purple-600 hover:bg-purple-700',
                  viewMode === 'feed' && themeMode !== 'light' && 'bg-purple-500 hover:bg-purple-600'
                )}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Feed
              </Button>
              <Button
                variant={viewMode === 'chart' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('chart')}
                className={cn(
                  viewMode === 'chart' && themeMode === 'light' && 'bg-purple-600 hover:bg-purple-700',
                  viewMode === 'chart' && themeMode !== 'light' && 'bg-purple-500 hover:bg-purple-600'
                )}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Chart
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search ticker or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "pl-10 w-64",
                  themeMode === 'light'
                    ? 'bg-white border-gray-300'
                    : 'bg-black/40 border-gray-600 text-white'
                )}
              />
            </div>
            
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className={cn(
                "w-40",
                themeMode === 'light'
                  ? 'bg-white border-gray-300'
                  : 'bg-black/40 border-gray-600 text-white'
              )}>
                <SelectValue placeholder="All Sectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                <SelectItem value="tech">Technology</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCap} onValueChange={setSelectedCap}>
              <SelectTrigger className={cn(
                "w-32",
                themeMode === 'light'
                  ? 'bg-white border-gray-300'
                  : 'bg-black/40 border-gray-600 text-white'
              )}>
                <SelectValue placeholder="All Caps" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Caps</SelectItem>
                <SelectItem value="large">Large Cap</SelectItem>
                <SelectItem value="mid">Mid Cap</SelectItem>
                <SelectItem value="small">Small Cap</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
              <SelectTrigger className={cn(
                "w-40",
                themeMode === 'light'
                  ? 'bg-white border-gray-300'
                  : 'bg-black/40 border-gray-600 text-white'
              )}>
                <SelectValue placeholder="All Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiment</SelectItem>
                <SelectItem value="bullish">Bullish</SelectItem>
                <SelectItem value="bearish">Bearish</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Switch
                checked={aiInsightsOn}
                onCheckedChange={setAiInsightsOn}
                className="data-[state=checked]:bg-purple-600"
              />
              <span className={cn(
                "text-sm font-medium",
                themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
              )}>
                AI On
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar/Main View */}
          <div className="lg:col-span-3">
            <Card className={cn(
              "border backdrop-blur-xl",
              themeMode === 'light'
                ? 'bg-white border-gray-200 shadow-lg'
                : 'bg-black/40 border-purple-500/20'
            )}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className={cn(
                  "text-xl",
                  themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                )}>
                  {formatMonth(currentDate)}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={previousMonth}
                    className={cn(
                      themeMode === 'light'
                        ? 'border-gray-300 hover:bg-gray-50'
                        : 'border-gray-600 hover:bg-gray-800 text-white'
                    )}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextMonth}
                    className={cn(
                      themeMode === 'light'
                        ? 'border-gray-300 hover:bg-gray-50'
                        : 'border-gray-600 hover:bg-gray-800 text-white'
                    )}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div
                      key={day}
                      className={cn(
                        "p-2 text-center text-sm font-medium",
                        themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                      )}
                    >
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((day, index) => {
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    const isToday = day.toDateString() === new Date().toDateString();
                    
                    return (
                      <div
                        key={index}
                        className={cn(
                          "min-h-24 p-2 border rounded-lg transition-colors cursor-pointer",
                          isCurrentMonth
                            ? (themeMode === 'light'
                                ? 'bg-white border-gray-200 hover:bg-gray-50'
                                : 'bg-black/20 border-gray-700 hover:bg-gray-800/50')
                            : (themeMode === 'light'
                                ? 'bg-gray-50 border-gray-100 text-gray-400'
                                : 'bg-gray-900/20 border-gray-800 text-gray-600'),
                          isToday && 'ring-2 ring-purple-500'
                        )}
                      >
                        <div className={cn(
                          "text-sm font-medium mb-1",
                          isCurrentMonth
                            ? (themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white')
                            : (themeMode === 'light' ? 'text-gray-400' : 'text-gray-600')
                        )}>
                          {day.getDate()}
                        </div>
                        <div className={cn(
                          "text-xs",
                          themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                        )}>
                          No Earnings
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Reports Sidebar */}
          <div>
            <Card className={cn(
              "border backdrop-blur-xl",
              themeMode === 'light'
                ? 'bg-white border-gray-200 shadow-lg'
                : 'bg-black/40 border-purple-500/20'
            )}>
              <CardHeader>
                <CardTitle className={cn(
                  "flex items-center justify-between text-lg",
                  themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                )}>
                  📊 Upcoming Reports
                  <Badge className={cn(
                    themeMode === 'light'
                      ? 'bg-purple-100 text-purple-700 border-purple-300'
                      : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                  )}>
                    4 Companies
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingReports.map((company) => (
                  <div
                    key={company.symbol}
                    className={cn(
                      "rounded-xl p-4 border transition-all duration-300 cursor-pointer group",
                      themeMode === 'light'
                        ? 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                        : getSentimentColor(company.sentiment, company.sentimentScore)
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold",
                          company.sentiment === 'bullish'
                            ? (themeMode === 'light'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-green-500/20 text-green-400')
                            : company.sentiment === 'bearish'
                            ? (themeMode === 'light'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-red-500/20 text-red-400')
                            : (themeMode === 'light'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-yellow-500/20 text-yellow-400')
                        )}>
                          {company.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className={cn(
                            "font-bold",
                            themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                          )}>
                            {company.symbol}
                          </div>
                          <div className={cn(
                            "text-sm",
                            themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                          )}>
                            {company.name}
                          </div>
                        </div>
                      </div>
                      <Badge className={getSentimentBadgeColor(company.sentiment)}>
                        {company.sentiment === 'bullish' ? 'Bullish' : 
                         company.sentiment === 'bearish' ? 'Bearish' : 'Neutral'}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={cn(
                          themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                        )}>
                          EPS Estimate
                        </span>
                        <span className={cn(
                          "font-medium",
                          themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                        )}>
                          {company.epsEstimate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={cn(
                          themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                        )}>
                          Revenue Estimate
                        </span>
                        <span className={cn(
                          "font-medium",
                          themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'
                        )}>
                          {company.revenueEstimate}
                        </span>
                      </div>
                      {company.beforeMarket && (
                        <Badge variant="outline" className={cn(
                          "text-xs",
                          themeMode === 'light'
                            ? 'border-gray-300 text-gray-600'
                            : 'border-gray-600 text-gray-400'
                        )}>
                          📊 Cloud Growth Story
                        </Badge>
                      )}
                      {company.afterMarket && (
                        <Badge variant="outline" className={cn(
                          "text-xs",
                          themeMode === 'light'
                            ? 'border-gray-300 text-gray-600'
                            : 'border-gray-600 text-gray-400'
                        )}>
                          🤖 AI Integration Benefits
                        </Badge>
                      )}
                      <div className={cn(
                        "text-xs text-center mt-2",
                        themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                      )}>
                        Sentiment: {company.sentimentScore}/100
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsCalendar;
