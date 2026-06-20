<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use Barryvdh\DomPDF\Facade\Pdf;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

use App\Models\AcademicTranscript;
use App\Models\Program;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AcademicTranscriptController extends Controller
{
    public function index(Request $request): Response
    {
        $academicTranscripts = AcademicTranscript::with(['student', 'program'])
            ->when($request->search, fn ($query, $search) => $query->whereHas('student', fn ($q) => $q->where('name', 'like', "%{$search}%")))
            ->when($request->program_id, fn ($query, $programId) => $query->where('program_id', $programId))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/academic-records/transcripts/index', [
            'academicTranscripts' => $academicTranscripts,
            'filters' => $request->only(['search', 'program_id']),
            'programs' => Program::orderBy('name')->get(),
        ]);
    }

    public function show(AcademicTranscript $academicTranscript): Response
    {
        return Inertia::render('admin/academic-records/transcripts/show', [
            'academicTranscript' => $academicTranscript->load(['student', 'program']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/academic-records/transcripts/create', [
            'students' => Student::orderBy('name')->get(),
            'programs' => Program::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'program_id' => ['required', 'exists:programs,id'],
            'total_credits_earned' => ['required', 'integer', 'min:0'],
            'cumulative_gpa' => ['required', 'numeric', 'min:0', 'max:4'],
            'generated_at' => ['required', 'date'],
        ]);

        AcademicTranscript::create($validated);

        return redirect()->route('admin.academic-records.transcripts.index')->with('success', 'Academic transcript created.');
    }

    public function edit(AcademicTranscript $academicTranscript): Response
    {
        return Inertia::render('admin/academic-records/transcripts/edit', [
            'academicTranscript' => $academicTranscript,
            'students' => Student::orderBy('name')->get(),
            'programs' => Program::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, AcademicTranscript $academicTranscript): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'program_id' => ['required', 'exists:programs,id'],
            'total_credits_earned' => ['required', 'integer', 'min:0'],
            'cumulative_gpa' => ['required', 'numeric', 'min:0', 'max:4'],
            'generated_at' => ['required', 'date'],
        ]);

        $academicTranscript->update($validated);

        return back()->with('success', 'Academic transcript updated.');
    }

    public function destroy(AcademicTranscript $academicTranscript): RedirectResponse
    {
        $academicTranscript->delete();

        return redirect()->route('admin.academic-records.transcripts.index')->with('success', 'Academic transcript deleted.');
    }

    public function download(AcademicTranscript $academicTranscript): SymfonyResponse
    {
        $academicTranscript->load(['student.department', 'program']);
        $student = $academicTranscript->student;
        $grades = Grade::where('student_id', $student->id)
            ->with('courseOffering.course')
            ->where('status', 'approved')
            ->orderBy('academic_year')
            ->orderBy('semester')
            ->get();

        $pdf = Pdf::loadView('pdf.academic-transcript', [
            'transcript' => $academicTranscript,
            'student' => $student,
            'grades' => $grades,
            'verification_url' => $academicTranscript->getVerificationUrl(),
        ]);

        return $pdf->download('transcript-' . str_replace('/', '-', $student->registration_number) . '.pdf');
    }

    public function verify(string $hash): Response
    {
        $transcript = AcademicTranscript::with(['student', 'program'])
            ->where('verification_hash', $hash)
            ->firstOrFail();

        return Inertia::render('verify/transcript', [
            'valid' => true,
            'transcript' => [
                'student_name' => $transcript->student->name,
                'registration_number' => $transcript->student->registration_number,
                'program' => $transcript->program?->name ?? $transcript->student->program,
                'cumulative_gpa' => $transcript->cumulative_gpa,
                'total_credits' => $transcript->total_credits_earned,
                'generated_at' => $transcript->generated_at,
            ],
        ]);
    }
}
