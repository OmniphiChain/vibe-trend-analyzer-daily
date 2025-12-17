/**
 * Legacy Moderation Service - Deprecated
 * This file is kept for backward compatibility
 * Use the new modular services in src/services/moderation/ instead
 * @deprecated Use ModerationService from './moderation/ModerationService'
 */

import type { 
  SpamDetectionResult, 
  PostCredibility, 
  CredibilityUpdateData,
  CreateFlagData,
  PostFlag,
  ModerationQueueItem,
  CredibilityLevel
} from "@/types/moderation";
import type { SocialPost } from "@/types/social";

// Re-export the new modular service
export { moderationService } from './moderation/ModerationService';

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

class ModerationService {
  private spamCache = new Map<string, SpamDetectionResult>();
  private credibilityCache = new Map<string, PostCredibility>();
  
  /**
   * Analyze post content for spam indicators
   */
  async analyzeSpam(post: SocialPost): Promise<SpamDetectionResult> {
    const cacheKey = `${post.id}-${post.updatedAt.getTime()}`;
    
    if (this.spamCache.has(cacheKey)) {
      return this.spamCache.get(cacheKey)!;
    }

    const content = post.content.toLowerCase();
    const factors = {
      repetitiveContent: this.detectRepetitiveContent(content),
      suspiciousLinks: this.detectSuspiciousLinks(content),
      promoPhrases: this.detectPromoPhrases(content),
      botLikePattern: this.detectBotPattern(post),
      duplicateContent: this.detectDuplicateContent(content),
      excessiveEmojis: this.detectExcessiveEmojis(content),
      excessiveCaps: this.detectExcessiveCaps(content),
    };

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

    this.spamCache.set(cacheKey, result);
    return result;
  }

