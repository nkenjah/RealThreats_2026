<?php

namespace App\Http\Controllers;

use App\Models\Fee;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeeController extends Controller
{
    public function index(Request $request): Response
    {
        $fees = Fee::with('student')
            ->when($request->search, fn ($query, $search) => $query->whereHas('student', fn ($q) => $q->where('name', 'like', "%{$search}%")))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->when($request->fee_type, fn ($query, $type) => $query->where('fee_type', $type))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/fees/index', [
            'fees' => $fees,
            'filters' => $request->only(['search', 'status', 'fee_type']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/fees/create', [
            'students' => Student::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'fee_type' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'due_date' => ['required', 'date'],
            'status' => ['nullable', 'string', 'max:50'],
            'paid_at' => ['nullable', 'date'],
        ]);

        Fee::create($validated);

        return redirect()->route('admin.fees.index')->with('success', 'Fee created.');
    }

    public function show(Fee $fee): Response
    {
        return Inertia::render('admin/fees/show', [
            'fee' => $fee->load('student'),
        ]);
    }

    public function edit(Fee $fee): Response
    {
        return Inertia::render('admin/fees/edit', [
            'fee' => $fee,
            'students' => Student::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Fee $fee): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'fee_type' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'due_date' => ['required', 'date'],
            'status' => ['nullable', 'string', 'max:50'],
            'paid_at' => ['nullable', 'date'],
        ]);

        $fee->update($validated);

        return back()->with('success', 'Fee updated.');
    }

    public function destroy(Fee $fee): RedirectResponse
    {
        $fee->delete();

        return redirect()->route('admin.fees.index')->with('success', 'Fee deleted.');
    }
}
