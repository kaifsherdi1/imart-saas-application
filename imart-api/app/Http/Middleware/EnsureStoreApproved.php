<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureStoreApproved
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $store = $request->user()?->store;

        if ($store && $store->status === 'active') {
            return $next($request);
        }

        return response()->json([
            'message' => 'Your store is pending admin approval.'
        ], 403);
    }
}
