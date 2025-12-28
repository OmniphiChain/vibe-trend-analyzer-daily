# ============================================================================
# DEEPSEEK LLM ROUTES
# FastAPI endpoints for on-demand LLM capabilities
# ============================================================================

import logging
import re
from typing import Optional, List
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Header, Depends

from .client import DeepSeekClient, DeepSeekError, get_client
from .limits import UsageLimiter, get_limiter
from .schemas import (
    ExplainRequest,
    ExplainResponse,
    DailySummaryRequest,
    DailySummaryResponse,
    NarrativeRequest,
    NarrativeResponse,
    LLMUsageStats,
    LLMError,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/llm", tags=["LLM"])


# ============================================================================
# DEPENDENCIES
# ============================================================================

async def get_user_id(x_user_id: Optional[str] = Header(None, alias="X-User-ID")) -> str:
    """
    Extract user ID from request header.
    In production, this should validate against auth token.
    """
    if not x_user_id:
        raise HTTPException(
            status_code=401,
            detail={"error": "User ID required", "code": "invalid_request"}
        )
    return x_user_id


def validate_llm_available(client: DeepSeekClient = Depends(get_client)) -> DeepSeekClient:
    """Check if DeepSeek is properly configured."""
    if not client.is_configured:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "LLM service not configured",
                "code": "service_unavailable",
                "details": {"reason": "DEEPSEEK_API_KEY not set"}
            }
        )
    return client


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def parse_key_insights(content: str) -> List[str]:
    """Extract key insights from generated content."""
    insights = []

    # Look for bullet points or numbered lists
    lines = content.split('\n')
    for line in lines:
        line = line.strip()
        # Match bullet points, numbers, or dashes
        if re.match(r'^[\-\*\•]\s+', line) or re.match(r'^\d+[\.\)]\s+', line):
            # Clean up the line
            clean = re.sub(r'^[\-\*\•\d\.\)]+\s*', '', line)
            if len(clean) > 10 and len(clean) < 200:
                insights.append(clean)
                if len(insights) >= 5:
                    break

    return insights


def parse_themes(content: str) -> List[str]:
    """Extract identified themes from narrative content."""
    themes = []

    # Look for theme-related sections
    theme_patterns = [
        r'theme[s]?:\s*([^\n]+)',
        r'(?:key|main|dominant)\s+theme[s]?[:\s]+([^\n]+)',
        r'\*\*([^*]+)\*\*',  # Bold text often indicates themes
    ]

    for pattern in theme_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        for match in matches:
            theme = match.strip()
            if len(theme) > 5 and len(theme) < 100 and theme not in themes:
                themes.append(theme)
                if len(themes) >= 10:
                    break

    return themes[:10]


# ============================================================================
# ENDPOINTS
# ============================================================================

@router.post("/explain", response_model=ExplainResponse)
async def explain_sentiment(
    request: ExplainRequest,
    user_id: str = Depends(get_user_id),
    client: DeepSeekClient = Depends(validate_llm_available),
    limiter: UsageLimiter = Depends(get_limiter),
) -> ExplainResponse:
    """
    Generate natural language explanation of sentiment metrics.

    Requires:
    - user_requested: true (explicit user trigger)
    - X-User-ID header

    Rate limited per user and globally.
    """
    # Check usage limits
    limit_check = limiter.check_limits(user_id, estimated_tokens=1000)
    if not limit_check["allowed"]:
        raise HTTPException(
            status_code=429,
            detail={
                "error": limit_check["reason"],
                "code": limit_check["code"],
                "retry_after": limit_check["retry_after"],
            },
            headers={"Retry-After": str(limit_check["retry_after"] or 60)}
        )

    try:
        result = await client.explain(
            asset_symbol=request.asset_symbol,
            asset_name=request.asset_name,
            metrics=request.metrics.model_dump(),
            timeframe=request.timeframe,
        )

        # Record actual usage
        limiter.record_usage(user_id, result["tokens_used"])

        return ExplainResponse(
            explanation=result["content"],
            key_insights=parse_key_insights(result["content"]),
            tokens_used=result["tokens_used"],
            generated_at=datetime.now(timezone.utc),
        )

    except DeepSeekError as e:
        logger.error(f"DeepSeek error in explain: {e}")
        raise HTTPException(
            status_code=503 if e.code == "service_unavailable" else 500,
            detail={
                "error": str(e),
                "code": e.code,
                "retry_after": e.retry_after,
            }
        )


