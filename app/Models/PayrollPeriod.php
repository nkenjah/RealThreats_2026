<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['month', 'year', 'status', 'processed_at', 'processed_by'])]
class PayrollPeriod extends Model
{
    protected function casts(): array
    {
        return [
            'processed_at' => 'datetime',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(PayrollItem::class);
    }

    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function label(): string
    {
        $months = ['', 'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        return ($months[$this->month] ?? $this->month).' '.$this->year;
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }
}
