<?php

namespace App\Jobs;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

/**
 * Queued job: sends a professional subscription receipt email.
 *
 * Why a Queue?
 * Sending email can take 1–2 seconds. If we sent it synchronously inside the
 * webhook handler, Stripe would wait for our server and might retry the webhook
 * thinking it failed. By dispatching to a Redis queue we respond with 200 OK
 * instantly, and the email is sent asynchronously by a queue worker.
 */
class SendSubscriptionReceipt implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3; // Retry up to 3 times on failure

    public function __construct(public readonly Subscription $subscription) {}

    public function handle(): void
    {
        $subscription = $this->subscription->load(['plan', 'store.user']);
        $owner        = $subscription->store->user;

        // Build the email body
        $emailData = [
            'owner_name'      => $owner->name,
            'plan_name'       => $subscription->plan->name,
            'amount_paid'     => '₹' . number_format($subscription->plan->price, 2),
            'next_billing'    => $subscription->ends_at?->format('d M Y') ?? 'N/A',
            'store_name'      => $subscription->store->name,
        ];

        // Send a Markdown mail
        Mail::send(
            'emails.subscription_receipt',
            $emailData,
            fn($msg) => $msg->to($owner->email)
                            ->subject('iMart – Subscription Activated 🎉')
        );
    }
}
