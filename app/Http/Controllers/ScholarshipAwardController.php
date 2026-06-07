<?php

namespace App\Http\Controllers;

use App\Models\FundSource;
use App\Models\ScholarshipAward;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ScholarshipAwardController extends Controller
{
    public function index(Request $request): Response
    {
        $scholarshipAwards = ScholarshipAward::with(['student', 'fundSource'])
            ->when($request->search, fn ($query, $search) => $query->whereHas('student', fn ($q) => $q->where('name', 'like', "%{$search}%")))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/finances/scholarships/index', [
            'scholarshipAwards' => $scholarshipAwards,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/finances/scholarships/create', [
            'students' => Student::orderBy('name')->get(),
            'fundSources' => FundSource::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'fund_source_id' => ['required', 'exists:fund_sources,id'],
            'award_amount' => ['required', 'numeric', 'min:0'],
            'award_date' => ['required', 'date'],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        ScholarshipAward::create($validated);

        return redirect()->route('admin.finances.scholarships.index')->with('success', 'Scholarship award created.');
    }

    public function show(ScholarshipAward $scholarshipAward): Response
    {
        return Inertia::render('admin/finances/scholarships/show', [
            'scholarshipAward' => $scholarshipAward->load(['student', 'fundSource']),
        ]);
    }

    public function edit(ScholarshipAward $scholarshipAward): Response
    {
        return Inertia::render('admin/finances/scholarships/edit', [
            'scholarshipAward' => $scholarshipAward,
            'students' => Student::orderBy('name')->get(),
            'fundSources' => FundSource::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, ScholarshipAward $scholarshipAward): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'fund_source_id' => ['required', 'exists:fund_sources,id'],
            'award_amount' => ['required', 'numeric', 'min:0'],
            'award_date' => ['required', 'date'],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        $scholarshipAward->update($validated);

        return back()->with('success', 'Scholarship award updated.');
    }

    public function destroy(ScholarshipAward $scholarshipAward): RedirectResponse
    {
        $scholarshipAward->delete();

        return redirect()->route('admin.finances.scholarships.index')->with('success', 'Scholarship award deleted.');
    }
}
