"""
Pydantic Request/Response Models

This module defines strongly-typed schemas for all API endpoints.
All responses are JSON-serializable and include detailed field descriptions.
"""

from typing import Optional
from pydantic import BaseModel, Field


# =============================================================================
# Request Schemas
# =============================================================================

class TextRequest(BaseModel):
    """Request body containing text to analyze."""
    text: str = Field(
        ...,
        min_length=1,
        max_length=10000,
        description="Text content to analyze",
        examples=["Apple reported strong Q4 earnings, beating analyst expectations."]
    )


# =============================================================================
# Sentiment Schemas
# =============================================================================

class SentimentScore(BaseModel):
    """Individual sentiment prediction from a single model."""
    label: str = Field(
        ...,
        description="Sentiment label (positive, neutral, negative)"
    )
    score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Confidence score for the predicted label"
    )


class ModelSentimentResult(BaseModel):
    """Sentiment result from a specific model."""
    model: str = Field(
        ...,
        description="Name of the model that produced this result"
    )
    sentiment: SentimentScore = Field(
        ...,
        description="Predicted sentiment with confidence"
    )


class EnsembleScore(BaseModel):
    """Aggregated sentiment score from multiple models."""
    label: str = Field(
        ...,
        description="Final ensemble sentiment label"
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Aggregated confidence score"
    )
    raw_score: float = Field(
        ...,
        ge=-1.0,
        le=1.0,
        description="Raw numeric score (-1 to +1 scale)"
    )


class FinanceSentimentResponse(BaseModel):
    """Response for financial sentiment analysis endpoint."""
    text: str = Field(
        ...,
        description="Original input text"
    )
    models: list[ModelSentimentResult] = Field(
        ...,
        description="Individual model predictions"
    )
    ensemble: EnsembleScore = Field(
        ...,
        description="Combined ensemble prediction"
    )


class SocialSentimentResponse(BaseModel):
    """Response for social media sentiment analysis endpoint."""
    text: str = Field(
        ...,
        description="Original input text"
    )
    label: str = Field(
        ...,
        description="Predicted sentiment label"
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Confidence score for prediction"
    )


# =============================================================================
# Emotion Schemas
# =============================================================================

class EmotionScore(BaseModel):
    """Score for a single emotion category."""
    emotion: str = Field(
        ...,
        description="Emotion label (e.g., joy, anger, sadness)"
    )
    score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Probability score for this emotion"
    )


class EmotionResponse(BaseModel):
    """Response for emotion classification endpoint."""
    text: str = Field(
        ...,
        description="Original input text"
    )
    emotions: list[EmotionScore] = Field(
        ...,
        description="Full probability distribution across all emotions"
    )
    primary_emotion: str = Field(
        ...,
        description="Highest-scoring emotion"
    )
    primary_score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Score of the primary emotion"
    )


# =============================================================================
# NER Schemas
# =============================================================================

class NEREntity(BaseModel):
    """A single named entity extracted from text."""
    entity: str = Field(
        ...,
        description="Entity text as found in input"
    )
    entity_type: str = Field(
        ...,
        description="Entity type (PER, ORG, LOC, MISC)"
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Confidence score for entity detection"
    )
    start: int = Field(
        ...,
        ge=0,
        description="Start character offset in original text"
    )
    end: int = Field(
        ...,
        ge=0,
        description="End character offset in original text"
    )


class NERResponse(BaseModel):
    """Response for named entity recognition endpoint."""
    text: str = Field(
        ...,
        description="Original input text"
    )
    entities: list[NEREntity] = Field(
        ...,
        description="List of detected named entities"
    )
    entity_count: int = Field(
        ...,
        ge=0,
        description="Total number of entities found"
    )


# =============================================================================
# Full Analysis Schema
# =============================================================================

class FullAnalysisResponse(BaseModel):
    """Response for combined analysis endpoint running all models."""
    text: str = Field(
        ...,
        description="Original input text"
    )
    finance_sentiment: Optional[FinanceSentimentResponse] = Field(
        None,
        description="Financial sentiment analysis results"
    )
    social_sentiment: Optional[SocialSentimentResponse] = Field(
        None,
        description="Social media sentiment analysis results"
    )
    emotion: Optional[EmotionResponse] = Field(
        None,
        description="Emotion classification results"
    )
    ner: Optional[NERResponse] = Field(
        None,
        description="Named entity recognition results"
    )


# =============================================================================
# Health Check Schemas
# =============================================================================

class ModelStatus(BaseModel):
    """Status of a single model."""
    name: str = Field(..., description="Model identifier")
    loaded: bool = Field(..., description="Whether model is loaded")


