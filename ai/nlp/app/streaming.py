"""
Streaming Services for Live Dashboard Updates

This module provides Server-Sent Events (SSE) streaming support for real-time
analysis updates. Each model's progress and results are streamed as they complete.

Usage:
- Connect to /stream/analyze with EventSource in JavaScript
- Receive events: start, progress, model_complete, complete, error
"""

import json
import logging
import asyncio
from typing import AsyncGenerator, Optional

from app.models import ModelRegistry
from app.schemas import (
    FinanceSentimentResponse,
    SocialSentimentResponse,
    EmotionResponse,
    EmotionScore,
    NERResponse,
    NEREntity,
    FullAnalysisResponse,
    ModelSentimentResult,
)
from app.utils import (
    normalize_sentiment_result,
    calculate_ensemble_score,
    normalize_entity_type,
    clean_text,
    truncate_text,
)

logger = logging.getLogger(__name__)


def format_sse(event: str, data: dict) -> str:
    """
    Format data as Server-Sent Event.

    Args:
        event: Event type name
        data: Event payload (will be JSON serialized)

    Returns:
        SSE formatted string
    """
    json_data = json.dumps(data, default=str)
    return f"event: {event}\ndata: {json_data}\n\n"


async def stream_single_analysis(
    text: str,
    registry: ModelRegistry,
    selected_models: Optional[list[str]] = None,
) -> AsyncGenerator[str, None]:
    """
    Stream analysis results for a single text as SSE events.

    Yields events in order:
    1. start - Analysis beginning
    2. progress - Each model starting
    3. model_complete - Each model finishing with results
    4. complete - All analysis done with full results

    Args:
        text: Text to analyze
        registry: ModelRegistry with loaded models
        selected_models: Optional list of models to run (finance, social, emotion, ner)

    Yields:
        SSE formatted strings
    """
    # Determine which models to run
    all_models = ["finance", "social", "emotion", "ner"]
    if selected_models:
        models_to_run = [m for m in selected_models if m in all_models]
    else:
        models_to_run = all_models

    total_steps = len(models_to_run)
    current_step = 0

    # Preprocess text
    cleaned_text = truncate_text(clean_text(text))

    # Initialize results
    finance_result = None
    social_result = None
    emotion_result = None
    ner_result = None

    # Send start event
    yield format_sse("start", {
        "text": text[:100] + "..." if len(text) > 100 else text,
        "models": models_to_run,
        "total_steps": total_steps,
    })

    # Small delay to ensure client receives start event
    await asyncio.sleep(0.05)

    # Process each model
    for model_name in models_to_run:
        current_step += 1

        # Send progress event
        yield format_sse("progress", {
            "model": model_name,
            "step": current_step,
            "total_steps": total_steps,
            "status": f"Processing {model_name}...",
        })
        await asyncio.sleep(0.01)

        try:
            if model_name == "finance" and registry.finbert and registry.finbert_tone:
                # Financial sentiment
                finance_result = await asyncio.to_thread(
                    _run_finance_sentiment, text, cleaned_text, registry
                )
                yield format_sse("model_complete", {
                    "model": "finance",
                    "result_type": "finance_sentiment",
                    "result": finance_result.model_dump(),
                    "step": current_step,
                    "total_steps": total_steps,
                })

            elif model_name == "social" and registry.twitter_sentiment:
                # Social sentiment
                social_result = await asyncio.to_thread(
                    _run_social_sentiment, text, cleaned_text, registry
                )
                yield format_sse("model_complete", {
                    "model": "social",
                    "result_type": "social_sentiment",
                    "result": social_result.model_dump(),
                    "step": current_step,
                    "total_steps": total_steps,
                })

            elif model_name == "emotion" and registry.emotion_classifier:
                # Emotion classification
                emotion_result = await asyncio.to_thread(
                    _run_emotion, text, cleaned_text, registry
                )
                yield format_sse("model_complete", {
                    "model": "emotion",
                    "result_type": "emotion",
                    "result": emotion_result.model_dump(),
                    "step": current_step,
                    "total_steps": total_steps,
                })

            elif model_name == "ner" and registry.ner_model:
                # Named entity recognition
                ner_result = await asyncio.to_thread(
                    _run_ner, text, cleaned_text, registry
                )
                yield format_sse("model_complete", {
                    "model": "ner",
                    "result_type": "ner",
                    "result": ner_result.model_dump(),
                    "step": current_step,
                    "total_steps": total_steps,
                })

            else:
                # Model not available
                yield format_sse("error", {
                    "model": model_name,
                    "error": f"Model '{model_name}' not available",
                })

        except Exception as e:
            logger.error(f"Streaming error for {model_name}: {e}")
            yield format_sse("error", {
                "model": model_name,
                "error": str(e),
            })

        # Small delay between models
        await asyncio.sleep(0.01)

    # Send complete event with full results
    full_result = FullAnalysisResponse(
        text=text,
        finance_sentiment=finance_result,
        social_sentiment=social_result,
        emotion=emotion_result,
        ner=ner_result,
    )

    yield format_sse("complete", {
        "full_result": full_result.model_dump(),
    })


