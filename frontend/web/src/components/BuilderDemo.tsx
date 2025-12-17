import React from "react";
import { MoodScoreHero } from "./builder/MoodScoreHero";
import { TopStocksModule } from "./builder/TopStocksModule";

export const BuilderDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <MoodScoreHero
          title="Market Sentiment Dashboard"
          subtitle="Powered by Builder.io modular components"
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <TopStocksModule
              title="Top Performing Stocks"
              maxStocks={5}
              showSentiment={true}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <TopStocksModule
              title="Trending Stocks"
              maxStocks={5}
              showSentiment={false}
            />
          </div>
        </div>

        {/* Full Width Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            🧱 Builder.io Integration Ready
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                ✅ Components Created
              </h4>
              <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                <li>• MoodScoreHero</li>
                <li>• TopStocksModule</li>
                <li>• NewsFeedModule</li>
                <li>• SentimentChart</li>
                <li>• TrendingTopicsModule</li>
                <li>• AIInsightModule</li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                🎛️ Configurable Props
              </h4>
              <ul className="text-green-700 dark:text-green-300 space-y-1">
                <li>• Titles & Subtitles</li>
                <li>• API Endpoints</li>
                <li>• Display Options</li>
                <li>• Color Themes</li>
                <li>• Data Limits</li>
              </ul>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                🔌 Ready for Builder.io
              </h4>
              <ul className="text-purple-700 dark:text-purple-300 space-y-1">
                <li>• Drag & Drop Ready</li>
                <li>• TypeScript Support</li>
                <li>• Responsive Design</li>
                <li>• Real API Integration</li>
                <li>• Live Data Updates</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium mb-2">🚀 Next Steps:</h4>
            <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>1. Set up your Builder.io account and get API key</li>
              <li>2. Add VITE_BUILDER_API_KEY to your environment variables</li>
              <li>3. Register components using builder-registry.ts</li>
              <li>4. Create pages in Builder.io visual editor</li>
              <li>5. Drag and drop your custom components!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderDemo;
