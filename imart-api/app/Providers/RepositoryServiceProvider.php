<?php

namespace App\Providers;

use App\Repositories\ProductRepositoryInterface;
use App\Repositories\EloquentProductRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(ProductRepositoryInterface::class, EloquentProductRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
