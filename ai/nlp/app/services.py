"""
NLP Inference Services

This module contains the core inference logic for all NLP analysis tasks.
Each service function takes text input and model pipelines, returning
structured response objects.

Services:
- Finance sentiment analysis (ensemble of 2 models)
- Social sentiment analysis
- Emotion classification
- Named entity recognition
- Full combined analysis
"""

import logging
from typing import Optional

from transformers import Pipeline

from app.models import ModelRegistry
from app.schemas import (
    FinanceSentimentResponse,
    SocialSentimentResponse,
    EmotionResponse,
    EmotionScore,
    NERResponse,
    NEREntity,
    FullAnalysisResponse,
    ModelSentimentResult,
    SentimentScore,
    BatchFinanceSentimentResponse,
    BatchSocialSentimentResponse,
    BatchEmotionResponse,
    BatchNERResponse,
    BatchFullAnalysisResponse,
)
from app.utils import (
    normalize_sentiment_result,
    calculate_ensemble_score,
    normalize_entity_type,
    clean_text,
    truncate_text,
)

logger = logging.getLogger(__name__)


# =============================================================================
# Finance Sentiment Service
# =============================================================================

def analyze_finance_sentiment(
    text: str,
    finbert: Pipeline,
    finbert_tone: Pipeline,
) -> FinanceSentimentResponse:
    """
    Analyze financial sentiment using ensemble of FinBERT models.

    This function runs text through two specialized financial sentiment models:
    1. ProsusAI/finbert - Trained on financial news
    2. yiyanghkust/finbert-tone - Fine-tuned on financial communications

    Results are combined using weighted ensemble scoring.

    Args:
        text: Financial text to analyze
        finbert: ProsusAI/finbert pipeline
        finbert_tone: yiyanghkust/finbert-tone pipeline

    Returns:
        FinanceSentimentResponse with individual and ensemble results
    """
    # Preprocess text
    cleaned_text = clean_text(text)
    truncated_text = truncate_text(cleaned_text)

    # Run both models
    model_results = []

    # ProsusAI/finbert
    try:
        finbert_raw = finbert(truncated_text)[0]
        finbert_score = normalize_sentiment_result(finbert_raw)
        model_results.append(ModelSentimentResult(
            model="ProsusAI/finbert",
            sentiment=finbert_score
        ))
    except Exception as e:
        logger.error(f"FinBERT inference failed: {e}")

    # yiyanghkust/finbert-tone
    try:
        tone_raw = finbert_tone(truncated_text)[0]
        tone_score = normalize_sentiment_result(tone_raw)
        model_results.append(ModelSentimentResult(
            model="yiyanghkust/finbert-tone",
            sentiment=tone_score
        ))
    except Exception as e:
        logger.error(f"FinBERT-tone inference failed: {e}")

    # Calculate ensemble score
    sentiment_scores = [m.sentiment for m in model_results]
    ensemble = calculate_ensemble_score(sentiment_scores)

    return FinanceSentimentResponse(
        text=text,
        models=model_results,
        ensemble=ensemble
    )


# =============================================================================
# Social Sentiment Service
# =============================================================================

def analyze_social_sentiment(
    text: str,
    twitter_model: Pipeline,
) -> SocialSentimentResponse:
    """
    Analyze social media sentiment using Twitter RoBERTa model.

    Uses cardiffnlp/twitter-roberta-base-sentiment-latest which is
    specifically trained on Twitter data for social media text analysis.

    Args:
        text: Social media text to analyze
        twitter_model: Twitter RoBERTa sentiment pipeline

    Returns:
        SocialSentimentResponse with sentiment label and confidence
    """
    # Preprocess text
    cleaned_text = clean_text(text)
    truncated_text = truncate_text(cleaned_text)

    # Run inference
    try:
        result = twitter_model(truncated_text)[0]
        normalized = normalize_sentiment_result(result)

        return SocialSentimentResponse(
            text=text,
            label=normalized.label,
            confidence=round(normalized.score, 4)
        )
    except Exception as e:
        logger.error(f"Social sentiment inference failed: {e}")
        raise RuntimeError(f"Social sentiment analysis failed: {str(e)}")


