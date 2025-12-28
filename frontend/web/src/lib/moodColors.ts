// MoodMeter Light Mode Color Theme Utilities
// Based on the comprehensive color palette provided for optimal UX

export interface MoodColorConfig {
  background: string;
  text: string;
  border?: string;
  hover?: string;
}

export interface ThemeColors {
  background: string;
  primaryText: string;
  secondaryText: string;
  accent: string;
  linkHover: string;
  cardBackground: string;
  inputBackground: string;
  border: string;
}

// Primary Theme Colors
export const LIGHT_THEME_COLORS: ThemeColors = {
  background: 'bg-gray-50',        // #F9FAFB
  primaryText: 'text-gray-900',    // #111827
  secondaryText: 'text-gray-600',  // #4B5563
  accent: 'text-indigo-500',       // #6366F1
  linkHover: 'hover:text-blue-500', // #3B82F6
  cardBackground: 'bg-white shadow-md',
  inputBackground: 'bg-white shadow-sm border border-gray-300',
  border: 'border-gray-300',
};

// Mood/Emotion Based Colors
export const MOOD_COLORS = {
  hype: {
    background: 'bg-sky-100',      // #E0F2FE
    text: 'text-sky-700',
    border: 'border-sky-200',
    hover: 'hover:bg-sky-200',
  },
  panic: {
    background: 'bg-rose-100',     // #FEE2E2
    text: 'text-red-700',
    border: 'border-rose-200',
    hover: 'hover:bg-rose-200',
  },
  neutral: {
    background: 'bg-gray-200',     // #F3F4F6
    text: 'text-gray-700',
    border: 'border-gray-300',
    hover: 'hover:bg-gray-300',
  },
  euphoria: {
    background: 'bg-green-100',    // #DCFCE7
    text: 'text-green-700',
    border: 'border-green-200',
    hover: 'hover:bg-green-200',
  },
  fear: {
    background: 'bg-yellow-100',   // #FEF3C7
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    hover: 'hover:bg-yellow-200',
  },
  // Additional mood states
  bullish: {
    background: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
    hover: 'hover:bg-green-200',
  },
  bearish: {
    background: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
    hover: 'hover:bg-red-200',
  },
  extreme: {
    background: 'bg-sky-100',
    text: 'text-sky-700',
    border: 'border-sky-200',
    hover: 'hover:bg-sky-200',
  },
} as const;

// Interactive Element Colors
export const INTERACTIVE_COLORS = {
  buttonPrimary: 'bg-indigo-500 text-white hover:bg-indigo-600 transition-colors',
  buttonSecondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors',
  buttonDanger: 'bg-red-500 text-white hover:bg-red-600 transition-colors',
  buttonSuccess: 'bg-green-500 text-white hover:bg-green-600 transition-colors',
  link: 'text-indigo-500 hover:text-blue-500 transition-colors',
  linkMuted: 'text-gray-600 hover:text-gray-900 transition-colors',
};

// Utility functions for theme application
export const getMoodColor = (mood: keyof typeof MOOD_COLORS): MoodColorConfig => {
  return MOOD_COLORS[mood] || MOOD_COLORS.neutral;
};

export const getMoodTag = (mood: keyof typeof MOOD_COLORS) => {
  const colors = getMoodColor(mood);
  return `${colors.background} ${colors.text} px-2 py-1 rounded-md text-xs font-medium`;
};

export const getMoodButton = (mood: keyof typeof MOOD_COLORS) => {
  const colors = getMoodColor(mood);
  return `${colors.background} ${colors.text} ${colors.hover} px-3 py-2 rounded-lg transition-colors duration-200 border ${colors.border}`;
};

// Sentiment mapping for trading/financial contexts
export const SENTIMENT_COLORS = {
  'very-bullish': MOOD_COLORS.euphoria,
  'bullish': MOOD_COLORS.bullish,
  'neutral': MOOD_COLORS.neutral,
  'bearish': MOOD_COLORS.bearish,
  'very-bearish': MOOD_COLORS.panic,
} as const;

// Card variants for different contexts
export const CARD_VARIANTS = {
  default: 'bg-white shadow-md rounded-xl border border-gray-200',
  elevated: 'bg-white shadow-lg rounded-xl border border-gray-200',
  mood: (mood: keyof typeof MOOD_COLORS) => {
    const colors = getMoodColor(mood);
    return `${colors.background} border ${colors.border} rounded-xl shadow-sm`;
  },
  interactive: 'bg-white shadow-md rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
};

// Typography utilities
export const TYPOGRAPHY = {
  heading: 'text-gray-900 font-bold',
  subheading: 'text-gray-700 font-semibold',
  body: 'text-gray-600',
  caption: 'text-gray-500 text-sm',
  muted: 'text-gray-400',
};

// Export commonly used class combinations
export const COMMON_CLASSES = {
  // Page layout
  pageBackground: LIGHT_THEME_COLORS.background,
  containerCard: CARD_VARIANTS.default,
  
  // Form elements
  input: 'bg-white shadow-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors',
  textarea: 'bg-white shadow-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none',
  select: 'bg-white shadow-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors',
  
  // Navigation
  navLink: 'text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-lg transition-colors duration-200',
  navLinkActive: 'text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg',
  
  // Status indicators
  statusSuccess: 'bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium',
  statusWarning: 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-xs font-medium',
  statusError: 'bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-medium',
  statusInfo: 'bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium',
};
