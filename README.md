# Vibe Trend Analyzer

A real-time market sentiment analysis platform powered by AI/ML models. Analyze financial news, social media, and market data to gauge market mood and sentiment.

## Features

- **Financial Sentiment Analysis** - FinBERT-powered sentiment scoring for financial text
- **Social Media Sentiment** - RoBERTa-based analysis for social content
- **Emotion Detection** - Multi-label emotion classification
- **Named Entity Recognition** - Extract companies, people, and locations
- **Real-time Streaming** - Server-Sent Events for live dashboard updates
- **Batch Processing** - Analyze multiple texts in a single request

## Architecture

```
├── frontend/web/     # React dashboard with Tailwind CSS
├── backend/api/      # Express.js API gateway
├── ai/nlp/           # FastAPI NLP microservice
├── shared/           # Shared TypeScript types & contracts
├── infra/            # Docker & deployment configs
└── docs/             # Documentation
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- Docker (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/OmniphiChain/vibe-trend-analyzer-daily.git
cd vibe-trend-analyzer-daily

# Install Node dependencies
npm install

# Setup NLP service (first time only)
cd ai/nlp
python -m venv venv
source venv/bin/activate  # or .\venv\Scripts\Activate.ps1 on Windows
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install -r app/requirements.txt
```

### Running Services

```bash
# Backend API (port 5000)
npm run dev:api

# Frontend (port 3000)
npm run dev:web

# NLP Service (port 8000)
npm run dev:nlp
```

### Docker Deployment

```bash
# Start all services
npm run docker:up

# Stop services
npm run docker:down
```

## API Endpoints

### NLP Service (port 8000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/sentiment/finance` | POST | Financial sentiment analysis |
| `/sentiment/social` | POST | Social media sentiment |
| `/emotion` | POST | Emotion classification |
| `/ner` | POST | Named entity recognition |
| `/analyze` | POST | Full analysis (all models) |
| `/stream/analyze` | GET/POST | Streaming analysis (SSE) |

### Example Request

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Apple reported record earnings. CEO Tim Cook is optimistic about AI."}'
```

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Recharts
- **Backend**: Express.js, TypeScript, Drizzle ORM
- **AI/ML**: FastAPI, HuggingFace Transformers, PyTorch
- **Database**: PostgreSQL (Neon)
- **Infrastructure**: Docker, Nginx

## Models Used

| Model | Purpose |
|-------|---------|
| ProsusAI/finbert | Financial sentiment |
| yiyanghkust/finbert-tone | Financial tone |
| cardiffnlp/twitter-roberta-base-sentiment-latest | Social sentiment |
| michellejieli/emotion_text_classifier | Emotion detection |
| dslim/bert-base-NER | Named entities |

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://...
NEWSAPI_KEY=your_key
COINMARKETCAP_API_KEY=your_key
```

## Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Getting Started Guide](docs/GETTING_STARTED.md)
- [NLP Service Documentation](ai/nlp/README.md)

## License

MIT
