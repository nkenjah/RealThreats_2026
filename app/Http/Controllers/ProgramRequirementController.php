<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\ProgramRequirement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProgramRequirementController extends Controller
{
    public function index(Request $request): Response
    {
        $programRequirements = ProgramRequirement::with('program')
            ->when($request->search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->when($request->program_id, fn ($query, $programId) => $query->where('program_id', $programId))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/academic-records/program-requirements/index', [
            'programRequirements' => $programRequirements,
            'filters' => $request->only(['search', 'program_id']),
            'programs' => Program::orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/academic-records/program-requirements/create', [
            'programs' => Program::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'program_id' => ['required', 'exists:programs,id'],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:50'],
            'credits_required' => ['required', 'integer', 'min:0'],
        ]);

        ProgramRequirement::create($validated);

        return redirect()->route('admin.academic-records.program-requirements.index')->with('success', 'Program requirement created.');
    }

    public function show(ProgramRequirement $programRequirement): Response
    {
        return Inertia::render('admin/academic-records/program-requirements/show', [
            'programRequirement' => $programRequirement->load('program'),
        ]);
    }

    public function edit(ProgramRequirement $programRequirement): Response
    {
        return Inertia::render('admin/academic-records/program-requirements/edit', [
            'programRequirement' => $programRequirement,
            'programs' => Program::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, ProgramRequirement $programRequirement): RedirectResponse
    {
        $validated = $request->validate([
            'program_id' => ['required', 'exists:programs,id'],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:50'],
            'credits_required' => ['required', 'integer', 'min:0'],
        ]);

        $programRequirement->update($validated);

        return back()->with('success', 'Program requirement updated.');
    }

    public function destroy(ProgramRequirement $programRequirement): RedirectResponse
    {
        $programRequirement->delete();

        return redirect()->route('admin.academic-records.program-requirements.index')->with('success', 'Program requirement deleted.');
    }
}
