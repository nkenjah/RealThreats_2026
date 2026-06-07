<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Program;
use App\Models\Prospect;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    public function index(Request $request): Response
    {
        $applications = Application::with(['prospect', 'program', 'assignedReviewer'])
            ->when($request->search, fn ($query, $search) => $query->whereHas('prospect', fn ($q) => $q->where('first_name', 'like', "%{$search}%")->orWhere('last_name', 'like', "%{$search}%")))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->when($request->program_id, fn ($query, $programId) => $query->where('program_id', $programId))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/admissions/applications/index', [
            'applications' => $applications,
            'filters' => $request->only(['search', 'status', 'program_id']),
            'programs' => Program::orderBy('name')->get(),
            'reviewers' => User::orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/admissions/applications/create', [
            'programs' => Program::orderBy('name')->get(),
            'prospects' => Prospect::orderBy('last_name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'prospect_id' => ['required', 'exists:prospects,id'],
            'program_id' => ['required', 'exists:programs,id'],
            'submission_date' => ['required', 'date'],
            'status' => ['nullable', 'string', 'max:50'],
            'assigned_reviewer_id' => ['nullable', 'exists:users,id'],
            'reviewed_at' => ['nullable', 'date'],
            'review_notes' => ['nullable', 'string'],
        ]);

        Application::create($validated);

        return redirect()->route('admin.admissions.applications.index')->with('success', 'Application created.');
    }

    public function show(Application $application): Response
    {
        return Inertia::render('admin/admissions/applications/show', [
            'application' => $application->load(['prospect', 'program', 'applicationRequirements']),
        ]);
    }

    public function edit(Application $application): Response
    {
        return Inertia::render('admin/admissions/applications/edit', [
            'application' => $application->load(['prospect', 'program']),
            'programs' => Program::orderBy('name')->get(),
            'prospects' => Prospect::orderBy('last_name')->get(),
        ]);
    }

    public function update(Request $request, Application $application): RedirectResponse
    {
        $validated = $request->validate([
            'prospect_id' => ['required', 'exists:prospects,id'],
            'program_id' => ['required', 'exists:programs,id'],
            'submission_date' => ['required', 'date'],
            'status' => ['nullable', 'string', 'max:50'],
            'assigned_reviewer_id' => ['nullable', 'exists:users,id'],
            'reviewed_at' => ['nullable', 'date'],
            'review_notes' => ['nullable', 'string'],
        ]);

        $application->update($validated);

        return back()->with('success', 'Application updated.');
    }

    public function destroy(Application $application): RedirectResponse
    {
        $application->delete();

        return redirect()->route('admin.admissions.applications.index')->with('success', 'Application deleted.');
    }
}
