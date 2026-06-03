<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('department_id')->nullable()->after('id')->constrained()->nullOnDelete();
            $table->boolean('is_active')->default(true)->after('password');
            $table->boolean('is_locked')->default(false)->after('is_active');
            $table->timestamp('locked_at')->nullable()->after('is_locked');
            $table->text('lock_reason')->nullable()->after('locked_at');
            $table->integer('failed_login_count')->default(0)->after('lock_reason');
            $table->string('last_login_ip', 45)->nullable()->after('failed_login_count');

            if (! Schema::hasColumn('users', 'last_login_at')) {
                $table->timestamp('last_login_at')->nullable()->after('last_login_ip');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropColumn([
                'department_id',
                'is_active',
                'is_locked',
                'locked_at',
                'lock_reason',
                'failed_login_count',
                'last_login_ip',
                'last_login_at',
            ]);
        });
    }
};
