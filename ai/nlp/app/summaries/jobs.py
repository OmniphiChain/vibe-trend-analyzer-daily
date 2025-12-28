# ============================================================================
# SUMMARY GENERATION JOBS
# Scheduled background tasks for market summaries
# ============================================================================
#
# These jobs run on a fixed schedule and generate shared summaries.
# They NEVER run on user request or page load.
# ============================================================================

import os
import json
import asyncio
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta, timezone
from uuid import uuid4

logger = logging.getLogger(__name__)


# Import DeepSeek client (optional dependency)
try:
    from app.llm.deepseek.client import DeepSeekClient, DeepSeekError, get_client
    DEEPSEEK_AVAILABLE = True
except ImportError:
    DEEPSEEK_AVAILABLE = False
    DeepSeekClient = None
    DeepSeekError = Exception
    get_client = lambda: None

from .storage import SummaryStorage, get_storage
from .schemas import (
    SummaryType,
    SummaryStatus,
    HourlySummary,
    DailySummary,
    SectorSummary,
    HourlyAggregateInput,
    DailyAggregateInput,
    SectorAggregateInput,
)


# Token limits per summary type (cost control)
MAX_TOKENS_HOURLY = 200
MAX_TOKENS_DAILY = 400
MAX_TOKENS_SECTOR = 150


