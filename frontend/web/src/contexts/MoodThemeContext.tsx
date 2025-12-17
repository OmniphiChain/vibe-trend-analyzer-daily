import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getIconFromEmoji, type IconConfig } from '../lib/iconUtils';
import { LIGHT_THEME_COLORS, MOOD_COLORS, INTERACTIVE_COLORS, getMoodColor, getMoodTag, getMoodButton } from '../lib/moodColors';

export type ThemeMode = 'light' | 'dark' | 'dynamic';

export type MoodState = 'neutral' | 'bearish' | 'bullish' | 'extreme';

interface MoodScore {
  overall: number;
  stocks: number;
  news: number;
  social: number;
  timestamp: Date;
}

interface MoodThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  moodState: MoodState;
  moodScore: MoodScore | null;
  setMoodScore: (score: MoodScore) => void;
  isDynamicMode: boolean;
  currentThemeClasses: string;
  bodyGradient: string;
  accentColor: string;
  glowEffect: string;
  moodIcon: IconConfig;
  moodLabel: string;
  cardBackground: string;
  borderColor: string;
  // Mood color utilities
  getMoodColor: typeof getMoodColor;
  getMoodTag: typeof getMoodTag;
  getMoodButton: typeof getMoodButton;
  lightThemeColors: typeof LIGHT_THEME_COLORS;
  interactiveColors: typeof INTERACTIVE_COLORS;
}

const MoodThemeContext = createContext<MoodThemeContextType | undefined>(undefined);

const MOOD_RANGES = {
  neutral: { min: -10, max: 10 },
  bearish: { min: -50, max: -11 },
  bullish: { min: 11, max: 50 },
  extreme: { min: -100, max: -51, max2: 51, max3: 100 } // < -50 or > 50
};

const MOOD_THEMES = {
  light: {
    neutral: {
      background: 'bg-gray-50',
      bodyGradient: 'from-gray-50 to-white',
      accentColor: 'from-indigo-500 to-blue-500',
      glowEffect: 'shadow-md',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textBody: 'text-gray-700',
      cardBackground: 'bg-white shadow-md rounded-xl',
      border: 'border-gray-300',
      hoverEffect: 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200',
      buttonPrimary: 'bg-indigo-500 text-white hover:bg-indigo-600',
      buttonSecondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      inputBackground: 'bg-white shadow-sm border-gray-300',
      moodBackground: 'bg-gray-200',
      moodText: 'text-gray-700',
    },
    bearish: {
      background: 'bg-gray-50',
      bodyGradient: 'from-gray-50 to-rose-50/30',
      accentColor: 'from-red-500 to-red-400',
      glowEffect: 'shadow-md shadow-red-500/10',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textBody: 'text-gray-700',
      cardBackground: 'bg-white shadow-md rounded-xl',
      border: 'border-gray-300',
      hoverEffect: 'hover:shadow-lg hover:shadow-red-500/20 hover:-translate-y-0.5 transition-all duration-200',
      buttonPrimary: 'bg-red-500 text-white hover:bg-red-600',
      buttonSecondary: 'bg-rose-100 text-red-700 hover:bg-rose-200',
      inputBackground: 'bg-white shadow-sm border-gray-300',
      moodBackground: 'bg-rose-100',
      moodText: 'text-red-700',
    },
    bullish: {
      background: 'bg-gray-50',
      bodyGradient: 'from-gray-50 to-green-50/30',
      accentColor: 'from-green-500 to-emerald-500',
      glowEffect: 'shadow-md shadow-green-500/10',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textBody: 'text-gray-700',
      cardBackground: 'bg-white shadow-md rounded-xl',
      border: 'border-gray-300',
      hoverEffect: 'hover:shadow-lg hover:shadow-green-500/20 hover:-translate-y-0.5 transition-all duration-200',
      buttonPrimary: 'bg-green-500 text-white hover:bg-green-600',
      buttonSecondary: 'bg-green-100 text-green-700 hover:bg-green-200',
      inputBackground: 'bg-white shadow-sm border-gray-300',
      moodBackground: 'bg-green-100',
      moodText: 'text-green-700',
    },
    extreme: {
      background: 'bg-gray-50',
      bodyGradient: 'from-gray-50 to-sky-50/30',
      accentColor: 'from-indigo-500 to-purple-500',
      glowEffect: 'shadow-md shadow-indigo-500/10',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textBody: 'text-gray-700',
      cardBackground: 'bg-white shadow-md rounded-xl',
      border: 'border-gray-300',
      hoverEffect: 'hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all duration-200',
      buttonPrimary: 'bg-indigo-500 text-white hover:bg-indigo-600',
      buttonSecondary: 'bg-sky-100 text-sky-700 hover:bg-sky-200',
      inputBackground: 'bg-white shadow-sm border-gray-300',
      moodBackground: 'bg-sky-100',
      moodText: 'text-sky-700',
    }
  },
  dark: {
    neutral: {
      background: 'bg-slate-900',
      bodyGradient: 'from-slate-900 via-blue-950 to-slate-900',
      accentColor: 'from-blue-400 to-cyan-400',
      glowEffect: 'shadow-blue-500/20',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-300',
      cardBackground: 'bg-slate-800/50',
      border: 'border-slate-700',
    },
    bearish: {
      background: 'bg-slate-900',
      bodyGradient: 'from-slate-900 via-gray-900 to-slate-900',
      accentColor: 'from-gray-400 to-slate-400',
      glowEffect: 'shadow-gray-500/20',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-400',
      cardBackground: 'bg-slate-800/50',
      border: 'border-slate-700',
    },
    bullish: {
      background: 'bg-slate-900',
      bodyGradient: 'from-slate-900 via-amber-950 to-slate-900',
      accentColor: 'from-amber-400 to-orange-400',
      glowEffect: 'shadow-amber-500/30',
      textPrimary: 'text-amber-100',
      textSecondary: 'text-amber-200',
      cardBackground: 'bg-slate-800/50',
      border: 'border-slate-700',
    },
    extreme: {
      background: 'bg-slate-900',
      bodyGradient: 'from-slate-900 via-purple-950 to-slate-900',
      accentColor: 'from-purple-400 to-pink-400',
      glowEffect: 'shadow-purple-500/40',
      textPrimary: 'text-purple-100',
      textSecondary: 'text-purple-200',
      cardBackground: 'bg-slate-800/50',
      border: 'border-slate-700',
    }
  }
};

