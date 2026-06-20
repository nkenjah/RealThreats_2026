<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('salary_grades', function (Blueprint $table) {
            $table->id();
            $table->string('grade', 50)->unique();
            $table->decimal('basic_salary', 12, 2);
            $table->json('allowances')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('staff_contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('faculty_staff_id')->constrained('faculty_staff')->cascadeOnDelete();
            $table->foreignId('salary_grade_id')->nullable()->constrained('salary_grades')->nullOnDelete();
            $table->decimal('basic_salary', 12, 2);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });

        Schema::create('payroll_periods', function (Blueprint $table) {
            $table->id();
            $table->unsignedSmallInteger('month');
            $table->unsignedSmallInteger('year');
            $table->string('status')->default('draft');
            $table->timestamp('processed_at')->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->unique(['month', 'year']);
        });

        Schema::create('payroll_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_period_id')->constrained()->cascadeOnDelete();
            $table->foreignId('faculty_staff_id')->constrained('faculty_staff')->cascadeOnDelete();
            $table->decimal('basic_salary', 12, 2);
            $table->decimal('total_allowances', 12, 2)->default(0);
            $table->decimal('total_deductions', 12, 2)->default(0);
            $table->decimal('tax', 12, 2)->default(0);
            $table->decimal('net_pay', 12, 2);
            $table->string('status')->default('calculated');
            $table->json('breakdown')->nullable();
            $table->timestamps();
        });

        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('faculty_staff_id')->constrained('faculty_staff')->cascadeOnDelete();
            $table->string('type');
            $table->date('start_date');
            $table->date('end_date');
            $table->unsignedSmallInteger('days');
            $table->text('reason')->nullable();
            $table->string('status')->default('pending');
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
        });

        Schema::create('leave_balances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('faculty_staff_id')->constrained('faculty_staff')->cascadeOnDelete();
            $table->unsignedSmallInteger('year');
            $table->unsignedSmallInteger('annual_entitled')->default(28);
            $table->unsignedSmallInteger('annual_taken')->default(0);
            $table->unsignedSmallInteger('sick_entitled')->default(14);
            $table->unsignedSmallInteger('sick_taken')->default(0);
            $table->unsignedSmallInteger('study_entitled')->default(10);
            $table->unsignedSmallInteger('study_taken')->default(0);
            $table->unsignedSmallInteger('compassionate_taken')->default(0);
            $table->timestamps();
            $table->unique(['faculty_staff_id', 'year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_balances');
        Schema::dropIfExists('leave_requests');
        Schema::dropIfExists('payroll_items');
        Schema::dropIfExists('payroll_periods');
        Schema::dropIfExists('staff_contracts');
        Schema::dropIfExists('salary_grades');
    }
};
