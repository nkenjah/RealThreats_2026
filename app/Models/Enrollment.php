<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['student_id', 'course_offering_id', 'enrollment_date', 'status', 'grade'])]
class Enrollment extends Model
{
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function courseOffering(): BelongsTo
    {
        return $this->belongsTo(CourseOffering::class);
    }

    public function finalTermGrade(): HasOne
    {
        return $this->hasOne(FinalTermGrade::class);
    }
}
