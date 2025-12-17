import React, { useState } from 'react';
import { Brain, BarChart3, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useMoodTheme } from '../contexts/MoodThemeContext';
import { cn } from '../lib/utils';

interface AIAnalysisSectionProps {
  onExplainMood?: () => void;
  onViewAnalytics?: () => void;
  className?: string;
}

export const AIAnalysisSection: React.FC<AIAnalysisSectionProps> = ({
  onExplainMood,
  onViewAnalytics,
  className
}) => {
  const { themeMode } = useMoodTheme();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const handleExplainMood = () => {
    onExplainMood?.();
  };

  const handleViewAnalytics = () => {
    onViewAnalytics?.();
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden bg-card border-border shadow-sm",
        themeMode === 'light'
          ? 'rounded-xl'
          : 'border-purple-500/20 backdrop-blur-xl',
        className
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className={cn(
          "flex items-center gap-2 text-lg font-medium text-card-foreground"
        )}>
          <Sparkles className="w-5 h-5 text-purple-500" />
          AI Analysis
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Explain Today's Mood Button */}
          <Button
            onClick={handleExplainMood}
            onMouseEnter={() => setHoveredButton('mood')}
            onMouseLeave={() => setHoveredButton(null)}
            className={cn(
              "relative h-14 flex-1 max-w-[350px] rounded-2xl border-0 font-bold",
              "transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2",
              "bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow-lg shadow-pink-500/25",
              hoveredButton === 'mood' ? 'scale-[1.03] from-pink-600 to-pink-500 shadow-pink-500/40' : 'scale-100'
            )}
          >
            <Brain className="w-5 h-5 mr-2" />
            Explain Today's Mood
          </Button>

          {/* View Detailed Analytics Button */}
          <Button
            onClick={handleViewAnalytics}
            onMouseEnter={() => setHoveredButton('analytics')}
            onMouseLeave={() => setHoveredButton(null)}
            className={cn(
              "relative h-14 flex-1 max-w-[350px] rounded-2xl border-0 font-bold",
              "transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2",
              "bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg shadow-blue-500/25",
              hoveredButton === 'analytics' ? 'scale-[1.03] from-blue-600 to-blue-500 shadow-blue-500/40' : 'scale-100'
            )}
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            View Detailed Analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAnalysisSection;
