# AdvancedSentimentChart - Professional Trading Interface

**TradingView-grade charting system with AI sentiment intelligence and pattern detection.**

## Overview

`AdvancedSentimentChart` is a professional-grade financial charting component built on TradingView Lightweight Charts, designed for NeomSense to combine traditional technical analysis with AI-powered sentiment overlays.

### Key Differentiators

✨ **Candlesticks as primary visual anchor** - Trader-familiar format  
✨ **HTML-based AI pattern overlays** - Rich, clickable annotations  
✨ **Synced multi-panel layout** - Histogram, momentum, price all in sync  
✨ **Rich hover tooltips** - OHLC, sentiment, momentum, emotion breakdown  
✨ **Professional dark theme** - Institutional, not retail-gimmicky  

## Architecture

### Component Hierarchy

```
AdvancedSentimentChart (orchestrator)
├── ChartToolbar (controls + toggles)
├── Price Panel (candlesticks)
│   ├── SentimentOverlay (line -1 to +1)
│   ├── ConfidenceBand (upper/lower bounds)
│   ├── EventMarkers (earnings, news, macro)
│   └── PatternOverlay (HTML boxes with labels)
├── Histogram Panel (volume + sentiment intensity)
├── Momentum Panel (oscillator view)
└── EnhancedTooltip (hover information)
```

### Series Managers (Modular)

Each chart series is managed independently via a manager class:

- **PriceSeriesManager** - Candlestick rendering
- **SentimentOverlayManager** - Sentiment line series
- **ConfidenceBandManager** - Upper/lower sentiment bounds
- **EventMarkersManager** - Event markers on price series
- **MomentumPanelManager** - RSI-style oscillator
- **HistogramSeriesManager** - Volume or sentiment intensity
- **PatternOverlayManager** - HTML-based pattern annotations

Each manager:
- ✅ Initializes independently
- ✅ Can be toggled on/off
- ✅ Handles its own data updates
- ✅ Cleans up on unmount

## Quick Start

### Basic Usage

```tsx
import { AdvancedSentimentChart } from '@/components/charts';
import { generateAdvancedChartResponse } from '@/components/charts';

function MyChart() {
  const response = generateAdvancedChartResponse('AAPL', '1d');
  
  return (
    <AdvancedSentimentChart
      data={response.data}
      patterns={response.patterns}
      asset="AAPL"
      interval="1d"
      onTimeframeChange={(tf) => console.log(tf)}
      options={{
        showToolbar: true,
        showHistogram: true,
        showMomentum: true,
        showPatterns: true,
        height: 800,
      }}
    />
  );
}
```

### With Real Backend

```tsx
import { AdvancedSentimentChart } from '@/components/charts';
import type { AdvancedChartResponse } from '@/components/charts';

function RealTimeChart() {
  const [response, setResponse] = useState<AdvancedChartResponse | null>(null);
  const [timeframe, setTimeframe] = useState<TimeFrame>('1d');

  useEffect(() => {
    // Replace with your API
    fetch(`/api/charts/advanced?asset=AAPL&interval=${timeframe}`)
      .then(r => r.json())
      .then(setResponse);
  }, [timeframe]);

  if (!response) return <div>Loading...</div>;

  return (
    <AdvancedSentimentChart
      data={response.data}
      patterns={response.patterns}
      asset="AAPL"
      interval={timeframe}
      onTimeframeChange={setTimeframe}
    />
  );
}
```

## Components

### AdvancedSentimentChart (Main Orchestrator)

**Props:**
```typescript
interface AdvancedSentimentChartProps {
  data: ChartPoint[];              // Chart data (OHLC + sentiment)
  patterns?: AIPattern[];          // AI-detected patterns
  asset: string;                   // e.g., "AAPL"
  interval: TimeFrame;             // "1h" | "6h" | "1d" | "7d"
  onTimeframeChange?: (tf) => void;
  options?: AdvancedChartOptions;
}

interface AdvancedChartOptions {
  showToolbar?: boolean;           // Default: true
  showHistogram?: boolean;         // Default: true
  showMomentum?: boolean;          // Default: true
  showPatterns?: boolean;          // Default: true
  height?: number;                 // Default: 800
}
```

### ChartToolbar

Professional toolbar with:
- **Timeframe Selector**: 1h, 6h, 1d, 7d
- **Zoom Controls**: Zoom in/out, auto-fit
- **Display Toggles**: Show/hide sentiment, confidence, patterns, volume, momentum
- **Advanced**: Compare button (disabled/placeholder), settings

