<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Fixes schema problems in databases created from earlier migrations:
     *  - OTP columns were never added (the original migration was empty).
     *  - personal_access_tokens.tokenable_id was an integer, but user IDs are UUIDs.
     *  - users.mobile is used as a login identifier and must be unique.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'otp')) {
                $table->string('otp')->nullable();
            }
            if (!Schema::hasColumn('users', 'otp_expires_at')) {
                $table->timestamp('otp_expires_at')->nullable();
            }
            if (!Schema::hasColumn('users', 'otp_attempts')) {
                $table->unsignedTinyInteger('otp_attempts')->default(0);
            }
        });

        Schema::table('users', function (Blueprint $table) {
            $table->unique('mobile');
        });

        $tokenableType = Schema::getColumnType('personal_access_tokens', 'tokenable_id');
        if (in_array($tokenableType, ['integer', 'bigint', 'int', 'int4', 'int8'], true)) {
            // Tokens are disposable: users simply sign in again.
            Schema::drop('personal_access_tokens');
            Schema::create('personal_access_tokens', function (Blueprint $table) {
                $table->id();
                $table->uuidMorphs('tokenable');
                $table->text('name');
                $table->string('token', 64)->unique();
                $table->text('abilities')->nullable();
                $table->timestamp('last_used_at')->nullable();
                $table->timestamp('expires_at')->nullable()->index();
                $table->timestamps();
            });
        }

        Schema::table('products', function (Blueprint $table) {
            $table->index(['store_id', 'deleted_at']);
        });

        Schema::table('emi_applications', function (Blueprint $table) {
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::table('emi_applications', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'status']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['store_id', 'deleted_at']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['mobile']);
            $table->dropColumn(['otp', 'otp_expires_at', 'otp_attempts']);
        });
    }
};
