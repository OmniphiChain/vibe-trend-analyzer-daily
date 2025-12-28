# NeomSense Sentiment Chart System

Professional TradingView-style charts with AI sentiment overlays for NeomSense.

## Overview

The Sentiment Chart is a production-grade charting system built on **TradingView Lightweight Charts** with custom sentiment analysis overlays. It provides institutional-grade visualization of price action combined with real-time sentiment intelligence.

## Architecture

```
/components/charts/
├── SentimentChart.tsx          # Main React component (orchestrator)
├── chartTypes.ts               # TypeScript type definitions
├── chartTheme.ts               # NeomSense dark theme & styling
├── PriceSeries.ts              # OHLC candlestick manager
├── SentimentOverlay.ts         # Sentiment line overlay manager
├── ConfidenceBand.ts           # Confidence band manager
├── EventMarkers.ts             # Event marker manager
├── MomentumPanel.ts            # Momentum oscillator manager
├── mockChartData.ts            # Mock data generator
├── SentimentChartDemo.tsx       # Demo & testing page
├── index.ts                    # Module exports
└── README.md                   # This file
```

## Quick Start

### Basic Usage

```tsx
import { SentimentChart, generateMockChartData } from '@/components/charts';

function MyChart() {
  const data = generateMockChartData('AAPL', '1d', 100);
  
  return (
    <SentimentChart
      data={data}
      asset="AAPL"
      interval="1d"
      onTimeframeChange={(tf) => console.log(`Changed to: ${tf}`)}
      height={600}
    />
  );
}
```

### With Real API Data

```tsx
import { SentimentChart } from '@/components/charts';
import type { ChartPoint, TimeFrame } from '@/components/charts';
import { useEffect, useState } from 'react';

function RealTimeChart() {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [timeframe, setTimeframe] = useState<TimeFrame>('1d');

  useEffect(() => {
    // Fetch from your backend
    fetch(`/api/charts/AAPL?interval=${timeframe}`)
      .then(r => r.json())
      .then(response => setData(response.data));
  }, [timeframe]);

  return (
    <SentimentChart
      data={data}
      asset="AAPL"
      interval={timeframe}
      onTimeframeChange={setTimeframe}
    />
  );
}
```

## Data Contract

The chart consumes data in the `ChartPoint` schema:

```typescript
interface ChartPoint {
  time: number;                    // UNIX timestamp (seconds)
  
  // Price (OHLC)
  open: number;
  high: number;
  low: number;
  close: number;
  
  // Sentiment (-1 to +1)
  sentiment: number;
  sentimentUpper?: number;         // Confidence band upper
  sentimentLower?: number;         // Confidence band lower
  confidence?: number;             // 0 to 1
  
  // Optional overlays
  momentum?: number;               // Centered around 0
  volume?: number;
  emotion?: {
    optimism?: number;
    fear?: number;
    anger?: number;
    neutral?: number;
  };
  events?: ChartEvent[];
}
```

### Important Notes

