<?php

namespace App\Http\Controllers;

use App\Models\Campus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CampusController extends Controller
{
    public function index(Request $request): Response
    {
        $campuses = Campus::query()
            ->when($request->search, fn ($query, $search) => $query->where(fn ($inner) => $inner->where('name', 'like', "%{$search}%")->orWhere('code', 'like', "%{$search}%")))
            ->when($request->is_active !== null && $request->is_active !== '', fn ($query) => $query->where('is_active', request()->boolean('is_active')))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/facilities/campuses/index', [
            'campuses' => $campuses,
            'filters' => $request->only(['search', 'is_active']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/facilities/campuses/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:30', 'unique:campuses,code'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        Campus::create($validated);

        return redirect()->route('admin.facilities.campuses.index')->with('success', 'Campus created.');
    }

    public function show(Campus $campus): Response
    {
        return Inertia::render('admin/facilities/campuses/show', [
            'campus' => $campus->load('buildings'),
        ]);
    }

    public function edit(Campus $campus): Response
    {
        return Inertia::render('admin/facilities/campuses/edit', [
            'campus' => $campus,
        ]);
    }

    public function update(Request $request, Campus $campus): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:30', 'unique:campuses,code,'.$campus->id],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        $campus->update($validated);

        return back()->with('success', 'Campus updated.');
    }

    public function destroy(Campus $campus): RedirectResponse
    {
        $campus->delete();

        return redirect()->route('admin.facilities.campuses.index')->with('success', 'Campus deleted.');
    }
}
