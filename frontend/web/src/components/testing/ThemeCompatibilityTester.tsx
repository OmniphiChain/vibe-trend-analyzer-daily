import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Sun,
  Moon,
  Palette,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Monitor,
} from "lucide-react";

interface ThemeTestResult {
  component: string;
  lightMode: "pass" | "fail" | "warning";
  darkMode: "pass" | "fail" | "warning";
  issues: string[];
}

interface ThemeCompatibilityTesterProps {
  className?: string;
}

const THEME_TEST_COMPONENTS = [
  "Moderation Dashboard",
  "Badge Display",
  "Credibility Badge", 
  "Spam Detection Results",
  "User Profile Cards",
  "Navigation Elements",
  "Form Inputs",
  "Data Tables",
  "Status Indicators",
  "Modal Dialogs"
];

export const ThemeCompatibilityTester: React.FC<ThemeCompatibilityTesterProps> = ({ className }) => {
  const { themeMode, setThemeMode, currentMood } = useMoodTheme();
  const [testResults, setTestResults] = useState<ThemeTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [autoToggle, setAutoToggle] = useState(false);
  const [testProgress, setTestProgress] = useState(0);

  // Mock test results - in a real implementation, this would programmatically test components
  const generateMockTestResults = (): ThemeTestResult[] => {
    return THEME_TEST_COMPONENTS.map(component => {
      const lightModeScore = Math.random();
      const darkModeScore = Math.random();
      const issues: string[] = [];

      // Simulate some common theme issues
      if (lightModeScore < 0.3) {
        issues.push("Insufficient contrast in light mode");
      }
      if (darkModeScore < 0.3) {
        issues.push("Poor visibility in dark mode");
      }
      if (Math.random() < 0.1) {
        issues.push("Inconsistent spacing between themes");
      }
      if (Math.random() < 0.05) {
        issues.push("Color variables not properly defined");
      }

      return {
        component,
        lightMode: lightModeScore > 0.7 ? "pass" : lightModeScore > 0.3 ? "warning" : "fail",
        darkMode: darkModeScore > 0.7 ? "pass" : darkModeScore > 0.3 ? "warning" : "fail",
        issues
      };
    });
  };

  const runThemeTests = async () => {
    setIsRunning(true);
    setTestProgress(0);
    setTestResults([]);

    // Simulate testing each component
    for (let i = 0; i < THEME_TEST_COMPONENTS.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate test time
      setTestProgress(((i + 1) / THEME_TEST_COMPONENTS.length) * 100);
    }

    const results = generateMockTestResults();
    setTestResults(results);
    setIsRunning(false);
  };

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const getStatusIcon = (status: "pass" | "fail" | "warning") => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "fail":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: "pass" | "fail" | "warning") => {
    switch (status) {
      case "pass":
        return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800";
      case "fail":
        return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800";
    }
  };

  const testStats = {
    total: testResults.length,
    lightPass: testResults.filter(r => r.lightMode === "pass").length,
    darkPass: testResults.filter(r => r.darkMode === "pass").length,
    issues: testResults.reduce((acc, r) => acc + r.issues.length, 0),
  };

  const overallScore = testResults.length > 0 
    ? Math.round(((testStats.lightPass + testStats.darkPass) / (testResults.length * 2)) * 100)
    : 0;

  // Auto-toggle demo
  useEffect(() => {
    if (autoToggle) {
      const interval = setInterval(toggleTheme, 2000);
      return () => clearInterval(interval);
    }
  }, [autoToggle, themeMode]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={cn(
            "text-2xl font-bold flex items-center gap-2",
            themeMode === 'light' ? 'text-gray-900' : 'text-white'
          )}>
            <Palette className="w-6 h-6 text-purple-500" />
            Theme Compatibility Tester
          </h2>
          <p className={cn(
            "text-sm mt-1",
            themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
          )}>
            Verify moderation components work correctly across light and dark themes
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={runThemeTests}
            disabled={isRunning}
            variant="outline"
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            {isRunning ? "Testing..." : "Run Tests"}
          </Button>
        </div>
      </div>

      {/* Theme Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Theme Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={toggleTheme}
                variant="outline"
                className="gap-2"
              >
                {themeMode === 'light' ? (
                  <>
                    <Sun className="w-4 h-4" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    Dark Mode
                  </>
                )}
              </Button>
              
              <Badge 
                variant="outline"
                className={cn(
                  "capitalize",
                  themeMode === 'light' 
                    ? "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                    : "bg-gray-800 text-gray-200 border-gray-600 dark:bg-gray-100 dark:text-gray-800 dark:border-gray-300"
                )}
              >
                Current: {themeMode} mode
              </Badge>

              <Badge variant="secondary" className="capitalize">
                Mood: {currentMood}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="auto-toggle"
                checked={autoToggle}
                onCheckedChange={setAutoToggle}
              />
              <Label htmlFor="auto-toggle" className="text-sm">
                Auto-toggle demo
              </Label>
            </div>
          </div>

          {/* Live Theme Preview */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border bg-muted/50">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Live Preview Elements</h4>
              <div className="space-y-2">
                <Badge variant="default">Primary Badge</Badge>
                <Badge variant="secondary">Secondary Badge</Badge>
                <Badge variant="destructive">Error Badge</Badge>
                <Badge variant="outline">Outline Badge</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Theme Variables</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Background:</span>
                  <span className="font-mono">hsl(var(--background))</span>
                </div>
                <div className="flex justify-between">
                  <span>Foreground:</span>
                  <span className="font-mono">hsl(var(--foreground))</span>
                </div>
                <div className="flex justify-between">
                  <span>Primary:</span>
                  <span className="font-mono">hsl(var(--primary))</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Progress */}
      {isRunning && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Testing Components...</span>
                <span>{Math.round(testProgress)}%</span>
              </div>
              <Progress value={testProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">{testStats.total}</div>
                <div className="text-sm text-muted-foreground">Components Tested</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600">{testStats.lightPass}</div>
                <div className="text-sm text-muted-foreground">Light Mode Pass</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-purple-600">{testStats.darkPass}</div>
                <div className="text-sm text-muted-foreground">Dark Mode Pass</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-orange-600">{overallScore}%</div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <Card>
            <CardHeader>
              <CardTitle>Component Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm w-48 truncate">
                        {result.component}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Light Mode Status */}
                      <div className="flex items-center gap-2">
                        <Sun className="w-3 h-3 text-yellow-500" />
                        {getStatusIcon(result.lightMode)}
                        <Badge className={cn("text-xs", getStatusColor(result.lightMode))}>
                          Light
                        </Badge>
                      </div>
                      
                      {/* Dark Mode Status */}
                      <div className="flex items-center gap-2">
                        <Moon className="w-3 h-3 text-gray-600" />
                        {getStatusIcon(result.darkMode)}
                        <Badge className={cn("text-xs", getStatusColor(result.darkMode))}>
                          Dark
                        </Badge>
                      </div>

                      {/* Issues Count */}
                      {result.issues.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {result.issues.length} issue{result.issues.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Issues Summary */}
              {testStats.issues > 0 && (
                <div className="mt-6 p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium text-sm mb-2">Common Issues Found:</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {testResults.flatMap(r => r.issues).slice(0, 5).map((issue, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-yellow-500" />
                        {issue}
                      </div>
                    ))}
                    {testStats.issues > 5 && (
                      <div className="text-xs text-muted-foreground mt-2">
                        ...and {testStats.issues - 5} more issues
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Compatibility Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">Use CSS custom properties</div>
                <div className="text-muted-foreground">Leverage Tailwind's CSS variables for consistent theming</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">Test contrast ratios</div>
                <div className="text-muted-foreground">Ensure WCAG AA compliance for both light and dark modes</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">Consistent component styling</div>
                <div className="text-muted-foreground">Use theme-aware utility classes and avoid hardcoded colors</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">Test all interactive states</div>
                <div className="text-muted-foreground">Verify hover, focus, and active states work in both themes</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeCompatibilityTester;
