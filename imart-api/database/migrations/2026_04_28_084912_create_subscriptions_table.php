<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('store_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('plan_id')->constrained('subscription_plans');
            $table->string('stripe_subscription_id')->nullable()->unique();
            $table->string('stripe_customer_id')->nullable();
            $table->enum('status', ['trialing', 'active', 'suspended', 'cancelled'])->default('trialing');
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamps();

            $table->index('store_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
