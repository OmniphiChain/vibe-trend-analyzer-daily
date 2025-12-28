/**
 * Spam Detection Service
 * Implements spam detection following Single Responsibility Principle
 * @author NeomSense Development Team
 * @version 1.0.0
 */

import type { SpamDetectionResult } from "@/types/moderation";
import type { SocialPost } from "@/types/social";
import type { ISpamDetector } from "./interfaces/IModerationService";
import { InputValidator } from "../validation/InputValidator";
import { logger, LogPerformance } from "../logging/Logger";

// Spam detection patterns and keywords
const SPAM_PATTERNS = {
  promotional: [
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
  ],
  
  scam: [
    /send.*bitcoin/i,
    /investment.*opportunity/i,
    /limited.*time.*offer/i,
    /act.*now/i,
    /exclusive.*deal/i,
    /telegram.*channel/i,
    /whatsapp.*group/i,
    /signal.*service/i,
    /trading.*bot/i,
    /forex.*expert/i,
  ],
  
  repetitive: [
    /(.{10,})\1{2,}/, // Repeated patterns
    /([A-Z])\1{3,}/, // Repeated caps
    /[!]{3,}/, // Multiple exclamation marks
    /[\$]{3,}/, // Multiple dollar signs
  ],
  
  suspicious: [
    /bit\.ly/i,
    /tinyurl/i,
    /t\.me/i,
    /discord\.gg/i,
    /join.*my.*channel/i,
    /dm.*for.*signals/i,
    /private.*group/i,
    /vip.*signals/i,
  ],
};

/**
 * Professional spam detection service
 */
export class SpamDetector implements ISpamDetector {
  private spamCache = new Map<string, SpamDetectionResult>();
  private readonly CACHE_TTL = 300000; // 5 minutes

  public async analyzeSpam(post: SocialPost): Promise<SpamDetectionResult> {
    try {
      // Validate input
      const contentValidation = InputValidator.validateContent(post.content);
      if (!contentValidation.isValid) {
        logger.warn('Invalid content provided to spam detector', { 
          postId: post.id, 
          errors: contentValidation.errors 
        });
        throw new Error(`Invalid content: ${contentValidation.errors.join(', ')}`);
      }

      const cacheKey = `${post.id}-${post.updatedAt.getTime()}`;
      
      // Check cache first
      const cached = this.getCachedResult(cacheKey);
      if (cached) {
        logger.debug('Returning cached spam analysis result', { postId: post.id });
        return cached;
      }

      const content = (contentValidation.sanitized || post.content).toLowerCase();
      
      // Perform spam analysis
      const factors = this.analyzeSpamFactors(content, post);
      const riskScore = this.calculateRiskScore(factors, content);
      const confidence = this.calculateConfidence(factors);
      const isSpam = riskScore > 70 && confidence > 0.6;

      const result: SpamDetectionResult = {
        postId: post.id,
        isSpam,
        confidence,
        factors,
        riskScore,
        riskFlags: this.generateRiskFlags(factors, riskScore),
        contentAnalysis: {
          sentiment: this.analyzeSentiment(content),
          linkCount: this.countLinks(content),
          suspiciousLinks: this.extractSuspiciousLinks(content),
          detectedCopyPaste: factors.duplicateContent || factors.repetitiveContent,
          languageQuality: this.assessLanguageQuality(content),
        },
        processedAt: new Date(),
      };

      // Cache result
      this.cacheResult(cacheKey, result);
      
      logger.info('Spam analysis completed', { 
        postId: post.id, 
        isSpam, 
        riskScore, 
        confidence 
      });

      return result;
    } catch (error) {
      logger.error('Failed to analyze spam', error as Error, { postId: post.id });
      throw error;
    }
  }

