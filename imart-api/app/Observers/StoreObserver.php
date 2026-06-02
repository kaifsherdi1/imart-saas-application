<?php

namespace App\Observers;

use App\Models\Store;
use Illuminate\Support\Facades\Cache;

/**
 * StoreObserver — implements Event-Driven cache invalidation.
 *
 * The Problem: Redis caches the Top Stores list for 1 hour (TTL=3600).
 * Without this observer, if Store A gets a new review and its avg_rating
 * jumps from 3.5 to 4.8, the homepage would still show the OLD ranking
 * for up to 1 hour — terrible UX.
 *
 * The Solution: Whenever the Store model's avg_rating is "dirty" (changed),
 * this observer immediately deletes the stale Redis key. The NEXT request
 * will miss the cache, re-query PostgreSQL, and cache the fresh ranking.
 * This keeps the cache always accurate without relying on a timer alone.
 */
class StoreObserver
{
    public function updated(Store $store): void
    {
        // isDirty() checks if a column has changed in the current request.
        // We only bust the cache if avg_rating actually changed — not on
        // every store update (e.g. name edits shouldn't bust the ranking cache).
        if ($store->isDirty('avg_rating')) {
            Cache::forget('imart:top_stores');
        }
    }
}
