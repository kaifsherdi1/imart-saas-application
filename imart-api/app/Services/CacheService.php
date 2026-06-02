<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

/**
 * CacheService — a thin wrapper around Laravel's Cache facade.
 *
 * Centralises all cache operations so the TTL, key naming, and
 * tag-flush logic live in one place rather than scattered across services.
 */
class CacheService
{
    /**
     * Retrieve an item from cache, or store the result of a callback.
     *
     * @param string   $key      Redis key
     * @param int      $ttl      Time-to-live in seconds
     * @param callable $callback Data source if cache miss
     */
    public function remember(string $key, int $ttl, callable $callback): mixed
    {
        return Cache::remember($key, $ttl, $callback);
    }

    /**
     * Delete a single cache key (used for targeted cache busting).
     */
    public function forget(string $key): bool
    {
        return Cache::forget($key);
    }

    /**
     * Flush all cache entries associated with a given tag group.
     * Useful for busting e.g. all "store" related cache at once.
     *
     * NOTE: Tag-based flushing requires a Redis or Memcached driver.
     */
    public function tags(array $tags): \Illuminate\Cache\TaggedCache
    {
        return Cache::tags($tags);
    }
}
