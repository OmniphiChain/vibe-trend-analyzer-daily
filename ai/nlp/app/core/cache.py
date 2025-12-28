# ============================================================================
# INFERENCE CACHE
# In-memory TTL cache for analysis results
# ============================================================================
#
# Features:
# - Text normalization for consistent cache keys
# - SHA-256 hashing for key generation
# - TTL-based expiration
# - Thread-safe (single worker deployment)
# - Redis-upgrade-ready interface
#
# Cache rules:
# - Lookup MUST precede inference
# - Expired entries MUST be removed
# - Cache failure MUST NOT crash inference
# ============================================================================

import hashlib
import logging
import re
from typing import Optional, Dict, Any, List, Tuple
from datetime import datetime, timedelta, timezone
from dataclasses import dataclass, field

logger = logging.getLogger(__name__)


# TTL Configuration
DEFAULT_TTL_SECONDS = 86400  # 24 hours
MAX_CACHE_SIZE = 10000  # Maximum entries before cleanup


def normalize_text(text: str) -> str:
    """
    Normalize text for consistent cache key generation.

    Operations:
    - Lowercase
    - Trim whitespace
    - Collapse repeated spaces
    """
    if not text:
        return ""

    # Lowercase
    normalized = text.lower()

    # Trim whitespace
    normalized = normalized.strip()

    # Collapse repeated spaces to single space
    normalized = re.sub(r'\s+', ' ', normalized)

    return normalized


def hash_text(text: str) -> str:
    """
    Generate SHA-256 hash of normalized text.

    Returns hex digest for use as cache key.
    """
    normalized = normalize_text(text)
    return hashlib.sha256(normalized.encode('utf-8')).hexdigest()


@dataclass
class CacheEntry:
    """Single cache entry with TTL tracking."""
    value: Dict[str, Any]
    created_at: datetime
    expires_at: datetime
    hit_count: int = 0

    @property
    def is_expired(self) -> bool:
        return datetime.now(timezone.utc) > self.expires_at

    def record_hit(self) -> None:
        self.hit_count += 1


class InferenceCache:
    """
    In-memory TTL cache for inference results.

    Designed to be Redis-upgrade-ready:
    - Simple get/set interface
    - TTL-based expiration
    - Key normalization built-in

    Thread-safety: Safe for single-worker deployment.
    For multi-worker, upgrade to Redis.
    """

    def __init__(self, default_ttl: int = DEFAULT_TTL_SECONDS):
        self._cache: Dict[str, CacheEntry] = {}
        self._default_ttl = default_ttl

        # Statistics
        self._stats = {
            "hits": 0,
            "misses": 0,
            "sets": 0,
            "evictions": 0,
            "expired_cleanups": 0,
        }

    def _make_key(self, text: str) -> str:
        """Generate cache key from text."""
        return hash_text(text)

    def get(self, text: str) -> Optional[Dict[str, Any]]:
        """
        Get cached result for text.

        Returns None if:
        - Key not found
        - Entry expired

        Expired entries are removed on access.
        """
        try:
            key = self._make_key(text)
            entry = self._cache.get(key)

            if entry is None:
                self._stats["misses"] += 1
                return None

            if entry.is_expired:
                # Remove expired entry
                del self._cache[key]
                self._stats["misses"] += 1
                self._stats["expired_cleanups"] += 1
                return None

            # Cache hit
            entry.record_hit()
            self._stats["hits"] += 1
            return entry.value

        except Exception as e:
            # Cache failure must not crash inference
            logger.error(f"Cache get error: {e}")
            self._stats["misses"] += 1
            return None

    def set(
        self,
        text: str,
        value: Dict[str, Any],
        ttl: Optional[int] = None,
    ) -> bool:
        """
        Store result in cache.

        Args:
            text: Original text (will be normalized)
            value: Analysis result to cache
            ttl: Optional TTL in seconds (defaults to DEFAULT_TTL)

        Returns:
            True if stored successfully, False on error
        """
        try:
            # Cleanup if cache is full
            if len(self._cache) >= MAX_CACHE_SIZE:
                self._cleanup_expired()

                # If still full, evict oldest entries
                if len(self._cache) >= MAX_CACHE_SIZE:
                    self._evict_oldest(MAX_CACHE_SIZE // 10)

            key = self._make_key(text)
            ttl_seconds = ttl or self._default_ttl
            now = datetime.now(timezone.utc)

            self._cache[key] = CacheEntry(
                value=value,
                created_at=now,
                expires_at=now + timedelta(seconds=ttl_seconds),
            )

            self._stats["sets"] += 1
            return True

        except Exception as e:
            # Cache failure must not crash inference
            logger.error(f"Cache set error: {e}")
            return False

    def get_many(self, texts: List[str]) -> Dict[str, Optional[Dict[str, Any]]]:
        """
        Get cached results for multiple texts.

        Returns dict mapping original text to result (or None if not cached).
        """
        results = {}
        for text in texts:
            results[text] = self.get(text)
        return results

    def set_many(
        self,
        items: List[Tuple[str, Dict[str, Any]]],
        ttl: Optional[int] = None,
    ) -> int:
        """
        Store multiple results in cache.

        Args:
            items: List of (text, result) tuples
            ttl: Optional TTL in seconds

        Returns:
            Number of items successfully stored
        """
        success_count = 0
        for text, value in items:
            if self.set(text, value, ttl):
                success_count += 1
        return success_count

    def _cleanup_expired(self) -> int:
        """Remove all expired entries. Returns count removed."""
        now = datetime.now(timezone.utc)
        expired_keys = [
            key for key, entry in self._cache.items()
            if entry.expires_at < now
        ]

        for key in expired_keys:
            del self._cache[key]

        self._stats["expired_cleanups"] += len(expired_keys)
        logger.debug(f"Cleaned up {len(expired_keys)} expired cache entries")
        return len(expired_keys)

    def _evict_oldest(self, count: int) -> int:
        """Evict oldest entries. Returns count evicted."""
        if count <= 0 or not self._cache:
            return 0

        # Sort by created_at
        sorted_keys = sorted(
            self._cache.keys(),
            key=lambda k: self._cache[k].created_at
        )

        evicted = 0
        for key in sorted_keys[:count]:
            del self._cache[key]
            evicted += 1

        self._stats["evictions"] += evicted
        logger.debug(f"Evicted {evicted} oldest cache entries")
        return evicted

    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics."""
        total_requests = self._stats["hits"] + self._stats["misses"]
        hit_ratio = (
            self._stats["hits"] / total_requests
            if total_requests > 0
            else 0.0
        )

        return {
            **self._stats,
            "size": len(self._cache),
            "hit_ratio": round(hit_ratio, 3),
            "total_requests": total_requests,
        }

    def clear(self) -> int:
        """Clear all cache entries. Returns count cleared."""
        count = len(self._cache)
        self._cache.clear()
        logger.info(f"Cache cleared: {count} entries removed")
        return count


# Singleton instance
_cache: Optional[InferenceCache] = None


def get_cache() -> InferenceCache:
    """Get or create singleton cache instance."""
    global _cache
    if _cache is None:
        _cache = InferenceCache()
    return _cache
