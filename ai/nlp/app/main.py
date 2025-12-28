"""
FastAPI NLP Sentiment Analysis Microservice

This is the main entry point for the NLP analysis API. It provides endpoints for:
- Financial sentiment analysis (ensemble of FinBERT models)
- Social media sentiment analysis (Twitter RoBERTa)
- Emotion classification
- Named entity recognition
- Combined full analysis

All models are loaded once at startup and stored in app.state for efficient reuse.

Startup Command:
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1

Note: Use workers=1 to ensure models are loaded only once in memory.
For production with multiple workers, consider using gunicorn with preload.
"""

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

from app.models import load_all_models, ModelRegistry
from app.schemas import (
    TextRequest,
    FinanceSentimentResponse,
    SocialSentimentResponse,
    EmotionResponse,
    NERResponse,
    FullAnalysisResponse,
    HealthResponse,
    ModelStatus,
    BatchTextRequest,
    BatchFinanceSentimentResponse,
    BatchSocialSentimentResponse,
    BatchEmotionResponse,
    BatchNERResponse,
    BatchFullAnalysisResponse,
    StreamAnalysisRequest,
    StreamBatchRequest,
    # Intelligence layer schemas
    IntelligenceRequest,
    IntelligenceResponse,
    IntelligenceFromTextRequest,
    IntelligenceFromTextResponse,
    BatchIntelligenceRequest,
    BatchIntelligenceResponse,
)
from app.services import (
    analyze_finance_sentiment,
    analyze_social_sentiment,
    analyze_emotion,
    analyze_entities,
    analyze_full,
    batch_finance_sentiment,
    batch_social_sentiment,
    batch_emotion,
    batch_entities,
    batch_full_analysis,
)
from app.streaming import (
    stream_single_analysis,
    stream_batch_analysis,
)
from app.intelligence import run_ai_layer, run_ai_layer_batch

# LLM layer (optional - gracefully degrades if not configured)
try:
    from app.llm.deepseek import deepseek_router
    LLM_AVAILABLE = True
except ImportError:
    LLM_AVAILABLE = False
    deepseek_router = None

# Scheduled summaries (optional - gracefully degrades if not configured)
try:
    from app.summaries import summaries_router, get_scheduler
    SUMMARIES_AVAILABLE = True
except ImportError:
    SUMMARIES_AVAILABLE = False
    summaries_router = None
    get_scheduler = None

# Batch analyze API (optional - gracefully degrades if not configured)
try:
    from app.api import batch_analyze_router
    BATCH_API_AVAILABLE = True
except ImportError:
    BATCH_API_AVAILABLE = False
    batch_analyze_router = None

# =============================================================================
# Logging Configuration
# =============================================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


# =============================================================================
# Application Lifespan (Startup/Shutdown)
# =============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan manager for model loading and cleanup.

    On startup:
    - Loads all HuggingFace models
    - Stores pipelines in app.state.models
    - Logs loading status

    On shutdown:
    - Cleans up resources (models are garbage collected)
    """
    logger.info("=" * 60)
    logger.info("NLP Sentiment Analysis Service Starting...")
    logger.info("=" * 60)

    # Load all models at startup
    try:
        app.state.models = load_all_models()
        logger.info("Model registry initialized successfully")
    except Exception as e:
        logger.error(f"Critical error loading models: {e}")
        # Create empty registry - service will be degraded but running
        app.state.models = ModelRegistry()

    # Log final startup status
    registry: ModelRegistry = app.state.models
    loaded_count = len(registry.get_loaded_models())
    logger.info("=" * 60)
    logger.info(f"Service Ready - {loaded_count}/5 models available")
    logger.info(f"Device: {registry.device}")
    logger.info("Swagger docs available at /docs")
    logger.info("=" * 60)

    # Start summary scheduler if available
    if SUMMARIES_AVAILABLE and get_scheduler:
        try:
            scheduler = get_scheduler()
            await scheduler.start()
            logger.info("Summary scheduler started")
        except Exception as e:
            logger.error(f"Failed to start summary scheduler: {e}")

    yield  # Application runs here

    # Shutdown
    logger.info("Shutting down NLP service...")

    # Stop summary scheduler
    if SUMMARIES_AVAILABLE and get_scheduler:
        try:
            scheduler = get_scheduler()
            await scheduler.stop()
            logger.info("Summary scheduler stopped")
        except Exception as e:
            logger.error(f"Error stopping summary scheduler: {e}")

    logger.info("Cleanup complete")


# =============================================================================
# FastAPI Application
# =============================================================================

app = FastAPI(
    title="NLP Sentiment Analysis API",
    description="""
