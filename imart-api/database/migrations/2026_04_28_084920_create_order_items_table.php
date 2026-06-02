<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('order_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('product_id')->constrained()->cascadeOnDelete();
            $table->integer('quantity');
            $table->decimal('price_at_purchase', 15, 2); // Snapshot of price at order time
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
