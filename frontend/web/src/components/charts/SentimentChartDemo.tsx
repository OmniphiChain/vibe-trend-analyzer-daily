/**
 * SentimentChart Demo & Testing Page
 * Shows usage examples and testing scenarios
 */

import React, { useState, useEffect } from 'react';
import { SentimentChart, generateMockChartData, TimeFrame } from './index';
import { ChartPoint } from './chartTypes';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const DEMO_ASSETS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'GOOGL', name: 'Alphabet' },
  { symbol: 'TSLA', name: 'Tesla' },
  { symbol: 'NVDA', name: 'NVIDIA' },
];

export const SentimentChartDemo: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<string>('AAPL');
  const [selectedInterval, setSelectedInterval] = useState<TimeFrame>('1d');
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load chart data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API delay
    const timer = setTimeout(() => {
      const data = generateMockChartData(selectedAsset, selectedInterval, 100);
      setChartData(data);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedAsset, selectedInterval]);

  const handleTimeframeChange = (timeframe: TimeFrame) => {
    setSelectedInterval(timeframe);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] to-[#1a1f35] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">NeomSense Sentiment Chart</h1>
          <p className="text-gray-400">
            TradingView-style charts with AI sentiment overlays
          </p>
        </div>

        {/* Controls */}
        <Card className="bg-gray-900/50 border-gray-700/50 mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Chart Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Asset Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Asset
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {DEMO_ASSETS.map((asset) => (
                    <Button
                      key={asset.symbol}
                      variant={selectedAsset === asset.symbol ? 'default' : 'outline'}
                      onClick={() => setSelectedAsset(asset.symbol)}
                      className="text-sm"
                      disabled={isLoading}
                    >
                      {asset.symbol}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Data Info */}
              {chartData.length > 0 && (
                <div className="pt-4 border-t border-gray-700/50">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Data Points</div>
                      <div className="font-semibold">{chartData.length}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Latest Price</div>
                      <div className="font-semibold">
                        ${chartData[chartData.length - 1]?.close.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Avg Sentiment</div>
                      <div className="font-semibold">
                        {(
                          chartData.reduce((sum, p) => sum + p.sentiment, 0) /
                          chartData.length
                        ).toFixed(3)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Confidence</div>
                      <div className="font-semibold">
                        {(
                          chartData.reduce((sum, p) => sum + (p.confidence || 0), 0) /
                          chartData.length
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chart */}
        <div className="mb-6">
          {isLoading ? (
            <div className="h-96 bg-gray-900/50 rounded-2xl border border-gray-700/50 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin text-2xl mb-2">⏳</div>
                <p className="text-gray-400">Loading chart data...</p>
              </div>
            </div>
          ) : (
            <SentimentChart
              data={chartData}
              asset={selectedAsset}
              interval={selectedInterval}
              onTimeframeChange={handleTimeframeChange}
              height={600}
              showSentiment={true}
              showConfidenceBand={true}
              showEvents={true}
              showMomentum={true}
            />
          )}
        </div>

        {/* Documentation */}
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-lg">Usage Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="bg-gray-800/50">
                <TabsTrigger value="basic">Basic Usage</TabsTrigger>
                <TabsTrigger value="data">Data Schema</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <p className="text-sm text-gray-300">
                  The simplest way to use SentimentChart:
                </p>
                <pre className="bg-gray-950 p-4 rounded text-xs text-cyan-400 overflow-x-auto">
{`import { SentimentChart, generateMockChartData } from '@/components/charts';

function MyChart() {
  const data = generateMockChartData('AAPL', '1d', 100);
  
  return (
    <SentimentChart
      data={data}
      asset="AAPL"
      interval="1d"
      onTimeframeChange={(tf) => console.log(tf)}
      height={600}
    />
  );
}`}
                </pre>
              </TabsContent>

              <TabsContent value="data" className="space-y-4">
                <p className="text-sm text-gray-300">
                  Chart data structure (ChartPoint):
                </p>
                <pre className="bg-gray-950 p-4 rounded text-xs text-cyan-400 overflow-x-auto">
{`interface ChartPoint {
  time: number;              // UNIX timestamp
  open: number;              // OHLC
  high: number;
  low: number;
  close: number;
  
  sentiment: number;         // -1 to +1
  sentimentUpper?: number;   // Confidence band
  sentimentLower?: number;
  confidence?: number;       // 0 to 1
  
  momentum?: number;         // Centered around 0
  volume?: number;
  emotion?: {
    optimism?: number;
    fear?: number;
    anger?: number;
    neutral?: number;
  };
  events?: ChartEvent[];
}`}
                </pre>
              </TabsContent>

              <TabsContent value="features" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-950 rounded border border-gray-800">
                    <h4 className="font-semibold text-cyan-400 mb-2">✓ Price Candles</h4>
                    <p className="text-xs text-gray-400">
                      Standard OHLC candlestick rendering with professional styling
                    </p>
                  </div>
                  <div className="p-4 bg-gray-950 rounded border border-gray-800">
                    <h4 className="font-semibold text-cyan-400 mb-2">✓ Sentiment Overlay</h4>
                    <p className="text-xs text-gray-400">
                      Line series showing sentiment score (-1 to +1) with dynamic coloring
                    </p>
                  </div>
                  <div className="p-4 bg-gray-950 rounded border border-gray-800">
                    <h4 className="font-semibold text-cyan-400 mb-2">✓ Confidence Band</h4>
                    <p className="text-xs text-gray-400">
                      Semi-transparent upper/lower bounds showing signal strength
                    </p>
                  </div>
                  <div className="p-4 bg-gray-950 rounded border border-gray-800">
                    <h4 className="font-semibold text-cyan-400 mb-2">✓ Event Markers</h4>
                    <p className="text-xs text-gray-400">
                      Vertical markers for earnings, news, macroeconomic events
                    </p>
                  </div>
                  <div className="p-4 bg-gray-950 rounded border border-gray-800">
                    <h4 className="font-semibold text-cyan-400 mb-2">✓ Momentum Panel</h4>
                    <p className="text-xs text-gray-400">
                      Secondary chart panel for momentum/oscillator visualization
                    </p>
                  </div>
                  <div className="p-4 bg-gray-950 rounded border border-gray-800">
                    <h4 className="font-semibold text-cyan-400 mb-2">✓ Synced Controls</h4>
                    <p className="text-xs text-gray-400">
                      Crosshair, zoom, pan synchronized across all panels
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SentimentChartDemo;
