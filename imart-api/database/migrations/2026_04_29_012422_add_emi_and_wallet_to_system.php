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
            $table->decimal('wallet_balance', 15, 2)->default(0)->after('password');
        });

        Schema::create('emi_applications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->decimal('requested_amount', 15, 2);
            $table->string('applicant_aadhaar_url');
            $table->string('family_aadhaar_url');
            $table->text('applicant_bank_details');
            $table->text('family_bank_details');
            $table->boolean('accepted_legal_terms')->default(true);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('emi_applications');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('wallet_balance');
        });
    }
};
