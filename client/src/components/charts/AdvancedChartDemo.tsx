/**
 * AdvancedSentimentChart Demo & Testing Page
 * Demonstrates professional TradingView-style charting with AI overlays
 */

import React, { useState, useEffect } from 'react';
import { AdvancedSentimentChart } from './AdvancedSentimentChart';
import {
  generateAdvancedChartData,
  generateAIPatterns,
  generateAdvancedChartResponse,
} from './mockAdvancedChartData';
import { TimeFrame } from './chartTypes';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const DEMO_ASSETS = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft', sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla', sector: 'Automotive' },
  { symbol: 'NVDA', name: 'NVIDIA', sector: 'Semiconductors' },
  { symbol: 'GOOGL', name: 'Alphabet', sector: 'Technology' },
];

export const AdvancedChartDemo: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState('AAPL');
  const [selectedInterval, setSelectedInterval] = useState<TimeFrame>('1d');
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load chart data with patterns
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const response = generateAdvancedChartResponse(selectedAsset, selectedInterval);
      setChartData(response);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedAsset, selectedInterval]);

  const handleTimeframeChange = (tf: TimeFrame) => {
    setSelectedInterval(tf);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] to-[#1a1f35] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">NeomSense Advanced Chart</h1>
          <p className="text-gray-400">
            Professional TradingView-style charts with AI sentiment intelligence and pattern overlays
          </p>
        </div>

        {/* Controls */}
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-lg">Chart Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                    className="text-sm h-10"
                    disabled={isLoading}
                  >
                    {asset.symbol}
                  </Button>
                ))}
              </div>
              {selectedAsset && (
                <div className="mt-3 p-3 bg-gray-950/50 rounded border border-gray-800">
                  <div className="text-sm font-semibold">
                    {DEMO_ASSETS.find((a) => a.symbol === selectedAsset)?.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {DEMO_ASSETS.find((a) => a.symbol === selectedAsset)?.sector}
                  </div>
                </div>
              )}
            </div>

            {/* Data Statistics */}
            {chartData && (
              <div className="pt-4 border-t border-gray-700/50">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Data Points</div>
                    <div className="font-semibold text-lg text-cyan-400">
                      {chartData.metadata.dataPoints}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Latest Price</div>
                    <div className="font-semibold text-lg text-cyan-400">
                      ${chartData.data[chartData.data.length - 1]?.close.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">AI Patterns</div>
                    <div className="font-semibold text-lg text-purple-400">
                      {chartData.patterns.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Avg Sentiment</div>
                    <div
                      className={`font-semibold text-lg ${
                        chartData.metadata.sentimentRange[1] > 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {(
                        chartData.data.reduce((sum: number, p: any) => sum + p.sentiment, 0) /
                        chartData.data.length
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Chart */}
        <div className="space-y-2">
          {isLoading ? (
            <div className="h-96 bg-gray-900/50 rounded-2xl border border-gray-700/50 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin text-3xl mb-3">⏳</div>
                <p className="text-gray-400">Loading professional chart...</p>
              </div>
            </div>
          ) : chartData ? (
            <AdvancedSentimentChart
              data={chartData.data}
              patterns={chartData.patterns}
              asset={selectedAsset}
              interval={selectedInterval}
              onTimeframeChange={handleTimeframeChange}
              options={{
                showToolbar: true,
                showHistogram: true,
                showMomentum: true,
                showPatterns: true,
                height: 800,
              }}
            />
          ) : null}
        </div>

        {/* Pattern Details */}
        {chartData && chartData.patterns.length > 0 && (
          <Card className="bg-gray-900/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-lg">🤖 AI-Detected Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chartData.patterns.map((pattern: any) => (
                  <div
                    key={pattern.id}
                    className="p-4 bg-gray-950/50 rounded-lg border border-gray-800/50 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-sm">{pattern.label}</div>
                        <div className="text-xs text-gray-400 mt-1">{pattern.type}</div>
                      </div>
                      <div
                        className={`text-sm font-bold px-2 py-1 rounded ${
                          pattern.bias === 'bullish'
                            ? 'bg-green-500/20 text-green-400'
                            : pattern.bias === 'bearish'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {pattern.bias.toUpperCase()}
                      </div>
                    </div>

                    <p className="text-sm text-gray-300 mb-3">{pattern.description}</p>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <div className="text-gray-500">Confidence</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cyan-500"
                              style={{ width: `${pattern.confidence}%` }}
                            />
                          </div>
                          <span className="font-semibold text-cyan-400 w-8 text-right">
                            {pattern.confidence}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Strength</div>
                        <div className="font-semibold text-purple-400 mt-1 capitalize">
                          {pattern.strength}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Duration</div>
                        <div className="font-semibold text-gray-300 mt-1">
                          {Math.ceil((pattern.endTime - pattern.startTime) / 86400)}d
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documentation */}
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-lg">Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-gray-800/50 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="toolbar">Toolbar</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-3">
                <p className="text-sm text-gray-300">
                  The <strong>AdvancedSentimentChart</strong> is a professional-grade charting component
                  built on TradingView Lightweight Charts, with AI-powered sentiment overlays and pattern detection.
                </p>
                <p className="text-sm text-gray-300">
                  It combines traditional technical analysis (candlesticks, volume, momentum) with modern AI
                  intelligence (sentiment analysis, pattern detection, emotion tracking).
                </p>
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded mt-4">
                  <div className="text-sm font-semibold text-cyan-400 mb-1">Key Differentiator</div>
                  <p className="text-xs text-cyan-300">
                    AI pattern overlays (HTML-based) appear as colored boxes on the chart, showing
                    detected patterns with confidence scores and bias direction.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    {
                      icon: '📊',
                      title: 'Candlestick Chart',
                      desc: 'Professional OHLC candlesticks',
                    },
                    {
                      icon: '💬',
                      title: 'Sentiment Overlay',
                      desc: 'Dynamic sentiment line (-1 to +1)',
                    },
                    {
                      icon: '🎯',
                      title: 'Confidence Band',
                      desc: 'Signal strength visualization',
                    },
                    {
                      icon: '🤖',
                      title: 'AI Patterns',
                      desc: 'HTML overlays with detection',
                    },
                    {
                      icon: '📈',
                      title: 'Momentum Panel',
                      desc: 'RSI-style oscillator view',
                    },
                    {
                      icon: '📦',
                      title: 'Histogram',
                      desc: 'Volume & sentiment intensity',
                    },
                  ].map((feature, idx) => (
                    <div key={idx} className="p-3 bg-gray-950/50 rounded border border-gray-800">
                      <div className="text-2xl mb-2">{feature.icon}</div>
                      <div className="font-semibold text-sm">{feature.title}</div>
                      <div className="text-xs text-gray-400 mt-1">{feature.desc}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="toolbar" className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div>
                    <strong className="text-cyan-400">Timeframe Selector</strong>
                    <p className="text-xs text-gray-400 mt-1">Switch between 1h, 6h, 1d, 7d timeframes</p>
                  </div>
                  <div>
                    <strong className="text-cyan-400">Zoom Controls</strong>
                    <p className="text-xs text-gray-400 mt-1">Zoom in/out and auto-fit chart content</p>
                  </div>
                  <div>
                    <strong className="text-cyan-400">Display Toggles</strong>
                    <p className="text-xs text-gray-400 mt-1">
                      Show/hide sentiment, confidence, patterns, volume, and momentum independently
                    </p>
                  </div>
                  <div>
                    <strong className="text-cyan-400">Interactions</strong>
                    <p className="text-xs text-gray-400 mt-1">
                      Hover for rich tooltips, scroll to zoom, drag to pan, click patterns for details
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>NeomSense Advanced Chart © 2024 • Powered by TradingView Lightweight Charts</p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedChartDemo;
