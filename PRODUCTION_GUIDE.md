# Vibe Trend Analyzer - Production Deployment Guide

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Setup NLP service (one-time)
# Windows:
npm run nlp:setup
# Unix/Mac:
npm run nlp:setup:unix

# 3. Start all services
npm run dev:all
```

This starts:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **NLP Service**: http://localhost:8000

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        NGINX / CDN                          │
│                    (SSL termination)                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌───────────┐  ┌───────────┐  ┌───────────┐
│  Frontend │  │  Backend  │  │    NLP    │
│   :3000   │  │   :5000   │  │   :8000   │
│   React   │  │  Express  │  │  FastAPI  │
└───────────┘  └─────┬─────┘  └───────────┘
                     │
           ┌─────────┼─────────┐
           ▼                   ▼
    ┌───────────┐       ┌───────────┐
    │   Redis   │       │ PostgreSQL│
    │   :6379   │       │  (Neon)   │
    └───────────┘       └───────────┘
```

---

## Environment Setup

### 1. Backend API (`backend/api/.env`)

```bash
# Required
DATABASE_URL=postgresql://...
JWT_SECRET=<generate-new-secret>
JWT_REFRESH_SECRET=<generate-new-secret>
SESSION_SECRET=<generate-new-secret>
NLP_SERVICE_URL=http://localhost:8000

# Generate secrets with:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. NLP Service (`ai/nlp/.env`)

```bash
DEEPSEEK_API_KEY=sk-your-api-key
```

### 3. Frontend (`frontend/web/.env`)

```bash
VITE_DATABASE_URL=http://localhost:5000/api
```

---

## Database Setup

```bash
# Push schema to database
npm run db:push

# Verify connection
npm run dev:api
# Check logs for "💾 Database: Connected"
```

---

## Docker Deployment

### Build & Run

```bash
# Build all images
npm run docker:build

# Start production containers
npm run docker:up

# View logs
docker-compose -f infra/docker-compose.yml logs -f

# Stop containers
npm run docker:down
```

### Docker Compose Services

| Service | Port | Health Check |
|---------|------|--------------|
| web | 3000 | `/` |
| api | 5000 | `/api/health` |
| nlp | 8000 | `/health` |

---

## Production Checklist

### Security (Critical)

- [ ] **Rotate all secrets** - Generate new JWT_SECRET, JWT_REFRESH_SECRET, SESSION_SECRET
- [ ] **Enable HTTPS** - Configure SSL certificates
- [ ] **Set CORS origins** - Update ALLOWED_ORIGINS with production domains
- [ ] **Remove .env from git** - Add to .gitignore, use secrets manager
- [ ] **Enable rate limiting** - Configure Redis for distributed limiting

### Database

- [ ] **Run migrations** - `npm run db:push`
- [ ] **Enable backups** - Configure Neon automatic backups
- [ ] **Set up connection pooling** - Neon pooler already configured

### Monitoring

- [ ] **Set up error tracking** - Add Sentry DSN to environment
- [ ] **Configure logging** - Enable structured JSON logging
- [ ] **Set up health checks** - Monitor `/api/health` and `/health`
- [ ] **Add uptime monitoring** - Use services like UptimeRobot

### Performance

- [ ] **Enable CDN** - CloudFlare or similar for static assets
- [ ] **Configure caching** - Redis for session storage
- [ ] **Optimize images** - Use WebP format, lazy loading

---

## API Endpoints

### Health Checks

```bash
# Backend health
curl http://localhost:5000/api/health

# NLP service health
curl http://localhost:8000/health
```

### Authentication

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Sentiment Analysis

```bash
# Single text analysis
curl -X POST http://localhost:8000/sentiment/finance \
  -H "Content-Type: application/json" \
  -d '{"text":"Apple stock is surging after strong earnings"}'

# Batch analysis
curl -X POST http://localhost:8000/batch/finance \
  -H "Content-Type: application/json" \
  -d '{"texts":["Stock is up","Market crashed"]}'
```

---

## Scaling

### Horizontal Scaling

```yaml
# docker-compose.prod.yml
services:
  api:
    deploy:
      replicas: 3

  nlp:
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 8G
```

### Redis for Session Storage

```bash
# Add to backend/.env
REDIS_URL=redis://localhost:6379

# Update rate limiting and session storage
```

---

## Troubleshooting

### Common Issues

**1. Database connection failed**
```bash
# Check DATABASE_URL format
# Ensure Neon is accessible from your IP
# Verify sslmode=require is set
```

**2. NLP service timeout**
```bash
# First request may be slow (model loading)
# Increase timeout to 180s for initial load
# Check memory limits (needs 8GB for all models)
```

**3. Frontend can't reach API**
```bash
# Check CORS configuration
# Verify proxy settings in vite.config.ts
# Ensure backend is running on port 5000
```

**4. JWT errors**
```bash
# Ensure JWT_SECRET is set
# Check token expiration
# Verify refresh token flow
```

---

## Monitoring Commands

```bash
# Check container status
docker ps

# View logs
docker-compose -f infra/docker-compose.yml logs -f api

# Check resource usage
docker stats

# Restart service
docker-compose -f infra/docker-compose.yml restart api
```

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) automatically:

1. **Lint & Type Check** - Runs on every push
2. **Build Frontend/Backend** - Creates production bundles
3. **Test NLP Service** - Runs Python tests
4. **Build Docker Images** - Pushes to GitHub Container Registry
5. **Deploy** - Deploys to production on main branch

### Required Secrets

Add these to GitHub repository settings:

- `DEEPSEEK_API_KEY` - For NLP service tests
- `DATABASE_URL` - For integration tests (optional)

---

## Support

- **Documentation**: See `backend/api/README.md` for API details
- **Issues**: https://github.com/your-repo/issues
