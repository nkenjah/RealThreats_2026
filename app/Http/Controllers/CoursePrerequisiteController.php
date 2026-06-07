<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CoursePrerequisite;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CoursePrerequisiteController extends Controller
{
    public function index(Request $request): Response
    {
        $coursePrerequisites = CoursePrerequisite::with(['course', 'prerequisiteCourse'])
            ->when($request->search, fn ($query, $search) => $query->whereHas('course', fn ($q) => $q->where('name', 'like', "%{$search}%")))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/academic-records/course-prerequisites/index', [
            'coursePrerequisites' => $coursePrerequisites,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/academic-records/course-prerequisites/create', [
            'courses' => Course::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
            'prerequisite_course_id' => ['required', 'exists:courses,id', 'different:course_id'],
        ]);

        CoursePrerequisite::create($validated);

        return redirect()->route('admin.academic-records.course-prerequisites.index')->with('success', 'Course prerequisite created.');
    }

    public function show(CoursePrerequisite $coursePrerequisite): Response
    {
        return Inertia::render('admin/academic-records/course-prerequisites/show', [
            'coursePrerequisite' => $coursePrerequisite->load(['course', 'prerequisiteCourse']),
        ]);
    }

    public function edit(CoursePrerequisite $coursePrerequisite): Response
    {
        return Inertia::render('admin/academic-records/course-prerequisites/edit', [
            'coursePrerequisite' => $coursePrerequisite,
            'courses' => Course::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, CoursePrerequisite $coursePrerequisite): RedirectResponse
    {
        $validated = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
            'prerequisite_course_id' => ['required', 'exists:courses,id', 'different:course_id'],
        ]);

        $coursePrerequisite->update($validated);

        return back()->with('success', 'Course prerequisite updated.');
    }

    public function destroy(CoursePrerequisite $coursePrerequisite): RedirectResponse
    {
        $coursePrerequisite->delete();

        return redirect()->route('admin.academic-records.course-prerequisites.index')->with('success', 'Course prerequisite deleted.');
    }
}
