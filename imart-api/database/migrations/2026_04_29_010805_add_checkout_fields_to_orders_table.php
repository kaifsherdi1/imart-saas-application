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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('customer_name')->nullable()->after('user_id');
            $table->string('email')->nullable()->after('customer_name');
            $table->string('phone_1')->nullable()->after('email');
            $table->string('phone_2')->nullable()->after('phone_1');
            $table->text('shipping_address')->nullable()->after('phone_2');
            $table->string('pincode')->nullable()->after('shipping_address');
            $table->string('landmark')->nullable()->after('pincode');
            $table->string('payment_method')->nullable()->after('landmark');
            
            // Allow user_id to be nullable so guests can checkout
            $table->uuid('user_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'customer_name', 'email', 'phone_1', 'phone_2', 
                'shipping_address', 'pincode', 'landmark', 'payment_method'
            ]);
            $table->uuid('user_id')->nullable(false)->change();
        });
    }
};
