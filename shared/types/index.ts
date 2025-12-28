/**
 * Shared Types Index
 *
 * Common utility types used across the monorepo.
 */

// =============================================================================
// API Response Types
// =============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// =============================================================================
// Common Types
// =============================================================================

export type Timestamp = string; // ISO 8601 format

export interface DateRange {
  start: Timestamp;
  end: Timestamp;
}

export interface Pagination {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// =============================================================================
// User Types
// =============================================================================

export interface User {
  id: number;
  username: string;
  createdAt?: Timestamp;
}

export interface UserSession {
  userId: number;
  username: string;
  expiresAt: Timestamp;
}

// =============================================================================
// Utility Types
// =============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;
