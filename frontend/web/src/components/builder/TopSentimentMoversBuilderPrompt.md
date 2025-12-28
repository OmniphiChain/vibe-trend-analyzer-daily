# 🎯 Builder.io AI Prompt: Top Sentiment Movers Widget

> **You are a top-level Builder.io designer. Create a visually compelling, real-time widget called "Top Sentiment Movers" for the Market Mood dashboard of the app MoorMeter.**

## 🧩 Widget Structure

### 🔹 Header Section:
- **Title**: `📊 Top Sentiment Movers` (with BarChart3 icon)
- **Tab Navigation**:
  - **Top Bullish (3)** → Active state: glowing emerald background `rgba(16, 185, 129, 0.2)`, emerald text `#34d399`, TrendingUp icon
  - **Top Bearish (3)** → Inactive state: transparent background, white text, TrendingDown icon
  - Smooth animated tab transitions with hover effects

### 📊 Sentiment Cards Grid (3-column layout)

Each card contains:

#### **Card Container**:
- Background: `linear-gradient(to right bottom, rgba(0, 0, 0, 0.6), rgba(88, 28, 135, 0.2))`
- Border: `rgba(255, 255, 255, 0.1)` with `border-radius: 12px`
- Padding: `20px`
- Hover effect: `hover:border-purple-500/30` with scale transform
- Transition: `transition-all duration-300`

#### **Stock Header Row**:
- **Avatar Circle**: 
  - Size: `40px × 40px`
  - Background: `linear-gradient(to right, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))`
  - Content: First letter of ticker (e.g., "N" for NVDA)
  - Font: `text-sm font-bold text-white`

- **Stock Info**:
  - **Ticker**: `NVDA` - `text-lg font-bold text-white`
  - **Company Name**: `NVIDIA Corp` - `text-xs text-slate-400`

- **Sentiment Badge**:
  - **Bullish**: `bg-emerald-500/20 text-emerald-400 border-emerald-500/30`
  - **Bearish**: `bg-red-500/20 text-red-400 border-red-500/30`
  - Style: Pill-shaped with `rounded-full` border

#### **Price & Trend Section (2-column grid)**:

**Left Column - Price Data**:
- **Price**: `$876.04` - `text-xl font-bold text-white`
- **Change**: `+23.42 (2.76%)` with ArrowUp icon
  - Green for positive: `text-emerald-400`
  - Red for negative: `text-red-400`

**Right Column - Sparkline**:
- **SVG Chart**: 60×20px sparkline with animated trend line
- **Stroke Color**: `#10b981` for bullish, `#ef4444` for bearish
- **Label**: `5D trend` - `text-xs text-slate-400`

#### **Sentiment Bars Section**:

**Market Sentiment Bar**:
- Label: `Market Sentiment` - `text-xs text-slate-400`
- Value: `87` - `text-white font-bold`
- Progress bar: `h-1.5 bg-slate-700 rounded-full`
- Fill: `bg-emerald-400` (bullish) or `bg-red-400` (bearish)
- Animation: `transition-all duration-500` with width based on sentiment value

**Social Sentiment Bar**:
- Label: `Social Sentiment` - `text-xs text-slate-400`  
- Value: `92` - `text-white font-bold`
- Progress bar: Same styling as above
- Fill: `bg-cyan-400` for social sentiment

#### **Footer Stats Row**:
- **Volume**: `Vol: 45.2M` - `text-xs text-slate-400`
- **Mentions**: `15,420 mentions` - `text-xs text-slate-400`
- Separated by border: `border-t border-slate-700/50`

### 📉 Summary Footer Section

Three-column stats grid:
- **Avg Bullish Sentiment**: `87` - `text-lg font-bold text-emerald-400`
- **Avg Bearish Sentiment**: `32` - `text-lg font-bold text-red-400`  
- **Total Volume**: `245.6M` - `text-lg font-bold text-cyan-400`

Each with descriptive labels in `text-xs text-slate-400`

## 🎨 Design Specifications

### **Color Palette**:
- Background: Dark finance card with `bg-black/40 border-purple-500/20 backdrop-blur-xl`
- Text Colors:
  - Primary: `text-white`
  - Secondary: `text-slate-400`
  - Accent Colors: `text-emerald-400`, `text-red-400`, `text-cyan-400`

### **Typography**:
- Font Family: Inter/System Sans-serif
- Sizes: `text-lg` (18px), `text-xl` (20px), `text-xs` (12px), `text-sm` (14px)
- Weights: `font-bold` (700), `font-medium` (500), `font-normal` (400)

### **Layout & Spacing**:
- Card Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Internal Spacing: `space-y-3`, `space-y-4`, `gap-2`, `gap-4`
- Border Radius: `rounded-xl` (12px), `rounded-full` for badges

### **Animations & Interactions**:
- **Hover Effects**: 
  - Cards: `hover:border-purple-500/30 transition-all duration-300`
  - Buttons: `hover:bg-purple-500/10`
- **Loading States**: Skeleton placeholders with shimmer
- **Progress Bars**: Animated fill with `transition-all duration-500`
- **Tab Switching**: Smooth background color transitions

### **Responsive Behavior**:
- **Desktop**: 3-column card grid
- **Tablet**: 2-column card grid  
- **Mobile**: Single column with horizontal scroll option

## ✅ Interactive Features

### **Real-time Data**:
- Auto-refresh every 15 seconds
- Real-time sentiment score updates
- Live price changes with color-coded indicators

### **User Interactions**:
- **Tab Switching**: Toggle between Bullish/Bearish movers
- **Card Hover**: Show "View Detailed Analysis" button
- **Expandable Details**: Click to view full sentiment breakdown
- **Sorting Options**: By sentiment score, volume, or price change

### **Loading States**:
- Skeleton cards during data fetch
- Shimmer animations for real-time updates
- Pulse indicators for active data streams

## 📱 Component Props (for Builder.io)

```typescript
interface TopSentimentMoversProps {
  title?: string;           // "Top Sentiment Movers"
  maxStocks?: number;       // 6 (3 bullish + 3 bearish)
  showSparklines?: boolean; // true
  autoRefresh?: boolean;    // true
  apiEndpoint?: string;     // "/api/stocks/top-movers"
  timeframe?: string;       // "5D", "1D", "1W"
}
```

## 🚀 Implementation Notes

- Use **CSS Grid** for responsive card layout
- Implement **SVG sparklines** for trend visualization  
- Add **CSS animations** for smooth transitions
- Include **loading skeletons** for better UX
- Ensure **accessibility** with proper ARIA labels
- Optimize for **mobile touch interactions**

This design creates a professional, data-rich widget that fits perfectly within the MoorMeter futuristic aesthetic while providing clear, actionable market sentiment insights.
