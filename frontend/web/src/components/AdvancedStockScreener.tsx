import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import {
  getSentimentSignal,
  getRSISignal,
  getMarketCapBadgeColor,
  getSectorColor,
  formatSocialBuzz,
  getAIConfidenceLevel,
  generateAIInsight,
  exportToCSV,
  aiQueryTemplates
} from "@/utils/screenerHelpers";
import FilterTemplateManager from "./screener/FilterTemplateManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Search,
  Filter,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Crown,
  Zap,
  BarChart3,
  DollarSign,
  Volume2,
  Target,
  Brain,
  Save,
  Download,
  Grid3X3,
  List,
  ChevronDown,
  ChevronUp,
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  RefreshCw,
  Settings,
  MoreHorizontal,
  TrendingDown as Down,
  TrendingUp as Up,
  Activity,
  PieChart,
  LineChart,
  Gauge,
  Clock,
  Globe,
  Users,
  Star,
  AlertTriangle,
  CheckCircle,
  Info,
  Sparkles
} from "lucide-react";

interface StockData {
  ticker: string;
  companyName: string;
  logo?: string;
  currentPrice: number;
  change1D: number;
  change1W: number;
  change1M: number;
  sentimentScore: number;
  sentimentLabel: "Bullish" | "Bearish" | "Neutral";
  volume24h: number;
  marketCap: "Small" | "Mid" | "Large";
  sector: string;
  pe: number;
  eps: number;
  dividend: number;
  rsi: number;
  ma50: number;
  ma200: number;
  socialMentions: number;
  newsScore: number;
  aiConfidence: number;
  volatility: number;
  gap: number;
  insider: number;
}

interface AdvancedStockScreenerProps {
  className?: string;
}

const MOCK_STOCKS: StockData[] = [
  {
    ticker: "TSLA",
    companyName: "Tesla Inc.",
    currentPrice: 248.50,
    change1D: 5.20,
    change1W: 12.4,
    change1M: -2.1,
    sentimentScore: 75,
    sentimentLabel: "Bullish",
    volume24h: 58000000,
    marketCap: "Large",
    sector: "Technology",
    pe: 43.2,
    eps: 5.76,
    dividend: 0,
    rsi: 67.3,
    ma50: 235.40,
    ma200: 220.15,
    socialMentions: 12500,
    newsScore: 82,
    aiConfidence: 78,
    volatility: 3.2,
    gap: 2.1,
    insider: 15.2
  },
  {
    ticker: "NVDA",
    companyName: "NVIDIA Corporation",
    currentPrice: 421.25,
    change1D: -0.89,
    change1W: 8.7,
    change1M: 15.3,
    sentimentScore: 82,
    sentimentLabel: "Bullish",
    volume24h: 32000000,
    marketCap: "Large",
    sector: "Technology",
    pe: 55.8,
    eps: 7.55,
    dividend: 0.16,
    rsi: 72.1,
    ma50: 398.20,
    ma200: 350.75,
    socialMentions: 18700,
    newsScore: 89,
    aiConfidence: 85,
    volatility: 4.1,
    gap: -1.2,
    insider: 8.9
  },
  {
    ticker: "AAPL",
    companyName: "Apple Inc.",
    currentPrice: 195.50,
    change1D: 1.60,
    change1W: 3.2,
    change1M: 8.9,
    sentimentScore: 68,
    sentimentLabel: "Bullish",
    volume24h: 45000000,
    marketCap: "Large",
    sector: "Technology",
    pe: 28.5,
    eps: 6.86,
    dividend: 0.24,
    rsi: 58.7,
    ma50: 185.30,
    ma200: 175.90,
    socialMentions: 9800,
    newsScore: 76,
    aiConfidence: 72,
    volatility: 2.8,
    gap: 0.8,
    insider: 0.1
  },
  {
    ticker: "AMD",
    companyName: "Advanced Micro Devices",
    currentPrice: 142.80,
    change1D: -2.90,
    change1W: -5.1,
    change1M: 12.7,
    sentimentScore: 64,
    sentimentLabel: "Neutral",
    volume24h: 28000000,
    marketCap: "Large",
    sector: "Technology",
    pe: 65.2,
    eps: 2.19,
    dividend: 0,
    rsi: 45.8,
    ma50: 148.75,
    ma200: 135.20,
    socialMentions: 5600,
    newsScore: 67,
    aiConfidence: 61,
    volatility: 5.2,
    gap: -3.1,
    insider: 2.8
  },
  {
    ticker: "MSFT",
    companyName: "Microsoft Corporation",
    currentPrice: 420.15,
    change1D: 1.41,
    change1W: 4.8,
    change1M: 6.3,
    sentimentScore: 71,
    sentimentLabel: "Bullish",
    volume24h: 15000000,
    marketCap: "Large",
    sector: "Technology",
    pe: 34.7,
    eps: 12.11,
    dividend: 0.75,
    rsi: 62.4,
    ma50: 410.20,
    ma200: 395.80,
    socialMentions: 7200,
    newsScore: 74,
    aiConfidence: 75,
    volatility: 2.1,
    gap: 0.5,
    insider: 0.3
  }
];

