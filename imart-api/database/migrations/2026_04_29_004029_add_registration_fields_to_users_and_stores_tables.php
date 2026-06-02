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
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('name');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('mobile')->nullable()->after('email');
        });

        Schema::table('stores', function (Blueprint $table) {
            $table->text('address')->nullable()->after('slug');
            $table->string('city')->nullable()->after('address');
            $table->string('state')->nullable()->after('city');
            $table->string('pincode')->nullable()->after('state');
            $table->decimal('latitude', 10, 8)->nullable()->after('pincode');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
            $table->string('business_type')->nullable()->after('longitude');
            $table->string('license_type')->nullable()->after('business_type');
            $table->string('business_proof_url')->nullable()->after('license_type');
            $table->string('shop_front_photo_url')->nullable()->after('business_proof_url');
            $table->string('shop_interior_photo_url')->nullable()->after('shop_front_photo_url');
            $table->string('owner_id_proof_url')->nullable()->after('shop_interior_photo_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users_and_stores_tables', function (Blueprint $table) {
            //
        });
    }
};
