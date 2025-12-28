/**
 * Advanced Chart Mock Data Generator
 * Generates realistic chart data with AI patterns for testing
 */

import { ChartPoint, AIPattern, TimeFrame } from './chartTypes';

const PATTERN_TYPES = [
  'ascending-triangle',
  'bearish-engulfing',
  'bullish-engulfing',
  'sentiment-shift',
  'volatility-expansion',
] as const;

const PATTERN_LABELS: Record<typeof PATTERN_TYPES[number], string> = {
  'ascending-triangle': 'Ascending Triangle',
  'bearish-engulfing': 'Bearish Engulfing',
  'bullish-engulfing': 'Bullish Engulfing',
  'sentiment-shift': 'Sentiment Regime Shift',
  'volatility-expansion': 'Volatility Expansion',
};

/**
 * Generate mock chart data with sentiment overlays
 */
export function generateAdvancedChartData(
  asset: string = 'AAPL',
  interval: TimeFrame = '1d',
  count: number = 100
): ChartPoint[] {
  const data: ChartPoint[] = [];
  let currentPrice = 150;
  let currentSentiment = 0.2;
  const now = Math.floor(Date.now() / 1000);

  const intervalSeconds: Record<TimeFrame, number> = {
    '1h': 3600,
    '6h': 21600,
    '1d': 86400,
    '7d': 604800,
  };

  const step = intervalSeconds[interval];

  for (let i = 0; i < count; i++) {
    const time = now - (count - i) * step;

    // Generate realistic price action
    const volatility = 1 + Math.sin(i / 30) * 0.5;
    const change = (Math.random() - 0.48) * 2 * volatility;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * 1;
    const low = Math.min(open, close) - Math.random() * 1;

    // Sentiment with trend
    const trendBias = Math.sin(i / 40) * 0.4;
    const sentimentChange = (Math.random() - 0.45) * 0.12 + trendBias * 0.02;
    currentSentiment = Math.max(-1, Math.min(1, currentSentiment + sentimentChange));

    // Confidence correlates with trend strength
    const confidence = 0.65 + Math.abs(trendBias) * 0.3 + Math.random() * 0.15;
    const bandWidth = (1 - confidence) * 0.35;

    // Momentum (oscillating)
    const momentum = Math.sin(i / 15) * 0.6 + (Math.random() - 0.5) * 0.15;

    // Volume patterns
    const volume = 1500000 + Math.sin(i / 25) * 2000000 + Math.random() * 3000000;

    // Emotion snapshot
    const emotion = {
      optimism: Math.max(0, currentSentiment * 0.8 + Math.random() * 0.2),
      fear: Math.max(0, -currentSentiment * 0.7 + Math.random() * 0.25),
      anger: Math.random() * 0.15,
      neutral: Math.max(0, 1 - Math.max(0, currentSentiment) - Math.max(0, -currentSentiment) + Math.random() * 0.1),
    };

    // Events - randomly placed
    const events =
      Math.random() > 0.92
        ? [
            {
              id: `event-${i}`,
              type: ['earnings', 'news', 'macro', 'product'][Math.floor(Math.random() * 4)] as any,
              label: ['Earnings Beat', 'Breaking News', 'Fed Decision', 'Product Launch'][
                Math.floor(Math.random() * 4)
              ],
              impact: (Math.random() - 0.5) * 0.3,
            },
          ]
        : undefined;

    data.push({
      time,
      open,
      high,
      low,
      close,
      sentiment: currentSentiment,
      sentimentUpper: Math.min(1, currentSentiment + bandWidth),
      sentimentLower: Math.max(-1, currentSentiment - bandWidth),
      confidence,
      momentum,
      volume,
      emotion,
      events,
    });

    currentPrice = close;
  }

  return data;
}

/**
 * Generate AI patterns for the chart
 */
