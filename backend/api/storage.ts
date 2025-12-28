import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and, desc, asc, count, sql } from "drizzle-orm";
import { 
  users, 
  userPreferences,
  userSessions,
  watchlists,
  watchlistAssets,
  posts,
  comments,
  likes,
  bookmarks,
  userFollows,
  rooms,
  roomMembers,
  messages,
  alerts,
  notifications,
  insights,
  badges,
  userBadges,
  credibilityScores,
  postFlags,
  moderationActions,
  type User, 
  type InsertUser,
  type Watchlist,
  type InsertWatchlist,
  type Post,
  type InsertPost
} from "../../shared/schema";

// ============================================================================
// STORAGE INTERFACES
// ============================================================================

export interface IUserStorage {
  // User CRUD
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // User preferences
  getUserPreferences(userId: number): Promise<any>;
  updateUserPreferences(userId: number, preferences: any): Promise<any>;
  
  // User stats
  getUserStats(userId: number): Promise<any>;
}

export interface IWatchlistStorage {
  getUserWatchlists(userId: number): Promise<Watchlist[]>;
  createWatchlist(watchlist: InsertWatchlist): Promise<Watchlist>;
  updateWatchlist(id: number, updates: Partial<Watchlist>): Promise<Watchlist | undefined>;
  deleteWatchlist(id: number): Promise<boolean>;
  addAssetToWatchlist(watchlistId: number, asset: any): Promise<any>;
  removeAssetFromWatchlist(watchlistId: number, assetId: number): Promise<boolean>;
}

export interface ISocialStorage {
  // Posts
  getPosts(filters?: any): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, updates: Partial<Post>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  
  // Likes & Bookmarks
  likePost(userId: number, postId: number): Promise<boolean>;
  unlikePost(userId: number, postId: number): Promise<boolean>;
  bookmarkPost(userId: number, postId: number): Promise<boolean>;
  unbookmarkPost(userId: number, postId: number): Promise<boolean>;
  
  // Comments
  getPostComments(postId: number): Promise<any[]>;
  createComment(comment: any): Promise<any>;
  
  // Follows
  followUser(followerId: number, followingId: number): Promise<boolean>;
  unfollowUser(followerId: number, followingId: number): Promise<boolean>;
  getUserFollowers(userId: number): Promise<User[]>;
  getUserFollowing(userId: number): Promise<User[]>;
}

export interface IRoomStorage {
  getRooms(filters?: any): Promise<any[]>;
  getRoom(id: number): Promise<any>;
  createRoom(room: any): Promise<any>;
  updateRoom(id: number, updates: any): Promise<any>;
  deleteRoom(id: number): Promise<boolean>;
  joinRoom(roomId: number, userId: number, role?: string): Promise<boolean>;
  leaveRoom(roomId: number, userId: number): Promise<boolean>;
  getRoomMessages(roomId: number, limit?: number, before?: Date): Promise<any[]>;
  createMessage(message: any): Promise<any>;
  updateMessage(id: number, content: string): Promise<any>;
  deleteMessage(id: number): Promise<boolean>;
  getRoomMembers(roomId: number): Promise<any[]>;
  updateRoomMemberRole(roomId: number, userId: number, role: string): Promise<boolean>;
}

export interface IAlertStorage {
  getUserAlerts(userId: number): Promise<any[]>;
  createAlert(alert: any): Promise<any>;
  updateAlert(id: number, updates: any): Promise<any>;
  deleteAlert(id: number): Promise<boolean>;
  triggerAlert(alertId: number): Promise<boolean>;
  getUserNotifications(userId: number, limit?: number): Promise<any[]>;
  createNotification(notification: any): Promise<any>;
  markNotificationAsRead(id: number): Promise<boolean>;
  markAllNotificationsAsRead(userId: number): Promise<boolean>;
  getUnreadNotificationCount(userId: number): Promise<number>;
}

export interface IInsightStorage {
  getUserInsights(userId: number, filters?: any): Promise<any[]>;
  getPublicInsights(filters?: any): Promise<any[]>;
  createInsight(insight: any): Promise<any>;
  updateInsight(id: number, updates: any): Promise<any>;
  deleteInsight(id: number): Promise<boolean>;
  incrementInsightViews(id: number): Promise<boolean>;
}

