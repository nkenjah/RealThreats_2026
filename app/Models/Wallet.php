<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Wallet extends Model
{
    protected $fillable = ['walletable_id', 'walletable_type', 'balance', 'currency', 'status'];

    public function walletable(): MorphTo
    {
        return $this->morphTo();
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(WalletTransaction::class);
    }

    public function credit(float $amount, string $category, ?string $description = null, ?string $referenceType = null, ?int $referenceId = null, ?array $meta = null): WalletTransaction
    {
        $this->increment('balance', $amount);

        return $this->recordTransaction('credit', $amount, $category, $description, $referenceType, $referenceId, $meta);
    }

    public function debit(float $amount, string $category, ?string $description = null, ?string $referenceType = null, ?int $referenceId = null, ?array $meta = null): ?WalletTransaction
    {
        if ($this->balance < $amount) {
            return null;
        }
        $this->decrement('balance', $amount);

        return $this->recordTransaction('debit', $amount, $category, $description, $referenceType, $referenceId, $meta);
    }

    private function recordTransaction(string $type, float $amount, string $category, ?string $description, ?string $referenceType, ?int $referenceId, ?array $meta): WalletTransaction
    {
        $before = $type === 'credit' ? $this->balance - $amount : $this->balance + $amount;

        return $this->transactions()->create([
            'type' => $type,
            'category' => $category,
            'amount' => $amount,
            'balance_before' => $before,
            'balance_after' => $this->balance,
            'description' => $description,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'meta' => $meta,
        ]);
    }
}
