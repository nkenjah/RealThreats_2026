<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['course_offering_id', 'title', 'description', 'status'])]
class LmsCourse extends Model
{
    public function courseOffering(): BelongsTo
    {
        return $this->belongsTo(CourseOffering::class);
    }

    public function courseModules(): HasMany
    {
        return $this->hasMany(CourseModule::class);
    }

    public function digitalSubmissions(): HasMany
    {
        return $this->hasMany(DigitalSubmission::class);
    }

    public function studentAssessmentGrades(): HasMany
    {
        return $this->hasMany(StudentAssessmentGrade::class);
    }
}
