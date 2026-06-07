<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['course_offering_id', 'name', 'type', 'max_score', 'weight'])]
class GradebookComponent extends Model
{
    public function courseOffering(): BelongsTo
    {
        return $this->belongsTo(CourseOffering::class);
    }

    public function studentAssessmentGrades(): HasMany
    {
        return $this->hasMany(StudentAssessmentGrade::class);
    }
}
