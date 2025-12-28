"""
NeomSense Anomaly Detection Engine

Detects abnormal or potentially manipulated sentiment behavior.
Uses statistical methods (z-score) to identify outliers.

Anomaly Types:
- sudden_positive_spike: Abnormally positive sentiment
- sudden_negative_spike: Abnormally negative sentiment
- extreme_volatility: Rapid sentiment swings
- model_divergence: Models strongly disagree (possible manipulation)

This is NOT fraud detection. It's statistical anomaly flagging.
"""

import math
from typing import Optional, Literal
from .constants import (
    ANOMALY_ZSCORE_THRESHOLD,
    ANOMALY_MIN_HISTORY,
    ANOMALY_REASONS,
    MODEL_DIVERGENCE_THRESHOLD,
    EPSILON,
)
from .schemas import AnomalyResult
from .fusion import compute_model_spread


def compute_mean(values: list[float]) -> float:
    """
    Compute arithmetic mean of values.

    Args:
        values: List of numeric values

    Returns:
        Mean value
    """
    if not values:
        return 0.0
    return sum(values) / len(values)


def compute_std(values: list[float], mean: Optional[float] = None) -> float:
    """
    Compute standard deviation of values.

    Args:
        values: List of numeric values
        mean: Pre-computed mean (optional optimization)

    Returns:
        Standard deviation
    """
    if not values or len(values) < 2:
        return 0.0

    if mean is None:
        mean = compute_mean(values)

    variance = sum((x - mean) ** 2 for x in values) / len(values)
    return math.sqrt(variance)


def compute_zscore(
    value: float,
    historical_values: list[float],
) -> Optional[float]:
    """
    Compute z-score of a value relative to historical distribution.

    Z-score = (value - mean) / std_dev

    Args:
        value: Current value to evaluate
        historical_values: Historical reference values

    Returns:
        Z-score, or None if insufficient data
    """
    if len(historical_values) < ANOMALY_MIN_HISTORY:
        return None

    mean = compute_mean(historical_values)
    std = compute_std(historical_values, mean)

    if std < EPSILON:
        # All historical values are the same - can't compute meaningful z-score
        return None

    return (value - mean) / std


def classify_anomaly_severity(z_score: float) -> Literal["low", "medium", "high"]:
    """
    Classify anomaly severity based on z-score magnitude.

    Args:
        z_score: The z-score value

    Returns:
        Severity level
    """
    abs_z = abs(z_score)

    if abs_z >= 4.0:
        return "high"
    elif abs_z >= 3.5:
        return "medium"
    else:
        return "low"


def get_anomaly_reason(z_score: float, score: float) -> str:
    """
    Determine human-readable reason for the anomaly.

    Args:
        z_score: The z-score that triggered the anomaly
        score: The actual sentiment score

    Returns:
        Reason string
    """
    if z_score > 0:
        return ANOMALY_REASONS["positive_spike"]
    else:
        return ANOMALY_REASONS["negative_spike"]


def detect_zscore_anomaly(
    current_score: float,
    historical_scores: list[float],
) -> AnomalyResult:
    """
    Detect anomalies using z-score statistical method.

    A score is anomalous if |z-score| > ANOMALY_ZSCORE_THRESHOLD (default 3.0).
    This corresponds to events that occur <0.3% of the time under normal distribution.

    Args:
        current_score: The current sentiment score to evaluate
        historical_scores: Historical scores for baseline

    Returns:
        AnomalyResult with detection status and details

    Example:
        >>> scores = [0.1, 0.15, 0.12, 0.08, 0.11, 0.09, 0.13, 0.10, 0.12, 0.11]
        >>> result = detect_zscore_anomaly(-0.8, scores)
        >>> result.anomaly
        True
        >>> result.reason
        'sudden_negative_spike'
    """
    # Not enough history to establish baseline
    if len(historical_scores) < ANOMALY_MIN_HISTORY:
        return AnomalyResult(
            anomaly=False,
            reason=None,
            z_score=None,
            severity="low",
        )

    # Compute z-score
    z_score = compute_zscore(current_score, historical_scores)

    if z_score is None:
        return AnomalyResult(
            anomaly=False,
            reason=None,
            z_score=None,
            severity="low",
        )

    # Check if anomalous
    is_anomaly = abs(z_score) > ANOMALY_ZSCORE_THRESHOLD

    if is_anomaly:
        reason = get_anomaly_reason(z_score, current_score)
        severity = classify_anomaly_severity(z_score)
    else:
        reason = None
        severity = "low"

    return AnomalyResult(
        anomaly=is_anomaly,
        reason=reason,
        z_score=round(z_score, 4),
        severity=severity,
    )


