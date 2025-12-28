/**
 * Unit Tests for SpamDetector
 * Comprehensive test coverage following industry standards
 * @author NeomSense Development Team
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { SpamDetector } from '../moderation/SpamDetector';
import type { SocialPost } from '@/types/social';

describe('SpamDetector', () => {
  let spamDetector: SpamDetector;

  beforeEach(() => {
    spamDetector = new SpamDetector();
  });

  describe('detectSpam', () => {
    test('should detect promotional spam', () => {
      const content = 'Guaranteed 100% profit! Risk-free trading signals!';
      const result = spamDetector.detectSpam(content);
      
      expect(result.isSpam).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.5);
      expect(result.reasons).toContain('Promotional language');
    });

    test('should detect scam patterns', () => {
      const content = 'Send Bitcoin now for exclusive investment opportunity!';
      const result = spamDetector.detectSpam(content);
      
      expect(result.isSpam).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.5);
      expect(result.reasons).toContain('Scam indicators');
    });

    test('should detect excessive emojis', () => {
      const content = '🚀🚀🚀🚀🚀🚀 Buy now! 💰💰💰💰💰💰';
      const result = spamDetector.detectSpam(content);
      
      expect(result.isSpam).toBe(true);
      expect(result.reasons).toContain('Excessive emojis');
    });

    test('should detect suspicious links', () => {
      const content = 'Click here: bit.ly/suspicious-link for trading signals';
      const result = spamDetector.detectSpam(content);
      
      expect(result.isSpam).toBe(true);
      expect(result.reasons).toContain('Suspicious links');
    });

    test('should detect excessive capitals', () => {
      const content = 'BUY NOW!!! TRADING SIGNALS HERE!!!';
      const result = spamDetector.detectSpam(content);
      
      expect(result.isSpam).toBe(true);
      expect(result.reasons).toContain('Excessive capitals');
    });

    test('should not flag legitimate content', () => {
      const content = 'Apple (AAPL) earnings report shows strong Q3 performance with revenue growth of 8%.';
      const result = spamDetector.detectSpam(content);
      
      expect(result.isSpam).toBe(false);
      expect(result.confidence).toBeLessThan(0.5);
    });

    test('should handle empty content gracefully', () => {
      const result = spamDetector.detectSpam('');
      
      expect(result.isSpam).toBe(false);
      expect(result.confidence).toBe(0);
      expect(result.reasons).toContain('Content cannot be empty');
    });

    test('should handle invalid content types', () => {
      const result = spamDetector.detectSpam(null as any);
      
      expect(result.isSpam).toBe(false);
      expect(result.confidence).toBe(0);
      expect(result.reasons).toContain('Content must be a string');
    });
  });

  describe('analyzeSpam', () => {
    const createMockPost = (content: string): SocialPost => ({
      id: 'test-post-1',
      content,
      author: 'test-user',
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      replies: 0,
      shares: 0,
      hashtags: [],
      cashtags: [],
      sentiment: 'neutral' as const,
      aiAnalysis: {
        summary: '',
        keyPoints: [],
        sentiment: 'neutral' as const,
        credibilityScore: 50,
        riskFlags: []
      }
    });

    test('should analyze spam with detailed factors', async () => {
      const post = createMockPost('Guaranteed profit! Join my Telegram channel for insider trading signals!');
      const result = await spamDetector.analyzeSpam(post);
      
      expect(result.isSpam).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.6);
      expect(result.riskScore).toBeGreaterThan(70);
      expect(result.factors.promoPhrases).toBe(true);
      expect(result.factors.suspiciousLinks).toBe(true);
      expect(result.contentAnalysis.sentiment).toBe('promotional');
    });

    test('should not flag quality content', async () => {
      const post = createMockPost('According to SEC filings, AAPL shows strong quarterly results with P/E ratio improvement.');
      const result = await spamDetector.analyzeSpam(post);
      
      expect(result.isSpam).toBe(false);
      expect(result.riskScore).toBeLessThan(70);
      expect(result.contentAnalysis.sentiment).toBe('informative');
      expect(result.contentAnalysis.languageQuality).toBeGreaterThan(0.5);
    });

    test('should detect bot-like patterns', async () => {
      const post = createMockPost('Buy now! 🚀');
      post.cashtags = ['$AAPL', '$MSFT', '$GOOGL', '$TSLA', '$AMZN', '$META']; // > 5 cashtags
      post.hashtags = ['#buy', '#sell', '#trade', '#profit', '#money', '#rich', '#signals', '#bot', '#auto']; // > 8 hashtags
      
      const result = await spamDetector.analyzeSpam(post);
      
      expect(result.factors.botLikePattern).toBe(true);
      expect(result.riskScore).toBeGreaterThan(50);
    });

    test('should handle caching correctly', async () => {
      const post = createMockPost('Test content for caching');
      
      // First call
      const result1 = await spamDetector.analyzeSpam(post);
      
      // Second call should return cached result
      const result2 = await spamDetector.analyzeSpam(post);
      
      expect(result1).toEqual(result2);
      expect(result1.processedAt).toEqual(result2.processedAt);
    });

    test('should clear cache', () => {
      expect(() => spamDetector.clearCache()).not.toThrow();
    });
  });
});