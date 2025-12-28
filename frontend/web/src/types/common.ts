/**
 * Common TypeScript types and interfaces for the application
 * This file provides type safety across components
 */

// Badge System Types
export type BadgeType = 
  | 'trusted_contributor'
  | 'verified_insights'  
  | 'mood_forecaster'
  | 'data_analyst'
  | 'community_builder'
  | 'diamond_hands'
  | 'contrarian_thinker'
  | 'market_sage'
  | 'trend_spotter'
  | 'risk_manager';

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface BadgeDefinition {
  id: BadgeType;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  category: string;
  criteria: string[];
  isVisible: boolean;
}

// News and Articles
export interface NewsArticle {
  id?: string;
  title: string;
  url: string;
  originalUrl?: string;
  description: string;
  sentimentScore: number;
  source: {
    name: string;
    publishedAt: string;
  };
  content?: string;
}

// API Response Types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp?: string;
}

// Chart and Analytics
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface TooltipPayload {
  color: string;
  name: string;
  value: number;
}

// User and Authentication
export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  level?: number;
  xp?: number;
  badges?: BadgeType[];
  verified?: boolean;
}

// Component Props Types
export interface ComponentWithChildren {
  children: React.ReactNode;
}

export interface ComponentWithClassName {
  className?: string;
}

// Form Types
export interface FormError {
  field: string;
  message: string;
}

// State Management
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T = any> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}