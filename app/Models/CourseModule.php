<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['lms_course_id', 'title', 'description', 'order_index'])]
class CourseModule extends Model
{
    public function lmsCourse(): BelongsTo
    {
        return $this->belongsTo(LmsCourse::class);
    }
}
