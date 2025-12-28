/**
 * AdvancedSentimentChart Component
 * Professional TradingView-style chart with AI sentiment overlays
 * Orchestrates all chart series, overlays, patterns, and interactions
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  createChart,
  IChartApi,
  MouseEventParams,
  UTCTimestamp,
} from 'lightweight-charts';
import {
  ChartPoint,
  AIPattern,
  TimeFrame,
  AdvancedChartOptions,
} from './chartTypes';
import { getChartOptions, NeomSenseChartTheme } from './chartTheme';
import { PriceSeriesManager } from './PriceSeries';
import { SentimentOverlayManager } from './SentimentOverlay';
import { ConfidenceBandManager } from './ConfidenceBand';
import { EventMarkersManager } from './EventMarkers';
import { MomentumPanelManager } from './MomentumPanel';
import { HistogramSeriesManager } from './HistogramSeries';
import { PatternOverlayManager } from './PatternOverlay';
import ChartToolbar from './ChartToolbar';
import EnhancedTooltip, { TooltipData } from './EnhancedTooltip';

export interface AdvancedSentimentChartProps {
  data: ChartPoint[];
  patterns?: AIPattern[];
  asset: string;
  interval: TimeFrame;
  onTimeframeChange?: (timeframe: TimeFrame) => void;
  options?: AdvancedChartOptions;
}

export const AdvancedSentimentChart: React.FC<AdvancedSentimentChartProps> = ({
  data,
  patterns = [],
  asset,
  interval,
  onTimeframeChange,
  options = {},
}) => {
  const {
    showToolbar = true,
    showHistogram = true,
    showMomentum = true,
    showPatterns = true,
    height = 800,
  } = options;

  // Chart refs
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const overlayContainerRef = useRef<HTMLDivElement>(null);

  // Series managers
  const priceSeriesRef = useRef<PriceSeriesManager | null>(null);
  const sentimentOverlayRef = useRef<SentimentOverlayManager | null>(null);
  const confidenceBandRef = useRef<ConfidenceBandManager | null>(null);
  const eventMarkersRef = useRef<EventMarkersManager | null>(null);
  const momentumPanelRef = useRef<MomentumPanelManager | null>(null);
  const histogramRef = useRef<HistogramSeriesManager | null>(null);
  const patternOverlayRef = useRef<PatternOverlayManager | null>(null);

  // UI state
  const [timeframe, setTimeframe] = useState<TimeFrame>(interval);
  const [showCrosshair, setShowCrosshair] = useState(true);
  const [showSentiment, setShowSentiment] = useState(true);
  const [showConfidence, setShowConfidence] = useState(true);
  const [showPatternOverlays, setShowPatternOverlays] = useState(showPatterns);
  const [showHistogramData, setShowHistogramData] = useState(showHistogram);
  const [showMomentumData, setShowMomentumData] = useState(showMomentum);
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

  // Initialize chart on mount
  useEffect(() => {
    if (!containerRef.current) return;

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
    histogramRef.current = new HistogramSeriesManager(chart);

    // Initialize price series for event markers
    const priceSeries = priceSeriesRef.current.initialize();
    eventMarkersRef.current = new EventMarkersManager(chart, priceSeries);

    // Initialize pattern overlay manager
    if (overlayContainerRef.current) {
      patternOverlayRef.current = new PatternOverlayManager(
        chart,
        overlayContainerRef.current
      );
    }

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
      histogramRef.current?.destroy();
      patternOverlayRef.current?.destroy();
    };
  }, [height]);

  // Update chart data when props change
  useEffect(() => {
    if (!chartRef.current) return;

    priceSeriesRef.current?.setData(data);
    sentimentOverlayRef.current?.setData(data);
    confidenceBandRef.current?.setData(data);
    momentumPanelRef.current?.setData(data);
    histogramRef.current?.setData(data);

    if (eventMarkersRef.current && priceSeriesRef.current?.getSeries()) {
      eventMarkersRef.current.setData(data);
    }

    // Auto-fit
    chartRef.current.timeScale().fitContent();
  }, [data]);

  // Update patterns
  useEffect(() => {
    if (patternOverlayRef.current && showPatternOverlays) {
      patternOverlayRef.current.setPatterns(patterns);
    }
  }, [patterns, showPatternOverlays]);

  // Update visibility toggles
  useEffect(() => {
    sentimentOverlayRef.current?.setVisible(showSentiment);
    confidenceBandRef.current?.setVisible(showConfidence);
    patternOverlayRef.current?.setVisible(showPatternOverlays);
    histogramRef.current?.setVisible(showHistogramData);
    momentumPanelRef.current?.setVisible(showMomentumData);
  }, [
    showSentiment,
    showConfidence,
    showPatternOverlays,
    showHistogramData,
    showMomentumData,
  ]);

  // Handle crosshair movement
  const handleCrosshairMove = useCallback(
    (param: MouseEventParams) => {
      if (!param.time || !containerRef.current) {
        setTooltipData(null);
        return;
      }

      const point = data.find((p) => p.time === (param.time as unknown as number));
      if (!point) {
        setTooltipData(null);
        return;
      }

      setTooltipData({
        point,
        x: param.point?.x || 0,
        y: param.point?.y || 0,
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

  // Handlers
  const handleTimeframeChange = (tf: TimeFrame) => {
    setTimeframe(tf);
    onTimeframeChange?.(tf);
  };

  const handleAutoFit = () => {
    chartRef.current?.timeScale().fitContent();
  };

  const handleZoomIn = () => {
    const scale = chartRef.current?.timeScale();
    if (scale) {
      const visibleRange = scale.getVisibleRange();
      if (visibleRange) {
        const diff = visibleRange.to - visibleRange.from;
        scale.setVisibleRange({
          from: (visibleRange.from + diff * 0.2) as UTCTimestamp,
          to: (visibleRange.to - diff * 0.2) as UTCTimestamp,
        });
      }
    }
  };

  const handleZoomOut = () => {
    const scale = chartRef.current?.timeScale();
    if (scale) {
      const visibleRange = scale.getVisibleRange();
      if (visibleRange) {
        const diff = visibleRange.to - visibleRange.from;
        scale.setVisibleRange({
          from: (visibleRange.from - diff * 0.1) as UTCTimestamp,
          to: (visibleRange.to + diff * 0.1) as UTCTimestamp,
        });
      }
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#0f1419] to-[#1a1f35] rounded-2xl border border-gray-700/50 overflow-hidden flex flex-col">
      {/* Toolbar */}
      {showToolbar && (
        <ChartToolbar
          timeframe={timeframe}
          onTimeframeChange={handleTimeframeChange}
          showCrosshair={showCrosshair}
          onCrosshairToggle={setShowCrosshair}
          showSentiment={showSentiment}
          onSentimentToggle={setShowSentiment}
          showConfidence={showConfidence}
          onConfidenceToggle={setShowConfidence}
          showPatterns={showPatternOverlays}
          onPatternsToggle={setShowPatternOverlays}
          showHistogram={showHistogramData}
          onHistogramToggle={setShowHistogramData}
          showMomentum={showMomentumData}
          onMomentumToggle={setShowMomentumData}
          onAutoFit={handleAutoFit}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          compareEnabled={false}
        />
      )}

      {/* Chart Container */}
      <div className="flex-1 relative overflow-hidden">
        {/* Chart Canvas */}
        <div ref={containerRef} className="w-full h-full" />

        {/* Pattern Overlay Container */}
        <div
          ref={overlayContainerRef}
          className="absolute inset-0 pointer-events-none"
          style={{ overflow: 'hidden' }}
        />

        {/* Enhanced Tooltip */}
        {showCrosshair && <EnhancedTooltip data={tooltipData} />}

        {/* Asset Info Badge */}
        <div className="absolute top-4 left-4 bg-gray-900/50 border border-gray-700/50 rounded-lg px-3 py-2 backdrop-blur-sm pointer-events-none">
          <div className="text-sm font-semibold text-white">{asset}</div>
          <div className="text-xs text-gray-400">{timeframe} • Professional View</div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSentimentChart;
