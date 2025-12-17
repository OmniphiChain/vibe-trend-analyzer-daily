/**
 * Credibility Assessment Service
 * Implements credibility scoring following Single Responsibility Principle
 * @author NeomSense Development Team
 * @version 1.0.0
 */

import type { PostCredibility, CredibilityLevel } from "@/types/moderation";
import type { SocialPost } from "@/types/social";
import type { ICredibilityAssessor } from "./interfaces/IModerationService";
import { InputValidator } from "../validation/InputValidator";
import { logger, LogPerformance } from "../logging/Logger";

// Credibility scoring factors
const CREDIBILITY_FACTORS = {
  sourceLinks: {
    domains: [
      'sec.gov', 'edgar.sec.gov', 'investopedia.com', 'bloomberg.com',
      'reuters.com', 'wsj.com', 'ft.com', 'marketwatch.com',
      'yahoo.com/finance', 'google.com/finance', 'tradingview.com',
      'finviz.com', 'morningstar.com', 'seekingalpha.com'
    ],
    score: 25,
  },
  
  dataEvidence: {
    patterns: [
      /earnings.*report/i,
      /quarterly.*results/i,
      /balance.*sheet/i,
      /cash.*flow/i,
      /p\/e.*ratio/i,
      /market.*cap/i,
      /revenue.*growth/i,
      /options.*chain/i,
      /volume.*analysis/i,
    ],
    score: 20,
  },
  
  technicalAnalysis: {
    patterns: [
      /support.*resistance/i,
      /moving.*average/i,
      /bollinger.*band/i,
      /rsi/i,
      /macd/i,
      /fibonacci/i,
      /candlestick/i,
      /chart.*pattern/i,
    ],
    score: 15,
  },
};

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

/**
 * Professional credibility assessment service
 */
export class CredibilityAssessor implements ICredibilityAssessor {
  private credibilityCache = new Map<string, PostCredibility>();
  private readonly CACHE_TTL = 600000; // 10 minutes

  public async calculateCredibility(post: SocialPost, authorReliability = 50): Promise<PostCredibility> {
    try {
      // Validate input
      const contentValidation = InputValidator.validateContent(post.content);
      if (!contentValidation.isValid) {
        logger.warn('Invalid content provided to credibility assessor', { 
          postId: post.id, 
          errors: contentValidation.errors 
        });
        throw new Error(`Invalid content: ${contentValidation.errors.join(', ')}`);
      }

      const cacheKey = `${post.id}-credibility`;
      
      // Check cache first
      const cached = this.getCachedResult(cacheKey);
      if (cached) {
        logger.debug('Returning cached credibility result', { postId: post.id });
        return cached;
      }

      const content = contentValidation.sanitized || post.content;
      
      const factors = {
        hasSourceLinks: this.hasSourceLinks(content),
        hasDataEvidence: this.hasDataEvidence(content),
        authorReliability,
        communityVotes: 0,
        aiVerificationScore: this.calculateAIVerification(content),
      };

      const aiAnalysis = {
        contentType: this.classifyContentType(content) as "data_backed" | "speculative" | "opinion" | "promotional",
        factualClaims: this.extractFactualClaims(content),
        verificationSources: this.extractVerificationSources(content),
        confidenceScore: this.calculateAIConfidence(content),
        riskFlags: this.generateContentRiskFlags(content),
      };

      const score = this.calculateCredibilityScore(factors, aiAnalysis);
      const level = this.getCredibilityLevel(score);

      const credibility: PostCredibility = {
        postId: post.id,
        score,
        level,
        factors,
        aiAnalysis,
        communityScore: 50, // Default neutral score
        communityVotes: {
          helpful: 0,
          misleading: 0,
          accurate: 0,
        },
        lastUpdated: new Date(),
        calculatedAt: new Date(),
      };

      // Cache result
      this.cacheResult(cacheKey, credibility);
      
      logger.info('Credibility analysis completed', { 
        postId: post.id, 
        score, 
        level 
      });

      return credibility;
    } catch (error) {
      logger.error('Failed to calculate credibility', error as Error, { postId: post.id });
      throw error;
    }
  }