- **Frontend-only rendering**: No calculations are performed on the chart data
- **Backend computes sentiment**: All sentiment, momentum, confidence bands must come from your API
- **Graceful degradation**: Missing fields are silently ignored (overlays don't render)
- **Time format**: Use UNIX timestamps in seconds (not milliseconds)

## Features

### 1. Price Candlesticks
- Standard OHLC rendering
- Professional colors (green up, red down)
- Synchronized with all other overlays

### 2. Sentiment Overlay
- Line series (-1 to +1)
- Dynamic coloring (green for bullish, red for bearish)
- Toggle on/off independently

### 3. Confidence Band
- Semi-transparent upper/lower bounds
- Shows signal strength visually
- Dashed line styling

### 4. Event Markers
- Vertical markers for earnings, news, macro events
- Color-coded by event type
- Hover-friendly with labels
- Toggle on/off independently

### 5. Momentum Panel
- Secondary chart panel below main chart
- Shared time scale and crosshair
- Synchronized zoom/pan

### 6. Interactions
- **Crosshair**: Synced across all panels
- **Zoom/Pan**: Wheel and pinch gestures
- **Tooltips**: Hover shows OHLC + sentiment + momentum
- **Timeframe Selector**: 1h, 6h, 1d, 7d
- **Toggles**: Show/hide sentiment, band, events, momentum

## Props

```typescript
interface SentimentChartProps {
  data: ChartPoint[];                    // Chart data
  asset: string;                         // e.g., "AAPL"
  interval: TimeFrame;                   // "1h" | "6h" | "1d" | "7d"
  onTimeframeChange?: (tf: TimeFrame) => void;
  height?: number;                       // Default: 600px
  showSentiment?: boolean;               // Default: true
  showConfidenceBand?: boolean;          // Default: true
  showEvents?: boolean;                  // Default: true
  showMomentum?: boolean;                // Default: true
}
```

## Styling

The component uses:
- **Tailwind CSS** for container styling
- **CSS variables** for dark mode (optional)
- **NeomSense theme** colors (cyan, purple, emerald)
- **Glassmorphism** panels with subtle gradients

### Custom Theming

To modify colors, edit `chartTheme.ts`:

```typescript
export const NeomSenseChartTheme = {
  background: '#0f1419',
  sentiment: {
    bullish: '#10b981',
    bearish: '#ef4444',
    neutral: '#6b7280',
  },
  // ... more colors
};
```

## Performance

- **useRef** for chart instances (no re-creation on render)
- **Cleanup on unmount** (proper event listener teardown)
- **Efficient updates** (data replacement, not incremental)
- **Lazy series initialization** (only created when needed)
- **Hardware-accelerated** canvas rendering

### Optimization Tips

1. **Limit data points**: 100-500 points per chart (use aggregation for larger datasets)
2. **Debounce API calls**: When timeframe changes
3. **Memoize data**: Use `useMemo` if props are expensive to compute
4. **Avoid re-renders**: Keep chart container in a stable component

## Testing

Run the demo page:

1. Navigate to `/sentiment-chart-demo` in your app
2. Or add this to your router:

```tsx
import { SentimentChartDemo } from '@/components/charts';

<Route path="/sentiment-chart-demo" component={SentimentChartDemo} />
```

## API Integration

### Expected Backend Response

```json
{
  "asset": "AAPL",
  "interval": "1d",
  "data": [
    {
      "time": 1704067200,
      "open": 189.95,
      "high": 192.50,
      "low": 189.50,
      "close": 191.20,
      "sentiment": 0.35,
      "sentimentUpper": 0.55,
      "sentimentLower": 0.15,
      "confidence": 0.82,
      "momentum": 0.12,
      "volume": 52341000,
      "events": [
        {
          "id": "earnings-q4",
          "type": "earnings",
          "label": "Q4 Earnings",
          "impact": 0.15
        }
      ]
    }
  ]
}
```

## Integrating with AdvancedTradingChart

To use `SentimentChart` in your existing `AdvancedTradingChart.tsx`:

```tsx
import { SentimentChart } from '@/components/charts';

export const AdvancedTradingChart = ({ onNavigate }) => {
  // ... existing code ...

  return (
    <div>
      {/* Existing chart code */}
      
      {/* Add sentiment chart below */}
      {activeSection === 'sentiment-analysis' && (
        <SentimentChart
          data={chartData}
          asset={chartState.symbol}
          interval={chartState.timeframe as TimeFrame}
          height={500}
        />
      )}
    </div>
  );
};
```

## Troubleshooting

### Chart Not Rendering
- Check that container ref is properly mounted
- Verify data array is not empty
- Ensure `time` values are UNIX timestamps in seconds

### Sentiment Overlay Not Visible
- Verify `sentiment` field exists in data points
- Check `showSentiment` prop is `true`
- Confirm sentiment values are in range [-1, 1]

### Confidence Band Missing
- Ensure both `sentimentUpper` and `sentimentLower` are present
- Check `showConfidenceBand` prop is `true`

### Events Not Showing
- Verify `events` array is populated in data
- Check event `type` matches: "earnings", "news", "macro", "product", "custom"
- Confirm `showEvents` prop is `true`

### Performance Issues
- Reduce number of data points (aggregate or paginate)
- Check browser DevTools for memory leaks
- Verify chart cleanup on unmount

## Advanced Usage

### Real-Time Updates

```tsx
import { useEffect } from 'react';
import { ChartPoint } from '@/components/charts';

function RealTimeChart() {
  const [data, setData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    const ws = new WebSocket('wss://your-api.com/charts/live');
    
    ws.onmessage = (event) => {
      const newPoint = JSON.parse(event.data) as ChartPoint;
      setData(prev => [...prev.slice(-99), newPoint]); // Keep last 100
    };

    return () => ws.close();
  }, []);

  return <SentimentChart data={data} asset="AAPL" interval="1d" />;
}
```

### Custom Event Rendering

Events are rendered with default colors, but you can pre-process data:

```tsx
const enrichedData = data.map(point => ({
  ...point,
  events: point.events?.map(event => ({
    ...event,
    // Add custom logic here
  })),
}));

<SentimentChart data={enrichedData} />
```

## Browser Support

- ✅ Chrome/Edge 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## Accessibility

- Keyboard controls: Arrow keys, +/- for zoom
- Crosshair position announced in tooltips
- Semantic HTML in demo page
- High contrast dark theme by default

## License

Same as NeomSense project

## References

- [TradingView Lightweight Charts Docs](https://tradingview.github.io/lightweight-charts/)
- [NeomSense Design System](../../../design-system-docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**Created for NeomSense** - AI-Powered Sentiment Intelligence Platform
