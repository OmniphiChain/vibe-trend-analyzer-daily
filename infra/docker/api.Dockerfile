# =============================================================================
# Backend API Gateway - Docker Image
# =============================================================================
#
# Build:  docker build -f infra/docker/api.Dockerfile -t vibe-api .
# Run:    docker run -d -p 5000:5000 vibe-api

FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY backend/api/package.json ./backend/api/
COPY shared/package.json ./shared/

# Install dependencies
RUN npm ci --workspace=@vibe/api --workspace=@vibe/shared

# Copy source code
COPY backend/api/ ./backend/api/
COPY shared/ ./shared/

# Build
WORKDIR /app/backend/api
RUN npm run build

# =============================================================================
# Production Stage
# =============================================================================
FROM node:20-slim

WORKDIR /app

# Copy built assets
COPY --from=builder /app/backend/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Environment
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD node -e "fetch('http://localhost:5000/api/health').then(r => r.ok || process.exit(1)).catch(() => process.exit(1))" || exit 1

CMD ["node", "dist/index.js"]
