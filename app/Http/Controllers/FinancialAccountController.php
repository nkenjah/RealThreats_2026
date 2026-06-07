<?php

namespace App\Http\Controllers;

use App\Models\FinancialAccount;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FinancialAccountController extends Controller
{
    public function index(Request $request): Response
    {
        $financialAccounts = FinancialAccount::with('student')
            ->when($request->search, fn ($query, $search) => $query->whereHas('student', fn ($q) => $q->where('name', 'like', "%{$search}%"))->orWhere('account_number', 'like', "%{$search}%"))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/finances/accounts/index', [
            'financialAccounts' => $financialAccounts,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/finances/accounts/create', [
            'students' => Student::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id', 'unique:financial_accounts,student_id'],
            'account_number' => ['required', 'string', 'max:50', 'unique:financial_accounts,account_number'],
            'current_balance' => ['required', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        FinancialAccount::create($validated);

        return redirect()->route('admin.finances.accounts.index')->with('success', 'Financial account created.');
    }

    public function show(FinancialAccount $financialAccount): Response
    {
        return Inertia::render('admin/finances/accounts/show', [
            'financialAccount' => $financialAccount->load('student', 'payments'),
        ]);
    }

    public function edit(FinancialAccount $financialAccount): Response
    {
        return Inertia::render('admin/finances/accounts/edit', [
            'financialAccount' => $financialAccount,
            'students' => Student::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, FinancialAccount $financialAccount): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id', 'unique:financial_accounts,student_id,'.$financialAccount->id],
            'account_number' => ['required', 'string', 'max:50', 'unique:financial_accounts,account_number,'.$financialAccount->id],
            'current_balance' => ['required', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        $financialAccount->update($validated);

        return back()->with('success', 'Financial account updated.');
    }

    public function destroy(FinancialAccount $financialAccount): RedirectResponse
    {
        $financialAccount->delete();

        return redirect()->route('admin.finances.accounts.index')->with('success', 'Financial account deleted.');
    }
}
