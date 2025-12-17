import React from 'react';
import DynamicThemeSelector from '../DynamicThemeSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const DynamicThemeSelectorExample = () => {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Dynamic Theme Selector Example
            <DynamicThemeSelector />
          </CardTitle>
          <CardDescription>
            The Dynamic Theme Selector allows users to switch between Light, Dark, and Dynamic Mood themes.
            The Dynamic Mood theme automatically adapts to market sentiment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Toggle between Light, Dark, and Dynamic Mood themes</li>
                <li>Shows current market sentiment when Dynamic mode is active</li>
                <li>Smooth animations and visual feedback</li>
                <li>Integrates with existing MoodThemeContext</li>
                <li>Responsive design for mobile and desktop</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">How to use:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Click the "Dynamic" button to open the theme selector</li>
                <li>Choose between Light Mode, Dark Mode, or Dynamic Mood</li>
                <li>When Dynamic Mood is active, the theme changes based on market sentiment</li>
                <li>View the current mood display at the bottom of the dropdown</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicThemeSelectorExample;
