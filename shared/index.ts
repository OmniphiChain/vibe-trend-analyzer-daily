/**
 * Shared Package Index
 *
 * Central export point for all shared code.
 */

export * from './contracts';

// Export types, excluding User which is defined in schema.ts
export type {
  ApiResponse,
  ApiError,
  PaginatedResponse,
  Timestamp,
  DateRange,
  Pagination,
  UserSession,
  DeepPartial,
  RequireAtLeastOne,
  Nullable,
  Optional,
} from './types';

// Schema exports (includes database User type)
export * from './schema';
