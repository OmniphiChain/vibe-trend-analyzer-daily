# =============================================================================
# NLP Sentiment Analysis Service - Docker Image
# Optimized for CPU-only VPS deployment
# =============================================================================
#
# Build:  docker build -f infra/docker/nlp.Dockerfile -t nlp-api .
# Run:    docker run -d -p 8000:8000 -v nlp_cache:/app/.cache nlp-api
#
# VPS Requirements: Minimum 4GB RAM, 8GB recommended

FROM python:3.11-slim AS builder

WORKDIR /build

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy requirements
COPY ai/nlp/app/requirements.txt .

# Install CPU-only PyTorch (saves ~2GB vs full CUDA version)
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements.txt

# =============================================================================
# Production Stage
# =============================================================================
FROM python:3.11-slim

WORKDIR /app

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    TRANSFORMERS_CACHE=/app/.cache/huggingface \
    HF_HOME=/app/.cache/huggingface \
    OMP_NUM_THREADS=2 \
    MKL_NUM_THREADS=2

# Copy application code from new monorepo location
COPY ai/nlp/app/ ./app/

# Create cache directory and non-root user
RUN mkdir -p /app/.cache/huggingface && \
    useradd --create-home --uid 1000 appuser && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

# Health check with longer start period for model loading
HEALTHCHECK --interval=30s --timeout=10s --start-period=180s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# Run with single worker (models shared in memory)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1", "--timeout-keep-alive", "30"]
