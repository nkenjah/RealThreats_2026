<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamAttendance;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExamAttendanceController extends Controller
{
    public function index(): Response
    {
        $exams = Exam::with('course')
            ->whereDate('starts_at', today())
            ->orWhereNull('starts_at')
            ->orderBy('starts_at')
            ->get();

        return Inertia::render('admin/exam-attendance/index', [
            'exams' => $exams->map(fn ($e) => [
                'id' => $e->id,
                'course' => $e->course?->name ?? 'N/A',
                'code' => $e->course?->code ?? 'N/A',
                'starts_at' => $e->starts_at?->format('d/m/Y H:i') ?? 'TBD',
                'venue' => $e->venue ?? 'TBD',
                'is_locked' => $e->is_locked,
            ]),
        ]);
    }

    public function scanner(Exam $exam): Response
    {
        $exam->load('course');

        return Inertia::render('admin/exam-attendance/scanner', [
            'exam' => [
                'id' => $exam->id,
                'course' => $exam->course?->name ?? 'N/A',
                'code' => $exam->course?->code ?? 'N/A',
                'starts_at' => $exam->starts_at?->format('d/m/Y H:i') ?? 'TBD',
                'venue' => $exam->venue ?? 'TBD',
            ],
            'today' => now()->format('Y-m-d'),
        ]);
    }

    public function checkIn(Request $request, Exam $exam): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'registration_number' => ['required', 'string', 'exists:students,registration_number'],
        ]);

        $student = Student::where('registration_number', $validated['registration_number'])->first();

        if (ExamAttendance::where('exam_id', $exam->id)->where('student_id', $student->id)->exists()) {
            return response()->json([
                'status' => 'already_checked',
                'message' => "{$student->name} is already checked in.",
                'student' => ['name' => $student->name, 'reg' => $student->registration_number],
            ]);
        }

        ExamAttendance::create([
            'exam_id' => $exam->id,
            'student_id' => $student->id,
            'checked_in_at' => now(),
            'status' => 'present',
        ]);

        activity()
            ->performedOn($exam)
            ->withProperties(['student' => $student->registration_number])
            ->log("Student {$student->name} checked in for exam");

        return response()->json([
            'status' => 'checked_in',
            'message' => "{$student->name} checked in successfully.",
            'student' => ['name' => $student->name, 'reg' => $student->registration_number],
        ]);
    }

    public function attendanceList(Exam $exam): Response
    {
        $attendances = ExamAttendance::with('student')
            ->where('exam_id', $exam->id)
            ->latest('checked_in_at')
            ->get();

        return Inertia::render('admin/exam-attendance/list', [
            'exam' => $exam->load('course'),
            'attendances' => $attendances->map(fn ($a) => [
                'id' => $a->id,
                'student_name' => $a->student?->name ?? 'N/A',
                'registration_number' => $a->student?->registration_number ?? 'N/A',
                'checked_in_at' => $a->checked_in_at?->format('d/m/Y H:i:s') ?? 'N/A',
                'status' => $a->status,
            ]),
        ]);
    }
}
