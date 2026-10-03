<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Store>
 */
class StoreFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->company();

        return [
            'user_id' => User::factory()->state(['role' => UserRole::OWNER]),
            'name' => $name,
            'slug' => Str::slug($name) . '-' . Str::lower(Str::random(5)),
            'status' => 'active',
            'category' => 'Electronics',
            'city' => fake()->city(),
            'state' => fake()->state(),
        ];
    }
}
