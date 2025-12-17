import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useMoodTheme } from '../../contexts/MoodThemeContext';
import { cn } from '../../lib/utils';

interface MarketDriver {
  id: string;
  icon: string;
  reason: string;
  category: 'stocks' | 'news' | 'social';
  impact: 'high' | 'medium' | 'low';
}

interface MarketDriversProps {
  onDriverClick?: (driverId: string, category: string) => void;
  className?: string;
}

export const MarketDrivers: React.FC<MarketDriversProps> = ({
  onDriverClick,
  className
}) => {
  const { themeMode, moodScore } = useMoodTheme();

  // Dynamic market drivers based on current mood data
  const getTopDrivers = (): MarketDriver[] => {
    const drivers: MarketDriver[] = [
      {
        id: 'tech-earnings',
        icon: '📈',
        reason: 'Tech earnings beat expectations +8%',
        category: 'stocks',
        impact: 'high'
      },
      {
        id: 'fed-signals',
        icon: '📰',
        reason: 'Fed signals no rate hike this month',
        category: 'news',
        impact: 'high'
      },
      {
        id: 'retail-surge',
        icon: '👥',
        reason: 'Retail investor activity surge +15%',
        category: 'social',
        impact: 'medium'
      }
    ];

    // Sort drivers by impact and mood score relevance
    if (moodScore) {
      if (moodScore.stocks > moodScore.news && moodScore.stocks > moodScore.social) {
        drivers.unshift(drivers.splice(drivers.findIndex(d => d.category === 'stocks'), 1)[0]);
      } else if (moodScore.news > moodScore.social) {
        drivers.unshift(drivers.splice(drivers.findIndex(d => d.category === 'news'), 1)[0]);
      }
    }

    return drivers.slice(0, 3);
  };

  const topDrivers = getTopDrivers();

  const handleDriverClick = (driver: MarketDriver) => {
    if (onDriverClick) {
      onDriverClick(driver.id, driver.category);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return themeMode === 'light' ? 'text-green-600' : 'text-green-400';
      case 'medium': return themeMode === 'light' ? 'text-yellow-600' : 'text-yellow-400';
      case 'low': return themeMode === 'light' ? 'text-gray-600' : 'text-gray-400';
      default: return themeMode === 'light' ? 'text-gray-600' : 'text-gray-400';
    }
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200 hover:scale-[1.02] rounded-2xl",
      themeMode === 'light'
        ? 'bg-white border-[#E0E0E0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]'
        : 'bg-[#111827] border-slate-700/50 hover:shadow-lg hover:shadow-purple-500/20',
      className
    )}>
      
      {/* Rainbow accent border at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />
      
      <CardHeader className={cn(
        "pb-3",
        themeMode === 'light' ? 'border-b border-gray-100' : 'border-b border-slate-700/50'
      )}>
        <CardTitle className={cn(
          "text-lg font-bold flex items-center gap-2",
          themeMode === 'light' ? 'text-slate-900' : 'text-white'
        )}>
          🎯 Market Drivers (Top 3)
        </CardTitle>
      </CardHeader>

      {/* Subtle gradient divider */}
      <div className={cn(
        "h-px mx-6 mb-4",
        themeMode === 'light'
          ? 'bg-gradient-to-r from-transparent via-gray-200 to-transparent'
          : 'bg-gradient-to-r from-transparent via-slate-600 to-transparent'
      )} />

      <CardContent className="p-4 pt-0 space-y-3">
        {topDrivers.map((driver, index) => (
          <div
            key={driver.id}
            onClick={() => handleDriverClick(driver)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
              "hover:scale-[1.02] group",
              themeMode === 'light'
                ? 'hover:bg-gray-50 hover:shadow-sm'
                : 'hover:bg-slate-800/50 hover:border hover:border-purple-500/20'
            )}
          >
            {/* Icon */}
            <div className="text-xl flex-shrink-0 animate-pulse">
              {driver.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className={cn(
                "text-sm font-medium truncate group-hover:underline decoration-2 underline-offset-2",
                themeMode === 'light' ? 'text-slate-700' : 'text-slate-200'
              )}>
                {driver.reason}
              </div>
              <div className={cn(
                "text-xs mt-1",
                getImpactColor(driver.impact)
              )}>
                {driver.impact.charAt(0).toUpperCase() + driver.impact.slice(1)} Impact
              </div>
            </div>

            {/* Hover indicator */}
            <div className={cn(
              "w-2 h-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100",
              themeMode === 'light' ? 'bg-blue-500' : 'bg-purple-400'
            )} />
          </div>
        ))}

        {/* Footer hint */}
        <div className={cn(
          "text-xs text-center pt-2 border-t",
          themeMode === 'light' 
            ? 'text-gray-500 border-gray-100'
            : 'text-slate-400 border-slate-700'
        )}>
          Click any driver for detailed analysis
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketDrivers;
