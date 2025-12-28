import React from 'react';
import { Moon, Sun, Zap, Palette } from 'lucide-react';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { useMoodTheme, ThemeMode } from '../../contexts/MoodThemeContext';
import { Badge } from './badge';

export const MoodThemeToggle: React.FC = () => {
  const { themeMode, setThemeMode, moodState, moodEmoji, moodLabel, isDynamicMode } = useMoodTheme();

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'dynamic':
        return <Zap className="h-4 w-4" />;
      default:
        return <Palette className="h-4 w-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (themeMode) {
      case 'light':
        return 'Clarity';
      case 'dark':
        return 'Focus';
      case 'dynamic':
        return 'Dynamic';
      default:
        return 'Theme';
    }
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 relative transition-all duration-300 hover:scale-105"
        >
          {getThemeIcon()}
          <span className="hidden sm:inline">{getThemeLabel()}</span>
          {isDynamicMode && (
            <Badge 
              variant="secondary" 
              className="ml-1 animate-pulse bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30"
            >
              {moodEmoji}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Theme Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={() => handleThemeChange('light')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Sun className="h-4 w-4" />
          <div className="flex-1">
            <div className="font-medium">🌞 Clarity Mode</div>
            <div className="text-xs text-muted-foreground">Financial professionalism & calm emotions</div>
          </div>
          {themeMode === 'light' && (
            <Badge variant="default" className="bg-yellow-500/20 text-yellow-700 border-yellow-400/30">
              Active
            </Badge>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleThemeChange('dark')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Moon className="h-4 w-4" />
          <div className="flex-1">
            <div className="font-medium">🌚 Focus Mode</div>
            <div className="text-xs text-muted-foreground">Dark theme for concentrated analysis</div>
          </div>
          {themeMode === 'dark' && (
            <Badge variant="default" className="bg-blue-500/20 text-blue-700 border-blue-400/30">
              Active
            </Badge>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => handleThemeChange('dynamic')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Zap className="h-4 w-4" />
          <div className="flex-1">
            <div className="font-medium">Dynamic Mood</div>
            <div className="text-xs text-muted-foreground">Changes with market sentiment</div>
          </div>
          {themeMode === 'dynamic' && (
            <Badge variant="default" className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 border-purple-400/30">
              Active
            </Badge>
          )}
        </DropdownMenuItem>

        {isDynamicMode && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs">Current Mood</DropdownMenuLabel>
            <div className="px-2 py-1">
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                <span className="text-lg">{moodEmoji}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{moodLabel}</div>
                  <div className="text-xs text-muted-foreground">Market Sentiment</div>
                </div>
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