const MOOD_ICONS = {
  neutral: getIconFromEmoji('😐'),
  bearish: getIconFromEmoji('📉'),
  bullish: getIconFromEmoji('📈'),
  extreme: getIconFromEmoji('🔥')
};

const MOOD_LABELS = {
  neutral: 'Neutral',
  bearish: 'Bearish',
  bullish: 'Bullish',
  extreme: 'Extreme'
};

const getMoodStateFromScore = (score: number): MoodState => {
  if (score >= MOOD_RANGES.extreme.max2) return 'extreme';
  if (score <= MOOD_RANGES.extreme.max) return 'extreme';
  if (score >= MOOD_RANGES.bullish.min && score <= MOOD_RANGES.bullish.max) return 'bullish';
  if (score >= MOOD_RANGES.bearish.min && score <= MOOD_RANGES.bearish.max) return 'bearish';
  return 'neutral';
};

interface MoodThemeProviderProps {
  children: ReactNode;
}

export const MoodThemeProvider: React.FC<MoodThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('moodThemeMode');
    return (stored as ThemeMode) || 'dynamic';
  });

  const [moodScore, setMoodScore] = useState<MoodScore | null>(null);
  
  const moodState = moodScore ? getMoodStateFromScore(moodScore.overall) : 'neutral';
  const isDynamicMode = themeMode === 'dynamic';

  // Determine effective theme (dark/light/day) for dynamic mode
  const effectiveTheme = isDynamicMode ? 'dark' : themeMode;
  const currentTheme = MOOD_THEMES[effectiveTheme]?.[moodState] || MOOD_THEMES.light[moodState];

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('moodThemeMode', themeMode);
  }, [themeMode]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Remove all theme classes first
    root.classList.remove('dark');

    if (themeMode === 'dark' || isDynamicMode) {
      root.classList.add('dark');
    }

    // Apply custom CSS variables for mood theming
    if (isDynamicMode && moodScore) {
      root.style.setProperty('--mood-gradient-from', getMoodGradientColors(moodState).from);
      root.style.setProperty('--mood-gradient-to', getMoodGradientColors(moodState).to);
      root.style.setProperty('--mood-accent', getMoodAccentColor(moodState));
      root.style.setProperty('--mood-glow', getMoodGlowColor(moodState));
    }
  }, [themeMode, moodState, moodScore, isDynamicMode]);

  const value: MoodThemeContextType = {
    themeMode,
    setThemeMode,
    moodState,
    moodScore,
    setMoodScore,
    isDynamicMode,
    currentThemeClasses: `${currentTheme.background} ${currentTheme.textPrimary}`,
    bodyGradient: `bg-gradient-to-br ${currentTheme.bodyGradient}`,
    accentColor: `bg-gradient-to-r ${currentTheme.accentColor}`,
    glowEffect: currentTheme.glowEffect,
    moodIcon: MOOD_ICONS[moodState],
    moodLabel: MOOD_LABELS[moodState],
    cardBackground: currentTheme.cardBackground,
    borderColor: currentTheme.border,
    // Mood color utilities
    getMoodColor,
    getMoodTag,
    getMoodButton,
    lightThemeColors: LIGHT_THEME_COLORS,
    interactiveColors: INTERACTIVE_COLORS,
  };

  return (
    <MoodThemeContext.Provider value={value}>
      {children}
    </MoodThemeContext.Provider>
  );
};

export const useMoodTheme = () => {
  const context = useContext(MoodThemeContext);
  if (context === undefined) {
    throw new Error('useMoodTheme must be used within a MoodThemeProvider');
  }
  return context;
};

// Helper functions for CSS variable generation
const getMoodGradientColors = (mood: MoodState) => {
  switch (mood) {
    case 'bearish':
      return { from: '#1e293b', to: '#374151' }; // slate-800 to gray-700
    case 'bullish':
      return { from: '#451a03', to: '#ea580c' }; // amber-950 to orange-600
    case 'extreme':
      return { from: '#581c87', to: '#db2777' }; // purple-900 to pink-600
    default:
      return { from: '#0f172a', to: '#1e40af' }; // slate-900 to blue-700
  }
};

const getMoodAccentColor = (mood: MoodState) => {
  switch (mood) {
    case 'bearish':
      return '#6b7280'; // gray-500
    case 'bullish':
      return '#f59e0b'; // amber-500
    case 'extreme':
      return '#a855f7'; // purple-500
    default:
      return '#3b82f6'; // blue-500
  }
};

const getMoodGlowColor = (mood: MoodState) => {
  switch (mood) {
    case 'bearish':
      return 'rgba(107, 114, 128, 0.2)'; // gray-500 with opacity
    case 'bullish':
      return 'rgba(245, 158, 11, 0.3)'; // amber-500 with opacity
    case 'extreme':
      return 'rgba(168, 85, 247, 0.4)'; // purple-500 with opacity
    default:
      return 'rgba(59, 130, 246, 0.2)'; // blue-500 with opacity
  }
};
