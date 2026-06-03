<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lecture;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LectureController extends Controller
{
    public function index(Request $request): Response
    {
        $lectures = Lecture::with(['course.department', 'lecturer'])
            ->when($request->search, fn ($query, $search) => $query->where(fn ($inner) => $inner->where('topic', 'like', "%{$search}%")->orWhere('venue', 'like', "%{$search}%")))
            ->when($request->course_id, fn ($query, $courseId) => $query->where('course_id', $courseId))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/lectures/index', [
            'lectures' => $lectures,
            'filters' => $request->only(['search', 'course_id']),
            'courses' => Course::orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/lectures/create', [
            'courses' => Course::orderBy('name')->get(),
            'lecturers' => User::whereHas('roles', fn ($q) => $q->where('name', 'staff'))->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
            'lecturer_id' => ['nullable', 'exists:users,id'],
            'topic' => ['required', 'string', 'max:255'],
            'scheduled_at' => ['required', 'date'],
            'venue' => ['required', 'string', 'max:100'],
        ]);

        Lecture::create($validated);

        return redirect()->route('admin.lectures.index')->with('success', 'Lecture created.');
    }

    public function show(Lecture $lecture): Response
    {
        return Inertia::render('admin/lectures/show', [
            'lecture' => $lecture->load(['course.department', 'lecturer']),
        ]);
    }

    public function edit(Lecture $lecture): Response
    {
        return Inertia::render('admin/lectures/edit', [
            'lecture' => $lecture,
            'courses' => Course::orderBy('name')->get(),
            'lecturers' => User::whereHas('roles', fn ($q) => $q->where('name', 'staff'))->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Lecture $lecture): RedirectResponse
    {
        $validated = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
            'lecturer_id' => ['nullable', 'exists:users,id'],
            'topic' => ['required', 'string', 'max:255'],
            'scheduled_at' => ['required', 'date'],
            'venue' => ['required', 'string', 'max:100'],
        ]);

        $lecture->update($validated);

        return back()->with('success', 'Lecture updated.');
    }

    public function destroy(Lecture $lecture): RedirectResponse
    {
        $lecture->delete();

        return redirect()->route('admin.lectures.index')->with('success', 'Lecture deleted.');
    }
}
