# ============================================================================
# DEEPSEEK LLM CLIENT
# Isolated wrapper for DeepSeek API calls with fail-safe design
# ============================================================================

import os
import json
import httpx
import logging
from typing import Optional, Dict, Any
from datetime import datetime, timezone
from pathlib import Path

from .explain_cache import get_explain_cache

logger = logging.getLogger(__name__)


# Fallback message for failed explanations
EXPLAIN_FALLBACK_MESSAGE = "Explanation temporarily unavailable. Please try again."


class DeepSeekError(Exception):
    """Base exception for DeepSeek client errors."""
    def __init__(self, message: str, code: str, retry_after: Optional[int] = None):
        super().__init__(message)
        self.code = code
        self.retry_after = retry_after


class DeepSeekClient:
    """
    Isolated DeepSeek API client with:
    - Token tracking per request
    - Automatic retry with backoff
    - Fail-safe error handling (never crashes core engine)
    - Request/response logging for debugging
    """

    BASE_URL = "https://api.deepseek.com/v1"
    DEFAULT_MODEL = "deepseek-chat"
    DEFAULT_TIMEOUT = 30.0
    MAX_RETRIES = 2

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("DEEPSEEK_API_KEY")
        self._client: Optional[httpx.AsyncClient] = None
        self._prompts_cache: Dict[str, str] = {}
        self._prompts_dir = Path(__file__).parent / "prompts"

    @property
    def is_configured(self) -> bool:
        """Check if DeepSeek is properly configured."""
        return bool(self.api_key)

    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create async HTTP client."""
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                base_url=self.BASE_URL,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                timeout=self.DEFAULT_TIMEOUT,
            )
        return self._client

    async def close(self) -> None:
        """Close the HTTP client."""
        if self._client and not self._client.is_closed:
            await self._client.aclose()
            self._client = None

    def load_prompt(self, capability: str) -> str:
        """
        Load prompt template from file.
        Caches prompts in memory for performance.
        """
        if capability not in self._prompts_cache:
            prompt_file = self._prompts_dir / f"{capability}.txt"
            if not prompt_file.exists():
                raise DeepSeekError(
                    f"Prompt template not found: {capability}",
                    code="invalid_request"
                )
            self._prompts_cache[capability] = prompt_file.read_text(encoding="utf-8")
        return self._prompts_cache[capability]

    def inject_data(self, capability: str, placeholder: str, data: str) -> str:
        """
        Load prompt template and inject structured data.

        Uses {{PLACEHOLDER}} format for safe replacement without
        conflicting with Python format strings or JSON.
        """
        template = self.load_prompt(capability)
        placeholder_key = "{{" + placeholder + "}}"

        if placeholder_key not in template:
            raise DeepSeekError(
                f"Placeholder {placeholder_key} not found in {capability}.txt",
                code="invalid_request"
            )

        return template.replace(placeholder_key, data)

    async def generate(
        self,
        prompt: str,
        max_tokens: int = 1000,
        temperature: float = 0.7,
        system_prompt: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Generate text from DeepSeek API.

        Returns:
            {
                "content": str,        # Generated text
                "tokens_used": int,    # Total tokens (input + output)
                "input_tokens": int,
                "output_tokens": int,
                "model": str,
                "latency_ms": int,
            }

        Raises:
            DeepSeekError: On API errors (never crashes silently)
        """
        if not self.is_configured:
            raise DeepSeekError(
                "DeepSeek API key not configured",
                code="service_unavailable"
            )

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": self.DEFAULT_MODEL,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "stream": False,
        }

        start_time = datetime.now(timezone.utc)
        last_error: Optional[Exception] = None

        for attempt in range(self.MAX_RETRIES + 1):
            try:
                client = await self._get_client()
                response = await client.post("/chat/completions", json=payload)

                if response.status_code == 429:
                    # Rate limited
                    retry_after = int(response.headers.get("Retry-After", 60))
                    raise DeepSeekError(
                        "DeepSeek rate limit exceeded",
                        code="rate_limit",
                        retry_after=retry_after
                    )

                if response.status_code >= 500:
                    # Server error - retry
                    if attempt < self.MAX_RETRIES:
                        import asyncio
                        await asyncio.sleep(2 ** attempt)  # Exponential backoff
                        continue
                    raise DeepSeekError(
                        f"DeepSeek server error: {response.status_code}",
                        code="service_unavailable"
                    )

                if response.status_code != 200:
                    error_data = response.json() if response.content else {}
                    raise DeepSeekError(
                        error_data.get("error", {}).get("message", f"API error: {response.status_code}"),
                        code="llm_error"
                    )

                data = response.json()
                latency_ms = int((datetime.now(timezone.utc) - start_time).total_seconds() * 1000)

                usage = data.get("usage", {})
                return {
                    "content": data["choices"][0]["message"]["content"],
                    "tokens_used": usage.get("total_tokens", 0),
                    "input_tokens": usage.get("prompt_tokens", 0),
                    "output_tokens": usage.get("completion_tokens", 0),
                    "model": data.get("model", self.DEFAULT_MODEL),
                    "latency_ms": latency_ms,
                }

            except httpx.TimeoutException:
                last_error = DeepSeekError(
                    "DeepSeek request timed out",
                    code="service_unavailable"
                )
                if attempt < self.MAX_RETRIES:
                    import asyncio
                    await asyncio.sleep(2 ** attempt)
                    continue

            except httpx.RequestError as e:
                last_error = DeepSeekError(
                    f"DeepSeek connection error: {str(e)}",
                    code="service_unavailable"
                )
                if attempt < self.MAX_RETRIES:
                    import asyncio
                    await asyncio.sleep(2 ** attempt)
                    continue

        if last_error:
            raise last_error
        raise DeepSeekError("Unknown error", code="llm_error")

    async def explain(
        self,
        asset_symbol: str,
        asset_name: Optional[str],
        metrics: Dict[str, Any],
        timeframe: str,
    ) -> Dict[str, Any]:
        """
        Generate explanation for sentiment metrics.

        Optimized for:
        - Cache-first lookup (10 min TTL)
        - Reduced token usage (200 max)
        - Graceful fallback on failure
        """
        # Build structured sentiment data as JSON block
        structured_data = {
            "ticker": asset_symbol,
            "name": asset_name or asset_symbol,
            "sentiment_score": metrics["overall_score"],
            "confidence": metrics["confidence"],
            "dominant_emotion": metrics.get("dominant_emotion", "neutral"),
            "emotion_distribution": metrics.get("emotion_distribution", {}),
            "trend_direction": metrics.get("trend_direction", "stable"),
            "sample_size": metrics["sample_size"],
            "timeframe": timeframe,
            "source_breakdown": metrics.get("source_breakdown", {}),
        }

        # =====================================================================
        # CACHE LOOKUP (before DeepSeek call)
        # =====================================================================
        cache = get_explain_cache()
        cached = cache.get(asset_symbol, timeframe, structured_data)

        if cached:
            logger.info(
                f"[EXPLAIN] Cache HIT for {asset_symbol}/{timeframe} "
                f"(age: {cached['cache_age_seconds']}s)"
            )
            return cached

        # =====================================================================
        # DEEPSEEK CALL (cache miss)
        # =====================================================================
        logger.info(f"[EXPLAIN] Cache MISS for {asset_symbol}/{timeframe}, calling DeepSeek")

        try:
            prompt = self.inject_data(
                "explain",
                "STRUCTURED_SENTIMENT_DATA",
                json.dumps(structured_data, indent=2),
            )

            start_time = datetime.now(timezone.utc)

            result = await self.generate(
                prompt=prompt,
                max_tokens=200,  # Reduced from 300 for 2-4 sentences
                temperature=0.2,  # Lower temp for consistent, factual output
            )

            latency_ms = result.get("latency_ms", 0)
            tokens_used = result.get("tokens_used", 0)

            # Log observability metrics
            logger.info(
                f"[EXPLAIN] DeepSeek response for {asset_symbol}: "
                f"tokens={tokens_used} (in={result.get('input_tokens', 0)}, "
                f"out={result.get('output_tokens', 0)}), latency={latency_ms}ms"
            )

            # Trim response
            result["content"] = result["content"].strip()

            # Store in cache (only successful responses)
            cache.store(
                ticker=asset_symbol,
                window=timeframe,
                data=structured_data,
                content=result["content"],
                tokens_used=tokens_used,
            )

            result["cached"] = False
            return result

        except DeepSeekError as e:
            logger.error(f"[EXPLAIN] DeepSeek error for {asset_symbol}: {e} (code: {e.code})")
            return {
                "content": EXPLAIN_FALLBACK_MESSAGE,
                "tokens_used": 0,
                "cached": False,
                "error": True,
                "error_code": e.code,
            }

        except Exception as e:
            logger.error(f"[EXPLAIN] Unexpected error for {asset_symbol}: {e}")
            return {
                "content": EXPLAIN_FALLBACK_MESSAGE,
                "tokens_used": 0,
                "cached": False,
                "error": True,
                "error_code": "unknown",
            }

    async def daily_summary(
        self,
        daily_data: Dict[str, Any],
        focus_assets: Optional[list] = None,
        include_trends: bool = True,
    ) -> Dict[str, Any]:
        """Generate daily market summary."""
        # Build daily aggregated data as JSON block
        aggregated_data = {
            "date": daily_data["date"],
            "market_sentiment": daily_data["average_sentiment"],
            "assets_analyzed": daily_data["assets_analyzed"],
            "total_mentions": daily_data["total_mentions"],
            "top_movers": daily_data.get("top_movers", []),
            "top_positive_tickers": [
                m.get("symbol") for m in daily_data.get("top_movers", [])
                if m.get("sentiment", 0) > 0
            ][:5],
            "top_negative_tickers": [
                m.get("symbol") for m in daily_data.get("top_movers", [])
                if m.get("sentiment", 0) < 0
            ][:5],
            "dominant_emotions": daily_data.get("dominant_emotions", {}),
            "anomalies_detected": daily_data.get("anomalies_detected", 0),
            "volatility_level": self._calculate_volatility_level(daily_data),
            "focus_assets": focus_assets or [],
        }

        prompt = self.inject_data(
            "daily_summary",
            "DAILY_AGGREGATED_DATA",
            json.dumps(aggregated_data, indent=2),
        )

        result = await self.generate(
            prompt=prompt,
            max_tokens=500,  # 1-2 paragraphs
            temperature=0.3,  # Low temp for factual output
        )

        return result

    def _calculate_volatility_level(self, daily_data: Dict[str, Any]) -> str:
        """Calculate volatility level from daily data."""
        anomalies = daily_data.get("anomalies_detected", 0)
        if anomalies >= 5:
            return "high"
        elif anomalies >= 2:
            return "moderate"
        else:
            return "low"

    async def narrative(
        self,
        asset_symbol: str,
        sources: list,
        timeframe: str,
        context: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Generate narrative analysis from multi-source data."""
        # Extract themes and emotions from sources
        all_themes = []
        emotion_totals: Dict[str, float] = {}
        total_weight = 0

        for source in sources:
            all_themes.extend(source.get("top_themes", []))
            weight = source.get("mention_count", 1)
            total_weight += weight
            for emotion, score in source.get("emotion_distribution", {}).items():
                emotion_totals[emotion] = emotion_totals.get(emotion, 0) + score * weight

        # Normalize emotions
        if total_weight > 0:
            emotion_distribution = {
                k: round(v / total_weight, 2)
                for k, v in emotion_totals.items()
            }
        else:
            emotion_distribution = {}

        # Calculate consistency based on sentiment variance
        sentiments = [s.get("sentiment_avg", 0) for s in sources]
        if len(sentiments) > 1:
            avg = sum(sentiments) / len(sentiments)
            variance = sum((s - avg) ** 2 for s in sentiments) / len(sentiments)
            consistency = "consistent" if variance < 0.1 else "mixed" if variance < 0.3 else "conflicting"
        else:
            consistency = "single_source"

        # Build narrative data as JSON block
        narrative_data = {
            "ticker": asset_symbol,
            "timeframe": timeframe,
            "themes": list(set(all_themes))[:10],  # Dedupe, limit to 10
            "emotion_distribution": emotion_distribution,
            "consistency": consistency,
            "sources": [
                {
                    "platform": s.get("source"),
                    "mentions": s.get("mention_count"),
                    "sentiment": s.get("sentiment_avg"),
                }
                for s in sources
            ],
        }

        prompt = self.inject_data(
            "narrative",
            "NARRATIVE_DATA",
            json.dumps(narrative_data, indent=2),
        )

        result = await self.generate(
            prompt=prompt,
            max_tokens=400,  # 4-8 sentences
            temperature=0.3,  # Low temp for factual output
        )

        return result


# Singleton instance
_client: Optional[DeepSeekClient] = None


def get_client() -> DeepSeekClient:
    """Get or create singleton DeepSeek client."""
    global _client
    if _client is None:
        _client = DeepSeekClient()
    return _client
