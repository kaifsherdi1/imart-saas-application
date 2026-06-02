<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('store_id')->constrained()->cascadeOnDelete();
            $table->decimal('total_amount', 15, 2);
            $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])->default('pending');
            $table->timestamps();

            $table->index(['store_id', 'status']);
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
