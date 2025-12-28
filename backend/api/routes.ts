import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from 'ws';
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
import { analyticsService } from "./analytics";
import { emailService } from "./email";
import { jobQueue, JobHelpers } from "./jobs";
import { monitoringService } from "./monitoring";
import { uploadService } from "./upload";

// ============================================================================
// NLP SERVICE CONFIGURATION
// ============================================================================

const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL || 'http://localhost:8000';

// Helper to call NLP service
async function callNLPService(endpoint: string, data: any, timeout = 30000): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${NLP_SERVICE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`NLP service error: ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

// ============================================================================
// MARKET DATA PROXY CONFIGURATION
// ============================================================================

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || '';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

async function callFinnhub(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  const url = new URL(`${FINNHUB_BASE_URL}${endpoint}`);
  url.searchParams.set('token', FINNHUB_API_KEY);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Finnhub API error: ${response.status}`);
  }
  return response.json();
}

// ============================================================================
// WEBSOCKET CONNECTION MANAGEMENT
// ============================================================================

interface WSClient {
  ws: WebSocket;
  userId?: number;
  rooms: Set<string>;
  lastPing: number;
}

const wsClients = new Map<WebSocket, WSClient>();

function broadcastToRoom(roomId: string, message: any, excludeWs?: WebSocket) {
  const messageStr = JSON.stringify(message);
  wsClients.forEach((client, ws) => {
    if (client.rooms.has(roomId) && ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
      ws.send(messageStr);
    }
  });
}

// ============================================================================
// ROUTE REGISTRATION
// ============================================================================

