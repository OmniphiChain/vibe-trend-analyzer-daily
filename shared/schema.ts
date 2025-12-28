import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  decimal,
  jsonb,
  varchar,
  uuid,
  index,
  uniqueIndex,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// ============================================================================
// CORE USER TABLES
// ============================================================================

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull().unique(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  avatar: text("avatar"),
  bio: text("bio"),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  credibilityScore: decimal("credibility_score", { precision: 5, scale: 2 }).default("0.00"),
  totalFollowers: integer("total_followers").default(0),
  totalFollowing: integer("total_following").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("users_email_idx").on(table.email),
  usernameIdx: index("users_username_idx").on(table.username),
  credibilityIdx: index("users_credibility_idx").on(table.credibilityScore),
}));

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  theme: varchar("theme", { length: 20 }).default("dark"),
  language: varchar("language", { length: 10 }).default("en"),
  timezone: varchar("timezone", { length: 50 }).default("UTC"),
  emailNotifications: boolean("email_notifications").default(true),
  pushNotifications: boolean("push_notifications").default(true),
  marketAlerts: boolean("market_alerts").default(true),
  socialNotifications: boolean("social_notifications").default(true),
  privacyLevel: varchar("privacy_level", { length: 20 }).default("public"), // public, friends, private
  showPortfolio: boolean("show_portfolio").default(false),
  showCredibility: boolean("show_credibility").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: uniqueIndex("user_preferences_user_id_idx").on(table.userId),
}));

export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  sessionToken: text("session_token").notNull().unique(),
  refreshToken: text("refresh_token").notNull().unique(),
  deviceInfo: jsonb("device_info"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  sessionTokenIdx: index("user_sessions_session_token_idx").on(table.sessionToken),
  userIdIdx: index("user_sessions_user_id_idx").on(table.userId),
}));

// ============================================================================
// WATCHLIST TABLES
// ============================================================================

export const watchlists = pgTable("watchlists", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull().unique(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  isPublic: boolean("is_public").default(false),
  isDefault: boolean("is_default").default(false),
  color: varchar("color", { length: 7 }).default("#3B82F6"), // hex color
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("watchlists_user_id_idx").on(table.userId),
  publicIdx: index("watchlists_public_idx").on(table.isPublic),
}));

export const watchlistAssets = pgTable("watchlist_assets", {
  id: serial("id").primaryKey(),
  watchlistId: integer("watchlist_id").references(() => watchlists.id, { onDelete: "cascade" }).notNull(),
  symbol: varchar("symbol", { length: 20 }).notNull(),
  assetType: varchar("asset_type", { length: 20 }).notNull(), // stock, crypto, forex, commodity
  addedPrice: decimal("added_price", { precision: 15, scale: 6 }),
  targetPrice: decimal("target_price", { precision: 15, scale: 6 }),
  stopLoss: decimal("stop_loss", { precision: 15, scale: 6 }),
  notes: text("notes"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  watchlistIdIdx: index("watchlist_assets_watchlist_id_idx").on(table.watchlistId),
  symbolIdx: index("watchlist_assets_symbol_idx").on(table.symbol),
  uniqueAsset: uniqueIndex("watchlist_assets_unique").on(table.watchlistId, table.symbol),
}));

// ============================================================================
// SOCIAL FEATURES
// ============================================================================

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull().unique(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  content: text("content").notNull(),
  symbols: jsonb("symbols"), // array of mentioned tickers
  sentiment: varchar("sentiment", { length: 20 }), // bullish, bearish, neutral
  sentimentScore: decimal("sentiment_score", { precision: 5, scale: 2 }),
  postType: varchar("post_type", { length: 20 }).default("text"), // text, image, poll, prediction
  metadata: jsonb("metadata"), // images, poll options, etc.
  isPublic: boolean("is_public").default(true),
  isPinned: boolean("is_pinned").default(false),
  totalLikes: integer("total_likes").default(0),
  totalComments: integer("total_comments").default(0),
  totalShares: integer("total_shares").default(0),
  totalBookmarks: integer("total_bookmarks").default(0),
  credibilityScore: decimal("credibility_score", { precision: 5, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("posts_user_id_idx").on(table.userId),
  createdAtIdx: index("posts_created_at_idx").on(table.createdAt),
  sentimentIdx: index("posts_sentiment_idx").on(table.sentiment),
  publicIdx: index("posts_public_idx").on(table.isPublic),
}));

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull().unique(),
  postId: integer("post_id").references(() => posts.id, { onDelete: "cascade" }).notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  parentId: integer("parent_id").references((): AnyPgColumn => comments.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  totalLikes: integer("total_likes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  postIdIdx: index("comments_post_id_idx").on(table.postId),
  userIdIdx: index("comments_user_id_idx").on(table.userId),
  parentIdIdx: index("comments_parent_id_idx").on(table.parentId),
}));

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  postId: integer("post_id").references(() => posts.id, { onDelete: "cascade" }),
  commentId: integer("comment_id").references(() => comments.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userPostIdx: uniqueIndex("likes_user_post_unique").on(table.userId, table.postId),
  userCommentIdx: uniqueIndex("likes_user_comment_unique").on(table.userId, table.commentId),
}));

