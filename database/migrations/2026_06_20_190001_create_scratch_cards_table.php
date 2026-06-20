<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scratch_cards', function (Blueprint $table) {
            $table->id();
            $table->string('pin', 16)->unique();
            $table->string('serial_number', 20)->unique();
            $table->decimal('value', 10, 2);
            $table->string('currency', 3)->default('TZS');
            $table->string('status')->default('active'); // active, used, expired, revoked
            $table->foreignId('issued_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('used_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scratch_cards');
    }
};
