<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProgramController extends Controller
{
    public function index(Request $request): Response
    {
        $programs = Program::query()
            ->when($request->search, fn ($query, $search) => $query->where(fn ($inner) => $inner->where('name', 'like', "%{$search}%")->orWhere('code', 'like', "%{$search}%")))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/academics/programs/index', [
            'programs' => $programs,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/academics/programs/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:30', 'unique:programs,code'],
            'description' => ['nullable', 'string'],
            'duration_years' => ['required', 'integer', 'min:1', 'max:10'],
            'total_credits' => ['required', 'integer', 'min:1'],
        ]);

        Program::create($validated);

        return redirect()->route('admin.academics.programs.index')->with('success', 'Program created.');
    }

    public function show(Program $program): Response
    {
        return Inertia::render('admin/academics/programs/show', [
            'program' => $program->load('programRequirements'),
        ]);
    }

    public function edit(Program $program): Response
    {
        return Inertia::render('admin/academics/programs/edit', [
            'program' => $program,
        ]);
    }

    public function update(Request $request, Program $program): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:30', 'unique:programs,code,'.$program->id],
            'description' => ['nullable', 'string'],
            'duration_years' => ['required', 'integer', 'min:1', 'max:10'],
            'total_credits' => ['required', 'integer', 'min:1'],
        ]);

        $program->update($validated);

        return back()->with('success', 'Program updated.');
    }

    public function destroy(Program $program): RedirectResponse
    {
        $program->delete();

        return redirect()->route('admin.academics.programs.index')->with('success', 'Program deleted.');
    }
}
