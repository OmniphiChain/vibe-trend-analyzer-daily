/**
 * Charts Module - TradingView-style sentiment charts for NeomSense
 */

// Main component
export { SentimentChart } from './SentimentChart';
export type { SentimentChartProps } from './chartTypes';

// Types
export type {
  ChartPoint,
  ChartEvent,
  EmotionSnapshot,
  SentimentChartResponse,
  TimeFrame,
  ChartToggleState,
  CrosshairData,
  SeriesMarker,
} from './chartTypes';

// Managers (for advanced usage)
export { PriceSeriesManager } from './PriceSeries';
export { SentimentOverlayManager } from './SentimentOverlay';
export { ConfidenceBandManager } from './ConfidenceBand';
export { EventMarkersManager } from './EventMarkers';
export { MomentumPanelManager } from './MomentumPanel';

// Theme
export {
  NeomSenseChartTheme,
  getChartOptions,
  getCandleSeriesOptions,
  getSentimentLineSeriesOptions,
  getConfidenceBandSeriesOptions,
  getMomentumSeriesOptions,
  getHistogramSeriesOptions,
  getSentimentColor,
  getEventMarkerColor,
} from './chartTheme';

// Mock data
export {
  generateMockChartData,
  generateMockChartResponse,
  generateMockMultiAssetData,
  SentimentProfiles,
  streamMockChartData,
} from './mockChartData';
