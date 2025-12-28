"""
NeomSense AI Intelligence Layer

This module provides the core intelligence engine that transforms raw ML model
predictions into actionable market intelligence. It does NOT train models -
it interprets, fuses, validates, and contextualizes their outputs.

Architecture:
    [NLP Models] → raw predictions
         ↓
    [AI Layer] → intelligence (THIS MODULE)
         ↓
    [FastAPI] → REST/WebSocket
         ↓
    [Dashboards] → visualization

Modules:
    - fusion: Multi-model sentiment fusion
    - confidence: Confidence/reliability scoring
    - trends: Time-series trend detection
    - emotions: Emotion-to-psychology mapping
    - anomalies: Anomaly and manipulation detection
    - layer: Main orchestrator (AI Brain)
"""

from .layer import run_ai_layer, AILayer
from .schemas import (
    FusedSentiment,
    ConfidenceScore,
    TrendResult,
    EmotionSignal,
    AnomalyResult,
    FullAIAnalysis,
    ModelOutputs,
)

__all__ = [
    # Main orchestrator
    "run_ai_layer",
    "AILayer",
    # Data contracts
    "FusedSentiment",
    "ConfidenceScore",
    "TrendResult",
    "EmotionSignal",
    "AnomalyResult",
    "FullAIAnalysis",
    "ModelOutputs",
]

__version__ = "1.0.0"
