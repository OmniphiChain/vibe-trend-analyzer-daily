"""
NeomSense AI Layer Data Contracts

Pydantic models defining the input/output contracts for the AI intelligence layer.
All outputs are JSON-serializable, deterministic, and frontend-safe.
"""

from typing import Optional, Literal
from pydantic import BaseModel, Field, field_validator
from enum import Enum


# =============================================================================
# ENUMS
# =============================================================================

class SentimentLabel(str, Enum):
    """Possible sentiment classifications."""
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"


class TrendDirection(str, Enum):
    """Trend direction classifications."""
    BULLISH_SHIFT = "bullish_shift"
    BEARISH_SHIFT = "bearish_shift"
    STABLE = "stable"


class MarketPsychology(str, Enum):
    """Market psychology states derived from emotions."""
    PANIC = "panic"
    CAPITULATION = "capitulation"
    REACTIONARY = "reactionary"
    AVERSION = "aversion"
    SPECULATIVE = "speculative"
    VOLATILE = "volatile"
    STABLE = "stable"
    ACCUMULATION = "accumulation"
    UNCERTAIN = "uncertain"


# =============================================================================
# INPUT CONTRACTS
# =============================================================================

class ModelOutputs(BaseModel):
    """
    Raw outputs from the NLP models.
    All scores normalized to [-1, +1] range.
    """
    finbert: float = Field(
        ...,
        ge=-1.0,
        le=1.0,
        description="FinBERT financial sentiment score"
    )
    finbert_tone: Optional[float] = Field(
        default=None,
        ge=-1.0,
        le=1.0,
        description="FinBERT-tone score (optional, averaged with finbert)"
    )
    social: float = Field(
        ...,
        ge=-1.0,
        le=1.0,
        description="Social media sentiment score"
    )
    emotion: float = Field(
        ...,
        ge=-1.0,
        le=1.0,
        description="Emotion-derived sentiment score"
    )
    primary_emotion: str = Field(
        default="neutral",
        description="Primary detected emotion label"
    )

    @field_validator("primary_emotion")
    @classmethod
    def normalize_emotion(cls, v: str) -> str:
        """Normalize emotion label to lowercase."""
        return v.lower().strip()


class HistoricalContext(BaseModel):
    """Historical data for trend and anomaly detection."""
    scores: list[float] = Field(
        default_factory=list,
        description="Historical sentiment scores (oldest first)"
    )
    sample_volume: int = Field(
        default=0,
        ge=0,
        description="Number of samples analyzed"
    )
    source_type: str = Field(
        default="unknown",
        description="Data source type for reliability weighting"
    )


# =============================================================================
# OUTPUT CONTRACTS
# =============================================================================

class FusedSentiment(BaseModel):
    """
    Result of multi-model sentiment fusion.
    Core output of the fusion engine.
    """
    score: float = Field(
        ...,
        ge=-1.0,
        le=1.0,
        description="Fused sentiment score (-1 to +1)"
    )
    sentiment: SentimentLabel = Field(
        ...,
        description="Classified sentiment label"
    )
    components: dict[str, float] = Field(
        default_factory=dict,
        description="Individual model contributions"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "score": 0.12,
                "sentiment": "neutral",
                "components": {
                    "finbert": 0.82,
                    "social": -0.41,
                    "emotion": -0.60
                }
            }
        }


class ConfidenceScore(BaseModel):
    """
    Confidence/reliability assessment of the fused sentiment.
    """
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Overall confidence score (0-1)"
    )
    agreement_score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Model agreement component"
    )
    volume_score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Sample volume component"
    )
    source_score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Source reliability component"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "confidence": 0.84,
                "agreement_score": 0.90,
                "volume_score": 0.75,
                "source_score": 0.80
            }
        }


