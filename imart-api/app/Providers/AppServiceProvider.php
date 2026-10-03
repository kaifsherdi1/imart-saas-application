<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Login, registration and password-reset endpoints: limited per IP and
        // per identifier so a single account cannot be brute-forced from many IPs.
        RateLimiter::for('auth', function (Request $request) {
            $tooMany = fn () => response()->json([
                'status'  => 'error',
                'code'    => 429,
                'message' => 'Too many attempts. Please wait before trying again.',
            ], 429);

            $identifier = strtolower((string) ($request->input('identifier') ?? $request->input('email')));

            return [
                Limit::perMinute(10)->by('ip:' . $request->ip())->response($tooMany),
                Limit::perMinute(5)->by('id:' . ($identifier ?: $request->ip()))->response($tooMany),
            ];
        });

        RateLimiter::for('checkout', function (Request $request) {
            return Limit::perMinute(10)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(120)->by($request->user()?->id ?: $request->ip())->response(function () {
                return response()->json([
                    'status'  => 'error',
                    'code'    => 429,
                    'message' => 'Too many attempts. Please wait before trying again.',
                ], 429);
            });
        });
    }
}
