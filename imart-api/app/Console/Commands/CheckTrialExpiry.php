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
        $expiredStores = Store::where('status', 'active')
            ->where('trial_ends_at', '<', now())
            ->whereNull('subscribed_until') // Assume they aren't on a paid plan
            ->get();

        foreach ($expiredStores as $store) {
            $store->update(['status' => 'suspended']);
            
            // Log the action for audit trails
            Log::info("Store [{$store->name}] was suspended due to trial expiry.");
            
            // Optionally: Dispatch notification to owner
        }

        $this->info(count($expiredStores) . " stores have been suspended.");
    }
}
