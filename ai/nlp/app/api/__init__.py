# ============================================================================
# API EXTENSIONS
# Additional endpoints for optimized inference
# ============================================================================

from .batch_analyze import router as batch_analyze_router

__all__ = [
    "batch_analyze_router",
]
