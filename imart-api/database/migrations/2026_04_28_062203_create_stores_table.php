<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->index();
            $table->string('name');
            $table->string('slug')->unique();
            $table->enum('status', ['pending', 'active', 'suspended', 'rejected'])->default('pending');
            $table->decimal('avg_rating', 3, 2)->default(0.00);
            $table->decimal('total_earnings', 15, 2)->default(0);
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
