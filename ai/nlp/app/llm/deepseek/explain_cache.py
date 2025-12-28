# ============================================================================
# EXPLANATION CACHE
# Short-TTL cache for DeepSeek explain responses
# ============================================================================
#
# Cache key format: explain:{ticker}:{window}:{data_hash}
# TTL: 10 minutes (configurable)
#
# Rules:
# - Cache lookup MUST happen before DeepSeek call
# - Only cache successful responses
# - Cache failure must not crash the explain flow
# ============================================================================

import hashlib
import json
import logging
from typing import Optional, Dict, Any
from datetime import datetime, timedelta, timezone
from dataclasses import dataclass

logger = logging.getLogger(__name__)

# TTL Configuration
EXPLAIN_CACHE_TTL_SECONDS = 600  # 10 minutes
MAX_EXPLAIN_CACHE_SIZE = 500  # Maximum cached explanations


def hash_data(data: Dict[str, Any]) -> str:
    """Generate SHA-256 hash of structured data for cache key."""
    serialized = json.dumps(data, sort_keys=True, separators=(',', ':'))
    return hashlib.sha256(serialized.encode('utf-8')).hexdigest()[:16]


def make_cache_key(ticker: str, window: str, data: Dict[str, Any]) -> str:
    """
    Create cache key for explanation.

    Format: explain:{ticker}:{window}:{data_hash}
    """
    data_hash = hash_data(data)
    return f"explain:{ticker.upper()}:{window}:{data_hash}"


@dataclass
class ExplainCacheEntry:
    """Cached explanation with metadata."""
    content: str
    tokens_used: int
    cached_at: datetime
    expires_at: datetime
    hit_count: int = 0

    @property
    def is_expired(self) -> bool:
        return datetime.now(timezone.utc) > self.expires_at

    def record_hit(self) -> None:
        self.hit_count += 1


class ExplainCache:
    """
    Short-TTL in-memory cache for explain responses.

    Designed for:
    - Fast cache hits on repeated explain requests
    - Reducing DeepSeek API calls
    - Low memory footprint
    """

    def __init__(self, ttl_seconds: int = EXPLAIN_CACHE_TTL_SECONDS):
        self._cache: Dict[str, ExplainCacheEntry] = {}
        self._ttl = ttl_seconds
        self._stats = {
            "hits": 0,
            "misses": 0,
            "stores": 0,
            "evictions": 0,
        }

    def get(
        self,
        ticker: str,
        window: str,
        data: Dict[str, Any],
    ) -> Optional[Dict[str, Any]]:
        """
        Get cached explanation.

        Returns None if not found or expired.
        """
        try:
            key = make_cache_key(ticker, window, data)
            entry = self._cache.get(key)

            if entry is None:
                self._stats["misses"] += 1
                logger.debug(f"Explain cache MISS: {ticker}/{window}")
                return None

            if entry.is_expired:
                del self._cache[key]
                self._stats["misses"] += 1
                logger.debug(f"Explain cache EXPIRED: {ticker}/{window}")
                return None

            entry.record_hit()
            self._stats["hits"] += 1
            logger.info(f"Explain cache HIT: {ticker}/{window} (hits: {entry.hit_count})")

            return {
                "content": entry.content,
                "tokens_used": entry.tokens_used,
                "cached": True,
                "cache_age_seconds": int(
                    (datetime.now(timezone.utc) - entry.cached_at).total_seconds()
                ),
            }

        except Exception as e:
            logger.error(f"Explain cache get error: {e}")
            self._stats["misses"] += 1
            return None

    def store(
        self,
        ticker: str,
        window: str,
        data: Dict[str, Any],
        content: str,
        tokens_used: int,
    ) -> bool:
        """
        Store explanation in cache.

        Only stores successful responses.
        """
        try:
            # Cleanup if cache is full
            if len(self._cache) >= MAX_EXPLAIN_CACHE_SIZE:
                self._cleanup_expired()
                if len(self._cache) >= MAX_EXPLAIN_CACHE_SIZE:
                    self._evict_oldest(MAX_EXPLAIN_CACHE_SIZE // 10)

            key = make_cache_key(ticker, window, data)
            now = datetime.now(timezone.utc)

            self._cache[key] = ExplainCacheEntry(
                content=content,
                tokens_used=tokens_used,
                cached_at=now,
                expires_at=now + timedelta(seconds=self._ttl),
            )

            self._stats["stores"] += 1
            logger.debug(f"Explain cache STORE: {ticker}/{window}")
            return True

        except Exception as e:
            logger.error(f"Explain cache store error: {e}")
            return False

    def _cleanup_expired(self) -> int:
        """Remove expired entries."""
        now = datetime.now(timezone.utc)
        expired_keys = [
            key for key, entry in self._cache.items()
            if entry.expires_at < now
        ]
        for key in expired_keys:
            del self._cache[key]
        return len(expired_keys)

    def _evict_oldest(self, count: int) -> int:
        """Evict oldest entries by cached_at."""
        if count <= 0 or not self._cache:
            return 0

        sorted_keys = sorted(
            self._cache.keys(),
            key=lambda k: self._cache[k].cached_at
        )

        evicted = 0
        for key in sorted_keys[:count]:
            del self._cache[key]
            evicted += 1

        self._stats["evictions"] += evicted
        return evicted

    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics."""
        total = self._stats["hits"] + self._stats["misses"]
        hit_ratio = self._stats["hits"] / total if total > 0 else 0.0

        return {
            **self._stats,
            "size": len(self._cache),
            "hit_ratio": round(hit_ratio, 3),
            "ttl_seconds": self._ttl,
        }

    def clear(self) -> int:
        """Clear all entries."""
        count = len(self._cache)
        self._cache.clear()
        return count


# Singleton instance
_explain_cache: Optional[ExplainCache] = None


def get_explain_cache() -> ExplainCache:
    """Get or create singleton explain cache."""
    global _explain_cache
    if _explain_cache is None:
        _explain_cache = ExplainCache()
    return _explain_cache
