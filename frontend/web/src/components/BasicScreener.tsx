import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import UpgradeToProModal from "@/components/UpgradeToProModal";

import {
  Search,
  Filter,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Crown,
  DollarSign,
  Volume2,
  Target,
  Zap,
  BarChart3,
  Bookmark,
  Plus,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

interface StockData {
  ticker: string;
  companyName: string;
  currentPrice: number;
  change1D: number;
  sentimentScore: number;
  sentimentLabel: "Bullish" | "Bearish" | "Neutral";
  volume24h: number;
  marketCap: "Small" | "Mid" | "Large";
  sector: string;
}

interface BasicScreenerProps {
  className?: string;
}

const MOCK_STOCKS: StockData[] = [
  {
    ticker: "TSLA",
    companyName: "Tesla Inc.",
    currentPrice: 248.50,
    change1D: 5.20,
    sentimentScore: 75,
    sentimentLabel: "Bullish",
    volume24h: 58000000,
    marketCap: "Large",
    sector: "Technology"
  },
  {
    ticker: "NVDA",
    companyName: "NVIDIA Corporation",
    currentPrice: 421.25,
    change1D: -0.89,
    sentimentScore: 82,
    sentimentLabel: "Bullish",
    volume24h: 32000000,
    marketCap: "Large",
    sector: "Technology"
  },
  {
    ticker: "AAPL",
    companyName: "Apple Inc.",
    currentPrice: 195.50,
    change1D: 1.60,
    sentimentScore: 68,
    sentimentLabel: "Bullish",
    volume24h: 45000000,
    marketCap: "Large",
    sector: "Technology"
  },
  {
    ticker: "AMD",
    companyName: "Advanced Micro Devices",
    currentPrice: 142.80,
    change1D: -2.90,
    sentimentScore: 64,
    sentimentLabel: "Neutral",
    volume24h: 28000000,
    marketCap: "Large",
    sector: "Technology"
  },
  {
    ticker: "MSFT",
    companyName: "Microsoft Corporation",
    currentPrice: 420.15,
    change1D: 1.41,
    sentimentScore: 71,
    sentimentLabel: "Bullish",
    volume24h: 15000000,
    marketCap: "Large",
    sector: "Technology"
  },
  {
    ticker: "JPM",
    companyName: "JPMorgan Chase & Co.",
    currentPrice: 154.32,
    change1D: -0.45,
    sentimentScore: 42,
    sentimentLabel: "Neutral",
    volume24h: 15000000,
    marketCap: "Large",
    sector: "Finance"
  },
  {
    ticker: "JNJ",
    companyName: "Johnson & Johnson",
    currentPrice: 163.24,
    change1D: 0.89,
    sentimentScore: 56,
    sentimentLabel: "Neutral",
    volume24h: 8500000,
    marketCap: "Large",
    sector: "Healthcare"
  },
  {
    ticker: "V",
    companyName: "Visa Inc.",
    currentPrice: 267.91,
    change1D: 1.87,
    sentimentScore: 64,
    sentimentLabel: "Bullish",
    volume24h: 5200000,
    marketCap: "Large",
    sector: "Finance"
  },
  {
    ticker: "WMT",
    companyName: "Walmart Inc.",
    currentPrice: 159.76,
    change1D: -0.23,
    sentimentScore: 48,
    sentimentLabel: "Neutral",
    volume24h: 7800000,
    marketCap: "Large",
    sector: "Consumer"
  },
  {
    ticker: "DIS",
    companyName: "The Walt Disney Company",
    currentPrice: 96.45,
    change1D: -2.1,
    sentimentScore: 35,
    sentimentLabel: "Bearish",
    volume24h: 12000000,
    marketCap: "Large",
    sector: "Entertainment"
  },
  {
    ticker: "PLTR",
    companyName: "Palantir Technologies",
    currentPrice: 23.67,
    change1D: 4.87,
    sentimentScore: 78,
    sentimentLabel: "Bullish",
    volume24h: 25000000,
    marketCap: "Mid",
    sector: "Technology"
  },
  {
    ticker: "SPOT",
    companyName: "Spotify Technology",
    currentPrice: 189.45,
    change1D: -1.23,
    sentimentScore: 52,
    sentimentLabel: "Neutral",
    volume24h: 1800000,
    marketCap: "Mid",
    sector: "Entertainment"
  },
  {
    ticker: "SQ",
    companyName: "Block Inc.",
    currentPrice: 67.89,
    change1D: 2.87,
    sentimentScore: 61,
    sentimentLabel: "Bullish",
    volume24h: 8900000,
    marketCap: "Mid",
    sector: "Finance"
  },
  {
    ticker: "COIN",
    companyName: "Coinbase Global",
    currentPrice: 198.34,
    change1D: 6.45,
    sentimentScore: 72,
    sentimentLabel: "Bullish",
    volume24h: 7600000,
    marketCap: "Mid",
    sector: "Finance"
  },
  {
    ticker: "SOFI",
    companyName: "SoFi Technologies",
    currentPrice: 8.76,
    change1D: 1.23,
    sentimentScore: 58,
    sentimentLabel: "Neutral",
    volume24h: 15000000,
    marketCap: "Small",
    sector: "Finance"
  },
  {
    ticker: "BB",
    companyName: "BlackBerry Limited",
    currentPrice: 3.45,
    change1D: -2.34,
    sentimentScore: 28,
    sentimentLabel: "Bearish",
    volume24h: 2100000,
    marketCap: "Small",
    sector: "Technology"
  },
  {
    ticker: "AMC",
    companyName: "AMC Entertainment",
    currentPrice: 4.78,
    change1D: 8.34,
    sentimentScore: 69,
    sentimentLabel: "Bullish",
    volume24h: 89000000,
    marketCap: "Small",
    sector: "Entertainment"
  },
  {
    ticker: "GME",
    companyName: "GameStop Corp.",
    currentPrice: 16.89,
    change1D: 12.67,
    sentimentScore: 74,
    sentimentLabel: "Bullish",
    volume24h: 45000000,
    marketCap: "Small",
    sector: "Consumer"
  },
  {
    ticker: "NFLX",
    companyName: "Netflix Inc.",
    currentPrice: 487.23,
    change1D: 1.67,
    sentimentScore: 59,
    sentimentLabel: "Neutral",
    volume24h: 4500000,
    marketCap: "Large",
    sector: "Entertainment"
  },
  {
    ticker: "CRM",
    companyName: "Salesforce Inc.",
    currentPrice: 267.89,
    change1D: 2.34,
    sentimentScore: 66,
    sentimentLabel: "Bullish",
    volume24h: 3200000,
    marketCap: "Large",
    sector: "Technology"
  }
];

const SECTORS = ["All", "Technology", "Finance", "Healthcare", "Entertainment", "Consumer", "Automotive"];

export const BasicScreener: React.FC<BasicScreenerProps> = ({ className }) => {
  const { themeMode } = useMoodTheme();

  const [filteredStocks, setFilteredStocks] = useState<StockData[]>(MOCK_STOCKS.slice(0, 20));
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedMarketCap, setSelectedMarketCap] = useState<string>("All");
  const [selectedVolume, setSelectedVolume] = useState<string>("All");
  const [selectedSentiment, setSelectedSentiment] = useState<string>("All");
  const [selectedSector, setSelectedSector] = useState<string>("All");

  const applyFilters = () => {
    let filtered = MOCK_STOCKS;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(stock => 
        stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(stock => 
      stock.currentPrice >= priceRange[0] && stock.currentPrice <= priceRange[1]
    );

    // Market cap filter
    if (selectedMarketCap !== "All") {
      filtered = filtered.filter(stock => stock.marketCap === selectedMarketCap);
    }

    // Volume filter
    if (selectedVolume !== "All") {
      filtered = filtered.filter(stock => {
        if (selectedVolume === "Low") return stock.volume24h < 10000000;
        if (selectedVolume === "Medium") return stock.volume24h >= 10000000 && stock.volume24h < 30000000;
        if (selectedVolume === "High") return stock.volume24h >= 30000000;
        return true;
      });
    }

    // Sentiment filter
    if (selectedSentiment !== "All") {
      filtered = filtered.filter(stock => stock.sentimentLabel === selectedSentiment);
    }

    // Sector filter
    if (selectedSector !== "All") {
      filtered = filtered.filter(stock => stock.sector === selectedSector);
    }

    // Limit to 20 results for free users
    setFilteredStocks(filtered.slice(0, 20));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 500]);
    setSelectedMarketCap("All");
    setSelectedVolume("All");
    setSelectedSentiment("All");
    setSelectedSector("All");
    setFilteredStocks(MOCK_STOCKS.slice(0, 20));
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, priceRange, selectedMarketCap, selectedVolume, selectedSentiment, selectedSector]);

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === "Bullish") return "text-green-500 bg-green-500/10 border-green-500/20";
    if (sentiment === "Bearish") return "text-red-500 bg-red-500/10 border-red-500/20";
    return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
  };

  const getSentimentBarColor = (sentiment: string) => {
    if (sentiment === "Bullish") return "bg-green-500";
    if (sentiment === "Bearish") return "bg-red-500";
    return "bg-yellow-500";
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#1F2937] to-[#3730A3] dark:from-blue-400 dark:to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Filter className="w-6 h-6 text-white" />
            </div>
            Basic Stock Screener
          </h2>
          <p className="text-gray-700 font-medium text-sm mt-1">
            Essential stock filtering for free users with sentiment analysis
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={clearFilters}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-400 hover:text-white gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Clear Filters
          </Button>
          
          <Button
            onClick={handleUpgradeClick}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
          >
            <Crown className="w-4 h-4" />
            Upgrade to Pro
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="bg-white/5 backdrop-blur-xl border-gray-700/50">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Ask AI: Find mid-cap tech stocks with rising sentiment and strong momentum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-black/20 border-gray-700 text-white placeholder-gray-400 focus:border-purple-400/50 h-12 text-base"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Modal */}
      <UpgradeToProModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        onUpgrade={() => {
          // Hook for checkout navigation
          setShowUpgradeModal(false);
        }}
        onStartTrial={() => {
          // Hook for trial flow
          setShowUpgradeModal(false);
        }}
      />

      {/* Filter Controls */}
      <Card className="bg-white/5 backdrop-blur-xl border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-400" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                Price Range
              </Label>
              <div className="space-y-2">
                <div className="text-sm text-gray-400">
                  ${priceRange[0]} - ${priceRange[1] === 500 ? "500+" : priceRange[1]}
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  max={500}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>

            {/* Market Cap */}
            <div className="space-y-3">
              <Label className="text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                Market Cap
              </Label>
              <Select value={selectedMarketCap} onValueChange={setSelectedMarketCap}>
                <SelectTrigger className="bg-black/20 border-gray-700 text-white">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="All">All Sizes</SelectItem>
                  <SelectItem value="Small">Small Cap</SelectItem>
                  <SelectItem value="Mid">Mid Cap</SelectItem>
                  <SelectItem value="Large">Large Cap</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Volume */}
            <div className="space-y-3">
              <Label className="text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-orange-400" />
                Volume (24h)
              </Label>
              <Select value={selectedVolume} onValueChange={setSelectedVolume}>
                <SelectTrigger className="bg-black/20 border-gray-700 text-white">
                  <SelectValue placeholder="Select volume" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="All">All Volumes</SelectItem>
                  <SelectItem value="Low">Low (&lt;10M)</SelectItem>
                  <SelectItem value="Medium">Medium (10M-30M)</SelectItem>
                  <SelectItem value="High">High (&gt;30M)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sentiment */}
            <div className="space-y-3">
              <Label className="text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                Sentiment Score
              </Label>
              <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
                <SelectTrigger className="bg-black/20 border-gray-700 text-white">
                  <SelectValue placeholder="Select sentiment" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="All">All Sentiments</SelectItem>
                  <SelectItem value="Bullish">Bullish</SelectItem>
                  <SelectItem value="Neutral">Neutral</SelectItem>
                  <SelectItem value="Bearish">Bearish</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sector */}
            <div className="space-y-3">
              <Label className="text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                Sector
              </Label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="bg-black/20 border-gray-700 text-white">
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {SECTORS.map(sector => (
                    <SelectItem key={sector} value={sector}>
                      {sector === "All" ? "All Sectors" : sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pro Features Teaser */}
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium flex items-center gap-2 mb-1">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  Want More Advanced Filters?
                </h4>
                <p className="text-gray-400 text-sm">
                  RSI • Moving Averages • P/E Ratio • Dividend Yield • Volume Analysis • Price Alerts
                </p>
              </div>
              <Button
                onClick={handleUpgradeClick}
                size="sm"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-medium"
              >
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="text-white">
          <span className="text-lg font-medium">
            Found {filteredStocks.length} stocks
          </span>
          {filteredStocks.length === 20 && (
            <Badge variant="outline" className="border-orange-500/30 text-orange-400 ml-3">
              Top 20 Results (Free Limit)
            </Badge>
          )}
        </div>
        
        <Badge variant="outline" className="border-purple-500/30 text-purple-400">
          <Crown className="w-3 h-3 mr-1" />
          Free Tier
        </Badge>
      </div>

      {/* Stock Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStocks.map((stock) => (
          <Card 
            key={stock.ticker} 
            className="bg-white dark:bg-black/40 border-gray-200 dark:border-gray-700/50 hover:border-purple-400/40 dark:hover:border-purple-400/40 transition-all duration-300 group cursor-pointer backdrop-blur-xl"
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {stock.ticker.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{stock.ticker}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                        {stock.companyName}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-purple-500/10">
                    <Plus className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>

                {/* Price & Change Row */}
                <div className="flex items-center justify-between">
                  <div className="text-gray-900 dark:text-white">
                    <span className="text-2xl font-bold">
                      ${stock.currentPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    stock.change1D >= 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {stock.change1D >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {stock.change1D >= 0 ? "+" : ""}{stock.change1D.toFixed(2)}%
                  </div>
                </div>

                {/* Sentiment Score Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Sentiment Score</span>
                    <span className="text-gray-900 dark:text-white font-medium">{stock.sentimentScore}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={cn("h-2 rounded-full transition-all duration-300", getSentimentBarColor(stock.sentimentLabel))}
                      style={{ width: `${stock.sentimentScore}%` }}
                    />
                  </div>
                  <Badge className={cn("text-xs border w-fit", getSentimentColor(stock.sentimentLabel))}>
                    {stock.sentimentLabel}
                  </Badge>
                </div>

                {/* Stock Info Row */}
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Vol: {formatVolume(stock.volume24h)}</span>
                  <span>{stock.marketCap} Cap</span>
                </div>

                {/* Sector Badge */}
                <Badge variant="outline" className="w-full justify-center text-xs border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                  {stock.sector}
                </Badge>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    <Bookmark className="w-3 h-3 mr-1" />
                    Watch
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredStocks.length === 0 && (
        <Card className="bg-white dark:bg-black/40 border-gray-200 dark:border-gray-700/50 backdrop-blur-xl">
          <CardContent className="p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 dark:text-white text-xl font-semibold mb-2">No stocks found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Try adjusting your filters or search terms to discover stocks that match your criteria.
            </p>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upgrade CTA */}
      {filteredStocks.length === 20 && (
        <Card className="bg-gradient-to-r from-purple-900/80 to-pink-900/80 backdrop-blur-xl border-purple-500/30">
          <CardContent className="p-8 text-center">
            <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-white text-2xl font-bold mb-3">Unlock Full Results</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              You're seeing the top 20 results. Upgrade to Pro to view unlimited stocks and access powerful filters like RSI, moving averages, and technical indicators.
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              <Badge variant="outline" className="border-yellow-400/30 text-yellow-400 bg-yellow-400/10">
                Unlimited Results
              </Badge>
              <Badge variant="outline" className="border-yellow-400/30 text-yellow-400 bg-yellow-400/10">
                Technical Indicators
              </Badge>
              <Badge variant="outline" className="border-yellow-400/30 text-yellow-400 bg-yellow-400/10">
                Real-time Alerts
              </Badge>
              <Badge variant="outline" className="border-yellow-400/30 text-yellow-400 bg-yellow-400/10">
                Advanced Analytics
              </Badge>
              <Badge variant="outline" className="border-yellow-400/30 text-yellow-400 bg-yellow-400/10">
                Export Features
              </Badge>
            </div>
            
            <Button
              onClick={handleUpgradeClick}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8 py-3"
            >
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BasicScreener;
