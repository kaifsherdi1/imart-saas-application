<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stores', function (Blueprint $column) {
            $column->timestamp('trial_ends_at')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('stores', function (Blueprint $column) {
            $column->dropColumn('trial_ends_at');
        });
    }
};
