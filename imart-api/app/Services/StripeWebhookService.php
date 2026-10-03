<?php

namespace App\Services;

use App\Jobs\SendSubscriptionReceipt;
use App\Models\Payment;
use App\Models\Store;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StripeWebhookService
{
    /**
     * Handles checkout.session.completed — fired when a store owner pays for a
     * plan through PaymentController::createCheckoutSession (mode=payment).
     *
     * Idempotent: Stripe may deliver the same event more than once, so the
     * unique stripe_payment_id on payments is checked under a row lock.
     */
    public function handleCheckoutCompleted(array $payload): void
    {
        $session = $payload['data']['object'] ?? [];

        if (($session['payment_status'] ?? null) !== 'paid') {
            return;
        }

        $storeId   = $session['metadata']['store_id'] ?? null;
        $planId    = $session['metadata']['plan_id'] ?? null;
        $paymentId = $session['payment_intent'] ?? $session['id'] ?? null;

        if (!$storeId || !$planId || !$paymentId) {
            Log::warning('Stripe checkout session missing metadata', ['session' => $session['id'] ?? null]);
            return;
        }

        $subscription = DB::transaction(function () use ($session, $storeId, $planId, $paymentId) {
            $store = Store::lockForUpdate()->find($storeId);
            $plan  = SubscriptionPlan::find($planId);

            if (!$store || !$plan || Payment::where('stripe_payment_id', $paymentId)->exists()) {
                return null;
            }

            // Extend from the current paid period if one is still running.
            $current = $store->subscriptions()
                ->where('status', 'active')
                ->where('ends_at', '>', now())
                ->latest('ends_at')
                ->first();
            $startsFrom = $current?->ends_at ?? now();

            $subscription = Subscription::create([
                'store_id'           => $store->id,
                'plan_id'            => $plan->id,
                'stripe_customer_id' => $session['customer'] ?? null,
                'status'             => 'active',
                'ends_at'            => $startsFrom->copy()->addDays($plan->duration_days),
            ]);

            Payment::create([
                'store_id'          => $store->id,
                'subscription_id'   => $subscription->id,
                'stripe_payment_id' => $paymentId,
                'amount'            => ($session['amount_total'] ?? 0) / 100, // paise → rupees
                'status'            => 'success',
                'paid_at'           => now(),
            ]);

            // Reactivate a store that was suspended for an expired trial.
            if ($store->status === 'suspended') {
                $store->update(['status' => 'active']);
            }

            return $subscription;
        }, 3);

        // Dispatched after commit so a slow mailer can't hold DB locks.
        if ($subscription) {
            SendSubscriptionReceipt::dispatch($subscription);
        }
    }

    /**
     * Handles customer.subscription.deleted event — suspends the store.
     */
    public function handleSubscriptionDeleted(array $payload): void
    {
        $stripeSubscriptionId = $payload['data']['object']['id'] ?? null;

        if (!$stripeSubscriptionId) {
            return;
        }

        DB::transaction(function () use ($stripeSubscriptionId) {
            $subscription = Subscription::where('stripe_subscription_id', $stripeSubscriptionId)
                ->lockForUpdate()
                ->first();

            if ($subscription) {
                $subscription->update(['status' => 'cancelled']);
                Store::where('id', $subscription->store_id)->update(['status' => 'suspended']);
            }
        }, 3);
    }
}