### EnhancedTooltip

Rich hover tooltip showing:
- **Time** - Precise timestamp
- **OHLC** - Candlestick values
- **Sentiment** - Score (-1 to +1) with visual bar
- **Confidence** - Signal strength percentage
- **Momentum** - Oscillator value
- **Volume** - Trading volume (formatted)
- **Emotion** - Emotion breakdown (optimism, fear, anger, neutral)

### PatternOverlay

HTML-based AI pattern boxes:
- **Visual**: Colored boxes with borders (bullish/bearish/neutral)
- **Information**: Label, confidence %, description
- **Styling**: Glassmorphism, dynamic opacity
- **Interaction**: Hover to highlight, smooth transitions

Example pattern:
```
┌─────────────────────────────┐
│ Ascending Triangle          │
│ 73% confidence              │
│ Pattern suggests upward...  │
└─────────────────────────────┘
```

## Data Contracts

### ChartPoint Schema

```typescript
interface ChartPoint {
  time: number;                    // UNIX timestamp (seconds)
  
  // Price (OHLC)
  open: number;
  high: number;
  low: number;
  close: number;
  
  // Sentiment
  sentiment: number;               // -1 (bearish) to +1 (bullish)
  sentimentUpper?: number;         // Confidence band upper
  sentimentLower?: number;         // Confidence band lower
  confidence?: number;             // 0 to 1
  
  // Oscillators
  momentum?: number;               // Centered around 0
  
  // Volume
  volume?: number;
  
  // Emotions
  emotion?: {
    optimism?: number;
    fear?: number;
    anger?: number;
    neutral?: number;
  };
  
  // Events
  events?: ChartEvent[];
}
```

### AIPattern Schema

```typescript
interface AIPattern {
  id: string;
  type: "ascending-triangle" | "bullish-engulfing" | "sentiment-shift" | string;
  label: string;                   // e.g., "Ascending Triangle"
  confidence: number;              // 0-100
  startTime: number;               // UNIX seconds
  endTime: number;
  bias: "bullish" | "bearish" | "neutral";
  description?: string;
  strength?: "weak" | "moderate" | "strong";
}
```

### API Response

```typescript
interface AdvancedChartResponse {
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
```

## Features

### 1. Candlestick Chart (Primary)
- Standard OHLC rendering
- Green (bullish) / Red (bearish) colors
- Always visible
- Professional TradingView styling

### 2. Sentiment Overlay
- Line series (-1 to +1)
- Dynamic coloring (green/red/gray)
- Toggle on/off
- Smooth interpolation

### 3. Confidence Band
- Upper/lower sentiment bounds
- Semi-transparent shading
- Visualizes signal strength
- Toggle on/off

### 4. Event Markers
- Vertical markers on candlesticks
- Color-coded by type (earnings, news, macro, product)
- Hover tooltips
- Toggle on/off

### 5. AI Pattern Overlays (Signature Feature)
- HTML-based boxes spanning time ranges
- Labeled with type, confidence, bias
- Color-coded (bullish green, bearish red, neutral gray)
- Opacity scales with confidence
- Hover highlights
- Rich descriptions

### 6. Histogram Panel
- Volume bars (colored by direction)
- OR sentiment intensity (confidence × sentiment strength)
- Synced time scale with main chart

### 7. Momentum Panel
- RSI-style oscillator
- Separate chart instance
- Synced crosshair and time scale
- Synced zoom/pan

### 8. Interactions
- **Crosshair**: Synced across all panels
- **Zoom**: Wheel and pinch gestures
- **Pan**: Drag to move
- **Tooltips**: Hover for rich information
- **Timeframe Toggle**: Switch intervals instantly

## Styling

### Colors (NeomSense Theme)

```typescript
background: '#0f1419'              // Deep dark blue
textPrimary: '#e5e7eb'             // Light gray
textSecondary: '#9ca3af'           // Medium gray
bullish: '#10b981'                 // Emerald green
bearish: '#ef4444'                 // Red
neutral: '#6b7280'                 // Gray
accent1: '#06b6d4'                 // Cyan
accent2: '#a855f7'                 // Purple
accent3: '#f59e0b'                 // Amber
```

### Glassmorphism

- Backdrop blur: 4px
- Opacity: 0.5-0.95
- Subtle shadows
- Rounded corners: 8px

### Typography

- Font: Inter (system sans-serif fallback)
- Headers: Bold, 12-14px
- Body: Regular, 12px
- Captions: Regular, 10-11px

