<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SubscriptionPlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            ['name' => 'Monthly',  'price' => 299,  'duration_days' => 30],
            ['name' => 'Yearly',   'price' => 3000, 'duration_days' => 365],
            ['name' => 'Two-Year', 'price' => 5500, 'duration_days' => 730],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::updateOrCreate(
                ['name' => $plan['name']],
                $plan
            );
        }

        $this->command->info('✅ Subscription plans seeded: Monthly ₹299 | Yearly ₹3000 | Two-Year ₹5500');
    }
}
