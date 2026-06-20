<?php

namespace App\Http\Controllers;

use App\Models\HESLBAllocation;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HESLBAllocationController extends Controller
{
    public function index(Request $request): Response
    {
        $allocations = HESLBAllocation::with('student')
            ->when($request->search, fn ($q, $s) => $q->whereHas('student', fn ($sq) => $sq->where('name', 'like', "%{$s}%")))
            ->when($request->academic_year, fn ($q, $year) => $q->where('academic_year', $year))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/finances/heslb-allocations/index', [
            'allocations' => $allocations,
            'filters' => $request->only(['search', 'academic_year']),
            'stats' => [
                'total_allocated' => HESLBAllocation::sum('total_amount'),
                'total_disbursed' => HESLBAllocation::where('disbursement_status', 'completed')->sum('total_amount'),
                'pending_disbursements' => HESLBAllocation::where('disbursement_status', 'pending')->count(),
                'total_students' => HESLBAllocation::distinct('student_id')->count('student_id'),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/finances/heslb-allocations/create', [
            'students' => Student::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id', 'unique:heslb_allocations,student_id'],
            'heslb_ref_number' => ['required', 'string', 'max:50', 'unique:heslb_allocations,heslb_ref_number'],
            'academic_year' => ['required', 'string', 'max:20'],
            'tuition_amount' => ['required', 'numeric', 'min:0'],
            'meals_amount' => ['required', 'numeric', 'min:0'],
            'accommodation_amount' => ['required', 'numeric', 'min:0'],
            'books_amount' => ['required', 'numeric', 'min:0'],
        ]);

        $validated['total_amount'] = $validated['tuition_amount'] + $validated['meals_amount']
            + $validated['accommodation_amount'] + $validated['books_amount'];

        HESLBAllocation::create($validated);

        return redirect()->route('admin.heslb-allocations.index')->with('success', 'HESLB allocation created.');
    }

    public function show(HESLBAllocation $heslbAllocation): Response
    {
        return Inertia::render('admin/finances/heslb-allocations/show', [
            'allocation' => $heslbAllocation->load('student'),
        ]);
    }

    public function edit(HESLBAllocation $heslbAllocation): Response
    {
        return Inertia::render('admin/finances/heslb-allocations/edit', [
            'allocation' => $heslbAllocation,
            'students' => Student::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, HESLBAllocation $heslbAllocation): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id', 'unique:heslb_allocations,student_id,'.$heslbAllocation->id],
            'heslb_ref_number' => ['required', 'string', 'max:50', 'unique:heslb_allocations,heslb_ref_number,'.$heslbAllocation->id],
            'academic_year' => ['required', 'string', 'max:20'],
            'tuition_amount' => ['required', 'numeric', 'min:0'],
            'meals_amount' => ['required', 'numeric', 'min:0'],
            'accommodation_amount' => ['required', 'numeric', 'min:0'],
            'books_amount' => ['required', 'numeric', 'min:0'],
        ]);

        $validated['total_amount'] = $validated['tuition_amount'] + $validated['meals_amount']
            + $validated['accommodation_amount'] + $validated['books_amount'];

        $heslbAllocation->update($validated);

        return back()->with('success', 'HESLB allocation updated.');
    }

    public function destroy(HESLBAllocation $heslbAllocation): RedirectResponse
    {
        $heslbAllocation->delete();

        return redirect()->route('admin.heslb-allocations.index')->with('success', 'HESLB allocation deleted.');
    }
}