export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  postId: integer("post_id").references(() => posts.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userPostIdx: uniqueIndex("bookmarks_user_post_unique").on(table.userId, table.postId),
}));

export const userFollows = pgTable("user_follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  followingId: integer("following_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueFollow: uniqueIndex("user_follows_unique").on(table.followerId, table.followingId),
  followerIdx: index("user_follows_follower_idx").on(table.followerId),
  followingIdx: index("user_follows_following_idx").on(table.followingId),
}));

// ============================================================================
// COMMUNITY ROOMS
// ============================================================================

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  creatorId: integer("creator_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  roomType: varchar("room_type", { length: 20 }).default("public"), // public, private, premium
  symbol: varchar("symbol", { length: 20 }), // associated ticker
  avatar: text("avatar"),
  memberCount: integer("member_count").default(0),
  isActive: boolean("is_active").default(true),
  settings: jsonb("settings"), // room rules, permissions, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  creatorIdx: index("rooms_creator_idx").on(table.creatorId),
  typeIdx: index("rooms_type_idx").on(table.roomType),
  symbolIdx: index("rooms_symbol_idx").on(table.symbol),
}));

export const roomMembers = pgTable("room_members", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").references(() => rooms.id, { onDelete: "cascade" }).notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  role: varchar("role", { length: 20 }).default("member"), // owner, admin, moderator, member
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
}, (table) => ({
  uniqueMember: uniqueIndex("room_members_unique").on(table.roomId, table.userId),
  roomIdx: index("room_members_room_idx").on(table.roomId),
  userIdx: index("room_members_user_idx").on(table.userId),
}));

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull().unique(),
  roomId: integer("room_id").references(() => rooms.id, { onDelete: "cascade" }).notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  content: text("content").notNull(),
  messageType: varchar("message_type", { length: 20 }).default("text"), // text, image, file, system
  metadata: jsonb("metadata"), // file info, mentions, etc.
  isEdited: boolean("is_edited").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  roomIdIdx: index("messages_room_id_idx").on(table.roomId),
  userIdIdx: index("messages_user_id_idx").on(table.userId),
  createdAtIdx: index("messages_created_at_idx").on(table.createdAt),
}));

// ============================================================================
// ALERTS & NOTIFICATIONS
// ============================================================================

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull().unique(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  symbol: varchar("symbol", { length: 20 }).notNull(),
  alertType: varchar("alert_type", { length: 30 }).notNull(), // price_above, price_below, volume_spike, sentiment_change
  condition: jsonb("condition").notNull(), // threshold values, conditions
  isActive: boolean("is_active").default(true),
  lastTriggered: timestamp("last_triggered"),
  triggerCount: integer("trigger_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("alerts_user_id_idx").on(table.userId),
  symbolIdx: index("alerts_symbol_idx").on(table.symbol),
  activeIdx: index("alerts_active_idx").on(table.isActive),
}));

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull().unique(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  type: varchar("type", { length: 30 }).notNull(), // alert, follow, like, comment, mention, system
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  data: jsonb("data"), // additional context data
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("notifications_user_id_idx").on(table.userId),
  typeIdx: index("notifications_type_idx").on(table.type),
  readIdx: index("notifications_read_idx").on(table.isRead),
  createdAtIdx: index("notifications_created_at_idx").on(table.createdAt),
}));

