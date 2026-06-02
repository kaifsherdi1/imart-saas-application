<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');                         // Monthly, Yearly, Two-Year
            $table->decimal('price', 10, 2);               // 299, 3000, 5500
            $table->integer('duration_days');              // 30, 365, 730
            $table->string('stripe_price_id')->nullable(); // Stripe price ID
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};
