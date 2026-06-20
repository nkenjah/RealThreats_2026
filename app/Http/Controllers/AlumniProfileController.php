<?php

namespace App\Http\Controllers;

use App\Models\AlumniProfile;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AlumniProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $alumniProfiles = AlumniProfile::with('student')
            ->when($request->search, fn ($query, $search) => $query->whereHas('student', fn ($q) => $q->where('name', 'like', "%{$search}%")))
            ->when($request->industry, fn ($query, $industry) => $query->where('industry', $industry))
            ->when($request->graduation_year, fn ($query, $year) => $query->where('graduation_year', $year))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $stats = [
            'total_alumni' => AlumniProfile::count(),
            'employed' => AlumniProfile::whereNotNull('current_company')->count(),
            'industries_count' => AlumniProfile::whereNotNull('industry')->distinct('industry')->count('industry'),
            'graduation_years_count' => AlumniProfile::distinct('graduation_year')->count('graduation_year'),
            'by_industry' => AlumniProfile::select('industry', DB::raw('count(*) as count'))
                ->whereNotNull('industry')
                ->groupBy('industry')
                ->orderByDesc('count')
                ->get()
                ->toArray(),
            'by_graduation_year' => AlumniProfile::select('graduation_year as year', DB::raw('count(*) as count'))
                ->groupBy('graduation_year')
                ->orderBy('graduation_year')
                ->get()
                ->toArray(),
        ];

        return Inertia::render('admin/alumni/profiles/index', [
            'alumniProfiles' => $alumniProfiles,
            'filters' => $request->only(['search', 'industry', 'graduation_year']),
            'stats' => $stats,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/alumni/profiles/create', [
            'students' => Student::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id', 'unique:alumni_profiles,student_id'],
            'graduation_year' => ['required', 'integer', 'min:1900', 'max:'.date('Y')],
            'current_company' => ['nullable', 'string', 'max:255'],
            'job_title' => ['nullable', 'string', 'max:255'],
            'industry' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
        ]);

        AlumniProfile::create($validated);

        return redirect()->route('admin.alumni.profiles.index')->with('success', 'Alumni profile created.');
    }

    public function show(AlumniProfile $alumniProfile): Response
    {
        return Inertia::render('admin/alumni/profiles/show', [
            'alumniProfile' => $alumniProfile->load(['student', 'donations', 'careerPlacements']),
        ]);
    }

    public function edit(AlumniProfile $alumniProfile): Response
    {
        return Inertia::render('admin/alumni/profiles/edit', [
            'alumniProfile' => $alumniProfile,
            'students' => Student::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, AlumniProfile $alumniProfile): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id', 'unique:alumni_profiles,student_id,'.$alumniProfile->id],
            'graduation_year' => ['required', 'integer', 'min:1900', 'max:'.date('Y')],
            'current_company' => ['nullable', 'string', 'max:255'],
            'job_title' => ['nullable', 'string', 'max:255'],
            'industry' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
        ]);

        $alumniProfile->update($validated);

        return back()->with('success', 'Alumni profile updated.');
    }

    public function destroy(AlumniProfile $alumniProfile): RedirectResponse
    {
        $alumniProfile->delete();

        return redirect()->route('admin.alumni.profiles.index')->with('success', 'Alumni profile deleted.');
    }
}
