import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Search, Zap, Settings, Camera, Save, User, Monitor, 
  TrendingUp, TrendingDown, BarChart3, Activity, Volume2,
  Eye, Crosshair, Maximize, Plus, ChevronDown, ChevronRight,
  Play, Pause, SkipBack, SkipForward, RefreshCw, Target,
  DollarSign, Clock, Flame, Brain, Layers, Filter, X,
  Menu, Smartphone, Tablet, LineChart, CandlestickChart
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ResponsiveModernHeader } from '../ResponsiveModernHeader';

interface ChartState {
  symbol: string;
  exchange: string;
  assetType: 'Crypto' | 'Stocks';
  timeframe: string;
  indicators: {
    sma: Array<{len: number, show: boolean}>;
    ema: Array<{len: number, show: boolean}>;
    rsi: {len: number, upper: number, lower: number, show: boolean};
    macd: {fast: number, slow: number, signal: number, show: boolean};
    bb: {len: number, std: number, show: boolean};
    vwap: {session: string, show: boolean};
    atr: {len: number, show: boolean};
    ichimoku: {conversion: number, base: number, spanB: number, displacement: number, show: boolean};
  };
  compare: string[];
}

interface AdvancedChartsProProps { onNavigate?: (section: string) => void }

export const AdvancedChartsPro: React.FC<AdvancedChartsProProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('chart');
  const [searchSymbol, setSearchSymbol] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [activeSection, setActiveSection] = useState('Finance');
  
  const [chartState, setChartState] = useState<ChartState>({
    symbol: "BTCUSDT",
    exchange: "BINANCE",
    assetType: "Crypto",
    timeframe: "1h",
    indicators: {
      sma: [
        {len: 20, show: true},
        {len: 50, show: true},
        {len: 200, show: false}
      ],
      ema: [
        {len: 9, show: false}
      ],
      rsi: {len: 14, upper: 70, lower: 30, show: true},
      macd: {fast: 12, slow: 26, signal: 9, show: true},
      bb: {len: 20, std: 2, show: false},
      vwap: {session: "session", show: false},
      atr: {len: 14, show: false},
      ichimoku: {conversion: 9, base: 26, spanB: 52, displacement: 26, show: false}
    },
    compare: []
  });

  // Handle scroll behavior for header
  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine scroll direction and header visibility
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past threshold - hide header
        setHeaderVisible(false);
      } else {
        // Scrolling up or at top - show header
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

  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1D', '1W', '1M'];
  
  const cryptoExchanges = ['BINANCE', 'COINBASE', 'BYBIT'];
  const stockExchanges = ['NASDAQ', 'NYSE'];
  
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

  const toggleIndicator = (indicator: string, field?: string) => {
    setChartState(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        [indicator]: field ? {
          ...prev.indicators[indicator as keyof typeof prev.indicators],
          [field]: !prev.indicators[indicator as keyof typeof prev.indicators][field as any]
        } : {
          ...prev.indicators[indicator as keyof typeof prev.indicators],
          show: !prev.indicators[indicator as keyof typeof prev.indicators].show
        }
      }
    }));
  };

  return (
    <div className="ns-chart-page">
      {/* Main Header */}
      <ResponsiveModernHeader
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onNavigate={(section) => {
          setActiveSection(section);
          onNavigate?.(section);
        }}
        currentMoodScore={72}
      />

      {/* Top Toolbar */}
      <div className={cn(
        "ns-chart-header",
        "transition-all duration-300 ease-in-out",
        !headerVisible && "transform -translate-y-full",
        scrollY > 24 && "shadow-lg shadow-black/20"
      )}>
        <div className="ns-search-container">
          {/* Global Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <Input
              className="ns-search-input"
              placeholder="Search symbol… (e.g., BTC/USDT, ETH, AAPL)"
              value={searchSymbol}
              onChange={(e) => setSearchSymbol(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            
            {/* Asset Type Toggle */}
            <div className="ns-chip-group">
              <button
                className={cn("ns-chip", chartState.assetType === 'Crypto' && "active")}
                onClick={() => setChartState(prev => ({ ...prev, assetType: 'Crypto' }))}
              >
                Crypto
              </button>
              <button
                className={cn("ns-chip", chartState.assetType === 'Stocks' && "active")}
                onClick={() => setChartState(prev => ({ ...prev, assetType: 'Stocks' }))}
              >
                Stocks
              </button>
            </div>
            
            {/* Exchange Dropdown */}
            <select
              className="ns-search-input"
              style={{ width: 'auto', minWidth: '120px' }}
              value={chartState.exchange}
              onChange={(e) => setChartState(prev => ({ ...prev, exchange: e.target.value }))}
            >
              {(chartState.assetType === 'Crypto' ? cryptoExchanges : stockExchanges).map(exchange => (
                <option key={exchange} value={exchange}>{exchange}</option>
              ))}
            </select>
            
            <Button onClick={handleSearch} className="ns-action-btn">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
          
          {/* Timeframes */}
          <div className="ns-timeframes">
            {timeframes.map(tf => (
              <button
                key={tf}
                className={cn("ns-timeframe-btn", chartState.timeframe === tf && "active")}
                onClick={() => setChartState(prev => ({ ...prev, timeframe: tf }))}
              >
                {tf}
              </button>
            ))}
          </div>
          
          {/* Quick Actions */}
          <div className="ns-quick-actions">
            <button className="ns-action-btn">
              <Settings className="w-4 h-4 mr-1" />
              Theme
            </button>
            <button className="ns-action-btn">
              <Camera className="w-4 h-4 mr-1" />
              Snapshot
            </button>
            <button className="ns-action-btn">
              <Save className="w-4 h-4 mr-1" />
              Save
            </button>
            <button 
              className="ns-action-btn md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ns-main">
        <div className="ns-workspace">
          {/* Chart Section */}
          <div className="ns-chart-section">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <TabsList className="bg-gray-800/50">
                  <TabsTrigger value="chart" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                    Chart
                  </TabsTrigger>
                  <TabsTrigger value="replay" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                    Replay
                  </TabsTrigger>
                  <TabsTrigger value="strategy" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                    Strategy Tester
                  </TabsTrigger>
                </TabsList>
                
                {/* Chart Toolbar */}
                <div className="ns-chart-toolbar">
                  <button className="ns-toolbar-btn active">
                    <Crosshair className="w-4 h-4 mr-1" />
                    Crosshair
                  </button>
                  <button className="ns-toolbar-btn">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Log
                  </button>
                  <button className="ns-toolbar-btn">
                    <Maximize className="w-4 h-4 mr-1" />
                    Auto-Fit
                  </button>
                  <button className="ns-toolbar-btn">
                    <Plus className="w-4 h-4 mr-1" />
                    Compare
                  </button>
                </div>
              </div>

              <TabsContent value="chart" className="mt-0">
                {/* Holographic Chart Canvas */}
                <div className="ns-holo-card ns-grid ns-radial ns-scan" style={{ height: '500px', position: 'relative' }}>
                  
                  {/* Chart Root */}
                  <div 
                    id="ns-chart-root"
                    data-symbol={chartState.symbol}
                    data-timeframe={chartState.timeframe}
                    style={{
                      position: 'relative',
                      zIndex: '10',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {/* Simulated Chart Display */}
                    <div style={{ position: 'absolute', inset: '16px', zIndex: '10' }}>
                      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <svg style={{ width: '100%', height: '100%', opacity: '0.3' }}>
                          <defs>
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#333" strokeWidth="0.5"/>
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                        
                        {/* Simulated Candlestick Chart */}
                        <svg style={{ position: 'absolute', inset: '0', width: '100%', height: '100%' }}>
                          <g transform="translate(40, 20)">
                            <polyline
                              points="0,150 30,120 60,180 90,140 120,100 150,160 180,130 210,90 240,110 270,80 300,120"
                              fill="none"
                              stroke="#00E5FF"
                              strokeWidth="2"
                              className="ns-glow-line"
                              style={{ opacity: '0.8' }}
                            />
                            {Array.from({length: 15}, (_, i) => (
                              <rect
                                key={i}
                                x={i * 20}
                                y={200 + Math.random() * 40}
                                width="12"
                                height={Math.random() * 60 + 10}
                                fill="#666"
                                opacity="0.4"
                              />
                            ))}
                          </g>
                        </svg>
                        
                        {/* Holographic Price Display */}
                        <div style={{ position: 'absolute', top: '16px', left: '16px', color: 'white' }}>
                          <div className="ns-value-badge" style={{ display: 'inline-block' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00E5FF' }}>
                              ${(42680 + Math.random() * 1000).toFixed(2)}
                            </div>
                          </div>
                          <div style={{ fontSize: '14px', color: '#4ade80', marginTop: '8px' }} className="ns-glow-line">
                            +2.34% (+$986.23)
                          </div>
                        </div>
                        
                        {/* Symbol Info & FX Controls */}
                        <div style={{ position: 'absolute', top: '16px', right: '16px', color: 'white', textAlign: 'right' }}>
                          <div style={{ fontSize: '18px', fontWeight: '600' }}>{chartState.symbol}</div>
                          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>{chartState.exchange}</div>
                        </div>
                        
                        {/* Futuristic FX Controls */}
                        <div className="ns-fx-controls">
                          <div className="ns-fx-toggle active">FX ON</div>
                          <div className="ns-fx-toggle">GRID</div>
                          <div className="ns-fx-toggle">TEAL</div>
                        </div>
                        
                        {/* AI Pattern Tags */}
                        <div className="ns-ai-tag" style={{left: '25%', top: '30%'}}>
                          🔺 Bullish Engulfing
                        </div>
                        <div className="ns-ai-tag" style={{right: '20%', bottom: '25%'}}>
                          📈 Support Level
                        </div>
                        
                        {/* Holographic Crosshair */}
                        <div className="ns-crosshair" style={{left: '60%', top: '40%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Indicator Panels */}
                {chartState.indicators.rsi.show && (
                  <div className="ns-indicator-panel mt-4 p-4 rounded-lg">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>
                        RSI ({chartState.indicators.rsi.len})
                      </span>
                      <div className="ns-value-badge">
                        <div style={{ color: '#60a5fa' }}>65.3</div>
                      </div>
                    </div>
                    <div style={{ height: '80px', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '8px', left: '0', right: '0', height: '1px', background: 'rgba(239, 68, 68, 0.3)' }}></div>
                      <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '1px', background: '#6b7280' }}></div>
                      <div style={{ position: 'absolute', bottom: '8px', left: '0', right: '0', height: '1px', background: 'rgba(34, 197, 94, 0.3)' }}></div>
                      <svg style={{ width: '100%', height: '100%' }}>
                        <polyline
                          points="0,60 50,45 100,35 150,50 200,40 250,30 300,45"
                          fill="none"
                          stroke="#60a5fa"
                          strokeWidth="2"
                          className="ns-glow-line"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="replay" className="mt-0">
                <div className="ns-holo-card" style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
                    <Play className="w-16 h-16 mx-auto mb-4" />
                    <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Chart Replay Mode</h3>
                    <p>Replay historical market data step by step</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="strategy" className="mt-0">
                <div className="ns-holo-card" style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
                    <Target className="w-16 h-16 mx-auto mb-4" />
                    <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Strategy Tester</h3>
                    <p>Backtest your trading strategies</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className={cn("ns-sidebar", sidebarOpen && "open")}>
            {/* Indicators Section */}
            <div className="ns-sidebar-section">
              <div className="ns-sidebar-title">
                <Activity className="w-5 h-5" />
                Indicators
              </div>
              
              {/* SMA Controls */}
              <div className="ns-indicator-control">
                <div className="ns-indicator-header">
                  <span className="ns-indicator-label">SMA</span>
                  <div 
                    className={cn("ns-toggle", chartState.indicators.sma[0].show && "active")}
                    onClick={() => toggleIndicator('sma', 'show')}
                  ></div>
                </div>
                <div className="ns-indicator-inputs">
                  <input className="ns-mini-input" placeholder="20" />
                  <input className="ns-mini-input" placeholder="50" />
                  <input className="ns-mini-input" placeholder="200" />
                </div>
              </div>

              {/* RSI Controls */}
              <div className="ns-indicator-control">
                <div className="ns-indicator-header">
                  <span className="ns-indicator-label">RSI</span>
                  <div 
                    className={cn("ns-toggle", chartState.indicators.rsi.show && "active")}
                    onClick={() => toggleIndicator('rsi', 'show')}
                  ></div>
                </div>
                <div className="ns-indicator-inputs">
                  <input className="ns-mini-input" placeholder="14" />
                  <input className="ns-mini-input" placeholder="70" />
                  <input className="ns-mini-input" placeholder="30" />
                </div>
              </div>

              {/* MACD Controls */}
              <div className="ns-indicator-control">
                <div className="ns-indicator-header">
                  <span className="ns-indicator-label">MACD</span>
                  <div 
                    className={cn("ns-toggle", chartState.indicators.macd.show && "active")}
                    onClick={() => toggleIndicator('macd', 'show')}
                  ></div>
                </div>
                <div className="ns-indicator-inputs">
                  <input className="ns-mini-input" placeholder="12" />
                  <input className="ns-mini-input" placeholder="26" />
                  <input className="ns-mini-input" placeholder="9" />
                </div>
              </div>

              <button className="ns-apply-btn">
                Apply to Chart
              </button>
            </div>

            {/* Futuristic FX Section */}
            <div className="ns-sidebar-section">
              <div className="ns-sidebar-title">
                <Zap className="w-5 h-5" />
                Futuristic FX
              </div>
              
              <div className="ns-indicator-control">
                <div className="ns-indicator-header">
                  <span className="ns-indicator-label">FX Effects</span>
                  <div className="ns-toggle active"></div>
                </div>
              </div>
              
              <div className="ns-indicator-control">
                <div className="ns-indicator-header">
                  <span className="ns-indicator-label">Glow Intensity</span>
                </div>
                <div className="ns-indicator-inputs">
                  <button className="ns-mini-input">Low</button>
                  <button className="ns-mini-input active">Med</button>
                  <button className="ns-mini-input">High</button>
                </div>
              </div>
              
              <div className="ns-indicator-control">
                <div className="ns-indicator-header">
                  <span className="ns-indicator-label">Color Mode</span>
                </div>
                <div className="ns-indicator-inputs">
                  <button className="ns-mini-input active">Teal</button>
                  <button className="ns-mini-input">Magenta</button>
                  <button className="ns-mini-input">Lime</button>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="ns-sidebar-section">
              <div className="ns-sidebar-title">
                <Brain className="w-5 h-5" />
                AI Insights
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                AI pattern recognition and market analysis coming soon...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
