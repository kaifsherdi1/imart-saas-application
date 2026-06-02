<?php

namespace App\Services;

use App\Models\Store;
use Illuminate\Support\Facades\Cache;

class StoreRankingService
{
    private const CACHE_KEY = 'imart:top_stores';
    private const CACHE_TTL = 3600; // 1 hour

    /**
     * Returns the top 20 ranked stores by avg_rating.
     *
     * Caching Strategy:
     * - On homepage load, we first check Redis for `imart:top_stores`.
     * - If the key EXISTS, we return cached data instantly — zero DB queries.
     * - If the key DOES NOT EXIST (first load or cache busted), we hit PostgreSQL,
     *   fetch the top 20 stores with eager-loaded reviews and products, then
     *   store the result in Redis for 3600 seconds (1 hour).
     * - The StoreObserver busts this cache whenever avg_rating changes.
     *
     * Without caching: 10,000 concurrent users = 10,000 DB queries per second.
     * With caching: 10,000 concurrent users = 1 DB query per hour.
     */
    public function getTopRankedStores(): mixed
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return Store::with(['reviews', 'products'])
                ->where('status', 'active')
                ->orderByDesc('avg_rating')
                ->limit(20)
                ->get();
        });
    }

    /** Manually bust the cache — also called by StoreObserver. */
    public function bustCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}
