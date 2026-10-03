<?php

namespace Tests\Feature;

use App\Mail\PasswordResetOtp;
use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_register_and_login_without_leaking_password()
    {
        $this->postJson('/api/v1/register', [
            'name' => 'Jane',
            'email' => 'jane@example.com',
            'password' => 'secret-pass-1',
            'password_confirmation' => 'secret-pass-1',
            'role' => 'admin', // must be ignored
        ])->assertCreated()
          ->assertJsonMissingPath('data.user.password')
          ->assertJsonPath('data.user.role', 'customer');

        $this->postJson('/api/v1/login', ['identifier' => 'jane@example.com', 'password' => 'secret-pass-1'])
            ->assertOk()
            ->assertJsonStructure(['data' => ['token', 'user' => ['id', 'email', 'role']]])
            ->assertJsonMissingPath('data.user.password');
    }

    public function test_owner_cannot_modify_another_stores_product()
    {
        $myStore = Store::factory()->create();
        $otherProduct = Product::factory()->create();

        Sanctum::actingAs($myStore->user);

        $this->putJson("/api/v1/products/{$otherProduct->id}", ['name' => 'Hijacked'])->assertNotFound();
        $this->deleteJson("/api/v1/products/{$otherProduct->id}")->assertNotFound();
        $this->postJson('/api/v1/products/bulk-delete', ['ids' => [$otherProduct->id]])
            ->assertOk()->assertJsonPath('message', '0 products deleted successfully');

        $this->assertNotSoftDeleted($otherProduct);
        $this->assertSame($otherProduct->name, $otherProduct->fresh()->name);
    }

    public function test_owner_cannot_update_another_stores_order()
    {
        $myStore = Store::factory()->create();
        $otherStore = Store::factory()->create();
        $order = Order::create([
            'store_id' => $otherStore->id,
            'total_amount' => 10,
            'status' => 'pending',
        ]);

        Sanctum::actingAs($myStore->user);

        $this->patchJson("/api/v1/orders/{$order->id}/status", ['status' => 'cancelled'])->assertNotFound();
        $this->assertSame('pending', $order->fresh()->status);
    }

    public function test_password_reset_otp_is_emailed_not_returned()
    {
        Mail::fake();
        $user = User::factory()->create(['email' => 'reset@example.com']);

        $response = $this->postJson('/api/v1/forgot-password', ['identifier' => 'reset@example.com'])->assertOk();
        $this->assertArrayNotHasKey('otp', $response->json());

        $otp = null;
        Mail::assertSent(PasswordResetOtp::class, function ($mail) use (&$otp) {
            $otp = $mail->otp;
            return true;
        });

        $this->postJson('/api/v1/reset-password', [
            'identifier' => 'reset@example.com',
            'otp' => $otp,
            'password' => 'brand-new-pass',
            'password_confirmation' => 'brand-new-pass',
        ])->assertOk();

        $this->postJson('/api/v1/login', ['identifier' => $user->email, 'password' => 'brand-new-pass'])->assertOk();
    }

    public function test_forgot_password_does_not_reveal_unknown_accounts()
    {
        $this->postJson('/api/v1/forgot-password', ['identifier' => 'nobody@example.com'])->assertOk();
    }

    public function test_public_store_listing_hides_kyc_documents()
    {
        Store::factory()->create(['owner_id_proof_url' => 'owner_documents/secret.pdf']);

        $this->getJson('/api/v1/stores')
            ->assertOk()
            ->assertJsonMissingPath('data.0.owner_id_proof_url')
            ->assertJsonMissingPath('data.0.business_proof_url');
    }

    public function test_non_admin_cannot_reach_admin_routes()
    {
        Sanctum::actingAs(User::factory()->create(['role' => 'customer']));

        $this->getJson('/api/v1/admin/stores')->assertForbidden();
    }

    public function test_admin_can_list_and_approve_stores()
    {
        $store = Store::factory()->create(['status' => 'pending']);
        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));

        $this->getJson('/api/v1/admin/stores/pending')->assertOk()->assertJsonPath('data.0.id', $store->id);
        $this->patchJson("/api/v1/admin/stores/{$store->id}/approve")->assertOk();

        $this->assertSame('active', $store->fresh()->status);
        $this->assertNotNull($store->fresh()->trial_ends_at);
    }
}
