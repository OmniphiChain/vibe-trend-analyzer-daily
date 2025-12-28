import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from 'ws';
import { 
  authService, 
  requireAuth, 
  optionalAuth, 
  rateLimit, 
  validateInput, 
  authSchemas,
  securityHeaders,
  type AuthenticatedRequest 
} from "./auth";
import { storage } from "./storage";
import { insertUserSchema } from "../../shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ============================================================================
  // MIDDLEWARE SETUP
  // ============================================================================
  
  // Apply security headers to all routes
  app.use(securityHeaders);
  
  // Rate limiting for auth endpoints
  const authRateLimit = rateLimit(5, 15 * 60 * 1000); // 5 requests per 15 minutes
  const generalRateLimit = rateLimit(100, 15 * 60 * 1000); // 100 requests per 15 minutes
  
  // ============================================================================
  // HEALTH & STATUS
  // ============================================================================
  
  app.get("/api/health", async (req, res) => {
    try {
      // Test database connection
      const testUser = await storage.getUser(1);
      res.json({
        status: "healthy",
        database: process.env.DATABASE_URL ? "connected" : "in-memory",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
      });
    } catch (error) {
      res.status(500).json({
        status: "unhealthy",
        database: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.get("/api/ready", (req, res) => {
    res.json({ status: "ready", timestamp: new Date().toISOString() });
  });

  // ============================================================================
  // 🔴 CRITICAL: AUTHENTICATION API
  // ============================================================================

  // POST /api/auth/signup
  app.post("/api/auth/signup", 
    authRateLimit,
    validateInput(authSchemas.signup),
    async (req, res) => {
      try {
        const { username, email, password, firstName, lastName } = req.body;

        // Check if user already exists
        const existingUser = await storage.getUserByUsername(username);
        if (existingUser) {
          return res.status(409).json({
            error: "user_exists",
            message: "Username already taken"
          });
        }

        const existingEmail = await storage.getUserByEmail(email);
        if (existingEmail) {
          return res.status(409).json({
            error: "email_exists", 
            message: "Email already registered"
          });
        }

        // Hash password and create user
        const hashedPassword = await authService.hashPassword(password);
        const newUser = await storage.createUser({
          username,
          email,
          password: hashedPassword,
          firstName,
          lastName
        });

        // Generate tokens
        const tokens = authService.generateTokenPair(newUser);

        // Return user data (without password) and tokens
        const { password: _, ...userWithoutPassword } = newUser;
        
        res.status(201).json({
          user: userWithoutPassword,
          ...tokens
        });
      } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
          error: "internal_error",
          message: "Failed to create account"
        });
      }
    }
  );

  // POST /api/auth/login
  app.post("/api/auth/login",
    authRateLimit,
    validateInput(authSchemas.login),
    async (req, res) => {
      try {
        const { username, password } = req.body;

        // Find user by username or email
        let user = await storage.getUserByUsername(username);
        if (!user) {
          user = await storage.getUserByEmail(username);
        }

        if (!user) {
          return res.status(401).json({
            error: "invalid_credentials",
            message: "Invalid username or password"
          });
        }

        // Verify password
        const isValidPassword = await authService.verifyPassword(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({
            error: "invalid_credentials",
            message: "Invalid username or password"
          });
        }

        // Check if user is active
        if (!user.isActive) {
          return res.status(403).json({
            error: "account_disabled",
            message: "Account has been disabled"
          });
        }

        // Generate tokens
        const tokens = authService.generateTokenPair(user);

        // Return user data (without password) and tokens
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({
          user: userWithoutPassword,
          ...tokens
        });
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
          error: "internal_error",
          message: "Login failed"
        });
      }
    }
  );

  // POST /api/auth/refresh
  app.post("/api/auth/refresh", authRateLimit, async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          error: "missing_token",
          message: "Refresh token required"
        });
      }

      // Verify refresh token
      const decoded = authService.verifyRefreshToken(refreshToken);
      if (!decoded) {
        return res.status(401).json({
          error: "invalid_token",
          message: "Invalid or expired refresh token"
        });
      }

      // Get current user data
      const user = await storage.getUser(decoded.userId);
      if (!user || !user.isActive) {
        return res.status(401).json({
          error: "user_not_found",
          message: "User not found or inactive"
        });
      }

      // Generate new tokens
      const tokens = authService.generateTokenPair(user);

      res.json(tokens);
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Token refresh failed"
      });
    }
  });

  // POST /api/auth/logout
  app.post("/api/auth/logout", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      // In a production app, you'd invalidate the token in a blacklist/database
      // For now, we'll just return success (client should delete the token)
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Logout failed"
      });
    }
  });

  // POST /api/auth/reset-password
  app.post("/api/auth/reset-password",
    authRateLimit,
    validateInput(authSchemas.resetPassword),
    async (req, res) => {
      try {
        const { email } = req.body;

        // Check if user exists
        const user = await storage.getUserByEmail(email);
        if (!user) {
          // Don't reveal if email exists or not for security
          return res.json({
            message: "If the email exists, a reset link has been sent"
          });
        }

        // TODO: Implement email sending logic
        // For now, just return success
        res.json({
          message: "If the email exists, a reset link has been sent"
        });
      } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({
          error: "internal_error",
          message: "Password reset failed"
        });
      }
    }
  );

  // ============================================================================
  // 🔴 CRITICAL: USER MANAGEMENT API
  // ============================================================================

  // GET /api/users/me
  app.get("/api/users/me", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const user = await storage.getUser(req.user!.userId);
      if (!user) {
        return res.status(404).json({
          error: "user_not_found",
          message: "User not found"
        });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to get user data"
      });
    }
  });

  // GET /api/users/:userId
  app.get("/api/users/:userId", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({
          error: "user_not_found",
          message: "User not found"
        });
      }

      // Return public user data only
      const publicUser = {
        id: user.id,
        uuid: user.uuid,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        bio: user.bio,
        isVerified: user.isVerified,
        credibilityScore: user.credibilityScore,
        totalFollowers: user.totalFollowers,
        totalFollowing: user.totalFollowing,
        createdAt: user.createdAt
      };

      res.json(publicUser);
    } catch (error) {
      console.error("Get user by ID error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to get user data"
      });
    }
  });

  // PUT /api/users/:userId
  app.put("/api/users/:userId", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Users can only update their own profile
      if (req.user!.userId !== userId) {
        return res.status(403).json({
          error: "forbidden",
          message: "You can only update your own profile"
        });
      }

      const allowedUpdates = ['firstName', 'lastName', 'bio', 'avatar'];
      const updates: any = {};
      
      for (const field of allowedUpdates) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          error: "no_updates",
          message: "No valid fields to update"
        });
      }

      const updatedUser = await storage.updateUser(userId, updates);
      if (!updatedUser) {
        return res.status(404).json({
          error: "user_not_found",
          message: "User not found"
        });
      }

      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to update user"
      });
    }
  });

  // DELETE /api/users/:userId
  app.delete("/api/users/:userId", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Users can only delete their own account
      if (req.user!.userId !== userId) {
        return res.status(403).json({
          error: "forbidden",
          message: "You can only delete your own account"
        });
      }

      const deleted = await storage.deleteUser(userId);
      if (!deleted) {
        return res.status(404).json({
          error: "user_not_found",
          message: "User not found"
        });
      }

      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to delete account"
      });
    }
  });

  // GET /api/users/:userId/preferences
  app.get("/api/users/:userId/preferences", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Users can only view their own preferences
      if (req.user!.userId !== userId) {
        return res.status(403).json({
          error: "forbidden",
          message: "You can only view your own preferences"
        });
      }

      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences || {});
    } catch (error) {
      console.error("Get preferences error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to get preferences"
      });
    }
  });

  // PUT /api/users/:userId/preferences
  app.put("/api/users/:userId/preferences", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Users can only update their own preferences
      if (req.user!.userId !== userId) {
        return res.status(403).json({
          error: "forbidden",
          message: "You can only update your own preferences"
        });
      }

      const preferences = await storage.updateUserPreferences(userId, req.body);
      res.json(preferences);
    } catch (error) {
      console.error("Update preferences error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to update preferences"
      });
    }
  });

  // GET /api/users/:userId/stats
  app.get("/api/users/:userId/stats", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const stats = await storage.getUserStats(userId);
      
      if (!stats) {
        return res.status(404).json({
          error: "user_not_found",
          message: "User not found"
        });
      }

      res.json(stats);
    } catch (error) {
      console.error("Get user stats error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to get user stats"
      });
    }
  });

  // ============================================================================
  // 🔴 CRITICAL: WATCHLIST API
  // ============================================================================

  // GET /api/users/:userId/watchlists
  app.get("/api/users/:userId/watchlists", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Users can only view their own watchlists
      if (req.user!.userId !== userId) {
        return res.status(403).json({
          error: "forbidden",
          message: "You can only view your own watchlists"
        });
      }

      const watchlists = await storage.getUserWatchlists(userId);
      res.json(watchlists);
    } catch (error) {
      console.error("Get watchlists error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to get watchlists"
      });
    }
  });

  // POST /api/users/:userId/watchlists
  app.post("/api/users/:userId/watchlists", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Users can only create their own watchlists
      if (req.user!.userId !== userId) {
        return res.status(403).json({
          error: "forbidden",
          message: "You can only create your own watchlists"
        });
      }

      const { name, description, isPublic, color } = req.body;
      
      if (!name || name.trim().length === 0) {
        return res.status(400).json({
          error: "invalid_input",
          message: "Watchlist name is required"
        });
      }

      const watchlist = await storage.createWatchlist({
        userId,
        name: name.trim(),
        description: description?.trim(),
        isPublic: Boolean(isPublic),
        color: color || "#3B82F6"
      });

      res.status(201).json(watchlist);
    } catch (error) {
      console.error("Create watchlist error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to create watchlist"
      });
    }
  });

  // PUT /api/watchlists/:watchlistId
  app.put("/api/watchlists/:watchlistId", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const watchlistId = parseInt(req.params.watchlistId);
      
      // TODO: Add ownership check
      const watchlist = await storage.updateWatchlist(watchlistId, req.body);
      
      if (!watchlist) {
        return res.status(404).json({
          error: "watchlist_not_found",
          message: "Watchlist not found"
        });
      }

      res.json(watchlist);
    } catch (error) {
      console.error("Update watchlist error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to update watchlist"
      });
    }
  });

  // DELETE /api/watchlists/:watchlistId
  app.delete("/api/watchlists/:watchlistId", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const watchlistId = parseInt(req.params.watchlistId);
      
      // TODO: Add ownership check
      const deleted = await storage.deleteWatchlist(watchlistId);
      
      if (!deleted) {
        return res.status(404).json({
          error: "watchlist_not_found",
          message: "Watchlist not found"
        });
      }

      res.json({ message: "Watchlist deleted successfully" });
    } catch (error) {
      console.error("Delete watchlist error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to delete watchlist"
      });
    }
  });

  // POST /api/watchlists/:watchlistId/assets
  app.post("/api/watchlists/:watchlistId/assets", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const watchlistId = parseInt(req.params.watchlistId);
      const { symbol, assetType, addedPrice, targetPrice, stopLoss, notes } = req.body;
      
      if (!symbol || !assetType) {
        return res.status(400).json({
          error: "invalid_input",
          message: "Symbol and asset type are required"
        });
      }

      // TODO: Add ownership check
      const asset = await storage.addAssetToWatchlist(watchlistId, {
        symbol: symbol.toUpperCase(),
        assetType,
        addedPrice,
        targetPrice,
        stopLoss,
        notes
      });

      res.status(201).json(asset);
    } catch (error) {
      console.error("Add asset error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to add asset to watchlist"
      });
    }
  });

  // DELETE /api/watchlists/:watchlistId/assets/:assetId
  app.delete("/api/watchlists/:watchlistId/assets/:assetId", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const watchlistId = parseInt(req.params.watchlistId);
      const assetId = parseInt(req.params.assetId);
      
      // TODO: Add ownership check
      const deleted = await storage.removeAssetFromWatchlist(watchlistId, assetId);
      
      if (!deleted) {
        return res.status(404).json({
          error: "asset_not_found",
          message: "Asset not found in watchlist"
        });
      }

      res.json({ message: "Asset removed from watchlist" });
    } catch (error) {
      console.error("Remove asset error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to remove asset from watchlist"
      });
    }
  });

  // ============================================================================
  // 🔴 CRITICAL: AI/INTELLIGENCE API (Bridge to NLP Service)
  // ============================================================================

  // POST /api/ai/chat
  app.post("/api/ai/chat", requireAuth, generalRateLimit, async (req: AuthenticatedRequest, res) => {
    try {
      const { message } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({
          error: "invalid_input",
          message: "Please provide a valid message"
        });
      }

      // Mock AI response for now - this would integrate with actual AI service
      const responses = [
        {
          content: "I can help you analyze market sentiment! For specific stock analysis, try asking about a ticker like '$AAPL' or '$TSLA'. I can also provide insights on crypto sentiment, trading strategies, and market trends.",
          suggestions: ["What's the sentiment for $AAPL?", "Show me crypto trends", "Help with trading strategy", "Analyze my watchlist"]
        },
        {
          content: "Based on current market data, here are some insights:\\n\\n📈 **Market Overview:**\\n• Tech stocks showing bullish sentiment\\n• Crypto market stabilizing\\n• Energy sector gaining momentum\\n\\nWould you like me to analyze a specific ticker or sector?",
          suggestions: ["Analyze $TSLA sentiment", "Check crypto market", "Show energy stocks", "Market predictions"]
        }
      ];

      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      res.json(randomResponse);
    } catch (error) {
      console.error("AI Chat error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to process chat request"
      });
    }
  });

  // POST /api/ai/sentiment
  app.post("/api/ai/sentiment", requireAuth, generalRateLimit, async (req: AuthenticatedRequest, res) => {
    try {
      const { ticker } = req.body;

      if (!ticker || typeof ticker !== "string") {
        return res.status(400).json({
          error: "invalid_input",
          message: "Please provide a valid ticker symbol"
        });
      }

      // Mock sentiment analysis
      const sentimentScore = Math.random() * 100;
      const sentiment = sentimentScore > 70 ? "Very Bullish" :
                       sentimentScore > 50 ? "Bullish" :
                       sentimentScore > 30 ? "Neutral" : "Bearish";

      await new Promise(resolve => setTimeout(resolve, 800));

      res.json({
        content: `**${ticker.toUpperCase()} Sentiment Analysis:**\\n\\n📊 **Current Mood:** ${sentiment} (${sentimentScore.toFixed(1)}/100)\\n\\n🔍 **Key Insights:**\\n• Social media mentions: ${Math.floor(Math.random() * 5000 + 1000)}\\n• Positive sentiment: ${(sentimentScore + Math.random() * 10).toFixed(1)}%\\n• Trading volume: ${sentimentScore > 50 ? 'Above' : 'Below'} average\\n\\n*Based on real-time sentiment analysis across multiple platforms*`,
        suggestions: [`Analyze ${ticker} competitors`, "Get price target", "View recent news", "Check options flow"]
      });
    } catch (error) {
      console.error("AI Sentiment error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to analyze sentiment"
      });
    }
  });

  // POST /api/ai/summarize
  app.post("/api/ai/summarize", requireAuth, generalRateLimit, async (req: AuthenticatedRequest, res) => {
    try {
      const { ticker, limit = 10 } = req.body;

      await new Promise(resolve => setTimeout(resolve, 1500));

      const content = ticker
        ? `**${ticker.toUpperCase()} Discussion Summary:**\\n\\n📱 **Recent Social Activity:**\\n• ${Math.floor(Math.random() * 500 + 100)} mentions in last 24h\\n• Sentiment trending ${Math.random() > 0.5 ? 'positive' : 'mixed'}\\n• Key themes: earnings, growth prospects, technical analysis\\n\\n💬 **Top Discussions:**\\n• Price target updates\\n• Technical breakout patterns\\n• Institutional activity`
        : "**Market Pulse Summary:**\\n\\n🌐 **Overall Sentiment:** Mixed with bullish undertones\\n\\n📈 **Trending Topics:**\\n• Fed policy speculation\\n• Tech earnings season\\n• Crypto market recovery\\n• Energy sector rotation\\n\\n🎯 **Trader Focus:**\\n• Options activity increasing\\n• Volatility expectations rising";

      res.json({
        content,
        suggestions: ["Get detailed analysis", "Check news impact", "View price levels", "Monitor alerts"]
      });
    } catch (error) {
      console.error("AI Summarize error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to summarize posts"
      });
    }
  });

  // POST /api/ai/recommendations
  app.post("/api/ai/recommendations", requireAuth, generalRateLimit, async (req: AuthenticatedRequest, res) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      const tickers = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'GOOGL', 'AMZN', 'META', 'BTC', 'ETH'];
      const recommended = tickers.slice(0, 3 + Math.floor(Math.random() * 3));

      res.json({
        content: `**🎯 Watchlist Recommendations:**\\n\\nBased on current sentiment and market trends:\\n\\n${recommended.map((ticker, i) =>
          `${i + 1}. **${ticker}** - ${Math.random() > 0.5 ? 'Strong bullish signals' : 'Positive momentum building'}`
        ).join('\\n')}\\n\\n📊 **Analysis Criteria:**\\n• Social sentiment trends\\n• Technical indicators\\n• Volume patterns\\n• News catalyst potential`,
        suggestions: ["Add to watchlist", "Get price alerts", "View detailed analysis", "Check entry points"]
      });
    } catch (error) {
      console.error("AI Recommendations error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to get recommendations"
      });
    }
  });

  // ============================================================================
  // 🟡 IMPORTANT: SOCIAL POSTS API
  // ============================================================================

  // GET /api/posts
  app.get("/api/posts", optionalAuth, generalRateLimit, async (req: AuthenticatedRequest, res) => {
    try {
      const { userId, limit = 50, isPublic } = req.query;
      
      const filters: any = { limit: parseInt(limit as string) };
      
      if (userId) {
        filters.userId = parseInt(userId as string);
      }
      
      if (isPublic !== undefined) {
        filters.isPublic = isPublic === 'true';
      }

      const posts = await storage.getPosts(filters);
      res.json(posts);
    } catch (error) {
      console.error("Get posts error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to get posts"
      });
    }
  });

  // POST /api/posts
  app.post("/api/posts", requireAuth, generalRateLimit, async (req: AuthenticatedRequest, res) => {
    try {
      const { content, symbols, sentiment, postType = "text", metadata, isPublic = true } = req.body;
      
      if (!content || content.trim().length === 0) {
        return res.status(400).json({
          error: "invalid_input",
          message: "Post content is required"
        });
      }

      if (content.length > 2000) {
        return res.status(400).json({
          error: "invalid_input",
          message: "Post content too long (max 2000 characters)"
        });
      }

      const post = await storage.createPost({
        userId: req.user!.userId,
        content: content.trim(),
        symbols,
        sentiment,
        postType,
        metadata,
        isPublic
      });

      res.status(201).json(post);
    } catch (error) {
      console.error("Create post error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to create post"
      });
    }
  });

  // GET /api/posts/:postId
  app.get("/api/posts/:postId", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const post = await storage.getPost(postId);
      
      if (!post) {
        return res.status(404).json({
          error: "post_not_found",
          message: "Post not found"
        });
      }

      // Check if post is public or user owns it
      if (!post.isPublic && (!req.user || req.user.userId !== post.userId)) {
        return res.status(403).json({
          error: "forbidden",
          message: "This post is private"
        });
      }

      res.json(post);
    } catch (error) {
      console.error("Get post error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to get post"
      });
    }
  });

  // PUT /api/posts/:postId
  app.put("/api/posts/:postId", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const postId = parseInt(req.params.postId);
      
      // Check if user owns the post
      const existingPost = await storage.getPost(postId);
      if (!existingPost) {
        return res.status(404).json({
          error: "post_not_found",
          message: "Post not found"
        });
      }

      if (existingPost.userId !== req.user!.userId) {
        return res.status(403).json({
          error: "forbidden",
          message: "You can only edit your own posts"
        });
      }

      const allowedUpdates = ['content', 'symbols', 'sentiment', 'metadata', 'isPublic'];
      const updates: any = {};
      
      for (const field of allowedUpdates) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          error: "no_updates",
          message: "No valid fields to update"
        });
      }

      const updatedPost = await storage.updatePost(postId, updates);
      res.json(updatedPost);
    } catch (error) {
      console.error("Update post error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to update post"
      });
    }
  });

  // DELETE /api/posts/:postId
  app.delete("/api/posts/:postId", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const postId = parseInt(req.params.postId);
      
      // Check if user owns the post
      const existingPost = await storage.getPost(postId);
      if (!existingPost) {
        return res.status(404).json({
          error: "post_not_found",
          message: "Post not found"
        });
      }

      if (existingPost.userId !== req.user!.userId) {
        return res.status(403).json({
          error: "forbidden",
          message: "You can only delete your own posts"
        });
      }

      const deleted = await storage.deletePost(postId);
      if (!deleted) {
        return res.status(500).json({
          error: "internal_error",
          message: "Failed to delete post"
        });
      }

      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Delete post error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to delete post"
      });
    }
  });

  // POST /api/posts/:postId/like
  app.post("/api/posts/:postId/like", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const userId = req.user!.userId;
      
      const success = await storage.likePost(userId, postId);
      
      if (!success) {
        return res.status(409).json({
          error: "already_liked",
          message: "Post already liked"
        });
      }

      res.json({ message: "Post liked successfully" });
    } catch (error) {
      console.error("Like post error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to like post"
      });
    }
  });

  // DELETE /api/posts/:postId/like
  app.delete("/api/posts/:postId/like", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const userId = req.user!.userId;
      
      const success = await storage.unlikePost(userId, postId);
      
      if (!success) {
        return res.status(404).json({
          error: "not_liked",
          message: "Post not liked"
        });
      }

      res.json({ message: "Post unliked successfully" });
    } catch (error) {
      console.error("Unlike post error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to unlike post"
      });
    }
  });

  // POST /api/posts/:postId/bookmark
  app.post("/api/posts/:postId/bookmark", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const userId = req.user!.userId;
      
      const success = await storage.bookmarkPost(userId, postId);
      
      if (!success) {
        return res.status(409).json({
          error: "already_bookmarked",
          message: "Post already bookmarked"
        });
      }

      res.json({ message: "Post bookmarked successfully" });
    } catch (error) {
      console.error("Bookmark post error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to bookmark post"
      });
    }
  });

  // GET /api/posts/:postId/comments
  app.get("/api/posts/:postId/comments", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const comments = await storage.getPostComments(postId);
      res.json(comments);
    } catch (error) {
      console.error("Get comments error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to get comments"
      });
    }
  });

  // POST /api/posts/:postId/comments
  app.post("/api/posts/:postId/comments", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const { content, parentId } = req.body;
      
      if (!content || content.trim().length === 0) {
        return res.status(400).json({
          error: "invalid_input",
          message: "Comment content is required"
        });
      }

      const comment = await storage.createComment({
        postId,
        userId: req.user!.userId,
        parentId: parentId || null,
        content: content.trim()
      });

      res.status(201).json(comment);
    } catch (error) {
      console.error("Create comment error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to create comment"
      });
    }
  });

  // ============================================================================
  // 🟡 IMPORTANT: USER CONNECTIONS API
  // ============================================================================

  // GET /api/users/:userId/followers
  app.get("/api/users/:userId/followers", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const followers = await storage.getUserFollowers(userId);
      res.json(followers);
    } catch (error) {
      console.error("Get followers error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to get followers"
      });
    }
  });

  // GET /api/users/:userId/following
  app.get("/api/users/:userId/following", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const following = await storage.getUserFollowing(userId);
      res.json(following);
    } catch (error) {
      console.error("Get following error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to get following"
      });
    }
  });

  // POST /api/users/:userId/follow
  app.post("/api/users/:userId/follow", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const followingId = parseInt(req.params.userId);
      const followerId = req.user!.userId;
      
      if (followerId === followingId) {
        return res.status(400).json({
          error: "invalid_action",
          message: "You cannot follow yourself"
        });
      }

      const success = await storage.followUser(followerId, followingId);
      
      if (!success) {
        return res.status(409).json({
          error: "already_following",
          message: "Already following this user"
        });
      }

      res.json({ message: "User followed successfully" });
    } catch (error) {
      console.error("Follow user error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to follow user"
      });
    }
  });

  // DELETE /api/users/:userId/follow
  app.delete("/api/users/:userId/follow", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const followingId = parseInt(req.params.userId);
      const followerId = req.user!.userId;
      
      const success = await storage.unfollowUser(followerId, followingId);
      
      if (!success) {
        return res.status(404).json({
          error: "not_following",
          message: "Not following this user"
        });
      }

      res.json({ message: "User unfollowed successfully" });
    } catch (error) {
      console.error("Unfollow user error:", error);
      res.status(500).json({
        error: "internal_error",
        message: "Failed to unfollow user"
      });
    }
  });

  // ============================================================================
  // CREATE HTTP SERVER WITH WEBSOCKET
  // ============================================================================

  const httpServer = createServer(app);
  
  // WebSocket server for real-time features
  const wss = new WebSocketServer({ server: httpServer });
  
  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('WebSocket message:', data);
        
        // Handle different message types
        switch (data.type) {
          case 'join_room':
            // Handle room joining
            ws.send(JSON.stringify({ type: 'room_joined', roomId: data.roomId }));
            break;
          case 'chat_message':
            // Broadcast message to room members
            wss.clients.forEach(client => {
              if (client !== ws && client.readyState === ws.OPEN) {
                client.send(JSON.stringify({
                  type: 'new_message',
                  message: data.message,
                  roomId: data.roomId
                }));
              }
            });
            break;
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  return httpServer;
}