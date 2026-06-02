<?php

namespace App\Jobs;

use App\Models\Store;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class CheckTrialExpiry implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Find stores that were approved 30+ days ago, are still 'active',
        // and have NO active subscription payment in the last 30 days.
        $expiryDate = Carbon::now()->subDays(30);

        $expiredStores = Store::where('status', 'active')
            ->where('created_at', '<=', $expiryDate)
            ->whereDoesntHave('subscription', function($query) {
                $query->where('status', 'active')
                      ->where('ends_at', '>', Carbon::now());
            })
            ->get();

        foreach ($expiredStores as $store) {
            $store->update(['status' => 'suspended']);
            
            // In a real app, we would notify the owner here
            Log::info("Store suspended due to trial expiry: {$store->name} ({$store->id})");
        }
    }
}
