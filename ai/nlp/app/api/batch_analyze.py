# ============================================================================
# BATCH ANALYZE API
# Optimized batch inference with caching and adaptive sizing
# ============================================================================
#
# Execution Flow:
# 1. Accept list of texts
# 2. Normalize + hash each text
# 3. Check cache for each text
# 4. Split into cached / uncached texts
# 5. Determine batch size (user-provided or adaptive)
# 6. Chunk uncached texts into batches
# 7. Run inference batch-by-batch
# 8. Store new results in cache
# 9. Merge cached + new results
# 10. Return results in ORIGINAL ORDER
#
# Guarantees:
# - Output order == input order
# - Cached vs uncached results are indistinguishable
# - No inference on cached inputs
# ============================================================================

import logging
import time
from typing import Optional, List, Dict, Any

from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, Field

from app.core.cache import InferenceCache, get_cache, normalize_text
from app.core.batching import (
    chunk_texts,
    BatchConfig,
    BatchingStats,
    MIN_BATCH_SIZE,
    MAX_BATCH_SIZE,
    calculate_num_batches,
)
from app.core.adaptive import get_batch_sizer

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Batch Analysis"])


# ============================================================================
# REQUEST / RESPONSE SCHEMAS
# ============================================================================

class BatchAnalyzeRequest(BaseModel):
    """Request for batch analysis with optional batch size."""
    texts: List[str] = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="List of texts to analyze",
    )
    batch_size: Optional[int] = Field(
        None,
        ge=MIN_BATCH_SIZE,
        le=MAX_BATCH_SIZE,
        description=f"Optional batch size ({MIN_BATCH_SIZE}-{MAX_BATCH_SIZE}). If not provided, system determines optimal size.",
    )


class AnalysisResult(BaseModel):
    """Single text analysis result."""
    sentiment: float = Field(..., ge=-1.0, le=1.0, description="Sentiment score")
    emotion: str = Field(..., description="Primary emotion")
    entities: List[str] = Field(default_factory=list, description="Named entities")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")


class BatchAnalyzeResponse(BaseModel):
    """Response for batch analysis."""
    results: List[AnalysisResult] = Field(..., description="Analysis results in input order")
    stats: Optional[Dict[str, Any]] = Field(None, description="Processing statistics")


# ============================================================================
# INFERENCE HELPERS
# ============================================================================

def run_single_inference(
    text: str,
    registry: Any,
) -> Dict[str, Any]:
    """
    Run full analysis on a single text using existing services.

    This calls the existing core engine without modification.
    Returns a simplified result dict for caching.
    """
    from app.services import analyze_full

    try:
        result = analyze_full(text=text, registry=registry)

        # Extract key metrics for cached result
        sentiment_score = 0.0
        confidence = 0.5
        primary_emotion = "neutral"
        entities = []

        # Get sentiment from finance or social
        if result.finance_sentiment and result.finance_sentiment.ensemble:
            sentiment_score = result.finance_sentiment.ensemble.raw_score
            confidence = result.finance_sentiment.ensemble.confidence
        elif result.social_sentiment:
            # Map label to score
            label_map = {"positive": 0.5, "neutral": 0.0, "negative": -0.5}
            sentiment_score = label_map.get(result.social_sentiment.label.lower(), 0.0)
            confidence = result.social_sentiment.confidence

        # Get emotion
        if result.emotion:
            primary_emotion = result.emotion.primary_emotion
            # Use emotion confidence if higher
            if result.emotion.primary_score > confidence:
                confidence = result.emotion.primary_score

        # Get entities
        if result.ner and result.ner.entities:
            entities = [e.text for e in result.ner.entities[:10]]  # Limit to 10

        return {
            "sentiment": round(sentiment_score, 3),
            "emotion": primary_emotion,
            "entities": entities,
            "confidence": round(confidence, 3),
        }

    except Exception as e:
        logger.error(f"Inference error: {e}")
        # Return neutral fallback
        return {
            "sentiment": 0.0,
            "emotion": "neutral",
            "entities": [],
            "confidence": 0.0,
        }


def run_batch_inference(
    texts: List[str],
    registry: Any,
) -> List[Dict[str, Any]]:
    """
    Run full analysis on a batch of texts.

    Uses existing batch_full_analysis for efficiency.
    """
    from app.services import batch_full_analysis

    try:
        batch_result = batch_full_analysis(texts=texts, registry=registry)

        results = []
        for item in batch_result.results:
            # Extract key metrics
            sentiment_score = 0.0
            confidence = 0.5
            primary_emotion = "neutral"
            entities = []

            if item.finance_sentiment and item.finance_sentiment.ensemble:
                sentiment_score = item.finance_sentiment.ensemble.raw_score
                confidence = item.finance_sentiment.ensemble.confidence
            elif item.social_sentiment:
                label_map = {"positive": 0.5, "neutral": 0.0, "negative": -0.5}
                sentiment_score = label_map.get(item.social_sentiment.label.lower(), 0.0)
                confidence = item.social_sentiment.confidence

            if item.emotion:
                primary_emotion = item.emotion.primary_emotion
                if item.emotion.primary_score > confidence:
                    confidence = item.emotion.primary_score

            if item.ner and item.ner.entities:
                entities = [e.text for e in item.ner.entities[:10]]

            results.append({
                "sentiment": round(sentiment_score, 3),
                "emotion": primary_emotion,
                "entities": entities,
                "confidence": round(confidence, 3),
            })

        return results

    except Exception as e:
        logger.error(f"Batch inference error: {e}")
        # Return neutral fallbacks for all texts
        return [
            {"sentiment": 0.0, "emotion": "neutral", "entities": [], "confidence": 0.0}
            for _ in texts
        ]


