<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * List all pending stores for approval.
     */
    public function pendingStores(): JsonResponse
    {
        $stores = Store::where('status', 'pending')->with('owner')->get();

        return response()->json([
            'status' => 'success',
            'data' => $stores
        ]);
    }

    /**
     * Approve a store and start their 30-day trial.
     */
    public function approveStore(string $storeId): JsonResponse
    {
        $store = Store::findOrFail($storeId);
        
        $store->update([
            'status' => 'active',
            'trial_ends_at' => now()->addDays(30)
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Store '{$store->name}' has been approved. Trial starts now."
        ]);
    }

    /**
     * Get global platform statistics.
     */
    public function platformStats(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'total_stores' => Store::count(),
                'active_stores' => Store::where('status', 'active')->count(),
                'pending_approvals' => Store::where('status', 'pending')->count(),
                'total_revenue' => \App\Models\OrderItem::sum('price_at_purchase') // Very simple stat
            ]
        ]);
    }
}