  public calculateSimpleCredibilityScore(data: {
    content: string;
    author: string;
    timestamp: Date;
    engagement?: { likes: number; replies: number; shares: number };
  }): number {
    try {
      let score = 50; // Base score

      const { content, author, engagement } = data;

      // Validate content
      const contentValidation = InputValidator.validateContent(content);
      if (!contentValidation.isValid) {
        logger.warn('Invalid content in simple credibility scoring', { errors: contentValidation.errors });
        return score; // Return base score if content is invalid
      }

      const sanitizedContent = contentValidation.sanitized || content || '';
      if (!sanitizedContent) {
        logger.warn('Content is empty after validation');
        return score;
      }

      // Check for quality indicators
      if (this.hasSourceLinks(sanitizedContent)) score += 20;
      if (this.hasDataEvidence(sanitizedContent)) score += 15;

      // Technical analysis bonus
      const techPatterns = CREDIBILITY_FACTORS.technicalAnalysis.patterns.filter(p => p.test(sanitizedContent)).length;
      score += techPatterns * 8;

      // Author reliability based on name patterns
      if (author.includes('expert') || author.includes('analyst')) score += 15;
      if (author.includes('trader') || author.includes('pro')) score += 10;
      if (author.includes('meme') || author.includes('lord')) score -= 20;

      // Engagement quality
      if (engagement) {
        const engagementRatio = (engagement.likes + engagement.replies * 2) / Math.max(1, engagement.shares);
        if (engagementRatio > 5) score += 10;
      }

      // Penalize promotional content
      const promoCount = PROMOTIONAL_PATTERNS.filter(p => p.test(sanitizedContent)).length;
      score -= promoCount * 15;

      // Content length bonus for detailed posts
      if (sanitizedContent.length > 200) score += 5;
      if (sanitizedContent.length > 500) score += 5;

      const finalScore = Math.max(0, Math.min(100, Math.round(score)));
      
      logger.debug('Simple credibility score calculated', { 
        finalScore, 
        author: author.substring(0, 20) 
      });

      return finalScore;
    } catch (error) {
      logger.error('Failed to calculate simple credibility score', error as Error);
      return 50; // Return neutral score on error
    }
  }

  public async updateCredibilityFromCommunity(
    postId: string, 
    voteType: "helpful" | "misleading" | "accurate"
  ): Promise<void> {
    try {
      // In a real implementation, this would update the database
      logger.info('Community credibility vote recorded', { postId, voteType });
      
      // Remove from cache to force recalculation with new community data
      const cacheKey = `${postId}-credibility`;
      this.credibilityCache.delete(cacheKey);
    } catch (error) {
      logger.error('Failed to update credibility from community feedback', error as Error, { postId, voteType });
      throw error;
    }
  }

  // Private helper methods

  private hasSourceLinks(content: string): boolean {
    if (!content || typeof content !== 'string') return false;
    const links = content.match(/(https?:\/\/[^\s]+)/g) || [];
    return links.some(link => 
      CREDIBILITY_FACTORS.sourceLinks.domains.some(domain => 
        link.toLowerCase().includes(domain)
      )
    );
  }

  private hasDataEvidence(content: string): boolean {
    if (!content || typeof content !== 'string') return false;
    return CREDIBILITY_FACTORS.dataEvidence.patterns.some(pattern => 
      pattern.test(content)
    );
  }

  private calculateAIVerification(content: string): number {
    let score = 50; // Base score

    if (!content || typeof content !== 'string') return score;

    if (this.hasSourceLinks(content)) score += 25;
    if (this.hasDataEvidence(content)) score += 20;
    
    const techAnalysis = CREDIBILITY_FACTORS.technicalAnalysis.patterns.filter(p => 
      p.test(content)
    ).length;
    score += techAnalysis * 5;
    
    // Deduct for promotional language
    const promoScore = PROMOTIONAL_PATTERNS.filter(p => p.test(content)).length;
    score -= promoScore * 10;
    
    return Math.max(0, Math.min(100, score));
  }

