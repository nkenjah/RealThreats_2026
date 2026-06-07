<?php

namespace App\Http\Controllers;

use App\Models\FinancialAccount;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $payments = Payment::with('financialAccount.student')
            ->when($request->search, fn ($query, $search) => $query->where('reference_number', 'like', "%{$search}%"))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->when($request->payment_method, fn ($query, $method) => $query->where('payment_method', $method))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/finances/payments/index', [
            'payments' => $payments,
            'filters' => $request->only(['search', 'status', 'payment_method']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/finances/payments/create', [
            'financialAccounts' => FinancialAccount::with('student')->orderBy('id')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'financial_account_id' => ['required', 'exists:financial_accounts,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'payment_method' => ['required', 'string', 'max:50'],
            'payment_date' => ['required', 'date'],
            'reference_number' => ['nullable', 'string', 'max:100', 'unique:payments,reference_number'],
            'status' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ]);

        Payment::create($validated);

        return redirect()->route('admin.finances.payments.index')->with('success', 'Payment created.');
    }

    public function show(Payment $payment): Response
    {
        return Inertia::render('admin/finances/payments/show', [
            'payment' => $payment->load('financialAccount.student'),
        ]);
    }

    public function edit(Payment $payment): Response
    {
        return Inertia::render('admin/finances/payments/edit', [
            'payment' => $payment,
            'financialAccounts' => FinancialAccount::with('student')->orderBy('id')->get(),
        ]);
    }

    public function update(Request $request, Payment $payment): RedirectResponse
    {
        $validated = $request->validate([
            'financial_account_id' => ['required', 'exists:financial_accounts,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'payment_method' => ['required', 'string', 'max:50'],
            'payment_date' => ['required', 'date'],
            'reference_number' => ['nullable', 'string', 'max:100', 'unique:payments,reference_number,'.$payment->id],
            'status' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ]);

        $payment->update($validated);

        return back()->with('success', 'Payment updated.');
    }

    public function destroy(Payment $payment): RedirectResponse
    {
        $payment->delete();

        return redirect()->route('admin.finances.payments.index')->with('success', 'Payment deleted.');
    }
}
