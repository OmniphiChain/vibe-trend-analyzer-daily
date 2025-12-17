import { useMoodTheme } from '../contexts/MoodThemeContext';

/**
 * Utility hook for theme-aware styling
 * Provides easy access to common theme-aware class combinations
 */
export const useThemeClasses = () => {
  const { themeMode, cardBackground, borderColor } = useMoodTheme();

  return {
    // Card styling
    card: themeMode === 'light' 
      ? `${cardBackground} border ${borderColor} shadow-[0_2px_6px_rgba(0,0,0,0.05)]`
      : 'finance-card border-0',
    
    // Text colors
    textPrimary: themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white',
    textSecondary: themeMode === 'light' ? 'text-[#4A4A4A]' : 'text-slate-400',
    
    // Background colors
    bgPrimary: themeMode === 'light' ? 'bg-[#F4F6F9]' : 'bg-slate-900',
    bgHover: themeMode === 'light' ? 'hover:bg-[#E8EBF0]' : 'hover:bg-slate-800/30',
    
    // Accent colors
    accent: themeMode === 'light' ? 'text-[#4D7C8A]' : 'text-blue-400',
    
    // Sentiment colors
    positive: themeMode === 'light' ? 'text-[#4CAF50]' : 'text-green-400',
    negative: themeMode === 'light' ? 'text-[#D32F2F]' : 'text-red-400',
    neutral: themeMode === 'light' ? 'text-[#607D8B]' : 'text-amber-400',
    
    // Border styling
    border: themeMode === 'light' ? borderColor : 'border-slate-700/50',
    
    // Loading indicators
    loadingDot: themeMode === 'light' ? 'bg-[#4D7C8A]' : 'bg-blue-400',
  };
};

/**
 * Get sentiment badge classes for light/dark theme
 */
export const getSentimentBadgeClasses = (sentiment: 'bullish' | 'bearish' | 'neutral', themeMode: string) => {
  const baseClasses = 'text-xs px-2';
  
  if (themeMode === 'light') {
    switch (sentiment) {
      case 'bullish': return `${baseClasses} bg-[#4CAF50]/20 text-[#4CAF50]`;
      case 'bearish': return `${baseClasses} bg-[#D32F2F]/20 text-[#D32F2F]`;
      default: return `${baseClasses} bg-[#607D8B]/20 text-[#607D8B]`;
    }
  } else {
    switch (sentiment) {
      case 'bullish': return `${baseClasses} bg-green-500/20 text-green-400`;
      case 'bearish': return `${baseClasses} bg-red-500/20 text-red-400`;
      default: return `${baseClasses} bg-amber-500/20 text-amber-400`;
    }
  }
};

/**
 * Get change color classes (for price changes, percentages, etc.)
 */
export const getChangeClasses = (value: number, themeMode: string) => {
  if (value >= 0) {
    return themeMode === 'light' ? 'text-[#4CAF50]' : 'text-green-400';
  } else {
    return themeMode === 'light' ? 'text-[#D32F2F]' : 'text-red-400';
  }
};
