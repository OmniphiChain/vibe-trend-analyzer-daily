/**
 * Charts Module - TradingView-style sentiment charts for NeomSense
 */

// Main components
export { SentimentChart } from './SentimentChart';
export { AdvancedSentimentChart } from './AdvancedSentimentChart';
export { ChartToolbar } from './ChartToolbar';
export { EnhancedTooltip } from './EnhancedTooltip';

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
  AIPattern,
  AdvancedChartOptions,
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
