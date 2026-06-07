<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\ApplicationRequirement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationRequirementController extends Controller
{
    public function index(Request $request): Response
    {
        $applicationRequirements = ApplicationRequirement::with('application')
            ->when($request->search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/admissions/requirements/index', [
            'applicationRequirements' => $applicationRequirements,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/admissions/requirements/create', [
            'applications' => Application::orderBy('id')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'application_id' => ['required', 'exists:applications,id'],
            'name' => ['required', 'string', 'max:255'],
            'is_met' => ['boolean'],
            'notes' => ['nullable', 'string'],
        ]);

        ApplicationRequirement::create($validated);

        return redirect()->route('admin.admissions.requirements.index')->with('success', 'Application requirement created.');
    }

    public function show(ApplicationRequirement $applicationRequirement): Response
    {
        return Inertia::render('admin/admissions/requirements/show', [
            'applicationRequirement' => $applicationRequirement->load('application'),
        ]);
    }

    public function edit(ApplicationRequirement $applicationRequirement): Response
    {
        return Inertia::render('admin/admissions/requirements/edit', [
            'applicationRequirement' => $applicationRequirement,
            'applications' => Application::orderBy('id')->get(),
        ]);
    }

    public function update(Request $request, ApplicationRequirement $applicationRequirement): RedirectResponse
    {
        $validated = $request->validate([
            'application_id' => ['required', 'exists:applications,id'],
            'name' => ['required', 'string', 'max:255'],
            'is_met' => ['boolean'],
            'notes' => ['nullable', 'string'],
        ]);

        $applicationRequirement->update($validated);

        return back()->with('success', 'Application requirement updated.');
    }

    public function destroy(ApplicationRequirement $applicationRequirement): RedirectResponse
    {
        $applicationRequirement->delete();

        return redirect()->route('admin.admissions.requirements.index')->with('success', 'Application requirement deleted.');
    }
}
