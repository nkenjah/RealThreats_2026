<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activity_log', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('id')->constrained()->nullOnDelete();
            $table->string('action', 100)->default('activity')->after('user_id');
            $table->string('module', 100)->default('system')->after('action');
            $table->string('ip_address', 45)->nullable()->after('description');
            $table->text('user_agent')->nullable()->after('ip_address');
            $table->unsignedTinyInteger('risk_score_contribution')->default(0)->after('user_agent');
            $table->boolean('alert_triggered')->default(false)->after('risk_score_contribution');
        });
    }

    public function down(): void
    {
        Schema::table('activity_log', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn([
                'user_id',
                'action',
                'module',
                'ip_address',
                'user_agent',
                'risk_score_contribution',
                'alert_triggered',
            ]);
        });
    }
};
