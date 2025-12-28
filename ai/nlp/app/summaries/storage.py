# ============================================================================
# SUMMARY STORAGE
# In-memory cache with TTL for scheduled summaries
# ============================================================================
#
# For production, this should be backed by Redis.
# This implementation provides the interface and TTL logic.
# ============================================================================

import logging
from typing import Optional, Dict, List
from datetime import datetime, timedelta, timezone
from dataclasses import dataclass, field

from .schemas import (
    SummaryType,
    SummaryStatus,
    HourlySummary,
    DailySummary,
    SectorSummary,
)

logger = logging.getLogger(__name__)


# TTL Configuration (in minutes)
HOURLY_TTL_MINUTES = 65  # Slightly longer than 1 hour
DAILY_TTL_MINUTES = 25 * 60  # 25 hours


@dataclass
class CachedSummary:
    """Wrapper for cached summary with metadata."""
    summary: HourlySummary | DailySummary | SectorSummary
    cached_at: datetime
    expires_at: datetime
    hit_count: int = 0

    @property
    def is_expired(self) -> bool:
        return datetime.now(timezone.utc) > self.expires_at

    def record_hit(self) -> None:
        self.hit_count += 1


class SummaryStorage:
    """
    In-memory storage for scheduled summaries with TTL.

    Features:
    - Automatic TTL expiration
    - Last successful summary fallback
    - Hit counting for monitoring
    - Thread-safe (single worker deployment)
    """

    def __init__(self):
        # Current summaries (keyed by type + identifier)
        self._cache: Dict[str, CachedSummary] = {}

        # Last successful summaries (fallback if generation fails)
        self._last_successful: Dict[str, CachedSummary] = {}

        # Generation locks (prevent concurrent generation)
        self._generating: Dict[str, bool] = {}

        # Statistics
        self._stats = {
            "cache_hits": 0,
            "cache_misses": 0,
            "fallback_uses": 0,
            "total_generations": 0,
        }

    def _make_key(self, summary_type: SummaryType, identifier: str = "") -> str:
        """Create cache key from type and identifier."""
        if identifier:
            return f"{summary_type.value}:{identifier}"
        return summary_type.value

    def _get_ttl(self, summary_type: SummaryType) -> timedelta:
        """Get TTL for summary type."""
        if summary_type == SummaryType.HOURLY:
            return timedelta(minutes=HOURLY_TTL_MINUTES)
        else:  # DAILY and SECTOR
            return timedelta(minutes=DAILY_TTL_MINUTES)

    # =========================================================================
    # HOURLY SUMMARY
    # =========================================================================

    def get_hourly(self) -> Optional[HourlySummary]:
        """
        Get current hourly summary.
        Returns cached version if valid, or last successful if expired.
        """
        key = self._make_key(SummaryType.HOURLY)
        cached = self._cache.get(key)

        if cached and not cached.is_expired:
            cached.record_hit()
            self._stats["cache_hits"] += 1
            logger.debug(f"Hourly summary cache hit (hits: {cached.hit_count})")
            return cached.summary

        # Check for last successful fallback
        fallback = self._last_successful.get(key)
        if fallback:
            self._stats["fallback_uses"] += 1
            logger.info("Using fallback hourly summary (current expired or missing)")
            # Mark as stale
            fallback.summary.status = SummaryStatus.STALE
            return fallback.summary

        self._stats["cache_misses"] += 1
        return None

    def store_hourly(self, summary: HourlySummary) -> None:
        """Store hourly summary with TTL."""
        key = self._make_key(SummaryType.HOURLY)
        ttl = self._get_ttl(SummaryType.HOURLY)
        now = datetime.now(timezone.utc)

        cached = CachedSummary(
            summary=summary,
            cached_at=now,
            expires_at=now + ttl,
        )

        self._cache[key] = cached

        # Also store as last successful
        if summary.status == SummaryStatus.COMPLETED:
            self._last_successful[key] = cached
            self._stats["total_generations"] += 1

        logger.info(f"Stored hourly summary (expires: {cached.expires_at})")

    # =========================================================================
    # DAILY SUMMARY
    # =========================================================================

    def get_daily(self, date: Optional[str] = None) -> Optional[DailySummary]:
        """
        Get daily summary for date.
        If no date provided, returns today's summary.
        """
        if date is None:
            date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

        key = self._make_key(SummaryType.DAILY, date)
        cached = self._cache.get(key)

        if cached and not cached.is_expired:
            cached.record_hit()
            self._stats["cache_hits"] += 1
            logger.debug(f"Daily summary cache hit for {date}")
            return cached.summary

        # Check for last successful fallback
        fallback = self._last_successful.get(key)
        if fallback:
            self._stats["fallback_uses"] += 1
            logger.info(f"Using fallback daily summary for {date}")
            fallback.summary.status = SummaryStatus.STALE
            return fallback.summary

        self._stats["cache_misses"] += 1
        return None

    def store_daily(self, summary: DailySummary) -> None:
        """Store daily summary with TTL."""
        key = self._make_key(SummaryType.DAILY, summary.date)
        ttl = self._get_ttl(SummaryType.DAILY)
        now = datetime.now(timezone.utc)

        cached = CachedSummary(
            summary=summary,
            cached_at=now,
            expires_at=now + ttl,
        )

        self._cache[key] = cached

        if summary.status == SummaryStatus.COMPLETED:
            self._last_successful[key] = cached
            self._stats["total_generations"] += 1

        logger.info(f"Stored daily summary for {summary.date}")

    # =========================================================================
    # SECTOR SUMMARIES
    # =========================================================================

    def get_sectors(self, date: Optional[str] = None) -> List[SectorSummary]:
        """Get all sector summaries for date."""
        if date is None:
            date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

        summaries = []
        prefix = f"{SummaryType.SECTOR.value}:{date}:"

        for key, cached in self._cache.items():
            if key.startswith(prefix):
                if not cached.is_expired:
                    cached.record_hit()
                    summaries.append(cached.summary)
                else:
                    # Check fallback
                    fallback = self._last_successful.get(key)
                    if fallback:
                        fallback.summary.status = SummaryStatus.STALE
                        summaries.append(fallback.summary)

        if summaries:
            self._stats["cache_hits"] += 1
        else:
            self._stats["cache_misses"] += 1

        return summaries

    def store_sector(self, summary: SectorSummary) -> None:
        """Store sector summary with TTL."""
        key = self._make_key(SummaryType.SECTOR, f"{summary.date}:{summary.sector}")
        ttl = self._get_ttl(SummaryType.SECTOR)
        now = datetime.now(timezone.utc)

        cached = CachedSummary(
            summary=summary,
            cached_at=now,
            expires_at=now + ttl,
        )

        self._cache[key] = cached

        if summary.status == SummaryStatus.COMPLETED:
            self._last_successful[key] = cached
            self._stats["total_generations"] += 1

        logger.info(f"Stored sector summary: {summary.sector} for {summary.date}")

    # =========================================================================
    # GENERATION LOCKS
    # =========================================================================

    def is_generating(self, summary_type: SummaryType, identifier: str = "") -> bool:
        """Check if summary is currently being generated."""
        key = self._make_key(summary_type, identifier)
        return self._generating.get(key, False)

    def set_generating(self, summary_type: SummaryType, identifier: str = "", value: bool = True) -> None:
        """Set generation lock."""
        key = self._make_key(summary_type, identifier)
        self._generating[key] = value

    # =========================================================================
    # UTILITIES
    # =========================================================================

    def get_stats(self) -> Dict[str, int]:
        """Get cache statistics."""
        return {
            **self._stats,
            "cached_count": len(self._cache),
            "fallback_count": len(self._last_successful),
        }

    def clear_expired(self) -> int:
        """Remove expired entries. Returns count removed."""
        now = datetime.now(timezone.utc)
        expired_keys = [
            key for key, cached in self._cache.items()
            if cached.expires_at < now
        ]
        for key in expired_keys:
            del self._cache[key]

        logger.info(f"Cleared {len(expired_keys)} expired summaries")
        return len(expired_keys)

    def get_cached_count(self) -> int:
        """Get count of cached summaries."""
        return len(self._cache)


# Singleton instance
_storage: Optional[SummaryStorage] = None


def get_storage() -> SummaryStorage:
    """Get or create singleton storage instance."""
    global _storage
    if _storage is None:
        _storage = SummaryStorage()
    return _storage
