# NLP Sentiment Analysis Service

Production-ready FastAPI microservice for NLP sentiment, emotion, and entity analysis using HuggingFace Transformers.

## Models

This service uses the following pre-trained models:

| Model | Purpose | Source |
|-------|---------|--------|
| ProsusAI/finbert | Financial sentiment analysis | HuggingFace |
| yiyanghkust/finbert-tone | Financial tone analysis | HuggingFace |
| cardiffnlp/twitter-roberta-base-sentiment-latest | Social media sentiment | HuggingFace |
| michellejieli/emotion_text_classifier | Emotion classification | HuggingFace |
| dslim/bert-base-NER | Named entity recognition | HuggingFace |

## API Endpoints

### Single Text Analysis
- `POST /sentiment/finance` - Financial sentiment analysis
- `POST /sentiment/social` - Social media sentiment analysis
- `POST /emotion` - Emotion classification
- `POST /ner` - Named entity recognition
- `POST /analyze` - Full analysis (all models)

### Batch Processing
- `POST /batch/sentiment/finance` - Batch financial sentiment
- `POST /batch/sentiment/social` - Batch social sentiment
- `POST /batch/emotion` - Batch emotion classification
- `POST /batch/ner` - Batch NER
- `POST /batch/analyze` - Batch full analysis

### Streaming (SSE)
- `GET /stream/analyze` - Stream single text analysis
- `POST /stream/analyze` - Stream single text analysis
- `POST /stream/batch` - Stream batch analysis

### Health
- `GET /health` - Health check with model status

## Local Development

### Using PowerShell (Windows)
```powershell
.\run_local.ps1
```

### Manual Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
.\venv\Scripts\Activate.ps1  # Windows PowerShell

# Install CPU-only PyTorch
pip install torch --index-url https://download.pytorch.org/whl/cpu

# Install dependencies
pip install -r app/requirements.txt

# Run server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

## Docker Deployment

```bash
# Build image
docker build -t nlp-sentiment-service .

# Run container
docker run -p 8000:8000 nlp-sentiment-service
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NLP_HOST` | Host to bind to | `0.0.0.0` |
| `NLP_PORT` | Port to listen on | `8000` |
| `TRANSFORMERS_CACHE` | Model cache directory | `/app/.cache/huggingface` |

## Architecture

```
ai/nlp/
├── app/
│   ├── __init__.py      # Package initialization
│   ├── main.py          # FastAPI application
│   ├── models.py        # Model loading and registry
│   ├── schemas.py       # Pydantic request/response models
│   ├── services.py      # Inference logic
│   ├── streaming.py     # SSE streaming support
│   ├── utils.py         # Helper functions
│   └── requirements.txt # Python dependencies
├── Dockerfile           # Docker build configuration
├── pyproject.toml       # Python project metadata
└── README.md            # This file
```