# =============================================================================
# Emotion Classification Service
# =============================================================================

def analyze_emotion(
    text: str,
    emotion_model: Pipeline,
) -> EmotionResponse:
    """
    Classify emotions in text using emotion classifier.

    Uses michellejieli/emotion_text_classifier which detects emotions like:
    joy, sadness, anger, fear, surprise, disgust, etc.

    Returns full probability distribution across all emotion categories.

    Args:
        text: Text to analyze for emotions
        emotion_model: Emotion classification pipeline (with top_k=None)

    Returns:
        EmotionResponse with full emotion distribution
    """
    # Preprocess text
    cleaned_text = clean_text(text)
    truncated_text = truncate_text(cleaned_text)

    # Run inference - returns list of all emotions with scores
    try:
        results = emotion_model(truncated_text)

        # Handle nested list structure from pipeline
        if results and isinstance(results[0], list):
            results = results[0]

        # Convert to EmotionScore objects
        emotions = [
            EmotionScore(
                emotion=r["label"],
                score=round(r["score"], 4)
            )
            for r in results
        ]

        # Sort by score descending
        emotions.sort(key=lambda x: x.score, reverse=True)

        # Get primary emotion
        primary = emotions[0] if emotions else EmotionScore(emotion="neutral", score=0.0)

        return EmotionResponse(
            text=text,
            emotions=emotions,
            primary_emotion=primary.emotion,
            primary_score=primary.score
        )
    except Exception as e:
        logger.error(f"Emotion classification failed: {e}")
        raise RuntimeError(f"Emotion analysis failed: {str(e)}")


# =============================================================================
# Named Entity Recognition Service
# =============================================================================

def analyze_entities(
    text: str,
    ner_model: Pipeline,
) -> NERResponse:
    """
    Extract named entities from text using BERT-NER model.

    Uses dslim/bert-base-NER which identifies:
    - PER (Person)
    - ORG (Organization)
    - LOC (Location)
    - MISC (Miscellaneous)

    Entity aggregation combines sub-word tokens into complete entities.

    Args:
        text: Text to analyze for entities
        ner_model: NER pipeline (with aggregation_strategy="simple")

    Returns:
        NERResponse with list of detected entities
    """
    # Preprocess text - keep original for offset accuracy
    cleaned_text = clean_text(text)
    truncated_text = truncate_text(cleaned_text)

    try:
        results = ner_model(truncated_text)

        # Convert to NEREntity objects
        entities = []
        for r in results:
            entity = NEREntity(
                entity=r["word"],
                entity_type=normalize_entity_type(r["entity_group"]),
                confidence=round(r["score"], 4),
                start=r["start"],
                end=r["end"]
            )
            entities.append(entity)

        return NERResponse(
            text=text,
            entities=entities,
            entity_count=len(entities)
        )
    except Exception as e:
        logger.error(f"NER analysis failed: {e}")
        raise RuntimeError(f"Entity extraction failed: {str(e)}")


# =============================================================================
# Full Analysis Service
# =============================================================================

