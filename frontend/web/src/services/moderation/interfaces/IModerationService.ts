/**
 * Moderation Service Interfaces
 * Defines contracts for moderation system following Interface Segregation Principle
 * @author NeomSense Development Team
 * @version 1.0.0
 */

import type { 
  SpamDetectionResult, 
  PostCredibility, 
  PostFlag,
  CreateFlagData
} from "@/types/moderation";
import type { SocialPost } from "@/types/social";

/**
 * Interface for spam detection functionality
 */
export interface ISpamDetector {
  analyzeSpam(post: SocialPost): Promise<SpamDetectionResult>;
  detectSpam(content: string): { isSpam: boolean; confidence: number; reasons: string[] };
}

/**
 * Interface for credibility assessment functionality
 */
export interface ICredibilityAssessor {
  calculateCredibility(post: SocialPost, authorReliability?: number): Promise<PostCredibility>;
  calculateSimpleCredibilityScore(data: {
    content: string;
    author: string;
    timestamp: Date;
    engagement?: { likes: number; replies: number; shares: number };
  }): number;
  updateCredibilityFromCommunity(postId: string, voteType: "helpful" | "misleading" | "accurate"): Promise<void>;
}

/**
 * Interface for content flagging functionality
 */
export interface IContentFlagger {
  submitFlag(flagData: CreateFlagData): Promise<PostFlag>;
}

/**
 * Interface for content analysis
 */
export interface IContentAnalyzer {
  analyzeContent(content: string): {
    sentiment: "promotional" | "neutral" | "informative";
    linkCount: number;
    suspiciousLinks: string[];
    languageQuality: number;
  };
}

/**
 * Main moderation service interface
 * Combines all moderation functionality
 */
export interface IModerationService extends 
  ISpamDetector, 
  ICredibilityAssessor, 
  IContentFlagger, 
  IContentAnalyzer {
  // Additional methods for service management
  clearCache(): void;
  getHealth(): { status: 'healthy' | 'degraded' | 'error'; details: Record<string, unknown> };
}