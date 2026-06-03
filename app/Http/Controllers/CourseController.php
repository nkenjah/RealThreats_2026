<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Department;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(Request $request): Response
    {
        $courses = Course::with('department')
            ->when($request->search, fn ($query, $search) => $query->where(fn ($inner) => $inner->where('name', 'like', "%{$search}%")->orWhere('code', 'like', "%{$search}%")))
            ->when($request->department_id, fn ($query, $departmentId) => $query->where('department_id', $departmentId))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/courses/index', [
            'courses' => $courses,
            'filters' => $request->only(['search', 'department_id']),
            'departments' => Department::orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/courses/create', [
            'departments' => Department::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'department_id' => ['required', 'exists:departments,id'],
            'code' => ['required', 'string', 'max:30', 'unique:courses,code'],
            'name' => ['required', 'string', 'max:255'],
            'credit_hours' => ['required', 'integer', 'min:1', 'max:20'],
        ]);

        Course::create($validated);

        return redirect()->route('admin.courses.index')->with('success', 'Course created.');
    }

    public function show(Course $course): Response
    {
        return Inertia::render('admin/courses/show', [
            'course' => $course->load('department'),
        ]);
    }

    public function edit(Course $course): Response
    {
        return Inertia::render('admin/courses/edit', [
            'course' => $course,
            'departments' => Department::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Course $course): RedirectResponse
    {
        $validated = $request->validate([
            'department_id' => ['required', 'exists:departments,id'],
            'code' => ['required', 'string', 'max:30', 'unique:courses,code,'.$course->id],
            'name' => ['required', 'string', 'max:255'],
            'credit_hours' => ['required', 'integer', 'min:1', 'max:20'],
        ]);

        $course->update($validated);

        return back()->with('success', 'Course updated.');
    }

    public function destroy(Course $course): RedirectResponse
    {
        $course->delete();

        return redirect()->route('admin.courses.index')->with('success', 'Course deleted.');
    }
}