def analyze_full(
    text: str,
    registry: ModelRegistry,
) -> FullAnalysisResponse:
    """
    Run comprehensive analysis using all available models.

    Performs:
    1. Financial sentiment analysis (if models loaded)
    2. Social sentiment analysis (if model loaded)
    3. Emotion classification (if model loaded)
    4. Named entity recognition (if model loaded)

    Each analysis is performed independently; failures in one
    don't affect others.

    Args:
        text: Text to analyze
        registry: ModelRegistry containing all loaded pipelines

    Returns:
        FullAnalysisResponse with all available analysis results
    """
    response = FullAnalysisResponse(text=text)

    # Financial sentiment (requires both models)
    if registry.finbert and registry.finbert_tone:
        try:
            response.finance_sentiment = analyze_finance_sentiment(
                text=text,
                finbert=registry.finbert,
                finbert_tone=registry.finbert_tone,
            )
        except Exception as e:
            logger.error(f"Finance sentiment in full analysis failed: {e}")

    # Social sentiment
    if registry.twitter_sentiment:
        try:
            response.social_sentiment = analyze_social_sentiment(
                text=text,
                twitter_model=registry.twitter_sentiment,
            )
        except Exception as e:
            logger.error(f"Social sentiment in full analysis failed: {e}")

    # Emotion classification
    if registry.emotion_classifier:
        try:
            response.emotion = analyze_emotion(
                text=text,
                emotion_model=registry.emotion_classifier,
            )
        except Exception as e:
            logger.error(f"Emotion analysis in full analysis failed: {e}")

    # Named entity recognition
    if registry.ner_model:
        try:
            response.ner = analyze_entities(
                text=text,
                ner_model=registry.ner_model,
            )
        except Exception as e:
            logger.error(f"NER in full analysis failed: {e}")

    return response


# =============================================================================
# Batch Processing Services
# =============================================================================

def batch_finance_sentiment(
    texts: list[str],
    finbert: Pipeline,
    finbert_tone: Pipeline,
) -> BatchFinanceSentimentResponse:
    """
    Analyze financial sentiment for multiple texts in a single batch.

    Processes texts through both FinBERT models efficiently by batching
    the pipeline calls.

    Args:
        texts: List of financial texts to analyze
        finbert: ProsusAI/finbert pipeline
        finbert_tone: yiyanghkust/finbert-tone pipeline

    Returns:
        BatchFinanceSentimentResponse with results for all texts
    """
    # Preprocess all texts
    cleaned_texts = [truncate_text(clean_text(t)) for t in texts]

    # Batch inference for both models
    try:
        finbert_results = finbert(cleaned_texts)
    except Exception as e:
        logger.error(f"Batch FinBERT inference failed: {e}")
        finbert_results = [None] * len(texts)

    try:
        tone_results = finbert_tone(cleaned_texts)
    except Exception as e:
        logger.error(f"Batch FinBERT-tone inference failed: {e}")
        tone_results = [None] * len(texts)

    # Build responses for each text
    results = []
    for i, text in enumerate(texts):
        model_results = []

        # FinBERT result
        if finbert_results[i] is not None:
            try:
                finbert_score = normalize_sentiment_result(finbert_results[i])
                model_results.append(ModelSentimentResult(
                    model="ProsusAI/finbert",
                    sentiment=finbert_score
                ))
            except Exception as e:
                logger.error(f"FinBERT result processing failed for text {i}: {e}")

        # FinBERT-tone result
        if tone_results[i] is not None:
            try:
                tone_score = normalize_sentiment_result(tone_results[i])
                model_results.append(ModelSentimentResult(
                    model="yiyanghkust/finbert-tone",
                    sentiment=tone_score
                ))
            except Exception as e:
                logger.error(f"FinBERT-tone result processing failed for text {i}: {e}")

        # Calculate ensemble
        sentiment_scores = [m.sentiment for m in model_results]
        ensemble = calculate_ensemble_score(sentiment_scores)

        results.append(FinanceSentimentResponse(
            text=text,
            models=model_results,
            ensemble=ensemble
        ))

    return BatchFinanceSentimentResponse(
        results=results,
        count=len(results)
    )


