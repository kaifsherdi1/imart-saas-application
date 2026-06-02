<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\AlreadyReviewedException;
use App\Exceptions\UnverifiedPurchaseException;
use App\Http\Controllers\Controller;
use App\Services\OrderService;
use App\Services\ReviewService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(
        private readonly OrderService  $orderService,
        private readonly ReviewService $reviewService,
    ) {}

    /** GET /api/v1/dashboard/earnings — Owner earnings analytics */
    public function earnings(Request $request): JsonResponse
    {
        $storeId  = $request->user()->store->id;
        $earnings = $this->orderService->getOwnerEarnings($storeId);
        $trend    = $this->orderService->getDailySalesTrend($storeId);

        return response()->json([
            'status'  => 'success',
            'code'    => 200,
            'message' => 'Earnings and trends fetched successfully.',
            'data'    => [
                'stats' => $earnings,
                'trend' => $trend
            ],
        ]);
    }

    /** GET /api/v1/orders — Customer order history */
    public function myOrders(Request $request): JsonResponse
    {
        $orders = $this->orderService->getCustomerOrders($request->user()->id);

        return response()->json([
            'status'  => 'success',
            'code'    => 200,
            'message' => 'Orders fetched successfully.',
            'data'    => $orders,
        ]);
    }

    /** PATCH /api/v1/orders/{orderId}/status — Owner updates order status */
    public function updateStatus(Request $request, string $orderId): JsonResponse
    {
        $request->validate(['status' => 'required|string|in:processing,shipped,delivered,cancelled']);

        $order = $this->orderService->updateOrderStatus($orderId, $request->status);

        return response()->json([
            'status'  => 'success',
            'code'    => 200,
            'message' => "Order status updated to {$order->status}.",
            'data'    => $order,
        ]);
    }

    /** POST /api/v1/reviews — Submit a verified review */
    public function storeReview(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'reviewable_id'   => 'required|uuid',
            'reviewable_type' => 'required|in:App\\Models\\Store,App\\Models\\Product',
            'rating'          => 'required|integer|min:1|max:5',
            'comment'         => 'nullable|string|max:1000',
        ]);

        try {
            $review = $this->reviewService->store(
                userId:         $request->user()->id,
                reviewableId:   $validated['reviewable_id'],
                reviewableType: $validated['reviewable_type'],
                rating:         $validated['rating'],
                comment:        $validated['comment'] ?? null,
            );

            return response()->json([
                'status'  => 'success',
                'code'    => 201,
                'message' => 'Review submitted successfully.',
                'data'    => $review,
            ], 201);

        } catch (AlreadyReviewedException | UnverifiedPurchaseException $e) {
            return response()->json([
                'status'  => 'error',
                'code'    => $e->getCode(),
                'message' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}
