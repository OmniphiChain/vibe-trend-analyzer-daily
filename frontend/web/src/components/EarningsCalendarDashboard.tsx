import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { EmojiIcon } from '../lib/iconUtils';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Brain,
  Clock,
  Target,
  DollarSign,
  Building,
  Zap,
  Eye,
  FileText,
  Presentation,
  AlertTriangle
} from 'lucide-react';
import { cn } from '../lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface EarningsData {
  date: string;
  symbol: string;
  name: string;
  logo: string;
  time: 'BMO' | 'AMC' | 'During Market';
  actualEPS?: number;
  estimatedEPS: number;
  actualRevenue?: number;
  estimatedRevenue: number;
  sector: string;
  marketCap: 'Small' | 'Mid' | 'Large';
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  aiSentiment: string;
  beat?: boolean;
  reportStatus: 'Upcoming' | 'Reported';
  stockReaction?: number;
  summary?: string;
  keyTakeaways?: string[];
  sentimentScore?: number;
}

interface EarningsCalendarDashboardProps {
  className?: string;
}

const EarningsCalendarDashboard: React.FC<EarningsCalendarDashboardProps> = ({
  className
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'feed' | 'chart'>('calendar');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedMarketCap, setSelectedMarketCap] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<EarningsData | null>(null);
  const [showAISummaries, setShowAISummaries] = useState(true);

  // Mock earnings data
  const earningsData: EarningsData[] = [
    {
      date: '2024-01-15',
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      logo: <EmojiIcon emoji="🎮" className="w-6 h-6" />,
      time: 'AMC',
      actualEPS: 5.16,
      estimatedEPS: 4.64,
      actualRevenue: 60.9,
      estimatedRevenue: 57.8,
      sector: 'Technology',
      marketCap: 'Large',
      sentiment: 'Bullish',
      aiSentiment: 'Strong Beat Expected',
      beat: true,
      reportStatus: 'Reported',
      stockReaction: 8.2,
      summary: 'NVIDIA delivered exceptional Q4 results with record data center revenue driven by AI demand. The company raised guidance significantly and management expressed confidence in sustained AI growth momentum.',
      keyTakeaways: ['Record data center revenue', 'AI demand exceeding expectations', 'Raised FY guidance', 'Supply chain improvements'],
      sentimentScore: 92
    },
    {
      date: '2024-01-16',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      logo: <EmojiIcon emoji="🍎" className="w-6 h-6" />,
      time: 'AMC',
      estimatedEPS: 1.53,
      estimatedRevenue: 94.5,
      sector: 'Technology',
      marketCap: 'Large',
      sentiment: 'Neutral',
      aiSentiment: 'Mixed Expectations',
      reportStatus: 'Upcoming',
      summary: 'Apple earnings expected to show modest growth with focus on Services revenue and iPhone 15 adoption rates.',
      sentimentScore: 68
    },
    {
      date: '2024-01-17',
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      logo: <EmojiIcon emoji="⚡" className="w-6 h-6" />,
      time: 'AMC',
      actualEPS: 0.71,
      estimatedEPS: 0.73,
      actualRevenue: 25.2,
      estimatedRevenue: 25.6,
      sector: 'Consumer Discretionary',
      marketCap: 'Large',
      sentiment: 'Bearish',
      aiSentiment: 'Delivery Concerns',
      beat: false,
      reportStatus: 'Reported',
      stockReaction: -4.1,
      summary: 'Tesla missed on both earnings and revenue with lower than expected vehicle deliveries. Management cited production challenges but remained optimistic about 2024 targets.',
      keyTakeaways: ['Delivery shortfall', 'Production headwinds', 'Margin pressure', 'Cautious 2024 outlook'],
      sentimentScore: 34
    },
    {
      date: '2024-01-18',
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      logo: <EmojiIcon emoji="🔍" className="w-6 h-6" />,
      time: 'AMC',
      estimatedEPS: 1.85,
      estimatedRevenue: 86.2,
      sector: 'Technology',
      marketCap: 'Large',
      sentiment: 'Bullish',
      aiSentiment: 'Cloud Growth Story',
      reportStatus: 'Upcoming',
      sentimentScore: 76
    },
    {
      date: '2024-01-19',
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      logo: <EmojiIcon emoji="🪟" className="w-6 h-6" />,
      time: 'AMC',
      estimatedEPS: 2.78,
      estimatedRevenue: 62.8,
      sector: 'Technology',
      marketCap: 'Large',
      sentiment: 'Bullish',
      aiSentiment: 'AI Integration Benefits',
      reportStatus: 'Upcoming',
      sentimentScore: 82
    },
    {
      date: '2024-01-22',
      symbol: 'META',
      name: 'Meta Platforms',
      logo: <EmojiIcon emoji="📘" className="w-6 h-6" />,
      time: 'AMC',
      estimatedEPS: 4.96,
      estimatedRevenue: 39.1,
      sector: 'Technology',
      marketCap: 'Large',
      sentiment: 'Neutral',
      aiSentiment: 'Metaverse Uncertainty',
      reportStatus: 'Upcoming',
      sentimentScore: 62
    }
  ];

  const sectors = ['all', 'Technology', 'Healthcare', 'Consumer Discretionary', 'Financials', 'Energy'];
  const marketCaps = ['all', 'Small', 'Mid', 'Large'];
  const sentiments = ['all', 'Bullish', 'Neutral', 'Bearish'];

  const filteredEarnings = earningsData.filter(earning => {
    if (selectedSector !== 'all' && earning.sector !== selectedSector) return false;
    if (selectedMarketCap !== 'all' && earning.marketCap !== selectedMarketCap) return false;
    if (selectedSentiment !== 'all' && earning.sentiment !== selectedSentiment) return false;
    if (searchQuery && !earning.symbol.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !earning.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getEarningsForDate = (date: string) => {
    return filteredEarnings.filter(earning => earning.date === date);
  };

  const getCurrentMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push(dateString);
    }
    
    return days;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Bullish': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'Bearish': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    }
  };

  const EarningsCalendarGrid = () => {
    const days = getCurrentMonthDays();
    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
      <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
        <CardHeader className="border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-400" />
              {monthName}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="text-gray-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="text-gray-400 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-gray-400 text-sm font-medium py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} className="h-24" />;
              }
              
              const earnings = getEarningsForDate(date);
              const hasEarnings = earnings.length > 0;
              
              return (
                <div
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "h-24 border rounded-lg p-2 cursor-pointer transition-all duration-200 relative",
                    hasEarnings 
                      ? "border-purple-500/30 bg-purple-500/10 hover:border-purple-400/50 hover:bg-purple-500/20" 
                      : "border-gray-700/30 bg-gray-800/20 hover:border-gray-600/50",
                    selectedDate === date && "ring-2 ring-purple-400"
                  )}
                >
                  <div className="text-white text-sm font-medium mb-1">
                    {new Date(date).getDate()}
                  </div>
                  
                  {hasEarnings ? (
                    <div className="space-y-1">
                      {earnings.slice(0, 2).map((earning, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1 text-xs bg-black/40 rounded px-1 py-0.5"
                        >
                          <span className="text-sm">{earning.logo}</span>
                          <span className="text-gray-300 truncate">{earning.symbol}</span>
                        </div>
                      ))}
                      {earnings.length > 2 && (
                        <div className="text-xs text-gray-400">+{earnings.length - 2} more</div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-600 text-xs">No Earnings</span>
                    </div>
                  )}
                  
                  {hasEarnings && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const EarningsFeedPanel = () => {
    const displayEarnings = selectedDate 
      ? getEarningsForDate(selectedDate)
      : filteredEarnings.filter(e => e.reportStatus === 'Upcoming').slice(0, 5);

    return (
      <Card className="bg-black/40 border-emerald-500/20 backdrop-blur-xl h-fit">
        <CardHeader className="border-b border-emerald-500/20">
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            {selectedDate ? `Earnings for ${new Date(selectedDate).toLocaleDateString()}` : 'Upcoming Reports'}
            <Badge className="ml-auto bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              {displayEarnings.length} Companies
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
          {displayEarnings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No earnings reports for this date</p>
            </div>
          ) : (
            displayEarnings.map((earning, index) => (
              <EarningsFeedCard 
                key={index} 
                earning={earning} 
                onClick={() => setSelectedCompany(earning)}
              />
            ))
          )}
        </CardContent>
      </Card>
    );
  };

  const EarningsFeedCard: React.FC<{ earning: EarningsData; onClick: () => void }> = ({ earning, onClick }) => (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-black/60 to-emerald-900/20 rounded-xl p-4 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg flex items-center justify-center text-2xl">
            {earning.logo}
          </div>
          <div>
            <div className="text-lg font-bold text-white">{earning.symbol}</div>
            <div className="text-sm text-gray-400">{earning.name}</div>
          </div>
        </div>
        <div className="text-right">
          <Badge className={cn('text-xs', getSentimentColor(earning.sentiment))}>
            {earning.sentiment}
          </Badge>
          <div className="text-xs text-gray-400 mt-1">{earning.time}</div>
        </div>
      </div>

      {earning.reportStatus === 'Reported' ? (
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <div className="text-gray-400 text-xs">EPS</div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">${earning.actualEPS?.toFixed(2)}</span>
              <span className="text-gray-400 text-sm">vs ${earning.estimatedEPS.toFixed(2)}</span>
              {earning.beat !== undefined && (
                <Badge className={cn(
                  'text-xs',
                  earning.beat ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                )}>
                  {earning.beat ? 'Beat' : 'Miss'}
                </Badge>
              )}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-xs">Revenue</div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">${earning.actualRevenue}B</span>
              <span className="text-gray-400 text-sm">vs ${earning.estimatedRevenue}B</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <div className="text-gray-400 text-xs">EPS Estimate</div>
            <div className="text-white font-bold">${earning.estimatedEPS.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs">Revenue Estimate</div>
            <div className="text-white font-bold">${earning.estimatedRevenue}B</div>
          </div>
        </div>
      )}

      {earning.stockReaction && (
        <div className="mb-3">
          <div className="text-gray-400 text-xs">Stock Reaction</div>
          <div className={cn(
            'font-bold flex items-center gap-1',
            earning.stockReaction > 0 ? 'text-green-400' : 'text-red-400'
          )}>
            {earning.stockReaction > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {earning.stockReaction > 0 ? '+' : ''}{earning.stockReaction}%
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
          <EmojiIcon emoji="🤖" className="w-4 h-4" /> {earning.aiSentiment}
        </Badge>
        {earning.sentimentScore && (
          <div className="text-xs text-gray-400">
            Sentiment: {earning.sentimentScore}/100
          </div>
        )}
      </div>
    </div>
  );

  const EarningsAnalyzer = () => {
    if (!selectedCompany) return null;

    return (
      <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
        <CardHeader className="border-b border-blue-500/20">
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            {selectedCompany.symbol} Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black/20">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="chart">Chart</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="mt-4">
              {showAISummaries && selectedCompany.summary && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium">AI Summary</h4>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                      <Brain className="w-3 h-3 mr-1" />
                      AI Generated
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedCompany.summary}</p>
                  <div className="text-xs text-gray-500 italic">
                    This summary was generated by AI and may be inaccurate.
                  </div>
                </div>
              )}
              
              {selectedCompany.keyTakeaways && (
                <div className="mt-6">
                  <h4 className="text-white font-medium mb-3">Key Takeaways</h4>
                  <div className="space-y-2">
                    {selectedCompany.keyTakeaways.map((takeaway, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                        <span className="text-gray-300">{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="details" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400 text-sm">Sector</div>
                    <div className="text-white font-medium">{selectedCompany.sector}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Market Cap</div>
                    <div className="text-white font-medium">{selectedCompany.marketCap}</div>
                  </div>
                </div>
                
                {selectedCompany.sentimentScore && (
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Sentiment Score</div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full transition-all duration-1000',
                            selectedCompany.sentimentScore >= 70 ? 'bg-gradient-to-r from-green-400 to-emerald-400' :
                            selectedCompany.sentimentScore >= 40 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                            'bg-gradient-to-r from-red-400 to-rose-400'
                          )}
                          style={{ width: `${selectedCompany.sentimentScore}%` }}
                        />
                      </div>
                      <span className="text-white font-bold">{selectedCompany.sentimentScore}/100</span>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="chart" className="mt-4">
              <div className="text-center py-8">
                <BarChart3 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Historical earnings chart coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#1F2937] via-[#3730A3] to-[#4338CA] dark:from-purple-400 dark:via-pink-400 dark:to-emerald-400 bg-clip-text text-transparent">
            Earnings Radar
          </h2>
          <p className="text-gray-400 mt-1">Track upcoming and reported earnings with AI insights</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
            className="text-xs"
          >
            <EmojiIcon emoji="📅" className="w-4 h-4" /> Calendar
          </Button>
          <Button
            variant={viewMode === 'feed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('feed')}
            className="text-xs"
          >
            <EmojiIcon emoji="📋" className="w-4 h-4" /> Feed
          </Button>
          <Button
            variant={viewMode === 'chart' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('chart')}
            className="text-xs"
          >
            <EmojiIcon emoji="📊" className="w-4 h-4" /> Chart
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="bg-black/40 border-gray-700/20 backdrop-blur-xl">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search ticker or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/40 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="w-32 bg-black/40 border-gray-700 text-white">
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-gray-700">
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>
                      {sector === 'all' ? 'All Sectors' : sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedMarketCap} onValueChange={setSelectedMarketCap}>
                <SelectTrigger className="w-32 bg-black/40 border-gray-700 text-white">
                  <SelectValue placeholder="Market Cap" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-gray-700">
                  {marketCaps.map(cap => (
                    <SelectItem key={cap} value={cap}>
                      {cap === 'all' ? 'All Caps' : `${cap} Cap`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
                <SelectTrigger className="w-32 bg-black/40 border-gray-700 text-white">
                  <SelectValue placeholder="Sentiment" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-gray-700">
                  {sentiments.map(sentiment => (
                    <SelectItem key={sentiment} value={sentiment}>
                      {sentiment === 'all' ? 'All Sentiment' : sentiment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAISummaries(!showAISummaries)}
                className={cn(
                  "border-gray-700 text-xs",
                  showAISummaries ? "bg-blue-500/20 text-blue-300" : "text-gray-400"
                )}
              >
                <Brain className="w-3 h-3 mr-1" />
                AI {showAISummaries ? 'On' : 'Off'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <EarningsCalendarGrid />
          </div>
          <div className="space-y-6">
            <EarningsFeedPanel />
            {selectedCompany && <EarningsAnalyzer />}
          </div>
        </div>
      ) : viewMode === 'feed' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEarnings.map((earning, index) => (
            <EarningsFeedCard 
              key={index} 
              earning={earning} 
              onClick={() => setSelectedCompany(earning)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <BarChart3 className="w-24 h-24 text-gray-500 mx-auto mb-8" />
          <h3 className="text-2xl font-bold text-white mb-4">Chart View Coming Soon</h3>
          <p className="text-gray-400 mb-8">Interactive earnings performance charts and trend analysis</p>
          <Button onClick={() => setViewMode('calendar')} className="bg-purple-600 hover:bg-purple-700">
            Return to Calendar
          </Button>
        </div>
      )}
    </div>
  );
};

export default EarningsCalendarDashboard;
