<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['library_borrowing_id', 'amount', 'paid', 'paid_at'])]
class LibraryFine extends Model
{
    protected function casts(): array
    {
        return ['paid' => 'boolean'];
    }

    public function libraryBorrowing(): BelongsTo
    {
        return $this->belongsTo(LibraryBorrowing::class);
    }
}
