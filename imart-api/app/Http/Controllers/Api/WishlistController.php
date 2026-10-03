<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class WishlistController extends Controller
{
    /**
     * Get all wishlisted products for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $wishlist = Wishlist::where('user_id', $request->user()->id)
            ->with('product.store')
            ->get()
            ->map(fn($item) => $item->product)
            ->filter()
            ->values();

        return response()->json([
            'status' => 'success',
            'data' => $wishlist
        ]);
    }

    /**
     * Toggle a product in the wishlist.
     */
    public function toggle(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|uuid|exists:products,id'
        ]);

        $userId = $request->user()->id;
        $productId = $request->product_id;

        $wishlist = Wishlist::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($wishlist) {
            $wishlist->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Removed from wishlist',
                'is_wishlisted' => false
            ]);
        } else {
            Wishlist::create([
                'user_id' => $userId,
                'product_id' => $productId
            ]);
            return response()->json([
                'status' => 'success',
                'message' => 'Added to wishlist',
                'is_wishlisted' => true
            ]);
        }
    }
}
