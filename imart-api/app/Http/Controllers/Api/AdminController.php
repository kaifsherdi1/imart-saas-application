<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminController extends Controller
{
    /** Document columns an admin may download, keyed by the public name. */
    private const DOCUMENTS = [
        'business_proof'      => 'business_proof_url',
        'owner_id_proof'      => 'owner_id_proof_url',
        'shop_front_photo'    => 'shop_front_photo_url',
        'shop_interior_photo' => 'shop_interior_photo_url',
    ];

    /**
     * List all stores (optionally filtered by status).
     */
    public function stores(Request $request): JsonResponse
    {
        $request->validate(['status' => 'nullable|in:pending,active,suspended,rejected']);

        $stores = Store::with('user:id,name,email,mobile')
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $stores
        ]);
    }

    /**
     * List all pending stores for approval.
     */
    public function pendingStores(): JsonResponse
    {
        $stores = Store::where('status', 'pending')
            ->with('user:id,name,email,mobile')
            ->latest()
            ->get();

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
     * Reject a pending store application.
     */
    public function rejectStore(string $storeId): JsonResponse
    {
        $store = Store::where('status', 'pending')->findOrFail($storeId);
        $store->update(['status' => 'rejected']);

        return response()->json([
            'status' => 'success',
            'message' => "Store '{$store->name}' has been rejected."
        ]);
    }

    /**
     * Download a KYC document uploaded during store registration.
     */
    public function storeDocument(string $storeId, string $document): StreamedResponse
    {
        abort_unless(isset(self::DOCUMENTS[$document]), 404);

        $store = Store::findOrFail($storeId);
        $path = $store->getAttribute(self::DOCUMENTS[$document]);

        abort_unless($path && Storage::disk('local')->exists($path), 404);

        return Storage::disk('local')->download($path);
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
                'total_revenue' => (float) Order::where('status', '!=', 'cancelled')->sum('total_amount'),
            ]
        ]);
    }
}
