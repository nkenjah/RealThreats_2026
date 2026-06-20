<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['faculty_staff_id', 'year', 'annual_entitled', 'annual_taken', 'sick_entitled', 'sick_taken', 'study_entitled', 'study_taken', 'compassionate_taken'])]
class LeaveBalance extends Model
{
    public function facultyStaff(): BelongsTo
    {
        return $this->belongsTo(FacultyStaff::class);
    }

    public function annualRemaining(): int
    {
        return $this->annual_entitled - $this->annual_taken;
    }

    public function sickRemaining(): int
    {
        return $this->sick_entitled - $this->sick_taken;
    }
}
