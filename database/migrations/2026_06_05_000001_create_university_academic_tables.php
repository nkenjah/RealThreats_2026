<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ========== PROGRAMS & ACADEMIC STRUCTURE ==========
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 20)->unique('uq_programs_code');
            $table->text('description')->nullable();
            $table->unsignedTinyInteger('duration_years')->default(3);
            $table->unsignedSmallInteger('total_credits')->default(120);
            $table->timestamps();
        });

        Schema::create('program_requirements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained('programs')->cascadeOnDelete();
            $table->string('name');
            $table->enum('type', ['core', 'elective', 'general']);
            $table->unsignedSmallInteger('credits_required');
            $table->timestamps();
        });

        // ========== FACULTY & STAFF ==========
        Schema::create('faculty_staff', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('staff_number', 30)->unique('uq_faculty_staff_number');
            $table->string('job_title');
            $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
            $table->enum('contract_type', ['permanent', 'contract', 'visiting', 'adjunct', 'part_time']);
            $table->date('employment_date');
            $table->timestamps();
        });

        Schema::create('academic_rank_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('faculty_staff_id')->constrained('faculty_staff')->cascadeOnDelete();
            $table->enum('rank', ['assistant_lecturer', 'lecturer', 'senior_lecturer', 'associate_professor', 'professor']);
            $table->date('effective_date');
            $table->timestamps();
        });

        Schema::create('faculty_department_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('faculty_staff_id')->constrained('faculty_staff')->cascadeOnDelete();
            $table->foreignId('department_id')->constrained('departments')->cascadeOnDelete();
            $table->boolean('is_primary')->default(false);
            $table->timestamp('assigned_at')->useCurrent();
            $table->timestamps();
        });

        // ========== COURSE MANAGEMENT ==========
        Schema::create('course_offerings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignId('program_id')->constrained('programs')->cascadeOnDelete();
            $table->string('academic_year', 20);
            $table->enum('semester', ['1', '2', '3']);
            $table->string('section', 50)->nullable();
            $table->unsignedSmallInteger('max_students')->default(0);
            $table->timestamps();
        });

        Schema::create('course_prerequisites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignId('prerequisite_course_id')->constrained('courses')->cascadeOnDelete();
            $table->timestamps();
        });

        // ========== ENROLLMENTS & REGISTRATIONS ==========
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('course_offering_id')->constrained('course_offerings')->cascadeOnDelete();
            $table->date('enrollment_date');
            $table->enum('status', ['active', 'completed', 'dropped']);
            $table->string('grade', 5)->nullable();
            $table->timestamps();
        });

        Schema::create('student_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->string('academic_year', 20);
            $table->enum('semester', ['1', '2', '3']);
            $table->date('registration_date');
            $table->enum('status', ['registered', 'confirmed', 'cancelled']);
            $table->timestamps();
        });

        Schema::create('student_status_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->string('previous_status', 50)->nullable();
            $table->string('new_status', 50);
            $table->string('reason')->nullable();
            $table->string('changed_by', 100)->nullable();
            $table->timestamps();
        });

        // ========== GRADES & ASSESSMENTS ==========
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('course_offering_id')->constrained('course_offerings')->cascadeOnDelete();
            $table->string('grade', 5)->nullable();
            $table->decimal('grade_points', 4, 2)->nullable();
            $table->string('academic_year', 20);
            $table->enum('semester', ['1', '2', '3']);
            $table->timestamps();
        });

        Schema::create('gradebook_components', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_offering_id')->constrained('course_offerings')->cascadeOnDelete();
            $table->string('name');
            $table->enum('type', ['assignment', 'quiz', 'exam', 'project', 'other']);
            $table->decimal('max_score', 6, 2);
            $table->decimal('weight', 5, 2);
            $table->timestamps();
        });

        Schema::create('final_term_grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enrollment_id')->constrained('enrollments')->cascadeOnDelete();
            $table->foreignId('course_offering_id')->constrained('course_offerings')->cascadeOnDelete();
            $table->decimal('total_score', 6, 2)->nullable();
            $table->string('letter_grade', 5)->nullable();
            $table->decimal('gpa_points', 4, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('academic_transcripts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('program_id')->constrained('programs')->cascadeOnDelete();
            $table->decimal('total_credits_earned', 6, 2)->nullable();
            $table->decimal('cumulative_gpa', 4, 2)->nullable();
            $table->timestamp('generated_at')->nullable();
            $table->timestamps();
        });

        // ========== ADMISSIONS ==========
        Schema::create('prospects', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('high_school')->nullable();
            $table->decimal('gpa', 4, 2)->nullable();
            $table->string('entry_term', 20)->nullable();
            $table->enum('status', ['new', 'contacted', 'applied', 'qualified', 'disqualified'])->default('new');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prospect_id')->constrained('prospects')->cascadeOnDelete();
            $table->foreignId('program_id')->constrained('programs')->cascadeOnDelete();
            $table->date('submission_date');
            $table->enum('status', ['received', 'under_review', 'accepted', 'rejected', 'waitlisted']);
            $table->foreignId('assigned_reviewer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_notes')->nullable();
            $table->timestamps();
        });

        Schema::create('application_requirements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('applications')->cascadeOnDelete();
            $table->string('name');
            $table->boolean('is_met')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('admission_offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('applications')->cascadeOnDelete();
            $table->date('offer_date');
            $table->date('decision_deadline');
            $table->decimal('tuition_fee', 10, 2)->nullable();
            $table->enum('status', ['pending', 'accepted', 'declined', 'expired']);
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();
        });

        // ========== FINANCE ==========
        Schema::create('fees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->string('fee_type', 100);
            $table->decimal('amount', 10, 2);
            $table->date('due_date');
            $table->enum('status', ['pending', 'paid', 'overdue', 'waived']);
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });

        Schema::create('financial_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->string('account_number', 30)->unique('uq_fin_acct_number');
            $table->decimal('current_balance', 10, 2)->default(0);
            $table->enum('status', ['active', 'frozen', 'closed'])->default('active');
            $table->timestamps();
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('financial_account_id')->constrained('financial_accounts')->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->string('payment_method', 50);
            $table->timestamp('payment_date')->useCurrent();
            $table->string('reference_number', 50)->nullable();
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded']);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('tuition_invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('financial_account_id')->constrained('financial_accounts')->cascadeOnDelete();
            $table->string('invoice_number', 30)->unique('uq_tuition_inv_number');
            $table->decimal('total_amount', 10, 2);
            $table->date('due_date');
            $table->enum('status', ['pending', 'paid', 'overdue', 'cancelled']);
            $table->timestamps();
        });

        Schema::create('invoice_line_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tuition_invoice_id')->constrained('tuition_invoices')->cascadeOnDelete();
            $table->string('description');
            $table->decimal('amount', 10, 2);
            $table->timestamps();
        });

        Schema::create('fund_sources', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('total_fund', 12, 2)->default(0);
            $table->decimal('remaining_balance', 12, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('scholarship_awards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('fund_source_id')->constrained('fund_sources')->cascadeOnDelete();
            $table->decimal('award_amount', 10, 2);
            $table->date('award_date');
            $table->enum('status', ['pending', 'approved', 'disbursed', 'cancelled']);
            $table->timestamps();
        });

        Schema::create('disbursements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scholarship_award_id')->constrained('scholarship_awards')->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->date('disbursement_date');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // ========== LIBRARY ==========
        Schema::create('library_books', function (Blueprint $table) {
            $table->id();
            $table->string('isbn', 30)->unique('uq_lib_books_isbn');
            $table->string('title');
            $table->string('author');
            $table->string('publisher')->nullable();
            $table->string('category', 50)->nullable();
            $table->unsignedInteger('total_copies')->default(1);
            $table->unsignedInteger('available_copies')->default(1);
            $table->string('shelf_location', 50)->nullable();
            $table->timestamps();
        });

        Schema::create('library_borrowings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('library_book_id')->constrained('library_books')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->timestamp('borrowed_at')->useCurrent();
            $table->timestamp('due_at');
            $table->timestamp('returned_at')->nullable();
            $table->enum('status', ['active', 'returned', 'overdue']);
            $table->timestamps();
        });

        Schema::create('library_fines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('library_borrowing_id')->constrained('library_borrowings')->cascadeOnDelete();
            $table->decimal('amount', 8, 2);
            $table->boolean('paid')->default(false);
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });

        // ========== LMS ==========
        Schema::create('lms_courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_offering_id')->constrained('course_offerings')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['active', 'archived', 'draft'])->default('draft');
            $table->timestamps();
        });

        Schema::create('course_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lms_course_id')->constrained('lms_courses')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('order_index');
            $table->timestamps();
        });

        Schema::create('digital_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lms_course_id')->constrained('lms_courses')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->string('file_url');
            $table->timestamp('submitted_at')->useCurrent();
            $table->decimal('grade', 6, 2)->nullable();
            $table->text('feedback')->nullable();
            $table->timestamps();
        });

        Schema::create('student_assessment_grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('lms_course_id')->constrained('lms_courses')->cascadeOnDelete();
            $table->foreignId('gradebook_component_id')->nullable()->constrained('gradebook_components')->nullOnDelete();
            $table->decimal('score', 6, 2);
            $table->timestamps();
        });

        // ========== HOUSING ==========
        Schema::create('dormitories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 20)->unique('uq_dormitories_code');
            $table->unsignedSmallInteger('capacity');
            $table->enum('gender', ['male', 'female', 'mixed']);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('hostels', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('dormitory_id')->constrained('dormitories')->cascadeOnDelete();
            $table->unsignedSmallInteger('capacity');
            $table->timestamps();
        });

        Schema::create('hostel_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hostel_id')->constrained('hostels')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->string('room_number', 20);
            $table->timestamp('allocated_at')->useCurrent();
            $table->timestamp('vacated_at')->nullable();
            $table->enum('status', ['active', 'ended'])->default('active');
            $table->timestamps();
        });

        // ========== CAMPUS INFRASTRUCTURE ==========
        Schema::create('campuses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 20)->unique('uq_campuses_code');
            $table->string('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('buildings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campus_id')->constrained('campuses')->cascadeOnDelete();
            $table->string('name');
            $table->string('code', 20);
            $table->unsignedSmallInteger('floors')->default(1);
            $table->timestamps();
        });

        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('building_id')->constrained('buildings')->cascadeOnDelete();
            $table->string('room_number', 20);
            $table->string('room_type', 50);
            $table->unsignedSmallInteger('capacity')->default(0);
            $table->boolean('is_lab')->default(false);
            $table->timestamps();
        });

        Schema::create('room_inventory', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained('rooms')->cascadeOnDelete();
            $table->string('item_name');
            $table->unsignedInteger('quantity')->default(1);
            $table->enum('condition', ['good', 'fair', 'poor']);
            $table->timestamps();
        });

        // ========== ALUMNI ==========
        Schema::create('alumni_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->year('graduation_year');
            $table->string('current_company')->nullable();
            $table->string('job_title')->nullable();
            $table->string('industry', 100)->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('address')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->timestamps();
        });

        Schema::create('career_placements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alumni_profile_id')->constrained('alumni_profiles')->cascadeOnDelete();
            $table->string('company_name');
            $table->string('position');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_current')->default(false);
            $table->timestamps();
        });

        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alumni_profile_id')->constrained('alumni_profiles')->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->date('donation_date');
            $table->string('purpose')->nullable();
            $table->timestamps();
        });

        // ========== ACADEMIC PROGRESS ==========
        Schema::create('degree_audits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('program_id')->constrained('programs')->cascadeOnDelete();
            $table->decimal('total_credits_required', 6, 2);
            $table->decimal('total_credits_earned', 6, 2)->nullable();
            $table->enum('status', ['in_progress', 'completed', 'not_met']);
            $table->timestamp('generated_at')->nullable();
            $table->timestamps();
        });

        Schema::create('graduation_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->date('application_date');
            $table->enum('status', ['pending', 'approved', 'rejected']);
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });

        Schema::create('waitlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_offering_id')->constrained('course_offerings')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->unsignedSmallInteger('position');
            $table->enum('status', ['waiting', 'offered', 'enrolled', 'removed']);
            $table->timestamps();
        });

        Schema::create('session_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('login_at')->useCurrent();
            $table->timestamp('logout_at')->nullable();
            $table->unsignedInteger('duration_minutes')->nullable();
            $table->timestamps();
        });

        Schema::create('timetables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_offering_id')->constrained('course_offerings')->cascadeOnDelete();
            $table->enum('day_of_week', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']);
            $table->time('start_time');
            $table->time('end_time');
            $table->string('venue', 100);
            $table->unsignedSmallInteger('semester');
            $table->foreignId('lecturer_id')->nullable()->constrained('faculty_staff')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        $tables = [
            'timetables',
            'session_logs',
            'waitlists',
            'graduation_applications',
            'degree_audits',
            'donations',
            'career_placements',
            'alumni_profiles',
            'room_inventory',
            'rooms',
            'buildings',
            'campuses',
            'hostel_allocations',
            'hostels',
            'dormitories',
            'student_assessment_grades',
            'digital_submissions',
            'course_modules',
            'lms_courses',
            'library_fines',
            'library_borrowings',
            'library_books',
            'disbursements',
            'scholarship_awards',
            'fund_sources',
            'invoice_line_items',
            'tuition_invoices',
            'payments',
            'financial_accounts',
            'fees',
            'admission_offers',
            'application_requirements',
            'applications',
            'prospects',
            'academic_transcripts',
            'final_term_grades',
            'gradebook_components',
            'grades',
            'student_status_logs',
            'student_registrations',
            'enrollments',
            'course_prerequisites',
            'course_offerings',
            'academic_rank_histories',
            'faculty_department_assignments',
            'faculty_staff',
            'program_requirements',
            'programs',
        ];

        foreach ($tables as $table) {
            Schema::dropIfExists($table);
        }
    }
};