# ============================================================================
# BATCH ANALYZE ENDPOINT
# ============================================================================

@router.post("/batch-analyze", response_model=BatchAnalyzeResponse)
async def batch_analyze(
    request: Request,
    body: BatchAnalyzeRequest,
) -> BatchAnalyzeResponse:
    """
    Analyze multiple texts with batching, caching, and adaptive sizing.

    **Features:**
    - Cache lookup before inference (no duplicate work)
    - Optional user-defined batch size
    - Adaptive batch sizing based on CPU load
    - Results returned in original input order

    **Batch Size:**
    - If `batch_size` provided: used (clamped to 4-32)
    - If not provided: system determines based on CPU load

    **Caching:**
    - Normalized text hashed as cache key
    - 24-hour TTL
    - Cached results returned instantly
    """
    start_time = time.time()
    texts = body.texts
    total_texts = len(texts)

    if total_texts == 0:
        return BatchAnalyzeResponse(results=[], stats={"total_texts": 0})

    # Get cache and batch sizer
    cache = get_cache()
    batch_sizer = get_batch_sizer()

    # Get model registry from app state
    registry = request.app.state.models

    # =========================================================================
    # Step 1: Check cache for all texts
    # =========================================================================
    cached_results: Dict[int, Dict[str, Any]] = {}  # index -> result
    uncached_indices: List[int] = []
    uncached_texts: List[str] = []

    for i, text in enumerate(texts):
        cached = cache.get(text)
        if cached is not None:
            cached_results[i] = cached
        else:
            uncached_indices.append(i)
            uncached_texts.append(text)

    cached_count = len(cached_results)
    uncached_count = len(uncached_texts)

    logger.info(f"Cache lookup: {cached_count}/{total_texts} hits")

    # =========================================================================
    # Step 2: Determine batch size
    # =========================================================================
    if body.batch_size is not None:
        # User-provided batch size
        batch_config = BatchConfig.from_user(body.batch_size)
    else:
        # Adaptive batch size
        cache_stats = cache.get_stats()
        batch_config = batch_sizer.compute_batch_size(
            pending_texts=uncached_count,
            cache_hit_ratio=cache_stats.get("hit_ratio", 0.0),
        )

    batch_size = batch_config.batch_size
    num_batches = calculate_num_batches(uncached_count, batch_size)

    # =========================================================================
    # Step 3: Process uncached texts in batches
    # =========================================================================
    new_results: Dict[int, Dict[str, Any]] = {}

    if uncached_count > 0:
        batch_num = 0
        text_idx = 0

        for batch_texts in chunk_texts(uncached_texts, batch_size):
            batch_num += 1
            logger.debug(f"Processing batch {batch_num}/{num_batches} ({len(batch_texts)} texts)")

            # Run inference on batch
            batch_results = run_batch_inference(batch_texts, registry)

            # Map results back to original indices and cache them
            for j, result in enumerate(batch_results):
                original_idx = uncached_indices[text_idx + j]
                original_text = texts[original_idx]

                new_results[original_idx] = result

                # Store in cache
                cache.set(original_text, result)

            text_idx += len(batch_texts)

    # =========================================================================
    # Step 4: Merge results in original order
    # =========================================================================
    final_results: List[AnalysisResult] = []

    for i in range(total_texts):
        if i in cached_results:
            result_dict = cached_results[i]
        elif i in new_results:
            result_dict = new_results[i]
        else:
            # Should never happen, but fallback just in case
            result_dict = {
                "sentiment": 0.0,
                "emotion": "neutral",
                "entities": [],
                "confidence": 0.0,
            }

        final_results.append(AnalysisResult(**result_dict))

    # =========================================================================
    # Step 5: Build stats
    # =========================================================================
    elapsed_ms = int((time.time() - start_time) * 1000)

    stats = BatchingStats(
        total_texts=total_texts,
        cached_texts=cached_count,
        uncached_texts=uncached_count,
        batch_size=batch_size,
        num_batches=num_batches,
        batch_source=batch_config.source,
    )

    logger.info(
        f"Batch analyze complete: {total_texts} texts, "
        f"{cached_count} cached, {num_batches} batches, "
        f"batch_size={batch_size} ({batch_config.source}), "
        f"{elapsed_ms}ms"
    )

    return BatchAnalyzeResponse(
        results=final_results,
        stats={
            **stats.to_dict(),
            "elapsed_ms": elapsed_ms,
        },
    )


# ============================================================================
# CACHE MANAGEMENT ENDPOINTS
# ============================================================================

@router.get("/batch-analyze/cache/stats")
async def get_cache_stats() -> Dict[str, Any]:
    """Get cache statistics."""
    cache = get_cache()
    return cache.get_stats()


@router.post("/batch-analyze/cache/clear", include_in_schema=False)
async def clear_cache() -> Dict[str, Any]:
    """
    Clear the inference cache.

    FOR ADMIN/TESTING ONLY.
    """
    cache = get_cache()
    cleared = cache.clear()
    return {"cleared": cleared}
