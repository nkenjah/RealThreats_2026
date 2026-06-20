<?php

namespace App\Services;

use App\Models\ScratchCard;
use App\Models\Student;
use App\Models\Wallet;
use App\Models\WalletTransaction;

class WalletService
{
    public function getOrCreateWallet(Student $student): Wallet
    {
        return $student->wallet()->firstOrCreate([
            'walletable_id' => $student->id,
            'walletable_type' => Student::class,
            'currency' => 'TZS',
        ]);
    }

    public function deposit(Wallet $wallet, float $amount, string $category = 'deposit', ?string $description = null): WalletTransaction
    {
        return $wallet->credit($amount, $category, $description);
    }

    public function redeemScratchCard(Wallet $wallet, string $pin): ?WalletTransaction
    {
        $card = ScratchCard::where('pin', $pin)->active()->first();
        if (! $card) {
            return null;
        }

        $card->update([
            'status' => 'used',
            'used_by' => auth()->id(),
            'used_at' => now(),
        ]);

        return $wallet->credit($card->value, 'scratch_card', "Scratch card {$card->serial_number}", 'scratch_card', $card->id);
    }

    public function pay(Wallet $wallet, float $amount, string $referenceType, int $referenceId, ?string $description = null): ?WalletTransaction
    {
        return $wallet->debit($amount, 'payment', $description, $referenceType, $referenceId);
    }

    public function getBalance(Wallet $wallet): float
    {
        return $wallet->balance;
    }

    public function getTransactions(Wallet $wallet, int $perPage = 15)
    {
        return $wallet->transactions()->latest()->paginate($perPage);
    }
}
