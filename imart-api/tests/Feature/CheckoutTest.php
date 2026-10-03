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

    private function checkoutPayload(array $items, string $paymentMethod = 'cod'): array
    {
        return [
            'items' => $items,
            'customer_name' => 'Test Customer',
            'email' => 'customer@example.com',
            'phone_1' => '9999999999',
            'shipping_address' => '1 Test Street',
            'pincode' => '400001',
            'payment_method' => $paymentMethod,
        ];
    }

    /**
     * Test that a user can place a successful order and stock is deducted.
     */
    public function test_user_can_place_order_successfully()
    {
        $user = User::factory()->create(['role' => 'customer']);
        $store = Store::factory()->create(['status' => 'active']);
        $product = Product::factory()->create([
            'store_id' => $store->id,
            'price' => 100,
            'stock' => 10
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/checkout/place-order', $this->checkoutPayload([
            ['id' => $product->id, 'quantity' => 2],
        ]));

        $response->assertStatus(201)
                 ->assertJsonPath('status', 'success')
                 ->assertJsonPath('data.total', 200);

        $this->assertDatabaseHas('orders', ['user_id' => $user->id, 'store_id' => $store->id]);
        $this->assertEquals(8, $product->fresh()->stock);
    }

    /**
     * A cart spanning two stores produces one order per store.
     */
    public function test_multi_store_cart_is_split_per_store()
    {
        $productA = Product::factory()->create(['price' => 50, 'stock' => 5]);
        $productB = Product::factory()->create(['price' => 70, 'stock' => 5]);

        $response = $this->postJson('/api/v1/checkout/place-order', $this->checkoutPayload([
            ['id' => $productA->id, 'quantity' => 1],
            ['id' => $productB->id, 'quantity' => 1],
        ]));

        $response->assertStatus(201)->assertJsonCount(2, 'data.order_ids');
        $this->assertDatabaseHas('orders', ['store_id' => $productA->store_id, 'total_amount' => 50]);
        $this->assertDatabaseHas('orders', ['store_id' => $productB->store_id, 'total_amount' => 70]);
    }

    /**
     * Test that checkout fails if stock is insufficient.
     */
    public function test_checkout_fails_on_insufficient_stock()
    {
        $user = User::factory()->create(['role' => 'customer']);
        $product = Product::factory()->create(['stock' => 1]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/checkout/place-order', $this->checkoutPayload([
            ['id' => $product->id, 'quantity' => 5],
        ]));

        $response->assertStatus(422)->assertJsonValidationErrors('items');
        $this->assertEquals(1, $product->fresh()->stock);
        $this->assertDatabaseCount('orders', 0);
    }

    public function test_products_of_inactive_stores_cannot_be_ordered()
    {
        $store = Store::factory()->create(['status' => 'suspended']);
        $product = Product::factory()->create(['store_id' => $store->id]);

        $this->postJson('/api/v1/checkout/place-order', $this->checkoutPayload([
            ['id' => $product->id, 'quantity' => 1],
        ]))->assertStatus(422);
    }
}
