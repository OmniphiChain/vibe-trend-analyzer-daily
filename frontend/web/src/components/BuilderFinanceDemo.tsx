import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ExternalLink, Code, Palette } from 'lucide-react';
import { FinanceMoodGauge } from './builder/FinanceMoodGauge';
import { FinanceStockTable } from './builder/FinanceStockTable';
import { FinanceNewsFeed } from './builder/FinanceNewsFeed';
import { FinanceTrendingTopics } from './builder/FinanceTrendingTopics';
import { FinanceMoodChart } from './builder/FinanceMoodChart';

export const BuilderFinanceDemo: React.FC = () => {
  return (
    <div className="min-h-screen finance-gradient p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Palette className="h-10 w-10 text-blue-400" />
            Builder.io Finance Components
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-6">
            Professional finance-grade components ready for Builder.io visual editor. 
            These components are Bloomberg/CNBC-inspired and designed for traders, analysts, and fintech users.
          </p>
          
          <div className="flex justify-center gap-4">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 px-4 py-2">
              Finance Grade
            </Badge>
            <Badge className="bg-green-500/20 text-green-300 border-green-400/30 px-4 py-2">
              Builder.io Ready
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 px-4 py-2">
              Professional UI
            </Badge>
          </div>
        </div>

        {/* Component Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Components */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Finance Mood Gauge */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-white">FinanceMoodGauge</h2>
                <Badge className="bg-slate-700 text-slate-300 text-xs">Core Component</Badge>
              </div>
              <FinanceMoodGauge 
                title="Market Sentiment Gauge"
                subtitle="Professional circular gauge with real-time mood scoring and sentiment breakdown"
                size="medium"
                showBreakdown={true}
              />
              <div className="text-sm text-slate-400 bg-slate-800/50 p-3 rounded border border-slate-700">
                <strong>Builder.io Props:</strong> title, subtitle, showBreakdown, size (small/medium/large), apiEndpoint
              </div>
            </div>

            {/* Finance Stock Table */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-white">FinanceStockTable</h2>
                <Badge className="bg-slate-700 text-slate-300 text-xs">Data Component</Badge>
              </div>
              <FinanceStockTable 
                title="Professional Stock Table"
                maxStocks={5}
                showSentiment={true}
                showVolume={true}
                autoRefresh={false}
              />
              <div className="text-sm text-slate-400 bg-slate-800/50 p-3 rounded border border-slate-700">
                <strong>Builder.io Props:</strong> title, maxStocks, showSentiment, showVolume, autoRefresh
              </div>
            </div>

            {/* Finance Mood Chart */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-white">FinanceMoodChart</h2>
                <Badge className="bg-slate-700 text-slate-300 text-xs">Chart Component</Badge>
              </div>
              <FinanceMoodChart 
                title="Mood Trend Visualization"
                timeframe="7D"
                height={200}
                showControls={true}
                showLegend={true}
              />
              <div className="text-sm text-slate-400 bg-slate-800/50 p-3 rounded border border-slate-700">
                <strong>Builder.io Props:</strong> title, timeframe (1D/7D/30D/1Y), height, showControls, showLegend
              </div>
            </div>

            {/* Finance News Feed */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-white">FinanceNewsFeed</h2>
                <Badge className="bg-slate-700 text-slate-300 text-xs">Content Component</Badge>
              </div>
              <FinanceNewsFeed 
                title="AI-Curated News Feed"
                maxArticles={3}
                showSentiment={true}
                showSummary={true}
                autoRefresh={false}
                categories="finance,technology"
              />
              <div className="text-sm text-slate-400 bg-slate-800/50 p-3 rounded border border-slate-700">
                <strong>Builder.io Props:</strong> title, maxArticles, showSentiment, showSummary, autoRefresh, categories
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar Components */}
          <div className="space-y-8">
            
            {/* Finance Trending Topics */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-white">FinanceTrendingTopics</h2>
                <Badge className="bg-slate-700 text-slate-300 text-xs">Widget</Badge>
              </div>
              <FinanceTrendingTopics 
                title="Market Trends"
                maxTopics={6}
                showVolume={true}
                autoRefresh={false}
                platforms="reddit,twitter,discord"
              />
              <div className="text-sm text-slate-400 bg-slate-800/50 p-3 rounded border border-slate-700">
                <strong>Builder.io Props:</strong> title, maxTopics, showVolume, autoRefresh, platforms
              </div>
            </div>

            {/* Builder.io Integration Guide */}
            <Card className="finance-card border-0">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="flex items-center gap-2 text-white text-sm">
                  <Code className="w-4 h-4 text-blue-400" />
                  Builder.io Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Step 1: Register Components</h4>
                    <p className="text-xs text-slate-400">All finance components are registered in <code className="bg-slate-700 px-1 rounded">builder-registry.ts</code></p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Step 2: Use in Builder.io</h4>
                    <p className="text-xs text-slate-400">Drag and drop components from the custom components panel</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Step 3: Configure Props</h4>
                    <p className="text-xs text-slate-400">Use the visual editor to customize titles, limits, and API endpoints</p>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-slate-700/50">
                  <button className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    View Builder.io Documentation
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Design Features */}
            <Card className="finance-card border-0">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="flex items-center gap-2 text-white text-sm">
                  <Palette className="w-4 h-4 text-blue-400" />
                  Design Features
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-sm text-slate-300">Bloomberg-inspired UI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-sm text-slate-300">Professional color scheme</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span className="text-sm text-slate-300">Real-time data updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full" />
                    <span className="text-sm text-slate-300">Sentiment visualization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                    <span className="text-sm text-slate-300">Market data tables</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <span className="text-sm text-slate-300">Interactive charts</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Builder.io Prompt */}
        <Card className="finance-card border-0 mt-12">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="text-white">📋 Ready-to-Use Builder.io Prompt</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <pre className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
{`🧠 Builder.io Prompt: Finance-Grade MoorMeter Components

Design a professional finance dashboard using these registered components:

• FinanceMoodGauge - Central sentiment gauge with breakdown
• FinanceStockTable - Bloomberg-style stock data table  
• FinanceNewsFeed - AI-curated news with sentiment analysis
• FinanceTrendingTopics - Real-time trending market topics
• FinanceMoodChart - Interactive mood trend visualization

Layout:
- Header: Logo, navigation, search bar
- Hero: FinanceMoodGauge (large, with breakdown)
- Main: FinanceStockTable + FinanceMoodChart
- Sidebar: FinanceTrendingTopics + personal widgets
- Content: FinanceNewsFeed with sentiment badges

Style: Dark navy background, professional blue accents, 
subtle shadows, clean typography. Finance-grade aesthetic 
suitable for Bloomberg Terminal users.`}
              </pre>
            </div>
            <div className="mt-4 text-sm text-slate-400">
              Copy this prompt and paste it into Builder.io AI Assistant to generate a complete finance dashboard.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
