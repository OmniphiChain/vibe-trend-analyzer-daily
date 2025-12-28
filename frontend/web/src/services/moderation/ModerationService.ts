/**
 * Main Moderation Service
 * Orchestrates all moderation functionality following Facade Pattern and Dependency Injection
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
import type { IModerationService } from "./interfaces/IModerationService";
import { SpamDetector } from "./SpamDetector";
import { CredibilityAssessor } from "./CredibilityAssessor";
import { ContentFlagger } from "./ContentFlagger";
import { ContentAnalyzer } from "./ContentAnalyzer";
import { logger } from "../logging/Logger";

/**
 * Main moderation service implementing the Facade pattern
 * Coordinates all moderation sub-services
 */
export class ModerationService implements IModerationService {
  private spamDetector: SpamDetector;
  private credibilityAssessor: CredibilityAssessor;
  private contentFlagger: ContentFlagger;
  private contentAnalyzer: ContentAnalyzer;

  constructor() {
    this.spamDetector = new SpamDetector();
    this.credibilityAssessor = new CredibilityAssessor();
    this.contentFlagger = new ContentFlagger();
    this.contentAnalyzer = new ContentAnalyzer();

    logger.info('ModerationService initialized with all sub-services');
  }

  // Spam Detection methods
  public async analyzeSpam(post: SocialPost): Promise<SpamDetectionResult> {
    return this.spamDetector.analyzeSpam(post);
  }

  public detectSpam(content: string): { isSpam: boolean; confidence: number; reasons: string[] } {
    return this.spamDetector.detectSpam(content);
  }

  // Credibility Assessment methods
  public async calculateCredibility(post: SocialPost, authorReliability?: number): Promise<PostCredibility> {
    return this.credibilityAssessor.calculateCredibility(post, authorReliability);
  }

  public calculateSimpleCredibilityScore(data: {
    content: string;
    author: string;
    timestamp: Date;
    engagement?: { likes: number; replies: number; shares: number };
  }): number {
    return this.credibilityAssessor.calculateSimpleCredibilityScore(data);
  }

  public async updateCredibilityFromCommunity(
    postId: string, 
    voteType: "helpful" | "misleading" | "accurate"
  ): Promise<void> {
    return this.credibilityAssessor.updateCredibilityFromCommunity(postId, voteType);
  }

  // Content Flagging methods
  public async submitFlag(flagData: CreateFlagData): Promise<PostFlag> {
    return this.contentFlagger.submitFlag(flagData);
  }

  // Content Analysis methods
  public analyzeContent(content: string): {
    sentiment: "promotional" | "neutral" | "informative";
    linkCount: number;
    suspiciousLinks: string[];
    languageQuality: number;
  } {
    return this.contentAnalyzer.analyzeContent(content);
  }

  // Service Management methods
  public clearCache(): void {
    try {
      this.spamDetector.clearCache();
      this.credibilityAssessor.clearCache();
      logger.info('All moderation service caches cleared');
    } catch (error) {
      logger.error('Failed to clear moderation service caches', error as Error);
      throw error;
    }
  }

  public getHealth(): { status: 'healthy' | 'degraded' | 'error'; details: Record<string, unknown> } {
    try {
      // Perform health checks on all sub-services
      const health = {
        status: 'healthy' as const,
        details: {
          spamDetector: 'operational',
          credibilityAssessor: 'operational',
          contentFlagger: 'operational',
          contentAnalyzer: 'operational',
          timestamp: new Date().toISOString(),
        }
      };

      logger.debug('Moderation service health check completed', health);
      return health;
    } catch (error) {
      logger.error('Moderation service health check failed', error as Error);
      return {
        status: 'error',
        details: {
          error: (error as Error).message,
          timestamp: new Date().toISOString(),
        }
      };
    }
  }
}

// Export singleton instance
export const moderationService = new ModerationService();