def batch_social_sentiment(
    texts: list[str],
    twitter_model: Pipeline,
) -> BatchSocialSentimentResponse:
    """
    Analyze social media sentiment for multiple texts in a single batch.

    Args:
        texts: List of social media texts to analyze
        twitter_model: Twitter RoBERTa sentiment pipeline

    Returns:
        BatchSocialSentimentResponse with results for all texts
    """
    # Preprocess all texts
    cleaned_texts = [truncate_text(clean_text(t)) for t in texts]

    # Batch inference
    try:
        raw_results = twitter_model(cleaned_texts)
    except Exception as e:
        logger.error(f"Batch social sentiment inference failed: {e}")
        raise RuntimeError(f"Batch social sentiment analysis failed: {str(e)}")

    # Build responses
    results = []
    for i, text in enumerate(texts):
        normalized = normalize_sentiment_result(raw_results[i])
        results.append(SocialSentimentResponse(
            text=text,
            label=normalized.label,
            confidence=round(normalized.score, 4)
        ))

    return BatchSocialSentimentResponse(
        results=results,
        count=len(results)
    )


def batch_emotion(
    texts: list[str],
    emotion_model: Pipeline,
) -> BatchEmotionResponse:
    """
    Classify emotions for multiple texts in a single batch.

    Args:
        texts: List of texts to analyze for emotions
        emotion_model: Emotion classification pipeline

    Returns:
        BatchEmotionResponse with results for all texts
    """
    # Preprocess all texts
    cleaned_texts = [truncate_text(clean_text(t)) for t in texts]

    # Batch inference
    try:
        raw_results = emotion_model(cleaned_texts)
    except Exception as e:
        logger.error(f"Batch emotion inference failed: {e}")
        raise RuntimeError(f"Batch emotion analysis failed: {str(e)}")

    # Build responses
    results = []
    for i, text in enumerate(texts):
        item_results = raw_results[i]

        # Handle nested list structure
        if item_results and isinstance(item_results[0], dict):
            pass  # Already flat list of dicts
        elif item_results and isinstance(item_results[0], list):
            item_results = item_results[0]

        # Convert to EmotionScore objects
        emotions = [
            EmotionScore(
                emotion=r["label"],
                score=round(r["score"], 4)
            )
            for r in item_results
        ]

        # Sort by score descending
        emotions.sort(key=lambda x: x.score, reverse=True)

        # Get primary emotion
        primary = emotions[0] if emotions else EmotionScore(emotion="neutral", score=0.0)

        results.append(EmotionResponse(
            text=text,
            emotions=emotions,
            primary_emotion=primary.emotion,
            primary_score=primary.score
        ))

    return BatchEmotionResponse(
        results=results,
        count=len(results)
    )


def batch_entities(
    texts: list[str],
    ner_model: Pipeline,
) -> BatchNERResponse:
    """
    Extract named entities from multiple texts in a single batch.

    Args:
        texts: List of texts to analyze for entities
        ner_model: NER pipeline

    Returns:
        BatchNERResponse with results for all texts
    """
    # Preprocess all texts
    cleaned_texts = [truncate_text(clean_text(t)) for t in texts]

    # Batch inference
    try:
        raw_results = ner_model(cleaned_texts)
    except Exception as e:
        logger.error(f"Batch NER inference failed: {e}")
        raise RuntimeError(f"Batch entity extraction failed: {str(e)}")

    # Build responses
    results = []
    for i, text in enumerate(texts):
        item_results = raw_results[i]

        # Convert to NEREntity objects
        entities = []
        for r in item_results:
            entity = NEREntity(
                entity=r["word"],
                entity_type=normalize_entity_type(r["entity_group"]),
                confidence=round(r["score"], 4),
                start=r["start"],
                end=r["end"]
            )
            entities.append(entity)

        results.append(NERResponse(
            text=text,
            entities=entities,
            entity_count=len(entities)
        ))

    return BatchNERResponse(
        results=results,
        count=len(results)
    )


