# ============================================================================
# SUMMARY API ROUTES
# Read-only endpoints for cached market summaries
# ============================================================================
#
# These endpoints NEVER call DeepSeek directly.
# They only return pre-generated, cached summaries.
# Safe to hit frequently — no LLM invocation on request.
# ============================================================================

import logging
from typing import Optional
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Query

from .storage import SummaryStorage, get_storage
from .jobs import SummaryScheduler, get_scheduler
from .schemas import (
    HourlySummaryResponse,
    DailySummaryResponse,
    SectorSummariesResponse,
    SummaryHealthResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/summaries", tags=["Summaries"])


# ============================================================================
# READ-ONLY ENDPOINTS
# ============================================================================

@router.get("/hourly", response_model=HourlySummaryResponse)
async def get_hourly_summary() -> HourlySummaryResponse:
    """
    Get the current hourly market summary.

    This endpoint returns cached data only.
    No DeepSeek calls are made on request.

    Returns:
    - Current hourly summary if available
    - Last successful summary if current expired (marked as stale)
    - Empty response if no summary exists
    """
    storage = get_storage()
    summary = storage.get_hourly()

    if summary:
        return HourlySummaryResponse(
            summary=summary,
            cached=True,
            message=None,
        )

    return HourlySummaryResponse(
        summary=None,
        cached=False,
        message="No hourly summary available. Summary is generated every hour.",
    )


@router.get("/daily", response_model=DailySummaryResponse)
async def get_daily_summary(
    date: Optional[str] = Query(
        None,
        description="Date in YYYY-MM-DD format. Defaults to today.",
        pattern=r"^\d{4}-\d{2}-\d{2}$",
    ),
) -> DailySummaryResponse:
    """
    Get the daily market summary.

    This endpoint returns cached data only.
    No DeepSeek calls are made on request.

    Args:
        date: Optional date filter (defaults to today)

    Returns:
    - Daily summary for the requested date
    - Last successful summary if current expired (marked as stale)
    - Empty response if no summary exists
    """
    storage = get_storage()
    summary = storage.get_daily(date)

    if summary:
        return DailySummaryResponse(
            summary=summary,
            cached=True,
            message=None,
        )

    date_str = date or datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return DailySummaryResponse(
        summary=None,
        cached=False,
        message=f"No daily summary available for {date_str}. Summary is generated once per day.",
    )


@router.get("/sectors", response_model=SectorSummariesResponse)
async def get_sector_summaries(
    date: Optional[str] = Query(
        None,
        description="Date in YYYY-MM-DD format. Defaults to today.",
        pattern=r"^\d{4}-\d{2}-\d{2}$",
    ),
) -> SectorSummariesResponse:
    """
    Get all sector summaries for a date.

    This endpoint returns cached data only.
    No DeepSeek calls are made on request.

    Args:
        date: Optional date filter (defaults to today)

    Returns:
    - List of sector summaries for the requested date
    - Empty list if no summaries exist
    """
    storage = get_storage()
    date_str = date or datetime.now(timezone.utc).strftime("%Y-%m-%d")
    summaries = storage.get_sectors(date_str)

    if summaries:
        return SectorSummariesResponse(
            summaries=summaries,
            date=date_str,
            cached=True,
            message=None,
        )

    return SectorSummariesResponse(
        summaries=[],
        date=date_str,
        cached=False,
        message="No sector summaries available. Sector summaries are generated daily.",
    )


# ============================================================================
# HEALTH & STATUS
# ============================================================================

@router.get("/health", response_model=SummaryHealthResponse)
async def summary_health() -> SummaryHealthResponse:
    """
    Check summary system health and schedule status.

    Returns:
    - Scheduler running status
    - Last/next generation times
    - Cached summary count
    """
    scheduler = get_scheduler()
    storage = get_storage()
    schedule = scheduler.get_schedule_info()

    return SummaryHealthResponse(
        scheduler_running=schedule["running"],
        last_hourly=datetime.fromisoformat(schedule["last_hourly"]) if schedule["last_hourly"] else None,
        last_daily=datetime.fromisoformat(schedule["last_daily"]) if schedule["last_daily"] else None,
        next_hourly=datetime.fromisoformat(schedule["next_hourly"]) if schedule["next_hourly"] else None,
        next_daily=datetime.fromisoformat(schedule["next_daily"]) if schedule["next_daily"] else None,
        cached_summaries=storage.get_cached_count(),
    )


@router.get("/stats")
async def get_stats() -> dict:
    """
    Get summary system statistics.

    Returns cache hit/miss rates and generation counts.
    """
    storage = get_storage()
    scheduler = get_scheduler()

    return {
        "cache": storage.get_stats(),
        "schedule": scheduler.get_schedule_info(),
        "invocations": scheduler.generator.get_invocation_log()[-10:],  # Last 10
    }


# ============================================================================
# ADMIN ENDPOINTS (for testing/manual triggers)
# ============================================================================

@router.post("/trigger/hourly", include_in_schema=False)
async def trigger_hourly():
    """
    Manually trigger hourly summary generation.

    FOR ADMIN/TESTING ONLY.
    Not exposed in public API docs.
    """
    scheduler = get_scheduler()

    if not scheduler.is_running:
        raise HTTPException(
            status_code=503,
            detail="Scheduler not running. Start the scheduler first."
        )

    summary = await scheduler.trigger_hourly()

    if summary:
        return {"status": "generated", "summary_id": summary.id}

    return {"status": "failed", "message": "Could not generate summary"}


@router.post("/trigger/daily", include_in_schema=False)
async def trigger_daily():
    """
    Manually trigger daily summary generation.

    FOR ADMIN/TESTING ONLY.
    Not exposed in public API docs.
    """
    scheduler = get_scheduler()

    if not scheduler.is_running:
        raise HTTPException(
            status_code=503,
            detail="Scheduler not running. Start the scheduler first."
        )

    summary = await scheduler.trigger_daily()

    if summary:
        return {"status": "generated", "summary_id": summary.id}

    return {"status": "failed", "message": "Could not generate summary"}