  private classifyContentType(content: string): string {
    if (!content || typeof content !== 'string') return 'opinion';

    if (this.hasSourceLinks(content) && this.hasDataEvidence(content)) {
      return "data_backed";
    }
    
    if (PROMOTIONAL_PATTERNS.some(p => p.test(content))) {
      return "promotional";
    }
    
    const speculativeWords = [
      /i.*think/i, /might/i, /could/i, /probably/i, /maybe/i, 
      /prediction/i, /forecast/i, /expect/i
    ];
    
    if (speculativeWords.some(p => p.test(content))) {
      return "speculative";
    }
    
    return "opinion";
  }

  private extractFactualClaims(content: string): string[] {
    const claims: string[] = [];
    
    // Extract price targets, percentages, and specific numbers
    const priceTargets = content.match(/\$\d+(\.\d+)?/g) || [];
    const percentages = content.match(/\d+(\.\d+)?%/g) || [];
    
    claims.push(...priceTargets, ...percentages);
    
    return claims.slice(0, 5); // Limit to 5 claims
  }

  private extractVerificationSources(content: string): string[] {
    const links = content.match(/(https?:\/\/[^\s]+)/g) || [];
    return links.filter(link => 
      CREDIBILITY_FACTORS.sourceLinks.domains.some(domain => 
        link.toLowerCase().includes(domain)
      )
    ).slice(0, 3);
  }

  private calculateAIConfidence(content: string): number {
    if (!content || typeof content !== 'string') return 0.5;

    const factors = [
      this.hasSourceLinks(content),
      this.hasDataEvidence(content),
      content.length > 100,
      !/[!]{2,}/.test(content), // No excessive exclamation
      this.assessLanguageQuality(content) > 0.7,
    ];
    
    return factors.filter(Boolean).length / factors.length;
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

  private generateContentRiskFlags(content: string): string[] {
    const flags: string[] = [];

    if (!content || typeof content !== 'string') return flags;

    if (PROMOTIONAL_PATTERNS.some(p => p.test(content))) {
      flags.push("Promotional Content");
    }
    
    return flags;
  }

  private calculateCredibilityScore(factors: any, aiAnalysis: any): number {
    let score = 40; // Base score
    
    if (factors.hasSourceLinks) score += 25;
    if (factors.hasDataEvidence) score += 20;
    score += (factors.aiVerificationScore - 50) * 0.3; // Scale AI score
    score += (factors.authorReliability - 50) * 0.2; // Scale author reliability
    
    // Penalize for risk flags
    score -= aiAnalysis.riskFlags.length * 10;
    
    // Bonus for high confidence
    if (aiAnalysis.confidenceScore > 0.8) score += 10;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private getCredibilityLevel(score: number): CredibilityLevel {
    if (score >= 70) return "trusted";
    if (score >= 40) return "mixed";
    if (score >= 20) return "low";
    return "unverified";
  }

  /**
   * Cache management
   */
  private getCachedResult(cacheKey: string): PostCredibility | null {
    const cached = this.credibilityCache.get(cacheKey);
    if (cached) {
      const age = Date.now() - cached.calculatedAt.getTime();
      if (age < this.CACHE_TTL) {
        return cached;
      } else {
        this.credibilityCache.delete(cacheKey);
      }
    }
    return null;
  }

  private cacheResult(cacheKey: string, result: PostCredibility): void {
    this.credibilityCache.set(cacheKey, result);
    
    // Cleanup old cache entries if needed
    if (this.credibilityCache.size > 500) {
      const oldestKey = this.credibilityCache.keys().next().value;
      this.credibilityCache.delete(oldestKey);
    }
  }

  /**
   * Clear all cached results
   */
  public clearCache(): void {
    this.credibilityCache.clear();
    logger.info('Credibility assessor cache cleared');
  }
}