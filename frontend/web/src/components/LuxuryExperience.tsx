import React, { useState } from 'react';
import { LuxuryNavigation } from './LuxuryNavigation';
import { LuxuryHomepage } from './LuxuryHomepage';
import { MoodThemeDemo } from './MoodThemeDemo';
import { useMoodTheme } from '../contexts/MoodThemeContext';

export const LuxuryExperience: React.FC = () => {
  const [activeSection, setActiveSection] = useState('luxury-home');
  const { isDynamicMode, bodyGradient } = useMoodTheme();

  const renderContent = () => {
    switch (activeSection) {
      case 'luxury-home':
        return <LuxuryHomepage />;
      case 'market-mood':
        return (
          <div className="pt-20 min-h-screen luxury-gradient flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-light text-white mb-4">Market Mood</h1>
              <p className="text-gray-400">Advanced sentiment analysis coming soon...</p>
            </div>
          </div>
        );
      case 'watchlist':
        return (
          <div className="pt-20 min-h-screen luxury-gradient flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-light text-white mb-4">Elite Watchlist</h1>
              <p className="text-gray-400">Premium portfolio tracking coming soon...</p>
            </div>
          </div>
        );
      case 'news-feed':
        return (
          <div className="pt-20 min-h-screen luxury-gradient flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-light text-white mb-4">Curated Intelligence</h1>
              <p className="text-gray-400">AI-powered news feed coming soon...</p>
            </div>
          </div>
        );
      case 'community':
        return (
          <div className="pt-20 min-h-screen luxury-gradient flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-light text-white mb-4">Elite Community</h1>
              <p className="text-gray-400">Premium member discussions coming soon...</p>
            </div>
          </div>
        );
      case 'theme-demo':
        return (
          <div className="pt-20">
            <MoodThemeDemo />
          </div>
        );
      default:
        return <LuxuryHomepage />;
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDynamicMode ? bodyGradient : 'luxury-gradient'}`}>
      <LuxuryNavigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      {renderContent()}
    </div>
  );
};
