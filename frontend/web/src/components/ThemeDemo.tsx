import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useMoodTheme } from '../contexts/MoodThemeContext';
import { MOOD_COLORS, COMMON_CLASSES } from '../lib/moodColors';

export const ThemeDemo: React.FC = () => {
  const { 
    themeMode, 
    getMoodTag, 
    getMoodButton, 
    lightThemeColors, 
    interactiveColors 
  } = useMoodTheme();

  const moodStates = Object.keys(MOOD_COLORS) as Array<keyof typeof MOOD_COLORS>;

  if (themeMode !== 'light') {
    return null; // Only show in light mode
  }

  return (
    <div className={`p-6 space-y-6 ${lightThemeColors.background} min-h-screen`}>
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className={lightThemeColors.primaryText}>
              🌞 MoodMeter Light Mode Theme Demo
            </CardTitle>
            <p className={lightThemeColors.secondaryText}>
              Showcasing the comprehensive light mode color palette optimized for clarity and mood-based branding.
            </p>
          </CardHeader>
        </Card>

        {/* Primary Theme Colors */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className={lightThemeColors.primaryText}>Primary Theme Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${lightThemeColors.background} border-2 border-gray-200`}>
                <h4 className={`font-semibold ${lightThemeColors.primaryText}`}>Background</h4>
                <p className={lightThemeColors.secondaryText}>bg-gray-50 (#F9FAFB)</p>
              </div>
              <div className={`p-4 rounded-lg bg-white border-2 border-gray-200`}>
                <h4 className={`font-semibold ${lightThemeColors.primaryText}`}>Primary Text</h4>
                <p className={lightThemeColors.secondaryText}>text-gray-900 (#111827)</p>
              </div>
              <div className={`p-4 rounded-lg bg-white border-2 border-gray-200`}>
                <h4 className={`font-semibold ${lightThemeColors.secondaryText}`}>Secondary Text</h4>
                <p className={lightThemeColors.secondaryText}>text-gray-600 (#4B5563)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mood-Based Colors */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className={lightThemeColors.primaryText}>Mood-Based Colors</CardTitle>
            <p className={lightThemeColors.secondaryText}>
              Contextual colors for different emotional states and market sentiments
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {moodStates.map((mood) => (
                <div key={mood} className="space-y-2">
                  <div className={`p-3 rounded-lg ${MOOD_COLORS[mood].background} border ${MOOD_COLORS[mood].border}`}>
                    <h4 className={`font-semibold capitalize ${MOOD_COLORS[mood].text}`}>
                      {mood}
                    </h4>
                  </div>
                  <Badge className={getMoodTag(mood)}>
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Interactive Elements */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className={lightThemeColors.primaryText}>Interactive Elements</CardTitle>
            <p className={lightThemeColors.secondaryText}>
              Buttons, inputs, and interactive components with proper contrast and accessibility
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Buttons */}
            <div>
              <h4 className={`font-semibold mb-3 ${lightThemeColors.primaryText}`}>Buttons</h4>
              <div className="flex flex-wrap gap-3">
                <Button className={interactiveColors.buttonPrimary}>
                  Primary Button
                </Button>
                <Button className={interactiveColors.buttonSecondary}>
                  Secondary Button
                </Button>
                <Button className={interactiveColors.buttonDanger}>
                  Danger Button
                </Button>
                <Button className={interactiveColors.buttonSuccess}>
                  Success Button
                </Button>
              </div>
            </div>

            {/* Form Elements */}
            <div>
              <h4 className={`font-semibold mb-3 ${lightThemeColors.primaryText}`}>Form Elements</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  placeholder="Search..." 
                  className={COMMON_CLASSES.input}
                />
                <select className={COMMON_CLASSES.select}>
                  <option>Select an option</option>
                  <option>Bullish</option>
                  <option>Bearish</option>
                  <option>Neutral</option>
                </select>
              </div>
            </div>

            {/* Mood Buttons */}
            <div>
              <h4 className={`font-semibold mb-3 ${lightThemeColors.primaryText}`}>Mood Buttons</h4>
              <div className="flex flex-wrap gap-2">
                {moodStates.slice(0, 5).map((mood) => (
                  <Button 
                    key={mood}
                    className={getMoodButton(mood)}
                    variant="outline"
                  >
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards and Layouts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className={lightThemeColors.primaryText}>Card Variants</CardTitle>
            <p className={lightThemeColors.secondaryText}>
              Different card styles for various contexts and use cases
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200">
                <h4 className={`font-semibold ${lightThemeColors.primaryText}`}>Default Card</h4>
                <p className={lightThemeColors.secondaryText}>Standard card with subtle shadow</p>
              </div>
              <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-200 hover:shadow-xl transition-shadow">
                <h4 className={`font-semibold ${lightThemeColors.primaryText}`}>Elevated Card</h4>
                <p className={lightThemeColors.secondaryText}>Enhanced shadow on hover</p>
              </div>
              <div className="bg-green-100 border border-green-200 rounded-xl p-4">
                <h4 className="font-semibold text-green-700">Mood Card</h4>
                <p className="text-green-600">Bullish sentiment context</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader>
            <CardTitle className={lightThemeColors.primaryText}>Typography Scale</CardTitle>
            <p className={lightThemeColors.secondaryText}>
              Consistent text hierarchy with optimal contrast ratios
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Heading 1 - Bold</h1>
            <h2 className="text-2xl font-semibold text-gray-700">Heading 2 - Semibold</h2>
            <h3 className="text-xl font-medium text-gray-700">Heading 3 - Medium</h3>
            <p className="text-gray-600">Body text - Regular weight for optimal readability</p>
            <p className="text-sm text-gray-500">Caption text - Smaller supporting information</p>
            <p className="text-xs text-gray-400">Muted text - Least prominent content</p>
            
            <div className="pt-4 border-t border-gray-200">
              <a href="#" className={interactiveColors.link}>Interactive link with hover effect</a>
              <span className="mx-2">•</span>
              <a href="#" className={interactiveColors.linkMuted}>Muted link style</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
