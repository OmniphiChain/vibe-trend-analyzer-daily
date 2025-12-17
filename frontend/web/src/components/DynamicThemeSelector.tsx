import React from 'react';
import { Zap, Sun, Moon, Bolt } from 'lucide-react';
import { useMoodTheme } from '@/contexts/MoodThemeContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const DynamicThemeSelector = () => {
  const {
    themeMode,
    setThemeMode,
    moodState,
    moodEmoji,
    moodLabel,
    isDynamicMode,
    accentColor,
    glowEffect,
  } = useMoodTheme();

  const themeOptions = [
    {
      value: 'light' as const,
      label: 'Light Mode',
      description: 'Classic bright theme',
      icon: Sun,
    },
    {
      value: 'dark' as const,
      label: 'Dark Mode',
      description: 'Standard dark theme',
      icon: Moon,
    },
    {
      value: 'dynamic' as const,
      label: 'Dynamic Mood',
      description: 'Changes with market sentiment',
      icon: Bolt,
    },
  ];

  const getMoodBadgeVariant = (mood: string) => {
    switch (mood) {
      case 'extreme':
        return 'destructive';
      case 'bearish':
        return 'secondary';
      case 'bullish':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getMoodIntensityColor = (mood: string) => {
    switch (mood) {
      case 'extreme':
        return 'text-red-500 bg-red-50 dark:bg-red-950/20';
      case 'bearish':
        return 'text-gray-500 bg-gray-50 dark:bg-gray-950/20';
      case 'bullish':
        return 'text-green-500 bg-green-50 dark:bg-green-950/20';
      default:
        return 'text-blue-500 bg-blue-50 dark:bg-blue-950/20';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className={cn(
            "relative overflow-hidden transition-all duration-300 ease-in-out",
            "hover:shadow-lg border-2",
            isDynamicMode && [
              accentColor.replace('bg-gradient-to-r', 'border-gradient-to-r'),
              `shadow-${glowEffect}`,
              "animate-pulse"
            ]
          )}
        >
          <Zap className="h-4 w-4" />
          Dynamic
          {isDynamicMode && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className={cn(
          "w-72 p-2 rounded-xl shadow-2xl border-2",
          "backdrop-blur-md bg-background/95",
          "transition-all duration-300 ease-in-out"
        )}
        align="end"
      >
        <DropdownMenuLabel className="text-sm font-semibold text-muted-foreground px-2 py-1">
          Theme Settings
        </DropdownMenuLabel>
        
        <div className="space-y-1 mb-3">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = themeMode === option.value;
            
            return (
              <DropdownMenuItem
                key={option.value}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg cursor-pointer",
                  "transition-all duration-200 ease-in-out",
                  "hover:bg-accent/50",
                  isActive && "bg-accent/30 ring-2 ring-primary/20"
                )}
                onClick={() => setThemeMode(option.value)}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "p-2 rounded-md",
                    isActive ? "bg-primary/10 text-primary" : "bg-muted/50"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {option.description}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {option.value === 'dynamic' && isDynamicMode && (
                    <Badge 
                      variant="default" 
                      className="text-xs px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-300"
                    >
                      Active
                    </Badge>
                  )}
                  
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator className="my-2" />

        <div className="px-2 py-2">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Current Mood Display
          </div>
          
          <div className={cn(
            "flex items-center justify-between p-3 rounded-lg border",
            getMoodIntensityColor(moodState),
            "transition-all duration-300 ease-in-out"
          )}>
            <div className="flex items-center space-x-3">
              <div className="text-2xl" role="img" aria-label={moodLabel}>
                {moodEmoji}
              </div>
              <div>
                <div className="font-semibold text-sm capitalize">
                  {moodLabel}
                </div>
                <div className="text-xs opacity-70">
                  Market Sentiment
                </div>
              </div>
            </div>
            
            <Badge 
              variant={getMoodBadgeVariant(moodState)}
              className={cn(
                "text-xs font-medium",
                "transition-all duration-300 ease-in-out"
              )}
            >
              {moodLabel}
            </Badge>
          </div>
          
          {isDynamicMode && (
            <div className="text-xs text-muted-foreground mt-2 px-1">
              <div className="flex items-center space-x-1">
                <Bolt className="h-3 w-3" />
                <span>Dynamic theme adapts to market sentiment changes</span>
              </div>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DynamicThemeSelector;
