# Vibe Trend Analyzer - Architecture

This document describes the monorepo architecture and how the different services interact.

## Overview

```
vibe-trend-analyzer/
├── frontend/           # Client-side applications
│   └── web/           # React web dashboard
├── backend/           # Server-side services
│   └── api/           # Express API gateway
├── ai/                # AI/ML microservices
│   └── nlp/           # NLP sentiment analysis (FastAPI + Transformers)
├── shared/            # Shared code across all packages
│   ├── contracts/     # API contracts/DTOs
│   ├── types/         # Common TypeScript types
│   └── schema.ts      # Database schema
├── infra/             # Infrastructure and deployment
│   ├── docker/        # Dockerfiles for each service
│   └── scripts/       # Deployment and setup scripts
├── docs/              # Documentation
├── server/            # [Legacy] Original server code
├── client/            # [Legacy] Original client code
└── app/               # [Legacy] Original NLP code
```

## Service Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │               React Dashboard (frontend/web)              │   │
│  │  - Market data visualization                              │   │
│  │  - Sentiment analysis UI                                  │   │
│  │  - Real-time streaming updates                            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP/WebSocket
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │            API Gateway (backend/api)                      │   │
│  │  - Authentication & authorization                         │   │
│  │  - Request routing & orchestration                        │   │
│  │  - External API proxies (News, Crypto, Stock)             │   │
│  │  - Rate limiting & caching                                │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Internal HTTP
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                           AI                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │          NLP Service (ai/nlp)                             │   │
│  │  - Financial sentiment (FinBERT)                          │   │
│  │  - Social sentiment (RoBERTa)                             │   │
│  │  - Emotion classification                                 │   │
│  │  - Named entity recognition                               │   │
│  │  - Server-Sent Events streaming                           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Key Design Principles

### 1. Separation of Concerns

- **Frontend**: Presentation logic only. No ML models, no direct database access.
- **Backend**: Business logic, orchestration, authentication. Calls AI services but never loads models.
- **AI Services**: ML inference only. Stateless, horizontally scalable.
- **Shared**: Type definitions and contracts used across all packages.

### 2. API Gateway Pattern

The backend API acts as a gateway that:
- Proxies requests to external APIs (NewsAPI, CoinMarketCap, Finnhub)
- Routes NLP requests to the AI microservice
- Handles authentication and rate limiting
- Provides a unified API for the frontend

### 3. Microservice Communication

```
Frontend  →  /api/*        →  Backend API Gateway
Backend   →  /nlp/*        →  NLP Service (internal)
Backend   →  External APIs →  NewsAPI, CoinMarketCap, etc.
```

### 4. Shared Contracts

All services use shared TypeScript types from `shared/contracts/`:
- `nlp.ts`: NLP request/response types
- `market.ts`: Market data types

This ensures type safety across the entire stack.

## Data Flow Examples

### Sentiment Analysis Request

```
1. User enters text in dashboard
2. Frontend POST /api/nlp/analyze
3. Backend validates request
4. Backend forwards to NLP service POST /analyze
5. NLP service runs models (FinBERT, RoBERTa, etc.)
6. NLP returns structured response
7. Backend returns response to frontend
8. Frontend displays results
```

### Streaming Analysis

```
1. User clicks "Analyze (Streaming)"
2. Frontend connects to EventSource /api/stream/analyze
3. Backend proxies SSE connection to NLP /stream/analyze
4. NLP streams events: start → progress → model_complete → complete
5. Frontend updates UI in real-time as events arrive
```

## Port Assignments

| Service | Development Port | Production Port |
|---------|-----------------|-----------------|
| Frontend | 3000 | 80 (nginx) |
| Backend API | 5000 | 5000 |
| NLP Service | 8000 | 8000 |

## Environment Variables

### Backend API
- `DATABASE_URL`: PostgreSQL connection string
- `NLP_SERVICE_URL`: URL to NLP service (default: http://localhost:8000)
- `NEWSAPI_KEY`: NewsAPI API key
- `COINMARKETCAP_API_KEY`: CoinMarketCap API key
- `TWITTER_BEARER_TOKEN`: Twitter/X API bearer token

### NLP Service
- `TRANSFORMERS_CACHE`: Path to model cache
- `HF_HOME`: HuggingFace home directory

## Development Workflow

### Running Services Individually

```bash
# Frontend (React)
npm run dev:web

# Backend (Express)
npm run dev:api

# NLP Service (FastAPI)
npm run dev:nlp
```

### Running with Docker

```bash
# Development (with hot reload)
npm run docker:dev

# Production
npm run docker:up
```

### Running Legacy Mode

The original combined server/client still works:

```bash
npm run dev  # or npm run dev:legacy
```

## Future Considerations

1. **Additional AI Services**: Add more services under `ai/` (e.g., `ai/vision/`, `ai/speech/`)
2. **Mobile App**: Add `frontend/mobile/` for React Native
3. **Admin Dashboard**: Add `frontend/admin/` for admin interface
4. **Message Queue**: Add Redis/RabbitMQ for async processing
5. **Model Serving**: Consider moving to TensorFlow Serving or Triton for production
