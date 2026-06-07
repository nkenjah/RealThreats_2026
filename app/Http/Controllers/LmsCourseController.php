<?php

namespace App\Http\Controllers;

use App\Models\CourseOffering;
use App\Models\LmsCourse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LmsCourseController extends Controller
{
    public function index(Request $request): Response
    {
        $lmsCourses = LmsCourse::with('courseOffering.course')
            ->when($request->search, fn ($query, $search) => $query->where('title', 'like', "%{$search}%"))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/lms/courses/index', [
            'lmsCourses' => $lmsCourses,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/lms/courses/create', [
            'courseOfferings' => CourseOffering::with('course')->orderBy('id')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'course_offering_id' => ['required', 'exists:course_offerings,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        LmsCourse::create($validated);

        return redirect()->route('admin.lms.courses.index')->with('success', 'LMS course created.');
    }

    public function show(LmsCourse $lmsCourse): Response
    {
        return Inertia::render('admin/lms/courses/show', [
            'lmsCourse' => $lmsCourse->load(['courseOffering.course', 'courseModules', 'digitalSubmissions']),
        ]);
    }

    public function edit(LmsCourse $lmsCourse): Response
    {
        return Inertia::render('admin/lms/courses/edit', [
            'lmsCourse' => $lmsCourse,
            'courseOfferings' => CourseOffering::with('course')->orderBy('id')->get(),
        ]);
    }

    public function update(Request $request, LmsCourse $lmsCourse): RedirectResponse
    {
        $validated = $request->validate([
            'course_offering_id' => ['required', 'exists:course_offerings,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        $lmsCourse->update($validated);

        return back()->with('success', 'LMS course updated.');
    }

    public function destroy(LmsCourse $lmsCourse): RedirectResponse
    {
        $lmsCourse->delete();

        return redirect()->route('admin.lms.courses.index')->with('success', 'LMS course deleted.');
    }
}