export function generateAIPatterns(
  data: ChartPoint[],
  asset: string = 'AAPL'
): AIPattern[] {
  const patterns: AIPattern[] = [];
  const now = Date.now() / 1000;

  // Pattern 1: Ascending Triangle (bullish)
  if (data.length > 30) {
    const startIdx = Math.floor(data.length * 0.6);
    const endIdx = Math.floor(data.length * 0.8);
    patterns.push({
      id: 'pattern-1',
      type: 'ascending-triangle',
      label: 'Ascending Triangle',
      confidence: 73,
      startTime: data[startIdx].time,
      endTime: data[endIdx].time,
      bias: 'bullish',
      strength: 'moderate',
      description: 'Pattern suggests upward breakout potential',
    });
  }

  // Pattern 2: Bullish Engulfing (bullish)
  if (data.length > 50) {
    const startIdx = Math.floor(data.length * 0.15);
    const endIdx = Math.floor(data.length * 0.25);
    patterns.push({
      id: 'pattern-2',
      type: 'bullish-engulfing',
      label: 'Bullish Engulfing',
      confidence: 87,
      startTime: data[startIdx].time,
      endTime: data[endIdx].time,
      bias: 'bullish',
      strength: 'strong',
      description: 'Strong reversal pattern at support level',
    });
  }

  // Pattern 3: Sentiment Shift (bearish)
  if (data.length > 40) {
    const startIdx = Math.floor(data.length * 0.35);
    const endIdx = Math.floor(data.length * 0.5);
    patterns.push({
      id: 'pattern-3',
      type: 'sentiment-shift',
      label: 'Sentiment Regime Shift',
      confidence: 64,
      startTime: data[startIdx].time,
      endTime: data[endIdx].time,
      bias: 'bearish',
      strength: 'moderate',
      description: 'Sentiment shifted from positive to negative',
    });
  }

  // Pattern 4: Volatility Expansion
  if (data.length > 70) {
    const startIdx = Math.floor(data.length * 0.7);
    const endIdx = Math.floor(data.length * 0.85);
    patterns.push({
      id: 'pattern-4',
      type: 'volatility-expansion',
      label: 'Volatility Expansion',
      confidence: 55,
      startTime: data[startIdx].time,
      endTime: data[endIdx].time,
      bias: 'neutral',
      strength: 'weak',
      description: 'Increased price and sentiment volatility detected',
    });
  }

  return patterns;
}

/**
 * Generate complete advanced chart response
 */
export interface AdvancedChartResponse {
  asset: string;
  interval: TimeFrame;
  data: ChartPoint[];
  patterns: AIPattern[];
  metadata: {
    timestamp: number;
    dataPoints: number;
    sentimentRange: [number, number];
  };
}

export function generateAdvancedChartResponse(
  asset: string = 'AAPL',
  interval: TimeFrame = '1d'
): AdvancedChartResponse {
  const data = generateAdvancedChartData(asset, interval, 100);
  const patterns = generateAIPatterns(data, asset);

  const sentiments = data.map((p) => p.sentiment);
  const sentimentRange: [number, number] = [
    Math.min(...sentiments),
    Math.max(...sentiments),
  ];

  return {
    asset,
    interval,
    data,
    patterns,
    metadata: {
      timestamp: Math.floor(Date.now() / 1000),
      dataPoints: data.length,
      sentimentRange,
    },
  };
}

/**
 * Generate multiple assets for comparison mode (future)
 */
export function generateMultiAssetChartData(
  assets: string[],
  interval: TimeFrame = '1d'
): Map<string, { data: ChartPoint[]; patterns: AIPattern[] }> {
  const map = new Map<string, { data: ChartPoint[]; patterns: AIPattern[] }>();

  assets.forEach((asset) => {
    const data = generateAdvancedChartData(asset, interval, 100);
    const patterns = generateAIPatterns(data, asset);
    map.set(asset, { data, patterns });
  });

  return map;
}

/**
 * Generate trending pattern examples
 */
export function getTrendingPatterns(): AIPattern[] {
  return [
    {
      id: 'trending-1',
      type: 'bullish-engulfing',
      label: 'Strong Bullish Setup',
      confidence: 89,
      startTime: Math.floor(Date.now() / 1000) - 86400 * 3,
      endTime: Math.floor(Date.now() / 1000) - 86400,
      bias: 'bullish',
      strength: 'strong',
      description: 'Multiple bullish signals converging',
    },
    {
      id: 'trending-2',
      type: 'sentiment-shift',
      label: 'Sentiment Reversal Forming',
      confidence: 72,
      startTime: Math.floor(Date.now() / 1000) - 86400 * 5,
      endTime: Math.floor(Date.now() / 1000),
      bias: 'neutral',
      strength: 'moderate',
      description: 'Mixed signals suggest consolidation phase',
    },
  ];
}
