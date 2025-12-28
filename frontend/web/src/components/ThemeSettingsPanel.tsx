import React, { useState, useEffect } from 'react';
import { Sun, Moon, Zap, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Dialog, DialogContent } from './ui/dialog';
import { useMoodTheme } from '../contexts/MoodThemeContext';

interface ThemeOption {
  id: 'light' | 'dark' | 'dynamic';
  label: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  activeColor: string;
}

interface ThemeSettingsPanelProps {
  currentMoodScore?: number;
}

export const ThemeSettingsPanel: React.FC<ThemeSettingsPanelProps> = ({
  currentMoodScore = 72
}) => {
  const { themeMode, setThemeMode } = useMoodTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [dynamicThemeColor, setDynamicThemeColor] = useState('neutral');
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Apply dynamic mood theme based on score
  const applyDynamicMoodTheme = (score: number) => {
    if (score > 65) {
      setDynamicThemeColor('bullish');
      return 'bullish-theme'; // green
    }
    if (score < 35) {
      setDynamicThemeColor('bearish');
      return 'bearish-theme'; // red
    }
    setDynamicThemeColor('neutral');
    return 'neutral-theme'; // blue/gray
  };

  useEffect(() => {
    if (themeMode === 'dynamic') {
      applyDynamicMoodTheme(currentMoodScore);
    }
  }, [currentMoodScore, themeMode]);

  const themeOptions: ThemeOption[] = [
    {
      id: 'light',
      label: 'Light Mode',
      description: 'Classic bright theme',
      icon: <Sun className="w-5 h-5" />,
      gradient: 'from-yellow-400 to-orange-500',
      activeColor: 'ring-yellow-400/50 bg-yellow-500/10',
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      description: 'Standard dark theme',
      icon: <Moon className="w-5 h-5" />,
      gradient: 'from-blue-400 to-purple-500',
      activeColor: 'ring-purple-400/50 bg-purple-500/10',
    },
    {
      id: 'dynamic',
      label: 'Dynamic Mood',
      description: 'Changes with market sentiment',
      icon: <Zap className={cn("w-5 h-5", themeMode === 'dynamic' && "animate-pulse")} />,
      gradient: getDynamicGradient(),
      activeColor: getDynamicActiveColor(),
    },
  ];

  function getDynamicGradient() {
    switch (dynamicThemeColor) {
      case 'bullish': return 'from-green-400 to-emerald-500';
      case 'bearish': return 'from-red-400 to-rose-500';
      default: return 'from-cyan-400 to-blue-500';
    }
  }

  function getDynamicActiveColor() {
    switch (dynamicThemeColor) {
      case 'bullish': return 'ring-green-400/50 bg-green-500/10';
      case 'bearish': return 'ring-red-400/50 bg-red-500/10';
      default: return 'ring-cyan-400/50 bg-cyan-500/10';
    }
  }

  const handleThemeChange = (themeId: 'light' | 'dark' | 'dynamic') => {
    setThemeMode(themeId);

    // Store in localStorage for persistence (using same key as MoodThemeContext)
    localStorage.setItem('moodThemeMode', themeId);
    
    // Apply dynamic theme immediately if selected
    if (themeId === 'dynamic') {
      applyDynamicMoodTheme(currentMoodScore);
    }
    
    setIsOpen(false);
  };

  const getCurrentThemeIcon = () => {
    const currentTheme = themeOptions.find(option => option.id === themeMode);
    return currentTheme?.icon || <Zap className="w-5 h-5" />;
  };

  const getCurrentThemeGradient = () => {
    const currentTheme = themeOptions.find(option => option.id === themeMode);
    return currentTheme?.gradient || 'from-purple-400 to-pink-500';
  };

  const TriggerButton = (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setIsOpen(true)}
      className={cn(
        "p-2 rounded-lg transition-all duration-200 relative group",
        themeMode === 'dynamic'
          ? `bg-gradient-to-r ${getCurrentThemeGradient()}/20 text-white hover:bg-gradient-to-r hover:${getCurrentThemeGradient()}/30 shadow-lg ${getCurrentThemeGradient().includes('green') ? 'shadow-green-500/20' : getCurrentThemeGradient().includes('red') ? 'shadow-red-500/20' : 'shadow-cyan-500/20'}`
          : themeMode === 'light'
            ? "hover:bg-primary/10 text-secondary hover:text-primary"
            : "hover:bg-purple-500/20 text-gray-400 hover:text-purple-300"
      )}
      aria-label="Theme settings"
    >
      <div className={cn(
        "relative",
        themeMode === 'dynamic' && "animate-pulse"
      )}>
        {getCurrentThemeIcon()}
      </div>
      {themeMode === 'dynamic' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer rounded-lg" />
      )}
    </Button>
  );

  const ThemeContent = (
    <div className="space-y-4">
      <div className="border-b border-gray-700/50 pb-3">
        <h3 className="text-lg font-semibold text-white mb-1">Theme Settings</h3>
        <p className="text-sm text-gray-400">Choose your preferred visual mode</p>
      </div>

      <div className="space-y-3">
        {themeOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleThemeChange(option.id)}
            className={cn(
              "w-full flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 text-left",
              "hover:bg-gray-800/50 border border-transparent",
              themeMode === option.id
                ? `ring-2 ${option.activeColor} border-gray-600/50`
                : "hover:border-gray-600/30"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-lg",
              `bg-gradient-to-r ${option.gradient}`
            )}>
              {option.icon}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-white">{option.label}</span>
                {themeMode === option.id && (
                  <Check className="w-4 h-4 text-green-400" />
                )}
              </div>
              <p className="text-sm text-gray-400">{option.description}</p>

              {option.id === 'dynamic' && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="text-xs text-gray-500">Current mood:</div>
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    dynamicThemeColor === 'bullish' ? "bg-green-500/20 text-green-400" :
                    dynamicThemeColor === 'bearish' ? "bg-red-500/20 text-red-400" :
                    "bg-cyan-500/20 text-cyan-400"
                  )}>
                    {dynamicThemeColor} ({currentMoodScore})
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="border-t border-gray-700/50 pt-3">
        <p className="text-xs text-gray-500 text-center">
          Dynamic mode adapts colors based on real-time market sentiment
        </p>
      </div>
    </div>
  );

  // Mobile version with Dialog (bottom sheet style)
  if (isMobile) {
    return (
      <>
        {TriggerButton}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-md bg-[#10101A]/95 backdrop-blur-xl border-gray-700 text-white rounded-t-2xl rounded-b-none fixed bottom-0 left-0 right-0 translate-y-0 p-6">
            {ThemeContent}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Desktop version with DropdownMenu
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {TriggerButton}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 bg-[#10101A]/95 backdrop-blur-xl border-gray-700 text-white rounded-xl p-4 shadow-xl"
        sideOffset={8}
      >
        {ThemeContent}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
