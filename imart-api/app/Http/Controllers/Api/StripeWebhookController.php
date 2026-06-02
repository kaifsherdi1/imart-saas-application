<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\StripeWebhookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function __construct(private readonly StripeWebhookService $webhookService) {}

    /**
     * Entry point for all Stripe webhook events.
     * Signature is verified BEFORE any business logic runs.
     */
    public function handle(Request $request): JsonResponse
    {
        $payload   = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret    = config('services.stripe.webhook_secret');

        // Verify the Stripe signature to ensure the request is authentic.
        // Returning 400 tells Stripe to retry the webhook delivery.
        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (SignatureVerificationException $e) {
            return response()->json(['status' => 'error', 'message' => 'Invalid signature.'], 400);
        }

        $payloadArray = json_decode($payload, true);

        match ($event->type) {
            'invoice.payment_succeeded'       => $this->webhookService->handlePaymentSucceeded($payloadArray),
            'customer.subscription.deleted'   => $this->webhookService->handleSubscriptionDeleted($payloadArray),
            default                           => null, // Ignore unhandled events
        };

        return response()->json(['status' => 'success', 'code' => 200, 'message' => 'Webhook received.']);
    }
}
