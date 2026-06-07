<?php

namespace App\Http\Controllers;

use App\Models\CourseOffering;
use App\Models\Enrollment;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EnrollmentController extends Controller
{
    public function index(Request $request): Response
    {
        $enrollments = Enrollment::with(['student', 'courseOffering.course'])
            ->when($request->search, fn ($query, $search) => $query->whereHas('student', fn ($q) => $q->where('name', 'like', "%{$search}%")))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/academics/enrollments/index', [
            'enrollments' => $enrollments,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/academics/enrollments/create', [
            'students' => Student::orderBy('name')->get(),
            'courseOfferings' => CourseOffering::with('course')->orderBy('id')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'course_offering_id' => ['required', 'exists:course_offerings,id'],
            'enrollment_date' => ['required', 'date'],
            'status' => ['nullable', 'string', 'max:50'],
            'grade' => ['nullable', 'string', 'max:10'],
        ]);

        Enrollment::create($validated);

        return redirect()->route('admin.academics.enrollments.index')->with('success', 'Enrollment created.');
    }

    public function show(Enrollment $enrollment): Response
    {
        return Inertia::render('admin/academics/enrollments/show', [
            'enrollment' => $enrollment->load(['student', 'courseOffering.course', 'finalTermGrade']),
        ]);
    }

    public function edit(Enrollment $enrollment): Response
    {
        return Inertia::render('admin/academics/enrollments/edit', [
            'enrollment' => $enrollment,
            'students' => Student::orderBy('name')->get(),
            'courseOfferings' => CourseOffering::with('course')->orderBy('id')->get(),
        ]);
    }

    public function update(Request $request, Enrollment $enrollment): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'course_offering_id' => ['required', 'exists:course_offerings,id'],
            'enrollment_date' => ['required', 'date'],
            'status' => ['nullable', 'string', 'max:50'],
            'grade' => ['nullable', 'string', 'max:10'],
        ]);

        $enrollment->update($validated);

        return back()->with('success', 'Enrollment updated.');
    }

    public function destroy(Enrollment $enrollment): RedirectResponse
    {
        $enrollment->delete();

        return redirect()->route('admin.academics.enrollments.index')->with('success', 'Enrollment deleted.');
    }
}
