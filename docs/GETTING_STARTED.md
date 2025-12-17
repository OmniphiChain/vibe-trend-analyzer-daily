# Getting Started

This guide will help you set up the Vibe Trend Analyzer for local development.

## Prerequisites

- Node.js 18+
- Python 3.10+
- Docker (optional, for containerized development)

## Quick Start

### Option 1: Legacy Mode (Fastest)

The original combined server still works and is the fastest way to get started:

```bash
# Install dependencies
npm install

# Run development server (serves both frontend and backend on port 5000)
npm run dev
```

Visit http://localhost:5000

### Option 2: Microservices Mode

Run each service independently for a production-like setup:

```bash
# Terminal 1: Frontend
npm run dev:web
# → http://localhost:3000

# Terminal 2: Backend API
npm run dev:api
# → http://localhost:5000

# Terminal 3: NLP Service
npm run dev:nlp
# → http://localhost:8000
```

### Option 3: Docker

Run everything in containers:

```bash
# Development (with hot reload)
npm run docker:dev

# Production
npm run docker:up
```

## Project Structure

```
├── frontend/web/     # React dashboard
├── backend/api/      # Express API gateway
├── ai/nlp/           # NLP sentiment service
├── shared/           # Shared types & contracts
├── infra/            # Docker & deployment configs
└── docs/             # Documentation
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database (optional - uses in-memory if not set)
DATABASE_URL=postgresql://user:pass@host:5432/db

# External APIs (optional - uses mock data if not set)
NEWSAPI_KEY=your_key
COINMARKETCAP_API_KEY=your_key
TWITTER_BEARER_TOKEN=your_token
```

### NLP Service Setup

The NLP service requires Python and ML dependencies:

```bash
cd ai/nlp

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\Activate.ps1  # Windows PowerShell

# Install CPU-only PyTorch (smaller download)
pip install torch --index-url https://download.pytorch.org/whl/cpu

# Install other dependencies
pip install -r app/requirements.txt

# Run service
uvicorn app.main:app --reload --port 8000
```

First startup will download ~2GB of ML models.

## Testing the NLP Service

Once running, test the NLP service:

```bash
# Health check
curl http://localhost:8000/health

# Analyze text
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Apple reported record earnings today!"}'
```

## Common Commands

```bash
# Install all dependencies
npm install

# Run type checking
npm run check

# Build for production
npm run build

# Database migrations
npm run db:push
```

## Troubleshooting

### NLP Service Won't Start

1. Ensure Python 3.10+ is installed
2. Check that virtual environment is activated
3. Try reinstalling dependencies: `pip install -r app/requirements.txt --force-reinstall`

### Model Download Issues

If models fail to download:
1. Check internet connection
2. Set `HF_HOME` environment variable to a writable directory
3. Try manual download: `python -c "from transformers import pipeline; pipeline('sentiment-analysis', model='ProsusAI/finbert')"`

### Port Conflicts

Default ports: 3000 (web), 5000 (api), 8000 (nlp)

Change ports via environment variables or command line flags.

## Next Steps

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design details
- Explore the API at http://localhost:8000/docs (NLP service OpenAPI docs)
- Check [ai/nlp/README.md](../ai/nlp/README.md) for NLP-specific documentation
