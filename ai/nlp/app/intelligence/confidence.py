"""
NeomSense Confidence Scoring Engine

Measures the trustworthiness/reliability of the fused sentiment signal.
Confidence is derived from three components:

1. Agreement: How much the models agree with each other
2. Volume: How many samples were analyzed (more = better)
3. Source: How reliable is the data source

Final confidence = weighted combination of these components.
"""

import math
from typing import Optional
from .constants import (
    CONFIDENCE_AGREEMENT_WEIGHT,
    CONFIDENCE_VOLUME_WEIGHT,
    CONFIDENCE_SOURCE_WEIGHT,
    VOLUME_MIN_SAMPLES,
    VOLUME_OPTIMAL_SAMPLES,
    VOLUME_LOG_BASE,
    CONFIDENCE_FLOOR,
    SOURCE_RELIABILITY,
    EPSILON,
)
from .schemas import ConfidenceScore
from .fusion import compute_model_variance


def compute_agreement_score(
    finbert_score: float,
    social_score: float,
    emotion_score: float,
) -> float:
    """
    Compute how much the models agree with each other.

    Agreement is inversely related to variance:
    - Low variance = high agreement = high score
    - High variance = low agreement = low score

    The maximum possible variance for scores in [-1, +1] is ~1.33
    (when scores are -1, 0, +1). We normalize against this.

    Args:
        finbert_score: FinBERT sentiment score
        social_score: Social media sentiment score
        emotion_score: Emotion-derived score

    Returns:
        Agreement score in [0, 1] (higher = more agreement)
    """
    # Compute variance between model scores
    variance = compute_model_variance(finbert_score, social_score, emotion_score)

    # Maximum possible variance for 3 values in [-1, +1]
    # Occurs at values like (-1, 0, +1) → variance ≈ 0.667
    max_variance = 0.667

    # Convert variance to agreement (inverse relationship)
    # Agreement = 1 when variance = 0
    # Agreement → 0 as variance → max_variance
    agreement = 1.0 - (variance / (max_variance + EPSILON))

    # Clamp to valid range
    return max(0.0, min(1.0, agreement))


def compute_volume_score(sample_volume: int) -> float:
    """
    Compute confidence contribution from sample volume.

    Uses logarithmic scaling because the value of additional samples
    diminishes as volume increases (marginal utility).

    Formula:
        score = log(volume) / log(optimal_volume)
        clamped to [0, 1]

    Args:
        sample_volume: Number of samples analyzed

    Returns:
        Volume score in [0, 1]

    Examples:
        >>> compute_volume_score(10)    # Minimum threshold
        0.5
        >>> compute_volume_score(100)
        0.67
        >>> compute_volume_score(1000)  # Optimal
        1.0
        >>> compute_volume_score(10000) # Saturates at 1.0
        1.0
    """
    if sample_volume <= 0:
        return 0.0

    if sample_volume < VOLUME_MIN_SAMPLES:
        # Below minimum threshold, scale linearly
        return (sample_volume / VOLUME_MIN_SAMPLES) * 0.5

    if sample_volume >= VOLUME_OPTIMAL_SAMPLES:
        # At or above optimal, full confidence from volume
        return 1.0

    # Log-scale between min and optimal
    log_volume = math.log(sample_volume, VOLUME_LOG_BASE)
    log_optimal = math.log(VOLUME_OPTIMAL_SAMPLES, VOLUME_LOG_BASE)
    log_min = math.log(VOLUME_MIN_SAMPLES, VOLUME_LOG_BASE)

    # Normalize to [0.5, 1.0] range (0.5 at min, 1.0 at optimal)
    normalized = (log_volume - log_min) / (log_optimal - log_min + EPSILON)
    return 0.5 + (normalized * 0.5)


def compute_source_score(source_type: str) -> float:
    """
    Get the reliability score for a data source.

    Different sources have different inherent reliability:
    - SEC filings: Very reliable (0.95)
    - Financial news: Reliable (0.90)
    - Twitter: Less reliable (0.60)
    - Unknown: Default (0.50)

    Args:
        source_type: Type of data source (lowercase)

    Returns:
        Source reliability score in [0, 1]
    """
    source_key = source_type.lower().strip()
    return SOURCE_RELIABILITY.get(source_key, SOURCE_RELIABILITY["unknown"])


def compute_confidence(
    finbert_score: float,
    social_score: float,
    emotion_score: float,
    sample_volume: int = 0,
    source_type: str = "unknown",
) -> ConfidenceScore:
    """
    Compute the overall confidence score for a sentiment analysis.

    Confidence is a weighted combination of:
    - Agreement score (50%): How much models agree
    - Volume score (30%): Sample size adequacy
    - Source score (20%): Data source reliability

    Final confidence is floored at CONFIDENCE_FLOOR to never report
    zero confidence.

    Args:
        finbert_score: FinBERT sentiment score
        social_score: Social media sentiment score
        emotion_score: Emotion-derived score
        sample_volume: Number of samples analyzed
        source_type: Type of data source

    Returns:
        ConfidenceScore object with overall and component scores

    Example:
        >>> result = compute_confidence(0.8, 0.7, 0.6, 500, "financial_news")
        >>> result.confidence
        0.85
    """
    # Compute individual components
    agreement = compute_agreement_score(finbert_score, social_score, emotion_score)
    volume = compute_volume_score(sample_volume)
    source = compute_source_score(source_type)

    # Weighted combination
    raw_confidence = (
        agreement * CONFIDENCE_AGREEMENT_WEIGHT +
        volume * CONFIDENCE_VOLUME_WEIGHT +
        source * CONFIDENCE_SOURCE_WEIGHT
    )

    # Apply floor - never report zero confidence
    final_confidence = max(CONFIDENCE_FLOOR, raw_confidence)

    # Clamp to [0, 1]
    final_confidence = min(1.0, final_confidence)

    return ConfidenceScore(
        confidence=round(final_confidence, 4),
        agreement_score=round(agreement, 4),
        volume_score=round(volume, 4),
        source_score=round(source, 4),
    )


def get_confidence_level(confidence: float) -> str:
    """
    Convert numeric confidence to human-readable level.

    Args:
        confidence: Confidence score in [0, 1]

    Returns:
        String level: "very_low", "low", "medium", "high", "very_high"
    """
    if confidence >= 0.9:
        return "very_high"
    elif confidence >= 0.75:
        return "high"
    elif confidence >= 0.5:
        return "medium"
    elif confidence >= 0.25:
        return "low"
    else:
        return "very_low"
