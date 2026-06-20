<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('grades', function (Blueprint $table) {
            $table->string('status', 20)->default('draft')->after('grade_points');
            $table->foreignId('submitted_by')->nullable()->constrained('users')->after('status');
            $table->timestamp('submitted_at')->nullable()->after('submitted_by');
            $table->foreignId('approved_by')->nullable()->constrained('users')->after('submitted_at');
            $table->timestamp('approved_at')->nullable()->after('approved_by');
            $table->text('rejection_reason')->nullable()->after('approved_at');
        });

        Schema::table('final_term_grades', function (Blueprint $table) {
            $table->string('status', 20)->default('draft')->after('gpa_points');
            $table->foreignId('submitted_by')->nullable()->constrained('users')->after('status');
            $table->timestamp('submitted_at')->nullable()->after('submitted_by');
            $table->foreignId('approved_by')->nullable()->constrained('users')->after('submitted_at');
            $table->timestamp('approved_at')->nullable()->after('approved_by');
        });

        Schema::table('enrollments', function (Blueprint $table) {
            $table->decimal('semester_gpa', 4, 2)->nullable()->after('grade');
        });

        Schema::create('graduation_clearances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('graduation_application_id')->nullable()->constrained('graduation_applications');
            $table->json('department_statuses');
            $table->boolean('is_cleared')->default(false);
            $table->string('clearance_token', 500)->nullable();
            $table->timestamps();
        });

        Schema::create('heslb_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('heslb_ref_number')->unique();
            $table->string('academic_year', 20);
            $table->decimal('tuition_amount', 12, 2)->default(0);
            $table->decimal('meals_amount', 12, 2)->default(0);
            $table->decimal('accommodation_amount', 12, 2)->default(0);
            $table->decimal('books_amount', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->string('disbursement_status', 20)->default('pending');
            $table->timestamp('last_disbursement_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('heslb_allocations');
        Schema::dropIfExists('graduation_clearances');

        Schema::table('enrollments', function (Blueprint $table) {
            $table->dropColumn('semester_gpa');
        });

        Schema::table('final_term_grades', function (Blueprint $table) {
            $table->dropConstrainedForeignId('approved_by');
            $table->dropConstrainedForeignId('submitted_by');
            $table->dropColumn(['status', 'submitted_at', 'approved_at']);
        });

        Schema::table('grades', function (Blueprint $table) {
            $table->dropConstrainedForeignId('approved_by');
            $table->dropConstrainedForeignId('submitted_by');
            $table->dropColumn(['status', 'submitted_at', 'approved_at', 'rejection_reason']);
        });
    }
};
