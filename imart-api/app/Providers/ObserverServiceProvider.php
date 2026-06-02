<?php

namespace App\Providers;

use App\Models\Store;
use App\Observers\StoreObserver;
use Illuminate\Support\ServiceProvider;

class ObserverServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Store::observe(StoreObserver::class);
    }
}
