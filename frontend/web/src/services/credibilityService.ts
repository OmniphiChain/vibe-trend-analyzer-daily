import { 
  CredibilityMetrics, 
  CredibilityScore, 
  UserCredibility, 
  PostCredibility, 
  BadgeType,
  calculateOverallScore,
  determineUserBadges,
  CREDIBILITY_WEIGHTS 
} from '@/types/credibility';

interface PostData {
  id: string;
  content: string;
  author: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  ticker?: string;
  timestamp: Date;
  upvotes: number;
  downvotes: number;
  comments: number;
  hasChart?: boolean;
  hasSource?: boolean;
  hasData?: boolean;
}

interface MarketOutcome {
  ticker: string;
  date: Date;
  priceChange: number; // percentage change after prediction
  accurate: boolean;
}

interface UserHistoryData {
  userId: string;
  totalPosts: number;
  accuratePredictions: number;
  totalUpvotes: number;
  totalDownvotes: number;
  averageEngagement: number;
  consistencyScore: number;
  joinDate: Date;
}

class CredibilityService {
  private mockMarketData: Map<string, MarketOutcome[]> = new Map();
  private mockUserHistory: Map<string, UserHistoryData> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock market outcomes for testing
    this.mockMarketData.set('AAPL', [
      { ticker: 'AAPL', date: new Date('2024-12-01'), priceChange: 5.2, accurate: true },
      { ticker: 'AAPL', date: new Date('2024-11-28'), priceChange: -2.1, accurate: false },
    ]);
    
    this.mockMarketData.set('TSLA', [
      { ticker: 'TSLA', date: new Date('2024-12-01'), priceChange: 8.7, accurate: true },
      { ticker: 'TSLA', date: new Date('2024-11-25'), priceChange: 3.4, accurate: true },
    ]);

    // Mock user history
    this.mockUserHistory.set('user1', {
      userId: 'user1',
      totalPosts: 25,
      accuratePredictions: 20,
      totalUpvotes: 145,
      totalDownvotes: 12,
      averageEngagement: 8.2,
      consistencyScore: 85,
      joinDate: new Date('2024-06-15')
    });

