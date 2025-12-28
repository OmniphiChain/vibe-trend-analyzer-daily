# ============================================================================
# SUMMARY SCHEMAS
# Pydantic models for scheduled market summaries
# ============================================================================

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class SummaryType(str, Enum):
    """Types of scheduled summaries."""
    HOURLY = "hourly"
    DAILY = "daily"
    SECTOR = "sector"


class SummaryStatus(str, Enum):
    """Summary generation status."""
    PENDING = "pending"
    GENERATING = "generating"
    COMPLETED = "completed"
    FAILED = "failed"
    STALE = "stale"  # TTL expired but using last successful


# ============================================================================
# AGGREGATED INPUT DATA (what we receive from core engine)
# ============================================================================

class HourlyAggregateInput(BaseModel):
    """Hourly aggregated data from core engine."""
    timestamp: datetime
    market_sentiment: float = Field(..., ge=-1.0, le=1.0)
    sentiment_change: float = Field(default=0.0, description="Change from previous hour")
    volume: int = Field(..., ge=0, description="Total mentions analyzed")
    volume_change_pct: float = Field(default=0.0)
    top_positive: List[Dict[str, Any]] = Field(default_factory=list, max_length=5)
    top_negative: List[Dict[str, Any]] = Field(default_factory=list, max_length=5)
    dominant_emotion: str = Field(default="neutral")
    volatility: str = Field(default="low", pattern="^(low|moderate|high)$")


class DailyAggregateInput(BaseModel):
    """Daily aggregated data from core engine."""
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    market_sentiment: float = Field(..., ge=-1.0, le=1.0)
    sentiment_change: float = Field(default=0.0, description="Change from previous day")
    total_volume: int = Field(..., ge=0)
    assets_analyzed: int = Field(..., ge=0)
    top_movers: List[Dict[str, Any]] = Field(default_factory=list)
    top_positive: List[Dict[str, Any]] = Field(default_factory=list, max_length=10)
    top_negative: List[Dict[str, Any]] = Field(default_factory=list, max_length=10)
    dominant_emotions: Dict[str, float] = Field(default_factory=dict)
    anomalies_detected: int = Field(default=0)
    volatility: str = Field(default="low", pattern="^(low|moderate|high)$")


class SectorAggregateInput(BaseModel):
    """Sector-level aggregated data from core engine."""
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    sector: str = Field(..., min_length=1)
    sentiment: float = Field(..., ge=-1.0, le=1.0)
    sentiment_change: float = Field(default=0.0)
    volume: int = Field(..., ge=0)
    top_tickers: List[Dict[str, Any]] = Field(default_factory=list, max_length=5)
    dominant_emotion: str = Field(default="neutral")


# ============================================================================
# SUMMARY OUTPUT (what we store and serve)
# ============================================================================

class BaseSummary(BaseModel):
    """Base fields for all summaries."""
    id: str
    type: SummaryType
    status: SummaryStatus
    generated_at: datetime
    expires_at: datetime
    tokens_used: int = 0
    generation_time_ms: int = 0


class HourlySummary(BaseSummary):
    """Hourly market summary."""
    type: SummaryType = SummaryType.HOURLY
    hour: str = Field(..., description="Hour in format YYYY-MM-DD-HH")
    summary: str = Field(..., max_length=1000)
    market_sentiment: float
    sentiment_direction: str = Field(..., pattern="^(up|down|stable)$")
    key_highlights: List[str] = Field(default_factory=list, max_length=3)
    input_data: Optional[HourlyAggregateInput] = None


class DailySummary(BaseSummary):
    """Daily market summary."""
    type: SummaryType = SummaryType.DAILY
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    summary: str = Field(..., max_length=2000)
    market_sentiment: float
    sentiment_direction: str = Field(..., pattern="^(up|down|stable)$")
    key_highlights: List[str] = Field(default_factory=list, max_length=5)
    notable_movers: List[Dict[str, str]] = Field(default_factory=list)
    input_data: Optional[DailyAggregateInput] = None


class SectorSummary(BaseSummary):
    """Sector-level summary."""
    type: SummaryType = SummaryType.SECTOR
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    sector: str
    summary: str = Field(..., max_length=1000)
    sentiment: float
    sentiment_direction: str = Field(..., pattern="^(up|down|stable)$")
    top_ticker: Optional[str] = None
    input_data: Optional[SectorAggregateInput] = None


# ============================================================================
# API RESPONSES
# ============================================================================

class HourlySummaryResponse(BaseModel):
    """Response for GET /summaries/hourly."""
    summary: Optional[HourlySummary] = None
    cached: bool = False
    message: Optional[str] = None


class DailySummaryResponse(BaseModel):
    """Response for GET /summaries/daily."""
    summary: Optional[DailySummary] = None
    cached: bool = False
    message: Optional[str] = None


class SectorSummariesResponse(BaseModel):
    """Response for GET /summaries/sectors."""
    summaries: List[SectorSummary] = Field(default_factory=list)
    date: str
    cached: bool = False
    message: Optional[str] = None


class SummaryHealthResponse(BaseModel):
    """Health check for summary system."""
    scheduler_running: bool
    last_hourly: Optional[datetime] = None
    last_daily: Optional[datetime] = None
    next_hourly: Optional[datetime] = None
    next_daily: Optional[datetime] = None
    cached_summaries: int = 0