class TrendResult(BaseModel):
    """
    Trend detection result with momentum analysis.
    """
    trend: TrendDirection = Field(
        ...,
        description="Detected trend direction"
    )
    strength: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Trend strength (0-1)"
    )
    short_term_avg: Optional[float] = Field(
        default=None,
        description="Short-term moving average"
    )
    long_term_avg: Optional[float] = Field(
        default=None,
        description="Long-term moving average"
    )
    delta: float = Field(
        default=0.0,
        description="Change between short and long term"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "trend": "bearish_shift",
                "strength": 0.63,
                "short_term_avg": -0.15,
                "long_term_avg": 0.25,
                "delta": -0.40
            }
        }


class EmotionSignal(BaseModel):
    """
    Emotion-to-market-psychology interpretation.
    """
    emotion: str = Field(
        ...,
        description="Detected primary emotion"
    )
    market_psychology: MarketPsychology = Field(
        ...,
        description="Interpreted market psychology state"
    )
    intensity: float = Field(
        default=0.5,
        ge=0.0,
        le=1.0,
        description="Emotion intensity (0-1)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "emotion": "fear",
                "market_psychology": "panic",
                "intensity": 0.75
            }
        }


class AnomalyResult(BaseModel):
    """
    Anomaly detection result.
    """
    anomaly: bool = Field(
        ...,
        description="Whether an anomaly was detected"
    )
    reason: Optional[str] = Field(
        default=None,
        description="Human-readable anomaly reason"
    )
    z_score: Optional[float] = Field(
        default=None,
        description="Z-score of the current observation"
    )
    severity: Literal["low", "medium", "high"] = Field(
        default="low",
        description="Anomaly severity level"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "anomaly": True,
                "reason": "sudden_negative_spike",
                "z_score": -3.5,
                "severity": "high"
            }
        }


class FullAIAnalysis(BaseModel):
    """
    Complete AI layer output - the final intelligence product.
    This is the main contract returned to APIs and dashboards.
    """
    # Core sentiment
    sentiment: SentimentLabel = Field(
        ...,
        description="Final classified sentiment"
    )
    score: float = Field(
        ...,
        ge=-1.0,
        le=1.0,
        description="Fused sentiment score"
    )

    # Reliability
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Confidence in the analysis"
    )

    # Trend
    trend: TrendDirection = Field(
        ...,
        description="Detected trend direction"
    )
    trend_strength: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Trend strength"
    )

    # Emotion
    emotion: str = Field(
        ...,
        description="Primary detected emotion"
    )
    market_psychology: MarketPsychology = Field(
        ...,
        description="Market psychology interpretation"
    )

    # Anomaly
    anomaly: bool = Field(
        ...,
        description="Anomaly flag"
    )
    anomaly_reason: Optional[str] = Field(
        default=None,
        description="Anomaly explanation if detected"
    )

    # Metadata
    model_agreement: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0,
        description="Agreement between source models"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "sentiment": "neutral",
                "score": 0.12,
                "confidence": 0.84,
                "trend": "bearish_shift",
                "trend_strength": 0.63,
                "emotion": "fear",
                "market_psychology": "panic",
                "anomaly": False,
                "anomaly_reason": None,
                "model_agreement": 0.72
            }
        }


# =============================================================================
# STREAMING / BATCH CONTRACTS
# =============================================================================

class AIAnalysisBatch(BaseModel):
    """Batch of AI analyses for multiple texts/tickers."""
    analyses: list[FullAIAnalysis] = Field(
        ...,
        description="List of AI analysis results"
    )
    count: int = Field(
        ...,
        ge=0,
        description="Number of analyses"
    )
    aggregate_sentiment: Optional[SentimentLabel] = Field(
        default=None,
        description="Overall sentiment across batch"
    )
    aggregate_score: Optional[float] = Field(
        default=None,
        description="Average score across batch"
    )


class AIStreamEvent(BaseModel):
    """Real-time streaming event from AI layer."""
    event_type: Literal["analysis", "trend_update", "anomaly_alert"] = Field(
        ...,
        description="Type of streaming event"
    )
    data: FullAIAnalysis = Field(
        ...,
        description="AI analysis data"
    )
    timestamp: str = Field(
        ...,
        description="ISO timestamp of the event"
    )
    ticker: Optional[str] = Field(
        default=None,
        description="Associated ticker symbol if applicable"
    )
