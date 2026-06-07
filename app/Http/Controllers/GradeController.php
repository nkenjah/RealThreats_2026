<?php

namespace App\Http\Controllers;

use App\Models\CourseOffering;
use App\Models\Grade;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GradeController extends Controller
{
    public function index(Request $request): Response
    {
        $grades = Grade::with(['student', 'courseOffering.course'])
            ->when($request->search, fn ($query, $search) => $query->whereHas('student', fn ($q) => $q->where('name', 'like', "%{$search}%")))
            ->when($request->academic_year, fn ($query, $year) => $query->where('academic_year', $year))
            ->when($request->semester, fn ($query, $semester) => $query->where('semester', $semester))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/grades/index', [
            'grades' => $grades,
            'filters' => $request->only(['search', 'academic_year', 'semester']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/grades/create', [
            'students' => Student::orderBy('name')->get(),
            'courseOfferings' => CourseOffering::with('course')->orderBy('id')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'course_offering_id' => ['required', 'exists:course_offerings,id'],
            'grade' => ['required', 'string', 'max:10'],
            'grade_points' => ['nullable', 'numeric', 'min:0'],
            'academic_year' => ['required', 'string', 'max:20'],
            'semester' => ['required', 'string', 'max:20'],
        ]);

        Grade::create($validated);

        return redirect()->route('admin.grades.index')->with('success', 'Grade created.');
    }

    public function show(Grade $grade): Response
    {
        return Inertia::render('admin/grades/show', [
            'grade' => $grade->load(['student', 'courseOffering.course']),
        ]);
    }

    public function edit(Grade $grade): Response
    {
        return Inertia::render('admin/grades/edit', [
            'grade' => $grade,
            'students' => Student::orderBy('name')->get(),
            'courseOfferings' => CourseOffering::with('course')->orderBy('id')->get(),
        ]);
    }

    public function update(Request $request, Grade $grade): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'course_offering_id' => ['required', 'exists:course_offerings,id'],
            'grade' => ['required', 'string', 'max:10'],
            'grade_points' => ['nullable', 'numeric', 'min:0'],
            'academic_year' => ['required', 'string', 'max:20'],
            'semester' => ['required', 'string', 'max:20'],
        ]);

        $grade->update($validated);

        return back()->with('success', 'Grade updated.');
    }

    public function destroy(Grade $grade): RedirectResponse
    {
        $grade->delete();

        return redirect()->route('admin.grades.index')->with('success', 'Grade deleted.');
    }
}