  /**
   * Calculate credibility score for a post
   */
  async calculateCredibility(post: SocialPost, authorReliability = 50): Promise<PostCredibility> {
    const cacheKey = `${post.id}-credibility`;
    
    if (this.credibilityCache.has(cacheKey)) {
      return this.credibilityCache.get(cacheKey)!;
    }

    const content = post.content;
    const factors = {
      hasSourceLinks: this.hasSourceLinks(content),
      hasDataEvidence: this.hasDataEvidence(content),
      authorReliability,
      communityVotes: 0,
      aiVerificationScore: this.calculateAIVerification(content),
    };

    const aiAnalysis = {
      contentType: this.classifyContentType(content) as any,
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

    this.credibilityCache.set(cacheKey, credibility);
    return credibility;
  }

  /**
   * Submit a flag for a post
   */
  async submitFlag(flagData: CreateFlagData): Promise<PostFlag> {
    // Mock implementation - in real app this would call an API
    const flag: PostFlag = {
      id: `flag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      ...flagData,
    };

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return flag;
  }

  /**
   * Update credibility score based on community feedback
   */
  async updateCredibilityFromCommunity(
    postId: string, 
    voteType: "helpful" | "misleading" | "accurate"
  ): Promise<void> {
    // Mock implementation
    console.log(`Updated credibility for ${postId} with ${voteType} vote`);
  }

  // Private helper methods

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
    const promoScore = SPAM_PATTERNS.promotional.filter(p => p.test(content)).length;
    score -= promoScore * 10;
    
    return Math.max(0, Math.min(100, score));
  }

  private classifyContentType(content: string): string {
    if (!content || typeof content !== 'string') return 'opinion';

    if (this.hasSourceLinks(content) && this.hasDataEvidence(content)) {
      return "data_backed";
    }
    
    if (SPAM_PATTERNS.promotional.some(p => p.test(content))) {
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

  private generateContentRiskFlags(content: string): string[] {
    const flags: string[] = [];

    if (!content || typeof content !== 'string') return flags;

    if (SPAM_PATTERNS.promotional.some(p => p.test(content))) {
      flags.push("Promotional Content");
    }
    
    if (SPAM_PATTERNS.scam.some(p => p.test(content))) {
      flags.push("Potential Scam");
    }
    
    if (this.detectSuspiciousLinks(content)) {
      flags.push("Suspicious Links");
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
   * Simplified spam detection for testing
   */
  detectSpam(content: string): { isSpam: boolean; confidence: number; reasons: string[] } {
    const reasons: string[] = [];
    let spamScore = 0;

    // Validate content
    if (!content || typeof content !== 'string') {
      return { isSpam: false, confidence: 0, reasons: ['Invalid content'] };
    }

    // Check for excessive emojis
    const emojiCount = (content.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
    if (emojiCount > 5) {
      spamScore += 30;
      reasons.push("Excessive emojis");
    }

    // Check for promotional patterns
    const promoCount = SPAM_PATTERNS.promotional.filter(pattern => pattern.test(content)).length;
    if (promoCount > 0) {
      spamScore += promoCount * 25;
      reasons.push("Promotional language");
    }

    // Check for scam patterns
    const scamCount = SPAM_PATTERNS.scam.filter(pattern => pattern.test(content)).length;
    if (scamCount > 0) {
      spamScore += scamCount * 35;
      reasons.push("Scam indicators");
    }

    // Check for suspicious links
    if (this.detectSuspiciousLinks(content)) {
      spamScore += 40;
      reasons.push("Suspicious links");
    }

    // Check for excessive caps
    if (this.detectExcessiveCaps(content)) {
      spamScore += 20;
      reasons.push("Excessive capitals");
    }

    const isSpam = spamScore > 50;
    const confidence = Math.min(1, spamScore / 100);

    return { isSpam, confidence, reasons };
  }

  /**
   * Public method for simplified credibility scoring
   * Used by components for quick credibility assessment
   */
  public calculateSimpleCredibilityScore(data: {
    content: string;
    author: string;
    timestamp: Date;
    engagement?: { likes: number; replies: number; shares: number };
  }): number {
    let score = 50; // Base score

    const { content, author, engagement } = data;

    // Validate content
    if (!content || typeof content !== 'string') {
      return score; // Return base score if content is invalid
    }

    // Check for quality indicators
    if (this.hasSourceLinks(content)) score += 20;
    if (this.hasDataEvidence(content)) score += 15;

    // Technical analysis bonus
    const techPatterns = CREDIBILITY_FACTORS.technicalAnalysis.patterns.filter(p => p.test(content)).length;
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
    const promoCount = SPAM_PATTERNS.promotional.filter(p => p.test(content)).length;
    score -= promoCount * 15;

    // Content length bonus for detailed posts
    if (content.length > 200) score += 5;
    if (content.length > 500) score += 5;

    return Math.max(0, Math.min(100, Math.round(score)));
  }
}

// Legacy export - remove this line to avoid conflicts
// const legacyModerationService = new ModerationService();

// Utility functions for UI components
export const getMockQueueItems = (): ModerationQueueItem[] => [
  // Mock queue items for testing
];

export const getMockCredibility = (postId: string, score = 75): PostCredibility => ({
  postId,
  score,
  level: score >= 70 ? "trusted" : score >= 40 ? "mixed" : "low",
  factors: {
    hasSourceLinks: score > 60,
    hasDataEvidence: score > 50,
    authorReliability: Math.min(100, score + 10),
    communityVotes: Math.floor(score / 10),
    aiVerificationScore: score,
  },
  aiAnalysis: {
    contentType: score > 70 ? "data_backed" : score > 40 ? "speculative" : "opinion",
    factualClaims: score > 60 ? ["$150 target", "15% growth"] : [],
    verificationSources: score > 70 ? ["sec.gov", "bloomberg.com"] : [],
    confidenceScore: score / 100,
    riskFlags: score < 40 ? ["Unverified Claims"] : [],
  },
  communityScore: score,
  communityVotes: {
    helpful: Math.floor(score / 20),
    misleading: Math.floor((100 - score) / 30),
    accurate: Math.floor(score / 25),
  },
  lastUpdated: new Date(),
  calculatedAt: new Date(),
});