  public detectSpam(content: string): { isSpam: boolean; confidence: number; reasons: string[] } {
    try {
      const reasons: string[] = [];
      let spamScore = 0;

      // Validate content
      const contentValidation = InputValidator.validateContent(content);
      if (!contentValidation.isValid) {
        return { isSpam: false, confidence: 0, reasons: contentValidation.errors };
      }

      const sanitizedContent = contentValidation.sanitized || content || '';

      // Check for excessive emojis
      const emojiCount = (sanitizedContent.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
      if (emojiCount > 5) {
        spamScore += 30;
        reasons.push("Excessive emojis");
      }

      // Check for promotional patterns
      const promoCount = SPAM_PATTERNS.promotional.filter(pattern => pattern.test(sanitizedContent)).length;
      if (promoCount > 0) {
        spamScore += promoCount * 25;
        reasons.push("Promotional language");
      }

      // Check for scam patterns
      const scamCount = SPAM_PATTERNS.scam.filter(pattern => pattern.test(sanitizedContent)).length;
      if (scamCount > 0) {
        spamScore += scamCount * 35;
        reasons.push("Scam indicators");
      }

      // Check for suspicious links
      if (this.detectSuspiciousLinks(sanitizedContent)) {
        spamScore += 40;
        reasons.push("Suspicious links");
      }

      // Check for excessive caps
      if (this.detectExcessiveCaps(sanitizedContent)) {
        spamScore += 20;
        reasons.push("Excessive capitals");
      }

      const isSpam = spamScore > 50;
      const confidence = Math.min(1, spamScore / 100);

      logger.debug('Quick spam detection completed', { isSpam, confidence, reasons });

      return { isSpam, confidence, reasons };
    } catch (error) {
      logger.error('Failed to detect spam', error as Error, { content: content?.substring(0, 100) });
      return { isSpam: false, confidence: 0, reasons: ['Analysis failed'] };
    }
  }

  /**
   * Analyze various spam factors
   */
  private analyzeSpamFactors(content: string, post: SocialPost) {
    return {
      repetitiveContent: this.detectRepetitiveContent(content),
      suspiciousLinks: this.detectSuspiciousLinks(content),
      promoPhrases: this.detectPromoPhrases(content),
      botLikePattern: this.detectBotPattern(post),
      duplicateContent: this.detectDuplicateContent(content),
      excessiveEmojis: this.detectExcessiveEmojis(content),
      excessiveCaps: this.detectExcessiveCaps(content),
    };
  }

  private detectRepetitiveContent(content: string): boolean {
    return SPAM_PATTERNS.repetitive.some(pattern => pattern.test(content));
  }

  private detectSuspiciousLinks(content: string): boolean {
    return SPAM_PATTERNS.suspicious.some(pattern => pattern.test(content));
  }

  private detectPromoPhrases(content: string): boolean {
    const promoCount = SPAM_PATTERNS.promotional.filter(pattern => 
      pattern.test(content)
    ).length;
    return promoCount >= 2; // Multiple promotional phrases
  }

  private detectBotPattern(post: SocialPost): boolean {
    // Check for bot-like posting patterns
    const hasMultipleCashtags = post.cashtags.length > 5;
    const hasExcessiveHashtags = post.hashtags.length > 8;
    const shortContent = post.content.length < 50;
    
    return hasMultipleCashtags && hasExcessiveHashtags && shortContent;
  }

  private detectDuplicateContent(content: string): boolean {
    // Simplified duplicate detection
    const words = content.split(/\s+/);
    const uniqueWords = new Set(words);
    return uniqueWords.size / words.length < 0.6; // High repetition ratio
  }

  private detectExcessiveEmojis(content: string): boolean {
    const emojiCount = (content.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
    return emojiCount > content.length * 0.1; // More than 10% emojis
  }

  private detectExcessiveCaps(content: string): boolean {
    const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    return capsRatio > 0.3; // More than 30% caps
  }

  private calculateRiskScore(factors: any, content: string): number {
    let score = 0;
    
    if (factors.repetitiveContent) score += 25;
    if (factors.suspiciousLinks) score += 30;
    if (factors.promoPhrases) score += 35;
    if (factors.botLikePattern) score += 20;
    if (factors.duplicateContent) score += 15;
    if (factors.excessiveEmojis) score += 10;
    if (factors.excessiveCaps) score += 15;

    // Check for scam patterns
    const scamCount = SPAM_PATTERNS.scam.filter(pattern => 
      pattern.test(content)
    ).length;
    score += scamCount * 20;

    return Math.min(100, score);
  }

  private calculateConfidence(factors: any): number {
    const factorCount = Object.values(factors).filter(Boolean).length;
    return Math.min(1, factorCount / 4); // Confidence based on number of factors
  }

  private generateRiskFlags(factors: any, riskScore: number): string[] {
    const flags: string[] = [];
    
    if (factors.suspiciousLinks) flags.push("Suspicious Links");
    if (factors.promoPhrases) flags.push("Promotional Language");
    if (factors.repetitiveContent) flags.push("Repetitive Content");
    if (factors.botLikePattern) flags.push("Bot-like Pattern");
    if (riskScore > 80) flags.push("High Risk Content");
    
    return flags;
  }

  private analyzeSentiment(content: string): "promotional" | "neutral" | "informative" {
    const promoScore = SPAM_PATTERNS.promotional.filter(p => p.test(content)).length;
    if (promoScore > 0) return "promotional";
    
    const infoIndicators = [
      /according.*to/i, /data.*shows/i, /research.*indicates/i, 
      /analysis.*suggests/i, /report.*states/i
    ];
    const infoScore = infoIndicators.filter(p => p.test(content)).length;
    
    return infoScore > 0 ? "informative" : "neutral";
  }

  private countLinks(content: string): number {
    const linkPattern = /(https?:\/\/[^\s]+)|(\w+\.\w+\/[^\s]*)/g;
    return (content.match(linkPattern) || []).length;
  }

  private extractSuspiciousLinks(content: string): string[] {
    const links = content.match(/(https?:\/\/[^\s]+)|(\w+\.\w+\/[^\s]*)/g) || [];
    return links.filter(link => 
      SPAM_PATTERNS.suspicious.some(pattern => pattern.test(link))
    );
  }

  private assessLanguageQuality(content: string): number {
    // Simple language quality assessment
    const words = content.split(/\s+/);
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const hasProperPunctuation = /[.!?]/.test(content);
    const spelling = words.filter(word => word.length > 2).length / words.length;
    
    let quality = 0.5;
    if (avgWordLength > 4) quality += 0.2;
    if (hasProperPunctuation) quality += 0.2;
    if (spelling > 0.8) quality += 0.1;
    
    return Math.min(1, quality);
  }

  /**
   * Cache management
   */
  private getCachedResult(cacheKey: string): SpamDetectionResult | null {
    const cached = this.spamCache.get(cacheKey);
    if (cached) {
      const age = Date.now() - cached.processedAt.getTime();
      if (age < this.CACHE_TTL) {
        return cached;
      } else {
        this.spamCache.delete(cacheKey);
      }
    }
    return null;
  }

  private cacheResult(cacheKey: string, result: SpamDetectionResult): void {
    this.spamCache.set(cacheKey, result);
    
    // Cleanup old cache entries if needed
    if (this.spamCache.size > 1000) {
      const oldestKey = this.spamCache.keys().next().value;
      this.spamCache.delete(oldestKey);
    }
  }

  /**
   * Clear all cached results
   */
  public clearCache(): void {
    this.spamCache.clear();
    logger.info('Spam detector cache cleared');
  }
}