def batch_full_analysis(
    texts: list[str],
    registry: ModelRegistry,
) -> BatchFullAnalysisResponse:
    """
    Run comprehensive analysis on multiple texts using all available models.

    Efficiently batches all model calls for better throughput.

    Args:
        texts: List of texts to analyze
        registry: ModelRegistry containing all loaded pipelines

    Returns:
        BatchFullAnalysisResponse with all analysis results for each text
    """
    n_texts = len(texts)

    # Preprocess all texts once
    cleaned_texts = [truncate_text(clean_text(t)) for t in texts]

    # Initialize result containers
    finance_results = [None] * n_texts
    social_results = [None] * n_texts
    emotion_results = [None] * n_texts
    ner_results = [None] * n_texts

    # Batch financial sentiment (requires both models)
    if registry.finbert and registry.finbert_tone:
        try:
            finbert_raw = registry.finbert(cleaned_texts)
            tone_raw = registry.finbert_tone(cleaned_texts)

            for i, text in enumerate(texts):
                model_results = []

                try:
                    finbert_score = normalize_sentiment_result(finbert_raw[i])
                    model_results.append(ModelSentimentResult(
                        model="ProsusAI/finbert",
                        sentiment=finbert_score
                    ))
                except Exception:
                    pass

                try:
                    tone_score = normalize_sentiment_result(tone_raw[i])
                    model_results.append(ModelSentimentResult(
                        model="yiyanghkust/finbert-tone",
                        sentiment=tone_score
                    ))
                except Exception:
                    pass

                sentiment_scores = [m.sentiment for m in model_results]
                ensemble = calculate_ensemble_score(sentiment_scores)

                finance_results[i] = FinanceSentimentResponse(
                    text=text,
                    models=model_results,
                    ensemble=ensemble
                )
        except Exception as e:
            logger.error(f"Batch finance sentiment failed: {e}")

    # Batch social sentiment
    if registry.twitter_sentiment:
        try:
            twitter_raw = registry.twitter_sentiment(cleaned_texts)
            for i, text in enumerate(texts):
                normalized = normalize_sentiment_result(twitter_raw[i])
                social_results[i] = SocialSentimentResponse(
                    text=text,
                    label=normalized.label,
                    confidence=round(normalized.score, 4)
                )
        except Exception as e:
            logger.error(f"Batch social sentiment failed: {e}")

    # Batch emotion classification
    if registry.emotion_classifier:
        try:
            emotion_raw = registry.emotion_classifier(cleaned_texts)
            for i, text in enumerate(texts):
                item_results = emotion_raw[i]
                if item_results and isinstance(item_results[0], list):
                    item_results = item_results[0]

                emotions = [
                    EmotionScore(emotion=r["label"], score=round(r["score"], 4))
                    for r in item_results
                ]
                emotions.sort(key=lambda x: x.score, reverse=True)
                primary = emotions[0] if emotions else EmotionScore(emotion="neutral", score=0.0)

                emotion_results[i] = EmotionResponse(
                    text=text,
                    emotions=emotions,
                    primary_emotion=primary.emotion,
                    primary_score=primary.score
                )
        except Exception as e:
            logger.error(f"Batch emotion classification failed: {e}")

    # Batch NER
    if registry.ner_model:
        try:
            ner_raw = registry.ner_model(cleaned_texts)
            for i, text in enumerate(texts):
                entities = [
                    NEREntity(
                        entity=r["word"],
                        entity_type=normalize_entity_type(r["entity_group"]),
                        confidence=round(r["score"], 4),
                        start=r["start"],
                        end=r["end"]
                    )
                    for r in ner_raw[i]
                ]
                ner_results[i] = NERResponse(
                    text=text,
                    entities=entities,
                    entity_count=len(entities)
                )
        except Exception as e:
            logger.error(f"Batch NER failed: {e}")

    # Combine all results
    results = []
    for i, text in enumerate(texts):
        results.append(FullAnalysisResponse(
            text=text,
            finance_sentiment=finance_results[i],
            social_sentiment=social_results[i],
            emotion=emotion_results[i],
            ner=ner_results[i]
        ))

    return BatchFullAnalysisResponse(
        results=results,
        count=len(results)
    )
