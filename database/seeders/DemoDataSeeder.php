<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Course;
use App\Models\CourseOffering;
use App\Models\Enrollment;
use App\Models\FinalTermGrade;
use App\Models\Grade;
use App\Models\Lecture;
use App\Models\Program;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $existingExtra = Student::where('email', 'like', 'demo.%')->count();
        if ($existingExtra > 0) {
            $this->command->warn('Demo data already seeded. Skipping.');

            return;
        }

        $programs = Program::all();
        $courses = Course::all();

        if ($programs->isEmpty() || $courses->isEmpty()) {
            $this->command->warn('Run DatabaseSeeder first. Skipping DemoDataSeeder.');

            return;
        }

        $demoStudents = [];
        $names = [
            'Amiri Juma', 'Neema Mwangi', 'Juma Bakari', 'Amina Hassan',
            'Baraka Simba', 'Mariam Ali', 'Juma Mohamed', 'Halima Omar',
            'Emmanuel Peter', 'Sarah John', 'Peter Mfaume', 'Martha Joseph',
            'David Steven', 'Grace Mushi', 'Samson Raphael', 'Lilian Charles',
            'Abdallah Salum', 'Zainab Ibrahim', 'Josephine Samwel', 'James Mwita',
        ];

        $programsList = ['BSC-CS', 'BSC-IT', 'BBA', 'BED-SCI'];

        foreach ($names as $i => $name) {
            $regNumber = 'KIUT/DEMO/'.str_pad((string) ($i + 1), 4, '0', STR_PAD_LEFT);
            $email = 'demo.'.strtolower(str_replace(' ', '.', $name)).'@kiut.ac.tz';
            $programIndex = $i % count($programsList);

            $student = Student::create([
                'registration_number' => $regNumber,
                'name' => $name,
                'email' => $email,
                'program' => $programsList[$programIndex],
                'year_of_study' => ($i % 4) + 1,
                'is_active' => true,
            ]);

            $demoStudents[] = $student;
        }

        $this->command->info('Created '.count($demoStudents).' demo students.');

        $offerings = CourseOffering::all();
        if ($offerings->isEmpty()) {
            foreach ($courses as $course) {
                foreach ($programs->take(2) as $program) {
                    $offerings[] = CourseOffering::create([
                        'course_id' => $course->id,
                        'program_id' => $program->id,
                        'academic_year' => '2025/2026',
                        'semester' => '1',
                        'section' => 'A',
                        'max_students' => 60,
                    ]);
                }
            }
        }

        $enrollments = [];
        foreach ($demoStudents as $i => $student) {
            $offering = $offerings[$i % count($offerings)];
            $enrollments[] = Enrollment::create([
                'student_id' => $student->id,
                'course_offering_id' => $offering->id,
                'enrollment_date' => Carbon::parse('2025-09-01'),
                'status' => $i % 5 === 0 ? 'suspended' : 'active',
            ]);
        }

        $this->command->info('Created '.count($enrollments).' demo enrollments.');

        $gradesList = [
            ['grade' => 'A', 'points' => 5.0],
            ['grade' => 'B+', 'points' => 4.0],
            ['grade' => 'B', 'points' => 3.0],
            ['grade' => 'C', 'points' => 2.0],
            ['grade' => 'D', 'points' => 1.0],
            ['grade' => 'F', 'points' => 0.0],
        ];

        $createdGrades = 0;
        foreach ($demoStudents as $i => $student) {
            $offering = $offerings[$i % count($offerings)];
            $gradeData = $gradesList[$i % count($gradesList)];

            Grade::create([
                'student_id' => $student->id,
                'course_offering_id' => $offering->id,
                'grade' => $gradeData['grade'],
                'grade_points' => $gradeData['points'],
                'academic_year' => '2025/2026',
                'semester' => '1',
            ]);
            $createdGrades++;

            if ($i % 3 === 0 && isset($offerings[($i + 1) % count($offerings)])) {
                $secondOffering = $offerings[($i + 1) % count($offerings)];
                $secondGrade = $gradesList[($i + 1) % count($gradesList)];
                Grade::create([
                    'student_id' => $student->id,
                    'course_offering_id' => $secondOffering->id,
                    'grade' => $secondGrade['grade'],
                    'grade_points' => $secondGrade['points'],
                    'academic_year' => '2025/2026',
                    'semester' => '1',
                ]);
                $createdGrades++;
            }
        }

        $this->command->info('Created '.$createdGrades.' demo grades.');

        $finalTermGradesData = [
            ['score' => 85, 'letter' => 'A', 'gpa' => 5.0],
            ['score' => 72, 'letter' => 'B+', 'gpa' => 4.0],
            ['score' => 65, 'letter' => 'B', 'gpa' => 3.0],
            ['score' => 55, 'letter' => 'C', 'gpa' => 2.0],
            ['score' => 42, 'letter' => 'D', 'gpa' => 1.0],
        ];

        $createdFinal = 0;
        foreach ($enrollments as $i => $enrollment) {
            if ($i % 4 === 0) {
                continue;
            }
            $fg = $finalTermGradesData[$i % count($finalTermGradesData)];
            FinalTermGrade::create([
                'enrollment_id' => $enrollment->id,
                'course_offering_id' => $enrollment->course_offering_id,
                'total_score' => $fg['score'],
                'letter_grade' => $fg['letter'],
                'gpa_points' => $fg['gpa'],
            ]);
            $createdFinal++;
        }

        $this->command->info('Created '.$createdFinal.' demo final term grades.');

        $lectures = Lecture::all();
        if ($lectures->isEmpty()) {
            foreach ($courses as $course) {
                for ($w = 1; $w <= 5; $w++) {
                    Lecture::create([
                        'course_id' => $course->id,
                        'topic' => "Week {$w}: {$course->name} - Session {$w}",
                        'scheduled_at' => Carbon::parse('2025-09-'.str_pad((string) ($w * 7), 2, '0', STR_PAD_LEFT)),
                        'venue' => 'Room '.strval(100 + $course->id),
                    ]);
                }
            }
            $lectures = Lecture::all();
        }

        $createdAttendance = 0;
        foreach ($demoStudents as $i => $student) {
            $studentLectures = $lectures->filter(fn ($l) => true)->take(5);
            foreach ($studentLectures as $lecture) {
                $statuses = ['present', 'present', 'present', 'absent', 'late'];
                Attendance::create([
                    'student_id' => $student->id,
                    'lecture_id' => $lecture->id,
                    'status' => $statuses[$i % count($statuses)],
                    'lecture_date' => $lecture->scheduled_at,
                ]);
                $createdAttendance++;
            }
        }

        $this->command->info('Created '.$createdAttendance.' demo attendance records.');
        $this->command->info('Demo data seeding completed successfully!');
    }
}