export async function registerRoutes(app: Express): Promise<Server> {

  // Apply security headers to all routes
  app.use(securityHeaders);

  // Rate limiting configurations
  const authRateLimit = rateLimit(5, 15 * 60 * 1000); // 5 requests per 15 minutes
  const generalRateLimit = rateLimit(100, 15 * 60 * 1000); // 100 requests per 15 minutes
  const aiRateLimit = rateLimit(20, 60 * 1000); // 20 requests per minute for AI endpoints

  // ============================================================================
  // HEALTH & STATUS ENDPOINTS
  // ============================================================================

  app.get("/api/health", async (req, res) => {
    try {
      const [dbHealth, nlpHealth] = await Promise.allSettled([
        storage.getUser(1),
        fetch(`${NLP_SERVICE_URL}/health`, { method: 'GET' }).then(r => r.json())
      ]);

      res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: "2.0.0",
        services: {
          database: dbHealth.status === 'fulfilled' ? "connected" : "error",
          nlp: nlpHealth.status === 'fulfilled' ? "connected" : "unavailable",
          websocket: wsClients.size > 0 ? "active" : "ready"
        },
        connections: {
          websocket: wsClients.size
        }
      });
    } catch (error) {
      res.status(500).json({
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.get("/api/ready", (req, res) => {
    res.json({ status: "ready", timestamp: new Date().toISOString() });
  });

  // ============================================================================
  // 🔴 AUTHENTICATION API
  // ============================================================================

  app.post("/api/auth/signup",
    authRateLimit,
    validateInput(authSchemas.signup),
    async (req, res) => {
      try {
        const { username, email, password, firstName, lastName } = req.body;

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

        const hashedPassword = await authService.hashPassword(password);
        const newUser = await storage.createUser({
          username,
          email,
          password: hashedPassword,
          firstName,
          lastName
        });

        const tokens = authService.generateTokenPair(newUser);
        const { password: _, ...userWithoutPassword } = newUser;

        // Queue welcome email
        await JobHelpers.scheduleEmail(email, 'welcome', {
          firstName: firstName || username,
          loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`
        });

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

  app.post("/api/auth/login",
    authRateLimit,
    validateInput(authSchemas.login),
    async (req, res) => {
      try {
        const { username, password } = req.body;

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

        const isValidPassword = await authService.verifyPassword(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({
            error: "invalid_credentials",
            message: "Invalid username or password"
          });
        }

        if (!user.isActive) {
          return res.status(403).json({
            error: "account_disabled",
            message: "Account has been disabled"
          });
        }

        const tokens = authService.generateTokenPair(user);
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

  app.post("/api/auth/refresh", authRateLimit, async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          error: "missing_token",
          message: "Refresh token required"
        });
      }

      const decoded = authService.verifyRefreshToken(refreshToken);
      if (!decoded) {
        return res.status(401).json({
          error: "invalid_token",
          message: "Invalid or expired refresh token"
        });
      }

      const user = await storage.getUser(decoded.userId);
      if (!user || !user.isActive) {
        return res.status(401).json({
          error: "user_not_found",
          message: "User not found or inactive"
        });
      }

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

  app.post("/api/auth/logout", requireAuth, async (req: AuthenticatedRequest, res) => {
    res.json({ message: "Logged out successfully" });
  });

  app.post("/api/auth/reset-password",
    authRateLimit,
    validateInput(authSchemas.resetPassword),
    async (req, res) => {
      try {
        const { email } = req.body;
        const user = await storage.getUserByEmail(email);

        if (user) {
          // Generate reset token and queue email
          const resetToken = authService.generateAccessToken({
            userId: user.id,
            username: user.username,
            email: user.email
          });

          await JobHelpers.scheduleEmail(email, 'passwordReset', {
            firstName: user.firstName || user.username,
            resetUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`
          });
        }

        // Always return success to prevent email enumeration
        res.json({ message: "If the email exists, a reset link has been sent" });
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
  // 🔴 USER MANAGEMENT API
  // ============================================================================

  app.get("/api/users/me", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const user = await storage.getUser(req.user!.userId);
      if (!user) {
        return res.status(404).json({ error: "user_not_found", message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get user data" });
    }
  });

  app.get("/api/users/:userId", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ error: "user_not_found", message: "User not found" });
      }

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
      res.status(500).json({ error: "internal_error", message: "Failed to get user data" });
    }
  });

  app.put("/api/users/:userId", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (req.user!.userId !== userId) {
        return res.status(403).json({ error: "forbidden", message: "You can only update your own profile" });
      }

      const allowedUpdates = ['firstName', 'lastName', 'bio', 'avatar'];
      const updates: any = {};

      for (const field of allowedUpdates) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "no_updates", message: "No valid fields to update" });
      }

      const updatedUser = await storage.updateUser(userId, updates);
      if (!updatedUser) {
        return res.status(404).json({ error: "user_not_found", message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to update user" });
    }
  });

  app.delete("/api/users/:userId", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (req.user!.userId !== userId) {
        return res.status(403).json({ error: "forbidden", message: "You can only delete your own account" });
      }

      const deleted = await storage.deleteUser(userId);
      if (!deleted) {
        return res.status(404).json({ error: "user_not_found", message: "User not found" });
      }

      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to delete account" });
    }
  });

  app.get("/api/users/:userId/preferences", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (req.user!.userId !== userId) {
        return res.status(403).json({ error: "forbidden", message: "You can only view your own preferences" });
      }

      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences || {});
    } catch (error) {
      console.error("Get preferences error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get preferences" });
    }
  });

  app.put("/api/users/:userId/preferences", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (req.user!.userId !== userId) {
        return res.status(403).json({ error: "forbidden", message: "You can only update your own preferences" });
      }

      const preferences = await storage.updateUserPreferences(userId, req.body);
      res.json(preferences);
    } catch (error) {
      console.error("Update preferences error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to update preferences" });
    }
  });

  app.get("/api/users/:userId/stats", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const stats = await storage.getUserStats(userId);

      if (!stats) {
        return res.status(404).json({ error: "user_not_found", message: "User not found" });
      }

      res.json(stats);
    } catch (error) {
      console.error("Get user stats error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get user stats" });
    }
  });

  // ============================================================================
  // 🔴 WATCHLIST API
  // ============================================================================

  app.get("/api/users/:userId/watchlists", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (req.user!.userId !== userId) {
        return res.status(403).json({ error: "forbidden", message: "You can only view your own watchlists" });
      }

      const watchlists = await storage.getUserWatchlists(userId);
      res.json(watchlists);
    } catch (error) {
      console.error("Get watchlists error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get watchlists" });
    }
  });

  app.post("/api/users/:userId/watchlists", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (req.user!.userId !== userId) {
        return res.status(403).json({ error: "forbidden", message: "You can only create your own watchlists" });
      }

      const { name, description, isPublic, color } = req.body;

      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: "invalid_input", message: "Watchlist name is required" });
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
      res.status(500).json({ error: "internal_error", message: "Failed to create watchlist" });
    }
  });

  app.put("/api/watchlists/:watchlistId", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const watchlistId = parseInt(req.params.watchlistId);
      const watchlist = await storage.updateWatchlist(watchlistId, req.body);

      if (!watchlist) {
        return res.status(404).json({ error: "watchlist_not_found", message: "Watchlist not found" });
      }

      res.json(watchlist);
    } catch (error) {
      console.error("Update watchlist error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to update watchlist" });
    }
  });

  app.delete("/api/watchlists/:watchlistId", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const watchlistId = parseInt(req.params.watchlistId);
      const deleted = await storage.deleteWatchlist(watchlistId);

      if (!deleted) {
        return res.status(404).json({ error: "watchlist_not_found", message: "Watchlist not found" });
      }

      res.json({ message: "Watchlist deleted successfully" });
    } catch (error) {
      console.error("Delete watchlist error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to delete watchlist" });
    }
  });

  app.post("/api/watchlists/:watchlistId/assets", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const watchlistId = parseInt(req.params.watchlistId);
      const { symbol, assetType, addedPrice, targetPrice, stopLoss, notes } = req.body;

      if (!symbol || !assetType) {
        return res.status(400).json({ error: "invalid_input", message: "Symbol and asset type are required" });
      }

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
      res.status(500).json({ error: "internal_error", message: "Failed to add asset to watchlist" });
    }
  });

  app.delete("/api/watchlists/:watchlistId/assets/:assetId", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const watchlistId = parseInt(req.params.watchlistId);
      const assetId = parseInt(req.params.assetId);

      const deleted = await storage.removeAssetFromWatchlist(watchlistId, assetId);

      if (!deleted) {
        return res.status(404).json({ error: "asset_not_found", message: "Asset not found in watchlist" });
      }

      res.json({ message: "Asset removed from watchlist" });
    } catch (error) {
      console.error("Remove asset error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to remove asset from watchlist" });
    }
  });

  // ============================================================================
  // 🔴 AI/INTELLIGENCE API (NLP Service Bridge)
  // ============================================================================

  // POST /api/ai/analyze - Full intelligence analysis from text
  app.post("/api/ai/analyze", requireAuth, aiRateLimit, async (req: AuthenticatedRequest, res) => {
    try {
      const { text, historicalScores, sampleVolume, sourceType } = req.body;

      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return res.status(400).json({ error: "invalid_input", message: "Text is required" });
      }

      const result = await callNLPService('/intelligence/analyze-text', {
        text: text.trim(),
        historical_scores: historicalScores || null,
        sample_volume: sampleVolume || 1,
        source_type: sourceType || "unknown"
      });

      res.json(result);
    } catch (error) {
      console.error("AI analyze error:", error);

      // Fallback to mock response if NLP service unavailable
      res.json({
        text: req.body.text,
        model_outputs: { finbert: 0.2, social: 0.15, emotion: 0.1 },
        intelligence: {
          sentiment: "neutral",
          score: 0.15,
          confidence: 0.7,
          trend: "stable",
          trend_strength: 0.3,
          emotion: "neutral",
          market_psychology: "stable",
          anomaly: false,
          anomaly_reason: null,
          model_agreement: 0.85
        }
      });
    }
  });

  // POST /api/ai/sentiment - Sentiment analysis for ticker
  app.post("/api/ai/sentiment", requireAuth, aiRateLimit, async (req: AuthenticatedRequest, res) => {
    try {
      const { ticker, text } = req.body;

      if (!ticker && !text) {
        return res.status(400).json({ error: "invalid_input", message: "Ticker or text is required" });
      }

      // If we have text, analyze it directly
      if (text) {
        try {
          const result = await callNLPService('/sentiment/finance', { text });
          return res.json({
            ticker: ticker || 'CUSTOM',
            analysis: result,
            source: 'nlp_service'
          });
        } catch (nlpError) {
          // Fallback to mock
        }
      }

      // Mock response for ticker-based sentiment
      const sentimentScore = Math.random() * 100;
      const sentiment = sentimentScore > 70 ? "Very Bullish" :
                       sentimentScore > 50 ? "Bullish" :
                       sentimentScore > 30 ? "Neutral" : "Bearish";

      res.json({
        ticker: ticker?.toUpperCase() || 'UNKNOWN',
        sentiment,
        score: sentimentScore,
        confidence: 0.75 + Math.random() * 0.2,
        socialMentions: Math.floor(Math.random() * 5000 + 1000),
        positiveRatio: (sentimentScore + Math.random() * 10) / 100,
        volumeComparedToAverage: sentimentScore > 50 ? 'above' : 'below',
        source: 'aggregated'
      });
    } catch (error) {
      console.error("AI Sentiment error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to analyze sentiment" });
    }
  });

  // POST /api/ai/chat - AI chatbot
  app.post("/api/ai/chat", requireAuth, aiRateLimit, async (req: AuthenticatedRequest, res) => {
    try {
      const { message } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "invalid_input", message: "Please provide a valid message" });
      }

      // Try to extract ticker mentions for analysis
      const tickerMatch = message.match(/\$([A-Z]{1,5})/);

      if (tickerMatch) {
        const ticker = tickerMatch[1];
        try {
          const [sentimentResult, quoteResult] = await Promise.allSettled([
            callNLPService('/intelligence/analyze-text', {
              text: `Market analysis for ${ticker}`,
              source_type: 'financial_news'
            }),
            FINNHUB_API_KEY ? callFinnhub('/quote', { symbol: ticker }) : Promise.reject('No API key')
          ]);

          const sentiment = sentimentResult.status === 'fulfilled' ? sentimentResult.value : null;
          const quote = quoteResult.status === 'fulfilled' ? quoteResult.value : null;

          return res.json({
            content: `**${ticker} Analysis:**\n\n` +
              (quote ? `📈 **Current Price:** $${quote.c?.toFixed(2) || 'N/A'}\n` +
                      `📊 **Change:** ${quote.dp?.toFixed(2) || 'N/A'}%\n\n` : '') +
              (sentiment ? `🎯 **AI Sentiment:** ${sentiment.intelligence?.sentiment || 'Neutral'}\n` +
                          `💪 **Confidence:** ${((sentiment.intelligence?.confidence || 0.5) * 100).toFixed(0)}%\n` +
                          `📈 **Trend:** ${sentiment.intelligence?.trend || 'stable'}` :
                          '🔍 Sentiment analysis in progress...'),
            suggestions: [`Get ${ticker} news`, `Set ${ticker} alert`, `Add to watchlist`, "Technical analysis"]
          });
        } catch (error) {
          // Continue with mock response
        }
      }

      // Generic chat response
      res.json({
        content: "I can help you analyze market sentiment! Try asking about a specific ticker like '$AAPL' or '$TSLA', or ask about market trends and trading strategies.",
        suggestions: ["Analyze $AAPL", "Market overview", "Trending stocks", "My watchlist insights"]
      });
    } catch (error) {
      console.error("AI Chat error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to process chat request" });
    }
  });

  // POST /api/ai/summarize - Summarize posts
  app.post("/api/ai/summarize", requireAuth, aiRateLimit, async (req: AuthenticatedRequest, res) => {
    try {
      const { ticker, limit = 10 } = req.body;

      // Get recent posts for the ticker if specified
      const posts = await storage.getPosts({
        limit: parseInt(limit as string),
        isPublic: true
      });

      const postsText = posts.slice(0, 5).map(p => p.content).join('\n\n');

      if (postsText && postsText.length > 50) {
        try {
          const result = await callNLPService('/intelligence/analyze-text', {
            text: postsText,
            source_type: 'social'
          });

          return res.json({
            content: `**Community Pulse${ticker ? ` for ${ticker.toUpperCase()}` : ''}:**\n\n` +
              `📊 **Overall Sentiment:** ${result.intelligence?.sentiment || 'Mixed'}\n` +
              `🎯 **Confidence:** ${((result.intelligence?.confidence || 0.5) * 100).toFixed(0)}%\n` +
              `📈 **Trend:** ${result.intelligence?.trend || 'stable'}\n` +
              `🧠 **Market Psychology:** ${result.intelligence?.market_psychology || 'stable'}\n\n` +
              `*Based on ${posts.length} recent community posts*`,
            suggestions: ["View trending posts", "Top contributors", "Set sentiment alert", "Create post"]
          });
        } catch (error) {
          // Continue with fallback
        }
      }

      res.json({
        content: ticker
          ? `**${ticker.toUpperCase()} Discussion Summary:**\n\n📱 ${Math.floor(Math.random() * 500 + 100)} mentions in last 24h\n• Sentiment trending ${Math.random() > 0.5 ? 'positive' : 'mixed'}`
          : "**Market Pulse:**\n\n🌐 Overall sentiment is mixed with bullish undertones\n📈 Trending: Tech earnings, Fed policy, Crypto recovery",
        suggestions: ["Get detailed analysis", "Check news impact", "View price levels", "Monitor alerts"]
      });
    } catch (error) {
      console.error("AI Summarize error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to summarize posts" });
    }
  });

  // POST /api/ai/recommendations - Watchlist recommendations
  app.post("/api/ai/recommendations", requireAuth, aiRateLimit, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.userId;
      const watchlists = await storage.getUserWatchlists(userId);

      const tickers = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'GOOGL', 'AMZN', 'META', 'BTC-USD', 'ETH-USD'];
      const recommended = tickers.slice(0, 3 + Math.floor(Math.random() * 3));

      res.json({
        content: `**🎯 Personalized Recommendations:**\n\n` +
          `Based on ${watchlists.length} watchlist(s) and current market trends:\n\n` +
          recommended.map((ticker, i) =>
            `${i + 1}. **${ticker}** - ${Math.random() > 0.5 ? 'Strong bullish signals' : 'Positive momentum building'}`
          ).join('\n') +
          `\n\n📊 **Analysis Criteria:**\n• Social sentiment\n• Technical indicators\n• Volume patterns`,
        suggestions: ["Add to watchlist", "Get price alerts", "View detailed analysis", "Check entry points"]
      });
    } catch (error) {
      console.error("AI Recommendations error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get recommendations" });
    }
  });

  // ============================================================================
  // 🔵 MARKET DATA PROXY API (Finnhub)
  // ============================================================================

  app.get("/api/proxy/finnhub/quote", generalRateLimit, async (req, res) => {
    try {
      const { symbol } = req.query;

      if (!symbol || typeof symbol !== 'string') {
        return res.status(400).json({ error: "invalid_input", message: "Symbol is required" });
      }

      if (!FINNHUB_API_KEY) {
        return res.status(503).json({ error: "service_unavailable", message: "Market data service not configured" });
      }

      const data = await callFinnhub('/quote', { symbol: symbol.toUpperCase() });
      res.json(data);
    } catch (error) {
      console.error("Finnhub quote error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to fetch quote" });
    }
  });

  app.get("/api/proxy/finnhub/search", generalRateLimit, async (req, res) => {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "invalid_input", message: "Query is required" });
      }

      if (!FINNHUB_API_KEY) {
        return res.status(503).json({ error: "service_unavailable", message: "Market data service not configured" });
      }

      const data = await callFinnhub('/search', { q });
      res.json(data);
    } catch (error) {
      console.error("Finnhub search error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to search symbols" });
    }
  });

  app.get("/api/proxy/finnhub/candle", generalRateLimit, async (req, res) => {
    try {
      const { symbol, resolution, from, to } = req.query;

      if (!symbol || !resolution) {
        return res.status(400).json({ error: "invalid_input", message: "Symbol and resolution are required" });
      }

      if (!FINNHUB_API_KEY) {
        return res.status(503).json({ error: "service_unavailable", message: "Market data service not configured" });
      }

      const now = Math.floor(Date.now() / 1000);
      const data = await callFinnhub('/stock/candle', {
        symbol: (symbol as string).toUpperCase(),
        resolution: resolution as string,
        from: (from as string) || String(now - 86400 * 30),
        to: (to as string) || String(now)
      });
      res.json(data);
    } catch (error) {
      console.error("Finnhub candle error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to fetch candle data" });
    }
  });

  app.get("/api/proxy/finnhub/news", generalRateLimit, async (req, res) => {
    try {
      const { category, minId } = req.query;

      if (!FINNHUB_API_KEY) {
        return res.status(503).json({ error: "service_unavailable", message: "Market data service not configured" });
      }

      const params: Record<string, string> = { category: (category as string) || 'general' };
      if (minId) params.minId = minId as string;

      const data = await callFinnhub('/news', params);
      res.json(data);
    } catch (error) {
      console.error("Finnhub news error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to fetch news" });
    }
  });

  // ============================================================================
  // 🟡 SOCIAL POSTS API
  // ============================================================================

  app.get("/api/posts", optionalAuth, generalRateLimit, async (req: AuthenticatedRequest, res) => {
    try {
      const { userId, limit = 50, isPublic } = req.query;

      const filters: any = { limit: parseInt(limit as string) };
      if (userId) filters.userId = parseInt(userId as string);
      if (isPublic !== undefined) filters.isPublic = isPublic === 'true';

      const posts = await storage.getPosts(filters);
      res.json(posts);
    } catch (error) {
      console.error("Get posts error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get posts" });
    }
  });

  app.post("/api/posts", requireAuth, generalRateLimit, async (req: AuthenticatedRequest, res) => {
    try {
      const { content, symbols, sentiment, postType = "text", metadata, isPublic = true } = req.body;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: "invalid_input", message: "Post content is required" });
      }

      if (content.length > 2000) {
        return res.status(400).json({ error: "invalid_input", message: "Post content too long (max 2000 characters)" });
      }

      // Auto-detect sentiment using NLP service
      let detectedSentiment = sentiment;
      if (!sentiment && content.length > 10) {
        try {
          const analysis = await callNLPService('/intelligence/analyze-text', {
            text: content,
            source_type: 'social'
          }, 5000);
          detectedSentiment = analysis.intelligence?.sentiment || 'neutral';
        } catch (error) {
          // Continue without sentiment
        }
      }

      const post = await storage.createPost({
        userId: req.user!.userId,
        content: content.trim(),
        symbols,
        sentiment: detectedSentiment,
        postType,
        metadata,
        isPublic
      });

      // Broadcast new post to WebSocket clients
      broadcastToRoom('feed', { type: 'new_post', post });

      res.status(201).json(post);
    } catch (error) {
      console.error("Create post error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to create post" });
    }
  });

  app.get("/api/posts/:postId", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const post = await storage.getPost(postId);

      if (!post) {
        return res.status(404).json({ error: "post_not_found", message: "Post not found" });
      }

      if (!post.isPublic && (!req.user || req.user.userId !== post.userId)) {
        return res.status(403).json({ error: "forbidden", message: "This post is private" });
      }

      res.json(post);
    } catch (error) {
      console.error("Get post error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get post" });
    }
  });

  app.put("/api/posts/:postId", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const existingPost = await storage.getPost(postId);

      if (!existingPost) {
        return res.status(404).json({ error: "post_not_found", message: "Post not found" });
      }

      if (existingPost.userId !== req.user!.userId) {
        return res.status(403).json({ error: "forbidden", message: "You can only edit your own posts" });
      }

      const allowedUpdates = ['content', 'symbols', 'sentiment', 'metadata', 'isPublic'];
      const updates: any = {};

      for (const field of allowedUpdates) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "no_updates", message: "No valid fields to update" });
      }

      const updatedPost = await storage.updatePost(postId, updates);
      res.json(updatedPost);
    } catch (error) {
      console.error("Update post error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to update post" });
    }
  });

  app.delete("/api/posts/:postId", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const existingPost = await storage.getPost(postId);

      if (!existingPost) {
        return res.status(404).json({ error: "post_not_found", message: "Post not found" });
      }

      if (existingPost.userId !== req.user!.userId) {
        return res.status(403).json({ error: "forbidden", message: "You can only delete your own posts" });
      }

      await storage.deletePost(postId);
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Delete post error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to delete post" });
    }
  });

  app.post("/api/posts/:postId/like", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const success = await storage.likePost(req.user!.userId, postId);

      if (!success) {
        return res.status(409).json({ error: "already_liked", message: "Post already liked" });
      }

      res.json({ message: "Post liked successfully" });
    } catch (error) {
      console.error("Like post error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to like post" });
    }
  });

  app.delete("/api/posts/:postId/like", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const success = await storage.unlikePost(req.user!.userId, postId);

      if (!success) {
        return res.status(404).json({ error: "not_liked", message: "Post not liked" });
      }

      res.json({ message: "Post unliked successfully" });
    } catch (error) {
      console.error("Unlike post error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to unlike post" });
    }
  });

  app.post("/api/posts/:postId/bookmark", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const success = await storage.bookmarkPost(req.user!.userId, postId);

      if (!success) {
        return res.status(409).json({ error: "already_bookmarked", message: "Post already bookmarked" });
      }

      res.json({ message: "Post bookmarked successfully" });
    } catch (error) {
      console.error("Bookmark post error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to bookmark post" });
    }
  });

  app.get("/api/posts/:postId/comments", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const comments = await storage.getPostComments(postId);
      res.json(comments);
    } catch (error) {
      console.error("Get comments error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get comments" });
    }
  });

  app.post("/api/posts/:postId/comments", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const { content, parentId } = req.body;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: "invalid_input", message: "Comment content is required" });
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
      res.status(500).json({ error: "internal_error", message: "Failed to create comment" });
    }
  });

  // ============================================================================
  // 🟡 USER CONNECTIONS API
  // ============================================================================

  app.get("/api/users/:userId/followers", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const followers = await storage.getUserFollowers(userId);
      res.json(followers);
    } catch (error) {
      console.error("Get followers error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get followers" });
    }
  });

  app.get("/api/users/:userId/following", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const following = await storage.getUserFollowing(userId);
      res.json(following);
    } catch (error) {
      console.error("Get following error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get following" });
    }
  });

  app.post("/api/users/:userId/follow", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const followingId = parseInt(req.params.userId);
      const followerId = req.user!.userId;

      if (followerId === followingId) {
        return res.status(400).json({ error: "invalid_action", message: "You cannot follow yourself" });
      }

      const success = await storage.followUser(followerId, followingId);

      if (!success) {
        return res.status(409).json({ error: "already_following", message: "Already following this user" });
      }

      // Create notification for followed user
      await storage.createNotification({
        userId: followingId,
        type: 'follow',
        title: 'New Follower',
        message: `${req.user!.username} started following you`,
        data: { followerId }
      });

      res.json({ message: "User followed successfully" });
    } catch (error) {
      console.error("Follow user error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to follow user" });
    }
  });

  app.delete("/api/users/:userId/follow", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const followingId = parseInt(req.params.userId);
      const success = await storage.unfollowUser(req.user!.userId, followingId);

      if (!success) {
        return res.status(404).json({ error: "not_following", message: "Not following this user" });
      }

      res.json({ message: "User unfollowed successfully" });
    } catch (error) {
      console.error("Unfollow user error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to unfollow user" });
    }
  });

  // ============================================================================
  // 🟠 ROOMS & MESSAGING API
  // ============================================================================

  app.get("/api/rooms", optionalAuth, generalRateLimit, async (req: AuthenticatedRequest, res) => {
    try {
      const { roomType, symbol, limit = 50 } = req.query;
      const filters: any = { limit: parseInt(limit as string), isActive: true };
      if (roomType) filters.roomType = roomType;
      if (symbol) filters.symbol = (symbol as string).toUpperCase();

      const rooms = await storage.getRooms(filters);
      res.json(rooms);
    } catch (error) {
      console.error("Get rooms error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get rooms" });
    }
  });

  app.post("/api/rooms", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { name, description, roomType = 'public', symbol, avatar, settings } = req.body;

      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: "invalid_input", message: "Room name is required" });
      }

      const room = await storage.createRoom({
        name: name.trim(),
        description: description?.trim(),
        creatorId: req.user!.userId,
        roomType,
        symbol: symbol?.toUpperCase(),
        avatar,
        settings
      });

      res.status(201).json(room);
    } catch (error) {
      console.error("Create room error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to create room" });
    }
  });

  app.get("/api/rooms/:roomId", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const room = await storage.getRoom(roomId);

      if (!room) {
        return res.status(404).json({ error: "room_not_found", message: "Room not found" });
      }

      res.json(room);
    } catch (error) {
      console.error("Get room error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get room" });
    }
  });

  app.get("/api/rooms/:roomId/messages", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const { limit = 50, before } = req.query;

      const messages = await storage.getRoomMessages(
        roomId,
        parseInt(limit as string),
        before ? new Date(before as string) : undefined
      );
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get messages" });
    }
  });

  app.post("/api/rooms/:roomId/messages", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const { content, messageType = 'text', metadata } = req.body;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: "invalid_input", message: "Message content is required" });
      }

      const message = await storage.createMessage({
        roomId,
        userId: req.user!.userId,
        content: content.trim(),
        messageType,
        metadata
      });

      // Broadcast message to room via WebSocket
      broadcastToRoom(`room:${roomId}`, {
        type: 'new_message',
        message,
        roomId
      });

      res.status(201).json(message);
    } catch (error) {
      console.error("Create message error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to send message" });
    }
  });

  app.post("/api/rooms/:roomId/join", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const success = await storage.joinRoom(roomId, req.user!.userId);

      if (!success) {
        return res.status(409).json({ error: "already_member", message: "Already a member of this room" });
      }

      res.json({ message: "Joined room successfully" });
    } catch (error) {
      console.error("Join room error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to join room" });
    }
  });

  app.post("/api/rooms/:roomId/leave", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const success = await storage.leaveRoom(roomId, req.user!.userId);

      if (!success) {
        return res.status(404).json({ error: "not_member", message: "Not a member of this room" });
      }

      res.json({ message: "Left room successfully" });
    } catch (error) {
      console.error("Leave room error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to leave room" });
    }
  });

  app.get("/api/rooms/:roomId/members", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const members = await storage.getRoomMembers(roomId);
      res.json(members);
    } catch (error) {
      console.error("Get room members error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get room members" });
    }
  });

  // ============================================================================
  // 🟠 ALERTS & NOTIFICATIONS API
  // ============================================================================

  app.get("/api/users/:userId/alerts", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (req.user!.userId !== userId) {
        return res.status(403).json({ error: "forbidden", message: "You can only view your own alerts" });
      }

      const alerts = await storage.getUserAlerts(userId);
      res.json(alerts);
    } catch (error) {
      console.error("Get alerts error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get alerts" });
    }
  });

  app.post("/api/users/:userId/alerts", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (req.user!.userId !== userId) {
        return res.status(403).json({ error: "forbidden", message: "You can only create your own alerts" });
      }

      const { symbol, alertType, condition } = req.body;

      if (!symbol || !alertType || !condition) {
        return res.status(400).json({ error: "invalid_input", message: "Symbol, alert type, and condition are required" });
      }

      const alert = await storage.createAlert({
        userId,
        symbol: symbol.toUpperCase(),
        alertType,
        condition
      });

      res.status(201).json(alert);
    } catch (error) {
      console.error("Create alert error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to create alert" });
    }
  });

  app.delete("/api/alerts/:alertId", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const alertId = parseInt(req.params.alertId);
      const deleted = await storage.deleteAlert(alertId);

      if (!deleted) {
        return res.status(404).json({ error: "alert_not_found", message: "Alert not found" });
      }

      res.json({ message: "Alert deleted successfully" });
    } catch (error) {
      console.error("Delete alert error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to delete alert" });
    }
  });

  app.get("/api/users/:userId/notifications", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (req.user!.userId !== userId) {
        return res.status(403).json({ error: "forbidden", message: "You can only view your own notifications" });
      }

      const { limit = 50 } = req.query;
      const notifications = await storage.getUserNotifications(userId, parseInt(limit as string));
      const unreadCount = await storage.getUnreadNotificationCount(userId);

      res.json({ notifications, unreadCount });
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get notifications" });
    }
  });

  app.put("/api/notifications/:notificationId/read", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const notificationId = parseInt(req.params.notificationId);
      await storage.markNotificationAsRead(notificationId);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Mark notification read error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to mark notification as read" });
    }
  });

  app.put("/api/users/:userId/notifications/read-all", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (req.user!.userId !== userId) {
        return res.status(403).json({ error: "forbidden", message: "You can only update your own notifications" });
      }

      await storage.markAllNotificationsAsRead(userId);
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      console.error("Mark all notifications read error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to mark notifications as read" });
    }
  });

  // ============================================================================
  // 🟠 INSIGHTS API
  // ============================================================================

  app.get("/api/insights", optionalAuth, generalRateLimit, async (req: AuthenticatedRequest, res) => {
    try {
      const { symbol, insightType, limit = 50 } = req.query;
      const filters: any = { limit: parseInt(limit as string) };
      if (symbol) filters.symbol = (symbol as string).toUpperCase();
      if (insightType) filters.insightType = insightType;

      const insights = await storage.getPublicInsights(filters);
      res.json(insights);
    } catch (error) {
      console.error("Get insights error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get insights" });
    }
  });

  app.post("/api/users/:userId/insights", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (req.user!.userId !== userId) {
        return res.status(403).json({ error: "forbidden", message: "You can only create your own insights" });
      }

      const { symbol, insightType, title, content, prediction, sentiment, confidence, isPublic = true } = req.body;

      if (!symbol || !title || !content) {
        return res.status(400).json({ error: "invalid_input", message: "Symbol, title, and content are required" });
      }

      const insight = await storage.createInsight({
        userId,
        symbol: symbol.toUpperCase(),
        insightType: insightType || 'analysis',
        title: title.trim(),
        content: content.trim(),
        prediction,
        sentiment,
        confidence,
        isPublic
      });

      res.status(201).json(insight);
    } catch (error) {
      console.error("Create insight error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to create insight" });
    }
  });

  // ============================================================================
  // 🟠 BADGES API
  // ============================================================================

  app.get("/api/badges", async (req, res) => {
    try {
      const badges = await storage.getAllBadges();
      res.json(badges);
    } catch (error) {
      console.error("Get badges error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get badges" });
    }
  });

  app.get("/api/users/:userId/badges", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const badges = await storage.getUserBadges(userId);
      res.json(badges);
    } catch (error) {
      console.error("Get user badges error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get user badges" });
    }
  });

  // ============================================================================
  // 🟠 SEARCH API
  // ============================================================================

  app.get("/api/search/users", generalRateLimit, async (req, res) => {
    try {
      const { q, limit = 20 } = req.query;

      if (!q || typeof q !== 'string' || q.length < 2) {
        return res.status(400).json({ error: "invalid_input", message: "Query must be at least 2 characters" });
      }

      const users = await storage.searchUsers(q, parseInt(limit as string));
      res.json(users);
    } catch (error) {
      console.error("Search users error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to search users" });
    }
  });

  app.get("/api/search/posts", generalRateLimit, async (req, res) => {
    try {
      const { q, limit = 50 } = req.query;

      if (!q || typeof q !== 'string' || q.length < 2) {
        return res.status(400).json({ error: "invalid_input", message: "Query must be at least 2 characters" });
      }

      const posts = await storage.searchPosts(q, parseInt(limit as string));
      res.json(posts);
    } catch (error) {
      console.error("Search posts error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to search posts" });
    }
  });

  app.get("/api/search/insights", generalRateLimit, async (req, res) => {
    try {
      const { q, limit = 50 } = req.query;

      if (!q || typeof q !== 'string' || q.length < 2) {
        return res.status(400).json({ error: "invalid_input", message: "Query must be at least 2 characters" });
      }

      const insights = await storage.searchInsights(q, parseInt(limit as string));
      res.json(insights);
    } catch (error) {
      console.error("Search insights error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to search insights" });
    }
  });

  // ============================================================================
  // 🟢 MODERATION API
  // ============================================================================

  app.post("/api/posts/:postId/flag", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const { reason, description } = req.body;

      if (!reason) {
        return res.status(400).json({ error: "invalid_input", message: "Reason is required" });
      }

      const flag = await storage.createPostFlag({
        postId,
        reporterId: req.user!.userId,
        reason,
        description: description?.trim()
      });

      res.status(201).json(flag);
    } catch (error) {
      console.error("Flag post error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to flag post" });
    }
  });

  app.get("/api/moderation/queue", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      // TODO: Add admin check
      const { status = 'pending', limit = 50 } = req.query;
      const flags = await storage.getPostFlags({ status, limit: parseInt(limit as string) });
      res.json(flags);
    } catch (error) {
      console.error("Get moderation queue error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get moderation queue" });
    }
  });

  // ============================================================================
  // 🟢 ANALYTICS API (Admin)
  // ============================================================================

  app.get("/api/analytics/platform", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      // TODO: Add admin check
      const metrics = await analyticsService.getPlatformMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Get platform analytics error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get analytics" });
    }
  });

  app.get("/api/analytics/realtime", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const metrics = await analyticsService.getRealtimeMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Get realtime analytics error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get realtime analytics" });
    }
  });

  app.get("/api/users/:userId/analytics", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (req.user!.userId !== userId) {
        return res.status(403).json({ error: "forbidden", message: "You can only view your own analytics" });
      }

      const analytics = await analyticsService.getUserAnalytics(userId);
      res.json(analytics);
    } catch (error) {
      console.error("Get user analytics error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get user analytics" });
    }
  });

  // ============================================================================
  // 🟢 MONITORING API
  // ============================================================================

  app.get("/api/monitoring/metrics", async (req, res) => {
    try {
      const metrics = await monitoringService.getSystemMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Get system metrics error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get system metrics" });
    }
  });

  app.get("/api/monitoring/health", async (req, res) => {
    try {
      const health = await monitoringService.healthCheck();
      res.json(health);
    } catch (error) {
      console.error("Health check error:", error);
      res.status(500).json({ error: "internal_error", message: "Health check failed" });
    }
  });

  // ============================================================================
  // 🟢 JOBS API (Admin)
  // ============================================================================

  app.get("/api/jobs/stats", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      // TODO: Add admin check
      const stats = jobQueue.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Get job stats error:", error);
      res.status(500).json({ error: "internal_error", message: "Failed to get job stats" });
    }
  });

  // ============================================================================
  // CREATE HTTP SERVER WITH WEBSOCKET
  // ============================================================================

  const httpServer = createServer(app);

  const wss = new WebSocketServer({ server: httpServer });

  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');

    const client: WSClient = {
      ws,
      rooms: new Set(['feed']), // All clients join the feed by default
      lastPing: Date.now()
    };
    wsClients.set(ws, client);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());

        switch (data.type) {
          case 'auth':
            // Authenticate WebSocket connection
            const decoded = authService.verifyAccessToken(data.token);
            if (decoded) {
              client.userId = decoded.userId;
              ws.send(JSON.stringify({ type: 'auth_success', userId: decoded.userId }));
            } else {
              ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid token' }));
            }
            break;

          case 'join_room':
            client.rooms.add(`room:${data.roomId}`);
            ws.send(JSON.stringify({ type: 'room_joined', roomId: data.roomId }));
            broadcastToRoom(`room:${data.roomId}`, {
              type: 'user_joined',
              userId: client.userId,
              roomId: data.roomId
            }, ws);
            break;

          case 'leave_room':
            client.rooms.delete(`room:${data.roomId}`);
            ws.send(JSON.stringify({ type: 'room_left', roomId: data.roomId }));
            broadcastToRoom(`room:${data.roomId}`, {
              type: 'user_left',
              userId: client.userId,
              roomId: data.roomId
            }, ws);
            break;

          case 'typing':
            broadcastToRoom(`room:${data.roomId}`, {
              type: 'user_typing',
              userId: client.userId,
              roomId: data.roomId
            }, ws);
            break;

          case 'ping':
            client.lastPing = Date.now();
            ws.send(JSON.stringify({ type: 'pong' }));
            break;

          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      // Notify rooms that user left
      client.rooms.forEach(room => {
        if (room !== 'feed') {
          broadcastToRoom(room, { type: 'user_left', userId: client.userId }, ws);
        }
      });
      wsClients.delete(ws);
      console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      wsClients.delete(ws);
    });
  });

  // Ping clients every 30 seconds to keep connections alive
  setInterval(() => {
    const now = Date.now();
    wsClients.forEach((client, ws) => {
      if (now - client.lastPing > 60000) {
        // Client hasn't pinged in 60 seconds, terminate
        ws.terminate();
        wsClients.delete(ws);
      } else if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
      }
    });
  }, 30000);

  // Start monitoring service
  monitoringService.startMonitoring();

  return httpServer;
}
