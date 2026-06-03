<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('threat_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('log_id')->nullable()->constrained('activity_log')->nullOnDelete();
            $table->enum('alert_type', ['failed_login', 'unauthorized_access', 'off_hours_access', 'data_exfiltration', 'privilege_escalation', 'simultaneous_login']);
            $table->enum('severity', ['low', 'medium', 'high', 'critical']);
            $table->enum('status', ['open', 'investigating', 'resolved', 'false_positive'])->default('open');
            $table->boolean('auto_mitigated')->default(false);
            $table->string('mitigation_action', 255)->nullable();
            $table->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('resolved_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('threat_alerts');
    }
};
