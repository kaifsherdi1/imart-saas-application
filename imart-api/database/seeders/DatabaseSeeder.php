<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Subscription Plans
        $this->call(SubscriptionPlanSeeder::class);

        // 2. Create the platform admin. In production the credentials must
        //    come from the environment — never a hard-coded default password.
        $adminEmail = env('ADMIN_EMAIL', 'admin@imart.com');
        $adminPassword = env('ADMIN_PASSWORD');

        if (!$adminPassword) {
            if (app()->isProduction()) {
                throw new \RuntimeException('Set ADMIN_PASSWORD in the environment before seeding production.');
            }
            $adminPassword = 'password';
        }

        if (!User::where('email', $adminEmail)->exists()) {
            User::forceCreate([
                'name' => 'iMart Admin',
                'email' => $adminEmail,
                'password' => $adminPassword,
                'role' => UserRole::ADMIN,
                'email_verified_at' => now(),
            ]);
        }

        // 3. Demo stores and products are for local/staging environments only.
        if (!app()->isProduction()) {
            $this->call(RealDataSeeder::class);
        }
    }
}
