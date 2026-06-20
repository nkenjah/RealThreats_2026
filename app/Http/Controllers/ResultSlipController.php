<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Services\GradingService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class ResultSlipController extends Controller
{
    public function __construct(
        private readonly GradingService $gradingService,
    ) {}

    public function download(Student $student, ?string $academicYear = null, ?string $semester = null): Response
    {
        $currentYear = now()->year;
        $currentMonth = now()->month;
        $academicYear ??= $currentMonth >= 9 ? "{$currentYear}/".($currentYear + 1) : ($currentYear - 1)."/{$currentYear}";
        $semester ??= $currentMonth >= 9 || $currentMonth <= 1 ? 'Semester 1' : 'Semester 2';

        $student->load('department', 'grades.courseOffering.course');

        $grades = $student->grades()
            ->with('courseOffering.course')
            ->where('academic_year', $academicYear)
            ->where('semester', $semester)
            ->get();

        $semesterGpa = $this->gradingService->calculateSemesterGPA($student, $academicYear, $semester);
        $cgpa = $this->gradingService->calculateCGPA($student);
        $classification = $this->gradingService->getClassification($cgpa);
        $academicStatus = $this->gradingService->determineAcademicStatus($cgpa);

        $totalCredits = 0;
        $earnedCredits = 0;
        foreach ($grades as $grade) {
            $credits = $grade->courseOffering?->course?->credit_hours ?? 3;
            $totalCredits += $credits;
            if (! in_array($grade->grade, ['E', 'F'])) {
                $earnedCredits += $credits;
            }
        }

        $pdf = Pdf::loadView('pdf.result-slip', [
            'student' => $student,
            'academic_year' => $academicYear,
            'semester' => $semester,
            'grades' => $grades,
            'semester_gpa' => $semesterGpa,
            'cgpa' => $cgpa,
            'classification' => $classification,
            'academic_status' => $academicStatus,
            'total_credits' => $totalCredits,
            'earned_credits' => $earnedCredits,
            'generated_at' => now()->format('d/m/Y H:i'),
        ]);

        $filename = 'result-slip-'.str_replace('/', '-', $student->registration_number).'.pdf';

        return $pdf->stream($filename);
    }
}
