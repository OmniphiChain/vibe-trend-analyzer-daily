"""
NeomSense Multi-Model Sentiment Fusion Engine

Combines raw sentiment signals from multiple NLP models into a single,
weighted, normalized sentiment score. This is the core fusion logic.

Algorithm:
1. Normalize all scores to [-1, +1]
2. Apply fixed weights (FinBERT > Social > Emotion)
3. Compute weighted average
4. Classify into positive/neutral/negative
"""

from typing import Optional
from .constants import (
    WEIGHT_FINBERT,
    WEIGHT_SOCIAL,
    WEIGHT_EMOTION,
    THRESHOLD_POSITIVE,
    THRESHOLD_NEGATIVE,
    SCORE_MIN,
    SCORE_MAX,
    EPSILON,
)
from .schemas import FusedSentiment, SentimentLabel, ModelOutputs


def clamp(value: float, min_val: float = SCORE_MIN, max_val: float = SCORE_MAX) -> float:
    """
    Clamp a value to the valid score range.

    Args:
        value: The value to clamp
        min_val: Minimum allowed value
        max_val: Maximum allowed value

    Returns:
        Clamped value within [min_val, max_val]
    """
    return max(min_val, min(max_val, value))


def normalize_score(score: float) -> float:
    """
    Ensure score is in [-1, +1] range.

    Some models may return scores outside this range or in different scales.
    This function normalizes them.

    Args:
        score: Raw model score

    Returns:
        Normalized score in [-1, +1]
    """
    return clamp(score, SCORE_MIN, SCORE_MAX)


def classify_sentiment(score: float) -> SentimentLabel:
    """
    Classify a fused score into a sentiment label.

    Classification rules:
        - score > THRESHOLD_POSITIVE  → positive
        - score < THRESHOLD_NEGATIVE  → negative
        - otherwise                   → neutral

    Args:
        score: Fused sentiment score in [-1, +1]

    Returns:
        SentimentLabel enum value
    """
    if score > THRESHOLD_POSITIVE:
        return SentimentLabel.POSITIVE
    elif score < THRESHOLD_NEGATIVE:
        return SentimentLabel.NEGATIVE
    else:
        return SentimentLabel.NEUTRAL


def fuse_sentiment(
    finbert_score: float,
    social_score: float,
    emotion_score: float,
    finbert_tone_score: Optional[float] = None,
) -> FusedSentiment:
    """
    Fuse multiple model outputs into a single sentiment signal.

    This is the core fusion algorithm:
    1. If finbert_tone is provided, average it with finbert
    2. Normalize all scores to [-1, +1]
    3. Apply weighted average: 45% FinBERT + 35% Social + 20% Emotion
    4. Classify the result

    Args:
        finbert_score: FinBERT financial sentiment score
        social_score: Social media sentiment score
        emotion_score: Emotion-derived sentiment score
        finbert_tone_score: Optional FinBERT-tone score (averaged with finbert)

    Returns:
        FusedSentiment object with score, label, and components

    Example:
        >>> result = fuse_sentiment(0.82, -0.41, -0.60)
        >>> result.score
        0.127  # (0.82*0.45) + (-0.41*0.35) + (-0.60*0.20)
        >>> result.sentiment
        <SentimentLabel.NEUTRAL: 'neutral'>
    """
    # Step 1: Handle FinBERT + tone averaging
    if finbert_tone_score is not None:
        # Average the two FinBERT variants
        effective_finbert = (finbert_score + finbert_tone_score) / 2.0
    else:
        effective_finbert = finbert_score

    # Step 2: Normalize all scores
    norm_finbert = normalize_score(effective_finbert)
    norm_social = normalize_score(social_score)
    norm_emotion = normalize_score(emotion_score)

    # Step 3: Weighted average
    fused_score = (
        norm_finbert * WEIGHT_FINBERT +
        norm_social * WEIGHT_SOCIAL +
        norm_emotion * WEIGHT_EMOTION
    )

    # Ensure the fused score is also normalized
    fused_score = normalize_score(fused_score)

    # Step 4: Classify
    sentiment_label = classify_sentiment(fused_score)

    # Build component breakdown for transparency
    components = {
        "finbert": round(norm_finbert, 4),
        "finbert_weighted": round(norm_finbert * WEIGHT_FINBERT, 4),
        "social": round(norm_social, 4),
        "social_weighted": round(norm_social * WEIGHT_SOCIAL, 4),
        "emotion": round(norm_emotion, 4),
        "emotion_weighted": round(norm_emotion * WEIGHT_EMOTION, 4),
    }

    return FusedSentiment(
        score=round(fused_score, 4),
        sentiment=sentiment_label,
        components=components,
    )


def fuse_from_model_outputs(outputs: ModelOutputs) -> FusedSentiment:
    """
    Convenience function to fuse sentiment from a ModelOutputs object.

    Args:
        outputs: ModelOutputs containing all model scores

    Returns:
        FusedSentiment result
    """
    return fuse_sentiment(
        finbert_score=outputs.finbert,
        social_score=outputs.social,
        emotion_score=outputs.emotion,
        finbert_tone_score=outputs.finbert_tone,
    )


def compute_model_spread(
    finbert_score: float,
    social_score: float,
    emotion_score: float,
) -> float:
    """
    Compute the spread (disagreement) between model scores.

    Higher spread indicates lower model agreement.
    Used by the confidence engine.

    Args:
        finbert_score: FinBERT score
        social_score: Social sentiment score
        emotion_score: Emotion score

    Returns:
        Spread value (max - min of the scores)
    """
    scores = [
        normalize_score(finbert_score),
        normalize_score(social_score),
        normalize_score(emotion_score),
    ]
    return max(scores) - min(scores)


def compute_model_variance(
    finbert_score: float,
    social_score: float,
    emotion_score: float,
) -> float:
    """
    Compute the variance between model scores.

    Lower variance indicates higher agreement between models.
    Used for confidence scoring.

    Args:
        finbert_score: FinBERT score
        social_score: Social sentiment score
        emotion_score: Emotion score

    Returns:
        Variance of the three scores
    """
    scores = [
        normalize_score(finbert_score),
        normalize_score(social_score),
        normalize_score(emotion_score),
    ]
    mean = sum(scores) / len(scores)
    variance = sum((s - mean) ** 2 for s in scores) / len(scores)
    return variance
