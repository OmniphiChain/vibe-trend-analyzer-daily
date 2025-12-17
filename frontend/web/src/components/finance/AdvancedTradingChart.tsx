import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { ResponsiveModernHeader } from '../ResponsiveModernHeader';
import { 
  Search, Settings, Camera, Save, Menu, X, ChevronDown, ChevronRight, ChevronLeft,
  TrendingUp, TrendingDown, BarChart3, Activity, Volume2, Target, Brain, Zap,
  Eye, Crosshair, Maximize, Plus, Minus, Play, Pause, SkipBack, SkipForward,
  RefreshCw, DollarSign, Clock, Flame, Layers, Filter, LineChart, CandlestickChart,
  MousePointer, Move, Square, Type, Ruler, Undo, Redo, Trash2, Globe,
  Bell, AlertTriangle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import '../../styles/trading-chart.css';

interface ChartState {
  symbol: string;
  exchange: string;
  assetType: 'Crypto' | 'Stocks';
  timeframe: string;
  indicators: {
    sma: Array<{len: number, show: boolean, color: string}>;
    ema: Array<{len: number, show: boolean, color: string}>;
    rsi: {len: number, upper: number, lower: number, show: boolean};
    macd: {fast: number, slow: number, signal: number, show: boolean};
    bb: {len: number, std: number, show: boolean};
    vwap: {session: string, show: boolean};
    atr: {len: number, show: boolean};
    volume: {show: boolean};
    volumeProfile: {show: boolean};
    orderFlow: {show: boolean};
  };
  compare: string[];
  fxEffects: boolean;
  glowIntensity: 'low' | 'med' | 'high';
  colorMode: 'teal' | 'magenta' | 'lime';
}

interface AIInsight {
  pattern: string;
  confidence: number;
  description: string;
  zones: Array<{x: number, y: number, width: number, height: number}>;
}

interface AdvancedTradingChartProps { onNavigate?: (section: string) => void }

export const AdvancedTradingChart: React.FC<AdvancedTradingChartProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('chart');
  const [searchSymbol, setSearchSymbol] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bottomPaneOpen, setBottomPaneOpen] = useState(true);
  const [bottomPaneHeight, setBottomPaneHeight] = useState(200);
  const [activeSection, setActiveSection] = useState('Finance');
  const [scrollY, setScrollY] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [replayMode, setReplayMode] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState(1);
  const [replayPlaying, setReplayPlaying] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(42982.60);
  const [priceChange, setPriceChange] = useState(2.34);
  
  const [chartState, setChartState] = useState<ChartState>({
    symbol: "BTCUSDT",
    exchange: "BINANCE",
    assetType: "Crypto",
    timeframe: "1h",
    indicators: {
      sma: [
        {len: 20, show: true, color: '#00E5FF'},
        {len: 50, show: true, color: '#FF6B6B'},
        {len: 200, show: false, color: '#4ECDC4'}
      ],
      ema: [
        {len: 9, show: false, color: '#FFE66D'}
      ],
      rsi: {len: 14, upper: 70, lower: 30, show: true},
      macd: {fast: 12, slow: 26, signal: 9, show: false},
      bb: {len: 20, std: 2, show: false},
      vwap: {session: "session", show: false},
      atr: {len: 14, show: false},
      volume: {show: true},
      volumeProfile: {show: false},
      orderFlow: {show: false}
    },
    compare: [],
    fxEffects: true,
    glowIntensity: 'med',
    colorMode: 'teal'
  });

  const [aiInsights, setAiInsights] = useState<AIInsight[]>([
    {
      pattern: "Bullish Engulfing",
      confidence: 87,
      description: "Strong reversal pattern detected at support level",
      zones: [{x: 60, y: 40, width: 8, height: 15}]
    },
    {
      pattern: "Ascending Triangle",
      confidence: 73,
      description: "Consolidation pattern suggesting upward breakout",
      zones: [{x: 25, y: 30, width: 20, height: 25}]
    }
  ]);

  // Handle scroll behavior for header
  useEffect(() => {
    let lastScrollY = 0;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      
      setScrollY(currentScrollY);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!replayMode) {
        const change = (Math.random() - 0.5) * 20;
        setCurrentPrice(prev => Math.max(0, prev + change));
        setPriceChange(prev => prev + (Math.random() - 0.5) * 0.1);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [replayMode]);

  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1D', '1W', '1M'];
  const cryptoExchanges = ['BINANCE', 'COINBASE', 'BYBIT', 'KRAKEN'];
  const stockExchanges = ['NASDAQ', 'NYSE', 'LSE'];
  
  const handleSearch = () => {
    if (searchSymbol.trim()) {
      setChartState(prev => ({
        ...prev,
        symbol: searchSymbol.toUpperCase().trim()
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleIndicator = (category: string, field?: string, index?: number) => {
    setChartState(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        [category]: field && index !== undefined ? 
          prev.indicators[category as keyof typeof prev.indicators].map((item: any, i: number) => 
            i === index ? { ...item, [field]: !item[field] } : item
          ) :
          field ? {
            ...prev.indicators[category as keyof typeof prev.indicators],
            [field]: !prev.indicators[category as keyof typeof prev.indicators][field as any]
          } : {
            ...prev.indicators[category as keyof typeof prev.indicators],
            show: !prev.indicators[category as keyof typeof prev.indicators].show
          }
      }
    }));
  };

  const colorModeColors = {
    teal: { primary: '#00E5FF', secondary: '#4ECDC4', accent: '#26A69A' },
    magenta: { primary: '#FF6B9D', secondary: '#C44569', accent: '#F8B500' },
    lime: { primary: '#32FF7E', secondary: '#7ED321', accent: '#F7DC6F' }
  };

  const currentColors = colorModeColors[chartState.colorMode];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1222] via-[#1A1F3A] to-[#0F1222] text-white pb-8">
      {/* Main Header */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        !headerVisible && "transform -translate-y-full",
        scrollY > 24 && "shadow-lg shadow-black/20"
      )}>
        <ResponsiveModernHeader
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onNavigate={(section) => {
            setActiveSection(section);
            onNavigate?.(section);
          }}
          currentMoodScore={72}
        />
      </div>

      {/* Global Toolbar */}
      <div className="relative z-40 bg-[#0F1222]/95 backdrop-blur-xl border-b border-gray-800/50 px-4 md:px-6 py-3 trading-toolbar">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-4">
          {/* Left Section - Search & Controls */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 trading-toolbar-row">
            {/* Symbol Search */}
            <div className="relative flex-1 max-w-md md:max-w-lg trading-symbol-search">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 trading-focus"
                placeholder="Search symbol… BTC, ETH, AAPL"
                value={searchSymbol}
                onChange={(e) => setSearchSymbol(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>

            {/* Market Toggle */}
            <div className="flex rounded-lg bg-gray-800/50 border border-gray-700/50 p-1 trading-market-toggle">
              <button
                className={cn(
                  "px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-all",
                  chartState.assetType === 'Crypto'
                    ? `bg-[${currentColors.primary}] text-black shadow-lg`
                    : "text-gray-300 hover:text-white"
                )}
                onClick={() => setChartState(prev => ({ ...prev, assetType: 'Crypto' }))}
              >
                Crypto
              </button>
              <button
                className={cn(
                  "px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-all",
                  chartState.assetType === 'Stocks'
                    ? `bg-[${currentColors.primary}] text-black shadow-lg`
                    : "text-gray-300 hover:text-white"
                )}
                onClick={() => setChartState(prev => ({ ...prev, assetType: 'Stocks' }))}
              >
                Stocks
              </button>
            </div>

            {/* Exchange Selector */}
            <select
              className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 md:px-4 py-2 text-white text-xs md:text-sm focus:border-cyan-400 focus:ring-cyan-400/20 trading-exchange-select trading-focus"
              value={chartState.exchange}
              onChange={(e) => setChartState(prev => ({ ...prev, exchange: e.target.value }))}
            >
              {(chartState.assetType === 'Crypto' ? cryptoExchanges : stockExchanges).map(exchange => (
                <option key={exchange} value={exchange} className="bg-gray-800">{exchange}</option>
              ))}
            </select>
          </div>

          {/* Center Section - Timeframes */}
          <div className="flex gap-1 md:gap-2 overflow-x-auto trading-timeframes">
            {timeframes.map(tf => (
              <button
                key={tf}
                className={cn(
                  "px-2 md:px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap trading-timeframe-btn",
                  chartState.timeframe === tf
                    ? `bg-[${currentColors.primary}] text-black shadow-lg`
                    : "bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50"
                )}
                onClick={() => setChartState(prev => ({ ...prev, timeframe: tf }))}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 md:gap-3 trading-actions">
            <Button variant="outline" size="sm" className="border-gray-700/50 hover:border-cyan-400/50 hidden md:flex">
              <Settings className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Theme</span>
            </Button>
            <Button variant="outline" size="sm" className="border-gray-700/50 hover:border-cyan-400/50 hidden md:flex">
              <Camera className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Snapshot</span>
            </Button>
            <Button
              className={`bg-[${currentColors.primary}] hover:bg-[${currentColors.secondary}] text-black`}
              size="sm"
            >
              <Save className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Save</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden border-gray-700/50"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 min-h-[calc(100vh-140px)] trading-chart-mobile">
        {/* Chart Workbench */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Chart Tabs */}
          <div className="px-6 pt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between mb-4">
                <TabsList className="bg-gray-800/50 border border-gray-700/50">
                  <TabsTrigger 
                    value="chart" 
                    className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Chart
                  </TabsTrigger>
                  <TabsTrigger 
                    value="replay" 
                    className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Replay
                  </TabsTrigger>
                  <TabsTrigger 
                    value="strategy" 
                    className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Strategy Tester
                  </TabsTrigger>
                </TabsList>

                {/* Chart Controls */}
                <div className="flex items-center gap-1 md:gap-2 trading-chart-controls">
                  <Button variant="outline" size="sm" className="border-gray-700/50">
                    <Crosshair className="w-4 h-4 md:mr-1" />
                    <span className="hidden md:inline">Crosshair</span>
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-700/50">
                    <BarChart3 className="w-4 h-4 md:mr-1" />
                    <span className="hidden md:inline">Log</span>
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-700/50">
                    <Maximize className="w-4 h-4 md:mr-1" />
                    <span className="hidden md:inline">Auto-Fit</span>
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-700/50">
                    <Plus className="w-4 h-4 md:mr-1" />
                    <span className="hidden md:inline">Compare</span>
                  </Button>
                </div>
              </div>

              <TabsContent value="chart" className="mt-0">
                {/* Chart Canvas */}
                <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl border border-gray-700/50 h-[400px] md:h-[500px] trading-chart-canvas">
                  {/* Grid Background */}
                  <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full">
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#333" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>

                  {/* Chart Content */}
                  <div className="relative z-10 p-6 h-full">
                    {/* Price Display */}
                    <div className="absolute top-3 md:top-6 left-3 md:left-6 z-20 trading-price-display">
                      <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-gray-700/50">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div>
                            <div className="text-xl md:text-3xl font-bold text-cyan-400">
                              ${currentPrice.toFixed(2)}
                            </div>
                            <div className={cn(
                              "text-xs md:text-sm font-medium flex items-center gap-1",
                              priceChange >= 0 ? "text-green-400" : "text-red-400"
                            )}>
                              {priceChange >= 0 ? <TrendingUp className="w-3 md:w-4 h-3 md:h-4" /> : <TrendingDown className="w-3 md:w-4 h-3 md:h-4" />}
                              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                              <span className="hidden md:inline">
                                ({priceChange >= 0 ? '+' : ''}${(currentPrice * priceChange / 100).toFixed(2)})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Symbol Info */}
                    <div className="absolute top-3 md:top-6 right-3 md:right-6 z-20 trading-symbol-info">
                      <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-gray-700/50">
                        <div className="text-right">
                          <div className="text-lg md:text-xl font-bold">{chartState.symbol}</div>
                          <div className="text-xs md:text-sm text-gray-400">{chartState.exchange}</div>
                        </div>
                      </div>
                    </div>

                    {/* Simulated Chart */}
                    <svg className="w-full h-full">
                      <g transform="translate(60, 40)">
                        {/* Main Chart Line */}
                        <polyline
                          points="0,200 50,180 100,220 150,190 200,150 250,180 300,160 350,140 400,170 450,130 500,160"
                          fill="none"
                          stroke={currentColors.primary}
                          strokeWidth="3"
                          className="drop-shadow-lg"
                          style={{ 
                            filter: chartState.fxEffects ? `drop-shadow(0 0 8px ${currentColors.primary}66)` : 'none'
                          }}
                        />
                        
                        {/* Volume Bars */}
                        {chartState.indicators.volume.show && Array.from({length: 25}, (_, i) => (
                          <rect
                            key={i}
                            x={i * 20}
                            y={350}
                            width="12"
                            height={Math.random() * 40 + 10}
                            fill={currentColors.secondary}
                            opacity="0.6"
                          />
                        ))}

                        {/* SMA Lines */}
                        {chartState.indicators.sma.map((sma, index) => sma.show && (
                          <polyline
                            key={index}
                            points={`0,${210 + index * 10} 50,${190 + index * 10} 100,${230 + index * 10} 150,${200 + index * 10} 200,${160 + index * 10} 250,${190 + index * 10} 300,${170 + index * 10} 350,${150 + index * 10} 400,${180 + index * 10} 450,${140 + index * 10} 500,${170 + index * 10}`}
                            fill="none"
                            stroke={sma.color}
                            strokeWidth="2"
                            opacity="0.8"
                          />
                        ))}
                      </g>
                    </svg>

                    {/* AI Pattern Overlays */}
                    {aiInsights.map((insight, index) => (
                      <div
                        key={index}
                        className="absolute bg-cyan-400/20 border border-cyan-400/40 rounded-lg p-2 text-xs"
                        style={{
                          left: `${insight.zones[0].x}%`,
                          top: `${insight.zones[0].y}%`,
                          width: `${insight.zones[0].width}%`,
                          height: `${insight.zones[0].height}%`
                        }}
                      >
                        <div className="text-cyan-400 font-medium">{insight.pattern}</div>
                        <div className="text-gray-300">{insight.confidence}%</div>
                      </div>
                    ))}
                  </div>

                </div>
              </TabsContent>

              <TabsContent value="replay" className="mt-0">
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl border border-gray-700/50 h-[500px] flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
                    <h3 className="text-xl font-bold mb-2">Chart Replay Mode</h3>
                    <p className="text-gray-400 mb-6">Replay historical market data step by step</p>
                    
                    {/* Replay Controls */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <Button variant="outline" size="sm">
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setReplayPlaying(!replayPlaying)}
                      >
                        {replayPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm">
                        <SkipForward className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Speed Controls */}
                    <div className="flex items-center justify-center gap-2">
                      {[0.5, 1, 2, 4].map(speed => (
                        <button
                          key={speed}
                          className={cn(
                            "px-3 py-1 rounded text-sm",
                            replaySpeed === speed 
                              ? "bg-cyan-400 text-black" 
                              : "bg-gray-700 text-gray-300"
                          )}
                          onClick={() => setReplaySpeed(speed)}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="strategy" className="mt-0">
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl border border-gray-700/50 h-[500px] flex items-center justify-center">
                  <div className="text-center">
                    <Target className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
                    <h3 className="text-xl font-bold mb-2">Strategy Tester</h3>
                    <p className="text-gray-400 mb-6">Backtest your trading strategies with historical data</p>
                    
                    {/* Strategy Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                      {[
                        { label: "Win Rate", value: "68.4%", color: "text-green-400" },
                        { label: "Profit Factor", value: "2.31", color: "text-cyan-400" },
                        { label: "Max Drawdown", value: "-12.3%", color: "text-red-400" },
                        { label: "Sharpe Ratio", value: "1.87", color: "text-yellow-400" }
                      ].map((stat, index) => (
                        <div key={index} className="bg-gray-800/50 rounded-lg p-3">
                          <div className="text-sm text-gray-400">{stat.label}</div>
                          <div className={cn("text-xl font-bold", stat.color)}>{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Bottom Oscillator Pane */}
          {bottomPaneOpen && (
            <div className="px-4 md:px-6 pb-4 md:pb-6">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl border border-gray-700/50 p-3 md:p-4 trading-bottom-pane">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="flex items-center gap-2 md:gap-4">
                    <h3 className="text-base md:text-lg font-semibold">RSI (14)</h3>
                    <Badge variant="secondary" className="bg-cyan-400/20 text-cyan-400 text-xs md:text-sm">
                      65.3
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBottomPaneOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="h-20 md:h-32 relative">
                  {/* RSI Levels */}
                  <div className="absolute top-2 left-0 right-0 h-px bg-red-400/30"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-600"></div>
                  <div className="absolute bottom-2 left-0 right-0 h-px bg-green-400/30"></div>
                  
                  {/* RSI Line */}
                  <svg className="w-full h-full">
                    <polyline
                      points="0,80 50,65 100,55 150,70 200,60 250,45 300,65 350,55 400,70 450,60 500,65"
                      fill="none"
                      stroke={currentColors.primary}
                      strokeWidth="2"
                      className="drop-shadow-lg"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className={cn(
          "w-80 bg-gray-900/50 border-l border-gray-700/50 transition-all duration-300 trading-sidebar",
          sidebarOpen ? "open" : "",
          "lg:translate-x-0"
        )}>
          <ScrollArea className="h-screen trading-scrollbar">
            <div className="p-6 space-y-6">
              {/* Indicators Section */}
              <Card className="bg-gray-800/30 border-gray-700/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* SMA Controls */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">SMA</span>
                      <div className="flex gap-2">
                        {chartState.indicators.sma.map((sma, index) => (
                          <Button
                            key={index}
                            variant={sma.show ? "default" : "outline"}
                            size="sm"
                            className="w-12 h-8 text-xs"
                            onClick={() => toggleIndicator('sma', 'show', index)}
                          >
                            {sma.len}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* RSI Controls */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">RSI</span>
                      <Button
                        variant={chartState.indicators.rsi.show ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleIndicator('rsi', 'show')}
                      >
                        {chartState.indicators.rsi.show ? 'ON' : 'OFF'}
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Input 
                        placeholder="14" 
                        className="h-8 text-xs bg-gray-700/50 border-gray-600" 
                      />
                      <Input 
                        placeholder="70" 
                        className="h-8 text-xs bg-gray-700/50 border-gray-600" 
                      />
                      <Input 
                        placeholder="30" 
                        className="h-8 text-xs bg-gray-700/50 border-gray-600" 
                      />
                    </div>
                  </div>

                  {/* Volume */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Volume</span>
                    <Button
                      variant={chartState.indicators.volume.show ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleIndicator('volume', 'show')}
                    >
                      {chartState.indicators.volume.show ? 'ON' : 'OFF'}
                    </Button>
                  </div>

                  <Button 
                    className={`w-full bg-[${currentColors.primary}] hover:bg-[${currentColors.secondary}] text-black`}
                  >
                    Apply to Chart
                  </Button>
                </CardContent>
              </Card>

              {/* Futuristic FX Section */}
              <Card className="bg-gray-800/30 border-gray-700/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    Futuristic FX
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">FX Effects</span>
                    <Button
                      variant={chartState.fxEffects ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartState(prev => ({...prev, fxEffects: !prev.fxEffects}))}
                    >
                      {chartState.fxEffects ? 'ON' : 'OFF'}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">Glow Intensity</span>
                    <div className="grid grid-cols-3 gap-2">
                      {(['low', 'med', 'high'] as const).map(intensity => (
                        <Button
                          key={intensity}
                          variant={chartState.glowIntensity === intensity ? "default" : "outline"}
                          size="sm"
                          className="text-xs"
                          onClick={() => setChartState(prev => ({...prev, glowIntensity: intensity}))}
                        >
                          {intensity.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">Color Mode</span>
                    <div className="grid grid-cols-3 gap-2">
                      {(['teal', 'magenta', 'lime'] as const).map(color => (
                        <Button
                          key={color}
                          variant={chartState.colorMode === color ? "default" : "outline"}
                          size="sm"
                          className="text-xs"
                          onClick={() => setChartState(prev => ({...prev, colorMode: color}))}
                        >
                          {color.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights Section */}
              <Card className="bg-gray-800/30 border-gray-700/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-cyan-400" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Pattern Recognition */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-cyan-400">Pattern Recognition</h4>
                    {aiInsights.map((insight, index) => (
                      <div key={index} className="bg-gray-700/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{insight.pattern}</span>
                          <Badge variant="secondary" className={cn(
                            insight.confidence > 80 ? "bg-green-400/20 text-green-400" :
                            insight.confidence > 60 ? "bg-yellow-400/20 text-yellow-400" :
                            "bg-red-400/20 text-red-400"
                          )}>
                            {insight.confidence}%
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400">{insight.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Sentiment Score */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-cyan-400">Sentiment Score</h4>
                    <div className="bg-gray-700/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Overall Sentiment</span>
                        <span className="text-lg font-bold text-green-400">+72</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{width: '72%'}}></div>
                      </div>
                    </div>
                  </div>

                  {/* Smart Alerts */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-cyan-400">Smart Alerts</h4>
                    <div className="space-y-2">
                      {[
                        "RSI Divergence Detected",
                        "MA Cross Approaching",
                        "Key Level Break Alert"
                      ].map((alert, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-700/30 rounded-lg p-2">
                          <span className="text-xs">{alert}</span>
                          <Button size="sm" variant="outline" className="h-6 text-xs">
                            Create
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
