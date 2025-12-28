# ============================================================================
# SCHEDULED MARKET SUMMARIES
# System-generated, shared summaries using DeepSeek LLM
# ============================================================================
#
# This module provides scheduled market summaries that are:
# - Generated on a fixed schedule (hourly, daily)
# - Shared and cached for ALL users
# - Never generated per-user or on page load
# - Built from aggregated sentiment data only
#
# ALLOWED:
# - Hourly market summary (every 60 minutes)
# - Daily market summary (once per day)
# - Sector summaries (once per day, optional)
#
# PROHIBITED:
# - Per-user generation
# - On-demand generation on page load
# - Raw text processing
# - Trading advice or predictions
# ============================================================================

from .routes import router as summaries_router
from .storage import SummaryStorage, get_storage
from .jobs import SummaryScheduler, get_scheduler
from .schemas import (
    HourlySummary,
    DailySummary,
    SectorSummary,
    SummaryType,
)

__all__ = [
    "summaries_router",
    "SummaryStorage",
    "get_storage",
    "SummaryScheduler",
    "get_scheduler",
    "HourlySummary",
    "DailySummary",
    "SectorSummary",
    "SummaryType",
]
