import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Search,
  Filter,
  Settings,
  TrendingUp,
  Newspaper,
  MessageSquare,
  BarChart3,
  Brain,
  RefreshCw,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useMoodTheme } from '../../contexts/MoodThemeContext';

interface MarketMoodControlsProps {
  title?: string;
  showFilters?: boolean;


  onSourceToggle?: (sources: string[]) => void;
  onSearch?: (query: string) => void;
  onExplainMood?: () => void;
  onViewAnalytics?: () => void;
}

interface FilterState {
  sources: {
    stocks: boolean;
    news: boolean;
    social: boolean;
  };
  searchQuery: string;
}

export const MarketMoodControls: React.FC<MarketMoodControlsProps> = ({
  title = "Market Mood Controls",
  showFilters = true,
  onSourceToggle,
  onSearch,
  onExplainMood,
  onViewAnalytics
}) => {
  const { themeMode } = useMoodTheme();
  const [filters, setFilters] = useState<FilterState>({
    sources: {
      stocks: true,
      news: true,
      social: true
    },
    searchQuery: ''
  });
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);



  const sources = [
    { key: 'stocks', label: 'Stocks', icon: TrendingUp, color: 'emerald' },
    { key: 'news', label: 'News', icon: Newspaper, color: 'blue' },
    { key: 'social', label: 'Social', icon: MessageSquare, color: 'purple' }
  ];



  const handleSourceToggle = (sourceKey: string) => {
    const newSources = {
      ...filters.sources,
      [sourceKey]: !filters.sources[sourceKey as keyof FilterState['sources']]
    };
    setFilters(prev => ({ ...prev, sources: newSources }));
    
    const activeSources = Object.entries(newSources)
      .filter(([_, active]) => active)
      .map(([key]) => key);
    
    onSourceToggle?.(activeSources);
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
    onSearch?.(query);
  };

  const handleExplainMood = () => {
    setIsExplaining(true);
    onExplainMood?.();
    setTimeout(() => setIsExplaining(false), 2000);
  };

  const getSourceColor = (color: string) => {
    // Theme-aware colors that work in both light and dark modes
    const colors = {
      emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 dark:hover:bg-emerald-500/30',
      blue: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30 dark:hover:bg-blue-500/30',
      purple: 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30 dark:hover:bg-purple-500/30'
    };
    return colors[color as keyof typeof colors] || colors.purple;
  };

  const getActiveSources = () => {
    return Object.entries(filters.sources)
      .filter(([_, active]) => active)
      .map(([key]) => key);
  };

  return (
    <Card className="finance-card border-0">
      <CardHeader className="border-b border-theme">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-theme-primary">
            <Settings className="w-5 h-5 text-theme-accent" />
            {title}
          </CardTitle>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
            {getActiveSources().length}/3 sources active
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Search Bar */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-theme-primary">Search Tickers or Topics</label>
          <div className="relative">
            <div className={cn(
              "relative transition-all duration-300",
              isSearchFocused ? "transform scale-105" : ""
            )}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-theme-muted" />
              <Input
                type="text"
                placeholder="Search NVDA, AI, crypto..."
                value={filters.searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={cn(
                  "pl-10 pr-4 py-3 rounded-xl transition-all duration-300",
                  "bg-card border-border text-foreground placeholder:text-muted-foreground",
                  "focus:border-primary/50 focus:ring-0 focus:outline-none",
                  isSearchFocused && "shadow-lg shadow-primary/10 border-primary/30"
                )}
              />
              {isSearchFocused && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
              )}
            </div>
          </div>
        </div>

        {showFilters && (
          <>
            {/* Source Toggles - View Only */}
            <div className="space-y-3 opacity-90">
              <label className="text-sm font-medium text-theme-primary flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                Data Sources
                <span className="text-xs text-theme-muted ml-auto">🔒️ Pre-selected for transparency</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {sources.map((source) => {
                  const IconComponent = source.icon;
                  const isActive = filters.sources[source.key as keyof FilterState['sources']];

                  return (
                    <div
                      key={source.key}
                      className={cn(
                        "h-16 p-4 flex flex-col items-center gap-2 border cursor-default",
                        isActive
                          ? getSourceColor(source.color).split(' ').filter(cls => !cls.startsWith('hover:')).join(' ')
                          : "border-border bg-muted/30"
                      )}
                    >
                      <IconComponent className="w-7 h-7" />
                      <span className="text-xs font-medium">{source.label}</span>
                      {isActive && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-current rounded-full" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* AI Controls */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-theme-primary flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            AI Analysis
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={handleExplainMood}
              disabled={isExplaining}
              className={cn(
                "h-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30",
                "text-primary-foreground font-medium border border-purple-500/30 transition-all duration-300",
                "hover:shadow-lg hover:shadow-purple-500/20"
              )}
            >
              {isExplaining ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Explain Today's Mood
                </>
              )}
            </Button>
            
            <Button
              onClick={onViewAnalytics}
              className={cn(
                "h-12 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30",
                "text-primary-foreground font-medium border border-blue-500/30 transition-all duration-300",
                "hover:shadow-lg hover:shadow-blue-500/20"
              )}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Detailed Analytics
            </Button>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(filters.searchQuery || getActiveSources().length < 3) && (
          <div className="pt-4 border-t border-border/50">
            <div className="flex flex-wrap gap-2">
              {filters.searchQuery && (
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                  Search: "{filters.searchQuery}"
                </Badge>
              )}
              {getActiveSources().length < 3 && (
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  {getActiveSources().length}/3 sources
                </Badge>
              )}

            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
