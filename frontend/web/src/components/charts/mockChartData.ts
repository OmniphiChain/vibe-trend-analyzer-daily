/**
 * Mock Chart Data Generator
 * Generates realistic chart-ready data for testing and demos
 * Follows the ChartPoint schema exactly
 */

import { ChartPoint, SentimentChartResponse, TimeFrame } from './chartTypes';

/**
 * Generate realistic OHLC data with sentiment overlay
 */
export function generateMockChartData(
  asset: string = 'AAPL',
  interval: TimeFrame = '1d',
  count: number = 50
): ChartPoint[] {
  const data: ChartPoint[] = [];
  let currentPrice = 150;
  let currentSentiment = 0.3;
  const now = Math.floor(Date.now() / 1000);

  // Time intervals in seconds
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
    const change = (Math.random() - 0.48) * 2;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * 0.5;
    const low = Math.min(open, close) - Math.random() * 0.5;

    // Generate sentiment with momentum
    const sentimentChange = (Math.random() - 0.5) * 0.15;
    currentSentiment = Math.max(-1, Math.min(1, currentSentiment + sentimentChange));

    // Generate confidence band (bounds around sentiment)
    const confidence = 0.7 + Math.random() * 0.25;
    const bandWidth = (1 - confidence) * 0.3;

    // Generate momentum (oscillating around 0)
    const momentum = Math.sin(i / 10) * 0.5 + (Math.random() - 0.5) * 0.2;

    // Generate volume
    const volume = 1000000 + Math.random() * 5000000;

    // Emotion snapshot
    const emotion = {
      optimism: Math.max(0, currentSentiment + Math.random() * 0.2),
      fear: Math.max(0, -currentSentiment + Math.random() * 0.2),
      anger: Math.random() * 0.1,
      neutral: Math.random() * 0.3,
    };

    // Occasionally add events
    const events =
      Math.random() > 0.85
        ? [
            {
              id: `event-${i}`,
              type: ['earnings', 'news', 'macro', 'product'][
                Math.floor(Math.random() * 4)
              ] as any,
              label:
                ['Earnings', 'Breaking News', 'Fed Decision', 'Product Launch'][
                  Math.floor(Math.random() * 4)
                ],
              impact: (Math.random() - 0.5) * 0.4,
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
 * Generate mock API response
 */
export function generateMockChartResponse(
  asset: string = 'AAPL',
  interval: TimeFrame = '1d'
): SentimentChartResponse {
  return {
    asset,
    interval,
    data: generateMockChartData(asset, interval, 100),
  };
}

/**
 * Generate multiple assets for comparison
 */
export function generateMockMultiAssetData(
  assets: string[],
  interval: TimeFrame = '1d'
): Map<string, ChartPoint[]> {
  const map = new Map<string, ChartPoint[]>();
  assets.forEach((asset) => {
    map.set(asset, generateMockChartData(asset, interval, 50));
  });
  return map;
}

/**
 * Realistic sentiment distribution helpers
 */
export const SentimentProfiles = {
  bullish: () => {
    const base = 0.6;
    return base + (Math.random() - 0.3) * 0.3;
  },
  bearish: () => {
    const base = -0.6;
    return base + (Math.random() - 0.3) * 0.3;
  },
  neutral: () => {
    return (Math.random() - 0.5) * 0.3;
  },
  volatile: () => {
    return (Math.random() - 0.5) * 0.9;
  },
};

/**
 * Stream mock data in real-time (for live updates)
 */
export function streamMockChartData(
  onData: (point: ChartPoint) => void,
  interval: number = 1000
): () => void {
  let currentPrice = 150;
  let currentSentiment = 0.3;
  const startTime = Math.floor(Date.now() / 1000);
  let count = 0;

  const intervalId = setInterval(() => {
    count++;
    const time = startTime + count * interval;

    const change = (Math.random() - 0.48) * 1;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * 0.3;
    const low = Math.min(open, close) - Math.random() * 0.3;

    const sentimentChange = (Math.random() - 0.5) * 0.1;
    currentSentiment = Math.max(-1, Math.min(1, currentSentiment + sentimentChange));

    const confidence = 0.75 + Math.random() * 0.2;
    const bandWidth = (1 - confidence) * 0.3;

    const point: ChartPoint = {
      time,
      open,
      high,
      low,
      close,
      sentiment: currentSentiment,
      sentimentUpper: Math.min(1, currentSentiment + bandWidth),
      sentimentLower: Math.max(-1, currentSentiment - bandWidth),
      confidence,
      momentum: Math.sin(count / 20) * 0.5,
      volume: 1000000 + Math.random() * 3000000,
      emotion: {
        optimism: Math.max(0, currentSentiment),
        fear: Math.max(0, -currentSentiment),
        anger: Math.random() * 0.05,
        neutral: Math.random() * 0.2,
      },
    };

    currentPrice = close;
    onData(point);
  }, interval);

  return () => clearInterval(intervalId);
}
