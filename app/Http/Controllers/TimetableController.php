<?php

namespace App\Http\Controllers;

use App\Models\CourseOffering;
use App\Models\FacultyStaff;
use App\Models\Timetable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TimetableController extends Controller
{
    public function index(Request $request): Response
    {
        $timetables = Timetable::with(['courseOffering.course', 'lecturer'])
            ->when($request->search, fn ($query, $search) => $query->where('venue', 'like', "%{$search}%"))
            ->when($request->semester, fn ($query, $semester) => $query->where('semester', $semester))
            ->when($request->day_of_week, fn ($query, $day) => $query->where('day_of_week', $day))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/academics/timetables/index', [
            'timetables' => $timetables,
            'filters' => $request->only(['search', 'semester', 'day_of_week']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/academics/timetables/create', [
            'courseOfferings' => CourseOffering::with('course')->orderBy('id')->get(),
            'lecturers' => FacultyStaff::orderBy('staff_number')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'course_offering_id' => ['required', 'exists:course_offerings,id'],
            'day_of_week' => ['required', 'string', 'max:20'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'venue' => ['required', 'string', 'max:255'],
            'semester' => ['required', 'string', 'max:20'],
            'lecturer_id' => ['nullable', 'exists:faculty_staff,id'],
        ]);

        Timetable::create($validated);

        return redirect()->route('admin.academics.timetables.index')->with('success', 'Timetable entry created.');
    }

    public function show(Timetable $timetable): Response
    {
        return Inertia::render('admin/academics/timetables/show', [
            'timetable' => $timetable->load(['courseOffering.course', 'lecturer']),
        ]);
    }

    public function edit(Timetable $timetable): Response
    {
        return Inertia::render('admin/academics/timetables/edit', [
            'timetable' => $timetable,
            'courseOfferings' => CourseOffering::with('course')->orderBy('id')->get(),
            'lecturers' => FacultyStaff::orderBy('staff_number')->get(),
        ]);
    }

    public function update(Request $request, Timetable $timetable): RedirectResponse
    {
        $validated = $request->validate([
            'course_offering_id' => ['required', 'exists:course_offerings,id'],
            'day_of_week' => ['required', 'string', 'max:20'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'venue' => ['required', 'string', 'max:255'],
            'semester' => ['required', 'string', 'max:20'],
            'lecturer_id' => ['nullable', 'exists:faculty_staff,id'],
        ]);

        $timetable->update($validated);

        return back()->with('success', 'Timetable entry updated.');
    }

    public function destroy(Timetable $timetable): RedirectResponse
    {
        $timetable->delete();

        return redirect()->route('admin.academics.timetables.index')->with('success', 'Timetable entry deleted.');
    }
}
