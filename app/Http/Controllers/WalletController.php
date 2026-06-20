<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Wallet;
use App\Services\WalletService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WalletController extends Controller
{
    public function __construct(private readonly WalletService $service) {}

    public function index(Request $request): Response
    {
        $wallets = Wallet::with('walletable')
            ->when($request->search, function ($q, $s) {
                $q->whereHasMorph('walletable', [Student::class], function ($q) use ($s) {
                    $q->where('name', 'like', "%{$s}%")
                        ->orWhere('registration_number', 'like', "%{$s}%");
                });
            })
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/finances/wallets/index', [
            'wallets' => $wallets,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(Wallet $wallet): Response
    {
        $wallet->load('walletable', 'transactions');

        return Inertia::render('admin/finances/wallets/show', [
            'wallet' => $wallet,
            'transactions' => $wallet->transactions()->latest()->paginate(20),
        ]);
    }

    public function topUp(Request $request, Wallet $wallet): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:100'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $this->service->deposit($wallet, $validated['amount'], 'deposit', $validated['description'] ?? null);

        return redirect()->route('admin.finances.wallets.show', $wallet)
            ->with('success', 'Wallet topped up successfully.');
    }
}
