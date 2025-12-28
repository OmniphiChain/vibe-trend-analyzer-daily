"""
NeomSense AI Layer Constants

Centralized configuration for all AI intelligence computations.
These values are carefully tuned for financial sentiment analysis.

DO NOT modify without understanding the downstream impact.
"""

from typing import Final

# =============================================================================
# SENTIMENT FUSION WEIGHTS
# =============================================================================
# These weights determine how much each model contributes to the final score.
# Total must equal 1.0

WEIGHT_FINBERT: Final[float] = 0.45      # Financial domain expertise (highest weight)
WEIGHT_SOCIAL: Final[float] = 0.35       # Social media pulse
WEIGHT_EMOTION: Final[float] = 0.20      # Emotional undercurrent

# Validation
assert abs(WEIGHT_FINBERT + WEIGHT_SOCIAL + WEIGHT_EMOTION - 1.0) < 0.001, \
    "Fusion weights must sum to 1.0"

# =============================================================================
# SENTIMENT CLASSIFICATION THRESHOLDS
# =============================================================================
# Boundaries for classifying the fused score into sentiment labels.
# Score range: [-1.0, +1.0]

THRESHOLD_POSITIVE: Final[float] = 0.15   # Score > 0.15 → positive
THRESHOLD_NEGATIVE: Final[float] = -0.15  # Score < -0.15 → negative
# Between thresholds → neutral

# =============================================================================
# CONFIDENCE SCORING
# =============================================================================

# Agreement weight: How much model agreement affects confidence
CONFIDENCE_AGREEMENT_WEIGHT: Final[float] = 0.50

# Volume weight: How much sample volume affects confidence
CONFIDENCE_VOLUME_WEIGHT: Final[float] = 0.30

# Source reliability weight
CONFIDENCE_SOURCE_WEIGHT: Final[float] = 0.20

# Volume scaling parameters (log-based)
VOLUME_MIN_SAMPLES: Final[int] = 10        # Below this, low confidence
VOLUME_OPTIMAL_SAMPLES: Final[int] = 1000  # Optimal sample size
VOLUME_LOG_BASE: Final[float] = 10.0       # Log base for scaling

# Minimum confidence floor (never report 0 confidence)
CONFIDENCE_FLOOR: Final[float] = 0.10

# =============================================================================
# TREND DETECTION
# =============================================================================

# Time windows (in data points, not actual time)
TREND_SHORT_WINDOW: Final[int] = 5         # ~5-15 minutes of data
TREND_LONG_WINDOW: Final[int] = 24         # ~24 hours of data

# Minimum data points required for trend analysis
TREND_MIN_DATAPOINTS: Final[int] = 3

# Shift detection thresholds
TREND_SHIFT_THRESHOLD: Final[float] = 0.10  # Min delta to detect shift
TREND_STRONG_SHIFT: Final[float] = 0.25     # Strong shift threshold

# =============================================================================
# EMOTION TO MARKET PSYCHOLOGY MAPPING
# =============================================================================
# Maps detected emotions to market behavior interpretations

EMOTION_PSYCHOLOGY_MAP: Final[dict[str, str]] = {
    # Fear-based emotions → panic/flight behavior
    "fear": "panic",
    "sadness": "capitulation",

    # Anger-based emotions → reactive/volatile behavior
    "anger": "reactionary",
    "disgust": "aversion",

    # Positive emotions → risk-on behavior
    "joy": "speculative",
    "surprise": "volatile",

    # Neutral states → stable markets
    "neutral": "stable",
    "anticipation": "accumulation",

    # Default fallback
    "unknown": "uncertain",
}

# =============================================================================
# ANOMALY DETECTION
# =============================================================================

# Z-score threshold for anomaly flagging
ANOMALY_ZSCORE_THRESHOLD: Final[float] = 3.0

# Minimum historical data points for z-score calculation
ANOMALY_MIN_HISTORY: Final[int] = 10

# Anomaly reason codes
ANOMALY_REASONS: Final[dict[str, str]] = {
    "positive_spike": "sudden_positive_spike",
    "negative_spike": "sudden_negative_spike",
    "volatility": "extreme_volatility",
    "volume_surge": "abnormal_volume_surge",
    "divergence": "model_divergence",
}

# Model divergence threshold (max acceptable spread between models)
MODEL_DIVERGENCE_THRESHOLD: Final[float] = 1.2  # On [-1, +1] scale

# =============================================================================
# NUMERICAL STABILITY
# =============================================================================

# Small epsilon to prevent division by zero
EPSILON: Final[float] = 1e-8

# Score clamping bounds
SCORE_MIN: Final[float] = -1.0
SCORE_MAX: Final[float] = 1.0

# =============================================================================
# SOURCE RELIABILITY SCORES
# =============================================================================
# Pre-defined reliability weights for different data sources

SOURCE_RELIABILITY: Final[dict[str, float]] = {
    "financial_news": 0.90,
    "sec_filings": 0.95,
    "analyst_reports": 0.85,
    "twitter": 0.60,
    "reddit": 0.55,
    "general_news": 0.70,
    "unknown": 0.50,
}
