"""
Utility Functions

This module provides helper functions for:
- Label normalization across different model outputs
- Ensemble scoring logic for combining multiple model predictions
- Score aggregation and weighted averaging
"""

import logging
from typing import Optional

from app.schemas import SentimentScore, EnsembleScore

logger = logging.getLogger(__name__)


# =============================================================================
# Label Normalization
# =============================================================================

# Mapping of various model output labels to standardized labels
LABEL_MAPPING = {
    # Standard labels (pass through)
    "positive": "positive",
    "neutral": "neutral",
    "negative": "negative",
    # FinBERT variations (sometimes uppercase)
    "Positive": "positive",
    "Neutral": "neutral",
    "Negative": "negative",
    # Twitter RoBERTa labels (LABEL_X format)
    "LABEL_0": "negative",
    "LABEL_1": "neutral",
    "LABEL_2": "positive",
    # Alternative mappings some models use
    "pos": "positive",
    "neg": "negative",
    "neu": "neutral",
}

# Numeric values for sentiment labels (used in ensemble scoring)
SENTIMENT_VALUES = {
    "positive": 1.0,
    "neutral": 0.0,
    "negative": -1.0,
}


def normalize_label(label: str) -> str:
    """
    Normalize sentiment labels to standard format.

    Different HuggingFace models output labels in various formats:
    - FinBERT: "Positive", "Negative", "Neutral"
    - Twitter RoBERTa: "LABEL_0", "LABEL_1", "LABEL_2"
    - Others: "positive", "negative", "neutral"

    This function maps all variations to lowercase standard labels.

    Args:
        label: Raw label from model output

    Returns:
        Normalized label (positive/neutral/negative)
    """
    normalized = LABEL_MAPPING.get(label, label.lower())
    if normalized not in SENTIMENT_VALUES:
        logger.warning(f"Unknown label '{label}' normalized to '{normalized}'")
    return normalized


def normalize_sentiment_result(raw_result: dict) -> SentimentScore:
    """
    Convert raw pipeline output to normalized SentimentScore.

    Args:
        raw_result: Dictionary with 'label' and 'score' keys

    Returns:
        SentimentScore with normalized label
    """
    return SentimentScore(
        label=normalize_label(raw_result["label"]),
        score=raw_result["score"]
    )


# =============================================================================
# Ensemble Scoring Logic
# =============================================================================

def calculate_ensemble_score(
    sentiment_results: list[SentimentScore],
    weights: Optional[list[float]] = None
) -> EnsembleScore:
    """
    Calculate ensemble sentiment score from multiple model predictions.

    Ensemble Strategy:
    1. Convert each label to numeric value:
       - positive → +1
       - neutral → 0
       - negative → −1
    2. Weight each value by its confidence score
    3. Apply optional model weights (default: equal weighting)
    4. Average to get raw score (-1 to +1)
    5. Convert back to label based on score ranges

    Score Interpretation:
    - raw_score > 0.33: positive
    - raw_score < -0.33: negative
    - otherwise: neutral

    Confidence is calculated as the absolute distance from 0,
    normalized and scaled.

    Args:
        sentiment_results: List of SentimentScore from different models
        weights: Optional model weights (must sum to 1.0)

    Returns:
        EnsembleScore with combined prediction
    """
    if not sentiment_results:
        return EnsembleScore(
            label="neutral",
            confidence=0.0,
            raw_score=0.0
        )

    n_models = len(sentiment_results)

    # Default to equal weights if not specified
    if weights is None:
        weights = [1.0 / n_models] * n_models
    elif len(weights) != n_models:
        logger.warning(f"Weight count mismatch, using equal weights")
        weights = [1.0 / n_models] * n_models

    # Calculate weighted score
    # Each model contributes: sentiment_value * confidence * weight
    weighted_sum = 0.0
    total_weight = 0.0

    for result, weight in zip(sentiment_results, weights):
        sentiment_value = SENTIMENT_VALUES.get(result.label, 0.0)
        # Weight by both model weight and confidence
        contribution = sentiment_value * result.score * weight
        weighted_sum += contribution
        total_weight += weight * result.score

    # Normalize by total weight to get raw score
    if total_weight > 0:
        raw_score = weighted_sum / total_weight
    else:
        raw_score = 0.0

    # Determine final label based on score thresholds
    if raw_score > 0.33:
        label = "positive"
    elif raw_score < -0.33:
        label = "negative"
    else:
        label = "neutral"

    # Calculate confidence as strength of sentiment signal
    # Higher absolute value = more confident
    # Map |raw_score| from [0,1] to confidence
    confidence = min(abs(raw_score) + 0.5 * (1 - abs(raw_score)), 1.0)

    # Also factor in average model confidence
    avg_model_confidence = sum(r.score for r in sentiment_results) / n_models
    confidence = (confidence + avg_model_confidence) / 2

    return EnsembleScore(
        label=label,
        confidence=round(confidence, 4),
        raw_score=round(raw_score, 4)
    )


# =============================================================================
# Entity Type Normalization
# =============================================================================

# NER entity type descriptions for clearer output
ENTITY_TYPE_MAPPING = {
    "PER": "PERSON",
    "ORG": "ORGANIZATION",
    "LOC": "LOCATION",
    "MISC": "MISCELLANEOUS",
    # Some models use full names
    "PERSON": "PERSON",
    "ORGANIZATION": "ORGANIZATION",
    "LOCATION": "LOCATION",
    "MISCELLANEOUS": "MISCELLANEOUS",
}


def normalize_entity_type(entity_type: str) -> str:
    """
    Normalize NER entity type to standard format.

    Args:
        entity_type: Raw entity type from model (e.g., "PER", "B-PER")

    Returns:
        Standardized entity type
    """
    # Remove BIO prefix if present (B-, I-, E-, S-)
    clean_type = entity_type
    if len(entity_type) > 2 and entity_type[1] == "-":
        clean_type = entity_type[2:]

    return ENTITY_TYPE_MAPPING.get(clean_type, clean_type)


# =============================================================================
# Text Preprocessing
# =============================================================================

def truncate_text(text: str, max_length: int = 512) -> str:
    """
    Truncate text to maximum token-approximate length.

    Most BERT models have 512 token limit. This provides a rough
    character-based truncation as a safety measure.

    Args:
        text: Input text
        max_length: Maximum character length (default: 512 * 4 = ~512 tokens)

    Returns:
        Truncated text
    """
    # Rough estimate: 1 token ≈ 4 characters for English
    char_limit = max_length * 4

    if len(text) <= char_limit:
        return text

    logger.warning(f"Text truncated from {len(text)} to {char_limit} chars")
    return text[:char_limit]


def clean_text(text: str) -> str:
    """
    Basic text cleaning for model input.

    Args:
        text: Raw input text

    Returns:
        Cleaned text
    """
    # Remove excessive whitespace
    text = " ".join(text.split())
    return text.strip()
