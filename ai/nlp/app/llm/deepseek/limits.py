# ============================================================================
# DEEPSEEK USAGE LIMITS & RATE LIMITING
# Guardrails to control costs and prevent abuse
# ============================================================================

import os
import logging
from typing import Dict, Optional
from datetime import datetime, timedelta, timezone
from dataclasses import dataclass, field
from collections import defaultdict

logger = logging.getLogger(__name__)


@dataclass
class UserUsage:
    """Track usage for a single user."""
    tokens_today: int = 0
    tokens_month: int = 0
    requests_today: int = 0
    requests_month: int = 0
    last_request: Optional[datetime] = None
    daily_reset: datetime = field(default_factory=lambda: datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1))
    monthly_reset: datetime = field(default_factory=lambda: (datetime.now(timezone.utc).replace(day=1, hour=0, minute=0, second=0, microsecond=0) + timedelta(days=32)).replace(day=1))


class UsageTracker:
    """
    In-memory usage tracking with automatic resets.

    For production, this should be backed by Redis or database.
    This implementation provides the interface and logic.
    """

    def __init__(self):
        self._usage: Dict[str, UserUsage] = defaultdict(UserUsage)
        self._global_tokens_today: int = 0
        self._global_tokens_month: int = 0
        self._global_daily_reset: datetime = datetime.now(timezone.utc).replace(
            hour=0, minute=0, second=0, microsecond=0
        ) + timedelta(days=1)

    def _check_reset(self, user_id: str) -> None:
        """Check and perform usage resets if needed."""
        now = datetime.now(timezone.utc)
        usage = self._usage[user_id]

        # Daily reset
        if now >= usage.daily_reset:
            usage.tokens_today = 0
            usage.requests_today = 0
            usage.daily_reset = now.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)

        # Monthly reset
        if now >= usage.monthly_reset:
            usage.tokens_month = 0
            usage.requests_month = 0
            next_month = (now.replace(day=1) + timedelta(days=32)).replace(day=1)
            usage.monthly_reset = next_month.replace(hour=0, minute=0, second=0, microsecond=0)

        # Global daily reset
        if now >= self._global_daily_reset:
            self._global_tokens_today = 0
            self._global_daily_reset = now.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)

    def record_usage(self, user_id: str, tokens: int) -> None:
        """Record token usage for a user."""
        self._check_reset(user_id)
        usage = self._usage[user_id]

        usage.tokens_today += tokens
        usage.tokens_month += tokens
        usage.requests_today += 1
        usage.requests_month += 1
        usage.last_request = datetime.now(timezone.utc)

        self._global_tokens_today += tokens
        self._global_tokens_month += tokens

        logger.info(
            f"LLM usage recorded: user={user_id}, tokens={tokens}, "
            f"daily_total={usage.tokens_today}, monthly_total={usage.tokens_month}"
        )

    def get_usage(self, user_id: str) -> UserUsage:
        """Get current usage for a user."""
        self._check_reset(user_id)
        return self._usage[user_id]

    def get_global_usage(self) -> Dict[str, int]:
        """Get global usage stats."""
        return {
            "tokens_today": self._global_tokens_today,
            "tokens_month": self._global_tokens_month,
        }