export interface IBadgeStorage {
  getAllBadges(): Promise<any[]>;
  getUserBadges(userId: number): Promise<any[]>;
  awardBadge(userId: number, badgeId: number, progress?: any): Promise<any>;
}

export interface IModerationStorage {
  createPostFlag(flag: any): Promise<any>;
  getPostFlags(filters?: any): Promise<any[]>;
  updatePostFlagStatus(id: number, status: string): Promise<any>;
  createModerationAction(action: any): Promise<any>;
  getModerationActions(filters?: any): Promise<any[]>;
}

export interface ISearchStorage {
  searchUsers(query: string, limit?: number): Promise<any[]>;
  searchPosts(query: string, limit?: number): Promise<any[]>;
  searchInsights(query: string, limit?: number): Promise<any[]>;
}

// Combined storage interface
export interface IStorage extends 
  IUserStorage, 
  IWatchlistStorage, 
  ISocialStorage, 
  IRoomStorage, 
  IAlertStorage,
  IInsightStorage,
  IBadgeStorage,
  IModerationStorage,
  ISearchStorage {}

// ============================================================================
// POSTGRESQL STORAGE IMPLEMENTATION
// ============================================================================

export class PostgresStorage implements IStorage {
  private db;

  constructor(databaseUrl: string) {
    const sql = neon(databaseUrl);
    this.db = drizzle(sql);
  }

