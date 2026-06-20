<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['student_id', 'graduation_application_id', 'department_statuses', 'is_cleared', 'clearance_token'])]
class GraduationClearance extends Model
{
    protected function casts(): array
    {
        return [
            'department_statuses' => 'array',
            'is_cleared' => 'boolean',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function graduationApplication(): BelongsTo
    {
        return $this->belongsTo(GraduationApplication::class);
    }
}
