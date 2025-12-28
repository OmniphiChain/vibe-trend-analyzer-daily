"""
NeomSense Emotion Intelligence Engine

Translates detected human emotions into market psychology interpretations.
This bridges the gap between NLP emotion detection and financial behavior.

Mapping Logic:
- Fear emotions → panic/capitulation (selling behavior)
- Anger emotions → reactionary/volatile (unpredictable behavior)
- Joy emotions → speculative (risk-on behavior)
- Neutral → stable markets

This is behavioral finance interpretation, NOT sentiment scoring.
"""

from typing import Optional
from .constants import EMOTION_PSYCHOLOGY_MAP
from .schemas import EmotionSignal, MarketPsychology


# Extended emotion categories for more granular mapping
EMOTION_CATEGORIES: dict[str, list[str]] = {
    "fear_family": ["fear", "anxiety", "worry", "terror", "panic", "dread"],
    "anger_family": ["anger", "rage", "fury", "annoyance", "irritation"],
    "sadness_family": ["sadness", "grief", "sorrow", "despair", "disappointment"],
    "joy_family": ["joy", "happiness", "excitement", "elation", "optimism"],
    "surprise_family": ["surprise", "shock", "amazement", "astonishment"],
    "disgust_family": ["disgust", "contempt", "loathing", "revulsion"],
    "trust_family": ["trust", "confidence", "admiration"],
    "anticipation_family": ["anticipation", "interest", "vigilance"],
}


def normalize_emotion(emotion: str) -> str:
    """
    Normalize emotion string to standard format.

    Args:
        emotion: Raw emotion string from model

    Returns:
        Normalized lowercase emotion
    """
    return emotion.lower().strip()


def get_emotion_category(emotion: str) -> str:
    """
    Map a specific emotion to its category family.

    Args:
        emotion: Specific emotion label

    Returns:
        Category name (e.g., "fear_family") or "unknown"
    """
    normalized = normalize_emotion(emotion)

    for category, emotions in EMOTION_CATEGORIES.items():
        if normalized in emotions:
            return category

    return "unknown"


def emotion_to_psychology(emotion: str) -> MarketPsychology:
    """
    Map a detected emotion to market psychology state.

    This is the core interpretation logic:
    - fear → panic (investors selling in fear)
    - anger → reactionary (emotional/irrational trading)
    - joy → speculative (risk-on, FOMO behavior)
    - sadness → capitulation (giving up, selling at loss)
    - neutral → stable (normal market conditions)

    Args:
        emotion: Detected emotion label

    Returns:
        MarketPsychology enum value
    """
    normalized = normalize_emotion(emotion)

    # Direct mapping lookup
    if normalized in EMOTION_PSYCHOLOGY_MAP:
        psychology_str = EMOTION_PSYCHOLOGY_MAP[normalized]
        try:
            return MarketPsychology(psychology_str)
        except ValueError:
            return MarketPsychology.UNCERTAIN

    # Category-based fallback mapping
    category = get_emotion_category(normalized)

    category_psychology_map = {
        "fear_family": MarketPsychology.PANIC,
        "anger_family": MarketPsychology.REACTIONARY,
        "sadness_family": MarketPsychology.CAPITULATION,
        "joy_family": MarketPsychology.SPECULATIVE,
        "surprise_family": MarketPsychology.VOLATILE,
        "disgust_family": MarketPsychology.AVERSION,
        "trust_family": MarketPsychology.ACCUMULATION,
        "anticipation_family": MarketPsychology.ACCUMULATION,
    }

    return category_psychology_map.get(category, MarketPsychology.UNCERTAIN)


