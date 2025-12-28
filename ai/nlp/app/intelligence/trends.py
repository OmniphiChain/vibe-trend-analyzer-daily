"""
NeomSense Trend Intelligence Engine

Detects momentum and direction shifts in sentiment over time.
Compares short-term vs long-term moving averages to identify:

- bullish_shift: Sentiment improving (short > long)
- bearish_shift: Sentiment declining (short < long)
- stable: No significant change

This is NOT time-series prediction. It's momentum detection.
"""

from typing import Optional
from .constants import (
    TREND_SHORT_WINDOW,
    TREND_LONG_WINDOW,
    TREND_MIN_DATAPOINTS,
    TREND_SHIFT_THRESHOLD,
    TREND_STRONG_SHIFT,
    EPSILON,
)
from .schemas import TrendResult, TrendDirection


def compute_moving_average(scores: list[float], window: int) -> Optional[float]:
    """
    Compute simple moving average over the most recent `window` scores.

    Args:
        scores: List of historical scores (oldest first)
        window: Number of recent scores to average

    Returns:
        Moving average, or None if insufficient data
    """
    if not scores or len(scores) < window:
        return None

    # Take the most recent `window` scores
    recent = scores[-window:]
    return sum(recent) / len(recent)


def compute_exponential_moving_average(
    scores: list[float],
    window: int,
    smoothing: float = 2.0,
) -> Optional[float]:
    """
    Compute exponential moving average (EMA) giving more weight to recent values.

    EMA is more responsive to recent changes than SMA.

    Args:
        scores: List of historical scores (oldest first)
        window: EMA period
        smoothing: Smoothing factor (default 2.0 is standard)

    Returns:
        EMA value, or None if insufficient data
    """
    if not scores or len(scores) < window:
        return None

    # Multiplier for weighting
    multiplier = smoothing / (window + 1)

    # Initialize EMA with SMA of first `window` values
    ema = sum(scores[:window]) / window

    # Calculate EMA for remaining values
    for score in scores[window:]:
        ema = (score - ema) * multiplier + ema

    return ema


def classify_trend(delta: float, strength: float) -> TrendDirection:
    """
    Classify the trend direction based on delta between short and long averages.

    Args:
        delta: Difference (short_avg - long_avg)
        strength: Absolute magnitude of the delta, normalized

    Returns:
        TrendDirection enum value
    """
    if abs(delta) < TREND_SHIFT_THRESHOLD:
        return TrendDirection.STABLE

    if delta > 0:
        return TrendDirection.BULLISH_SHIFT
    else:
        return TrendDirection.BEARISH_SHIFT


def compute_trend_strength(delta: float) -> float:
    """
    Compute trend strength as a normalized value in [0, 1].

    Strength is based on how far the delta exceeds the threshold,
    saturating at TREND_STRONG_SHIFT.

    Args:
        delta: The short-term vs long-term difference

    Returns:
        Strength in [0, 1]
    """
    abs_delta = abs(delta)

    if abs_delta < TREND_SHIFT_THRESHOLD:
        # Below threshold = no meaningful trend
        return 0.0

    if abs_delta >= TREND_STRONG_SHIFT:
        # Strong shift = max strength
        return 1.0

    # Linear interpolation between threshold and strong shift
    range_size = TREND_STRONG_SHIFT - TREND_SHIFT_THRESHOLD
    excess = abs_delta - TREND_SHIFT_THRESHOLD
    return excess / (range_size + EPSILON)


def detect_trend(historical_scores: list[float]) -> TrendResult:
    """
    Detect sentiment trend from historical scores.

    Algorithm:
    1. Compute short-term moving average (recent sentiment)
    2. Compute long-term moving average (baseline sentiment)
    3. Compare: if short > long → bullish shift, etc.
    4. Compute strength based on magnitude of difference

    Args:
        historical_scores: List of sentiment scores over time (oldest first)

    Returns:
        TrendResult with trend direction, strength, and component values

    Example:
        >>> scores = [0.1, 0.15, 0.2, 0.25, 0.3, -0.1, -0.2, -0.3, -0.4, -0.5]
        >>> result = detect_trend(scores)
        >>> result.trend
        <TrendDirection.BEARISH_SHIFT: 'bearish_shift'>
    """
    # Insufficient data case
    if len(historical_scores) < TREND_MIN_DATAPOINTS:
        return TrendResult(
            trend=TrendDirection.STABLE,
            strength=0.0,
            short_term_avg=None,
            long_term_avg=None,
            delta=0.0,
        )

    # Compute moving averages
    # Use min of available data and window size
    effective_short_window = min(TREND_SHORT_WINDOW, len(historical_scores))
    effective_long_window = min(TREND_LONG_WINDOW, len(historical_scores))

    short_avg = compute_moving_average(historical_scores, effective_short_window)
    long_avg = compute_moving_average(historical_scores, effective_long_window)

    # Handle edge cases
    if short_avg is None or long_avg is None:
        return TrendResult(
            trend=TrendDirection.STABLE,
            strength=0.0,
            short_term_avg=short_avg,
            long_term_avg=long_avg,
            delta=0.0,
        )

    # Compute delta and classify
    delta = short_avg - long_avg
    strength = compute_trend_strength(delta)
    trend = classify_trend(delta, strength)

    return TrendResult(
        trend=trend,
        strength=round(strength, 4),
        short_term_avg=round(short_avg, 4),
        long_term_avg=round(long_avg, 4),
        delta=round(delta, 4),
    )


def detect_momentum(historical_scores: list[float]) -> dict:
    """
    Compute momentum indicators from historical scores.

    Returns multiple momentum signals:
    - velocity: Rate of change
    - acceleration: Change in velocity
    - direction: Current movement direction

    Args:
        historical_scores: List of sentiment scores (oldest first)

    Returns:
        Dictionary with momentum indicators
    """
    if len(historical_scores) < 2:
        return {
            "velocity": 0.0,
            "acceleration": 0.0,
            "direction": "flat",
        }

    # Velocity = recent change
    velocity = historical_scores[-1] - historical_scores[-2]

    # Acceleration = change in velocity (need at least 3 points)
    if len(historical_scores) >= 3:
        prev_velocity = historical_scores[-2] - historical_scores[-3]
        acceleration = velocity - prev_velocity
    else:
        acceleration = 0.0

    # Direction
    if abs(velocity) < TREND_SHIFT_THRESHOLD / 2:
        direction = "flat"
    elif velocity > 0:
        direction = "rising"
    else:
        direction = "falling"

    return {
        "velocity": round(velocity, 4),
        "acceleration": round(acceleration, 4),
        "direction": direction,
    }


def is_reversal(historical_scores: list[float], current_score: float) -> bool:
    """
    Detect if current score represents a potential trend reversal.

    A reversal is detected when the current score moves against
    the recent trend by more than the threshold.

    Args:
        historical_scores: Recent historical scores
        current_score: The newest score to evaluate

    Returns:
        True if reversal detected
    """
    if len(historical_scores) < TREND_MIN_DATAPOINTS:
        return False

    # Get recent trend direction
    recent_avg = sum(historical_scores[-TREND_SHORT_WINDOW:]) / min(
        TREND_SHORT_WINDOW, len(historical_scores)
    )

    # Check if current score moves against the trend
    if recent_avg > 0 and current_score < -TREND_SHIFT_THRESHOLD:
        return True  # Was positive, now strongly negative
    if recent_avg < 0 and current_score > TREND_SHIFT_THRESHOLD:
        return True  # Was negative, now strongly positive

    return False
