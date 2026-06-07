<?php

namespace App\Http\Controllers;

use App\Models\DegreeAudit;
use App\Models\Program;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DegreeAuditController extends Controller
{
    public function index(Request $request): Response
    {
        $degreeAudits = DegreeAudit::with(['student', 'program'])
            ->when($request->search, fn ($query, $search) => $query->whereHas('student', fn ($q) => $q->where('name', 'like', "%{$search}%")))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/academic-records/degree-audits/index', [
            'degreeAudits' => $degreeAudits,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(DegreeAudit $degreeAudit): Response
    {
        return Inertia::render('admin/academic-records/degree-audits/show', [
            'degreeAudit' => $degreeAudit->load(['student', 'program']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/academic-records/degree-audits/create', [
            'students' => Student::orderBy('name')->get(),
            'programs' => Program::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'program_id' => ['required', 'exists:programs,id'],
            'total_credits_required' => ['required', 'integer', 'min:1'],
            'total_credits_earned' => ['required', 'integer', 'min:0'],
            'status' => ['required', 'string', 'max:50'],
            'generated_at' => ['required', 'date'],
        ]);

        DegreeAudit::create($validated);

        return redirect()->route('admin.academic-records.degree-audits.index')->with('success', 'Degree audit created.');
    }

    public function edit(DegreeAudit $degreeAudit): Response
    {
        return Inertia::render('admin/academic-records/degree-audits/edit', [
            'degreeAudit' => $degreeAudit,
            'students' => Student::orderBy('name')->get(),
            'programs' => Program::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, DegreeAudit $degreeAudit): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'program_id' => ['required', 'exists:programs,id'],
            'total_credits_required' => ['required', 'integer', 'min:1'],
            'total_credits_earned' => ['required', 'integer', 'min:0'],
            'status' => ['required', 'string', 'max:50'],
            'generated_at' => ['required', 'date'],
        ]);

        $degreeAudit->update($validated);

        return back()->with('success', 'Degree audit updated.');
    }

    public function destroy(DegreeAudit $degreeAudit): RedirectResponse
    {
        $degreeAudit->delete();

        return redirect()->route('admin.academic-records.degree-audits.index')->with('success', 'Degree audit deleted.');
    }
}