## Performance

### Optimization Strategies

✅ **useRef for chart instances** - Prevents re-creation on render  
✅ **Lazy initialization** - Series only created when needed  
✅ **Efficient updates** - Data replacement, not incremental  
✅ **Proper cleanup** - Listeners removed on unmount  
✅ **Hardware acceleration** - Canvas rendering  

### Best Practices

- **Data points**: Keep under 500 per chart
- **Aggregation**: Use higher timeframes for historical data
- **Debouncing**: Debounce API calls on timeframe change
- **Memoization**: Memoize data computations
- **Lazy loading**: Only initialize when visible

## Integration Examples

### In AdvancedTradingChart

```tsx
import { AdvancedSentimentChart } from '@/components/charts';

export const AdvancedTradingChart = () => {
  const [chartData, setChartData] = useState<any>(null);
  
  return (
    <div>
      {/* Existing toolbar */}
      
      {activeTab === 'sentiment-pro' && (
        <AdvancedSentimentChart
          data={chartData.data}
          patterns={chartData.patterns}
          asset={symbol}
          interval={timeframe}
          onTimeframeChange={handleTimeframeChange}
          options={{
            height: 700,
            showToolbar: true,
          }}
        />
      )}
    </div>
  );
};
```

### As Standalone Page

```tsx
import { AdvancedChartDemo } from '@/components/charts';

// Add to router
<Route path="/chart/advanced" component={AdvancedChartDemo} />
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
      "emotion": {
        "optimism": 0.35,
        "fear": 0.15,
        "anger": 0.05,
        "neutral": 0.45
      },
      "events": [
        {
          "id": "earnings-q4",
          "type": "earnings",
          "label": "Q4 Earnings",
          "impact": 0.15
        }
      ]
    }
  ],
  "patterns": [
    {
      "id": "pattern-1",
      "type": "ascending-triangle",
      "label": "Ascending Triangle",
      "confidence": 73,
      "startTime": 1703808000,
      "endTime": 1704326400,
      "bias": "bullish",
      "strength": "moderate",
      "description": "Pattern suggests upward breakout potential"
    }
  ],
  "metadata": {
    "timestamp": 1704412800,
    "dataPoints": 100,
    "sentimentRange": [-0.45, 0.78]
  }
}
```

### Required Fields
- `time` (UNIX seconds)
- `open`, `high`, `low`, `close`
- `sentiment` (-1 to +1)

### Optional but Recommended
- `sentimentUpper`, `sentimentLower`
- `confidence`
- `momentum`
- `volume`
- `emotion`
- `events`
- `patterns`

## Troubleshooting

### Chart Not Rendering
- ✓ Check container is mounted
- ✓ Verify data array is not empty
- ✓ Ensure `time` values are UNIX timestamps in seconds

### Sentiment Overlay Missing
- ✓ Verify `sentiment` field exists
- ✓ Check `showSentiment` is true (toggle in toolbar)
- ✓ Confirm values are in range [-1, 1]

### Patterns Not Showing
- ✓ Verify `patterns` array is populated
- ✓ Check pattern time ranges are within data range
- ✓ Ensure `showPatterns` is true

### Performance Issues
- ✓ Reduce data points (aggregate or paginate)
- ✓ Monitor browser DevTools for memory leaks
- ✓ Verify cleanup on unmount

## Browser Support

✅ Chrome/Edge 60+  
✅ Firefox 55+  
✅ Safari 12+  
✅ Mobile browsers (iOS Safari, Chrome Android)  

## Accessibility

- Keyboard controls (arrows, +/-)
- Crosshair position in tooltips
- High contrast dark theme
- Semantic HTML in documentation

## Next Steps

1. **Connect to Backend**: Replace mock data with real API calls
2. **Add to Navigation**: Include link in app menu
3. **Customize Styling**: Adjust colors in `chartTheme.ts`
4. **Real-Time Updates**: Implement WebSocket streaming
5. **Pattern Actions**: Add click handlers for pattern interaction
6. **Comparison Mode**: Implement multi-asset overlays

## References

- [TradingView Lightweight Charts](https://tradingview.github.io/lightweight-charts/)
- [NeomSense Design System](../../../design-system-docs)
- [Chart Types Documentation](./chartTypes.ts)
- [Demo Component](./AdvancedChartDemo.tsx)

---

**Built for NeomSense** - The Next Generation of Sentiment Intelligence