async def stream_batch_analysis(
    texts: list[str],
    registry: ModelRegistry,
    selected_models: Optional[list[str]] = None,
) -> AsyncGenerator[str, None]:
    """
    Stream analysis results for multiple texts as SSE events.

    Yields events for each text:
    1. batch_start - Batch beginning
    2. text_start - Each text starting
    3. progress - Model progress for current text
    4. model_complete - Model results
    5. text_complete - Text finished
    6. batch_complete - All texts done

    Args:
        texts: List of texts to analyze
        registry: ModelRegistry with loaded models
        selected_models: Optional list of models to run

    Yields:
        SSE formatted strings
    """
    total_texts = len(texts)

    # Determine models to run
    all_models = ["finance", "social", "emotion", "ner"]
    if selected_models:
        models_to_run = [m for m in selected_models if m in all_models]
    else:
        models_to_run = all_models

    # Send batch start
    yield format_sse("batch_start", {
        "total_texts": total_texts,
        "models": models_to_run,
    })
    await asyncio.sleep(0.05)

    all_results = []

    for text_idx, text in enumerate(texts):
        # Send text start
        yield format_sse("text_start", {
            "text_index": text_idx,
            "total_texts": total_texts,
            "text_preview": text[:50] + "..." if len(text) > 50 else text,
        })
        await asyncio.sleep(0.01)

        # Stream individual text analysis
        text_result = None
        async for event in stream_single_analysis(text, registry, selected_models):
            # Forward events with text index
            yield event

            # Capture complete event
            if '"event": "complete"' in event or 'event: complete' in event:
                # Parse result from complete event
                pass

        # Build result for this text
        cleaned_text = truncate_text(clean_text(text))
        result = await asyncio.to_thread(
            _build_full_result, text, cleaned_text, registry, models_to_run
        )
        all_results.append(result)

        # Send text complete
        yield format_sse("text_complete", {
            "text_index": text_idx,
            "total_texts": total_texts,
        })
        await asyncio.sleep(0.01)

    # Send batch complete
    yield format_sse("batch_complete", {
        "total_texts": total_texts,
        "results": [r.model_dump() for r in all_results],
    })


# =============================================================================
# Helper Functions (run in thread pool)
# =============================================================================

def _run_finance_sentiment(
    text: str,
    cleaned_text: str,
    registry: ModelRegistry,
) -> FinanceSentimentResponse:
    """Run financial sentiment analysis."""
    model_results = []

    # FinBERT
    try:
        finbert_raw = registry.finbert(cleaned_text)[0]
        finbert_score = normalize_sentiment_result(finbert_raw)
        model_results.append(ModelSentimentResult(
            model="ProsusAI/finbert",
            sentiment=finbert_score
        ))
    except Exception as e:
        logger.error(f"FinBERT error: {e}")

    # FinBERT-tone
    try:
        tone_raw = registry.finbert_tone(cleaned_text)[0]
        tone_score = normalize_sentiment_result(tone_raw)
        model_results.append(ModelSentimentResult(
            model="yiyanghkust/finbert-tone",
            sentiment=tone_score
        ))
    except Exception as e:
        logger.error(f"FinBERT-tone error: {e}")

    # Ensemble
    sentiment_scores = [m.sentiment for m in model_results]
    ensemble = calculate_ensemble_score(sentiment_scores)

    return FinanceSentimentResponse(
        text=text,
        models=model_results,
        ensemble=ensemble
    )


def _run_social_sentiment(
    text: str,
    cleaned_text: str,
    registry: ModelRegistry,
) -> SocialSentimentResponse:
    """Run social sentiment analysis."""
    result = registry.twitter_sentiment(cleaned_text)[0]
    normalized = normalize_sentiment_result(result)

    return SocialSentimentResponse(
        text=text,
        label=normalized.label,
        confidence=round(normalized.score, 4)
    )


def _run_emotion(
    text: str,
    cleaned_text: str,
    registry: ModelRegistry,
) -> EmotionResponse:
    """Run emotion classification."""
    results = registry.emotion_classifier(cleaned_text)

    # Handle nested list
    if results and isinstance(results[0], list):
        results = results[0]

    emotions = [
        EmotionScore(emotion=r["label"], score=round(r["score"], 4))
        for r in results
    ]
    emotions.sort(key=lambda x: x.score, reverse=True)
    primary = emotions[0] if emotions else EmotionScore(emotion="neutral", score=0.0)

    return EmotionResponse(
        text=text,
        emotions=emotions,
        primary_emotion=primary.emotion,
        primary_score=primary.score
    )


def _run_ner(
    text: str,
    cleaned_text: str,
    registry: ModelRegistry,
) -> NERResponse:
    """Run named entity recognition."""
    results = registry.ner_model(cleaned_text)

    entities = [
        NEREntity(
            entity=r["word"],
            entity_type=normalize_entity_type(r["entity_group"]),
            confidence=round(r["score"], 4),
            start=r["start"],
            end=r["end"]
        )
        for r in results
    ]

    return NERResponse(
        text=text,
        entities=entities,
        entity_count=len(entities)
    )


def _build_full_result(
    text: str,
    cleaned_text: str,
    registry: ModelRegistry,
    models_to_run: list[str],
) -> FullAnalysisResponse:
    """Build full analysis result."""
    finance_result = None
    social_result = None
    emotion_result = None
    ner_result = None

    if "finance" in models_to_run and registry.finbert and registry.finbert_tone:
        try:
            finance_result = _run_finance_sentiment(text, cleaned_text, registry)
        except Exception as e:
            logger.error(f"Finance error: {e}")

    if "social" in models_to_run and registry.twitter_sentiment:
        try:
            social_result = _run_social_sentiment(text, cleaned_text, registry)
        except Exception as e:
            logger.error(f"Social error: {e}")

    if "emotion" in models_to_run and registry.emotion_classifier:
        try:
            emotion_result = _run_emotion(text, cleaned_text, registry)
        except Exception as e:
            logger.error(f"Emotion error: {e}")

    if "ner" in models_to_run and registry.ner_model:
        try:
            ner_result = _run_ner(text, cleaned_text, registry)
        except Exception as e:
            logger.error(f"NER error: {e}")

    return FullAnalysisResponse(
        text=text,
        finance_sentiment=finance_result,
        social_sentiment=social_result,
        emotion=emotion_result,
        ner=ner_result,
    )