const SECTORS = ["All", "Technology", "Finance", "Healthcare", "Entertainment", "Consumer", "Automotive", "Energy"];

export const AdvancedStockScreener: React.FC<AdvancedStockScreenerProps> = ({ className }) => {
  const { themeMode } = useMoodTheme();

  // View states
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [aiQuery, setAiQuery] = useState("");
  
  // Filter states
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>(MOCK_STOCKS);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fundamentals
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [peRange, setPeRange] = useState<[number, number]>([0, 100]);
  const [marketCapFilter, setMarketCapFilter] = useState<string>("All");
  const [sectorFilter, setSectorFilter] = useState<string>("All");
  
  // Technicals  
  const [rsiRange, setRsiRange] = useState<[number, number]>([0, 100]);
  const [volumeFilter, setVolumeFilter] = useState<string>("All");
  
  // Sentiment
  const [sentimentRange, setSentimentRange] = useState<[number, number]>([0, 100]);
  const [socialBuzzFilter, setSocialBuzzFilter] = useState<string>("All");
  const [newsScoreRange, setNewsScoreRange] = useState<[number, number]>([0, 100]);
  
  // Performance
  const [change1DRange, setChange1DRange] = useState<[number, number]>([-20, 20]);
  const [volatilityRange, setVolatilityRange] = useState<[number, number]>([0, 10]);
  
  // UI states
  const [showFilters, setShowFilters] = useState(true);
  const [collapsedSections, setCollapsedSections] = useState<{[key: string]: boolean}>({});
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [savedFilters, setSavedFilters] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const applyFilters = () => {
    let filtered = MOCK_STOCKS;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(stock => 
        stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range
    filtered = filtered.filter(stock => 
      stock.currentPrice >= priceRange[0] && stock.currentPrice <= priceRange[1]
    );

    // P/E range
    filtered = filtered.filter(stock => 
      stock.pe >= peRange[0] && stock.pe <= peRange[1]
    );

    // Market cap
    if (marketCapFilter !== "All") {
      filtered = filtered.filter(stock => stock.marketCap === marketCapFilter);
    }

    // Sector
    if (sectorFilter !== "All") {
      filtered = filtered.filter(stock => stock.sector === sectorFilter);
    }

    // RSI range
    filtered = filtered.filter(stock => 
      stock.rsi >= rsiRange[0] && stock.rsi <= rsiRange[1]
    );

    // Volume filter
    if (volumeFilter !== "All") {
      filtered = filtered.filter(stock => {
        if (volumeFilter === "Low") return stock.volume24h < 10000000;
        if (volumeFilter === "Medium") return stock.volume24h >= 10000000 && stock.volume24h < 30000000;
        if (volumeFilter === "High") return stock.volume24h >= 30000000;
        return true;
      });
    }

    // Sentiment range
    filtered = filtered.filter(stock => 
      stock.sentimentScore >= sentimentRange[0] && stock.sentimentScore <= sentimentRange[1]
    );

    // Social buzz filter
    if (socialBuzzFilter !== "All") {
      filtered = filtered.filter(stock => {
        if (socialBuzzFilter === "Low") return stock.socialMentions < 5000;
        if (socialBuzzFilter === "Medium") return stock.socialMentions >= 5000 && stock.socialMentions < 15000;
        if (socialBuzzFilter === "High") return stock.socialMentions >= 15000;
        return true;
      });
    }

    // News score range
    filtered = filtered.filter(stock => 
      stock.newsScore >= newsScoreRange[0] && stock.newsScore <= newsScoreRange[1]
    );

    // 1D change range
    filtered = filtered.filter(stock => 
      stock.change1D >= change1DRange[0] && stock.change1D <= change1DRange[1]
    );

    // Volatility range
    filtered = filtered.filter(stock => 
      stock.volatility >= volatilityRange[0] && stock.volatility <= volatilityRange[1]
    );

    setFilteredStocks(filtered);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setAiQuery("");
    setPriceRange([0, 500]);
    setPeRange([0, 100]);
    setMarketCapFilter("All");
    setSectorFilter("All");
    setRsiRange([0, 100]);
    setVolumeFilter("All");
    setSentimentRange([0, 100]);
    setSocialBuzzFilter("All");
    setNewsScoreRange([0, 100]);
    setChange1DRange([-20, 20]);
    setVolatilityRange([0, 10]);
    setFilteredStocks(MOCK_STOCKS);
  };

  const loadTemplate = (filters: any) => {
    if (filters.priceRange) setPriceRange(filters.priceRange);
    if (filters.peRange) setPeRange(filters.peRange);
    if (filters.marketCapFilter) setMarketCapFilter(filters.marketCapFilter);
    if (filters.sectorFilter) setSectorFilter(filters.sectorFilter);
    if (filters.rsiRange) setRsiRange(filters.rsiRange);
    if (filters.volumeFilter) setVolumeFilter(filters.volumeFilter);
    if (filters.sentimentRange) setSentimentRange(filters.sentimentRange);
    if (filters.socialBuzzFilter) setSocialBuzzFilter(filters.socialBuzzFilter);
    if (filters.newsScoreRange) setNewsScoreRange(filters.newsScoreRange);
    if (filters.change1DRange) setChange1DRange(filters.change1DRange);
    if (filters.volatilityRange) setVolatilityRange(filters.volatilityRange);
  };

  const getCurrentFilters = () => ({
    priceRange,
    peRange,
    marketCapFilter,
    sectorFilter,
    rsiRange,
    volumeFilter,
    sentimentRange,
    socialBuzzFilter,
    newsScoreRange,
    change1DRange,
    volatilityRange
  });

  useEffect(() => {
    applyFilters();
  }, [
    searchQuery, priceRange, peRange, marketCapFilter, sectorFilter,
    rsiRange, volumeFilter, sentimentRange, socialBuzzFilter, 
    newsScoreRange, change1DRange, volatilityRange
  ]);

  const getSentimentColor = (sentiment: string, score: number) => {
    if (sentiment === "Bullish") return "text-green-400 bg-green-500/20 border-green-500/30";
    if (sentiment === "Bearish") return "text-red-400 bg-red-500/20 border-red-500/30";
    return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  const formatSocialMentions = (mentions: number) => {
    if (mentions >= 1000) return `${(mentions / 1000).toFixed(1)}K`;
    return mentions.toString();
  };

  const renderFilterSection = (title: string, icon: React.ReactNode, content: React.ReactNode) => (
    <Collapsible
      open={!collapsedSections[title]}
      onOpenChange={() => toggleSection(title)}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-3 h-auto text-left hover:bg-gray-800/50"
        >
          <div className="flex items-center gap-2 text-white">
            {icon}
            <span className="font-medium">{title}</span>
          </div>
          {collapsedSections[title] ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-3 pt-0">
        {content}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <TooltipProvider>
      <div className={cn("space-y-6", className)}>
        {/* Header Section */}
        <div className="space-y-4">
          {/* Top Controls */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Filter className="w-6 h-6 text-white" />
                </div>
                Smart Stock Screener
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                AI-powered screening with sentiment analysis
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="bg-gray-800/50 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="h-8 w-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Action Buttons */}
              <FilterTemplateManager
                currentFilters={getCurrentFilters()}
                onLoadTemplate={loadTemplate}
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => exportToCSV(filteredStocks, `moorMeter-screener-${new Date().toISOString().split('T')[0]}`)}
                className="border-gray-600 text-gray-400 hover:text-white gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* AI Query Input */}
          <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Brain className="w-5 h-5 text-purple-400" />
                <Input
                  placeholder="Ask AI: Find mid-cap tech stocks with rising sentiment and strong momentum..."
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  className="flex-1 bg-black/20 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400"
                />
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>

              {/* AI Query Suggestions */}
              <div className="flex flex-wrap gap-2">
                {aiQueryTemplates.slice(0, 4).map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setAiQuery(template)}
                    className="text-xs border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                  >
                    {template}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Filter Sidebar */}
          {showFilters && (
            <div className="col-span-12 lg:col-span-3 space-y-4">
              <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Filter className="w-5 h-5 text-teal-400" />
                      Filters
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-gray-400 hover:text-white gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1 pb-4">
                  {/* Quick Search */}
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search ticker or company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-gray-900/50 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Fundamentals */}
                  {renderFilterSection(
                    "Fundamentals",
                    <DollarSign className="w-4 h-4 text-green-400" />,
                    <div className="space-y-4">
                      {/* Price Range */}
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-300">Price Range: ${priceRange[0]} - ${priceRange[1]}</Label>
                        <Slider
                          value={priceRange}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                          max={500}
                          step={10}
                          className="w-full"
                        />
                      </div>

                      {/* P/E Ratio */}
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-300">P/E Ratio: {peRange[0]} - {peRange[1]}</Label>
                        <Slider
                          value={peRange}
                          onValueChange={(value) => setPeRange(value as [number, number])}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      {/* Market Cap */}
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-300">Market Cap</Label>
                        <Select value={marketCapFilter} onValueChange={setMarketCapFilter}>
                          <SelectTrigger className="bg-gray-900/50 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-600">
                            <SelectItem value="All">All Sizes</SelectItem>
                            <SelectItem value="Small">Small Cap</SelectItem>
                            <SelectItem value="Mid">Mid Cap</SelectItem>
                            <SelectItem value="Large">Large Cap</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Sector */}
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-300">Sector</Label>
                        <Select value={sectorFilter} onValueChange={setSectorFilter}>
                          <SelectTrigger className="bg-gray-900/50 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-600">
                            {SECTORS.map(sector => (
                              <SelectItem key={sector} value={sector}>
                                {sector === "All" ? "All Sectors" : sector}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Technicals */}
                  {renderFilterSection(
                    "Technicals",
                    <Activity className="w-4 h-4 text-blue-400" />,
                    <div className="space-y-4">
                      {/* RSI */}
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-300">RSI: {rsiRange[0]} - {rsiRange[1]}</Label>
                        <Slider
                          value={rsiRange}
                          onValueChange={(value) => setRsiRange(value as [number, number])}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      {/* Volume */}
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-300">Volume</Label>
                        <Select value={volumeFilter} onValueChange={setVolumeFilter}>
                          <SelectTrigger className="bg-gray-900/50 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-600">
                            <SelectItem value="All">All Volumes</SelectItem>
                            <SelectItem value="Low">Low (&lt;10M)</SelectItem>
                            <SelectItem value="Medium">Medium (10M-30M)</SelectItem>
                            <SelectItem value="High">High (&gt;30M)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Performance */}
                  {renderFilterSection(
                    "Performance",
                    <TrendingUp className="w-4 h-4 text-purple-400" />,
                    <div className="space-y-4">
                      {/* 1D Change */}
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-300">1D Change: {change1DRange[0]}% - {change1DRange[1]}%</Label>
                        <Slider
                          value={change1DRange}
                          onValueChange={(value) => setChange1DRange(value as [number, number])}
                          min={-20}
                          max={20}
                          step={0.5}
                          className="w-full"
                        />
                      </div>

                      {/* Volatility */}
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-300">Volatility: {volatilityRange[0]} - {volatilityRange[1]}</Label>
                        <Slider
                          value={volatilityRange}
                          onValueChange={(value) => setVolatilityRange(value as [number, number])}
                          max={10}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Sentiment (MoodMeter Exclusive) */}
                  {renderFilterSection(
                    "Sentiment (MoodMeter)",
                    <Brain className="w-4 h-4 text-pink-400" />,
                    <div className="space-y-4">
                      {/* Mood Score */}
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-300">Mood Score: {sentimentRange[0]} - {sentimentRange[1]}</Label>
                        <Slider
                          value={sentimentRange}
                          onValueChange={(value) => setSentimentRange(value as [number, number])}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      {/* Social Buzz */}
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-300">Social Buzz</Label>
                        <Select value={socialBuzzFilter} onValueChange={setSocialBuzzFilter}>
                          <SelectTrigger className="bg-gray-900/50 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-600">
                            <SelectItem value="All">All Levels</SelectItem>
                            <SelectItem value="Low">Low (&lt;5K)</SelectItem>
                            <SelectItem value="Medium">Medium (5K-15K)</SelectItem>
                            <SelectItem value="High">High (&gt;15K)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* News Score */}
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-300">News Score: {newsScoreRange[0]} - {newsScoreRange[1]}</Label>
                        <Slider
                          value={newsScoreRange}
                          onValueChange={(value) => setNewsScoreRange(value as [number, number])}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Live Mode Toggle */}
              <Card className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border-emerald-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className={cn("w-4 h-4 text-emerald-400", isLiveMode && "animate-spin")} />
                      <span className="text-white font-medium">Live Mode</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                        PRO+
                      </Badge>
                    </div>
                    <Button
                      variant={isLiveMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsLiveMode(!isLiveMode)}
                      className={cn(
                        "h-6 text-xs",
                        isLiveMode 
                          ? "bg-emerald-600 hover:bg-emerald-700" 
                          : "border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                      )}
                    >
                      {isLiveMode ? "ON" : "OFF"}
                    </Button>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    Auto-refresh every 30 seconds
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results Section */}
          <div className={cn("space-y-4", showFilters ? "col-span-12 lg:col-span-9" : "col-span-12")}>
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-white">
                  <span className="text-lg font-medium">
                    Found {filteredStocks.length} stocks
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-teal-500/30 text-teal-400">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Real-time
                  </Badge>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                    <Brain className="w-3 h-3 mr-1" />
                    AI Enhanced
                  </Badge>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-gray-400 hover:text-white gap-2"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
            </div>

            {/* Results Grid/Table */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredStocks.map((stock) => (
                  <Card 
                    key={stock.ticker} 
                    className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                              {stock.ticker.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 dark:text-white">{stock.ticker}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                                {stock.companyName}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{stock.sector}</div>
                            <Badge className={cn("text-xs mt-1", getSentimentColor(stock.sentimentLabel, stock.sentimentScore))}>
                              {stock.sentimentLabel}
                            </Badge>
                          </div>
                        </div>

                        {/* Price & Change */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              ${stock.currentPrice.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              P/E {stock.pe} • Vol {formatVolume(stock.volume24h)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={cn(
                              "flex items-center gap-1 text-sm font-medium",
                              stock.change1D >= 0 ? "text-green-500" : "text-red-500"
                            )}>
                              {stock.change1D >= 0 ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              {stock.change1D >= 0 ? "+" : ""}{stock.change1D.toFixed(2)}%
                            </div>
                            <div className={cn("text-xs", getRSISignal(stock.rsi).color)}>
                              RSI {stock.rsi.toFixed(1)} ({getRSISignal(stock.rsi).signal})
                            </div>
                          </div>
                        </div>

                        {/* Sentiment & AI Metrics */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Mood Score</span>
                            <span className={cn("font-medium", getSentimentSignal(stock.sentimentScore).color)}>
                              {stock.sentimentScore}/100
                            </span>
                          </div>
                          <Progress
                            value={stock.sentimentScore}
                            className="h-1.5"
                          />

                          <div className="flex justify-between text-xs">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className={cn("flex items-center gap-1 cursor-help", formatSocialBuzz(stock.socialMentions).color)}>
                                  <MessageCircle className="w-3 h-3" />
                                  {formatSocialMentions(stock.socialMentions)}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{formatSocialBuzz(stock.socialMentions).level}</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className={cn("flex items-center gap-1 cursor-help", getAIConfidenceLevel(stock.aiConfidence).color)}>
                                  <Zap className="w-3 h-3" />
                                  AI {stock.aiConfidence}%
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{getAIConfidenceLevel(stock.aiConfidence).level} Confidence</p>
                              </TooltipContent>
                            </Tooltip>

                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                              <Globe className="w-3 h-3" />
                              News {stock.newsScore}
                            </div>
                          </div>

                          {/* AI Insight */}
                          <div className="mt-2 p-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded border border-purple-500/20">
                            <div className="flex items-start gap-2">
                              <Brain className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-gray-300 leading-relaxed">
                                {generateAIInsight(stock)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1 text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 text-xs">
                            <Bookmark className="w-3 h-3 mr-1" />
                            Watch
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* Table View */
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Change
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Mood
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Volume
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            RSI
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredStocks.map((stock) => (
                          <tr key={stock.ticker} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                  {stock.ticker.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900 dark:text-white">{stock.ticker}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">{stock.sector}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="font-medium text-gray-900 dark:text-white">
                                ${stock.currentPrice.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                P/E {stock.pe}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className={cn(
                                "flex items-center justify-end gap-1 font-medium",
                                stock.change1D >= 0 ? "text-green-500" : "text-red-500"
                              )}>
                                {stock.change1D >= 0 ? (
                                  <TrendingUp className="w-3 h-3" />
                                ) : (
                                  <TrendingDown className="w-3 h-3" />
                                )}
                                {stock.change1D >= 0 ? "+" : ""}{stock.change1D.toFixed(2)}%
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {stock.sentimentScore}
                                </span>
                                <Badge className={cn("text-xs", getSentimentColor(stock.sentimentLabel, stock.sentimentScore))}>
                                  {stock.sentimentLabel}
                                </Badge>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {formatVolume(stock.volume24h)}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {stock.rsi.toFixed(1)}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-1">
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <Bookmark className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <MoreHorizontal className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {filteredStocks.length === 0 && (
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <CardContent className="p-12 text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No stocks found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Try adjusting your filters or search terms to see more results.
                  </p>
                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    className="border-teal-500/30 text-teal-600 dark:text-teal-400 hover:bg-teal-500/10"
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AdvancedStockScreener;
