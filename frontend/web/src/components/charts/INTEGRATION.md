# SentimentChart Integration Guide

## Installation ✅ Done

Package already installed:
```bash
npm install lightweight-charts
```

## File Structure ✅ Complete

All modules created in `/client/src/components/charts/`:

```
chartTypes.ts         ✓ Data contracts
chartTheme.ts         ✓ Styling & colors
PriceSeries.ts        ✓ OHLC manager
SentimentOverlay.ts   ✓ Sentiment line
ConfidenceBand.ts     ✓ Confidence bounds
EventMarkers.ts       ✓ Event overlays
MomentumPanel.ts      ✓ Oscillator
SentimentChart.tsx    ✓ Main component
mockChartData.ts      ✓ Test data
index.ts              ✓ Exports
README.md             ✓ Documentation
```

## Step 1: Add to Your Router

In `client/src/App.tsx`, add the demo route:

```tsx
import { SentimentChartDemo } from '@/components/charts';

// In your router/switch statement:
case "sentiment-chart-demo":
  return <SentimentChartDemo />;
```

Then navigate to it from the UI or add to navigation menu.

## Step 2: Use in Existing Components

### Option A: Standalone Chart Page

Create a new page component:

```tsx
// client/src/components/SentimentChartPage.tsx
import React, { useState, useEffect } from 'react';
import { SentimentChart, generateMockChartData, TimeFrame } from '@/components/charts';
import type { ChartPoint } from '@/components/charts';

export const SentimentChartPage: React.FC = () => {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [asset, setAsset] = useState('AAPL');
  const [timeframe, setTimeframe] = useState<TimeFrame>('1d');

  useEffect(() => {
    // Replace with your API call:
    // const response = await fetch(`/api/charts/${asset}?interval=${timeframe}`);
    // const data = await response.json();
    // setData(data.data);

    // For now, use mock data:
    const mockData = generateMockChartData(asset, timeframe, 100);
    setData(mockData);
  }, [asset, timeframe]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] to-[#1a1f35] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Market Sentiment Analysis</h1>
        
        <SentimentChart
          data={data}
          asset={asset}
          interval={timeframe}
          onTimeframeChange={setTimeframe}
          height={700}
        />
      </div>
    </div>
  );
};
```

### Option B: Embedded in AdvancedTradingChart

Update `client/src/components/finance/AdvancedTradingChart.tsx`:

```tsx
import { SentimentChart } from '@/components/charts';
import type { TimeFrame } from '@/components/charts';

export const AdvancedTradingChart = ({ onNavigate }) => {
  const [sentimentData, setSentimentData] = useState<ChartPoint[]>([]);
  
  // ... existing code ...

  return (
    <div>
      {/* Existing chart tabs/controls */}
      
      {activeTab === 'sentiment' && (
        <SentimentChart
          data={sentimentData}
          asset={chartState.symbol}
          interval={chartState.timeframe as TimeFrame}
          onTimeframeChange={(tf) => {
            // Handle timeframe change
            console.log('New timeframe:', tf);
          }}
          height={500}
          showSentiment={true}
          showConfidenceBand={true}
          showEvents={true}
          showMomentum={true}
        />
      )}
    </div>
  );
};
```

## Step 3: Connect to Your Backend API

When your sentiment backend is ready, replace mock data:

```tsx
import { SentimentChartResponse } from '@/components/charts';

// Fetch real data
const fetchChartData = async (asset: string, interval: TimeFrame) => {
  try {
    const response = await fetch(
      `/api/charts/sentiment?asset=${asset}&interval=${interval}`
    );
    const data: SentimentChartResponse = await response.json();
    setChartData(data.data);
  } catch (error) {
    console.error('Failed to fetch chart data:', error);
    // Fall back to mock data
    setChartData(generateMockChartData(asset, interval));
  }
};
```

## Step 4: (Optional) Real-Time Updates

For live data streaming:

```tsx
useEffect(() => {
  const ws = new WebSocket(`wss://your-api.com/charts/${asset}/live`);
  
  ws.onmessage = (event) => {
    const newPoint = JSON.parse(event.data);
    setChartData(prev => [...prev.slice(-99), newPoint]); // Keep last 100 points
  };

  return () => ws.close();
}, [asset]);
```

## Step 5: Test Integration

1. **View the Demo:**
   - Navigate to `/sentiment-chart-demo` in your browser
   - Should show fully functional chart with all overlays

2. **Test Toggles:**
   - Click sentiment, band, events, momentum buttons
   - Overlays should appear/disappear smoothly

3. **Test Interactions:**
   - Scroll to zoom
   - Drag to pan
   - Hover to see crosshair + tooltip
   - Select different timeframes

## Backend API Contract

Your backend should provide this response:

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
  ]
}
```

### Required Fields
- `time` (UNIX timestamp, seconds)
- `open`, `high`, `low`, `close` (numbers)
- `sentiment` (number, -1 to +1)

### Optional Fields
- `sentimentUpper`, `sentimentLower` (confidence band)
- `confidence` (0 to 1)
- `momentum` (oscillator value)
- `volume` (trading volume)
- `emotion` (emotion breakdown)
- `events` (event markers)

## Customization

### Change Colors

Edit `client/src/components/charts/chartTheme.ts`:

```typescript
export const NeomSenseChartTheme = {
  sentiment: {
    bullish: '#00ff88',      // Change green
    bearish: '#ff0055',      // Change red
    neutral: '#888888',      // Change gray
  },
};
```

### Change Chart Height

```tsx
<SentimentChart height={800} />  // Default: 600
```

### Hide Overlays by Default

```tsx
<SentimentChart
  showSentiment={false}
  showConfidenceBand={false}
  showEvents={false}
  showMomentum={false}
/>
```

## Troubleshooting

### "Cannot find module 'lightweight-charts'"
- Install: `npm install lightweight-charts`
- Restart dev server

### Chart doesn't render
- Check data array is not empty
- Verify `time` values are valid UNIX timestamps (seconds, not ms)
- Ensure container div has a width

### Sentiment overlay not visible
- Check `showSentiment={true}` prop
- Verify data has `sentiment` field
- Check sentiment values are between -1 and +1

### TypeScript errors
- Ensure all data matches `ChartPoint` interface
- Import types properly: `import type { ChartPoint } from '@/components/charts'`

## Performance Tips

1. **Limit Data Points**: Keep under 500 points per chart
2. **Aggregate Old Data**: Use higher timeframes for historical data
3. **Debounce Fetches**: When timeframe changes
4. **Memoize Data**: Use `useMemo` for expensive computations
5. **Lazy Load**: Only initialize chart when visible

## Next Steps

1. ✅ Chart system is ready
2. 🔄 Connect to your backend sentiment API
3. 🔄 Add to navigation menu
4. 🔄 Customize colors to match NeomSense brand
5. 🔄 Add real-time WebSocket updates
6. 🔄 Create variant screens for different asset types

## Support

Refer to:
- `README.md` - Full documentation
- `SentimentChartDemo.tsx` - Working example
- `chartTypes.ts` - Type definitions
- TradingView docs: https://tradingview.github.io/lightweight-charts/

---

**You're all set!** 🚀 The chart system is production-ready and waiting for your data.
