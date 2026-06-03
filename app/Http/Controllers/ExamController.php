<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Exam;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExamController extends Controller
{
    public function index(Request $request): Response
    {
        $exams = Exam::with('course.department')
            ->when($request->search, fn ($query, $search) => $query->where(fn ($inner) => $inner->where('exam_type', 'like', "%{$search}%")->orWhere('venue', 'like', "%{$search}%")))
            ->when($request->course_id, fn ($query, $courseId) => $query->where('course_id', $courseId))
            ->when($request->locked !== null && $request->locked !== '', fn ($query) => $query->where('is_locked', request()->boolean('locked')))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/exams/index', [
            'exams' => $exams,
            'filters' => $request->only(['search', 'course_id', 'locked']),
            'courses' => Course::orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/exams/create', [
            'courses' => Course::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
            'exam_type' => ['required', 'string', 'max:50'],
            'starts_at' => ['required', 'date'],
            'duration_minutes' => ['required', 'integer', 'min:15', 'max:600'],
            'venue' => ['required', 'string', 'max:100'],
            'is_locked' => ['boolean'],
        ]);

        Exam::create($validated);

        return redirect()->route('admin.exams.index')->with('success', 'Exam created.');
    }

    public function show(Exam $exam): Response
    {
        return Inertia::render('admin/exams/show', [
            'exam' => $exam->load('course.department'),
        ]);
    }

    public function edit(Exam $exam): Response
    {
        return Inertia::render('admin/exams/edit', [
            'exam' => $exam,
            'courses' => Course::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Exam $exam): RedirectResponse
    {
        $validated = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
            'exam_type' => ['required', 'string', 'max:50'],
            'starts_at' => ['required', 'date'],
            'duration_minutes' => ['required', 'integer', 'min:15', 'max:600'],
            'venue' => ['required', 'string', 'max:100'],
            'is_locked' => ['boolean'],
        ]);

        $exam->update($validated);

        return back()->with('success', 'Exam updated.');
    }

    public function destroy(Exam $exam): RedirectResponse
    {
        $exam->delete();

        return redirect()->route('admin.exams.index')->with('success', 'Exam deleted.');
    }

    public function toggleLock(Exam $exam): RedirectResponse
    {
        $exam->update(['is_locked' => ! $exam->is_locked]);

        return back()->with('success', $exam->is_locked ? 'Exam locked.' : 'Exam unlocked.');
    }
}
