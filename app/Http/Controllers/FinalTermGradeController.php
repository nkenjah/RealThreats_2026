<?php

namespace App\Http\Controllers;

use App\Models\CourseOffering;
use App\Models\Enrollment;
use App\Models\FinalTermGrade;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FinalTermGradeController extends Controller
{
    public function index(Request $request): Response
    {
        $finalTermGrades = FinalTermGrade::with(['enrollment.student', 'courseOffering.course'])
            ->when($request->search, fn ($query, $search) => $query->whereHas('enrollment.student', fn ($q) => $q->where('name', 'like', "%{$search}%")))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/grades/final-term/index', [
            'finalTermGrades' => $finalTermGrades,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/grades/final-term/create', [
            'enrollments' => Enrollment::with('student')->orderBy('id')->get(),
            'courseOfferings' => CourseOffering::with('course')->orderBy('id')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'enrollment_id' => ['required', 'exists:enrollments,id', 'unique:final_term_grades,enrollment_id'],
            'course_offering_id' => ['required', 'exists:course_offerings,id'],
            'total_score' => ['required', 'numeric', 'min:0'],
            'letter_grade' => ['required', 'string', 'max:5'],
            'gpa_points' => ['nullable', 'numeric', 'min:0'],
        ]);

        FinalTermGrade::create($validated);

        return redirect()->route('admin.grades.final-term.index')->with('success', 'Final term grade created.');
    }

    public function show(FinalTermGrade $finalTermGrade): Response
    {
        return Inertia::render('admin/grades/final-term/show', [
            'finalTermGrade' => $finalTermGrade->load(['enrollment.student', 'courseOffering.course']),
        ]);
    }

    public function edit(FinalTermGrade $finalTermGrade): Response
    {
        return Inertia::render('admin/grades/final-term/edit', [
            'finalTermGrade' => $finalTermGrade,
            'enrollments' => Enrollment::with('student')->orderBy('id')->get(),
            'courseOfferings' => CourseOffering::with('course')->orderBy('id')->get(),
        ]);
    }

    public function update(Request $request, FinalTermGrade $finalTermGrade): RedirectResponse
    {
        $validated = $request->validate([
            'enrollment_id' => ['required', 'exists:enrollments,id', 'unique:final_term_grades,enrollment_id,'.$finalTermGrade->id],
            'course_offering_id' => ['required', 'exists:course_offerings,id'],
            'total_score' => ['required', 'numeric', 'min:0'],
            'letter_grade' => ['required', 'string', 'max:5'],
            'gpa_points' => ['nullable', 'numeric', 'min:0'],
        ]);

        $finalTermGrade->update($validated);

        return back()->with('success', 'Final term grade updated.');
    }

    public function destroy(FinalTermGrade $finalTermGrade): RedirectResponse
    {
        $finalTermGrade->delete();

        return redirect()->route('admin.grades.final-term.index')->with('success', 'Final term grade deleted.');
    }
}
