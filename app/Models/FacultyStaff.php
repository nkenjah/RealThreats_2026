<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id', 'staff_number', 'job_title', 'department_id', 'contract_type', 'employment_date'])]
class FacultyStaff extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function academicRankHistories(): HasMany
    {
        return $this->hasMany(AcademicRankHistory::class);
    }

    public function facultyDepartmentAssignments(): HasMany
    {
        return $this->hasMany(FacultyDepartmentAssignment::class);
    }

    public function timetables(): HasMany
    {
        return $this->hasMany(Timetable::class, 'lecturer_id');
    }
}
