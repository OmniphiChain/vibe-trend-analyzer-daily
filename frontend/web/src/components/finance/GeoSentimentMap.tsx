import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Globe, 
  Filter,
  BarChart3,
  MapPin,
  Download,
  RefreshCw
} from 'lucide-react';
import { useMoodTheme } from '@/contexts/MoodThemeContext';

// Types for geo-sentiment data
interface CountrySentiment {
  country: string;
  countryCode: string;
  continent: string;
  bullish: number;
  bearish: number;
  neutral: number;
  moodScore: number;
  topTickers: string[];
  discussions: number;
  marketReturn: number;
  coordinates: [number, number]; // [lat, lng]
}

interface FilterOptions {
  assetType: 'all' | 'stocks' | 'crypto' | 'etfs';
  source: 'all' | 'news' | 'social' | 'community';
  timeframe: 'today' | '7d' | '30d';
  region: 'all' | 'americas' | 'europe' | 'asia' | 'oceania' | 'africa';
}

// Mock data for geo-sentiment
const mockGeoSentimentData: CountrySentiment[] = [
  {
    country: 'United States',
    countryCode: 'US',
    continent: 'americas',
    bullish: 68,
    bearish: 22,
    neutral: 10,
    moodScore: 78,
    topTickers: ['AAPL', 'NVDA', 'MSFT'],
    discussions: 15420,
    marketReturn: 2.4,
    coordinates: [39.8283, -98.5795]
  },
  {
    country: 'China',
    countryCode: 'CN',
    continent: 'asia',
    bullish: 45,
    bearish: 38,
    neutral: 17,
    moodScore: 52,
    topTickers: ['BABA', 'BIDU', 'JD'],
    discussions: 8930,
    marketReturn: -1.2,
    coordinates: [35.8617, 104.1954]
  },
  {
    country: 'Germany',
    countryCode: 'DE',
    continent: 'europe',
    bullish: 58,
    bearish: 28,
    neutral: 14,
    moodScore: 65,
    topTickers: ['SAP', 'ASML', 'ADBE'],
    discussions: 4250,
    marketReturn: 1.8,
    coordinates: [51.1657, 10.4515]
  },
  {
    country: 'Japan',
    countryCode: 'JP',
    continent: 'asia',
    bullish: 62,
    bearish: 25,
    neutral: 13,
    moodScore: 69,
    topTickers: ['TSM', 'SONY', 'NKE'],
    discussions: 6780,
    marketReturn: 1.5,
    coordinates: [36.2048, 138.2529]
  },
  {
    country: 'United Kingdom',
    countryCode: 'GB',
    continent: 'europe',
    bullish: 55,
    bearish: 32,
    neutral: 13,
    moodScore: 61,
    topTickers: ['SHELL', 'AZN', 'BP'],
    discussions: 3540,
    marketReturn: 0.8,
    coordinates: [55.3781, -3.4360]
  },
  {
    country: 'India',
    countryCode: 'IN',
    continent: 'asia',
    bullish: 72,
    bearish: 18,
    neutral: 10,
    moodScore: 82,
    topTickers: ['INFY', 'TCS', 'RELIANCE'],
    discussions: 7200,
    marketReturn: 3.2,
    coordinates: [20.5937, 78.9629]
  },
  {
    country: 'Brazil',
    countryCode: 'BR',
    continent: 'americas',
    bullish: 48,
    bearish: 35,
    neutral: 17,
    moodScore: 56,
    topTickers: ['VALE', 'PETR4', 'ITUB'],
    discussions: 2890,
    marketReturn: 0.2,
    coordinates: [-14.2350, -51.9253]
  },
  {
    country: 'Canada',
    countryCode: 'CA',
    continent: 'americas',
    bullish: 64,
    bearish: 24,
    neutral: 12,
    moodScore: 72,
    topTickers: ['SHOP', 'TD', 'RY'],
    discussions: 4100,
    marketReturn: 1.9,
    coordinates: [56.1304, -106.3468]
  }
];

