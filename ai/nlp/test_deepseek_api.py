#!/usr/bin/env python3
"""
Quick test script to verify DeepSeek API connectivity, caching, and optimization.
"""

import os
import asyncio
import logging

# Set env before imports
os.environ['DEEPSEEK_API_KEY'] = 'sk-3e3f9a96c6be4e36acfb4a6e60b6918b'

# Enable logging to see cache behavior
logging.basicConfig(level=logging.INFO, format='%(name)s - %(message)s')

from app.llm.deepseek.client import DeepSeekClient, DeepSeekError
from app.llm.deepseek.explain_cache import get_explain_cache


async def test_deepseek_api():
    """Test DeepSeek API with a simple prompt."""
    print("\n" + "=" * 60)
    print("TESTING DEEPSEEK API")
    print("=" * 60)

    client = DeepSeekClient()

    print(f"API Key configured: {client.is_configured}")
    print(f"Base URL: {client.BASE_URL}")
    print(f"Model: {client.DEFAULT_MODEL}")

    try:
        print("\nSending test request to DeepSeek API...")

        result = await client.generate(
            prompt="Say 'Hello, API test successful!' in exactly those words.",
            max_tokens=50,
            temperature=0.1,
        )

        print("\n[SUCCESS] API Response:")
        print(f"  Content: {result['content']}")
        print(f"  Tokens used: {result['tokens_used']}")
        print(f"  Input tokens: {result['input_tokens']}")
        print(f"  Output tokens: {result['output_tokens']}")
        print(f"  Model: {result['model']}")
        print(f"  Latency: {result['latency_ms']}ms")

    except DeepSeekError as e:
        print(f"\n[FAILED] DeepSeek Error:")
        print(f"  Message: {e}")
        print(f"  Code: {e.code}")
        if e.retry_after:
            print(f"  Retry after: {e.retry_after}s")

    except Exception as e:
        print(f"\n[ERROR] Unexpected error: {type(e).__name__}: {e}")

    finally:
        await client.close()

    print("\n" + "=" * 60)


async def test_explain_with_cache():
    """Test the optimized explain capability with caching."""
    print("\n" + "=" * 60)
    print("TESTING OPTIMIZED EXPLAIN (with caching)")
    print("=" * 60)

    client = DeepSeekClient()
    cache = get_explain_cache()

    # Sample metrics (same for both calls to test caching)
    test_metrics = {
        "overall_score": 0.42,
        "confidence": 0.85,
        "dominant_emotion": "optimism",
        "emotion_distribution": {
            "optimism": 0.45,
            "joy": 0.25,
            "neutral": 0.20,
            "fear": 0.10,
        },
        "trend_direction": "up",
        "sample_size": 1250,
        "source_breakdown": {
            "twitter": 0.60,
            "reddit": 0.25,
            "news": 0.15,
        },
    }

    try:
        # =====================================================================
        # FIRST CALL - should be cache MISS
        # =====================================================================
        print("\n--- First Call (expect cache MISS) ---")

        result1 = await client.explain(
            asset_symbol="AAPL",
            asset_name="Apple Inc.",
            metrics=test_metrics,
            timeframe="24h",
        )

        print(f"\n[RESULT 1]")
        print(f"  Cached: {result1.get('cached', False)}")
        print(f"  Content:\n  {result1['content']}")
        print(f"  Tokens: {result1.get('tokens_used', 'N/A')}")

        # =====================================================================
        # SECOND CALL - should be cache HIT
        # =====================================================================
        print("\n--- Second Call (expect cache HIT) ---")

        result2 = await client.explain(
            asset_symbol="AAPL",
            asset_name="Apple Inc.",
            metrics=test_metrics,
            timeframe="24h",
        )

        print(f"\n[RESULT 2]")
        print(f"  Cached: {result2.get('cached', False)}")
        print(f"  Cache age: {result2.get('cache_age_seconds', 'N/A')}s")
        print(f"  Content:\n  {result2['content']}")

        # =====================================================================
        # THIRD CALL with different ticker - should be cache MISS
        # =====================================================================
        print("\n--- Third Call (different ticker, expect cache MISS) ---")

        result3 = await client.explain(
            asset_symbol="MSFT",
            asset_name="Microsoft Corporation",
            metrics={
                "overall_score": -0.15,
                "confidence": 0.72,
                "dominant_emotion": "fear",
                "emotion_distribution": {
                    "fear": 0.40,
                    "neutral": 0.35,
                    "optimism": 0.25,
                },
                "trend_direction": "down",
                "sample_size": 890,
            },
            timeframe="24h",
        )

        print(f"\n[RESULT 3]")
        print(f"  Cached: {result3.get('cached', False)}")
        print(f"  Content:\n  {result3['content']}")
        print(f"  Tokens: {result3.get('tokens_used', 'N/A')}")

        # =====================================================================
        # CACHE STATS
        # =====================================================================
        print("\n--- Cache Statistics ---")
        stats = cache.get_stats()
        print(f"  Hits: {stats['hits']}")
        print(f"  Misses: {stats['misses']}")
        print(f"  Hit ratio: {stats['hit_ratio']}")
        print(f"  Cache size: {stats['size']}")
        print(f"  TTL: {stats['ttl_seconds']}s")

    except DeepSeekError as e:
        print(f"\n[FAILED] DeepSeek Error: {e} (code: {e.code})")

    except Exception as e:
        print(f"\n[ERROR] {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()

    finally:
        await client.close()


async def main():
    """Run all API tests."""
    await test_deepseek_api()
    await test_explain_with_cache()

    print("\n" + "=" * 60)
    print("ALL TESTS COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
