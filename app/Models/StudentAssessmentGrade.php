<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['student_id', 'lms_course_id', 'gradebook_component_id', 'score'])]
class StudentAssessmentGrade extends Model
{
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function lmsCourse(): BelongsTo
    {
        return $this->belongsTo(LmsCourse::class);
    }

    public function gradebookComponent(): BelongsTo
    {
        return $this->belongsTo(GradebookComponent::class);
    }
}