A production-ready microservice for NLP analysis including:
- **Financial Sentiment**: Ensemble of ProsusAI/finbert and yiyanghkust/finbert-tone
- **Social Sentiment**: cardiffnlp/twitter-roberta-base-sentiment-latest
- **Emotion Classification**: michellejieli/emotion_text_classifier
- **Named Entity Recognition**: dslim/bert-base-NER

All models are loaded at startup for efficient inference.
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS middleware for cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include LLM router if available (optional capability)
if LLM_AVAILABLE and deepseek_router:
    app.include_router(deepseek_router)
    logger.info("DeepSeek LLM router registered at /llm")

# Include summaries router if available
if SUMMARIES_AVAILABLE and summaries_router:
    app.include_router(summaries_router)
    logger.info("Summaries router registered at /summaries")

# Include batch analyze router if available
if BATCH_API_AVAILABLE and batch_analyze_router:
    app.include_router(batch_analyze_router)
    logger.info("Batch analyze router registered at /batch-analyze")


# =============================================================================
# Helper Functions
# =============================================================================

def get_models(request: Request) -> ModelRegistry:
    """Get model registry from app state."""
    return request.app.state.models


# =============================================================================
# Health Check Endpoint
# =============================================================================

@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["Health"],
    summary="Check service health and model status",
)
async def health_check(request: Request) -> HealthResponse:
    """
    Health check endpoint returning service and model status.

    Returns:
    - Overall service status (healthy/degraded/unhealthy)
    - Device information (CPU/GPU)
    - Individual model loading status
    """
    registry = get_models(request)

    models_status = [
        ModelStatus(name="ProsusAI/finbert", loaded=registry.finbert is not None),
        ModelStatus(name="yiyanghkust/finbert-tone", loaded=registry.finbert_tone is not None),
        ModelStatus(name="cardiffnlp/twitter-roberta-base-sentiment-latest", loaded=registry.twitter_sentiment is not None),
        ModelStatus(name="michellejieli/emotion_text_classifier", loaded=registry.emotion_classifier is not None),
        ModelStatus(name="dslim/bert-base-NER", loaded=registry.ner_model is not None),
    ]

    loaded_count = sum(1 for m in models_status if m.loaded)
    total_models = len(models_status)

    # Determine overall status
    if loaded_count == total_models:
        status = "healthy"
    elif loaded_count > 0:
        status = "degraded"
    else:
        status = "unhealthy"

    return HealthResponse(
        status=status,
        device=registry.device,
        models=models_status,
        models_loaded=loaded_count,
        total_models=total_models,
    )


# =============================================================================
# Sentiment Endpoints
# =============================================================================

