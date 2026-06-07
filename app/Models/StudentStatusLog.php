<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['student_id', 'previous_status', 'new_status', 'reason', 'changed_by'])]
class StudentStatusLog extends Model
{
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
