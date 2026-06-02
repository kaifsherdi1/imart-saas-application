<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    /**
     * POST /api/v1/checkout/place-order
     * Converts cart items into a database order.
     */
    public function placeOrder(Request $request): JsonResponse
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|uuid|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'customer_name' => 'required|string',
            'email' => 'required|email',
            'phone_1' => 'required|string',
            'phone_2' => 'nullable|string',
            'shipping_address' => 'required|string',
            'pincode' => 'required|string',
            'landmark' => 'nullable|string',
            'payment_method' => 'required|string|in:cod,upi,card,wallet',
        ]);

        // If user is authenticated, use their ID, otherwise null for guest
        $userId = auth('sanctum')->check() ? auth('sanctum')->id() : null;
        $cartItems = $request->items;
        $checkoutData = $request->only(['customer_name', 'email', 'phone_1', 'phone_2', 'shipping_address', 'pincode', 'landmark', 'payment_method']);

        if ($checkoutData['payment_method'] === 'wallet' && !$userId) {
            return response()->json(['status' => 'error', 'message' => 'Login required to use iMart Wallet.'], 401);
        }

        return DB::transaction(function () use ($userId, $cartItems, $checkoutData) {
            $totalAmount = 0;
            
            // 1. Create the parent Order
            // Note: Since cart items could be from different stores, a real SaaS would split orders by store.
            // For now, we use the store_id of the first product.
            $firstProduct = Product::find($cartItems[0]['id']);
            
            $order = Order::create(array_merge([
                'id' => Str::uuid(),
                'user_id' => $userId,
                'store_id' => $firstProduct->store_id,
                'status' => 'pending',
                'total_amount' => 0, // Will update shortly
            ], $checkoutData));

            foreach ($cartItems as $item) {
                $product = Product::lockForUpdate()->find($item['id']);
                
                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Insufficient stock for {$product->name}");
                }

                $itemTotal = $product->price * $item['quantity'];
                $totalAmount += $itemTotal;

                // 2. Create Order Item
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price_at_purchase' => $product->price,
                ]);

                // 3. Deduct Stock
                $product->decrement('stock', $item['quantity']);
            }

            // 4. Update final total
            $order->update(['total_amount' => $totalAmount]);

            if ($checkoutData['payment_method'] === 'wallet') {
                $user = \App\Models\User::lockForUpdate()->find($userId);
                if ($user->wallet_balance < $totalAmount) {
                    throw new \Exception("Insufficient iMart Wallet balance.");
                }
                $user->decrement('wallet_balance', $totalAmount);
            }

            return response()->json([
                'status' => 'success',
                'code' => 201,
                'message' => 'Order placed successfully.',
                'data' => [
                    'order_id' => $order->id,
                    'total' => $totalAmount
                ]
            ], 201);
        });
    }
}
}
