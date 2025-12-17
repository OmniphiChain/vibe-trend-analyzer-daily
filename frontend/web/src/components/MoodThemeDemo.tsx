import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useMoodTheme } from '../contexts/MoodThemeContext';
import { MoodThemeToggle } from './ui/mood-theme-toggle';
import { MoodPulseIndicator } from './ui/mood-pulse-indicator';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Palette,
  Eye,
  RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';

export const MoodThemeDemo: React.FC = () => {
  const { 
    moodState, 
    moodScore, 
    setMoodScore, 
    isDynamicMode, 
    accentColor, 
    glowEffect,
    moodEmoji,
    moodLabel 
  } = useMoodTheme();

  const [isAnimating, setIsAnimating] = useState(false);

  // Simulate different mood scores for demo
  const demoMoodScores = [
    { label: 'Extreme Bearish', overall: -40, stocks: -35, news: -45, social: -38 },
    { label: 'Bearish', overall: -20, stocks: -15, news: -25, social: -18 },
    { label: 'Neutral', overall: 5, stocks: 8, news: 2, social: 6 },
    { label: 'Bullish', overall: 30, stocks: 35, news: 25, social: 32 },
    { label: 'Extreme Bullish', overall: 65, stocks: 70, news: 60, social: 68 },
  ];

  const simulateMoodChange = (newScore: any) => {
    setIsAnimating(true);
    setMoodScore({
      ...newScore,
      timestamp: new Date()
    });
    setTimeout(() => setIsAnimating(false), 2000);
  };

  const getMoodStateDemo = (score: number) => {
    if (score >= 51) return 'extreme';
    if (score <= -51) return 'extreme';
    if (score >= 11 && score <= 50) return 'bullish';
    if (score >= -50 && score <= -11) return 'bearish';
    return 'neutral';
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Palette className="h-10 w-10" />
          Mood Theme System Demo
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experience how the app's visual theme dynamically adapts to market sentiment. 
          The background, colors, and animations change based on the collective mood score.
        </p>
      </div>

      {/* Theme Controls */}
      <Card className={cn(
        "transition-all duration-700",
        isDynamicMode && `${glowEffect} mood-glow-animation`
      )}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Theme Controls
            </CardTitle>
            <MoodThemeToggle />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Mood Display */}
          <div className="flex items-center justify-center gap-4 p-6 rounded-lg bg-muted/30">
            <div className="text-center">
              <div className="text-6xl mb-2">{moodEmoji}</div>
              <div className="font-bold text-lg">{moodLabel}</div>
              <div className="text-sm text-muted-foreground">Current Mood</div>
            </div>
            <div className="h-16 w-px bg-border" />
            <div className="text-center">
              <div className="text-4xl font-bold">
                {moodScore ? Math.round(moodScore.overall) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Mood Score</div>
            </div>
            <div className="h-16 w-px bg-border" />
            <MoodPulseIndicator size="lg" />
          </div>

          {/* Mood Simulation Buttons */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Simulate Different Moods
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {demoMoodScores.map((demo, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => simulateMoodChange(demo)}
                  className={cn(
                    "flex flex-col h-auto p-4 transition-all duration-300",
                    getMoodStateDemo(demo.overall) === 'extreme' && "border-purple-500/50 hover:border-purple-500",
                    getMoodStateDemo(demo.overall) === 'bullish' && "border-green-500/50 hover:border-green-500",
                    getMoodStateDemo(demo.overall) === 'bearish' && "border-red-500/50 hover:border-red-500",
                    getMoodStateDemo(demo.overall) === 'neutral' && "border-blue-500/50 hover:border-blue-500"
                  )}
                >
                  <div className="text-2xl mb-2">
                    {demo.overall >= 51 ? '🚀' : 
                     demo.overall <= -51 ? '💥' :
                     demo.overall >= 11 ? '📈' :
                     demo.overall <= -11 ? '📉' : '😐'}
                  </div>
                  <div className="font-medium text-xs">{demo.label}</div>
                  <div className="text-xs text-muted-foreground">{demo.overall}</div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Gradient Demo */}
        <Card className={cn(
          "mood-transition",
          isDynamicMode && isAnimating && "mood-shimmer"
        )}>
          <CardHeader>
            <CardTitle className="text-sm">Dynamic Backgrounds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "h-24 rounded-lg transition-all duration-700",
              isDynamicMode ? `${accentColor}` : "bg-gradient-to-r from-blue-500 to-purple-500"
            )} />
            <p className="text-xs text-muted-foreground mt-2">
              Background colors change based on mood
            </p>
          </CardContent>
        </Card>

        {/* Glow Effects Demo */}
        <Card className={cn(
          "mood-transition",
          isDynamicMode && `${glowEffect}`
        )}>
          <CardHeader>
            <CardTitle className="text-sm">Glow Effects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "h-24 rounded-lg border-2 transition-all duration-700 flex items-center justify-center",
              isDynamicMode ? `border-mood-accent shadow-mood-glow` : "border-blue-500 shadow-blue-500/20"
            )}>
              <Zap className={cn(
                "h-8 w-8 transition-colors duration-700",
                isDynamicMode ? "text-mood-accent" : "text-blue-500"
              )} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Glows and borders adapt to mood
            </p>
          </CardContent>
        </Card>

        {/* Animation Demo */}
        <Card className="mood-transition">
          <CardHeader>
            <CardTitle className="text-sm">Mood Animations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-24">
              <div className={cn(
                "p-4 rounded-full transition-all duration-700",
                isDynamicMode && isAnimating && "animate-pulse scale-110",
                isDynamicMode ? `${accentColor}` : "bg-blue-500"
              )}>
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Elements pulse when mood changes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feature List */}
      <Card>
        <CardHeader>
          <CardTitle>Dynamic Theme Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Visual Adaptations</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Background gradients change color</li>
                <li>• Accent colors match mood state</li>
                <li>• Glow effects intensify with extremes</li>
                <li>• Smooth 0.7s transitions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Mood States</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 😐 Neutral (-10 to +10)</li>
                <li>• 📉 Bearish (-50 to -11)</li>
                <li>• 📈 Bullish (+11 to +50)</li>
                <li>• 🔥 Extreme (beyond ±50)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-semibold mb-2">How to Experience Dynamic Theming</h3>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. Click the theme toggle above and select "Dynamic Mood"</li>
                <li>2. Try the different mood simulation buttons</li>
                <li>3. Watch how the entire interface adapts to the sentiment</li>
                <li>4. Notice the smooth transitions and glow effects</li>
                <li>5. Check the mood pulse indicator in the navigation bar</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
