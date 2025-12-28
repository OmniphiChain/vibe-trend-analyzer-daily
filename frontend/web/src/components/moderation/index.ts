// Moderation System Components Export

export { CredibilityBadge, UserCredibilityIndicator } from "./CredibilityBadge";
export { FlagPostModal } from "./FlagPostModal";
export { ModerationActions } from "./ModerationActions";
export { ModerationDashboard } from "./ModerationDashboard";
export { UserCredibilityProfile } from "./UserCredibilityProfile";

// Re-export types for convenience
export type {
  PostCredibility,
  UserCredibility,
  PostFlag,
  ModerationQueueItem,
  ModerationAction,
  SpamDetectionResult,
  CredibilityLevel,
  FlagReasonType,
  ModerationActionType,
  ModerationStatus,
  CreateFlagData,
} from "../../types/moderation";

// Re-export services
export { moderationService, getMockCredibility } from "../../services/moderationService";
