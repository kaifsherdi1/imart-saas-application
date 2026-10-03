<?php

namespace App\Console\Commands;

use App\Models\Store;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckTrialExpiry extends Command
{
    /**
     * The name and signature of the console command.
     * @var string
     */
    protected $signature = 'imart:check-trials';

    /**
     * The console command description.
     * @var string
     */
    protected $description = 'Automatically suspend stores whose trial periods have expired.';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        // Active stores whose trial is over and who have no paid plan still running.
        $expiredStores = Store::where('status', 'active')
            ->whereNotNull('trial_ends_at')
            ->where('trial_ends_at', '<', now())
            ->whereDoesntHave('subscriptions', fn($q) => $q->where('status', 'active')->where('ends_at', '>', now()))
            ->get();

        foreach ($expiredStores as $store) {
            $store->update(['status' => 'suspended']);

            // Log the action for audit trails
            Log::info("Store [{$store->name}] was suspended due to trial expiry.");
        }

        $this->info(count($expiredStores) . " stores have been suspended.");
    }
}
