# Vibe Trend Analyzer - Backend API

Production-ready backend API for a multimillion dollar AI finance application.

## 🏗️ Architecture

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT with refresh tokens
- **Real-time**: WebSocket support
- **Security**: Helmet, rate limiting, input validation
- **AI Integration**: Bridge to NLP service

## 📋 Features Implemented

### ✅ Phase 1: Core Infrastructure (COMPLETE)

#### 🔴 CRITICAL Features
- ✅ Authentication API (signup, login, logout, refresh, password reset)
- ✅ User Management API (CRUD, preferences, stats)
- ✅ Watchlist API (create, update, delete, add/remove assets)
- ✅ AI/Intelligence API (chat, sentiment, summarize, recommendations)

#### 🟡 IMPORTANT Features
- ✅ Social Posts API (create, read, update, delete, like, bookmark, comments)
- ✅ User Connections API (follow, unfollow, followers, following)

#### 🔵 Infrastructure
- ✅ Health check endpoints
- ✅ Security headers & CORS
- ✅ Rate limiting
- ✅ Input validation with Zod
- ✅ Error handling
- ✅ Request logging
- ✅ WebSocket server setup

### ✅ Phase 2: Advanced Features (COMPLETE)

#### 🟡 IMPORTANT Features
- ✅ Community Rooms API (full implementation with messaging)
- ✅ Private Rooms API (room management, member roles)
- ✅ Alerts & Notifications API (full implementation)
- ✅ Real-time messaging with WebSocket integration

#### 🟠 SECONDARY Features
- ✅ Insights/Predictions API (create, read, update, delete insights)
- ✅ Badges API (badge definitions, user badges)
- ✅ Moderation API (content flagging, moderation actions, admin queue)
- ✅ Search API (users, posts, insights, tickers)
- ✅ External Market Data Proxies (Finnhub integration, news API)

### ✅ Phase 3: Advanced Features (COMPLETE)

#### 📊 Analytics Dashboard
- ✅ Platform-wide metrics API
- ✅ User-specific analytics
- ✅ Real-time metrics
- ✅ Custom event tracking
- ✅ Analytics reports generation

#### 📧 Email Notifications
- ✅ Template-based email system
- ✅ Email queueing and scheduling
- ✅ Email statistics tracking
- ✅ Multiple email templates (welcome, alerts, digests, etc.)

#### 📁 File Upload & Media Management
- ✅ Multi-file upload support
- ✅ Image processing (resize, compress, thumbnails)
- ✅ File metadata management
- ✅ Signed URLs for secure downloads
- ✅ User file management
- ✅ Storage statistics

#### 📊 Monitoring & Metrics
- ✅ System metrics collection
- ✅ Performance monitoring
- ✅ Alert management
- ✅ Health checks
- ✅ Real-time performance tracking

#### ⚙️ Background Job Processing
- ✅ Job queue system
- ✅ Priority-based processing
- ✅ Automatic retries with exponential backoff
- ✅ Job status tracking
- ✅ Multiple job types (email, export, analytics, etc.)
- ✅ Scheduled job execution

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `JWT_REFRESH_SECRET` - Generate with: `openssl rand -base64 32`

### 3. Push Database Schema

```bash
npm run db:push
```

### 4. Start Development Server

```bash
npm run dev
```

Server will start on http://localhost:5000

## 📡 API Endpoints

### Authentication

```
POST   /api/auth/signup          - Create new account
POST   /api/auth/login           - Login
POST   /api/auth/logout          - Logout
POST   /api/auth/refresh         - Refresh access token
POST   /api/auth/reset-password  - Request password reset
```

### User Management

```
GET    /api/users/me                      - Get current user
GET    /api/users/:userId                 - Get user by ID
PUT    /api/users/:userId                 - Update user
DELETE /api/users/:userId                 - Delete user
GET    /api/users/:userId/preferences     - Get user preferences
PUT    /api/users/:userId/preferences     - Update preferences
GET    /api/users/:userId/stats           - Get user stats
```

### Watchlists

```
GET    /api/users/:userId/watchlists              - Get user watchlists
POST   /api/users/:userId/watchlists              - Create watchlist
PUT    /api/watchlists/:watchlistId               - Update watchlist
DELETE /api/watchlists/:watchlistId               - Delete watchlist
POST   /api/watchlists/:watchlistId/assets        - Add asset
DELETE /api/watchlists/:watchlistId/assets/:id    - Remove asset
```

