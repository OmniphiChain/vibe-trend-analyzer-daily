/**
 * Content Analysis Service
 * Implements content analysis functionality following Single Responsibility Principle
 * @author NeomSense Development Team
 * @version 1.0.0
 */

import type { IContentAnalyzer } from "./interfaces/IModerationService";
import { InputValidator } from "../validation/InputValidator";
import { logger, LogPerformance } from "../logging/Logger";

const PROMOTIONAL_PATTERNS = [
  /guaranteed.*profit/i,
  /100%.*returns?/i,
  /risk.?free/i,
  /get.*rich.*quick/i,
  /binary.*options?/i,
  /crypto.*scam/i,
  /pump.*dump/i,
  /insider.*trading/i,
  /easy.*money/i,
  /instant.*wealth/i,
];

const SUSPICIOUS_DOMAINS = [
  /bit\.ly/i,
  /tinyurl/i,
  /t\.me/i,
  /discord\.gg/i,
  /join.*my.*channel/i,
  /dm.*for.*signals/i,
  /private.*group/i,
  /vip.*signals/i,
];

/**
 * Professional content analysis service
 */
export class ContentAnalyzer implements IContentAnalyzer {
  public analyzeContent(content: string): {
    sentiment: "promotional" | "neutral" | "informative";
    linkCount: number;
    suspiciousLinks: string[];
    languageQuality: number;
  } {
    try {
      // Validate content
      const contentValidation = InputValidator.validateContent(content);
      if (!contentValidation.isValid) {
        logger.warn('Invalid content provided to content analyzer', { 
          errors: contentValidation.errors 
        });
        throw new Error(`Invalid content: ${contentValidation.errors.join(', ')}`);
      }

      const sanitizedContent = contentValidation.sanitized || content;

      const analysis = {
        sentiment: this.analyzeSentiment(sanitizedContent),
        linkCount: this.countLinks(sanitizedContent),
        suspiciousLinks: this.extractSuspiciousLinks(sanitizedContent),
        languageQuality: this.assessLanguageQuality(sanitizedContent),
      };

      logger.debug('Content analysis completed', { analysis });

      return analysis;
    } catch (error) {
      logger.error('Failed to analyze content', error as Error, { 
        contentLength: content?.length 
      });
      throw error;
    }
  }

  /**
   * Analyze content sentiment
   */
  private analyzeSentiment(content: string): "promotional" | "neutral" | "informative" {
    const promoScore = PROMOTIONAL_PATTERNS.filter(p => p.test(content)).length;
    if (promoScore > 0) return "promotional";
    
    const infoIndicators = [
      /according.*to/i, /data.*shows/i, /research.*indicates/i, 
      /analysis.*suggests/i, /report.*states/i
    ];
    const infoScore = infoIndicators.filter(p => p.test(content)).length;
    
    return infoScore > 0 ? "informative" : "neutral";
  }

  /**
   * Count links in content
   */
  private countLinks(content: string): number {
    const linkPattern = /(https?:\/\/[^\s]+)|(\w+\.\w+\/[^\s]*)/g;
    return (content.match(linkPattern) || []).length;
  }

  /**
   * Extract suspicious links
   */
  private extractSuspiciousLinks(content: string): string[] {
    const links = content.match(/(https?:\/\/[^\s]+)|(\w+\.\w+\/[^\s]*)/g) || [];
    return links.filter(link => 
      SUSPICIOUS_DOMAINS.some(pattern => pattern.test(link))
    );
  }

  /**
   * Assess language quality
   */
  private assessLanguageQuality(content: string): number {
    // Simple language quality assessment
    const words = content.split(/\s+/);
    if (words.length === 0) return 0;

    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const hasProperPunctuation = /[.!?]/.test(content);
    const spelling = words.filter(word => word.length > 2).length / words.length;
    
    let quality = 0.5;
    if (avgWordLength > 4) quality += 0.2;
    if (hasProperPunctuation) quality += 0.2;
    if (spelling > 0.8) quality += 0.1;
    
    return Math.min(1, quality);
  }
}