// ============================================================================
// INSIGHTS & PREDICTIONS
// ============================================================================

export const insights = pgTable("insights", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull().unique(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  symbol: varchar("symbol", { length: 20 }).notNull(),
  insightType: varchar("insight_type", { length: 30 }).notNull(), // prediction, analysis, recommendation
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  prediction: jsonb("prediction"), // price targets, timeframes, confidence
  sentiment: varchar("sentiment", { length: 20 }),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  isPublic: boolean("is_public").default(true),
  totalLikes: integer("total_likes").default(0),
  totalViews: integer("total_views").default(0),
  accuracyScore: decimal("accuracy_score", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("insights_user_id_idx").on(table.userId),
  symbolIdx: index("insights_symbol_idx").on(table.symbol),
  typeIdx: index("insights_type_idx").on(table.insightType),
  publicIdx: index("insights_public_idx").on(table.isPublic),
}));

// ============================================================================
// GAMIFICATION & CREDIBILITY
// ============================================================================

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: varchar("category", { length: 30 }).notNull(), // trading, social, accuracy, milestone
  rarity: varchar("rarity", { length: 20 }).default("common"), // common, rare, epic, legendary
  requirements: jsonb("requirements").notNull(), // conditions to earn badge
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  badgeId: integer("badge_id").references(() => badges.id, { onDelete: "cascade" }).notNull(),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
  progress: jsonb("progress"), // tracking progress towards badge
}, (table) => ({
  uniqueBadge: uniqueIndex("user_badges_unique").on(table.userId, table.badgeId),
  userIdx: index("user_badges_user_idx").on(table.userId),
}));

export const credibilityScores = pgTable("credibility_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  postId: integer("post_id").references(() => posts.id, { onDelete: "cascade" }),
  scoreType: varchar("score_type", { length: 30 }).notNull(), // accuracy, engagement, expertise
  score: decimal("score", { precision: 5, scale: 2 }).notNull(),
  reason: text("reason"),
  calculatedAt: timestamp("calculated_at").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("credibility_scores_user_idx").on(table.userId),
  postIdx: index("credibility_scores_post_idx").on(table.postId),
  typeIdx: index("credibility_scores_type_idx").on(table.scoreType),
}));

// ============================================================================
// MODERATION
// ============================================================================

export const postFlags = pgTable("post_flags", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => posts.id, { onDelete: "cascade" }).notNull(),
  reporterId: integer("reporter_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  reason: varchar("reason", { length: 50 }).notNull(), // spam, harassment, misinformation, etc.
  description: text("description"),
  status: varchar("status", { length: 20 }).default("pending"), // pending, reviewed, resolved, dismissed
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  postIdx: index("post_flags_post_idx").on(table.postId),
  statusIdx: index("post_flags_status_idx").on(table.status),
}));

export const moderationActions = pgTable("moderation_actions", {
  id: serial("id").primaryKey(),
  moderatorId: integer("moderator_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  targetType: varchar("target_type", { length: 20 }).notNull(), // post, comment, user
  targetId: integer("target_id").notNull(),
  action: varchar("action", { length: 30 }).notNull(), // warn, hide, delete, ban, suspend
  reason: text("reason").notNull(),
  duration: integer("duration"), // in hours for temporary actions
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  moderatorIdx: index("moderation_actions_moderator_idx").on(table.moderatorId),
  targetIdx: index("moderation_actions_target_idx").on(table.targetType, table.targetId),
}));

// ============================================================================
// SCHEMA EXPORTS & RELATIONS
// ============================================================================

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  uuid: true, 
  createdAt: true, 
  updatedAt: true,
  credibilityScore: true,
  totalFollowers: true,
  totalFollowing: true
});

export const selectUserSchema = createSelectSchema(users);
export const insertWatchlistSchema = createInsertSchema(watchlists).omit({ id: true, uuid: true, createdAt: true, updatedAt: true });
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, uuid: true, createdAt: true, updatedAt: true, totalLikes: true, totalComments: true, totalShares: true, totalBookmarks: true, credibilityScore: true });

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWatchlist = z.infer<typeof insertWatchlistSchema>;
export type Watchlist = typeof watchlists.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;
