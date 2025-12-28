/**
 * SentimentChart Component
 * TradingView-style sentiment-enhanced chart for NeomSense
 * Main orchestrator for all chart series and overlays
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  createChart,
  IChartApi,
  MouseEventParams,
  Time,
} from 'lightweight-charts';
import { ChartPoint, SentimentChartProps, ChartToggleState, TimeFrame } from './chartTypes';
import { getChartOptions, NeomSenseChartTheme } from './chartTheme';
import { PriceSeriesManager } from './PriceSeries';
import { SentimentOverlayManager } from './SentimentOverlay';
import { ConfidenceBandManager } from './ConfidenceBand';
import { EventMarkersManager } from './EventMarkers';
import { MomentumPanelManager } from './MomentumPanel';
import { Button } from '../ui/button';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { cn } from '../../lib/utils';

const TIMEFRAMES: TimeFrame[] = ['1h', '6h', '1d', '7d'];

export const SentimentChart: React.FC<SentimentChartProps> = ({
  data,
  asset,
  interval,
  onTimeframeChange,
  height = 600,
  showSentiment: initialShowSentiment = true,
  showConfidenceBand: initialShowConfidenceBand = true,
  showEvents: initialShowEvents = true,
  showMomentum: initialShowMomentum = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const priceSeriesRef = useRef<PriceSeriesManager | null>(null);
  const sentimentOverlayRef = useRef<SentimentOverlayManager | null>(null);
  const confidenceBandRef = useRef<ConfidenceBandManager | null>(null);
  const eventMarkersRef = useRef<EventMarkersManager | null>(null);
  const momentumPanelRef = useRef<MomentumPanelManager | null>(null);

  const [toggleState, setToggleState] = useState<ChartToggleState>({
    sentiment: initialShowSentiment,
    confidenceBand: initialShowConfidenceBand,
    events: initialShowEvents,
    momentum: initialShowMomentum,
  });

  const [currentTimeframe, setCurrentTimeframe] = useState<TimeFrame>(interval);

  const [crosshairData, setCrosshairData] = useState<{
    time: string;
    price: number;
    sentiment?: number;
  } | null>(null);

  // Initialize chart on mount
  useEffect(() => {
    if (!containerRef.current) return;

    // Create main chart
    const chart = createChart(containerRef.current, {
      ...getChartOptions(),
      width: containerRef.current.clientWidth,
      height,
    });

    chartRef.current = chart;

    // Initialize all series managers
    priceSeriesRef.current = new PriceSeriesManager(chart);
    sentimentOverlayRef.current = new SentimentOverlayManager(chart);
    confidenceBandRef.current = new ConfidenceBandManager(chart);
    momentumPanelRef.current = new MomentumPanelManager(chart);

    // Price series is needed for event markers
    const priceSeries = priceSeriesRef.current.initialize();
    eventMarkersRef.current = new EventMarkersManager(chart, priceSeries);

    // Handle window resize
    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        chartRef.current.applyOptions({ width: rect.width });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      priceSeriesRef.current?.destroy();
      sentimentOverlayRef.current?.destroy();
      confidenceBandRef.current?.destroy();
      eventMarkersRef.current?.destroy();
      momentumPanelRef.current?.destroy();
    };
  }, [height]);

  // Update chart data when props change
  useEffect(() => {
    if (!chartRef.current) return;

    // Load data into all series
    priceSeriesRef.current?.setData(data);
    sentimentOverlayRef.current?.setData(data);
    confidenceBandRef.current?.setData(data);
    momentumPanelRef.current?.setData(data);

    // Set event markers on price series
    if (eventMarkersRef.current && priceSeriesRef.current?.getSeries()) {
      eventMarkersRef.current.setData(data);
    }

    // Auto-fit content
    chartRef.current.timeScale().fitContent();
  }, [data]);

  // Update visibility toggles
  useEffect(() => {
    sentimentOverlayRef.current?.setVisible(toggleState.sentiment);
    confidenceBandRef.current?.setVisible(toggleState.confidenceBand);
    eventMarkersRef.current?.setVisible(toggleState.events);
    momentumPanelRef.current?.setVisible(toggleState.momentum);
  }, [toggleState]);

  // Handle crosshair movement
  const handleCrosshairMove = useCallback(
    (param: MouseEventParams) => {
      if (!param.time) {
        setCrosshairData(null);
        return;
      }

      const point = data.find((p) => p.time === (param.time as unknown as number));
      if (!point) return;

      const time = new Date(point.time * 1000).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      setCrosshairData({
        time,
        price: point.close,
        sentiment: point.sentiment,
      });
    },
    [data]
  );

  useEffect(() => {
    if (!chartRef.current) return;

    chartRef.current.subscribeCrosshairMove(handleCrosshairMove);

    return () => {
      if (chartRef.current) {
        chartRef.current.unsubscribeCrosshairMove(handleCrosshairMove);
      }
    };
  }, [handleCrosshairMove]);

  const handleTimeframeChange = (newTimeframe: TimeFrame) => {
    setCurrentTimeframe(newTimeframe);
    onTimeframeChange?.(newTimeframe);
  };

  const toggleOverlay = (key: keyof ChartToggleState) => {
    setToggleState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#0f1419] to-[#1a1f35] rounded-2xl border border-gray-700/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            {asset} <span className="text-gray-400 text-sm ml-2">{currentTimeframe}</span>
          </h2>
          {crosshairData && (
            <div className="text-sm text-gray-400 mt-1">
              {crosshairData.time} • ${crosshairData.price.toFixed(2)}
              {crosshairData.sentiment !== undefined && (
                <span className="ml-3">
                  Sentiment: {(crosshairData.sentiment * 100).toFixed(0)}%
                </span>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Timeframe Selector */}
          <ToggleGroup
            type="single"
            value={currentTimeframe}
            onValueChange={(value) => value && handleTimeframeChange(value as TimeFrame)}
            className="bg-gray-900/50 rounded-lg p-1"
          >
            {TIMEFRAMES.map((tf) => (
              <ToggleGroupItem
                key={tf}
                value={tf}
                className={cn(
                  'px-2 py-1 text-xs rounded data-[state=on]:bg-cyan-500/20 data-[state=on]:text-cyan-400'
                )}
              >
                {tf}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          {/* Toggle Buttons */}
          <div className="flex gap-1">
            <Button
              variant={toggleState.sentiment ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleOverlay('sentiment')}
              className="text-xs h-8"
              title="Toggle sentiment overlay"
            >
              💬 Sentiment
            </Button>
            <Button
              variant={toggleState.confidenceBand ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleOverlay('confidenceBand')}
              className="text-xs h-8"
              title="Toggle confidence band"
            >
              📊 Band
            </Button>
            <Button
              variant={toggleState.events ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleOverlay('events')}
              className="text-xs h-8"
              title="Toggle event markers"
            >
              🚩 Events
            </Button>
            <Button
              variant={toggleState.momentum ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleOverlay('momentum')}
              className="text-xs h-8"
              title="Toggle momentum panel"
            >
              📈 Momentum
            </Button>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div
        ref={containerRef}
        className="w-full"
        style={{ height: `${height}px` }}
      />
    </div>
  );
};

export default SentimentChart;