class SummaryGenerator:
    """
    Generates summaries using DeepSeek LLM.

    Safety features:
    - Hard token caps per summary type
    - Fail-closed (no retry loops)
    - Logs every invocation
    - Returns fallback on failure
    """

    def __init__(self, client: Optional[DeepSeekClient] = None):
        self.client = client
        self._invocation_log: List[Dict[str, Any]] = []

    @property
    def is_available(self) -> bool:
        """Check if DeepSeek is available."""
        return self.client is not None and self.client.is_configured

    def _log_invocation(
        self,
        summary_type: SummaryType,
        success: bool,
        tokens_used: int,
        error: Optional[str] = None,
    ) -> None:
        """Log every DeepSeek invocation."""
        entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "type": summary_type.value,
            "success": success,
            "tokens_used": tokens_used,
            "error": error,
        }
        self._invocation_log.append(entry)

        # Keep only last 100 entries
        if len(self._invocation_log) > 100:
            self._invocation_log = self._invocation_log[-100:]

        if success:
            logger.info(f"DeepSeek invocation: {summary_type.value}, tokens={tokens_used}")
        else:
            logger.error(f"DeepSeek invocation FAILED: {summary_type.value}, error={error}")

    def get_invocation_log(self) -> List[Dict[str, Any]]:
        """Get recent invocation log."""
        return self._invocation_log.copy()

    async def generate_hourly(self, data: HourlyAggregateInput) -> HourlySummary:
        """Generate hourly market summary."""
        now = datetime.now(timezone.utc)
        hour_key = now.strftime("%Y-%m-%d-%H")
        summary_id = f"hourly-{hour_key}-{uuid4().hex[:8]}"

        # Determine sentiment direction
        if data.sentiment_change > 0.05:
            direction = "up"
        elif data.sentiment_change < -0.05:
            direction = "down"
        else:
            direction = "stable"

        # If DeepSeek unavailable, return minimal summary
        if not self.is_available:
            logger.warning("DeepSeek unavailable, returning minimal hourly summary")
            return HourlySummary(
                id=summary_id,
                status=SummaryStatus.COMPLETED,
                generated_at=now,
                expires_at=now + timedelta(minutes=65),
                hour=hour_key,
                summary=f"Market sentiment is {direction}. Overall score: {data.market_sentiment:.2f}.",
                market_sentiment=data.market_sentiment,
                sentiment_direction=direction,
                key_highlights=[],
                input_data=data,
            )

        # Build structured data for prompt
        aggregate_data = {
            "timestamp": data.timestamp.isoformat(),
            "market_sentiment": round(data.market_sentiment, 3),
            "sentiment_change": round(data.sentiment_change, 3),
            "volume": data.volume,
            "volume_change_pct": round(data.volume_change_pct, 1),
            "top_positive": data.top_positive[:3],
            "top_negative": data.top_negative[:3],
            "dominant_emotion": data.dominant_emotion,
            "volatility": data.volatility,
        }

        try:
            start_time = datetime.now(timezone.utc)

            prompt = self.client.inject_data(
                "hourly_summary",
                "HOURLY_AGGREGATE_DATA",
                json.dumps(aggregate_data, indent=2),
            )

            result = await self.client.generate(
                prompt=prompt,
                max_tokens=MAX_TOKENS_HOURLY,
                temperature=0.3,
            )

            generation_time = int((datetime.now(timezone.utc) - start_time).total_seconds() * 1000)
            tokens_used = result.get("tokens_used", 0)

            self._log_invocation(SummaryType.HOURLY, True, tokens_used)

            # Extract highlights from response
            highlights = self._extract_highlights(result["content"], max_count=3)

            return HourlySummary(
                id=summary_id,
                status=SummaryStatus.COMPLETED,
                generated_at=now,
                expires_at=now + timedelta(minutes=65),
                tokens_used=tokens_used,
                generation_time_ms=generation_time,
                hour=hour_key,
                summary=result["content"].strip(),
                market_sentiment=data.market_sentiment,
                sentiment_direction=direction,
                key_highlights=highlights,
                input_data=data,
            )

        except Exception as e:
            self._log_invocation(SummaryType.HOURLY, False, 0, str(e))
            logger.error(f"Hourly summary generation failed: {e}")

            # Return failed summary (storage will use fallback)
            return HourlySummary(
                id=summary_id,
                status=SummaryStatus.FAILED,
                generated_at=now,
                expires_at=now + timedelta(minutes=65),
                hour=hour_key,
                summary=f"Market sentiment is {direction}. Score: {data.market_sentiment:.2f}.",
                market_sentiment=data.market_sentiment,
                sentiment_direction=direction,
                key_highlights=[],
                input_data=data,
            )

    async def generate_daily(self, data: DailyAggregateInput) -> DailySummary:
        """Generate daily market summary."""
        now = datetime.now(timezone.utc)
        summary_id = f"daily-{data.date}-{uuid4().hex[:8]}"

        # Determine sentiment direction
        if data.sentiment_change > 0.05:
            direction = "up"
        elif data.sentiment_change < -0.05:
            direction = "down"
        else:
            direction = "stable"

        # If DeepSeek unavailable, return minimal summary
        if not self.is_available:
            logger.warning("DeepSeek unavailable, returning minimal daily summary")
            return DailySummary(
                id=summary_id,
                status=SummaryStatus.COMPLETED,
                generated_at=now,
                expires_at=now + timedelta(hours=25),
                date=data.date,
                summary=f"Daily market sentiment: {direction}. Score: {data.market_sentiment:.2f}. Volume: {data.total_volume:,} mentions.",
                market_sentiment=data.market_sentiment,
                sentiment_direction=direction,
                key_highlights=[],
                notable_movers=[],
                input_data=data,
            )

        # Build structured data for prompt
        aggregate_data = {
            "date": data.date,
            "market_sentiment": round(data.market_sentiment, 3),
            "sentiment_change": round(data.sentiment_change, 3),
            "total_volume": data.total_volume,
            "assets_analyzed": data.assets_analyzed,
            "top_positive_tickers": [t.get("symbol", "?") for t in data.top_positive[:5]],
            "top_negative_tickers": [t.get("symbol", "?") for t in data.top_negative[:5]],
            "dominant_emotions": data.dominant_emotions,
            "anomalies_detected": data.anomalies_detected,
            "volatility_level": data.volatility,
        }

        try:
            start_time = datetime.now(timezone.utc)

            prompt = self.client.inject_data(
                "daily_summary",
                "DAILY_AGGREGATED_DATA",
                json.dumps(aggregate_data, indent=2),
            )

            result = await self.client.generate(
                prompt=prompt,
                max_tokens=MAX_TOKENS_DAILY,
                temperature=0.3,
            )

            generation_time = int((datetime.now(timezone.utc) - start_time).total_seconds() * 1000)
            tokens_used = result.get("tokens_used", 0)

            self._log_invocation(SummaryType.DAILY, True, tokens_used)

            # Extract highlights and notable movers
            highlights = self._extract_highlights(result["content"], max_count=5)
            movers = [
                {"symbol": t.get("symbol", "?"), "direction": "positive"}
                for t in data.top_positive[:3]
            ] + [
                {"symbol": t.get("symbol", "?"), "direction": "negative"}
                for t in data.top_negative[:3]
            ]

            return DailySummary(
                id=summary_id,
                status=SummaryStatus.COMPLETED,
                generated_at=now,
                expires_at=now + timedelta(hours=25),
                tokens_used=tokens_used,
                generation_time_ms=generation_time,
                date=data.date,
                summary=result["content"].strip(),
                market_sentiment=data.market_sentiment,
                sentiment_direction=direction,
                key_highlights=highlights,
                notable_movers=movers,
                input_data=data,
            )

        except Exception as e:
            self._log_invocation(SummaryType.DAILY, False, 0, str(e))
            logger.error(f"Daily summary generation failed: {e}")

            return DailySummary(
                id=summary_id,
                status=SummaryStatus.FAILED,
                generated_at=now,
                expires_at=now + timedelta(hours=25),
                date=data.date,
                summary=f"Daily market sentiment: {direction}. Score: {data.market_sentiment:.2f}.",
                market_sentiment=data.market_sentiment,
                sentiment_direction=direction,
                key_highlights=[],
                notable_movers=[],
                input_data=data,
            )

    async def generate_sector(self, data: SectorAggregateInput) -> SectorSummary:
        """Generate sector summary."""
        now = datetime.now(timezone.utc)
        summary_id = f"sector-{data.sector}-{data.date}-{uuid4().hex[:8]}"

        # Determine sentiment direction
        if data.sentiment_change > 0.05:
            direction = "up"
        elif data.sentiment_change < -0.05:
            direction = "down"
        else:
            direction = "stable"

        top_ticker = data.top_tickers[0].get("symbol") if data.top_tickers else None

        # If DeepSeek unavailable, return minimal summary
        if not self.is_available:
            return SectorSummary(
                id=summary_id,
                status=SummaryStatus.COMPLETED,
                generated_at=now,
                expires_at=now + timedelta(hours=25),
                date=data.date,
                sector=data.sector,
                summary=f"{data.sector} sentiment: {direction}. Score: {data.sentiment:.2f}.",
                sentiment=data.sentiment,
                sentiment_direction=direction,
                top_ticker=top_ticker,
                input_data=data,
            )

        # Build structured data for prompt
        aggregate_data = {
            "date": data.date,
            "sector": data.sector,
            "sentiment": round(data.sentiment, 3),
            "sentiment_change": round(data.sentiment_change, 3),
            "volume": data.volume,
            "top_tickers": [t.get("symbol", "?") for t in data.top_tickers[:3]],
            "dominant_emotion": data.dominant_emotion,
        }

        try:
            start_time = datetime.now(timezone.utc)

            prompt = self.client.inject_data(
                "sector_summary",
                "SECTOR_AGGREGATE_DATA",
                json.dumps(aggregate_data, indent=2),
            )

            result = await self.client.generate(
                prompt=prompt,
                max_tokens=MAX_TOKENS_SECTOR,
                temperature=0.3,
            )

            generation_time = int((datetime.now(timezone.utc) - start_time).total_seconds() * 1000)
            tokens_used = result.get("tokens_used", 0)

            self._log_invocation(SummaryType.SECTOR, True, tokens_used)

            return SectorSummary(
                id=summary_id,
                status=SummaryStatus.COMPLETED,
                generated_at=now,
                expires_at=now + timedelta(hours=25),
                tokens_used=tokens_used,
                generation_time_ms=generation_time,
                date=data.date,
                sector=data.sector,
                summary=result["content"].strip(),
                sentiment=data.sentiment,
                sentiment_direction=direction,
                top_ticker=top_ticker,
                input_data=data,
            )

        except Exception as e:
            self._log_invocation(SummaryType.SECTOR, False, 0, str(e))
            logger.error(f"Sector summary generation failed for {data.sector}: {e}")

            return SectorSummary(
                id=summary_id,
                status=SummaryStatus.FAILED,
                generated_at=now,
                expires_at=now + timedelta(hours=25),
                date=data.date,
                sector=data.sector,
                summary=f"{data.sector} sentiment: {direction}. Score: {data.sentiment:.2f}.",
                sentiment=data.sentiment,
                sentiment_direction=direction,
                top_ticker=top_ticker,
                input_data=data,
            )

    def _extract_highlights(self, content: str, max_count: int = 3) -> List[str]:
        """Extract key highlights from generated content."""
        import re

        highlights = []
        lines = content.split('\n')

        for line in lines:
            line = line.strip()
            # Match bullet points or short sentences
            if re.match(r'^[\-\*\•]\s+', line) or re.match(r'^\d+[\.\)]\s+', line):
                clean = re.sub(r'^[\-\*\•\d\.\)]+\s*', '', line)
                if 10 < len(clean) < 150:
                    highlights.append(clean)
                    if len(highlights) >= max_count:
                        break

        return highlights


