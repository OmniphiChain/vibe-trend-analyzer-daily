// Badge System Components Export

export { BadgeDisplay } from "./BadgeDisplay";
export { BadgeManagement } from "./BadgeManagement";

// Re-export types for convenience
export type {
  UserBadge,
  BadgeProgress,
  BadgeStats,
  BadgeType,
  BadgeCategory,
  BadgeRarity,
  BadgeDefinition,
  BadgeRequirements,
  BadgeNotification,
  BadgeFilterOptions,
  BadgeDisplaySettings,
  BadgeEarnEvent,
} from "../../types/badges";

// Re-export services and data
export { badgeService, generateMockUserBadges, generateMockBadgeProgress } from "../../services/badgeService";
export { BADGE_DEFINITIONS, BADGE_CONFIG } from "../../data/badgeDefinitions";
