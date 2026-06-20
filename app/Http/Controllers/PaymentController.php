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
            ->when($request->search, fn ($query, $search) => $query->whereHas('financialAccount.student', fn ($q) => $q->where('name', 'like', "%{$search}%")))
            ->when($request->payment_method, fn ($query, $method) => $query->where('payment_method', $method))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $stats = [
            'total_collected' => Payment::where('status', 'completed')->sum('amount'),
            'pending_payments' => Payment::where('status', 'pending')->count(),
            'pending_amount' => Payment::where('status', 'pending')->sum('amount'),
            'total_transactions' => Payment::count(),
            'by_method' => Payment::selectRaw('payment_method, count(*) as count, sum(amount) as total')
                ->where('status', 'completed')
                ->groupBy('payment_method')
                ->get()
                ->toArray(),
            'monthly_collections' => Payment::selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, sum(amount) as total")
                ->where('status', 'completed')
                ->groupBy('month')
                ->orderBy('month')
                ->limit(12)
                ->get()
                ->toArray(),
        ];

        return Inertia::render('admin/finances/payments/index', [
            'payments' => $payments,
            'filters' => $request->only(['search', 'payment_method', 'status']),
            'stats' => $stats,
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
            'reference_number' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ]);

        $payment = Payment::create($validated);

        broadcast(new FeePaymentReceivedEvent($payment));

        return redirect()->route('admin.payments.index')->with('success', 'Payment created.');
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
            'reference_number' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ]);

        $payment->update($validated);

        return back()->with('success', 'Payment updated.');
    }

    public function destroy(Payment $payment): RedirectResponse
    {
        $payment->delete();

        return redirect()->route('admin.payments.index')->with('success', 'Payment deleted.');
    }
}
