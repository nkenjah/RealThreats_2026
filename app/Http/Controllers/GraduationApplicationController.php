<?php

namespace App\Http\Controllers;

use App\Models\GraduationApplication;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GraduationApplicationController extends Controller
{
    public function index(Request $request): Response
    {
        $graduationApplications = GraduationApplication::with('student')
            ->when($request->search, fn ($query, $search) => $query->whereHas('student', fn ($q) => $q->where('name', 'like', "%{$search}%")))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/academic-records/graduation-applications/index', [
            'graduationApplications' => $graduationApplications,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/academic-records/graduation-applications/create', [
            'students' => Student::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'application_date' => ['required', 'date'],
            'status' => ['nullable', 'string', 'max:50'],
            'approved_at' => ['nullable', 'date'],
        ]);

        GraduationApplication::create($validated);

        return redirect()->route('admin.academic-records.graduation-applications.index')->with('success', 'Graduation application created.');
    }

    public function show(GraduationApplication $graduationApplication): Response
    {
        return Inertia::render('admin/academic-records/graduation-applications/show', [
            'graduationApplication' => $graduationApplication->load('student'),
        ]);
    }

    public function edit(GraduationApplication $graduationApplication): Response
    {
        return Inertia::render('admin/academic-records/graduation-applications/edit', [
            'graduationApplication' => $graduationApplication,
            'students' => Student::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, GraduationApplication $graduationApplication): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'application_date' => ['required', 'date'],
            'status' => ['nullable', 'string', 'max:50'],
            'approved_at' => ['nullable', 'date'],
        ]);

        $graduationApplication->update($validated);

        return back()->with('success', 'Graduation application updated.');
    }

    public function destroy(GraduationApplication $graduationApplication): RedirectResponse
    {
        $graduationApplication->delete();

        return redirect()->route('admin.academic-records.graduation-applications.index')->with('success', 'Graduation application deleted.');
    }
}