  // ============================================================================
  // USER METHODS
  // ============================================================================

  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db
      .insert(users)
      .values(insertUser)
      .returning();
    return result[0]!;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const result = await this.db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.db
      .delete(users)
      .where(eq(users.id, id));
    return result.rowCount > 0;
  }

  async getUserPreferences(userId: number): Promise<any> {
    const result = await this.db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);
    return result[0];
  }

  async updateUserPreferences(userId: number, preferences: any): Promise<any> {
    const existing = await this.getUserPreferences(userId);
    
    if (existing) {
      const result = await this.db
        .update(userPreferences)
        .set({ ...preferences, updatedAt: new Date() })
        .where(eq(userPreferences.userId, userId))
        .returning();
      return result[0];
    } else {
      const result = await this.db
        .insert(userPreferences)
        .values({ userId, ...preferences })
        .returning();
      return result[0];
    }
  }

  async getUserStats(userId: number): Promise<any> {
    // Get user stats with aggregated data
    const [user] = await this.db
      .select({
        id: users.id,
        username: users.username,
        credibilityScore: users.credibilityScore,
        totalFollowers: users.totalFollowers,
        totalFollowing: users.totalFollowing,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) return null;

    // Get post count
    const [postCount] = await this.db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.userId, userId));

    // Get total likes received
    const [likesReceived] = await this.db
      .select({ count: count() })
      .from(likes)
      .innerJoin(posts, eq(likes.postId, posts.id))
      .where(eq(posts.userId, userId));

    return {
      ...user,
      totalPosts: postCount.count,
      totalLikesReceived: likesReceived.count,
    };
  }

  // ============================================================================
  // WATCHLIST METHODS
  // ============================================================================

  async getUserWatchlists(userId: number): Promise<Watchlist[]> {
    return await this.db
      .select()
      .from(watchlists)
      .where(eq(watchlists.userId, userId))
      .orderBy(asc(watchlists.sortOrder), desc(watchlists.createdAt));
  }

  async createWatchlist(watchlist: InsertWatchlist): Promise<Watchlist> {
    const result = await this.db
      .insert(watchlists)
      .values(watchlist)
      .returning();
    return result[0]!;
  }

  async updateWatchlist(id: number, updates: Partial<Watchlist>): Promise<Watchlist | undefined> {
    const result = await this.db
      .update(watchlists)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(watchlists.id, id))
      .returning();
    return result[0];
  }

  async deleteWatchlist(id: number): Promise<boolean> {
    const result = await this.db
      .delete(watchlists)
      .where(eq(watchlists.id, id));
    return result.rowCount > 0;
  }

  async addAssetToWatchlist(watchlistId: number, asset: any): Promise<any> {
    const result = await this.db
      .insert(watchlistAssets)
      .values({ watchlistId, ...asset })
      .returning();
    return result[0];
  }

  async removeAssetFromWatchlist(watchlistId: number, assetId: number): Promise<boolean> {
    const result = await this.db
      .delete(watchlistAssets)
      .where(and(
        eq(watchlistAssets.watchlistId, watchlistId),
        eq(watchlistAssets.id, assetId)
      ));
    return result.rowCount > 0;
  }

  // ============================================================================
  // SOCIAL METHODS
  // ============================================================================

  async getPosts(filters: any = {}): Promise<Post[]> {
    let query = this.db.select().from(posts);
    
    if (filters.userId) {
      query = query.where(eq(posts.userId, filters.userId));
    }
    
    if (filters.isPublic !== undefined) {
      query = query.where(eq(posts.isPublic, filters.isPublic));
    }

    return await query
      .orderBy(desc(posts.createdAt))
      .limit(filters.limit || 50);
  }

  async getPost(id: number): Promise<Post | undefined> {
    const result = await this.db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);
    return result[0];
  }

  async createPost(post: InsertPost): Promise<Post> {
    const result = await this.db
      .insert(posts)
      .values(post)
      .returning();
    return result[0]!;
  }

  async updatePost(id: number, updates: Partial<Post>): Promise<Post | undefined> {
    const result = await this.db
      .update(posts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return result[0];
  }

  async deletePost(id: number): Promise<boolean> {
    const result = await this.db
      .delete(posts)
      .where(eq(posts.id, id));
    return result.rowCount > 0;
  }

  async likePost(userId: number, postId: number): Promise<boolean> {
    try {
      await this.db.insert(likes).values({ userId, postId });
      
      // Update post like count
      await this.db
        .update(posts)
        .set({ 
          totalLikes: sql`${posts.totalLikes} + 1`,
          updatedAt: new Date()
        })
        .where(eq(posts.id, postId));
      
      return true;
    } catch (error) {
      return false; // Already liked or error
    }
  }

  async unlikePost(userId: number, postId: number): Promise<boolean> {
    const result = await this.db
      .delete(likes)
      .where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
    
    if (result.rowCount > 0) {
      // Update post like count
      await this.db
        .update(posts)
        .set({ 
          totalLikes: sql`${posts.totalLikes} - 1`,
          updatedAt: new Date()
        })
        .where(eq(posts.id, postId));
      
      return true;
    }
    return false;
  }

  async bookmarkPost(userId: number, postId: number): Promise<boolean> {
    try {
      await this.db.insert(bookmarks).values({ userId, postId });
      return true;
    } catch (error) {
      return false; // Already bookmarked or error
    }
  }

  async unbookmarkPost(userId: number, postId: number): Promise<boolean> {
    const result = await this.db
      .delete(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.postId, postId)));
    return result.rowCount > 0;
  }

  async getPostComments(postId: number): Promise<any[]> {
    return await this.db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        user: {
          id: users.id,
          username: users.username,
          avatar: users.avatar,
        }
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(asc(comments.createdAt));
  }

  async createComment(comment: any): Promise<any> {
    const result = await this.db
      .insert(comments)
      .values(comment)
      .returning();
    
    // Update post comment count
    await this.db
      .update(posts)
      .set({ 
        totalComments: sql`${posts.totalComments} + 1`,
        updatedAt: new Date()
      })
      .where(eq(posts.id, comment.postId));
    
    return result[0];
  }

  async followUser(followerId: number, followingId: number): Promise<boolean> {
    try {
      await this.db.insert(userFollows).values({ followerId, followingId });
      
      // Update follower counts
      await this.db
        .update(users)
        .set({ totalFollowing: sql`${users.totalFollowing} + 1` })
        .where(eq(users.id, followerId));
      
      await this.db
        .update(users)
        .set({ totalFollowers: sql`${users.totalFollowers} + 1` })
        .where(eq(users.id, followingId));
      
      return true;
    } catch (error) {
      return false; // Already following or error
    }
  }

  async unfollowUser(followerId: number, followingId: number): Promise<boolean> {
    const result = await this.db
      .delete(userFollows)
      .where(and(
        eq(userFollows.followerId, followerId),
        eq(userFollows.followingId, followingId)
      ));
    
    if (result.rowCount > 0) {
      // Update follower counts
      await this.db
        .update(users)
        .set({ totalFollowing: sql`${users.totalFollowing} - 1` })
        .where(eq(users.id, followerId));
      
      await this.db
        .update(users)
        .set({ totalFollowers: sql`${users.totalFollowers} - 1` })
        .where(eq(users.id, followingId));
      
      return true;
    }
    return false;
  }

  async getUserFollowers(userId: number): Promise<User[]> {
    return await this.db
      .select({
        id: users.id,
        username: users.username,
        avatar: users.avatar,
        credibilityScore: users.credibilityScore,
      })
      .from(userFollows)
      .innerJoin(users, eq(userFollows.followerId, users.id))
      .where(eq(userFollows.followingId, userId));
  }

  async getUserFollowing(userId: number): Promise<User[]> {
    return await this.db
      .select({
        id: users.id,
        username: users.username,
        avatar: users.avatar,
        credibilityScore: users.credibilityScore,
      })
      .from(userFollows)
      .innerJoin(users, eq(userFollows.followingId, users.id))
      .where(eq(userFollows.followerId, userId));
  }

  // ============================================================================
  // ROOM METHODS (Full Implementation)
  // ============================================================================

  async getRooms(filters: any = {}): Promise<any[]> {
    let query = this.db
      .select({
        id: rooms.id,
        uuid: rooms.uuid,
        name: rooms.name,
        description: rooms.description,
        roomType: rooms.roomType,
        symbol: rooms.symbol,
        avatar: rooms.avatar,
        memberCount: rooms.memberCount,
        isActive: rooms.isActive,
        createdAt: rooms.createdAt,
        creator: {
          id: users.id,
          username: users.username,
          avatar: users.avatar,
        }
      })
      .from(rooms)
      .innerJoin(users, eq(rooms.creatorId, users.id));

    if (filters.roomType) {
      query = query.where(eq(rooms.roomType, filters.roomType));
    }

    if (filters.symbol) {
      query = query.where(eq(rooms.symbol, filters.symbol));
    }

    if (filters.isActive !== undefined) {
      query = query.where(eq(rooms.isActive, filters.isActive));
    }

    return await query
      .orderBy(desc(rooms.memberCount), desc(rooms.createdAt))
      .limit(filters.limit || 50);
  }

  async getRoom(id: number): Promise<any> {
    const result = await this.db
      .select({
        id: rooms.id,
        uuid: rooms.uuid,
        name: rooms.name,
        description: rooms.description,
        roomType: rooms.roomType,
        symbol: rooms.symbol,
        avatar: rooms.avatar,
        memberCount: rooms.memberCount,
        isActive: rooms.isActive,
        settings: rooms.settings,
        createdAt: rooms.createdAt,
        updatedAt: rooms.updatedAt,
        creator: {
          id: users.id,
          username: users.username,
          avatar: users.avatar,
        }
      })
      .from(rooms)
      .innerJoin(users, eq(rooms.creatorId, users.id))
      .where(eq(rooms.id, id))
      .limit(1);
    return result[0];
  }

  async createRoom(room: any): Promise<any> {
    const result = await this.db.insert(rooms).values(room).returning();
    
    // Auto-join creator as owner
    if (result[0]) {
      await this.db.insert(roomMembers).values({
        roomId: result[0].id,
        userId: room.creatorId,
        role: 'owner'
      });
    }
    
    return result[0];
  }

  async updateRoom(id: number, updates: any): Promise<any> {
    const result = await this.db
      .update(rooms)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(rooms.id, id))
      .returning();
    return result[0];
  }

  async deleteRoom(id: number): Promise<boolean> {
    const result = await this.db.delete(rooms).where(eq(rooms.id, id));
    return result.rowCount > 0;
  }

  async joinRoom(roomId: number, userId: number, role: string = 'member'): Promise<boolean> {
    try {
      await this.db.insert(roomMembers).values({ roomId, userId, role });
      
      // Update member count
      await this.db
        .update(rooms)
        .set({ memberCount: sql`${rooms.memberCount} + 1` })
        .where(eq(rooms.id, roomId));
      
      return true;
    } catch (error) {
      return false; // Already a member or error
    }
  }

  async leaveRoom(roomId: number, userId: number): Promise<boolean> {
    const result = await this.db
      .delete(roomMembers)
      .where(and(eq(roomMembers.roomId, roomId), eq(roomMembers.userId, userId)));
    
    if (result.rowCount > 0) {
      // Update member count
      await this.db
        .update(rooms)
        .set({ memberCount: sql`${rooms.memberCount} - 1` })
        .where(eq(rooms.id, roomId));
      
      return true;
    }
    return false;
  }

  async getRoomMembers(roomId: number): Promise<any[]> {
    return await this.db
      .select({
        id: roomMembers.id,
        role: roomMembers.role,
        joinedAt: roomMembers.joinedAt,
        lastActiveAt: roomMembers.lastActiveAt,
        user: {
          id: users.id,
          username: users.username,
          avatar: users.avatar,
          credibilityScore: users.credibilityScore,
        }
      })
      .from(roomMembers)
      .innerJoin(users, eq(roomMembers.userId, users.id))
      .where(eq(roomMembers.roomId, roomId))
      .orderBy(asc(roomMembers.joinedAt));
  }

  async updateRoomMemberRole(roomId: number, userId: number, role: string): Promise<boolean> {
    const result = await this.db
      .update(roomMembers)
      .set({ role })
      .where(and(eq(roomMembers.roomId, roomId), eq(roomMembers.userId, userId)));
    return result.rowCount > 0;
  }

  async getRoomMessages(roomId: number, limit: number = 50, before?: Date): Promise<any[]> {
    let query = this.db
      .select({
        id: messages.id,
        uuid: messages.uuid,
        content: messages.content,
        messageType: messages.messageType,
        metadata: messages.metadata,
        isEdited: messages.isEdited,
        createdAt: messages.createdAt,
        updatedAt: messages.updatedAt,
        user: {
          id: users.id,
          username: users.username,
          avatar: users.avatar,
        }
      })
      .from(messages)
      .innerJoin(users, eq(messages.userId, users.id))
      .where(eq(messages.roomId, roomId));

    if (before) {
      query = query.where(and(eq(messages.roomId, roomId), sql`${messages.createdAt} < ${before}`));
    }

    return await query
      .orderBy(desc(messages.createdAt))
      .limit(limit);
  }

  async createMessage(message: any): Promise<any> {
    const result = await this.db.insert(messages).values(message).returning();
    
    // Update member's last active time
    await this.db
      .update(roomMembers)
      .set({ lastActiveAt: new Date() })
      .where(and(
        eq(roomMembers.roomId, message.roomId),
        eq(roomMembers.userId, message.userId)
      ));
    
    return result[0];
  }

  async updateMessage(id: number, content: string): Promise<any> {
    const result = await this.db
      .update(messages)
      .set({ content, isEdited: true, updatedAt: new Date() })
      .where(eq(messages.id, id))
      .returning();
    return result[0];
  }

  async deleteMessage(id: number): Promise<boolean> {
    const result = await this.db.delete(messages).where(eq(messages.id, id));
    return result.rowCount > 0;
  }

  // ============================================================================
  // ALERTS & NOTIFICATIONS METHODS (Full Implementation)
  // ============================================================================

  async getUserAlerts(userId: number): Promise<any[]> {
    return await this.db
      .select()
      .from(alerts)
      .where(eq(alerts.userId, userId))
      .orderBy(desc(alerts.createdAt));
  }

  async createAlert(alert: any): Promise<any> {
    const result = await this.db.insert(alerts).values(alert).returning();
    return result[0];
  }

  async updateAlert(id: number, updates: any): Promise<any> {
    const result = await this.db
      .update(alerts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(alerts.id, id))
      .returning();
    return result[0];
  }

  async deleteAlert(id: number): Promise<boolean> {
    const result = await this.db.delete(alerts).where(eq(alerts.id, id));
    return result.rowCount > 0;
  }

  async triggerAlert(alertId: number): Promise<boolean> {
    const result = await this.db
      .update(alerts)
      .set({ 
        lastTriggered: new Date(),
        triggerCount: sql`${alerts.triggerCount} + 1`
      })
      .where(eq(alerts.id, alertId));
    return result.rowCount > 0;
  }

  async getUserNotifications(userId: number, limit: number = 50): Promise<any[]> {
    return await this.db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  }

  async createNotification(notification: any): Promise<any> {
    const result = await this.db.insert(notifications).values(notification).returning();
    return result[0];
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const result = await this.db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
    return result.rowCount > 0;
  }

  async markAllNotificationsAsRead(userId: number): Promise<boolean> {
    const result = await this.db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    return result.rowCount > 0;
  }

  async getUnreadNotificationCount(userId: number): Promise<number> {
    const result = await this.db
      .select({ count: count() })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    return result[0]?.count || 0;
  }

  // ============================================================================
  // INSIGHTS & PREDICTIONS METHODS
  // ============================================================================

  async getUserInsights(userId: number, filters: any = {}): Promise<any[]> {
    let query = this.db.select().from(insights).where(eq(insights.userId, userId));

    if (filters.symbol) {
      query = query.where(eq(insights.symbol, filters.symbol));
    }

    if (filters.insightType) {
      query = query.where(eq(insights.insightType, filters.insightType));
    }

    if (filters.isPublic !== undefined) {
      query = query.where(eq(insights.isPublic, filters.isPublic));
    }

    return await query
      .orderBy(desc(insights.createdAt))
      .limit(filters.limit || 50);
  }

  async getPublicInsights(filters: any = {}): Promise<any[]> {
    let query = this.db
      .select({
        id: insights.id,
        uuid: insights.uuid,
        symbol: insights.symbol,
        insightType: insights.insightType,
        title: insights.title,
        content: insights.content,
        prediction: insights.prediction,
        sentiment: insights.sentiment,
        confidence: insights.confidence,
        totalLikes: insights.totalLikes,
        totalViews: insights.totalViews,
        accuracyScore: insights.accuracyScore,
        createdAt: insights.createdAt,
        user: {
          id: users.id,
          username: users.username,
          avatar: users.avatar,
          credibilityScore: users.credibilityScore,
        }
      })
      .from(insights)
      .innerJoin(users, eq(insights.userId, users.id))
      .where(eq(insights.isPublic, true));

    if (filters.symbol) {
      query = query.where(eq(insights.symbol, filters.symbol));
    }

    if (filters.insightType) {
      query = query.where(eq(insights.insightType, filters.insightType));
    }

    return await query
      .orderBy(desc(insights.createdAt))
      .limit(filters.limit || 50);
  }

  async createInsight(insight: any): Promise<any> {
    const result = await this.db.insert(insights).values(insight).returning();
    return result[0];
  }

  async updateInsight(id: number, updates: any): Promise<any> {
    const result = await this.db
      .update(insights)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(insights.id, id))
      .returning();
    return result[0];
  }

  async deleteInsight(id: number): Promise<boolean> {
    const result = await this.db.delete(insights).where(eq(insights.id, id));
    return result.rowCount > 0;
  }

  async incrementInsightViews(id: number): Promise<boolean> {
    const result = await this.db
      .update(insights)
      .set({ totalViews: sql`${insights.totalViews} + 1` })
      .where(eq(insights.id, id));
    return result.rowCount > 0;
  }

  // ============================================================================
  // BADGES & GAMIFICATION METHODS
  // ============================================================================

  async getAllBadges(): Promise<any[]> {
    return await this.db
      .select()
      .from(badges)
      .where(eq(badges.isActive, true))
      .orderBy(asc(badges.category), asc(badges.name));
  }

  async getUserBadges(userId: number): Promise<any[]> {
    return await this.db
      .select({
        id: userBadges.id,
        earnedAt: userBadges.earnedAt,
        progress: userBadges.progress,
        badge: {
          id: badges.id,
          name: badges.name,
          description: badges.description,
          icon: badges.icon,
          category: badges.category,
          rarity: badges.rarity,
        }
      })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId))
      .orderBy(desc(userBadges.earnedAt));
  }

  async awardBadge(userId: number, badgeId: number, progress?: any): Promise<any> {
    try {
      const result = await this.db
        .insert(userBadges)
        .values({ userId, badgeId, progress })
        .returning();
      return result[0];
    } catch (error) {
      return null; // Badge already awarded or error
    }
  }

  // ============================================================================
  // MODERATION METHODS
  // ============================================================================

  async createPostFlag(flag: any): Promise<any> {
    const result = await this.db.insert(postFlags).values(flag).returning();
    return result[0];
  }

  async getPostFlags(filters: any = {}): Promise<any[]> {
    let query = this.db
      .select({
        id: postFlags.id,
        reason: postFlags.reason,
        description: postFlags.description,
        status: postFlags.status,
        createdAt: postFlags.createdAt,
        post: {
          id: posts.id,
          content: posts.content,
          createdAt: posts.createdAt,
        },
        reporter: {
          id: users.id,
          username: users.username,
        }
      })
      .from(postFlags)
      .innerJoin(posts, eq(postFlags.postId, posts.id))
      .innerJoin(users, eq(postFlags.reporterId, users.id));

    if (filters.status) {
      query = query.where(eq(postFlags.status, filters.status));
    }

    return await query
      .orderBy(desc(postFlags.createdAt))
      .limit(filters.limit || 50);
  }

  async updatePostFlagStatus(id: number, status: string): Promise<any> {
    const result = await this.db
      .update(postFlags)
      .set({ status })
      .where(eq(postFlags.id, id))
      .returning();
    return result[0];
  }

  async createModerationAction(action: any): Promise<any> {
    const result = await this.db.insert(moderationActions).values(action).returning();
    return result[0];
  }

  async getModerationActions(filters: any = {}): Promise<any[]> {
    let query = this.db
      .select({
        id: moderationActions.id,
        targetType: moderationActions.targetType,
        targetId: moderationActions.targetId,
        action: moderationActions.action,
        reason: moderationActions.reason,
        duration: moderationActions.duration,
        createdAt: moderationActions.createdAt,
        moderator: {
          id: users.id,
          username: users.username,
        }
      })
      .from(moderationActions)
      .innerJoin(users, eq(moderationActions.moderatorId, users.id));

    if (filters.targetType) {
      query = query.where(eq(moderationActions.targetType, filters.targetType));
    }

    if (filters.moderatorId) {
      query = query.where(eq(moderationActions.moderatorId, filters.moderatorId));
    }

    return await query
      .orderBy(desc(moderationActions.createdAt))
      .limit(filters.limit || 50);
  }

  // ============================================================================
  // SEARCH METHODS
  // ============================================================================

  async searchUsers(query: string, limit: number = 20): Promise<any[]> {
    return await this.db
      .select({
        id: users.id,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        avatar: users.avatar,
        bio: users.bio,
        credibilityScore: users.credibilityScore,
        totalFollowers: users.totalFollowers,
        isVerified: users.isVerified,
      })
      .from(users)
      .where(
        sql`${users.username} ILIKE ${`%${query}%`} OR 
            ${users.firstName} ILIKE ${`%${query}%`} OR 
            ${users.lastName} ILIKE ${`%${query}%`}`
      )
      .orderBy(desc(users.credibilityScore), desc(users.totalFollowers))
      .limit(limit);
  }

  async searchPosts(query: string, limit: number = 50): Promise<any[]> {
    return await this.db
      .select({
        id: posts.id,
        uuid: posts.uuid,
        content: posts.content,
        symbols: posts.symbols,
        sentiment: posts.sentiment,
        totalLikes: posts.totalLikes,
        totalComments: posts.totalComments,
        createdAt: posts.createdAt,
        user: {
          id: users.id,
          username: users.username,
          avatar: users.avatar,
        }
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .where(
        and(
          eq(posts.isPublic, true),
          sql`${posts.content} ILIKE ${`%${query}%`}`
        )
      )
      .orderBy(desc(posts.createdAt))
      .limit(limit);
  }

  async searchInsights(query: string, limit: number = 50): Promise<any[]> {
    return await this.db
      .select({
        id: insights.id,
        uuid: insights.uuid,
        symbol: insights.symbol,
        title: insights.title,
        content: insights.content,
        sentiment: insights.sentiment,
        confidence: insights.confidence,
        totalLikes: insights.totalLikes,
        totalViews: insights.totalViews,
        createdAt: insights.createdAt,
        user: {
          id: users.id,
          username: users.username,
          avatar: users.avatar,
          credibilityScore: users.credibilityScore,
        }
      })
      .from(insights)
      .innerJoin(users, eq(insights.userId, users.id))
      .where(
        and(
          eq(insights.isPublic, true),
          sql`${insights.title} ILIKE ${`%${query}%`} OR 
              ${insights.content} ILIKE ${`%${query}%`} OR
              ${insights.symbol} ILIKE ${`%${query}%`}`
        )
      )
      .orderBy(desc(insights.createdAt))
      .limit(limit);
  }
}

// In-Memory Storage (Fallback for development)
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

// Initialize storage based on environment
function initializeStorage(): IStorage {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl) {
    console.log("✅ Using PostgreSQL database");
    return new PostgresStorage(databaseUrl);
  } else {
    console.warn("⚠️  DATABASE_URL not found, using in-memory storage (data will be lost on restart)");
    return new MemStorage();
  }
}

export const storage = initializeStorage();
