<?php

namespace App\Http\Controllers;

use App\Models\Building;
use App\Models\Campus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BuildingController extends Controller
{
    public function index(Request $request): Response
    {
        $buildings = Building::with('campus')
            ->when($request->search, fn ($query, $search) => $query->where(fn ($inner) => $inner->where('name', 'like', "%{$search}%")->orWhere('code', 'like', "%{$search}%")))
            ->when($request->campus_id, fn ($query, $campusId) => $query->where('campus_id', $campusId))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/facilities/buildings/index', [
            'buildings' => $buildings,
            'filters' => $request->only(['search', 'campus_id']),
            'campuses' => Campus::orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/facilities/buildings/create', [
            'campuses' => Campus::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'campus_id' => ['required', 'exists:campuses,id'],
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:30', 'unique:buildings,code'],
            'floors' => ['required', 'integer', 'min:1'],
        ]);

        Building::create($validated);

        return redirect()->route('admin.facilities.buildings.index')->with('success', 'Building created.');
    }

    public function show(Building $building): Response
    {
        return Inertia::render('admin/facilities/buildings/show', [
            'building' => $building->load('campus', 'rooms'),
        ]);
    }

    public function edit(Building $building): Response
    {
        return Inertia::render('admin/facilities/buildings/edit', [
            'building' => $building,
            'campuses' => Campus::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Building $building): RedirectResponse
    {
        $validated = $request->validate([
            'campus_id' => ['required', 'exists:campuses,id'],
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:30', 'unique:buildings,code,'.$building->id],
            'floors' => ['required', 'integer', 'min:1'],
        ]);

        $building->update($validated);

        return back()->with('success', 'Building updated.');
    }

    public function destroy(Building $building): RedirectResponse
    {
        $building->delete();

        return redirect()->route('admin.facilities.buildings.index')->with('success', 'Building deleted.');
    }
}
