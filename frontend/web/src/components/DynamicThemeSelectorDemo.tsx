import React, { useEffect } from 'react';
import { useMoodTheme } from '@/contexts/MoodThemeContext';
import DynamicThemeSelector from './DynamicThemeSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';

const DynamicThemeSelectorDemo = () => {
  const { 
    setMoodScore, 
    moodState, 
    moodLabel, 
    moodEmoji,
    bodyGradient,
    currentThemeClasses,
    isDynamicMode,
    themeMode 
  } = useMoodTheme();

  // Simulate different mood scores for testing
  const simulateMoodScores = [
    { label: 'Extreme Bullish', score: 75, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Bullish', score: 25, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Neutral', score: 0, icon: Activity, color: 'text-blue-500' },
    { label: 'Bearish', score: -25, icon: TrendingDown, color: 'text-gray-500' },
    { label: 'Extreme Bearish', score: -75, icon: TrendingDown, color: 'text-red-600' },
  ];

  const handleMoodChange = (score: number) => {
    setMoodScore({
      overall: score,
      stocks: score,
      news: score * 0.8,
      social: score * 1.2,
      timestamp: new Date(),
    });
  };

  // Set initial mood score
  useEffect(() => {
    handleMoodChange(0);
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-500 ease-in-out ${bodyGradient} ${currentThemeClasses}`}>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dynamic Theme Selector Demo</h1>
            <p className="text-muted-foreground mt-2">
              Experience how the theme changes based on market sentiment
            </p>
          </div>
          <DynamicThemeSelector />
        </div>

        {/* Current Status */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <span className="text-2xl">{moodEmoji}</span>
              <span>Current Market Mood: {moodLabel}</span>
              {isDynamicMode && (
                <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-300">
                  <Zap className="h-3 w-3 mr-1" />
                  Dynamic Active
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Theme Mode: <span className="font-semibold capitalize">{themeMode}</span>
              {isDynamicMode && " (adapting to sentiment)"}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Mood Simulation Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Simulate Market Sentiment</CardTitle>
            <CardDescription>
              Click the buttons below to see how the dynamic theme responds to different market moods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {simulateMoodScores.map((mood) => {
                const Icon = mood.icon;
                return (
                  <Button
                    key={mood.label}
                    variant="outline"
                    className="flex flex-col items-center p-4 h-auto space-y-2 hover:shadow-lg transition-all duration-200"
                    onClick={() => handleMoodChange(mood.score)}
                  >
                    <Icon className={`h-6 w-6 ${mood.color}`} />
                    <span className="text-sm font-medium">{mood.label}</span>
                    <Badge variant="outline" className="text-xs">
                      Score: {mood.score > 0 ? '+' : ''}{mood.score}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Feature Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>☀️</span>
                <span>Light Mode</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Classic bright theme with clean, professional aesthetics perfect for daytime use.
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🌙</span>
                <span>Dark Mode</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Elegant dark theme that's easy on the eyes and reduces strain during extended use.
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>⚡</span>
                <span>Dynamic Mood</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Automatically adapts colors and styling based on real-time market sentiment analysis.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Current Theme Info */}
        {isDynamicMode && (
          <Card className="border-dashed border-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Dynamic Theme Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Current Mood:</strong> {moodLabel} {moodEmoji}</div>
                <div><strong>Theme Response:</strong> Colors and gradients automatically adjust</div>
                <div><strong>Visual Feedback:</strong> Animated borders and glow effects active</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DynamicThemeSelectorDemo;