### AI/Intelligence

```
POST   /api/ai/chat              - Chat with AI
POST   /api/ai/sentiment         - Analyze sentiment
POST   /api/ai/summarize         - Summarize posts
POST   /api/ai/recommendations   - Get recommendations
```

### Social Posts

```
GET    /api/posts                - Get posts feed
POST   /api/posts                - Create post
GET    /api/posts/:postId        - Get post
PUT    /api/posts/:postId        - Update post
DELETE /api/posts/:postId        - Delete post
POST   /api/posts/:postId/like   - Like post
DELETE /api/posts/:postId/like   - Unlike post
POST   /api/posts/:postId/bookmark - Bookmark post
GET    /api/posts/:postId/comments - Get comments
POST   /api/posts/:postId/comments - Create comment
```

### User Connections

```
GET    /api/users/:userId/followers  - Get followers
GET    /api/users/:userId/following  - Get following
POST   /api/users/:userId/follow     - Follow user
DELETE /api/users/:userId/follow     - Unfollow user
```

### Community Rooms

```
GET    /api/rooms                           - Get public rooms
POST   /api/rooms                           - Create room
GET    /api/rooms/:roomId                   - Get room details
PUT    /api/rooms/:roomId                   - Update room
DELETE /api/rooms/:roomId                   - Delete room
GET    /api/rooms/:roomId/messages          - Get room messages
POST   /api/rooms/:roomId/messages          - Send message
POST   /api/rooms/:roomId/join              - Join room
POST   /api/rooms/:roomId/leave             - Leave room
GET    /api/rooms/:roomId/members           - Get room members
POST   /api/rooms/:roomId/members/:id/role  - Update member role
```

### Alerts & Notifications

```
GET    /api/users/:userId/alerts                    - Get user alerts
POST   /api/users/:userId/alerts                    - Create alert
PUT    /api/alerts/:alertId                         - Update alert
DELETE /api/alerts/:alertId                         - Delete alert
GET    /api/users/:userId/notifications             - Get notifications
PUT    /api/notifications/:notificationId/read      - Mark as read
PUT    /api/users/:userId/notifications/read-all    - Mark all as read
GET    /api/users/:userId/notifications/unread-count - Get unread count
```

### Insights & Predictions

```
GET    /api/insights                        - Get public insights
GET    /api/users/:userId/insights          - Get user insights
POST   /api/users/:userId/insights          - Create insight
PUT    /api/insights/:insightId             - Update insight
DELETE /api/insights/:insightId             - Delete insight
```

### Badges & Gamification

```
GET    /api/badges                   - Get all badge definitions
GET    /api/users/:userId/badges     - Get user's earned badges
```

### Moderation

```
POST   /api/posts/:postId/flag       - Flag post for review
GET    /api/moderation/queue          - Get moderation queue (Admin)
POST   /api/moderation/actions        - Create moderation action (Admin)
GET    /api/moderation/stats          - Get moderation stats (Admin)
```

### Search

```
GET    /api/search/users?q=query      - Search users
GET    /api/search/posts?q=query      - Search posts
GET    /api/search/insights?q=query   - Search insights
GET    /api/search/tickers?q=query    - Search tickers
```

### External Market Data

```
GET    /api/proxy/finnhub/quote?symbol=AAPL    - Get stock quote
GET    /api/proxy/finnhub/candles              - Get price history
GET    /api/proxy/finnhub/search?q=apple       - Search symbols
GET    /api/proxy/news?ticker=AAPL             - Get news for ticker
```

### Health & Status

```
GET    /api/health  - Health check
GET    /api/ready   - Readiness check
```

### Phase 3: Advanced Features

#### Analytics Dashboard

```
GET    /api/analytics/platform           - Platform-wide metrics (Admin)
GET    /api/analytics/user/:userId       - User-specific analytics
GET    /api/analytics/realtime           - Real-time metrics
POST   /api/analytics/events             - Track custom events
```

#### Email Notifications

```
POST   /api/email/send                   - Send email notification
GET    /api/email/stats                  - Email statistics
```

#### File Upload & Media Management

```
POST   /api/files/upload                 - Upload files (multipart)
GET    /api/files/:fileId                - Get file metadata
GET    /api/files/:fileId/download       - Download file (signed URL)
DELETE /api/files/:fileId                - Delete file
GET    /api/users/:userId/files          - Get user's files
```

#### Monitoring & Metrics

