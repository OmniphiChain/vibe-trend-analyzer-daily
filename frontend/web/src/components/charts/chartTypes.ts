/**
 * NeomSense Chart Data Types
 * TradingView-compatible, backend-agnostic contract
 */

export interface EmotionSnapshot {
  optimism?: number;
  fear?: number;
  anger?: number;
  neutral?: number;
}

export interface ChartEvent {
  id: string;
  type: "earnings" | "news" | "macro" | "product" | "custom";
  label: string;
  impact?: number; // sentiment delta (+/-)
}

export interface ChartPoint {
  time: number; // UNIX timestamp in seconds

  // Price (OHLC)
  open: number;
  high: number;
  low: number;
  close: number;

  // Sentiment
  sentiment: number; // range: -1 → +1
  sentimentUpper?: number; // confidence band upper
  sentimentLower?: number; // confidence band lower
  confidence?: number; // 0 → 1

  // Momentum / Oscillator
  momentum?: number; // centered around 0

  // Volume (optional overlay)
  volume?: number;

  // Emotion snapshot (optional)
  emotion?: EmotionSnapshot;

  // Events mapped to this time bucket
  events?: ChartEvent[];
}

export interface SentimentChartResponse {
  asset: string; // e.g. "AAPL"
  interval: "1h" | "6h" | "1d" | "7d";
  data: ChartPoint[];
}

export type TimeFrame = "1h" | "6h" | "1d" | "7d";

export interface SentimentChartProps {
  data: ChartPoint[];
  asset: string;
  interval: TimeFrame;
  onTimeframeChange?: (timeframe: TimeFrame) => void;
  height?: number;
  showSentiment?: boolean;
  showConfidenceBand?: boolean;
  showEvents?: boolean;
  showMomentum?: boolean;
}

export interface ChartToggleState {
  sentiment: boolean;
  confidenceBand: boolean;
  events: boolean;
  momentum: boolean;
}

export interface CrosshairData {
  time: number;
  price: number;
  sentiment?: number;
  momentum?: number;
}

export interface SeriesMarker {
  time: number;
  position: "aboveBar" | "belowBar" | "inBar";
  color: string;
  shape: "circle" | "square" | "arrowUp" | "arrowDown";
  text?: string;
}

export interface AIPattern {
  id: string;

  // Machine-readable type
  type:
    | "ascending-triangle"
    | "descending-triangle"
    | "bullish-engulfing"
    | "bearish-engulfing"
    | "morning-star"
    | "evening-star"
    | "sentiment-shift"
    | "volatility-expansion"
    | "volatility-compression"
    | "momentum-divergence"
    | string;

  // Human-readable label
  label: string;

  // Confidence 0-100
  confidence: number;

  // Time range
  startTime: number; // unix seconds
  endTime: number;

  // Bias direction
  bias: "bullish" | "bearish" | "neutral";

  // Optional description
  description?: string;

  // Signal strength for visual prioritization
  strength?: "weak" | "moderate" | "strong";
}

export interface AdvancedChartOptions {
  showToolbar?: boolean;
  showHistogram?: boolean;
  showMomentum?: boolean;
  showPatterns?: boolean;
  height?: number;
  enableCompare?: boolean;
  enableReplay?: boolean;
}
