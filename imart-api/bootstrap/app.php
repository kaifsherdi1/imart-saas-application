<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Behind a load balancer / PaaS router: trust forwarded headers so
        // rate limiting and URLs use the real client IP and scheme.
        $middleware->trustProxies(at: '*');

        // Apply the "api" rate limiter (defined in AppServiceProvider).
        $middleware->throttleApi();

        // Register custom middleware aliases
        $middleware->alias([
            'role.admin'     => \App\Http\Middleware\EnsureIsAdmin::class,
            'role.owner'     => \App\Http\Middleware\EnsureIsOwner::class,
            'store.approved' => \App\Http\Middleware\EnsureStoreApproved::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // The API is consumed by the SPA only: always answer with JSON.
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson()
        );
    })->create();
