<?php

namespace App\Http\Controllers;

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
}
