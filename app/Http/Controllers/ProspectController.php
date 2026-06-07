<?php

namespace App\Http\Controllers;

use App\Models\Prospect;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProspectController extends Controller
{
    public function index(Request $request): Response
    {
        $prospects = Prospect::query()
            ->when($request->search, fn ($query, $search) => $query->where(fn ($inner) => $inner->where('first_name', 'like', "%{$search}%")->orWhere('last_name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%")))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/admissions/prospects/index', [
            'prospects' => $prospects,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/admissions/prospects/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:prospects,email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'high_school' => ['nullable', 'string', 'max:255'],
            'gpa' => ['nullable', 'numeric', 'min:0', 'max:4'],
            'entry_term' => ['nullable', 'string', 'max:50'],
            'status' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ]);

        Prospect::create($validated);

        return redirect()->route('admin.admissions.prospects.index')->with('success', 'Prospect created.');
    }

    public function show(Prospect $prospect): Response
    {
        return Inertia::render('admin/admissions/prospects/show', [
            'prospect' => $prospect->load('applications'),
        ]);
    }

    public function edit(Prospect $prospect): Response
    {
        return Inertia::render('admin/admissions/prospects/edit', [
            'prospect' => $prospect,
        ]);
    }

    public function update(Request $request, Prospect $prospect): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:prospects,email,'.$prospect->id],
            'phone' => ['nullable', 'string', 'max:20'],
            'high_school' => ['nullable', 'string', 'max:255'],
            'gpa' => ['nullable', 'numeric', 'min:0', 'max:4'],
            'entry_term' => ['nullable', 'string', 'max:50'],
            'status' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ]);

        $prospect->update($validated);

        return back()->with('success', 'Prospect updated.');
    }

    public function destroy(Prospect $prospect): RedirectResponse
    {
        $prospect->delete();

        return redirect()->route('admin.admissions.prospects.index')->with('success', 'Prospect deleted.');
    }
}