class HealthResponse(BaseModel):
    """Health check response with model status."""
    status: str = Field(
        ...,
        description="Overall service status (healthy/degraded/unhealthy)"
    )
    device: str = Field(
        ...,
        description="Compute device in use (cpu/cuda)"
    )
    models: list[ModelStatus] = Field(
        ...,
        description="Status of each model"
    )
    models_loaded: int = Field(
        ...,
        ge=0,
        description="Number of successfully loaded models"
    )
    total_models: int = Field(
        ...,
        description="Total number of expected models"
    )


# =============================================================================
# Batch Request/Response Schemas
# =============================================================================

class BatchTextRequest(BaseModel):
    """Request body containing multiple texts to analyze."""
    texts: list[str] = Field(
        ...,
        min_length=1,
        max_length=100,
        description="List of texts to analyze (max 100 per request)",
        examples=[["Apple beat earnings expectations.", "The market crashed today.", "Tesla stock is volatile."]]
    )


class BatchFinanceSentimentResponse(BaseModel):
    """Batch response for financial sentiment analysis."""
    results: list[FinanceSentimentResponse] = Field(
        ...,
        description="Financial sentiment results for each input text"
    )
    count: int = Field(
        ...,
        ge=0,
        description="Number of texts processed"
    )


class BatchSocialSentimentResponse(BaseModel):
    """Batch response for social media sentiment analysis."""
    results: list[SocialSentimentResponse] = Field(
        ...,
        description="Social sentiment results for each input text"
    )
    count: int = Field(
        ...,
        ge=0,
        description="Number of texts processed"
    )


class BatchEmotionResponse(BaseModel):
    """Batch response for emotion classification."""
    results: list[EmotionResponse] = Field(
        ...,
        description="Emotion classification results for each input text"
    )
    count: int = Field(
        ...,
        ge=0,
        description="Number of texts processed"
    )


class BatchNERResponse(BaseModel):
    """Batch response for named entity recognition."""
    results: list[NERResponse] = Field(
        ...,
        description="NER results for each input text"
    )
    count: int = Field(
        ...,
        ge=0,
        description="Number of texts processed"
    )


class BatchFullAnalysisResponse(BaseModel):
    """Batch response for full analysis running all models."""
    results: list[FullAnalysisResponse] = Field(
        ...,
        description="Full analysis results for each input text"
    )
    count: int = Field(
        ...,
        ge=0,
        description="Number of texts processed"
    )


# =============================================================================
# Streaming Event Schemas (for SSE)
# =============================================================================

class StreamEvent(BaseModel):
    """Base streaming event for SSE."""
    event: str = Field(
        ...,
        description="Event type (start, progress, model_complete, complete, error)"
    )
    data: dict = Field(
        default_factory=dict,
        description="Event payload data"
    )


class StreamStartEvent(BaseModel):
    """Event sent when analysis starts."""
    event: str = "start"
    text: str = Field(..., description="Text being analyzed")
    models: list[str] = Field(..., description="Models that will be run")
    total_steps: int = Field(..., description="Total number of model steps")


class StreamProgressEvent(BaseModel):
    """Event sent when a model starts processing."""
    event: str = "progress"
    model: str = Field(..., description="Model currently processing")
    step: int = Field(..., description="Current step number")
    total_steps: int = Field(..., description="Total steps")
    status: str = Field(..., description="Status message")


class StreamModelCompleteEvent(BaseModel):
    """Event sent when a model completes."""
    event: str = "model_complete"
    model: str = Field(..., description="Model that completed")
    result_type: str = Field(..., description="Type of result (finance, social, emotion, ner)")
    result: dict = Field(..., description="Model result data")
    step: int = Field(..., description="Completed step number")
    total_steps: int = Field(..., description="Total steps")


class StreamCompleteEvent(BaseModel):
    """Event sent when all analysis is complete."""
    event: str = "complete"
    full_result: FullAnalysisResponse = Field(..., description="Complete analysis result")


class StreamErrorEvent(BaseModel):
    """Event sent when an error occurs."""
    event: str = "error"
    model: str = Field(default="", description="Model that failed (if applicable)")
    error: str = Field(..., description="Error message")


# Streaming request with optional model selection
class StreamAnalysisRequest(BaseModel):
    """Request for streaming analysis with optional model selection."""
    text: str = Field(
        ...,
        min_length=1,
        max_length=10000,
        description="Text content to analyze"
    )
    models: Optional[list[str]] = Field(
        default=None,
        description="Specific models to run (default: all). Options: finance, social, emotion, ner"
    )


class StreamBatchRequest(BaseModel):
    """Request for streaming batch analysis."""
    texts: list[str] = Field(
        ...,
        min_length=1,
        max_length=50,
        description="List of texts to analyze (max 50 for streaming)"
    )
    models: Optional[list[str]] = Field(
        default=None,
        description="Specific models to run (default: all). Options: finance, social, emotion, ner"
    )