@app.post(
    "/sentiment/finance",
    response_model=FinanceSentimentResponse,
    tags=["Sentiment"],
    summary="Analyze financial sentiment",
)
async def finance_sentiment(
    request: Request,
    body: TextRequest,
) -> FinanceSentimentResponse:
    """
    Analyze financial sentiment using ensemble of FinBERT models.

    **Models used:**
    - ProsusAI/finbert (trained on financial news)
    - yiyanghkust/finbert-tone (fine-tuned on financial communications)

    **Returns:**
    - Individual model predictions with confidence scores
    - Ensemble sentiment (weighted combination)
    - Raw numeric score (-1 to +1 scale)
    """
    registry = get_models(request)

    if not registry.finbert or not registry.finbert_tone:
        raise HTTPException(
            status_code=503,
            detail="Financial sentiment models not available"
        )

    try:
        return analyze_finance_sentiment(
            text=body.text,
            finbert=registry.finbert,
            finbert_tone=registry.finbert_tone,
        )
    except Exception as e:
        logger.error(f"Finance sentiment analysis error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )


@app.post(
    "/sentiment/social",
    response_model=SocialSentimentResponse,
    tags=["Sentiment"],
    summary="Analyze social media sentiment",
)
async def social_sentiment(
    request: Request,
    body: TextRequest,
) -> SocialSentimentResponse:
    """
    Analyze social media sentiment using Twitter RoBERTa model.

    **Model used:**
    - cardiffnlp/twitter-roberta-base-sentiment-latest

    Best suited for:
    - Social media posts
    - Tweets
    - Informal text

    **Returns:**
    - Sentiment label (positive/neutral/negative)
    - Confidence score
    """
    registry = get_models(request)

    if not registry.twitter_sentiment:
        raise HTTPException(
            status_code=503,
            detail="Social sentiment model not available"
        )

    try:
        return analyze_social_sentiment(
            text=body.text,
            twitter_model=registry.twitter_sentiment,
        )
    except Exception as e:
        logger.error(f"Social sentiment analysis error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )


# =============================================================================
# Emotion Endpoint
# =============================================================================

@app.post(
    "/emotion",
    response_model=EmotionResponse,
    tags=["Emotion"],
    summary="Classify emotions in text",
)
async def emotion_classification(
    request: Request,
    body: TextRequest,
) -> EmotionResponse:
    """
    Classify emotions in text using emotion classifier.

    **Model used:**
    - michellejieli/emotion_text_classifier

    **Detected emotions include:**
    - Joy, Sadness, Anger, Fear, Surprise, Disgust, etc.

    **Returns:**
    - Full probability distribution across all emotions
    - Primary (highest-scoring) emotion
    """
    registry = get_models(request)

    if not registry.emotion_classifier:
        raise HTTPException(
            status_code=503,
            detail="Emotion classifier not available"
        )

    try:
        return analyze_emotion(
            text=body.text,
            emotion_model=registry.emotion_classifier,
        )
    except Exception as e:
        logger.error(f"Emotion classification error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )


# =============================================================================
# NER Endpoint
# =============================================================================

@app.post(
    "/ner",
    response_model=NERResponse,
    tags=["NER"],
    summary="Extract named entities",
)
async def named_entity_recognition(
    request: Request,
    body: TextRequest,
) -> NERResponse:
    """
    Extract named entities from text using BERT-NER.

    **Model used:**
    - dslim/bert-base-NER

    **Entity types detected:**
    - PERSON (PER) - People's names
    - ORGANIZATION (ORG) - Companies, institutions
    - LOCATION (LOC) - Places, countries, cities
    - MISCELLANEOUS (MISC) - Other named entities

    **Returns:**
    - List of entities with type, confidence, and character offsets
    """
    registry = get_models(request)

    if not registry.ner_model:
        raise HTTPException(
            status_code=503,
            detail="NER model not available"
        )

    try:
        return analyze_entities(
            text=body.text,
            ner_model=registry.ner_model,
        )
    except Exception as e:
        logger.error(f"NER analysis error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )


# =============================================================================
# Full Analysis Endpoint
# =============================================================================

@app.post(
    "/analyze",
    response_model=FullAnalysisResponse,
    tags=["Analysis"],
    summary="Run complete NLP analysis",
)
async def full_analysis(
    request: Request,
    body: TextRequest,
) -> FullAnalysisResponse:
    """
    Run comprehensive analysis using all available models.

    **Performs:**
    1. Financial sentiment (FinBERT ensemble)
    2. Social sentiment (Twitter RoBERTa)
    3. Emotion classification
    4. Named entity recognition

    Each analysis runs independently; failures in one don't affect others.
    Missing results indicate the corresponding model isn't loaded.

    **Returns:**
    - All analysis results in a single response
    """
    registry = get_models(request)

    try:
        return analyze_full(
            text=body.text,
            registry=registry,
        )
    except Exception as e:
        logger.error(f"Full analysis error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )


# =============================================================================
# Root Endpoint
# =============================================================================

# =============================================================================
# Batch Endpoints
# =============================================================================

@app.post(
    "/batch/sentiment/finance",
    response_model=BatchFinanceSentimentResponse,
    tags=["Batch"],
    summary="Batch analyze financial sentiment",
)
async def batch_finance_sentiment_endpoint(
    request: Request,
    body: BatchTextRequest,
) -> BatchFinanceSentimentResponse:
    """
    Analyze financial sentiment for multiple texts in a single request.

    **Models used:**
    - ProsusAI/finbert
    - yiyanghkust/finbert-tone

    **Limits:**
    - Maximum 100 texts per request

    **Returns:**
    - Results for each input text with ensemble scores
    """
    registry = get_models(request)

    if not registry.finbert or not registry.finbert_tone:
        raise HTTPException(
            status_code=503,
            detail="Financial sentiment models not available"
        )

    try:
        return batch_finance_sentiment(
            texts=body.texts,
            finbert=registry.finbert,
            finbert_tone=registry.finbert_tone,
        )
    except Exception as e:
        logger.error(f"Batch finance sentiment error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Batch analysis failed: {str(e)}"
        )


@app.post(
    "/batch/sentiment/social",
    response_model=BatchSocialSentimentResponse,
    tags=["Batch"],
    summary="Batch analyze social sentiment",
)
async def batch_social_sentiment_endpoint(
    request: Request,
    body: BatchTextRequest,
) -> BatchSocialSentimentResponse:
    """
    Analyze social media sentiment for multiple texts in a single request.

    **Model used:**
    - cardiffnlp/twitter-roberta-base-sentiment-latest

    **Limits:**
    - Maximum 100 texts per request

    **Returns:**
    - Sentiment label and confidence for each text
    """
    registry = get_models(request)

    if not registry.twitter_sentiment:
        raise HTTPException(
            status_code=503,
            detail="Social sentiment model not available"
        )

    try:
        return batch_social_sentiment(
            texts=body.texts,
            twitter_model=registry.twitter_sentiment,
        )
    except Exception as e:
        logger.error(f"Batch social sentiment error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Batch analysis failed: {str(e)}"
        )


@app.post(
    "/batch/emotion",
    response_model=BatchEmotionResponse,
    tags=["Batch"],
    summary="Batch classify emotions",
)
async def batch_emotion_endpoint(
    request: Request,
    body: BatchTextRequest,
) -> BatchEmotionResponse:
    """
    Classify emotions for multiple texts in a single request.

    **Model used:**
    - michellejieli/emotion_text_classifier

    **Limits:**
    - Maximum 100 texts per request

    **Returns:**
    - Full emotion distribution for each text
    """
    registry = get_models(request)

    if not registry.emotion_classifier:
        raise HTTPException(
            status_code=503,
            detail="Emotion classifier not available"
        )

    try:
        return batch_emotion(
            texts=body.texts,
            emotion_model=registry.emotion_classifier,
        )
    except Exception as e:
        logger.error(f"Batch emotion classification error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Batch analysis failed: {str(e)}"
        )


@app.post(
    "/batch/ner",
    response_model=BatchNERResponse,
    tags=["Batch"],
    summary="Batch extract named entities",
)
async def batch_ner_endpoint(
    request: Request,
    body: BatchTextRequest,
) -> BatchNERResponse:
    """
    Extract named entities from multiple texts in a single request.

    **Model used:**
    - dslim/bert-base-NER

    **Limits:**
    - Maximum 100 texts per request

    **Returns:**
    - Entities with types, confidence, and offsets for each text
    """
    registry = get_models(request)

    if not registry.ner_model:
        raise HTTPException(
            status_code=503,
            detail="NER model not available"
        )

    try:
        return batch_entities(
            texts=body.texts,
            ner_model=registry.ner_model,
        )
    except Exception as e:
        logger.error(f"Batch NER error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Batch analysis failed: {str(e)}"
        )


@app.post(
    "/batch/analyze",
    response_model=BatchFullAnalysisResponse,
    tags=["Batch"],
    summary="Batch run full analysis",
)
async def batch_full_analysis_endpoint(
    request: Request,
    body: BatchTextRequest,
) -> BatchFullAnalysisResponse:
    """
    Run comprehensive analysis on multiple texts using all models.

    **Models used:**
    - All 5 models (finance, social, emotion, NER)

    **Limits:**
    - Maximum 100 texts per request

    **Returns:**
    - Complete analysis results for each text
    """
    registry = get_models(request)

    try:
        return batch_full_analysis(
            texts=body.texts,
            registry=registry,
        )
    except Exception as e:
        logger.error(f"Batch full analysis error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Batch analysis failed: {str(e)}"
        )


# =============================================================================
# Streaming Endpoints (Server-Sent Events for Live Dashboard)
# =============================================================================

@app.post(
    "/stream/analyze",
    tags=["Streaming"],
    summary="Stream analysis with real-time updates",
)
async def stream_analysis(
    request: Request,
    body: StreamAnalysisRequest,
):
    """
    Stream NLP analysis results in real-time using Server-Sent Events (SSE).

    **Events emitted:**
    - `start` - Analysis beginning with model list
    - `progress` - Model starting to process
    - `model_complete` - Model finished with results
    - `complete` - All analysis done with full results
    - `error` - Error occurred

    **Usage (JavaScript):**
    ```javascript
    const eventSource = new EventSource('/stream/analyze?text=...');
    eventSource.addEventListener('model_complete', (e) => {
        const data = JSON.parse(e.data);
        updateDashboard(data);
    });
    ```

    **Models (optional):**
    - finance: Financial sentiment (FinBERT ensemble)
    - social: Social sentiment (Twitter RoBERTa)
    - emotion: Emotion classification
    - ner: Named entity recognition
    """
    registry = get_models(request)

    return StreamingResponse(
        stream_single_analysis(
            text=body.text,
            registry=registry,
            selected_models=body.models,
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Disable nginx buffering
        }
    )


@app.get(
    "/stream/analyze",
    tags=["Streaming"],
    summary="Stream analysis (GET for EventSource)",
)
async def stream_analysis_get(
    request: Request,
    text: str,
    models: str = None,
):
    """
    Stream NLP analysis via GET (for browser EventSource compatibility).

    **Query Parameters:**
    - text: Text to analyze (required)
    - models: Comma-separated model list (optional). Options: finance,social,emotion,ner

    **Usage (JavaScript):**
    ```javascript
    const text = encodeURIComponent("Apple stock soared today!");
    const eventSource = new EventSource(`/stream/analyze?text=${text}`);

    eventSource.addEventListener('start', (e) => {
        console.log('Starting analysis...');
    });

    eventSource.addEventListener('model_complete', (e) => {
        const data = JSON.parse(e.data);
        console.log(`${data.model} completed:`, data.result);
    });

    eventSource.addEventListener('complete', (e) => {
        const data = JSON.parse(e.data);
        console.log('Full result:', data.full_result);
        eventSource.close();
    });

    eventSource.onerror = (e) => {
        console.error('Stream error');
        eventSource.close();
    };
    ```
    """
    registry = get_models(request)

    # Parse models from comma-separated string
    selected_models = None
    if models:
        selected_models = [m.strip() for m in models.split(",")]

    return StreamingResponse(
        stream_single_analysis(
            text=text,
            registry=registry,
            selected_models=selected_models,
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@app.post(
    "/stream/batch",
    tags=["Streaming"],
    summary="Stream batch analysis with real-time updates",
)
async def stream_batch(
    request: Request,
    body: StreamBatchRequest,
):
    """
    Stream batch NLP analysis with per-text progress updates.

    **Events emitted:**
    - `batch_start` - Batch beginning
    - `text_start` - Starting analysis for a text
    - `progress` - Model starting
    - `model_complete` - Model finished
    - `text_complete` - Text analysis done
    - `batch_complete` - All texts done with full results

    **Limits:**
    - Maximum 50 texts per streaming request
    """
    registry = get_models(request)

    return StreamingResponse(
        stream_batch_analysis(
            texts=body.texts,
            registry=registry,
            selected_models=body.models,
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


# =============================================================================
# Root Endpoint
# =============================================================================

@app.get(
    "/",
    tags=["Info"],
    summary="API information",
)
async def root():
    """Root endpoint with API information."""
    endpoints = {
        "single": {
            "finance_sentiment": "POST /sentiment/finance",
            "social_sentiment": "POST /sentiment/social",
            "emotion": "POST /emotion",
            "ner": "POST /ner",
            "full_analysis": "POST /analyze",
        },
        "batch": {
            "finance_sentiment": "POST /batch/sentiment/finance",
            "social_sentiment": "POST /batch/sentiment/social",
            "emotion": "POST /batch/emotion",
            "ner": "POST /batch/ner",
            "full_analysis": "POST /batch/analyze",
        },
        "streaming": {
            "single_analysis": "GET/POST /stream/analyze",
            "batch_analysis": "POST /stream/batch",
        },
        "intelligence": {
            "analyze": "POST /intelligence/analyze",
            "analyze_text": "POST /intelligence/analyze-text",
            "batch": "POST /intelligence/batch",
        }
    }

    # Add LLM endpoints if available
    if LLM_AVAILABLE:
        endpoints["llm"] = {
            "explain": "POST /llm/explain",
            "daily_summary": "POST /llm/daily-summary",
            "narrative": "POST /llm/narrative",
            "usage": "GET /llm/usage",
            "health": "GET /llm/health",
        }

    # Add summaries endpoints if available
    if SUMMARIES_AVAILABLE:
        endpoints["summaries"] = {
            "hourly": "GET /summaries/hourly",
            "daily": "GET /summaries/daily",
            "sectors": "GET /summaries/sectors",
            "health": "GET /summaries/health",
            "stats": "GET /summaries/stats",
        }

    # Add batch analyze endpoints if available
    if BATCH_API_AVAILABLE:
        endpoints["batch"] = {
            "analyze": "POST /batch-analyze",
            "cache_stats": "GET /batch-analyze/cache/stats",
        }

    return {
        "service": "NLP Sentiment Analysis API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "llm_available": LLM_AVAILABLE,
        "summaries_available": SUMMARIES_AVAILABLE,
        "batch_api_available": BATCH_API_AVAILABLE,
        "endpoints": endpoints,
    }


# =============================================================================
# Intelligence Layer Endpoints (AI Brain)
# =============================================================================

@app.post(
    "/intelligence/analyze",
    response_model=IntelligenceResponse,
    tags=["Intelligence"],
    summary="Run AI intelligence analysis on model outputs",
)
async def intelligence_analyze(
    body: IntelligenceRequest,
) -> IntelligenceResponse:
    """
    Run the AI intelligence layer on pre-computed model outputs.

    This is the core AI brain endpoint that transforms raw NLP scores into
    actionable market intelligence. Use this when you already have model
    outputs and need dashboard-ready analysis.

    **Performs:**
    1. Sentiment fusion (weighted combination of model scores)
    2. Confidence scoring (based on agreement, volume, source reliability)
    3. Trend detection (compares against historical data)
    4. Emotion interpretation (maps to market psychology)
    5. Anomaly detection (statistical outlier flagging)

    **Input:**
    - Model scores from FinBERT, social sentiment, and emotion analysis
    - Optional historical scores for trend/anomaly detection
    - Sample volume and source type for confidence calculation

    **Output:**
    - Fused sentiment label and score
    - Confidence/reliability metric
    - Trend direction and strength
    - Market psychology interpretation
    - Anomaly flags with reasons
    """
    try:
        # Build model outputs dict for the AI layer
        model_outputs = {
            "finbert": body.finbert_score,
            "social": body.social_score,
            "emotion": body.emotion_score,
            "finbert_tone": body.finbert_tone_score,
        }

        # Run the AI intelligence layer
        result = run_ai_layer(
            model_outputs=model_outputs,
            historical_scores=body.historical_scores,
            sample_volume=body.sample_volume,
            source_type=body.source_type,
            primary_emotion=body.primary_emotion,
        )

        return IntelligenceResponse(**result)

    except Exception as e:
        logger.error(f"Intelligence analysis error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Intelligence analysis failed: {str(e)}"
        )


@app.post(
    "/intelligence/analyze-text",
    response_model=IntelligenceFromTextResponse,
    tags=["Intelligence"],
    summary="End-to-end intelligence analysis from raw text",
)
async def intelligence_analyze_text(
    request: Request,
    body: IntelligenceFromTextRequest,
) -> IntelligenceFromTextResponse:
    """
    Full end-to-end AI analysis pipeline from raw text.

    This endpoint runs the complete pipeline:
    1. NLP model inference (FinBERT, social, emotion)
    2. AI intelligence layer processing

    Use this for single-text analysis when you need both the raw
    model outputs and the intelligence interpretation.

    **Models used:**
    - ProsusAI/finbert (financial sentiment)
    - cardiffnlp/twitter-roberta-base-sentiment-latest (social sentiment)
    - michellejieli/emotion_text_classifier (emotion)

    **Returns:**
    - Raw model scores for transparency
    - Full intelligence analysis for dashboards
    """
    registry = get_models(request)

    try:
        # Step 1: Run NLP models to get scores
        # Financial sentiment
        finbert_score = 0.0
        if registry.finbert:
            try:
                finance_result = analyze_finance_sentiment(
                    text=body.text,
                    finbert=registry.finbert,
                    finbert_tone=registry.finbert_tone,
                )
                finbert_score = finance_result.ensemble.raw_score
            except Exception as e:
                logger.warning(f"FinBERT analysis failed: {e}")

        # Social sentiment
        social_score = 0.0
        if registry.twitter_sentiment:
            try:
                social_result = analyze_social_sentiment(
                    text=body.text,
                    twitter_model=registry.twitter_sentiment,
                )
                # Convert label to score: positive=+1, neutral=0, negative=-1
                label_map = {"positive": 1.0, "neutral": 0.0, "negative": -1.0}
                social_score = label_map.get(social_result.label.lower(), 0.0)
                # Weight by confidence
                social_score *= social_result.confidence
            except Exception as e:
                logger.warning(f"Social analysis failed: {e}")

        # Emotion classification
        emotion_score = 0.0
        primary_emotion = "neutral"
        if registry.emotion_classifier:
            try:
                emotion_result = analyze_emotion(
                    text=body.text,
                    emotion_model=registry.emotion_classifier,
                )
                primary_emotion = emotion_result.primary_emotion

                # Map emotion to sentiment modifier
                emotion_sentiment_map = {
                    "fear": -0.7,
                    "anger": -0.5,
                    "sadness": -0.6,
                    "disgust": -0.4,
                    "joy": 0.7,
                    "surprise": 0.0,
                    "neutral": 0.0,
                }
                emotion_score = emotion_sentiment_map.get(
                    primary_emotion.lower(), 0.0
                ) * emotion_result.primary_score
            except Exception as e:
                logger.warning(f"Emotion analysis failed: {e}")

        # Step 2: Run AI intelligence layer
        model_outputs = {
            "finbert": finbert_score,
            "social": social_score,
            "emotion": emotion_score,
        }

        result = run_ai_layer(
            model_outputs=model_outputs,
            historical_scores=body.historical_scores,
            sample_volume=body.sample_volume,
            source_type=body.source_type,
            primary_emotion=primary_emotion,
        )

        return IntelligenceFromTextResponse(
            text=body.text,
            model_outputs={
                "finbert": finbert_score,
                "social": social_score,
                "emotion": emotion_score,
                "primary_emotion": primary_emotion,
            },
            intelligence=IntelligenceResponse(**result),
        )

    except Exception as e:
        logger.error(f"Intelligence text analysis error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Intelligence analysis failed: {str(e)}"
        )


@app.post(
    "/intelligence/batch",
    response_model=BatchIntelligenceResponse,
    tags=["Intelligence"],
    summary="Batch AI intelligence analysis",
)
async def intelligence_batch(
    body: BatchIntelligenceRequest,
) -> BatchIntelligenceResponse:
    """
    Process multiple intelligence analyses in batch.

    Efficient batch processing for multiple sets of model outputs.
    Use this when you have pre-computed NLP scores for multiple texts.

    **Limits:**
    - Maximum 100 items per request

    **Returns:**
    - Intelligence analysis for each input
    """
    try:
        # Convert request items to batch input format
        batch_inputs = []
        for item in body.items:
            batch_inputs.append({
                "model_outputs": {
                    "finbert": item.finbert_score,
                    "social": item.social_score,
                    "emotion": item.emotion_score,
                    "finbert_tone": item.finbert_tone_score,
                },
                "historical_scores": item.historical_scores,
                "sample_volume": item.sample_volume,
                "source_type": item.source_type,
                "primary_emotion": item.primary_emotion,
            })

        # Run batch processing
        results = run_ai_layer_batch(batch_inputs)

        return BatchIntelligenceResponse(
            results=[IntelligenceResponse(**r) for r in results],
            count=len(results),
        )

    except Exception as e:
        logger.error(f"Batch intelligence analysis error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Batch intelligence analysis failed: {str(e)}"
        )


# =============================================================================
# Error Handlers
# =============================================================================

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled errors."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "type": type(exc).__name__,
        }
    )


# =============================================================================
# Main Entry Point
# =============================================================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,  # Disable reload in production
        workers=1,  # Single worker to share model memory
        log_level="info",
    )
