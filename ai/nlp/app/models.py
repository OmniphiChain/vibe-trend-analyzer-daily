"""
Model Loading & Pipeline Management

This module handles the initialization and management of all HuggingFace
Transformer pipelines. Models are loaded once at startup and cached for
efficient reuse across requests.

Models loaded:
- ProsusAI/finbert: Financial sentiment analysis
- yiyanghkust/finbert-tone: Financial tone sentiment
- cardiffnlp/twitter-roberta-base-sentiment-latest: Social media sentiment
- michellejieli/emotion_text_classifier: Emotion classification
- dslim/bert-base-NER: Named entity recognition
"""

import logging
from dataclasses import dataclass
from typing import Optional

import torch
from transformers import pipeline, Pipeline

logger = logging.getLogger(__name__)


@dataclass
class ModelRegistry:
    """
    Container for all loaded NLP pipelines.
    Provides centralized access to model pipelines across the application.
    """
    finbert: Optional[Pipeline] = None
    finbert_tone: Optional[Pipeline] = None
    twitter_sentiment: Optional[Pipeline] = None
    emotion_classifier: Optional[Pipeline] = None
    ner_model: Optional[Pipeline] = None
    device: str = "cpu"

    def is_loaded(self) -> bool:
        """Check if all models are successfully loaded."""
        return all([
            self.finbert is not None,
            self.finbert_tone is not None,
            self.twitter_sentiment is not None,
            self.emotion_classifier is not None,
            self.ner_model is not None,
        ])

    def get_loaded_models(self) -> list[str]:
        """Return list of successfully loaded model names."""
        loaded = []
        if self.finbert:
            loaded.append("ProsusAI/finbert")
        if self.finbert_tone:
            loaded.append("yiyanghkust/finbert-tone")
        if self.twitter_sentiment:
            loaded.append("cardiffnlp/twitter-roberta-base-sentiment-latest")
        if self.emotion_classifier:
            loaded.append("michellejieli/emotion_text_classifier")
        if self.ner_model:
            loaded.append("dslim/bert-base-NER")
        return loaded


def detect_device() -> tuple[int, str]:
    """
    Detect available compute device (GPU or CPU).

    Returns:
        tuple: (device_index, device_name)
            - device_index: 0 for GPU, -1 for CPU (HuggingFace convention)
            - device_name: Human-readable device description
    """
    if torch.cuda.is_available():
        device_name = torch.cuda.get_device_name(0)
        logger.info(f"GPU detected: {device_name}")
        return 0, f"cuda:0 ({device_name})"
    else:
        logger.info("No GPU detected, using CPU")
        return -1, "cpu"


def load_pipeline_safe(
    task: str,
    model_name: str,
    device: int,
    **kwargs
) -> Optional[Pipeline]:
    """
    Safely load a HuggingFace pipeline with error handling.

    Args:
        task: Pipeline task type (e.g., 'sentiment-analysis', 'ner')
        model_name: HuggingFace model identifier
        device: Device index (0 for GPU, -1 for CPU)
        **kwargs: Additional pipeline arguments

    Returns:
        Pipeline if successful, None if loading fails
    """
    try:
        logger.info(f"Loading model: {model_name}")
        pipe = pipeline(task, model=model_name, device=device, **kwargs)
        logger.info(f"Successfully loaded: {model_name}")
        return pipe
    except Exception as e:
        logger.error(f"Failed to load {model_name}: {str(e)}")
        return None


def load_all_models() -> ModelRegistry:
    """
    Load all NLP models at startup.

    This function initializes all required HuggingFace pipelines:
    - Two financial sentiment models (FinBERT variants)
    - One social media sentiment model (Twitter RoBERTa)
    - One emotion classifier
    - One NER model

    Models are loaded with appropriate configurations:
    - Emotion classifier uses return_all_scores=True for full distribution
    - NER uses aggregation_strategy="simple" for entity grouping

    Returns:
        ModelRegistry containing all loaded pipelines
    """
    device_idx, device_name = detect_device()
    registry = ModelRegistry(device=device_name)

    logger.info("=" * 60)
    logger.info("Starting model loading process...")
    logger.info(f"Target device: {device_name}")
    logger.info("=" * 60)

    # Financial sentiment - ProsusAI/finbert
    # Trained on financial news, outputs: positive/negative/neutral
    registry.finbert = load_pipeline_safe(
        task="sentiment-analysis",
        model_name="ProsusAI/finbert",
        device=device_idx,
    )

    # Financial tone sentiment - yiyanghkust/finbert-tone
    # Fine-tuned on financial communications, similar output labels
    registry.finbert_tone = load_pipeline_safe(
        task="sentiment-analysis",
        model_name="yiyanghkust/finbert-tone",
        device=device_idx,
    )

    # Social media sentiment - cardiffnlp/twitter-roberta-base-sentiment-latest
    # Trained on tweets, outputs: positive/negative/neutral
    registry.twitter_sentiment = load_pipeline_safe(
        task="sentiment-analysis",
        model_name="cardiffnlp/twitter-roberta-base-sentiment-latest",
        device=device_idx,
    )

    # Emotion classification - michellejieli/emotion_text_classifier
    # Multi-class emotion detection with full probability distribution
    # top_k=None returns all scores for complete emotion distribution
    registry.emotion_classifier = load_pipeline_safe(
        task="text-classification",
        model_name="michellejieli/emotion_text_classifier",
        device=device_idx,
        top_k=None,  # Return all emotion scores
    )

    # Named Entity Recognition - dslim/bert-base-NER
    # Identifies: PER, ORG, LOC, MISC entities
    # aggregation_strategy="simple" groups sub-word tokens into entities
    registry.ner_model = load_pipeline_safe(
        task="ner",
        model_name="dslim/bert-base-NER",
        device=device_idx,
        aggregation_strategy="simple",
    )

    # Log loading summary
    loaded = registry.get_loaded_models()
    logger.info("=" * 60)
    logger.info(f"Model loading complete: {len(loaded)}/5 models loaded")
    for model in loaded:
        logger.info(f"  ✓ {model}")
    if not registry.is_loaded():
        failed = 5 - len(loaded)
        logger.warning(f"  ✗ {failed} model(s) failed to load")
    logger.info("=" * 60)

    return registry
