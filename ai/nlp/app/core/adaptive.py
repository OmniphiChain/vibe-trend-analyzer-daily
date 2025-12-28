# ============================================================================
# ADAPTIVE BATCH SIZING
# System-controlled batch size based on CPU load
# ============================================================================
#
# Rules:
# - Batch size computed ONCE per request
# - No feedback loops
# - No ML-based tuning
# - Predictable, deterministic behavior
# - Fail gracefully if metrics unavailable
# ============================================================================

import logging
import os
from typing import Optional
from dataclasses import dataclass

from .batching import (
    MIN_BATCH_SIZE,
    DEFAULT_BATCH_SIZE,
    MAX_BATCH_SIZE,
    BatchConfig,
)

logger = logging.getLogger(__name__)


# CPU load thresholds
HIGH_CPU_THRESHOLD = 75.0  # Reduce batch size
MEDIUM_CPU_THRESHOLD = 50.0  # Use default batch size


@dataclass
class SystemMetrics:
    """Current system metrics for adaptive sizing."""
    cpu_load_1min: float  # 0-100
    pending_texts: int
    cache_hit_ratio: float  # 0-1

    @classmethod
    def collect(cls, pending_texts: int = 0, cache_hit_ratio: float = 0.0) -> "SystemMetrics":
        """
        Collect current system metrics.

        CPU load collection is platform-dependent and may fail gracefully.
        """
        cpu_load = cls._get_cpu_load()

        return cls(
            cpu_load_1min=cpu_load,
            pending_texts=pending_texts,
            cache_hit_ratio=cache_hit_ratio,
        )

    @staticmethod
    def _get_cpu_load() -> float:
        """
        Get 1-minute CPU load average.

        Returns:
            CPU load as percentage (0-100)
            Returns 50.0 (safe default) if unavailable
        """
        try:
            # Try psutil first (most reliable)
            try:
                import psutil
                # Get CPU percent over short interval
                cpu_percent = psutil.cpu_percent(interval=0.1)
                return cpu_percent
            except ImportError:
                pass

            # Fallback: os.getloadavg() (Unix only)
            try:
                load_1min, _, _ = os.getloadavg()
                # Normalize to percentage (assume load avg / num CPUs * 100)
                num_cpus = os.cpu_count() or 1
                return min(100.0, (load_1min / num_cpus) * 100)
            except (OSError, AttributeError):
                pass

            # Windows fallback - return safe default
            return 50.0

        except Exception as e:
            logger.warning(f"Failed to get CPU load: {e}, using default")
            return 50.0


class AdaptiveBatchSizer:
    """
    Determines optimal batch size based on system conditions.

    Logic (simple heuristics):
    - High CPU (>75%): Use minimum batch size
    - Medium CPU (>50%): Use default batch size
    - Low CPU (<50%): Use larger batch size (up to 2x default)

    Additional adjustments:
    - High cache hit ratio -> can use larger batches (less inference work)
    - Many pending texts -> prefer smaller batches (reduce latency)
    """

    def __init__(self):
        self._last_metrics: Optional[SystemMetrics] = None
        self._last_batch_size: int = DEFAULT_BATCH_SIZE

    def compute_batch_size(
        self,
        pending_texts: int = 0,
        cache_hit_ratio: float = 0.0,
    ) -> BatchConfig:
        """
        Compute optimal batch size for current conditions.

        This is called ONCE per request. The returned batch size
        is used for all batches in that request.

        Args:
            pending_texts: Number of texts to process
            cache_hit_ratio: Recent cache hit ratio (0-1)

        Returns:
            BatchConfig with computed size and source info
        """
        # Collect current metrics
        metrics = SystemMetrics.collect(
            pending_texts=pending_texts,
            cache_hit_ratio=cache_hit_ratio,
        )
        self._last_metrics = metrics

        # Base batch size from CPU load
        if metrics.cpu_load_1min > HIGH_CPU_THRESHOLD:
            # High CPU: minimize batch size to reduce memory pressure
            base_size = MIN_BATCH_SIZE
            reason = "high_cpu"

        elif metrics.cpu_load_1min > MEDIUM_CPU_THRESHOLD:
            # Medium CPU: use default
            base_size = DEFAULT_BATCH_SIZE
            reason = "medium_cpu"

        else:
            # Low CPU: can handle larger batches
            base_size = min(DEFAULT_BATCH_SIZE * 2, MAX_BATCH_SIZE)
            reason = "low_cpu"

        # Adjust based on cache hit ratio
        # High cache hits = less inference work = can use larger batches
        if cache_hit_ratio > 0.7:
            # Most texts are cached, batch size matters less
            # But don't increase beyond MAX
            adjusted_size = min(base_size + 4, MAX_BATCH_SIZE)
        elif cache_hit_ratio < 0.2:
            # Low cache hits = lots of inference
            # Be more conservative
            adjusted_size = max(base_size - 2, MIN_BATCH_SIZE)
        else:
            adjusted_size = base_size

        # Final clamp (defensive)
        final_size = max(MIN_BATCH_SIZE, min(adjusted_size, MAX_BATCH_SIZE))
        self._last_batch_size = final_size

        logger.info(
            f"Adaptive batch size: {final_size} "
            f"(cpu={metrics.cpu_load_1min:.1f}%, cache_ratio={cache_hit_ratio:.2f}, reason={reason})"
        )

        return BatchConfig.from_adaptive(final_size)

    def get_last_metrics(self) -> Optional[SystemMetrics]:
        """Get metrics from last computation."""
        return self._last_metrics

    def get_last_batch_size(self) -> int:
        """Get last computed batch size."""
        return self._last_batch_size


# Singleton instance
_batch_sizer: Optional[AdaptiveBatchSizer] = None


def get_batch_sizer() -> AdaptiveBatchSizer:
    """Get or create singleton batch sizer instance."""
    global _batch_sizer
    if _batch_sizer is None:
        _batch_sizer = AdaptiveBatchSizer()
    return _batch_sizer
