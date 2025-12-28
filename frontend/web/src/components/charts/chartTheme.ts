/**
 * NeomSense Chart Theme
 * Dark mode with glassmorphism and sentiment-aware colors
 */

import { ChartOptions } from 'lightweight-charts';

export const NeomSenseChartTheme = {
  // Background & Layout
  background: '#0f1419',
  surface: 'rgba(20, 22, 35, 0.7)',
  surfaceGlass: 'rgba(20, 22, 35, 0.5)',
  
  // Text
  textPrimary: '#e5e7eb',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',
  
  // Borders & Grid
  border: '#2d3748',
  gridLine: '#1f2937',
  
  // Sentiment Colors
  sentiment: {
    bullish: '#10b981', // Emerald green
    bearish: '#ef4444', // Red
    neutral: '#6b7280', // Gray
    veryBullish: '#34d399', // Bright emerald
    veryBearish: '#f87171', // Bright red
  },
  
  // Price Action
  candleUp: '#10b981',
  candleDown: '#ef4444',
  wickUp: '#059669',
  wickDown: '#dc2626',
  
  // Accents
  accent1: '#06b6d4', // Cyan
  accent2: '#a855f7', // Purple
  accent3: '#f59e0b', // Amber
} as const;

export const getChartOptions = (): ChartOptions => ({
  layout: {
    background: {
      color: NeomSenseChartTheme.background,
    },
    textColor: NeomSenseChartTheme.textPrimary,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: 12,
  },
  grid: {
    vertLines: {
      color: NeomSenseChartTheme.gridLine,
      style: 0,
      visible: true,
    },
    horzLines: {
      color: NeomSenseChartTheme.gridLine,
      style: 0,
      visible: true,
    },
  },
  crosshair: {
    mode: 1, // Magnet mode (snaps to bar)
    vertLine: {
      color: NeomSenseChartTheme.accent1,
      width: 1,
      style: 3, // Dashed
      visible: true,
      labelBackgroundColor: NeomSenseChartTheme.accent1,
    },
    horzLine: {
      color: NeomSenseChartTheme.accent1,
      width: 1,
      style: 3,
      visible: true,
      labelBackgroundColor: NeomSenseChartTheme.accent1,
    },
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
    barSpacing: 8,
    minBarSpacing: 2,
    fixLeftEdge: false,
    fixRightEdge: true,
    lockRange: false,
    rightOffset: 0,
    borderVisible: true,
    borderColor: NeomSenseChartTheme.border,
    drawTicks: true,
    tickMarkMaxCharacterLength: 8,
    ticksVisible: false,
  },
  rightPriceScale: {
    autoScale: true,
    mode: 0, // Normal
    invertScale: false,
    alignLabels: true,
    scaleMargins: {
      top: 0.1,
      bottom: 0.1,
    },
    borderVisible: true,
    borderColor: NeomSenseChartTheme.border,
    textColor: NeomSenseChartTheme.textSecondary,
  },
  localization: {
    locale: 'en-US',
    priceFormatter: (price: number) => {
      if (price >= 1000) {
        return (price / 1000).toFixed(2) + 'K';
      }
      return price.toFixed(2);
    },
  },
  handleScroll: {
    mouseWheel: true,
    pressedMouseMove: true,
  },
  handleScale: {
    mouseWheel: true,
    pinch: true,
  },
});

export const getCandleSeriesOptions = () => ({
  upColor: NeomSenseChartTheme.candleUp,
  downColor: NeomSenseChartTheme.candleDown,
  openTickWidth: 0.5,
  borderVisible: true,
  borderUpColor: NeomSenseChartTheme.wickUp,
  borderDownColor: NeomSenseChartTheme.wickDown,
  wickUpColor: NeomSenseChartTheme.wickUp,
  wickDownColor: NeomSenseChartTheme.wickDown,
  lastValueVisible: true,
});

export const getSentimentLineSeriesOptions = () => ({
  color: NeomSenseChartTheme.sentiment.bullish,
  lineWidth: 2,
  crosshairMarkerVisible: true,
  crosshairMarkerRadius: 6,
  crosshairMarkerBorderColor: NeomSenseChartTheme.textPrimary,
  crosshairMarkerBackgroundColor: NeomSenseChartTheme.sentiment.bullish,
  lastValueVisible: false,
  priceScaleId: 'right',
  priceFormat: {
    type: 'price',
    precision: 3,
    minMove: 0.001,
  },
});

export const getConfidenceBandSeriesOptions = () => ({
  color: NeomSenseChartTheme.accent1,
  lineWidth: 1,
  lineStyle: 2, // Dashed
  crosshairMarkerVisible: false,
  priceScaleId: 'right',
  lastValueVisible: false,
});

export const getMomentumSeriesOptions = () => ({
  color: NeomSenseChartTheme.accent2,
  lineWidth: 2,
  crosshairMarkerVisible: true,
  crosshairMarkerRadius: 5,
  lastValueVisible: false,
  priceScaleId: 'momentum',
});

export const getHistogramSeriesOptions = () => ({
  color: NeomSenseChartTheme.accent2,
  lastValueVisible: false,
  priceScaleId: 'momentum',
});

export const getSentimentColor = (sentiment: number): string => {
  if (sentiment > 0.5) return NeomSenseChartTheme.sentiment.veryBullish;
  if (sentiment > 0) return NeomSenseChartTheme.sentiment.bullish;
  if (sentiment < -0.5) return NeomSenseChartTheme.sentiment.veryBearish;
  if (sentiment < 0) return NeomSenseChartTheme.sentiment.bearish;
  return NeomSenseChartTheme.sentiment.neutral;
};

export const getEventMarkerColor = (eventType: string): string => {
  switch (eventType) {
    case 'earnings':
      return NeomSenseChartTheme.accent3; // Amber
    case 'news':
      return NeomSenseChartTheme.accent1; // Cyan
    case 'macro':
      return NeomSenseChartTheme.accent2; // Purple
    case 'product':
      return NeomSenseChartTheme.sentiment.bullish; // Green
    default:
      return NeomSenseChartTheme.textSecondary; // Gray
  }
};
