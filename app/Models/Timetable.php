<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['course_offering_id', 'day_of_week', 'start_time', 'end_time', 'venue', 'semester', 'lecturer_id'])]
class Timetable extends Model
{
    public function courseOffering(): BelongsTo
    {
        return $this->belongsTo(CourseOffering::class);
    }

    public function lecturer(): BelongsTo
    {
        return $this->belongsTo(FacultyStaff::class, 'lecturer_id');
    }
}
