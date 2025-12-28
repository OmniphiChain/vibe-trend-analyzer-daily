// ============================================================================
// REDIS CLIENT CONFIGURATION
// Optional caching layer for sessions, rate limiting, and distributed cache
// ============================================================================
//
// If REDIS_URL is not set, falls back to in-memory storage.
// This allows the app to work without Redis in development.
// ============================================================================

import { createClient, type RedisClientType } from 'redis';

// Redis client singleton
let redisClient: RedisClientType | null = null;
let isConnected = false;

// Configuration
const REDIS_URL = process.env.REDIS_URL;
const REDIS_ENABLED = Boolean(REDIS_URL);

/**
 * Initialize Redis client if REDIS_URL is configured.
 * Falls back gracefully if Redis is unavailable.
 */
export async function initRedis(): Promise<boolean> {
  if (!REDIS_ENABLED) {
    console.log('📦 Redis not configured - using in-memory storage');
    return false;
  }

  try {
    redisClient = createClient({
      url: REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('❌ Redis max reconnection attempts reached');
            return new Error('Max reconnection attempts reached');
          }
          return Math.min(retries * 100, 3000);
        },
      },
    });

    redisClient.on('error', (err) => {
      console.error('Redis error:', err.message);
      isConnected = false;
    });

    redisClient.on('connect', () => {
      console.log('🔴 Redis connecting...');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis connected and ready');
      isConnected = true;
    });

    redisClient.on('end', () => {
      console.log('🔴 Redis connection closed');
      isConnected = false;
    });

    await redisClient.connect();
    return true;
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    redisClient = null;
    return false;
  }
}

/**
 * Get the Redis client (may be null if not configured)
 */
export function getRedisClient(): RedisClientType | null {
  return isConnected ? redisClient : null;
}

/**
 * Check if Redis is available
 */
export function isRedisAvailable(): boolean {
  return isConnected && redisClient !== null;
}

/**
 * Close Redis connection gracefully
 */
export async function closeRedis(): Promise<void> {
  if (redisClient && isConnected) {
    await redisClient.quit();
    redisClient = null;
    isConnected = false;
  }
}

// ============================================================================
// CACHE UTILITIES
// ============================================================================

/**
 * Get value from cache (Redis or in-memory fallback)
 */
export async function cacheGet(key: string): Promise<string | null> {
  if (!isConnected || !redisClient) {
    return inMemoryCache.get(key) || null;
  }

  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error('Redis GET error:', error);
    return inMemoryCache.get(key) || null;
  }
}

/**
 * Set value in cache (Redis or in-memory fallback)
 */
export async function cacheSet(
  key: string,
  value: string,
  ttlSeconds?: number
): Promise<boolean> {
  if (!isConnected || !redisClient) {
    inMemoryCache.set(key, value, ttlSeconds);
    return true;
  }

  try {
    if (ttlSeconds) {
      await redisClient.setEx(key, ttlSeconds, value);
    } else {
      await redisClient.set(key, value);
    }
    return true;
  } catch (error) {
    console.error('Redis SET error:', error);
    inMemoryCache.set(key, value, ttlSeconds);
    return true;
  }
}

/**
 * Delete value from cache
 */
export async function cacheDel(key: string): Promise<boolean> {
  if (!isConnected || !redisClient) {
    return inMemoryCache.delete(key);
  }

  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Redis DEL error:', error);
    return inMemoryCache.delete(key);
  }
}

// ============================================================================
// IN-MEMORY FALLBACK CACHE
// ============================================================================

interface CacheEntry {
  value: string;
  expiresAt: number | null;
}

class InMemoryCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize = 10000;

  get(key: string): string | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  set(key: string, value: string, ttlSeconds?: number): void {
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
    });
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const inMemoryCache = new InMemoryCache();

// ============================================================================
// RATE LIMITING HELPERS
// ============================================================================

/**
 * Increment rate limit counter
 */
export async function rateLimitIncr(
  key: string,
  windowSeconds: number
): Promise<number> {
  if (!isConnected || !redisClient) {
    // In-memory rate limiting fallback
    const current = parseInt(inMemoryCache.get(key) || '0', 10);
    const newValue = current + 1;
    inMemoryCache.set(key, newValue.toString(), windowSeconds);
    return newValue;
  }

  try {
    const multi = redisClient.multi();
    multi.incr(key);
    multi.expire(key, windowSeconds);
    const results = await multi.exec();
    return (results?.[0] as number) || 1;
  } catch (error) {
    console.error('Redis INCR error:', error);
    return 1;
  }
}

/**
 * Get remaining rate limit
 */
export async function rateLimitGet(key: string): Promise<number> {
  if (!isConnected || !redisClient) {
    return parseInt(inMemoryCache.get(key) || '0', 10);
  }

  try {
    const value = await redisClient.get(key);
    return parseInt(value || '0', 10);
  } catch (error) {
    console.error('Redis GET error:', error);
    return 0;
  }
}