    this.mockUserHistory.set('user2', {
      userId: 'user2',
      totalPosts: 8,
      accuratePredictions: 3,
      totalUpvotes: 24,
      totalDownvotes: 18,
      averageEngagement: 3.1,
      consistencyScore: 45,
      joinDate: new Date('2024-11-20')
    });
  }

  /**
   * Calculate post accuracy score based on price movement alignment
   */
  private calculatePostAccuracy(post: PostData): number {
    if (!post.ticker) return 50; // Neutral for non-ticker posts

    const outcomes = this.mockMarketData.get(post.ticker) || [];
    const relevantOutcomes = outcomes.filter(
      outcome => outcome.date >= post.timestamp && 
                 outcome.date <= new Date(post.timestamp.getTime() + 7 * 24 * 60 * 60 * 1000)
    );

    if (relevantOutcomes.length === 0) return 50; // No data available

    let accuracyScore = 0;
    relevantOutcomes.forEach(outcome => {
      const sentimentCorrect = 
        (post.sentiment === 'bullish' && outcome.priceChange > 2) ||
        (post.sentiment === 'bearish' && outcome.priceChange < -2) ||
        (post.sentiment === 'neutral' && Math.abs(outcome.priceChange) <= 2);
      
      accuracyScore += sentimentCorrect ? 100 : 0;
    });

    return accuracyScore / relevantOutcomes.length;
  }

  /**
   * Calculate community feedback score
   */
  private calculateCommunityFeedback(post: PostData): number {
    const totalVotes = post.upvotes + post.downvotes;
    if (totalVotes === 0) return 50; // Neutral for no votes

    const upvoteRatio = post.upvotes / totalVotes;
    const engagementBonus = Math.min(post.comments * 2, 20); // Max 20 bonus points

    return Math.min((upvoteRatio * 80) + engagementBonus, 100);
  }

  /**
   * Detect and score data evidence in post
   */
  private calculateDataEvidence(post: PostData): number {
    let score = 20; // Base score for any post

    // Check for charts, images, or visual evidence
    if (post.hasChart) score += 30;
    
    // Check for external sources or links
    if (post.hasSource) score += 25;
    
    // Check for data/numbers in content
    if (post.hasData || this.detectDataInContent(post.content)) score += 25;

    return Math.min(score, 100);
  }

  private detectDataInContent(content: string): boolean {
    // Look for patterns indicating data usage
    const dataPatterns = [
      /\$\d+(\.\d{2})?/g, // Price targets
      /\d+%/g, // Percentages
      /P\/E\s*[:=]\s*\d+/gi, // P/E ratios
      /volume|market cap|revenue/gi, // Financial terms
      /\d{1,3}(,\d{3})*\s*(shares|volume|dollars)/gi // Large numbers
    ];

    return dataPatterns.some(pattern => pattern.test(content));
  }

  /**
   * AI sentiment validation score
   */
  private async calculateAIValidation(post: PostData): Promise<number> {
    // Mock AI validation - in real implementation, this would call AI service
    const aiSentiment = await this.getAISentiment(post.content);
    
    if (aiSentiment === post.sentiment) return 90;
    if (aiSentiment === 'neutral' || post.sentiment === 'neutral') return 60;
    return 30; // Conflicting sentiments
  }

  private async getAISentiment(content: string): Promise<'bullish' | 'bearish' | 'neutral'> {
    // Mock AI sentiment analysis
    const bullishWords = ['buy', 'bullish', 'moon', 'pump', 'strong', 'positive'];
    const bearishWords = ['sell', 'bearish', 'dump', 'crash', 'weak', 'negative'];
    
    const contentLower = content.toLowerCase();
    const bullishCount = bullishWords.filter(word => contentLower.includes(word)).length;
    const bearishCount = bearishWords.filter(word => contentLower.includes(word)).length;
    
    if (bullishCount > bearishCount) return 'bullish';
    if (bearishCount > bullishCount) return 'bearish';
    return 'neutral';
  }

  /**
   * Calculate user consistency score
   */
  private calculateUserConsistency(userId: string): number {
    const userData = this.mockUserHistory.get(userId);
    if (!userData) return 50; // New user

    const accuracyRate = (userData.accuratePredictions / userData.totalPosts) * 100;
    const engagementRate = userData.totalUpvotes / Math.max(userData.totalPosts, 1);
    const consistencyBonus = userData.consistencyScore || 50;

    return Math.min((accuracyRate * 0.5) + (engagementRate * 3) + (consistencyBonus * 0.3), 100);
  }

  /**
   * Main method to calculate credibility score for a post
   */
  async calculatePostCredibility(post: PostData): Promise<CredibilityScore> {
    const metrics: CredibilityMetrics = {
      postAccuracy: this.calculatePostAccuracy(post),
      communityFeedback: this.calculateCommunityFeedback(post),
      dataEvidence: this.calculateDataEvidence(post),
      aiValidation: await this.calculateAIValidation(post),
      userConsistency: this.calculateUserConsistency(post.author)
    };

    const overallScore = calculateOverallScore(metrics);
    
    // Determine trend direction based on user's recent performance
    const trendDirection = this.calculateTrendDirection(post.author);

    return {
      userId: post.author,
      postId: post.id,
      overallScore,
      metrics,
      lastUpdated: new Date(),
      trendDirection
    };
  }

  private calculateTrendDirection(userId: string): 'up' | 'down' | 'stable' {
    // Mock trend calculation - in real implementation, analyze recent score history
    const trends = ['up', 'down', 'stable'] as const;
    return trends[Math.floor(Math.random() * trends.length)];
  }

  /**
   * Calculate overall user credibility
   */
  async calculateUserCredibility(userId: string): Promise<UserCredibility> {
    const userData = this.mockUserHistory.get(userId);
    if (!userData) {
      // New user default
      const newUserCredibility: UserCredibility = {
        userId,
        username: `User${userId}`,
        currentScore: 50,
        badges: ['needs-review'],
        totalPosts: 0,
        accuratePredictions: 0,
        communityUpvotes: 0,
        averageEngagement: 0,
        joinDate: new Date(),
        scoreHistory: [{ date: new Date(), score: 50, reason: 'New user' }],
        recentActivity: []
      };
      return newUserCredibility;
    }

    const accuracyRate = (userData.accuratePredictions / userData.totalPosts) * 100;
    const engagementRate = userData.totalUpvotes / Math.max(userData.totalPosts, 1);
    
    // Calculate weighted score based on all factors
    const overallScore = Math.min(
      (accuracyRate * 0.4) + 
      (engagementRate * 3) + 
      (userData.consistencyScore * 0.3) + 
      20, // Base score
      100
    );

    const credibility: UserCredibility = {
      userId,
      username: `User${userId}`,
      currentScore: Math.round(overallScore),
      badges: [],
      totalPosts: userData.totalPosts,
      accuratePredictions: userData.accuratePredictions,
      communityUpvotes: userData.totalUpvotes,
      averageEngagement: userData.averageEngagement,
      joinDate: userData.joinDate,
      scoreHistory: [
        { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), score: Math.round(overallScore - 5) },
        { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), score: Math.round(overallScore - 2) },
        { date: new Date(), score: Math.round(overallScore), reason: 'Latest calculation' }
      ],
      recentActivity: [
        { postId: 'post1', score: 85, outcome: 'correct', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        { postId: 'post2', score: 72, outcome: 'pending', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
      ]
    };

    // Determine badges
    credibility.badges = determineUserBadges(credibility);

    return credibility;
  }

  /**
   * Bulk update credibility scores for multiple users
   */
  async bulkUpdateCredibility(userIds: string[]): Promise<Map<string, UserCredibility>> {
    const results = new Map<string, UserCredibility>();
    
    for (const userId of userIds) {
      try {
        const credibility = await this.calculateUserCredibility(userId);
        results.set(userId, credibility);
      } catch (error) {
        console.error(`Failed to calculate credibility for user ${userId}:`, error);
      }
    }

    return results;
  }

  /**
   * Get filtered users based on credibility criteria
   */
  async getFilteredUsers(filter: {
    minScore?: number;
    maxScore?: number;
    requiredBadges?: BadgeType[];
    limit?: number;
  }): Promise<UserCredibility[]> {
    const allUserIds = Array.from(this.mockUserHistory.keys());
    const users: UserCredibility[] = [];

    for (const userId of allUserIds) {
      const credibility = await this.calculateUserCredibility(userId);
      
      // Apply filters
      if (filter.minScore && credibility.currentScore < filter.minScore) continue;
      if (filter.maxScore && credibility.currentScore > filter.maxScore) continue;
      if (filter.requiredBadges && !filter.requiredBadges.every(badge => credibility.badges.includes(badge))) continue;
      
      users.push(credibility);
    }

    // Sort by score descending
    users.sort((a, b) => b.currentScore - a.currentScore);
    
    return filter.limit ? users.slice(0, filter.limit) : users;
  }

  /**
   * Report a post for credibility review
   */
  async reportPost(postId: string, reason: string, reporterId: string): Promise<boolean> {
    // Mock implementation - would update post moderation status
    console.log(`Post ${postId} reported by ${reporterId} for: ${reason}`);
    return true;
  }

  /**
   * Get credibility analytics for admin dashboard
   */
  async getCredibilityAnalytics(): Promise<{
    averageScore: number;
    totalUsers: number;
    badgeDistribution: Record<BadgeType, number>;
    trendingUsers: UserCredibility[];
    flaggedPosts: number;
  }> {
    const allUserIds = Array.from(this.mockUserHistory.keys());
    const users = await Promise.all(allUserIds.map(id => this.calculateUserCredibility(id)));
    
    const averageScore = users.reduce((sum, user) => sum + user.currentScore, 0) / users.length;
    
    const badgeDistribution = {} as Record<BadgeType, number>;
    users.forEach(user => {
      user.badges.forEach(badge => {
        badgeDistribution[badge] = (badgeDistribution[badge] || 0) + 1;
      });
    });

    return {
      averageScore: Math.round(averageScore),
      totalUsers: users.length,
      badgeDistribution,
      trendingUsers: users.slice(0, 5), // Top 5 users
      flaggedPosts: Math.floor(Math.random() * 10) // Mock data
    };
  }
}

// Singleton instance
export const credibilityService = new CredibilityService();

// Export mock data generator for testing
export const generateMockPostData = (overrides: Partial<PostData> = {}): PostData => ({
  id: `post_${Date.now()}`,
  content: 'This is a sample trading post with technical analysis.',
  author: 'user1',
  sentiment: 'bullish',
  ticker: 'AAPL',
  timestamp: new Date(),
  upvotes: Math.floor(Math.random() * 50),
  downvotes: Math.floor(Math.random() * 10),
  comments: Math.floor(Math.random() * 20),
  hasChart: Math.random() > 0.5,
  hasSource: Math.random() > 0.6,
  hasData: Math.random() > 0.4,
  ...overrides
});