def detect_model_divergence(
    finbert_score: float,
    social_score: float,
    emotion_score: float,
) -> AnomalyResult:
    """
    Detect anomalies caused by extreme model disagreement.

    If models strongly disagree (high spread), it may indicate:
    - Manipulation (coordinated social media campaigns)
    - Data quality issues
    - Genuinely mixed signals

    Args:
        finbert_score: FinBERT score
        social_score: Social sentiment score
        emotion_score: Emotion-derived score

    Returns:
        AnomalyResult indicating divergence
    """
    spread = compute_model_spread(finbert_score, social_score, emotion_score)

    is_divergent = spread > MODEL_DIVERGENCE_THRESHOLD

    if is_divergent:
        return AnomalyResult(
            anomaly=True,
            reason=ANOMALY_REASONS["divergence"],
            z_score=None,  # N/A for divergence
            severity="medium",
        )

    return AnomalyResult(
        anomaly=False,
        reason=None,
        z_score=None,
        severity="low",
    )


def detect_volatility_anomaly(
    historical_scores: list[float],
    window: int = 5,
) -> AnomalyResult:
    """
    Detect abnormal sentiment volatility.

    Checks if recent sentiment swings are unusually large.

    Args:
        historical_scores: Recent sentiment scores
        window: Window size for volatility calculation

    Returns:
        AnomalyResult for volatility anomaly
    """
    if len(historical_scores) < window + ANOMALY_MIN_HISTORY:
        return AnomalyResult(
            anomaly=False,
            reason=None,
            z_score=None,
            severity="low",
        )

    # Compute recent volatility (std of recent scores)
    recent = historical_scores[-window:]
    recent_volatility = compute_std(recent)

    # Compute historical volatility baseline
    historical = historical_scores[:-window]
    # Compute rolling volatilities for baseline
    rolling_vols = []
    for i in range(len(historical) - window + 1):
        window_scores = historical[i:i + window]
        rolling_vols.append(compute_std(window_scores))

    if not rolling_vols:
        return AnomalyResult(
            anomaly=False,
            reason=None,
            z_score=None,
            severity="low",
        )

    # Z-score of current volatility vs historical volatilities
    vol_z_score = compute_zscore(recent_volatility, rolling_vols)

    if vol_z_score is None:
        return AnomalyResult(
            anomaly=False,
            reason=None,
            z_score=None,
            severity="low",
        )

    is_anomaly = vol_z_score > ANOMALY_ZSCORE_THRESHOLD

    if is_anomaly:
        return AnomalyResult(
            anomaly=True,
            reason=ANOMALY_REASONS["volatility"],
            z_score=round(vol_z_score, 4),
            severity=classify_anomaly_severity(vol_z_score),
        )

    return AnomalyResult(
        anomaly=False,
        reason=None,
        z_score=round(vol_z_score, 4) if vol_z_score else None,
        severity="low",
    )


def detect_anomaly(
    current_score: float,
    historical_scores: list[float],
    finbert_score: Optional[float] = None,
    social_score: Optional[float] = None,
    emotion_score: Optional[float] = None,
) -> AnomalyResult:
    """
    Comprehensive anomaly detection combining multiple methods.

    Checks for:
    1. Z-score anomaly (statistical outlier)
    2. Model divergence (if scores provided)
    3. Volatility anomaly

    Returns the most severe anomaly found.

    Args:
        current_score: Current fused sentiment score
        historical_scores: Historical fused scores
        finbert_score: Optional FinBERT score for divergence check
        social_score: Optional social score for divergence check
        emotion_score: Optional emotion score for divergence check

    Returns:
        Most significant AnomalyResult
    """
    results = []

    # Z-score anomaly
    zscore_result = detect_zscore_anomaly(current_score, historical_scores)
    if zscore_result.anomaly:
        results.append(zscore_result)

    # Model divergence (if all scores provided)
    if all(s is not None for s in [finbert_score, social_score, emotion_score]):
        divergence_result = detect_model_divergence(
            finbert_score, social_score, emotion_score
        )
        if divergence_result.anomaly:
            results.append(divergence_result)

    # Volatility anomaly
    vol_result = detect_volatility_anomaly(historical_scores)
    if vol_result.anomaly:
        results.append(vol_result)

    # Return most severe, or no anomaly
    if not results:
        return AnomalyResult(
            anomaly=False,
            reason=None,
            z_score=zscore_result.z_score,  # Include z-score even if not anomalous
            severity="low",
        )

    # Sort by severity
    severity_order = {"high": 0, "medium": 1, "low": 2}
    results.sort(key=lambda r: severity_order.get(r.severity, 2))

    return results[0]
