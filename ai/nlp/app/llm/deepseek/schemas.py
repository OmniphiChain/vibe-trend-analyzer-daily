# ============================================================================
# DEEPSEEK LLM SCHEMAS
# Pydantic models for request/response validation
# ============================================================================

from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class LLMCapability(str, Enum):
    """Allowed LLM capabilities - strictly limited to these three."""
    EXPLAIN = "explain"
    DAILY_SUMMARY = "daily_summary"
    NARRATIVE = "narrative"


# ============================================================================
# EXPLAIN CAPABILITY
# Transform sentiment metrics into human-readable prose
# ============================================================================

class SentimentMetrics(BaseModel):
    """Pre-computed sentiment data from core engine."""
    overall_score: float = Field(..., ge=-1.0, le=1.0, description="Sentiment score from -1 to 1")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score from 0 to 1")
    dominant_emotion: str = Field(default="neutral", description="Primary emotion detected")
    emotion_distribution: Dict[str, float] = Field(default_factory=dict)
    source_breakdown: Optional[Dict[str, float]] = None
    trend_direction: Optional[str] = Field(None, pattern="^(up|down|stable)$")
    sample_size: int = Field(..., ge=1)


class ExplainRequest(BaseModel):
    """Request to explain sentiment metrics in natural language."""
    user_requested: bool = Field(..., description="MUST be true - explicit user trigger required")
    asset_symbol: str = Field(..., min_length=1, max_length=20)
    asset_name: Optional[str] = None
    metrics: SentimentMetrics
    timeframe: str = Field(default="24h", pattern="^(1h|4h|12h|24h|7d|30d)$")

    @field_validator('user_requested')
    @classmethod
    def must_be_user_requested(cls, v: bool) -> bool:
        if not v:
            raise ValueError("LLM calls must be explicitly requested by user (user_requested must be true)")
        return v


class ExplainResponse(BaseModel):
    """Natural language explanation of sentiment metrics."""
    explanation: str = Field(..., max_length=2000)
    key_insights: List[str] = Field(default_factory=list, max_length=5)
    tokens_used: int
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    capability: LLMCapability = LLMCapability.EXPLAIN


# ============================================================================
# DAILY SUMMARY CAPABILITY
# Generate market recaps from daily aggregates
# ============================================================================

class DailyAggregate(BaseModel):
    """Daily aggregated metrics from core engine."""
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    assets_analyzed: int = Field(..., ge=0)
    total_mentions: int = Field(..., ge=0)
    average_sentiment: float = Field(..., ge=-1.0, le=1.0)
    top_movers: List[Dict[str, Any]] = Field(default_factory=list)
    dominant_emotions: Dict[str, float] = Field(default_factory=dict)
    anomalies_detected: int = Field(default=0)


class DailySummaryRequest(BaseModel):
    """Request for daily market summary."""
    user_requested: bool = Field(..., description="MUST be true - explicit user trigger required")
    daily_data: DailyAggregate
    focus_assets: Optional[List[str]] = Field(None, max_length=10)
    include_trends: bool = Field(default=True)

    @field_validator('user_requested')
    @classmethod
    def must_be_user_requested(cls, v: bool) -> bool:
        if not v:
            raise ValueError("LLM calls must be explicitly requested by user (user_requested must be true)")
        return v


class DailySummaryResponse(BaseModel):
    """Natural language daily market summary."""
    summary: str = Field(..., max_length=3000)
    highlights: List[str] = Field(default_factory=list, max_length=5)
    notable_movements: List[Dict[str, str]] = Field(default_factory=list)
    tokens_used: int
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    capability: LLMCapability = LLMCapability.DAILY_SUMMARY


# ============================================================================
# NARRATIVE CAPABILITY
# Synthesize themes from multi-source social data
# ============================================================================

class SourceData(BaseModel):
    """Aggregated data from a single source."""
    source: str = Field(..., pattern="^(twitter|reddit|news|discord)$")
    mention_count: int = Field(..., ge=0)
    sentiment_avg: float = Field(..., ge=-1.0, le=1.0)
    top_themes: List[str] = Field(default_factory=list, max_length=10)
    emotion_distribution: Dict[str, float] = Field(default_factory=dict)
    engagement_score: Optional[float] = Field(None, ge=0.0)


class NarrativeRequest(BaseModel):
    """Request for narrative analysis across sources."""
    user_requested: bool = Field(..., description="MUST be true - explicit user trigger required")
    asset_symbol: str = Field(..., min_length=1, max_length=20)
    sources: List[SourceData] = Field(..., min_length=1, max_length=4)
    timeframe: str = Field(default="24h", pattern="^(1h|4h|12h|24h|7d)$")
    context: Optional[str] = Field(None, max_length=500, description="Optional context like recent events")

    @field_validator('user_requested')
    @classmethod
    def must_be_user_requested(cls, v: bool) -> bool:
        if not v:
            raise ValueError("LLM calls must be explicitly requested by user (user_requested must be true)")
        return v


class NarrativeResponse(BaseModel):
    """Synthesized narrative from multi-source analysis."""
    narrative: str = Field(..., max_length=4000)
    themes_identified: List[str] = Field(default_factory=list, max_length=10)
    source_agreement: float = Field(..., ge=0.0, le=1.0, description="How aligned sources are")
    conflicting_signals: List[str] = Field(default_factory=list)
    tokens_used: int
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    capability: LLMCapability = LLMCapability.NARRATIVE


# ============================================================================
# USAGE TRACKING
# ============================================================================

class LLMUsageStats(BaseModel):
    """Usage statistics for rate limiting and cost tracking."""
    user_id: str
    tokens_used_today: int = 0
    tokens_used_month: int = 0
    requests_today: int = 0
    requests_month: int = 0
    daily_limit: int
    monthly_limit: int
    last_request: Optional[datetime] = None
    reset_daily_at: datetime
    reset_monthly_at: datetime

    @property
    def daily_remaining(self) -> int:
        return max(0, self.daily_limit - self.tokens_used_today)

    @property
    def monthly_remaining(self) -> int:
        return max(0, self.monthly_limit - self.tokens_used_month)

    @property
    def can_make_request(self) -> bool:
        return self.daily_remaining > 0 and self.monthly_remaining > 0


class LLMError(BaseModel):
    """Standardized error response."""
    error: str
    code: str = Field(..., pattern="^(rate_limit|token_limit|invalid_request|llm_error|service_unavailable)$")
    retry_after: Optional[int] = None  # seconds
    details: Optional[Dict[str, Any]] = None
