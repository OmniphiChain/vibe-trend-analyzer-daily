"""
NeomSense AI Layer Orchestrator

THIS IS THE AI BRAIN.

The orchestrator coordinates all intelligence modules to produce
the final, dashboard-ready analysis. It is the single entry point
for all AI processing.

Flow:
    1. Receive model outputs + historical context
    2. Call fusion engine → fused sentiment
    3. Compute confidence → reliability score
    4. Detect trend → market momentum
    5. Interpret emotion → market psychology
    6. Check anomalies → flag unusual patterns
    7. Merge results → FullAIAnalysis

The output is a single, deterministic, JSON-serializable object
ready for REST APIs, WebSocket streams, and dashboards.
"""

from typing import Optional
from dataclasses import dataclass

from .schemas import (
    ModelOutputs,
    HistoricalContext,
    FusedSentiment,
    ConfidenceScore,
    TrendResult,
    EmotionSignal,
    AnomalyResult,
    FullAIAnalysis,
    SentimentLabel,
    TrendDirection,
    MarketPsychology,
)
from .fusion import fuse_sentiment, compute_model_variance
from .confidence import compute_confidence
from .trends import detect_trend
from .emotions import interpret_emotion
from .anomalies import detect_anomaly


@dataclass
class AILayerResult:
    """
    Internal result container with all intermediate computations.
    Used for debugging and detailed analysis.
    """
    fusion: FusedSentiment
    confidence: ConfidenceScore
    trend: TrendResult
    emotion: EmotionSignal
    anomaly: AnomalyResult
    full_analysis: FullAIAnalysis


class AILayer:
    """
    NeomSense AI Intelligence Layer.

    Stateless orchestrator that coordinates all AI processing.
    Thread-safe and deterministic.

    Usage:
        layer = AILayer()
        result = layer.analyze(model_outputs, historical_context)
    """

    def __init__(self):
        """Initialize the AI Layer (stateless - nothing to configure)."""
        pass

    def analyze(
        self,
        model_outputs: ModelOutputs,
        historical_context: Optional[HistoricalContext] = None,
    ) -> FullAIAnalysis:
        """
        Run the complete AI analysis pipeline.

        This is the main entry point for AI processing.

        Args:
            model_outputs: Raw outputs from NLP models
            historical_context: Optional historical data for trends/anomalies

        Returns:
            FullAIAnalysis ready for API responses and dashboards

        Example:
            >>> layer = AILayer()
            >>> outputs = ModelOutputs(
            ...     finbert=0.82,
            ...     social=-0.41,
            ...     emotion=-0.60,
            ...     primary_emotion="fear"
            ... )
            >>> context = HistoricalContext(
            ...     scores=[0.1, 0.2, 0.15, 0.25, 0.3],
            ...     sample_volume=500,
            ...     source_type="financial_news"
            ... )
            >>> result = layer.analyze(outputs, context)
            >>> result.sentiment
            <SentimentLabel.NEUTRAL: 'neutral'>
        """
        # Set defaults for historical context
        if historical_context is None:
            historical_context = HistoricalContext()

        # Step 1: Fuse sentiment from multiple models
        fusion_result = fuse_sentiment(
            finbert_score=model_outputs.finbert,
            social_score=model_outputs.social,
            emotion_score=model_outputs.emotion,
            finbert_tone_score=model_outputs.finbert_tone,
        )

        # Step 2: Compute confidence score
        confidence_result = compute_confidence(
            finbert_score=model_outputs.finbert,
            social_score=model_outputs.social,
            emotion_score=model_outputs.emotion,
            sample_volume=historical_context.sample_volume,
            source_type=historical_context.source_type,
        )

        # Step 3: Detect trend from historical data
        trend_result = detect_trend(historical_context.scores)

        # Step 4: Interpret emotion to market psychology
        emotion_result = interpret_emotion(
            primary_emotion=model_outputs.primary_emotion,
            emotion_score=abs(model_outputs.emotion),  # Use absolute for intensity
        )

        # Step 5: Check for anomalies
        anomaly_result = detect_anomaly(
            current_score=fusion_result.score,
            historical_scores=historical_context.scores,
            finbert_score=model_outputs.finbert,
            social_score=model_outputs.social,
            emotion_score=model_outputs.emotion,
        )

        # Step 6: Compute model agreement metric
        variance = compute_model_variance(
            model_outputs.finbert,
            model_outputs.social,
            model_outputs.emotion,
        )
        # Convert variance to agreement (0 variance = 1.0 agreement)
        model_agreement = 1.0 - min(variance / 0.667, 1.0)

        # Step 7: Build final analysis object
        return FullAIAnalysis(
            sentiment=fusion_result.sentiment,
            score=fusion_result.score,
            confidence=confidence_result.confidence,
            trend=trend_result.trend,
            trend_strength=trend_result.strength,
            emotion=emotion_result.emotion,
            market_psychology=emotion_result.market_psychology,
            anomaly=anomaly_result.anomaly,
            anomaly_reason=anomaly_result.reason,
            model_agreement=round(model_agreement, 4),
        )

    def analyze_detailed(
        self,
        model_outputs: ModelOutputs,
        historical_context: Optional[HistoricalContext] = None,
    ) -> AILayerResult:
        """
        Run analysis with detailed intermediate results.

        Same as analyze() but returns all intermediate computations
        for debugging and detailed inspection.

        Args:
            model_outputs: Raw outputs from NLP models
            historical_context: Optional historical data

        Returns:
            AILayerResult with all intermediate results
        """
        if historical_context is None:
            historical_context = HistoricalContext()

        # Run all components
        fusion_result = fuse_sentiment(
            finbert_score=model_outputs.finbert,
            social_score=model_outputs.social,
            emotion_score=model_outputs.emotion,
            finbert_tone_score=model_outputs.finbert_tone,
        )

        confidence_result = compute_confidence(
            finbert_score=model_outputs.finbert,
            social_score=model_outputs.social,
            emotion_score=model_outputs.emotion,
            sample_volume=historical_context.sample_volume,
            source_type=historical_context.source_type,
        )

        trend_result = detect_trend(historical_context.scores)

        emotion_result = interpret_emotion(
            primary_emotion=model_outputs.primary_emotion,
            emotion_score=abs(model_outputs.emotion),
        )

        anomaly_result = detect_anomaly(
            current_score=fusion_result.score,
            historical_scores=historical_context.scores,
            finbert_score=model_outputs.finbert,
            social_score=model_outputs.social,
            emotion_score=model_outputs.emotion,
        )

        variance = compute_model_variance(
            model_outputs.finbert,
            model_outputs.social,
            model_outputs.emotion,
        )
        model_agreement = 1.0 - min(variance / 0.667, 1.0)

        full_analysis = FullAIAnalysis(
            sentiment=fusion_result.sentiment,
            score=fusion_result.score,
            confidence=confidence_result.confidence,
            trend=trend_result.trend,
            trend_strength=trend_result.strength,
            emotion=emotion_result.emotion,
            market_psychology=emotion_result.market_psychology,
            anomaly=anomaly_result.anomaly,
            anomaly_reason=anomaly_result.reason,
            model_agreement=round(model_agreement, 4),
        )

        return AILayerResult(
            fusion=fusion_result,
            confidence=confidence_result,
            trend=trend_result,
            emotion=emotion_result,
            anomaly=anomaly_result,
            full_analysis=full_analysis,
        )


