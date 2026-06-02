<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that a user can place a successful order and stock is deducted.
     */
    public function test_user_can_place_order_successfully()
    {
        // 1. Setup Data
        $user = User::factory()->create(['role' => 'customer']);
        $store = Store::factory()->create(['status' => 'active']);
        $product = Product::factory()->create([
            'store_id' => $store->id,
            'price' => 100,
            'stock' => 10
        ]);

        Sanctum::actingAs($user);

        // 2. Execute Action
        $response = $this->postJson('/api/v1/checkout/place-order', [
            'items' => [
                ['id' => $product->id, 'quantity' => 2]
            ]
        ]);

        // 3. Assertions
        $response->assertStatus(201)
                 ->assertJsonPath('status', 'success');

        $this->assertDatabaseHas('orders', ['user_id' => $user->id]);
        $this->assertEquals(8, $product->fresh()->stock); // Stock deducted
    }

    /**
     * Test that checkout fails if stock is insufficient.
     */
    public function test_checkout_fails_on_insufficient_stock()
    {
        $user = User::factory()->create(['role' => 'customer']);
        $store = Store::factory()->create(['status' => 'active']);
        $product = Product::factory()->create([
            'store_id' => $store->id,
            'stock' => 1
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/checkout/place-order', [
            'items' => [
                ['id' => $product->id, 'quantity' => 5]
            ]
        ]);

        $response->assertStatus(500); // Or your specific error code
        $this->assertEquals(1, $product->fresh()->stock); // Stock NOT deducted
    }
}
