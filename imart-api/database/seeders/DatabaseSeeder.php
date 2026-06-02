<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Store;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Subscription Plans
        $this->call(SubscriptionPlanSeeder::class);

        // 2. Create Admin
        User::create([
            'id' => Str::uuid(),
            'name' => 'iMart Admin',
            'email' => 'admin@imart.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // 3. Run Real Data Seeder (6 Stores + Products)
        $this->call(RealDataSeeder::class);
    }
}
