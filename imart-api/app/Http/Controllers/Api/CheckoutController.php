<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CheckoutController extends Controller
{
    /**
     * POST /api/v1/checkout/place-order
     * Converts cart items into database orders — one order per store.
     */
    public function placeOrder(Request $request): JsonResponse
    {
        $request->validate([
            'items' => 'required|array|min:1|max:100',
            'items.*.id' => 'required|uuid|distinct|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1|max:1000',
            'customer_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone_1' => 'required|string|max:20',
            'phone_2' => 'nullable|string|max:20',
            'shipping_address' => 'required|string|max:1000',
            'pincode' => 'required|string|max:20',
            'landmark' => 'nullable|string|max:255',
            'payment_method' => 'required|string|in:cod,upi,card,wallet',
        ]);

        // If user is authenticated, use their ID, otherwise null for guest
        $userId = auth('sanctum')->id();
        $checkoutData = $request->only(['customer_name', 'email', 'phone_1', 'phone_2', 'shipping_address', 'pincode', 'landmark', 'payment_method']);

        if ($checkoutData['payment_method'] === 'wallet' && !$userId) {
            return response()->json(['status' => 'error', 'message' => 'Login required to use iMart Wallet.'], 401);
        }

        $quantities = collect($request->items)->pluck('quantity', 'id');

        $result = DB::transaction(function () use ($userId, $quantities, $checkoutData) {
            $products = Product::whereIn('id', $quantities->keys())
                ->whereHas('store', fn($q) => $q->where('status', 'active'))
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            foreach ($quantities as $productId => $quantity) {
                $product = $products->get($productId);

                if (!$product) {
                    throw ValidationException::withMessages([
                        'items' => 'One or more products are no longer available.',
                    ]);
                }
                if ($product->stock < $quantity) {
                    throw ValidationException::withMessages([
                        'items' => "Insufficient stock for {$product->name}.",
                    ]);
                }
            }

            $grandTotal = $products->sum(fn($p) => $p->price * $quantities[$p->id]);

            if ($checkoutData['payment_method'] === 'wallet') {
                $user = User::lockForUpdate()->find($userId);
                if ($user->wallet_balance < $grandTotal) {
                    throw ValidationException::withMessages([
                        'payment_method' => 'Insufficient iMart Wallet balance.',
                    ]);
                }
                $user->decrement('wallet_balance', $grandTotal);
            }

            // Each store fulfils its own order.
            $orders = $products->groupBy('store_id')->map(function ($storeProducts, $storeId) use ($userId, $quantities, $checkoutData) {
                $order = Order::create(array_merge([
                    'user_id' => $userId,
                    'store_id' => $storeId,
                    'status' => 'pending',
                    'total_amount' => $storeProducts->sum(fn($p) => $p->price * $quantities[$p->id]),
                ], $checkoutData));

                foreach ($storeProducts as $product) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'quantity' => $quantities[$product->id],
                        'price_at_purchase' => $product->price,
                    ]);

                    $product->decrement('stock', $quantities[$product->id]);
                }

                return $order;
            })->values();

            return ['orders' => $orders, 'total' => $grandTotal];
        });

        return response()->json([
            'status' => 'success',
            'code' => 201,
            'message' => 'Order placed successfully.',
            'data' => [
                'order_id' => $result['orders']->first()->id,
                'order_ids' => $result['orders']->pluck('id'),
                'total' => $result['total'],
            ]
        ], 201);
    }
}
