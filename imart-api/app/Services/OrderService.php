<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class OrderService
{
    /**
     * Returns earnings for a store grouped by today, this_month, this_year, all_time.
     * Results are cached for 300 seconds (5 minutes) per store.
     * Cache key is scoped to the store: imart:earnings:{store_id}
     */
    public function getOwnerEarnings(string $storeId): array
    {
        $cacheKey = "imart:earnings:{$storeId}";

        return Cache::remember($cacheKey, 300, function () use ($storeId) {
            $base = Order::where('store_id', $storeId)->where('status', 'delivered');

            return [
                'today'      => (clone $base)->whereDate('created_at', today())->sum('total_amount'),
                'this_month' => (clone $base)->whereMonth('created_at', now()->month)
                                              ->whereYear('created_at', now()->year)
                                              ->sum('total_amount'),
                'this_year'  => (clone $base)->whereYear('created_at', now()->year)->sum('total_amount'),
                'all_time'   => (clone $base)->sum('total_amount'),
            ];
        });
    }

    /**
     * Returns paginated order history for a customer with items and product names.
     * Uses eager loading to prevent N+1 queries.
     */
    public function getCustomerOrders(string $userId, int $perPage = 15): LengthAwarePaginator
    {
        return Order::where('user_id', $userId)
            ->with(['items.product', 'store'])
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Returns paginated orders received by a store.
     */
    public function getStoreOrders(string $storeId, int $perPage = 15): LengthAwarePaginator
    {
        return Order::where('store_id', $storeId)
            ->with(['items.product', 'user:id,name,email'])
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Allows a store owner to update the status of one of their own orders.
     */
    public function updateOrderStatus(string $storeId, string $orderId, string $status): Order
    {
        $allowed = ['processing', 'shipped', 'delivered', 'cancelled'];

        abort_unless(in_array($status, $allowed), 422, 'Invalid order status.');

        $order = Order::where('store_id', $storeId)->findOrFail($orderId);
        $order->update(['status' => $status]);

        // Bust the earnings cache so the dashboard shows fresh data
        Cache::forget("imart:earnings:{$order->store_id}");

        return $order;
    }

    /**
     * Get sales data for the last 30 days grouped by date.
     */
    public function getDailySalesTrend(string $storeId): array
    {
        return OrderItem::whereHas('product', fn($q) => $q->withTrashed()->where('store_id', $storeId))
            ->where('created_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, SUM(price_at_purchase * quantity) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();
    }
}