const GeoSentimentMap: React.FC = () => {
  const { theme } = useMoodTheme();
  const [filters, setFilters] = useState<FilterOptions>({
    assetType: 'all',
    source: 'all',
    timeframe: 'today',
    region: 'all'
  });
  const [selectedCountry, setSelectedCountry] = useState<CountrySentiment | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<CountrySentiment | null>(null);

  // Debounced hover handlers to prevent glitches
  const handleMouseEnter = (country: CountrySentiment) => {
    setHoveredCountry(country);
  };

  const handleMouseLeave = () => {
    setHoveredCountry(null);
  };

  // Filter and sort data based on current filters
  const filteredData = useMemo(() => {
    return mockGeoSentimentData
      .filter(country => {
        if (filters.region !== 'all' && country.continent !== filters.region) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.moodScore - a.moodScore);
  }, [filters]);

  const getSentimentColor = (moodScore: number) => {
    if (moodScore >= 70) return 'bg-green-500';
    if (moodScore >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSentimentLabel = (moodScore: number) => {
    if (moodScore >= 70) return 'Bullish';
    if (moodScore >= 50) return 'Neutral';
    return 'Bearish';
  };

  const getSentimentIcon = (moodScore: number) => {
    if (moodScore >= 70) return <TrendingUp className="h-4 w-4" />;
    if (moodScore >= 50) return <Minus className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  const topBullishCountries = filteredData.slice(0, 5);
  const topBearishCountries = filteredData.slice().reverse().slice(0, 5);

  return (
    <div className="space-y-6">
      {/* CSS for smooth tooltip animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
        }
      `}</style>
      {/* Header and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Globe className="h-8 w-8 text-blue-500" />
            🌍 Global Sentiment Map
          </h1>
          <p className="text-muted-foreground mt-2">
            Track regional sentiment trends across global financial markets
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select value={filters.assetType} onValueChange={(value: any) => setFilters(prev => ({ ...prev, assetType: value }))}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Asset Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assets</SelectItem>
              <SelectItem value="stocks">Stocks</SelectItem>
              <SelectItem value="crypto">Crypto</SelectItem>
              <SelectItem value="etfs">ETFs</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.source} onValueChange={(value: any) => setFilters(prev => ({ ...prev, source: value }))}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="news">News</SelectItem>
              <SelectItem value="social">Social Media</SelectItem>
              <SelectItem value="community">Community</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.timeframe} onValueChange={(value: any) => setFilters(prev => ({ ...prev, timeframe: value }))}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.region} onValueChange={(value: any) => setFilters(prev => ({ ...prev, region: value }))}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="americas">Americas</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
              <SelectItem value="africa">Africa</SelectItem>
              <SelectItem value="oceania">Oceania</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* World Map Visualization */}
        <div className="xl:col-span-3">
          <Card className="relative min-h-[500px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Global Sentiment Heatmap
                <Badge variant="outline" className="ml-auto">
                  Live Data
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Simplified SVG World Map */}
              <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg p-8 min-h-[400px] overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                
                {/* Country Cards positioned on map */}
                <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full">
                  {filteredData.map((country) => (
                    <div
                      key={country.countryCode}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                        selectedCountry?.countryCode === country.countryCode 
                          ? 'ring-2 ring-blue-500' 
                          : ''
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${
                          country.moodScore >= 70 
                            ? 'rgba(34, 197, 94, 0.2)' 
                            : country.moodScore >= 50 
                            ? 'rgba(234, 179, 8, 0.2)' 
                            : 'rgba(239, 68, 68, 0.2)'
                        }, transparent)`
                      }}
                      onClick={() => setSelectedCountry(country)}
                      onMouseEnter={() => handleMouseEnter(country)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{country.country}</span>
                        <div className={`w-3 h-3 rounded-full ${getSentimentColor(country.moodScore)}`}></div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs">
                          {getSentimentIcon(country.moodScore)}
                          <span className="font-medium">{country.moodScore}%</span>
                          <span className="text-muted-foreground">{getSentimentLabel(country.moodScore)}</span>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          {country.discussions.toLocaleString()} discussions
                        </div>
                        
                        <div className="flex gap-1">
                          {country.topTickers.slice(0, 2).map(ticker => (
                            <Badge key={ticker} variant="secondary" className="text-xs px-1 py-0">
                              {ticker}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tooltip for hovered country - Fixed positioning */}
                {hoveredCountry && (
                  <div
                    className="fixed bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-xl min-w-[280px] max-w-[320px] pointer-events-none transition-all duration-200 ease-out"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 1000,
                      animation: 'fadeIn 200ms ease-out'
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{hoveredCountry.country}</h3>
                      <Badge className={`${getSentimentColor(hoveredCountry.moodScore)} text-white`}>
                        {getSentimentLabel(hoveredCountry.moodScore)}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Mood Score:</span>
                        <span className="font-medium">{hoveredCountry.moodScore}%</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="text-green-500 font-medium">{hoveredCountry.bullish}%</div>
                          <div className="text-muted-foreground">Bullish</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-500 font-medium">{hoveredCountry.neutral}%</div>
                          <div className="text-muted-foreground">Neutral</div>
                        </div>
                        <div className="text-center">
                          <div className="text-red-500 font-medium">{hoveredCountry.bearish}%</div>
                          <div className="text-muted-foreground">Bearish</div>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex justify-between">
                        <span>Market Return:</span>
                        <span className={`font-medium ${hoveredCountry.marketReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {hoveredCountry.marketReturn >= 0 ? '+' : ''}{hoveredCountry.marketReturn}%
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground">Top Tickers:</span>
                        <div className="flex gap-1 mt-1">
                          {hoveredCountry.topTickers.map(ticker => (
                            <Badge key={ticker} variant="outline" className="text-xs">
                              {ticker}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Insights Panel */}
        <div className="space-y-6">
          {/* Top Bullish Countries */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Top Bullish
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topBullishCountries.map((country, index) => (
                <div key={country.countryCode} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-4 text-xs text-muted-foreground">#{index + 1}</span>
                    <span className="font-medium text-sm">{country.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500 font-medium text-sm">{country.moodScore}%</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Bearish Countries */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                Top Bearish
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topBearishCountries.map((country, index) => (
                <div key={country.countryCode} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-4 text-xs text-muted-foreground">#{index + 1}</span>
                    <span className="font-medium text-sm">{country.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-medium text-sm">{country.moodScore}%</span>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Global Statistics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Global Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Average Mood Score</span>
                  <span className="font-medium">
                    {Math.round(filteredData.reduce((acc, country) => acc + country.moodScore, 0) / filteredData.length)}%
                  </span>
                </div>
                <Progress value={filteredData.reduce((acc, country) => acc + country.moodScore, 0) / filteredData.length} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Total Discussions</span>
                  <span className="font-medium">
                    {filteredData.reduce((acc, country) => acc + country.discussions, 0).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Avg Market Return</span>
                  <span className={`font-medium ${
                    filteredData.reduce((acc, country) => acc + country.marketReturn, 0) / filteredData.length >= 0 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {(filteredData.reduce((acc, country) => acc + country.marketReturn, 0) / filteredData.length).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Selected Country Details */}
      {selectedCountry && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>📍 {selectedCountry.country} - Detailed Analysis</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedCountry(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Sentiment Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      Bullish
                    </span>
                    <span className="font-medium">{selectedCountry.bullish}%</span>
                  </div>
                  <Progress value={selectedCountry.bullish} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Minus className="h-4 w-4 text-yellow-500" />
                      Neutral
                    </span>
                    <span className="font-medium">{selectedCountry.neutral}%</span>
                  </div>
                  <Progress value={selectedCountry.neutral} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      Bearish
                    </span>
                    <span className="font-medium">{selectedCountry.bearish}%</span>
                  </div>
                  <Progress value={selectedCountry.bearish} className="h-2" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Market Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Market Return:</span>
                    <span className={`font-medium ${selectedCountry.marketReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {selectedCountry.marketReturn >= 0 ? '+' : ''}{selectedCountry.marketReturn}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Discussions:</span>
                    <span className="font-medium">{selectedCountry.discussions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mood Score:</span>
                    <span className="font-medium">{selectedCountry.moodScore}%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Top Discussed Tickers</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCountry.topTickers.map(ticker => (
                    <Badge key={ticker} variant="secondary" className="px-3 py-1">
                      {ticker}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GeoSentimentMap;
