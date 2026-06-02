<?php

namespace App\Services;

use App\Jobs\SendSubscriptionReceipt;
use App\Models\Payment;
use App\Models\Store;
use App\Models\Subscription;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StripeWebhookService
{
    /**
     * Handles invoice.payment_succeeded event.
     *
     * All DB writes are wrapped in a DB::transaction() with 3 retries.
     * lockForUpdate() prevents race conditions when two webhook deliveries
     * arrive simultaneously for the same subscription.
     */
    public function handlePaymentSucceeded(array $payload): void
    {
        $stripeSubscriptionId = $payload['data']['object']['subscription'] ?? null;
        $stripePaymentId      = $payload['data']['object']['payment_intent'] ?? null;
        $amountPaid           = ($payload['data']['object']['amount_paid'] ?? 0) / 100; // Convert paise → rupees

        // Atomic transaction: all or nothing. If any step fails, everything rolls back.
        DB::transaction(function () use ($stripeSubscriptionId, $stripePaymentId, $amountPaid) {
            // lockForUpdate() prevents two simultaneous webhook deliveries
            // from both reading "trialing" and both trying to activate the subscription.
            $subscription = Subscription::where('stripe_subscription_id', $stripeSubscriptionId)
                ->lockForUpdate()
                ->firstOrFail();

            // Calculate subscription end date based on the plan duration
            $endsAt = now()->addDays($subscription->plan->duration_days);

            // Step 1: Activate subscription
            $subscription->update([
                'status'  => 'active',
                'ends_at' => $endsAt,
            ]);

            // Step 2: Create payment record
            Payment::create([
                'store_id'         => $subscription->store_id,
                'subscription_id'  => $subscription->id,
                'stripe_payment_id'=> $stripePaymentId,
                'amount'           => $amountPaid,
                'status'           => 'success',
                'paid_at'          => now(),
            ]);

            // Step 3: Activate the store
            Store::where('id', $subscription->store_id)->update(['status' => 'active']);

        }, 3); // Retry up to 3 times on deadlock

        // AFTER the transaction commits successfully, dispatch the email job.
        // This is outside the transaction so a slow email job can't hold DB locks.
        $subscription = Subscription::where('stripe_subscription_id', $stripeSubscriptionId)->first();
        if ($subscription) {
            SendSubscriptionReceipt::dispatch($subscription)->onQueue('default');
        }
    }

    /**
     * Handles customer.subscription.deleted event — suspends the store.
     */
    public function handleSubscriptionDeleted(array $payload): void
    {
        $stripeSubscriptionId = $payload['data']['object']['id'] ?? null;

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
