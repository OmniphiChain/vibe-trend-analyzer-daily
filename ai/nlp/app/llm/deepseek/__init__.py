# ============================================================================
# DEEPSEEK LLM SERVICE LAYER
# On-demand natural language generation for MoodMeter
# ============================================================================
#
# This module provides optional DeepSeek LLM capabilities that are:
# - Fully isolated from the core AI engine
# - Triggered only by explicit user request
# - Cost-controlled with usage tracking
# - Fail-safe (core engine works without it)
#
# ALLOWED CAPABILITIES:
# 1. Explanation - Transform sentiment metrics into prose
# 2. Daily Summary - Generate market recaps from daily aggregates
# 3. Narrative Analysis - Synthesize themes from multi-source data
#
# PROHIBITED:
# - Raw text processing (sentiment, emotion, entity extraction)
# - Auto-triggered background jobs
# - Trading advice or predictions
# ============================================================================

from .client import DeepSeekClient
from .limits import UsageLimiter, UsageTracker
from .routes import router as deepseek_router
from .schemas import (
    ExplainRequest,
    ExplainResponse,
    DailySummaryRequest,
    DailySummaryResponse,
    NarrativeRequest,
    NarrativeResponse,
    LLMUsageStats,
)

__all__ = [
    # Client
    "DeepSeekClient",
    # Limits
    "UsageLimiter",
    "UsageTracker",
    # Routes
    "deepseek_router",
    # Schemas
    "ExplainRequest",
    "ExplainResponse",
    "DailySummaryRequest",
    "DailySummaryResponse",
    "NarrativeRequest",
    "NarrativeResponse",
    "LLMUsageStats",
]
