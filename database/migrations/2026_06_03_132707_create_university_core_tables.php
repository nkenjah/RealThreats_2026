<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->string('code', 30)->unique();
            $table->string('name');
            $table->unsignedTinyInteger('credit_hours')->default(3);
            $table->timestamps();
        });

        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->string('registration_number', 50)->unique();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('program');
            $table->unsignedSmallInteger('year_of_study')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('lectures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lecturer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('topic');
            $table->timestamp('scheduled_at');
            $table->string('venue', 100);
            $table->timestamps();
        });

        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('exam_type', 50);
            $table->timestamp('starts_at');
            $table->unsignedSmallInteger('duration_minutes')->default(120);
            $table->string('venue', 100);
            $table->boolean('is_locked')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exams');
        Schema::dropIfExists('lectures');
        Schema::dropIfExists('students');
        Schema::dropIfExists('courses');
    }
};
