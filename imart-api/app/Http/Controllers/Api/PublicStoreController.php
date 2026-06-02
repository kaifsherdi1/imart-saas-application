<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicStoreController extends Controller
{
    /**
     * GET /api/v1/stores
     * Returns a list of all active stores.
     */
    public function index(): JsonResponse
    {
        $stores = Store::where('status', 'active')
            ->withCount('products')
            ->get();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'data' => $stores
        ]);
    }

    /**
     * GET /api/v1/public/stores/{slug}
     * Returns public information about a store and its products.
     */
    public function show(string $slug): JsonResponse
    {
        $store = Store::where('slug', $slug)
            ->where('status', 'active')
            ->with(['products' => function($query) {
                $query->whereNull('deleted_at');
            }])
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'data' => [
                'id' => $store->id,
                'name' => $store->name,
                'business_category' => $store->business_category,
                'avg_rating' => $store->avg_rating,
                'products' => $store->products,
            ]
        ]);
    }
}
