<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['student_id', 'account_number', 'current_balance', 'status'])]
class FinancialAccount extends Model
{
    protected function casts(): array
    {
        return ['current_balance' => 'decimal:2'];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function tuitionInvoices(): HasMany
    {
        return $this->hasMany(TuitionInvoice::class);
    }
}