class SummaryScheduler:
    """
    Scheduler for summary generation jobs.

    Runs jobs on fixed intervals:
    - Hourly: Every 60 minutes
    - Daily: Once per day at midnight UTC
    - Sectors: Once per day (optional)
    """

    def __init__(
        self,
        storage: Optional[SummaryStorage] = None,
        generator: Optional[SummaryGenerator] = None,
    ):
        self.storage = storage or get_storage()
        self.generator = generator or SummaryGenerator(
            client=get_client() if DEEPSEEK_AVAILABLE else None
        )

        self._running = False
        self._tasks: List[asyncio.Task] = []

        # Schedule tracking
        self._last_hourly: Optional[datetime] = None
        self._last_daily: Optional[datetime] = None
        self._next_hourly: Optional[datetime] = None
        self._next_daily: Optional[datetime] = None

    @property
    def is_running(self) -> bool:
        return self._running

    def get_schedule_info(self) -> Dict[str, Any]:
        """Get current schedule information."""
        return {
            "running": self._running,
            "last_hourly": self._last_hourly.isoformat() if self._last_hourly else None,
            "last_daily": self._last_daily.isoformat() if self._last_daily else None,
            "next_hourly": self._next_hourly.isoformat() if self._next_hourly else None,
            "next_daily": self._next_daily.isoformat() if self._next_daily else None,
            "deepseek_available": self.generator.is_available,
        }

    async def start(self) -> None:
        """Start the scheduler."""
        if self._running:
            logger.warning("Scheduler already running")
            return

        self._running = True
        logger.info("Starting summary scheduler")

        # Start background tasks
        self._tasks = [
            asyncio.create_task(self._hourly_loop()),
            asyncio.create_task(self._daily_loop()),
        ]

    async def stop(self) -> None:
        """Stop the scheduler."""
        self._running = False

        for task in self._tasks:
            task.cancel()

        self._tasks = []
        logger.info("Summary scheduler stopped")

    async def _hourly_loop(self) -> None:
        """Hourly summary generation loop."""
        while self._running:
            try:
                # Calculate next run time (top of the hour)
                now = datetime.now(timezone.utc)
                next_hour = now.replace(minute=0, second=0, microsecond=0) + timedelta(hours=1)
                self._next_hourly = next_hour

                # Wait until next hour
                wait_seconds = (next_hour - now).total_seconds()
                logger.info(f"Next hourly summary in {wait_seconds:.0f} seconds")

                await asyncio.sleep(wait_seconds)

                # Generate summary
                await self._run_hourly_job()

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Hourly loop error: {e}")
                await asyncio.sleep(60)  # Wait 1 minute before retry

    async def _daily_loop(self) -> None:
        """Daily summary generation loop."""
        while self._running:
            try:
                # Calculate next run time (midnight UTC)
                now = datetime.now(timezone.utc)
                tomorrow = (now + timedelta(days=1)).replace(
                    hour=0, minute=5, second=0, microsecond=0  # 00:05 UTC
                )
                self._next_daily = tomorrow

                # Wait until midnight
                wait_seconds = (tomorrow - now).total_seconds()
                logger.info(f"Next daily summary in {wait_seconds:.0f} seconds")

                await asyncio.sleep(wait_seconds)

                # Generate summary
                await self._run_daily_job()

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Daily loop error: {e}")
                await asyncio.sleep(300)  # Wait 5 minutes before retry

    async def _run_hourly_job(self) -> None:
        """Execute hourly summary generation."""
        # Check if already generating
        if self.storage.is_generating(SummaryType.HOURLY):
            logger.warning("Hourly summary already generating, skipping")
            return

        self.storage.set_generating(SummaryType.HOURLY, value=True)

        try:
            logger.info("Running hourly summary job")

            # Get aggregated data (in production, query from database)
            data = await self._fetch_hourly_aggregate()

            if data:
                summary = await self.generator.generate_hourly(data)
                self.storage.store_hourly(summary)
                self._last_hourly = datetime.now(timezone.utc)
                logger.info(f"Hourly summary generated: {summary.id}")
            else:
                logger.warning("No hourly aggregate data available")

        finally:
            self.storage.set_generating(SummaryType.HOURLY, value=False)

    async def _run_daily_job(self) -> None:
        """Execute daily summary generation."""
        if self.storage.is_generating(SummaryType.DAILY):
            logger.warning("Daily summary already generating, skipping")
            return

        self.storage.set_generating(SummaryType.DAILY, value=True)

        try:
            logger.info("Running daily summary job")

            # Get aggregated data
            data = await self._fetch_daily_aggregate()

            if data:
                summary = await self.generator.generate_daily(data)
                self.storage.store_daily(summary)
                self._last_daily = datetime.now(timezone.utc)
                logger.info(f"Daily summary generated: {summary.id}")
            else:
                logger.warning("No daily aggregate data available")

        finally:
            self.storage.set_generating(SummaryType.DAILY, value=False)

    async def _fetch_hourly_aggregate(self) -> Optional[HourlyAggregateInput]:
        """
        Fetch hourly aggregated data from core engine.

        In production, this would query the database for:
        - Last hour's sentiment scores
        - Volume metrics
        - Top movers

        For now, returns mock data for testing.
        """
        # TODO: Replace with actual database query
        # This is a placeholder that simulates aggregated data
        import random

        now = datetime.now(timezone.utc)

        return HourlyAggregateInput(
            timestamp=now,
            market_sentiment=round(random.uniform(-0.3, 0.3), 3),
            sentiment_change=round(random.uniform(-0.1, 0.1), 3),
            volume=random.randint(1000, 5000),
            volume_change_pct=round(random.uniform(-10, 10), 1),
            top_positive=[
                {"symbol": "AAPL", "sentiment": 0.6},
                {"symbol": "MSFT", "sentiment": 0.5},
            ],
            top_negative=[
                {"symbol": "AMD", "sentiment": -0.4},
            ],
            dominant_emotion="neutral",
            volatility="low",
        )

    async def _fetch_daily_aggregate(self) -> Optional[DailyAggregateInput]:
        """
        Fetch daily aggregated data from core engine.

        In production, this would query the database.
        """
        # TODO: Replace with actual database query
        import random

        yesterday = (datetime.now(timezone.utc) - timedelta(days=1)).strftime("%Y-%m-%d")

        return DailyAggregateInput(
            date=yesterday,
            market_sentiment=round(random.uniform(-0.3, 0.3), 3),
            sentiment_change=round(random.uniform(-0.15, 0.15), 3),
            total_volume=random.randint(10000, 50000),
            assets_analyzed=random.randint(50, 200),
            top_movers=[
                {"symbol": "AAPL", "sentiment": 0.6, "change": 0.15},
                {"symbol": "NVDA", "sentiment": -0.3, "change": -0.2},
            ],
            top_positive=[
                {"symbol": "AAPL", "sentiment": 0.6},
                {"symbol": "MSFT", "sentiment": 0.5},
                {"symbol": "GOOGL", "sentiment": 0.4},
            ],
            top_negative=[
                {"symbol": "AMD", "sentiment": -0.4},
                {"symbol": "INTC", "sentiment": -0.3},
            ],
            dominant_emotions={"neutral": 0.4, "optimism": 0.3, "fear": 0.2},
            anomalies_detected=random.randint(0, 3),
            volatility="moderate",
        )

    # Manual trigger methods (for admin/testing only)
    async def trigger_hourly(self) -> Optional[HourlySummary]:
        """Manually trigger hourly summary generation."""
        await self._run_hourly_job()
        return self.storage.get_hourly()

    async def trigger_daily(self) -> Optional[DailySummary]:
        """Manually trigger daily summary generation."""
        await self._run_daily_job()
        return self.storage.get_daily()


# Singleton instance
_scheduler: Optional[SummaryScheduler] = None


def get_scheduler() -> SummaryScheduler:
    """Get or create singleton scheduler instance."""
    global _scheduler
    if _scheduler is None:
        _scheduler = SummaryScheduler()
    return _scheduler
