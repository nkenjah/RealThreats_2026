<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['lms_course_id', 'student_id', 'file_url', 'submitted_at', 'grade', 'feedback'])]
class DigitalSubmission extends Model
{
    public function lmsCourse(): BelongsTo
    {
        return $this->belongsTo(LmsCourse::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
