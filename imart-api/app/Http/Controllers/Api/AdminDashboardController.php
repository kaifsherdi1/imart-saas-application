<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    /**
     * GET /api/v1/admin/stats
     * Returns platform-wide financial and growth statistics.
     */
    public function stats(): JsonResponse
    {
        $totalRevenue = Payment::where('status', 'success')->sum('amount');
        $totalStores = Store::count();
        $activeStores = Store::where('status', 'active')->count();
        $totalUsers = User::count();

        // Recent platform sales (last 10)
        $recentPayments = Payment::with('store.user')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'data' => [
                'total_revenue' => $totalRevenue,
                'total_stores' => $totalStores,
                'active_stores' => $activeStores,
                'total_users' => $totalUsers,
                'recent_payments' => $recentPayments
            ]
        ]);
    }
}