@router.post("/daily-summary", response_model=DailySummaryResponse)
async def generate_daily_summary(
    request: DailySummaryRequest,
    user_id: str = Depends(get_user_id),
    client: DeepSeekClient = Depends(validate_llm_available),
    limiter: UsageLimiter = Depends(get_limiter),
) -> DailySummaryResponse:
    """
    Generate daily market sentiment summary.

    Requires:
    - user_requested: true (explicit user trigger)
    - X-User-ID header

    Rate limited per user and globally.
    """
    # Check usage limits
    limit_check = limiter.check_limits(user_id, estimated_tokens=1500)
    if not limit_check["allowed"]:
        raise HTTPException(
            status_code=429,
            detail={
                "error": limit_check["reason"],
                "code": limit_check["code"],
                "retry_after": limit_check["retry_after"],
            },
            headers={"Retry-After": str(limit_check["retry_after"] or 60)}
        )

    try:
        result = await client.daily_summary(
            daily_data=request.daily_data.model_dump(),
            focus_assets=request.focus_assets,
            include_trends=request.include_trends,
        )

        # Record actual usage
        limiter.record_usage(user_id, result["tokens_used"])

        # Parse highlights from content
        highlights = parse_key_insights(result["content"])

        return DailySummaryResponse(
            summary=result["content"],
            highlights=highlights,
            notable_movements=[],  # Would need structured parsing
            tokens_used=result["tokens_used"],
            generated_at=datetime.now(timezone.utc),
        )

    except DeepSeekError as e:
        logger.error(f"DeepSeek error in daily-summary: {e}")
        raise HTTPException(
            status_code=503 if e.code == "service_unavailable" else 500,
            detail={
                "error": str(e),
                "code": e.code,
                "retry_after": e.retry_after,
            }
        )


@router.post("/narrative", response_model=NarrativeResponse)
async def generate_narrative(
    request: NarrativeRequest,
    user_id: str = Depends(get_user_id),
    client: DeepSeekClient = Depends(validate_llm_available),
    limiter: UsageLimiter = Depends(get_limiter),
) -> NarrativeResponse:
    """
    Generate narrative analysis from multi-source data.

    Requires:
    - user_requested: true (explicit user trigger)
    - X-User-ID header

    Rate limited per user and globally.
    """
    # Check usage limits
    limit_check = limiter.check_limits(user_id, estimated_tokens=2000)
    if not limit_check["allowed"]:
        raise HTTPException(
            status_code=429,
            detail={
                "error": limit_check["reason"],
                "code": limit_check["code"],
                "retry_after": limit_check["retry_after"],
            },
            headers={"Retry-After": str(limit_check["retry_after"] or 60)}
        )

    try:
        result = await client.narrative(
            asset_symbol=request.asset_symbol,
            sources=[s.model_dump() for s in request.sources],
            timeframe=request.timeframe,
            context=request.context,
        )

        # Record actual usage
        limiter.record_usage(user_id, result["tokens_used"])

        # Parse themes from content
        themes = parse_themes(result["content"])

        # Calculate source agreement based on sentiment variance
        if len(request.sources) > 1:
            sentiments = [s.sentiment_avg for s in request.sources]
            variance = sum((s - sum(sentiments)/len(sentiments))**2 for s in sentiments) / len(sentiments)
            # Convert variance to agreement score (lower variance = higher agreement)
            source_agreement = max(0.0, min(1.0, 1.0 - (variance * 2)))
        else:
            source_agreement = 1.0

        return NarrativeResponse(
            narrative=result["content"],
            themes_identified=themes,
            source_agreement=source_agreement,
            conflicting_signals=[],  # Would need structured parsing
            tokens_used=result["tokens_used"],
            generated_at=datetime.now(timezone.utc),
        )

    except DeepSeekError as e:
        logger.error(f"DeepSeek error in narrative: {e}")
        raise HTTPException(
            status_code=503 if e.code == "service_unavailable" else 500,
            detail={
                "error": str(e),
                "code": e.code,
                "retry_after": e.retry_after,
            }
        )


@router.get("/usage", response_model=dict)
async def get_usage_stats(
    user_id: str = Depends(get_user_id),
    limiter: UsageLimiter = Depends(get_limiter),
) -> dict:
    """Get current usage statistics for the user."""
    return limiter.get_user_stats(user_id)


@router.get("/health")
async def llm_health(
    client: DeepSeekClient = Depends(get_client),
) -> dict:
    """
    Check LLM service health.

    Returns configuration status without making API calls.
    """
    return {
        "service": "deepseek-llm",
        "configured": client.is_configured,
        "capabilities": ["explain", "daily-summary", "narrative"],
        "status": "ready" if client.is_configured else "unconfigured",
    }