def compute_emotion_intensity(emotion_scores: dict[str, float]) -> float:
    """
    Compute the intensity of the primary emotion.

    Higher intensity = stronger emotion signal.
    Intensity is based on how dominant the primary emotion is
    compared to others.

    Args:
        emotion_scores: Dict mapping emotion labels to scores

    Returns:
        Intensity value in [0, 1]
    """
    if not emotion_scores:
        return 0.5  # Default moderate intensity

    # Get the highest score
    max_score = max(emotion_scores.values())

    # Get second highest for comparison
    sorted_scores = sorted(emotion_scores.values(), reverse=True)
    second_score = sorted_scores[1] if len(sorted_scores) > 1 else 0.0

    # Intensity based on dominance (how much higher is the top emotion)
    dominance = max_score - second_score

    # Also factor in the absolute strength
    absolute_strength = max_score

    # Combine: 60% dominance, 40% absolute strength
    intensity = (dominance * 0.6) + (absolute_strength * 0.4)

    return min(1.0, max(0.0, intensity))


def interpret_emotion(
    primary_emotion: str,
    emotion_score: float = 0.5,
    all_emotions: Optional[dict[str, float]] = None,
) -> EmotionSignal:
    """
    Generate full emotion interpretation with market psychology.

    This is the main emotion intelligence function that:
    1. Maps emotion to market psychology
    2. Computes emotion intensity
    3. Returns a complete EmotionSignal

    Args:
        primary_emotion: The dominant detected emotion
        emotion_score: Confidence score of the emotion detection
        all_emotions: Optional dict of all emotion scores for intensity calc

    Returns:
        EmotionSignal with emotion, psychology, and intensity

    Example:
        >>> result = interpret_emotion("fear", 0.85)
        >>> result.emotion
        'fear'
        >>> result.market_psychology
        <MarketPsychology.PANIC: 'panic'>
        >>> result.intensity
        0.85
    """
    normalized_emotion = normalize_emotion(primary_emotion)
    psychology = emotion_to_psychology(normalized_emotion)

    # Compute intensity
    if all_emotions:
        intensity = compute_emotion_intensity(all_emotions)
    else:
        # Use the emotion score as intensity proxy
        intensity = emotion_score

    return EmotionSignal(
        emotion=normalized_emotion,
        market_psychology=psychology,
        intensity=round(intensity, 4),
    )


def get_market_behavior_description(psychology: MarketPsychology) -> str:
    """
    Get human-readable description of market psychology state.

    Args:
        psychology: MarketPsychology enum value

    Returns:
        Description string for UI/reporting
    """
    descriptions = {
        MarketPsychology.PANIC: "Investors are panicking, expect heavy selling pressure",
        MarketPsychology.CAPITULATION: "Market participants giving up, possible bottom forming",
        MarketPsychology.REACTIONARY: "Emotional, reactive trading - expect volatility",
        MarketPsychology.AVERSION: "Strong negative sentiment, investors avoiding risk",
        MarketPsychology.SPECULATIVE: "Risk-on behavior, possible FOMO buying",
        MarketPsychology.VOLATILE: "High uncertainty, expect large price swings",
        MarketPsychology.STABLE: "Normal market conditions, no extreme sentiment",
        MarketPsychology.ACCUMULATION: "Smart money accumulating, bullish undertone",
        MarketPsychology.UNCERTAIN: "Mixed signals, unclear market direction",
    }

    return descriptions.get(psychology, "Market sentiment unclear")


def emotion_to_sentiment_modifier(emotion: str) -> float:
    """
    Convert emotion to a sentiment score modifier.

    This helps translate emotions into the [-1, +1] sentiment scale
    used by the fusion engine.

    Args:
        emotion: Detected emotion

    Returns:
        Modifier in [-1, +1] range
    """
    emotion_sentiment_map = {
        # Negative emotions
        "fear": -0.7,
        "anger": -0.5,
        "sadness": -0.6,
        "disgust": -0.4,

        # Positive emotions
        "joy": 0.7,
        "trust": 0.5,
        "anticipation": 0.3,

        # Neutral/Ambiguous
        "surprise": 0.0,  # Can be positive or negative
        "neutral": 0.0,
    }

    normalized = normalize_emotion(emotion)
    return emotion_sentiment_map.get(normalized, 0.0)
