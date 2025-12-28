# ============================================================================
# BATCHING UTILITIES
# Chunking and batch configuration for inference
# ============================================================================
#
# Rules:
# - Batch size is computed ONCE per request
# - No dynamic resizing mid-batch
# - CPU-safe limits enforced
# ============================================================================

import logging
from typing import List, TypeVar, Iterator
from dataclasses import dataclass

logger = logging.getLogger(__name__)


# Batch size limits (CPU-safe)
MIN_BATCH_SIZE = 4
DEFAULT_BATCH_SIZE = 8
MAX_BATCH_SIZE = 32


T = TypeVar('T')


@dataclass
class BatchConfig:
    """Configuration for batch processing."""
    batch_size: int
    source: str  # "user" or "adaptive"
    original_request: int | None  # Original user-requested size (before clamping)

    @classmethod
    def from_user(cls, requested_size: int) -> "BatchConfig":
        """
        Create config from user-provided batch size.

        Clamps to [MIN_BATCH_SIZE, MAX_BATCH_SIZE].
        """
        clamped = max(MIN_BATCH_SIZE, min(requested_size, MAX_BATCH_SIZE))

        if clamped != requested_size:
            logger.info(
                f"Batch size clamped: {requested_size} -> {clamped} "
                f"(limits: {MIN_BATCH_SIZE}-{MAX_BATCH_SIZE})"
            )

        return cls(
            batch_size=clamped,
            source="user",
            original_request=requested_size,
        )

    @classmethod
    def from_adaptive(cls, computed_size: int) -> "BatchConfig":
        """Create config from adaptively computed batch size."""
        # Adaptive already respects limits, but enforce anyway
        safe_size = max(MIN_BATCH_SIZE, min(computed_size, MAX_BATCH_SIZE))

        return cls(
            batch_size=safe_size,
            source="adaptive",
            original_request=None,
        )


def chunk_texts(texts: List[T], batch_size: int) -> Iterator[List[T]]:
    """
    Split texts into batches of specified size.

    Args:
        texts: List of items to chunk
        batch_size: Maximum items per batch

    Yields:
        Lists of items, each at most batch_size length

    Example:
        >>> list(chunk_texts([1,2,3,4,5], 2))
        [[1, 2], [3, 4], [5]]
    """
    if batch_size <= 0:
        batch_size = DEFAULT_BATCH_SIZE

    for i in range(0, len(texts), batch_size):
        yield texts[i:i + batch_size]


def calculate_num_batches(total_items: int, batch_size: int) -> int:
    """Calculate number of batches needed."""
    if total_items <= 0:
        return 0
    if batch_size <= 0:
        batch_size = DEFAULT_BATCH_SIZE

    return (total_items + batch_size - 1) // batch_size


@dataclass
class BatchingStats:
    """Statistics for a batch processing run."""
    total_texts: int
    cached_texts: int
    uncached_texts: int
    batch_size: int
    num_batches: int
    batch_source: str

    @property
    def cache_hit_ratio(self) -> float:
        if self.total_texts == 0:
            return 0.0
        return self.cached_texts / self.total_texts

    def to_dict(self) -> dict:
        return {
            "total_texts": self.total_texts,
            "cached_texts": self.cached_texts,
            "uncached_texts": self.uncached_texts,
            "batch_size": self.batch_size,
            "num_batches": self.num_batches,
            "batch_source": self.batch_source,
            "cache_hit_ratio": round(self.cache_hit_ratio, 3),
        }
