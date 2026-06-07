<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['faculty_staff_id', 'rank', 'effective_date'])]
class AcademicRankHistory extends Model
{
    public function facultyStaff(): BelongsTo
    {
        return $this->belongsTo(FacultyStaff::class);
    }
}
