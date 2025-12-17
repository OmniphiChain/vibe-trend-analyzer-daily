import React from 'react';
import { UnifiedRoomsBuilder } from './builder/UnifiedRoomsBuilder';

export const UnifiedRoomsDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Unified Rooms - Builder.io Component
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            A complete trading rooms experience built with Builder.io primitives
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Ready for drag-and-drop in Builder.io
          </div>
        </div>

        {/* Component Features */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🔍 Smart Filtering</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Real-time search and filtering by room type (General, Stocks, Crypto, Options, VIP)
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📊 Live Metrics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Real-time member count, message activity, and sentiment analysis with color coding
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📱 Responsive Design</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Desktop columns, tablet drawer, mobile single-column with fixed CTA button
            </p>
          </div>
        </div>

        {/* Live Component */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
            <h2 className="font-semibold text-gray-900 dark:text-white">Live Component Demo</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Fully interactive with state management and real-time filtering
            </p>
          </div>
          <UnifiedRoomsBuilder 
            title="Trading Rooms"
            subtitle="Connect with traders and discover market opportunities"
            showSearch={true}
            showFilters={true}
            showSort={true}
            maxRooms={8}
          />
        </div>

        {/* Technical Details */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">🛠️ Builder.io Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Available Props:</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• <code>title</code> - Page title (default: "Rooms")</li>
                <li>• <code>subtitle</code> - Page description</li>
                <li>• <code>showSearch</code> - Toggle search input</li>
                <li>• <code>showFilters</code> - Toggle filter tabs</li>
                <li>• <code>showSort</code> - Toggle sort dropdown</li>
                <li>• <code>maxRooms</code> - Number of rooms to display</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Features Included:</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Real-time search and filtering</li>
                <li>• Multiple sorting options (Active, Quality, New)</li>
                <li>• Room preview with sample messages</li>
                <li>• VIP room detection with upgrade prompts</li>
                <li>• Sentiment analysis with color coding</li>
                <li>• Mobile-responsive design</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">📋 Integration Instructions</h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <p>1. This component is already registered in Builder.io as <strong>"UnifiedRoomsBuilder"</strong></p>
            <p>2. Drag and drop it from the components panel in Builder.io editor</p>
            <p>3. Configure props in the right panel (title, subtitle, visibility toggles)</p>
            <p>4. The component uses Builder.io core primitives internally (Box, Text, Input, Button)</p>
            <p>5. All state management and interactions are built-in</p>
          </div>
        </div>
      </div>
    </div>
  );
};
