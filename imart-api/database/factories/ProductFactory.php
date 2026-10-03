<?php

namespace Database\Factories;

use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'store_id' => Store::factory(),
            'name' => $name,
            'slug' => Str::slug($name) . '-' . Str::lower(Str::random(5)),
            'description' => fake()->sentence(),
            'price' => fake()->randomFloat(2, 10, 1000),
            'stock' => 50,
            'category' => 'Electronics',
        ];
    }
}
