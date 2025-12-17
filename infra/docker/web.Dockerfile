# =============================================================================
# Frontend Web App - Docker Image
# =============================================================================
#
# Build:  docker build -f infra/docker/web.Dockerfile -t vibe-web .
# Run:    docker run -d -p 3000:80 vibe-web

FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY frontend/web/package.json ./frontend/web/
COPY shared/package.json ./shared/

# Install dependencies
RUN npm ci --workspace=@vibe/web --workspace=@vibe/shared

# Copy source code
COPY frontend/web/ ./frontend/web/
COPY shared/ ./shared/

# Build
WORKDIR /app/frontend/web
RUN npm run build

# =============================================================================
# Production Stage - Nginx
# =============================================================================
FROM nginx:alpine

# Copy built static files
COPY --from=builder /app/frontend/web/dist /usr/share/nginx/html

# Nginx configuration for SPA
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /api { \
        proxy_pass http://api:5000; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
