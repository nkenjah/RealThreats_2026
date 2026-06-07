<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseOffering;
use App\Models\Program;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseOfferingController extends Controller
{
    public function index(Request $request): Response
    {
        $courseOfferings = CourseOffering::with(['course', 'program'])
            ->when($request->search, fn ($query, $search) => $query->whereHas('course', fn ($q) => $q->where('name', 'like', "%{$search}%")))
            ->when($request->semester, fn ($query, $semester) => $query->where('semester', $semester))
            ->when($request->academic_year, fn ($query, $year) => $query->where('academic_year', $year))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/academics/course-offerings/index', [
            'courseOfferings' => $courseOfferings,
            'filters' => $request->only(['search', 'semester', 'academic_year']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/academics/course-offerings/create', [
            'courses' => Course::orderBy('name')->get(),
            'programs' => Program::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
            'program_id' => ['required', 'exists:programs,id'],
            'academic_year' => ['required', 'string', 'max:20'],
            'semester' => ['required', 'string', 'max:20'],
            'section' => ['nullable', 'string', 'max:50'],
            'max_students' => ['required', 'integer', 'min:1'],
        ]);

        CourseOffering::create($validated);

        return redirect()->route('admin.academics.course-offerings.index')->with('success', 'Course offering created.');
    }

    public function show(CourseOffering $courseOffering): Response
    {
        return Inertia::render('admin/academics/course-offerings/show', [
            'courseOffering' => $courseOffering->load(['course', 'program', 'enrollments', 'waitlists']),
        ]);
    }

    public function edit(CourseOffering $courseOffering): Response
    {
        return Inertia::render('admin/academics/course-offerings/edit', [
            'courseOffering' => $courseOffering,
            'courses' => Course::orderBy('name')->get(),
            'programs' => Program::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, CourseOffering $courseOffering): RedirectResponse
    {
        $validated = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
            'program_id' => ['required', 'exists:programs,id'],
            'academic_year' => ['required', 'string', 'max:20'],
            'semester' => ['required', 'string', 'max:20'],
            'section' => ['nullable', 'string', 'max:50'],
            'max_students' => ['required', 'integer', 'min:1'],
        ]);

        $courseOffering->update($validated);

        return back()->with('success', 'Course offering updated.');
    }

    public function destroy(CourseOffering $courseOffering): RedirectResponse
    {
        $courseOffering->delete();

        return redirect()->route('admin.academics.course-offerings.index')->with('success', 'Course offering deleted.');
    }
}
