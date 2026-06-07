<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentRegistration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentRegistrationController extends Controller
{
    public function index(Request $request): Response
    {
        $studentRegistrations = StudentRegistration::with('student')
            ->when($request->search, fn ($query, $search) => $query->whereHas('student', fn ($q) => $q->where('name', 'like', "%{$search}%")))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->when($request->academic_year, fn ($query, $year) => $query->where('academic_year', $year))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/registrations/index', [
            'studentRegistrations' => $studentRegistrations,
            'filters' => $request->only(['search', 'status', 'academic_year']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/registrations/create', [
            'students' => Student::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'academic_year' => ['required', 'string', 'max:20'],
            'semester' => ['required', 'string', 'max:20'],
            'registration_date' => ['required', 'date'],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        StudentRegistration::create($validated);

        return redirect()->route('admin.registrations.index')->with('success', 'Student registration created.');
    }

    public function show(StudentRegistration $studentRegistration): Response
    {
        return Inertia::render('admin/registrations/show', [
            'studentRegistration' => $studentRegistration->load('student'),
        ]);
    }

    public function edit(StudentRegistration $studentRegistration): Response
    {
        return Inertia::render('admin/registrations/edit', [
            'studentRegistration' => $studentRegistration,
            'students' => Student::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, StudentRegistration $studentRegistration): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'academic_year' => ['required', 'string', 'max:20'],
            'semester' => ['required', 'string', 'max:20'],
            'registration_date' => ['required', 'date'],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        $studentRegistration->update($validated);

        return back()->with('success', 'Student registration updated.');
    }

    public function destroy(StudentRegistration $studentRegistration): RedirectResponse
    {
        $studentRegistration->delete();

        return redirect()->route('admin.registrations.index')->with('success', 'Student registration deleted.');
    }
}