```
GET    /api/monitoring/metrics           - System metrics
GET    /api/monitoring/alerts            - Active alerts
POST   /api/monitoring/alerts/:id/resolve - Resolve alert
GET    /api/monitoring/performance       - Performance summary
```

#### Background Jobs

```
GET    /api/jobs/stats                   - Job queue statistics
GET    /api/jobs/:jobId                  - Get job status
POST   /api/jobs/export                  - Schedule data export
```

## 🔐 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Token Flow

1. **Signup/Login** → Receive `accessToken` and `refreshToken`
2. **Use accessToken** for API requests (expires in 15 minutes)
3. **When expired** → Use `refreshToken` to get new `accessToken` (expires in 7 days)
4. **Logout** → Client discards tokens

### Example

```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'user', password: 'pass' })
});

const { accessToken, refreshToken, user } = await response.json();

// Use access token
const posts = await fetch('/api/posts', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});

// Refresh token when expired
const newTokens = await fetch('/api/auth/refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refreshToken })
});
```

## 🛡️ Security Features

### Implemented

- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Rate limiting (5 req/15min for auth, 100 req/15min general)
- ✅ Input validation with Zod schemas
- ✅ Security headers (Helmet in production)
- ✅ CORS configuration
- ✅ SQL injection prevention (Drizzle ORM)
- ✅ XSS protection
- ✅ Request size limits (10MB)

### Recommended for Production

- ⬜ Redis for distributed rate limiting
- ⬜ Token blacklist for logout
- ⬜ 2FA/MFA support
- ⬜ IP whitelisting for admin endpoints
- ⬜ DDoS protection (Cloudflare)
- ⬜ API key rotation
- ⬜ Audit logging
- ⬜ Penetration testing

## 📊 Database Schema

### Core Tables

- `users` - User accounts
- `user_preferences` - User settings
- `user_sessions` - Auth sessions
- `watchlists` - Watchlist metadata
- `watchlist_assets` - Assets in watchlists
- `posts` - Social posts
- `comments` - Post comments
- `likes` - Post/comment likes
- `bookmarks` - Saved posts
- `user_follows` - Follow relationships
- `rooms` - Community rooms
- `room_members` - Room membership
- `messages` - Chat messages
- `alerts` - User alerts
- `notifications` - Notification queue
- `insights` - User predictions
- `badges` - Badge definitions
- `user_badges` - Earned badges
- `credibility_scores` - User/post credibility
- `post_flags` - Content reports
- `moderation_actions` - Mod action log

## 🔧 Development

### Run Tests

```bash
npm test
```

### Type Check

```bash
npm run check
```

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## 📈 Performance Considerations

### Database Optimization

- Indexes on frequently queried columns
- Connection pooling (Neon serverless)
- Query optimization with Drizzle
- Pagination for large datasets

### Caching Strategy (To Implement)

- Redis for session storage
- Cache frequently accessed data
- Cache external API responses
- Implement cache invalidation

### Scaling Strategy

- Horizontal scaling with load balancer
- Database read replicas
- CDN for static assets
- Microservices for heavy operations

## 🐛 Debugging

### Enable Debug Logging

```bash
LOG_LEVEL=debug npm run dev
```

### Check Database Connection

```bash
curl http://localhost:5000/api/health
```

### Test Authentication

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"password123"}'
```

## 📝 Environment Variables

See `.env.example` for all available configuration options.

### Required

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - Refresh token secret

### Optional

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `ALLOWED_ORIGINS` - CORS allowed origins
- External API keys (NewsAPI, CoinMarketCap, etc.)

## 🚀 Deployment

### Prerequisites

1. PostgreSQL database (Neon, Supabase, or self-hosted)
2. Node.js 18+ runtime
3. Environment variables configured

### Deploy to Production

1. Build the application:
   ```bash
   npm run build
   ```

2. Set production environment variables

3. Run database migrations:
   ```bash
   npm run db:push
   ```

4. Start the server:
   ```bash
   NODE_ENV=production npm start
   ```

### Recommended Platforms

- **Vercel** - Serverless deployment
- **Railway** - Full-stack deployment
- **Render** - Container deployment
- **AWS ECS** - Enterprise deployment
- **DigitalOcean App Platform** - Simple deployment

## 📚 Additional Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Express.js Guide](https://expressjs.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Security Guidelines](https://owasp.org/www-project-api-security/)

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add tests for new features
3. Update API documentation
4. Follow security guidelines
5. Use conventional commits

## 📄 License

MIT
