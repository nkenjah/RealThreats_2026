<?php

namespace App\Http\Controllers;

use App\Models\CourseOffering;
use App\Models\Student;
use App\Models\Waitlist;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WaitlistController extends Controller
{
    public function index(Request $request): Response
    {
        $waitlists = Waitlist::with(['courseOffering.course', 'student'])
            ->when($request->search, fn ($query, $search) => $query->whereHas('student', fn ($q) => $q->where('name', 'like', "%{$search}%")))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/waitlists/index', [
            'waitlists' => $waitlists,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/waitlists/create', [
            'courseOfferings' => CourseOffering::with('course')->orderBy('id')->get(),
            'students' => Student::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'course_offering_id' => ['required', 'exists:course_offerings,id'],
            'student_id' => ['required', 'exists:students,id'],
            'position' => ['required', 'integer', 'min:1'],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        Waitlist::create($validated);

        return redirect()->route('admin.waitlists.index')->with('success', 'Waitlist entry created.');
    }

    public function show(Waitlist $waitlist): Response
    {
        return Inertia::render('admin/waitlists/show', [
            'waitlist' => $waitlist->load(['courseOffering.course', 'student']),
        ]);
    }

    public function edit(Waitlist $waitlist): Response
    {
        return Inertia::render('admin/waitlists/edit', [
            'waitlist' => $waitlist,
            'courseOfferings' => CourseOffering::with('course')->orderBy('id')->get(),
            'students' => Student::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Waitlist $waitlist): RedirectResponse
    {
        $validated = $request->validate([
            'course_offering_id' => ['required', 'exists:course_offerings,id'],
            'student_id' => ['required', 'exists:students,id'],
            'position' => ['required', 'integer', 'min:1'],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        $waitlist->update($validated);

        return back()->with('success', 'Waitlist entry updated.');
    }

    public function destroy(Waitlist $waitlist): RedirectResponse
    {
        $waitlist->delete();

        return redirect()->route('admin.waitlists.index')->with('success', 'Waitlist entry deleted.');
    }
}
