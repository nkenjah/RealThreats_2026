<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['course_id', 'exam_type', 'starts_at', 'duration_minutes', 'venue', 'is_locked'])]
class Exam extends Model
{
    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'is_locked' => 'boolean',
        ];
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
