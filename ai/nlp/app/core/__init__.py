# ============================================================================
# CORE INFERENCE OPTIMIZATION
# Batching, caching, and adaptive sizing for CPU-safe inference
# ============================================================================

from .cache import (
    InferenceCache,
    get_cache,
    normalize_text,
    hash_text,
)
from .batching import (
    chunk_texts,
    BatchConfig,
)
from .adaptive import (
    AdaptiveBatchSizer,
    get_batch_sizer,
    SystemMetrics,
)

__all__ = [
    # Cache
    "InferenceCache",
    "get_cache",
    "normalize_text",
    "hash_text",
    # Batching
    "chunk_texts",
    "BatchConfig",
    # Adaptive
    "AdaptiveBatchSizer",
    "get_batch_sizer",
    "SystemMetrics",
]
