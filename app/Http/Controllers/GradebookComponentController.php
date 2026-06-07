<?php

namespace App\Http\Controllers;

use App\Models\CourseOffering;
use App\Models\GradebookComponent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GradebookComponentController extends Controller
{
    public function index(Request $request): Response
    {
        $gradebookComponents = GradebookComponent::with('courseOffering.course')
            ->when($request->search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/grades/components/index', [
            'gradebookComponents' => $gradebookComponents,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/grades/components/create', [
            'courseOfferings' => CourseOffering::with('course')->orderBy('id')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'course_offering_id' => ['required', 'exists:course_offerings,id'],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:50'],
            'max_score' => ['required', 'numeric', 'min:0'],
            'weight' => ['required', 'numeric', 'min:0', 'max:100'],
        ]);

        GradebookComponent::create($validated);

        return redirect()->route('admin.grades.components.index')->with('success', 'Gradebook component created.');
    }

    public function show(GradebookComponent $gradebookComponent): Response
    {
        return Inertia::render('admin/grades/components/show', [
            'gradebookComponent' => $gradebookComponent->load('courseOffering.course'),
        ]);
    }

    public function edit(GradebookComponent $gradebookComponent): Response
    {
        return Inertia::render('admin/grades/components/edit', [
            'gradebookComponent' => $gradebookComponent,
            'courseOfferings' => CourseOffering::with('course')->orderBy('id')->get(),
        ]);
    }

    public function update(Request $request, GradebookComponent $gradebookComponent): RedirectResponse
    {
        $validated = $request->validate([
            'course_offering_id' => ['required', 'exists:course_offerings,id'],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:50'],
            'max_score' => ['required', 'numeric', 'min:0'],
            'weight' => ['required', 'numeric', 'min:0', 'max:100'],
        ]);

        $gradebookComponent->update($validated);

        return back()->with('success', 'Gradebook component updated.');
    }

    public function destroy(GradebookComponent $gradebookComponent): RedirectResponse
    {
        $gradebookComponent->delete();

        return redirect()->route('admin.grades.components.index')->with('success', 'Gradebook component deleted.');
    }
}
