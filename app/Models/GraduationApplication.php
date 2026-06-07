<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['student_id', 'application_date', 'status', 'approved_at'])]
class GraduationApplication extends Model
{
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
