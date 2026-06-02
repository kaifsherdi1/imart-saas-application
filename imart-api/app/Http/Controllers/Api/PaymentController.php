<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class PaymentController extends Controller
{
    /**
     * POST /api/v1/payments/checkout
     * Creates a Stripe Checkout Session for a store subscription.
     */
    public function createCheckoutSession(Request $request): JsonResponse
    {
        $request->validate(['plan_id' => 'required|uuid|exists:subscription_plans,id']);

        $plan = SubscriptionPlan::findOrFail($request->plan_id);
        $user = $request->user();
        $store = $user->store;

        if (!$store) {
            return response()->json(['status' => 'error', 'message' => 'User does not have a store.'], 403);
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'inr',
                        'product_data' => [
                            'name' => "iMart {$plan->name} Subscription",
                            'description' => "Activation for store: {$store->name}",
                        ],
                        'unit_amount' => $plan->price * 100, // Stripe expects amount in paise
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => config('app.frontend_url') . '/dashboard?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => config('app.frontend_url') . '/dashboard/billing',
                'customer_email' => $user->email,
                'metadata' => [
                    'store_id' => $store->id,
                    'plan_id' => $plan->id,
                ],
            ]);

            return response()->json([
                'status' => 'success',
                'code' => 200,
                'data' => [
                    'checkout_url' => $session->url,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * GET /api/v1/payments/plans
     * Returns all available subscription plans.
     */
    public function getPlans(): JsonResponse
    {
        $plans = SubscriptionPlan::orderBy('price')->get();

        return response()->json([
            'status' => 'success',
            'code' => 200,
            'data' => $plans,
        ]);
    }
}
