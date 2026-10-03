<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\JsonResponse;

class PublicStoreController extends Controller
{
    /** Columns that are safe to expose publicly. */
    private const PUBLIC_COLUMNS = [
        'id', 'name', 'slug', 'category', 'business_type', 'avg_rating',
        'city', 'state', 'shop_front_photo_url', 'created_at',
    ];

    /**
     * GET /api/v1/stores
     * Returns a list of all active stores.
     */
    public function index(): JsonResponse
    {
        $stores = Store::where('status', 'active')
            ->select(self::PUBLIC_COLUMNS)
            ->withCount('products')
            ->orderByDesc('avg_rating')
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
            ->with('products')
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'data' => [
                'id' => $store->id,
                'name' => $store->name,
                'slug' => $store->slug,
                'business_category' => $store->category ?? $store->business_type,
                'avg_rating' => $store->avg_rating,
                'city' => $store->city,
                'state' => $store->state,
                'products' => $store->products,
            ]
        ]);
    }
}