# =============================================================================
# CONVENIENCE FUNCTION (STATELESS)
# =============================================================================

def run_ai_layer(
    model_outputs: dict,
    historical_scores: Optional[list[float]] = None,
    sample_volume: int = 0,
    source_type: str = "unknown",
    primary_emotion: str = "neutral",
) -> dict:
    """
    Run the AI layer with dictionary inputs/outputs.

    This is the primary function API - accepts raw dicts and returns raw dicts.
    Suitable for direct use in FastAPI endpoints.

    Args:
        model_outputs: Dict with keys: finbert, social, emotion, finbert_tone (optional)
        historical_scores: List of historical fused scores (oldest first)
        sample_volume: Number of samples analyzed
        source_type: Data source type for reliability
        primary_emotion: Primary detected emotion label

    Returns:
        Dict containing the full AI analysis (JSON-serializable)

    Example:
        >>> result = run_ai_layer(
        ...     model_outputs={"finbert": 0.82, "social": -0.41, "emotion": -0.60},
        ...     historical_scores=[0.1, 0.2, 0.15, 0.25, 0.3],
        ...     sample_volume=500,
        ...     source_type="financial_news",
        ...     primary_emotion="fear"
        ... )
        >>> result["sentiment"]
        'neutral'
        >>> result["confidence"]
        0.84
    """
    # Build typed input objects
    outputs = ModelOutputs(
        finbert=model_outputs.get("finbert", 0.0),
        finbert_tone=model_outputs.get("finbert_tone"),
        social=model_outputs.get("social", 0.0),
        emotion=model_outputs.get("emotion", 0.0),
        primary_emotion=primary_emotion,
    )

    context = HistoricalContext(
        scores=historical_scores or [],
        sample_volume=sample_volume,
        source_type=source_type,
    )

    # Run analysis
    layer = AILayer()
    result = layer.analyze(outputs, context)

    # Convert to dict for JSON serialization
    return result.model_dump()


# =============================================================================
# BATCH PROCESSING
# =============================================================================

def run_ai_layer_batch(
    batch_inputs: list[dict],
) -> list[dict]:
    """
    Process multiple analyses in batch.

    Args:
        batch_inputs: List of dicts, each containing:
            - model_outputs: Dict with model scores
            - historical_scores: Optional list of floats
            - sample_volume: Optional int
            - source_type: Optional str
            - primary_emotion: Optional str

    Returns:
        List of analysis result dicts
    """
    results = []
    layer = AILayer()

    for input_data in batch_inputs:
        outputs = ModelOutputs(
            finbert=input_data.get("model_outputs", {}).get("finbert", 0.0),
            finbert_tone=input_data.get("model_outputs", {}).get("finbert_tone"),
            social=input_data.get("model_outputs", {}).get("social", 0.0),
            emotion=input_data.get("model_outputs", {}).get("emotion", 0.0),
            primary_emotion=input_data.get("primary_emotion", "neutral"),
        )

        context = HistoricalContext(
            scores=input_data.get("historical_scores", []),
            sample_volume=input_data.get("sample_volume", 0),
            source_type=input_data.get("source_type", "unknown"),
        )

        result = layer.analyze(outputs, context)
        results.append(result.model_dump())

    return results
