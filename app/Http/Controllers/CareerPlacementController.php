<?php

namespace App\Http\Controllers;

use App\Models\AlumniProfile;
use App\Models\CareerPlacement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CareerPlacementController extends Controller
{
    public function index(Request $request): Response
    {
        $careerPlacements = CareerPlacement::with('alumniProfile.student')
            ->when($request->search, fn ($query, $search) => $query->where('company_name', 'like', "%{$search}%"))
            ->when($request->is_current !== null && $request->is_current !== '', fn ($query) => $query->where('is_current', request()->boolean('is_current')))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/alumni/career-placements/index', [
            'careerPlacements' => $careerPlacements,
            'filters' => $request->only(['search', 'is_current']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/alumni/career-placements/create', [
            'alumniProfiles' => AlumniProfile::with('student')->orderBy('id')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'alumni_profile_id' => ['required', 'exists:alumni_profiles,id'],
            'company_name' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
            'is_current' => ['boolean'],
        ]);

        CareerPlacement::create($validated);

        return redirect()->route('admin.alumni.career-placements.index')->with('success', 'Career placement created.');
    }

    public function show(CareerPlacement $careerPlacement): Response
    {
        return Inertia::render('admin/alumni/career-placements/show', [
            'careerPlacement' => $careerPlacement->load('alumniProfile.student'),
        ]);
    }

    public function edit(CareerPlacement $careerPlacement): Response
    {
        return Inertia::render('admin/alumni/career-placements/edit', [
            'careerPlacement' => $careerPlacement,
            'alumniProfiles' => AlumniProfile::with('student')->orderBy('id')->get(),
        ]);
    }

    public function update(Request $request, CareerPlacement $careerPlacement): RedirectResponse
    {
        $validated = $request->validate([
            'alumni_profile_id' => ['required', 'exists:alumni_profiles,id'],
            'company_name' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
            'is_current' => ['boolean'],
        ]);

        $careerPlacement->update($validated);

        return back()->with('success', 'Career placement updated.');
    }

    public function destroy(CareerPlacement $careerPlacement): RedirectResponse
    {
        $careerPlacement->delete();

        return redirect()->route('admin.alumni.career-placements.index')->with('success', 'Career placement deleted.');
    }
}
