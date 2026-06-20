<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['student_id', 'heslb_ref_number', 'academic_year', 'tuition_amount', 'meals_amount', 'accommodation_amount', 'books_amount', 'total_amount', 'disbursement_status', 'last_disbursement_at'])]
class HESLBAllocation extends Model
{
    protected $table = 'heslb_allocations';

    protected function casts(): array
    {
        return [
            'tuition_amount' => 'decimal:2',
            'meals_amount' => 'decimal:2',
            'accommodation_amount' => 'decimal:2',
            'books_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'last_disbursement_at' => 'datetime',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
