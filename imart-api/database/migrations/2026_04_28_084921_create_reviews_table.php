<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Polymorphic reviews table — handles BOTH store and product reviews
        Schema::create('reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->uuidMorphs('reviewable'); // reviewable_id + reviewable_type
            $table->tinyInteger('rating');    // 1–5
            $table->text('comment')->nullable();
            $table->timestamps();

            // Prevent duplicate reviews: one per user per entity
            $table->unique(['user_id', 'reviewable_id', 'reviewable_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
