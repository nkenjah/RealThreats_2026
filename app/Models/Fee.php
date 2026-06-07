<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['student_id', 'fee_type', 'amount', 'due_date', 'status', 'paid_at'])]
class Fee extends Model
{
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
