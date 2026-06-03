<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Department;
use App\Models\Exam;
use App\Models\Lecture;
use App\Models\Student;
use Illuminate\Database\Seeder;

class UniversityCoreSeeder extends Seeder
{
    public function run(): void
    {
        $ict = Department::where('name', 'ICT')->first();
        $finance = Department::where('name', 'Finance')->first();
        $registry = Department::where('name', 'Registry')->first();

        $courses = [
            ['department_id' => $ict->id, 'code' => 'ICT-301', 'name' => 'Network Security', 'credit_hours' => 3],
            ['department_id' => $ict->id, 'code' => 'ICT-412', 'name' => 'Digital Forensics', 'credit_hours' => 4],
            ['department_id' => $finance->id, 'code' => 'FIN-220', 'name' => 'University Financial Controls', 'credit_hours' => 3],
            ['department_id' => $registry->id, 'code' => 'REG-205', 'name' => 'Academic Records Management', 'credit_hours' => 3],
        ];

        foreach ($courses as $course) {
            Course::updateOrCreate(['code' => $course['code']], $course);
        }

        for ($i = 1; $i <= 20; $i++) {
            Student::updateOrCreate(['registration_number' => 'KIUT/2026/'.str_pad((string) $i, 4, '0', STR_PAD_LEFT)], [
                'department_id' => [$ict->id, $finance->id, $registry->id][$i % 3],
                'name' => "KIUT Student {$i}",
                'email' => "student{$i}@kiut.ac.tz",
                'program' => ['BSc IT', 'BBA Finance', 'BA Records'][($i - 1) % 3],
                'year_of_study' => (($i - 1) % 4) + 1,
                'is_active' => true,
            ]);
        }

        Course::all()->each(function (Course $course): void {
            Lecture::updateOrCreate(['course_id' => $course->id, 'topic' => 'Secure handling of '.$course->name], [
                'scheduled_at' => now()->addDays($course->id),
                'venue' => 'Main Campus Room '.(100 + $course->id),
            ]);

            Exam::updateOrCreate(['course_id' => $course->id, 'exam_type' => 'Final'], [
                'starts_at' => now()->addWeeks(3)->addDays($course->id),
                'duration_minutes' => 120,
                'venue' => 'Exam Hall '.(($course->id % 3) + 1),
                'is_locked' => true,
            ]);
        });
    }
}
