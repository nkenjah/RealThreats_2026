<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Services\FeeBlockingService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;

class ExamCardController extends Controller
{
    public function __construct(
        private readonly FeeBlockingService $feeBlockingService,
    ) {}

    public function download(Student $student): Response|RedirectResponse
    {
        $examCardStatus = $this->feeBlockingService->checkExamCardStatus($student);

        if ($examCardStatus['blocked']) {
            return back()->with('error', 'Exam card cannot be generated. '.$examCardStatus['reason']);
        }

        $student->load('department', 'enrollments.courseOffering.course', 'enrollments.courseOffering.exams');

        $currentYear = now()->year;
        $currentMonth = now()->month;
        $academicYear = $currentMonth >= 9 ? "{$currentYear}/".($currentYear + 1) : ($currentYear - 1)."/{$currentYear}";
        $semester = $currentMonth >= 9 || $currentMonth <= 1 ? 'Semester 1' : 'Semester 2';

        $enrollments = $student->enrollments->filter(fn ($e) => $e->courseOffering?->academic_year === $academicYear &&
            $e->courseOffering?->semester === $semester
        );

        $courses = $enrollments->map(fn ($e) => [
            'code' => $e->courseOffering->course->code ?? 'N/A',
            'name' => $e->courseOffering->course->name ?? 'N/A',
            'section' => $e->courseOffering->section ?? '-',
            'exam_date' => $e->courseOffering->exams->first()?->starts_at?->format('d/m/Y') ?? 'TBD',
            'exam_time' => $e->courseOffering->exams->first()?->starts_at?->format('H:i') ?? '-',
            'venue' => $e->courseOffering->exams->first()?->venue ?? 'TBD',
            'duration' => $e->courseOffering->exams->first()?->duration_minutes ?? '-',
        ]);

        $pdf = Pdf::loadView('pdf.exam-card', [
            'student' => $student,
            'academic_year' => $academicYear,
            'semester' => $semester,
            'courses' => $courses,
            'generated_at' => now()->format('d/m/Y H:i'),
        ]);

        $filename = 'exam-card-'.str_replace('/', '-', $student->registration_number).'.pdf';

        return $pdf->download($filename);
    }
}