class UsageLimiter:
    """
    Enforce usage limits per user and globally.

    Default limits (configurable via env vars):
    - Per user: 10,000 tokens/day, 100,000 tokens/month
    - Global: 1,000,000 tokens/day (cost protection)
    - Rate: 10 requests/minute per user
    """

    def __init__(self, tracker: Optional[UsageTracker] = None):
        self.tracker = tracker or UsageTracker()

        # User limits (from env or defaults)
        self.user_daily_limit = int(os.getenv("LLM_USER_DAILY_TOKENS", "10000"))
        self.user_monthly_limit = int(os.getenv("LLM_USER_MONTHLY_TOKENS", "100000"))
        self.user_requests_per_minute = int(os.getenv("LLM_USER_RPM", "10"))

        # Global limits
        self.global_daily_limit = int(os.getenv("LLM_GLOBAL_DAILY_TOKENS", "1000000"))

        # Rate limiting window
        self._request_times: Dict[str, list] = defaultdict(list)

    def check_limits(self, user_id: str, estimated_tokens: int = 1000) -> Dict[str, any]:
        """
        Check if user can make an LLM request.

        Args:
            user_id: User identifier
            estimated_tokens: Estimated tokens for this request

        Returns:
            {
                "allowed": bool,
                "reason": Optional[str],
                "retry_after": Optional[int],  # seconds
                "usage": UserUsage,
            }
        """
        usage = self.tracker.get_usage(user_id)
        global_usage = self.tracker.get_global_usage()
        now = datetime.now(timezone.utc)

        # Check rate limit (requests per minute)
        recent_requests = self._request_times[user_id]
        minute_ago = now - timedelta(minutes=1)
        recent_requests = [t for t in recent_requests if t > minute_ago]
        self._request_times[user_id] = recent_requests

        if len(recent_requests) >= self.user_requests_per_minute:
            oldest = min(recent_requests)
            retry_after = int((oldest + timedelta(minutes=1) - now).total_seconds()) + 1
            return {
                "allowed": False,
                "reason": f"Rate limit exceeded. Max {self.user_requests_per_minute} requests/minute.",
                "retry_after": retry_after,
                "code": "rate_limit",
                "usage": usage,
            }

        # Check user daily limit
        if usage.tokens_today + estimated_tokens > self.user_daily_limit:
            reset_seconds = int((usage.daily_reset - now).total_seconds())
            return {
                "allowed": False,
                "reason": f"Daily token limit reached ({self.user_daily_limit:,} tokens). Resets in {reset_seconds // 3600}h.",
                "retry_after": reset_seconds,
                "code": "token_limit",
                "usage": usage,
            }

        # Check user monthly limit
        if usage.tokens_month + estimated_tokens > self.user_monthly_limit:
            reset_seconds = int((usage.monthly_reset - now).total_seconds())
            return {
                "allowed": False,
                "reason": f"Monthly token limit reached ({self.user_monthly_limit:,} tokens).",
                "retry_after": reset_seconds,
                "code": "token_limit",
                "usage": usage,
            }

        # Check global daily limit
        if global_usage["tokens_today"] + estimated_tokens > self.global_daily_limit:
            return {
                "allowed": False,
                "reason": "Service temporarily at capacity. Please try again later.",
                "retry_after": 3600,  # Suggest retry in 1 hour
                "code": "service_unavailable",
                "usage": usage,
            }

        # Record this request time for rate limiting
        self._request_times[user_id].append(now)

        return {
            "allowed": True,
            "reason": None,
            "retry_after": None,
            "code": None,
            "usage": usage,
        }

    def record_usage(self, user_id: str, tokens: int) -> None:
        """Record actual token usage after request completes."""
        self.tracker.record_usage(user_id, tokens)

    def get_user_stats(self, user_id: str) -> Dict[str, any]:
        """Get usage statistics for a user."""
        usage = self.tracker.get_usage(user_id)
        now = datetime.now(timezone.utc)

        return {
            "user_id": user_id,
            "tokens_used_today": usage.tokens_today,
            "tokens_used_month": usage.tokens_month,
            "requests_today": usage.requests_today,
            "requests_month": usage.requests_month,
            "daily_limit": self.user_daily_limit,
            "monthly_limit": self.user_monthly_limit,
            "daily_remaining": max(0, self.user_daily_limit - usage.tokens_today),
            "monthly_remaining": max(0, self.user_monthly_limit - usage.tokens_month),
            "reset_daily_at": usage.daily_reset.isoformat(),
            "reset_monthly_at": usage.monthly_reset.isoformat(),
            "last_request": usage.last_request.isoformat() if usage.last_request else None,
        }


# Singleton instances
_tracker: Optional[UsageTracker] = None
_limiter: Optional[UsageLimiter] = None


def get_tracker() -> UsageTracker:
    """Get or create singleton usage tracker."""
    global _tracker
    if _tracker is None:
        _tracker = UsageTracker()
    return _tracker


def get_limiter() -> UsageLimiter:
    """Get or create singleton usage limiter."""
    global _limiter
    if _limiter is None:
        _limiter = UsageLimiter(get_tracker())
    return _limiter
