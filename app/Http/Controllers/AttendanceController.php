<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Lecture;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        $attendances = Attendance::with(['student', 'lecture'])
            ->when($request->search, fn ($query, $search) => $query->whereHas('student', fn ($q) => $q->where('name', 'like', "%{$search}%")))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/attendance/index', [
            'attendances' => $attendances,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/attendance/create', [
            'students' => Student::orderBy('name')->get(),
            'lectures' => Lecture::orderBy('id')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'lecture_id' => ['required', 'exists:lectures,id'],
            'status' => ['required', 'string', 'max:50'],
            'lecture_date' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
        ]);

        Attendance::create($validated);

        return redirect()->route('admin.attendance.index')->with('success', 'Attendance recorded.');
    }

    public function show(Attendance $attendance): Response
    {
        return Inertia::render('admin/attendance/show', [
            'attendance' => $attendance->load(['student', 'lecture']),
        ]);
    }

    public function edit(Attendance $attendance): Response
    {
        return Inertia::render('admin/attendance/edit', [
            'attendance' => $attendance,
            'students' => Student::orderBy('name')->get(),
            'lectures' => Lecture::orderBy('id')->get(),
        ]);
    }

    public function update(Request $request, Attendance $attendance): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'lecture_id' => ['required', 'exists:lectures,id'],
            'status' => ['required', 'string', 'max:50'],
            'lecture_date' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
        ]);

        $attendance->update($validated);

        return back()->with('success', 'Attendance updated.');
    }

    public function destroy(Attendance $attendance): RedirectResponse
    {
        $attendance->delete();

        return redirect()->route('admin.attendance.index')->with('success', 'Attendance deleted.');
    }
}
